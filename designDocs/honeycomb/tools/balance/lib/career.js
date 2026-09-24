/**
 * One simulated player on one profile, run after run. Not part of the game. (balance_tests/BRIEF.md Step 6.)
 *
 * After each run, whatever experience the game paid stays on the profile, and this file spends it on the
 * tree. The career stops when every milestone has been reached, or after `maximumRuns`.
 *
 * WHAT "100%" MEANS. Nodes that share an `exclusiveGroup` cannot be held together, so a tree can never be
 * completely full. `treeCapacity` counts every rank of every node outside a group, plus, for each group,
 * the rank maximum of its largest member. Completion is ranks held over that number, and the report
 * prints the number.
 */
const runPlayer = require("./run-player");

//Every knob this file has (BRIEF rule 6).
const PARAMS = {
	//How the party for each run is picked (INFERENCES I4). "leastSpent" fields the three shipped characters with the
	//fewest nodes bought, so all six trees fill at about the same pace.
	careerPartyRule: "leastSpent",
	partySize: 3,
	//Tree completion levels at which a copy of the profile is saved for matrix mode.
	snapshotAtArray: [0, 25, 50, 75, 100],
	//Completion levels the report gives a run number for, for each character.
	completionMarkArray: [25, 50, 75, 100],
	//The block of runs a win rate is reported over.
	blockSize: 20,
	//The relic that opens the secret route. The bot buys it whenever a shop offers it (a goal, not a learned value).
	goalRelicArray: ["gauntletInvitation"],
	//A backstop on nodes bought after one run, so a bug cannot loop.
	purchasesPerRunMaximum: 400,
};

//Wraps a policy so a shop that offers a goal relic gets it bought.
function withGoals(policy) {
	return {
		name: policy.name,
		choose(kind, context, optionArray, allowNone) {
			if (kind === "shopBuy") {
				const goal = optionArray.findIndex((option) => PARAMS.goalRelicArray.indexOf(option.key) >= 0);
				if (goal >= 0) return goal;
			}
			return policy.choose(kind, context, optionArray, allowNone);
		},
	};
}

function treeNodes(hc, characterIndex) {
	const tree = hc.progression.treeFor({ characterIndex, outfitIndex: "default" });
	return tree == null ? [] : tree.nodeArray;
}

function treeCapacity(hc, characterIndex) {
	let total = 0;
	const groupBest = {};
	for (const node of treeNodes(hc, characterIndex)) {
		const rank = hc.progression.rankMaximum(node);
		if (node.exclusiveGroup == null) total += rank;
		else groupBest[node.exclusiveGroup] = Math.max(groupBest[node.exclusiveGroup] || 0, rank);
	}
	for (const group of Object.keys(groupBest)) total += groupBest[group];
	return total;
}

function ranksHeld(hc, characterIndex) {
	return hc.progression.selectionArray(characterIndex).length;
}

//The cheapest legal node for one character, or null.
function cheapestLegalNode(hc, characterIndex) {
	const selection = { characterIndex, outfitIndex: "default" };
	let best = null, bestCost = Infinity;
	for (const node of treeNodes(hc, characterIndex)) {
		if (hc.progression.refuseReason(selection, node.index) !== null) continue;
		const cost = hc.progression.nodeCost(node, hc.progression.rankOf(characterIndex, node.index) + 1);
		if (cost < bestCost) { best = node; bestCost = cost; }
	}
	return best;
}

//Spends what the profile can afford (INFERENCES I5). One node at a time, each time for the character with
//the fewest ranks who can buy something, buying that character's cheapest legal node. The global pool is
//shared by every tree, so spending one character to the end first would hand them all of it.
//Returns [{character, node}] in the order bought.
function spendExperience(hc, shipped) {
	const bought = [];
	for (let guard = 0; guard < PARAMS.purchasesPerRunMaximum; guard++) {
		const order = shipped.slice().sort((a, b) => ranksHeld(hc, a) - ranksHeld(hc, b) || shipped.indexOf(a) - shipped.indexOf(b));
		let done = false;
		for (const name of order) {
			const node = cheapestLegalNode(hc, name);
			if (node == null) continue;
			if (hc.progression.select({ characterIndex: name, outfitIndex: "default" }, node.index).changed !== true) continue;
			bought.push({ character: name, node: node.index });
			done = true;
			break;
		}
		if (!done) break;
	}
	return bought;
}

function partyFor(hc, shipped) {
	const ranked = shipped.slice().sort((a, b) => ranksHeld(hc, a) - ranksHeld(hc, b) || shipped.indexOf(a) - shipped.indexOf(b));
	return ranked.slice(0, PARAMS.partySize);
}

//settings: {hc, policy, careerSeed, maximumRuns}
//Returns {milestone: {name: runNumber}, runCount, blockRate, treeReport, snapshot: {percent: text}, seen: {...}, capacity}.
function playCareer(settings) {
	const hc = settings.hc;
	const policy = withGoals(settings.policy);
	const shipped = hc.shippedCharacterArray().map((character) => character.index);
	hc.state = hc.newProfile();
	hc.state.run = null;

	const capacity = {};
	let capacityTotal = 0;
	for (const name of shipped) { capacity[name] = treeCapacity(hc, name); capacityTotal += capacity[name]; }
	const completion = () => {
		let held = 0;
		for (const name of shipped) held += Math.min(ranksHeld(hc, name), capacity[name]);
		return capacityTotal === 0 ? 0 : held / capacityTotal;
	};

	const milestone = {};
	const mark = (name, runNumber) => { if (milestone[name] == null) milestone[name] = runNumber; };
	const snapshot = {};
	const seen = { encounter: {}, event: {}, relic: {}, card: {}, node: {} };
	const blockArray = [];
	let blockWins = 0, blockRuns = 0;
	const routeCleared = {};
	const characterMarks = {};
	const startedRunCount = 0;
	const routes = hc.tuning.map.route.byBossArray.map((entry) => entry.regionIndex).concat(hc.tuning.map.route.defaultSecondRegion);

	const takeSnapshot = () => {
		const percent = Math.floor(completion() * 100);
		for (const at of PARAMS.snapshotAtArray) {
			if (snapshot[at] == null && percent >= at) snapshot[at] = JSON.stringify(hc.state);
		}
	};
	takeSnapshot();

	let runNumber = 0;
	while (runNumber < settings.maximumRuns) {
		runNumber += 1;
		const party = partyFor(hc, shipped);
		const record = runPlayer.playRun({
			hc, party: party.map((characterIndex) => ({ characterIndex, outfitIndex: "default" })),
			seed: settings.careerSeed * 100000 + runNumber, policy, trace: false,
		});
		hc.state.run = null;

		if (record.fightArray.some((fight) => fight.boss && fight.won)) mark("firstAct1Boss", runNumber);
		if (record.outcome === "victory" && record.route != null) {
			routeCleared[record.route] = true;
			mark("route:" + record.route, runNumber);
			if (record.route === "gauntletGallery") mark("gauntletCleared", runNumber);
		}
		const offered = record.decisionArray.some((decision) => decision.kind === "shopBuy" && decision.optionArray.indexOf("gauntletInvitation") >= 0);
		const boughtGoal = record.decisionArray.some((decision) => decision.kind === "shopBuy" && decision.taken === "gauntletInvitation");
		if (offered || record.relicShelfArray.indexOf("gauntletInvitation") >= 0) mark("gauntletRelicOffered", runNumber);
		if (boughtGoal) mark("gauntletRelicBought", runNumber);

		for (const fight of record.fightArray) seen.encounter[fight.encounter] = (seen.encounter[fight.encounter] || 0) + 1;
		for (const name of record.eventSeenArray) seen.event[name] = (seen.event[name] || 0) + 1;
		for (const name of record.relicHeldArray.concat(record.relicShelfArray)) seen.relic[name] = (seen.relic[name] || 0) + 1;
		for (const decision of record.decisionArray) {
			if (decision.kind === "cardOffer" || decision.kind === "shopBuy") for (const key of decision.optionArray) seen.card[key] = (seen.card[key] || 0) + 1;
		}

		blockRuns += 1;
		if (record.outcome === "victory") blockWins += 1;
		if (blockRuns === PARAMS.blockSize) { blockArray.push(blockWins); blockWins = 0; blockRuns = 0; }

		for (const purchase of spendExperience(hc, shipped)) seen.node[purchase.character + ":" + purchase.node] = runNumber;
		for (const name of shipped) {
			const share = Math.min(ranksHeld(hc, name), capacity[name]) / Math.max(1, capacity[name]);
			for (const level of PARAMS.completionMarkArray) {
				if (share * 100 >= level) { characterMarks[name] = characterMarks[name] || {}; if (characterMarks[name][level] == null) characterMarks[name][level] = runNumber; }
			}
		}
		takeSnapshot();
		const complete = completion() >= 1;
		if (complete) mark("everythingFull", runNumber);
		const allRoutes = routes.every((name) => routeCleared[name] === true);
		if (allRoutes) mark("allRoutes", runNumber);
		if (complete && milestone.gauntletCleared != null && allRoutes) break;
	}

	const treeReport = {};
	for (const name of shipped) treeReport[name] = { held: ranksHeld(hc, name), capacity: capacity[name], marks: characterMarks[name] || {} };
	return { milestone, runCount: runNumber, blockWins: blockArray, blockSize: PARAMS.blockSize, treeReport, snapshot, seen, capacityTotal, completion: completion(), routes };
}

module.exports = { PARAMS, playCareer, treeCapacity, spendExperience, withGoals };
