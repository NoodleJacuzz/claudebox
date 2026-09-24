//===================================================================================================
//HONEYCOMB CATACOMBS -- combat engine
//===================================================================================================
//The rules of a fight, with no presentation in them. Every function here mutates state and appends to
//a log; the combat screen reads that log and animates it afterwards. Nothing in this file touches the
//DOM, and nothing in it reads a wall-clock time, which is what allows a whole fight to be replayed
//exactly from a seed.
//
//TURN STRUCTURE
//  beginCombat        build enemies, shuffle the deck, fire onCombatStart, telegraph intents
//  startPlayerTurn    halve temporary health, check recovery, tick ally statuses, refill energy, draw
//  playCard           (repeatable) pay, resolve, discard or exhaust
//  endPlayerTurn      decay ally durations, discard the hand
//  runEnemyTurn       each enemy ticks, then acts on the intent it telegraphed
//  ...back to startPlayerTurn, until one side is out
//
//The combat state lives at honeycomb.state.run.combat and is fully serialisable, so saving mid-fight
//and reloading resumes the same turn with the same draw pile order and the same telegraphed intents.
//
//NAMING: `honeycomb.combat` is this MODULE -- the functions below. `honeycomb.state.run.combat`, also
//reached as `context.combat`, is the STATE of the fight in progress. They are different objects and
//are never interchangeable; the path tells which is meant.
window.honeycomb = window.honeycomb || {};

honeycomb.combat = {};

//---------------------------------------------------------------------------------------------------
//The battle log's history
//---------------------------------------------------------------------------------------------------
//The per-beat log above is PRESENTATION: the screen animates it and throws it away. The battle log
//needs what happened to LAST -- to be read back after it has flashed past -- so a second, compact copy
//is kept on the fight itself, `combat.historyArray`.
//
//It is written from honeycomb.logEvent, the one door every entry passes through, which is why nothing
//can happen without appearing in it. Living on the combat state is also what makes it trustworthy: a
//card that stops to ask a question is rewound by restoring a snapshot, and a forecast runs against a
//copy that is thrown away -- in both cases the history rolls back with everything else, so the log
//never shows a play that did not happen. And it saves and reloads with the fight.
//
//Only the entry types the log words are kept (`kindArray`), with only their plain values, so a long
//fight stays small. Wording is the screen's job: see honeycomb.battleLogView (honeycomb-overlays-combat.js).
honeycomb.battleLog = {
	kindArray: [
		"turnStart", "intent", "cardPlayed", "abilityUsed", "moveUsed", "damage", "temporaryHealth", "heal",
		"temporaryRemoved", "temporaryDecayed",
		"lust", "lustReduced", "broken", "recovered", "brokenEscalation",
		"status", "statusRemoved", "statusBlocked", "downed", "enemySummoned", "allySummoned", "partyOrder",
		"cardDrawn", "reshuffle", "cardCreated", "cardUpgraded", "cardExhausted", "resource", "message",
		"optionChosen", "relicGained", "rewardAdded", "combatEnd",
	],
};

honeycomb.battleLog.record = function (combat, entry) {
	if (entry == null || honeycomb.battleLog.kindArray.indexOf(entry.type) < 0) return;
	//A forecast's world is discarded wholesale; writing into it is wasted work.
	if (honeycomb.forecast != null && honeycomb.forecast.active == true) return;
	if (combat.historyArray == null) combat.historyArray = [];

	var line = { turn: combat.turnNumber };
	for (var key in entry) {
		if (Object.prototype.hasOwnProperty.call(entry, key) == false) continue;
		var value = entry[key];
		if (value == null || typeof value !== "object") { line[key] = value; continue; }
		if (Array.isArray(value)) line[key] = value.slice();
	}
	//A card is named by what it IS, looked up now: a card made mid-fight is gone once the fight ends.
	if (line.cardId != null && line.card == null) {
		var instance = honeycomb.combat.cardInstance(line.cardId);
		if (instance != null) line.card = instance.cardIndex;
	}
	combat.historyArray.push(line);

	var overflow = combat.historyArray.length - honeycomb.tuning.battleLog.maximumEntries;
	if (overflow > 0) combat.historyArray.splice(0, overflow);
};

//---------------------------------------------------------------------------------------------------
//Starting a fight
//---------------------------------------------------------------------------------------------------
//encounterIndex names an entry in honeycomb.encounterArray. Returns the combat state.
//
//A FIGHT DOES NOT KNOW WHERE IT CAME FROM, and that is on purpose: a map node, an event and anything
//added later all start one the same way. `settings.continuation` says where the player goes once it
//is won -- a honeycomb.combatContinuationArray entry plus its own parameters -- and the victory screen
//asks that entry, rather than assuming the map. Omitted, it is the map.
//  settings.mapNodeId      the node it was entered from, when there is one
//  settings.continuation   {index, ...} -- see honeycomb.combatContinuationArray
//  settings.rewardArray    optional reward overrides for this one fight; see finishVictory
//  settings.victoryConditionArray / defeatConditionArray
//                          optional: what decides this one fight, over its encounter's; see
//                          honeycomb.fightEndConditionArray
honeycomb.combat.begin = function (encounterIndex, settings) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) {
		console.error("Honeycomb: combat begun with no active run");
		return null;
	}
	var encounter = honeycomb.requireDefinition(honeycomb.encounterArray, encounterIndex, "honeycomb.encounterArray");
	if (encounter == null) return null;
	var options = settings == null ? {} : settings;
	//A fight starts from the deck as it stands between fights; also clears fight-only card fields an
	//older save may still carry from a previous fight.
	honeycomb.combat.clearFightOnlyCardFields();

	var combat = {
		encounterIndex: encounterIndex,
		//Where the fight was entered from, so victory knows where to return the player.
		mapNodeId: options.mapNodeId == null ? null : options.mapNodeId,
		continuation: options.continuation == null ? { index: "map" } : options.continuation,
		rewardArray: options.rewardArray == null ? null : options.rewardArray,
		victoryConditionArray: options.victoryConditionArray == null ? null : options.victoryConditionArray,
		defeatConditionArray: options.defeatConditionArray == null ? null : options.defeatConditionArray,
		//The condition that decided the fight, once one has. See checkEnd.
		endCondition: null,
		turnNumber: 0,
		phase: "starting",
		enemyArray: [],
		drawPileArray: [],
		handArray: [],
		discardPileArray: [],
		exhaustPileArray: [],
		//Powers once played. Out of the cycle for the rest of the fight: the effect they applied is what
		//keeps working, so drawing them again would be drawing a card that has already happened.
		inPlayPileArray: [],
		//Cards an effect asked to be offered after this fight. See the addRewardCard effect.
		bonusRewardArray: [],
		//What this fight discovered for the first time, noted as it happens. See discovery.meet.
		discoveryArray: [],
		resourceArray: {},
		//Cards played this fight, for effects and relics that count them.
		cardsPlayedThisTurn: 0,
		cardsPlayedThisCombat: 0,
		//The presentation log for the beat currently being animated. Cleared as the UI consumes it.
		log: [],
		//The fight's history, for the battle log: what happened, turn by turn. See honeycomb.battleLog.
		historyArray: [],
	};
	run.combat = combat;

	//Build the enemy line-up. Health rolls from the encounter stream so the same seed fields the
	//same enemies at the same strength.
	var lineUpArray = honeycomb.combat.scaledLineUpArray(encounter);
	for (var slotIndex = 0; slotIndex < lineUpArray.length; slotIndex++) {
		var enemy = honeycomb.combat.newEnemy(lineUpArray[slotIndex], slotIndex,
			encounter.placementArray == null ? null : encounter.placementArray[slotIndex]);
		if (enemy != null) combat.enemyArray.push(enemy);
	}
	//Meeting an enemy for the first time is a discovery, won or lost. The shared pool pays for pushing
	//somewhere new, and the fight going badly does not make the thing any less seen.
	honeycomb.discovery.meetArray("enemy", lineUpArray, null);

	//Allies are the run's party members. Prepare them for a fight without disturbing their health,
	//which carries between combats.
	var context = honeycomb.newEffectContext({ combat: combat });
	//An enemy's passives: statuses it carries from the moment it appears. See
	//honeycomb.combat.applyEnemyPassives.
	for (var passiveIndex = 0; passiveIndex < combat.enemyArray.length; passiveIndex++) {
		honeycomb.combat.applyEnemyPassives(combat.enemyArray[passiveIndex], context);
		honeycomb.combat.applyEncounterStatuses(combat.enemyArray[passiveIndex], context);
	}
	var allyArray = honeycomb.entityArray("ally", combat);
	for (var allyIndex = 0; allyIndex < allyArray.length; allyIndex++) {
		var ally = allyArray[allyIndex];
		ally.side = "ally";
		ally.temporaryHealth = 0;
		ally.damageDealtThisTurn = 0;
		ally.carriedTemporaryHealth = 0;
		ally.healthLostLastEnemyTurn = 0;
		ally.healthAtTurnEnd = null;
		ally.reactionCountMap = null;
		ally.reactionResolvingMap = null;
		//A per-fight meter (Brienne's Resolve, Nettle's Harvest) starts at nothing.
		honeycomb.resetMechanics(ally, "combatStart", context);
		honeycomb.clearCombatStatuses(ally, context, { keepCarried: true });
		//A member who left the last fight with nothing left returns standing but at minimum health, so a
		//loss is a setback rather than a permanent removal. Reviving is a run-level rule, kept here in
		//one spot. A player character is never DOWNED -- they break instead -- so the test is on health
		//rather than on the flag, and the flag case is left for anything that still dies (a summoned ally
		//that survived to the next fight, were one ever made permanent).
		if (ally.downed == true || ally.health <= 0) {
			ally.downed = false;
			ally.health = Math.max(1, Math.floor(ally.maxHealth * honeycomb.tuning.combat.reviveHealthFraction));
		}
		//LUST AND BROKEN CARRY BETWEEN FIGHTS, exactly as health does -- but the spiral counter does
		//not, or a member broken for six turns of the last fight would arrive already at maximum
		//escalation. The revive above may also have put enough health back to end it outright.
		if (ally.lust == null) ally.lust = 0;
		ally.brokenTurnCount = 0;
		ally.recoveredThisTurn = false;
		//Combat setup counts as a turn start for the recovery window: a member who walked in above
		//their lust is standing when the first turn opens, not one turn later.
		honeycomb.checkRecovery(ally, context, { atTurnStart: true });
		honeycomb.checkBreak(ally, context);
		//The half-health cut-in is once per fight: a member who walks in already hurt has already had
		//that moment, so the flag starts set for them. Health is final by now -- the revive above and
		//the recovery check have both run.
		ally.halfHealthShown = ally.health <= ally.maxHealth * honeycomb.tuning.halfHealthOverlay.thresholdFraction;
	}

	//Build the draw pile from the run deck. The deck itself is never reordered; the pile is a copy of
	//its instance ids, so cards gained mid-fight do not disturb the permanent deck.
	combat.drawPileArray = honeycomb.combat.buildDrawPile();

	honeycomb.combat.grantEnergy(context);

	//Abilities that refresh per fight do so before the first turn, so their charges are visible on
	//the opening board rather than appearing after a turn has passed.
	honeycomb.abilities.recharge("combatStart");

	//onCombatStart fires for allies only: relics and equipment are an ally-side system.
	honeycomb.fireCombatHooks("onCombatStart", context, "ally");

	//PREPTIME (rest option): the party carried Temporary HP in from a rest. The run stores the fraction;
	//this spends it once and clears it, so it never reaches a second fight.
	var preptimeRun = honeycomb.state.run;
	if (preptimeRun != null && preptimeRun.preptimeFraction != null && preptimeRun.preptimeFraction > 0) {
		for (var preptimeIndex = 0; preptimeIndex < allyArray.length; preptimeIndex++) {
			var preptimeAmount = Math.round(allyArray[preptimeIndex].maxHealth * preptimeRun.preptimeFraction);
			if (preptimeAmount > 0) honeycomb.grantTemporaryHealth(allyArray[preptimeIndex], preptimeAmount, context);
		}
		preptimeRun.preptimeFraction = null;
	}

	combat.phase = "playerTurn";
	honeycomb.combat.startPlayerTurn(context);
	honeycomb.save.autosave("nodeEnter");
	return combat;
};

//The enemies an encounter fields. No count scaling: the line-up is exactly what the encounter names,
//whatever the party is. The stat seams in honeycomb.scaling still exist for a future difficulty curve.
honeycomb.combat.scaledLineUpArray = function (encounter) {
	return encounter.enemyIndexArray.slice();
};

//How many bodies an encounter will field, for the map preview. The line-up is fixed now, so this is the
//encounter's own list; kept as a function because the preview and combat.begin should read one answer.
honeycomb.combat.scaledEnemyCount = function (encounter) {
	return encounter.enemyIndexArray.length;
};

//Makes a fresh enemy entity.
//`placement` is the encounter's say over how this enemy STANDS -- {scale, offsetXPercent,
//offsetYPercent}, laid over the definition's own `presentation` -- so one boss can loom at the back of
//one fight and stand plainly in another. Kept on the entity so a saved fight looks the same resumed.
honeycomb.combat.newEnemy = function (enemyIndex, slotIndex, placement) {
	var definition = honeycomb.requireDefinition(honeycomb.enemyArray, enemyIndex, "honeycomb.enemyArray");
	if (definition == null) return null;

	var variance = definition.healthVariance == null ? 0 : definition.healthVariance;
	var health = definition.baseHealth;
	if (variance > 0) {
		health = honeycomb.rng.range(honeycomb.tuning.rng.streamArray.encounter,
			definition.baseHealth - variance, definition.baseHealth + variance);
	}
	//Scaled after the variance roll, so the roll itself stays comparable between party sizes and only
	//its result is stretched.
	health = Math.max(1, Math.round(health * honeycomb.scaling.enemyHealthMultiplier()));

	return {
		instanceId: honeycomb.nextIdentifier("enemy"),
		enemyIndex: enemyIndex,
		side: "enemy",
		//Position in the line-up, which the combat screen uses for placement.
		slotIndex: slotIndex,
		placement: honeycomb.combat.placementFor(definition, placement),
		health: health,
		maxHealth: health,
		temporaryHealth: 0,
		//Enemies carry the lust fields so every reader can treat any combatant the same way, but
		//honeycomb.entityUsesLust says no for them and nothing ever writes here. Death is still death
		//for an enemy; breaking is for the player characters who are worth the cut-in.
		lust: 0,
		broken: false,
		brokenTurnCount: 0,
		statusArray: [],
		downed: false,
		//Move bookkeeping, read by the selection strategies: the card telegraphed for this turn, the last
		//one played, how many times running, and where a "sequence" enemy is in its list.
		intentCardIndex: null,
		lastMoveCardIndex: null,
		sameMoveCount: 0,
		movePosition: 0,
	};
};

//An enemy's passives: `startingStatusArray` on its definition, [{status, stacks}], applied when it
//enters a fight -- at the start, or when summoned. A passive is an ordinary status, so its
//behaviour is the status's hooks (usually honeycomb.reactionHooks) and its tooltip is the status's text.
honeycomb.combat.applyEnemyPassives = function (entity, context) {
	var found = honeycomb.entityDefinition(entity);
	if (found == null || found.kind != "enemy" || found.definition.startingStatusArray == null) return;
	var passiveArray = found.definition.startingStatusArray;
	for (var passiveIndex = 0; passiveIndex < passiveArray.length; passiveIndex++) {
		honeycomb.applyStatus(entity, passiveArray[passiveIndex].status, passiveArray[passiveIndex].stacks, context);
	}
};

//What the fight itself puts on its enemies: an encounter's `enemyStartingStatusArray`,
//[{status, stacks}], applied to every enemy-side combatant as it enters -- the opening line-up, and
//anything summoned to that side later. It exists so ONE definition can be fought at two strengths.
//Anastasia's pieces are her own board when they stand with the party and the gauntlet's enemies when they
//do not; their numbers cannot be raised for the second job without raising the first. A fight that wants
//them harder says so here, and her board never hears about it.
//NOT re-applied on promotion: the body was already given it, and a status the BODY picked up stays
//through a change of shape (honeycomb.promoteEntity).
honeycomb.combat.applyEncounterStatuses = function (entity, context) {
	var combat = context == null ? null : context.combat;
	if (entity == null || combat == null || entity.side != "enemy") return;
	var encounter = honeycomb.findDefinition(honeycomb.encounterArray, combat.encounterIndex);
	if (encounter == null) return;
	var statusArray = encounter.enemyStartingStatusArray;
	for (var statusIndex = 0; statusArray != null && statusIndex < statusArray.length; statusIndex++) {
		honeycomb.applyStatus(entity, statusArray[statusIndex].status, statusArray[statusIndex].stacks, context);
	}
	//A fight can also give its enemies a wall of temporary HP to start behind, to buff a smaller line-up
	//without raising its stats. Temporary HP is not a status -- it is a number on the entity -- so it
	//cannot ride the array above and needs a field of its own. Granted through the shared path, so it is
	//logged and capped exactly as a card's would be.
	if (encounter.enemyStartingTemporaryHealth > 0) {
		honeycomb.grantTemporaryHealth(entity, encounter.enemyStartingTemporaryHealth, context);
	}
};

//How an enemy stands on the battlefield: its definition's `presentation` with the
//encounter's `placement` laid over it, field by field. Null when neither says anything, so the common
//case costs the save nothing. Fields: `scale` (1 = drawn size), `offsetXPercent` / `offsetYPercent`
//(of the sprite's own box; positive is right / down).
honeycomb.combat.placementFor = function (definition, placement) {
	var base = definition == null ? null : definition.presentation;
	if (base == null && placement == null) return null;
	var result = {};
	var fieldArray = honeycomb.tuning.layout.placementFieldArray;
	for (var fieldIndex = 0; fieldIndex < fieldArray.length; fieldIndex++) {
		var field = fieldArray[fieldIndex];
		if (placement != null && placement[field] != null) result[field] = placement[field];
		else if (base != null && base[field] != null) result[field] = base[field];
	}
	return result;
};

//The draw pile for a new fight: every card in the run deck, shuffled from the shuffle stream.
//Cards are held as instance ids; honeycomb.combat.cardInstance resolves them back.
honeycomb.combat.buildDrawPile = function () {
	var run = honeycomb.state.run;
	var idArray = [];
	for (var cardIndex = 0; cardIndex < run.deckArray.length; cardIndex++) {
		var card = run.deckArray[cardIndex];
		//A downed ally's cards may be excluded from the fight, which tuning decides.
		if (honeycomb.tuning.combat.downedAllyCardsRemain == false && honeycomb.combat.ownerIsDowned(card) == true) continue;
		idArray.push(card.instanceId);
	}
	var shuffled = honeycomb.rng.shuffle(honeycomb.tuning.rng.streamArray.shuffle, idArray);

	//Innate cards are lifted to the front so the opening draw always contains them.
	var innateArray = [];
	var restArray = [];
	for (var scanIndex = 0; scanIndex < shuffled.length; scanIndex++) {
		var resolved = honeycomb.combat.resolveById(shuffled[scanIndex]);
		if (resolved != null && resolved.innate == true) innateArray.push(shuffled[scanIndex]);
		else restArray.push(shuffled[scanIndex]);
	}
	return innateArray.concat(restArray);
};

honeycomb.combat.ownerIsDowned = function (card) {
	if (card.ownerInstanceId == null) return false;
	var run = honeycomb.state.run;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		if (run.partyArray[memberIndex].instanceId != card.ownerInstanceId) continue;
		return run.partyArray[memberIndex].downed == true;
	}
	return false;
};

//---------------------------------------------------------------------------------------------------
//Card instance lookup
//---------------------------------------------------------------------------------------------------
//Piles hold instance ids rather than card objects, so one card can never be in two piles at once and
//a save cannot duplicate it. These resolve an id back to the real instance and to its upgraded view.
honeycomb.combat.cardInstance = function (instanceId) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return null;
	for (var cardIndex = 0; cardIndex < run.deckArray.length; cardIndex++) {
		if (run.deckArray[cardIndex].instanceId == instanceId) return run.deckArray[cardIndex];
	}
	//Cards generated during the fight live on the combat state rather than the run deck, since they
	//vanish when the fight ends.
	var combat = run.combat;
	if (combat != null && combat.temporaryCardArray != null) {
		for (var temporaryIndex = 0; temporaryIndex < combat.temporaryCardArray.length; temporaryIndex++) {
			if (combat.temporaryCardArray[temporaryIndex].instanceId == instanceId) return combat.temporaryCardArray[temporaryIndex];
		}
	}
	return null;
};

honeycomb.combat.resolveById = function (instanceId) {
	return honeycomb.resolveCard(honeycomb.combat.cardInstance(instanceId));
};

//---------------------------------------------------------------------------------------------------
//Turn boundaries
//---------------------------------------------------------------------------------------------------
//A CARD LEAVING THE FIGHT FOR GOOD, said once. Every route into the exhaust pile goes through here --
//played, ethereal, moved by an effect -- so anything that counts burned cards (Nettle's Harvest) hears
//all of them rather than the one route it was written against. The caller does the pushing; this says
//what happened.
honeycomb.combat.noteExhaust = function (instanceId, reason, context, fromPileArray) {
	honeycomb.logEvent(context, { type: "cardExhausted", cardId: instanceId, reason: reason, fromPileArray: fromPileArray });
	honeycomb.fireRunHooks("onCardExhausted", { cardId: instanceId, reason: reason, context: context });
};

//TEMPORARY HP HALVES at the start of its owner's turn rather than wearing off. Logged, because the
//screen follows the LOG for what the bars show: a silent reset would leave the shown amount standing
//until the next full repaint.
//
//Losing tHP narrows the gap between health and lust, so this can BREAK somebody -- a character who
//ended their turn one point ahead on borrowed gold starts the next one over the line.
honeycomb.combat.decayTemporary = function (entity, context) {
	var standing = entity.temporaryHealth == null ? 0 : entity.temporaryHealth;
	if (standing <= 0) return;
	//How much halving takes is a hook: Entrenched and the Bastion slow it.
	var kept = honeycomb.decayedTemporaryHealth(standing, honeycomb.temporaryDecayFraction(entity, context));
	entity.temporaryHealth = kept;
	honeycomb.logEvent(context, { type: "temporaryDecayed", targetId: entity.instanceId, amount: standing - kept, remaining: kept });
	if (standing - kept > 0) {
		honeycomb.fireEntityHooks("onTemporaryDecayed", { entity: entity, amount: standing - kept, context: context });
	}
	honeycomb.checkBreak(entity, context);
};

honeycomb.combat.startPlayerTurn = function (context) {
	var combat = honeycomb.state.run.combat;
	if (combat == null) return;
	combat.turnNumber += 1;
	combat.phase = "playerTurn";
	combat.cardsPlayedThisTurn = 0;
	//Blood spilled is counted per party turn: the enemy turn's hits are forgotten as this one opens.
	combat.partyDamageTakenThisTurn = 0;
	//And what the other side took, counted over the same window (read by the Infernal Court).
	combat.enemyDamageTakenThisTurn = 0;
	var turnContext = context == null ? honeycomb.newEffectContext({ combat: combat }) : context;
	honeycomb.logEvent(turnContext, { type: "turnStart", turn: combat.turnNumber, side: "ally" });

	var allyArray = honeycomb.livingEntityArray("ally", combat);
	for (var allyIndex = 0; allyIndex < allyArray.length; allyIndex++) {
		var ally = allyArray[allyIndex];
		//Temporary HP is not decayed on the opening turn. It is already zero from combat setup, so the
		//only thing a turn-1 decay can destroy is tHP granted by an onCombatStart relic.
		if (honeycomb.tuning.combat.temporaryHealthDecays == true && combat.turnNumber > 1) honeycomb.combat.decayTemporary(ally, turnContext);
		//What survived the enemy turn: the tHP left after the halving is what Brienne's Oath cards call
		//"carried", and the health lost since her last turn ended is what Answer in Kind reads.
		ally.carriedTemporaryHealth = ally.temporaryHealth == null ? 0 : ally.temporaryHealth;
		ally.healthLostLastEnemyTurn = ally.healthAtTurnEnd == null ? 0 : Math.max(0, ally.healthAtTurnEnd - ally.health);
		//A new turn: what they dealt last turn is last turn's business (Severine's Thirst reads it).
		ally.damageDealtThisTurn = 0;
		//The recovery window: a broken character is cured once their turn starts with HP higher than
		//lust. Checked AFTER the tHP decay above, so gold that halved away this instant cannot be what
		//carries somebody over the line.
		ally.recoveredThisTurn = false;
		honeycomb.checkRecovery(ally, turnContext, { atTurnStart: true });
		//Statuses that act on their owner's turn start (poison, regeneration) fire before anything
		//else, so an ally can be downed by poison before drawing.
		honeycomb.fireEntityHooks("onTurnStart", { entity: ally, context: turnContext });
		honeycomb.tickStatuses(ally, "ownerTurnStart", turnContext);
	}

	honeycomb.abilities.recharge("turnStart");
	honeycomb.combat.grantEnergy(turnContext);
	honeycomb.combat.drawForTurn(turnContext);
	honeycomb.combat.telegraphIntents(turnContext);
	honeycomb.combat.checkEnd(turnContext);

	//The one safe moment to snapshot a fight: the hand is dealt, intents are telegraphed, and the
	//board accepts input. Reloading here puts the player exactly where they left off.
	honeycomb.save.autosave("playerTurnStart");
};

//Whether this is the fight's first player turn (the setup grant at combat start counts as it too).
honeycomb.combat.isOpeningTurn = function (context) {
	return context != null && context.combat != null && context.combat.turnNumber <= 1;
};

//Sets energy for the turn, after every modifier.
honeycomb.combat.grantEnergy = function (context) {
	var base = honeycomb.tuning.combat.energyPerTurn;
	var carried = honeycomb.tuning.combat.energyCarriesOver == true ? honeycomb.getResource("energy") : 0;

	//Energy is a party-wide pool, so per-ally sources are folded across the team and run-wide sources
	//exactly once. Including relics in the per-ally pass would grant a +1 Energy relic +1 PER MEMBER,
	//which is why hookSourceArray takes includeRunWide.
	var total = base;
	var allyArray = honeycomb.livingEntityArray("ally", context.combat);
	for (var allyIndex = 0; allyIndex < allyArray.length; allyIndex++) {
		total = honeycomb.applyStatusHooks("modifyEnergyPerTurn", total,
			{ entity: allyArray[allyIndex], context: context, includeRunWide: false });
	}
	total = honeycomb.applyRunHooks("modifyEnergyPerTurn", total, { context: context });
	//TREE NODES (OpenD/OpenE): a per-turn energy bonus, party-wide plus the benched "Always" tier.
	total += honeycomb.partyFieldTotal("energyPerTurnBonus") + honeycomb.profileFieldTotal("energyPerTurnBonusAlways");
	//OPENING BUFFER (STARTER-LIST "Opening card/energy"): turn 1 only.
	if (honeycomb.combat.isOpeningTurn(context)) total += honeycomb.partyFieldTotal("openingEnergyBonus");

	//Recorded so the energy readout can show this turn's real maximum. Reading the tuning base
	//instead would print "4 / 3" whenever a relic granted extra.
	var granted = Math.max(0, Math.floor(total));
	if (context.combat != null) context.combat.energyThisTurn = granted + carried;
	honeycomb.setResource("energy", granted + carried);
	//Once the turn's energy is SET, what was folded into it may be used up. A hook that adds energy at
	//turn start must fire after this or the line above overwrites it and it never does anything.
	for (var grantedIndex = 0; grantedIndex < allyArray.length; grantedIndex++) {
		honeycomb.fireEntityHooks("onEnergyGranted", { entity: allyArray[grantedIndex], context: context });
	}
};

//Draws the turn's opening hand.
honeycomb.combat.drawForTurn = function (context) {
	//Same party-wide folding rule as energy: per-ally sources across the team, relics once.
	var amount = honeycomb.tuning.combat.handSizePerTurn;
	var allyArray = honeycomb.livingEntityArray("ally", context.combat);
	for (var allyIndex = 0; allyIndex < allyArray.length; allyIndex++) {
		amount = honeycomb.applyStatusHooks("modifyDrawPerTurn", amount,
			{ entity: allyArray[allyIndex], context: context, includeRunWide: false });
	}
	amount = honeycomb.applyRunHooks("modifyDrawPerTurn", amount, { context: context });
	//TREE NODES (OpenD/OpenE): a per-turn draw bonus, party-wide plus the benched "Always" tier.
	amount += honeycomb.partyFieldTotal("drawPerTurnBonus") + honeycomb.profileFieldTotal("drawPerTurnBonusAlways");
	if (honeycomb.combat.isOpeningTurn(context)) amount += honeycomb.partyFieldTotal("openingDrawBonus");
	honeycomb.drawCards(Math.max(0, Math.floor(amount)), context);
};

//Every AI combatant, on EITHER team, picks and telegraphs its move for the coming turn -- a summoned
//Sporeling fighting for the party shows its card too.
honeycomb.combat.telegraphIntents = function (context) {
	var entityArray = honeycomb.livingEntityArray("both", context.combat);
	for (var entityIndex = 0; entityIndex < entityArray.length; entityIndex++) {
		var entity = entityArray[entityIndex];
		if (honeycomb.isAiControlled(entity) == false) continue;
		honeycomb.logEvent(context, {
			type: "intent",
			targetId: entity.instanceId,
			card: honeycomb.selectMove(entity),
		});
	}
};

honeycomb.combat.endPlayerTurn = function () {
	var combat = honeycomb.state.run.combat;
	if (combat == null || combat.phase != "playerTurn") return null;

	var context = honeycomb.newEffectContext({ combat: combat });
	combat.phase = "endingPlayerTurn";

	//Dynamic retargeting for the Chessmaster: the party is re-read before every step and the frontmost
	//ally that has not resolved yet goes next, so a piece that moves itself mid-resolution changes who
	//resolves after it. Caching the array up front would make a shift during resolution do nothing.
	//Tracking instance ids rather than positions is what stops a piece being skipped when somebody ahead
	//of it dies, or resolving twice when it falls back.
	//
	//For every character that does NOT move during turn-end -- which is all six of the others -- this
	//resolves in exactly the old order.
	var resolvedArray = [];
	var resolutionGuard = 0;
	while (resolutionGuard < honeycomb.tuning.chessmaster.turnEndResolutionGuard) {
		resolutionGuard += 1;
		var livingArray = honeycomb.livingEntityArray("ally", combat);
		var acting = null;
		for (var scanIndex = 0; scanIndex < livingArray.length; scanIndex++) {
			if (resolvedArray.indexOf(livingArray[scanIndex].instanceId) < 0) {
				acting = livingArray[scanIndex];
				break;
			}
		}
		if (acting == null) break;
		resolvedArray.push(acting.instanceId);

		honeycomb.fireEntityHooks("onTurnEnd", { entity: acting, context: context });
		honeycomb.tickStatuses(acting, "ownerTurnEnd", context);
		//What the enemy turn is about to take is measured from here (Severine's Answer in Kind).
		acting.healthAtTurnEnd = acting.health;
		//The broken spiral: after a turn, characters in a broken state build up lust and lost HP in
		//increasing amounts each turn. Applied at the turn's END, so the first turn broken already costs
		//something and a party that ignores it loses ground faster every turn.
		honeycomb.applyBrokenEscalation(acting, context);
	}

	//The other side's turn-end. Every combatant whose turn is NOT this one hears
	//`onTeamTurnEnd` -- poison ticks there, so every poisoned enemy loses health at once as the player's
	//turn closes, and every poisoned ally when the enemy's does. Each tick logs its own damage entry,
	//which the replay plays as its own rapid impact beat.
	honeycomb.fireCombatHooks("onTeamTurnEnd", context, "enemy");

	//What a card does if you did not play it (Anastasia's Blunder). A card may carry an
	//`unplayedEffectArray`, resolved here for every copy still in hand as the turn closes -- BEFORE the
	//discard, and outside it, so a rule set with `discardHandOnTurnEnd` off still fires it.
	//Its source is the card's own owner, so it reads that fighter's place and modifiers like a played one.
	honeycomb.combat.resolveUnplayedCards(context);

	if (honeycomb.tuning.combat.discardHandOnTurnEnd == true) honeycomb.combat.discardHand(context);

	//The party's AI combatants -- anything fighting for the party that the player does not command --
	//play their telegraphed moves as the party's turn closes, before the other team answers.
	honeycomb.combat.playAiMoves("ally", context);

	//After everything the side does. `onTurnEnd` fires per member DURING the loop above, so
	//a member near the front hears it before the pieces behind them have moved -- which is no use to
	//anything that has to read what the whole side did this turn. This fires once the side is finished.
	//Anastasia's two Court statuses are its first users: one pays out the party's banked Temporary HP,
	//the other the damage the whole side dealt, and both would read a fraction of it any earlier.
	honeycomb.fireCombatHooks("onSideTurnResolved", context, "ally");

	honeycomb.logEvent(context, { type: "turnEnd", turn: combat.turnNumber, side: "ally" });
	//Only a won fight ends here; the turn limit is judged after the other team's turn, as it always was.
	var decided = honeycomb.combat.decidedOutcome(combat);
	if (decided != null && decided.outcome == "victory") honeycomb.combat.checkEnd(context);
	//Deliberately NOT an autosave point: phase is "endingPlayerTurn" here, which is transitional.
	//The turn is saved at the START of the next player turn instead, once the board accepts input.
	return context;
};

//Every card still held as the turn closes gets to say so, if it has anything to say. A card that does
//nothing when played and something when NOT played is the shape this exists for: the broken hand that
//punishes being sat on. Walked backwards, because an effect may remove the card it belongs to.
honeycomb.combat.resolveUnplayedCards = function (context) {
	var combat = context.combat;
	if (combat == null || combat.handArray == null) return;
	for (var handIndex = combat.handArray.length - 1; handIndex >= 0; handIndex--) {
		var resolved = honeycomb.combat.resolveById(combat.handArray[handIndex]);
		if (resolved == null || resolved.unplayedEffectArray == null) continue;
		var owner = honeycomb.cardActingEntity(resolved, combat);
		if (owner == null || owner.downed == true) continue;
		var cardContext = honeycomb.newEffectContext({ source: owner, card: resolved, combat: combat, log: context.log });
		honeycomb.applyResolvedTargets(cardContext, resolved.targetMode,
			honeycomb.resolveTargetMode(resolved.targetMode, cardContext));
		honeycomb.resolveEffectArray(resolved.unplayedEffectArray, cardContext);
	}
};

//Discards the hand, honouring retain and ethereal.
honeycomb.combat.discardHand = function (context) {
	var combat = context.combat;
	for (var handIndex = combat.handArray.length - 1; handIndex >= 0; handIndex--) {
		var instanceId = combat.handArray[handIndex];
		var resolved = honeycomb.combat.resolveById(instanceId);
		if (resolved != null && resolved.retain == true) continue;
		combat.handArray.splice(handIndex, 1);
		if (resolved != null && resolved.ethereal == true) {
			combat.exhaustPileArray.push(instanceId);
			honeycomb.combat.noteExhaust(instanceId, "ethereal", context, null);
			continue;
		}
		combat.discardPileArray.push(instanceId);
		honeycomb.logEvent(context, { type: "cardDiscarded", cardId: instanceId });
	}
};

//---------------------------------------------------------------------------------------------------
//Enemy turn
//---------------------------------------------------------------------------------------------------
//Resolves every enemy's telegraphed intent in line-up order. Returns the context so the caller can
//animate the log it produced.
honeycomb.combat.runEnemyTurn = function () {
	var combat = honeycomb.state.run.combat;
	if (combat == null) return null;
	var context = honeycomb.newEffectContext({ combat: combat });
	combat.phase = "enemyTurn";
	honeycomb.logEvent(context, { type: "turnStart", turn: combat.turnNumber, side: "enemy" });

	var enemyArray = honeycomb.livingEntityArray("enemy", combat);
	for (var enemyIndex = 0; enemyIndex < enemyArray.length; enemyIndex++) {
		var enemy = enemyArray[enemyIndex];
		//Either team losing ends the turn: a Matriarch downed by her own poison does not leave her brood
		//finishing their moves against a fight already won. Asked at the TOP, because every `continue`
		//below would otherwise skip it.
		if (honeycomb.combat.decidedOutcome(combat) != null) break;
		//An enemy downed earlier in this same turn does not get to act.
		if (enemy.downed == true) continue;

		honeycomb.fireEntityHooks("onTurnStart", { entity: enemy, context: context });
		honeycomb.tickStatuses(enemy, "ownerTurnStart", context);
		if (enemy.downed == true) continue;
		//The charging bar fills on its owner's turn, before the move is played and well before the next
		//one is telegraphed.
		honeycomb.gainMoveCharge(enemy);

		//Temporary HP halves on its holder's own turn either way, matching the ally rule.
		if (honeycomb.tuning.combat.temporaryHealthDecays == true) honeycomb.combat.decayTemporary(enemy, context);
		enemy.damageDealtThisTurn = 0;
		//An enemy-side CHARACTER uses lust like any other character, so the recovery window and the
		//spiral both belong to whoever is taking a turn, not to the party's team.
		enemy.recoveredThisTurn = false;
		honeycomb.checkRecovery(enemy, context, { atTurnStart: true });

		if (honeycomb.isAiControlled(enemy) == true) honeycomb.combat.playMove(enemy, context);

		honeycomb.fireEntityHooks("onTurnEnd", { entity: enemy, context: context });
		honeycomb.tickStatuses(enemy, "ownerTurnEnd", context);
		honeycomb.applyBrokenEscalation(enemy, context);
	}

	//The party's turn-end: poison on the party ticks when the enemy's turn closes.
	honeycomb.fireCombatHooks("onTeamTurnEnd", context, "ally");
	honeycomb.logEvent(context, { type: "turnEnd", turn: combat.turnNumber, side: "enemy" });
	honeycomb.combat.checkEnd(context);
	return context;
};

//Every living AI combatant on `side` plays its telegraphed move, in line order, until the other side
//falls. The enemy team's turn is this with status ticks around each; the party's AI allies do it as
//the party's turn ends.
honeycomb.combat.playAiMoves = function (side, context) {
	var combat = context.combat;
	var entityArray = honeycomb.livingEntityArray(side, combat);
	for (var entityIndex = 0; entityIndex < entityArray.length; entityIndex++) {
		var entity = entityArray[entityIndex];
		if (entity.downed == true || honeycomb.isAiControlled(entity) == false) continue;
		honeycomb.combat.playMove(entity, context);
		if (honeycomb.combat.decidedOutcome(combat) != null) break;
	}
};

//AN AI COMBATANT PLAYS ITS TELEGRAPHED MOVE -- a card, the same kind the party holds. Its targets resolve
//relative to the combatant (a picked target is chosen by honeycomb.aiPickTarget) and its effects run
//with the combatant as the source, so nothing here knows or cares which team is acting.
honeycomb.combat.playMove = function (entity, context) {
	var card = honeycomb.telegraphedCard(entity);
	//One whose telegraphed move is no longer legal picks again rather than doing nothing.
	if (card == null) card = honeycomb.moveCard(entity, honeycomb.selectMove(entity));
	if (card == null) return;

	honeycomb.logEvent(context, { type: "moveUsed", sourceId: entity.instanceId, card: card.index });

	var actionContext = honeycomb.newEffectContext({ source: entity, card: card, combat: context.combat, log: context.log });
	//A TURNED move is taken for the other team: its targets resolve from that side.
	if (card.isTurned == true) actionContext.actingSide = card.userSide;
	if (honeycomb.targetModeRequiresPick(card.targetMode) == true && honeycomb.targetModeKind(card.targetMode) == "entity") {
		actionContext.target = honeycomb.aiPickTarget(entity, card, context.combat, card.isTurned == true ? card.userSide : null);
	}
	//A move aimed at random is CHANCE, exactly as a card's would be, so a forecast can say "might".
	honeycomb.applyResolvedTargets(actionContext, card.targetMode, honeycomb.resolveTargetMode(card.targetMode, actionContext));
	honeycomb.resolveEffectArray(card.effectArray, actionContext);
	honeycomb.noteMovePlayed(entity, card.index);
	//A move played is a world event, for anything that wants to answer an enemy's move once it lands.
	honeycomb.fireRunHooks("onMovePlayed", { entity: entity, card: card, context: actionContext });

	//The telegraph is spent. The card is on the board, so the combatant has
	//nothing left to cast this turn. The intent RECORD stays (it is what the log and the move list read),
	//but a repaint partway through the turn -- an enemy summon, most visibly the Matriarch's Swarm -- must
	//not draw the card just played as though it were still coming. `selectMove` clears the flag when the
	//next move is telegraphed. Set AFTER resolution so an effect that reads its own intent still sees it.
	entity.intentSpent = true;
};

//---------------------------------------------------------------------------------------------------
//Playing a card
//---------------------------------------------------------------------------------------------------
//The single path by which a player card takes effect. Returns a result object rather than throwing,
//so the UI can explain a refusal.
honeycomb.combat.playCard = function (instanceId, targetInstanceId, answerArray) {
	var combat = honeycomb.state.run.combat;
	if (combat == null) return { played: false, reason: "noCombat" };
	if (combat.phase != "playerTurn") return { played: false, reason: "notPlayerTurn" };
	if (combat.handArray.indexOf(instanceId) < 0) return { played: false, reason: "notInHand" };

	var instance = honeycomb.combat.cardInstance(instanceId);
	var resolved = honeycomb.resolveCard(instance);
	if (resolved == null) return { played: false, reason: "unknownCard" };

	//Covers both a null cost -- a curse that exists only to clog a hand -- and a card whose owner is
	//out of the fight, which the owner-down policy decides about.
	var playability = honeycomb.cardPlayability(resolved, combat);
	if (playability.playable == false) return { played: false, reason: playability.reason };

	//The acting entity rides along so a card's own gate can read its owner ("needs 5 Temporary HP").
	var checkContext = honeycomb.newEffectContext({ combat: combat, card: resolved, source: honeycomb.cardActingEntity(resolved, combat) });
	if (honeycomb.canAfford(honeycomb.combat.playCost(resolved, checkContext)) == false) {
		return { played: false, reason: "cannotAfford" };
	}

	//A card may refuse to be played for its own reasons.
	if (resolved.playableCondition != null && honeycomb.testCondition(resolved.playableCondition, checkContext) == false) {
		return { played: false, reason: "conditionNotMet" };
	}

	//A card may also refuse a TARGET (Cinder's move cards cannot land on somebody already standing where
	//they would be sent). The drag and the legal-target marks ask the same rule, so this is the safety
	//net behind them.
	if (targetInstanceId != null && resolved.targetCondition != null) {
		var targetContext = honeycomb.newEffectContext({ combat: combat, card: resolved, source: honeycomb.cardActingEntity(resolved, combat) });
		targetContext.target = honeycomb.findEntity(targetInstanceId, combat);
		if (honeycomb.testCondition(resolved.targetCondition, targetContext) == false) {
			return { played: false, reason: "invalidTarget" };
		}
	}

	//An ENTITY pick must be supplied by the caller -- dropped on a fighter. A CARD pick need not be: a
	//card that targets cards ASKS for them once played (a window with slots), so no card is ever dragged
	//onto another. Which one targetInstanceId names is the mode's kind.
	var cardPick = honeycomb.targetModeKind(resolved.targetMode) == "card";
	if (honeycomb.targetModeRequiresPick(resolved.targetMode) == true && targetInstanceId == null && cardPick == false) {
		return { played: false, reason: "needsTarget" };
	}

	//Everything from here down may be REPLAYED. An effect that stops to ask the player a question
	//rewinds the whole attempt -- spent energy included -- and it runs again once the answer exists.
	//See honeycomb-choices.js. buildContext is called fresh each pass so no entity reference survives
	//a rewind.
	var attempt = honeycomb.resolveWithChoices({
		answerArray: answerArray,

		buildContext: function () {
			var liveCombat = honeycomb.state.run.combat;
			var liveCard = honeycomb.resolveCard(honeycomb.combat.cardInstance(instanceId));
			//The acting entity for owner-scoped effects: the owner when they can act, the ownerless
			//fallback when the card belongs to nobody, and null when a downed owner's policy denies
			//it. An effect aimed at "owner" that finds nobody does nothing, not a crash.
			var owner = honeycomb.cardActingEntity(liveCard, liveCombat);

			var context = honeycomb.newEffectContext({ source: owner, card: liveCard, combat: liveCombat });
			//The player's pick, filed by the mode's kind so a card-targeting card can never be handed
			//a character and an entity-targeting one can never be handed a card.
			if (honeycomb.targetModeKind(liveCard.targetMode) == "card") {
				context.targetCardArray = targetInstanceId == null ? [] : [targetInstanceId];
			} else {
				context.target = targetInstanceId == null ? null : honeycomb.findEntity(targetInstanceId, liveCombat);
			}
			honeycomb.applyResolvedTargets(context, liveCard.targetMode,
				honeycomb.resolveTargetMode(liveCard.targetMode, context));
			return context;
		},

		run: function (playContext) {
			var liveCombat = playContext.combat;
			var liveCard = playContext.card;
			var owner = playContext.source;

			//A card pick not supplied up front is ASKED for, as the first question of the play. Asked
			//before anything is spent, so declining it leaves no trace; answered automatically when
			//there are exactly as many cards as it needs.
			if (honeycomb.targetModeRequiresPick(liveCard.targetMode) == true &&
				honeycomb.targetModeKind(liveCard.targetMode) == "card" && playContext.targetCardArray.length === 0) {
				var descriptor = honeycomb.targetDescriptor(liveCard.targetMode);
				var pickCount = descriptor.count == null ? 1 : honeycomb.resolveValue(descriptor.count, playContext);
				var picked = honeycomb.requestChoice(playContext, {
					index: descriptor.from == null ? "handCard" : descriptor.from,
					prompt: descriptor.prompt == null ? liveCard.name + ": choose " + (pickCount === 1 ? "a card" : pickCount + " cards") : descriptor.prompt,
					minimum: pickCount,
					maximum: pickCount,
					cardType: descriptor.cardType,
					cardTag: descriptor.cardTag,
					excludeInstanceId: instanceId,
					//The play can be taken back: nothing has happened yet.
					cancellable: true,
				});
				if (picked == null) return;
				playContext.targetCardArray = picked.chosenArray == null ? [] : picked.chosenArray.slice();
			}

			honeycomb.spend(honeycomb.combat.playCost(liveCard, playContext));
			//A "next card costs less" discount (Incredible Wealth) was priced into the cost just paid, so
			//this play uses it up. One granted DURING this play is set after this line and waits for the next.
			if (liveCombat.nextCardDiscount != null && liveCombat.nextCardDiscount > 0) liveCombat.nextCardDiscount = 0;

			//Removed from hand before resolving, so a card that draws cards cannot draw itself back.
			liveCombat.handArray.splice(liveCombat.handArray.indexOf(instanceId), 1);

			honeycomb.logEvent(playContext, {
				type: "cardPlayed",
				cardId: instanceId,
				sourceId: owner == null ? null : owner.instanceId,
				targetId: playContext.target == null ? null : playContext.target.instanceId,
				targetCardId: playContext.targetCardArray.length > 0 ? playContext.targetCardArray[0] : null,
			});

			//What the card does may itself be rewritten by an owner-down policy, so the effect list is
			//asked for rather than read off the definition.
			honeycomb.resolveEffectArray(honeycomb.cardEffectArray(liveCard, liveCombat), playContext);

			//A question stopped the pass. Nothing below should run: the attempt is about to be rewound.
			if (honeycomb.choicePending(playContext) == true) return;

			//The acting character moves through the party, by the card's own rule, their loadout's, their
			//character's, or the card type's default -- Offense steps up to the front, where most enemy
			//attacks land. Resolved AFTER the effects, so a card that reads position reads where its
			//owner stood when it was played. See honeycomb.cardPartyShift.
			if (honeycomb.tuning.combat.partyShiftEnabled == true && owner != null && owner.downed != true) {
				honeycomb.shiftEntity(owner, honeycomb.cardPartyShift(liveCard, owner), playContext);
			}

			//onCardPlayed fires after the card resolves, so a relic reacting to it sees the result.
			var allyArray = honeycomb.livingEntityArray("ally", liveCombat);
			for (var allyIndex = 0; allyIndex < allyArray.length; allyIndex++) {
				honeycomb.fireEntityHooks("onCardPlayed", {
					entity: allyArray[allyIndex], card: liveCard, definition: liveCard, context: playContext,
				});
			}
			//The other team hears it too: an enemy passive that counts the party's cards reacts on
			//onOpponentCardPlayed. `source` is the card's owner.
			var opposingArray = honeycomb.livingEntityArray(honeycomb.opposingSide(owner == null || owner.side == null ? "ally" : owner.side), liveCombat);
			for (var opposingIndex = 0; opposingIndex < opposingArray.length; opposingIndex++) {
				honeycomb.fireEntityHooks("onOpponentCardPlayed", {
					entity: opposingArray[opposingIndex], source: owner, card: liveCard, context: playContext,
				});
			}

			//FIRST CURSE EXHAUSTS (tree node "Tidy"): the first Curse card played each combat leaves the
			//fight instead of cycling. Curses belong to nobody, so the flag is read across the party and
			//the once-per-fight marker sits on the combat. Marked on the resolved view, which the filing
			//below reads.
			if (liveCombat != null && liveCombat.firstJunkExhausted != true &&
				honeycomb.partyFieldFlag("firstJunkExhausts") == true &&
				honeycomb.cardHasType(liveCard, "curse") == true) {
				liveCombat.firstJunkExhausted = true;
				liveCard.exhaustRequested = true;
			}

			//Where the card goes now. exhaustSelf sets a flag on the resolved view during resolution.
			//A card an effect already moved somewhere -- returned to hand, exhausted by its own target
			//mode -- is left where it was put rather than filed twice.
			if (honeycomb.combat.pileHolding(instanceId) == null) {
				if (liveCard.exhausts == true || liveCard.exhaustRequested == true) {
					liveCombat.exhaustPileArray.push(instanceId);
					honeycomb.combat.noteExhaust(instanceId, "played", playContext, null);
				} else if (honeycomb.cardDefault(liveCard, "afterPlay") == "inPlay") {
					//A Power stays out of the cycle. Created here rather than at setup for a fight saved
					//before the pile existed, which would otherwise have nowhere to put it.
					if (liveCombat.inPlayPileArray == null) liveCombat.inPlayPileArray = [];
					liveCombat.inPlayPileArray.push(instanceId);
					honeycomb.logEvent(playContext, { type: "cardInPlay", cardId: instanceId });
				} else {
					liveCombat.discardPileArray.push(instanceId);
					honeycomb.logEvent(playContext, { type: "cardToDiscard", cardId: instanceId });
				}
			}

			liveCombat.cardsPlayedThisTurn += 1;
			liveCombat.cardsPlayedThisCombat += 1;

			honeycomb.combat.checkEnd(playContext);
		},
	});

	//A question is waiting. The caller shows it and calls back with the answer appended; nothing has
	//happened yet, so refusing to answer simply leaves the card unplayed.
	if (attempt.complete == false) {
		return {
			played: false,
			reason: "needsChoice",
			choice: attempt.choice,
			answerArray: attempt.answerArray,
			cardId: instanceId,
			targetId: targetInstanceId,
		};
	}

	return { played: true, context: attempt.context };
};

//The cost of playing a card right now, after every modifier. Split out because the affordability
//check and the actual payment must never compute it differently.
honeycomb.combat.playCost = function (resolved, context) {
	var costArray = {};
	if (resolved == null || resolved.costArray == null) return costArray;
	for (var resourceIndex in resolved.costArray) {
		if (Object.prototype.hasOwnProperty.call(resolved.costArray, resourceIndex) == false) continue;
		costArray[resourceIndex] = honeycomb.cardCost(resolved, resourceIndex, context);
	}
	return costArray;
};

//---------------------------------------------------------------------------------------------------
//Pile operations
//---------------------------------------------------------------------------------------------------
//Drawing reshuffles the discard back in when the draw pile runs dry, which is the standard rule and
//the one place the shuffle stream is consumed mid-fight.
honeycomb.drawCards = function (amount, context) {
	var combat = context.combat;
	if (combat == null) return 0;
	var drawn = 0;

	for (var drawIndex = 0; drawIndex < amount; drawIndex++) {
		if (combat.drawPileArray.length === 0) {
			if (combat.discardPileArray.length === 0) break;
			combat.drawPileArray = honeycomb.rng.shuffle(honeycomb.tuning.rng.streamArray.shuffle, combat.discardPileArray);
			combat.discardPileArray = [];
			honeycomb.logEvent(context, { type: "reshuffle", count: combat.drawPileArray.length });
		}

		var instanceId = combat.drawPileArray.shift();
		if (combat.handArray.length >= honeycomb.tuning.combat.handSizeMaximum) {
			//Over the hand limit the card is drawn and immediately discarded, so the draw still
			//counts and the pile still cycles.
			combat.discardPileArray.push(instanceId);
			honeycomb.logEvent(context, { type: "cardBurned", cardId: instanceId });
			continue;
		}
		combat.handArray.push(instanceId);
		honeycomb.logEvent(context, { type: "cardDrawn", cardId: instanceId });
		drawn += 1;
	}
	return drawn;
};

//Discards at random from the hand. Used by effects that cost the player cards.
honeycomb.discardRandomCards = function (amount, context) {
	var combat = context.combat;
	if (combat == null) return 0;
	var discarded = 0;
	for (var discardIndex = 0; discardIndex < amount; discardIndex++) {
		if (combat.handArray.length === 0) break;
		var position = honeycomb.rng.range(honeycomb.tuning.rng.streamArray.combat, 0, combat.handArray.length - 1);
		var instanceId = combat.handArray.splice(position, 1)[0];
		combat.discardPileArray.push(instanceId);
		honeycomb.logEvent(context, { type: "cardDiscarded", cardId: instanceId });
		discarded += 1;
	}
	return discarded;
};

//Creates a card that exists only for this fight and puts it in a pile.
honeycomb.addCardToPile = function (cardIndex, pileIndex, context) {
	var combat = context.combat;
	if (combat == null) return null;
	if (combat.temporaryCardArray == null) combat.temporaryCardArray = [];

	//A card created mid-fight is owned by the party member whose character it names, on the same rule
	//a card added to the run deck follows. Without it, a Blood Pact shuffled in by an event cost
	//nobody any health.
	var instance = honeycomb.newCardInstance(cardIndex, honeycomb.defaultOwnerFor(cardIndex));
	combat.temporaryCardArray.push(instance);

	switch (pileIndex) {
		case "hand": combat.handArray.push(instance.instanceId); break;
		case "discardPile": combat.discardPileArray.push(instance.instanceId); break;
		case "drawPile": {
			//Shuffled in rather than placed on top, so the player cannot plan around its position.
			var position = honeycomb.rng.range(honeycomb.tuning.rng.streamArray.shuffle, 0, combat.drawPileArray.length);
			combat.drawPileArray.splice(position, 0, instance.instanceId);
			break;
		}
		default:
			console.error("Honeycomb: unknown pile '" + pileIndex + "'");
			return null;
	}
	//Who made it, so the screen can show it arriving from them -- an enemy slipping a Wisp into the
	//discard is the moment the player most needs to see.
	honeycomb.logEvent(context, {
		type: "cardCreated", cardId: instance.instanceId, card: cardIndex, pile: pileIndex,
		sourceId: context.source == null ? null : context.source.instanceId,
	});
	return instance;
};

//---------------------------------------------------------------------------------------------------
//Operating on a card that is already somewhere
//---------------------------------------------------------------------------------------------------
//These back the card-targeting effects. Piles hold instance ids, so moving a card means finding which
//pile currently holds it and moving the id -- which is also why a card can never end up in two piles.

//The cards an effect is aimed at. Prefers an explicit chosen card, then the resolved target list, so
//an effect nested under chooseCards needs no special case.
honeycomb.contextCardIdArray = function (context) {
	if (context.chosenCardId != null) return [context.chosenCardId];
	return context.targetCardArray == null ? [] : context.targetCardArray;
};

//Which pile currently holds a card, or null when nothing does.
honeycomb.combat.pileHolding = function (instanceId) {
	var combat = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	if (combat == null) return null;
	for (var scanIndex = 0; scanIndex < honeycomb.combat.pileNameArray.length; scanIndex++) {
		var pileArray = combat[honeycomb.combat.pileNameArray[scanIndex]];
		//A fight saved before a pile existed simply has nothing in it.
		if (pileArray != null && pileArray.indexOf(instanceId) >= 0) return honeycomb.combat.pileNameArray[scanIndex];
	}
	return null;
};

//Every pile a card can sit in during a fight.
honeycomb.combat.pileNameArray = ["handArray", "drawPileArray", "discardPileArray", "exhaustPileArray", "inPlayPileArray"];

honeycomb.combat.removeFromPiles = function (instanceId) {
	var pileName = honeycomb.combat.pileHolding(instanceId);
	if (pileName == null) return false;
	var pileArray = honeycomb.state.run.combat[pileName];
	pileArray.splice(pileArray.indexOf(instanceId), 1);
	return true;
};

//Moves a card between piles. `pileIndex` is hand, drawPile, discardPile or exhaust.
honeycomb.moveCardToPile = function (instanceId, pileIndex, context) {
	var combat = context.combat;
	if (combat == null || instanceId == null) return false;
	//Which pile it LEFT, logged with the move so the screen can fly it from the right place.
	var fromPileArray = honeycomb.combat.pileHolding(instanceId);
	honeycomb.combat.removeFromPiles(instanceId);

	switch (pileIndex) {
		case "hand":
			//A hand already at its limit sends the card to the discard instead, matching how a draw
			//past the limit behaves. Silently dropping it would lose a card.
			if (combat.handArray.length >= honeycomb.tuning.combat.handSizeMaximum) {
				combat.discardPileArray.push(instanceId);
				honeycomb.logEvent(context, { type: "cardBurned", cardId: instanceId, fromPileArray: fromPileArray });
				return true;
			}
			combat.handArray.push(instanceId);
			honeycomb.logEvent(context, { type: "cardToHand", cardId: instanceId, fromPileArray: fromPileArray });
			return true;
		case "discardPile":
			combat.discardPileArray.push(instanceId);
			honeycomb.logEvent(context, { type: "cardDiscarded", cardId: instanceId, fromPileArray: fromPileArray });
			return true;
		case "drawPile":
			combat.drawPileArray.unshift(instanceId);
			honeycomb.logEvent(context, { type: "cardToDrawPile", cardId: instanceId, fromPileArray: fromPileArray });
			return true;
		case "exhaust":
			combat.exhaustPileArray.push(instanceId);
			honeycomb.combat.noteExhaust(instanceId, "effect", context, fromPileArray);
			return true;
		default:
			console.error("Honeycomb: unknown pile '" + pileIndex + "'");
			return false;
	}
};

honeycomb.exhaustCardById = function (instanceId, context) {
	return honeycomb.moveCardToPile(instanceId, "exhaust", context);
};

//Upgrades a card whether it lives in the run deck or was created for this fight only.
//honeycomb.upgradeCardInstance covers the deck alone, since that is the permanent case; this is the
//one card effects use, because a card being upgraded mid-fight may be either.
//`pathIndex` is which ladder to climb, for a card offering several. Recorded on the copy the first
//time and ignored after: a card commits to a path and its later levels follow it.
honeycomb.upgradeCardAnywhere = function (instanceId, levels, pathIndex) {
	var instance = honeycomb.combat.cardInstance(instanceId);
	if (instance == null) return false;
	var definition = honeycomb.findDefinition(honeycomb.cardArray, instance.cardIndex);
	//A starter or outfit-signature card is changed only by the progression tree, never here.
	if (honeycomb.cardIsUpgradable(definition) == false) return false;
	if (pathIndex != null && instance.upgradePath == null &&
		honeycomb.findDefinition(honeycomb.cardUpgradePathArray(definition), pathIndex) != null) {
		instance.upgradePath = pathIndex;
	}
	//The ceiling is the ladder THIS COPY is on: a card offering several paths has one list per path.
	var ceiling = honeycomb.cardUpgradeArray(definition, instance.upgradePath).length;
	instance.upgradeLevel = Math.min((instance.upgradeLevel == null ? 0 : instance.upgradeLevel) + levels, ceiling);
	return true;
};

//An upgrade for this fight only (Whetted Edge). A deck card keeps its own level and gains
//`combatUpgradeLevel` on top, which clearFightOnlyCardFields removes when the fight ends; a path picked
//for a copy that has none is `combatUpgradePath`, removed the same way. A card made mid-fight goes with
//the fight anyway, so it simply upgrades.
honeycomb.upgradeCardForCombat = function (instanceId, levels, pathIndex) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	var instance = honeycomb.combat.cardInstance(instanceId);
	if (run == null || instance == null) return false;
	if (run.deckArray.indexOf(instance) < 0) return honeycomb.upgradeCardAnywhere(instanceId, levels, pathIndex);
	var definition = honeycomb.findDefinition(honeycomb.cardArray, instance.cardIndex);
	if (honeycomb.cardIsUpgradable(definition) == false) return false;
	if (pathIndex != null && honeycomb.cardUpgradePathNow(instance) == null &&
		honeycomb.findDefinition(honeycomb.cardUpgradePathArray(definition), pathIndex) != null) {
		instance.combatUpgradePath = pathIndex;
	}
	var ceiling = honeycomb.cardUpgradeArray(definition, honeycomb.cardUpgradePathNow(instance)).length;
	var kept = instance.upgradeLevel == null ? 0 : instance.upgradeLevel;
	var extra = (instance.combatUpgradeLevel == null ? 0 : instance.combatUpgradeLevel) + levels;
	instance.combatUpgradeLevel = Math.max(0, Math.min(extra, ceiling - kept));
	return true;
};

//---------------------------------------------------------------------------------------------------
//Ending a fight
//---------------------------------------------------------------------------------------------------
honeycomb.combat.sideIsDown = function (side, combat) {
	return honeycomb.livingEntityArray(side, combat).length === 0;
};

//BEATEN IS NOT THE SAME AS DOWN. A broken character is still standing, still holds cards and still
//takes a turn -- they simply hold nothing but their broken card -- so they stay in
//livingEntityArray and every turn loop keeps running them. What they cannot do is WIN, and
//"every character being broken means the player loses" is exactly this test.
honeycomb.combat.entityIsBeaten = function (entity) {
	return entity != null && (entity.downed == true || entity.broken == true);
};

honeycomb.combat.sideIsBeaten = function (side, combat) {
	var entityArray = honeycomb.livingEntityArray(side, combat);
	for (var entityIndex = 0; entityIndex < entityArray.length; entityIndex++) {
		if (honeycomb.combat.entityIsBeaten(entityArray[entityIndex]) == false) return false;
	}
	return true;
};

//What ends a fight. A special condition can win a battle on beating a named leader (the matriarch
//encounter) even while other enemies still stand, and cannot be a plain HP-0 check since lust also
//wins a fight -- broken is a win condition too.
//
//Each entry asks one question of ONE TEAM: has it lost? `check(side, combat, entry)` answers, reading
//BEATEN (downed or broken, entityIsBeaten) and never health, so a lust win counts the same as a kill.
//`describe(entry)` words it for the battle log and the victory screen; an entry's own `text` overrides
//that, as it does for effects. A fight lists which of these it uses -- see honeycomb.combat.endConditionArray.
honeycomb.fightEndConditionArray = [
	{
		//The ordinary fight: nobody on the team is left standing unbroken.
		index: "allBeaten",
		check: function (side, combat) { return honeycomb.combat.sideIsBeaten(side, combat); },
		describe: function () { return ""; },
	},
	{
		//THE LEADERS FALL. Every combatant on the team matching `indexArray` (enemy or character indexes)
		//or carrying a tag in `tagArray` is beaten -- whoever else still stands. Downed leaders count, so a
		//leader killed first stays killed. A fight in which nobody matches is never won this way: an
		//absent leader is not a beaten one.
		index: "leadersBeaten",
		check: function (side, combat, entry) {
			var entityArray = honeycomb.entityArray(side, combat);
			var matched = 0;
			for (var entityIndex = 0; entityIndex < entityArray.length; entityIndex++) {
				var entity = entityArray[entityIndex];
				if (honeycomb.combat.entityIsLeader(entity, entry) == false) continue;
				matched++;
				if (honeycomb.combat.entityIsBeaten(entity) == false) return false;
			}
			return matched > 0;
		},
		describe: function (entry) {
			var nameArray = [];
			var indexArray = entry.indexArray == null ? [] : entry.indexArray;
			for (var nameIndex = 0; nameIndex < indexArray.length; nameIndex++) {
				var definition = honeycomb.findDefinition(honeycomb.enemyArray, indexArray[nameIndex]);
				if (definition == null) definition = honeycomb.findDefinition(honeycomb.characterArray, indexArray[nameIndex]);
				nameArray.push(definition == null ? indexArray[nameIndex] : definition.name);
			}
			if (nameArray.length === 0) return "Their leaders are beaten.";
			return nameArray.join(" and ") + (nameArray.length == 1 ? " is" : " are") + " beaten.";
		},
	},
];

//Whether a combatant is one of the ones a `leadersBeaten` entry names.
honeycomb.combat.entityIsLeader = function (entity, entry) {
	var found = honeycomb.entityDefinition(entity);
	if (found == null) return false;
	if (entry.indexArray != null && entry.indexArray.indexOf(found.definition.index) >= 0) return true;
	var tagArray = entry.tagArray == null ? [] : entry.tagArray;
	for (var tagIndex = 0; tagIndex < tagArray.length; tagIndex++) {
		if (honeycomb.entityHasTag(entity, tagArray[tagIndex]) == true) return true;
	}
	return false;
};

//The conditions a fight is decided by, for `outcome` "victory" or "defeat". The fight's own list (given
//when it was begun) wins, then its encounter's, then the tuning default. Read every time rather than
//copied onto the fight, so a save holds only what was asked for specially.
honeycomb.combat.endConditionArray = function (combat, outcome) {
	var field = outcome == "victory" ? "victoryConditionArray" : "defeatConditionArray";
	if (combat != null && combat[field] != null) return combat[field];
	var encounter = combat == null ? null : honeycomb.findDefinition(honeycomb.encounterArray, combat.encounterIndex);
	if (encounter != null && encounter[field] != null) return encounter[field];
	return outcome == "victory" ? honeycomb.tuning.combat.defaultVictoryConditionArray
		: honeycomb.tuning.combat.defaultDefeatConditionArray;
};

//WHO HAS WON, IF ANYONE, without recording it: {outcome, condition} or null. Victory is asked first, so a
//move that finishes both teams at once is a win. The turn limit is not judged here -- it is not a team
//losing, and checkEnd applies it. Every turn loop that stops early on a decided fight asks this.
honeycomb.combat.decidedOutcome = function (combat) {
	if (combat == null) return null;
	var outcomeArray = [
		{ outcome: "victory", side: "enemy" },
		{ outcome: "defeat", side: "ally" },
	];
	for (var outcomeIndex = 0; outcomeIndex < outcomeArray.length; outcomeIndex++) {
		var conditionArray = honeycomb.combat.endConditionArray(combat, outcomeArray[outcomeIndex].outcome);
		for (var conditionIndex = 0; conditionIndex < conditionArray.length; conditionIndex++) {
			var entry = conditionArray[conditionIndex];
			var condition = honeycomb.requireDefinition(honeycomb.fightEndConditionArray, entry.index, "honeycomb.fightEndConditionArray");
			if (condition == null) continue;
			if (condition.check(outcomeArray[outcomeIndex].side, combat, entry) == true) {
				return { outcome: outcomeArray[outcomeIndex].outcome, condition: entry };
			}
		}
	}
	return null;
};

//The words for how a fight was decided -- "The Matriarch is beaten." -- or "" for an ordinary one.
honeycomb.combat.endConditionText = function (entry) {
	if (entry == null) return "";
	if (entry.text != null) return entry.text;
	var condition = honeycomb.findDefinition(honeycomb.fightEndConditionArray, entry.index);
	return condition == null || condition.describe == null ? "" : condition.describe(entry);
};

//---------------------------------------------------------------------------------------------------
//Save safety
//---------------------------------------------------------------------------------------------------
//True when the fight is in a phase that accepts input or has ended -- the only phases a save may hold.
honeycomb.combat.isStable = function (combat) {
	if (combat == null) return true;
	return honeycomb.tuning.combat.stablePhaseArray.indexOf(combat.phase) >= 0;
};

//Rescues a combat that was somehow saved mid-transition. Called on load.
//
//The transitional phases only exist inside a synchronous engine call, so reaching one in a save file
//means something went wrong -- an older save, a crash, or a bug. Whatever the cause, the board is
//inert: it refuses every action and the hand has already been discarded. Rolling forward to a fresh
//player turn is the recovery, because the alternative is a run the player cannot leave.
//
//This may skip the remainder of an enemy turn that was partway through. That is deliberate: losing
//one enemy action is a far smaller harm than bricking the run, and the case only arises when
//something already went wrong.
honeycomb.combat.repair = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || run.combat == null) return false;
	var combat = run.combat;
	if (honeycomb.combat.isStable(combat) == true) return false;

	console.warn("Honeycomb: combat loaded in transitional phase '" + combat.phase +
		"'; recovering to a fresh player turn");

	var context = honeycomb.newEffectContext({ combat: combat });

	//An already-decided fight resolves to its ending rather than granting another turn.
	if (honeycomb.combat.checkEnd(context) != null) return true;

	//Anything still held from the interrupted turn goes to the discard, so the new hand is clean.
	for (var handIndex = combat.handArray.length - 1; handIndex >= 0; handIndex--) {
		combat.discardPileArray.push(combat.handArray[handIndex]);
	}
	combat.handArray = [];

	combat.phase = "playerTurn";
	//startPlayerTurn advances the turn counter and deals a fresh hand, which is exactly the recovery.
	honeycomb.combat.startPlayerTurn(context);
	return true;
};

//Decides whether the fight is over and records the outcome. Does not itself show anything.
honeycomb.combat.checkEnd = function (context) {
	var combat = context.combat;
	if (combat == null) return null;
	if (combat.phase == "victory" || combat.phase == "defeat") return combat.phase;
	//The battle lab suspends the end: a bench where the victory overlay fires the moment the last enemy
	//dies cannot be used to watch a death animation, and a defeat overlay interrupts a status test. Set
	//only by honeycomb.lab, and only on a debug build.
	if (combat.labNoEnd == true) return null;

	var decided = honeycomb.combat.decidedOutcome(combat);
	if (decided != null) {
		combat.phase = decided.outcome;
		//Which condition did it, so the log and the victory screen can say "The Matriarch is beaten."
		combat.endCondition = decided.condition;
		honeycomb.logEvent(context, {
			type: "combatEnd", outcome: decided.outcome, condition: decided.condition.index,
			text: honeycomb.combat.endConditionText(decided.condition),
		});
		return decided.outcome;
	}
	//A stalled fight is a loss rather than an infinite loop.
	if (combat.turnNumber >= honeycomb.tuning.combat.turnLimit) {
		combat.phase = "defeat";
		honeycomb.logEvent(context, { type: "combatEnd", outcome: "defeat", reason: "turnLimit" });
		return "defeat";
	}
	return null;
};

//Cleans up after a won fight and computes its rewards. The reward is returned rather than granted, so
//the player can be offered a choice before anything is committed.
honeycomb.combat.finishVictory = function () {
	var run = honeycomb.state.run;
	var combat = run.combat;
	if (combat == null) return null;

	var context = honeycomb.newEffectContext({ combat: combat });
	var encounter = honeycomb.findDefinition(honeycomb.encounterArray, combat.encounterIndex);

	//The fight being over is its own run-wide event, so a relic can act on it -- e.g. refill the party's
	//rerolls. Fired once, on victory, before the reward is computed.
	honeycomb.fireRunHooks("onCombatEnd", { outcome: "victory", context: context });

	//What winning this fight unlocks: an encounter's `victoryUnlockArray` of {kind, index,
	//characterIndex}, written through honeycomb.unlocks like every other unlock -- never pushed into a
	//ledger by hand. Granted HERE rather than by the victory screen because it is earned by the win, not
	//by a choice made after it: a player who closes the game on the reward screen has still beaten her.
	var unlockedArray = [];
	var victoryUnlockArray = encounter == null || encounter.victoryUnlockArray == null ? [] : encounter.victoryUnlockArray;
	for (var unlockIndex = 0; unlockIndex < victoryUnlockArray.length; unlockIndex++) {
		var unlock = victoryUnlockArray[unlockIndex];
		if (honeycomb.unlocks.grant(unlock.kind, unlock.index, unlock.characterIndex) == true) unlockedArray.push(unlock);
	}

	//Gold is the sum of what each enemy in the encounter was worth, plus relic bonuses.
	var gold = 0;
	for (var enemyIndex = 0; enemyIndex < combat.enemyArray.length; enemyIndex++) {
		var definition = honeycomb.findDefinition(honeycomb.enemyArray, combat.enemyArray[enemyIndex].enemyIndex);
		if (definition == null || definition.goldReward == null) continue;
		gold += honeycomb.rng.range(honeycomb.tuning.rng.streamArray.reward,
			definition.goldReward.minimum, definition.goldReward.maximum);
	}
	for (var relicIndex = 0; relicIndex < run.relicArray.length; relicIndex++) {
		var relic = honeycomb.findDefinition(honeycomb.relicArray, run.relicArray[relicIndex].index);
		if (relic != null && relic.goldBonus != null) gold += relic.goldBonus;
	}
	//A bigger party fought a bigger fight, so it is paid for a bigger fight.
	gold = Math.round(gold * honeycomb.scaling.goldMultiplier());

	//BOUNTY (tree node): a boss or elite pays more. Party-wide, with the benched "Always" tier read
	//from the profile.
	var bigFight = encounter != null && (encounter.isElite == true || encounter.tier == "boss");
	var bountyGold = honeycomb.partyFieldTotal("bountyGoldMultiplier") + honeycomb.profileFieldTotal("bountyGoldMultiplierAlways");
	if (bigFight && bountyGold != 0) gold = Math.round(gold * (1 + bountyGold));

	//A fight may reshape its own reward -- an event's ambush that pays no gold, a duel that offers one
	//specific card. Written where the fight was asked for, never here.
	var overrides = combat.rewardArray == null ? {} : combat.rewardArray;
	if (overrides.goldMultiplier != null) gold = Math.round(gold * overrides.goldMultiplier);

	//INVESTMENT (tree node): energy left over when the fight ends pays gold, per point, for every member
	//that carries the field. Read before the fight's resources are cleared below.
	var unspentEnergy = honeycomb.getResource("energy");
	var investmentRate = honeycomb.partyFieldTotal("unspentEnergyGold");
	if (unspentEnergy > 0 && investmentRate > 0) gold += Math.round(unspentEnergy * investmentRate);

	//A relic is rolled before the cards so the two streams stay in a fixed order. It is GRANTED by the
	//victory screen, beside the gold, not here -- finishVictory computes the reward, it does not pay it.
	var relicIndex = overrides.relics === false ? null : honeycomb.combat.rollRewardRelic(encounter);

	var reward = {
		gold: gold,
		//Card choices are offered, not granted; the player picks one or skips. Each offer knows who it
		//is FOR, so the card taken joins that character's contribution.
		cardChoiceArray: overrides.cardChoices === false ? [] : honeycomb.combat.rollCardReward(encounter, combat),
		relicIndex: relicIndex,
		//What the win newly unlocked, for the victory screen to announce.
		unlockedArray: unlockedArray,
		//Where the player goes next. Read by the victory screen; see honeycomb.combatContinuationArray.
		continuation: combat.continuation == null ? { index: "map" } : combat.continuation,
	};

	//Clear per-fight state from the allies so nothing leaks into the next encounter.
	var allyArray = honeycomb.entityArray("ally", combat);
	for (var allyIndex = 0; allyIndex < allyArray.length; allyIndex++) {
		allyArray[allyIndex].temporaryHealth = 0;
		honeycomb.clearCombatStatuses(allyArray[allyIndex], context);
	}

	return reward;
};

//Everything a won fight pays at once, out of the victory screen so the balance simulation pays exactly
//what the screen pays and cannot drift from it. The lines are the screen's own, in the screen's order:
//experience, then the reward, then gold, then a relic.
//What waits on a choice -- the card offers -- stays on the returned reward for the screen (or the bot) to
//deal with. Returns the reward, or null when there is no fight to settle.
honeycomb.combat.settleVictory = function () {
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	//Experience is recorded BEFORE finishVictory, which clears per-fight state: the list of who
	//actually fell has to still be readable.
	var experience = honeycomb.discovery.awardCombat(combat, null);
	//How the fight was won, read while the fight is still there to read it.
	var decidedText = combat == null ? "" : honeycomb.combat.endConditionText(combat.endCondition);

	var reward = honeycomb.combat.finishVictory();
	if (reward == null) return null;
	reward.experience = experience;
	reward.decidedText = decidedText;

	//Gold is granted immediately: there is no decision in it. Cards are a choice, so they wait.
	honeycomb.addResource("gold", reward.gold);
	//A relic is a prize rather than a choice too, so it lands now. An ELITE and a boss always pay
	//one; an ordinary fight sometimes does. See honeycomb.combat.rollRewardRelic.
	if (reward.relicIndex != null) honeycomb.grantRelic(reward.relicIndex, honeycomb.newEffectContext({}));
	return reward;
};

//The fight's relic. An ELITE always pays one, and so does a boss; an ordinary fight pays one by
//chance. The number lives in tuning.reward. The
//pick is a COMMON-pool relic the party does not already carry and may be offered to them, reusing
//honeycomb.uncarriedRelicArray so a sister mechanic's relic never turns up for a party without her.
honeycomb.combat.rollRewardRelic = function (encounter) {
	var settings = honeycomb.tuning.reward;
	var chance = encounter != null && encounter.isElite == true ? settings.eliteRelicChance
		: (encounter != null && encounter.tier == "boss" ? settings.bossRelicChance : settings.relicChance);
	if (chance == null || chance <= 0) return null;
	//`>=` rather than `>`: a chance of 1 must always pay, and rng.next is in [0, 1).
	if (honeycomb.rng.next(honeycomb.tuning.rng.streamArray.reward) >= chance) return null;
	var candidateArray = honeycomb.uncarriedRelicArray(null, "common").filter(function (relic) {
		//Starter relics belong to characters, not to the loot pool.
		return relic.rarity != "starter";
	});
	//COLLECTOR (tree node): an unseen relic is weighted up.
	var collectorMultiplier = honeycomb.collectorWeightMultiplier();
	var weightedArray = [];
	for (var candidateIndex = 0; candidateIndex < candidateArray.length; candidateIndex++) {
		var candidateRelic = candidateArray[candidateIndex];
		var seen = honeycomb.discovery != null && honeycomb.discovery.isKnown("relic", candidateRelic.index);
		weightedArray.push({ relic: candidateRelic, weight: seen ? 1 : collectorMultiplier });
	}
	var picked = honeycomb.rng.pickWeighted(honeycomb.tuning.rng.streamArray.reward, weightedArray);
	return picked == null ? null : picked.relic.index;
};

//THE CARD REWARD. Returns [{cardIndex, ownerInstanceId}] -- every offer knows who it is FOR.
//
//Slots are filled in this order, each taking its slot before the next is considered:
//  1. BONUS cards the fight itself asked to offer: the encounter's `rewardCardArray`, and anything
//     an effect added with addRewardCard. A neutral card lands here and takes a slot like any other.
//  2. GUARANTEED cards: any card whose `offerGuarantee` passes for a member in the party. This is how a
//     costume can put a specific card on the screen outright.
//  3. The SPREAD. Remaining slots are dealt to characters rather than drawn from one shared pool:
//       one character    every slot is theirs
//       two              one each, the third to either at random
//       three            one each
//       four or more     still one slot per slot; which characters get them is left to chance
//     "Characters" means members who can still GAIN cards -- a member with nothing left to offer, a
//     summon, or a character marked `canGainCards: false` never takes a slot from somebody who can.
//
//Within a character's slot the card is a weighted roll over their pool: rarity weight, times every
//`offerWeightArray` multiplier whose condition passes, among cards whose `offerCondition` passes. Both
//conditions see the member the slot is for as `source`, so an outfit or a tag can bend the odds.
//
//All of it draws from the reward stream, so the same seed offers the same screen.
honeycomb.combat.rollCardReward = function (encounter, combat) {
	var run = honeycomb.state.run;
	var settings = honeycomb.tuning.reward;
	var stream = honeycomb.tuning.rng.streamArray.reward;
	var overrides = combat == null || combat.rewardArray == null ? {} : combat.rewardArray;
	//An elite bets on rarer cards: the same spread, weighted toward the top. Null means the
	//ordinary table, so every other caller is untouched.
	var rarityWeightArray = encounter != null && encounter.isElite == true ? settings.eliteRarityWeightArray : null;

	var offerCount = overrides.choiceCount != null
		? overrides.choiceCount
		: (encounter != null && encounter.tier == "boss" ? settings.bossChoiceCount : settings.choiceCount);
	//BOUNTY (tree node): a boss or elite offers an extra card. Party-wide, plus the benched tier.
	if (encounter != null && (encounter.isElite == true || encounter.tier == "boss")) {
		offerCount += honeycomb.partyFieldTotal("bountyCardChoiceBonus") + honeycomb.profileFieldTotal("bountyCardChoiceBonusAlways");
	}
	var result = [];
	function offered(cardIndex) {
		for (var scanIndex = 0; scanIndex < result.length; scanIndex++) {
			if (result[scanIndex].cardIndex == cardIndex) return true;
		}
		return false;
	}

	//--- 1. Bonus slots ---
	var bonusArray = [];
	var encounterBonusArray = encounter == null || encounter.rewardCardArray == null ? [] : encounter.rewardCardArray;
	for (var encounterBonusIndex = 0; encounterBonusIndex < encounterBonusArray.length; encounterBonusIndex++) {
		bonusArray.push({ cardIndex: encounterBonusArray[encounterBonusIndex] });
	}
	var overrideBonusArray = overrides.cardArray == null ? [] : overrides.cardArray;
	for (var overrideBonusIndex = 0; overrideBonusIndex < overrideBonusArray.length; overrideBonusIndex++) {
		bonusArray.push({ cardIndex: overrideBonusArray[overrideBonusIndex] });
	}
	var addedArray = combat == null || combat.bonusRewardArray == null ? [] : combat.bonusRewardArray;
	for (var addedIndex = 0; addedIndex < addedArray.length; addedIndex++) bonusArray.push(addedArray[addedIndex]);

	for (var bonusIndex = 0; bonusIndex < bonusArray.length && result.length < offerCount; bonusIndex++) {
		var bonus = bonusArray[bonusIndex];
		var bonusCard = honeycomb.findDefinition(honeycomb.cardArray, bonus.cardIndex);
		if (bonusCard == null || offered(bonus.cardIndex)) continue;
		//Even a slot the FIGHT asked for refuses a token: "never offered as a reward" has no
		//exceptions, and the warning rule `phantomNotOffered` reports the content that tried.
		if (honeycomb.cardIsOfferable(bonusCard) == false) continue;
		result.push({ cardIndex: bonus.cardIndex, ownerInstanceId: honeycomb.combat.rewardOwnerFor(bonus) });
	}

	//--- 2. Guarantees ---
	var memberArray = honeycomb.combat.rewardMemberArray();
	for (var guaranteeIndex = 0; guaranteeIndex < honeycomb.cardArray.length && result.length < offerCount; guaranteeIndex++) {
		var guaranteed = honeycomb.cardArray[guaranteeIndex];
		if (guaranteed.offerGuarantee == null || offered(guaranteed.index)) continue;
		for (var memberScan = 0; memberScan < memberArray.length; memberScan++) {
			var candidate = memberArray[memberScan];
			if (candidate.characterIndex != guaranteed.characterIndex && guaranteed.characterIndex != "neutral") continue;
			var guaranteeContext = honeycomb.newEffectContext({ source: candidate, combat: combat });
			if (honeycomb.testCondition(guaranteed.offerGuarantee, guaranteeContext) == false) continue;
			result.push({ cardIndex: guaranteed.index, ownerInstanceId: candidate.instanceId });
			break;
		}
	}

	//--- 3. The spread ---
	var remaining = offerCount - result.length;
	if (remaining <= 0) return result;

	//Only members who could actually be offered something take part.
	var eligibleArray = [];
	for (var eligibleScan = 0; eligibleScan < memberArray.length; eligibleScan++) {
		if (honeycomb.combat.rewardPoolFor(memberArray[eligibleScan], combat, [], null, rarityWeightArray).length > 0) {
			eligibleArray.push(memberArray[eligibleScan]);
		}
	}

	var slotOwnerArray = [];
	if (settings.spreadAcrossParty == true && eligibleArray.length > 0) {
		//Everyone once while slots last, in an order left to chance, then the leftovers at random.
		var shuffledArray = honeycomb.rng.shuffle(stream, eligibleArray);
		for (var dealIndex = 0; dealIndex < shuffledArray.length && slotOwnerArray.length < remaining; dealIndex++) {
			slotOwnerArray.push(shuffledArray[dealIndex]);
		}
		while (slotOwnerArray.length < remaining) slotOwnerArray.push(honeycomb.rng.pick(stream, eligibleArray));
		//Shown in party order, so the screen reads front to back rather than in the order it was rolled.
		slotOwnerArray.sort(function (left, right) {
			return run.partyArray.indexOf(left) - run.partyArray.indexOf(right);
		});
	} else {
		//No spread: every slot is drawn from everyone's pools at once, the way the reward used to work.
		for (var poolSlot = 0; poolSlot < remaining; poolSlot++) slotOwnerArray.push(null);
	}

	for (var slotIndex = 0; slotIndex < slotOwnerArray.length; slotIndex++) {
		var slotOwner = slotOwnerArray[slotIndex];
		var excludedArray = [];
		for (var excludeIndex = 0; excludeIndex < result.length; excludeIndex++) excludedArray.push(result[excludeIndex].cardIndex);

		var neutralSlot = settings.neutralSlotChance > 0 && honeycomb.rng.next(stream) < settings.neutralSlotChance;
		var poolArray = neutralSlot
			? honeycomb.combat.rewardPoolFor(null, combat, excludedArray, "neutral", rarityWeightArray)
			: (slotOwner == null
				? honeycomb.combat.rewardPoolForParty(memberArray, combat, excludedArray, rarityWeightArray)
				: honeycomb.combat.rewardPoolFor(slotOwner, combat, excludedArray, null, rarityWeightArray));
		//A character whose remaining pool is already on the screen hands the slot to anyone who still
		//has something, rather than leaving it empty.
		if (poolArray.length === 0) poolArray = honeycomb.combat.rewardPoolForParty(memberArray, combat, excludedArray, rarityWeightArray);
		var picked = honeycomb.rng.pickWeighted(stream, poolArray);
		if (picked == null) {
			//NOTHING LEGAL LEFT (every legal card banished): the fallback keeps the screen with something
			//to take, and taking it leaves the deck unchanged.
			result.push({ cardIndex: honeycomb.fallbackCardIndex(), ownerInstanceId: null });
			continue;
		}
		result.push({ cardIndex: picked.index, ownerInstanceId: picked.ownerInstanceId });
	}
	//A party with no legal pool at all still gets a reward screen rather than an empty one.
	if (result.length === 0) result.push({ cardIndex: honeycomb.fallbackCardIndex(), ownerInstanceId: null });
	//Every offer is counted, whatever granted it. Takes and skips are counted where the
	//player answers, so this side alone is "how often was this card put in front of them".
	for (var offerIndex = 0; offerIndex < result.length; offerIndex++) {
		honeycomb.telemetry.noteCard("offerArray", result[offerIndex].cardIndex);
	}
	return result;
};

//Party members who take part in rewards: not temporary summons, and not characters marked as unable to
//gain cards at all.
honeycomb.combat.rewardMemberArray = function () {
	var run = honeycomb.state.run;
	var result = [];
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		var member = run.partyArray[memberIndex];
		if (member.temporary == true) continue;
		var character = honeycomb.findDefinition(honeycomb.characterArray, member.characterIndex);
		if (character == null || character.canGainCards === false) continue;
		result.push(member);
	}
	return result;
};

//One member's weighted reward pool, or the neutral pool when `member` is null and "neutral" is asked
//for. Entries are {index, weight, ownerInstanceId}, ready for rng.pickWeighted.
honeycomb.combat.rewardPoolFor = function (member, combat, excludedArray, characterIndexOverride, rarityWeightArray) {
	var settings = honeycomb.tuning.reward;
	//An elite passes its own table; everyone else uses the ordinary one.
	var weightArray = rarityWeightArray == null ? settings.rarityWeightArray : rarityWeightArray;
	var characterIndex = characterIndexOverride != null ? characterIndexOverride : (member == null ? null : member.characterIndex);
	var result = [];
	if (characterIndex == null) return result;
	var context = honeycomb.newEffectContext({ source: member, combat: combat });

	for (var cardIndex = 0; cardIndex < honeycomb.cardArray.length; cardIndex++) {
		var card = honeycomb.cardArray[cardIndex];
		if (card.characterIndex != characterIndex) continue;
		if (settings.offerableRarityArray.indexOf(card.rarity) < 0) continue;
		//A banished card never appears in a reward pool.
		if (honeycomb.cardIsBanished(card.index) == true) continue;
		//Nor does a token: a phantom card is only ever added by the thing that creates it.
		if (honeycomb.cardIsOfferable(card) == false) continue;
		if (excludedArray != null && excludedArray.indexOf(card.index) >= 0) continue;
		if (card.offerCondition != null && honeycomb.testCondition(card.offerCondition, context) == false) continue;

		var rarityWeight = weightArray[card.rarity];
		var weight = rarityWeight == null ? honeycomb.tuning.rng.defaultWeight : rarityWeight;
		//The member's loadout may favour a rarity (Soothsayer).
		weight *= honeycomb.rarityWeightMultiplierFor(member, card.rarity);
		var multiplierArray = card.offerWeightArray == null ? [] : card.offerWeightArray;
		for (var multiplierIndex = 0; multiplierIndex < multiplierArray.length; multiplierIndex++) {
			var rule = multiplierArray[multiplierIndex];
			if (rule.condition == null || honeycomb.testCondition(rule.condition, context) == true) weight *= rule.multiplier;
		}
		//The member's loadout bends the odds of a whole SISTER MECHANIC at once.
		weight *= honeycomb.archetypeWeightFor(member, card);
		//UNSEEN WEIGHT (tree node): a card the player has not held yet appears more often for its owner.
		weight *= honeycomb.unseenCardWeightFor(member, card);
		//JOURNAL (rest option): a studied card appears more often.
		weight *= honeycomb.journalWeightFor(card);
		if (weight <= 0) continue;
		result.push({ index: card.index, weight: weight, ownerInstanceId: member == null ? null : member.instanceId });
	}
	return result;
};

//UNSEEN WEIGHT (tree node "New Blood"). A card the player has never HELD is multiplied by 1 + the
//member's `unseenCardWeight`, so a character's own unseen cards surface more. A seen card is x1.
honeycomb.unseenCardWeightFor = function (member, card) {
	if (member == null || card == null) return 1;
	var bonus = honeycomb.memberFieldTotal(member, "unseenCardWeight");
	if (bonus == 0) return 1;
	if (honeycomb.discovery != null && honeycomb.discovery.isKnown("card", card.index) == true) return 1;
	return 1 + bonus;
};

//Archetype weighting. A card names its sister mechanic in `archetype`; anything a member
//wears -- outfit, equipment, tree node -- may carry `archetypeWeightArray: [{archetype, multiplier}]`, and
//every matching multiplier is folded in. ×3 favours a sister mechanic, ×0 blocks it outright, so a costume
//can promise the run it is named for. A card with no archetype, or a member with no say, is ×1.
honeycomb.archetypeWeightFor = function (member, card) {
	if (member == null || card == null || card.archetype == null || member.characterIndex == null) return 1;
	var weight = 1;
	var modifierArray = honeycomb.memberCardModifierArray(member);
	for (var modifierIndex = 0; modifierIndex < modifierArray.length; modifierIndex++) {
		var ruleArray = modifierArray[modifierIndex].modifier == null ? null : modifierArray[modifierIndex].modifier.archetypeWeightArray;
		if (ruleArray == null) continue;
		for (var ruleIndex = 0; ruleIndex < ruleArray.length; ruleIndex++) {
			if (ruleArray[ruleIndex].archetype == card.archetype) weight *= ruleArray[ruleIndex].multiplier;
		}
	}
	return weight;
};

//Whether the party member a card belongs to has blocked its sister mechanic. The shop's check.
honeycomb.archetypeBlockedForParty = function (card) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || card == null || card.archetype == null) return false;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		var member = run.partyArray[memberIndex];
		if (member.characterIndex != card.characterIndex) continue;
		if (honeycomb.archetypeWeightFor(member, card) <= 0) return true;
	}
	return false;
};

//Whether the party can be offered a card at all, by its own `offerCondition`. The reward
//pools check this per member; the shop checks it here so a costume-only card stays off the shelf too.
honeycomb.cardOfferableForParty = function (card) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	//A token is never on a shelf, whatever its offerCondition says.
	if (honeycomb.cardIsOfferable(card) == false) return false;
	if (run == null || card == null || card.offerCondition == null) return true;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		var member = run.partyArray[memberIndex];
		if (member.characterIndex != card.characterIndex) continue;
		if (honeycomb.testCondition(card.offerCondition, honeycomb.newEffectContext({ source: member })) == true) return true;
	}
	return false;
};

//Every eligible member's pool at once, plus the neutral pool: the fallback when a slot's own owner has
//nothing left to offer, and the whole of the reward when the spread is switched off.
honeycomb.combat.rewardPoolForParty = function (memberArray, combat, excludedArray, rarityWeightArray) {
	var result = [];
	for (var memberIndex = 0; memberIndex < memberArray.length; memberIndex++) {
		var poolArray = honeycomb.combat.rewardPoolFor(memberArray[memberIndex], combat, excludedArray, null, rarityWeightArray);
		for (var entryIndex = 0; entryIndex < poolArray.length; entryIndex++) result.push(poolArray[entryIndex]);
	}
	var neutralArray = honeycomb.combat.rewardPoolFor(null, combat, excludedArray, "neutral", rarityWeightArray);
	for (var neutralIndex = 0; neutralIndex < neutralArray.length; neutralIndex++) result.push(neutralArray[neutralIndex]);
	return result;
};

//Who a bonus card belongs to: the character it names when that character is present, else whatever
//the ordinary gained-card rule says.
honeycomb.combat.rewardOwnerFor = function (bonus) {
	var run = honeycomb.state.run;
	if (bonus.ownerCharacterIndex != null) {
		for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
			if (run.partyArray[memberIndex].characterIndex == bonus.ownerCharacterIndex) return run.partyArray[memberIndex].instanceId;
		}
	}
	return honeycomb.defaultOwnerFor(bonus.cardIndex);
};

//Discards the combat state entirely. Called once its rewards have been dealt with, and on every path
//that abandons a fight, so it is the one reliable "this fight is over" point.
honeycomb.combat.clear = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return;
	honeycomb.combat.dismissTemporaryAllies();
	honeycomb.combat.clearFightOnlyCardFields();
	run.combat = null;
};

//What a fight writes onto a deck card that must not outlive it. A fight's card copies ARE the run
//deck's entries (honeycomb.combat.cardInstance), so a per-copy change made mid-fight lands on the
//deck and would otherwise carry into later fights -- e.g. Whetted Edge's cost reduction "this combat".
//Every field here is removed from every deck card when a fight begins and when it is cleared.
honeycomb.combat.fightOnlyCardFieldArray = ["costModifierArray", "costOverrideArray", "combatUpgradeLevel", "combatUpgradePath"];

honeycomb.combat.clearFightOnlyCardFields = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || run.deckArray == null) return 0;
	var cleared = 0;
	for (var cardIndex = 0; cardIndex < run.deckArray.length; cardIndex++) {
		var instance = run.deckArray[cardIndex];
		for (var fieldIndex = 0; fieldIndex < honeycomb.combat.fightOnlyCardFieldArray.length; fieldIndex++) {
			var field = honeycomb.combat.fightOnlyCardFieldArray[fieldIndex];
			if (instance[field] === undefined) continue;
			delete instance[field];
			cleared += 1;
		}
	}
	return cleared;
};

//Removes allies summoned for the duration of one fight. A summon marked permanent stays in the party
//and becomes a real member of the run, deck contribution and all.
//
//Their cards need no cleanup: a summon's cards are minted onto combat.temporaryCardArray, which goes
//with the combat state.
honeycomb.combat.dismissTemporaryAllies = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return 0;
	var dismissed = 0;
	for (var scanIndex = run.partyArray.length - 1; scanIndex >= 0; scanIndex--) {
		if (run.partyArray[scanIndex].temporary != true) continue;
		run.partyArray.splice(scanIndex, 1);
		dismissed += 1;
	}
	return dismissed;
};
