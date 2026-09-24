/**
 * The bot that plays one fight, for the balance tests. Not part of the game.
 *
 * Moved out of `tools/budget-audit.js` in session 53 (balance_tests/BRIEF.md Step 2) so Basic Bite and
 * All the Crunch play a fight exactly the same way. The header of that file (now a stub) explained the
 * design and it still holds: a greedy search through the engine's own dry run. For every playable card
 * and ability, on every legal target, the bot plays the move on a copy of the world, ends the turn, lets
 * the enemies act, scores the result, and plays the best move that is not worse than ending the turn.
 * It sees telegraphs as a player does. Session 34 set the scoring so a fresh save output about 18
 * damage a turn, which is what live play showed.
 *
 * ONE SKILL LEVEL, A SKILFUL PLAYER (balance_tests/FEEDBACK.md T3). Two weaknesses of the session-34
 * bot are fixed here, each behind a switch in PARAMS so the move could be checked against the old output
 * before the fix was turned on:
 *   1. It answered every choice card with the first option. It now tries each option as its own move.
 *   2. It looked one card ahead, so a card that only pays off through the NEXT card scored the same as
 *      doing nothing and was never played. A move that gains little on its own is now also scored as
 *      "this move, then the best follow-up, then the enemy turn".
 * `SCORE` is deliberately untouched: whether the bot plays like a skilful person is settled by Noodle
 * playing fixed-seed fights against its `--trace` output, not by tuning these numbers to a target.
 */

//Every knob the bot has (BRIEF rule 6).
const PARAMS = {
	//A choice card is tried once per option, so the best option is played and not the first one.
	tryEveryChoiceOption: true,
	//The second look, for a move that gains less than this over ending the turn (in SCORE points).
	setupLookEnabled: true,
	setupGainThreshold: 0.5,
	//How many first-moves get the second look in one player turn, and how many follow-ups are tried for each.
	//Session 53 measured 8 and 8 at 2.4x the old time per fight for nearly the same play as 3 and 3 (1.8x).
	setupFirstMoveCapPerTurn: 3,
	setupFollowUpCap: 3,
	//A backstop on cards and abilities played in one turn.
	movesPerTurnMaximum: 30,
	//A backstop on rounds in one fight, so a stalemate ends.
	turnsPerFightMaximum: 60,
	//A backstop on questions asked while playing one card.
	questionsPerMoveMaximum: 6,
};

//How the player values a world. Enemy "remaining" is health + Temporary HP - Lust: an enemy breaks when
//its Lust reaches health plus Temporary HP, so Lust is kill progress exactly as damage is.
const SCORE = {
	enemyRemaining: 1,
	enemyStanding: 10,     //each enemy still acting next turn
	allyHealth: 1.3,
	allyTemporary: 0.4,    //it halves each turn
	allyLust: 0.5,
	allyLost: 45,          //downed or Broken: out of the fight
	playTolerance: 0.5,    //a move this close to ending the turn is still played (buffs pay later)
	fightWon: 1e6,
	fightLost: -1e6,
};

function scoreWorld(hc) {
	const run = hc.state.run;
	const combat = run.combat;
	if (combat == null || combat.phase === "victory") return SCORE.fightWon;
	if (combat.phase === "defeat") return SCORE.fightLost;
	let score = 0;
	for (const enemy of hc.entityArray("enemy", combat)) {
		if (enemy.downed || enemy.broken) continue;
		score -= SCORE.enemyRemaining * Math.max(0, enemy.health + (enemy.temporaryHealth || 0) - (enemy.lust || 0));
		score -= SCORE.enemyStanding;
	}
	for (const ally of run.partyArray) {
		if (ally.downed || ally.broken) { score -= SCORE.allyLost; continue; }
		score += SCORE.allyHealth * ally.health + SCORE.allyTemporary * (ally.temporaryHealth || 0) - SCORE.allyLust * (ally.lust || 0);
	}
	return score;
}

//Plays a card or ability. Every question is answered with its first option, except the FIRST question
//when `move.firstOption` is set, which gets that option instead.
function playMove(hc, move, targetId) {
	const act = (answers) => move.kind === "card"
		? hc.combat.playCard(move.instanceId, targetId, answers)
		: hc.abilities.use(move.memberId, move.abilityIndex, targetId, answers);
	let result = act(undefined);
	let guard = 0;
	while (result && result.reason === "needsChoice" && guard++ < PARAMS.questionsPerMoveMaximum) {
		const optionArray = result.choice.optionArray;
		const position = result.answerArray.length;
		const pick = position === 0 && move.firstOption != null ? move.firstOption : 0;
		const answer = optionArray != null && optionArray.length > 0
			? [{ chosenArray: [optionArray[Math.min(pick, optionArray.length - 1)].index] }]
			: [{ chosenArray: [] }];
		result = act(result.answerArray.concat(answer));
	}
	return result;
}

function fightOver(hc) {
	const combat = hc.state.run.combat;
	return combat == null || combat.phase === "victory" || combat.phase === "defeat";
}

//The score after `move` on `targetId` and a full handover; null when the move cannot be played.
function lookahead(hc, move, targetId) {
	let score = null;
	hc.forecast.dryRunLog(() => {
		if (move != null) {
			const result = playMove(hc, move, targetId);
			if (!result || !result.played) return [];
		}
		if (!fightOver(hc)) hc.forecast.runHandover();
		score = scoreWorld(hc);
		return [];
	});
	return score;
}

function targetsFor(hc, targetMode, combat) {
	if (!hc.targetModeRequiresPick(targetMode)) return [null];
	const side = hc.targetModeSide(targetMode, "ally");
	const pool = side == null ? hc.livingEntityArray("both", combat) : hc.livingEntityArray(side, combat);
	return pool.map((entity) => entity.instanceId);
}

//Every card and ability that can be played right now, one entry each.
function candidateMoves(hc) {
	const combat = hc.state.run.combat;
	const moves = [];
	for (const instanceId of combat.handArray) {
		const card = hc.combat.resolveById(instanceId);
		if (!card || !card.costArray) continue;
		if (hc.cardPlayability(card, combat).playable === false) continue;
		moves.push({ kind: "card", instanceId, name: card.name, targetMode: card.targetMode });
	}
	for (const member of hc.state.run.partyArray) {
		for (const ability of hc.abilities.memberAbilityArray(member)) {
			if (hc.abilities.usability(member, ability.index, combat).usable !== true) continue;
			moves.push({ kind: "ability", memberId: member.instanceId, abilityIndex: ability.index, name: ability.definition.name, targetMode: ability.definition.targetMode });
		}
	}
	return moves;
}

//How many options a choice card offers for its first question, or null when it asks nothing or has one
//answer. A card with no question would simply be PLAYED by the probe, so the world is put back afterwards
//with the same snapshot and restore a dry run uses (and which, unlike a dry run, may run inside one).
function firstQuestionOptions(hc, move, targetId) {
	const snapshot = hc.snapshotState();
	const result = move.kind === "card"
		? hc.combat.playCard(move.instanceId, targetId, undefined)
		: hc.abilities.use(move.memberId, move.abilityIndex, targetId, undefined);
	hc.restoreState(snapshot);
	if (!result || result.reason !== "needsChoice") return null;
	const optionArray = result.choice.optionArray;
	return optionArray != null && optionArray.length > 1 ? optionArray.length : null;
}

//The moves to score: each candidate on each target, and each option of a choice card as its own move.
//The world is re-read after every probe, because a restore replaces the state object.
function scoredMoves(hc) {
	const list = [];
	for (const move of candidateMoves(hc)) {
		for (const targetId of targetsFor(hc, move.targetMode, hc.state.run.combat)) {
			const optionCount = PARAMS.tryEveryChoiceOption ? firstQuestionOptions(hc, move, targetId) : null;
			if (optionCount == null) { list.push({ move, targetId }); continue; }
			for (let option = 0; option < optionCount; option++) {
				list.push({ move: Object.assign({}, move, { firstOption: option }), targetId });
			}
		}
	}
	return list;
}

//The score of playing `move`, then the best of up to `followUpCap` follow-up moves, then the enemy turn.
//Both plays happen inside ONE dry run, because a dry run refuses to nest (honeycomb-forecast.js). The world
//is put back between follow-ups with the same snapshot and restore the dry run itself uses.
//Returns null when the first move cannot be played.
function pairLookahead(hc, move, targetId) {
	let best = null;
	hc.forecast.dryRunLog(() => {
		const first = playMove(hc, move, targetId);
		if (!first || !first.played) return [];
		if (fightOver(hc)) { best = scoreWorld(hc); return []; }
		const afterFirst = hc.snapshotState();
		//Ending the turn after the first move is one of the choices, so a pair can never score worse
		//than the move alone.
		hc.forecast.runHandover();
		best = scoreWorld(hc);
		hc.restoreState(afterFirst);
		let tried = 0;
		for (const follow of scoredMoves(hc)) {
			if (tried >= PARAMS.setupFollowUpCap) break;
			tried++;
			const result = playMove(hc, follow.move, follow.targetId);
			if (result && result.played) {
				if (!fightOver(hc)) hc.forecast.runHandover();
				const score = scoreWorld(hc);
				if (score > best) best = score;
			}
			hc.restoreState(afterFirst);
		}
		return [];
	});
	return best;
}

//The whole player turn. Returns the names of what was played.
function playTurn(hc) {
	const playedNames = [];
	let pairsTried = 0;
	for (let guard = 0; guard < PARAMS.movesPerTurnMaximum; guard++) {
		if (fightOver(hc) || hc.state.run.combat.phase !== "playerTurn") break;
		const endScore = lookahead(hc, null, null);
		let best = null;
		const scored = [];
		for (const candidate of scoredMoves(hc)) {
			const score = lookahead(hc, candidate.move, candidate.targetId);
			if (score == null) continue;
			scored.push({ move: candidate.move, targetId: candidate.targetId, score });
			if (best == null || score > best.score) best = { move: candidate.move, targetId: candidate.targetId, score };
		}
		if (PARAMS.setupLookEnabled) {
			//Second look, for the moves that do little alone. Weakest first would waste the cap on moves
			//that are plainly nothing, so the cap goes to the ones closest to paying off.
			const quiet = scored.filter((entry) => entry.score - endScore < PARAMS.setupGainThreshold)
				.sort((a, b) => b.score - a.score);
			for (const entry of quiet) {
				if (pairsTried >= PARAMS.setupFirstMoveCapPerTurn) break;
				pairsTried++;
				const pairScore = pairLookahead(hc, entry.move, entry.targetId);
				if (pairScore != null && (best == null || pairScore > best.score)) {
					best = { move: entry.move, targetId: entry.targetId, score: pairScore };
				}
			}
		}
		if (best == null || best.score < endScore - SCORE.playTolerance) break;
		const result = playMove(hc, best.move, best.targetId);
		if (!result || !result.played) break;
		playedNames.push(best.move.name);
	}
	return playedNames;
}

//Plays the fight that has just begun, to its end, and returns what it measured. The caller sets the
//fight up (a fresh save and a drafted deck for Basic Bite, a whole run for All the Crunch) and starts it
//with `hc.combat.begin`. `trace` prints each turn.
function playCombat(hc, trace) {
	const deckSize = hc.state.run.deckArray.length;
	const startHealth = hc.state.run.partyArray.map((member) => member.health);
	const partyMaximum = hc.state.run.partyArray.reduce((sum, member) => sum + member.maxHealth, 0);
	const live = () => hc.state.run.combat;
	const lineupHealth = live().enemyArray.reduce((sum, enemy) => sum + enemy.maxHealth, 0);

	let gross = 0, absorbed = 0, selfInflicted = 0, lustTaken = 0, dealt = 0, lustDealt = 0, healed = 0, turns = 0, broken = 0;
	const allyIds = new Set(hc.state.run.partyArray.map((ally) => ally.instanceId));

	function harvest(log) {
		for (const entry of log || []) {
			if (entry.type === "damage") {
				const targetIsAlly = allyIds.has(entry.targetId);
				const sourceIsAlly = entry.sourceId != null && allyIds.has(entry.sourceId);
				if (targetIsAlly) {
					if (sourceIsAlly) selfInflicted += entry.amount + (entry.absorbed || 0);
					else { gross += entry.amount + (entry.absorbed || 0); absorbed += entry.absorbed || 0; }
				} else {
					dealt += entry.amount + (entry.absorbed || 0);
				}
			}
			if (entry.type === "lust") {
				if (allyIds.has(entry.targetId)) lustTaken += entry.amount || 0;
				else lustDealt += entry.amount || 0;
			}
			if (entry.type === "heal" && allyIds.has(entry.targetId)) healed += entry.amount || 0;
			if (entry.type === "broken" && allyIds.has(entry.targetId || entry.entityId)) broken += 1;
		}
	}

	let guard = 0;
	while (guard++ < PARAMS.turnsPerFightMaximum) {
		let combat = live();
		if (combat == null || combat.phase === "victory" || combat.phase === "defeat") break;
		turns += 1;
		const logStart = combat.historyArray ? combat.historyArray.length : 0;
		const playedNames = playTurn(hc);
		combat = live();
		if (combat.phase !== "victory" && combat.phase !== "defeat") {
			hc.combat.endPlayerTurn();
			combat = live();
			if (combat.phase !== "victory" && combat.phase !== "defeat") hc.combat.runEnemyTurn();
		}
		combat = live();
		harvest(combat.historyArray.slice(logStart));
		if (trace) {
			console.log("  turn " + turns + "  played [" + playedNames.join(", ") + "]");
			console.log("         party " + hc.state.run.partyArray.map((m) => m.characterIndex + " " + m.health + "+" + (m.temporaryHealth || 0) + " L" + (m.lust || 0)).join(" | ") +
				"   enemies " + combat.enemyArray.map((e) => e.enemyIndex + " " + e.health + "+" + (e.temporaryHealth || 0) + " L" + (e.lust || 0)).join(", "));
		}
		if (combat.phase === "victory" || combat.phase === "defeat") break;
		hc.combat.startPlayerTurn();
	}
	const combat = live();
	const endHealth = hc.state.run.partyArray.map((member) => member.health);
	const netLost = startHealth.reduce((sum, value, index) => sum + (value - endHealth[index]), 0);
	return {
		won: combat != null && combat.phase === "victory",
		turns, lineupHealth, partyMaximum, deckSize, gross, absorbed, selfInflicted, lustTaken, dealt, lustDealt, healed, netLost, broken,
	};
}

module.exports = { PARAMS, SCORE, scoreWorld, playMove, lookahead, pairLookahead, targetsFor, candidateMoves, scoredMoves, playTurn, playCombat, fightOver };
