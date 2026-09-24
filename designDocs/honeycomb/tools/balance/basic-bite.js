/**
 * BALANCE TEST: BASIC BITE -- the quick balance test for Honeycomb Catacombs. Not part of the game.
 *
 * (balance_tests/BRIEF.md Step 3; it grew out of `tools/budget-audit.js`, which now just runs this.)
 *
 * Plays every encounter as a single fight, with a deck typical for that point of a run, and says which
 * encounters are far from their targets. It answers one question: is anything wildly out of tune? It uses
 * the real engine and the real cards. It does NOT answer how often a whole run is won: every fight starts
 * from a fresh save at full health with no tree, no relics beyond the heirlooms, and no shops, rests or
 * events. That is what All the Crunch is for.
 *
 * THE PLAYER. The bot in `lib/combat-player.js`. See its header.
 *
 * THE DECK. A fresh-save run: default outfits, their heirlooms and run-start random cards, no tree. An
 * encounter is fought with the cards a run would have drafted by the time it is reached
 * (`tuning.balance.draftedCardsByStageArray`), taken from the game's own reward roll, a rare
 * whenever one is offered. No upgrades, removals, shop cards or relics beyond the heirlooms, so a real
 * run is somewhat stronger than this one.
 *
 * REGIONS. An ordinary encounter is measured once per region it can appear in (`regionIndexArray` on
 * the encounter, default every region), against that region's targets and drafted deck.
 *
 * Usage:  node "!designDocs/honeycomb/tools/balance/basic-bite.js" [--seeds N] [--party a,b,c] [--region R]
 *                 [--only index,index] [--json] [--trace encounterIndex] [--workers N] [--bot-legacy]
 *   --seeds N     seeds per encounter per party (default 4)
 *   --party a,b,c one party instead of the fixed ones (character indices)
 *   --region R    only rows for region R (0-based)
 *   --only list   only these encounter indices
 *   --json        machine-readable output instead of the table
 *   --trace X     print the turn-by-turn play of encounter X for the first seed of the first party
 *   --workers N   run the fights in N operating-system processes (default 1). The report is identical at any N.
 *   --bot-legacy  the session-34 bot, without the choice-card and setup-card fixes, for comparing with old reports
 */
const path = require("path");
const { loadEngine } = require("./lib/engine");
const combatPlayer = require("./lib/combat-player");
const workers = require("./lib/workers");

//Every knob this file has (BRIEF rule 6).
const PARAMS = {
	//An encounter is "far from its target" when a measurement is more than this many times the tolerance
	//`tuning.balance.varianceFraction` allows (INFERENCES I1: the rule is ±25%, so far starts at ±50%).
	farFactor: 2,
	//Party health total used to size targets before any fight has been measured.
	fallbackPartyHealth: 174,
};

const argv = process.argv.slice(2);
function option(name, fallback) { const at = argv.indexOf(name); return at < 0 ? fallback : argv[at + 1]; }
const SEEDS = parseInt(option("--seeds", "4"), 10);
const JSON_OUT = argv.includes("--json");
const TRACE = option("--trace", null);
const PARTY_OPTION = option("--party", null);
const REGION_OPTION = option("--region", null);
const ONLY_OPTION = option("--only", null);
const WORKERS = parseInt(option("--workers", "1"), 10);
const BOT_LEGACY = argv.includes("--bot-legacy");

//Every character appears twice across the four parties.
const PARTIES = PARTY_OPTION
	? [PARTY_OPTION.split(",")]
	: [["brienne", "nettle", "severine"], ["cinder", "clemence", "cassadora"], ["brienne", "clemence", "cassadora"], ["severine", "cinder", "nettle"]];

function applyBotOptions(options) {
	if (options.botLegacy) { combatPlayer.PARAMS.tryEveryChoiceOption = false; combatPlayer.PARAMS.setupLookEnabled = false; }
}

//A drafted deck: `count` victories' worth of the game's own reward roll, a rare whenever offered.
function draftCards(hc, count, seed) {
	for (let pick = 0; pick < count; pick++) {
		const offerArray = hc.combat.rollCardReward({ tier: "early" }, null);
		if (!offerArray || offerArray.length === 0) continue;
		const rare = offerArray.find((offer) => { const card = hc.findDefinition(hc.cardArray, offer.cardIndex); return card && card.rarity === "rare"; });
		const chosen = rare || offerArray[(seed + pick) % offerArray.length];
		const card = hc.findDefinition(hc.cardArray, chosen.cardIndex);
		if (card == null || card.fallback === true) continue;
		hc.addCardToRunDeck(chosen.cardIndex, chosen.ownerInstanceId);
	}
}

//Plays one fight to its end. Returns the measurements.
function playFight(hc, partyIndexArray, encounterIndex, seed, draftCount, trace) {
	hc.state = hc.newProfile();
	hc.newRun(partyIndexArray.map((characterIndex) => ({ characterIndex, outfitIndex: "default" })), seed);
	draftCards(hc, draftCount, seed);
	hc.combat.begin(encounterIndex, {});
	return combatPlayer.playCombat(hc, trace);
}

function mean(values) { return values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length; }
function round(value, places) { const factor = Math.pow(10, places == null ? 1 : places); return Math.round(value * factor) / factor; }

//Which regions an encounter is measured in: a boss in the region that names it, anything else in the
//regions it may appear in.
function regionsFor(hc, encounter) {
	if (encounter.tier === "boss") {
		const result = [];
		hc.regionArray.forEach((region, regionIndex) => {
			const pool = region.bossEncounterIndexArray || [region.bossEncounterIndex];
			if (pool.indexOf(encounter.index) >= 0) result.push(regionIndex);
		});
		return result;
	}
	if (encounter.regionIndexArray != null) return encounter.regionIndexArray;
	return hc.regionArray.map((region, regionIndex) => regionIndex);
}

function targetsForRow(hc, encounter, act, partyMaximum) {
	const balance = hc.tuning.balance;
	const kind = encounter.tier === "boss" ? "boss" : encounter.isElite ? "elite" : "normal";
	const stage = balance.tierStageArray[encounter.tier] || "late";
	const pick = (array) => array[Math.min(act, array.length - 1)];
	const turns = pick(balance.turnTargetArray)[kind];
	const net = pick(balance.netDamageFractionArray)[kind];
	const output = pick(balance.partyOutputPerTurnArray)[stage];
	const turnsMid = (turns.minimum + turns.maximum) / 2;
	const grossPerTurn = (net * partyMaximum) / turnsMid + output * balance.mitigationShareOfOutput;
	return {
		kind, stage, turns, netFraction: net, output, turnsMid,
		lineupHealth: output * turnsMid,
		grossPerTurn,
		lustPerTurnMaximum: grossPerTurn * balance.lustToDamageRatioMaximum,
		draftCount: pick(balance.draftedCardsByStageArray)[stage],
	};
}

function mark(value, target, tolerance) {
	if (target == null || target === 0) return " ";
	const ratio = value / target;
	if (ratio > 1 + tolerance) return "▲";
	if (ratio < 1 - tolerance) return "▼";
	return "✓";
}

//The plain-English list of encounters that are far from their targets (INFERENCES I1). Each line names the
//encounter, the number that is off and how far.
function farLines(rows, balance) {
	const tolerance = balance.varianceFraction * PARAMS.farFactor;
	const lines = [];
	for (const row of rows) {
		const t = row.target;
		const where = "Region " + (row.act + 1) + " " + row.tier + (t.kind === row.tier ? "" : " (" + t.kind + ")") + ", " + row.name;
		const single = (label, value, target, unit) => {
			if (target == null || target === 0) return;
			const ratio = value / target;
			if (ratio > 1 + tolerance || ratio < 1 - tolerance) {
				lines.push(where + ": " + label + " averages " + round(value) + unit + " against a target of " + round(target) + unit +
					", which is " + Math.round(Math.abs(ratio - 1) * 100) + "% " + (ratio > 1 ? "above" : "below") + ".");
			}
		};
		if (row.turns > t.turns.maximum * (1 + tolerance) || row.turns < t.turns.minimum * (1 - tolerance)) {
			const edge = row.turns > t.turns.maximum ? t.turns.maximum : t.turns.minimum;
			lines.push(where + ": the fight lasts " + round(row.turns) + " turns on average against a target of " + t.turns.minimum + " to " + t.turns.maximum +
				", which is " + Math.round(Math.abs(row.turns / edge - 1) * 100) + "% " + (row.turns > t.turns.maximum ? "above the top" : "below the bottom") + " of that range.");
		}
		single("the enemy line-up's total health", row.lineupHealth, t.lineupHealth, "");
		single("the damage the party takes each turn", row.grossPerTurn, t.grossPerTurn, "");
		single("the share of party health lost over the fight", row.netFraction * 100, t.netFraction * 100, "%");
		single("the party's damage plus Lust dealt each turn", row.outputPerTurn, t.output, "");
		if (t.lustPerTurnMaximum > 0 && row.lustPerTurn > t.lustPerTurnMaximum * (1 + tolerance)) {
			lines.push(where + ": the party takes " + round(row.lustPerTurn) + " Lust each turn against a ceiling of " + round(t.lustPerTurnMaximum) +
				", which is " + Math.round((row.lustPerTurn / t.lustPerTurnMaximum - 1) * 100) + "% above.");
		}
	}
	return lines;
}

//What a job gives back, and the description used if it fails.
function describeJob(job) { return job.encounterIndex + " (region " + (job.act + 1) + "), party " + job.party.join(",") + ", seed " + job.seed; }

function makeRunner(options) {
	applyBotOptions(options);
	const hc = loadEngine();
	return function (job) {
		try { return playFight(hc, job.party, job.encounterIndex, job.seed, job.draftCount, false); }
		catch (error) { return { error: String(error && error.stack || error) }; }
	};
}

async function main() {
	const hc = loadEngine();
	const balance = hc.tuning.balance;
	if (TRACE) {
		applyBotOptions({ botLegacy: BOT_LEGACY });
		const encounter = hc.findDefinition(hc.encounterArray, TRACE);
		const act = REGION_OPTION != null ? parseInt(REGION_OPTION, 10) : regionsFor(hc, encounter)[0];
		const target = targetsForRow(hc, encounter, act, PARAMS.fallbackPartyHealth);
		console.log("BALANCE TEST: BASIC BITE");
		console.log("TRACE " + TRACE + " region " + act + " party " + PARTIES[0].join(",") + " seed 1, drafted " + target.draftCount);
		console.log(JSON.stringify(playFight(hc, PARTIES[0], TRACE, 1, target.draftCount, true)));
		return;
	}
	const onlyArray = ONLY_OPTION ? ONLY_OPTION.split(",") : null;

	//The job list, in the same order the old audit played its fights, and where each row's jobs sit in it.
	const jobs = [];
	const rowSpecs = [];
	for (const encounter of hc.encounterArray) {
		if (onlyArray && onlyArray.indexOf(encounter.index) < 0) continue;
		if (encounter.testFixture === true && !onlyArray) continue;
		for (const act of regionsFor(hc, encounter)) {
			if (REGION_OPTION != null && act !== parseInt(REGION_OPTION, 10)) continue;
			const draftCount = targetsForRow(hc, encounter, act, PARAMS.fallbackPartyHealth).draftCount;
			const first = jobs.length;
			for (const party of PARTIES) {
				for (let seed = 1; seed <= SEEDS; seed++) jobs.push({ encounterIndex: encounter.index, act, party, seed, draftCount });
			}
			rowSpecs.push({ encounter, act, first, last: jobs.length });
		}
	}

	const outcome = await workers.runJobs({
		file: __filename, factory: makeRunner, options: { botLegacy: BOT_LEGACY }, jobs, workers: WORKERS, describe: describeJob,
		onProgress: (done, total) => { if (!JSON_OUT && process.stderr.isTTY) process.stderr.write("\r" + done + " / " + total + " fights"); },
	});
	if (process.stderr.isTTY && !JSON_OUT) process.stderr.write("\n");

	const rows = [];
	for (const spec of rowSpecs) {
		const samples = [];
		for (let id = spec.first; id < spec.last; id++) samples.push(outcome.results[id] || { error: "no result (see the failure list)" });
		const good = samples.filter((sample) => !sample.error);
		const partyMaximum = mean(good.map((s) => s.partyMaximum)) || PARAMS.fallbackPartyHealth;
		rows.push({
			index: spec.encounter.index, name: spec.encounter.name, tier: spec.encounter.tier, act: spec.act,
			enemies: spec.encounter.enemyIndexArray.join("+"),
			winRate: good.length ? good.filter((s) => s.won).length / good.length : 0,
			turns: mean(good.map((s) => s.turns)),
			deckSize: mean(good.map((s) => s.deckSize)),
			lineupHealth: mean(good.map((s) => s.lineupHealth)),
			grossPerTurn: mean(good.map((s) => s.turns ? s.gross / s.turns : 0)),
			lustPerTurn: mean(good.map((s) => s.turns ? s.lustTaken / s.turns : 0)),
			netLost: mean(good.map((s) => s.netLost)),
			netFraction: mean(good.map((s) => s.netLost / s.partyMaximum)),
			selfInflicted: mean(good.map((s) => s.selfInflicted)),
			healed: mean(good.map((s) => s.healed)),
			outputPerTurn: mean(good.map((s) => s.turns ? (s.dealt + s.lustDealt) / s.turns : 0)),
			lustShareOfOutput: mean(good.map((s) => (s.dealt + s.lustDealt) ? s.lustDealt / (s.dealt + s.lustDealt) : 0)),
			broken: mean(good.map((s) => s.broken)),
			errors: samples.length - good.length,
			firstError: samples.find((s) => s.error) ? samples.find((s) => s.error).error.split("\n").slice(0, 3).join(" | ") : null,
			target: targetsForRow(hc, spec.encounter, spec.act, partyMaximum),
		});
	}
	if (JSON_OUT) { console.log(JSON.stringify({ seeds: SEEDS, parties: PARTIES, balance, rows, failures: outcome.failures }, null, 1)); return; }

	const v = balance.varianceFraction;
	console.log("BALANCE TEST: BASIC BITE");
	console.log("");
	console.log(rows.length + " rows x " + PARTIES.length + " parties x " + SEEDS + " seeds (" + (BOT_LEGACY ? "session-34 bot" : "lookahead bot") + ", fresh save, drafted decks)");
	console.log("targets from tuning.balance; marks: ✓ within ±" + Math.round(v * 100) + "%  ▲ over  ▼ under. Net = health lost as % of party HP. out = damage + Lust dealt.");
	console.log("");
	const header = ["encounter", "reg/tier/kind", "deck", "win", "turns (tgt)", "lineup HP (tgt)", "gross/turn (tgt)", "lust/turn (max)", "net % (tgt)", "self", "heal", "out/turn (tgt)"];
	const widths = [24, 18, 5, 5, 14, 16, 17, 16, 14, 5, 5, 15];
	const line = (cells) => cells.map((cell, index) => String(cell).padEnd(widths[index])).join(" ");
	console.log(line(header));
	console.log(line(widths.map((w) => "-".repeat(w - 1))));
	const sorted = rows.slice().sort((a, b) => a.act - b.act);
	let lastGroup = null;
	for (const row of sorted) {
		const t = row.target;
		const group = row.act + "/" + row.tier + "/" + t.kind;
		if (group !== lastGroup) { if (lastGroup != null) console.log(""); lastGroup = group; }
		const turnsMark = row.turns > t.turns.maximum * (1 + v) ? "▲" : row.turns < t.turns.minimum * (1 - v) ? "▼" : "✓";
		console.log(line([
			row.name.slice(0, 23),
			"R" + (row.act + 1) + " " + row.tier + "/" + t.kind,
			Math.round(row.deckSize),
			Math.round(row.winRate * 100) + "%",
			round(row.turns) + " (" + t.turns.minimum + "-" + t.turns.maximum + ") " + turnsMark,
			Math.round(row.lineupHealth) + " (" + Math.round(t.lineupHealth) + ") " + mark(row.lineupHealth, t.lineupHealth, v),
			round(row.grossPerTurn) + " (" + round(t.grossPerTurn) + ") " + mark(row.grossPerTurn, t.grossPerTurn, v),
			round(row.lustPerTurn) + " (" + round(t.lustPerTurnMaximum) + ") " + (row.lustPerTurn > t.lustPerTurnMaximum ? "▲" : "✓"),
			round(row.netFraction * 100) + " (" + Math.round(t.netFraction * 100) + ") " + mark(row.netFraction, t.netFraction, v),
			round(row.selfInflicted, 0),
			round(row.healed, 0),
			round(row.outputPerTurn) + " (" + t.output + ") " + mark(row.outputPerTurn, t.output, v),
		]) + (row.errors ? "   !! " + row.errors + " errors: " + row.firstError : ""));
	}
	console.log("");
	const groups = {};
	for (const row of sorted) (groups["R" + (row.act + 1) + " " + row.tier + "/" + row.target.kind] = groups["R" + (row.act + 1) + " " + row.tier + "/" + row.target.kind] || []).push(row);
	console.log("SPREAD BY GROUP (rule: every encounter within ±" + Math.round(v * 100) + "% of the group target)");
	for (const key of Object.keys(groups)) {
		const group = groups[key];
		const range = (pick, places) => round(Math.min(...group.map(pick)), places) + ".." + round(Math.max(...group.map(pick)), places);
		console.log("  " + key.padEnd(20) + " n=" + String(group.length).padEnd(3) +
			" lineup HP " + range((r) => r.lineupHealth, 0) + "  gross/turn " + range((r) => r.grossPerTurn) +
			"  net% " + range((r) => r.netFraction * 100) + "  turns " + range((r) => r.turns) + "  out " + range((r) => r.outputPerTurn));
	}

	console.log("");
	console.log("THESE ENCOUNTERS ARE FAR FROM THEIR TARGET (more than " + Math.round(v * PARAMS.farFactor * 100) + "% off; the game's own rule allows " + Math.round(v * 100) + "%)");
	const far = farLines(sorted, balance);
	if (far.length === 0) console.log("  None. Every measurement is within " + Math.round(v * PARAMS.farFactor * 100) + "% of its target.");
	for (const text of far) console.log("  " + text);

	if (outcome.failures.length > 0) {
		console.log("");
		console.log("FIGHTS THAT DID NOT FINISH (" + outcome.failures.length + "). They are left out of the averages above.");
		for (const failure of outcome.failures) console.log("  " + failure.job + ": " + failure.error.split("\n").slice(0, 2).join(" | "));
	}
}

if (workers.isChild()) {
	workers.serve(makeRunner);
} else {
	main().catch((error) => { console.error(error); process.exit(1); });
}
