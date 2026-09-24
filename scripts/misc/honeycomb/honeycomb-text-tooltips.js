//===================================================================================================
//HONEYCOMB CATACOMBS -- tooltip text
//===================================================================================================
//EVERY SENTENCE A TOOLTIP PANEL WRITES ITSELF lives here, grouped by the panel's KIND. The debug panel's
//"Toggle tooltip debug keys" prints `tooltip:<kind>:<key>` on each panel; the <kind> is the group heading
//below, and each entry's `index` starts with it.
//
//HOW TO EDIT
//  text        the words. `{name}` is filled in by the game; keep every token an entry already has.
//  .one/.many  a pair picked by a count ("1 charge" / "3 charges").
//Reading is honeycomb.tooltip.text(index, values) and honeycomb.tooltip.countText(index, count, values).
//A missing index prints as [index] on the panel and warns once in the console, so a typo is visible.
//LATER ENTRIES WIN: a mod or a translation can append entries with the same index to replace these.
//
//TEXT THAT LIVES ON CONTENT, NOT HERE. A tooltip also prints the content's own fields, which stay beside
//the thing they describe so adding content remains one table entry:
//  status descriptions            honeycomb-content-statuses.js   `description`
//  keyword descriptions           honeycomb-content-cards.js      keywordArray `description`
//  card rules text                honeycomb-content-cards.js      `text` (or generated from effects)
//  relic / equipment descriptions honeycomb-content-characters.js `description`
//  tag and lust-tag descriptions  honeycomb-tags.js / cardTagArray `description`
//  WEAKNESS RANK TITLES and their descriptions   honeycomb-tuning.js   lust.exposureRankArray `name`, `description`
//  mechanic and orb descriptions  honeycomb-content-characters.js mechanicArray
//  ability requirement lines      the ability's own `requirementArray[].text`; refusals in honeycomb-abilities.js
//  why a card cannot be played    honeycomb-combat.js             cardPlayability `explanation`
window.honeycomb = window.honeycomb || {};

honeycomb.tooltipTextArray = [
	//--- cardOffer: a card in the obtainable list ---
	{ index: "cardOffer.fallbackHeading", text: "Offer rate" },

	//--- banish: the button that strikes a card off this run's offer pools ---
	{ index: "banish.button", text: "Banish: remove this card from this run's rewards, shop and journal offers. Spends one banish." },

	//--- status ---
	{ index: "status.positive", text: "Beneficial." },
	{ index: "status.negative", text: "Harmful." },
	{ index: "status.turns.one", text: "{count} turn" },
	{ index: "status.turns.many", text: "{count} turns" },
	{ index: "status.stacks.one", text: "{count} stack" },
	{ index: "status.stacks.many", text: "{count} stacks" },
	{ index: "status.durationStart", text: "Loses a stack at the start of its owner's turn." },
	{ index: "status.durationEnd", text: "Loses a stack at the end of its owner's turn." },
	{ index: "status.intensityCarried", text: "Holds at its level, and carries between fights." },
	{ index: "status.clearsTurnEnd", text: "Holds at its level, then clears at the end of its owner's turn." },
	{ index: "status.intensity", text: "Holds at its level until removed. Cleared when the fight ends." },
	{ index: "status.tally", text: "A tally this effect manages itself." },

	//--- intent: an AI combatant's telegraphed move ---
	{ index: "intent.waiting", text: "Waiting" },
	{ index: "intent.whoseMove", text: "{name}'s move" },
	{ index: "intent.aimedAt", text: "aimed at {target}" },

	//--- card: the zoom's footer ---
	{ index: "card.owner", text: "{name}'s" },
	{ index: "card.brokenFrom", text: "Broken form of {name}" },

	//--- cardUpgrade ---
	{ index: "cardUpgrade.note", text: "After upgrading" },

	//--- equipment ---
	{ index: "equipment.onlyWearer", text: "Only {name} can wear this." },
	{ index: "equipment.overCapacity", text: "You have too many party members for this to be equipped!" },

	//--- equipmentCapacity: the count badge ---
	{ index: "equipmentCapacity.heading", text: "Equipment" },
	{ index: "equipmentCapacity.pieces.one", text: "{count} piece" },
	{ index: "equipmentCapacity.pieces.many", text: "{count} pieces" },
	{ index: "equipmentCapacity.each", text: "{pieces} each" },
	{ index: "equipmentCapacity.body", text: "With a party of {partySize}, each character can use {pieces}. A smaller party can equip more: every member short of {fullParty} lets each character use {extraPieces} more." },
	{ index: "equipmentCapacity.row", text: "Party of {size}" },
	{ index: "equipmentCapacity.rowOrMore", text: "{size}+" },
	{ index: "equipmentCapacity.pastLimit", text: "Pieces past the limit stay worn but do nothing, and are left behind when the run starts." },

	//--- ability ---
	{ index: "ability.charges.one", text: "{count} charge" },
	{ index: "ability.charges.many", text: "{count} charges" },
	{ index: "ability.chargesLeft", text: "{current} / {charges}" },
	{ index: "ability.rechargeCombatStart", text: "Recharges at the start of every fight." },
	{ index: "ability.rechargeTurnStart", text: "Recharges every turn." },
	{ index: "ability.rechargeRest", text: "Recharges when the party rests." },
	{ index: "ability.rechargeNever", text: "Does not recharge." },

	//--- weakness: a weakness row (lust weaknesses) ---
	{ index: "weakness.noRankAside", text: "No rank yet" },
	{ index: "weakness.rankLine", text: "Rank {rank} · {rankName}" },
	{ index: "weakness.multiplier", text: "{tag} Lust lands at ×{multiplier} on them." },
	{ index: "weakness.noRank", text: "No rank reached, so {tag} Lust lands normally. The ranks are what carry the extra weakness, not the count." },
	{ index: "weakness.maximum", text: "This is as far as it goes." },
	{ index: "weakness.toNextRank", text: "{amount} to next rank." },
	{ index: "weakness.heldForRun.one", text: "Held here until this run ends — a weakness rises at most {count} rank per run." },
	{ index: "weakness.heldForRun.many", text: "Held here until this run ends — a weakness rises at most {count} ranks per run." },
	{ index: "weakness.benchDays.one", text: "{count} day on the bench to reach the rank floor." },
	{ index: "weakness.benchDays.many", text: "{count} days on the bench to reach the rank floor." },
	{ index: "weakness.recentlyRanked", text: "Recently ranked up!" },
	{ index: "weakness.moreWaiting", text: "{count} more waiting after this one." },
	{ index: "weakness.eventButton", text: "Event Ready!" },

	//--- weaknessRank: one notch on the rail ---
	{ index: "weaknessRank.aside", text: "Rank {rank}" },
	{ index: "weaknessRank.reached", text: "Reached at {atOrAbove} exposure. Lust of that kind then lands at ×{multiplier}." },

	//--- weaknessBench: the bench counter ---
	{ index: "weaknessBench.heading", text: "Time on the bench" },
	{ index: "weaknessBench.body", text: "Every day a run spends without them takes {amount} off each weakness. It never drops a weakness below the rank it has already reached." },
	{ index: "weaknessBench.note", text: "Personal EXP can pay it down to the rank floor at once." },

	//--- weaknessReset: the reset button ---
	{ index: "weaknessReset.heading", text: "Reset to the rank floor" },
	{ index: "weaknessReset.cost", text: "{cost} EXP" },
	{ index: "weaknessReset.body", text: "Spends their personal EXP to drop every weakness to the start of the rank it has reached. No rank is lost." },
	{ index: "weaknessReset.have", text: "They have {amount} personal EXP." },
	{ index: "weaknessReset.refusal.runLive", text: "Only between runs." },
	{ index: "weaknessReset.refusal.notEnoughExperience", text: "Not enough personal EXP." },

	//--- lustEventGate: the heart on a roster entry ---
	{ index: "lustEventGate.aside", text: "Event Ready" },
	{ index: "lustEventGate.body", text: "A new Lust Event must be triggered before {name} can be added to the party!" },
	//The same panel for a queue row that does NOT lock (`locksParty: false`), where nothing is being kept
	//from the player and saying so would be a lie.
	{ index: "lustEventGate.bodyUnlocked", text: "{name} has something waiting, whenever you have a moment." },

	//--- enemyMoves: the enemy's move list window ---
	{ index: "enemyMoves.heading", text: "Next move" },
	{ index: "enemyMoves.body", text: "The move this enemy is set to play next." },

	//--- partyAlert: the party button while somebody is Broken ---
	{ index: "partyAlert.heading", text: "Someone is Broken" },
	{ index: "partyAlert.body", text: "Open the party window to see who and how far along they are. Outside a fight a broken member stands back up when their health is brought above their Lust -- rest sites and some events will do it." },

	//--- health ---
	{ index: "health.heading", text: "Health" },
	{ index: "health.body", text: "What is left of them. Temporary HP is spent before it, and Lust is measured against the two together." },

	//--- lust ---
	{ index: "lust.fallbackHeading", text: "Lust" },
	{ index: "lust.willBreak", text: "They break unless something changes." },
	//A fighter forecast to FALL gets this instead. The break margin is standing health minus
	//Lust, so lethal damage zeroes it on a body holding no Lust at all and the warning above was a lie.
	{ index: "lust.breakMoot", text: "They fall before Lust decides anything." },
	{ index: "lust.breakMargin", text: "{amount} more Lust would break them." },
	{ index: "lust.breakingDefeats", text: "Breaking them beats them outright." },

	//--- temporaryHealth ---
	{ index: "temporaryHealth.fallbackHeading", text: "Temporary HP" },
	{ index: "temporaryHealth.enemyTurn", text: "{total} → {after} once the enemies have acted: {spent} is spent soaking what is coming." },
	{ index: "temporaryHealth.halving", text: "Loses {share}% of itself at the start of their own turn, rounded {rounding}." },
	{ index: "temporaryHealth.nextTurn", text: "{standing} → {kept} at the start of their next turn." },

	//--- nameplate: while Broken ---
	{ index: "nameplate.brokenFallbackHeading", text: "Broken" },
	{ index: "nameplate.brokenReading", text: "Health {health} / {maxHealth}{temporary} · Lust {lust}" },
	{ index: "nameplate.brokenTemporary", text: " · Temporary HP +{temporary}" },
	{ index: "nameplate.recoveryShortfall", text: "Needs {amount} more health or Temporary HP (or {amount} less Lust) by the start of the next turn to recover." },
	{ index: "nameplate.recovers", text: "Recovers at the start of the next turn." },

	//--- forecast: the "what is about to change it" section of health / lust / temporaryHealth ---
	{ index: "forecast.nothing", text: "Nothing is about to change it." },
	{ index: "forecast.headline", text: "{from} → {to} if the turn ends now." },
	{ index: "forecast.down", text: "down" },
	{ index: "forecast.mightDamage", text: "Might take up to {amount} damage." },
	{ index: "forecast.mightLust", text: "Might take up to {amount} Lust." },
	{ index: "forecast.chance", text: "{cause} (chance)" },

	//--- resource ---
	{ index: "resource.scopeProfile", text: "Kept forever, across every run." },
	{ index: "resource.scopeRun", text: "Kept for this run." },
	{ index: "resource.scopeCombat", text: "Lasts only this fight." },
];
