# Starters, outfits, relics -- finished feedback

Closed items, quote first. The open queue is `../FEEDBACK.md`.

### S59-1. Alt outfits stood on 1-basic for everything — DONE (session 59) ☑

> Alt outfits on teambuilding scene are displaying image 1-basic when default correctly displays 2-basic.

> Alt outfits don't even have a 2-basic? They should pull from default outfit before trying 1-basic as
> fallback. I'm fine with a recolored default outfit, I'm not as much okay with alts using 1-basic for
> everything when the default outfit has the sprites they need. Thank goodness I found this, otherwise
> anyone using alt outfits would have missed out on all my lovely new sprites.

Asked which way to do it, he answered:

> Priority 1: If the outfit has no real images at all, use copies of the equivalent default outfit's image.
> Priority 2: If the outfit at least has a real 1-basic, use normal outfit placeholder backup behavior.
>
> Resulting behavior should mean that current outfits would all default to using recolors of default
> sprites. However if I were to add basic-1 to bastion, all the bastion outfit poses would use bastion's
> basic-1.

**What was wrong.** Every alt outfit folder held a recoloured 1-basic and three tilted copies of it, and
nothing else. The game looks in the outfit's own folder before the default's, so an alt outfit never
reached the default's 2-basic, combat poses, hurt poses, Broken art, exposed or recover pictures.

**What changed.** The rule lives in the placeholder generator (`tools/generate-placeholder-art.py`,
`build_outfit_copies`). When an alt outfit folder holds no drawing at all, the generator copies every
picture in the default folder into it under the same name, recoloured with that outfit's colour recipe.
It recolours the full-size PNG original when there is one and scales it to the game's size. When an
outfit has a real drawing, it gets the old treatment: tilted stand-ins cut from its own 1-basic.

All 18 alt outfits now hold 12 to 18 recoloured pictures each, about 23 MB in total. A picture is only
downloaded when that outfit is worn.

A second list, `.copies.txt`, names the copies that were made from a real drawing. The sprite size table
(`tools/generate-sprite-metrics.js`) reads it, so the game does not treat those copies as stand-ins. That
matters because the Broken tint only goes on stand-ins, and a recoloured Broken drawing must not be
tinted a second time.

Checked in the browser: with a Lust Event ready, Nettle's default, Sporemother, Rotsinger and Nightshade
outfits each show their own 2-basic. Suite block [141].

To redo the copies after new default art lands: `python "!designDocs/honeycomb/tools/generate-placeholder-art.py" --only poses`,
then `node "!designDocs/honeycomb/tools/generate-sprite-metrics.js"`.

### S59-2. Outfit descriptions as bulleted lists — DONE (session 59) ☑

> Alt outfits desperately need bulleted lists for their descriptions otherwise their effects are a wall
> of text, and centered text is a bad choice for this.

`honeycomb.outfitDescriptionLines` turns a description into lines. A description written as an array is
used line for line. A plain string is split into sentences, one bullet each, so no outfit had to be
rewritten. Both screens that show an outfit's effect (the Outfits tab and the party window) draw it as a
bulleted list, and the text is left-aligned. Suite block [141].
