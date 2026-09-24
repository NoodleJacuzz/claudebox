//WHOSE TURN A NOTE IS. Shared by server.js, which tells the phone, and desk-cli.js, which tells Claude, so
//the Notes tab and the inbox sort every note the same way.
//
//  done     closed
//  report   a progress report from Claude; never waiting on anybody
//  you      waiting on Noodle: Claude had the last word, or it is one of his open issues
//  claude   waiting on Claude: an "Ask Claude" whose last word is not Claude's
//  notes    his jottings and player feedback, waiting on nobody
//
//Note kinds: note, issue, feedback (player feedback, with `from`), reminder (a task Claude left him) and
//report. `ask: true` is "Ask Claude"; older notes said so with kind "request" instead, which still counts.
"use strict";
const SECTION_ORDER = ["you", "claude", "notes", "report", "done"];

function lastAuthor(note) {
	const replyArray = note.replyArray || [];
	return replyArray.length > 0 ? replyArray[replyArray.length - 1].author : note.author;
}
function asks(note) { return note.ask === true || note.kind === "request"; }
function sectionOf(note) {
	if (note.status === "done") return "done";
	if (note.kind === "report") return "report";
	if (lastAuthor(note) === "claude") return "you";
	if (asks(note)) return "claude";
	if (note.kind === "issue" || note.kind === "reminder") return "you";
	return "notes";
}
//A note's title: the one it was given, or else its first line.
function titleOf(note) {
	if (note.title) return String(note.title);
	const first = String(note.text || "").trim().split("\n")[0];
	return first.length > 90 ? first.slice(0, 88) + "…" : first;
}

module.exports = { SECTION_ORDER, lastAuthor, asks, sectionOf, titleOf };
