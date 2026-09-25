# Honeycomb — MECHANICS-01: the mechanical exploration pass

Session 8 (2026-09-12/13, overnight). The brief is quoted verbatim below; **quotes are Noodle's and win
over any annotation**. This file is the plan AND the record: each part gets a status line as it lands.

Status key: ☐ not started · ◐ in progress · ☑ done

| Part | What | State |
|---|---|---|
| 1 | Example mechanics judged and scored | ☑ |
| 2 | Primitive list | ☑ |
| 3 | Brienne / Nettle / Severine: primary + 3 sister mechanics each | ☑ |
| 4 | 9 outfits + 9 relics, with placeholder art | ☑ |
| 5 | New card pool in, old one replaced | ☑ 65 cards, 16 statuses. Tests [64]; card-fit audit clean at desktop and 812×375; 0 content warnings |
| 6 | Three new characters | ☑ Cinder, Clemence, Cassadora. See part 6 |
| 7 | Noodle's feedback: retired outfits, Clemence rebuilt around breaking, Cassadora and Cinder fixes, refreshed starters | ☑ See part 7 |

### Where it landed (for the next session)

- **Cards**: `honeycomb-content-cards.js`, grouped per character as core then one block per sister
  mechanic. `honeycomb.archetypeArray` (same file) is the sister-mechanic registry.
- **Statuses**: bottom of `honeycomb-content-statuses.js`, same grouping.
- **Outfits and relics**: `honeycomb-content-characters.js`, marked "SESSION 8".
- **Engine verbs added** (all table-driven, all commented at the definition):
  effects `spendTemporaryHealth`, `consumeStatus`, `spreadStatus`, heal's `overflowToTemporary`;
  values `tally`, `debuffCount`, `combatStat`, `missingHealth`; conditions `isDowned`, `hasDebuff`;
  hooks `onTemporaryAbsorbed`, `onTemporaryDecayed`, `modifyTemporaryDecayFraction`,
  `onTemporarySpent`, `onOverheal`, `onEnergyGranted` (entity) and `onStatusApplied`,
  `onAllyHealthLost`, `onEnemyHealthLost`, `onAllyHealed` (world), `modifyOpponentDamageTaken`,
  `modifyOpponentLustGained` (party relics on the other team); status fields `redirectsAttacks` (Taunt,
  `honeycomb.tauntFilteredArray`) and `hookOrder`; `replaceSelfDamage` may answer `{redirectTo}`;
  `archetypeWeightArray` on any loadout piece (`honeycomb.archetypeWeightFor`, also filters the shop);
  `offerCondition` on relics (`honeycomb.relicOfferable`); `combat.partyDamageTakenThisTurn`.
- **World hooks now reach statuses a party member holds** (`fireRunHooks`), which is how a Passive
  card's status hears an enemy fall.
- **Bug fixed on the way**: Energised added its energy before the turn's energy was SET, so it never
  did anything. It now folds into `modifyEnergyPerTurn` and is spent on `onEnergyGranted`.
- **Renamed during the audit**: the Hemomancy card is *Blood Rite* (the name did not fit its band);
  the status keeps the name Hemomancy.
- **Taunt redirects only what the AI aims** and single-target modes that do not pick. A card the player
  aims at an enemy is never redirected (no enemy taunts yet).
- **Placeholder art**: `generate-placeholder-art.py --only characters` rebuilds outfits and card art
  without touching backgrounds.

---

## The brief

> Extra session of Honeycomb Catacombs designed to go on overnight. If rate limiting interupts you, please continue as normal afterwards. Please see !designDocs/honeycomb/BASICS.md for context regarding the project.
>
> We're at a point where the vertical slice is seemingly mechanically sound, which is a very big milestone. I think the game still needs a lot of work, most of the game's polish and sauce is waiting for the art pass, but before that I want to do a full mechanical exploration session, spruce up the characters we do have, add three more, and overall see how well you do on this step.
>
> Our design space is divided across these distinct layers:
>
> Primitives (Engine Verbs): The irreducible interactions supported by your game state (e.g., Look at top X cards, Damage Allies, Inflict Poison, Modify Card Cost, Exhaust/Banish This Card, Exhaust/Banish Other Card, Apply Status, Gain Lust, Spend Lust, Gain Temporary HP).
>
> Expressions (Mechanic Variants): How a Primitive is executed as a rule (e.g., for Look at top card: "Put on bottom," "Discard if Attack," "Play automatically if Cost = 1"). Expressions and mechanics do NOT always need to be named in game, sometimes they can just be a general common theme.
>
> Sister Mechanics (Vertical Archetypes): Intra-character branches. How one character uses a Primitive in divergent ways (e.g., Brienne could build temporary HP and deal damage simultaneously, go all-in on defense with riposte, or spend it as a resource ignoring the defensive value).
>
> Cross-Party Hooks (Horizontal Synergies): Inter-character interactions unique to team builders (e.g., Severine spending Brienne's temporary HP for effects, Nettle's poison dealing more damage from Severine's weaken, Applying setup status for ally execution).
>
> Every generated mechanic M is assigned a 4-point rating tuple (I, S_v, S_h, C) on a 1–5 scale.
>
> Metric - Code - Definition
> Identity - I - How intuitively the mechanic's math reflects its thematic flavor.
> Vertical Synergy - S_v - Interaction density within this primitive's design space.
> Horizontal Synergy - S_h - Interaction surface area with other mechanics.
> Cognitive Load - C - Rules complexity vs. mechanical payoff (Less complex is generally better, but highly complex mechanics are fine if kept rare).
>
> (Also worth considering is parasitism: How much does the mechanic do to benefit the player on its own, vs how much babying setup does it actually need to give that benefit. This isn't scored by itself since the mechanic can always be used as a cost for some beneficial effect.)
>
> For your perusal I've included a large list of mechanics inspired by ones from other games in !designDocs/honeycomb/example_mechanics.md. Please look through them and judge if each of them is a good fit for honeycomb's engine, noting if they are something that should be translated and added to your list of primitives (some of them may just be variations on the primitives you already have, that's fine), and assign them a score. Be strict, giving something a 5 in a category is essentially saying it is the best at that category in the entire list, giving something a 5 in all categories may as well be telling me to drop everything and add this to the game immediately even if police were knocking at my door.
>
> Once you have a satisfactorily complete list of primitives, the next step is to recognize the primitives our current cast has:
> Brienne: Temporary HP
> Nettle: Poison
> Severine: Dealing Damage
>
> For each of them, draft a primary mechanic for their default outfit. The expression should be relatively straightforward, it's entirely fine if at the end of this step their mechanical identity is the same as it is in the current build of the game.
>
> Create (or pick from exampleMechanics) 3 Sister Mechanics (at least one must be an offensive or directly rewarding application, at least one must be a setup/utility application). Whichever ones you pick/create should have Cross-Party Hook potential with mechanics present on the other two characters.
>
> Then, design 1 new outfit and 1 new relic for each of those sister mechanics which exemplify, enable, or pay off those mechanics.
>
> Note that alternate costumes can either make it easier to get cards from a certain mechanic by increasing obtainment rates for specific cards, give you the tools for that mechanic right away, or completely block off sister mechanics to ensure you always get the mechanic associated with the costume, all at your discretion to maximize the fun of the play experience..
>
> Create a new card pool built around the new mechanics chosen and add associated relics. I will leave the specifics of card pool creation up to you so long as you feel the pool is wide and deep enough to express the mechanics behind it. Keep in mind though that mechanics can be enabled (actually triggering the primitive), paid off (rewarding you for triggering the primitive), or enhanced (the behavior of the primitive itself is enhanced). Here's an example of all three as effects:
>
> Choose One - User is presented with X options, choosing one of them.
> Enabled: Draw a Choose One card from your deck.
> Paid Off: Whenever a card makes you Choose One, draw a card.
> Enchanced: If you would Choose One, Choose Two instead.
>
> Add in the new card set, replacing the old one. Then add the outfits you designed with placeholder images, add in whatever functional code they require to help their mechanic and again maximize the play experience.
>
> Once all of that is finished I have three new characters for you to create, their base images are stored in v13 spire images/_source/characters. All the tools required to create placeholder images for them should already exist, I'll leave their details up to you.

Added once the session was underway:

> Three additional things:
> - Please have Skull's final identity be distinct from Necro (aka Nettle) all the way down to the primitive level.
> - You don't -need- to stick with each character's current primitive, you may change them at your discretion, we are redesigning the card pool after all.
> - If I had any preference to guide you in a particular direction, it would be that I have a slight inkling against mechanics already present in Slay the Spire, since our game so obviously takes inspiration from it and we'll doubtlessly be compared. But I'm absolutely not saying exhaust, retain, strength, etc. any of those are off limits.

(The file is `exampleMechanics.md`; the brief calls it `example_mechanics.md`.)

---

## Part 1 — The example mechanics, judged

### How to read the scores

- **5 means best in the whole list for that metric**, so there are very few. Every 5 given, and why:
  - **I5**: *Mounted* (a mount IS a pool of health you fall off when it runs out) and *Psychosis* (it
    runs on the Broken state, which only this game has).
  - **S_v 5**: none. No single mechanic on the list is dense enough on its own; density comes from how
    a character's cards are built around one.
  - **S_h 5**: *Taunt* (every ally benefits, every enemy attack interacts) and *Cruelty* (every debuff
    any character applies turns it on).
  - **C 5**: *Opener* (one flag, obvious on read, and the engine already has it as Innate).
  - Nothing has more than one 5. Nothing is "drop everything".
- **C is scored so that higher is better**: 5 = very light rules for what it pays out, 1 = heavy rules
  for little. "Highly complex but fine if rare" mechanics score low here and are flagged *rare only*.
- **Verdict**: **New verb** = worth adding to the engine as a primitive · **Expression** = a rule built
  from verbs the engine has, no new verb needed · **Have** = already in the game · **Poor fit** = not
  recommended, with the reason.
- **StS** marks a mechanic Slay the Spire (1 or 2) already uses prominently, per the late note about
  comparisons. It lowers nothing on its own; it is a tie-breaker when choosing.

### The table

| # | Mechanic | Verdict | Maps to | StS | I | S_v | S_h | C | Note |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Adapt | Expression | Apply Status + Choose One | | 3 | 2 | 4 | 3 | A pool of 9 is a lot of text to read in a fan; 3 hand-picked buffs per card reads fine |
| 2 | Affinity for X | New verb | Card cost from a value | | 4 | 3 | 4 | 4 | "Costs 1 less per 6 Temporary HP" reads the board; cost is already hook-driven |
| 3 | Build-a-card | Poor fit | — | | 2 | 2 | 2 | 1 | Several windows per card; upgrade paths already cover "choose what it becomes" |
| 4 | Combo | Expression | cardsPlayedThisTurn | ✓ | 2 | 2 | 3 | 4 | With a shared 3-character hand it is almost always on, so it adds no decision |
| 5 | Living Dangerously | Expression | Add Card To Pile (curse) | | 3 | 3 | 4 | 4 | Curses are a live system (Wisp, Dread); a good cost |
| 6 | Bullet | Expression | Add Card To Pile (token) | ✓ | 3 | 3 | 3 | 4 | Shiv-like; fine as a sub-theme, not a character |
| 7 | Mixture | Poor fit (for now) | Hand watcher | | 3 | 3 | 2 | 2 | Needs a hand-watching pass the engine does not have |
| 8 | Corpse | Expression | onAllyDowned / onBroken | | 3 | 2 | 3 | 4 | Party members break, not die; reads as "when an ally Breaks" |
| 9 | Motivate | Poor fit | Hand watcher | | 2 | 2 | 3 | 3 | Invisible unless the hand shows it |
| 10 | Counter | **New verb** | Cancel an enemy intent | | 4 | 2 | 3 | 4 | Enemy moves are real telegraphed cards here, which makes this unusually clean. Rare-strength |
| 11 | Customize | Poor fit | — | | 2 | 2 | 1 | 2 | Upgrade paths cover it |
| 12 | Memento | Expression | onBroken | | 4 | 2 | 3 | 4 | "When its owner Breaks" is strongly on-theme |
| 13 | Generate (any) | New verb | Choose 1 of N into hand | ✓ | 3 | 2 | 3 | 4 | Discovery; generic |
| 14 | Generate (a pool) | New verb | same, from a tagged pool | ✓ | 4 | 3 | 3 | 4 | Better than 13 because the pool carries identity |
| 15 | Protection | Expression | Status veto on damage | | 4 | 2 | 2 | 4 | Binary; overlaps Temporary HP, which the game deliberately moved to |
| 16 | Delay | **New verb** | Scheduled effect | | 4 | 3 | 3 | 3 | Pairs with telegraphs: the player can see it coming, so can the design |
| 17 | Discard | Have | discardCard / discardCards | ✓ | 3 | 3 | 3 | 4 | Good as a cost |
| 18 | Double/Triple | Expression | Return to hand, capped | | 3 | 2 | 2 | 3 | |
| 19 | Drain | Have | damage → heal (damageDealt) | | 4 | 3 | 3 | 4 | Textbook, and already Severine's |
| 20 | Fish Up | New verb | Look at pile + reorder | | 2 | 2 | 3 | 3 | Deck manipulation is invisible in a shared deck |
| 21 | Sink | Expression | Move card to bottom | | 2 | 2 | 2 | 3 | |
| 22 | Echo | Expression | Temporary copy to hand | | 3 | 2 | 3 | 4 | |
| 23 | Enrage | Expression | Value: missing health | ✓ | 4 | 3 | 3 | 4 | Interacts with tHP (missing health behind gold) and with Broken |
| 24 | Excavate | Expression | Run counter + pool | | 3 | 3 | 2 | 3 | |
| 25 | Partner | Expression | Reward adds companions | | 3 | 2 | 3 | 4 | |
| 26 | Finale | Expression | Energy reaching 0 | | 3 | 2 | 3 | 4 | Energy is shared, so "last energy" is a party decision — mildly interesting |
| 27 | Forge | New verb | Per-instance charge | | 4 | 3 | 2 | 3 | |
| 28 | Shift | Expression | Transform in hand | | 3 | 2 | 4 | 2 | |
| 29 | Revenge | Expression | Took damage since last turn | | 4 | 3 | 4 | 4 | The front of the party takes the hits, so it is a position card too |
| 30 | Fusion | Poor fit | Card onto card | | 3 | 2 | 3 | 2 | Cards are never dragged onto cards here (choice windows instead) |
| 31 | Desperation | Expression | Hand size | | 3 | 2 | 2 | 4 | |
| 32 | Hero | Poor fit | Replace a party member | | 3 | 1 | 2 | 1 | A whole character swap mid-fight; the teambuilding screen is where that lives |
| 33 | Highlander | Poor fit | Deck has no duplicates | | 2 | 1 | 1 | 3 | Three starter decks make it impossible |
| 34 | Exact Damage | Poor fit | — | | 2 | 1 | 2 | 2 | Fiddly even with the forecast |
| 35 | Blessing | Expression | Ability charges / power | | 3 | 2 | 3 | 4 | Abilities exist with charges |
| 36 | Parasite | Expression | Hand watcher on damage | | 4 | 3 | 3 | 3 | |
| 37 | Inspired | Expression | Ability used this turn | | 3 | 2 | 2 | 4 | |
| 38 | Family | Expression | partyHasTag count | | 3 | 2 | 4 | 4 | Tags already exist; very teambuilding |
| 39 | Minion | Have (summon) | Summon | ✓ (StS2) | 4 | 4 | 4 | 3 | Strong, but Slay the Spire 2 has a minion character; deliberately not used for Skull |
| 40 | Movement | Have | shiftParty | | 4 | 3 | 4 | 4 | Party order is a live system nobody owns yet |
| 41 | Prime | Expression | Add upgraded copy to pile | | 4 | 3 | 2 | 4 | |
| 42 | Prophecy | Expression | Delay (16) + cost | | 3 | 2 | 2 | 2 | Delay does this more simply |
| 43 | Edge | Poor fit | Hand position | | 2 | 1 | 1 | 2 | The fan reflows; unreliable on a phone |
| 44 | Overheal | **New verb** | Healing past maximum | | 4 | 3 | 4 | 4 | Excess becoming Temporary HP is a natural bridge between two systems |
| 45 | Exceed Limits | Expression | Less energy next turn | | 4 | 2 | 3 | 4 | Shared energy makes the whole party pay |
| 46 | Quest | Expression | Lingering objective | | 3 | 3 | 3 | 2 | Rare only |
| 47 | Quickdraw | Poor fit | Drawn this turn | | 2 | 1 | 2 | 3 | Every card in a discarded hand is drawn this turn |
| 48 | Ramp | Expression | Permanent energy | | 3 | 2 | 3 | 4 | Base energy is 3 for the whole party: rare only |
| 49 | Return | Expression | Discard → hand on condition | | 3 | 3 | 3 | 3 | |
| 50 | Rhythm X | Expression | Nth card this turn | | 3 | 2 | 3 | 3 | |
| 51 | Scaling | Expression | Per-instance counter | ✓ | 4 | 3 | 2 | 4 | |
| 52 | Secret | Poor fit | — | | 2 | 1 | 1 | 2 | The forecast system exists to show what things do |
| 53 | Silence | Have | removeStatus / removeTemporaryHealth | | 3 | 2 | 2 | 4 | |
| 54 | Start of game | Expression | onCombatStart from deck | | 3 | 2 | 3 | 4 | |
| 55 | Spellboost | Expression | Supertype watcher | | 3 | 3 | 4 | 3 | Supertypes (Damage/Negative/Lewd/Support) make this readable |
| 56 | Stance | New verb | Exclusive status group | ✓ | 4 | 4 | 3 | 3 | Watcher's whole identity |
| 57 | Stealth | Expression | Untargetable while others stand | | 4 | 2 | 4 | 4 | |
| 58 | Taunt | **New verb** | Redirect single-target attacks | | 4 | 3 | **5** | 4 | The best horizontal hook on the list: protects any ally from any attack |
| 59 | Theft | **New verb** | Take an enemy's telegraphed card | | 4 | 2 | 3 | 3 | Enemy moves are cards, and "teams are not kinds" means a party member can play one |
| 60 | Tradeable | Poor fit | Drag onto deck | | 3 | 2 | 2 | 3 | A new drop target on a crowded shelf |
| 61 | Tutor | New verb | Draw matching | ✓ | 3 | 3 | 4 | 4 | Shared deck: "draw one of Brienne's cards" is a cross-party verb |
| 62 | Wish | Poor fit | — | | 2 | 1 | 2 | 2 | Huge picker |
| 63 | X-cost | Expression | Spend all energy | ✓ | 4 | 2 | 3 | 4 | |
| 64 | Overheat | Expression | Unaffordable play → curse | | 4 | 3 | 3 | 3 | |
| 65 | Retain | Have | retain flag | ✓ | 3 | 2 | 3 | 4 | |
| 66 | Junkmaster | Expression | Curses held | | 3 | 3 | 3 | 4 | |
| 67 | Garbage Fire | Expression | Exhaust curses | | 3 | 3 | 4 | 4 | Nettle's Harvest counts burned cards |
| 68 | Risk | Expression | Enemy buffs as cost | | 3 | 2 | 2 | 3 | |
| 69 | Martial Arts | Expression | Card moved its owner | | 4 | 3 | 4 | 3 | Every card already moves its owner by type |
| 70 | Gacha | Poor fit | — | | 2 | 1 | 2 | 2 | |
| 71 | Sadism | Expression | Damage allies | | 4 | 3 | 4 | 4 | Ally tHP soaks it; Brienne's Resolve counts the hits |
| 72 | Masochism | Expression | Damaged by own team | | 4 | 3 | 4 | 3 | |
| 73 | Enchant | Expression | Grant an ability | | 4 | 2 | 4 | 3 | Abilities already come from equipment |
| 74 | Balance | Poor fit | — | | 1 | 1 | 1 | 3 | No theme |
| 75 | Cruelty | Expression | Target has a debuff | | 3 | 3 | **5** | 4 | Every debuff anyone applies switches it on |
| 76 | Frenzy | Expression | On discard | | 3 | 3 | 2 | 3 | Needs discard enablers first |
| 77 | Psychosis | Expression | The broken card | | **5** | 3 | 3 | 4 | Broken cards already exist per card; a card with a GOOD broken form is pure Honeycomb |
| 78 | Cheerleader | Expression | Tutor by owner | | 4 | 2 | 4 | 4 | |
| 79 | Enhance | Expression | Optional extra cost | | 3 | 2 | 2 | 3 | |
| 80 | Lone Wolf | Poor fit | — | | 2 | 1 | 1 | 4 | Works against teambuilding |
| 81 | Flashback | Expression | Play from discard | | 3 | 2 | 2 | 2 | UI cost |
| 82 | Greed | Expression | Unaffordable in hand | | 2 | 2 | 2 | 3 | |
| 83 | Archeology | Expression | Relic count | | 2 | 1 | 2 | 4 | |
| 84 | Fashion | Expression | wearsOutfit | | 4 | 3 | 2 | 3 | Very on-theme for a costume game; best used by outfits rather than printed on cards |
| 85 | Repeat X | Have | repeat | ✓ | 3 | 2 | 3 | 4 | |
| 86 | Arduous | Expression | Debuff own owner | | 3 | 2 | 3 | 4 | |
| 87 | Resistance | Expression | Own debuff count | | 3 | 3 | 3 | 4 | |
| 88 | Transmogrify | New verb | Status ↔ its opposite | | 4 | 3 | 4 | 2 | Needs a pairing table; rare only |
| 89 | Berserk | Poor fit | — | | 3 | 1 | 2 | 2 | Random free plays from a shared hand |
| 90 | Goad | Expression | Force an attack intent | | 3 | 2 | 3 | 3 | |
| 91 | Freeze | Expression | Skip next move | | 3 | 2 | 3 | 2 | Counter (10) does it more clearly |
| 92 | Burning | Expression | Halving DoT | | 4 | 3 | 3 | 4 | Too close to Poison to give to a second character |
| 93 | Regen | Have | regeneration | | 3 | 2 | 3 | 4 | |
| 94 | Fracture | Expression | Halving burst | | 3 | 3 | 3 | 3 | |
| 95 | Distracted | Expression | Lust at turn end, halving | | 4 | 3 | 4 | 4 | Lust over time; a good enemy debuff |
| 96 | Steaming Body | Expression | Lust aura | | 4 | 2 | 3 | 4 | |
| 97 | Mounted | Expression | tHP pool + mount cards | | **5** | 3 | 4 | 2 | Gorgeous, but heavy: rare only, and an outfit rather than a card |
| 98 | Opener | Have | innate | ✓ | 3 | 2 | 2 | **5** | |
| 99 | Opening Act | Expression | Innate core card | | 3 | 3 | 2 | 3 | |

---

## Part 2 — Primitives

The engine verbs, grouped. **Have** = already in the engine before this session. **Added** = added this
session, named for where it lives.

| Group | Primitive | State |
|---|---|---|
| Health | Damage · Damage ignoring tHP · Heal | Have |
| Health | **Heal past maximum** (overflow reaches `onOverheal`; a heal may send it to tHP) | Added |
| Health | **Blood spilled**: damage the party took this turn, readable as a value | Added |
| Temporary HP | Gain tHP · Remove an enemy's tHP | Have |
| Temporary HP | **Spend tHP** (own or an ally's; the amount is readable afterwards) | Added |
| Temporary HP | **tHP absorbed a hit** (hook) · **tHP halving** (fraction is a hook; the loss is an event) | Added |
| Lust | Inflict Lust · Soothe · Break · Recover | Have |
| Lust | **Transfer Lust**: an expression, a Soothe then a Lust reading how much was removed (`tally.lustRemoved`) · **Lust margin** (`modifyLustMargin`) | Added (part 6) |
| Status | Apply · Remove · Tick | Have |
| Status | **Consume** (remove, and the stacks removed are readable) · **Spread** (copy to the target's teammates) | Added |
| Status | **Status applied** (world hook: any party-side source hears any application) | Added |
| Targeting | Target modes, random picks | Have |
| Targeting | **Taunt** (single-target attacks from the other team land on the taunter) | Added |
| Position | Shift through party order · rank value · atRank condition | Have |
| Position | **Moved** (hook with how far) | Added (part 6) |
| Cards | Draw · Discard · Exhaust · Return · Duplicate · Modify cost · Add to pile / deck · Upgrade | Have |
| Energy | Gain energy | Have |
| Energy | **Energised fixed**: it was added before the turn's energy was SET, so it never did anything | Added |
| Intents | Telegraph · play move | Have |
| Intents | **Cancel intent** · **Re-roll intent** · **Turn intent** (Turncoat) · **Steal intent** | Added (part 6) |
| Choice | Choose option · choose cards | Have |
| Summons | Summon (either team) | Have |
| Offers | **Archetype weighting**: a card names its sister mechanic; a loadout multiplies (or zeroes) its odds | Added |
| Offers | **Relic offer condition**: a relic can require someone in the party | Added |
| Hooks | **Party relics reach the other team** (`modifyOpponentDamageTaken`, `modifyOpponentLustGained`) | Added |
| Hooks | **World hooks reach worn statuses** (a passive card's status hears an enemy falling) | Added |

---

## Part 3 — The cast: primitives, primary mechanics, sister mechanics

### Primitive changes, and why

- **Brienne: Temporary HP. Kept.** It halves instead of vanishing and shatters past 100%, which is
  already unlike Slay the Spire's Block.
- **Nettle: Poison. Kept.** It is Slay the Spire's Silent, which is the comparison to worry about, so her
  sister mechanics lean into things only this game has: poison that builds LUST (Venom), and poison
  carried by the rest of the party's hits (Contagion).
- **Severine: "Dealing Damage" → BLOOD** — health as a currency that flows between bodies. Taken from
  enemies (Drain), paid from herself or a teammate (Blood Prices), given to allies (Transfusion). Every
  character deals damage, so "Damage" could not be anyone's identity; Blood is what Severine already did in
  every card worth keeping. It also avoids a multi-hit Flurry archetype, which is very Slay the Spire.

### Brienne — Temporary HP

**Primary (default outfit): Brace.** Put Temporary HP on whoever needs it; Resolve fills as she guards
and is hit. Starter deck unchanged: Sword Strike ×3, Brace ×3, Bulwark, Riposte.

| Sister | Role | The rule | (I, S_v, S_h, C) |
|---|---|---|---|
| **Armament** | Offense | tHP is a weapon you do NOT spend: attacks grow with the tHP the attacker holds | (4, 4, 4, 4) |
| **Sentinel** | Setup / defense | Taunt pulls attacks onto her; tHP that absorbs a hit strikes back; slower halving | (4, 3, 4, 3) |
| **Tithe** | Directly rewarding | tHP is currency: spend it — yours or an ally's — for energy, cards, damage, soothing | (4, 4, 4, 3) |

Cross-party hooks:
- *Armament* can be LENT: *Lend Steel* gives an ally tHP and Armament, so Severine's Claw Flurry and Nettle's
  Grave Touch hit harder while she stands behind Brienne's gold. Severine's *Gorged* turns overhealing into
  tHP, which Armament then reads.
- *Sentinel*'s Taunt protects whoever the player is building around; Retort hits an Infected enemy
  (Nettle: poison per hit) and a Siphoned one (Severine: the party heals).
- *Tithe* spends an ALLY's tHP (*Ransom*), which is the brief's example: Severine holding Brienne's gold and
  cashing it. Severine's *Crimson Covenant* outfit makes Severine's Blood Prices come out of that gold outright.

### Nettle — Poison

**Primary (default outfit): Wither.** Stack Poison, let it tick, Reap it. Harvest counts the fallen and
the burned. Starter deck unchanged: Grave Touch ×3, Wither ×2, Reap ×2, Miasma.

| Sister | Role | The rule | (I, S_v, S_h, C) |
|---|---|---|---|
| **Rupture** | Offense | Consume the poison NOW for burst damage; Festering makes the clock run double | (4, 3, 3, 4) |
| **Contagion** | Setup / utility | Poison travels: Infected enemies catch it from the party's hits, and it spreads when one falls | (4, 4, 4, 3) |
| **Venom** | Offense (the other kill) | Poison that builds Lust: Intoxicated enemies take lust as poison ticks, and they break instead of dying | (5, 3, 4, 3) |

Cross-party hooks:
- *Rupture* + Severine's Weak: *Wasting* applies double poison to a Weak target, and the *Cracked Ampoule*
  relic makes poison bite harder on Weak enemies — the brief's example.
- *Contagion* + anyone who hits often: Severine's Claw Flurry on an Infected enemy is three stacks of poison;
  Brienne's Retort counts too.
- *Venom* + any lust source: Severine's Enthrall stacks on top; Clemence (part 6) can pour the party's own
  lust into an Intoxicated enemy.

(Venom scores I5 in its own right — it is the one Nettle mechanic nobody could mistake for another game's.)

### Severine — Blood

**Primary (default outfit): Drain.** Take health from enemies and put it back in her own veins; Thirst
lights when the hunt is going well. Starter deck unchanged: Enthrall ×2, Drain ×2, Crimson Arc, Claw
Flurry ×2, Blood Pact.

| Sister | Role | The rule | (I, S_v, S_h, C) |
|---|---|---|---|
| **Feast** | Offense | Prey on the wounded and the marked; kills pay out; overhealing becomes Temporary HP (Gorged) | (4, 3, 5*, 4) |
| **Bloodletting** | Setup / utility | Blood Prices: pay health — hers or a teammate's — for energy and cards; blood spilled becomes damage | (4, 4, 4, 4) |
| **Transfusion** | Support / setup | Give blood: heal allies at her own cost; Siphoned enemies bleed into the party's wounds | (4, 3, 4, 3) |

\* Feast's S_h is Cruelty's: *Bloody Verdict* and the *Trophy Cord* read every debuff anyone applies.
Scored at the mechanic level here, not the single card's; kept strict elsewhere.

Cross-party hooks:
- *Feast* reads every debuff (Nettle's Poison, Weak, Infected; Brienne's nothing yet — Clemence's and
  Cassadora's in part 6). *Mark Prey* is the setup status any ally's attack cashes in: the brief's "setup
  status for ally execution".
- *Bloodletting*'s *Bloodlet* damages an ally: Brienne's tHP soaks it and her Resolve counts the hit.
  *Sanguine Tide* turns every hit the party took this turn — Blood Pact, Bloodlet, the enemy's last
  attack on Brienne — into damage.
- *Transfusion*'s *Siphoned* turns Nettle's poison ticks and Brienne's Retort into party healing, and
  healing widens everyone's margin against lust.

---

## Part 4 — Outfits and relics

**Archetype weighting** (added): a card names its sister mechanic (`archetype`), and an outfit's
`archetypeWeightArray` multiplies that card's reward odds — ×3 to favour, ×0 to block. Blocking is
used where two sisters pull against each other, so the costume guarantees the run it promises.

| Sister | Outfit | What it does | Relic | What it does |
|---|---|---|---|---|
| Armament | **Siegeplate** | +6 Max HP. One Brace becomes Shield Bash. Starts every fight with 1 Armament. Armament ×3, Tithe blocked | **Gilded Gauntlet** (uncommon) | Party attacks deal +1 damage per 8 tHP the attacker holds |
| Sentinel | **Bastion** | +12 Max HP. One Sword Strike becomes Challenge. Her tHP halves by only a quarter. Sentinel ×3 | **Oathbound Banner** (uncommon) | When an ally's tHP absorbs an enemy's hit, deal 2 damage to the attacker |
| Tithe | **Almoner** | Riposte becomes Tithe. The first time each turn she spends tHP, draw 1. Tithe ×3, Armament blocked | **Collection Plate** (common) | The first time each turn anyone spends tHP, draw 1 card |
| Rupture | **Rotsinger** | −4 Max HP. Adds Rupture. Every fight opens with 1 Festering on all enemies. Rupture ×3, Venom blocked | **Cracked Ampoule** (uncommon) | Poison deals 50% more damage to Weak enemies |
| Contagion | **Sporemother** | +6 Max HP. One Grave Touch becomes Infect. Every fight opens with 1 Infected on all enemies. Contagion ×3 | **Rat King's Bell** (uncommon) | When a poisoned enemy falls, each other enemy gains half its Poison |
| Venom | **Nightshade** | One Wither becomes Pollen Kiss. Poison Nettle applies also inflicts 1 Lust. Venom ×3, Rupture blocked | **Honeyed Thorn** (uncommon) | Poisoned enemies take 2 more Lust from everything |
| Feast | **Huntress** | One Enthrall becomes Mark Prey. +2 damage against enemies below half health. Feast ×3, Transfusion blocked | **Trophy Cord** (uncommon) | When an enemy with a debuff falls, draw 1 |
| Bloodletting | **Crimson Covenant** | Adds Bloodlet. Her own Blood Prices are paid by the ally holding the most tHP (it soaks them). Bloodletting ×3 | **Leech Jar** (uncommon) | The first time each turn the party damages one of its own, gain 1 Energy |
| Transfusion | **Blood Saint** | Crimson Arc becomes Transfusion. Her overhealing becomes tHP. Transfusion ×3, Bloodletting blocked | **Vitae Chalice** (common) | Whenever an ally is healed, they also lose 2 Lust |

The Almoner's hook is the Brienne-only version of the Collection Plate, so the two stack in a Tithe run.

Relics for a sister mechanic are only offered when its character is in the party (`offerCondition`).

**Retired in session 9 (part 7.1).** At the time of this part: **the six older outfits** (Bloodied Plate, Warden, Grovekeeper, Plaguebearer, Corsair, Night Court) stay,
now pointing at the new pool and lightly weighted toward the sister they already resembled (Bloodied →
Armament, Warden → Sentinel, Plaguebearer → Contagion, Grovekeeper → Venom, Corsair → Feast, Night
Court → Bloodletting). **Question for Noodle:** Warden and Bastion now overlap; retire the old six, or
keep them as extra looks?

---

## Part 5 — The card pool

Role key: **E** enables (triggers the primitive) · **P** pays it off · **X** enhances the primitive
itself · **·** core. Starter cards keep their indices so saves and tests still recognise them. Exact
numbers live on the cards; this table is the intent.

### Brienne (23)

| Card | Sister | Rarity | Cost | Text | Role |
|---|---|---|---|---|---|
| Sword Strike | · | starter | 1 | Deal 6 | · |
| Brace | · | starter | 1 | An ally gains 6 tHP | E |
| Bulwark | · | common | 2 | ALL allies gain 5 tHP | E |
| Steady | · | common | 1 | Remove 7 Lust from an ally | · |
| Shelter | · | uncommon | 2 | Ally: 8 tHP, remove 6 Lust, 1 Composure | E |
| Rally | · | rare | 2 | ALL allies gain 1 Strength (Passive) | · |
| Shield Bash | Armament | common | 1 | Deal 5. Gain 5 tHP | E |
| Riposte | Armament | common | 1 | Deal damage equal to your tHP | P |
| Crushing Weight | Armament | uncommon | 2 | Deal 4 plus half your tHP to ALL enemies | P |
| Tempered Plate | Armament | uncommon | 1 | Passive: gain 1 Armament | X |
| Lend Steel | Armament | uncommon | 1 | An ally gains 5 tHP and 1 Armament | X (cross) |
| Unstoppable | Armament | rare | 2 | Passive: whenever you gain tHP, deal 3 to the front enemy | P |
| Challenge | Sentinel | common | 1 | Gain 6 tHP and 1 Taunt. To the front | E |
| Intercept | Sentinel | common | 1 | An ally gains 7 tHP. Brienne gains 1 Taunt | E (cross) |
| Thorn Armour | Sentinel | uncommon | 1 | Passive: gain 3 Thorns | P |
| Iron Retort | Sentinel | uncommon | 1 | Passive: gain 2 Retort | P |
| Hold the Line | Sentinel | uncommon | 1 | Passive: gain Entrenched (your tHP halves by a quarter) | X |
| Shield Wall | Sentinel | rare | 2 | Gain 12 tHP and 2 Taunt. ALL other allies gain 4 tHP | P |
| Tithe | Tithe | common | 0 | Spend 5 of your tHP: gain 1 Energy, draw 1 | P |
| Ransom | Tithe | common | 1 | Spend up to 8 of an ally's tHP: draw 1 per 4 spent | P (cross) |
| Gilded Strike | Tithe | uncommon | 1 | Spend all your tHP: deal twice that | P |
| Alms | Tithe | uncommon | 1 | Spend all your tHP: ALL allies lose that much Lust | P |
| Reliquary | Tithe | rare | 1 | Passive: when your tHP halves, gain 1 Energised per 6 lost (max 2) | X |

### Nettle (20)

| Card | Sister | Rarity | Cost | Text | Role |
|---|---|---|---|---|---|
| Grave Touch | · | starter | 1 | Deal 5 | · |
| Wither | · | starter | 1 | Apply 3 Poison | E |
| Soul Harvest | · | uncommon | 1 | Draw 2, gain 1 Energy. Exhaust | · |
| Reap | Rupture | starter | 1 | Deal 4 plus 1 per Poison | P |
| Blight Needle | Rupture | common | 1 | Deal 3. Apply 3 Poison | E |
| Rupture | Rupture | common | 1 | Consume all Poison on an enemy: deal twice that | P |
| Wasting | Rupture | uncommon | 1 | Apply 4 Poison; 4 more if it is Weak | E (cross) |
| Fester | Rupture | uncommon | 1 | Apply 3 Poison and 2 Festering (poison deals double) | X |
| Catharsis | Rupture | uncommon | 2 | Each enemy takes damage equal to its Poison | P |
| Burst | Rupture | rare | 1 | Consume all Poison on an enemy: deal that much to ALL enemies | P |
| Miasma | Contagion | starter | 2 | ALL enemies: 2 Poison, 1 Weak | E |
| Infect | Contagion | common | 1 | Apply 2 Infected (gains 1 Poison per attack taken) | X (cross) |
| Contagion | Contagion | common | 1 | The other enemies gain the target's Poison | P |
| Pandemic | Contagion | uncommon | 1 | Passive: a poisoned enemy that falls spreads its Poison to ALL enemies | X |
| Creeping Plague | Contagion | rare | 2 | ALL enemies: 4 Poison, 2 Vulnerable | E |
| Pollen Kiss | Venom | common | 1 | Apply 3 Poison. Inflict 3 Lust | E |
| Intoxicate | Venom | common | 1 | Apply 2 Poison and 2 Intoxicated (poison ticks also inflict Lust) | X |
| Flushed | Venom | uncommon | 1 | Inflict Lust equal to twice the target's Poison | P |
| Heady Spores | Venom | uncommon | 1 | Passive: whenever the party applies Poison, also inflict 2 Lust | X (cross) |
| Bacchanal | Venom | rare | 2 | ALL enemies: 2 Intoxicated, then Lust equal to their Poison | P |

### Severine (22)

| Card | Sister | Rarity | Cost | Text | Role |
|---|---|---|---|---|---|
| Enthrall | · | starter | 1 | Inflict 7 Lust | · |
| Drain | · | starter | 1 | Deal 4, heal for the damage dealt | E |
| Crimson Arc | · | starter | 1 | Deal 4 to ALL enemies | · |
| Claw Flurry | · | common | 1 | Deal 3, three times | · (cross: Infected) |
| Rake | · | common | 1 | Deal 7 | · |
| Nightfall | · | rare | 2 | ALL enemies: 8 damage, 2 Weak; heal 6 | E |
| Hamstring | Feast | common | 1 | Deal 5. Apply 1 Weak | E (cross) |
| Mark Prey | Feast | common | 1 | Apply 2 Marked (+3 damage taken; party gains 1 Energy when it falls). Draw 1 | E (cross) |
| Coup de Grâce | Feast | common | 1 | Deal 7. If it falls, gain 1 Energy and draw 1 | P |
| Exsanguinate | Feast | uncommon | 2 | Deal 9; 18 at 20 HP or less | P |
| Gorge | Feast | uncommon | 1 | Passive: gain Gorged (healing past full becomes tHP) | X (cross) |
| Bloody Verdict | Feast | rare | 2 | Deal 6 plus 4 per debuff on the target; heal for the damage dealt | P (cross) |
| Blood Pact | Bloodletting | uncommon | 0 | Lose 4 HP. Gain 2 Energy, draw 1 | E |
| Bloodlet | Bloodletting | common | 0 | Deal 5 to an ally. Draw 2 | E (cross) |
| Sanguine Tide | Bloodletting | uncommon | 1 | Deal damage to ALL enemies equal to the blood the party spilled this turn | P |
| Blood Rite | Bloodletting | uncommon | 1 | Passive: gain Hemomancy — when the party damages one of its own, draw 1 (twice a turn) | X |
| Blood Moon | Bloodletting | rare | 2 | Passive: whenever an ally loses health, deal that much to a random enemy | P |
| Transfusion | Transfusion | common | 1 | Lose 5 HP. An ally heals 10 | E |
| Leech Mark | Transfusion | common | 1 | Apply 2 Siphoned (when it loses health, the most hurt ally heals half) | X (cross) |
| Vital Flow | Transfusion | uncommon | 1 | ALL allies heal 4; the excess becomes tHP | P (cross) |
| Heartsblood | Transfusion | uncommon | 1 | Lose 6 HP. ALL other allies heal 5 and lose 3 Lust | P |
| Crimson Communion | Transfusion | rare | 2 | Deal 7 to ALL enemies; ALL allies heal the damage dealt, divided among them | P |

### New statuses

| Status | For | Rule |
|---|---|---|
| Armament | Armament | Attacks deal +1 damage per 5 tHP held, per stack |
| Taunt | Sentinel | Single-target attacks from the other team land here. Lasts until its owner's next turn |
| Retort | Sentinel | When tHP absorbs a hit, deal 3 per stack back |
| Entrenched | Sentinel | tHP halving takes a quarter instead of half |
| Gilded | Tithe | When tHP halves, gain 1 Energised per 6 lost (max 2 a turn) |
| Momentum | Armament | When tHP is gained, deal 3 per stack to the front enemy |
| Festering | Rupture | Poison deals double damage. Wears off at end of turn |
| Infected | Contagion | Gains 1 Poison whenever an attack damages it. Wears off at end of turn |
| Intoxicated | Venom | At turn start, after poison acts, takes Lust equal to its Poison. Wears off at end of turn |
| Heady Spores | Venom | Whenever the party applies Poison, inflict 2 Lust on that enemy |
| Pandemic | Contagion | When a poisoned enemy falls, ALL other enemies gain its Poison |
| Marked | Feast | Takes 3 more damage from attacks; when it falls the party gains 1 Energy. Wears off at end of turn |
| Gorged | Feast | Healing past maximum health becomes tHP |
| Hemomancy | Bloodletting | When the party damages one of its own, draw 1 (twice per turn) |
| Blood Moon | Bloodletting | When an ally loses health, deal that much to a random enemy |
| Siphoned | Transfusion | When it loses health, the most hurt ally heals half. Wears off at end of turn |

---

## Part 6 — Three new characters

Built last, on everything above. The brief left their details open; the late note asked that **Skull
share nothing with Nettle down to the primitive**, and leaned away from Slay the Spire's mechanics. So each
is built on a primitive that only this game has, and that none of the first three owns:

| Character | Source art | Class | Primitive | Why this one |
|---|---|---|---|---|
| **Cinder** | `lancer` | Lancer | **Party order** | A reach weapon fights from anywhere in the line. Party order was a live system nobody owned |
| **Clemence** | `priest` | Confessor | **Lust moved between fighters** | A confessor takes things out of people. Everyone takes lust; nobody could move it |
| **Cassadora** | `seer` | Hexer | **Enemy intents** | Enemy moves are real telegraphed cards here. The skull is a seer's familiar, not a reaper's: no poison, no souls, no death magic (test [65] checks her kit for any of it) |

Minions (the obvious read of a floating skull) were set aside on purpose: Slay the Spire 2's Necrobinder
owns them, and a skull minion would have read as Nettle's second act.

Each gets a primary mechanic, **two** sister mechanics (one offense, one utility), an outfit and a relic
per sister, a mechanic widget, an ability that spends it, a heirloom, a broken card, a small progression
tree and placeholder art. Two sisters rather than three keeps a first pass legible; a third is the
obvious next step for any of them.

### Cinder — party order

**Primary: Charge.** Her attacks do NOT move her (`partyShiftByCardType: {damage: "none"}`), so every
step is one a card chose, and Flame Charge hits for 4 + 3 per place crossed. Her heirloom, the **Ember
Spur**, opens every fight with her at the back. **Stride** (orb) counts every place she moves, by any
cause; **Flame Vault** spends 3.

| Sister | Role | Rule | (I, S_v, S_h, C) | Outfit | Relic |
|---|---|---|---|---|---|
| **Charge** | Offense | The crossing is the damage: fall back, then charge | (5, 3, 3, 4) | **Vanguard Plume**: one Thrust becomes Flame Charge, starts with Emberwake. Formation blocked | **Spur of Embers**: the party member at the front deals +2 attack damage |
| **Formation** | Utility | Move allies: the right fighter to the front, the hurt one to the back | (4, 3, 5, 3) | **Marshal**: +8 HP, one Fall Back becomes Pull Back, any other ally reaching the front gains 1 Vanguard once | **Marching Drum**: first time each turn someone moves 2+ places at once, draw 1 |

Formation shares the session's top S_h with Feast: it is only ever about the other characters — Brienne's Taunt in
front, Nettle moving back after her damage cards, Severine's Feast at the front with Vanguard.

Cards (13): Lance Thrust, Fall Back, Flame Charge, Change Places (starters) · Charge: Longspear, Double
Back, Hot Pursuit, Trailfire (applies Emberwake), Comet Lance · Formation: Pull Back, Point of the Spear,
Turn the Line, Pincer. Broken: **Stumble** (falls to the back, sheds 6 Lust).

### Clemence

Her first kit (lust moved between fighters) is archived in `../Archive/demo1/Archive/CLEMENCE-01.md`. She was rebuilt around becoming Broken in session 9: see part 7.2.

### Cassadora — intents

**Primary: Second Thoughts.** An enemy picks its move again. **Foresight** (orb) counts every intent she
changes or turns; **Glimpse** spends 2 to re-roll one more. Heirloom the **Crystal Ball**: one more card on
the first turn. A cancelled intent telegraphs **Befuddled**, a real card that does nothing
(`tuning.intent.cancelledCard`).

| Sister | Role | Rule | (I, S_v, S_h, C) | Outfit | Relic |
|---|---|---|---|---|---|
| **Hex** | Utility | Rewrite the move: re-roll it, or cancel it outright | (4, 3, 4, 4) | **Hedge Witch**: +6 HP, one Wisplight becomes Second Thoughts. Turncoat blocked | **Cracked Hourglass**: an intent changed draws 1, twice a turn |
| **Turncoat** | Offense | Their move, her weapon: turn it on its own side, or steal it into the hand | (5, 3, 3, 3) | **Grifter**: adds Pilfer; stolen moves deal +3 | **Sleight Purse** (session 9, replaced the Two-Faced Mask): each fight starts with one of an enemy's moves in hand |

A Turncoat's move is printed from the side it now serves ("Deal 7 damage to the enemy in front") and never
lands on its own user (session 9: a lone Turncoat acts as usual). Pilfer re-rolls the robbed enemy's intent. A stolen move is a copy of the
enemy's card in the hand, used for the party, costing 0 and exhausting.

Cards (11): Wisplight, Second Thoughts, Fizzle, Turncoat, Crystal Gaze (starters) · Hex: Jinx, Hex of
Stillness · Turncoat: Mirror Fate, Pilfer, Puppet Strings. Broken: **Blinded** (a random enemy re-rolls,
sheds 6 Lust).

### Engine verbs added for part 6

- `honeycomb.shiftEntity` counts: action tally `ranksMoved`, per-member `ranksMovedThisTurn`
  (`honeycomb.ranksMovedThisTurn`, value `ranksMovedThisTurn`, collection `alliesMovedThisTurn`), and fires
  `onShifted` (the mover) and `onPartyShifted` (world). Effect `reverseOrder`.
- `honeycomb.reduceLust` writes tally `lustRemoved` and fires `onLustReduced` (world, with `source`). Lust
  TRANSFER is therefore an expression, not a verb: a `soothe` followed by a `lust` reading the tally.
- `modifyLustMargin` folds into `honeycomb.standingAgainstLust`, so breaking, recovery, the plate and the
  forecast read the same margin (Hallowed, the Anchorite, the Hair Shirt).
- Target mode `lustiestAlly`.
- Intents: `honeycomb.changeIntent` (logs a fresh `intent` entry, fires `onIntentChanged`), effects
  `cancelIntent`, `rerollIntent`, `stealIntent`; status field `turnsIntent`, read by
  `honeycomb.intentActingSide`; `context.actingSide` makes every target mode relative to the side a move is
  taken for, and `aiPickTarget` takes it too; `onMovePlayed` world hook; values `intentDamage` and
  `attackingOpponents`. A resolved card copies `userSide`, `exhausts` and `artEnemyIndex` from its instance.
- **Old saves see new characters**: `honeycomb.save.reconcileContent` adds every `unlockedFromStart`
  character missing from a loaded roster. Without it the three were invisible to every existing profile.
- Renamed in the fit audit: the Emberwake card is *Trailfire* (the status keeps the name).

### Placeholder art

`_source/characters/{lancer,priest,seer}.webp` arrived as RGB on white, so `../tools/generate-placeholder-art.py`
now cuts a source with no transparency out in memory (`cut_out_white_background`: near-white connected to
the border; `CUTOUT_EXTRA_SEEDS` names page fenced in by the line art, which Cinder's staff does). The
sources are never rewritten. Portraits, eight poses per outfit, broken and recover stand-ins and 13 card
illustrations came from `--only characters`. Recover eye windows are measured.

### How it plays (a sanity sweep, not balance)

The greedy test auto-player fought every encounter 6 times per party with no engine errors. It plays every
card at the weakest enemy, so it undersells Cassadora and Clemence, whose cards are about WHO and WHAT rather
than how much: the new trio took a little longer than the old one on most fights, and a
Brienne/Clemence/Cassadora party (the least raw damage) lost the late fights. Worth a real playtest before any
numbers move.

### Status

☑ Built and tested ([65]; 1005 tests), card-fit clean at desktop and 812×375, 0 content warnings, seen in
the Browser pane (roster, a fight with all three, a Turncoat telegraph, a stolen Spit in hand).

---

## Part 7 — Noodle's first feedback on the pass (session 9)

> Yes, please retire the six older outfits. Cinder and cassadora are fantastic and awesome additions, while they do struggle just a little bit there's more than enough fun gameplay that I'm happy with them.
>
> Clemence really needs her card pool redesigned with intentionality. I like the idea that she's a support character and that she interacts with lust, but lust growth would need to be unreasonably high for her to work, and composed is not only very weak but has anti-synergy with her taking advantage of high lust. Hallowed is overall just not a great status, and her ability is very costly for low payoff.
>
> For Clemence, I'd recommend designing her kit around becoming broken. Healing herself and allies, gaining energy and drawing cards in exchange for building lust, lacking damaging attacks, cards with bonuses for if the target has lust, not as much ones that are only good if they have lust.
>
> Hallowed as a status should be replaced to allow you to use the non-broken effects of cards while in a broken state, letting her allies experience the same effect she does at the cost of effectively playing on the razor's edge since if everyone is broken the run ends. Then while broken her kit revolves around spending her lust as instead of having one broken card, each of her cards is designed around having its broken form being a real counterpart to its original effect. Don't have her inflict lust until she hits that breaking point where it all comes out.
>
> Here is some other miscellaneous feedback on the new characters:
>
> - Cinder's flame charge animation feels a little too slow
>
> - Turncoat shouldn't let them attack themselves, only their allies, otherwise it's a better version of skipping their turn
>
> - The turncoat relic is too specific, please replace it with a new idea.
>
> - Pilfer should make the enemy take a new intent, or again it's just better than a turn-skip card.
>
> Finally, did you do that redesign of the card pool for the original three? I said it above, "Add in the new card set, replacing the old one.... Once all of that is finished I have three new characters for you to create"

| # | Item | State |
|---|---|---|
| 7.1 | Retire the six older outfits | ☑ |
| 7.2 | Clemence redesigned around becoming Broken | ☑ |
| 7.3 | Flame Charge animation faster | ☑ |
| 7.4 | Turncoat never hits itself, only its allies | ☑ |
| 7.5 | Replace the Two-Faced Mask | ☑ Sleight Purse |
| 7.6 | Pilfer re-rolls the enemy's intent | ☑ |
| 7.7 | The trio's pool: answered, and starter decks refreshed so it shows | ☑ |

Tests: 1016; [66] is this round. Card-fit clean at desktop and 812×375 (259 card forms), 0 content warnings,
no engine errors across the auto-play sweep, and Clemence's break seen in the Browser pane.

### 7.1 Retired outfits ☑

Bloodied Plate, Warden, Grovekeeper, Plaguebearer, Corsair and Night Court are out of the content table,
with their placeholder art folders and the three progression capstones that unlocked them (`briWarden`,
`netPlague`, `severineCourt`). Clemence's first two outfits (Inquisitor, Anchorite) went with her first kit.

- **Saves**: format 6. A member wearing a retired outfit loads wearing its successor (Bloodied → Siegeplate,
  Warden → Bastion, Grovekeeper → Nightshade, Plaguebearer → Sporemother, Corsair → Huntress, Night Court →
  Crimson Covenant, Inquisitor → Ecstatic, Anchorite → Devotee), and the retired indices leave the unlock
  ledgers. Only `outfitIndex` fields are rewritten.
- **Tests**: those outfits were the only content exercising tree locks, outfit-only tree nodes, ability
  replacement, tag removal, a locked outfit and self-damage paid in lust. `../tools/test-honeycomb.js` installs
  them into every TEST engine as fixtures (`installLegacyOutfitFixtures`), never into the game, so the
  engine features stay covered.
- Night Court's feature (self-damage paid in lust, `replaceSelfDamage`) is still an engine verb; the
  Crimson Covenant uses the same hook to redirect instead.

### 7.2 Clemence, rebuilt around becoming Broken ☑

The first kit is archived in `../Archive/demo1/Archive/CLEMENCE-01.md`. Read against the brief above, point by point:

| Noodle asked for | What she has now |
|---|---|
| A support character who interacts with lust | Every standing card heals, gives energy or draws, and pays in Lust she gives herself |
| Lust growth not needing to be unreasonably high | 3–10 Lust per card on HERSELF, not on enemies; Surrender breaks her outright; Absolve takes the party's Lust onto her. The naive auto-player breaks her by turn 4–7 |
| No Composure (weak, and anti-synergy) | Gone from her kit and her heirloom |
| No damaging attacks | None. A test checks no card of hers carries a damage effect |
| Bonuses if the target has lust, not cards only good if it does | Offering (6, or 9 with Lust), Lay On Hands, Soft Words (draw if the enemy has Lust), Confession |
| Hallowed replaced: play real cards while Broken, for her allies too | **Sanctified**: while Broken, the holder keeps their real cards (`keepsCardsWhileBroken`, read in `honeycomb.brokenCardIndexFor`). The spiral and the all-Broken loss still apply |
| While broken, her kit spends her lust; every card's broken form a real counterpart | Each of her 15 cards names its own `brokenCard`, and every broken form SPENDS her Lust (a soothe on her, read back through the tally) for a stronger version of the standing effect |
| No lust on enemies until she breaks | Only broken forms inflict Lust (Cast It Out, Swoon, Penance, Revelation). A test checks it |
| Her ability was costly for low payoff | **Absolve**, 3 Devotion (about two cards): the other allies lose up to 10 Lust each, everyone heals 5, and she takes it all plus 6 |

**Primitive: becoming Broken.** Her Lust is the resource: built while standing, spent while broken.
Spending carries its own tension, because a turn that starts with her health above her Lust stands her
back up.

**Mechanic: Devotion** (bar, max 10): one per 3 Lust she gains or spends. **Absolve** spends 3.
**Heirloom: Votive Candle**: when she Breaks, ALL allies heal 5 and the party gains 1 Energised.

| Sister | Role | Rule | (I, S_v, S_h, C) | Outfit | Relic |
|---|---|---|---|---|---|
| **Devotion** | Utility | Build her Lust for healing, energy and cards | (4, 4, 4, 4) | **Devotee**: +6 HP, Soft Words → Fervent Prayer, her own Lust gains heal the most hurt ally 2. Sanctuary blocked | **Prayer Beads**: first time each turn a member gains Lust from their own card, +1 Energy |
| **Rapture** | Offense | Break, and spend what she carried; the only time her Lust hits the enemy | (5, 4, 3, 3) | **Ecstatic**: -4 HP, starts every fight with Lust up to half her maximum health | **Reliquary of Tears**: whenever a member Breaks, ALL enemies take 6 Lust |
| **Sanctuary** | Utility | Sanctified allies play on while Broken: the whole party on the razor's edge | (5, 3, 5, 2) | **Abbess**: +8 HP, one Confide → Sanctify, the first other ally to Break each fight becomes Sanctified. Rapture blocked | **Halo of Thorns**: Broken members heal 4 at the start of each turn |

Sanctuary is rare-and-heavy on purpose (C 2): it is the one mechanic that changes what Broken MEANS for
someone other than her, and a Night-Court-style ally or a Venom-heavy fight gets as much from it as she does.

| Standing form | Cost | Standing effect | Broken form | Broken effect |
|---|---|---|---|---|
| Offering (starter) | 1 | Ally heals 6, 9 if they have Lust; she gains 5 | Outpouring | Spend up to 10: ally heals 2 + that |
| Fervent Prayer (starter) | 0 | +1 Energy; she gains 6 | Ecstatic Prayer | Spend up to 8: +1 Energy, +2 if all 8 spent |
| Confide (starter) | 1 | Draw 2; she gains 5 | Unburden | Spend up to 9: draw 1 per 3 spent |
| Soft Words (starter) | 1 | 1 Weak; draw 1 if the enemy has Lust; she gains 3 | Cast It Out | Spend up to 12: inflict that much Lust |
| Lay On Hands | 2 | ALL allies heal 4, 6 with Lust; she gains 8 | Benediction | Spend up to 18: ALL allies heal half |
| Take Their Burden | 1 | Move up to 8 of an ally's Lust onto her, +2; they heal 4 | Shared Rapture | Spend up to 8: ally gains 2 + that as Temporary HP |
| Penitence | 0 | +2 Energy; she gains 10 | Indulgence | Spend up to 12: +1 Energy per 6; draw 1 |
| Martyr's Vow (passive) | 1 | Gain Martyr's Vow; she gains 4 | Martyr's Joy | Gain Martyr's Vow; spend up to 6 |
| Yearning | 1 | 1 Sensitive on ALL enemies; she gains 6 | Swoon | Spend up to 12: ALL enemies take half as Lust |
| Confession | 1 | 1 Weak, +2 Sensitive if it has Lust; draw 1; she gains 4 | Penance | +4 Lust if it has Lust; spend up to 10 and inflict that |
| Surrender (rare) | 1 | ALL allies heal 6; she gains Lust until she Breaks. Exhaust | Revelation | Spend ALL: ALL enemies take that much. Exhaust |
| Ecstasy (rare passive) | 2 | Gain Ecstasy (+1 Energy a turn while she is Broken); she gains 8 | Beatitude | Gain Ecstasy; draw 2 |
| Sanctify | 1 | Ally gains Sanctified; she gains 5 | Consecrate | Ally gains Sanctified; spend up to 8, they heal that |
| Fallen Vigil | 1 | Ally heals 5; if Broken, 5 more and draw 1; she gains 4 | Keep Faith | Spend up to 8: ally heals that, doubled if Broken |
| Shared Fever | 1 | Ally and she each gain 6; +1 Energy, draw 1 | Shared Release | Spend up to 10: ally loses that much too; draw 1 |
| Communion (rare) | 2 | ALL allies gain Sanctified; she gains 10. Exhaust | Rapturous Host | ALL gain Sanctified; spend ALL, ALL heal a third. Exhaust |

Starting deck: Offering ×3, Fervent Prayer ×2, Confide ×2, Soft Words ×1.

- **Her own Lust names no lust tag** (`lustTagArray: []`), so building it never grows a between-run weakness.
  What she casts at enemies is Exposure.
- **Engine verbs added**: status field `keepsCardsWhileBroken`; value `lustToBreak`; condition `isBroken`;
  `honeycomb.addDevotion`, `honeycomb.martyrsVowHeal`.

### 7.3 Flame Charge ☑

A move can name a PACE (`pace` on the shiftParty effect, logged on the `partyOrder` entry, defined in
`tuning.animation.partyShiftPaceArray`). `charge` slides in 190ms instead of 380ms, and the replay waits
only 110ms, so the hit lands as she arrives. Flame Charge, Comet Lance and Flame Vault use it.

### 7.4 Turncoat ☑

`honeycomb.relatedLivingArray` leaves a turned move's own user out of every side it names, so a turned
Spit hits the other sporeling and a turned sweep hits everyone but its user. A Turncoat with no allies left
has nobody to turn on, so `honeycomb.intentActingSide` leaves it acting as usual, rather than wasting its
turn on itself.

### 7.5 Sleight Purse ☑

Replaced the Two-Faced Mask. **Sleight Purse**: at the start of each combat, a copy of one of a random
enemy's moves goes into your hand (owned by Cassadora, costs 0, exhausts). It pays out every fight with no setup.
`honeycomb.giveStolenCard` is shared with Pilfer.

### 7.6 Pilfer ☑

Pilfer now re-rolls the enemy's intent after stealing it, rather than leaving it Befuddled.

### 7.7 The original three's pool ☑

**Yes, the pool was replaced in session 8** (65 cards across nine sister mechanics). What hid it: the starting
decks had been left exactly as they were, so a first fight looked identical. They now start with a card
from each sister mechanic:

- Brienne: Sword Strike ×3, Brace ×2, Shield Bash, Challenge, Tithe
- Nettle: Grave Touch ×2, Wither ×2, Reap, Infect, Miasma, Pollen Kiss
- Severine: Enthrall, Drain ×2, Crimson Arc, Claw Flurry, Mark Prey, Blood Pact, Transfusion

Outfit swaps were re-pointed so each still lands and each blocked sister leaves the starting deck:
Siegeplate turns Tithe into Riposte, Almoner turns Shield Bash into a second Tithe, Rotsinger turns Pollen
Kiss into Rupture, Nightshade turns Reap into Intoxicate, Huntress turns Transfusion into Hamstring, and
Blood Saint turns Blood Pact into a second Transfusion. A test checks every swap finds its card.
