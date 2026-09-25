# Alt outfits, round 5 — Cassadora, Cinder, Clemence, Anastasia (2026-09-25)

**Brainstorm, not data.** 72 prompts, A–F for the three alt outfits of each of the four characters, written
as webui combo blocks so they paste straight in. Nothing here is in `charactersDB.js` or `outfit-designs.js`;
round 04's designs for these four stay in `../outfit-designs.js` until Noodle has picked.

| File | Paste as | Designs |
|---|---|---|
| `PROMPTS-SEER.txt` | one block | Soothsayer, Grifter, HedgeWitch × A–F |
| `PROMPTS-LANCER.txt` | one block | VanguardPlume, Marshal, Ashfall × A–F |
| `PROMPTS-PRIEST.txt` | one block | Devotee, Ecstatic, Abbess × A–F |
| `PROMPTS-CHESS.txt` | one block | Radiant, Cruel, Composed × A–F |

**One paste per file.** Each file is one prefix line, a blank line, then 18 `- Name` / tag-line pairs with no
blank line between them, so it compiles to exactly 18 variants. Pasting two files together multiplies the
groups. Headless check, same as the lust-event prompts:

```
node scripts/webui/tools/webui2-generate.js --block "designDocs/honeycomb/art_pipeline/outfits-round5/PROMPTS-SEER.txt" --mode dry
```

All four compile to 18 variants each with the block's own names. The bare names `cassadora`, `cinder`,
`clemence` and `anastasia` resolve to the `.hc…V` entries; for the male versions swap in `hcseerc`,
`hclancerc`, `hcpriestc`, `hcchessc`. No size id is in the blocks, so the dropdown (or `--size`) decides.

## Rules applied

- **A** the outfit's core look with a changed haircut (`!` on the entry's hair tag) · **B** new palette and swapped
  prop(s), default hair · **C** original concept · **D** = A exposed · **E** = B teased · **F** = C hypersexualised.
- **Eyes.** Cassadora keeps one eye covered in every design (blindfold, eyepatch, bandage, half mask). Cinder's
  are under a hat, a visor or her hair every time. **Clemence is blind and every design covers her eyes with
  something that burns**: bandages, a bridal veil, a lace eye veil, a cloth blindfold. Nothing metal over them,
  because the broken-state rework is adding fire to her attacks and the cover is meant to burn away.
- **Real tags only.** Every tag was run through `webui2-inspect.js tags`; uncategorised ones reach the model raw
  and are all plain booru vocabulary. No invented tags, no `wax`/`ice`/`mud`/`tan lines`/`hypnosis`/
  `inflation`/`love potion`/`objectification`, no downblouse or armpit peek, no cups or coins, no modern
  devices (Anastasia's clothes are modern on purpose; that is her Earth tell).
- **Colours** are from `modifierKeywordDB.colors` only (periwinkle, teal, maroon, tan, violet, stone…).
- **Spread over polish.** Three silhouettes per character that share nothing, and no D medium, E tease or F
  medium repeats across the twelve outfits.

## The twelve outfits at a glance

| Outfit | A / B silhouette | C concept | D medium | E tease | F medium | Torn suggestion |
|---|---|---|---|---|---|---|
| seer/soothsayer | tent fortune-teller: headscarf, shawl, layered skirts | the Living Deck: a cloak of tarot, cards orbiting | sheer skirts + body chain | front slit | living clothes | torn skirt, torn shawl |
| seer/grifter | cutpurse: cropped vest, pouch bandolier, half cloak | harlequin in two colours, half mask, hand mirror | pasties, stripped to the belts | strap slip | nipple bells on a thong leotard | torn tunic, torn cloak |
| seer/hedgeWitch | Evil Eye: eye-print hooded cloak, curse doll and needle | the Scarecrow: straw hat, burlap, crow | micro bikini under the open cloak | panty peek | rope harness on the frame | torn dress, torn cloak |
| lancer/vanguardPlume | hussar: pelisse on the shoulders, busby and plume, flaming lance | the Comet: jousting plate, visor down | naked jacket | cleavage cutout | armored leotard | torn jacket, torn blouse |
| lancer/marshal | drum major: shako, cropped jacket, sash, baton | the Matador: suit of lights, red cape | open jacket, no bra | cropped-jacket underboob | bodystocking | torn jacket, torn skirt |
| lancer/ashfall | scorched knight: blackened plate, embers, hair over eyes | the Scullery: rags, soot, one glass slipper, broom | mostly nude under ash | side cutout | naked apron | torn cloak, torn dress |
| priest/devotee | Sister of Mercy: wimple, apron, red cross, eyes bandaged | the Hospitaller: mail, tabard, shield, blindfold | sarashi and bandages | zettai ryouiki | wet naked tabard | torn habit, torn apron |
| priest/ecstatic | bride: wedding gown, bridal veil over the eyes, bouquet | the Seraph: six wings, burning halo, dress catching | bridal lingerie | backless gown | burning clothes, light censor | torn dress, torn veil |
| priest/abbess | cardinal: cassock and cope, red veil, crosier | the Shepherdess: straw hat, sundress, crook, lamb | sideless cassock | partially unbuttoned | sheep pet play, bell collar | torn cassock, torn veil |
| chess/radiant | white gothic lolita, bonnet, parasol, twin drills | the Marble Queen: a living stone chess piece | naked ribbon | wind lift | oiled, polished stone | torn dress, torn gloves |
| chess/cruel | punk: studded biker jacket, spiked collar, side shave, nail bat | Blackwork: tattooed, hooded, horned priestess | fishnet bodysuit | open fly | full-body and womb tattoo | torn jacket, torn thighhighs |
| chess/composed | lab coat, turtleneck, pencil skirt, pocket watch | the Clockwork Doll: wind-up key, gears, mechanical limbs | virgin killer sweater | side slit | latex bodysuit | torn coat, torn skirt |

Round 04's counterpart rule holds: D wears A's haircut and gear, E wears B's palette and prop, F is C's idea.

## Engine findings worth keeping

- **`moss` is an alias for Nettle's old name** and injects her whole identity (`hc-n3cro, green hair, pointy
  ears…`). Six round-04 designs in `../outfit-designs.js` carry it (bastion C/F, sporemother C/F, hedgeWitch
  C/F), so those were rendering with Nettle's head on. Never use `moss` as a tag; `vines` or `plant` instead.
- `bare shoulders` compiles to nothing (DROPPED). Round 04 uses it eleven times. Harmless, but it was not
  doing what it looked like.
- `statue`, `smoke` and `anklet` are culled under `simple background`; `stone statue`, `stone skin`, `embers`
  and `incense` survive. `nipples` on Anastasia is rewritten to `large areolas, big nipples` by her entry.
