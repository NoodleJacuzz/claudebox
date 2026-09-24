/**
 * SOUND REPORT for Honeycomb Catacombs.
 *
 * Not part of the game. This is the tool tuning.audio's comments have always claimed to be filled
 * from: it MEASURES the sound library rather than reading its filenames, and holds every assignment
 * to what the moment it plays at can carry.
 *
 * It reports four things:
 *   1  LENGTH     every stem's audible length against the limit for the moment it is assigned to
 *                 (tuning.audio.momentArray). A twelve-second wind bed on a card play is a bug a
 *                 filename cannot show.
 *   2  LOUDNESS   every stem's loudest 300ms window against the target, and the per-stem trim that
 *                 lands it there. Run with --trims to print a fileVolumeScaleMap block to paste.
 *   3  SHAPE      every card whose assigned sound disagrees with what the card DOES: a line-wide
 *                 effect on a single-target sound, a sound that harms on a card that harms nobody.
 *   4  COVERAGE   content with no assignment, and assignments naming a file that is not there.
 *
 * Usage:  node "!designDocs/honeycomb/tools/sfx-report.js"
 *         node "!designDocs/honeycomb/tools/sfx-report.js" --trims
 *
 * Lengths come from sfx-durations.js (MPEG frame headers, no decoder). AUDIBLE length and loudness
 * need a decoder, so they live in the generated sfx-metrics.json -- regenerate it with
 * sfx-report.html whenever a sound file is replaced. This tool reports when the two disagree.
 */
const fs = require("fs");
const vm = require("vm");
const path = require("path");
const { durationSeconds } = require("./sfx-durations.js");

const HERE = __dirname;
const REPO = path.resolve(HERE, "..", "..", "..");
const SFX_DIR = path.join(REPO, "honeycomb sound", "sfx");
const ROOT = path.join(REPO, "scripts", "misc");
const FILES = [
	"honeycomb.js",
	"honeycomb/honeycomb-tuning.js",
	"honeycomb/honeycomb-state.js",
	"honeycomb/honeycomb-effects.js",
	"honeycomb/honeycomb-entities.js",
	"honeycomb/honeycomb-tags.js",
	"honeycomb/honeycomb-content-statuses.js",
	"honeycomb/honeycomb-content-cards.js",
	"honeycomb/honeycomb-content-characters.js",
	"honeycomb/honeycomb-content-abilities.js",
	"honeycomb/honeycomb-abilities.js",
	"honeycomb/honeycomb-content-enemies.js",
	"honeycomb/honeycomb-content-map.js",
	"honeycomb/honeycomb-content-lust-events.js",
	"honeycomb/honeycomb-progression.js",
	"honeycomb/honeycomb-combat.js",
];

function newEngine() {
	const store = {};
	const sandbox = {
		console: { log() {}, warn() {}, debug() {}, info() {}, error() {} },
		localStorage: {
			getItem: (key) => (key in store ? store[key] : null),
			setItem: (key, value) => { store[key] = String(value); },
			removeItem: (key) => { delete store[key]; },
		},
		Date, Math, JSON, encodeURI, encodeURIComponent, decodeURIComponent,
		Object, Array, String, Number, Infinity, parseInt, parseFloat, setTimeout, clearTimeout,
		document: {
			getElementById: () => null,
			createElement: () => ({ style: { setProperty() {} }, appendChild() {}, classList: { add() {}, remove() {} } }),
			body: null,
		},
	};
	sandbox.window = sandbox;
	vm.createContext(sandbox);
	for (const file of FILES) vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), sandbox, { filename: file });
	return sandbox.honeycomb;
}

//---------------------------------------------------------------------------------------------------
//What a card DOES, in the terms a sound has to match.
//---------------------------------------------------------------------------------------------------
//Reads the effect chain rather than the card's name or its types, so a card whose prose lies is still
//described correctly. `wide` means it reaches a whole line; `harms` and `helps` say which direction.
const WIDE_TARGET_ARRAY = ["allEnemies", "allAllies", "otherAllies", "everyone"];
const OWN_SIDE_TARGET_ARRAY = ["owner", "allAllies", "otherAllies", "randomAlly", "source"];
//Damage effects by any name, so a card that spends its own blood through damageIgnoringTemporary is
//read as paying a price rather than as doing nothing.
const DAMAGE_INDEX_ARRAY = ["damage", "damageIgnoringTemporary", "lust", "loseHealth", "payHealth"];

function cardShape(hc, card) {
	const shape = { wide: false, helps: false, harms: false, harmsOwnSide: false };
	if (WIDE_TARGET_ARRAY.indexOf(card.targetMode) >= 0) shape.wide = true;
	const walk = function (list, inheritedWide) {
		for (const entry of list || []) {
			if (entry == null) continue;
			const wide = inheritedWide || WIDE_TARGET_ARRAY.indexOf(entry.targetOverride) >= 0;
			if (wide) shape.wide = true;
			const ownSide = OWN_SIDE_TARGET_ARRAY.indexOf(entry.targetOverride) >= 0;
			if (entry.index === "heal" || entry.index === "temporaryHealth" || entry.index === "soothe" ||
				entry.index === "drawCards" || entry.index === "gainResource") shape.helps = true;
			if (DAMAGE_INDEX_ARRAY.indexOf(entry.index) >= 0) {
				if (ownSide) shape.harmsOwnSide = true;
				else shape.harms = true;
			}
			//A curse pushed into the other team's piles is harm, and it reaches their whole line: the
			//draw and discard piles are shared by the party, not owned by one body.
			if (entry.index === "addCardToPile") { shape.harms = true; shape.wide = true; }
			if (entry.index === "applyStatus") {
				const status = hc.findDefinition(hc.statusArray, entry.status);
				const isDebuff = status != null && status.isDebuff === true;
				if (isDebuff && ownSide) shape.harmsOwnSide = true;
				else if (isDebuff) shape.harms = true;
				else shape.helps = true;
			}
			walk(entry.effectArray, wide);
			walk(entry.thenArray, wide);
			walk(entry.elseArray, wide);
			for (const option of entry.optionArray || []) walk(option.effectArray, wide);
		}
	};
	walk(card.effectArray, shape.wide);
	return shape;
}

function main() {
	const hc = newEngine();
	const audio = hc.tuning.audio;
	const metrics = JSON.parse(fs.readFileSync(path.join(HERE, "sfx-metrics.json"), "utf8"));
	const stemMap = metrics.stemMap;
	const target = metrics.targetLoudnessDb;
	const trimRange = audio.fileVolumeTrimRange;
	const onlyTrims = process.argv.indexOf("--trims") >= 0;

	const fileArray = fs.readdirSync(SFX_DIR).filter((name) => name.endsWith(".mp3")).map((name) => name.slice(0, -4)).sort();
	const issueArray = [];
	const note = (kind, subject, text) => issueArray.push({ kind, subject, text });

	//--- the metrics file against the files on disk ----------------------------------------------
	for (const stem of fileArray) {
		const measured = durationSeconds(path.join(SFX_DIR, stem + ".mp3"));
		const recorded = stemMap[stem];
		if (recorded == null) {
			note("stale-metrics", stem, "no entry in sfx-metrics.json -- regenerate with sfx-report.html");
			continue;
		}
		if (measured != null && Math.abs(measured - recorded.fileSeconds) > 0.06) {
			note("stale-metrics", stem, "file is " + measured.toFixed(2) + "s, metrics say " + recorded.fileSeconds + "s -- regenerate with sfx-report.html");
		}
	}
	for (const stem of Object.keys(stemMap)) {
		if (fileArray.indexOf(stem) < 0) note("stale-metrics", stem, "metrics name a file that is no longer in honeycomb sound/sfx");
	}

	//--- the trims --------------------------------------------------------------------------------
	const trimLineArray = [];
	for (const stem of fileArray) {
		const recorded = stemMap[stem];
		if (recorded == null) continue;
		const ideal = Math.pow(10, (target - recorded.loudnessDb) / 20);
		const trim = Math.min(trimRange.maximum, Math.max(trimRange.minimum, ideal));
		trimLineArray.push({ stem: stem, trim: Number(trim.toFixed(2)), short: ideal > trimRange.maximum + 0.001 });
	}
	if (onlyTrims) {
		console.log("\t\tfileVolumeScaleMap: {");
		for (const line of trimLineArray) {
			if (Math.abs(line.trim - 1) < 0.005) continue;
			const key = /^[A-Za-z_$][\w$]*$/.test(line.stem) ? line.stem : JSON.stringify(line.stem);
			console.log("\t\t\t" + key + ": " + line.trim + ",");
		}
		console.log("\t\t},");
		return;
	}

	//--- every assignment, against the moment it plays at -----------------------------------------
	const assignmentArray = [];
	for (const key of Object.keys(audio.fileMap)) {
		const moment = audio.eventMomentMap[key] == null ? audio.defaultMoment : audio.eventMomentMap[key];
		assignmentArray.push({ moment: moment, subject: "event " + key, stem: audio.fileMap[key] });
	}
	for (const key of Object.keys(audio.cardSfxMap)) {
		const card = hc.findDefinition(hc.cardArray, key);
		assignmentArray.push({
			moment: card != null && card.rarity === "enemy" ? "enemyMove" : "cardPlay",
			subject: "card " + key, stem: audio.cardSfxMap[key],
		});
	}
	for (const row of assignmentArray) {
		const recorded = stemMap[row.stem];
		if (recorded == null) {
			note("missing-file", row.subject, "names \"" + row.stem + "\", which is not in honeycomb sound/sfx");
			continue;
		}
		const moment = hc.findDefinition(audio.momentArray, row.moment);
		if (moment == null) {
			note("no-moment", row.subject, "moment \"" + row.moment + "\" is not in tuning.audio.momentArray");
			continue;
		}
		if (recorded.audibleSeconds > moment.maximumSeconds + 0.001) {
			note("too-long", row.subject, row.stem + " is " + recorded.audibleSeconds + "s audible; a " +
				moment.index + " may run " + moment.maximumSeconds + "s (" + moment.why + ")");
		}
	}

	//--- shape ------------------------------------------------------------------------------------
	for (const key of Object.keys(audio.cardSfxMap)) {
		const card = hc.findDefinition(hc.cardArray, key);
		if (card == null) {
			note("orphan-row", "card " + key, "cardSfxMap names a card that no longer exists");
			continue;
		}
		const stem = audio.cardSfxMap[key];
		const family = hc.findDefinition(audio.stemFamilyArray, stem);
		if (family == null) continue;
		const shape = cardShape(hc, card);
		if (family.reach === "party" && shape.wide === false) {
			note("shape", "card " + key, card.name + " reaches one target but plays " + stem + ", a line-wide sound");
		}
		if (family.reach === "single" && shape.wide === true) {
			note("shape", "card " + key, card.name + " reaches a whole line but plays " + stem + ", a single-target sound");
		}
		if (family.mood === "harm" && shape.harms === false && shape.harmsOwnSide === false) {
			note("shape", "card " + key, card.name + " harms nobody but plays " + stem);
		}
		if (family.mood === "help" && shape.helps === false) {
			note("shape", "card " + key, card.name + " helps nobody but plays " + stem);
		}
	}

	//--- coverage ---------------------------------------------------------------------------------
	for (const card of hc.cardArray) {
		if (audio.cardSfxMap[card.index] == null && card.sfx == null) {
			note("unassigned", "card " + card.index, card.name + " has no sound");
		}
	}

	//--- print ------------------------------------------------------------------------------------
	console.log("HONEYCOMB SOUND REPORT");
	console.log("=".repeat(100));
	console.log(fileArray.length + " files in honeycomb sound/sfx; target loudness " + target + " dB; " +
		"trim range " + trimRange.minimum + "-" + trimRange.maximum + "; master volume " + audio.fileVolume);
	console.log("");
	console.log("LENGTH AND LOUDNESS");
	console.log("-".repeat(100));
	console.log("stem".padEnd(20) + "file".padStart(8) + "audible".padStart(9) + "loud dB".padStart(9) +
		"trim".padStart(7) + "after".padStart(10) + "   note");
	for (const line of trimLineArray) {
		const recorded = stemMap[line.stem];
		const after = (recorded.loudnessDb + 20 * Math.log10(line.trim * audio.fileVolume)).toFixed(1);
		console.log(line.stem.padEnd(20) + (recorded.fileSeconds + "s").padStart(8) + (recorded.audibleSeconds + "s").padStart(9) +
			String(recorded.loudnessDb).padStart(9) + String(line.trim).padStart(7) + (after + " dB").padStart(10) +
			"   " + (line.short ? "TOO QUIET AT SOURCE -- re-render louder" : ""));
	}
	console.log("");
	console.log("FINDINGS");
	console.log("-".repeat(100));
	const kindArray = ["stale-metrics", "missing-file", "no-moment", "too-long", "shape", "orphan-row", "unassigned"];
	let printed = 0;
	for (const kind of kindArray) {
		const forKind = issueArray.filter((issue) => issue.kind === kind);
		if (forKind.length === 0) continue;
		console.log("\n[" + kind + "]  " + forKind.length);
		for (const issue of forKind) console.log("  " + issue.subject.padEnd(34) + " " + issue.text);
		printed += forKind.length;
	}
	if (printed === 0) console.log("nothing to report.");
	console.log("");
	console.log("=".repeat(100));
	console.log(printed + " finding(s). Run with --trims to print a fileVolumeScaleMap block.");
}

main();
