# Card redesign — effects drafts

Filled in **steps 7, 9, 10**. Until then, names only.

## Broken look (section 2)

Shipped · Cracked · Foil/hue-cycle · Ember · Wrong+scan

Improvements: step 10b.

## Filter lab (section 3)

Gild · Roughen · Damage crack

**Step 7 — damage (current bench) is rejected.** Ugly border on the right and bottom; the speckle
reads as dead pixels, not damage. A damaged look is still wanted; this implementation is not it.
Rebuild in step 7. Do not carry this filter forward.

Improvements + two new entries: step 10c.

## Cherry blossom (step 9)

Meaning undecided (I-04). Build as a **stackable overlay** so any card can wear it. Process agreed with
Noodle: **quick prototype → plan → real prototype → final**. A quick prototype exists (below).

### Quick prototype (done 2026-09-17)

`.petalVfx` inside the art window on the composer, toggled by the `cherry blossom` checkbox. 7 petals
+ 9 sparkles, deterministic placement, transform+opacity animation, clipped to the window, reduced
effects freezes to two static petals. Evidence: `overlays/step9/proto-frame-{200,1400,2600}.png`,
`proto-reduced.png`. It proves the *motion read*; the art is deliberately generic.

### Plan (what the effect actually is)

What the mockup (`assembledMockup.png`) shows and what we mean by it:

- **Petal language** — a cherry petal, i.e. a **notched oval**, two-tone pink with a hard highlight
  edge. Not circles, not generic confetti. Petals **rise** from below the art window, **sway** side to
  side, **spin**, and **fade** out near the top.
- **Sparkles** — 4-point stars, smaller and slower than the petals, gentle twinkle.
- **Clip** to the art window so the rules text is never obstructed (OT-9c).
- **Reduced effects** — two static petals, no sparkles, no motion (OT-9d).
- **Density** tuned at medium (hand) so the art does not become confetti.
- **Stackable, not a definition**: it must not overlap the five broken-look items or the three filter
  items *as a definition*.

Open questions to settle in this phase:
1. **Meaning** — broken / rarity / Clemence / generic (I-04). Rarity would be odd (gem already
   signals); Clemence is the thematic fit (the mockup's petals). Does it depend on owner, supertype,
   or card identity?
2. **Single petals vs whole blossoms** — the mockup reads as individual petals but a few small
   5-petal blossoms may sell it better. Decide from a close crop of the mockup.
3. **Density and budget** — count at medium; transform-only for the loop (cost note on the effect).
4. **Where it lives** — stackable overlay class the live card can opt into, not a frame variant.

### Next phases

- **Real prototype** — rebuild the petals from the mockup silhouette (close crop first), tune
  density/colour, sidebar-compare against `assembledMockup` at 50% (petal language only, frame
  ignored) — OT-9b.
- **Final** — polish, reduced-effects still, keep the prototype path toggle (OT-9e).

## Extra effects (step 10a)

Two drafts, after 9. Must not duplicate the lists above.
