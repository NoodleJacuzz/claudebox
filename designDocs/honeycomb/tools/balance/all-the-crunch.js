/**
 * BALANCE TEST: ALL THE CRUNCH -- the slow, trustworthy balance test for Honeycomb Catacombs. Not part of the game.
 * (balance_tests/BRIEF.md Steps 4 to 7.)
 *
 * Plays WHOLE runs, from the first map node to the last boss, with damage carrying from fight to fight,
 * and with shops, rests, events, relics, card rewards and removals, all through the game's own code.
 * Nothing is abstracted. Run it with a mode:
 *
 *   --trace SEED           play one run and print it, one line per stop
 *   --compare              the learned bot against the thin-deck bot and the take-everything bot, on the same
 *                          seeds, plus what the learned bot found worth taking (Step 5)
 *   --career               one simulated player on one profile, run after run, until every route is cleared and
 *                          every tree is full (Step 6)
 *   --matrix               fixed profiles at 0, 25, 50, 75 and 100% tree, every party, the same seeds in
 *                          every column (Step 7)
 *
 * Options:
 *   --party a,b,c          the party for --trace (default: brienne,nettle,severine)
 *   --policy name          for --trace: explore, thin, take, learned (default explore)
 *   --values file          the learned values (default: values.json in the results folder)
 *   --runs N               runs per bot in --compare (default 60)
 *   --explore N            runs in the explore batch that teaches the learned bot (default 240)
 *   --workers N            operating-system processes to spread runs across (default 1). The report does not depend on N.
 *   --seed N               the first seed (default 1)
 *   --out folder           where results go (default tools/balance/results/<date>-<tag>)
 *   --tag name             the folder's suffix (default "run")
 */
const fs = require("fs"), path = require("path");
const { loadEngine } = require("./lib/engine");
const runPlayer = require("./lib/run-player");
const policies = require("./lib/policies");
const learning = require("./lib/learning");
const stats = require("./lib/stats");
const workers = require("./lib/workers");
const career = require("./lib/career");

//Every knob this file has (BRIEF rule 6).
const PARAMS = {
	//The learned bot's deckbuilding is "ending early" if it takes a card at fewer than this share of the
	//offers in the last third of a run (INFERENCES I2).
	stalePickRate: 0.25,
	//How many entries the card-value lists show.
	listLength: 10,
	//Where a stage counts as "the last third of a run": the last band of a region.
	lastBandSuffix: ".2",
	defaultRuns: 60,
	defaultExplore: 240,
};

const argv = process.argv.slice(2);
function option(name, fallback) { const at = argv.indexOf(name); return at < 0 ? fallback : argv[at + 1]; }
const OPTIONS = {
	workers: parseInt(option("--workers", "1"), 10),
	seed: parseInt(option("--seed", "1"), 10),
	runs: parseInt(option("--runs", String(PARAMS.defaultRuns)), 10),
	explore: parseInt(option("--explore", String(PARAMS.defaultExplore)), 10),
	trace: option("--trace", null),
	careers: parseInt(option("--careers", "1"), 10),
	maxRuns: parseInt(option("--max-runs", "200"), 10),
	hours: parseFloat(option("--hours", "0.25")),
	seedsPerCell: option("--seeds", null) == null ? null : parseInt(option("--seeds", "0"), 10),
	profiles: option("--profiles", null),
	party: option("--party", "brienne,nettle,severine").split(","),
	policy: option("--policy", "explore"),
	tag: option("--tag", "run"),
};
const RESULTS_ROOT = path.join(__dirname, "results");
const OUT = option("--out", path.join(RESULTS_ROOT, new Date().toISOString().slice(0, 10) + "-" + OPTIONS.tag));
const VALUES_PATH = option("--values", path.join(OUT, "values.json"));

const POLICY_BY_NAME = { explore: policies.randomPolicy, thin: policies.thinDeckPolicy, take: policies.takeEverythingPolicy };

//---------------------------------------------------------------------------------------------------
//The job every worker runs: one whole run.
//---------------------------------------------------------------------------------------------------
//job: {policy, party, seed, profile (a saved state as text, or null for a fresh profile), keepDecisions}
function makeRunner(options) {
	const hc = loadEngine({ drivenOverlays: true, gauntlet: options.gauntlet });
	const values = options.values == null ? null : options.values;
	return function (job) {
		if (job.kind === "career") {
			const policy = options.values == null ? policies.randomPolicy : learning.learnedPolicy(options.values, policies.PARAMS);
			return career.playCareer({ hc, policy, careerSeed: job.careerSeed, maximumRuns: job.maximumRuns });
		}
		hc.state = job.profile == null ? hc.newProfile() : JSON.parse(job.profile);
		hc.state.run = null;
		const policy = job.policy === "learned" ? learning.learnedPolicy(values, policies.PARAMS) : POLICY_BY_NAME[job.policy];
		const party = job.party.map((characterIndex) => ({ characterIndex, outfitIndex: "default" }));
		const record = runPlayer.playRun({ hc, party, seed: job.seed, policy, trace: false });
		if (job.keepDecisions !== true) { record.bossWins = record.fightArray.filter((fight) => fight.boss && fight.won).length; delete record.fightArray; delete record.nodeArray; delete record.decisionArray; delete record.goldArray; delete record.bossDeckArray; }
		return record;
	};
}

function describeJob(job) { if (job.kind === "career") return "career " + job.careerSeed; return job.policy + ", party " + job.party.join(",") + ", seed " + job.seed; }

async function runBatch(jobs, options, label) {
	const started = Date.now();
	const outcome = await workers.runJobs({
		file: __filename, factory: makeRunner, options, jobs, workers: OPTIONS.workers, describe: describeJob,
		onProgress: (done, total) => { if (process.stderr.isTTY) process.stderr.write("\r" + label + ": " + done + " / " + total + " runs"); },
	});
	if (process.stderr.isTTY) process.stderr.write("\n");
	outcome.seconds = (Date.now() - started) / 1000;
	return outcome;
}

//Every three-character party from the shipped characters (BRIEF Step 7: 20 of them).
function allParties(hc) {
	const shipped = hc.shippedCharacterArray().map((character) => character.index);
	const result = [];
	for (let a = 0; a < shipped.length; a++) for (let b = a + 1; b < shipped.length; b++) for (let c = b + 1; c < shipped.length; c++) result.push([shipped[a], shipped[b], shipped[c]]);
	return result;
}

//---------------------------------------------------------------------------------------------------
//--trace
//---------------------------------------------------------------------------------------------------
function traceMode() {
	const hc = loadEngine({ drivenOverlays: true });
	hc.state = hc.newProfile();
	let policy = POLICY_BY_NAME[OPTIONS.policy];
	if (OPTIONS.policy === "learned") policy = learning.learnedPolicy(JSON.parse(fs.readFileSync(VALUES_PATH, "utf8")), policies.PARAMS);
	console.log("BALANCE TEST: ALL THE CRUNCH");
	console.log("One run, seed " + OPTIONS.seed + ", party " + OPTIONS.party.join(", ") + ", deciding with the " + policy.name + " bot.");
	console.log("");
	const record = runPlayer.playRun({
		hc, party: OPTIONS.party.map((characterIndex) => ({ characterIndex, outfitIndex: "default" })), seed: OPTIONS.seed, policy, trace: true,
	});
	console.log("");
	console.log("The run " + (record.outcome === "victory" ? "was won" : "ended in " + record.outcome + (record.endedAt ? ", on " + record.endedAt : "")) +
		" after " + record.nodeArray.length + " stops and " + record.fightsWon + " fights won. Cards taken: " + record.cardsTaken +
		", cards removed: " + record.cardsRemoved + ". Experience paid: " +
		Object.keys(record.experience).map((name) => name + " " + record.experience[name]).join(", ") + ".");
}

//---------------------------------------------------------------------------------------------------
//--compare (Step 5)
//---------------------------------------------------------------------------------------------------
function summarise(recordArray) {
	const won = recordArray.filter((record) => record.outcome === "victory").length;
	const endings = {};
	for (const record of recordArray) if (record.outcome !== "victory") endings[record.endedAt] = (endings[record.endedAt] || 0) + 1;
	return {
		total: recordArray.length, won, endings,
		meanFights: stats.mean(recordArray.map((record) => record.fightsWon)),
		meanCards: stats.mean(recordArray.map((record) => record.cardsTaken)),
		meanRemoved: stats.mean(recordArray.map((record) => record.cardsRemoved)),
	};
}

function printRules() {
	console.log("THE RULES THE BOT USED");
	console.log("  Which stop to walk to: every stop is scored by its type, and a path is the sum of its stops. The weights are:");
	for (const type of Object.keys(runPlayer.PARAMS.pathWeights)) {
		const w = runPlayer.PARAMS.pathWeights[type];
		const parts = ["base " + w.base];
		if (w.whenHealthy != null) parts.push(w.whenHealthy + " extra while the party is at " + Math.round(w.healthyAt * 100) + "% health or more, " + w.whenHurt + " when it is below");
		if (w.perMissingHealth != null) parts.push(w.perMissingHealth + " for each whole party's-worth of missing health");
		if (w.whenRichAt != null) parts.push(w.whenRich + " extra with " + w.whenRichAt + " gold or more");
		console.log("    " + type.padEnd(9) + parts.join("; "));
	}
	console.log("  What to take, buy, remove or choose: the learned bot takes the option with the best value it has measured, if that value is above zero,");
	console.log("  and decides " + Math.round(policies.PARAMS.exploreRate * 100) + "% of everything at random so its values keep updating. An option seen fewer than " + policies.PARAMS.minimumSamples + " times has no trusted value and is decided at random.");
	console.log("  A run is judged by how many more fights it won after the decision, plus " + policies.PARAMS.runFinishBonus + " for finishing the run.");
}

function stageRows(recordArray) {
	const rows = {};
	for (const record of recordArray) {
		for (const decision of record.decisionArray || []) {
			const row = rows[decision.stage] = rows[decision.stage] || { offers: 0, takes: 0, deckSum: 0, deckCount: 0, removalOffers: 0, removalsPaid: 0 };
			if (decision.kind === "cardOffer") { row.offers += 1; if (!decision.none) row.takes += 1; row.deckSum += decision.deckSize; row.deckCount += 1; }
			if (decision.kind === "shopRemove") { row.removalOffers += 1; if (!decision.none) row.removalsPaid += 1; }
		}
	}
	return rows;
}

function printStopPicking(recordArray) {
	const rows = stageRows(recordArray);
	const stageArray = Object.keys(rows).sort();
	console.log("WHEN THE BOT STOPS PICKING CARDS (the learned bot, by stage of the run; R0 is the first region, R1 the second, .0 to .2 is early to late in it)");
	console.log("  " + "stage".padEnd(7) + "card offers".padEnd(13) + "cards taken".padEnd(13) + "share taken".padEnd(13) + "deck size".padEnd(11) + "removals paid for");
	for (const stage of stageArray) {
		const row = rows[stage];
		console.log("  " + stage.padEnd(7) + String(row.offers).padEnd(13) + String(row.takes).padEnd(13) + (row.offers ? stats.percent(row.takes / row.offers) : "-").padEnd(13) +
			(row.deckCount ? String(Math.round(row.deckSum / row.deckCount)) : "-").padEnd(11) + row.removalsPaid);
	}
	let lateOffers = 0, lateTakes = 0;
	for (const stage of stageArray) if (stage.endsWith(PARAMS.lastBandSuffix)) { lateOffers += rows[stage].offers; lateTakes += rows[stage].takes; }
	if (lateOffers > 0 && lateTakes / lateOffers < PARAMS.stalePickRate) {
		const drops = stageArray.find((stage) => rows[stage].offers > 0 && rows[stage].takes / rows[stage].offers < PARAMS.stalePickRate);
		console.log("  WARNING: deckbuilding is ending early. In the last third of a run the learned bot takes a card at only " + stats.percent(lateTakes / lateOffers) +
			" of the offers (the warning fires below " + stats.percent(PARAMS.stalePickRate) + "). The share first drops below that at stage " + drops + ".");
	} else if (lateOffers > 0) {
		console.log("  Deckbuilding does not end early: in the last third of a run the learned bot still takes a card at " + stats.percent(lateTakes / lateOffers) + " of the offers.");
	} else console.log("  No card offers were seen in the last third of a run, so the warning could not be checked.");
}

function printValues(values) {
	const entries = Object.keys(values.entries).map((key) => values.entries[key]).filter((entry) => entry.value != null && entry.taken >= policies.PARAMS.minimumSamples && entry.notTaken >= policies.PARAMS.minimumSamples);
	const byKind = (kind) => entries.filter((entry) => entry.kind === kind && entry.option !== learning.NONE_KEY);
	const show = (label, list, wording) => {
		console.log("  " + label);
		if (list.length === 0) { console.log("    (nothing has enough samples yet)"); return; }
		for (const entry of list.slice(0, PARAMS.listLength)) {
			console.log("    " + entry.option.padEnd(30) + " at stage " + entry.stage + ": " + wording(entry) + " (taken " + entry.taken + " times, offered and passed over " + entry.notTaken + ")");
		}
	};
	const better = (entry) => "runs that took it won " + (Math.round(entry.value * 100) / 100) + " more fights afterwards than runs that were offered it and did not";
	const worse = (entry) => "runs that took it won " + (Math.round(-entry.value * 100) / 100) + " FEWER fights afterwards";
	console.log("WHAT THE LEARNED BOT FOUND (only options seen at least " + policies.PARAMS.minimumSamples + " times taken and " + policies.PARAMS.minimumSamples + " times passed over)");
	for (const [kind, name] of [["cardOffer", "Card rewards"], ["shopBuy", "Shop purchases (cards and relics)"], ["shopRemove", "Cards paid to remove at a shop"], ["eventChoice", "Event choices"], ["restChoice", "Rest-site choices"]]) {
		const list = byKind(kind).sort((a, b) => b.value - a.value);
		console.log("");
		show(name + ", best first:", list.filter((entry) => entry.value > 0), better);
		show(name + ", worst first:", list.filter((entry) => entry.value < 0).sort((a, b) => a.value - b.value), worse);
	}
	//Cards whose value changes sign as the run goes on.
	const flips = {};
	for (const entry of byKind("cardOffer")) (flips[entry.option] = flips[entry.option] || []).push(entry);
	const flipped = Object.keys(flips).filter((name) => flips[name].some((entry) => entry.value > 0) && flips[name].some((entry) => entry.value < 0));
	console.log("");
	console.log("  Cards that go from worth taking to not worth taking (or back) as the run goes on: " + (flipped.length === 0 ? "none with enough samples." : flipped.slice(0, PARAMS.listLength).join(", ") + "."));
	const passed = {};
	for (const entry of Object.keys(values.entries).map((key) => values.entries[key])) if (entry.kind === "cardOffer" && entry.option !== learning.NONE_KEY) passed[entry.option] = (passed[entry.option] || 0) + entry.notTaken;
	const mostPassed = Object.keys(passed).sort((a, b) => passed[b] - passed[a]).slice(0, PARAMS.listLength);
	console.log("  Cards passed over most often in the explore batch: " + mostPassed.join(", ") + ".");
}

async function compareMode() {
	const probe = loadEngine({ drivenOverlays: true });
	const parties = allParties(probe);
	const partyFor = (index) => parties[index % parties.length];
	fs.mkdirSync(OUT, { recursive: true });

	console.log("BALANCE TEST: ALL THE CRUNCH");
	console.log("");
	console.log("Explore batch: " + OPTIONS.explore + " runs where every decision is made at random. Then " + OPTIONS.runs + " runs each of four bots on the same seeds and parties.");

	const exploreJobs = [];
	for (let index = 0; index < OPTIONS.explore; index++) exploreJobs.push({ policy: "explore", party: partyFor(index), seed: OPTIONS.seed + index, profile: null, keepDecisions: true });
	const explored = await runBatch(exploreJobs, {}, "explore");
	const exploreRecords = explored.results.filter(Boolean);
	const values = learning.learnValues(exploreRecords, policies.PARAMS.runFinishBonus);
	fs.writeFileSync(path.join(OUT, "values.json"), JSON.stringify(values));

	const seedBase = OPTIONS.seed + OPTIONS.explore + 1000;
	const compared = {};
	const failures = explored.failures.slice();
	for (const name of ["learned", "thin", "take", "explore"]) {
		const jobs = [];
		for (let index = 0; index < OPTIONS.runs; index++) jobs.push({ policy: name, party: partyFor(index), seed: seedBase + index, profile: null, keepDecisions: name === "learned" });
		const outcome = await runBatch(jobs, { values }, name);
		compared[name] = outcome.results.filter(Boolean);
		failures.push(...outcome.failures);
	}

	const summary = {};
	for (const name of Object.keys(compared)) summary[name] = summarise(compared[name]);
	const label = { learned: "The learned bot", thin: "The thin-deck bot (takes no cards, removes at every chance)", take: "The take-everything bot (never removes)", explore: "The random bot (the explore batch's rule)" };

	console.log("");
	const learned = summary.learned, thin = summary.thin, take = summary.take;
	if (stats.clearlyDifferent(thin.won, thin.total, learned.won, learned.total) && thin.won / thin.total > learned.won / learned.total) {
		console.log("REMOVING CARDS IS CURRENTLY STRONGER THAN DRAFTING THEM. The thin-deck bot won " + stats.describeShare(thin.won, thin.total, "runs") + ", against " +
			stats.describeShare(learned.won, learned.total, "runs") + " for the learned bot. The two ranges do not overlap.");
	} else if (stats.clearlyDifferent(thin.won, thin.total, learned.won, learned.total)) {
		console.log("The learned bot beat the thin-deck bot: " + stats.describeShare(learned.won, learned.total, "runs") + " against " + stats.describeShare(thin.won, thin.total, "runs") + ". Drafting is currently stronger than stripping the deck.");
	} else {
		console.log("The thin-deck bot and the learned bot are not clearly different (" + stats.describeShare(thin.won, thin.total, "runs won") + " against " + stats.describeShare(learned.won, learned.total, "runs won") + "). There is no difference this test can see.");
	}
	console.log("");
	console.log("THE BOTS, ON THE SAME " + OPTIONS.runs + " SEEDS AND PARTIES");
	for (const name of ["learned", "thin", "take", "explore"]) {
		const s = summary[name];
		console.log("  " + label[name]);
		console.log("    " + stats.describeShare(s.won, s.total, "runs won") + ". Fights won per run: " + Math.round(s.meanFights * 10) / 10 +
			". Cards taken per run: " + Math.round(s.meanCards * 10) / 10 + ". Cards removed per run: " + Math.round(s.meanRemoved * 10) / 10 + ".");
	}
	console.log("");
	console.log("WHERE THE LEARNED BOT'S RUNS END (the encounters that finish the most runs)");
	const endings = Object.keys(learned.endings).sort((a, b) => learned.endings[b] - learned.endings[a]).slice(0, PARAMS.listLength);
	for (const name of endings) console.log("  " + name.padEnd(28) + learned.endings[name] + " runs");
	console.log("");
	printRules();
	console.log("");
	printStopPicking(compared.learned);
	console.log("");
	printValues(values);
	console.log("");
	console.log("WHAT THIS REPORT CANNOT SEE");
	console.log("  Each card is valued on its own. A deck that needs three specific cards together before it does anything is undervalued.");
	console.log("  The bot is not a person. Comparisons between the bots above can be trusted; the absolute win rates cannot until Noodle has checked the bot against his own play.");
	if (failures.length > 0) {
		console.log("");
		console.log("RUNS THAT DID NOT FINISH (" + failures.length + "). They are left out of every number above.");
		for (const failure of failures.slice(0, 20)) console.log("  " + failure.job + ": " + failure.error.split("\n")[0]);
	}
	console.log("");
	console.log("Results and the learned values are in " + path.relative(process.cwd(), OUT) + ".");
}


//---------------------------------------------------------------------------------------------------
//Values file
//---------------------------------------------------------------------------------------------------
function loadValues() {
	return fs.existsSync(VALUES_PATH) ? JSON.parse(fs.readFileSync(VALUES_PATH, "utf8")) : null;
}

//---------------------------------------------------------------------------------------------------
//--career (Step 6)
//---------------------------------------------------------------------------------------------------
async function careerMode() {
	const probe = loadEngine({ drivenOverlays: true, gauntlet: true });
	const values = loadValues();
	fs.mkdirSync(path.join(OUT, "profiles"), { recursive: true });
	console.log("BALANCE TEST: ALL THE CRUNCH");
	console.log("");
	console.log("Career mode: " + OPTIONS.careers + " simulated player(s), each on one profile, run after run, for at most " + OPTIONS.maxRuns + " runs, until every route is cleared, the gauntlet relic is bought, the secret gauntlet is cleared and every tree is full.");
	console.log("The secret gauntlet's release switch is turned on in memory for this test only. The bot deciding: " + (values == null ? "the random bot (there is no values file yet, run --compare first to make one)" : "the learned bot, using " + path.relative(process.cwd(), VALUES_PATH)) + ".");
	console.log("");
	const jobs = [];
	for (let index = 0; index < OPTIONS.careers; index++) jobs.push({ kind: "career", careerSeed: OPTIONS.seed + index, maximumRuns: OPTIONS.maxRuns });
	const outcome = await runBatch(jobs, { values, gauntlet: true }, "career");
	const careerArray = outcome.results.filter(Boolean);

	const shipped = probe.shippedCharacterArray().map((character) => character.index);
	const wording = [
		["firstAct1Boss", "the first Act1-1 boss beaten"],
		["route:floodedVault", "the Flooded Vault route cleared"], ["route:flora", "the Flora route cleared"], ["route:pollenRoad", "the Pollen Road route cleared"],
		["gauntletRelicOffered", "the Grandmaster's Invitation first offered in a shop"], ["gauntletRelicBought", "the Grandmaster's Invitation bought"],
		["gauntletCleared", "the secret gauntlet cleared"], ["allRoutes", "all three routes cleared"], ["everythingFull", "every tree full"],
	];
	console.log("WHAT EACH CAREER REACHED, AND ON WHICH RUN");
	wording.forEach(([key, text]) => {
		const runs = careerArray.map((c) => c.milestone[key]);
		const got = runs.filter((value) => value != null);
		console.log("  " + text.padEnd(58) + (got.length === 0 ? "never, in any of " + careerArray.length + " career(s)" : "run " + Math.min(...got) + " to " + Math.max(...got) + (got.length < careerArray.length ? " (" + (careerArray.length - got.length) + " of " + careerArray.length + " careers never got there)" : "")));
	});
	console.log("");
	console.log("HOW FULL THE TREES GOT (ranks held out of the most a tree can hold, since nodes in an exclusive group cannot be held together)");
	const each = (rows, level) => rows.map((r) => r.marks[level] == null ? "never" : r.marks[level]).join(" / ");
	for (const name of shipped) {
		const rows = careerArray.map((c) => c.treeReport[name]);
		console.log("  " + name.padEnd(11) + "capacity " + rows[0].capacity + ", held " + rows.map((r) => r.held).join(" / ") + " at the end of each career; 25% first reached on run " +
			each(rows, 25) + ", 50% on " + each(rows, 50) + ", 75% on " + each(rows, 75) + ", 100% on " + each(rows, 100));
	}
	console.log("  The secret gauntlet's own tree (Anastasia, 43 nodes) is not counted: she cannot join a party before release, so no experience can be earned for it.");
	console.log("");
	console.log("WIN RATE THROUGH A CAREER (runs won in each block of " + career.PARAMS.blockSize + " runs; this is the first direct look at how much the tree changes difficulty)");
	careerArray.forEach((c, index) => console.log("  career " + (index + 1) + ": " + (c.blockWins.length === 0 ? "fewer than " + career.PARAMS.blockSize + " runs played" : c.blockWins.map((wins) => wins + " of " + c.blockSize).join(", ")) + "  (" + c.runCount + " runs in all)"));
	console.log("");

	//A character still in development cannot be fielded, so her cards can never be offered and are not "missed".
	const unshippedPrefix = probe.characterArray.filter((character) => shipped.indexOf(character.index) < 0).map((character) => character.index);
	const universe = {
		encounter: probe.encounterArray.filter((e) => e.testFixture !== true).map((e) => e.index),
		event: probe.eventArray.map((e) => e.index), relic: probe.relicArray.filter((r) => r.rarity !== "starter").map((r) => r.index),
		card: probe.cardArray.filter((c) => (c.rarity === "common" || c.rarity === "rare") && !unshippedPrefix.some((prefix) => c.index.indexOf(prefix) === 0)).map((c) => c.index), node: [],
	};
	for (const name of shipped) for (const node of probe.progression.treeFor({ characterIndex: name, outfitIndex: "default" }).nodeArray) universe.node.push(name + ":" + node.index);
	console.log("THE NEVER-REACHED LIST (across " + careerArray.length + " career(s); anything here is unreachable or very rare)");
	for (const [kind, noun] of [["encounter", "encounters never fought"], ["event", "events never seen"], ["relic", "relics never held or offered"], ["card", "cards never offered"], ["node", "tree nodes never bought"]]) {
		const missed = universe[kind].filter((name) => careerArray.every((c) => c.seen[kind][name] == null));
		const partly = universe[kind].filter((name) => careerArray.some((c) => c.seen[kind][name] == null) && careerArray.some((c) => c.seen[kind][name] != null));
		console.log("  " + noun + " (" + missed.length + " of " + universe[kind].length + "): " + (missed.length === 0 ? "none" : missed.slice(0, 40).join(", ") + (missed.length > 40 ? ", and " + (missed.length - 40) + " more" : "")));
		if (partly.length > 0) console.log("    seen by some careers and missed by others: " + partly.slice(0, 20).join(", ") + (partly.length > 20 ? ", and " + (partly.length - 20) + " more" : ""));
	}
	//Profiles saved at each tree level, for matrix mode.
	const saved = [];
	for (const level of career.PARAMS.snapshotAtArray) {
		const source = careerArray.find((c) => c.snapshot[level] != null);
		if (source != null) { fs.writeFileSync(path.join(OUT, "profiles", "tree-" + level + ".json"), source.snapshot[level]); saved.push(level + "%"); }
	}
	console.log("");
	console.log("Profiles saved for matrix mode at tree levels: " + (saved.length ? saved.join(", ") : "none") + ", in " + path.relative(process.cwd(), path.join(OUT, "profiles")) + ".");
	if (outcome.failures.length > 0) { console.log(""); console.log("CAREERS THAT DID NOT FINISH"); for (const failure of outcome.failures) console.log("  " + failure.job + ": " + failure.error.split("\n")[0]); }
}

//---------------------------------------------------------------------------------------------------
//--matrix (Step 7)
//---------------------------------------------------------------------------------------------------
function readResults(file) {
	if (!fs.existsSync(file)) return [];
	return fs.readFileSync(file, "utf8").split("\n").filter((line) => line.trim() !== "").map((line) => JSON.parse(line));
}

function matrixReport(lines, levels, values) {
	console.log("");
	console.log("Matrix mode: " + lines.length + " whole runs, across " + levels.length + " tree levels and every three-character party, with the same seeds in every column.");
	console.log("");
	printRules();
	console.log("  The bot deciding here: " + (values == null ? "the random bot (no values file)." : "the learned bot, using " + path.relative(process.cwd(), VALUES_PATH) + "."));
	console.log("");
	const winsOf = (rows) => rows.filter((row) => row.o === "victory").length;
	console.log("WIN RATE AT EACH TREE LEVEL");
	const byLevel = {};
	for (const level of levels) byLevel[level] = lines.filter((row) => row.l === level);
	for (const level of levels) console.log("  " + (level + "% of the tree").padEnd(18) + stats.describeShare(winsOf(byLevel[level]), byLevel[level].length, "runs won"));
	const differences = [];
	for (let a = 0; a < levels.length; a++) for (let b = a + 1; b < levels.length; b++) {
		const A = byLevel[levels[a]], B = byLevel[levels[b]];
		if (A.length && B.length && stats.clearlyDifferent(winsOf(A), A.length, winsOf(B), B.length)) differences.push(levels[a] + "% and " + levels[b] + "%");
	}
	console.log("  " + (differences.length === 0 ? "No difference between tree levels that this test can see: every pair of ranges overlaps." : "The win rates are really different between: " + differences.join("; ") + " (their ranges do not overlap)."));
	console.log("");
	console.log("HOW FAR RUNS GET (the share of runs that beat at least this many bosses)");
	for (const level of levels) {
		const rows = byLevel[level];
		const share = (n) => stats.percent(rows.length === 0 ? 0 : rows.filter((row) => row.b >= n).length / rows.length);
		console.log("  " + (level + "%").padEnd(6) + "first boss " + share(1) + ", second boss " + share(2) + ", average fights won " + Math.round(stats.mean(rows.map((row) => row.f)) * 10) / 10);
	}
	console.log("");
	console.log("WHERE RUNS END (the encounters that finish the most runs, all tree levels together)");
	const ends = {};
	for (const row of lines) if (row.o !== "victory") ends[row.e] = (ends[row.e] || 0) + 1;
	for (const name of Object.keys(ends).sort((a, b) => ends[b] - ends[a]).slice(0, PARAMS.listLength)) console.log("  " + String(name).padEnd(28) + ends[name] + " runs");
	console.log("");
	console.log("BY PARTY (runs won, all tree levels together)");
	const parties = {};
	for (const row of lines) { const key = row.p.join(", "); (parties[key] = parties[key] || []).push(row); }
	for (const key of Object.keys(parties).sort((a, b) => winsOf(parties[b]) / parties[b].length - winsOf(parties[a]) / parties[a].length)) console.log("  " + key.padEnd(34) + stats.describeShare(winsOf(parties[key]), parties[key].length, "runs won"));
	console.log("");
	console.log("BY CHARACTER (runs won with them in the party)");
	const characters = {};
	for (const row of lines) for (const name of row.p) (characters[name] = characters[name] || []).push(row);
	for (const name of Object.keys(characters)) console.log("  " + name.padEnd(11) + stats.describeShare(winsOf(characters[name]), characters[name].length, "runs won"));
	console.log("");
	console.log("BY ROUTE (the second region a run went on to; \"none reached\" means it was lost in the first region)");
	const routes = {};
	for (const row of lines) (routes[row.r || "none reached"] = routes[row.r || "none reached"] || []).push(row);
	for (const name of Object.keys(routes)) console.log("  " + String(name).padEnd(16) + routes[name].length + " runs, " + winsOf(routes[name]) + " of them won");
	console.log("");
	console.log("WHAT THIS REPORT CANNOT SEE");
	console.log("  Each card is valued on its own, so a deck that needs three specific cards together is undervalued.");
	console.log("  The bot is not a person. Comparisons between the columns can be trusted; the absolute win rates cannot until Noodle has checked the bot against his own play.");
	console.log("  Noodle's standing direction is that runs are meant to be lost. These are numbers, not a judgement of them.");
}

async function matrixMode() {
	console.log("BALANCE TEST: ALL THE CRUNCH");
	const probe = loadEngine({ drivenOverlays: true });
	const parties = allParties(probe);
	const profileFolder = OPTIONS.profiles || path.join(OUT, "profiles");
	const levels = [], profileText = {};
	for (const level of career.PARAMS.snapshotAtArray) {
		const file = path.join(profileFolder, "tree-" + level + ".json");
		if (fs.existsSync(file)) { levels.push(level); profileText[level] = fs.readFileSync(file, "utf8"); }
	}
	if (levels.length === 0) { console.log("No saved profiles in " + profileFolder + ". Run --career first, or point --profiles at a folder holding tree-0.json ... tree-100.json."); return; }
	fs.mkdirSync(OUT, { recursive: true });
	const resultsFile = path.join(OUT, "matrix-results.jsonl");
	const values = loadValues();
	const done = new Set(readResults(resultsFile).map((row) => row.l + "|" + row.p.join(",") + "|" + row.s));
	const key = (level, party, seed) => level + "|" + party.join(",") + "|" + seed;
	const cellCount = levels.length * parties.length;

	//How many seeds fit: time a few runs first, then print the plan and start (BRIEF Step 7).
	const makeJob = (level, party, seed) => ({ policy: values == null ? "explore" : "learned", party, seed, profile: profileText[level], level });
	const sampleJobs = [];
	for (let index = 0; index < Math.max(2, OPTIONS.workers) && index < parties.length; index++) sampleJobs.push(makeJob(levels[0], parties[index], 900000 + index));
	const timing = await runBatch(sampleJobs, { values }, "timing");
	const secondsPerRun = timing.seconds * OPTIONS.workers / sampleJobs.length;
	const totalRuns = OPTIONS.seedsPerCell != null ? OPTIONS.seedsPerCell * cellCount : Math.floor(OPTIONS.hours * 3600 * OPTIONS.workers / secondsPerRun);
	const seedsPerCell = Math.max(1, Math.floor(totalRuns / cellCount));
	console.log("PLAN: a run takes about " + Math.round(secondsPerRun) + " seconds on one worker. With " + OPTIONS.workers + " worker(s) and " + OPTIONS.hours + " hour(s), about " + totalRuns + " runs fit: " + seedsPerCell +
		" seeds in each of the " + cellCount + " cells (" + levels.length + " tree levels x " + parties.length + " parties). " + done.size + " runs are already in " + path.relative(process.cwd(), resultsFile) + " and will be skipped." +
		" A win rate from " + seedsPerCell * parties.length + " runs per tree level is good to about +-" + Math.round(98 / Math.sqrt(seedsPerCell * parties.length)) + " points.");

	const deadline = Date.now() + OPTIONS.hours * 3600 * 1000;
	const chunkSize = Math.max(OPTIONS.workers * 3, 6);
	const pending = [];
	for (let seed = 1; seed <= seedsPerCell; seed++) for (const level of levels) for (const party of parties) if (!done.has(key(level, party, seed))) pending.push({ level, party, seed });
	for (let at = 0; at < pending.length && Date.now() < deadline; at += chunkSize) {
		const chunk = pending.slice(at, at + chunkSize);
		const outcome = await runBatch(chunk.map((c) => makeJob(c.level, c.party, c.seed)), { values }, "matrix " + at + "/" + pending.length);
		const lines = [];
		outcome.results.forEach((record, index) => {
			if (record == null) return;
			const c = chunk[index];
			lines.push(JSON.stringify({ l: c.level, p: c.party, s: c.seed, o: record.outcome, e: record.endedAt, f: record.fightsWon, r: record.route, b: record.bossWins, c: record.cardsTaken }));
		});
		if (lines.length) fs.appendFileSync(resultsFile, lines.join("\n") + "\n");
		for (const failure of outcome.failures) fs.appendFileSync(path.join(OUT, "matrix-failures.txt"), failure.job + ": " + failure.error.split("\n")[0] + "\n");
	}
	matrixReport(readResults(resultsFile), levels, values);
}

if (workers.isChild()) {
	workers.serve(makeRunner);
} else if (OPTIONS.trace != null) {
	OPTIONS.seed = parseInt(OPTIONS.trace, 10);
	traceMode();
} else if (argv.includes("--compare")) {
	compareMode().catch((error) => { console.error(error); process.exit(1); });
} else if (argv.includes("--career")) {
	careerMode().catch((error) => { console.error(error); process.exit(1); });
} else if (argv.includes("--matrix")) {
	matrixMode().catch((error) => { console.error(error); process.exit(1); });
} else {
	console.log("BALANCE TEST: ALL THE CRUNCH");
	console.log("Give a mode: --trace SEED, --compare, --career or --matrix. See the top of this file.");
}
