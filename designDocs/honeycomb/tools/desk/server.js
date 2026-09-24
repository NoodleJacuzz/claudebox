//THE PHONE DESK -- a small server on the home network that lets a phone read, edit and annotate
//Honeycomb's events, and keeps everything as plain files Claude can read and edit too.
//
//  node "!designDocs/honeycomb/tools/desk/server.js"        (or double-click start-desk.bat)
//
//No packages to install. Everything it stores is under !designDocs/honeycomb/desk/data/:
//  desk.json          notes and their replies, bookmarks/flags/sign-offs, read marks, image requests
//  drafts/<id>.txt    one created event each: a few `key: value` lines, `---`, then sketch text
//  pending/<event>.txt  an edit to a live event that the desk would not write, kept for Claude
//  backups/           a copy of a game file, taken before every write to it
//The server re-reads these on every request and never caches them, so a file Claude edits by hand shows
//up on the phone at its next poll (four seconds).
//
//It answers only private network addresses, and the only places it writes are data/, the two event
//content files (through events.js) and `v13 spire png/`.
"use strict";
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os"), crypto = require("crypto");
const { spawn } = require("child_process");
const events = require("./events.js");
const notes = require("./notes.js");
const facts = require("./facts.js");

//`--port`, `--data` and `--app` (or DESK_PORT, DESK_DATA, DESK_APP) let a second desk run beside the real
//one, on a copy of the data, so a new page can be tried without touching the real notes.
const argumentOf = (name) => { const at = process.argv.indexOf("--" + name); return at > 1 ? process.argv[at + 1] : null; };
const PORT = Number(argumentOf("port") || process.env.DESK_PORT || 8787);
const REPO = events.REPO;
const DATA = path.resolve(argumentOf("data") || process.env.DESK_DATA || path.join(__dirname, "..", "..", "desk", "data"));
const APP = path.resolve(argumentOf("app") || process.env.DESK_APP || path.join(__dirname, "app.html"));
const DRAFTS = path.join(DATA, "drafts"), PENDING = path.join(DATA, "pending"), BACKUPS = path.join(DATA, "backups"), TEMP = path.join(DATA, "tmp");
const DESK_FILE = path.join(DATA, "desk.json");
const IMAGES = path.join(REPO, "v13 spire images"), TRAY = path.join(REPO, "v13 spire png");
for (const folder of [DATA, DRAFTS, PENDING, BACKUPS, TEMP]) fs.mkdirSync(folder, { recursive: true });

//---------------------------------------------------------------------------------------------------
//The store. Read-modify-write in one synchronous step, so two requests cannot interleave.
const EMPTY = { noteArray: [], markMap: {}, seenMap: {}, imageRequestArray: [] };
function readDesk() {
	if (!fs.existsSync(DESK_FILE)) return JSON.parse(JSON.stringify(EMPTY));
	try { return Object.assign(JSON.parse(JSON.stringify(EMPTY)), JSON.parse(fs.readFileSync(DESK_FILE, "utf8"))); }
	catch (error) {
		//A hand edit that broke the JSON must not lose the notes: keep the broken file and say so.
		fs.copyFileSync(DESK_FILE, DESK_FILE + ".broken-" + Date.now());
		throw new Error("desk.json could not be read (" + error.message + "). A copy was kept beside it.");
	}
}
function changeDesk(change) {
	const desk = readDesk();
	const result = change(desk);
	fs.writeFileSync(DESK_FILE + ".tmp", JSON.stringify(desk, null, "\t"));
	fs.renameSync(DESK_FILE + ".tmp", DESK_FILE);
	return result;
}
const newId = (prefix) => prefix + "-" + Date.now().toString(36) + crypto.randomBytes(2).toString("hex");
const hashOf = (text) => crypto.createHash("sha1").update(text).digest("hex").slice(0, 12);
const safeName = (text) => String(text).replace(/[^A-Za-z0-9_-]/g, "");

//---------------------------------------------------------------------------------------------------
//Drafts: created events. Plain text so Claude can edit one with an ordinary file edit.
//`folder` is one name; `tags` is a comma-separated list. Both only sort the Ideas & drafts tab.
const DRAFT_KEYS = ["title", "stage", "character", "image", "folder", "tags", "created", "updated", "updatedBy"];
function readDraft(id) {
	const file = path.join(DRAFTS, safeName(id) + ".txt");
	if (!fs.existsSync(file)) return null;
	const raw = fs.readFileSync(file, "utf8").replace(/\r/g, "");
	const cut = raw.indexOf("\n---\n");
	const draft = { id: safeName(id), title: "", stage: "idea", character: "", image: "", folder: "", tags: "", text: cut < 0 ? raw : raw.slice(cut + 5) };
	for (const line of (cut < 0 ? "" : raw.slice(0, cut)).split("\n")) {
		const colon = line.indexOf(":");
		if (colon > 0 && DRAFT_KEYS.indexOf(line.slice(0, colon).trim()) >= 0) draft[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
	}
	draft.hash = hashOf(raw);
	return draft;
}
function writeDraft(draft) {
	draft.updated = new Date().toISOString();
	const head = DRAFT_KEYS.filter((key) => draft[key] != null && draft[key] !== "").map((key) => key + ": " + String(draft[key]).replace(/\n/g, " "));
	fs.writeFileSync(path.join(DRAFTS, safeName(draft.id) + ".txt"), head.join("\n") + "\n---\n" + (draft.text || ""));
}
const listDrafts = () => fs.readdirSync(DRAFTS).filter((name) => name.endsWith(".txt")).map((name) => readDraft(name.slice(0, -4)))
	.map((draft) => ({ id: draft.id, title: draft.title, stage: draft.stage, character: draft.character, image: draft.image, folder: draft.folder, tags: draft.tags, updated: draft.updated, updatedBy: draft.updatedBy, hash: draft.hash, excerpt: draft.text.trim().slice(0, 120), text: draft.text }));

//---------------------------------------------------------------------------------------------------
//Every girl with an art folder: her name, her speaker word (`necro`) and her character index (`nettle`).
function characterList() {
	const tables = events.load().tables;
	return Object.keys(tables.nameToToken).map((name) => ({ name: name, token: tables.nameToToken[name], index: tables.tokenToIndex[tables.nameToToken[name].toLowerCase()] }));
}

//---------------------------------------------------------------------------------------------------
//Events
function eventSummaries() {
	const loaded = events.load(), hc = loaded.hc, nameMap = facts.characterNamesOf(hc);
	return loaded.modelArray.map((model) => {
		const text = events.toText(model, loaded.tables);
		const row = model.rowArray[0];
		const value = hc.findDefinition(hc.eventArray, model.index) || {};
		return {
			index: model.index, name: model.name, kind: model.kind, writable: model.writable,
			character: row == null ? "" : String(row.value.character), tag: row == null ? "" : (row.value.tag || ""), rank: row == null ? "" : (row.value.rank || ""),
			beatCount: model.beatArray.length, lineCount: model.beatArray.reduce((sum, beat) => sum + beat.lineArray.length, 0),
			image: model.beatArray[0].imagePath, hash: hashOf(text), pending: fs.existsSync(path.join(PENDING, safeName(model.index) + ".txt")),
			//The whole text, so the phone can search every word of every event.
			text: text, appears: facts.appearsFor(value, hc, nameMap), gives: facts.givesOf(value, hc), missingCount: facts.missingPictureCount(model, PREVIEW_FOLDER_ARRAY, findImage),
		};
	});
}
function eventDetail(index) {
	const loaded = events.load(), hc = loaded.hc;
	const model = loaded.modelArray.find((one) => one.index === index);
	if (model == null) return null;
	const text = events.toText(model, loaded.tables);
	const pendingFile = path.join(PENDING, safeName(index) + ".txt");
	const value = hc.findDefinition(hc.eventArray, index) || {};
	const factSheet = { buttonArray: facts.buttonFacts(value, hc), appears: facts.appearsFor(value, hc, facts.characterNamesOf(hc)), restMenu: value.isRest === true ? facts.restMenu(hc, facts.characterNamesOf(hc)) : null };
	return { model: events.publicModel(model), text: text, hash: hashOf(text), pendingText: fs.existsSync(pendingFile) ? fs.readFileSync(pendingFile, "utf8") : null, facts: factSheet };
}

//One number that changes whenever anything the phone shows has changed on disk.
function version() {
	const partArray = [];
	const add = (file) => { try { partArray.push(fs.statSync(file).mtimeMs); } catch (error) { partArray.push(0); } };
	add(DESK_FILE);
	for (const folder of [DRAFTS, PENDING]) for (const name of fs.readdirSync(folder)) add(path.join(folder, name));
	add(path.join(REPO, "scripts", "misc", "honeycomb", "honeycomb-content-lust-events.js"));
	add(path.join(REPO, "scripts", "misc", "honeycomb", "honeycomb-content-map.js"));
	return hashOf(partArray.join("|"));
}

//---------------------------------------------------------------------------------------------------
//Images
function insideFolder(root, relative) {
	const full = path.resolve(root, relative);
	return full === root || full.indexOf(root + path.sep) === 0 ? full : null;
}
//An event path may name a party place, `events/campfire/{leader}`, which the game fills with whoever is
//standing there (honeycomb.eventOverlay.artPathFor). The desk has no party, so it shows the first
//character whose version of the picture exists, Brienne's first.
const PREVIEW_FOLDER_ARRAY = ["knight", "necro", "vamp", "seer", "lancer", "priest", "chess"];
function findImage(imagePath) {
	if (/\{[a-z]+\}/.test(imagePath)) {
		for (const folder of PREVIEW_FOLDER_ARRAY) {
			const found = findImage(imagePath.replace(/\{[a-z]+\}/g, folder));
			if (found != null) return found;
		}
		return null;
	}
	const clean = imagePath.replace(/\.(png|webp)$/i, "");
	const candidateArray = [insideFolder(TRAY, clean + ".png"), insideFolder(IMAGES, clean + ".webp"), insideFolder(IMAGES, clean + ".png")].filter((one) => one != null && fs.existsSync(one));
	//The newest wins, so a picture just uploaded to the tray shows at once, before it is converted.
	candidateArray.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
	return candidateArray[0] || null;
}
function storeUpload(imagePath, buffer) {
	if (buffer.length < 8 || buffer.readUInt32BE(0) !== 0x89504e47) throw new Error("That was not a PNG. The phone converts the picture before sending; try again.");
	const target = insideFolder(TRAY, imagePath.replace(/\.(png|webp)$/i, "") + ".png");
	if (target == null) throw new Error("That path is outside the png folder.");
	fs.mkdirSync(path.dirname(target), { recursive: true });
	if (fs.existsSync(target)) fs.copyFileSync(target, path.join(BACKUPS, path.basename(target, ".png") + "." + Date.now() + ".png"));
	fs.writeFileSync(target, buffer);
	return path.relative(REPO, target).replace(/\\/g, "/");
}

//A generate request is run through the project's own tool, dry first, exactly as a person would.
const runningMap = {};
function generate(requestId) {
	const request = readDesk().imageRequestArray.find((one) => one.id === requestId);
	if (request == null) throw new Error("No such image request.");
	if (!request.imagePath) throw new Error("This request has no image path to write to.");
	if (runningMap[requestId]) return;
	const name = path.basename(request.imagePath), folder = path.dirname(request.imagePath);
	const block = (request.character ? request.character + "\n\n" : "") + "- " + name + "\n" + request.positive.replace(/\n+/g, ", ") + "\n";
	const blockFile = path.join(TEMP, requestId + ".txt");
	fs.writeFileSync(blockFile, block);
	const tool = path.join(REPO, "scripts", "webui", "tools", "webui2-generate.js");
	const base = [tool, "--block", blockFile, "--style", request.style || "Oreteki18kin", "--names", name];
	if (request.negative) base.push("--negative", request.negative);
	const setStatus = (status, detail) => changeDesk((desk) => { const one = desk.imageRequestArray.find((r) => r.id === requestId); if (one) { one.status = status; one.detail = detail || ""; one.updated = new Date().toISOString(); } });
	const run = (extra, done) => {
		const child = spawn(process.execPath, base.concat(extra), { cwd: REPO });
		let output = "";
		child.stdout.on("data", (chunk) => { output += chunk; });
		child.stderr.on("data", (chunk) => { output += chunk; });
		child.on("close", (code) => done(code, output.slice(-1500)));
		child.on("error", (error) => done(1, error.message));
	};
	//A GENERATION NEVER LANDS ON AN ORIGINAL (2026-09-21). `storeUpload` has always copied the picture it
	//was about to replace into BACKUPS; this path wrote Forge's output straight over the file and did not.
	//Since `v13 spire png/` became the archive of originals rather than a staging tray, the file this is
	//about to overwrite may be the only copy of a finished picture, so it is copied aside the same way.
	const existing = path.join(TRAY, folder, name + ".png");
	if (fs.existsSync(existing)) fs.copyFileSync(existing, path.join(BACKUPS, name + "." + Date.now() + ".png"));

	runningMap[requestId] = true;
	setStatus("generating", "checking the prompt");
	run(["--mode", "dry"], (dryCode, dryOutput) => {
		if (dryCode !== 0) { delete runningMap[requestId]; setStatus("failed", "The prompt did not compile:\n" + dryOutput); return; }
		setStatus("generating", "sent to Forge");
		run(["--mode", "run", "--out", path.join(TRAY, folder)], (code, output) => {
			delete runningMap[requestId];
			const made = fs.existsSync(path.join(TRAY, folder, name + ".png"));
			setStatus(code === 0 && made ? "done" : "failed", code === 0 && made ? "Written to v13 spire png/" + folder + "/" + name + ".png" : "Forge did not return a picture:\n" + output);
		});
	});
}

//---------------------------------------------------------------------------------------------------
//HTTP
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".woff2": "font/woff2", ".ttf": "font/ttf" };
const isPrivate = (address) => /^(::1|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::ffff:(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)|fe80:)/.test(address || "");
function send(response, status, body, type) {
	const buffer = Buffer.isBuffer(body) ? body : Buffer.from(typeof body === "string" ? body : JSON.stringify(body));
	response.writeHead(status, { "Content-Type": type || "application/json", "Content-Length": buffer.length, "Cache-Control": "no-store" });
	response.end(buffer);
}
function sendFile(response, file) {
	if (file == null || !fs.existsSync(file) || !fs.statSync(file).isFile()) return send(response, 404, { error: "not found" });
	response.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
	fs.createReadStream(file).pipe(response);
}
function readBody(request, limit) {
	return new Promise((resolve, reject) => {
		const chunkArray = []; let size = 0;
		request.on("data", (chunk) => { size += chunk.length; if (size > limit) { reject(new Error("That is too large.")); request.destroy(); } else chunkArray.push(chunk); });
		request.on("end", () => resolve(Buffer.concat(chunkArray)));
		request.on("error", reject);
	});
}

async function route(request, response) {
	const url = new URL(request.url, "http://desk");
	const route = decodeURIComponent(url.pathname);
	const method = request.method;
	const json = async () => JSON.parse((await readBody(request, 2e6)).toString("utf8") || "{}");
	const author = url.searchParams.get("as") === "claude" ? "claude" : "noodle";

	if (route === "/" || route === "/index.html") return sendFile(response, APP);
	if (route === "/manifest.json") return send(response, 200, { name: "Honeycomb Desk", short_name: "Desk", display: "standalone", start_url: "/", background_color: "#15121a", theme_color: "#15121a" });
	if (route.indexOf("/img/") === 0) return sendFile(response, findImage(route.slice(5)));
	//The whole game, for the "open in the real game" preview. Read only.
	if (route.indexOf("/game/") === 0) return sendFile(response, insideFolder(REPO, route.slice(6)));

	if (route === "/api/version") return send(response, 200, { version: version() });
	if (route === "/api/state") {
		const desk = readDesk();
		//Each note carries its section and a heading, worked out here so the phone and desk-cli.js agree.
		const noteArray = desk.noteArray.map((note) => Object.assign({}, note, { section: notes.sectionOf(note), heading: notes.titleOf(note) }));
		return send(response, 200, { version: version(), eventArray: eventSummaries(), draftArray: listDrafts(), noteArray: noteArray, markMap: desk.markMap, seenMap: desk.seenMap, imageRequestArray: desk.imageRequestArray, characterArray: characterList() });
	}

	let match = /^\/api\/event\/([^/]+)(\/save|\/plan)?$/.exec(route);
	if (match != null) {
		const index = match[1];
		if (method === "GET") { const detail = eventDetail(index); return detail == null ? send(response, 404, { error: "No event called " + index }) : send(response, 200, detail); }
		const body = await json();
		if (match[2] === "/plan") { const planned = events._planFor(index, body.text); return send(response, 200, { editCount: planned.editArray.length, blockArray: planned.blockArray }); }
		const before = eventDetail(index);
		if (before == null) return send(response, 404, { error: "No event called " + index });
		if (body.baseHash && body.baseHash !== before.hash && body.force !== true) return send(response, 409, { conflict: true, currentText: before.text, currentHash: before.hash, message: "This event changed on the computer while it was open here." });
		const result = events.save(index, body.text, BACKUPS);
		const pendingFile = path.join(PENDING, safeName(index) + ".txt");
		if (result.written) {
			if (fs.existsSync(pendingFile)) fs.unlinkSync(pendingFile);
			//The "waiting in pending/" note the desk wrote for this event has been answered by this save.
			changeDesk((desk) => { for (const note of desk.noteArray) if (note.auto === "pending" && note.target.event === index && note.status === "open") note.status = "done"; });
		}
		else {
			fs.writeFileSync(pendingFile, body.text);
			changeDesk((desk) => {
				const open = desk.noteArray.find((note) => note.auto === "pending" && note.target.event === index && note.status === "open");
				const text = "An edit to this event could not be written to the game and is waiting in desk/data/pending/" + safeName(index) + ".txt.\n" + result.reasonArray.join("\n");
				if (open) { open.text = text; open.updated = new Date().toISOString(); }
				else desk.noteArray.push({ id: newId("n"), auto: "pending", kind: "note", ask: true, status: "open", author: "desk", target: { kind: "event", event: index }, text: text, created: new Date().toISOString(), replyArray: [] });
			});
		}
		return send(response, 200, Object.assign(result, { detail: eventDetail(index) }));
	}
	if (route === "/api/parse" && method === "POST") {
		const body = await json();
		const loaded = events.load();
		const model = body.event ? loaded.modelArray.find((one) => one.index === body.event) : null;
		const context = model ? events.contextFor(model, loaded.tables) : { tables: loaded.tables, speakerArray: [], firstImage: "" };
		return send(response, 200, events.parseText(body.text || "", context));
	}

	if (route === "/api/note" && method === "POST") {
		const body = await json();
		//Kind "request" is how an older page said "Ask Claude"; it is stored as the `ask` flag now.
		const note = { id: newId("n"), kind: body.kind === "request" ? "note" : String(body.kind || "note"), ask: body.ask === true || body.kind === "request", status: "open", author: author, target: body.target || { kind: "general" }, text: String(body.text || ""), created: new Date().toISOString(), replyArray: [] };
		if (body.title) note.title = String(body.title);
		if (body.from) note.from = String(body.from);
		changeDesk((desk) => { desk.noteArray.push(note); });
		return send(response, 200, note);
	}
	match = /^\/api\/note\/([^/]+)$/.exec(route);
	if (match != null && method === "POST") {
		const body = await json();
		const updated = changeDesk((desk) => {
			const note = desk.noteArray.find((one) => one.id === match[1]);
			if (note == null) return null;
			if (body.text != null) note.text = String(body.text);
			if (body.kind === "request") note.ask = true; else if (body.kind != null) note.kind = String(body.kind);
			if (body.ask != null) { note.ask = body.ask === true; if (!note.ask && note.kind === "request") note.kind = "note"; }
			if (body.title != null) note.title = String(body.title);
			if (body.from != null) note.from = String(body.from);
			if (body.status != null) note.status = body.status;
			if (body.reply) note.replyArray.push({ author: author, text: String(body.reply), created: new Date().toISOString() });
			if (body.remove === true) desk.noteArray.splice(desk.noteArray.indexOf(note), 1);
			note.updated = new Date().toISOString();
			return note;
		});
		return updated == null ? send(response, 404, { error: "No such note" }) : send(response, 200, updated);
	}
	if (route === "/api/mark" && method === "POST") {
		const body = await json();
		return send(response, 200, changeDesk((desk) => {
			const mark = Object.assign(desk.markMap[body.key] || {}, body.set || {});
			if (body.snapshot != null) mark.snapshot = body.snapshot;
			if (!mark.bookmark && !mark.flag && !mark.signedOff) delete desk.markMap[body.key]; else desk.markMap[body.key] = mark;
			return desk.markMap[body.key] || {};
		}));
	}
	if (route === "/api/seen" && method === "POST") {
		const body = await json();
		//Not written when it already says so: every write moves the version every phone is watching.
		const current = readDesk().seenMap[body.key];
		if ((current == null ? null : current) !== (body.hash == null ? null : body.hash)) changeDesk((desk) => { if (body.hash == null) delete desk.seenMap[body.key]; else desk.seenMap[body.key] = body.hash; });
		return send(response, 200, { ok: true });
	}

	if (route === "/api/draft" && method === "POST") {
		const body = await json();
		const draft = { id: newId("d"), title: body.title || "Untitled", stage: body.stage || "idea", character: body.character || "", image: "", folder: body.folder || "", tags: body.tags || "", text: body.text || "", created: new Date().toISOString(), updatedBy: author };
		writeDraft(draft);
		return send(response, 200, readDraft(draft.id));
	}
	match = /^\/api\/draft\/([^/]+)$/.exec(route);
	if (match != null) {
		const draft = readDraft(match[1]);
		if (draft == null) return send(response, 404, { error: "No such draft" });
		if (method === "GET") return send(response, 200, draft);
		const body = await json();
		if (body.remove === true) { fs.renameSync(path.join(DRAFTS, draft.id + ".txt"), path.join(BACKUPS, "draft-" + draft.id + "." + Date.now() + ".txt")); return send(response, 200, { removed: true }); }
		if (body.baseHash && body.baseHash !== draft.hash && body.force !== true) return send(response, 409, { conflict: true, current: draft, message: "This draft changed on the computer while it was open here." });
		for (const key of ["title", "stage", "character", "image", "folder", "tags", "text"]) if (body[key] != null) draft[key] = body[key];
		draft.updatedBy = author;
		writeDraft(draft);
		return send(response, 200, readDraft(draft.id));
	}

	if (route === "/api/image/upload" && method === "POST") {
		const written = storeUpload(url.searchParams.get("path") || "", await readBody(request, 40e6));
		return send(response, 200, { written: written });
	}
	if (route === "/api/imageRequest" && method === "POST") {
		const body = await json();
		const saved = changeDesk((desk) => {
			let one = body.id ? desk.imageRequestArray.find((r) => r.id === body.id) : null;
			if (one == null) { one = { id: newId("i"), created: new Date().toISOString(), status: "for Claude", detail: "" }; desk.imageRequestArray.push(one); }
			for (const key of ["target", "imagePath", "character", "positive", "negative", "comments", "style", "status"]) if (body[key] != null) one[key] = body[key];
			if (body.remove === true) desk.imageRequestArray.splice(desk.imageRequestArray.indexOf(one), 1);
			one.updated = new Date().toISOString();
			return one;
		});
		if (body.generate === true) generate(saved.id);
		return send(response, 200, saved);
	}
	return send(response, 404, { error: "not found" });
}

const server = http.createServer((request, response) => {
	if (!isPrivate(request.socket.remoteAddress)) { response.writeHead(403); response.end("home network only"); return; }
	route(request, response).catch((error) => { try { send(response, 500, { error: error.message }); } catch (ignored) {} });
});
function addressText() {
	const lineArray = ["On your phone, on the same wifi, open:", ""];
	for (const list of Object.values(os.networkInterfaces())) for (const one of list) if (one.family === "IPv4" && !one.internal) lineArray.push("    http://" + one.address + ":" + PORT);
	return lineArray.join("\n") + "\n\nOn this computer:  http://localhost:" + PORT + "\n";
}
//A second start finds the first desk still running. It says so and leaves with this exit code, which
//start-desk.bat reads to close its window by itself, instead of printing a stack trace.
const ALREADY_RUNNING = 20;
server.on("error", (error) => {
	if (error.code !== "EADDRINUSE") throw error;
	const otherProgram = () => { console.log("\nAnother program is using port " + PORT + ", so the desk cannot start.\n"); process.exit(1); };
	http.get({ host: "127.0.0.1", port: PORT, path: "/api/version", timeout: 3000 }, (response) => {
		response.resume();
		if (response.statusCode !== 200) return otherProgram();
		console.log("\nThe desk is already running, so this window will close by itself.\n\n" + addressText());
		process.exit(ALREADY_RUNNING);
	}).on("error", otherProgram).on("timeout", otherProgram);
});
server.listen(PORT, "0.0.0.0", () => {
	console.log("\nHONEYCOMB DESK is running.\n\n" + addressText() + "\nIf the phone cannot reach it, Windows Firewall is blocking it: allow Node.js on Private networks.\nLeave this window open. Close it to stop the desk.\n");
});
