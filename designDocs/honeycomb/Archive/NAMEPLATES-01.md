> The fully opaque sleek black looks very out of place in a fantasy game, The layered health bars look needlessly confusing, and the current animation of golden temporary HP would look bad even if it were aligned correctly. I created mockups/mockup-7-health to show a replacement design.
> The top bar of the mockup shows the health bar at rest. The shapes should be simple enough they could be drawn via SVG, I think. So the first step should be to actually draw the shapes (including the shading):
> The circle frame for the class icon
> The shape of the health bar's frame
> The frame for the HP text to sit on
>
> The middle bar of the mockup shows all five extra visual effects applied:
> The class icon glows and should be clickable to display a drop-down list of the character's abilities.
> The lust gauge has started to build, shown by pink overtaking the red of the health bar. In-game the lust should pulse in brightness, but absolutely not be shown as a candycane.
> Character-specific mechanics and status effects are contained in circles hovering below the health bar itself. Be sure to allow these to wrap rather than extend to the right infinitely.
> Forecasts no longer show numbers, just the amount of the bar that will be lost. The player hovering over/tapping the nameplate will show how these numbers are forecasted to change, trying to include them here would overpollute the space.
> The shatter effect from temporary health is done with a crackling lightning effect and pieces of the health bar's frame broken off (again, probably via svg)
>
> The bottom bar shows the new broken state visualization. 
> The frame has been tinted red by a multiply layer
> The class icon is replaced by a heart
> HP text just reads BROKEN! 
> Health numbers are no longer shown, hovering over/tapping the nameplate explains the mechanic, how much HP and lust they have, and how much more they will need to recover from the broken state at the start of the player's next turn.

Note:
The lust fills starting on the right, the broken state is when it overtakes your health, so in the third image that "middle bar" isn't really a bar, it's visualizing the gap between health and lust which the player needs to overtake to recover, sort of like a negative health depiction. 

And The floating number is the amount of lust numerically, like the floating number near the lightning is the amount of temporary health. 

**Step 1 — the shapes ☑ (session 7).** Three hand-written SVGs in `v13 spire images/ui/nameplate/`,
measured off the mockup at 1 unit = 1 mockup pixel, so they open and edit in any vector editor:

| File | Is | How it is drawn in game |
|---|---|---|
| `medallion.svg` | Raised ring lit from above, sunken disc (radius 60 of 70 is the icon's room) | Plain background, fixed aspect |
| `barFrame.svg` | Top face over the chevron's upper arm, dark groove, lighter lip, sunk track | NINE-SLICE `16 58 20 8`; the fill window is top 16 / bottom 62 / chevron corner x 122 / tip x 145 |
| `healthTab.svg` | Long softened hexagon with a faint lit top rim | NINE-SLICE `34 24 34 24` (the bevelled ends never stretch) |

`!designDocs/honeycomb/nameplate-preview.html` composes them the way the game will, over a crop of the
mockup with an opacity slider, at the real ~136px plate size, and stretched short and long. Served:
`http://localhost:8000/!designDocs/honeycomb/nameplate-preview.html`.

⚠ **An SVG comment may not contain a double hyphen.** It is invalid XML and the whole file silently
draws nothing — which is exactly what the bar frame did on its first load.

**Step 1b — the correction, and a states preview ◐ (session 7).**

> Ah, pasta pazool, I am a fool, I actually used my eyes on the mockup and saw I reversed the dark red and pink in the mockup, that's on me, by "middle bar" you were talking about the vertically oriented bar middle bar, I shouldn't have been so quick to answer.
>
> I thought I had made the mockup such that the broken bar had some HP missing, and that there were three segments on the HP amount, but not only did I make the mistake of switching colors I forgot to actually include missing health.
>
> The system I want is pink for lust growing and black for missing health. When lust overtakes current health and the character is broken, the gap between the two, the measurement of the 'catch up' distance as it were, needs to be visually distinct from normal health otherwise it just looks like a normal HP bar. The only circumstance where the entire bar is pink is where the character is at 100/100 lust and 100/100 hp.
>
> Something also worth noting is that in your preview you included the red sword, that's just a placeholder for whatever the character's icon is, you don't want to draw the icon with SVG.
>
> [...] please show me another preview of the bar in other states (like broken with HP missing and a 'catch-up' gap as the mockup's bottom bar should have been, and the excess HP event) before applying them to the game.

This SUPERSEDES the "lust fills starting on the right" note above (kept, not deleted). The reading, as
built in the preview's `plateMarkup`, every length a share of maximum health along the track:

| State | Left → right |
|---|---|
| Not broken | pink `0..lust` over red `0..health` · gold `health..health+tHP` · black past that |
| Broken (`lust >= health + tHP`, the engine's test, unchanged) | pink `0..health+tHP` · dark-crimson CATCH-UP GAP `health+tHP..lust` · black past that |

So the only all-pink bar is full health with lust at maximum. Forecasts are a lighter breathing segment
with a hairline where health will stop, no number. Temporary HP is gold inside the bar with its "+N"
beside the tip; past maximum the frame's tip is clipped off along a jag, a crack is drawn on it, two
lightning frames alternate at the break, frame chips drift off, and "+N" sits under the lightning.
Broken: a multiply tint (`#ff8a84`, measured so the mockup's navy lands on its maroon) over the medallion,
frame and tab, each clipped to its own silhouette; the heart replaces the class icon; the tab reads BROKEN!.

New SVGs beside the three frames: `shatterCrack`, `shatterBoltA`/`B`, `shatterChipA`/`B`/`C`,
`statusCircle`. Icons in the preview are real icon files (`icons/knight`, `icons/heart-glow-pink`,
`icons/shield-plain`) standing in for whatever the character's own are. **Awaiting Noodle's look before
anything goes into the game.**

**Step 1c — second preview pass ◐ (session 7).**

> 1. Using the ingame heart icon, since it's red, makes things a little confusing. Please filter it a little to make it more of a pink color.
> 2. The dark red ended up looking like regular HP after all, especially when the rest of the frame darkening as well. I think we need to try something else. I really am not a fan of the candy-cane stripe design though. Maybe a dithering pattern?
> 3. Definitely remove the vertical pink bar in broken mode. Pretty much all actual numerical info in broken mode will have to come from the tooltip.
> 4. Temporary health should pulse gold.
> 5. Shrink the width of the lightning bolt, maybe to about half, and add in two more frames for it please, a two-frame animation is too simple. I think it be better if they could pick the next frame (without repeats) at random instead of playing a set sequence, what do you think?

1. Heart icons (lust label and the broken medallion) wear `hue-rotate(-32deg) saturate(1.25) brightness(1.2)`.
2. The gap is a DITHER with a real-pixel floor on its dot size (it melts to a flat colour at fighter size
   otherwise). Three candidates side by side at the top of the preview, with a picker that applies one
   to every state: pink/black checker · sparse pink on black · pink/crimson checker. **Noodle to pick.**
3. While broken: no lust tick, no ♥ number, no "+N". Numbers come from the tooltip only.
4. The gold segment pulses brightness with a soft glow.
5. Bolts are 48×96 now (half width), four frames `shatterBoltA`–`D`. Next frame is always one of the
   OTHER three, chosen by a hash of (plate, tick) rather than `Math.random` or an RNG stream: looks random,
   never repeats, and cannot touch determinism. The game version should be one shared ticker for every
   shattering bar, its interval through `honeycomb.duration`.

**Step 1d — preview signed off, with four last fixes ☑ (session 7).**

> Okay, thank you, looks nearly perfect. I would say that #1 pink/black checker looks best. The only other pieces of feedback I have are:
>
> * Even if at 100% base health, have the tip fill with a little bit of the gold when breaking through. At 68/68 HP +11 thp, I want it looking pretty much just like 64/68 HP · +11 tHP, it just doesn't look right unless the electricity is actually coming from the gold. Whatever percentage 64/68 is at is the perfect amount of gold that should still give the player the impression "Yeah, I'm full up".
> * Some of the tHP numbers aren't gold and are just white.
> * Raise up the tHP numbers a little vertically to align them with the chevron's edge, they'd look better being aligned.
> * The starting position and distance of the nameplate chips should probably be halved as well to match the changes made to the lightning.

- **Gap: the pink/black checker.** The other two candidates stay in the preview only.
- **Overfull gold tip:** past maximum, the health fill stops at most at `100 − (64/68)·100 ≈ 5.88%` short
  of the tip and gold fills the rest; the forecast segment stops at the same point. 68/68 +11 and 64/68
  +11 now draw identically. Goes to tuning as a named share.
- **"+N" is gold everywhere**, vertically centred on the chevron's tip line; past maximum it steps right
  of the bolts.
- **Chips** start half as far from the break and drift half as far.

**Step 2 — in the game ☑ (session 7).** Built, browser-verified at the 1440x810 proportions, 852 tests
(section [58] is this item). Where each piece lives:

| Piece | Where |
|---|---|
| What the bar draws (every segment as a share) | `honeycomb.vitalsShareArray` in honeycomb-entities.js — pure, tested headless |
| The plate's markup | `honeycomb.ui.vitals` → `plateTrack` / `plateMedallion` / `plateShatter`; `plateCircleRow` + `statusCircles` + `mechanicWidget` for the circles |
| Layout, in mockup units | "THE NAMEPLATE" block in honeycomb.css; `--hc-plate-u` from `tuning.art.nameplate.unitPixels` (**0.26**, the one number that sizes the whole plate) |
| All paths, the gold tip share, bolt timing, chips | `tuning.art.nameplate` |
| The lightning crackle | `honeycomb.ui.advanceBolts`: one self-stopping timer for every shattering bar, frame chosen by `ui.hashText(bar, tick)` |
| The ability drop-down | `combatScene.onMedallionClick` / `renderAbilityMenu` / `closeAbilityMenu`; `abilityMenuFor` keeps it open across repaints. Closed by a pick, a board click, or pressing the medallion again |
| Every number | the `nameplate` tooltip kind: Health, Lust and Temporary HP sections while standing; the Broken keyword, HP/tHP/lust and the recovery shortfall (`honeycomb.recoveryShortfall`) while broken |
| Broken switching on its beat | `shownVitalsArray` now carries `broken`; the `broken` / `recovered` log handlers pass it as a delta, so the plate flips when the cut-in plays, not on the first redraw of a replay |

The resolver keeps an explicit `.svg` (`honeycomb.image`), so the tuning path is the only thing an art
pass changes. Mechanics went into circles: Resolve is a ring filling clockwise with its value, Thirst is
three orbs in a triangle, Harvest is its face with a count and glows while holding any.

Judgement calls to look at in game:
- A forecast HEAL is a pale green stretch, pending gold and pending lust are paler ends of their own
  segments, and a random hit's "might" is a faint outlined stretch past the certain loss. None has a number.
- A broken fighter healed past their lust shows a breathing red `recovering` stretch until the turn start
  stands them up, so the bar says recovery is coming.
- The hit trail (the pale drain after a hit) is kept; it lasts under a second.
- In scene layout the allies overlap, so one fighter's "+N" lands beside the next one's medallion.
  `unitPixels` or the plate's `right` inset are the levers if that crowds.