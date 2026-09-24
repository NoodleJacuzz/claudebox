//REWRITES. Turns the desk's own backups into candidate entries for the rewrite log.
//
//  node rewrites.js                 every change the desk has recorded, oldest first
//  node rewrites.js --since <date>  only changes after that date (any string Date can parse)
//  node rewrites.js --files         what states were compared, and nothing else
//
//WHY THIS EXISTS. `events.js` copies a game file into desk/data/backups/ before every write, so a
//before and an after already exist for every edit made from the phone. Collecting them by hand is what
//this replaces. The output is CANDIDATES, not log entries: a run also catches typo fixes and reflow,
//and deciding which changes are about voice is a reading job. Paste the ones that are into
//`.claude/skills/syrup-town-scenes/reference/rewrites.md`. The project is `!designDocs/voice_matching/`.
//
//WHOSE EDIT IS IT. A backup is written only by a save through the desk page, and Claude edits these
//files directly rather than through the desk, so in practice every backup is Noodle's. The server does
//accept `?as=claude` on a save, which would break that assumption; nothing does it today. If a run ever
//shows changes that look like Claude's own, that is the reason.
"use strict";
const fs = require("fs"), path = require("path");

const HERE = __dirname;
const REPO = path.resolve(HERE, "..", "..", "..", "..");
const DATA = path.resolve(HERE, "..", "..", "desk", "data");
const BACKUPS = path.join(DATA, "backups"), DRAFTS = path.join(DATA, "drafts");

const argArray = process.argv.slice(2);
const sinceRaw = (argArray[argArray.indexOf("--since") + 1] || "");
const since = argArray.includes("--since") ? new Date(sinceRaw) : null;
const filesOnly = argArray.includes("--files");

//---------------------------------------------------------------------------------------------------
//Finding the states of one file, oldest first, with the LIVE file last
//---------------------------------------------------------------------------------------------------
//A backup is named `<basename>.<stamp>.<ext>`, and it holds the file as it was BEFORE that write. So
//the state after write N is the backup taken before write N+1, and the state after the last write is
//the file on disk now. That is why the live file is appended as the final state.
function findLive(basename, ext) {
	if (ext === ".txt") return path.join(DRAFTS, basename.replace(/^draft-/, "") + ".txt");
	const stack = [path.join(REPO, "scripts")];
	while (stack.length) {
		const here = stack.pop();
		for (const name of fs.existsSync(here) ? fs.readdirSync(here) : []) {
			const full = path.join(here, name);
			if (fs.statSync(full).isDirectory()) stack.push(full);
			else if (name === basename + ext) return full;
		}
	}
	return "";
}

function stateArray() {
	const groupMap = {};
	for (const name of fs.existsSync(BACKUPS) ? fs.readdirSync(BACKUPS) : []) {
		const ext = path.extname(name);
		const rest = name.slice(0, -ext.length);
		const cut = rest.lastIndexOf(".");
		if (cut < 0) continue;
		const basename = rest.slice(0, cut), stamp = rest.slice(cut + 1);
		//Two stamp shapes are in use: an ISO string with its colons and dots turned into dashes, and a
		//plain millisecond count for drafts.
		const when = /^\d+$/.test(stamp) ? new Date(Number(stamp))
			: new Date(stamp.replace(/^(\d{4}-\d{2}-\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/, "$1T$2:$3:$4.$5Z"));
		(groupMap[basename + ext] = groupMap[basename + ext] || []).push({ when: when, file: path.join(BACKUPS, name) });
	}
	const out = [];
	for (const key of Object.keys(groupMap).sort()) {
		const ext = path.extname(key), basename = key.slice(0, -ext.length);
		const rowArray = groupMap[key].sort((a, b) => a.when - b.when);
		const live = findLive(basename, ext);
		if (live && fs.existsSync(live)) rowArray.push({ when: fs.statSync(live).mtime, file: live, live: true });
		out.push({ basename: basename, ext: ext, rowArray: rowArray });
	}
	return out;
}

//---------------------------------------------------------------------------------------------------
//Reading one state into addressable lines
//---------------------------------------------------------------------------------------------------
//An event file becomes a map of `event / page` -> the prose lines on that page, in order. A draft file
//is read as its own single page. Everything else about the file is ignored on purpose: a diff of the
//whole source would be mostly punctuation.
const LINE = new RegExp(
	'\\{ speaker: "([^"]*)", text: "((?:[^"\\\\]|\\\\.)*)" \\}'
	+ '|\\{ text: "((?:[^"\\\\]|\\\\.)*)" \\}'
	+ '|\\{ divider: (true) \\}'
	+ '|\\n\\t*index: "([^"]*)"'
	+ '|imagePath: "([^"]*)"', "g");

function readEvents(source) {
	const pageMap = {};
	for (const chunk of source.split(/\n\t\{\n\t\tindex: "/).slice(1)) {
		const event = chunk.split('"')[0];
		let page = "(base)", key = event + " / " + page;
		pageMap[key] = pageMap[key] || [];
		LINE.lastIndex = 0;
		let found;
		while ((found = LINE.exec(chunk)) !== null) {
			if (found[5] !== undefined) {            //a page's own index: everything after it is that page
				page = found[5];
				key = event + " / " + page;
				pageMap[key] = pageMap[key] || [];
			} else if (found[6] !== undefined) {
				pageMap[key].push({ kind: "image", text: found[6] });
			} else if (found[4] !== undefined) {
				pageMap[key].push({ kind: "divider", text: "..." });
			} else if (found[3] !== undefined) {
				if (found[3]) pageMap[key].push({ kind: "narration", text: found[3] });
			} else {
				pageMap[key].push({ kind: found[1], text: found[2] });
			}
		}
	}
	return pageMap;
}

function readDraft(source) {
	const body = source.replace(/\r/g, "").split("\n---\n").slice(1).join("\n---\n");
	return { "(draft)": body.split("\n").filter((line) => line.trim() !== "").map((line) => ({ kind: "line", text: line })) };
}

//The text is read straight out of a JS string literal, so its escapes are still in it. It is a JSON
//string body by construction, which is the cheapest correct way to undo them.
const plain = (text) => { try { return JSON.parse('"' + text + '"'); } catch (error) { return String(text); } };
const show = (row) => (row.kind === "narration" ? "t " : row.kind === "image" ? "im " : row.kind === "divider" ? "" : row.kind + " ") + plain(row.text);

//---------------------------------------------------------------------------------------------------
//The diff
//---------------------------------------------------------------------------------------------------
//Longest common subsequence over whole lines. The lists are dozens of entries long, so the simple
//table is fine and a dependency would not be.
function align(before, after) {
	const table = [];
	for (let i = 0; i <= before.length; i++) table.push(new Array(after.length + 1).fill(0));
	for (let i = before.length - 1; i >= 0; i--)
		for (let j = after.length - 1; j >= 0; j--)
			table[i][j] = show(before[i]) === show(after[j])
				? table[i + 1][j + 1] + 1
				: Math.max(table[i + 1][j], table[i][j + 1]);
	const out = [];
	let i = 0, j = 0;
	while (i < before.length && j < after.length) {
		if (show(before[i]) === show(after[j])) { out.push({ same: before[i] }); i++; j++; }
		else if (table[i + 1][j] >= table[i][j + 1]) { out.push({ gone: before[i] }); i++; }
		else { out.push({ came: after[j] }); j++; }
	}
	while (i < before.length) out.push({ gone: before[i++] });
	while (j < after.length) out.push({ came: after[j++] });
	return out;
}

//A removed line and an added line next to each other are usually one line REWRITTEN, which is the pair
//worth keeping. They are treated as the same line when they share enough words; otherwise they are
//reported as a cut and an addition, which is also a finding.
function overlap(one, two) {
	const wordsOf = (text) => new Set(String(text).toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean));
	const a = wordsOf(one), b = wordsOf(two);
	if (!a.size || !b.size) return 0;
	let shared = 0;
	for (const word of a) if (b.has(word)) shared++;
	return shared / Math.min(a.size, b.size);
}

function pairUp(steps) {
	const out = [];
	for (let i = 0; i < steps.length; i++) {
		const goneArray = [], cameArray = [];
		while (i < steps.length && (steps[i].gone || steps[i].came)) {
			(steps[i].gone ? goneArray : cameArray).push(steps[i].gone || steps[i].came);
			i++;
		}
		if (!goneArray.length && !cameArray.length) continue;
		const used = new Set();
		for (const gone of goneArray) {
			let best = -1, score = 0.34;              //below this they are two different lines, not one rewritten
			cameArray.forEach((came, at) => {
				if (used.has(at) || came.kind !== gone.kind) return;
				const value = overlap(gone.text, came.text);
				if (value > score) { score = value; best = at; }
			});
			if (best >= 0) { used.add(best); out.push({ from: gone, to: cameArray[best] }); }
			else out.push({ from: gone });
		}
		cameArray.forEach((came, at) => { if (!used.has(at)) out.push({ to: came }); });
	}
	return out;
}

//---------------------------------------------------------------------------------------------------
//Reporting
//---------------------------------------------------------------------------------------------------
const groupArray = stateArray();
if (!groupArray.length) { console.log("No backups in " + BACKUPS + " yet. A save from the desk makes one."); process.exit(0); }

if (filesOnly) {
	for (const group of groupArray) {
		console.log("\n" + group.basename + group.ext);
		group.rowArray.forEach((row, at) => console.log("  %s  %s%s", row.when.toISOString(), path.basename(row.file), row.live ? "   (live)" : at === 0 ? "   (oldest)" : ""));
	}
	process.exit(0);
}

let changeCount = 0;
for (const group of groupArray) {
	const read = group.ext === ".txt" ? readDraft : readEvents;
	for (let at = 0; at + 1 < group.rowArray.length; at++) {
		const before = group.rowArray[at], after = group.rowArray[at + 1];
		if (since && after.when < since) continue;
		const beforeMap = read(fs.readFileSync(before.file, "utf8")), afterMap = read(fs.readFileSync(after.file, "utf8"));
		const reportArray = [];
		for (const key of Object.keys(afterMap)) {
			if (!beforeMap[key]) { reportArray.push({ key: key, added: afterMap[key] }); continue; }
			const pairArray = pairUp(align(beforeMap[key], afterMap[key]));
			if (pairArray.length) reportArray.push({ key: key, pairArray: pairArray });
		}
		for (const key of Object.keys(beforeMap)) if (!afterMap[key]) reportArray.push({ key: key, removed: beforeMap[key] });
		if (!reportArray.length) continue;

		changeCount++;
		console.log("\n" + "=".repeat(99));
		console.log("EDIT %d   %s   %s%s", changeCount, after.when.toISOString().replace("T", " ").slice(0, 19), group.basename + group.ext, after.live ? "   (into the live file)" : "");
		console.log("=".repeat(99));
		for (const report of reportArray) {
			console.log("\n  " + report.key);
			if (report.added) { report.added.forEach((row) => console.log("     NEW PAGE   " + show(row))); continue; }
			if (report.removed) { report.removed.forEach((row) => console.log("     PAGE GONE  " + show(row))); continue; }
			for (const pair of report.pairArray) {
				if (pair.from && pair.to) {
					console.log("     draft:  " + show(pair.from));
					console.log("     his:    " + show(pair.to));
					console.log("");
				} else if (pair.from) console.log("     CUT:    " + show(pair.from) + "\n");
				else console.log("     ADDED:  " + show(pair.to) + "\n");
			}
		}
	}
}

if (!changeCount) console.log("\nNothing changed between the states on disk" + (since ? " after " + since.toISOString() : "") + ".");
else console.log("\n%d edit(s). These are CANDIDATES -- keep the ones that are about voice, in\n"
	+ ".claude/skills/syrup-town-scenes/reference/rewrites.md, with one line on what changed.", changeCount);
