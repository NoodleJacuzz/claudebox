//DESK -- the game's events, as Noodle's sketch text, and back again.
//
//  load()                      every event in the game as a model (beats, lines, buttons) plus where each
//                              value sits in its source file
//  toText(model)               a model as sketch text: `im`, `necro ...`, `t ...`, blank line between beats
//  parseText(text, context)    sketch text as a model
//  save(index, text)           writes the differences into the game file, or explains why it cannot
//
//WHAT A SAVE MAY WRITE. Words, the lines inside a beat, image paths, the name, button labels, and a Lust
//Event's tag and rank. Each one replaces only its own characters in the file. Anything that changes the
//SHAPE of an event (a new beat, a new button, a new requirement) is never written: the text is kept as a
//pending request for Claude instead. A save is all or nothing, the file is copied to data/backups first,
//and a save that leaves the file unloadable or different from what was asked for is undone on the spot.
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");
const literal = require("./literal.js");

const REPO = path.resolve(__dirname, "..", "..", "..", "..");
const SCRIPT_ROOT = path.join(REPO, "scripts", "misc");
const TOOLS = path.resolve(__dirname, "..");
const SOURCE_ARRAY = [
	{ kind: "lust", file: path.join(SCRIPT_ROOT, "honeycomb", "honeycomb-content-lust-events.js"), arrayName: "honeycomb.lustEventContentArray" },
	{ kind: "map", file: path.join(SCRIPT_ROOT, "honeycomb", "honeycomb-content-map.js"), arrayName: "honeycomb.eventArray" },
];
const QUEUE = { file: SOURCE_ARRAY[0].file, arrayName: "honeycomb.lustEventQueueArray" };

//---------------------------------------------------------------------------------------------------
//The engine, loaded the way every other tool in this folder loads it.
function loadEngine() {
	const fileArray = eval(fs.readFileSync(path.join(TOOLS, "card-inventory.js"), "utf8").match(/const FILES = (\[[\s\S]*?\]);/)[1]);
	const sandbox = {
		console: { log() {}, warn() {}, debug() {}, info() {}, error() {} },
		localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
		Date, Math, JSON, encodeURI, encodeURIComponent, decodeURIComponent, Object, Array, String, Number, Infinity, parseInt, parseFloat, setTimeout, clearTimeout,
		document: { getElementById: () => null, createElement: () => ({ style: { setProperty() {} }, appendChild() {}, classList: { add() {}, remove() {} } }), body: null },
	};
	sandbox.window = sandbox;
	vm.createContext(sandbox);
	for (const file of fileArray) vm.runInContext(fs.readFileSync(path.join(SCRIPT_ROOT, file), "utf8"), sandbox, { filename: file });
	return sandbox.honeycomb;
}

let cache = null;
function stamp() {
	return SOURCE_ARRAY.map((source) => fs.statSync(source.file).mtimeMs).join("|") + "|" +
		fs.statSync(path.join(SCRIPT_ROOT, "honeycomb", "honeycomb-content-characters.js")).mtimeMs;
}

//---------------------------------------------------------------------------------------------------
//Speakers. The sketch format names a speaker by SPRITE index (`necro`), the game by display name.
function speakerTables(hc) {
	const tokenToName = {}, nameToToken = {}, folderAlias = {}, tokenToIndex = {};
	for (const character of hc.characterArray || []) {
		if (character.artFolder == null) continue;
		nameToToken[character.name] = character.artFolder;
		tokenToName[character.artFolder.toLowerCase()] = character.name;
		tokenToName[String(character.index).toLowerCase()] = character.name;
		tokenToIndex[character.artFolder.toLowerCase()] = character.index;
		tokenToIndex[String(character.index).toLowerCase()] = character.index;
		folderAlias[String(character.index).toLowerCase()] = character.artFolder;
		folderAlias[character.artFolder.toLowerCase()] = character.artFolder;
	}
	//The party-place tokens an image path may carry (`{leader}`), front first. The same list names the
	//comment blocks: `leader block` is place 0, `second block` place 1.
	const partyTokenArray = (hc.tuning && hc.tuning.ui && hc.tuning.ui.eventPartyTokenArray) || ["{leader}"];
	const slotWordArray = partyTokenArray.map((token) => token.replace(/[{}]/g, ""));
	return { tokenToName, nameToToken, folderAlias, tokenToIndex, partyTokenArray, slotWordArray };
}

//PARTY COMMENT LINES. A line spoken only when a given character stands in a given party place: the
//engine's `partyContains` condition with a `position`, which is how an event lets whoever leads say
//something of their own (honeycomb.eventOverlay.renderDialogue). In the sketch text they are written as
//a block: `leader block`, then one line per character, closed by anything that is not a character line
//or by `end block`. Returns {slot, character} for such a line, or null for any other.
function slotOf(line) {
	const condition = line.condition;
	if (condition == null || condition.index !== "partyContains" || typeof condition.position !== "number") return null;
	if (line.speaker == null || typeof condition.character !== "string") return null;
	if (line.characterIndex != null && line.characterIndex !== condition.character) return null;
	const extra = Object.keys(condition).filter((key) => ["index", "character", "position"].indexOf(key) < 0);
	return extra.length > 0 ? null : { slot: condition.position, character: condition.character };
}
const squash = (name) => String(name).replace(/\s+/g, "");

//---------------------------------------------------------------------------------------------------
//Models
function beatFrom(value, node, pageIndex) {
	const lineArray = [];
	for (const line of value.lineArray || []) {
		const slot = slotOf(line);
		if (line.divider === true) lineArray.push({ divider: true });
		else if (slot != null) lineArray.push({ speaker: String(line.speaker), text: String(line.text == null ? "" : line.text), slot: slot.slot, character: slot.character });
		else if (line.speaker != null) lineArray.push({ speaker: String(line.speaker), text: String(line.text == null ? "" : line.text) });
		else lineArray.push({ text: String(line.text == null ? "" : line.text) });
	}
	//A line carrying anything beyond speaker/text/divider keeps its shape: its words may change, its place
	//may not. A party comment line is the one exception, because the desk writes exactly that shape.
	const plain = (value.lineArray || []).every((line) => slotOf(line) != null ||
		Object.keys(line).every((key) => key === "speaker" || key === "text" || key === "divider"));
	return {
		pageIndex: pageIndex,
		imagePath: value.imagePath == null ? "" : String(value.imagePath),
		body: value.text == null ? "" : String(value.text),
		lineArray: lineArray,
		linesArePlain: plain,
		choiceArray: (value.choiceArray || []).map((choice) => ({
			index: choice.index, text: choice.text == null ? "" : String(choice.text),
			previewText: choice.previewText == null ? "" : String(choice.previewText),
			resultText: choice.resultText == null ? "" : String(choice.resultText),
			goToPage: choice.goToPage == null ? null : choice.goToPage,
		})),
		node: node,
	};
}

function load() {
	const now = stamp();
	if (cache != null && cache.stamp === now) return cache;
	const hc = loadEngine();
	const tables = speakerTables(hc);
	const modelArray = [];
	const queueSource = fs.readFileSync(QUEUE.file, "utf8");
	const queueNode = literal.parseNamedArray(queueSource, QUEUE.arrayName);
	for (const source of SOURCE_ARRAY) {
		const text = fs.readFileSync(source.file, "utf8");
		const arrayNode = literal.parseNamedArray(text, source.arrayName);
		if (arrayNode == null) continue;
		for (const node of arrayNode.itemArray) {
			let index = null;
			if (node.type === "object") { const found = literal.property(node, "index"); index = found == null ? null : found.value; }
			else { const match = /index:\s*["']([^"']+)["']/.exec(text.slice(node.start, node.end)); index = match == null ? null : match[1]; }
			if (index == null) continue;
			const value = hc.findDefinition(hc.eventArray, index);
			if (value == null) continue;
			const writable = node.type === "object";
			const pageNode = writable ? literal.property(node, "pageArray") : null;
			const beatArray = [beatFrom(value, writable ? node : null, null)];
			(value.pageArray || []).forEach((page, pageNumber) => {
				const oneNode = pageNode != null && pageNode.type === "array" ? pageNode.itemArray[pageNumber] : null;
				beatArray.push(beatFrom(page, oneNode != null && oneNode.type === "object" ? oneNode : null, page.index));
			});
			//The queue rows that play this event: they are its "requirements".
			const rowArray = [];
			(hc.lustEventQueueArray || []).forEach((row, rowNumber) => {
				if (row.event !== index) return;
				const rowNode = queueNode == null ? null : queueNode.itemArray[rowNumber];
				rowArray.push({ value: row, node: rowNode != null && rowNode.type === "object" ? rowNode : null });
			});
			modelArray.push({
				index: index, kind: value.lustEvent === true ? "lust" : "map", file: source.file, writable: writable,
				whyNotWritable: writable ? null : "This event contains code, so the desk shows it but cannot write it. Edits are kept as a request.",
				name: value.name == null ? "" : String(value.name), weight: value.weight,
				beatArray: beatArray, rowArray: rowArray, node: node,
			});
		}
	}
	cache = { stamp: now, modelArray: modelArray, tables: tables, hc: hc };
	return cache;
}

//---------------------------------------------------------------------------------------------------
//Model -> sketch text
function showPath(imagePath) { return imagePath.indexOf("characters/") === 0 ? imagePath.slice("characters/".length) : imagePath; }

function toText(model, tables) {
	const out = [];
	out.push("name " + model.name);
	const row = model.rowArray[0];
	if (row != null) {
		const value = row.value;
		out.push("character " + (Array.isArray(value.character) ? value.character.join(", ") : value.character));
		if (value.tag != null) out.push("tag " + value.tag);
		if (value.rank != null) out.push("rank " + value.rank);
		for (const requirement of value.requirementArray || []) {
			const rest = Object.keys(requirement).filter((key) => key !== "index").map((key) => key + "=" + (Array.isArray(requirement[key]) ? requirement[key].join("+") : requirement[key]));
			out.push("requires " + requirement.index + (rest.length ? " " + rest.join(" ") : ""));
		}
	}
	model.beatArray.forEach((beat) => {
		out.push("");
		if (beat.imagePath !== "") out.push("im " + showPath(beat.imagePath));
		if (beat.body !== "") out.push("body " + beat.body);
		let openSlot = null;
		beat.lineArray.forEach((line, lineNumber) => {
			const slot = line.slot == null ? null : line.slot;
			if (slot != null && slot !== openSlot) out.push((tables.slotWordArray[slot] || "place" + slot) + " block");
			//An ordinary character line straight after a block would be read as part of it, so the block is
			//closed out loud. Anything else (narration, a divider, a button) closes it by itself.
			if (slot == null && openSlot != null && line.speaker != null && tables.nameToToken[line.speaker] != null) out.push("end block");
			openSlot = slot;
			if (line.divider === true) out.push("t ...");
			else if (line.speaker != null) out.push((tables.nameToToken[line.speaker] || squash(line.speaker)) + " " + line.text);
			else out.push("t " + line.text);
		});
		for (const choice of beat.choiceArray) {
			out.push("> " + choice.text + (choice.previewText !== "" ? " | " + choice.previewText : ""));
			if (choice.resultText !== "") out.push(">> " + choice.resultText);
		}
	});
	return out.join("\n") + "\n";
}

//---------------------------------------------------------------------------------------------------
//Sketch text -> model. `context` carries what the text alone cannot say: the speakers already in the
//event (so `HeadGardener` finds "The Head Gardener") and the previous image (so `im 2` finds its folder).
function resolveImage(written, previous, tables) {
	let value = written.replace(/\s*\[[^\]]*\]\s*/g, " ").replace(/\s*\([^)]*\)\s*$/g, "").trim();
	if (/^\d+$/.test(value) && previous) return previous.replace(/\d+$/, value);
	const first = value.split("/")[0].toLowerCase();
	if (tables.folderAlias[first] != null) return "characters/" + tables.folderAlias[first] + value.slice(first.length);
	return value;
}

function parseText(text, context) {
	const tables = context.tables;
	const knownSpeaker = {};
	for (const name of context.speakerArray || []) knownSpeaker[squash(name).toLowerCase()] = name;
	const header = { name: null, tag: null, rank: null, character: null, requiresArray: [] };
	const beatArray = [];
	let beat = null;
	let previousImage = context.firstImage || "";
	let inHeader = true;
	//The party place a `leader block` / `second block` has opened, or null outside one.
	let slot = null;
	const open = () => { beat = { imagePath: "", imageNote: "", body: "", lineArray: [], choiceArray: [] }; beatArray.push(beat); };
	for (const rawLine of String(text).replace(/\r/g, "").split("\n")) {
		const line = rawLine.trim();
		if (line === "") { beat = null; slot = null; if (beatArray.length > 0 || !inHeader) inHeader = false; continue; }
		const blockMatch = /^(\S+)\s+block$/i.exec(line);
		if (blockMatch != null) {
			const word = blockMatch[1].toLowerCase();
			if (word === "end") { slot = null; continue; }
			const place = (tables.slotWordArray || []).indexOf(word);
			if (place >= 0) { inHeader = false; if (beat == null) open(); slot = place; continue; }
		}
		if (line[0] === "#" || line.indexOf("//") === 0) continue;
		const space = line.indexOf(" ");
		const word = (space < 0 ? line : line.slice(0, space));
		const rest = space < 0 ? "" : line.slice(space + 1).trim();
		if (inHeader && beatArray.length === 0 && ["name", "character", "tag", "rank", "requires"].indexOf(word) >= 0) {
			if (word === "requires") header.requiresArray.push(rest); else header[word] = rest;
			continue;
		}
		inHeader = false;
		if (beat == null) open();
		if (word === "im") {
			if (beat.imagePath !== "" || beat.lineArray.length > 0) open();
			beat.imagePath = resolveImage(rest, previousImage, tables);
			beat.imageNote = rest;
			previousImage = beat.imagePath;
		} else if (word === "body") beat.body = rest;
		else if (word === ">>") { if (beat.choiceArray.length > 0) beat.choiceArray[beat.choiceArray.length - 1].resultText = rest; }
		else if (word === ">") {
			const bar = rest.indexOf(" | ");
			beat.choiceArray.push({ text: bar < 0 ? rest : rest.slice(0, bar), previewText: bar < 0 ? "" : rest.slice(bar + 3), resultText: "" });
		} else if (word === "t") beat.lineArray.push(rest === "..." ? { divider: true } : { text: rest });
		else {
			const name = tables.tokenToName[word.toLowerCase()] || knownSpeaker[word.toLowerCase()] || word;
			const character = (tables.tokenToIndex || {})[word.toLowerCase()];
			if (slot != null && character != null) { beat.lineArray.push({ speaker: name, text: rest, slot: slot, character: character }); continue; }
			beat.lineArray.push({ speaker: name, text: rest });
		}
		//Anything that is not a character line ends a block.
		slot = null;
	}
	return { header: header, beatArray: beatArray };
}

//---------------------------------------------------------------------------------------------------
//Saving
const quote = (text) => JSON.stringify(String(text));
function serialiseLines(lineArray, indent) {
	if (lineArray.length === 0) return "[]";
	const rows = lineArray.map((line) => indent + "\t" + (line.divider === true ? "{ divider: true }"
		//A party comment line: spoken only while this character stands in that place. characterIndex is
		//what draws her portrait beside it.
		: line.slot != null ? "{ speaker: " + quote(line.speaker) + ", text: " + quote(line.text) + ", characterIndex: " + quote(line.character) +
			", condition: { index: \"partyContains\", character: " + quote(line.character) + ", position: " + Number(line.slot) + " } }"
		: line.speaker != null ? "{ speaker: " + quote(line.speaker) + ", text: " + quote(line.text) + " }"
			: "{ text: " + quote(line.text) + " }") + ",");
	return "[\n" + rows.join("\n") + "\n" + indent + "]";
}
const lineKey = (l) => [l.divider === true, l.speaker == null ? null : l.speaker, l.text || "", l.slot == null ? null : l.slot, l.character == null ? null : l.character];
const sameLines = (a, b) => JSON.stringify(a.map(lineKey)) === JSON.stringify(b.map(lineKey));

//Works out the edits a text asks for. Returns {editArray, blockArray}: blockArray non-empty means the
//text asks for something the desk does not write, in plain words, and then nothing at all is written.
function plan(model, parsed, source) {
	const editArray = [], blockArray = [];
	const replaceString = (node, key, wanted, label) => {
		const found = literal.property(node, key);
		const current = found == null ? "" : found.value;
		if (String(current) === String(wanted)) return;
		if (found == null || (found.type !== "string" && found.type !== "number")) { blockArray.push(label + " is not written in the file yet, so it cannot be changed in place"); return; }
		editArray.push({ start: found.start, end: found.end, text: found.type === "number" ? String(Number(wanted)) : quote(wanted) });
	};
	if (parsed.header.name != null) replaceString(model.node, "name", parsed.header.name, "The name");
	const row = model.rowArray[0];
	if (row != null && row.node != null) {
		if (parsed.header.tag != null) replaceString(row.node, "tag", parsed.header.tag, "The tag");
		if (parsed.header.rank != null) {
			if (!/^\d+$/.test(parsed.header.rank)) blockArray.push("The rank has to be a number");
			else replaceString(row.node, "rank", parsed.header.rank, "The rank");
		}
	}
	if (parsed.beatArray.length !== model.beatArray.length) {
		blockArray.push("The text has " + parsed.beatArray.length + " beats and the game has " + model.beatArray.length + " (adding or removing a beat needs Claude)");
		return { editArray, blockArray };
	}
	parsed.beatArray.forEach((wanted, number) => {
		const beat = model.beatArray[number];
		const label = "Beat " + (number + 1);
		if (beat.node == null) { blockArray.push(label + " cannot be located in the file"); return; }
		if (wanted.imagePath !== beat.imagePath) {
			if (wanted.imagePath === "") blockArray.push(label + ": removing an image needs Claude");
			else replaceString(beat.node, "imagePath", wanted.imagePath, label + "'s image");
		}
		if (wanted.body !== beat.body) replaceString(beat.node, "text", wanted.body, label + "'s body text");
		if (!sameLines(wanted.lineArray, beat.lineArray)) {
			const linesNode = literal.property(beat.node, "lineArray");
			//A beat with no line list yet (every map event, until someone gives it dialogue) gets one written
			//straight after its body text, which is where a reader of the file would look for it.
			const bodyNode = literal.property(beat.node, "text");
			if (linesNode == null && beat.lineArray.length === 0 && bodyNode != null) {
				editArray.push({ start: bodyNode.end, end: bodyNode.end,
					text: ",\n" + literal.indentAt(source, bodyNode.start) + "lineArray: " + serialiseLines(wanted.lineArray, literal.indentAt(source, bodyNode.start)) });
			}
			else if (linesNode == null || linesNode.type !== "array") blockArray.push(label + " has no line list in the file yet");
			else if (beat.linesArePlain) editArray.push({ start: linesNode.start, end: linesNode.end, text: serialiseLines(wanted.lineArray, literal.indentAt(source, linesNode.start)) });
			else if (wanted.lineArray.length !== beat.lineArray.length) blockArray.push(label + " has lines with extra settings, so lines cannot be added or removed there");
			else wanted.lineArray.forEach((line, lineNumber) => {
				const lineNode = linesNode.itemArray[lineNumber];
				if (line.text != null) replaceString(lineNode, "text", line.text, label + " line " + (lineNumber + 1));
				if (line.speaker != null) replaceString(lineNode, "speaker", line.speaker, label + " line " + (lineNumber + 1) + "'s speaker");
			});
		}
		if (wanted.choiceArray.length !== beat.choiceArray.length) { blockArray.push(label + ": adding or removing a button needs Claude"); return; }
		const choicesNode = literal.property(beat.node, "choiceArray");
		wanted.choiceArray.forEach((choice, choiceNumber) => {
			const current = beat.choiceArray[choiceNumber];
			const choiceNode = choicesNode == null ? null : choicesNode.itemArray[choiceNumber];
			if (choice.text !== current.text) replaceString(choiceNode, "text", choice.text, label + "'s button");
			if (choice.previewText !== current.previewText) replaceString(choiceNode, "previewText", choice.previewText, label + "'s button preview");
			if (choice.resultText !== current.resultText) replaceString(choiceNode, "resultText", choice.resultText, label + "'s button result");
		});
	});
	return { editArray, blockArray };
}

function contextFor(model, tables) {
	const speakerArray = [];
	for (const beat of model.beatArray) for (const line of beat.lineArray) if (line.speaker != null && speakerArray.indexOf(line.speaker) < 0) speakerArray.push(line.speaker);
	return { tables: tables, speakerArray: speakerArray, firstImage: model.beatArray[0].imagePath };
}

function save(index, text, backupFolder) {
	const loaded = load();
	const model = loaded.modelArray.find((one) => one.index === index);
	if (model == null) return { ok: false, written: false, reasonArray: ["No event called " + index] };
	if (!model.writable) return { ok: true, written: false, reasonArray: [model.whyNotWritable] };
	const source = fs.readFileSync(model.file, "utf8");
	const parsed = parseText(text, contextFor(model, loaded.tables));
	const planned = plan(model, parsed, source);
	if (planned.blockArray.length > 0) return { ok: true, written: false, reasonArray: planned.blockArray };
	if (planned.editArray.length === 0) return { ok: true, written: true, changeCount: 0, reasonArray: [] };

	let next = source;
	for (const edit of planned.editArray.slice().sort((a, b) => b.start - a.start)) next = next.slice(0, edit.start) + edit.text + next.slice(edit.end);
	try { new vm.Script(next, { filename: path.basename(model.file) }); }
	catch (error) { return { ok: false, written: false, reasonArray: ["The edited file would not load (" + error.message + "). Nothing was written."] }; }

	fs.mkdirSync(backupFolder, { recursive: true });
	const backup = path.join(backupFolder, path.basename(model.file, ".js") + "." + new Date().toISOString().replace(/[:.]/g, "-") + ".js");
	fs.writeFileSync(backup, source);
	fs.writeFileSync(model.file, next);
	//Read it back through the real engine. What the game now holds has to be what was asked for.
	let problem = null;
	try {
		cache = null;
		const after = load();
		const fresh = after.modelArray.find((one) => one.index === index);
		if (fresh == null) problem = "the event disappeared";
		else if (toText(fresh, after.tables) !== toText(applyParsed(model, parsed), after.tables)) problem = "the game did not read back what was written";
	} catch (error) { problem = error.message; }
	if (problem != null) {
		fs.writeFileSync(model.file, source);
		cache = null;
		return { ok: false, written: false, reasonArray: ["The save was undone: " + problem + ". The file is exactly as it was."] };
	}
	return { ok: true, written: true, changeCount: planned.editArray.length, backup: path.basename(backup), reasonArray: [] };
}

//What the model should look like once the parsed text has been applied. Used only to check a save.
function applyParsed(model, parsed) {
	const copy = JSON.parse(JSON.stringify(model, (key, value) => (key === "node" ? undefined : value)));
	if (parsed.header.name != null) copy.name = parsed.header.name;
	if (copy.rowArray[0] != null) {
		if (parsed.header.tag != null) copy.rowArray[0].value.tag = parsed.header.tag;
		if (parsed.header.rank != null) copy.rowArray[0].value.rank = Number(parsed.header.rank);
	}
	parsed.beatArray.forEach((wanted, number) => {
		const beat = copy.beatArray[number];
		beat.imagePath = wanted.imagePath; beat.body = wanted.body; beat.lineArray = wanted.lineArray;
		wanted.choiceArray.forEach((choice, choiceNumber) => Object.assign(beat.choiceArray[choiceNumber], choice));
	});
	return copy;
}

//The plan for a text without writing anything. For the self-test and for the phone's "what would this do".
function _planFor(index, text) {
	const loaded = load();
	const model = loaded.modelArray.find((one) => one.index === index);
	return plan(model, parseText(text, contextFor(model, loaded.tables)), fs.readFileSync(model.file, "utf8"));
}

const publicModel = (model) => JSON.parse(JSON.stringify(model, (key, value) => (key === "node" || key === "file" || key === "hc" ? undefined : value)));

module.exports = { load, toText, parseText, save, contextFor, publicModel, _planFor, REPO };
