/**
 * Learns what is worth taking from what the game itself produced. Not part of the game.
 * (balance_tests/BRIEF.md Step 5.)
 *
 * There is no table of card synergy. The explore batch decides everything at random, so a run that was
 * offered a card and took it can be compared with runs that were offered the SAME card at the SAME stage
 * and did not. The value of an option is
 *
 *     the average outcome when it was taken  MINUS  the average outcome when it was offered and not taken
 *
 * kept per stage of the run, where the outcome is how many more fights the run won after that decision,
 * plus a bonus for finishing the run (INFERENCES I6).
 *
 * THE TRAP THIS AVOIDS. Do not value a card by "how often it was in a deck that won": runs that get
 * further see more offers, so winning decks hold more of everything. The comparison here is between runs
 * that were offered the same thing at the same stage, and because the explore batch chooses at random it
 * is a fair one.
 *
 * BLIND SPOT, stated in every report: each option is valued on its own, so a deck that needs three
 * specific cards together before it does anything is undervalued.
 */

const NONE_KEY = "(nothing)";

function keyFor(kind, stage, optionKey) { return kind + "|" + stage + "|" + optionKey; }

//The value table from a list of run records. `bonus` is added to the outcome of a run that was won.
//Returns {entries: {key: {kind, stage, option, taken, offered, takenMean, notTakenMean, value}}}.
//An entry's `taken` and `notTaken` are counts of decisions, and `value` is null until both are above zero.
function learnValues(recordArray, bonus) {
	const sums = {};
	const touch = (key, kind, stage, option) => {
		if (sums[key] == null) sums[key] = { kind, stage, option, takenSum: 0, takenCount: 0, notSum: 0, notCount: 0 };
		return sums[key];
	};
	for (const record of recordArray) {
		const won = record.outcome === "victory" ? bonus : 0;
		for (const decision of record.decisionArray) {
			const outcome = record.fightsWon - (decision.wonSoFar || 0) + won;
			const takenKey = decision.none ? NONE_KEY : decision.taken;
			const seen = decision.optionArray.slice();
			if (decision.allowNone) seen.push(NONE_KEY);
			for (const option of seen) {
				const entry = touch(keyFor(decision.kind, decision.stage, option), decision.kind, decision.stage, option);
				if (option === takenKey) { entry.takenSum += outcome; entry.takenCount += 1; }
				else { entry.notSum += outcome; entry.notCount += 1; }
			}
		}
	}
	const entries = {};
	for (const key of Object.keys(sums)) {
		const s = sums[key];
		const takenMean = s.takenCount > 0 ? s.takenSum / s.takenCount : null;
		const notMean = s.notCount > 0 ? s.notSum / s.notCount : null;
		entries[key] = {
			kind: s.kind, stage: s.stage, option: s.option, taken: s.takenCount, notTaken: s.notCount,
			takenMean, notTakenMean: notMean,
			value: takenMean != null && notMean != null ? takenMean - notMean : null,
		};
	}
	return { entries, bonus };
}

//What the learned policy needs: the value of an option, or null when it has fewer samples than `minimum`.
function trustedValue(values, kind, stage, option, minimum) {
	const entry = values.entries[keyFor(kind, stage, option)];
	if (entry == null || entry.value == null) return null;
	if (entry.taken < minimum || entry.notTaken < minimum) return null;
	return entry.value;
}

//A policy that takes the option with the highest trusted value, if it is above zero, and otherwise takes
//nothing when nothing is allowed to be taken. An option with no trusted value is decided at random, and
//so is a share `exploreRate` of everything, so a value that was unlucky can recover.
function learnedPolicy(values, settings) {
	return {
		name: "learned",
		choose(kind, context, optionArray, allowNone) {
			const slots = optionArray.length + (allowNone ? 1 : 0);
			if (slots === 0) return -1;
			const random = () => { const pick = Math.floor(context.random() * slots); return pick >= optionArray.length ? -1 : pick; };
			if (context.random() < settings.exploreRate) return random();
			const scored = optionArray.map((option) => trustedValue(values, kind, context.stage, option.key, settings.minimumSamples));
			//Any option without a trusted value means the table cannot rank this decision yet.
			if (scored.some((value) => value == null)) return random();
			let best = -1, bestValue = allowNone ? 0 : -Infinity;
			scored.forEach((value, index) => { if (value > bestValue) { best = index; bestValue = value; } });
			if (best < 0 && !allowNone) return 0;
			return best;
		},
	};
}

module.exports = { NONE_KEY, learnValues, learnedPolicy, trustedValue, keyFor };
