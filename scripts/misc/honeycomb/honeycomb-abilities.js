//===================================================================================================
//HONEYCOMB CATACOMBS -- abilities engine
//===================================================================================================
//The rules behind a character's spells. The table itself is honeycomb-content-abilities.js.
//
//WHAT AN ABILITY IS, MECHANICALLY
//An ability is a non-card action owned by a party member. It resolves through exactly the same
//effect layer a card does -- same target modes, same effect list, same log -- so an ability and a
//card can never disagree about what "deal 6 damage" means, and a new ability needs no engine change.
//
//The one thing an ability has that a card does not is CHARGES, and charges are per-member rather than
//a shared pool. That is what makes an ability belong to somebody: Severine running out of Siphon does not
//stop Nettle casting Blight.
//
//WHERE THE STATE LIVES
//WHICH abilities a member has is derived, exactly as their card pool is -- from the character's
//startingAbilityArray with outfit and equipment modifiers laid over it. Storing it would let it drift
//the moment a costume changed.
//HOW MANY CHARGES each holds is real state, on the member as `abilityChargeArray`. It is reconciled
//against the derived list rather than rebuilt, so changing an outfit does not silently refill a spent
//ability -- and an ability that arrives from new equipment starts full.
window.honeycomb = window.honeycomb || {};

honeycomb.abilities = {};

//---------------------------------------------------------------------------------------------------
//What a member has
//---------------------------------------------------------------------------------------------------
//The ability indices one member carries, after outfits and equipment. Order is pool order.
honeycomb.abilities.indexArray = function (selection) {
	var entryArray = honeycomb.memberAbilityEntryArray(selection);
	var result = [];
	for (var scanIndex = 0; scanIndex < entryArray.length; scanIndex++) {
		var definition = honeycomb.findDefinition(honeycomb.abilityArray, entryArray[scanIndex].index);
		if (definition == null) continue;
		//An ability may be gated the way an outfit is; a locked one is not carried at all.
		if (definition.unlockCondition != null &&
			honeycomb.testCondition(definition.unlockCondition, honeycomb.newEffectContext({})) == false) continue;
		result.push(definition.index);
	}
	return result;
};

//The ability as THIS member holds it, after any `abilityUpgradeArray` a selected tree node carries. The
//index never changes -- a training wheel repurposes the ability rather than swapping it -- so the
//override supplies the new effect list and may drop the mechanic gate. Returns the shared definition
//when nothing overrides it, which is the common case.
honeycomb.abilities.definitionFor = function (member, abilityIndex) {
	var definition = honeycomb.findDefinition(honeycomb.abilityArray, abilityIndex);
	if (definition == null) return null;
	var overrideArray = honeycomb.abilityUpgradeArrayFor == null ? [] : honeycomb.abilityUpgradeArrayFor(member, abilityIndex);
	if (overrideArray.length === 0) return definition;
	var resolved = {};
	for (var fieldIndex in definition) {
		if (Object.prototype.hasOwnProperty.call(definition, fieldIndex)) resolved[fieldIndex] = definition[fieldIndex];
	}
	var changedEffects = false;
	var suppliedText = false;
	for (var overrideScan = 0; overrideScan < overrideArray.length; overrideScan++) {
		var override = overrideArray[overrideScan];
		for (var overrideField in override) {
			if (Object.prototype.hasOwnProperty.call(override, overrideField) == false) continue;
			//`ability` is the selector and `disableMechanic` is read by abilityHasEnable; neither is a
			//definition field.
			if (overrideField == "ability" || overrideField == "disableMechanic") continue;
			if (overrideField == "effectArray") changedEffects = true;
			if (overrideField == "text") suppliedText = true;
			resolved[overrideField] = override[overrideField];
		}
	}
	//A training wheel repurposes the ability, so the ORIGINAL hand-written text would lie about it. When
	//an override changes the effects and gives no text of its own, drop it and let the text regenerate.
	if (changedEffects == true && suppliedText == false) resolved.text = null;
	return resolved;
};

//Whether holding this ability still ENABLES its character's mechanic. Training wheels keep the ability
//but remove the enable: the meter keeps running, but the ability's own effects no longer feed it (see
//honeycomb.abilities.use), so it has to be fed by cards instead. False when the ability is not carried.
honeycomb.abilityHasEnable = function (selection, abilityIndex) {
	if (honeycomb.abilities.indexArray(selection).indexOf(abilityIndex) < 0) return false;
	var overrideArray = honeycomb.abilityUpgradeArrayFor == null ? [] : honeycomb.abilityUpgradeArrayFor(selection, abilityIndex);
	for (var scanIndex = 0; scanIndex < overrideArray.length; scanIndex++) {
		if (overrideArray[scanIndex].disableMechanic == true) return false;
	}
	return true;
};

//The member's abilities as {index, definition, charges, chargeMaximum}, ready to render.
honeycomb.abilities.memberAbilityArray = function (member) {
	honeycomb.abilities.reconcile(member);
	var indexArray = honeycomb.abilities.indexArray(member);
	var result = [];
	for (var scanIndex = 0; scanIndex < indexArray.length; scanIndex++) {
		var definition = honeycomb.abilities.definitionFor(member, indexArray[scanIndex]);
		if (definition == null) continue;
		result.push({
			index: definition.index,
			definition: definition,
			charges: honeycomb.abilities.charges(member, definition.index),
			chargeMaximum: definition.chargeMaximum,
		});
	}
	return result;
};

//Brings a member's stored charges into agreement with the abilities they actually have. New abilities
//arrive full; abilities no longer carried are forgotten; everything else keeps what it had.
honeycomb.abilities.reconcile = function (member) {
	if (member == null) return;
	if (member.abilityChargeArray == null) member.abilityChargeArray = [];
	var indexArray = honeycomb.abilities.indexArray(member);

	for (var scanIndex = 0; scanIndex < indexArray.length; scanIndex++) {
		if (honeycomb.abilities.findCharge(member, indexArray[scanIndex]) != null) continue;
		var definition = honeycomb.abilities.definitionFor(member, indexArray[scanIndex]);
		member.abilityChargeArray.push({
			index: indexArray[scanIndex],
			charges: definition == null ? 0 : definition.chargeMaximum,
		});
	}

	for (var dropIndex = member.abilityChargeArray.length - 1; dropIndex >= 0; dropIndex--) {
		if (indexArray.indexOf(member.abilityChargeArray[dropIndex].index) >= 0) continue;
		member.abilityChargeArray.splice(dropIndex, 1);
	}
};

honeycomb.abilities.findCharge = function (member, abilityIndex) {
	if (member == null || member.abilityChargeArray == null) return null;
	for (var scanIndex = 0; scanIndex < member.abilityChargeArray.length; scanIndex++) {
		if (member.abilityChargeArray[scanIndex].index == abilityIndex) return member.abilityChargeArray[scanIndex];
	}
	return null;
};

honeycomb.abilities.charges = function (member, abilityIndex) {
	var entry = honeycomb.abilities.findCharge(member, abilityIndex);
	return entry == null ? 0 : entry.charges;
};

honeycomb.abilities.setCharges = function (member, abilityIndex, value) {
	var entry = honeycomb.abilities.findCharge(member, abilityIndex);
	if (entry == null) return 0;
	var definition = honeycomb.abilities.definitionFor(member, abilityIndex);
	var ceiling = definition == null ? value : definition.chargeMaximum;
	entry.charges = Math.max(0, Math.min(value, ceiling));
	return entry.charges;
};

//---------------------------------------------------------------------------------------------------
//Recharging
//---------------------------------------------------------------------------------------------------
//Fired at the moments named by `rechargeOn`. The timing names are content, not code: a new one is a
//new string here and a call at the matching site.
honeycomb.abilities.recharge = function (timingIndex) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return 0;
	var refilled = 0;

	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		var member = run.partyArray[memberIndex];
		honeycomb.abilities.reconcile(member);
		var indexArray = honeycomb.abilities.indexArray(member);
		for (var scanIndex = 0; scanIndex < indexArray.length; scanIndex++) {
			var definition = honeycomb.abilities.definitionFor(member, indexArray[scanIndex]);
			if (definition == null || definition.rechargeOn != timingIndex) continue;
			var before = honeycomb.abilities.charges(member, definition.index);
			var amount = definition.rechargeAmount == null ? definition.chargeMaximum : definition.rechargeAmount;
			if (honeycomb.abilities.setCharges(member, definition.index, before + amount) > before) refilled += 1;
		}
	}
	return refilled;
};

//---------------------------------------------------------------------------------------------------
//Requirements
//---------------------------------------------------------------------------------------------------
//An ability may carry `requirementArray`: [{condition, text}]. Each entry is ONE thing that must be
//true, written in the same condition language cards and events use -- so a requirement can ask about a
//character's mechanic, a status, a relic, a rank, the party, anything already expressible, and a new
//kind of requirement needs no ability code. `text` is what the player is told; omitted, it is
//generated from the condition.
//
//They are reported one by one rather than as a single yes/no, because "not right now" is useless: the
//plate lists each requirement with a tick or a cross, so it is clear WHAT to go and do. `usableCondition`
//is still honoured as the one-line form.
honeycomb.abilities.requirementStateArray = function (member, abilityIndex, combat) {
	//The member's own version: a training wheel may replace the requirements.
	var definition = honeycomb.abilities.definitionFor(member, abilityIndex);
	if (definition == null || definition.requirementArray == null) return [];
	var context = honeycomb.newEffectContext({ combat: combat, source: member });
	var result = [];
	for (var scanIndex = 0; scanIndex < definition.requirementArray.length; scanIndex++) {
		var requirement = definition.requirementArray[scanIndex];
		result.push({
			requirement: requirement,
			text: honeycomb.abilities.requirementText(requirement),
			met: honeycomb.testCondition(requirement.condition, context) == true,
		});
	}
	return result;
};

honeycomb.abilities.requirementText = function (requirement) {
	if (requirement == null) return "";
	if (requirement.text != null) return requirement.text;
	return "Requires " + honeycomb.describeCondition(requirement.condition) + ".";
};

//What using an ability COSTS beyond its charge and its energy: `spendArray` entries of
//{mechanic, amount}. Kept apart from the requirement list even when the two say the same thing, since
//"you need 6 Resolve" and "it spends 6 Resolve" are different promises.
honeycomb.abilities.canPaySpend = function (member, definition) {
	if (definition == null || definition.spendArray == null) return true;
	for (var scanIndex = 0; scanIndex < definition.spendArray.length; scanIndex++) {
		var entry = definition.spendArray[scanIndex];
		if (honeycomb.mechanicValue(member, entry.mechanic) < entry.amount) return false;
	}
	return true;
};

honeycomb.abilities.paySpend = function (member, definition, context) {
	if (definition == null || definition.spendArray == null) return;
	for (var scanIndex = 0; scanIndex < definition.spendArray.length; scanIndex++) {
		var entry = definition.spendArray[scanIndex];
		honeycomb.spendMechanic(member, entry.mechanic, entry.amount, context);
	}
};

//---------------------------------------------------------------------------------------------------
//Using an ability
//---------------------------------------------------------------------------------------------------
//Whether an ability may be used right now, and why not. Same shape as honeycomb.cardPlayability, so
//the UI greys a spent ability the same way it greys an unaffordable card.
honeycomb.abilities.usability = function (member, abilityIndex, combat) {
	var definition = honeycomb.abilities.definitionFor(member, abilityIndex);
	if (definition == null) return { usable: false, reason: "unknownAbility", explanation: "" };
	if (member == null) return { usable: false, reason: "noOwner", explanation: "" };
	if (member.downed == true) return { usable: false, reason: "ownerDown", explanation: "Its owner is out of the fight." };
	//A BROKEN CHARACTER CANNOT USE THEIR ABILITIES. Their cards are swapped for one broken
	//card; leaving the ability untouched would hand a broken Brienne her party-wide Aegis, which is the
	//single strongest thing she owns and exactly the thing being broken should cost her. Gated here
	//rather than as a requirement on each ability, so a new ability inherits the rule for free --
	//an ability that deliberately works while broken names `usableWhenBroken: true`.
	if (member.broken == true && definition.usableWhenBroken != true) {
		return { usable: false, reason: "ownerBroken", explanation: "Its owner is Broken." };
	}
	if (combat == null || combat.phase != "playerTurn") {
		return { usable: false, reason: "notPlayerTurn", explanation: "Wait for your turn." };
	}
	if (honeycomb.abilities.charges(member, abilityIndex) <= 0) {
		return { usable: false, reason: "noCharges", explanation: "No charges left." };
	}
	if (honeycomb.canAfford(definition.costArray) == false) {
		return { usable: false, reason: "cannotAfford", explanation: "Not enough Energy." };
	}
	//Each requirement answers for itself, so the player is told which one is missing. Asked BEFORE the
	//spend: when an ability both requires and spends the same meter, "Needs 6 Resolve" is the useful
	//half of the answer and "Spends 6 Resolve" is the half they already knew.
	var stateArray = honeycomb.abilities.requirementStateArray(member, abilityIndex, combat);
	for (var scanIndex = 0; scanIndex < stateArray.length; scanIndex++) {
		if (stateArray[scanIndex].met == false) {
			return { usable: false, reason: "requirementNotMet", explanation: stateArray[scanIndex].text, requirementArray: stateArray };
		}
	}
	if (honeycomb.abilities.canPaySpend(member, definition) == false) {
		return { usable: false, reason: "cannotSpend", explanation: honeycomb.abilities.spendText(definition), requirementArray: stateArray };
	}

	var context = honeycomb.newEffectContext({ combat: combat, source: member });
	if (definition.usableCondition != null && honeycomb.testCondition(definition.usableCondition, context) == false) {
		return { usable: false, reason: "conditionNotMet", explanation: "Not right now.", requirementArray: stateArray };
	}
	return { usable: true, reason: null, explanation: "", requirementArray: stateArray };
};

//"Spends 6 Resolve." -- what a spendArray costs, in words.
honeycomb.abilities.spendText = function (definition) {
	if (definition == null || definition.spendArray == null || definition.spendArray.length === 0) return "";
	var pieceArray = [];
	for (var scanIndex = 0; scanIndex < definition.spendArray.length; scanIndex++) {
		var entry = definition.spendArray[scanIndex];
		var mechanic = honeycomb.findDefinition(honeycomb.mechanicArray, entry.mechanic);
		pieceArray.push(entry.amount + " " + (mechanic == null ? entry.mechanic : mechanic.name));
	}
	return "Spends " + pieceArray.join(" and ") + ".";
};

//THE REQUIREMENTS AND THE SPEND, in words, for anywhere an ability is DESCRIBED rather than used --
//above all the teambuilding detail section. The ability menu lists the same
//things ticked or crossed; this is the plain read, so a character sheet explains what a spell needs.
honeycomb.abilities.requirementLine = function (definition) {
	if (definition == null) return "";
	var pieceArray = [];
	if (definition.requirementArray != null) {
		for (var scanIndex = 0; scanIndex < definition.requirementArray.length; scanIndex++) {
			var text = honeycomb.abilities.requirementText(definition.requirementArray[scanIndex]);
			if (text !== "") pieceArray.push(text);
		}
	}
	var spend = honeycomb.abilities.spendText(definition);
	if (spend !== "") pieceArray.push(spend);
	return pieceArray.join(" ");
};

//Spends a charge and resolves the ability. Returns the same result shape playCard does, so the combat
//screen animates an ability and a card through one code path.
honeycomb.abilities.use = function (memberInstanceId, abilityIndex, targetInstanceId, answerArray) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || run.combat == null) return { played: false, reason: "noCombat" };

	var member = honeycomb.abilities.findMember(memberInstanceId);
	var usability = honeycomb.abilities.usability(member, abilityIndex, run.combat);
	if (usability.usable == false) return { played: false, reason: usability.reason };

	var definition = honeycomb.abilities.definitionFor(member, abilityIndex);
	if (honeycomb.targetModeRequiresPick(definition.targetMode) == true && targetInstanceId == null) {
		return { played: false, reason: "needsTarget" };
	}

	//Resolved through the same replayable runner cards use, so an ability may stop and ask a question
	//from any depth. See honeycomb-choices.js.
	var attempt = honeycomb.resolveWithChoices({
		answerArray: answerArray,

		buildContext: function () {
			//Re-read after any rewind: honeycomb.state is replaced wholesale, so a reference taken
			//before a question was asked points at an abandoned copy.
			var liveCombat = honeycomb.state.run.combat;
			var liveMember = honeycomb.abilities.findMember(memberInstanceId);
			var abilityCard = honeycomb.abilities.asCard(definition, liveMember);

			var context = honeycomb.newEffectContext({ source: liveMember, card: abilityCard, combat: liveCombat });
			if (honeycomb.targetModeKind(definition.targetMode) == "card") {
				context.targetCardArray = targetInstanceId == null ? [] : [targetInstanceId];
			} else {
				context.target = targetInstanceId == null ? null : honeycomb.findEntity(targetInstanceId, liveCombat);
			}
			honeycomb.applyResolvedTargets(context, definition.targetMode,
				honeycomb.resolveTargetMode(definition.targetMode, context));
			return context;
		},

		run: function (context) {
			var liveMember = context.source;
			honeycomb.spend(definition.costArray);
			//What it takes out of the character's own meter, before anything it does.
			honeycomb.abilities.paySpend(liveMember, definition, context);
			honeycomb.abilities.setCharges(liveMember, abilityIndex,
				honeycomb.abilities.charges(liveMember, abilityIndex) - 1);

			honeycomb.logEvent(context, {
				type: "abilityUsed",
				ability: definition.index,
				sourceId: liveMember.instanceId,
				targetId: context.target == null ? null : context.target.instanceId,
			});

			//A TRAINING WHEEL (abilityUpgradeArray with disableMechanic) keeps the ability but stops it
			//fuelling the character's meter: nothing it does while resolving adds to that meter.
			var suppressMeter = honeycomb.abilityHasEnable(liveMember, abilityIndex) == false;
			var suppressedBefore = honeycomb.mechanicSuppressedId;
			if (suppressMeter) honeycomb.mechanicSuppressedId = liveMember.instanceId;
			try {
				honeycomb.resolveEffectArray(definition.effectArray, context);
			} finally {
				honeycomb.mechanicSuppressedId = suppressedBefore;
			}
			if (honeycomb.choicePending(context) == true) return;

			//An ability moves its owner only when it says so: `partyShift` on the definition, a
			//honeycomb.partyShiftArray entry. A spell is not an attack, so the default is to stay put.
			if (honeycomb.tuning.combat.partyShiftEnabled == true && liveMember.downed != true && definition.partyShift != null) {
				honeycomb.shiftEntity(liveMember, definition.partyShift, context);
			}

			honeycomb.combat.checkEnd(context);
		},
	});

	if (attempt.complete == false) {
		return {
			played: false,
			reason: "needsChoice",
			choice: attempt.choice,
			answerArray: attempt.answerArray,
			memberInstanceId: memberInstanceId,
			abilityIndex: abilityIndex,
			targetId: targetInstanceId,
		};
	}
	return { played: true, context: attempt.context };
};

honeycomb.abilities.findMember = function (memberInstanceId) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return null;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		if (run.partyArray[memberIndex].instanceId == memberInstanceId) return run.partyArray[memberIndex];
	}
	return null;
};

//An ability presented to the effect layer as a card-shaped object. "owner" targeting reads
//ownerInstanceId, and nothing downstream needs to know the difference between the two.
honeycomb.abilities.asCard = function (definition, member) {
	return {
		index: definition.index,
		name: definition.name,
		type: "ability",
		ownerInstanceId: member == null ? null : member.instanceId,
		effectArray: definition.effectArray,
		targetMode: definition.targetMode,
		tagArray: definition.tagArray,
		costArray: definition.costArray == null ? {} : definition.costArray,
	};
};

//Printed text: whatever the definition wrote by hand, else generated from the effects. The same rule
//cards follow, and for the same reason.
honeycomb.abilities.text = function (definition) {
	if (definition == null) return "";
	if (definition.text != null) return definition.text;
	return honeycomb.describeEffectArray(definition.effectArray, { targetMode: definition.targetMode });
};
