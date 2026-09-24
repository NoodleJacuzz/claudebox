//DESK, FROM CLAUDE'S SIDE. Reads and writes the same files the phone does, so the server does not have
//to be running. Everything written here is signed `claude`, which is what makes the phone show
//"Claude edited" and light the item up as unread.
//
//  node desk-cli.js inbox                      everything waiting, sorted by whose turn it is: what
//                                              Claude owes first, then what waits on Noodle, pending
//                                              edits, image requests, drafts. Short on purpose. START HERE.
//  node desk-cli.js reply <noteId> "<text>"    answer a note (shows under it on the phone)
//  node desk-cli.js done <noteId> ["<text>"]   close a note, with an optional last reply
//  node desk-cli.js report "<title>" "<text>"  a progress report: goes to "From Claude", never counts as open
//  node desk-cli.js remind "<text>" [<eventIndex> | <draftId>]
//                                              one task for Noodle, alone, saying where the details are.
//                                              Never put a task at the end of a report instead.
//  node desk-cli.js note "<text>"              a general note for Noodle (shows in his turn)
//  node desk-cli.js new "<title>" <stage> [character] <textFile> [--folder "<name>"] [--tags "a, b"]
//                                              create a draft from a text file
//  node desk-cli.js folder <draftId> "<folder>" ["<tags>"]   file a draft into a folder, with tags
//  node desk-cli.js stamp <draftId> [stage]    AFTER editing drafts/<id>.txt by hand: sign it as Claude's
//  node desk-cli.js image <requestId> <status> ["<detail>"]         update an image request
//  node desk-cli.js rewrites [--since <date>]  what HE changed, read off the backups -- candidate
//                                              entries for the rewrite log. See rewrites.js.
//
//`--data <folder>` points any command at a copy of the desk's data instead of the real one.
//
//A draft is `!designDocs/honeycomb/desk/data/drafts/<id>.txt`: header lines, `---`, sketch text. Edit the
//text with an ordinary file edit (patch it, never rewrite his writing), then run `stamp`.
"use strict";
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const notes = require("./notes.js");
const argumentArray = process.argv.slice(2);
//Takes `--name value` out of the arguments, so the rest are positional.
function option(name) {
	const at = argumentArray.indexOf("--" + name);
	if (at < 0) return null;
	const value = argumentArray[at + 1];
	argumentArray.splice(at, 2);
	return value;
}
const DATA = path.resolve(option("data") || path.join(__dirname, "..", "..", "desk", "data"));
const folderOption = option("folder"), tagsOption = option("tags");
const DESK_FILE = path.join(DATA, "desk.json"), DRAFTS = path.join(DATA, "drafts"), PENDING = path.join(DATA, "pending");
const [command, ...rest] = argumentArray;
const now = () => new Date().toISOString();
const newId = (prefix) => prefix + "-" + Date.now().toString(36) + crypto.randomBytes(2).toString("hex");
const readDesk = () => (fs.existsSync(DESK_FILE) ? JSON.parse(fs.readFileSync(DESK_FILE, "utf8")) : { noteArray: [], markMap: {}, seenMap: {}, imageRequestArray: [] });
const writeDesk = (desk) => { fs.writeFileSync(DESK_FILE + ".tmp", JSON.stringify(desk, null, "\t")); fs.renameSync(DESK_FILE + ".tmp", DESK_FILE); };
const where = (target) => !target || target.kind === "general" ? "general" : (target.event ? "event " + target.event : "draft " + target.draft) +
	(target.kind === "line" ? " beat " + (target.beat + 1) + " line " + (target.line + 1) + " \"" + String(target.snapshot).slice(0, 70) + "\"" : target.kind === "image" ? " image " + target.imagePath : "");
function setHeader(file, changes) {
	const raw = fs.readFileSync(file, "utf8").replace(/\r/g, "");
	const cut = raw.indexOf("\n---\n");
	const headArray = (cut < 0 ? "" : raw.slice(0, cut)).split("\n").filter((line) => line !== "" && !(line.split(":")[0].trim() in changes));
	for (const key of Object.keys(changes)) if (changes[key] !== "") headArray.push(key + ": " + changes[key]);
	fs.writeFileSync(file, headArray.join("\n") + "\n---\n" + (cut < 0 ? raw : raw.slice(cut + 5)));
}
const addNote = (note) => { const desk = readDesk(); desk.noteArray.push(Object.assign({ id: newId("n"), status: "open", author: "claude", target: { kind: "general" }, created: now(), replyArray: [] }, note)); writeDesk(desk); };

if (command === "inbox") {
	const desk = readDesk();
	const bySection = {};
	for (const note of desk.noteArray) (bySection[notes.sectionOf(note)] = bySection[notes.sectionOf(note)] || []).push(note);
	const full = (note) => { console.log("  [" + note.id + "] " + note.kind + (notes.asks(note) ? ", asks Claude" : "") + ", by " + note.author + ", " + where(note.target) + "\n      " + (note.title ? note.title + "\n      " : "") + note.text.replace(/\n/g, "\n      ")); for (const reply of note.replyArray || []) console.log("      > " + reply.author + ": " + reply.text); };
	const brief = (note) => console.log("  [" + note.id + "] " + note.kind + ", " + where(note.target) + ": " + notes.titleOf(note));
	console.log("CLAUDE'S TURN (" + (bySection.claude || []).length + ")  -- asked of Claude, not yet answered since Noodle last wrote"); (bySection.claude || []).forEach(full);
	console.log("\nNOODLE'S TURN (" + (bySection.you || []).length + ")  -- waiting on him; listed so nothing here is asked twice"); (bySection.you || []).forEach(brief);
	console.log("\nHIS NOTES AND PLAYER FEEDBACK (" + (bySection.notes || []).length + ")  -- waiting on nobody"); (bySection.notes || []).forEach(full);
	console.log("\nREPORTS FROM CLAUDE: " + (bySection.report || []).length + " on the desk");
	const pendingArray = fs.existsSync(PENDING) ? fs.readdirSync(PENDING) : [];
	console.log("\nEDITS THE DESK WOULD NOT WRITE (" + pendingArray.length + ")  -- his full text is in desk/data/pending/, apply it to the game by hand, then delete the file");
	pendingArray.forEach((name) => console.log("  " + name));
	const imageArray = desk.imageRequestArray.filter((r) => r.status !== "done");
	console.log("\nIMAGE REQUESTS (" + imageArray.length + ")");
	imageArray.forEach((r) => console.log("  [" + r.id + "] " + r.status + "  " + (r.imagePath || "(no path)") + "\n      + " + (r.positive || "").replace(/\n/g, ", ") + (r.negative ? "\n      - " + r.negative : "") + (r.comments ? "\n      \"" + r.comments + "\"" : "") + (r.detail ? "\n      " + r.detail.split("\n")[0] : "")));
	console.log("\nFLAGGED ⚑");
	Object.keys(desk.markMap).filter((key) => desk.markMap[key].flag).forEach((key) => console.log("  " + key + (desk.markMap[key].snapshot ? "  \"" + String(desk.markMap[key].snapshot).slice(0, 70) + "\"" : "")));
	console.log("\nDRAFTS");
	for (const name of fs.existsSync(DRAFTS) ? fs.readdirSync(DRAFTS) : []) {
		const head = fs.readFileSync(path.join(DRAFTS, name), "utf8").split("\n---\n")[0];
		const get = (key) => (new RegExp("^" + key + ": (.*)$", "m").exec(head) || [, ""])[1];
		console.log("  " + name + "  [" + get("stage") + "] " + get("title") + (get("character") ? " (" + get("character") + ")" : "") + (get("folder") ? "  folder: " + get("folder") : "") + (get("tags") ? "  tags: " + get("tags") : "") + "  last: " + get("updatedBy"));
	}
} else if (command === "reply" || command === "done") {
	const desk = readDesk();
	const note = desk.noteArray.find((one) => one.id === rest[0]);
	if (note == null) { console.error("no note " + rest[0]); process.exit(1); }
	if (rest[1]) note.replyArray.push({ author: "claude", text: rest[1], created: now() });
	if (command === "done") note.status = "done";
	note.updated = now();
	writeDesk(desk);
	console.log("ok");
} else if (command === "report") {
	if (!rest[0] || !rest[1]) { console.error("usage: report \"<title>\" \"<text>\""); process.exit(1); }
	addNote({ kind: "report", title: rest[0], text: rest[1] });
	console.log("ok");
} else if (command === "remind") {
	if (!rest[0]) { console.error("usage: remind \"<text>\" [<eventIndex> | <draftId>]"); process.exit(1); }
	const on = rest[1];
	addNote({ kind: "reminder", text: rest[0], target: on == null ? { kind: "general" } : /^d-/.test(on) ? { kind: "draft", draft: on } : { kind: "event", event: on } });
	console.log("ok");
} else if (command === "note") {
	addNote({ kind: "note", text: rest[0] });
	console.log("ok");
} else if (command === "new") {
	const [title, stage, third, fourth] = rest;
	const textFile = fourth == null ? third : fourth, character = fourth == null ? "" : third;
	const id = newId("d");
	fs.mkdirSync(DRAFTS, { recursive: true });
	const headArray = ["title: " + title, "stage: " + stage].concat(character ? ["character: " + character] : [], folderOption ? ["folder: " + folderOption] : [], tagsOption ? ["tags: " + tagsOption] : []);
	fs.writeFileSync(path.join(DRAFTS, id + ".txt"), headArray.concat(["created: " + now(), "updated: " + now(), "updatedBy: claude"]).join("\n") + "\n---\n" + fs.readFileSync(textFile, "utf8"));
	console.log(id);
} else if (command === "folder") {
	const changes = { folder: rest[1] || "", updated: now(), updatedBy: "claude" };
	if (rest[2] != null) changes.tags = rest[2];
	setHeader(path.join(DRAFTS, String(rest[0]).replace(/\.txt$/, "") + ".txt"), changes);
	console.log("ok");
} else if (command === "stamp") {
	const changes = { updated: now(), updatedBy: "claude" };
	if (rest[1]) changes.stage = rest[1];
	setHeader(path.join(DRAFTS, rest[0].replace(/\.txt$/, "") + ".txt"), changes);
	console.log("ok");
} else if (command === "image") {
	const desk = readDesk();
	const request = desk.imageRequestArray.find((one) => one.id === rest[0]);
	if (request == null) { console.error("no image request " + rest[0]); process.exit(1); }
	request.status = rest[1]; request.detail = rest[2] || ""; request.updated = now();
	writeDesk(desk);
	console.log("ok");
} else if (command === "rewrites") {
	require("child_process").spawnSync(process.execPath, [path.join(__dirname, "rewrites.js")].concat(rest), { stdio: "inherit" });
} else console.log("commands: inbox | reply | done | report | remind | note | new | folder | stamp | image | rewrites   (see the top of this file)");
