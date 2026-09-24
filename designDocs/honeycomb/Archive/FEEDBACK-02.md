# Honeycomb — Feedback round 02 (2026-09-10, build of 3:47pm PST)

Noodle's second pass after testing the polished MVP. **Their words are quoted verbatim. Do not summarise
this file; add to it.** Annotations under each quote are the interpretation and what was done — if an
annotation and a quote ever disagree, the quote wins.

Status key: ☐ not started · ◐ in progress / partly done · ☑ done

Direction given for the round:

> In terms of direction right now our goals are engine polish and UI work. General improvements to the
> UI and game feel at this stage could go a long way in helping future approaches that take a more
> exploratory "what can we do with this" approach when designing content.

**Count check: 57 items.** 1–20 smaller matters, 21–28 larger-scale factors (first batch), 29–57 the
second batch collected while the session limit reset (teambuilding 29–41, map/event 42–47, battle 48–57).

## Status board (update as items land)

| Done | Items |
|---|---|
| ☑ | 1–16, 19, 20, 22–24, 29–35, 37–45, 48–57 (+ 17 answered; 3 closed by 29) |
| ? needs detail | 36 (not reproducible in Chromium — Firefox?) |
| ⏸ waiting on Noodle | 46, 25 (shop UI elements promised in 47) |
| ◐ | 18 (deck-stack piles + "scene" layout, round 03 — top-heaviness is Noodle's call) |
| ◐ | 26 (Noodle chose "between Jumbo and Stage": **scene**, now default — confirm it and 27/28 unblock) |
| ◐ | 21 (groundwork laid: frames, plates, backdrop slots — the look continues with the art pass) |
| ☐ blocked by 26 | 27, 28 |

Tests: **504 headless**, up from 301. `node "!designDocs/honeycomb/test-honeycomb.js"`. New sections
[33]–[48] cover this round.

**Bugs found and fixed along the way (not on the list):**
- Outside a fight, "all allies" resolved to NOBODY (`honeycomb.entityArray` returned nothing without a
  combat), so every event effect on the party silently did nothing — the campfire's Sleep healed no
  one, the Toll Bench's heal and the Well's climb damage never landed. Test [43].
- Progression-tree HOOKS never fired (Paragon's +1 Shield, Virulence, Deep Thirst were dead text). See
  item 34. Test [44].

---

## Smaller matters

### 1. Roster → Compendium, and what counts as a discovery ☑

> "Roster" on the title screen is just the same option as starting a run. Should probably be renamed to
> "compendium", we'll put off making the compendium scene for now. However this is probably where we
> will be tracking the full list of things that contribute to shared discovery exp. This should
> include:
> - Encountering enemies for the first time (including summoned mobs)
> - Individual event paths (not always events themselves! This way we can encourage the "road not
>   traveled", though this will be more complex, since not every choice needs to be considered an event
>   path, only major branching points should give exp. Thus we need to code that certain events and
>   event paths give exp and some don't)
> - Having cards in your deck for the first time
> - Unlocking outfits and equipment

- Title button is **Compendium**; opens a placeholder ledger overlay (`compendium` in scene-title.js) that
  walks `honeycomb.discoveryKindArray`, so the real scene has its data source already.
- Kinds now: enemy, encounter, event, **eventPath**, relic, card, **outfit**, **equipment**, region.
- `discoveredOn: "meet"` pays the first-time bonus on SEEING (enemies at combat start and when summoned;
  cards on first entering a deck, opening deck included). `"earn"` pays on earning. Repeat pay is
  always on earning (defeat), so nothing farmable moved. `honeycomb.discovery.meet`.
- Event paths: a choice marked `discovery: true` (+ stable `index`) is a path. An event opts out of
  paying with `discovery: false` (the campfire does). Unfound paths show a **New** tag on the choice.
- Unlocks pay via `honeycomb.unlocks.grant`. Start-unlocked outfits/equipment are not "findable".

### 2. Teambuilding counters ☑

> The teambuilding menu still doesn't track equipment unlocked and instead still lists deck size when
> that really should just be a number next to contributed cards

- Tiles are HP / Outfits x/y / Equipment x/y. The card count is a badge beside "Contributed Cards".

### 3. Drag to build and order the party ☑

> I think teambuilding should let me drag characters into the party and let me drag party members to
> reorganize them, I'd like party position to be a relevant factor to the game.

- Drag a roster row onto the strip to place, drag along the strip to reorder, drag off to remove.
  Click still inspects. Pointer capture, no document listeners (Jiggy-safe).
- Strip reads **Back … Front** with front on the right (matches the battlefield) and numbered places.
- Follow-up **29** done: others shift aside for the drop site.

### 4. Keywords, starting with Shield ☑

> Please make "shield" our first keyword so that we can lay and test the groundwork for sidecar
> tooltips that explain what keywords on cards do. In the battle scene since the cards itself aren't
> expanded like in teambuilding, it's important the tooltip move with the mouse so the player can avoid
> covering important details.

- `honeycomb.keywordArray` (content-cards.js). **Shield is the player-facing name of the engine's
  `block`** — stat/effect/hook stay `block` in code; every printed word comes from the keyword entry.
- Also registered: Exhaust, Ethereal, Innate, Retain. Every status is a keyword automatically.
- A card's keywords = those NAMED IN ITS PRINTED TEXT + flags + explicit `keywordArray`. Highlighted in
  the card text (`cardTextMarkup`).
- Zoom tooltip = card + sidecar panels. Hand tooltip (`cardNote`) = sidecars only and **follows the
  pointer** (`follow: true` on the tooltip kind, inline `onmousemove`).

### 5. Three focus levels; hovering a card focuses its owner ☑

> In battle the game should focus in on a character when just hovering over their card instead of just
> when you're dragging the card (in practical terms, the other characters are half-focused), this would
> be a better way of showing the card's owner than the redundant name tooltip hovering over the art
> box. While we need to do an overhaul of the battle scene's style, this is a good time to better
> establish when and where elements are focused vs half-focused (a little darker) vs non-focused
> (darker and desaturated).

- `tuning.focus` → CSS vars; classes `hcFocusHalf` / `hcFocusNone`; `combatScene.setFocus`.
- Hover a hand card: acting character full, everyone else half. Holding: actor, target, whole side
  full; legal pick targets half; everyone else none. Owner name removed from the hand tooltip.

### 6. The hand's focus levels ☑

> In battle cards in hand should be non-focused when the hand isn't actively being looked at, and
> half-focused when another card is being focused on, this gives the impression the spotlight is on
> the card you're hovering over.

- Resting hand non-focused (tuned lighter than fighters); others half while one is read; dropped
  cards non-focused while one is held. Focus × playability multiply through CSS vars in one filter.

### 7. Playing a card moves its owner ☑

> Playing cards should slide the owner forward to the front of the party. To expand this, only offense
> cards should slide the owner forward. Note this is only the default behavior, support cards should
> not do this (also by default). The framework should be laid for things to care about positioning,
> like most attacks targeting the frontmost member of the party. For testing purposes, have Nettle's
> offense cards slide her to the back and have all of Brienne's support cards slide her forward. Party
> order mattering is a good way to make honeycomb stand out better from slay the spire.

- `honeycomb.partyShiftArray` (none/front/back/forward/backward) and `honeycomb.cardPartyShift`:
  card `partyShift` → loadout `partyShiftByCardType` → character `partyShiftByCardType` → type default.
  Offense → front. Nettle `{offense: "back"}`, Brienne `{support: "front"}`. `tuning.combat.partyShiftEnabled`.
- Front of each side = nearest the other side; **party drawn front-rightmost** (row-reverse).
- Position vocabulary: target modes frontAlly/backAlly/frontEnemy/backEnemy, condition `atRank`,
  value `rank`, verb `shiftParty`. Sporeling/Cap Brute/Matriarch attacks hit the front; Hollow Knight's
  pierce hits the back; a few stay random on purpose.
- The move animates (FLIP on the CSS `translate` property; see CATCH-UP traps).

### 8. Status is its own card type ☑

> Status cards like nettle's wisp should be a separate card type.

- Wisp was already type `status` in data. The confusion was **its placeholder art, cropped from Nettle's
  portrait**. Status, curse and neutral cards now get abstract motif art (generator
  `ABSTRACT_CARD_RECIPES`), and every card prints its type.

### 9. Power cards, and the type printed on the card ☑

> We'll want another card type dedicated to applying passive effects like slay the spire's Power cards.
> The card's type should be visible somewhere on the card since we may use these for tribal-like
> effects.

- `honeycomb.cardTypeArray`: **offense, support, power, status, curse** (attack/skill renamed). Each
  supplies defaults: pose, animationArray, partyShift, afterPlay, glyph/colour, frame tint.
- Power: `afterPlay: "inPlay"` → out of the cycle for the fight (`combat.inPlayPileArray`).
- Type printed along the card's lower edge. Condition `cardType` for tribal content.
- Creeping Plague reclassified Support (it lands once).

### 10. Show the position change while a card is held ☑

> Imminent position changes through card use should be shown while the player is holding a card, like
> by moving the character forward with an arrow on their left side pointing right, showing they'll be
> sliding to the front, or vice-versa if the card would slide them backwards. This makes team position
> something that must be actively considered mid-battle. This gives the game a more deterministic,
> darkest-dungeons sort of feel, which I'm actually sort of okay with. Previously I had assumed all
> enemy stats would need to scale with party size, but really it'd just be enemy count and maybe giving
> bosses additional turns.

- On pick-up the mover slides to its predicted place, others shift, arrow on the mover's left pointing
  right (front) or right pointing left (back). Same answer the engine uses (`honeycomb.previewShift`).
- Scaling defaults changed to match the note: enemy health/damage rates 0, **+1 enemy per member over
  3** (boss fights grow only by `reinforcementArray`; Matriarch names Sporelings).
- Boss extra turns: not built. Belongs with 23 (enemy cards), where multiple telegraphed actions fit.

### 11. Incoming forecast at rest, redone while a card is held ☑

> Incoming damage predictions for the party should be calculated while the party is at "rest" (while no
> card is being held). This is a simulation asking "what would happen if the end turn button were hit
> right now". But they should be re-done when a card is being held to simulate how the position change
> will affect damage. This means moving away from ranges towards tangible numbers and more informed
> decision-making, and also means status damage should be accounted for.

- Standing forecast = end turn + enemy turn + **start of next turn** (poison counted;
  `tuning.forecast.includeNextTurnStart`). The number now shows on the bar at rest ("68 → 65").
- Held: `forecast.forHeldCard` re-runs the handover after the card (or, with no target yet, after just
  its owner's move). Verified: holding Rake moved the Sporeling's spit from Brienne onto Severine.
- Follow-up **48**: shield use/loss should read in the forecast.

### 12. A simulation layer for "this card, on what I'm hovering" ☑

> Damage predictions should be re-done for entities while holding a card and when holding a targetting
> card over them. Essentially, we need a simulation layer to determine "what would happen if this card
> were played were played on what I'm hovering over right now". All these damage prediction factors
> should be considered alongside needing to rework the character overlay UI. They do inject some issues
> when considering randomness, perhaps damage should separate guarenteed damage and potential
> forecasted damage?

- Held reading `{play, combined}`: enemies show the play; allies show two segments (card, then enemy turn).
- **Guaranteed vs potential: yes.** Random picks are logged as CHANCE (`honeycomb.markChance`,
  stamped in `logEvent`). `tuning.forecast.randomTargets: "potential"` (default) spreads a random hit as
  a "might" over every candidate (`−7?` chip, faint segment); `"exact"` names the dry run's pick.
- Pending segments now pulse instead of candy-striping. Full nameplate redesign stays with 27.

### 13. Untargeted cards trigger by accident ☑

> Cards that target all enemies and cards that need no target are difficult to place back into the
> hand without accidentally triggering them.

- Releasing over the hand bar (+`cancelZoneExtraPercent`) puts the card back. The card shows a
  will-play glow or a will-cancel dashed edge before release. Verified with real pointer drags.

### 14. Label all-target cards; add an all-hitter ☑

> Cards that target all enemies could be better listed as such, one of wisp's cards is an all-target
> without any indication of that. We should add a basic all-hitter that deals damage to severine for testing
> purposes.

- Generated text names targets ("Deal 4 damage to ALL enemies."); a target badge sits on the card
  (All enemies / Ally / Random / Front / Back). Party-move badge (▶/◀) beside it.
- **Crimson Arc** (Severine starter, 1 energy, 4 to ALL enemies). Read "to severine" as "add to Severine's pool" —
  say if a self-damaging version was meant.

### 15. Cards that target allies, never by accident ☑

> We should return the capability of cards to target friendly units, that's a potentially interesting
> area of design space, it's just important this doesn't happen by accident.

- **Raise Shield now targets an ally** (starter, so it is always exercised).
- While held, only legal targets light (allies green); the arrow turns green over an ally; an
  enemy-target card never lights an ally.

### 16. Animations belong to the card, with defaults ☑

> Currently, I believe animations are tied to the card type, but I think they should be card/ability
> specific, with defaults to match offensive cards using offensive animations and support cards using
> support animations, this leaves the door open for future more complex animations but with defaults it
> won't create more data entry work in every case.

- `pose` + `animationArray` on a card / ability / intent, else its type's default
  (`honeycomb.art.cardPresentation`, `abilityPresentationFor`, `intentPresentation`). Offense lunges,
  Power rises, spells rise.

### 17. Sprites that are not 2:1 — answered

> Just to check, but how does the engine handle the player images not being 2:1? I imagine some
> animations will require more width. It could be a design limitation that only frontline attacks use
> wider animation images to avoid clipping party members. This is a very minor thing since we'll be
> redesigning battle UI later.

- A sprite is sized by HEIGHT inside a fixed-aspect frame with `overflow: hidden`, width `auto`,
  `max-width: 100%`. A wider pose image is therefore **scaled down to fit the frame width** (it shrinks)
  and nothing may draw outside the frame. Wide action frames need either a per-pose overscan (let the
  sprite layer overflow the frame, front member only) or an unframed layout — decide in 26.

### 18. Landscape battle is top-heavy; bigger piles ☐ (deferred to 26)

> At landscape resolution the battle scene appears top-oriented, (even though in code it seems more
> bottom-oriented, as when I open console on firefox the top half is squished offscreen), leaving the
> scene feeling not very organic and with too much dead space on the bottom. We certainly need bigger
> and better deck & discard piles for sure, though I'm not sure personally how to improve it further.
> This is likely something we'll need to consider when working on larger scale factors, specifically in
> regards to the battle UI.

- Layout work, so it belongs to 26. Pile viewing is asked for separately in **57**.
- ◐ **Round 03:** the draw and discard piles are card-shaped deck stacks now (FEEDBACK-03 item 1), and
  the "scene" layout (FEEDBACK-03 item 4) stands figures on the painted floor with plates under their
  feet, which takes up the bottom dead space. Whether it still reads top-heavy is Noodle's call.

### 19. Modular battles and victories; per-character rewards ☑

> It's important the battle scene and victory states are very modular. We need to account for how an
> event might trigger a battle, or how the victory screen could show the continuation of an event. The
> reward system should -try- and offer one card for each character if possible. Take these cases:
> 1 character in party: all three cards are character A
> 2 characters in party: one card each for A and B, 50/50 on the last one
> 3 characters in party: one card each for A, B, and C.
> 4 or more: Still only 3 rewards, but it's chance which characters are offered for.
> Note 1: By X characters in party, it actually checks "is there a character -who can add more cards to
> their deck- in the party", not a literal party count. This is important for characters with no
> possible card additions and minions/summons.
> Note 2: We will also need to account for neutral cards taking up a slot, like if the result of a
> specific battle wants to add a card to the reward pool.
> Note 3: The system also needs to be robust enough to count not just rarity, but cards should have
> requirements to appear as well (such that we can make costumes and other factors make cards more
> likely or guaranteed to appear)

- `combat.rollCardReward`: bonus slots (encounter `rewardCardArray`, `addRewardCard` effect, per-fight
  `rewardArray.cardArray`) → guarantees (`offerGuarantee`) → **the spread** over members who can gain
  cards (not temporary summons, not `canGainCards: false`, not an exhausted pool). All four cases tested
  over 20 seeds. `offerCondition` / `offerWeightArray` see the member as `source`; conditions
  `wearsOutfit`, `hasEquipment`. Offers print "For <name>" and join that character's contribution.
- Modularity: a fight carries a **continuation** (`combat.begin` settings) resolved by
  `honeycomb.combatContinuationArray` (map, event). `startCombat` effect + event **pages**
  (`pageArray`, `goToPage`, `victoryPage`); the victory screen shows the event's lead text. Fixture
  event **The Sealed Door** (Debug → Open the chosen event).

### 20. Prove the hand-placed map layout ☑

> For more complex map layouts, I'd like to actually see an example of one of those where a battle or
> event node is visibly out of place enough that I can confirm it's actually working.

- Backdrop **vaultShowcase**: the path climbs backwards to an event on "THE LOOKOUT" in the top-left,
  behind the entrance. Debug → **Show a hand-placed map**. The generator now paints labelled landmarks
  under every anchor of every anchored backdrop, so a node off its landmark is obvious.

---

## Larger-scale factors

> These next ones are larger-scale factors that need more attention. I predict they may need a session
> or two each:

### 21. The fantasy look, and art-pass groundwork ◐

> In general, the look of the game is very striking and strong, but I feel like many areas won't match
> the fantasy vibe the mockups sold me on.
> I don't have tons of explicit guidelines here. One small example is relics having a pretty small
> circular footprint, that's not a lot of space to show what the relic visually is and the circle can
> look nice in the prototype environment but moving towards a more directly fantasy one with more
> character might mean making the circle less emphasized. Please don't laser in on just that though,
> this factor is very overarching to the whole project. I do know a lot of it will require an art pass,
> so it may be worth laying more thorough groundwork here at this stage, like if we need a specific
> window shape CSS won't be able to do, the placeholder asset is roughly in the same shape as what we'll
> want for the final one so it's clear and easy for the art pass to identify and insert what's needed.
> The exception here would be battle UI for now since that's its whole own step.

- ◐ **Groundwork laid; the look itself is an ongoing art question.** Read against mockups 3–5, whose
  shared language is dark panels with **cut corners and thin metal trim** (gold for primary), cut
  buttons and tabs, and a painting behind every screen.
  - **UI frames as art slots.** Panels, overlay windows, buttons, primary buttons, tabs (active and
    not) and a new **item plate** are nine-slice images (`tuning.art.uiFrameArray`, CSS "UI FRAMES").
    The image is the element's whole face, fill included, so the cut corners come from its own
    transparency — no clip-path, no clipped shadows. Placeholders in `ui/frames/` are generated in
    roughly the final shape (cut, trim, a diamond where the corner ornament goes) and are
    manifest-protected, so a drawn frame is never overwritten (`--only ui` regenerates just these).
  - **Switched on only when the file loads** (and decodes): delete a frame and that element returns
    to today's CSS look. Layout is unmoved — the frame draws into padding.
  - **Relics and equipment sit on a square cut plate** (`ui.itemPlate`), larger than the old row icon —
    "making the circle less emphasized". (The last circles went in item 45.)
  - **Painted backdrop slots** for the title and teambuilding screens (`backgrounds/title`,
    `backgrounds/teambuilding`) over the existing gradients; empty until painted.
  - Kernel: a missing image path is remembered per session, so screens that rebuild on every change
    stop re-requesting absent backdrops (the tree tab's background already did).
  - Every slot, its size, slice and what wears it: **ART-GUIDE.md → "UI chrome"**.
  - Not touched: battle-specific UI (item 26's step), colour palette, fonts. Verified at 1280×720:
    teambuilding panels/buttons/tabs framed, deck window gold-framed, plates on the equipment rows.

### 22. Fully playable on mobile ☑

> We don't need to fully build around mobile portrait at this stage, but an absolutely essential
> constraint to note for this project is that it must be fully playable on mobile.
> This means we'll need to do an audit to make sure every important feature works on mobile as well.
> The big area to focus on with this is hover effects, every single one must have some kind of
> alternative to get the same information/gameplay function on a touchscreen device.
> It also means the game should be at least capable of starting in portrait and not falling apart
> before the user switches to a landscape view.

- Built this round with touch in mind but NOT audited: hand hover focus and the following keyword panel
  have no touch path yet; drags use Pointer Events so they work on touch.
- **Audited.** Every hover-driven site found: hand cards, map nodes, fighters (ability aim),
  progression nodes, clickable card faces, and every tooltip. The rule adopted everywhere: **tap to
  read, tap again to act** (`honeycomb.input`, kernel). The kernel records each pointer's type from
  capture listeners on honeycomb's OWN root and overlay host (never the document — Jiggy-safe);
  `input.tapToAct(key)` answers "act now?" and is always yes for a mouse, so **desktop is unchanged**.
  - **Hand:** first tap lifts/enlarges the card, focuses its owner, pins its keyword note, marks legal
    targets and brings the resting hand up (the hand sank on `:not(:hover)`, which a phone never
    leaves). Second tap plays it — or tap a legal target to play it there, easier than dragging on a
    small screen. Dragging still works. Tapping the field puts it down.
  - **Map:** first tap previews a node and rings it, second travels; unreachable nodes preview on tap.
  - **Tree:** first tap shows the node's tooltip and lit route, second buys; holding still gives back.
  - **Abilities:** first tap on a target shows the forecast, second uses it.
  - **Clickable cards** (rewards, shop shelves, card pickers): gated in `ui.card` itself, so a phone
    player reads a reward (its zoom opens on the tap) before taking it.
  - **Tooltips:** a tap shows the panel beside its anchor (`tooltip.onTap`); a tap on anything without
    one hides it (`data-hcTip`). Browsers disagree on whether a tap raises mouseenter, so neither is
    left to them.
  - **Roster** rows pan vertically, so a long roster scrolls under a finger; a browser-claimed scroll
    no longer counts as a tap. Add with the + toggle, reorder by dragging along the strip.
- **Portrait:** a narrow screen held upright gets a full-screen "Turn your device sideways" note (CSS
  media query alone, so rotating hides it; "Play anyway" dismisses it; the game keeps running under it).
  Portrait itself is NOT laid out — teambuilding's four columns overflow sideways there — per the brief
  ("don't need to fully build around mobile portrait at this stage").
- **Verified at 667×375 with touch emulation:** combat (tap-read, tap-target play: Sporeling 30 → 25;
  untargeted tap-tap), map (tap preview, tap travel), tree (tap tooltip, tap buy), card gate
  (touch 0 → 1, mouse immediate), teambuilding fits. Real finger taps could not be driven with the
  pane hidden; synthetic touch pointer events through the real handlers were used instead.
- **Left for later:** the in-tab tree's labels are ~8px on a phone (tap shows them full size); the
  portrait art column squeezes to a sliver at phone width. Both are layout questions for 26/21.

### 23. Enemy attacks as cards ☑

> Enemy attacks should be displayed as cards. This gives the impression they are playing by the same
> rules as the player, and allows for more complex enemy behaviors to be easily conveyed to the player.
> Rather than a floating icon above the enemy's head, we can instead display the card the enemy is
> about to use, and instead of placing it above them, it can be more present in their space waiting for
> the player to hover over it. Clicking on an enemy could also show their list of attacks, hiding
> unseen cards. When an enemy attacks, coming up with a system that lets the player read enemy card
> effects will be a challenge but will certainly be highly rewarding, and they don't need to stick
> around for a crazy long time due to an upcoming step. Our primary inspiration here would be
> hearthstone, with the card moving out from the enemy's space and enlarging to show it's the one using
> this card. This does bring up the matter of animation length, but since we aren't using magic numbers
> we should be able to add in faster and slower play modes as well as test various speeds.

- Carries the "bosses get additional turns" idea from 10 — **not built**; it is a rules change, and
  nothing here blocks it.
- **An intent is a card.** `honeycomb.intentCard(enemyIndex, intent)` shapes an intent like a resolved
  card, so `ui.card`, the generated rules text (live: the enemy's Strength/Weak show, coloured) and the
  keyword sidecars all serve it unchanged. Intent types carry a `cardType` (attack/debuff → Offense,
  defend → Support, buff/special → Power); an intent may name its own. No cost bubble, `partyShift:
  "none"`, a red edge so a glance says whose card it is. `ui.card` now takes an `artChain` (the enemy
  in the intent's pose, falling back to standing).
- **In their space:** a small copy leans out of the top corner of the enemy's window (outside the frame,
  which clips; on the fighter, so a lunge doesn't drag it). Its text is hidden at that size — the number
  that matters rides on a badge, and **hovering opens it full size** with who it's aimed at.
- **Clicking an enemy** (or its card) opens **its moves**: seen ones face up with this enemy's live
  numbers, unseen ones face down, the next one marked, and its habit named ("Uses its moves in a fixed
  order" / "Picks at random…"). Seen = telegraphed at least once: discovery kind **intent** ("Enemy
  moves seen"), which pays nothing and is noted even with experience off (`discovery.note`). A click, so
  touch gets the full card too. The card back is CSS until `cards/frames/enemyBack` exists.
- **Playing it:** the card flies out of the enemy's corner and enlarges over the battlefield (FLIP on
  `transform`), holds, then fades as the move lands — the small copy steps aside meanwhile so it reads as
  one card moving. `tuning.animation.enemyCard*` (reveal 260 / hold 700 / leave 240 ms, height 62% of
  the field); the battle log keeps it readable afterwards, so the hold is a glance.
- **Play speed:** `tuning.animation.playSpeedArray` (0.7× / 1× / 1.6× / 2.5×), chosen with a button
  beside Log in combat, kept on the profile. `honeycomb.duration` multiplies it in, and CSS durations are
  rewritten on change, so every timed thing follows. Test [47].
- Verified in the browser: hover zoom, move list (1 of 3 seen), Slam enlarging to "Deal 13 damage…"
  with Strength shown, speed cycling, no leftovers after the turn.

### 24. A battle log ☑

> To add on to the previous, we should have some kind of event log system that tracks the history of
> the battle, allowing the player to read effects they may have missed or misunderstood.

- **History** (`honeycomb.battleLog`, honeycomb-combat.js): `combat.historyArray`, written from
  `honeycomb.logEvent` — the one door every entry passes through, so nothing can happen without being
  recorded. It lives on the combat state, so a rewound choice or a forecast rolls it back with
  everything else (the log never shows a play that didn't happen), and it saves with the fight. Only the
  kinds worth reading are kept, as plain values; capped at `tuning.battleLog.maximumEntries`.
- **Reading** (`honeycomb.battleLogView`, honeycomb-overlays-combat.js): a **Log** button beside the
  draw pile (a button, so touch reads it too) opens the fight in words, grouped "Turn 2 · Enemy turn",
  newest at the bottom. `honeycomb.battleLogWordArray` words each kind — one entry per kind, so a new
  event is a table row. Names coloured by side, duplicate enemies numbered ("Sporeling 2"), draws folded
  ("Drew 5: …"), random outcomes tagged RANDOM, cards/statuses hover for their tooltip, each line's edge
  coloured by kind (harm / shield / heal / status / play / enemy).
- Intents had no display names: `honeycomb.intentName` spells an index out ("windUp" → "Wind Up") unless
  the intent carries a `name`. Item 23 will use it too.
- The Iron Sigil now logs the Shield it grants (it wrote `block` directly, so the log could not say
  where the opening Shield came from). Test [46].

### 25. The shop's floating elements ☐

> The shop menu is closer to the ideal but lacks the floating elements present in the mockup.
> As seen in that mockup the final layout will have the shop's inventory window sliding in and floating
> against a darkened background, so the shop's contents will need to be better wrapped and positioned
> in a more appealing way.

- See 44 (floating board for events too), 46, 47.

### 26. Battle layouts as data — "jumbo" first ◐

> We do at some point want to experiment with other battle UI layouts.
> The windowed approach works well for the purely front-facing style we're using, but when I look back
> at the mockups I worry we may wish we'd gone with smaller avatars.
> The main reasons for this being wanting to show off backgrounds, wider animations not wanting to be
> contained in windows, depicting larger enemies, and especially if the player will be expected to form
> party sizes larger than 3.
> I would say we should try making various layouts saved as arrays that let us easily tweak each
> layout's specifics such as element position and size. When we reach this step we should do a full
> exploratory session just creating and trying out multiple different layout types. Our first can be
> our current layout, with large character windows we could save it as the "jumbo" layout. It's what
> looks the strongest against blank backgrounds right now, maybe it could have some use elsewhere.
> Important: This step blocks the following ones, since we don't want to spin our wheels perfecting
> what might be about to change. But crucially this should just be a layout step, so it shouldn't block
> any work above.

**Ordering rule from the quote: 26 blocks 27 and 28. It blocks nothing above it.**

- ◐ **System built and verified; the exploratory session itself is Noodle's call.** `tuning.battleLayout.layoutArray` holds named layouts; each is a
  full set of the numbers the battlefield is drawn from (window shape/height, sprite heights, vitals
  height, fighter widths, gaps, floor, backdrop strength, the enemy card's size/place, hand card
  height). `honeycomb.battleLayoutPropertyArray` maps each to its CSS variable; yes/no fields are flags
  that add classes (`framed: false` → `hcUnframed`). **jumbo** = the current numbers exactly; **stage**
  (no windows, smaller figures, backdrop at 85%) and **crowd** (narrow windows for 4+) are starting
  points for the exploratory session. Debug-only **Layout** button in combat cycles them (remembered on
  the profile; `defaultLayout` sets the starting one).
- A layout may OMIT a number: the stylesheet's own fallback applies, and the variable is removed so a
  previous layout's value never lingers (jumbo keeps its original clamped spacing that way).
- The enemy's card is now placed down from the fighter's WINDOW top, not the column's, so it stays on
  its window in layouts with shorter windows.
- Verified at 1280×720: jumbo unchanged; stage has no windows, figures on one floor, backdrop showing;
  crowd has narrow windows filled by the art. Numbers were tuned for 16:9 — on a squarer window a
  width-limited fighter gets a tall, emptier window (a CSS limit worth knowing while exploring). Test [48].
- **Still blocks 27 and 28**, per the quote, until a layout is chosen.
- **Round 03 (FEEDBACK-03 item 4):** Noodle chose "somewhere between Jumbo and Stage". Built as
  **scene**, now the default. Once Noodle confirms it, 27 and 28 are unblocked.

### 27. Nameplates ☐ *(blocked by 26)*

> The UI hovering over character standing sprites could use a massive glow-up, I'll call them
> nameplates, they don't look appealing.
> They could use a lot of attention to make the names fit-in more, and most notably the health/shield
> bar itself doesn't look appealing. Forecasted health changes as a candycane isn't the way to go.
> Because the images themselves are static having some kind of life or animation to the UI could go a
> long way, I think this is how incoming predicted damage should be shown. I'd like for the prediction
> to show the resulting numbers too, but you'll need to do plenty of finagling to fit all the numbers
> onboard, so it's up to you whether that's viable or not.
> We should also add some kind of simple mechanic to each of our starting trio to help define the space
> for future character/outfit-specific UI to set on the nameplate. Brienne's could be a secondary
> resource bar. Severine's could be three orbs that turn red as conditions are met. Nettle's could be an orb
> with an image inside and text next to it. Those should cover the main three use cases for nameplate
> UI elements.

- The candy-stripe is already gone (pulsing segments, numbers on the bar) as part of 11/12. The redesign
  itself waits for 26.

### 28. Abilities ☐ *(blocked by 26)*

> Abilities also need a massive glow-up. The small button, the placement below the feet, needing to
> click it to open the list, being below the characters instead of incorporated into the character's
> UI, etc. In addition to it needing a complete overhaul, rather than being available by default they
> should have a robust system of placing conditions required to use them, we may need to add ways for
> statuses to persist between battles and events for this, and the button which opens them would glow
> when an ability is ready.

---

## Second batch (collected while the session limit reset)

### Teambuilding scene

#### 29. Drag feedback: shift the party aside ☑

> Dragging characters could be made to feel better by moving and shifting characters out of the way of
> the intended drop site.

- `teambuilding.previewDrop`: while held over the strip, everyone slides (on `translate`,
  `shiftPreviewMs`) to where the drop would put them. The gap is marked by the held member's own faded
  portrait, or by the first empty place slid into position for a roster newcomer. Off the strip nobody
  moves; the held member just fades ("let go and they leave"). Places are measured once at pick-up so
  a slid portrait never attracts the drop. Closes item 3 too.

#### 30. Progression tree inside the tab, vertical ☑

> Progression trees would be better shown inside the progression menu than in a separate window,
> descending vertically so they fit in the skinny window slot. Please do make sure we can display
> tooltips for them.

- The overlay is gone; `honeycomb.progressionScreen.renderTab` draws the tree DOWN the tab (file name
  kept, so index.html/mobile.html are untouched). Authored coordinates are turned on their side — a
  node's `x` becomes its height, `y` its place across — and stretched to the tree's own extent, so no
  tree needed re-authoring. Layout numbers: `tuning.progression.treeView`.
- Tooltip kind `treeNode`: name, rank, description, the price and where it comes from ("20 from
  Brienne's own, 20 from the global pool"), why it is locked, how many steps away.
- Header shows the two pools as chips (personal face + global star), "N taken · N open · N invested",
  a notice line, the gesture hint, and Reset.
- A rebuild used to throw scrolled panels to the top; `honeycomb.scene.refresh` now keeps the scroll of
  anything carrying `data-hcScrollKey` (the tab body is keyed by tab + character).
- **Also fixed:** teambuilding edits (tree purchases, loadouts, party order) were never written to
  storage until a run started — a closed tab lost them. New autosave point `teambuilding` fires on every
  rebuild of that screen.

#### 31. Ranked nodes ☑

> The progression tree should allow for ranks of upgrades. Right-clicking / long-clicking could be what
> decrements them since we no longer can be sure it'll be a simple on-off toggle.

- `rankMaximum` on a node (default `tuning.progression.defaultRankMaximum` = 1); optional `costArray`
  prices each rank. A rank = one more copy of the index in the selection list, so old saves need no
  migration and `selectedNodeArray` hands the pipeline one copy per rank — health/cards/hooks stack,
  tags and abilities (sets) don't double. `unselect` gives back ONE rank; dependants only fall with the
  last. Test content: Brienne's **Trained** is 3 ranks, +5 Max HP each.

#### 32. Node requirements; exclusive first nodes ☑

> Allow for progression tree nodes to have requirements, to test a practical use case have Brienne's
> first two progression nodes be exclusive, visibly locking off the other.

- `requiresArray` entries may now be `{index, rank}` ("at least N ranks of it"); `exclusiveGroup` names
  a one-of set. **Set Stance / Keen Edge** share `briPath`. Refusal reason `excluded` + `view.excludedBy`
  (which node locked it) + `view.sealed` (every route shut). A save holding both keeps the EARLIER pick
  and refunds the later.
- Consequence: **Paragon** used `requiresAll` of both halves, which exclusivity makes impossible — it now
  takes either route. No content uses `requiresAll` now; the engine still supports it.

#### 33. Show the path to a locked node ☑

> Highlight the shortest node path(s) required to unlock a node when a player hovers over one they
> haven't gotten the prerequisite for.

- `honeycomb.progression.pathTo(selection, node)` → `{stepCount, nodeIndexArray, edgeArray}` or null when
  sealed. Fewest nodes; ties are ALL kept (two equally short routes both light up); rank requirements
  count missing ranks; routes through an excluded node are not offered.

#### 34. Personal vs global experience ☑

> Please visibly separate personal experience from the global experience obtained through game
> completion. Personal experience is gained by a character defeating enemies and winning runs (split
> among the party), global experience is tied to game completion.

- **Rule chosen:** a discovery kind's `firstExperience` → GLOBAL pool (finding things = completion);
  its `baseExperience` → PERSONAL, split among the party (doing things). A first-time earn pays both;
  meeting pays only the global part. Winning a run pays `runVictoryExperience` (100) personally.
  Split: equal shares, remainder one each from the front; downed members are paid too.
- **Spending (a choice made here — say if it should differ):** a node spends the character's own
  experience first, then the global pool (`spendOrder`). Every rank bought is written to a ledger
  (`profile.progressionPaidArray`) so a refund returns each point to the pool it came from — respec can
  never move experience between a character and the cast.
- Shown apart everywhere: victory screen (global tile + a row of faces with each member's share),
  region/run-cleared screen, title hub ("Global Experience" + a chip per character).
- **Bug found and fixed:** tree-node hooks never fired (`hookSourceArray` read equipment and outfit by
  hand and skipped progression), so Paragon's +1 Shield, Virulence and Deep Thirst did nothing. It now
  reads `memberCardModifierArray`, the one list of everything a member wears or bought. Test [44].

#### 35. Character tags as icons ☑

> Character tags would be better as icons with tooltips. These tooltips would ideally use the previous
> tag names as titles, then a divider line, then a brief description of the tag.

- `honeycomb.tagArray` entries gained `glyph` + `description` (optional `iconPath` for drawn art).
  `ui.tagRow` draws a tinted icon for any tag with a glyph, chips for the rest. New tooltip kind `tag`:
  name as title, the heading's rule as the divider, then the description. New glyphs: person, venus,
  mars, paw. Descriptions are placeholder copy — worth a pass.

#### 36. Card hover gives every card the same frame (bug) ?

> The hover effect for all cards on the teambuilding menu makes all the cards have the same frame.

- Not reproduced in Chromium: every card and every hover zoom keeps its own type tint. Need to know the
  browser (Firefox was used for console earlier) and which view — List rows, Cards grid, or the zoom.

#### 37. Equipment is exclusive ☑

> Equipment should be exclusive and only wearable by one character at a time, displaying the icon of the
> character wearing it.

- One wearer across the WHOLE roster — fielded members and benched characters' remembered loadouts
  (`honeycomb.equipment.wearerOf / takeFrom`, honeycomb-state.js). Clicking a piece someone else holds
  takes it from them, with a notice ("Whetstone taken from Nettle."). Their face shows on the row.

#### 38. Remembered loadouts; limited equipment ☑

> Save a list of equipment worn on a character, the default sort should show most recently used in an
> actual run first. Because managing a large party's equipment could get too complex, we should limit the
> amount of equipment usable.

- A member leaving the party keeps outfit + equipment (`profile.loadoutArray`); rejoining restores it,
  minus anything someone fielded now wears. `teambuilding.loadoutFor` is what every preview reads.
- `profile.equipmentHistoryArray[character]` records what each member took into an actual run, most
  recent first (`equipment.recordRunUse`, called by `newRun`). Sort **Recent** is the tab's default
  (`tuning.equipment.defaultSort`). The limit is item 41.

#### 39. Equipment rarity, sort and filter ☑

> Equipment should also have rarity, we'll also want some sort and filter buttons for the equipment tab.

- `honeycomb.equipmentRarityArray` (common / uncommon / rare / heirloom, each with a colour and sort
  order) and `honeycomb.equipmentSlotArray` (weapon / armour / trinket / heirloom). Tab controls: sort
  Recent · Rarity · Name · Slot; filter chips per slot + "Found". Rows are tinted by rarity; tooltip
  kind `equipment` names rarity and slot.
- **Revised by FEEDBACK-03 item 5:** slots and the heirloom rarity are gone; kind is generic/heirloom.

#### 40. Starting relics become equipment ☑

> Starting relics should be replaced with equipment entirely, and some equipment should be made
> character-exclusive. This makes the old "Starting Relic" section a great place to display current
> equipment.

- Iron Sigil / Shadow Locket / Crimson Fang are now **heirloom** equipment (own slot, `characterIndex`
  = Brienne / Nettle / Severine) and gone from `relicArray`. Characters carry `startingEquipmentArray`; a
  selection with no `equipmentArray` at all means "starting equipment". Same effects as before: the
  Sigil's hook shields every ally once; the Locket folds once through its wearer;
  `fireRunHooks` now reaches worn equipment, so the Fang still hears enemies fall. All 449 old tests
  pass unchanged except two that named the relics.
- The detail column's "Starting Relic" section is now **Equipment N / capacity**, listing what is worn.
- **First real save migration** (`save.migrationArray`, format 1 → 2): an old profile's saved party is
  dressed in its heirlooms, and a run in progress has its starting relics moved onto their owners —
  otherwise old saves would silently lose their starting relic. Test [45].
- Verified in the browser: a fresh run from the teambuilding screen gives every ally 4 Shield (Sigil)
  and 4 energy on turn 1 (Locket), carries no relics, and records the run in the equipment history.

#### 41. Equipment capacity from unused party slots ☑

> Track maximum vs unused party slots to determine how many pieces of equipment a character can have. If
> they ever have too many, still allow them to equip it but grey out the equipment and have a tooltip say
> "You have too many party members for this to be equipped!"

- `equipment.capacity(partySize)` = `baseCapacity` (1) + `capacityPerUnusedPartySlot` (1) × empty
  slots. Max party 6: a full party gets 1 each, a party of 3 gets 4. Pieces past the limit stay worn but
  greyed, with that exact tooltip text; `newRun` leaves them behind and previews ignore them.
- **Revised by FEEDBACK-03 item 9:** capacity is now keyed to a party of three (1 each), +1 per member
  short of it. The greyed-piece behaviour is unchanged.

### Map / event scene

#### 42. Trapped on the map after a refresh (P0) ☑

> Refreshing while on the map sometimes leaves me unable to make any legal choice. I couldn't save it as
> I needed to test other things, but the tip "Nowhere left to go" was stuck on screen, if that helps.
> This was while you were editing things so maybe I got trapped mid-change, but it'd be real bad if the
> player were ever trapped on the map.

- **Real bug, not the edits.** A node is autosaved as entered BEFORE its screen opens. Reloading while an
  event, shop or treasure was open resumed to the map standing on an unfinished node — and an unfinished
  node offers no moves. Resume only ever restored fights.
- Fix: `honeycomb.resume()` (boot and title Continue) calls `honeycomb.map.resumeUnfinishedNode()`, which
  re-opens the node's screen (safe: nothing a node does is saved until it completes, RNG included), opens
  Region Cleared if the boss is down, and steps back if the current node no longer exists.
- Guarantee: with no moves on offer the map panel now always has a button ("Pick up where you left off"
  / "Go down"). Test [39].

#### 43. Health changes previewed with a mini party ☑

> Resting at the campfire and events which affect party health need a tooltip to appear to show the
> resulting changes. This means making a mini party ui with health bars, not just text showing the
> number changes.. The aftermath for these events also needs to display the changes that just occurred.

- `honeycomb.forecast.forEventChoice` dry-runs a choice; `honeycomb.ui.miniPartyRow` draws the party
  (portrait, bar with a breathing change segment, "68 → 60"). Shown INLINE under any choice that moves
  health rather than as a hover tooltip, so it works on touch (item 22). The result view shows the same
  row for what actually happened (`eventOverlay.aftermath`).

#### 44. Event board, permanent vignette ☑

> Event titles go offscreen. I think the dark vignette should be permanent and event/shop details are
> tied to a floating board with slides onscreen, this means I can make event art in a square aspect
> ratio without needing to work on visual details only visible for half a second.

- Scene events: permanent `.hcEventVignette`; the details sit on a **floating board** (inset from every
  edge, below the top bar — the title can no longer tuck under it) that slides in; the event's
  `imagePath` shows as a **square** in the space the board leaves (`.hcEventArtSquare`); a speaker stands
  in front of it. The shop shares the board structure, so it floats too. HC-PLACEHOLDER frames marked.

#### 45. Artifacts in the top bar ☑

> Please remove the artifact list below the party health bars, remove the keys ui section and add an
> artifacts one (placing it after the deck), showing the artifact icons. If it gets too large show a ...
> Clicking anywhere on this artifacts list should open an artifacts window sort of like the deck list but
> for artifacts instead with their names and descriptions.

- Relic rail removed from the map; keys hidden from the top bar (`showInTopBar: false`, the resource
  still works). `honeycomb.ui.topBarRelics` shows icons after the deck, up to `topBarRelicsShown`, then
  "…"; the whole strip is one tap target opening the **Relics** window. No circular frames on the icons.

#### 46. Shop outfits as a large gallery ⏸

> Shop outfits should be much larger, likely a single column that extends to the bottom of the screen as
> a gallery for the alt outfits, with a description too so they know what they're buying.

#### 47. Shop UI elements coming (note) —

> Once we actually do start working on the shop, I've started working up some very basic UI elements to
> get started.

- Ask for them before starting 25/46.

### Battle scene

#### 48. Incoming damage and Shield ☑

> Incoming damage should account for the use/loss of shield.

- The dry run always applied Shield; the readout never showed it being eaten. The handover now logs an
  `entitySnapshot` after the enemy turn, and the Shield badge reads "4→0" (what the hits will leave). A
  hit Shield fully absorbs now marks the bar even though no health moves.

#### 49. Scrambled card text (bug) ☑

> The text on the Miasma card is borked in a really weird way, reading "lyPoison to ALL Weak to A...",
> did some text get scrambled up during a change or is it being caused by the new card elements? Likely
> the latter, as this seems to affect other instances where poison and shield are used too.

- Caused by the keyword highlighting: the text box is a flex container, so each keyword `<span>` became
  its own flex item. Text now sits in one inner `.hcCardTextBody`.

#### 50. Card-on-card selection as a slot window ☑

> Card-on-card selection should be replaced with a window with slots to drag cards into, that would
> allow for the selection of multiple cards at once. The hand should be focused again when the window
> pops up, the player should be able to cancel the window, and it should auto-pick if there's only the
> exact amount of options that it needs left (IE whetstone would auto-select for you if you only have one
> other card in hand).

- Engine: a card whose target mode picks CARDS no longer needs a drop target. Played, it ASKS through
  the choice system (first question, before anything is spent). A card question with exactly as many
  options as it needs answers itself (`honeycomb.automaticAnswer`), and the answer is recorded so replays
  stay exact. `count` on the target descriptor asks for several.
- UI: hand picks in combat get the **slot window** (`choiceOverlay.presentation "handSlots"`): one slot per
  card wanted, the overlay passes input through, the real hand comes back up in full focus with the
  allowed cards marked. Tap a card, or drag it into the window; click a filled slot to empty it;
  Confirm / Cancel (cancel leaves the card in hand). Other questions keep the grid.
- Whetted Edge plays on release like an untargeted card now. Tests [16], [42].

#### 51. Whetted Edge did not discount Drain (bug) ☑

> I think I noticed an instance where using Whetstone on a drain card didn't reduce it's cost, there
> could be some fundamental flaw with how card cost reduction works.

- Engine was right (reproduced: Drain charged 0), the FACE was wrong: `ui.card` printed the definition's
  cost. The hand now passes `honeycomb.cardCost` as `settings.cost`; a changed cost is coloured
  (green down, orange up).

#### 52. Card-to-reticle targeting ☑

> Given the changes we've made to combat there's no need to have the targeting arrow come from the card's
> owner given the focus changes, and it makes the position switching more confusing. When a card is being
> "dragged" it should enlarge and stay above the hand for easier reading, with tooltips appearing to the
> top right of the card, and the hand is dragging a sort of targeting reticle. The target line should go
> from card to reticle. This step should definitely be done before the big battle ui redesign since the
> hand is mostly in a good spot already.

- On commit the card lifts straight out of the fan (`heldCardLiftPercent`), upright, scaled
  (`heldCardScale`) and STAYS; the pointer drags `#honeycombReticle` (live/ally/cancel states). The line
  runs from the card's top edge to the reticle, for target-picking cards only. Keyword panels pin to the
  card's top-right (`tooltip.showPinned`). Replaced `dragScale` and the old follow-the-pointer drag.

#### 53. Drain heals for the damage dealt ☑

> The drain card should heal based on the damage it deals, since that's more complex than "deal X heal
> X", it'll be good to have it as a go-to/precedent.

- Value **`damageDealt`**: health damage the action has dealt so far, after Shield, read from a `tally`
  shared by every nested/overridden context. Drain = damage 4, heal `{index: "damageDealt"}` on the
  owner; reads "Deal 4 damage. Heal for the damage dealt." Tested against a shielded target.

#### 54. Card numbers reflect statuses ☑

> If it doesn't already, damage numbers on cards should change to reflect statuses on the user and on
> any target.

- `honeycomb.modifiedDamage` / `modifiedBlock` are now the ONE modifier pipeline (the real hit uses
  it too). Hand cards print numbers against the acting character; a held card re-prints against the
  target it is over. Changed numbers are coloured. Expressions ("equal to your Shield") stay words.

#### 55. Card tags vs character tags ☑

> Card tags and character tags should likely be completely separate. Thus there's no need for character
> tags in the deck list. Card tags should also be displayed on the card, but we'd only use them like
> hearthstone's spell schools. Have all of Nettle's poison have the "necromancy" tag to test with, that's
> the only one we need.

- **`honeycomb.cardTagArray`** (content-cards.js) is the card-tag registry, separate from the character
  tag table. One entry: **Necromancy**, on Wither, Miasma, Reap and Creeping Plague. All the old flavour
  tags (weapon, spell, blood…) were removed from cards. Printed after the type ("SUPPORT · NECROMANCY").
  The old `honeycomb.cardTagArray()` helper in tags.js was renamed `honeycomb.cardTags()`.

#### 56. Deck screen filters by type and card tag ☑

> Replacing the previous tag list, the deck screen should display card types then any present card tags,
> and clicking on them should filter the pool down.

- The Team Traits row is gone; the deck screen shows chips for the types present, then the card tags
  present, each with a count. Click to filter, click again to clear. Cleared on close.

#### 57. Pile viewers ☑

> Clicking the remaining deck and discard pools should open a window showing the cards inside them.

- Click (or tap) either pile. The window has tabs for Draw / Discard / Exhausted / Powers in play. The
  draw pile is shown alphabetically so it never reveals the draw order (`hidesOrder` on
  `honeycomb.pileViewArray`).
