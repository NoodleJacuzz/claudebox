//===================================================================================================
//HONEYCOMB CATACOMBS -- entities, statuses, relics
//===================================================================================================
//Entities are the things in a fight that have health: party members and enemies. They share one shape
//so every effect works on either without asking which it is.
//
//  instanceId    unique within the run
//  side          "ally" or "enemy"
//  health, maxHealth, temporaryHealth, lust, broken
//  statusArray   [{index, stacks}]
//  downed        true once health reaches zero
//
//THE HOOK SYSTEM is the other half of the design space that honeycomb.effectArray started. An effect
//says what happens; a hook says how what happens is bent on the way through. Statuses, relics and
//equipment all publish hooks from the same table shape, so "Strength adds to damage", "this relic
//adds to damage" and "this outfit adds to damage" are one mechanism with three sources.
//
//Hook points, all optional:
//  modifyDamageDealt(amount, params)   params: {entity, target, context, entry}
//  modifyDamageTaken(amount, params)   params: {entity, source, context, entry}
//  modifyTemporaryHealthGained(amount, params)   params: {entity, context}
//  modifyEnergyPerTurn(amount, params) params: {context}
//  modifyCardCost(amount, params)      params: {card, definition, context}
//  modifyDrawPerTurn(amount, params)   params: {context}
//  onTurnStart(params) / onTurnEnd(params)
//  onCombatStart(params) / onCombatEnd(params)
//  onDamaged(params) / onDeath(params)   onDamaged: health was lost
//  onStruck(params)                    once per hit that lands at all, health or Temporary HP;
//                                      params.amount is the whole hit, lost + absorbed
//  onCardPlayed(params)                params: {card, definition, context}
//
//Value-returning hooks FOLD: each source receives the running value and returns the next. Event hooks
//return nothing and act through effects instead.
window.honeycomb = window.honeycomb || {};

//---------------------------------------------------------------------------------------------------
//Entity queries
//---------------------------------------------------------------------------------------------------
//Every entity currently in the fight on a side, downed included.
//
//Allies are NOT copied into the combat state: they ARE the run's party members. Health, lust and
//statuses therefore persist between fights with no syncing step, and -- the reason it matters most --
//a save cannot desync them. Storing a second copy inside combat would survive JSON.stringify as two
//independent objects, and damage taken after a reload would land on only one of them.
//Enemies exist only for the duration of a fight, so they live on the combat state.
//
//THE PARTY EXISTS OUTSIDE A FIGHT; enemies do not. Returning an empty list when there is no fight would
//silently empty "all allies" for every event, so a camp event's heal or damage still finds the party.
honeycomb.entityArray = function (side, combat) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	var allyArray = run == null ? [] : run.partyArray;
	var enemyArray = combat == null ? [] : combat.enemyArray;
	if (side == "ally") return allyArray;
	if (side == "enemy") return enemyArray;
	return allyArray.concat(enemyArray);
};

//Only those still standing. Almost everything targets this rather than the full list.
honeycomb.livingEntityArray = function (side, combat) {
	var sourceArray = honeycomb.entityArray(side, combat);
	var result = [];
	for (var entityIndex = 0; entityIndex < sourceArray.length; entityIndex++) {
		if (sourceArray[entityIndex].downed != true) result.push(sourceArray[entityIndex]);
	}
	return result;
};

honeycomb.findEntity = function (instanceId, combat) {
	var allArray = honeycomb.entityArray("both", combat);
	for (var entityIndex = 0; entityIndex < allArray.length; entityIndex++) {
		if (allArray[entityIndex].instanceId == instanceId) return allArray[entityIndex];
	}
	return null;
};

//The combat entity for the party member whose pool contributed a card. Returns null when the owner is
//downed or the card belongs to nobody, which is what makes owner-targeted effects fail gracefully.
honeycomb.cardOwnerEntity = function (card, combat) {
	if (card == null || card.ownerInstanceId == null || combat == null) return null;
	var owner = honeycomb.findEntity(card.ownerInstanceId, combat);
	if (owner == null || owner.downed == true) return null;
	return owner;
};

//The owner regardless of whether they are still standing. The distinction matters: a card whose owner
//is DOWN is a different situation from a card that never had an owner, and the two want different
//answers. This one answers "whose card is this", not "who can act".
//
//Searches BOTH teams: a move an enemy-team combatant plays is owned by them. Searching only the party
//once sent the heal of an enemy-side Severine's Drain to the party's front member.
honeycomb.cardOwnerMember = function (card) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (card == null || card.ownerInstanceId == null || run == null) return null;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		if (run.partyArray[memberIndex].instanceId == card.ownerInstanceId) return run.partyArray[memberIndex];
	}
	var enemyArray = run.combat == null ? [] : run.combat.enemyArray;
	for (var enemyIndex = 0; enemyIndex < enemyArray.length; enemyIndex++) {
		if (enemyArray[enemyIndex].instanceId == card.ownerInstanceId) return enemyArray[enemyIndex];
	}
	return null;
};

honeycomb.cardOwnerIsDown = function (card) {
	var member = honeycomb.cardOwnerMember(card);
	return member != null && member.downed == true;
};

//---------------------------------------------------------------------------------------------------
//Party order
//---------------------------------------------------------------------------------------------------
//Position in run.partyArray is the party's ORDER, front first; combat.enemyArray is the enemies' order
//the same way. The FRONT of a side is the member nearest the other side -- on screen, the ally
//furthest right and the enemy furthest left. Content that cares about who is in front reads it here
//rather than indexing an array, so the meaning of "front" has one owner and can later account for a
//status that forces someone forward.
//
//PARTY ORDER IS A REAL PART OF THE GAME, not decoration: most enemy attacks land on the front, and
//playing a card moves its owner (see honeycomb.cardPartyShift). It is saved with the run.
honeycomb.frontOf = function (side, combat) {
	var livingArray = honeycomb.livingEntityArray(side, combat);
	return livingArray.length === 0 ? null : livingArray[0];
};

honeycomb.backOf = function (side, combat) {
	var livingArray = honeycomb.livingEntityArray(side, combat);
	return livingArray.length === 0 ? null : livingArray[livingArray.length - 1];
};

//BROKEN COMBATANTS ARE PASSED OVER BY ATTACKS THAT DO NOT PICK: targeting the front enemy bypasses any
//broken characters, and a random-target hit drops broken characters from the pool. Returns the un-broken
//members of `candidateArray` in their own order, or the whole list when every one of them is broken -- the
//last of a side still gets hit rather than an attack landing on nobody (a side that is all broken has
//lost anyway; see combat.sideIsBeaten).
//
//A target mode opts in with `passesOverBroken`; tuning.ai.brokenTargetPenalty at 0 or below turns the
//whole rule off, for this and for picked targets alike.
honeycomb.passOverBrokenArray = function (candidateArray) {
	if (honeycomb.tuning.ai.brokenTargetPenalty <= 0) return candidateArray;
	var standing = [];
	for (var scanIndex = 0; scanIndex < candidateArray.length; scanIndex++) {
		if (candidateArray[scanIndex].broken != true) standing.push(candidateArray[scanIndex]);
	}
	return standing.length === 0 ? candidateArray : standing;
};

//Whom a target mode may land on from the acting entity in `context`, before any pick: the living members
//of its side, with the broken passed over when the mode says so. Resolution AND the forecast's "might"
//spread both read this, so a random attack can never be forecast onto somebody it cannot hit.
honeycomb.targetCandidateArray = function (definition, context) {
	if (definition == null || definition.relation == null) return [];
	var candidateArray = honeycomb.relatedLivingArray(definition.relation, context);
	if (definition.passesOverBroken == true) candidateArray = honeycomb.passOverBrokenArray(candidateArray);
	//A MODE MAY EXCLUDE ITS USER: Severine's Transfusion cannot land on Severine.
	if (definition.excludeSelf == true && context != null && context.source != null) {
		candidateArray = honeycomb.withoutEntity(candidateArray, context.source);
	}
	//TAUNT: an attack on ONE of the other team -- the front, a random one -- lands on a taunter.
	if (definition.relation == "opponent" && definition.wholeTeam != true) candidateArray = honeycomb.tauntFilteredArray(candidateArray, context);
	return candidateArray;
};

//`candidateArray` without `entity`.
honeycomb.withoutEntity = function (candidateArray, entity) {
	var otherArray = [];
	for (var scanIndex = 0; scanIndex < candidateArray.length; scanIndex++) {
		if (candidateArray[scanIndex] !== entity) otherArray.push(candidateArray[scanIndex]);
	}
	return otherArray;
};

//The taunters among `candidateArray`, or the whole list when nobody standing taunts. A status taunts by
//saying `redirectsAttacks: true`. A broken taunter no longer draws anything. The AI's picked targets and
//every single-target mode that does not pick read this; a card the PLAYER aims is never redirected.
//
//FIRST-HIT TAUNT (tree node "Taunt") joins the same filter: a member whose tree node carries
//`firstHitTaunt` draws the first opposing attack of the combat. The combat object on the context is the
//once-per-fight marker -- the same trick First Rites uses -- and `dealDamage` stamps it on the hit.
//Who is standing in front of `target` right now, or null when nobody is. The wall is the frontmost
//living combatant on the target's own side carrying a `redirectsAttacks` status -- the same rule the
//selection filter below uses, asked about a hit that has already been aimed. A broken taunter draws
//nothing, which is the existing rule and the reason a wall can be broken open.
honeycomb.tauntWallFor = function (target, context) {
	if (target == null || target.side == null) return null;
	var combat = context == null ? null : context.combat;
	var sideArray = honeycomb.entityArray(target.side, combat);
	//A SINGLE ALLOCATION-FREE SCAN, because this now runs on EVERY hit rather than once per aimed move,
	//and `dealDamage` is the hottest path in a turn. The filter below builds two arrays; most fights have
	//no taunter in them at all, and this way that case costs one walk and no garbage.
	for (var scanIndex = 0; scanIndex < sideArray.length; scanIndex++) {
		var candidate = sideArray[scanIndex];
		if (candidate === target || candidate.downed == true || candidate.broken == true) continue;
		var statusArray = candidate.statusArray;
		if (statusArray == null) continue;
		for (var statusScan = 0; statusScan < statusArray.length; statusScan++) {
			if (statusArray[statusScan].stacks <= 0) continue;
			var status = honeycomb.findDefinition(honeycomb.statusArray, statusArray[statusScan].index);
			if (status != null && status.redirectsAttacks == true) return candidate;
		}
	}
	return null;
};

honeycomb.tauntFilteredArray = function (candidateArray, context) {
	var tauntArray = [];
	for (var scanIndex = 0; scanIndex < candidateArray.length; scanIndex++) {
		var candidate = candidateArray[scanIndex];
		if (candidate.broken == true || candidate.statusArray == null) continue;
		for (var statusScan = 0; statusScan < candidate.statusArray.length; statusScan++) {
			var status = honeycomb.findDefinition(honeycomb.statusArray, candidate.statusArray[statusScan].index);
			if (status != null && status.redirectsAttacks == true) { tauntArray.push(candidate); break; }
		}
	}
	if (tauntArray.length === 0) {
		var combat = context == null ? null : context.combat;
		for (var hitIndex = 0; hitIndex < candidateArray.length; hitIndex++) {
			var hitCandidate = candidateArray[hitIndex];
			if (hitCandidate.broken == true || hitCandidate.characterIndex == null) continue;
			if (honeycomb.characterFieldFlag(hitCandidate.characterIndex, "firstHitTaunt") != true) continue;
			if (combat != null && hitCandidate.firstHitTauntCombat === combat) continue;
			tauntArray.push(hitCandidate);
			break;
		}
	}
	return tauntArray.length === 0 ? candidateArray : tauntArray;
};

//The party's front and back, and the enemies', by their old names.
honeycomb.frontAlly = function (combat) { return honeycomb.frontOf("ally", combat); };
honeycomb.backAlly = function (combat) { return honeycomb.backOf("ally", combat); };
honeycomb.frontEnemy = function (combat) { return honeycomb.frontOf("enemy", combat); };
honeycomb.backEnemy = function (combat) { return honeycomb.backOf("enemy", combat); };

//---------------------------------------------------------------------------------------------------
//Teams
//---------------------------------------------------------------------------------------------------
//An entity's `side` is its TEAM: "ally" is the player's team, "enemy" the one it fights. Nothing about a
//combatant is decided by its team except which array it stands in and who it fights -- a character may
//stand on the enemy team and an enemy on the party's. Cards target RELATIVE to the user's team (see the
//target mode table), and what a combatant IS -- its stats, art and moves -- comes from its definition
//(honeycomb.entityDefinition), never from its team.
honeycomb.opposingSide = function (side) {
	return side == "enemy" ? "ally" : "enemy";
};

//The team whoever is acting in `context` is on. An action with no actor -- an event, a relic's world
//hook -- acts for the party.
honeycomb.userSide = function (context) {
	//A turncoat's move: the context says which team the action is taken FOR, and every target mode is
	//relative to that instead of the actor's own team.
	if (context != null && context.actingSide != null) return context.actingSide;
	var source = context == null ? null : context.source;
	return source == null || source.side == null ? "ally" : source.side;
};

//The side a relation names from a user on `userSide`: "opponent" the other team, "teammate" or "self"
//their own, "both" both.
honeycomb.sideForRelation = function (relation, userSide) {
	var side = userSide == null ? "ally" : userSide;
	if (relation == "opponent") return honeycomb.opposingSide(side);
	if (relation == "both") return "both";
	return side;
};

//The living members of the side a relation names from the acting entity in `context`.
honeycomb.relatedLivingArray = function (relation, context) {
	var side = honeycomb.sideForRelation(relation, honeycomb.userSide(context));
	var livingArray = honeycomb.livingEntityArray(side, context == null ? null : context.combat);
	//A turned move never lands on its own user. Every mode that names a side reads this, so a turned
	//sweep skips its user too.
	var source = context == null ? null : context.source;
	if (context != null && context.actingSide != null && source != null && (side == source.side || side == "both")) {
		livingArray = honeycomb.withoutEntity(livingArray, source);
	}
	return livingArray;
};

//BRINGS ANY COMBATANT INTO A FIGHT, ON EITHER TEAM. `spec` is {enemyIndex | characterIndex, side,
//outfitIndex, healthFraction, controller, temporary}. What it IS decides its stats, art and moves; its
//side decides only where it stands:
//  on the enemy team   it joins the enemy line (capped by tuning.scaling.enemyLimit, a stall guard)
//  on the party's team it joins the party for this fight only, unless `temporary` is false
//An AI combatant telegraphs its first move at once, so it never stands for a turn showing nothing.
//Returns the new entity, or null when refused.
//---------------------------------------------------------------------------------------------------
//The Chessmaster's golems
//---------------------------------------------------------------------------------------------------
//A golem is an ordinary enemy-table entity that happens to stand with the party. These read its tags,
//so being a golem -- or being large enough to need the sixth rank -- is a content-table decision.
honeycomb.definitionHasTag = function (definition, tagIndex) {
	if (definition == null || definition.tagArray == null) return false;
	for (var tagScan = 0; tagScan < definition.tagArray.length; tagScan++) {
		if (definition.tagArray[tagScan] == tagIndex) return true;
	}
	return false;
};

honeycomb.isGolemDefinition = function (enemyIndex) {
	return honeycomb.definitionHasTag(honeycomb.findDefinition(honeycomb.enemyArray, enemyIndex), "golem");
};

honeycomb.isLargeDefinition = function (enemyIndex) {
	return honeycomb.definitionHasTag(honeycomb.findDefinition(honeycomb.enemyArray, enemyIndex), "large");
};

//True for an entity already standing on the board, by its own definition.
honeycomb.entityIsLarge = function (entity) {
	var found = honeycomb.entityDefinition(entity);
	return found != null && found.kind == "enemy" && honeycomb.definitionHasTag(found.definition, "large");
};

//Allies that occupy a REGULAR rank -- everyone except the large entities the cap ignores.
//
//Counts BODIES, not the living: a downed fighter is still drawn, so counting only the standing would let
//a party with one member down grow a sixth figure. A corpse holds its slot; what keeps summoning possible
//anyway is that a Pawn summon EATS a downed piece before the cap is consulted (honeycomb.summonCombatant).
honeycomb.regularAllyCount = function (combat) {
	var allyArray = honeycomb.entityArray("ally", combat);
	var count = 0;
	for (var scanIndex = 0; scanIndex < allyArray.length; scanIndex++) {
		if (honeycomb.entityIsLarge(allyArray[scanIndex]) != true) count++;
	}
	return count;
};

//---------------------------------------------------------------------------------------------------
//Commanded pieces
//---------------------------------------------------------------------------------------------------
//A golem's move: its innate activation is a 0-cost reposition the PLAYER triggers, once per piece per
//turn. It gives zero deck-clog positioning -- the Chessmaster needs no movement cards because every
//piece carries its own, so her hand is free for summons, sacrifices and payoffs.
//
//An enemy-table entity cannot hold an ability, so this is its own small seam rather than a reuse of
//honeycomb.abilityArray: the definition declares `allyActivation` and the combat screen offers it while
//the piece stands with the party. Shape:
//
//  shift          a honeycomb.partyShiftArray index ("forward", "front", "back", "backward", "none")
//  text           what the button says it does
//  effectArray    optional, resolved after the shift, for a Move that also does something
//
//Spent-ness is a turn number on the entity rather than a status, so it cannot desync from the turn and
//it survives a save without needing its own reconciliation.
//Moving a piece to a chosen rank. honeycomb.partyShiftArray offers five fixed directions, which is
//everything the other six characters ever needed. The Knight needs a sixth thing: go to a specific slot.
//Rather than bend the shift registry -- whose entries are static and parameterless -- this splices the
//entity out of its side and back in at the rank asked for.
//
//`targetRank` counts the LIVING members of its side, 0 at the front, matching honeycomb.entityRank.
//What moveEntityToRank would do, without doing it. A dragged card shows where it would move its owner
//before it is let go; a dragged aim shows the same thing for the piece it is moving.
//It mirrors moveEntityToRank's splice EXACTLY -- moving backward lands after the anchor, forward lands
//before it -- so the preview and the move cannot disagree about where the piece ends up. Reads the
//LIVING order, which is the order the battlefield draws and the order slideToOrder animates.
honeycomb.previewMoveToRank = function (entity, targetRank, combat) {
	if (entity == null) return null;
	var side = entity.side == "enemy" ? "enemy" : "ally";
	var livingArray = honeycomb.livingEntityArray(side, combat);
	var fromRank = honeycomb.entityRank(entity, combat);
	if (fromRank < 0 || livingArray.length === 0) return null;
	var wanted = Math.max(0, Math.min(livingArray.length - 1, Math.floor(targetRank)));
	if (wanted === fromRank) return null;
	var anchor = livingArray[wanted];
	if (anchor == null || anchor.instanceId == entity.instanceId) return null;

	var orderArray = livingArray.slice();
	var moving = orderArray.splice(fromRank, 1)[0];
	var to = -1;
	for (var scanIndex = 0; scanIndex < orderArray.length; scanIndex++) {
		if (orderArray[scanIndex].instanceId == anchor.instanceId) { to = scanIndex; break; }
	}
	if (to < 0) return null;
	orderArray.splice(fromRank <= to ? to + 1 : to, 0, moving);

	var orderIdArray = [];
	var landedRank = -1;
	for (var orderIndex = 0; orderIndex < orderArray.length; orderIndex++) {
		orderIdArray.push(orderArray[orderIndex].instanceId);
		if (orderArray[orderIndex].instanceId == moving.instanceId) landedRank = orderIndex;
	}
	return {
		entityId: entity.instanceId, fromRank: fromRank, toRank: landedRank, orderIdArray: orderIdArray,
		arrow: landedRank < fromRank ? "front" : "back",
	};
};

//Promotion: one piece becomes another. The DESTINATION is the caller's, and nothing here knows an order
//of pieces. There is deliberately no table of what-follows-what, no `tier` and no `nextPiece`: a card
//names what it converts and what it converts into, and two cards may take the same piece to different
//places.
//
//THE BODY IS THE SAME BODY. `instanceId` is kept, so everything holding a reference to it still points
//at the right combatant -- the chain, a status, a queued intent, an aim in progress, the turn order.
//Only what the piece IS changes.
honeycomb.promoteEntity = function (entity, toEnemyIndex, context) {
	if (entity == null || toEnemyIndex == null) return false;
	var combat = context == null ? null : context.combat;
	var definition = honeycomb.findDefinition(honeycomb.enemyArray, toEnemyIndex);
	if (definition == null || entity.enemyIndex == null) return false;
	//Promoting something into what it already is would spend the card for nothing.
	if (entity.enemyIndex == toEnemyIndex) return false;
	//The golem cap counts BODIES, and promotion creates none -- so a full board may still promote. That
	//is the point of it: it is how a board gets stronger once it cannot get bigger.

	var fromIndex = entity.enemyIndex;
	var fraction = entity.maxHealth > 0 ? entity.health / entity.maxHealth : 1;

	//The OLD shape's passives leave with it. A promoted Pawn must not keep its Pawn chain AND gain a
	//Rook's -- the passive belongs to the shape, not to the body. Statuses the piece PICKED UP stay,
	//because those happened to the body: a Sundered Pawn is a Sundered Rook.
	var oldDefinition = honeycomb.findDefinition(honeycomb.enemyArray, fromIndex);
	var oldPassiveArray = oldDefinition == null || oldDefinition.startingStatusArray == null
		? [] : oldDefinition.startingStatusArray;
	for (var passiveIndex = 0; passiveIndex < oldPassiveArray.length; passiveIndex++) {
		honeycomb.removeStatus(entity, oldPassiveArray[passiveIndex].status, null, context);
	}

	//Name and tags are read off the definition, never stored on the body, so changing what it IS is the
	//whole of the rename.
	entity.enemyIndex = toEnemyIndex;
	entity.maxHealth = Math.max(1, Math.round(definition.baseHealth * honeycomb.scaling.enemyHealthMultiplier()));
	if (honeycomb.tuning.chessmaster.promotionHealthMode == "full") entity.health = entity.maxHealth;
	else entity.health = Math.max(1, Math.round(entity.maxHealth * fraction));

	//Its move list is its new one; the intent it was telegraphing belonged to the piece it used to be.
	entity.intentCardIndex = null;
	entity.lastMoveCardIndex = null;
	entity.sameMoveCount = 0;
	entity.movePosition = 0;
	//And its placement, so a promoted piece stands at its new shape's size rather than its old one.
	entity.placement = honeycomb.combat.placementFor(definition, null);

	if (honeycomb.discovery != null) honeycomb.discovery.meet("enemy", toEnemyIndex, context);
	//And the new shape's passives arrive, the same way they would on a summon.
	honeycomb.combat.applyEnemyPassives(entity, context);

	//The new shape telegraphs at once: the board is a promise the player reads before ending the turn, so
	//a promoted piece shows its first move now rather than standing blank until it acts.
	var telegraphed = honeycomb.isAiControlled(entity) ? honeycomb.selectMove(entity) : null;

	honeycomb.logEvent(context, {
		type: "entityPromoted", targetId: entity.instanceId,
		fromEnemy: fromIndex, enemy: toEnemyIndex, card: telegraphed,
	});
	honeycomb.fireEntityHooks("onPromoted", { entity: entity, context: context, fromEnemy: fromIndex });
	return true;
};

//A downed piece stands back up. A Pawn's corpse is inventory, not a space leak: every Pawn summon fills
//a downed Pawn's place before an empty one, and Transposition may raise one at the inverted alignment.
//The SAME body in the SAME place, as a promotion is: `instanceId` and its position in the party are
//kept, so the line does not reshuffle around it.
//Everything that happened to the old body is gone -- statuses, Temporary HP, Lust, its place in its move
//list -- because what stands up is a fresh piece of shape `toEnemyIndex` at full health.
honeycomb.raisePiece = function (entity, toEnemyIndex, context) {
	if (entity == null || entity.downed != true || entity.enemyIndex == null) return false;
	var definition = honeycomb.findDefinition(honeycomb.enemyArray, toEnemyIndex == null ? entity.enemyIndex : toEnemyIndex);
	if (definition == null) return false;

	var fromIndex = entity.enemyIndex;
	entity.enemyIndex = definition.index;
	entity.downed = false;
	entity.statusArray = [];
	entity.temporaryHealth = 0;
	if (entity.lust != null) entity.lust = 0;
	entity.maxHealth = Math.max(1, Math.round(definition.baseHealth * honeycomb.scaling.enemyHealthMultiplier()));
	entity.health = entity.maxHealth;
	entity.intentCardIndex = null;
	entity.lastMoveCardIndex = null;
	entity.sameMoveCount = 0;
	entity.movePosition = 0;
	entity.activationUsedTurn = null;
	entity.placement = honeycomb.combat.placementFor(definition, null);
	if (context != null && context.source != null) entity.summonedBy = context.source.instanceId;

	if (honeycomb.discovery != null) honeycomb.discovery.meet("enemy", definition.index, context);
	honeycomb.combat.applyEnemyPassives(entity, context);
	honeycomb.logEvent(context, {
		type: "entityRaised", targetId: entity.instanceId, fromEnemy: fromIndex, enemy: definition.index,
		card: honeycomb.isAiControlled(entity) ? honeycomb.selectMove(entity) : null,
	});
	return true;
};

//The downed piece a summon of `enemyIndex` would refill, or null: the frontmost downed ally-side golem.
//
//A Pawn summon eats any dead piece. tuning.chessmaster.refillTagArray names which summons do the eating
//-- a Pawn, the body the board fills up with -- and the CORPSE no longer has to match it, so a fallen
//Knight's place is refilled rather than standing as a seventh figure nothing can clear. What comes up is
//the summoned shape at full health, in the fallen piece's place (honeycomb.raisePiece).
honeycomb.refillablePiece = function (enemyIndex, combat) {
	var definition = honeycomb.findDefinition(honeycomb.enemyArray, enemyIndex);
	if (definition == null || honeycomb.isGolemDefinition(enemyIndex) != true) return null;
	var tagArray = honeycomb.tuning.chessmaster.refillTagArray;
	var refills = false;
	for (var tagIndex = 0; tagIndex < tagArray.length; tagIndex++) {
		if (honeycomb.definitionHasTag(definition, tagArray[tagIndex])) { refills = true; break; }
	}
	if (refills != true) return null;
	var allyArray = honeycomb.entityArray("ally", combat);
	for (var allyIndex = 0; allyIndex < allyArray.length; allyIndex++) {
		var candidate = allyArray[allyIndex];
		if (candidate.downed != true || candidate.enemyIndex == null) continue;
		var found = honeycomb.findDefinition(honeycomb.enemyArray, candidate.enemyIndex);
		if (found == null || honeycomb.definitionHasTag(found, "golem") != true) continue;
		return candidate;
	}
	return null;
};

honeycomb.moveEntityToRank = function (entity, targetRank, context) {
	var sideArray = honeycomb.sideArrayFor(entity);
	if (sideArray == null) return false;
	var combat = context == null ? null : context.combat;
	var livingArray = honeycomb.livingEntityArray(entity.side == "enemy" ? "enemy" : "ally", combat);
	var wanted = Math.max(0, Math.min(livingArray.length - 1, Math.floor(targetRank)));
	if (honeycomb.entityRank(entity, combat) === wanted) return false;

	//The anchor is whoever currently holds the wanted rank; splicing around a living neighbour keeps
	//downed members where they are rather than silently compacting the array.
	var anchor = livingArray[wanted];
	if (anchor == null || anchor.instanceId == entity.instanceId) return false;

	var from = -1;
	for (var scanIndex = 0; scanIndex < sideArray.length; scanIndex++) {
		if (sideArray[scanIndex].instanceId == entity.instanceId) { from = scanIndex; break; }
	}
	if (from < 0) return false;
	sideArray.splice(from, 1);
	var to = -1;
	for (var anchorIndex = 0; anchorIndex < sideArray.length; anchorIndex++) {
		if (sideArray[anchorIndex].instanceId == anchor.instanceId) { to = anchorIndex; break; }
	}
	if (to < 0) { sideArray.splice(from, 0, entity); return false; }
	//Moving BACKWARD lands after the anchor; moving forward lands before it.
	sideArray.splice(from <= to ? to + 1 : to, 0, entity);

	var orderIdArray = [];
	for (var orderIndex = 0; orderIndex < sideArray.length; orderIndex++) orderIdArray.push(sideArray[orderIndex].instanceId);
	honeycomb.logEvent(context, { type: "partyReordered", orderIdArray: orderIdArray, targetId: entity.instanceId });
	honeycomb.fireEntityHooks("onShifted", { entity: entity, context: context });
	return true;
};

//The living neighbour a swap Move trades with: one rank ahead ("ahead") or behind ("behind"). Null when
//there is nobody there, which is what makes the Bishop's Move dim at the front of the line.
honeycomb.golemSwapPartner = function (entity, direction, combat) {
	var rank = honeycomb.entityRank(entity, combat);
	if (rank < 0) return null;
	var livingArray = honeycomb.livingEntityArray(entity.side == "enemy" ? "enemy" : "ally", combat);
	var wanted = direction == "ahead" ? rank - 1 : rank + 1;
	if (wanted < 0 || wanted >= livingArray.length) return null;
	return livingArray[wanted];
};

honeycomb.golemActivation = function (entity) {
	if (entity == null || entity.side == "enemy") return null;
	var found = honeycomb.entityDefinition(entity);
	if (found == null || found.kind != "enemy") return null;
	return found.definition.allyActivation == null ? null : found.definition.allyActivation;
};

//Why a Move cannot be used, or that it can. Reported one reason at a time, as ability usability is.
honeycomb.golemActivationUsability = function (entity, combat) {
	var activation = honeycomb.golemActivation(entity);
	if (activation == null) return { usable: false, reason: null };
	if (entity.downed == true) return { usable: false, reason: "It has fallen." };
	if (combat == null || combat.phase != "playerTurn") return { usable: false, reason: "Not your turn." };
	if (entity.activationUsedTurn === combat.turnNumber) return { usable: false, reason: "Already moved this turn." };
	//A Move that would not actually move it is offered but refused, the same rule ally-move cards follow
	//(honeycomb.previewShift). "None" is a piece that deliberately cannot move, like a King.
	//A SWAP MOVE trades places with the living neighbour ahead of or behind it. Distinct from a shift:
	//the Bishop pulls a Pawn into the slot in front of it rather than shuffling the whole line.
	if (activation.swap != null) {
		if (honeycomb.golemSwapPartner(entity, activation.swap, combat) == null) {
			return { usable: false, reason: activation.swap == "ahead" ? "Nobody ahead of it." : "Nobody behind it." };
		}
		return { usable: true, reason: null };
	}
	//A FREE-PICK MOVE offers every rank but its own, so it is usable whenever the line has another slot.
	if (activation.pick == "rank") {
		var livingCount = honeycomb.livingEntityArray("ally", combat).length;
		if (livingCount < 2) return { usable: false, reason: "Nowhere to go." };
		return { usable: true, reason: null };
	}
	if (activation.shift == null || activation.shift == "none") return { usable: false, reason: "It does not move." };
	if (honeycomb.previewShift(entity, activation.shift, combat) == null) {
		return { usable: false, reason: "It is already there." };
	}
	return { usable: true, reason: null };
};

//Runs it. Returns true when the board actually changed, so the caller knows whether to repaint.
honeycomb.runGolemActivation = function (entity, context) {
	var combat = context == null ? null : context.combat;
	if (honeycomb.golemActivationUsability(entity, combat).usable != true) return false;
	var activation = honeycomb.golemActivation(entity);
	//A free-pick Move needs the rank the player chose; honeycomb.runGolemActivationToRank is its entry
	//point, so calling this one on a picker is a caller error rather than a silent default.
	if (activation.pick == "rank") return false;
	entity.activationUsedTurn = combat.turnNumber;
	if (activation.swap != null) {
		var partner = honeycomb.golemSwapPartner(entity, activation.swap, combat);
		if (partner == null) return false;
		honeycomb.swapEntities(entity, partner, context, {});
	} else {
		honeycomb.shiftEntity(entity, activation.shift, context, {});
	}
	if (activation.effectArray != null) {
		var childContext = honeycomb.newEffectContext({ combat: combat, source: entity });
		childContext.target = entity;
		childContext.targetArray = [entity];
		honeycomb.resolveEffectArray(activation.effectArray, childContext);
	}
	honeycomb.logEvent(context, { type: "golemActivated", targetId: entity.instanceId, shift: activation.shift });
	return true;
};

//THE FREE-PICK MOVE. Same once-per-turn rule, but the player names the destination -- which is what
//makes the Knight the piece the design describes: the one that can be thrown to the front to block and
//still be worth something, or parked at the back to print.
honeycomb.runGolemActivationToRank = function (entity, targetRank, context) {
	var combat = context == null ? null : context.combat;
	if (honeycomb.golemActivationUsability(entity, combat).usable != true) return false;
	var activation = honeycomb.golemActivation(entity);
	if (activation.pick != "rank") return false;
	if (honeycomb.moveEntityToRank(entity, targetRank, context) != true) return false;
	entity.activationUsedTurn = combat.turnNumber;
	if (activation.effectArray != null) {
		var childContext = honeycomb.newEffectContext({ combat: combat, source: entity });
		childContext.target = entity;
		childContext.targetArray = [entity];
		honeycomb.resolveEffectArray(activation.effectArray, childContext);
	}
	honeycomb.logEvent(context, { type: "golemActivated", targetId: entity.instanceId, rank: targetRank });
	return true;
};

honeycomb.summonCombatant = function (spec, context) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	var combat = context == null ? null : context.combat;
	if (run == null || combat == null || spec == null) return null;
	var side = spec.side == null ? "enemy" : spec.side;
	if (side == "enemy" && combat.enemyArray.length >= honeycomb.tuning.scaling.enemyLimit) {
		honeycomb.logEvent(context, { type: "summonRefused", enemy: spec.enemyIndex, character: spec.characterIndex, reason: "enemyLimit" });
		return null;
	}
	//A Pawn summon fills a downed piece's place before an empty one, from any source, and does this before
	//the cap: raising a corpse adds no figure to the board, so a full board of which one is a corpse must
	//still be able to summon. See honeycomb.refillablePiece.
	if (side != "enemy" && spec.enemyIndex != null) {
		var refilled = honeycomb.refillablePiece(spec.enemyIndex, combat);
		if (refilled != null && honeycomb.raisePiece(refilled, spec.enemyIndex, context) == true) return refilled;
	}
	//The golem cap: the Chessmaster's pieces are the only thing that needs a limit on the ally side, so
	//the limit lives here rather than in the roster, the board or the field count -- none of which change.
	//A piece tagged `large` (a King) ignores the cap and lands at the end of the party array, which IS the
	//sixth rank and therefore resolves last: the Background Master Slot, for one tag. It counts BODIES,
	//corpses included (honeycomb.regularAllyCount), because a corpse is still drawn.
	if (side != "enemy" && spec.enemyIndex != null && honeycomb.isGolemDefinition(spec.enemyIndex) &&
		honeycomb.isLargeDefinition(spec.enemyIndex) != true &&
		honeycomb.regularAllyCount(combat) >= honeycomb.tuning.chessmaster.regularSlotCount) {
		honeycomb.logEvent(context, { type: "summonRefused", enemy: spec.enemyIndex, reason: "golemLimit" });
		return null;
	}

	var entity = null;
	if (spec.enemyIndex != null) {
		entity = honeycomb.combat.newEnemy(spec.enemyIndex, combat.enemyArray.length);
	} else if (spec.characterIndex != null) {
		entity = honeycomb.newPartyMember({ characterIndex: spec.characterIndex, outfitIndex: spec.outfitIndex, equipmentArray: [] });
		if (entity != null) {
			//A character the AI plays keeps the same move bookkeeping an enemy does.
			entity.intentCardIndex = null;
			entity.lastMoveCardIndex = null;
			entity.sameMoveCount = 0;
			entity.movePosition = 0;
			honeycomb.abilities.reconcile(entity);
		}
	}
	if (entity == null) return null;

	entity.side = side;
	//Marked so an effect can tell a summoned combatant from one the fight began with.
	entity.summoned = true;
	entity.summonedBy = context.source == null ? null : context.source.instanceId;
	if (spec.controller != null) entity.controller = spec.controller;
	if (spec.healthFraction != null) entity.health = Math.max(1, Math.round(entity.maxHealth * spec.healthFraction));
	//A character summoned already hurt has already had its half-health moment.
	entity.halfHealthShown = entity.characterIndex != null &&
		entity.health <= entity.maxHealth * honeycomb.tuning.halfHealthOverlay.thresholdFraction;

	if (side == "enemy") {
		combat.enemyArray.push(entity);
	} else {
		entity.temporary = spec.temporary != false;
		run.partyArray.push(entity);
	}
	//A summoned creature is met like any other, and is a discovery the first time.
	if (spec.enemyIndex != null) honeycomb.discovery.meet("enemy", spec.enemyIndex, context);
	//It arrives with its passives, as one standing at the start of the fight does.
	if (spec.enemyIndex != null) honeycomb.combat.applyEnemyPassives(entity, context);
	//And with whatever the fight puts on its enemies (an encounter's `enemyStartingStatusArray`).
	honeycomb.combat.applyEncounterStatuses(entity, context);

	honeycomb.logEvent(context, {
		type: side == "enemy" ? "enemySummoned" : "allySummoned",
		targetId: entity.instanceId,
		enemy: spec.enemyIndex,
		character: spec.characterIndex,
		temporary: entity.temporary == true,
		sourceId: entity.summonedBy,
		card: honeycomb.isAiControlled(entity) ? honeycomb.selectMove(entity) : null,
	});
	return entity;
};

//Zero-based position among the LIVING members of an entity's own side, or -1. Downed members do not
//occupy a rank; a party of three with the front member down has its second member standing at rank 0.
//Where `entity` stands in an ALREADY-BUILT line, or -1. The relative target modes (allyAhead,
//alliesBehind, adjacentAllies) all need the index within the same array they are about to slice, and
//honeycomb.entityRank rebuilds the line from the side -- which is a different array whenever the caller
//has filtered one (a turned move drops its own user from it).
honeycomb.lineIndexOf = function (lineArray, entity) {
	if (lineArray == null || entity == null) return -1;
	for (var scanIndex = 0; scanIndex < lineArray.length; scanIndex++) {
		if (lineArray[scanIndex].instanceId == entity.instanceId) return scanIndex;
	}
	return -1;
};

honeycomb.entityRank = function (entity, combat) {
	if (entity == null) return -1;
	var livingArray = honeycomb.livingEntityArray(entity.side == "enemy" ? "enemy" : "ally", combat);
	for (var scanIndex = 0; scanIndex < livingArray.length; scanIndex++) {
		if (livingArray[scanIndex].instanceId == entity.instanceId) return scanIndex;
	}
	return -1;
};

honeycomb.allyRank = function (entity, combat) {
	return honeycomb.entityRank(entity, combat);
};

//---------------------------------------------------------------------------------------------------
//Moving through the order
//---------------------------------------------------------------------------------------------------
//The ways a member can move through their side's order. A registry, so "swap with whoever is in front"
//or "two places back" is a table entry rather than a branch in the play path.
//
//  toRank(rank, count)  the living rank the member ends at, before clamping. Null means no move.
//  text                 how generated card text phrases the move
//  arrow                which way the combat screen points while a card that causes it is held:
//                       "front" or "back", or null for no move
honeycomb.partyShiftArray = [
	{ index: "none", name: "Stays put", toRank: null, text: null, arrow: null },
	{ index: "front", name: "To the front", text: "to the front", arrow: "front",
		toRank: function () { return 0; } },
	{ index: "back", name: "To the back", text: "to the back", arrow: "back",
		toRank: function (rank, count) { return count - 1; } },
	{ index: "forward", name: "One step forward", text: "one step forward", arrow: "front",
		toRank: function (rank) { return rank - 1; } },
	{ index: "backward", name: "One step back", text: "one step back", arrow: "back",
		toRank: function (rank) { return rank + 1; } },
];

//The array an entity's order lives in: the run's party, or the fight's enemy line.
honeycomb.sideArrayFor = function (entity) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || entity == null) return null;
	if (entity.side == "enemy") return run.combat == null ? null : run.combat.enemyArray;
	return run.partyArray;
};

//Where a shift WOULD leave a member, without moving anyone: {fromRank, toRank, orderIdArray}, or null
//when it would change nothing. The combat screen asks this while a card is held, so the move can be
//shown before it is committed; the real move below uses the same answer, so the two cannot disagree.
honeycomb.previewShift = function (entity, shiftIndex, combat) {
	var shift = honeycomb.findDefinition(honeycomb.partyShiftArray, shiftIndex);
	if (entity == null || shift == null || shift.toRank == null) return null;
	var livingArray = honeycomb.livingEntityArray(entity.side == "enemy" ? "enemy" : "ally", combat);
	var fromRank = -1;
	for (var scanIndex = 0; scanIndex < livingArray.length; scanIndex++) {
		if (livingArray[scanIndex].instanceId == entity.instanceId) { fromRank = scanIndex; break; }
	}
	if (fromRank < 0) return null;
	var toRank = Math.max(0, Math.min(livingArray.length - 1, shift.toRank(fromRank, livingArray.length)));
	if (toRank === fromRank) return null;

	var orderArray = livingArray.slice();
	var moving = orderArray.splice(fromRank, 1)[0];
	orderArray.splice(toRank, 0, moving);
	var orderIdArray = [];
	for (var orderIndex = 0; orderIndex < orderArray.length; orderIndex++) orderIdArray.push(orderArray[orderIndex].instanceId);
	return { entityId: entity.instanceId, fromRank: fromRank, toRank: toRank, orderIdArray: orderIdArray, arrow: shift.arrow };
};

//Moves a member through their own side's order. The array itself is reordered, so the change
//survives a save and every reader of party order sees it without being told. Downed members keep
//their place relative to their neighbours; only the living have ranks.
//`options.pace` names how fast the screen plays the move (tuning.animation.partyShiftPaceArray): a CHARGE
//slides quickly and lets the hit land as the figure arrives.
honeycomb.shiftEntity = function (entity, shiftIndex, context, options) {
	var combat = context == null || context.combat == null
		? (honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat)
		: context.combat;
	var preview = honeycomb.previewShift(entity, shiftIndex, combat);
	if (preview == null) return null;
	var sideArray = honeycomb.sideArrayFor(entity);
	if (sideArray == null) return null;

	var position = -1;
	for (var scanIndex = 0; scanIndex < sideArray.length; scanIndex++) {
		if (sideArray[scanIndex].instanceId == entity.instanceId) { position = scanIndex; break; }
	}
	if (position < 0) return null;
	var moving = sideArray.splice(position, 1)[0];

	//Placed in front of whichever living member now holds the target rank, or after the last living
	//member when it is going to the very back.
	var livingOtherArray = [];
	for (var otherIndex = 0; otherIndex < sideArray.length; otherIndex++) {
		if (sideArray[otherIndex].downed != true) livingOtherArray.push(sideArray[otherIndex]);
	}
	var insertAt = sideArray.length;
	if (preview.toRank < livingOtherArray.length) {
		insertAt = sideArray.indexOf(livingOtherArray[preview.toRank]);
	} else if (livingOtherArray.length > 0) {
		insertAt = sideArray.indexOf(livingOtherArray[livingOtherArray.length - 1]) + 1;
	}
	sideArray.splice(insertAt, 0, moving);

	honeycomb.logEvent(context, {
		type: "partyOrder",
		side: entity.side == "enemy" ? "enemy" : "ally",
		movedId: entity.instanceId,
		fromRank: preview.fromRank,
		toRank: preview.toRank,
		orderIdArray: preview.orderIdArray,
		pace: options == null || options.pace == null ? null : options.pace,
	});

	//Movement is counted: how far this action has moved people goes to the tally (`ranksMoved`), how far
	//this member has moved this turn stays on them (read by the `ranksMovedThisTurn` value), and the move
	//is an event for the mover and for the world.
	var distance = Math.abs(preview.toRank - preview.fromRank);
	if (context != null && context.tally != null) context.tally.ranksMoved = (context.tally.ranksMoved == null ? 0 : context.tally.ranksMoved) + distance;
	var turnNumber = combat == null ? null : combat.turnNumber;
	if (entity.movedTurnNumber !== turnNumber) { entity.movedTurnNumber = turnNumber; entity.ranksMovedThisTurn = 0; }
	entity.ranksMovedThisTurn += distance;
	if (context != null) {
		honeycomb.fireEntityHooks("onShifted", { entity: entity, fromRank: preview.fromRank, toRank: preview.toRank, distance: distance, context: context });
		if (entity.side != "enemy") {
			honeycomb.fireRunHooks("onPartyShifted", { entity: entity, fromRank: preview.fromRank, toRank: preview.toRank, distance: distance, context: context });
		}
	}
	return preview;
};

//How far a combatant has moved through its order this turn. Zero on any other turn.
honeycomb.ranksMovedThisTurn = function (entity, combat) {
	if (entity == null || combat == null || entity.movedTurnNumber !== combat.turnNumber) return 0;
	return entity.ranksMovedThisTurn == null ? 0 : entity.ranksMovedThisTurn;
};

//Kept for content and tests written against it. A shift to the front, by another name.
honeycomb.moveAllyToFront = function (entity, context) {
	return honeycomb.shiftEntity(entity, "front", context) != null;
};

//TWO-PERSON SWAP (STARTER-REWORK-01 §3). Trades the array positions of two combatants on the same
//side, so a card can move ONE character forward without also dragging everyone it passed. Both
//members are reported exactly as shiftEntity reports one, so the screen, the replay and every
//onShifted / onPartyShifted reader cannot tell a swap from two shifts.
honeycomb.swapEntities = function (entityA, entityB, context, options) {
	if (entityA == null || entityB == null || entityA.instanceId == entityB.instanceId) return false;
	var sideArray = honeycomb.sideArrayFor(entityA);
	if (sideArray == null || honeycomb.sideArrayFor(entityB) !== sideArray) return false;

	var positionA = -1;
	var positionB = -1;
	for (var scanIndex = 0; scanIndex < sideArray.length; scanIndex++) {
		if (sideArray[scanIndex].instanceId == entityA.instanceId) positionA = scanIndex;
		if (sideArray[scanIndex].instanceId == entityB.instanceId) positionB = scanIndex;
	}
	if (positionA < 0 || positionB < 0) return false;

	sideArray[positionA] = entityB;
	sideArray[positionB] = entityA;

	var orderIdArray = [];
	for (var orderIndex = 0; orderIndex < sideArray.length; orderIndex++) orderIdArray.push(sideArray[orderIndex].instanceId);

	var combat = context == null || context.combat == null
		? (honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat)
		: context.combat;
	var pairArray = [
		{ entity: entityA, fromRank: positionA, toRank: positionB },
		{ entity: entityB, fromRank: positionB, toRank: positionA },
	];
	for (var pairIndex = 0; pairIndex < pairArray.length; pairIndex++) {
		var pair = pairArray[pairIndex];
		honeycomb.logEvent(context, {
			type: "partyOrder",
			side: pair.entity.side == "enemy" ? "enemy" : "ally",
			movedId: pair.entity.instanceId,
			fromRank: pair.fromRank,
			toRank: pair.toRank,
			orderIdArray: orderIdArray,
			pace: options == null || options.pace == null ? null : options.pace,
		});
		var distance = Math.abs(pair.toRank - pair.fromRank);
		if (context != null && context.tally != null) context.tally.ranksMoved = (context.tally.ranksMoved == null ? 0 : context.tally.ranksMoved) + distance;
		var turnNumber = combat == null ? null : combat.turnNumber;
		if (pair.entity.movedTurnNumber !== turnNumber) { pair.entity.movedTurnNumber = turnNumber; pair.entity.ranksMovedThisTurn = 0; }
		pair.entity.ranksMovedThisTurn += distance;
		if (context != null) {
			honeycomb.fireEntityHooks("onShifted", { entity: pair.entity, fromRank: pair.fromRank, toRank: pair.toRank, distance: distance, context: context });
			if (pair.entity.side != "enemy") {
				honeycomb.fireRunHooks("onPartyShifted", { entity: pair.entity, fromRank: pair.fromRank, toRank: pair.toRank, distance: distance, context: context });
			}
		}
	}
	return true;
};

//WHERE PLAYING A CARD MOVES ITS OWNER. Most specific wins, the same order everything else resolves in:
//  1. the card's own `partyShift`
//  2. the member's loadout -- outfit, equipment, progression -- through `partyShiftByCardType`,
//     the last source to name one winning, as it does for cards
//  3. the character's own `partyShiftByCardType`
//  4. the card TYPE's default (Damage moves to the front; everything else stays put)
//`actor` is whoever the card acts as, which is what moves. The type asked about is the card's PRIMARY
//one, so a Damage-and-Support card moves like Damage.
honeycomb.cardPartyShift = function (card, actor) {
	if (card == null) return "none";
	if (card.partyShift != null) return card.partyShift;
	var typeIndex = honeycomb.cardType(card).index;

	if (actor != null && actor.characterIndex != null) {
		var modifierArray = honeycomb.memberCardModifierArray(actor);
		for (var modifierIndex = modifierArray.length - 1; modifierIndex >= 0; modifierIndex--) {
			var fromModifier = honeycomb.partyShiftForType(modifierArray[modifierIndex].modifier.partyShiftByCardType, typeIndex);
			if (fromModifier != null) return fromModifier;
		}
		var character = honeycomb.findDefinition(honeycomb.characterArray, actor.characterIndex);
		var fromCharacter = character == null ? null : honeycomb.partyShiftForType(character.partyShiftByCardType, typeIndex);
		if (fromCharacter != null) return fromCharacter;
	}

	var type = honeycomb.cardType(card);
	return type == null || type.partyShift == null ? "none" : type.partyShift;
};

//A `partyShiftByCardType` table's answer for a type, reading its keys through the round-04 renames so a
//table written as {offense: "back"} still means Damage.
honeycomb.partyShiftForType = function (table, typeIndex) {
	if (table == null) return null;
	for (var key in table) {
		if (Object.prototype.hasOwnProperty.call(table, key) && honeycomb.cardTypeAlias(key) == typeIndex) return table[key];
	}
	return null;
};

//---------------------------------------------------------------------------------------------------
//Owner-down policy
//---------------------------------------------------------------------------------------------------
//What happens to a card when the character who contributed it is out of the fight. A registry rather
//than a flag, because the interesting answers are not booleans: a card might be dead weight, might
//still work, might cycle itself away, or might belong to a character whose whole gimmick is acting
//after death.
//
//Resolution order for which policy a card uses: the card's own `ownerDownPolicy`, then the owning
//character's, then tuning.combat.defaultOwnerDownPolicy.
//
//  canPlay              may the card be played at all
//  ownerActsWhileDown   does the downed owner still count as the acting entity and a legal "owner"
//                       target -- the ghost case
//  effectArrayFor       optional replacement effect list, so a policy can change what the card DOES
//                       rather than just whether it may be played
//  describe             the reason shown on a card the player cannot play
honeycomb.ownerDownPolicyArray = [
	{
		index: "unplayable",
		name: "Unplayable",
		canPlay: function () { return false; },
		ownerActsWhileDown: false,
		describe: function (params) { return (params.ownerName || "Its owner") + " is down."; },
	},
	{
		index: "playable",
		name: "Playable",
		//Still plays, but the owner is gone: effects aimed at "owner" find the ownerless fallback.
		canPlay: function () { return true; },
		ownerActsWhileDown: false,
		describe: function () { return ""; },
	},
	{
		index: "haunt",
		name: "Haunt",
		//The ghost case. The downed owner remains the acting entity, so the card behaves normally --
		//including self-damage and self-buffs, which land on a character who is already down.
		canPlay: function () { return true; },
		ownerActsWhileDown: true,
		describe: function () { return ""; },
	},
	{
		index: "cycle",
		name: "Cycle",
		//Costs nothing and does nothing but replace itself, so a dead character's cards thin the hand
		//instead of clogging it.
		canPlay: function () { return true; },
		ownerActsWhileDown: false,
		effectArrayFor: function () {
			return [
				{ index: "drawCards", amount: honeycomb.tuning.combat.ownerDownCycleDraw },
				{ index: "exhaustSelf" },
			];
		},
		describe: function () { return "Cycles: draw a card instead."; },
	},
];

//The policy governing one card right now.
honeycomb.ownerDownPolicyFor = function (card) {
	var policyIndex = card == null ? null : card.ownerDownPolicy;
	if (policyIndex == null) {
		var definition = honeycomb.findDefinition(honeycomb.characterArray,
			card == null ? null : card.characterIndex);
		if (definition != null && definition.ownerDownPolicy != null) policyIndex = definition.ownerDownPolicy;
	}
	if (policyIndex == null) policyIndex = honeycomb.tuning.combat.defaultOwnerDownPolicy;
	return honeycomb.requireDefinition(honeycomb.ownerDownPolicyArray, policyIndex, "honeycomb.ownerDownPolicyArray");
};

//The entity that ACTS when a card is played: its owner if that owner can act, otherwise whatever the
//ownerless fallback names. This is the single answer to "who is casting this", and both the play path
//and the "owner" target mode read it, so a card's source and its self-targeting can never disagree.
//
//Draws no randomness on purpose. The card cost readout calls this while rendering a hand, and an RNG
//draw inside a render pass would advance a stream a different number of times depending on how often
//the screen repainted -- which would break determinism in the least findable way possible.
honeycomb.cardActingEntity = function (card, combat) {
	if (card == null || combat == null) return null;

	var member = honeycomb.cardOwnerMember(card);
	if (member != null) {
		if (member.downed != true) return member;
		var policy = honeycomb.ownerDownPolicyFor(card);
		if (policy != null && policy.ownerActsWhileDown == true) return member;
		//A downed owner does NOT fall through to the fallback: the card belongs to somebody, and
		//handing it to a bystander would silently rewrite whose card it is.
		return null;
	}

	switch (honeycomb.tuning.deck.ownerlessFallback) {
		case "frontAlly": return honeycomb.frontAlly(combat);
		case "backAlly": return honeycomb.backAlly(combat);
		case "none":
		default: return null;
	}
};

//Whether a card may be played right now, and why not when it may not. Returned as an object so the
//hand can grey a card and explain itself with one call.
honeycomb.cardPlayability = function (card, combat) {
	if (card == null) return { playable: false, reason: "unknownCard", explanation: "" };
	if (card.costArray == null) return { playable: false, reason: "unplayable", explanation: "Unplayable." };

	if (honeycomb.cardOwnerIsDown(card) == true) {
		var policy = honeycomb.ownerDownPolicyFor(card);
		var member = honeycomb.cardOwnerMember(card);
		var definition = honeycomb.findDefinition(honeycomb.characterArray, member == null ? null : member.characterIndex);
		var params = { card: card, owner: member, combat: combat, ownerName: definition == null ? null : definition.name };
		var explanation = policy.describe == null ? "" : policy.describe(params);
		if (policy.canPlay(params) == false) {
			return { playable: false, reason: "ownerDown", explanation: explanation };
		}
		return { playable: true, reason: null, explanation: explanation };
	}

	return { playable: true, reason: null, explanation: "" };
};

//The effect list a card resolves with, after any owner-down policy has had its say. Everything that
//plays a card goes through here rather than reading card.effectArray directly.
honeycomb.cardEffectArray = function (card, combat) {
	if (card == null) return [];
	if (honeycomb.cardOwnerIsDown(card) == true) {
		var policy = honeycomb.ownerDownPolicyFor(card);
		if (policy != null && policy.effectArrayFor != null) {
			return policy.effectArrayFor({ card: card, combat: combat });
		}
	}
	return card.effectArray;
};

//---------------------------------------------------------------------------------------------------
//Hook collection
//---------------------------------------------------------------------------------------------------
//Everything currently able to bend an outcome for one entity, in resolution order:
//  1. the entity's own statuses
//  2. that party member's LOADOUT -- outfit, equipment, progression nodes -- read from
//     honeycomb.memberCardModifierArray, the one list that already knows everything a member wears
//     or has bought (a ranked node appears once per rank, so its hook stacks)
//  3. run-wide relics, which apply to allies only
//Step 2 used to read equipment and outfit by hand and missed progression entirely, so every hook on
//a tree node (Paragon, Virulence, Deep Thirst) silently did nothing. Reading the shared list is what
//keeps a new kind of modifier from being missed again.
//Order matters and is deliberate: statuses are the most local and resolve first, relics the most
//global and resolve last, so a relic can react to what a status already did.
//
//includeRunWide exists because hooks come in two flavours, and conflating them double-counts relics.
//  PER-ENTITY hooks (modifyDamageDealt, modifyDamageTaken, modifyTemporaryHealthGained) run once per acting
//  entity, and a relic SHOULD apply to each ally's attacks -- so they pass true, the default.
//  PARTY-WIDE hooks (modifyEnergyPerTurn, modifyDrawPerTurn) produce one number for the whole team.
//  Folding those across three allies with relics included would apply each relic three times, so
//  those callers pass false per ally and then apply the run-wide sources exactly once.
honeycomb.hookSourceArray = function (entity, includeRunWide) {
	var result = [];
	if (entity == null) return result;

	var statusArray = entity.statusArray == null ? [] : entity.statusArray;
	var statusSourceArray = [];
	for (var statusIndex = 0; statusIndex < statusArray.length; statusIndex++) {
		var statusDefinition = honeycomb.findDefinition(honeycomb.statusArray, statusArray[statusIndex].index);
		if (statusDefinition == null || statusDefinition.hooks == null) continue;
		statusSourceArray.push({ hooks: statusDefinition.hooks, stacks: statusArray[statusIndex].stacks, definition: statusDefinition, kind: "status", order: statusIndex });
	}
	//A status may ask to be heard AFTER others (`hookOrder`, default 0): Intoxicated reads the Poison left
	//once Poison has ticked, whichever of the two landed first. A stable sort, so equal orders keep the
	//order they were applied in.
	statusSourceArray.sort(function (left, right) {
		var leftOrder = left.definition.hookOrder == null ? 0 : left.definition.hookOrder;
		var rightOrder = right.definition.hookOrder == null ? 0 : right.definition.hookOrder;
		return leftOrder !== rightOrder ? leftOrder - rightOrder : left.order - right.order;
	});
	for (var sortedIndex = 0; sortedIndex < statusSourceArray.length; sortedIndex++) result.push(statusSourceArray[sortedIndex]);

	//A character's own MECHANIC: Brienne's Resolve counting the gold she gains is a hook like any other,
	//so it is heard wherever a status would be -- but ONLY once Ability 1 is bought. A character with no
	//abilities builds no meter.
	var mechanic = honeycomb.mechanicFor(entity);
	if (mechanic != null && mechanic.hooks != null && honeycomb.mechanicActive(entity) == true) {
		result.push({ hooks: mechanic.hooks, stacks: honeycomb.mechanicValue(entity, mechanic.index), definition: mechanic, kind: "mechanic" });
	}

	//A character's LOADOUT -- outfit, equipment, progression -- is part of who they are, on whichever team
	//they fight. A combat entity for a character carries its own loadout fields.
	if (entity.characterIndex != null) {
		var modifierArray = honeycomb.memberCardModifierArray(entity);
		for (var modifierIndex = 0; modifierIndex < modifierArray.length; modifierIndex++) {
			var modifier = modifierArray[modifierIndex].modifier;
			if (modifier == null || modifier.hooks == null) continue;
			result.push({ hooks: modifier.hooks, stacks: 1, definition: modifier, kind: modifierArray[modifierIndex].source.kind });
		}
	}

	//Relics belong to the party, so only the party's team hears them.
	if (entity.side == "ally" && includeRunWide != false) {
		var runSourceArray = honeycomb.runHookSourceArray();
		for (var runIndex = 0; runIndex < runSourceArray.length; runIndex++) result.push(runSourceArray[runIndex]);
	}

	return result;
};

//Run-wide hook sources: relics, which belong to the party rather than to any one member.
honeycomb.runHookSourceArray = function () {
	var result = [];
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return result;
	for (var relicIndex = 0; relicIndex < run.relicArray.length; relicIndex++) {
		var relic = honeycomb.findDefinition(honeycomb.relicArray, run.relicArray[relicIndex].index);
		if (relic == null || relic.hooks == null) continue;
		result.push({ hooks: relic.hooks, stacks: run.relicArray[relicIndex].counter, definition: relic, kind: "relic" });
	}
	return result;
};

//Folds a value through every hook that wants to modify it.
//params.includeRunWide is passed through to hookSourceArray; see the note there on why party-wide
//hooks must exclude relics and apply them separately.
honeycomb.applyStatusHooks = function (hookIndex, value, params) {
	var sourceArray = honeycomb.hookSourceArray(params.entity, params.includeRunWide);
	var running = value;
	for (var sourceIndex = 0; sourceIndex < sourceArray.length; sourceIndex++) {
		var source = sourceArray[sourceIndex];
		var hook = source.hooks[hookIndex];
		if (typeof hook !== "function") continue;
		params.stacks = source.stacks;
		params.definition = source.definition;
		var returned = hook(running, params);
		if (typeof returned === "number") running = returned;
	}
	return running;
};

//THE THIRD SHAPE OF HOOK: one that ANSWERS. Value hooks fold and event hooks act; a few questions
//need neither -- "does anything want to reroute this?" has one answer or none. The first source to
//return something other than null or undefined wins, in the same resolution order as everything else
//(statuses, mechanic, loadout, relics), so the most local modifier gets first say.
honeycomb.firstHookAnswer = function (hookIndex, params) {
	var sourceArray = honeycomb.hookSourceArray(params.entity, params.includeRunWide);
	for (var sourceIndex = 0; sourceIndex < sourceArray.length; sourceIndex++) {
		var source = sourceArray[sourceIndex];
		var hook = source.hooks[hookIndex];
		if (typeof hook !== "function") continue;
		params.stacks = source.stacks;
		params.definition = source.definition;
		var answer = hook(params);
		if (answer != null) return answer;
	}
	return null;
};

//---------------------------------------------------------------------------------------------------
//Reactions: statuses whose hooks are EFFECT LISTS
//---------------------------------------------------------------------------------------------------
//Most Passive cards are "whenever X, do Y". Rather than a bespoke hook function per status, a status may
//build its hooks from a table: `hooks: honeycomb.reactionHooks([{ hook, ... }])`. Each reaction:
//  hook          the event, entity or world ("onTurnStart", "onAllyHealthLost", "onEnemyHealthLost", ...)
//  subject       whom the event must be about, relative to the HOLDER: "holder" | "ally" (any on the
//                holder's side) | "otherAlly" | "enemy" | null (anyone)
//  eventSource   who must have CAUSED it: "holder" | "ally" | "otherAlly" | null (anyone)
//  excludeDamageTypeArray  damage types that never trigger it (poison, so a tick cannot feed itself)
//  debuffOnly    on a status event, only a debuff landing counts
//  condition     tested with the holder as source and the subject as target
//  limitPerTurn  how often it may fire in one turn (null: unlimited)
//  targetMode    where the effects land: "holder" (default), "subject", "eventSource", or any target mode
//  perStack      repeat the effects once per stack held
//  effectArray   what happens. The event's amount is readable as {index: "tally", key: "eventAmount"}.
//  whileDowned   true: fires even though the holder is down (for "onDeath" on the one dying)
//A reaction never re-enters itself: an effect that raises the same event is ignored while it resolves.
honeycomb.reactionHooks = function (reactionArray) {
	var hooks = {};
	var byHook = {};
	for (var reactionIndex = 0; reactionIndex < reactionArray.length; reactionIndex++) {
		var reaction = reactionArray[reactionIndex];
		if (byHook[reaction.hook] == null) byHook[reaction.hook] = [];
		byHook[reaction.hook].push(reaction);
	}
	Object.keys(byHook).forEach(function (hookIndex) {
		hooks[hookIndex] = function (params) {
			for (var entryIndex = 0; entryIndex < byHook[hookIndex].length; entryIndex++) {
				honeycomb.runReaction(byHook[hookIndex][entryIndex], params);
			}
		};
	});
	return hooks;
};

//Whether `entity` stands in `relation` to `holder` ("holder", "ally", "otherAlly", "enemy"; null is anyone).
honeycomb.reactionRelationHolds = function (relation, entity, holder) {
	if (relation == null) return true;
	if (entity == null || holder == null) return false;
	if (relation == "holder") return entity === holder;
	if (relation == "ally") return entity.side == holder.side;
	if (relation == "otherAlly") return entity.side == holder.side && entity !== holder;
	if (relation == "enemy") return entity.side != holder.side;
	return false;
};

honeycomb.runReaction = function (reaction, params) {
	var holder = params.wearer != null ? params.wearer : params.entity;
	//`whileDowned: true` lets a reaction answer its holder's own death (a Sporeling bursting as it falls).
	if (holder == null || (holder.downed == true && reaction.whileDowned != true)) return;
	var combat = params.context == null ? null : params.context.combat;
	if (combat == null) return;
	var subject = params.entity;
	if (!honeycomb.reactionRelationHolds(reaction.subject, subject, holder)) return;
	if (reaction.eventSource != null && !honeycomb.reactionRelationHolds(reaction.eventSource, params.source, holder)) return;
	//`debuffOnly`: a status event counts only when the status landing is a debuff.
	if (reaction.debuffOnly == true) {
		var landed = honeycomb.findDefinition(honeycomb.statusArray, params.statusIndex);
		if (landed == null || landed.isDebuff != true) return;
	}
	var damageType = params.entry == null ? null : params.entry.damageType;
	if (reaction.excludeDamageTypeArray != null && damageType != null && reaction.excludeDamageTypeArray.indexOf(damageType) >= 0) return;
	var key = params.definition == null ? reaction.hook : params.definition.index + ":" + reaction.hook;
	if (holder.reactionResolvingMap == null) holder.reactionResolvingMap = {};
	if (holder.reactionResolvingMap[key] == true) return;
	if (reaction.limitPerTurn != null) {
		if (holder.reactionCountMap == null) holder.reactionCountMap = {};
		var counted = holder.reactionCountMap[key];
		if (counted == null || counted.turn != combat.turnNumber) counted = holder.reactionCountMap[key] = { turn: combat.turnNumber, count: 0 };
		if (counted.count >= reaction.limitPerTurn) return;
		counted.count += 1;
	}
	var context = honeycomb.newEffectContext({ source: holder, target: subject, combat: combat,
		log: params.context == null ? null : params.context.log, depth: params.context == null ? 0 : params.context.depth + 1 });
	context.tally.eventAmount = params.amount == null ? 0 : params.amount;
	if (reaction.condition != null && honeycomb.testCondition(reaction.condition, context) == false) return;
	var mode = reaction.targetMode == null ? "holder" : reaction.targetMode;
	var targetArray;
	if (mode == "holder") targetArray = [holder];
	else if (mode == "subject") targetArray = subject == null ? [] : [subject];
	else if (mode == "eventSource") targetArray = params.source == null ? [] : [params.source];
	else targetArray = honeycomb.resolveTargetMode(mode, context);
	context.targetArray = targetArray.filter(function (entity) { return entity != null && entity.downed != true; });
	context.target = context.targetArray.length > 0 ? context.targetArray[0] : null;
	if (context.targetArray.length == 0) return;
	var times = reaction.perStack == true && params.stacks != null ? params.stacks : 1;
	holder.reactionResolvingMap[key] = true;
	for (var timeIndex = 0; timeIndex < times; timeIndex++) honeycomb.resolveEffectArray(reaction.effectArray, context);
	holder.reactionResolvingMap[key] = false;
};

//Fires an event hook that returns nothing. Sources act by resolving effects into params.context.
honeycomb.fireEntityHooks = function (hookIndex, params) {
	var sourceArray = honeycomb.hookSourceArray(params.entity);
	for (var sourceIndex = 0; sourceIndex < sourceArray.length; sourceIndex++) {
		var source = sourceArray[sourceIndex];
		var hook = source.hooks[hookIndex];
		if (typeof hook !== "function") continue;
		params.stacks = source.stacks;
		params.definition = source.definition;
		hook(params);
	}
};

//Folds a value through run-wide sources only, exactly once. The companion to passing
//includeRunWide:false when gathering a party-wide number.
honeycomb.applyRunHooks = function (hookIndex, value, params) {
	var sourceArray = honeycomb.runHookSourceArray();
	var running = value;
	for (var sourceIndex = 0; sourceIndex < sourceArray.length; sourceIndex++) {
		var hook = sourceArray[sourceIndex].hooks[hookIndex];
		if (typeof hook !== "function") continue;
		params.stacks = sourceArray[sourceIndex].stacks;
		params.definition = sourceArray[sourceIndex].definition;
		var returned = hook(running, params);
		if (typeof returned === "number") running = returned;
	}
	return running;
};

//Fires an event hook for things that happen TO the world rather than to one entity -- an enemy dying,
//a node being entered -- which no single entity owns. Relics hear it, and so does whatever each
//standing party member WEARS (outfit, equipment, tree nodes): an heirloom like the Crimson Fang is
//one character's, but reacts to an enemy falling exactly as the relic it used to be did. For those,
//`params.wearer` is the member wearing it. A downed member's gear is silent.
honeycomb.fireRunHooks = function (hookIndex, params) {
	var sourceArray = honeycomb.runHookSourceArray();
	for (var sourceIndex = 0; sourceIndex < sourceArray.length; sourceIndex++) {
		var hook = sourceArray[sourceIndex].hooks[hookIndex];
		if (typeof hook !== "function") continue;
		params.stacks = sourceArray[sourceIndex].stacks;
		params.definition = sourceArray[sourceIndex].definition;
		params.wearer = null;
		hook(params);
	}

	var run = honeycomb.state == null ? null : honeycomb.state.run;
	var partyArray = run == null ? [] : run.partyArray;
	for (var memberIndex = 0; memberIndex < partyArray.length; memberIndex++) {
		var member = partyArray[memberIndex];
		if (member.downed == true) continue;
		//A status a member holds hears world events too: a Passive card's lasting effect is a status, and
		//Pandemic has to hear an enemy fall. `wearer` is the member holding it.
		var heldStatusArray = member.statusArray == null ? [] : member.statusArray.slice();
		for (var heldIndex = 0; heldIndex < heldStatusArray.length; heldIndex++) {
			var heldDefinition = honeycomb.findDefinition(honeycomb.statusArray, heldStatusArray[heldIndex].index);
			var heldHook = heldDefinition == null || heldDefinition.hooks == null ? null : heldDefinition.hooks[hookIndex];
			if (typeof heldHook !== "function") continue;
			params.stacks = heldStatusArray[heldIndex].stacks;
			params.definition = heldDefinition;
			params.wearer = member;
			heldHook(params);
		}
		//A character's own mechanic hears world events too: Nettle's Harvest counts enemies falling, and
		//that is not something any one entity owns. `wearer` is whose mechanic it is.
		var mechanic = honeycomb.mechanicFor(member);
		var mechanicHook = mechanic == null || mechanic.hooks == null ? null : mechanic.hooks[hookIndex];
		if (typeof mechanicHook === "function") {
			params.stacks = honeycomb.mechanicValue(member, mechanic.index);
			params.definition = mechanic;
			params.wearer = member;
			mechanicHook(params);
		}
		var modifierArray = honeycomb.memberCardModifierArray(member);
		for (var modifierIndex = 0; modifierIndex < modifierArray.length; modifierIndex++) {
			var modifier = modifierArray[modifierIndex].modifier;
			var wornHook = modifier == null || modifier.hooks == null ? null : modifier.hooks[hookIndex];
			if (typeof wornHook !== "function") continue;
			params.stacks = 1;
			params.definition = modifier;
			params.wearer = member;
			wornHook(params);
		}
	}
};

//Fires a hook across every living entity in a fight. Used for turn boundaries.
honeycomb.fireCombatHooks = function (hookIndex, context, side) {
	var entityArray = honeycomb.livingEntityArray(side == null ? "both" : side, context.combat);
	for (var entityIndex = 0; entityIndex < entityArray.length; entityIndex++) {
		honeycomb.fireEntityHooks(hookIndex, { entity: entityArray[entityIndex], context: context });
	}
};

//---------------------------------------------------------------------------------------------------
//Party-size scaling
//---------------------------------------------------------------------------------------------------
//Stat multipliers only, no count scaling: encounters are balanced around a party of 3, not around
//an enemy count that shifts with party size. The shipped party is 3, and a fight here is a fight there;
//a debug six-slot party fields the same line-up. The stat seams stay, at a zero rate by default, so a
//future difficulty curve has one quantity to move rather than a scattering of raw numbers.
//
//Everything derives from ONE quantity -- how far the party is from tuning.scaling.baselinePartySize --
//and each dimension has its own per-member rate, so enemy health and enemy damage can be tuned apart.
//
//Party size is counted at the moment it is asked for, INCLUDING downed members: a party of six that
//has lost two is still a party of six that built for six, and shrinking the fight as they lose would
//reward losing.
honeycomb.scaling = {};

//Counts the party the encounter was sized against. Allies SUMMONED for the duration of one fight do
//not count: the fight was built before they arrived, and letting them count would mean summoning an
//ally instantly made every enemy hit harder.
honeycomb.scaling.partySize = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return honeycomb.tuning.scaling.baselinePartySize;
	var count = 0;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		if (run.partyArray[memberIndex].temporary == true) continue;
		count += 1;
	}
	return count;
};

//Members beyond the baseline. Negative for a party smaller than the baseline, which is what makes a
//solo run easier rather than only making a large one harder.
honeycomb.scaling.extraMemberCount = function () {
	return honeycomb.scaling.partySize() - honeycomb.tuning.scaling.baselinePartySize;
};

//A multiplier of the form 1 + rate * extraMembers, floored so no rate can drive a value to nothing.
honeycomb.scaling.multiplier = function (ratePerMember) {
	var value = 1 + (ratePerMember * honeycomb.scaling.extraMemberCount());
	return Math.max(honeycomb.tuning.scaling.minimumMultiplier, value);
};

honeycomb.scaling.enemyHealthMultiplier = function () {
	return honeycomb.scaling.multiplier(honeycomb.tuning.scaling.enemyHealthPerExtraMember);
};

honeycomb.scaling.enemyDamageMultiplier = function () {
	return honeycomb.scaling.multiplier(honeycomb.tuning.scaling.enemyDamagePerExtraMember);
};

honeycomb.scaling.goldMultiplier = function () {
	return honeycomb.scaling.multiplier(honeycomb.tuning.scaling.goldPerExtraMember);
};

//---------------------------------------------------------------------------------------------------
//Damage
//---------------------------------------------------------------------------------------------------
//The single damage pipeline. Every attack, thorn, poison tick and self-inflicted wound passes through
//it, in this order:
//  0. self-damage replacement, if the source is also the target and something wants to reroute it
//  1. the source's outgoing modifiers  (Strength, Weak, relics)
//  2. the target's incoming modifiers  (Sundered, armour)
//  3. the damage floor
//  4. temporary health, unless the entry says to ignore it
//  5. health
//  6. the target's onDamaged hooks, then a break-or-death check
honeycomb.dealDamage = function (source, target, baseAmount, entry, context) {
	if (target == null || target.downed == true) return 0;
	var settings = entry == null ? {} : entry;

	//FIRST-HIT TAUNT is SPENT by the hit it drew: the combat object marks it, so later attacks ignore her.
	if (context != null && context.combat != null && target.side == "ally" && source != null && source.side == "enemy" &&
		honeycomb.characterFieldFlag(target.characterIndex, "firstHitTaunt") == true) {
		target.firstHitTauntCombat = context.combat;
	}

	//SELF-DAMAGE (Crimson Covenant doubles it; tree node "Thin Skin" takes a flat 1 off). One helper, so
	//the card text that previews a self-cost and the cost itself cannot disagree.
	if (source != null && source === target && typeof baseAmount === "number") {
		baseAmount = honeycomb.selfDamageAmount(target, baseAmount);
	}

	//SELF-DAMAGE MAY BE REROUTED. Severine's Night Court outfit turns every cost she pays in blood into a
	//cost she pays in lust instead, which is a loadout hook rather than a rewrite of her cards -- so
	//the same Blood Pact reads differently depending on what she is wearing. The hook returns a
	//replacement descriptor or null to let the damage through; see honeycomb.selfDamageReplacement.
	if (source != null && source === target && settings.noSelfReplacement != true
		&& honeycomb.entityUsesLust(target) == true) {
		var replacement = honeycomb.selfDamageReplacement(target, baseAmount, settings, context);
		//A blood price paid by somebody else: the answer names a teammate, and the price lands on them as
		//an ordinary hit their Temporary HP can soak. Not rerouted again.
		if (replacement != null && replacement.redirectTo != null && replacement.redirectTo !== target) {
			var redirected = {};
			for (var settingKey in settings) {
				if (Object.prototype.hasOwnProperty.call(settings, settingKey)) redirected[settingKey] = settings[settingKey];
			}
			redirected.noSelfReplacement = true;
			redirected.ignoreTemporary = false;
			return honeycomb.dealDamage(source, replacement.redirectTo, baseAmount, redirected, context);
		}
		if (replacement != null) {
			if (replacement.lust > 0) {
				honeycomb.gainLust(target, replacement.lust,
					{ source: source, entry: settings, tagArray: replacement.tagArray }, context);
			}
			return 0;
		}
	}

	//The taunt takes everything: redirecting happens at the moment damage lands, not only at target
	//selection (honeycomb.tauntFilteredArray) -- `wholeTeam` modes skip that filter by design, so
	//redirecting here is the only way a wall can stand in front of an area attack too.
	//
	//Only an OPPOSING hit is redirected: a teammate's Blood Price, a self-cost and a poison tick belong
	//to whoever is carrying them. `taunted` stops the redirected hit being redirected again, which would
	//be a loop the first time two taunters stood together.
	if (settings.taunted != true && settings.lifeLoss != true && source != null && target != null &&
		source.side != target.side && context != null && context.combat != null) {
		var wall = honeycomb.tauntWallFor(target, context);
		if (wall != null && wall !== target) {
			var taunted = {};
			for (var tauntKey in settings) {
				if (Object.prototype.hasOwnProperty.call(settings, tauntKey)) taunted[tauntKey] = settings[tauntKey];
			}
			taunted.taunted = true;
			honeycomb.logEvent(context, { type: "taunted", targetId: wall.instanceId, fromId: target.instanceId });
			return honeycomb.dealDamage(source, wall, baseAmount, taunted, context);
		}
	}

	var amount = honeycomb.modifiedDamage(source, target, baseAmount, settings, context);

	var absorbedAmount = 0;
	//SIEGEPLATE: Temporary HP soaks an attack only once base health is gone. Health takes the hit first;
	//whatever is left over is what the tHP absorbs.
	var temporaryLast = settings.ignoreTemporary != true && target.temporaryHealth > 0 && source != null && source !== target &&
		target.characterIndex != null && honeycomb.memberLoadoutFlag(target, "temporaryAbsorbsLast") == true;
	if (temporaryLast) {
		var healthTaken = Math.min(Math.max(0, target.health), amount);
		absorbedAmount = Math.min(target.temporaryHealth, amount - healthTaken);
		target.temporaryHealth -= absorbedAmount;
		amount = healthTaken;
	} else if (settings.ignoreTemporary != true && target.temporaryHealth > 0) {
		absorbedAmount = Math.min(target.temporaryHealth, amount);
		target.temporaryHealth -= absorbedAmount;
		amount -= absorbedAmount;
	}

	if (amount > 0) target.health -= amount;
	//Every time a fighter loses health is counted for the fight (Headstrong's cost reads it).
	if (amount > 0 && context != null && context.combat != null) honeycomb.noteHealthLoss(target, context.combat);
	if (target.health < 0) target.health = 0;
	//What each fighter has dealt THIS TURN, kept on the dealer. Read by Severine's Thirst and available to
	//any later condition that wants "has acted"; reset at the start of that fighter's own turn.
	if (source != null && amount + absorbedAmount > 0) {
		source.damageDealtThisTurn = (source.damageDealtThisTurn == null ? 0 : source.damageDealtThisTurn) + amount + absorbedAmount;
	}

	honeycomb.logEvent(context, {
		type: "damage",
		sourceId: source == null ? null : source.instanceId,
		targetId: target.instanceId,
		amount: amount,
		absorbed: absorbedAmount,
		ignoredTemporary: settings.ignoreTemporary == true,
		//What kind of damage: poison, thorns and the broken spiral come from a hook rather than from a
		//card, so `via` is null for them and this is the only thing that can name what is about to
		//happen. The bar's tooltip reads it; so does the battle log.
		damageType: settings.damageType == null ? null : settings.damageType,
		//The attack's effect may name its own VFX, or "none" to opt out; the presentation falls back
		//to tuning's default attack effect when this is null.
		vfx: settings.vfx == null ? null : settings.vfx,
	});

	//Blood spilled: everything the party took this turn, gold included, for Sanguine Tide.
	if (target.side == "ally" && context != null && context.combat != null && amount + absorbedAmount > 0) {
		context.combat.partyDamageTakenThisTurn = (context.combat.partyDamageTakenThisTurn == null ? 0 : context.combat.partyDamageTakenThisTurn) + amount + absorbedAmount;
	}
	//And the mirror: what the OTHER side took, for anything that pays off the beating the party handed
	//out. Counted on the target rather than on `damageDealtThisTurn` of each ally, which also counts a
	//price paid at home -- the Infernal King halving its own board would otherwise be "damage dealt this
	//turn" and echo back at the enemies twice over.
	//
	//An echo is not an action. `settings.echoed` marks damage that is itself a payout of this counter, and
	//such damage does not feed it, or Anastasia's two Kings would echo the same turn's damage back and
	//forth. Anything paying out of a turn's damage should set it.
	if (target.side == "enemy" && settings.echoed != true && context != null && context.combat != null && amount + absorbedAmount > 0) {
		context.combat.enemyDamageTakenThisTurn = (context.combat.enemyDamageTakenThisTurn == null ? 0 : context.combat.enemyDamageTakenThisTurn) + amount + absorbedAmount;
	}
	//Temporary HP taking a hit is its own event: Retort and the Oathbound Banner answer it.
	if (absorbedAmount > 0) {
		honeycomb.fireEntityHooks("onTemporaryAbsorbed", { entity: target, source: source, amount: absorbedAmount, entry: settings, context: context });
	}
	if (amount > 0) {
		honeycomb.fireEntityHooks("onDamaged", { entity: target, source: source, amount: amount, absorbed: absorbedAmount, entry: settings, context: context });
		//A party member losing health is a world event as well: Hemomancy and Blood for Blood, worn as
		//statuses, hear it through the run hooks.
		if (target.side == "ally") {
			honeycomb.fireRunHooks("onAllyHealthLost", { entity: target, source: source, amount: amount, entry: settings, context: context });
		} else {
			honeycomb.fireRunHooks("onEnemyHealthLost", { entity: target, source: source, amount: amount, entry: settings, context: context });
		}
	}
	if (amount + absorbedAmount > 0) {
		honeycomb.fireEntityHooks("onStruck", { entity: target, source: source, amount: amount + absorbedAmount, lost: amount,
			absorbed: absorbedAmount, entry: settings, context: context });
	}
	//Losing health can break somebody, not only gaining lust: the test is a comparison, so moving either
	//side of it has to re-run. This is the second road to Broken -- an enemy can push a character into it
	//without ever touching their lust.
	honeycomb.checkBreak(target, context);
	honeycomb.checkDeath(target, context);
	//The half-health moment runs after the break and death checks, so a wound that takes them all the way
	//to Broken or down does not also open a second cut-in on top of it.
	honeycomb.checkHalfHealthCutIn(target, context);
	return amount;
};

//The self-damage reroute, resolved through the hook layer so an outfit, a relic, a status or a
//progression node can all reach it. Returns {lust} or null to let the damage through.
honeycomb.selfDamageReplacement = function (entity, baseAmount, entry, context) {
	return honeycomb.firstHookAnswer("replaceSelfDamage",
		{ entity: entity, amount: baseAmount, entry: entry, context: context });
};

//Steps 1 to 3 of the pipeline above, on their own: a printed number turned into what would reach
//temporary health. SHARED by the real hit and by every preview of one -- a card's live number, an intent's
//telegraph -- so what a card says it will do can never disagree with what it does. `target` may be
//null for a preview with nobody picked yet, which applies the source's modifiers only.
honeycomb.modifiedDamage = function (source, target, baseAmount, entry, context) {
	var settings = entry == null ? {} : entry;
	var amount = baseAmount;
	//LOST LIFE is a price, not an attack: no Strength, Weak, Sundered or relic touches it.
	if (settings.lifeLoss == true) return Math.max(0, Math.floor(amount));
	if (source != null) {
		//MARSHAL: another party member's loadout adds to this fighter's attacks. Attacks only, like Strength.
		if (source.side == "ally" && settings.ignoresStrength != true) amount += honeycomb.allyAttackBonus(source);
		amount = honeycomb.applyStatusHooks("modifyDamageDealt", amount,
			{ entity: source, target: target, context: context, entry: settings });
		//Party-size scaling applies to enemy damage only, and AFTER the source's own modifiers so that
		//it scales the whole attack rather than only its printed number. Not expressed as a hook,
		//because hooks hang off entities and this belongs to the encounter.
		if (source.side == "enemy") amount = amount * honeycomb.scaling.enemyDamageMultiplier();
	}
	if (target != null) {
		amount = honeycomb.applyStatusHooks("modifyDamageTaken", amount,
			{ entity: target, source: source, context: context, entry: settings });
		//The party's relics reach the other team: a relic only hangs off the party, so one that changes
		//what an ENEMY takes (the Cracked Ampoule) is asked here, once, by name.
		if (target.side == "enemy") {
			amount = honeycomb.applyRunHooks("modifyOpponentDamageTaken", amount,
				{ entity: target, source: source, context: context, entry: settings });
		}
	}
	amount = Math.floor(amount);
	if (amount < honeycomb.tuning.combat.damageMinimum) amount = honeycomb.tuning.combat.damageMinimum;
	return amount;
};

//The sum of `allyAttackBonus` on every OTHER living party member's loadout (Marshal: "ally attacks deal +1").
honeycomb.allyAttackBonus = function (source) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || run.partyArray == null || source == null) return 0;
	var total = 0;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		var member = run.partyArray[memberIndex];
		if (member === source || member.downed == true || member.instanceId === source.instanceId) continue;
		total += honeycomb.memberFieldTotal(member, "allyAttackBonus");
	}
	return total;
};

//The same for temporary health: what a printed amount becomes once whoever gains it has had their
//say (Frail).
honeycomb.modifiedTemporary = function (target, baseAmount, context) {
	if (target == null) return baseAmount;
	return honeycomb.applyStatusHooks("modifyTemporaryHealthGained", baseAmount, { entity: target, context: context });
};

//TEMPORARY HP IS NOT HEALING. It sits past the end of the health fill rather than raising it, so a
//character at 40/100 who gains 20 tHP still has 40 base health. Granting it is therefore never wasted on
//a full-health target, which is what separates it from a heal.
honeycomb.grantTemporaryHealth = function (target, baseAmount, context) {
	if (target == null || target.downed == true) return 0;
	var granted = Math.floor(honeycomb.modifiedTemporary(target, baseAmount, context));
	if (granted <= 0) return 0;
	if (target.temporaryHealth == null) target.temporaryHealth = 0;
	target.temporaryHealth += granted;
	var ceilingFraction = honeycomb.tuning.combat.temporaryHealthMaximumFraction;
	if (ceilingFraction != null) {
		var ceiling = Math.floor(target.maxHealth * ceilingFraction);
		if (target.temporaryHealth > ceiling) {
			granted -= target.temporaryHealth - ceiling;
			target.temporaryHealth = ceiling;
		}
	}
	if (granted <= 0) return 0;
	honeycomb.logEvent(context, { type: "temporaryHealth", targetId: target.instanceId, amount: granted });
	//Temporary health ARRIVING is its own event, the way damage taken is: Brienne's Resolve counts it.
	honeycomb.fireEntityHooks("onTemporaryHealthGained", { entity: target, amount: granted, context: context });
	//...and a world event as well: Clemence's Devotion counts tHP she GIVES, and Blessing hears any
	//ally's gold arrive. `source` is whoever granted it.
	if (target.side == "ally") honeycomb.fireRunHooks("onAllyTemporaryGained", { entity: target, amount: granted,
		source: context == null ? null : context.source, context: context });
	//More standing between lust and health can un-break somebody on the spot.
	honeycomb.checkRecovery(target, context);
	return granted;
};

//Halving, not wiping. Rounding is named in tuning because "down" is what lets the last point go and
//"up" leaves a permanent 1 on the bar, which reads as a bug rather than a rule.
//The share of an entity's Temporary HP its next halving takes, after every hook: Entrenched and the
//Bastion slow it. The real decay and the tooltip both read this.
honeycomb.temporaryDecayFraction = function (entity, context) {
	var fraction = honeycomb.applyStatusHooks("modifyTemporaryDecayFraction", honeycomb.tuning.combat.temporaryHealthDecayFraction,
		{ entity: entity, context: context });
	return Math.max(0, Math.min(1, fraction));
};

//`fraction` is what is lost, when something has changed it; omitted, tuning's.
honeycomb.decayedTemporaryHealth = function (standing, fraction) {
	var lost = fraction == null ? honeycomb.tuning.combat.temporaryHealthDecayFraction : fraction;
	var kept = standing * (1 - lost);
	return honeycomb.tuning.combat.temporaryHealthDecayRounding == "up" ? Math.ceil(kept) : Math.floor(kept);
};

//`options.overflowToTemporary` sends healing past maximum health into Temporary HP (Vital Flow).
//Overflow of any kind is also an event, `onOverheal`, so a status can do the same for every heal (Gorged).
honeycomb.healEntity = function (target, amount, context, options) {
	if (target == null) return 0;
	//A downed ally is not brought back by ordinary healing; a revive effect sets downed to false
	//itself, which keeps "heal" from quietly becoming the strongest card in the game.
	if (target.downed == true) return 0;
	var settings = options == null ? {} : options;
	//HEALING RECEIVED can be scaled by the loadout (Crimson Covenant doubles it).
	if (target.characterIndex != null && settings.unscaled != true) amount = amount * honeycomb.memberFieldProduct(target, "healingReceivedMultiplier");
	//And by a status: Frail cuts healing as well as Temporary HP, folded here, the one door every heal
	//passes through, so a status, an outfit or a relic can all reach it. `unscaled` skips both, which is
	//what a revive uses.
	if (settings.unscaled != true) {
		amount = honeycomb.applyStatusHooks("modifyHealingReceived", amount,
			{ entity: target, source: context == null ? null : context.source, context: context, entry: settings });
	}
	//BLOOD SAINT: healing she gives HERSELF is split evenly across the living party. The split heals are
	//marked so they are not split again; any remainder stays with her.
	if (settings.split != true && context != null && context.source === target && context.combat != null &&
		target.characterIndex != null && honeycomb.memberLoadoutFlag(target, "selfHealingSplit") == true) {
		var partyArray = honeycomb.livingEntityArray(target.side == null ? "ally" : target.side, context.combat);
		if (partyArray.length > 1) {
			var total = Math.max(0, Math.floor(amount));
			var share = Math.floor(total / partyArray.length);
			var ownHealed = 0;
			for (var shareIndex = 0; shareIndex < partyArray.length; shareIndex++) {
				var portion = share + (partyArray[shareIndex] === target ? total - share * partyArray.length : 0);
				var landed = honeycomb.healEntity(partyArray[shareIndex], portion, context, { split: true, unscaled: true, overflowToTemporary: settings.overflowToTemporary });
				if (partyArray[shareIndex] === target) ownHealed = landed;
			}
			return ownHealed;
		}
	}
	var whole = Math.max(0, Math.floor(amount));
	var healed = Math.max(0, Math.min(whole, target.maxHealth - target.health));
	var overflow = whole - healed;
	if (healed > 0) {
		target.health += healed;
		honeycomb.logEvent(context, { type: "heal", targetId: target.instanceId, amount: healed });
		if (target.side == "ally") honeycomb.fireRunHooks("onAllyHealed", { entity: target, amount: healed, context: context });
		//SOOTHING (Cinder): a rest-site heal removes Lust equal to the health it restored. A party member
		//outside a fight has no `side` stamped, so null reads as an ally.
		if ((target.side == null || target.side == "ally") && honeycomb.rest != null && honeycomb.rest.active == true &&
			honeycomb.characterFieldFlag(target.characterIndex, "restSoothe") == true) {
			honeycomb.reduceLust(target, healed, context);
		}
	}
	if (overflow > 0) {
		//OVERFLOW (tree node "Overflow"): this character's excess healing becomes Temporary HP.
		var toTemporary = (options != null && options.overflowToTemporary == true) ||
			honeycomb.characterFieldFlag(target.characterIndex, "healOverflowToTemporary") == true;
		if (toTemporary) honeycomb.grantTemporaryHealth(target, overflow, context);
		honeycomb.fireEntityHooks("onOverheal", { entity: target, amount: overflow, context: context });
	}
	if (healed <= 0) return 0;
	//Healing is one of the two ways out of the Broken state -- the other is reducing lust -- so every
	//heal has to re-ask the question.
	honeycomb.checkRecovery(target, context);
	return healed;
};

//---------------------------------------------------------------------------------------------------
//Lust and the Broken state
//---------------------------------------------------------------------------------------------------
//Lust is a second bar drawn on the first. It builds, it can pass maximum health, and the moment it
//reaches whatever health its holder has standing -- base plus temporary -- they BREAK: still on the
//field, still holding cards, but every card they hold is swapped for their one broken card.
//
//This is the player's failure state. Enemies take lust too, but for them breaking is simply being
//beaten; see entityBreakBehavior.

//Whether a combatant takes lust at all: everyone does, unless their definition says `lustImmune: true`
//(or the older `usesLust: false`).
//Read from the DEFINITION, never from the team. See CATCH-UP, "TEAMS ARE NOT KINDS".
honeycomb.entityUsesLust = function (entity) {
	if (entity == null) return false;
	var definition = honeycomb.entityDefinitionOf(entity);
	if (definition != null && definition.lustImmune == true) return false;
	if (definition != null && definition.usesLust != null) return definition.usesLust == true;
	return true;
};

//The definition behind a combatant, or null. Guarded because the entities file loads before the table
//that defines honeycomb.entityDefinition.
honeycomb.entityDefinitionOf = function (entity) {
	var found = entity == null || honeycomb.entityDefinition == null ? null : honeycomb.entityDefinition(entity);
	return found == null ? null : found.definition;
};

//The kind a combatant is, for the by-kind tuning tables: "character" or "enemy".
honeycomb.entityKind = function (entity) {
	return entity != null && entity.characterIndex != null ? "character" : "enemy";
};

//WHAT BREAKING DOES TO THIS COMBATANT: "state" (the full Broken state) or "defeated" (out of the fight,
//health to zero). The definition's `brokenBehavior`, else tuning.lust.brokenBehaviorByKind. A Severine summoned
//to the enemy side still gets the whole state; a Sporeling summoned to the party is still simply beaten.
honeycomb.entityBreakBehavior = function (entity) {
	var definition = honeycomb.entityDefinitionOf(entity);
	if (definition != null && definition.brokenBehavior != null) return definition.brokenBehavior;
	return honeycomb.tuning.lust.brokenBehaviorByKind[honeycomb.entityKind(entity)];
};

//Whether breaking plays the !!BROKEN!! cut-in: the definition's `brokenCutIn`, else
//tuning.lust.brokenCutInByKind. Stamped on the `broken` log entry, so the replay never has to ask.
honeycomb.entityHasBrokenCutIn = function (entity) {
	var definition = honeycomb.entityDefinitionOf(entity);
	if (definition != null && definition.brokenCutIn != null) return definition.brokenCutIn == true;
	return honeycomb.tuning.lust.brokenCutInByKind[honeycomb.entityKind(entity)] == true;
};

//What stands between an entity and being broken. tHP counts, which is why the two systems sit next to
//each other: bracing widens the gap as well as soaking the hit.
honeycomb.standingAgainstLust = function (entity) {
	if (entity == null) return 0;
	var standing = Math.max(0, entity.health);
	if (honeycomb.tuning.lust.breakIncludesTemporaryHealth == true) {
		standing += Math.max(0, entity.temporaryHealth == null ? 0 : entity.temporaryHealth);
	}
	//A lust margin (Clemence's Hallowed and Blessed Endurance): extra Lust a fighter can hold before it
	//counts against them. Folded here, the one place the comparison is built, so breaking, recovery, the
	//plate and the forecast all agree.
	standing += Math.max(0, honeycomb.applyStatusHooks("modifyLustMargin", 0, { entity: entity }));
	return standing;
};

//How much lust would have to arrive right now to break somebody. Zero or less means they are already
//over the line. Read by the forecast and by the bar's warning state.
honeycomb.lustToBreak = function (entity) {
	if (entity == null || honeycomb.entityUsesLust(entity) == false) return null;
	return honeycomb.standingAgainstLust(entity) - (entity.lust == null ? 0 : entity.lust);
};

//What the nameplate's bar draws, as shares of maximum health. Pure and DOM-free, so the reading can be
//tested headless and the stylesheet only ever positions what this returns. Pink is lust growing, black
//is missing health; when lust overtakes current health and the character is broken, the gap between the
//two reads as visually distinct from normal health.
//
//  not broken   health 0..health · temporary health..health+tHP · lust 0..lust over them · black past
//  broken       lust 0..min(standing, lust) · gap standing..lust · black past. A broken fighter healed
//               past their lust keeps a `recovering` stretch lust..standing until the turn start that
//               stands them up (recovery only happens then), so the bar says it is coming.
//
//Every segment is {from, to} with from <= to, or null. `mark` is a forecast mark (forecast.markFor) or
//null: a loss is the lighter stretch of health about to go, a heal the stretch about to return, and
//pending gold and lust extend their own segments. No numbers -- the tooltip carries those.
honeycomb.vitalsShareArray = function (entity, mark) {
	var tuning = honeycomb.tuning.art.nameplate;
	var maximum = Math.max(1, entity.maxHealth);
	var share = function (value) { return Math.max(0, Math.min(1, value / maximum)); };
	var span = function (from, to) { return to > from ? { from: from, to: to } : null; };

	var health = Math.max(0, entity.health);
	var temporary = Math.max(0, entity.temporaryHealth == null ? 0 : entity.temporaryHealth);
	var temporaryGained = mark == null ? 0 : Math.max(0, mark.temporaryGained == null ? 0 : mark.temporaryGained);
	//The pending gold shrinks as it lands. The shown temporary HP moves with the replay while the forecast
	//mark still carries the whole gain, so adding them would double the number as it arrives. Only the
	//share that has NOT landed yet is pending, measured from the temporary HP the forecast was taken
	//against.
	var temporaryBase = mark == null || mark.summary == null || mark.summary.temporaryHealth == null
		? temporary : mark.summary.temporaryHealth;
	temporaryGained = Math.max(0, temporaryGained - Math.max(0, temporary - temporaryBase));
	var usesLust = honeycomb.entityUsesLust(entity);
	var lust = usesLust ? Math.max(0, entity.lust == null ? 0 : entity.lust) : 0;
	var lustGained = usesLust && mark != null ? Math.max(0, mark.lustGained == null ? 0 : mark.lustGained) : 0;
	var broken = usesLust && entity.broken == true;
	var temporaryTotal = temporary + temporaryGained;
	//A broken fighter's overflow is lust, not temporary HP: the shatter reads the pink that has run past
	//maximum health, and the gold tHP overflow is suppressed so the two never draw at once. A broken bar
	//has no tHP to overflow anyway -- it draws lust and the gap. A forecast gain does not shatter: only
	//temporary HP that has actually landed counts, so the lightning does not appear before the health does.
	var overfull = broken == false && (health + temporary) / maximum > tuning.overfullAt;
	var lustOverfull = broken && lust / maximum > tuning.overfullAt;

	//Past maximum the health stops short of the tip so the lightning comes out of gold.
	var healthTo = share(health);
	if (overfull) healthTo = Math.min(healthTo, 1 - tuning.overfullGoldShare);

	var reading = {
		broken: broken, overfull: overfull, lustOverfull: lustOverfull, usesLust: usesLust,
		health: null, temporary: null, temporaryPending: null, lust: null, lustPending: null,
		gap: null, recovering: null, loss: null, potential: null, heal: null,
		lustShare: share(lust), lustTotal: lust, temporaryTotal: temporaryTotal,
	};

	if (broken) {
		var standing = honeycomb.standingAgainstLust(entity);
		reading.lust = span(0, share(Math.min(standing, lust)));
		reading.gap = span(share(standing), share(lust));
		reading.recovering = span(share(lust), share(standing));
		return reading;
	}

	reading.health = span(0, healthTo);
	var temporaryTo = overfull ? 1 : share(health + temporaryTotal);
	reading.temporary = span(healthTo, temporaryTo);
	if (temporaryGained > 0) reading.temporaryPending = span(Math.max(healthTo, temporaryTo - temporaryGained / maximum), temporaryTo);
	reading.lust = span(0, share(lust));
	reading.lustPending = span(share(lust), share(lust + lustGained));

	if (mark != null && mark.healthAfter != null) {
		var after = Math.min(share(Math.max(0, mark.healthAfter)), healthTo);
		reading.loss = span(after, healthTo);
		if (mark.healthAfter > health) reading.heal = span(healthTo, share(mark.healthAfter));
		if (mark.potentialDamage > 0 && mark.potentialAfter != null) {
			reading.potential = span(share(Math.max(0, mark.potentialAfter)), after);
		}
	}
	return reading;
};

//What a printed lust number would actually land as: the in-fight hooks and the between-run ledger,
//without applying either. SHARED by the real gain and by every preview of one, the way modifiedDamage
//is, so a card's printed number can never disagree with what it does. `target` may be null.
//`tagArray` may be given outright -- Severine's Night Court names what her own cost counts as -- and when
//it is, it must reach the multiplier as well as the log. Deriving the tags here a second time from a
//source and an entry that carry none is what made her self-lust ignore her own Charm weakness.
honeycomb.previewedLust = function (source, target, baseAmount, entry, context, tagArray) {
	if (target == null) return Math.floor(baseAmount);
	var tags = tagArray != null ? tagArray : honeycomb.lustSourceTagArray({ source: source, entry: entry }, context);
	var amount = honeycomb.applyStatusHooks("modifyLustGained", baseAmount,
		{ entity: target, source: source, context: context, entry: entry, tagArray: tags });
	//The party's relics on the other team's lust (the Honeyed Thorn). See modifiedDamage.
	if (target.side == "enemy") {
		amount = honeycomb.applyRunHooks("modifyOpponentLustGained", amount,
			{ entity: target, source: source, context: context, entry: entry, tagArray: tags });
	}
	return Math.floor(amount * honeycomb.lust.vulnerabilityMultiplier(target, tags));
};

//Lust arriving. `origin` carries {source, entry, tagArray} so the between-run weakness ledger knows
//what kind of attack did it; pass null for lust from no particular attack.
//Who on `side` is standing in for the golems, or null: the frontmost living combatant carrying any status
//whose definition declares `absorbsGolemLust: true`. A status field and one lookup, so a second character
//who wanted the same posture would need no engine change.
honeycomb.golemLustBearer = function (side, combat) {
	var livingArray = honeycomb.livingEntityArray(side == "enemy" ? "enemy" : "ally", combat);
	for (var scanIndex = 0; scanIndex < livingArray.length; scanIndex++) {
		var candidate = livingArray[scanIndex];
		var statusArray = candidate.statusArray == null ? [] : candidate.statusArray;
		for (var statusIndex = 0; statusIndex < statusArray.length; statusIndex++) {
			if (statusArray[statusIndex].stacks <= 0) continue;
			var definition = honeycomb.findDefinition(honeycomb.statusArray, statusArray[statusIndex].index);
			if (definition != null && definition.absorbsGolemLust == true) return candidate;
		}
	}
	return null;
};

honeycomb.gainLust = function (target, baseAmount, origin, context) {
	if (target == null || target.downed == true) return 0;
	if (honeycomb.entityUsesLust(target) == false) return 0;
	var where = origin == null ? {} : origin;
	//ECSTATIC: Lust that reaches her while she is Broken scatters to someone else on the field instead --
	//ally or enemy, at random. Scattered Lust does not scatter again.
	if (target.broken == true && where.scattered != true && context != null && context.combat != null &&
		target.characterIndex != null && honeycomb.memberLoadoutFlag(target, "brokenLustScatters") == true) {
		var candidateArray = honeycomb.livingEntityArray("both", context.combat).filter(function (entity) {
			return entity !== target && honeycomb.entityUsesLust(entity) == true;
		});
		if (candidateArray.length > 0) {
			var landing = honeycomb.rng.pick(honeycomb.tuning.rng.streamArray.combat, candidateArray);
			return honeycomb.gainLust(landing, baseAmount, { source: where.source, entry: where.entry, tagArray: where.tagArray, scattered: true }, context);
		}
	}
	//A commander answers for her pieces: lust aimed at a golem lands on whoever on that side carries a
	//status whose definition declares `absorbsGolemLust` -- Anastasia's outfit puts one on her at combat
	//start. Written here rather than as a hook so it happens BEFORE any modifier is read: the amount the
	//bearer takes is measured against the bearer, which is the whole point of taking it. Redirected Lust
	//never redirects again, the same guard the scatter above uses.
	if (where.redirected != true && context != null && context.combat != null &&
		target.enemyIndex != null && honeycomb.entityHasTag(target, "golem") == true) {
		var bearer = honeycomb.golemLustBearer(target.side, context.combat);
		if (bearer != null && bearer !== target && honeycomb.entityUsesLust(bearer) == true) {
			return honeycomb.gainLust(bearer, baseAmount,
				{ source: where.source, entry: where.entry, tagArray: where.tagArray, redirected: true }, context);
		}
	}

	var tagArray = honeycomb.lustSourceTagArray(where, context);

	//The in-fight modifiers and THE BETWEEN-RUN WEAKNESS, in that order -- the weakness is a property
	//of the character across runs, not of anything on the board, so it multiplies last. Shared with
	//the preview so the printed number and the landed one cannot drift apart.
	var amount = honeycomb.previewedLust(where.source, target, baseAmount, where.entry, context, tagArray);
	if (amount <= 0) return 0;

	if (target.lust == null) target.lust = 0;
	//A ceiling on lust itself: Brienne's Unshakable keeps her from gaining lust beyond her maximum HP, so
	//tanking stays viable as long as she is over 100% hp.
	//
	//A `lustMaximum` hook answers with a cap; the highest one wins is not the question, the LOWEST is, so
	//the fold takes the smallest answer any source gives. Nothing else carries one today. This clamps the
	//value rather than the gain, so a cap arriving after the Lust does still pulls it down.
	var ceiling = honeycomb.lustCeilingFor(target);
	target.lust += amount;
	if (ceiling != null && target.lust > ceiling) {
		amount = Math.max(0, amount - (target.lust - ceiling));
		target.lust = ceiling;
	}
	if (amount <= 0) return 0;
	honeycomb.logEvent(context, {
		type: "lust", targetId: target.instanceId, amount: amount,
		sourceId: where.source == null ? null : where.source.instanceId, tagArray: tagArray,
		//What KIND of lust, when the origin names one. The broken spiral marks its own so the replay
		//can land it instantly rather than ticking it.
		damageType: where.entry == null ? null : where.entry.damageType,
		//And the beat pace, for lust that rides another beat -- Intoxicated inside poison's tick.
		pace: where.entry == null ? null : where.entry.pace,
	});
	honeycomb.fireEntityHooks("onLustGained", { entity: target, amount: amount, tagArray: tagArray, context: context });
	//Lust landing on an ENEMY is a world event too (Nettle's Aphrodisiac hears the party's Lust).
	if (target.side == "enemy" && context != null && context.combat != null) {
		honeycomb.fireRunHooks("onEnemyLustGained", { entity: target, amount: amount, source: where.source != null ? where.source : context.source,
			entry: where.entry, context: context });
	}
	//And the ledger the next run reads.
	honeycomb.lust.recordExposure(target, tagArray, amount, context);
	honeycomb.checkBreak(target, context);
	return amount;
};

//Lust leaving. The other half of the pair, and the cheaper of the two ways out of Broken.
honeycomb.reduceLust = function (target, amount, context) {
	if (target == null || honeycomb.entityUsesLust(target) == false) return 0;
	//ECSTATIC: she cannot be soothed in a fight. Lust still leaves her between fights.
	if (context != null && context.combat != null && target.characterIndex != null &&
		honeycomb.memberLoadoutFlag(target, "cannotBeSoothed") == true) return 0;
	var standing = target.lust == null ? 0 : target.lust;
	var removed = Math.min(Math.floor(amount), standing);
	if (removed <= 0) return 0;
	target.lust = standing - removed;
	honeycomb.logEvent(context, { type: "lustReduced", targetId: target.instanceId, amount: removed });
	//Lust leaving is counted and heard: the action's tally keeps `lustRemoved` for a card that moves it
	//elsewhere, and the world hears who lost it and who took it away.
	if (context != null && context.tally != null) context.tally.lustRemoved = (context.tally.lustRemoved == null ? 0 : context.tally.lustRemoved) + removed;
	if (context != null && context.combat != null) {
		honeycomb.fireRunHooks("onLustReduced", { entity: target, amount: removed, source: context.source == null ? null : context.source, context: context });
	}
	honeycomb.checkRecovery(target, context);
	return removed;
};

//THE BREAK TEST, run every time either side of the comparison moves. Returns true only on the
//transition, so the cut-in plays once.
//The lowest ceiling any source puts on this fighter's Lust, or null for none. A hook returns a number;
//the smallest wins, so two sources cannot raise each other's cap.
honeycomb.lustCeilingFor = function (target) {
	if (target == null) return null;
	var sourceArray = honeycomb.hookSourceArray(target, true);
	var lowest = null;
	for (var sourceIndex = 0; sourceIndex < sourceArray.length; sourceIndex++) {
		var hook = sourceArray[sourceIndex].hooks.lustMaximum;
		if (typeof hook !== "function") continue;
		var answer = hook({ entity: target, stacks: sourceArray[sourceIndex].stacks, definition: sourceArray[sourceIndex].definition });
		if (typeof answer !== "number") continue;
		if (lowest == null || answer < lowest) lowest = answer;
	}
	return lowest;
};

honeycomb.checkBreak = function (target, context) {
	if (target == null || target.broken == true || target.downed == true) return false;
	if (honeycomb.entityUsesLust(target) == false) return false;
	var behavior = honeycomb.entityBreakBehavior(target);
	//FOR ONE WHO IS DEFEATED BY BREAKING, A LETHAL HIT IS A KILL, NOT A BREAK. At no health `0 >= 0` would
	//otherwise call every ordinary death a break; the full state has no death to confuse it with.
	if (behavior == "defeated" && target.health <= 0) return false;
	var lust = target.lust == null ? 0 : target.lust;
	if (lust < honeycomb.standingAgainstLust(target)) return false;
	//A character who recovered this turn is not broken again until the next one, or a single card
	//could stack cut-ins on top of each other.
	//
	//And it says so: a silent refusal would make a debug break on somebody who had just been healed
	//appear to do nothing at all -- no cut-in, no card swap, no message. The entry is debug-only because
	//in an ordinary fight the refusal is a rule working.
	if (honeycomb.tuning.lust.breakOncePerTurn == true && target.recoveredThisTurn == true) {
		if (honeycomb.tuning.debug.enabled == true) {
			honeycomb.logEvent(context, {
				type: "breakRefused", targetId: target.instanceId, reason: "recoveredThisTurn",
			});
		}
		return false;
	}

	//A LAST CHANCE (Bastion): a hook may act before the break lands -- trade Resolve for Temporary HP, say.
	//If it lifts the standing back above the Lust, there is no break.
	honeycomb.fireEntityHooks("onWouldBreak", { entity: target, context: context });
	if (lust < honeycomb.standingAgainstLust(target)) return false;

	target.broken = true;
	target.brokenTurnCount = 0;
	//Breaking drops the taunt: a fighter holding Taunt takes every hit aimed at the party, so a taunting
	//wall who Breaks would keep pulling the whole fight onto somebody who can no longer stand up to it.
	//Listed in tuning so another status can be made to fall off the same way without touching this
	//function.
	var dropArray = honeycomb.tuning.lust.statusesLostOnBreakArray;
	for (var dropIndex = 0; dropIndex < (dropArray == null ? [] : dropArray).length; dropIndex++) {
		honeycomb.removeStatus(target, dropArray[dropIndex], null, context);
	}
	honeycomb.fireEntityHooks("onBroken", { entity: target, context: context });
	//A world event as well as an entity one, dispatched by team the way a death is.
	honeycomb.fireRunHooks(target.side == "enemy" ? "onEnemyBroken" : "onAllyBroken", { entity: target, context: context });
	honeycomb.logEvent(context, {
		type: "broken", targetId: target.instanceId, side: target.side,
		characterIndex: target.characterIndex == null ? null : target.characterIndex,
		enemyIndex: target.enemyIndex == null ? null : target.enemyIndex,
		behavior: behavior,
		//Whether the replay plays the cut-in for this one. See entityHasBrokenCutIn.
		cutIn: honeycomb.entityHasBrokenCutIn(target),
	});
	//BEATEN ON THE SPOT. `broken` stays set as the record of how they fell; everything that counts the
	//fallen (experience, the win check, targeting) reads `downed`.
	if (behavior == "defeated") {
		target.health = 0;
		honeycomb.markDowned(target, context, "broken");
	}
	return true;
};

//Whether a broken character is currently standing above their lust -- the condition recovery waits
//for, asked on its own so the plate can say "Recovers at turn start" before it happens.
honeycomb.recoveryConditionMet = function (target) {
	if (target == null) return false;
	var lust = target.lust == null ? 0 : target.lust;
	var standing = honeycomb.standingAgainstLust(target);
	return honeycomb.tuning.lust.recoveryNeedsStrictlyAbove == true ? standing > lust : standing >= lust;
};

//How much more health or temporary HP (or how much less lust) a Broken combatant needs for the recovery
//test to pass: 0 once it already would. Answered from the same test, so the nameplate tooltip can never
//promise a recovery the turn start will not give.
honeycomb.recoveryShortfall = function (target) {
	if (target == null || honeycomb.recoveryConditionMet(target) == true) return 0;
	var lust = target.lust == null ? 0 : target.lust;
	//Strictly above means getting level is not enough: one more point than the gap.
	return Math.max(1, lust - honeycomb.standingAgainstLust(target) +
		(honeycomb.tuning.lust.recoveryNeedsStrictlyAbove == true ? 1 : 0));
};

//THE RECOVERY TEST. Strictly above, per the brief: equal lust and health is still broken, which keeps
//the two tests from disagreeing at the boundary.
//
//Inside a fight the answer is only given at a turn start. It is still ASKED everywhere health, tHP or
//lust moves -- that is what keeps `recoveryPending` on the entity honest, which is what the plate reads
//-- but a mid-turn heal now buys the recovery rather than being it.
//
//Outside a fight recovery is immediate, because there are no turns on the map and BROKEN-01 §4
//deliberately lets the per-move lust bleed un-break somebody. `recoveryOnlyAtTurnStart` is therefore
//consulted only when a combat exists.
//
//`options.atTurnStart` is what a turn start passes to say the window is open.
honeycomb.checkRecovery = function (target, context, options) {
	if (target == null || target.broken != true || target.downed == true) return false;
	var settings = options == null ? {} : options;
	var met = honeycomb.recoveryConditionMet(target);
	//Recorded either way, so the flag never lies about the condition it names.
	target.recoveryPending = met;
	if (met == false) return false;

	var inCombat = context != null && context.combat != null;
	if (inCombat && honeycomb.tuning.lust.recoveryOnlyAtTurnStart == true && settings.atTurnStart != true) return false;

	target.broken = false;
	target.brokenTurnCount = 0;
	target.recoveryPending = false;
	target.recoveredThisTurn = true;
	//RECOVER (tree node "Recover"): the character heals on their way back up. A member field, so an
	//outfit or an equipment piece may carry one too.
	var recoverHeal = honeycomb.memberFieldTotal(target, "recoverHeal");
	if (recoverHeal > 0) honeycomb.healEntity(target, recoverHeal, context);
	honeycomb.fireEntityHooks("onRecovered", { entity: target, context: context });
	honeycomb.logEvent(context, {
		type: "recovered", targetId: target.instanceId, side: target.side,
		characterIndex: target.characterIndex == null ? null : target.characterIndex,
	});
	return true;
};

//THE BROKEN SPIRAL: what a turn spent broken costs. Run at the END of a broken character's own turn,
//so the first turn of being broken already bites and doing nothing about it gets worse each turn.
honeycomb.applyBrokenEscalation = function (target, context) {
	if (target == null || target.broken != true || target.downed == true) return 0;
	var tuning = honeycomb.tuning.lust;
	var spent = target.brokenTurnCount == null ? 0 : target.brokenTurnCount;
	var amount = Math.min(tuning.brokenEscalationMaximum, tuning.brokenEscalationBase + tuning.brokenEscalationStep * spent);
	target.brokenTurnCount = spent + 1;
	if (amount <= 0) return 0;

	honeycomb.logEvent(context, { type: "brokenEscalation", targetId: target.instanceId, amount: amount, turns: target.brokenTurnCount });
	//Health first, so the lust it then gains is measured against what is left. Self-inflicted, so it
	//passes no source; the ledger records nothing for a wound nobody dealt.
	honeycomb.dealDamage(null, target, amount,
		{ ignoreTemporary: tuning.brokenEscalationIgnoresTemporary == true, damageType: "broken" }, context);
	honeycomb.gainLust(target, amount, { entry: { damageType: "broken" } }, context);
	return amount;
};

//The half-health cut-in: the first time a CHARACTER in a fight falls to or
//below half health, their hurt sprite is brought forward for a beat. Once per fight per character, and
//fired from the damage pipeline so every road to the wound is covered. A wound that breaks or downs
//them is left to the cut-in that already owns that moment, and an ordinary enemy -- with no cut-in art
//and no damaged tier worth a full-screen beat -- is skipped by requiring a characterIndex.
honeycomb.checkHalfHealthCutIn = function (target, context) {
	var tuning = honeycomb.tuning.halfHealthOverlay;
	if (tuning == null || tuning.enabled != true) return false;
	if (target == null || target.downed == true || target.broken == true) return false;
	if (target.characterIndex == null || target.halfHealthShown == true) return false;
	if (target.maxHealth <= 0) return false;
	if (Math.max(0, target.health) > target.maxHealth * tuning.thresholdFraction) return false;
	target.halfHealthShown = true;
	honeycomb.logEvent(context, {
		type: "lowHealth", targetId: target.instanceId,
		characterIndex: target.characterIndex, enemyIndex: target.enemyIndex,
	});
	return true;
};

//---------------------------------------------------------------------------------------------------
//The between-run weakness ledger
//---------------------------------------------------------------------------------------------------
//The PROFILE remembers, per character, how much lust each tag has put on them. The count itself
//does nothing -- every point of extra weakness is attached to the RANK it crosses into, so a character
//is unchanged until they step up one, and the step is something a player can see coming.
honeycomb.lust = {};

//THE TAGS AN ATTACK CARRIES. In order: an explicit list on the effect entry, the card being played,
//then the attacker's own tags. A lust gain with no tags at all records nothing -- there is no weakness
//to develop toward "nothing in particular".
honeycomb.lustSourceTagArray = function (origin, context) {
	var where = origin == null ? {} : origin;
	if (where.tagArray != null) return where.tagArray;
	if (where.entry != null && where.entry.lustTagArray != null) return where.entry.lustTagArray;
	var card = context == null ? null : context.card;
	if (card != null && card.tagArray != null && card.tagArray.length > 0) return card.tagArray;
	if (where.source != null) return honeycomb.entityTagArray(where.source);
	return [];
};

//The ledger itself, on the profile. Written lazily so an old save grows one the first time it is hit.
honeycomb.lust.exposureLedger = function (characterIndex, create) {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	if (profile == null || characterIndex == null) return null;
	if (profile.lustExposureArray == null) {
		if (create != true) return null;
		profile.lustExposureArray = {};
	}
	if (profile.lustExposureArray[characterIndex] == null) {
		if (create != true) return null;
		profile.lustExposureArray[characterIndex] = {};
	}
	return profile.lustExposureArray[characterIndex];
};

//The one knob a consumable, a rare card, a cheat code or a difficulty mode moves. Every caller goes
//through these two rather than reading tuning directly, so there is exactly one place to hook.
honeycomb.lust.exposureRate = function () {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	if (profile != null && profile.lustExposureRate != null) return profile.lustExposureRate;
	return honeycomb.tuning.lust.exposureRateDefault;
};

honeycomb.lust.decayRate = function () {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	if (profile != null && profile.lustExposureDecayRate != null) return profile.lustExposureDecayRate;
	return honeycomb.tuning.lust.exposureDecayRateDefault;
};

//Which rank an exposure count sits in. The table is read from the top down, so the ranks may be
//reordered or extended without touching this.
honeycomb.lust.rankDefinitionFor = function (exposure) {
	var rankArray = honeycomb.tuning.lust.exposureRankArray;
	var found = null;
	for (var scanIndex = 0; scanIndex < rankArray.length; scanIndex++) {
		if (exposure >= rankArray[scanIndex].atOrAbove) found = rankArray[scanIndex];
	}
	return found;
};

//The rank whose threshold is exactly this number -- what "6 to Susceptible" is looking up.
honeycomb.lust.rankDefinitionForThreshold = function (threshold) {
	var rankArray = honeycomb.tuning.lust.exposureRankArray;
	for (var scanIndex = 0; scanIndex < rankArray.length; scanIndex++) {
		if (rankArray[scanIndex].atOrAbove == threshold) return rankArray[scanIndex];
	}
	return null;
};

//One rank by its number, for anything that has a rank rather than an exposure in hand.
honeycomb.lust.rankDefinitionByRank = function (rank) {
	var rankArray = honeycomb.tuning.lust.exposureRankArray;
	for (var scanIndex = 0; scanIndex < rankArray.length; scanIndex++) {
		if (String(rankArray[scanIndex].rank) == String(rank)) return rankArray[scanIndex];
	}
	return null;
};

honeycomb.lust.exposureFor = function (characterIndex, tagIndex) {
	var ledger = honeycomb.lust.exposureLedger(characterIndex, false);
	if (ledger == null || ledger[tagIndex] == null) return 0;
	return ledger[tagIndex];
};

honeycomb.lust.rankFor = function (characterIndex, tagIndex) {
	if (honeycomb.lust.isWeaknessTag(tagIndex) == false) return 0;
	var definition = honeycomb.lust.rankDefinitionFor(honeycomb.lust.exposureFor(characterIndex, tagIndex));
	var rank = definition == null ? 0 : definition.rank;
	//FORTITUDE: no weakness rank while owned. The ledger is kept, so giving the node back restores it.
	if (honeycomb.lust.hasFortitude(characterIndex)) return 0;
	return rank;
};

//The floor a decay may not cross: the threshold of the rank a tag currently sits in. One weakness
//growing softens the others, but it can never demote one.
honeycomb.lust.rankFloorFor = function (exposure) {
	var definition = honeycomb.lust.rankDefinitionFor(exposure);
	return definition == null ? 0 : definition.atOrAbove;
};

//What the ledger does to incoming lust. The product across every tag the attack carries, so an attack
//that is two of a character's weaknesses at once hits for both.
honeycomb.lust.vulnerabilityMultiplier = function (entity, tagArray) {
	if (entity == null || entity.characterIndex == null || tagArray == null) return 1;
	//FORTITUDE: no rank, so no extra Lust from one.
	if (honeycomb.lust.hasFortitude(entity.characterIndex)) return 1;
	var ledger = honeycomb.lust.exposureLedger(entity.characterIndex, false);
	if (ledger == null) return 1;
	var multiplier = 1;
	for (var scanIndex = 0; scanIndex < tagArray.length; scanIndex++) {
		if (honeycomb.lust.isWeaknessTag(tagArray[scanIndex]) == false) continue;
		var definition = honeycomb.lust.rankDefinitionFor(ledger[tagArray[scanIndex]] == null ? 0 : ledger[tagArray[scanIndex]]);
		if (definition != null) multiplier = multiplier * definition.lustMultiplier;
	}
	return multiplier;
};

//How much exposure `amount` lust adds to each tag it carries. Shared by the real record and by every
//preview of one, so a rail showing what a hit WOULD add cannot drift from what it does add.
honeycomb.lust.exposureGrowth = function (amount) {
	if (amount == null || amount <= 0) return 0;
	return amount * honeycomb.tuning.lust.exposurePerLustPoint * honeycomb.lust.exposureRate();
};

//What one hit would do to one weakness, without doing it: where the tag stands, where `lustAmount` lust
//of it would leave it once this run's rank ceiling has had its say, and whether that crosses into a new
//rank. The decay a hit causes in the character's OTHER tags is left out: it can never cost a rank, so it
//never changes what the player is being warned about.
honeycomb.lust.previewExposure = function (characterIndex, tagIndex, lustAmount) {
	var before = honeycomb.lust.exposureFor(characterIndex, tagIndex);
	var raw = before + honeycomb.lust.exposureGrowth(lustAmount);
	var after = honeycomb.lust.clampToRunCeiling(characterIndex, tagIndex, raw);
	var rankBefore = honeycomb.lust.rankDefinitionFor(before);
	var rankAfter = honeycomb.lust.rankDefinitionFor(after);
	return {
		characterIndex: characterIndex,
		tag: tagIndex,
		exposure: before,
		exposureAfter: after,
		rank: rankBefore == null ? 0 : rankBefore.rank,
		rankName: rankBefore == null ? null : rankBefore.name,
		multiplier: rankBefore == null ? 1 : rankBefore.lustMultiplier,
		nextAt: honeycomb.lust.nextThresholdFor(before),
		ranksUp: (rankAfter == null ? 0 : rankAfter.rank) > (rankBefore == null ? 0 : rankBefore.rank),
		held: after < raw,
	};
};

//Recording a hit. Grows every tag the attack carried and bleeds every other tag the character has,
//floored at each one's current rank. A forecast must not write here: the dry run replaces
//honeycomb.state, but the PROFILE is shared, so this is guarded the same way honeycomb.save.write is.
honeycomb.lust.recordExposure = function (entity, tagArray, amount, context) {
	if (entity == null || entity.characterIndex == null) return;
	if (tagArray == null || tagArray.length == 0 || amount <= 0) return;
	if (honeycomb.forecast != null && honeycomb.forecast.active == true) return;
	//FORTITUDE: nothing builds while it is owned.
	if (honeycomb.lust.hasFortitude(entity.characterIndex)) return;
	var tuning = honeycomb.tuning.lust;
	var ledger = honeycomb.lust.exposureLedger(entity.characterIndex, true);
	if (ledger == null) return;

	var growth = honeycomb.lust.exposureGrowth(amount);
	if (growth <= 0) return;
	var grownArray = [];
	for (var scanIndex = 0; scanIndex < tagArray.length; scanIndex++) {
		var tagIndex = tagArray[scanIndex];
		if (grownArray.indexOf(tagIndex) >= 0 || honeycomb.lust.isWeaknessTag(tagIndex) == false) continue;
		grownArray.push(tagIndex);
		var before = ledger[tagIndex] == null ? 0 : ledger[tagIndex];
		//The per-run ceiling: clamped rather than dropped, the exposure is still taken, it simply
		//cannot cross the next threshold again this run.
		ledger[tagIndex] = Math.min(honeycomb.lust.topThreshold(),
			honeycomb.lust.clampToRunCeiling(entity.characterIndex, tagIndex, before + growth));
		honeycomb.lust.noteRankChange(entity, tagIndex, before, ledger[tagIndex], context);
	}

	if (grownArray.length === 0) return;
	var decay = growth * tuning.exposureDecayPerGrowth * honeycomb.lust.decayRate();
	if (decay <= 0) return;
	for (var otherIndex in ledger) {
		if (Object.prototype.hasOwnProperty.call(ledger, otherIndex) == false) continue;
		if (grownArray.indexOf(otherIndex) >= 0) continue;
		var floor = honeycomb.lust.rankFloorFor(ledger[otherIndex]);
		ledger[otherIndex] = Math.max(floor, ledger[otherIndex] - decay);
	}
};

//---------------------------------------------------------------------------------------------------
//One rank per run, and saying so when it happens
//---------------------------------------------------------------------------------------------------
//The count of ranks taken THIS RUN lives on the profile beside the ledger itself, because the ledger is
//a profile-level thing and the two have to be cleared and saved together. A run is the boundary: it is
//reset at runStart, which is the same one lust itself uses.
honeycomb.lust.rankGainLedger = function (characterIndex, create) {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	if (profile == null || characterIndex == null) return null;
	if (profile.lustRankGainArray == null) {
		if (create != true) return null;
		profile.lustRankGainArray = {};
	}
	if (profile.lustRankGainArray[characterIndex] == null) {
		if (create != true) return null;
		profile.lustRankGainArray[characterIndex] = {};
	}
	return profile.lustRankGainArray[characterIndex];
};

honeycomb.lust.rankGainThisRun = function (characterIndex, tagIndex) {
	var ledger = honeycomb.lust.rankGainLedger(characterIndex, false);
	if (ledger == null || ledger[tagIndex] == null) return 0;
	return ledger[tagIndex];
};

//Cleared at the start of a run, so "this session" means this run.
honeycomb.lust.clearRankGains = function () {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	if (profile == null) return;
	profile.lustRankGainArray = {};
};

//THE CEILING. Once this run has already taken its allowance of ranks for a tag, that tag's exposure
//stops one short of the next threshold -- it keeps every point it has earned and simply cannot cross.
//A ceiling rather than a block, so the points are there waiting the moment the run ends.
honeycomb.lust.clampToRunCeiling = function (characterIndex, tagIndex, exposure) {
	var allowance = honeycomb.tuning.lust.maximumRankGainPerRun;
	if (allowance == null) return exposure;
	if (honeycomb.lust.rankGainThisRun(characterIndex, tagIndex) < allowance) return exposure;
	var next = honeycomb.lust.nextThresholdFor(honeycomb.lust.exposureFor(characterIndex, tagIndex));
	if (next == null) return exposure;
	//Strictly below the threshold: rankDefinitionFor is an at-or-above test.
	return Math.min(exposure, next - honeycomb.tuning.lust.rankCeilingMargin);
};

//A rank actually crossed. Counts it against this run's allowance and writes the log entry the cut-in
//plays from -- so it arrives as a beat of the replay exactly where the rank was crossed, and plays
//directly when one is crossed outside a fight.
honeycomb.lust.noteRankChange = function (entity, tagIndex, before, after, context) {
	var wasRank = honeycomb.lust.rankDefinitionFor(before);
	var nowRank = honeycomb.lust.rankDefinitionFor(after);
	if (nowRank == null) return;
	if (wasRank != null && wasRank.rank >= nowRank.rank) return;
	//FORTITUDE (tree node): no rank-up at all, so no cut-in and no ledger step either.
	if (honeycomb.lust.hasFortitude(entity.characterIndex)) return;

	var gainLedger = honeycomb.lust.rankGainLedger(entity.characterIndex, true);
	if (gainLedger != null) {
		var steps = nowRank.rank - (wasRank == null ? 0 : wasRank.rank);
		gainLedger[tagIndex] = (gainLedger[tagIndex] == null ? 0 : gainLedger[tagIndex]) + steps;
	}
	//The rank-up is remembered for teambuilding, once per rank crossed and in order, so a jump of two
	//ranks leaves two records and their events play in turn. See honeycomb-lust-events.js.
	if (honeycomb.lustEvents != null) {
		var rankArray = honeycomb.tuning.lust.exposureRankArray;
		for (var crossedIndex = 0; crossedIndex < rankArray.length; crossedIndex++) {
			var crossed = rankArray[crossedIndex].rank;
			if (crossed <= (wasRank == null ? 0 : wasRank.rank) || crossed > nowRank.rank) continue;
			honeycomb.lustEvents.recordRankUp(entity.characterIndex, tagIndex, crossed, context);
		}
	}
	honeycomb.logEvent(context, {
		type: "lustRank", targetId: entity.instanceId, characterIndex: entity.characterIndex,
		tag: tagIndex, rank: nowRank.rank, rankName: nowRank.name,
		description: nowRank.description, multiplier: nowRank.lustMultiplier,
	});
};

//Every tag a character has any exposure to, worst first, for the character sheet.
honeycomb.lust.exposureSummaryArray = function (characterIndex) {
	var ledger = honeycomb.lust.exposureLedger(characterIndex, false);
	var result = [];
	//FORTITUDE: no weakness to show.
	if (ledger == null || honeycomb.lust.hasFortitude(characterIndex)) return result;
	for (var tagIndex in ledger) {
		if (Object.prototype.hasOwnProperty.call(ledger, tagIndex) == false) continue;
		if (honeycomb.lust.isWeaknessTag(tagIndex) == false) continue;
		if (ledger[tagIndex] <= 0) continue;
		var definition = honeycomb.lust.rankDefinitionFor(ledger[tagIndex]);
		result.push({
			//The character is carried on the entry so a row can ask about THEIR run allowance without
			//the sheet having to thread the index through every helper.
			characterIndex: characterIndex,
			tag: tagIndex, exposure: ledger[tagIndex],
			rank: definition == null ? 0 : definition.rank,
			rankName: definition == null ? null : definition.name,
			multiplier: definition == null ? 1 : definition.lustMultiplier,
			nextAt: honeycomb.lust.nextThresholdFor(ledger[tagIndex]),
		});
	}
	result.sort(function (left, right) { return right.exposure - left.exposure; });
	return result;
};

//Whether a character owns Fortitude right now. One helper, so every place the weakness is read or grown
//asks the same question.
//Only the tags marked `lustTag` in honeycomb.cardTagArray are weaknesses. A hit whose tags fall back to its
//source's (a character's human, woman, support) records nothing for those.
honeycomb.lust.isWeaknessTag = function (tagIndex) {
	var definition = honeycomb.findDefinition(honeycomb.cardTagArray, tagIndex);
	return definition != null && definition.lustTag == true;
};

//The threshold of the highest rank. Exposure is never kept above it: past the top rank it does nothing.
honeycomb.lust.topThreshold = function () {
	var top = 0;
	var rankArray = honeycomb.tuning.lust.exposureRankArray;
	for (var scanIndex = 0; scanIndex < rankArray.length; scanIndex++) top = Math.max(top, rankArray[scanIndex].atOrAbove);
	return top;
};

honeycomb.lust.hasFortitude = function (characterIndex) {
	return characterIndex != null && honeycomb.characterFieldFlag(characterIndex, "fortitude") == true;
};

//What the next rank costs, or null at the top. Shown on the sheet so a step up is something a player
//can see coming rather than discover mid-fight.
honeycomb.lust.nextThresholdFor = function (exposure) {
	var rankArray = honeycomb.tuning.lust.exposureRankArray;
	for (var scanIndex = 0; scanIndex < rankArray.length; scanIndex++) {
		if (exposure < rankArray[scanIndex].atOrAbove) return rankArray[scanIndex].atOrAbove;
	}
	return null;
};

//How close a tag is to its next rank: the share of its current rank's stretch of the rail already
//covered, 0 at the rank floor and 1 at the next notch. Null at the top rank, where there is
//no next notch to be close to.
honeycomb.lust.nextRankCloseness = function (exposure) {
	var next = honeycomb.lust.nextThresholdFor(exposure);
	if (next == null) return null;
	var floor = honeycomb.lust.rankFloorFor(exposure);
	if (next <= floor) return null;
	return Math.max(0, Math.min(1, (exposure - floor) / (next - floor)));
};

//The glow a sheet row wears for that closeness, as an opacity: nothing below
//tuning.lust.nearRankGlowStartShare, then a straight line up to nearRankGlowMaximum at the notch.
honeycomb.lust.nearRankGlow = function (exposure) {
	var tuning = honeycomb.tuning.lust;
	var closeness = honeycomb.lust.nextRankCloseness(exposure);
	if (closeness == null || closeness < tuning.nearRankGlowStartShare) return 0;
	if (tuning.nearRankGlowStartShare >= 1) return tuning.nearRankGlowMaximum;
	return tuning.nearRankGlowMaximum * (closeness - tuning.nearRankGlowStartShare) / (1 - tuning.nearRankGlowStartShare);
};

//---------------------------------------------------------------------------------------------------
//Bench decay
//---------------------------------------------------------------------------------------------------
//Measured in the run's DAYS: each day a run spends without a character takes a fixed amount off each of
//their tags, never below the threshold of the rank the tag is in. Walking is what passes days, so a run
//abandoned after one node bought one day, not a clean slate.
//
//Players can also spend personal EXP to reduce it back to the rank floor: that is
//honeycomb.lust.resetToFloor, below.

//What one benched day takes off each tag.
honeycomb.lust.benchDecayAmount = function () {
	return honeycomb.tuning.lust.benchDecayPerDay * honeycomb.lust.decayRate();
};

//Where one benched day leaves an exposure count.
honeycomb.lust.benchDecayedExposure = function (exposure) {
	return Math.max(honeycomb.lust.rankFloorFor(exposure), exposure - honeycomb.lust.benchDecayAmount());
};

//How many benched days one tag needs to reach its rank floor: 0 when it is there already, null when bench
//decay is switched off. Counted by stepping the real decay rather than dividing, so the count can never
//disagree with what the days will actually do (a division is one rounding error away from an extra day).
honeycomb.lust.benchDaysToFloor = function (exposure) {
	var floor = honeycomb.lust.rankFloorFor(exposure);
	if (exposure <= floor) return 0;
	if (honeycomb.lust.benchDecayAmount() <= 0) return null;
	var days = 0;
	var standing = exposure;
	while (standing > floor) {
		standing = honeycomb.lust.benchDecayedExposure(standing);
		days += 1;
	}
	return days;
};

//The character's counter: the most days any of their tags still needs, since "reduced to the rank floor"
//means all of them. Null when bench decay is switched off and some tag sits above its floor.
honeycomb.lust.characterBenchDaysToFloor = function (characterIndex) {
	var ledger = honeycomb.lust.exposureLedger(characterIndex, false);
	if (ledger == null || honeycomb.lust.hasFortitude(characterIndex)) return 0;
	var most = 0;
	for (var tagIndex in ledger) {
		if (Object.prototype.hasOwnProperty.call(ledger, tagIndex) == false) continue;
		if (honeycomb.lust.isWeaknessTag(tagIndex) == false) continue;
		var days = honeycomb.lust.benchDaysToFloor(Math.min(ledger[tagIndex], honeycomb.lust.topThreshold()));
		if (days == null) return null;
		most = Math.max(most, days);
	}
	return most;
};

//How much exposure stands above the character's rank floors, summed over every tag.
honeycomb.lust.exposureAboveFloor = function (characterIndex) {
	var ledger = honeycomb.lust.exposureLedger(characterIndex, false);
	var total = 0;
	if (ledger == null || honeycomb.lust.hasFortitude(characterIndex)) return total;
	for (var tagIndex in ledger) {
		if (Object.prototype.hasOwnProperty.call(ledger, tagIndex) == false) continue;
		if (honeycomb.lust.isWeaknessTag(tagIndex) == false) continue;
		//Exposure past the top rank's threshold does nothing, so it is never charged for.
		var exposure = Math.min(ledger[tagIndex], honeycomb.lust.topThreshold());
		total += Math.max(0, exposure - honeycomb.lust.rankFloorFor(exposure));
	}
	return total;
};

//The personal experience that pays every tag down to its floor at once. 0 when there is nothing to pay.
honeycomb.lust.floorResetCost = function (characterIndex) {
	var above = honeycomb.lust.exposureAboveFloor(characterIndex);
	if (above <= 0) return 0;
	return Math.ceil(above * honeycomb.tuning.lust.floorResetExperiencePerExposure);
};

//Why the reset cannot be bought right now, or null when it can: "nothingToReset", "runLive" (it is a
//between-runs purchase, so the ledger cannot move under a fight), or "notEnoughExperience".
honeycomb.lust.floorResetRefusal = function (characterIndex) {
	var cost = honeycomb.lust.floorResetCost(characterIndex);
	if (cost <= 0) return "nothingToReset";
	if (honeycomb.state != null && honeycomb.state.run != null) return "runLive";
	if (honeycomb.progression == null || honeycomb.progression.personalExperience(characterIndex) < cost) return "notEnoughExperience";
	return null;
};

//Pays the character's own experience and sets every tag to its rank floor. Returns the refusal, or null
//when it happened.
honeycomb.lust.resetToFloor = function (characterIndex) {
	var refusal = honeycomb.lust.floorResetRefusal(characterIndex);
	if (refusal != null) return refusal;
	if (honeycomb.forecast != null && honeycomb.forecast.active == true) return "forecast";
	honeycomb.progression.addPersonalExperience(characterIndex, -honeycomb.lust.floorResetCost(characterIndex));
	var ledger = honeycomb.lust.exposureLedger(characterIndex, false);
	for (var tagIndex in ledger) {
		if (Object.prototype.hasOwnProperty.call(ledger, tagIndex) == false) continue;
		ledger[tagIndex] = honeycomb.lust.rankFloorFor(ledger[tagIndex]);
	}
	return null;
};

//Called as days pass (honeycomb.map.enterNode). Every character with a ledger who is not in `run`'s party
//loses `days` days' worth on every tag. Returns [{characterIndex, tag, before, after}] for whatever moved.
honeycomb.lust.applyBenchDecay = function (run, days) {
	var changeArray = [];
	if (run == null || days == null || days <= 0) return changeArray;
	if (honeycomb.forecast != null && honeycomb.forecast.active == true) return changeArray;
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	if (profile == null || profile.lustExposureArray == null) return changeArray;

	var fieldedArray = [];
	var partyArray = run.partyArray == null ? [] : run.partyArray;
	for (var memberIndex = 0; memberIndex < partyArray.length; memberIndex++) {
		fieldedArray.push(partyArray[memberIndex].characterIndex);
	}
	for (var characterIndex in profile.lustExposureArray) {
		if (Object.prototype.hasOwnProperty.call(profile.lustExposureArray, characterIndex) == false) continue;
		if (fieldedArray.indexOf(characterIndex) >= 0) continue;
		var ledger = profile.lustExposureArray[characterIndex];
		for (var tagIndex in ledger) {
			if (Object.prototype.hasOwnProperty.call(ledger, tagIndex) == false) continue;
			var before = ledger[tagIndex];
			var after = before;
			for (var dayIndex = 0; dayIndex < days; dayIndex++) after = honeycomb.lust.benchDecayedExposure(after);
			if (after == before) continue;
			ledger[tagIndex] = after;
			changeArray.push({ characterIndex: characterIndex, tag: tagIndex, before: before, after: after });
		}
	}
	return changeArray;
};

//Marks an entity as out of the fight when its health runs out.
honeycomb.checkDeath = function (target, context) {
	if (target == null || target.downed == true) return false;
	if (target.health > 0) return false;
	//A player character is never killed, only broken. It falls out of the break test for free -- lust >=
	//health is true at 0 >= 0 -- so anyone at no health is already broken by the time this runs, and
	//death would only be a second, uglier name for the same moment. Keyed on the full Broken STATE, not
	//on taking lust: enemies take lust too and still die.
	if (honeycomb.entityUsesLust(target) == true && honeycomb.entityBreakBehavior(target) == "state") {
		target.health = 0;
		honeycomb.checkBreak(target, context);
		return false;
	}
	target.health = 0;
	honeycomb.markDowned(target, context, "health");
	return true;
};

//OUT OF THE FIGHT. The one door both a death and a defeating break go through, so every hook and the log
//hear both alike. `cause` ("health" or "broken") rides on the log entry.
honeycomb.markDowned = function (target, context, cause) {
	target.downed = true;
	honeycomb.fireEntityHooks("onDeath", { entity: target, context: context });
	//A death is a world event as well as an entity one: relics that react to an enemy falling are
	//not attached to that enemy, so they need their own dispatch.
	honeycomb.fireRunHooks(target.side == "enemy" ? "onEnemyDowned" : "onAllyDowned",
		{ entity: target, context: context });
	//ON-KILL HEAL (tree node "Feast"): an enemy falling heals every party member that names a value.
	if (target.side == "enemy") {
		var partyArray = honeycomb.entityArray("ally", context == null ? null : context.combat);
		for (var memberIndex = 0; memberIndex < partyArray.length; memberIndex++) {
			var onKillHeal = honeycomb.memberFieldTotal(partyArray[memberIndex], "onKillHeal");
			if (onKillHeal > 0) honeycomb.healEntity(partyArray[memberIndex], onKillHeal, context);
		}
	}
	honeycomb.logEvent(context, { type: "downed", targetId: target.instanceId, side: target.side, cause: cause });
};

//---------------------------------------------------------------------------------------------------
//Statuses
//---------------------------------------------------------------------------------------------------
honeycomb.statusStacks = function (entity, statusIndex) {
	if (entity == null || entity.statusArray == null) return 0;
	for (var statusIndex2 = 0; statusIndex2 < entity.statusArray.length; statusIndex2++) {
		if (entity.statusArray[statusIndex2].index == statusIndex) return entity.statusArray[statusIndex2].stacks;
	}
	return 0;
};

honeycomb.applyStatus = function (entity, statusIndex, stacks, context) {
	if (entity == null || stacks === 0) return;
	var definition = honeycomb.requireDefinition(honeycomb.statusArray, statusIndex, "honeycomb.statusArray");
	if (definition == null) return;
	if (entity.statusArray == null) entity.statusArray = [];

	//A status may refuse to land, which is how immunities and artifacts are expressed.
	if (definition.canApply != null && definition.canApply({ entity: entity, stacks: stacks, context: context }) == false) {
		honeycomb.logEvent(context, { type: "statusBlocked", targetId: entity.instanceId, status: statusIndex });
		return;
	}
	//FIRST CLEANSE (tree node "First Rites"): the first debuff on this character each combat is refused.
	//The combat object itself is the once-per-fight marker, so no reset step is needed.
	if (context != null && context.combat != null &&
		honeycomb.characterFieldFlag(entity.characterIndex, "firstCleanse") == true &&
		honeycomb.statusPolarity(definition) < 0 &&
		entity.firstCleanseCombat !== context.combat) {
		entity.firstCleanseCombat = context.combat;
		honeycomb.logEvent(context, { type: "statusBlocked", targetId: entity.instanceId, status: statusIndex });
		return;
	}

	var existing = null;
	for (var scanIndex = 0; scanIndex < entity.statusArray.length; scanIndex++) {
		if (entity.statusArray[scanIndex].index == statusIndex) { existing = entity.statusArray[scanIndex]; break; }
	}

	if (existing == null) {
		existing = { index: statusIndex, stacks: 0 };
		entity.statusArray.push(existing);
	}
	//A status given OUTSIDE a fight -- an event's Regeneration, a shrine's blessing -- is CARRIED into
	//the next one rather than wiped as that fight begins, or the event's promise would be empty. It is
	//then an ordinary combat status and goes when that fight ends. See clearCombatStatuses.
	if (context == null || context.combat == null) existing.carried = true;

	existing.stacks += stacks;
	if (definition.maximumStacks != null && existing.stacks > definition.maximumStacks) {
		existing.stacks = definition.maximumStacks;
	}

	honeycomb.logEvent(context, {
		type: "status",
		targetId: entity.instanceId,
		status: statusIndex,
		stacks: existing.stacks,
		delta: stacks,
	});

	if (definition.hooks != null && typeof definition.hooks.onApply === "function") {
		definition.hooks.onApply({ entity: entity, stacks: stacks, context: context });
	}

	//A status landing is a world event: Heady Spores hears the party's Poison arrive on an enemy whoever
	//applied it. Only growth counts, and only inside a fight.
	if (stacks > 0 && context != null && context.combat != null) {
		honeycomb.fireRunHooks("onStatusApplied", {
			entity: entity, source: context.source == null ? null : context.source,
			//Not `stacks`: every hook pass writes the HOLDER's stacks there.
			statusIndex: statusIndex, appliedStacks: stacks, context: context,
		});
	}

	//A status reduced to nothing is removed outright, so the icon row never shows a zero.
	if (existing.stacks <= 0) honeycomb.removeStatus(entity, statusIndex, null, context);
};

//`options.pace` names a beat pace (tuning.animation.beatPaceMsMap) for the log entry this writes, for a
//removal that is part of another beat rather than a moment of its own -- poison's decay inside its own
//tick. Omitted, the replay pays the status pulse in full.
honeycomb.removeStatus = function (entity, statusIndex, stacks, context, options) {
	if (entity == null || entity.statusArray == null) return;
	var pace = options == null ? null : options.pace;
	for (var scanIndex = entity.statusArray.length - 1; scanIndex >= 0; scanIndex--) {
		if (entity.statusArray[scanIndex].index != statusIndex) continue;
		if (stacks != null) {
			entity.statusArray[scanIndex].stacks -= stacks;
			if (entity.statusArray[scanIndex].stacks > 0) {
				honeycomb.logEvent(context, {
					type: "status", targetId: entity.instanceId, status: statusIndex,
					stacks: entity.statusArray[scanIndex].stacks, delta: -stacks, pace: pace,
				});
				return;
			}
		}
		var definition = honeycomb.findDefinition(honeycomb.statusArray, statusIndex);
		if (definition != null && definition.hooks != null && typeof definition.hooks.onRemove === "function") {
			definition.hooks.onRemove({ entity: entity, context: context });
		}
		entity.statusArray.splice(scanIndex, 1);
		honeycomb.logEvent(context, { type: "statusRemoved", targetId: entity.instanceId, status: statusIndex });
		return;
	}
};

//Ticks every status on one entity at the boundary its definition names. A status with a `decayTiming`
//loses `decayAmount` stacks (default 1) there; anything without one persists until something removes it.
//
//Decay is not only for duration statuses: an intensity status like Sundered can be given a decayTiming
//too, so it fades by a fixed amount each turn without needing a cleanse.
honeycomb.tickStatuses = function (entity, timingIndex, context) {
	if (entity == null || entity.statusArray == null) return;
	//Iterate a copy: a tick may remove the status it is ticking.
	var snapshotArray = entity.statusArray.slice();
	for (var scanIndex = 0; scanIndex < snapshotArray.length; scanIndex++) {
		var definition = honeycomb.findDefinition(honeycomb.statusArray, snapshotArray[scanIndex].index);
		if (definition == null) continue;
		if (definition.decayTiming == timingIndex) {
			honeycomb.removeStatus(entity, definition.index, definition.decayAmount == null ? 1 : definition.decayAmount, context);
		}
		//An intensity status that lasts only until a boundary ("2 Strength this turn") empties at it whole.
		if (definition.clearTiming == timingIndex && definition.stackType == "intensity") {
			honeycomb.removeStatus(entity, definition.index, null, context);
		}
	}
};

//Clears everything that does not persist between fights.
//`options.keepCarried` is the START of a fight: a status carried in from outside (see applyStatus)
//stays for this one fight and loses its carried mark, so the fight's end clears it like any other.
honeycomb.clearCombatStatuses = function (entity, context, options) {
	if (entity == null || entity.statusArray == null) return;
	var keepCarried = options != null && options.keepCarried == true;
	for (var scanIndex = entity.statusArray.length - 1; scanIndex >= 0; scanIndex--) {
		var held = entity.statusArray[scanIndex];
		var definition = honeycomb.findDefinition(honeycomb.statusArray, held.index);
		if (definition != null && definition.persistsBetweenCombats == true) continue;
		if (keepCarried && held.carried == true) { delete held.carried; continue; }
		honeycomb.removeStatus(entity, held.index, null, context);
	}
};

//---------------------------------------------------------------------------------------------------
//Character mechanics
//---------------------------------------------------------------------------------------------------
//Each character may own ONE mechanic -- a meter, a row of lights, a counter with a face -- declared in
//honeycomb.mechanicArray. Two kinds of bookkeeping, and the definition's `kind` decides which:
//  COUNTED ("bar", "orb")  a number on the member, in `meterArray`, moved by the mechanic's hooks
//  SLOTS   ("slots")       counted as well, and each point also holds a SYMBOL (a card type) in
//                          `symbolArray`, oldest first. The count is the number of filled slots, so every
//                          reader of a counted mechanic (conditions, spends, `mechanic` values) works as is.
//  TESTED  ("orbs")        nothing stored; each orb's `test` is asked when it is drawn
//Anything absent reads as zero, so a save written before mechanics existed needs no migration.
honeycomb.mechanicFor = function (entity) {
	if (entity == null || entity.characterIndex == null) return null;
	for (var scanIndex = 0; scanIndex < honeycomb.mechanicArray.length; scanIndex++) {
		if (honeycomb.mechanicArray[scanIndex].characterIndex == entity.characterIndex) return honeycomb.mechanicArray[scanIndex];
	}
	return null;
};

//Whether a character's mechanic is RUNNING. It begins with the Ability 1 tree node: with no ability there
//is no meter to build, so Resolve/Thirst/Stride do not tick before that node is bought.
honeycomb.mechanicActive = function (entity) {
	var mechanic = honeycomb.mechanicFor(entity);
	if (mechanic == null) return false;
	if (mechanic.abilityIndex == null) return true;
	//The meter runs once the character CARRIES their Ability 1. A training wheel does not stop it: it
	//only stops that ability's own effects from feeding it (honeycomb.mechanicSuppressedId, set while a
	//de-enabled ability resolves). "She now has to get that fuel from cards" -- so cards still fill it.
	return honeycomb.abilities != null && honeycomb.abilities.indexArray(entity).indexOf(mechanic.abilityIndex) >= 0;
};

//A mechanic's description with its own numbers written into it, so the tuning fields and the words
//can never drift apart. `{name}` placeholders name fields on the definition.
honeycomb.mechanicDescription = function (definition) {
	if (definition == null || definition.description == null) return "";
	return String(definition.description).replace(/\{(\w+)\}/g, function (whole, field) {
		if (field == "spend") return String(honeycomb.mechanicSpendAmount(definition.index));
		//Any other placeholder names a numeric field on the definition itself.
		if (typeof definition[field] === "number") return String(definition[field]);
		return whole;
	});
};

//How much of a mechanic the ability that spends it takes, for a description that wants to say so.
honeycomb.mechanicSpendAmount = function (mechanicIndex) {
	for (var scanIndex = 0; scanIndex < honeycomb.abilityArray.length; scanIndex++) {
		var spendArray = honeycomb.abilityArray[scanIndex].spendArray;
		for (var spendIndex = 0; spendIndex < (spendArray == null ? 0 : spendArray.length); spendIndex++) {
			if (spendArray[spendIndex].mechanic == mechanicIndex) return spendArray[spendIndex].amount;
		}
	}
	return 0;
};

honeycomb.mechanicValue = function (entity, mechanicIndex) {
	if (entity == null || entity.meterArray == null) return 0;
	var held = entity.meterArray[mechanicIndex];
	return held == null || held.value == null ? 0 : held.value;
};

//The member's own record for a mechanic, created on first use. `remainder` is scratch for a mechanic
//that converts at a rate (Resolve counts Temporary HP in fours and must remember the change).
honeycomb.mechanicCarryArray = function (entity, mechanicIndex) {
	if (entity.meterArray == null) entity.meterArray = {};
	if (entity.meterArray[mechanicIndex] == null) entity.meterArray[mechanicIndex] = { value: 0, remainder: 0 };
	var held = entity.meterArray[mechanicIndex];
	if (held.value == null) held.value = 0;
	if (held.remainder == null) held.remainder = 0;
	return held;
};

//Moves a counted mechanic and says so. Returns what actually moved, which is not the amount asked for
//when the meter is against its ceiling or its floor.
//What a self-cost actually takes: the loadout's multiplier (Crimson Covenant x2), then its flat cut
//(Thin Skin -1). Shared by the hit itself and by the card text that previews it.
honeycomb.selfDamageAmount = function (entity, amount) {
	if (entity == null || entity.characterIndex == null) return amount;
	var scaled = Math.floor(amount * honeycomb.memberFieldProduct(entity, "selfDamageMultiplier"));
	var reduction = honeycomb.memberFieldTotal(entity, "selfDamageReduction");
	return Math.max(0, scaled - reduction);
};

//How many times a fighter has lost health this fight. Kept on the combat, so it resets with the fight.
honeycomb.healthLossCount = function (entity, combat) {
	if (entity == null || combat == null || combat.healthLossCountMap == null) return 0;
	var held = combat.healthLossCountMap[entity.instanceId];
	return held == null ? 0 : held;
};

honeycomb.noteHealthLoss = function (entity, combat) {
	if (entity == null || combat == null) return;
	if (combat.healthLossCountMap == null) combat.healthLossCountMap = {};
	combat.healthLossCountMap[entity.instanceId] = honeycomb.healthLossCount(entity, combat) + 1;
};

//The member whose meter the resolving ability may not feed, or null. See honeycomb.mechanicActive.
honeycomb.mechanicSuppressedId = null;

honeycomb.addMechanic = function (entity, mechanicIndex, amount, context) {
	if (entity == null || amount === 0) return 0;
	//A training-wheeled Ability 1 no longer fuels its own meter; spending from it is still allowed.
	if (amount > 0 && honeycomb.mechanicSuppressedId != null && entity.instanceId === honeycomb.mechanicSuppressedId) return 0;
	var definition = honeycomb.findDefinition(honeycomb.mechanicArray, mechanicIndex);
	if (definition == null) return 0;
	var held = honeycomb.mechanicCarryArray(entity, mechanicIndex);
	var ceiling = definition.maximum == null ? Infinity : definition.maximum;
	var before = held.value;
	held.value = Math.max(0, Math.min(ceiling, held.value + amount));
	var moved = held.value - before;
	if (moved === 0) return 0;
	//A SLOTS mechanic loses its OLDEST symbols first when the count falls, so a spend or a reset empties the
	//slots in the order they filled.
	if (definition.kind == "slots" && held.symbolArray != null && held.symbolArray.length > held.value) {
		held.symbolArray.splice(0, held.symbolArray.length - held.value);
	}
	honeycomb.logEvent(context, { type: "mechanic", targetId: entity.instanceId, mechanic: mechanicIndex, value: held.value, delta: moved });
	return moved;
};

//Cassadora's Orb (AUDIT-01): fills one slot with `symbolIndex` (a card type). A full Orb takes
//nothing more. Returns whether a slot was filled; a training-wheeled Ability 1 fills none, as addMechanic says.
honeycomb.addMechanicSymbol = function (entity, mechanicIndex, symbolIndex, context) {
	if (entity == null || symbolIndex == null) return false;
	if (honeycomb.addMechanic(entity, mechanicIndex, 1, context) !== 1) return false;
	var held = honeycomb.mechanicCarryArray(entity, mechanicIndex);
	if (held.symbolArray == null) held.symbolArray = [];
	held.symbolArray.push(symbolIndex);
	return true;
};

//The symbols a SLOTS mechanic holds, oldest first. A copy, so a reader cannot rearrange the slots.
honeycomb.mechanicSymbolArray = function (entity, mechanicIndex) {
	if (entity == null || entity.meterArray == null || entity.meterArray[mechanicIndex] == null) return [];
	var held = entity.meterArray[mechanicIndex];
	return held.symbolArray == null ? [] : held.symbolArray.slice(0, held.value);
};

//The symbol a move stands for: its primary card type. An intent Cassadora changes fills her Orb with this.
honeycomb.cardSymbolIndex = function (cardIndex) {
	var card = honeycomb.findDefinition(honeycomb.cardArray, cardIndex);
	if (card == null) return null;
	var typeArray = honeycomb.cardTypeIndexArray(card);
	return typeArray.length === 0 ? null : typeArray[0];
};

//Spends a counted mechanic, refusing rather than going into debt. Returns whether it was paid.
honeycomb.spendMechanic = function (entity, mechanicIndex, amount, context) {
	if (honeycomb.mechanicValue(entity, mechanicIndex) < amount) return false;
	honeycomb.addMechanic(entity, mechanicIndex, -amount, context);
	return true;
};

//Which of a TESTED mechanic's orbs are lit right now, as [{orb, lit}].
honeycomb.mechanicOrbStateArray = function (entity, combat) {
	var definition = honeycomb.mechanicFor(entity);
	if (definition == null || definition.orbArray == null) return [];
	var result = [];
	for (var scanIndex = 0; scanIndex < definition.orbArray.length; scanIndex++) {
		var orb = definition.orbArray[scanIndex];
		result.push({ orb: orb, lit: orb.test(entity, combat) == true });
	}
	return result;
};

honeycomb.mechanicOrbsLit = function (entity, combat) {
	var stateArray = honeycomb.mechanicOrbStateArray(entity, combat);
	var count = 0;
	for (var scanIndex = 0; scanIndex < stateArray.length; scanIndex++) {
		if (stateArray[scanIndex].lit == true) count += 1;
	}
	return count;
};

//Puts a counted mechanic back to nothing at the moment its definition names. Called for every party
//member as a fight begins, so a meter is per-fight unless it says `resetOn: "never"`.
honeycomb.resetMechanics = function (entity, timingIndex, context) {
	var definition = honeycomb.mechanicFor(entity);
	if (definition == null || definition.kind == "orbs") return;
	var resetOn = definition.resetOn == null ? "combatStart" : definition.resetOn;
	if (resetOn != timingIndex) return;
	var held = honeycomb.mechanicCarryArray(entity, definition.index);
	held.remainder = 0;
	if (held.value !== 0) honeycomb.addMechanic(entity, definition.index, -held.value, context);
};

//---------------------------------------------------------------------------------------------------
//Relics
//---------------------------------------------------------------------------------------------------
honeycomb.hasRelic = function (relicIndex) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return false;
	for (var relicIndex2 = 0; relicIndex2 < run.relicArray.length; relicIndex2++) {
		if (run.relicArray[relicIndex2].index == relicIndex) return true;
	}
	return false;
};

//`options.random` marks the log entry as a chance pick, which a preview shows as "a relic" rather
//than the one its dry run rolled.
honeycomb.grantRelic = function (relicIndex, context, options) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return false;
	var definition = honeycomb.requireDefinition(honeycomb.relicArray, relicIndex, "honeycomb.relicArray");
	if (definition == null) return false;
	if (definition.unique != false && honeycomb.hasRelic(relicIndex) == true) return false;

	//`counter` is the relic's own per-run scratch value: charges used, turns elapsed, whatever its
	//hooks want. Held here so a relic never needs state of its own.
	run.relicArray.push({ index: relicIndex, counter: 0 });
	if (definition.onGain != null) definition.onGain({ context: context });
	honeycomb.logEvent(context, { type: "relicGained", relic: relicIndex, random: options != null && options.random == true });
	//Finding a relic for the first time pays into the lifetime pool, so a run that ends badly still
	//leaves something behind.
	honeycomb.discovery.record("relic", relicIndex, context);
	return true;
};

//No duplicates: grantRelic refuses a unique relic the run already carries, which would leave an event
//choice that promised one paying nothing at all. Everything that GIVES a relic goes through here instead:
//a relic already carried pays experience into the global pool, and says so.
honeycomb.relicWouldDuplicate = function (relicIndex) {
	var definition = honeycomb.findDefinition(honeycomb.relicArray, relicIndex);
	return definition != null && definition.unique != false && honeycomb.hasRelic(relicIndex) == true;
};

//What a duplicate is worth instead: the relic's own figure, else tuning's.
honeycomb.duplicateRelicExperience = function (relicIndex) {
	var definition = honeycomb.findDefinition(honeycomb.relicArray, relicIndex);
	var amount = definition != null && definition.duplicateExperience != null
		? definition.duplicateExperience : honeycomb.tuning.progression.duplicateRelicExperience;
	return Math.round(amount * honeycomb.tuning.progression.experienceMultiplier);
};

//Gives the relic, or its worth in experience when it is already carried. `relicIndex` null means a
//random pick found nothing left to give. Returns whether a relic was actually granted.
honeycomb.grantRelicOrExperience = function (relicIndex, context, options) {
	var random = options != null && options.random == true;
	if (relicIndex != null && honeycomb.relicWouldDuplicate(relicIndex) == false) {
		return honeycomb.grantRelic(relicIndex, context, options);
	}
	var amount = honeycomb.tuning.progression.experienceEnabled == true ? honeycomb.duplicateRelicExperience(relicIndex) : 0;
	if (amount > 0) honeycomb.addResource("experience", amount);
	honeycomb.logEvent(context, { type: "relicDuplicate", relic: relicIndex, experience: amount, random: random });
	return false;
};

//Relics a random pick may land on: any the party does not carry, narrowed to one `rarity` and/or `pool`
//when asked. A relic's POOL says where it can turn up by chance: omitted (or "common") means treasure
//and shops as well as events; "event" keeps it out of treasure and shops, so an event can promise it
//without the party already having found it in a chest.
honeycomb.uncarriedRelicArray = function (rarityIndex, poolIndex) {
	var result = [];
	for (var scanIndex = 0; scanIndex < honeycomb.relicArray.length; scanIndex++) {
		var relic = honeycomb.relicArray[scanIndex];
		if (honeycomb.relicWouldDuplicate(relic.index) == true) continue;
		if (rarityIndex != null && relic.rarity != rarityIndex) continue;
		if (poolIndex != null && honeycomb.relicPool(relic) != poolIndex) continue;
		if (honeycomb.relicOfferable(relic) == false) continue;
		result.push(relic);
	}
	return result;
};

//Whether chance may offer a relic to this party: its `offerCondition`, asked with no source.
//A sister mechanic's relic names its character, so a party without Nettle is never handed Nettle's relic.
//Only CHANCE is gated -- an event that names a relic outright still gives it.
honeycomb.relicOfferable = function (relic) {
	if (relic == null) return false;
	if (relic.offerCondition == null) return true;
	return honeycomb.testCondition(relic.offerCondition, honeycomb.newEffectContext({}));
};

honeycomb.relicPool = function (relic) {
	return relic == null || relic.pool == null ? "common" : relic.pool;
};

honeycomb.removeRelic = function (relicIndex) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return false;
	for (var scanIndex = run.relicArray.length - 1; scanIndex >= 0; scanIndex--) {
		if (run.relicArray[scanIndex].index != relicIndex) continue;
		run.relicArray.splice(scanIndex, 1);
		return true;
	}
	return false;
};

//---------------------------------------------------------------------------------------------------
//Run deck manipulation
//---------------------------------------------------------------------------------------------------
//Permanent changes, as distinct from the in-combat piles. These are what a map event or a reward
//screen alters.
honeycomb.addCardToRunDeck = function (cardIndex, ownerInstanceId) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return null;
	//EVERY PERMANENT ADDITION PASSES HERE, so this is the one door a banished card has to be stopped at.
	//A banished card is replaced by the FALLBACK, which removes itself -- a screen still has something
	//to take, and the deck size is unchanged.
	var definition = honeycomb.findDefinition(honeycomb.cardArray, cardIndex);
	if (definition != null && definition.fallback != true && honeycomb.cardIsBanished(cardIndex) == true) {
		cardIndex = honeycomb.fallbackCardIndex();
		ownerInstanceId = null;
		definition = honeycomb.findDefinition(honeycomb.cardArray, cardIndex);
	}
	//The card telemetry's one door: every permanent addition passes here, whatever granted it. A forecast
	//is excluded -- it rolls its changes back, and counting them would invent evidence.
	if (honeycomb.forecast == null || honeycomb.forecast.active != true) {
		honeycomb.telemetry.noteCard("deckAddArray", cardIndex);
	}
	var resolvedOwner = ownerInstanceId == null ? honeycomb.defaultOwnerFor(cardIndex) : ownerInstanceId;
	var instance = honeycomb.newCardInstance(cardIndex, resolvedOwner);
	//Marked acquired so rebuilding the deck from party pools does not discard it.
	instance.acquired = true;
	run.deckArray.push(instance);
	//Holding a card the profile has never held is a discovery. Starting pools are met in newRun.
	honeycomb.discovery.meet("card", cardIndex, null);
	//A fallback card removes itself at once: it existed only so a screen was not empty.
	if (definition != null && definition.fallback == true) {
		var landing = run.deckArray.indexOf(instance);
		if (landing >= 0) run.deckArray.splice(landing, 1);
		honeycomb.logEvent(honeycomb.newEffectContext({}), { type: "deckCardRemoved", card: cardIndex, cardId: instance.instanceId });
	}
	return instance;
};

//---------------------------------------------------------------------------------------------------
//Card banishing
//---------------------------------------------------------------------------------------------------
//A banished card is struck off THIS run's offer pools -- rewards, the shop, the journal, run-start
//random cards, random replacements and transforms. The list is run state, so it resets with the run.
honeycomb.cardIsBanished = function (cardIndex) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || run.banishedCardArray == null || cardIndex == null) return false;
	return run.banishedCardArray.indexOf(cardIndex) >= 0;
};

//The card standing in when nothing legal can be offered. Configured in tuning.
honeycomb.fallbackCardIndex = function () {
	return honeycomb.tuning.reward.fallbackCardIndex;
};

//Whether a banish button should even be drawn for a card: a fallback cannot be banished, and a card
//already on the list has nothing left to strike off. Every banish button site reads this, so the rule
//lives in one place.
honeycomb.cardCanBeBanished = function (cardIndex) {
	if (cardIndex == null) return false;
	var definition = honeycomb.findDefinition(honeycomb.cardArray, cardIndex);
	if (definition != null && definition.fallback == true) return false;
	return honeycomb.cardIsBanished(cardIndex) == false;
};

//Spends one banish and records the card. Returns true when something was banished. A card already off
//the list, or a fallback, or no banishes left, refuses.
honeycomb.banishCard = function (cardIndex) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || cardIndex == null) return false;
	if (honeycomb.getResource("banish") <= 0) return false;
	if (honeycomb.cardIsBanished(cardIndex) == true) return false;
	var definition = honeycomb.findDefinition(honeycomb.cardArray, cardIndex);
	if (definition != null && definition.fallback == true) return false;
	if (honeycomb.spend({ banish: 1 }) == false) return false;
	if (run.banishedCardArray == null) run.banishedCardArray = [];
	run.banishedCardArray.push(cardIndex);
	return true;
};

//Who a newly gained card belongs to when the granting site does not say.
//
//A reward, event or shop card carrying a characterIndex is handed to that member if they are in the
//party. Without this, a Blood Pact bought from a shop cost nobody any health: its self-damage aimed
//at "owner", found nobody, and silently did nothing while the card still paid out.
//Neutral cards genuinely belong to no one and stay ownerless; tuning.deck.ownerlessFallback decides
//what "owner" means for them.
honeycomb.defaultOwnerFor = function (cardIndex) {
	if (honeycomb.tuning.deck.assignOwnerFromCharacter != true) return null;
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	var definition = honeycomb.findDefinition(honeycomb.cardArray, cardIndex);
	if (run == null || definition == null || definition.characterIndex == null) return null;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		if (run.partyArray[memberIndex].characterIndex == definition.characterIndex) {
			return run.partyArray[memberIndex].instanceId;
		}
	}
	return null;
};

//Removes by instance when given one, otherwise the first copy of a definition.
//Takes one card out of the run deck: the named instance, else the first copy of `cardIndex`. Returns the
//instance removed (so whatever asked can SHOW which card went), or null.
honeycomb.removeCardFromRunDeck = function (cardInstanceId, cardIndex) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return null;
	for (var scanIndex = 0; scanIndex < run.deckArray.length; scanIndex++) {
		var card = run.deckArray[scanIndex];
		var matches = cardInstanceId != null ? card.instanceId == cardInstanceId : card.cardIndex == cardIndex;
		if (matches == false) continue;
		run.deckArray.splice(scanIndex, 1);
		return card;
	}
	return null;
};

//A card of the run deck picked at random from the event stream, for "you will not get to choose which".
//Null for an empty deck.
//Whether ORDINARY removal may take a card: the campfire, the shop, a random trade. A curse that says it
//cannot be removed by ordinary means (`unremovable` on its definition) refuses all of those; only an
//effect naming the card outright -- a cleansing that knows what it is cleansing -- still can.
honeycomb.cardIsRemovable = function (instance) {
	if (instance == null) return false;
	var definition = honeycomb.findDefinition(honeycomb.cardArray, instance.cardIndex);
	return definition == null || definition.unremovable != true;
};

//REPLACES a run-deck card with a different card for the same character: Fortune Telling's "a random
//common or rare", Gamble's "a random card of the same rarity". The instance keeps its slot and owner;
//only what it IS changes. A character with no eligible replacement leaves the card alone.
honeycomb.transformRunDeckCard = function (cardInstanceId, entry, context) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return false;
	for (var scanIndex = 0; scanIndex < run.deckArray.length; scanIndex++) {
		var instance = run.deckArray[scanIndex];
		if (instance.instanceId != cardInstanceId) continue;
		var definition = honeycomb.findDefinition(honeycomb.cardArray, instance.cardIndex);
		var characterIndex = definition == null ? null : definition.characterIndex;
		if (characterIndex == null) return false;
		var rarityArray = entry.rarityArray;
		if (rarityArray == null && entry.sameRarity == true && definition.rarity != null) rarityArray = [definition.rarity];
		var candidateArray = honeycomb.characterCardPoolArray(characterIndex, rarityArray, instance.cardIndex);
		var picked = honeycomb.rng.pick(honeycomb.tuning.rng.streamArray.mapEvent, candidateArray);
		if (picked == null) return false;
		instance.cardIndex = picked.index;
		instance.upgradeLevel = 0;
		instance.upgradePath = null;
		honeycomb.discovery.meet("card", picked.index, null);
		honeycomb.logEvent(context, { type: "cardTransformed", cardId: instance.instanceId, card: picked.index });
		return true;
	}
	return false;
};

//A character's own offerable cards, optionally limited to a set of rarities and excluding one index.
//Content tables only: starter, enemy, broken and special are never a transform target.
honeycomb.characterCardPoolArray = function (characterIndex, rarityArray, excludeIndex) {
	var result = [];
	for (var scanIndex = 0; scanIndex < honeycomb.cardArray.length; scanIndex++) {
		var card = honeycomb.cardArray[scanIndex];
		if (card.characterIndex != characterIndex) continue;
		if (card.index == excludeIndex) continue;
		if (["starter", "enemy", "broken", "special"].indexOf(card.rarity) >= 0) continue;
		if (honeycomb.cardIsBanished(card.index) == true) continue;
		if (rarityArray != null && rarityArray.indexOf(card.rarity) < 0) continue;
		result.push(card);
	}
	return result;
};

//A random deck card that ordinary removal may take. Null when nothing qualifies.
honeycomb.randomRunDeckCard = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return null;
	var candidateArray = [];
	for (var scanIndex = 0; scanIndex < run.deckArray.length; scanIndex++) {
		if (honeycomb.cardIsRemovable(run.deckArray[scanIndex])) candidateArray.push(run.deckArray[scanIndex]);
	}
	if (candidateArray.length === 0) return null;
	return honeycomb.rng.pick(honeycomb.tuning.rng.streamArray.mapEvent, candidateArray);
};

//Which path: a card offering several upgrade ladders asks the player which one the first time it is
//upgraded; one that offers one, or has already committed, answers itself and never shows a question.
//Asked through the ordinary choice system, so it rewinds and replays like the rest.
//Returns the chosen path index, or null when there is nothing to choose.
honeycomb.chooseUpgradePath = function (cardInstanceId, context) {
	var instance = honeycomb.combat.cardInstance(cardInstanceId);
	if (honeycomb.cardAwaitsUpgradePath(instance) == false) return instance == null ? null : honeycomb.cardUpgradePathNow(instance);

	var definition = honeycomb.findDefinition(honeycomb.cardArray, instance.cardIndex);
	var pathArray = honeycomb.cardUpgradePathArray(definition);
	var optionArray = [];
	for (var scanIndex = 0; scanIndex < pathArray.length; scanIndex++) {
		var path = pathArray[scanIndex];
		//Each option previews the card as that path would leave it, so the choice is between two visible
		//results rather than two names.
		var preview = honeycomb.resolveCard({
			instanceId: null, cardIndex: instance.cardIndex, ownerInstanceId: instance.ownerInstanceId,
			upgradeLevel: (instance.upgradeLevel == null ? 0 : instance.upgradeLevel) + 1, upgradePath: path.index,
		});
		optionArray.push({
			index: path.index,
			name: path.name,
			description: path.description != null ? path.description
				: (preview == null ? "" : preview.name + ": " + honeycomb.cardText(preview)),
		});
	}

	var answer = honeycomb.requestChoice(context, {
		index: "option",
		prompt: "Which way should " + (definition == null ? "it" : definition.name) + " grow?",
		minimum: 1,
		maximum: 1,
		optionArray: optionArray,
	});
	if (answer == null) return null;
	return answer.chosenArray == null || answer.chosenArray.length === 0 ? null : answer.chosenArray[0];
};

//`pathIndex` is which ladder to climb, for a card that offers several. It is
//recorded on the copy the first time and ignored afterwards: a card commits to a path, and the rest of
//its levels follow that one.
honeycomb.upgradeCardInstance = function (cardInstanceId, levels, pathIndex) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return false;
	for (var scanIndex = 0; scanIndex < run.deckArray.length; scanIndex++) {
		var instance = run.deckArray[scanIndex];
		if (instance.instanceId != cardInstanceId) continue;
		var definition = honeycomb.findDefinition(honeycomb.cardArray, instance.cardIndex);
		//A starter basic is changed only by the progression tree, never here; an outfit signature climbs its own ladder.
		if (honeycomb.cardIsUpgradable(definition) == false) return false;
		if (pathIndex != null && instance.upgradePath == null &&
			honeycomb.findDefinition(honeycomb.cardUpgradePathArray(definition), pathIndex) != null) {
			instance.upgradePath = pathIndex;
		}
		var ceiling = honeycomb.cardUpgradeArray(definition, instance.upgradePath).length;
		instance.upgradeLevel = Math.min(instance.upgradeLevel + levels, ceiling);
		return true;
	}
	return false;
};
