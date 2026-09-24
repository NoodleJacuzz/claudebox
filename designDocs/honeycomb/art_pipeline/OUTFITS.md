# Honeycomb alternate outfits — A–F (2026-09-15)

**Brainstorm, not data.** All nineteen alternate outfits, six designs each (A–F, **114 total**). Replaces
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
or booru). All 114 compile with no errors; the only culls are the engine's usual defaults (an A-set `!tag`
haircut swap, `no breasts`, `remove eyes`) and its own invented tags read as unknown, exactly as before.


---

## Brienne — `knight` (Warrior)

Default core: white bodysuit, red capelet, knight visor / visor up, single pauldron and pantsleg, buckler.

### `almoner`

**A** — *Tithe — the almsgiving knight; hair changed to a braided bun*

```
almoner; white robe, gold-trim robe, wide sleeves, gold sash, chainmail, leather pouch, holding book, gold circlet, sandals, !ponytail, braided bun
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn robe`

**B** — *recoloured blue and silver; the book gives way to a key ring and a lantern*

```
almoner; blue robe, silver-trim robe, wide sleeves, silver sash, chainmail, leather pouch, key, holding lantern, silver circlet, sandals
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn robe`

**C** — *the collector (original) — an iron mask and a ledger chained to the wrist*

```
almoner; black robe, black mask, chain, holding book, leather pouch, hood up, black gloves, barefoot
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn robe`

**D** — *lewd A — the white alms robe hanging open*

```
almoner; white robe, open robe, gold sash, chainmail, leather pouch, gold circlet, pasties, !ponytail, braided bun
```
- female only: underboob, navel
- male only: bulge
- TornDamage: `torn robe`

**E** — *lewd B — a slit up the blue robe beside the lantern*

```
almoner; blue robe, side slit, silver sash, key, holding lantern, thigh strap, sandals
```
- female only: sideboob
- male only: bulge
- TornDamage: `torn robe`

**F** — *lewd C — the collector's tally kept on the debtor's skin*

```
almoner; black robe, body writing, black mask, chain, hood up, pasties, barefoot
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn robe`

### `bastion`

**A** — *Portcullis — the wall that walks; hair changed to a bob cut*

```
bastion; steel armor, full armor, helmet, visor down, tower shield, armored skirt, gauntlets, greaves, blue tabard, !ponytail, !forelocks, bob cut
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn tabard`

**B** — *recoloured bronze and green; the tower shield gives way to a pavise and a mace*

```
bastion; bronze armor, full armor, helmet, visor down, large shield, mace, gauntlets, armored skirt, greaves, green tabard
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn tabard`

**C** — *the gate (original) — brick, iron and moss; she is the door*

```
bastion; stone armor, brick, huge shield, helmet, visor down, chain, mechanical legs, moss, armored skirt
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn armor`

**D** — *lewd A — the steel wall with its sides gone*

```
bastion; steel armor, sideless outfit, tower shield, gauntlets, armored skirt, greaves, !ponytail, !forelocks, bob cut
```
- female only: sideboob, nipples
- male only: bulge
- TornDamage: `torn armor`

**E** — *lewd B — a vent opens in the bronze tassets*

```
bastion; bronze armor, hip vent, large shield, mace, green tabard, armored skirt, greaves
```
- female only: sideboob
- male only: bulge
- TornDamage: `torn tabard`

**F** — *lewd C — the gate seeping, its stone gone soft*

```
bastion; stone armor, slime, huge shield, mechanical legs, moss, pasties, wet
```
- female only: nipples, navel
- male only: covered penis
- TornDamage: `torn armor`

### `siegeplate`

**A** — *Ramhead — armour built to hit with; hair changed to a side shave*

```
siegeplate; maroon armor, spiked pauldron, single pauldron, spiked gauntlet, single gauntlet, black bodysuit, strapless bodysuit, single pantsleg, bandolier, greatsword on back, armored boots, knight visor, visor up, !ponytail, side shave
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn bodysuit, torn bandolier`

**B** — *recoloured black and gold; the greatsword gives way to a warhammer*

```
siegeplate; black armor, gold-trim armor, spiked pauldron, single pauldron, gold gauntlet, single gauntlet, white bodysuit, strapless bodysuit, single pantsleg, bandolier, warhammer, gold boots, knight visor, visor up
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn bodysuit, torn bandolier`

**C** — *the siege engine (original) — she wears the ram, helmetless and scarred*

```
siegeplate; steel armor, mechanical arms, huge gauntlet, steel breastplate, tattered cape, greaves, chain belt, scar, bare shoulders
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn cape`

**D** — *lewd A — the crimson plate over nothing but a sheer suit*

```
siegeplate; maroon armor, black bodysuit, see-through clothes, spiked pauldron, single pauldron, bandolier, greatsword on back, armored boots, !ponytail, side shave
```
- female only: underboob, nipples
- male only: penis outline
- TornDamage: `torn bodysuit`

**E** — *lewd B — the black-and-gold pauldron straps give*

```
siegeplate; black armor, gold-trim armor, white bodysuit, strap slip, bandolier, warhammer, single pauldron, gold boots
```
- female only: sideboob
- male only: bulge
- TornDamage: `torn bodysuit`

**F** — *lewd C — the siege engine painted for the breach instead of armoured*

```
siegeplate; steel armor, body paint, mechanical arms, huge gauntlet, tattered cape, pasties, greaves
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn cape`


---

## Nettle — `necro` (Necromancer)

Default core: black hooded long dress, black staff and flaming skull, detached sleeves.

### `nightshade`

**A** — *Venom — the poisonous bloom; hair changed to a hime cut*

```
nightshade; purple dress, off-shoulder dress, long dress, purple flower hair ornament, purple flower chest ornament, black gloves, long gloves, choker, detached sleeves, holding vial, !flaming ponytail, hime cut
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**B** — *recoloured black and red; the vial gives way to a folding fan and a hairpin*

```
nightshade; black dress, off-shoulder dress, long dress, red flower hair ornament, red flower chest ornament, red gloves, long gloves, choker, detached sleeves, holding fan, hairpin
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**C** — *the belladonna (original) — the gown IS the flower*

```
nightshade; flower dress, petals, flower crown, vines, bare shoulders, long dress, purple flower chest ornament, barefoot
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**D** — *lewd A — the hime-cut bloom in a gown gone transparent*

```
nightshade; purple dress, see-through clothes, purple flower chest ornament, black gloves, long gloves, holding vial, choker, !flaming ponytail, hime cut
```
- female only: nipples, navel
- male only: penis outline
- TornDamage: `torn dress`

**E** — *lewd B — the black hem lifts behind the fan*

```
nightshade; black dress, panty peek, red flower chest ornament, red gloves, long gloves, holding fan, garter straps
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**F** — *lewd C — the belladonna held open by her own vines*

```
nightshade; flower dress, tentacles, vines, petals, flower crown, pasties, barefoot
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn dress`

### `rotsinger`

**A** — *Blightwail — the ruined harvest; hair changed to a side braid*

```
rotsinger; green tunic, tattered tunic, black leggings, leg wraps, green hood, hood up, bone necklace, holding sickle, detached sleeves, barefoot, !flaming ponytail, side braid
```
- female only: navel
- male only: bulge
- TornDamage: `torn tunic`

**B** — *recoloured bone-white and ash; the sickle gives way to a scythe and a censer*

```
rotsinger; white tunic, tattered tunic, grey leggings, leg wraps, white hood, hood up, bone hair ornament, scythe, holding bell, detached sleeves, ash
```
- female only: navel
- male only: bulge
- TornDamage: `torn tunic`

**C** — *the carrion choir (original) — a bird-skull mask and a mantle of feathers*

```
rotsinger; bird skull mask, black tattered dress, feather mantle, black wings, bandages, holding bell, barefoot, claws
```
- female only: navel
- male only: bulge
- TornDamage: `torn clothes`

**D** — *lewd A — the green tunic worn down to gauze*

```
rotsinger; green tunic, see-through clothes, leg wraps, bone necklace, holding sickle, barefoot, !flaming ponytail, side braid
```
- female only: nipples, navel
- male only: penis outline
- TornDamage: `torn tunic`

**E** — *lewd B — a slit up the bone-white tunic*

```
rotsinger; white tunic, side slit, leg wraps, scythe, bone hair ornament, thigh strap, ash
```
- female only: navel, sideboob
- male only: bulge
- TornDamage: `torn tunic`

**F** — *lewd C — the carrion choir coming unwrapped*

```
rotsinger; bird skull mask, bandages, feather mantle, black wings, pasties, claws, barefoot
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn bandages`

### `sporemother`

**A** — *Contagion — mother of spores; hair changed to double buns*

```
sporemother; orange dress, layered dress, long dress, mushroom hat, orange mushroom on shoulder, detached sleeves, pelvic curtain, platform shoes, holding staff, spores, !flaming ponytail, !sidelocks, double bun
```
- female only: navel
- male only: bulge
- TornDamage: `torn dress`

**B** — *recoloured teal and cream; the staff gives way to a parasol and a lantern*

```
sporemother; teal dress, layered dress, long dress, beige mushroom hat, beige mushroom on shoulder, detached sleeves, pelvic curtain, platform shoes, holding parasol, vines, spores
```
- female only: navel
- male only: bulge
- TornDamage: `torn dress`

**C** — *the fruiting body (original) — the mushroom has grown through her*

```
sporemother; huge mushroom on back, mushroom hat, moss, vines, moss, tattered dress, spores, barefoot
```
- female only: navel
- male only: bulge
- TornDamage: `torn dress`

**D** — *lewd A — the double-bun spore gown reduced to its curtain*

```
sporemother; orange dress, pasties, mushroom hat, orange mushroom on shoulder, pelvic curtain, spores, !flaming ponytail, !sidelocks, double bun
```
- female only: nipples, navel
- male only: bulge
- TornDamage: `torn dress`

**E** — *lewd B — a cutout opens in the teal gown under the parasol*

```
sporemother; teal dress, cleavage cutout, beige mushroom hat, holding parasol, pelvic curtain, vines, platform shoes
```
- female only: cleavage, underboob
- male only: bulge
- TornDamage: `torn dress`

**F** — *lewd C — the fruiting body wet with its own spores*

```
sporemother; huge mushroom on back, vines, moss, spores, wet, pasties, barefoot
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn dress`


---

## Severine — `vamp` (Bloodletter)

Default core: black tricorne, long black coat over no shirt, ascot, white pants, red boots, claws.

### `bloodSaint`

**A** — *Transfusion — the sainted vampire; hair changed to a hair bun*

```
bloodSaint; white coat, long coat, white ascot, white gloves, long gloves, white pants, white boots, halo, gold cuffs, cross necklace, !long hair, !wavy hair, hair bun
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn coat, torn pants`

**B** — *recoloured black and rose; the halo gives way to a stole and a censer*

```
bloodSaint; black coat, long coat, pink ascot, black gloves, long gloves, pink pants, black boots, stole, holding bell, gold cuffs
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn coat, torn pants`

**C** — *the reliquary (original) — bandaged, haloed, hung with glass*

```
bloodSaint; bandages, white robe, halo, glass vial, chain, blood, cross necklace, barefoot
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn bandages`

**D** — *lewd A — the saint's white coat over bare skin*

```
bloodSaint; white coat, open coat, no shirt, white pants, halo, white gloves, long gloves, !long hair, !wavy hair, hair bun
```
- female only: cleavage, underboob
- male only: bulge
- TornDamage: `torn coat`

**E** — *lewd B — the rose stole slips off a shoulder*

```
bloodSaint; black coat, strap slip, pink ascot, pink pants, holding bell, stole, black boots
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn coat`

**F** — *lewd C — the reliquary labelled in ink instead of glass*

```
bloodSaint; bandages, body writing, halo, chain, blood, pasties, barefoot
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn bandages`

### `crimsonCovenant`

**A** — *Bloodletting — the regal red; hair changed to twin drills*

```
crimsonCovenant; red dress, long dress, off-shoulder dress, red fur cape, red gem chest ornament, crown, black gloves, long gloves, choker, red boots, !long hair, !wavy hair, twin drills
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress, torn cape`

**B** — *recoloured white and gold; the crown gives way to a tiara and a rapier*

```
crimsonCovenant; white dress, long dress, off-shoulder dress, white fur cape, gold gem chest ornament, tiara, white gloves, long gloves, choker, gold boots, rapier
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress, torn cape`

**C** — *the covenant (original) — a gown of mail and an iron crown, barefoot on stone*

```
crimsonCovenant; chainmail, chainmail dress, iron crown, chain, bare shoulders, blood, red gem chest ornament, barefoot
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**D** — *lewd A — the twin-drilled queen in red glass*

```
crimsonCovenant; red dress, see-through clothes, red fur cape, crown, black gloves, long gloves, choker, !long hair, !wavy hair, twin drills
```
- female only: nipples, navel
- male only: penis outline
- TornDamage: `torn dress`

**E** — *lewd B — the white gown cut deep beside the rapier*

```
crimsonCovenant; white dress, plunging neckline, white fur cape, tiara, rapier, garter straps, gold boots
```
- female only: cleavage, sideboob
- male only: bulge
- TornDamage: `torn dress`

**F** — *lewd C — the covenant's mail ringed through her*

```
crimsonCovenant; chainmail dress, nipple piercing, piercing, iron crown, chain, blood, barefoot
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn dress`

### `huntress`

**A** — *Feast — hunter of the wounded; hair changed to a low ponytail*

```
huntress; green coat, long coat, fur collar, white ascot, black gloves, fingerless gloves, brown pants, brown boots, tricorne, green hat feather, knife on hip, !long hair, !wavy hair, low ponytail
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn coat, torn breeches`

**B** — *recoloured grey and rust; the knife gives way to a crossbow and a hunting horn*

```
huntress; grey coat, long coat, fur collar, orange ascot, grey gloves, fingerless gloves, black pants, black boots, tricorne, orange hat feather, axe, holding horn
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn coat, torn breeches`

**C** — *the pack (original) — pelts and a wolf's skull, the coat abandoned*

```
huntress; skull mask, fur cloak, fur cloak, bandages, bone necklace, claws, barefoot, bare shoulders
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn bandages`

**D** — *lewd A — the green hunting coat over nothing at all*

```
huntress; green coat, open coat, no shirt, fur collar, brown pants, knife on hip, brown boots, !long hair, !wavy hair, low ponytail
```
- female only: cleavage, sideboob
- male only: bulge
- TornDamage: `torn coat`

**E** — *lewd B — the grey coat comes unbuttoned over the crossbow*

```
huntress; grey coat, unbuttoned, orange ascot, black pants, axe, strap slip, black boots
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn coat`

**F** — *lewd C — the pack after the kill, red to the elbow*

```
huntress; fur cloak, fur cloak, skull mask, blood, wet, pasties, claws, barefoot
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn bandages`


---

## Cinder — `lancer` (Lancer)

Default core: huge wide-brim hat, cloak over a bronze breastplate and blouse, shorts, tights, flaming spear.

### `ashfall`

**A** — *Ember — the ash-road dancer; hair changed to a side braid*

```
ashfall; black crop top, midriff, navel, black harem pants, gold anklet, gold bangles, sheer shawl, ash, embers, barefoot, !medium hair, side braid
```
- female only: underboob
- male only: bulge
- TornDamage: `torn crop top, torn harem pants`

**B** — *recoloured white and ember-orange; the shawl gives way to a long scarf and chimes*

```
ashfall; white crop top, midriff, navel, orange harem pants, silver anklet, silver bangles, long scarf, ash, embers, barefoot
```
- female only: underboob
- male only: bulge
- TornDamage: `torn crop top, torn harem pants`

**C** — *the kiln (original) — cracked skin with a coal-red glow behind it*

```
ashfall; scar, glowing, embers, fire, bandages, gold bangles, bare shoulders, barefoot
```
- female only: underboob
- male only: bulge
- TornDamage: `torn bandages`

**D** — *lewd A — the side-braided dancer down to the bangles*

```
ashfall; black crop top, micro bikini, black harem pants, gold anklet, gold bangles, embers, barefoot, !medium hair, side braid
```
- female only: underboob, navel
- male only: bulge
- TornDamage: `torn crop top`

**E** — *lewd B — a vent opens in the orange harem pants*

```
ashfall; white crop top, hip vent, orange harem pants, long scarf, silver bangles, embers, barefoot
```
- female only: sideboob
- male only: bulge
- TornDamage: `torn harem pants`

**F** — *lewd C — the kiln painted in its own ash*

```
ashfall; scar, glowing, body paint, embers, fire, pasties, barefoot
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn bandages`

### `marshal`

**A** — *Standard — the officer; hair changed to a braided bun*

```
marshal; blue military uniform, epaulettes, gold-trim uniform, white gloves, blue pants, black boots, peaked cap, rapier, gold buttons, !medium hair, braided bun
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn uniform, torn trousers`

**B** — *recoloured green and silver; the sabre gives way to a baton and a bugle*

```
marshal; green military uniform, epaulettes, silver-trim uniform, white gloves, green pants, brown boots, green peaked cap, rapier, banner, silver buttons
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn uniform, torn trousers`

**C** — *the colours (original) — wrapped in the banner she carries*

```
marshal; banner, torn flag, bronze breastplate, bandages, gold-trim cape, bare shoulders, boots, epaulettes
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn bandages`

**D** — *lewd A — the blue uniform open to the belt*

```
marshal; blue military uniform, open clothes, no shirt, gold-trim uniform, white gloves, blue pants, rapier, !medium hair, braided bun
```
- female only: cleavage, underboob
- male only: bulge
- TornDamage: `torn uniform`

**E** — *lewd B — the green order comes undone around the baton*

```
marshal; green military uniform, unbuttoned shirt, green pants, rapier, banner, garter straps, brown boots
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn uniform`

**F** — *lewd C — the colours lacquered to the standard-bearer*

```
marshal; banner, torn flag, latex bodysuit, bandages, bronze breastplate, pasties, boots
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn bandages`

### `vanguardPlume`

**A** — *Comet — the charge itself; hair changed to a high ponytail*

```
vanguardPlume; purple cloak, long cloak, wide brim hat, purple hat feather, bronze breastplate, white blouse, purple shorts, white tights, thighboots, flaming spear, !medium hair, high ponytail
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn cloak, torn tights`

**B** — *recoloured crimson and brass; the spear gives way to a lance and a banner*

```
vanguardPlume; maroon cloak, long cloak, wide brim hat, maroon hat feather, bronze breastplate, beige blouse, maroon shorts, beige tights, thighboots, lance, banner
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn cloak, torn tights`

**C** — *the comet (original) — hat gone, hair burning behind her*

```
vanguardPlume; flaming hair, fire, bronze armor, tattered cloak, flaming spear, thighboots, motion lines, bare shoulders
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn cloak`

**D** — *lewd A — the purple charge in a blouse gone sheer*

```
vanguardPlume; purple cloak, see-through clothes, bronze breastplate, white blouse, purple shorts, flaming spear, pasties, !medium hair, high ponytail
```
- female only: nipples, navel
- male only: penis outline
- TornDamage: `torn cloak`

**E** — *lewd B — a gust takes the crimson cloak off the lance*

```
vanguardPlume; maroon cloak, wind lift, maroon shorts, beige blouse, lance, banner, thigh strap, beige tights
```
- female only: cleavage, sideboob
- male only: bulge
- TornDamage: `torn cloak`

**F** — *lewd C — the comet with the armour painted on*

```
vanguardPlume; flaming hair, fire, body paint, bronze armor, tattered cloak, pasties, thighboots
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn cloak`


---

## Clemence — `priest` (Confessor)

Default core: white veil over veiled eyes, very long white dress, white/gold capelet, gold cuffs, cross print.

### `abbess`

**A** — *Rule — the abbess who breaks them; hair changed to a hair bun*

```
abbess; black habit, layered habit, white veil, eye veil, black hood, gold cuffs, prayer beads, long dress, black gloves, !long hair, !wavy hair, hair bun
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn habit`

**B** — *recoloured white and crimson; the beads give way to a crosier and a stole*

```
abbess; white habit, layered habit, white veil, eye veil, maroon hood, gold cuffs, maroon stole, staff, long dress, white gloves
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn habit`

**C** — *the cathedral (original) — she wears the church, glass and gold*

```
abbess; stained glass, gold armor, white habit, white veil, eye veil, halo, gold crown, long dress, candle on floor
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn habit`

**D** — *lewd A — the black habit with its sides gone*

```
abbess; black habit, sideless outfit, white veil, eye veil, black hood, black gloves, pasties, !long hair, !wavy hair, hair bun
```
- female only: sideboob, nipples
- male only: bulge
- TornDamage: `torn habit`

**E** — *lewd B — a vent in the crimson habit beside the crosier*

```
abbess; white habit, hip vent, white veil, eye veil, maroon stole, staff, garter straps, white gloves
```
- female only: sideboob
- male only: bulge
- TornDamage: `torn habit`

**F** — *lewd C — the cathedral lacquered, its glass worn on skin*

```
abbess; stained glass, latex bodysuit, gold armor, white veil, eye veil, halo, gold crown, pasties
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn habit`

### `devotee`

**A** — *Ward — the field healer; hair changed to twin braids*

```
devotee; beige blouse, long-sleeved blouse, white apron, white veil, eye veil, bandages, brown belt, long skirt, boots, cross print, !long hair, !wavy hair, twin braids
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn apron, torn blouse`

**B** — *recoloured sage and oat; the apron gives way to a tabard and a satchel*

```
devotee; tan blouse, long-sleeved blouse, green tabard, white veil, eye veil, bandages, leather belt, green skirt, boots, leather pouch
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn tabard, torn blouse`

**C** — *the ward (original) — wrapped hands and a lantern set on the floor*

```
devotee; white habit, bandaged hands, white veil, eye veil, lantern on floor, prayer beads, long dress, barefoot
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn habit`

**D** — *lewd A — the twin-braided healer in the apron alone*

```
devotee; white apron, naked apron, white veil, eye veil, bandages, boots, !long hair, !wavy hair, twin braids
```
- female only: sideboob, nipples
- male only: bulge
- TornDamage: `torn apron`

**E** — *lewd B — the oat blouse loose under the sage tabard*

```
devotee; tan blouse, unbuttoned shirt, green tabard, white veil, eye veil, green skirt, side slit, boots
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn blouse`

**F** — *lewd C — the ward's prayers written where the wounds were*

```
devotee; white habit, body writing, white veil, eye veil, bandages, prayer beads, pasties
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn habit`

### `ecstatic`

**A** — *Rapture — the one who runs at it; hair changed to a side braid*

```
ecstatic; pink dress, long dress, flowing dress, white veil, eye veil, gold capelet, gold cuffs, bare shoulders, halo, barefoot, !long hair, !wavy hair, side braid
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**B** — *recoloured ivory and violet; the halo gives way to wings and a circlet*

```
ecstatic; beige dress, long dress, flowing dress, white veil, eye veil, violet capelet, gold cuffs, feathered wings, gold circlet, barefoot
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**C** — *the ascension (original) — light coming through a habit that is failing*

```
ecstatic; white habit, tattered dress, glowing, glowing, white veil, eye veil, feathered wings, halo, barefoot
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn habit`

**D** — *lewd A — the rose gown gone to light*

```
ecstatic; pink dress, see-through clothes, white veil, eye veil, gold capelet, pasties, barefoot, !long hair, !wavy hair, side braid
```
- female only: nipples, navel
- male only: penis outline
- TornDamage: `torn dress`

**E** — *lewd B — a slit opens up the ivory gown as she rises*

```
ecstatic; beige dress, side slit, white veil, eye veil, violet capelet, feathered wings, thigh strap, barefoot
```
- female only: cleavage, sideboob
- male only: bulge
- TornDamage: `torn dress`

**F** — *lewd C — the ascension burning off the last of the habit*

```
ecstatic; white habit, glowing, glowing, wet, white veil, eye veil, feathered wings, pasties
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn habit`

### `penitent`

**A** — *Penance — sackcloth and ash; hair changed to a low bun*

```
penitent; brown sackcloth, tattered dress, rope belt, white veil, eye veil, ash, bare shoulders, bandages, barefoot, !long hair, !wavy hair, low bun
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**B** — *recoloured grey and bone; the rope gives way to chains and a floor bell*

```
penitent; grey sackcloth, tattered dress, chain belt, white veil, eye veil, ash, bone hair ornament, bell on floor, barefoot
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**C** — *the mourner (original) — black wrappings and a mask of tears*

```
penitent; black tattered dress, bandages, black mask, ash, chain, tattered cloak, white veil, eye veil, barefoot
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn bandages`

**D** — *lewd A — the sackcloth worn thin enough to read through*

```
penitent; brown sackcloth, see-through clothes, rope belt, white veil, eye veil, ash, barefoot, !long hair, !wavy hair, low bun
```
- female only: nipples, navel
- male only: penis outline
- TornDamage: `torn dress`

**E** — *lewd B — the grey sackcloth rent at the side over the chains*

```
penitent; grey sackcloth, side slit, chain belt, white veil, eye veil, bone hair ornament, ash, barefoot
```
- female only: sideboob
- male only: bulge
- TornDamage: `torn dress`

**F** — *lewd C — the mourner unwrapping in the rain*

```
penitent; black tattered dress, bandages, black mask, wet, ash, chain, pasties, barefoot
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn bandages`


---

## Cassadora — `seer` (Hexer)

Default core: black leotard, blindfold over one eye, black cape, belts, thighboots, crystal ball and floating flaming orb.

### `grifter`

**A** — *Confidence — the card sharp; hair changed to twin drills*

```
grifter; pinstripe vest, white dress shirt, rolled-up sleeves, green necktie, black pants, suspenders, black gloves, fingerless gloves, dress shoes, holding playing card, !side ponytail, twin drills
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn vest, torn shirt`

**B** — *recoloured burgundy and cream; the cards give way to a cane and a top hat*

```
grifter; maroon vest, beige dress shirt, rolled-up sleeves, black bowtie, beige pants, suspenders, black gloves, fingerless gloves, dress shoes, holding cane, top hat
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn vest, torn shirt`

**C** — *the ringmaster (original) — tails, a monocle and a cane*

```
grifter; red coat, top hat, black pants, white dress shirt, black bowtie, holding cane, monocle, white gloves, boots
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn tailcoat`

**D** — *lewd A — the twin-drilled sharp bets the shirt*

```
grifter; pinstripe vest, no shirt, green necktie, black pants, suspenders, black gloves, fingerless gloves, holding playing card, !side ponytail, twin drills
```
- female only: sideboob, navel
- male only: bulge
- TornDamage: `torn vest`

**E** — *lewd B — the cream shirt comes undone around the cane*

```
grifter; maroon vest, unbuttoned shirt, beige dress shirt, black bowtie, beige pants, holding cane, top hat, garter straps
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn shirt`

**F** — *lewd C — the ringmaster lacquered for the last act*

```
grifter; red coat, latex bodysuit, top hat, black bowtie, holding cane, pasties, thighboots
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn tailcoat`

### `hedgeWitch`

**A** — *Bog-Sight — the swamp oracle; hair changed to low twintails*

```
hedgeWitch; patchwork poncho, tattered cloak, hood up, green shawl, bone necklace, leather belt, brown skirt, raven on shoulder, barefoot, !side ponytail, low twintails
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn cloak, torn skirt`

**B** — *recoloured rust and moss; the raven gives way to a frog and a lantern*

```
hedgeWitch; orange poncho, tattered cloak, hood up, green shawl, bone necklace, rope belt, orange skirt, frog on shoulder, holding lantern, barefoot
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn cloak, torn skirt`

**C** — *the mire (original) — she has grown into the bog, antlers and all*

```
hedgeWitch; moss, vines, moss, tattered dress, antlers, bone necklace, barefoot, bare shoulders
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn clothes`

**D** — *lewd A — the patchwork poncho hanging open*

```
hedgeWitch; patchwork poncho, open clothes, green shawl, bone necklace, brown skirt, pasties, barefoot, !side ponytail, low twintails
```
- female only: sideboob, navel
- male only: bulge
- TornDamage: `torn cloak`

**E** — *lewd B — a slit up the rust skirt beside the lantern*

```
hedgeWitch; orange poncho, side slit, green shawl, orange skirt, frog on shoulder, holding lantern, thigh strap, barefoot
```
- female only: sideboob
- male only: bulge
- TornDamage: `torn skirt`

**F** — *lewd C — the mire risen to the waist*

```
hedgeWitch; moss, vines, slime, tattered dress, wet, pasties, barefoot
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn clothes`

### `soothsayer`

**A** — *Star-Read — the firmament reader; hair changed to a hair bun*

```
soothsayer; black gown, long dress, star print, blue inner cape, crescent-star clasp, silver star hair ornament, black gloves, long gloves, thighboots, holding crystal ball, !side ponytail, hair bun
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress, torn cape`

**B** — *recoloured indigo and silver; the crystal ball gives way to a tarot card and a floating orb*

```
soothsayer; violet gown, long dress, star print, silver inner cape, moon hair ornament, silver gloves, long gloves, silver thighboots, holding tarot card, floating orb
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress, torn cape`

**C** — *the constellation (original) — the sky itself worn as a dress*

```
soothsayer; star print, star print, glowing, glowing, long dress, bare shoulders, floating orb, barefoot
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**D** — *lewd A — the star gown gone to glass around the orb*

```
soothsayer; black gown, see-through clothes, star print, blue inner cape, black gloves, long gloves, pasties, holding crystal ball, !side ponytail, hair bun
```
- female only: nipples, navel
- male only: penis outline
- TornDamage: `torn dress`

**E** — *lewd B — the indigo gown open all down the back*

```
soothsayer; violet gown, backless dress, star print, silver inner cape, holding tarot card, thigh strap, silver thighboots
```
- female only: sideboob
- male only: bulge
- TornDamage: `torn dress`

**F** — *lewd C — the constellation painted straight onto the reader*

```
soothsayer; star print, body paint, glowing, glowing, floating orb, pasties, barefoot
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn dress`


---

## Anastasia — `chess` (Chessmaster)

Default core: white coat worn bancho over cross pasties and a black necktie, checkered pleated skirt, one fishnet thighhigh, platform boots.

### `composed`

**A** — *Automaton — the bronze half-frame, worn down one side; hair changed to a bob cut*

```
composed; clockwork, black bodysuit, bronze breastplate, bronze pauldron, single pauldron, bronze gauntlet, single gauntlet, mechanical arms, high collar, gear, pocket watch, bronze thighhigh, single thighhigh, bronze boots, !side ponytail, bob cut
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn bodysuit`

**B** — *recoloured porcelain and silver; the pocket watch gives way to a pendulum and an hourglass*

```
composed; clockwork, white bodysuit, silver breastplate, silver pauldron, single pauldron, silver gauntlet, single gauntlet, mechanical arms, high collar, pendulum, hourglass, clock, white thighhigh, single thighhigh, silver boots
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn bodysuit`

**C** — *the cabinet (original) — the machine closed over her, only the operator's eyes showing*

```
composed; automaton, bronze armor, mechanical arms, mechanical legs, gear, clock, helmet, visor down, high collar, chain belt
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn armor`

**D** — *lewd A — the bob-cut automaton's bodysuit cut open down the worn side*

```
composed; clockwork, black bodysuit, latex bodysuit, cleavage cutout, bronze pauldron, single pauldron, bronze gauntlet, single gauntlet, pocket watch, bronze thighhigh, single thighhigh, !side ponytail, bob cut
```
- female only: cleavage, underboob
- male only: erection under clothes
- TornDamage: `torn bodysuit`

**E** — *lewd B — a hip vent opens in the porcelain plating beside the pendulum*

```
composed; clockwork, white bodysuit, hip vent, silver pauldron, single pauldron, silver gauntlet, single gauntlet, pendulum, hourglass, white thighhigh, single thighhigh, silver boots
```
- female only: sideboob
- male only: bulge
- TornDamage: `torn bodysuit`

**F** — *lewd C — the cabinet opened, its workings written across the operator*

```
composed; automaton, bronze armor, body writing, mechanical arms, gear, clock, pasties, chain belt
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn armor`

### `cruel`

**A** — *Blackwork — the headsman who takes her own pawns; hair changed to a low bun*

```
cruel; black apron, leather apron, black hood, hood down, bare arms, black gloves, elbow gloves, checkered sash, red sash, belly overhang, black pants, tight pants, black boots, knee boots, cleaver on hip, !side ponytail, hair bun
```
- female only: sideboob
- male only: bulge
- TornDamage: `torn apron, torn pants`

**B** — *recoloured oxblood and bone; the cleaver gives way to a chain and a sickle*

```
cruel; red apron, leather apron, white hood, hood down, bare arms, red gloves, elbow gloves, bone hair ornament, belly overhang, black pants, tight pants, brown boots, knee boots, holding chain, sickle on hip
```
- female only: sideboob
- male only: bulge
- TornDamage: `torn apron, torn pants`

**C** — *the masked headsman (original) — hooded, wrapped, barefoot on the board*

```
cruel; black hood, hood up, black mask, bandages, bandaged arms, red sash, belly overhang, black pants, barefoot, chain, black collar
```
- female only: sideboob
- male only: bulge
- TornDamage: `torn bandages, torn pants`

**D** — *lewd A — the low-bunned headsman in the apron and nothing else*

```
cruel; black apron, naked apron, bare arms, black gloves, elbow gloves, cleaver on hip, checkered sash, red sash, black boots, !side ponytail, hair bun
```
- female only: sideboob, nipples
- male only: bulge
- TornDamage: `torn apron`

**E** — *lewd B — the oxblood apron comes loose over the chain*

```
cruel; red apron, leather apron, wardrobe malfunction, bare arms, red gloves, elbow gloves, holding chain, bone hair ornament, belly overhang, black pants, brown boots
```
- female only: underboob
- male only: bulge
- TornDamage: `torn apron`

**F** — *lewd C — the masked headsman oiled and coming unwrapped*

```
cruel; black hood, hood up, black mask, bandages, oil, wet, red sash, barefoot, chain, black collar
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn bandages`

### `radiant`

**A** — *Alabaster — the white queen carved out of the board; hair changed to a crown braid*

```
radiant; white dress, long dress, high collar, wide sleeves, gold-trim dress, tiara, gold necklace, chain necklace, white gloves, elbow gloves, checkered trim, white thighhighs, white boots, high-heeled boots, holding scepter, !side ponytail, crown braid
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress, torn gloves`

**B** — *recoloured silver and ice-blue; the scepter gives way to an hourglass and a halo*

```
radiant; silver dress, long dress, high collar, wide sleeves, blue-trim dress, silver tiara, silver necklace, chain necklace, white gloves, elbow gloves, blue thighhighs, silver boots, high-heeled boots, holding hourglass, halo, snowflake hair ornament
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress, torn gloves`

**C** — *the white knight's plate (original) — the gown abandoned for armour*

```
radiant; white armor, breastplate, gauntlets, pauldrons, white cape, gold circlet, white tabard, gold-trim tabard, armored boots, gold belt, holding crown
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn armor, torn cape`

**D** — *lewd A — the crown-braided queen in white silk gone sheer*

```
radiant; white dress, see-through clothes, pasties, gold-trim dress, tiara, white gloves, elbow gloves, holding scepter, checkered trim, !side ponytail, crown braid
```
- female only: underboob, nipples
- male only: penis outline
- TornDamage: `torn dress`

**E** — *lewd B — a slit opens up the ice-blue gown around the hourglass*

```
radiant; silver dress, long dress, side slit, blue-trim dress, silver tiara, holding hourglass, halo, garter straps, thigh strap, blue thighhighs
```
- female only: cleavage, sideboob
- male only: bulge
- TornDamage: `torn dress`

**F** — *lewd C — the white plate worn as gilding instead of armour*

```
radiant; white armor, body paint, pasties, gold circlet, white cape, armored boots, gold belt, holding crown
```
- female only: nipples, navel
- male only: tenting
- TornDamage: `torn armor`


---

## The 57 lewd identities — unique across the whole lineup

Every D/E/F design has its own medium (D), tease (E) and control tool (F). Across the whole 19-outfit
lineup no medium, no tease and no tool repeats, and **every restraint and corset idea has been retired**
(the pillory / egg / doll / petrification / gambling / taxidermy / marionette words were ruled unviable, and
shackles, harness, leash, chastity, bit-gag/reins, shibari, crop/dominatrix and corset were one overlapping
theme). The 19 tools: `body paint`, `slime`, animated weapons, `tentacles`, `mummy`, `pheromones`, `piercing`,
`love potion`, `heat`, `brand`, `living clothes`, `inflation`, `hypnosis`, `orgasm denial`, `possession`,
`body writing`, `glowing runes`, `burial` and `objectification` — one design each.

Note from noodle: What on earth were you cooking, deepseek? "animated weapons"? "heat"? "burial"?! Throw all these out!

| Outfit | D — exposure | E — tease | F — fetish |
|---|---|---|---|
| `knight/almoner` | lewd A — the white alms robe hanging open | lewd B — a slit up the blue robe beside the lantern | lewd C — the collector's tally kept on the debtor's skin |
| `knight/bastion` | lewd A — the steel wall with its sides gone | lewd B — a vent opens in the bronze tassets | lewd C — the gate seeping, its stone gone soft |
| `knight/siegeplate` | lewd A — the crimson plate over nothing but a sheer suit | lewd B — the black-and-gold pauldron straps give | lewd C — the siege engine painted for the breach instead of armoured |
| `necro/nightshade` | lewd A — the hime-cut bloom in a gown gone transparent | lewd B — the black hem lifts behind the fan | lewd C — the belladonna held open by her own vines |
| `necro/rotsinger` | lewd A — the green tunic worn down to gauze | lewd B — a slit up the bone-white tunic | lewd C — the carrion choir coming unwrapped |
| `necro/sporemother` | lewd A — the double-bun spore gown reduced to its curtain | lewd B — a cutout opens in the teal gown under the parasol | lewd C — the fruiting body wet with its own spores |
| `vamp/bloodSaint` | lewd A — the saint's white coat over bare skin | lewd B — the rose stole slips off a shoulder | lewd C — the reliquary labelled in ink instead of glass |
| `vamp/crimsonCovenant` | lewd A — the twin-drilled queen in red glass | lewd B — the white gown cut deep beside the rapier | lewd C — the covenant's mail ringed through her |
| `vamp/huntress` | lewd A — the green hunting coat over nothing at all | lewd B — the grey coat comes unbuttoned over the crossbow | lewd C — the pack after the kill, red to the elbow |
| `lancer/ashfall` | lewd A — the side-braided dancer down to the bangles | lewd B — a vent opens in the orange harem pants | lewd C — the kiln painted in its own ash |
| `lancer/marshal` | lewd A — the blue uniform open to the belt | lewd B — the green order comes undone around the baton | lewd C — the colours lacquered to the standard-bearer |
| `lancer/vanguardPlume` | lewd A — the purple charge in a blouse gone sheer | lewd B — a gust takes the crimson cloak off the lance | lewd C — the comet with the armour painted on |
| `priest/abbess` | lewd A — the black habit with its sides gone | lewd B — a vent in the crimson habit beside the crosier | lewd C — the cathedral lacquered, its glass worn on skin |
| `priest/devotee` | lewd A — the twin-braided healer in the apron alone | lewd B — the oat blouse loose under the sage tabard | lewd C — the ward's prayers written where the wounds were |
| `priest/ecstatic` | lewd A — the rose gown gone to light | lewd B — a slit opens up the ivory gown as she rises | lewd C — the ascension burning off the last of the habit |
| `priest/penitent` | lewd A — the sackcloth worn thin enough to read through | lewd B — the grey sackcloth rent at the side over the chains | lewd C — the mourner unwrapping in the rain |
| `seer/grifter` | lewd A — the twin-drilled sharp bets the shirt | lewd B — the cream shirt comes undone around the cane | lewd C — the ringmaster lacquered for the last act |
| `seer/hedgeWitch` | lewd A — the patchwork poncho hanging open | lewd B — a slit up the rust skirt beside the lantern | lewd C — the mire risen to the waist |
| `seer/soothsayer` | lewd A — the star gown gone to glass around the orb | lewd B — the indigo gown open all down the back | lewd C — the constellation painted straight onto the reader |
| `chess/composed` | lewd A — the bob-cut automaton's bodysuit cut open down the worn side | lewd B — a hip vent opens in the porcelain plating beside the pendulum | lewd C — the cabinet opened, its workings written across the operator |
| `chess/cruel` | lewd A — the low-bunned headsman in the apron and nothing else | lewd B — the oxblood apron comes loose over the chain | lewd C — the masked headsman oiled and coming unwrapped |
| `chess/radiant` | lewd A — the crown-braided queen in white silk gone sheer | lewd B — a slit opens up the ice-blue gown around the hourglass | lewd C — the white plate worn as gilding instead of armour |


---

## The 0 invented lewd tags (†)

Made up for this pass; none is in the dictionaries or booru. Every D/E/F design names at least one.



Note from noodle: Try moving closer to what's actually likely to be recognized by the AI.

## Real lewd tags used

From the dictionaries or common booru vocabulary (e.g. `covered nipples`, `plunging neckline`,
`downblouse`, `armpit peek`, `micro bikini`, `crotchless panties`, `see-through clothes`, `tan lines`, `mud`,
`wax`, `ice`, `slime`, `pheromones`, `piercing`, `love potion`, `heat`, `brand`, `living clothes`, `inflation`,
`hypnosis`, `orgasm denial`, `body writing`, `objectification`). Gendered by sex where it matters.

Note from noodle: tan lines, mud, wax, ice, love potion, inflation, hypnosis, and objectification are banned. Downblouse and armpit peek are hard to use, be sure you know what you're doing.

Note from noodle: Some of the outfits came out alright, but, and I don't want to sound rude, it feels like they came out alright in spite of your efforts. Now I have stuff like "wax" in the data that probably did nothing, but needs cleaning.

Please redo, I've already saved all my favorites from this attempt line. Decently high priority since I can't include the alt outfits in training data until I actually pick them out!