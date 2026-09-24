Mechanical Bible: Systems, Archetypes & Encounter Design

# 1. Core Philosophy: The Dual-Path Equilibrium
The core mechanical question asked of the player is not "How do I beat this boss?", but rather "How does my chosen strategy solve this boss?"
Every run demands that the player commit to one of two macro-strategies: Burst or Grind. Both strategies are fully capable of beating every single encounter in the game. An encounter must never require a specific strategy to pass, nor can any encounter feature hard negations (such as instant-death timers or complete immunity to key playstyles).



                      +------------------------+
                      |   ENCOUNTER CHALLENGE  |
                      +-----------+------------+
                                  |
            +---------------------+---------------------+
            |                                           |
            v                                           v
    [ BURST STRATEGY ]                          [ GRIND STRATEGY ]
"Survivability Through Damage"              "Damage Through Survivability"
            |                                           |
  Frontloaded execution reduces               Sustained mitigation allows
  incoming enemy turns, protecting           natural turn energy/card draw 
  the team's health pool.                    to accumulate over time.
            |                                           |
            +---------------------+---------------------+
                                  |
                                  v
                      +------------------------+
                      |    VICTORY CONDITION   |
                      +------------------------+


# 2. Player Fail States

Whenever a player loses a run, the failure must trace back to exactly one of three structural errors made during party building and drafting:

* Lack of Commitment: The deck/party never formed an engine, or never moved away from being a hybrid compromise that fails to achieve the critical mass required for high-velocity Burst OR dense, scalable Grind.
* Unpatched Vulnerabilities: The player successfully built a core engine but failed to pick draft options/relics that cover that engine's inherent structural holes or the holes created by sacrifices made to assemble that engine.
* Engine Fragility: The engine functions under ideal conditions, but crumbles when subjected to enemy friction and disruption mechanics.

# 3. Encounter Design Laws

There should never be an enemy or mechanic which completely shuts down one of the strategies, like a countdown timer to instant death. We always want the player to feel close to victory, and doing that would send them back to the very first decision of the game, especially in a game with so much randomness.

Conversely, we never want to fail to test the player in both strategies. The fact that enemies deal damage at all means that health becomes an limited resource, requiring the player to reach one of these two strategies to protect it, but if we're adding something to an encounter to specifically test one strategy, it should have something else to test it's counterpart. 

* Universal Solvability: Every boss, elite, and regular encounter MUST be beatable by a pure Burst composition AND a pure Grind composition.
* Paired Testing: Whenever an encounter introduces a mechanic to challenge Burst, it MUST simultaneously incorporate a mechanic that challenges Grind. No encounter tests only one path.
* No Hard Counters: Avoid binary mechanics like "Immune to Damage for 5 turns" or "Instant Kill on Turn 6." Use soft-scaling friction that forces the player to manage momentum rather than abandon their strategy.
* Variety: A player, after 3 playthroughs through the game, should not have discovered anywhere near 90% of the game's enemies.

# 4. Friction (How Enemies and Bosses Challenge Both Paths)

Encounter design relies on Direct and Indirect friction to test the durability of a player's build without shutting it down completely.

Players need survivability and damage to win. 

Burst gives survivability through damage. With fast combos and high damage, they take very little hits themselves. 

This is challenged indirectly by various enemy layouts (ie lots of small enemies vs a few big ones), and directly by specific mechanics (ie thorns, and punishing player draw).

Grind gives damage through survivability. With ways to undo or mitigate incoming damage, they can build damage over time because they draw cards and gain energy every turn naturally. 

This is challenged indirectly by the varied nature of enemy movesets (ie dealing damage vs attacking other defenses), and directly through specific mechanics (ie inflicting poison stacks, regenerating health, countdowns to big attacks).

There are also mechanics that challenge both strategies at once, such as shuffling junk cards into the deck, shuffling party order, taxing player resources, etc. 

# 5. Challenge design Act-by-Act

To tie progression directly into the three-act loop, each Act should test a specific stage of engine maturity:

### Act 1 (Fungi & Flora): Tests Strategy Selection. 

Challenges uncommitted hybrid decks in a way which gradually grows beyond the player's ability to handle without assembling a proper Burst/Grind engine. 
Mechanics include 
* DOT effects (which clearly telegraph incoming damage)
* Moderate health pools with no particular vulnerabilities (so that most damage types are effective)
* Enemies which dawdle in ways that don't directly contribute to victory (gaining temporary health with no payoff, dealing low enough damage that a strategy with no healing reliably makes it to the next rest point, positioning disruption without significant punishment for poor formations)
* Encounters with enemy lineups that don't all hone in on a particular area (mix of raw damage dealers, lust attacks, and poison) 

Player meta-upgrades designed for this act focus on early survival buffers, initial draft agency, and an acceleration of the early game state. Things like boost to hybrid builds, upgrading starting cards that don't play particularly effectively with dedicated combos, maximum health, increased chance of seeing unseen events, boosting odds of finding new common artifacts and unlocking characters/costumes.

### Act 2 (Excavation Front): 

Tests Vulnerability Coverage and directly filters out players still stuck in hybrid roles. Focuses in on areas such as:
* Higher levels of damage to make playing turn-by-turn without a strategy unviable.
* Indirect friction, making sub-par Burst or Grind builds fall apart. 
* More specialized health pools (often more focus on going big *or* going wide, enemies that need to be hit X times instead of having traditional health)
* Resistance to specific means of achieving Burst/Grind engine goals (resistance to lust *or* physical damage, healing away status effects)
* Enemies with their own engines to be disrupted (gaining temporary HP and having an effect where more than X causes a big attack, disrupting formation in an environment where a squishy party member dies quickly)
* Encounters with enemy lineups that hone in on a particular area (unified focus on just one way to kill party members)

Player meta-upgrades designed for this act focus on tools to ensure a strong engine can be constructed. Shop capital, card removal, rerolls, banishing things from the reward pool, and relic acquisition to fix holes.

### Act 3 (Marble Hive): 

Tests Engine Elasticity. Features hyper-synergistic encounters that test if your committed engine can maintain output under high friction. Locks in on areas such as:
* Similar but consistent levels of damage to Act 2, to filter out players that just barely arrived at the act.
* Deathknells for remaining hybrid players (elite with the ability to set party HP low, requiring a substantial amount of healing or a one-turn kill)
* Direct friction, making fragile Burst or Grind builds fall apart.
* Mixes of specialized health pools in the same encounter (Big enemy leading a squad of small ones, a duo of large beefcake enemies, a trio of medium enemies that need to be killed in the same turn).
* Demanding that Burst and Grind builds function in all possible environments (super resistance to one particular damage type)
* Encounters with enemy lineups which shut down builds that haven't shored up all weaknesses (heavy poison stacks each attack, damaging the party for drawing cards)

Player meta-upgrades designed for the late-game focus in multiple areas. Assembling your build earlier so you have more time to see situational picks to shore up weaknesses. Upgrades to rare cards which will only pay off once you've obtained them and built your engine. Ability to banish entire card categories at rest sites after you've picked up what you need. Resistance to highly specific weaknesses the player already knows they'll probably open themselves up to if they pursue a specific strategy.