//DESK self-test. Changes nothing in the game.
//  1. Every event, turned into sketch text and read back, must ask for ZERO edits (the round trip is exact).
//  2. A real save is rehearsed on a COPY of the lust events file: one changed line, one added line.
//Run: node "!designDocs/honeycomb/tools/desk/selftest.js"
"use strict";
const fs = require("fs"), os = require("os"), path = require("path");
const events = require("./events.js");

let failed = 0;
const check = (label, passed, detail) => { console.log((passed ? "  PASS  " : "  FAIL  ") + label + (passed || !detail ? "" : "  -- " + detail)); if (!passed) failed++; };

const loaded = events.load();
console.log(loaded.modelArray.length + " events: " + loaded.modelArray.filter((m) => m.kind === "lust").length + " lust, " +
	loaded.modelArray.filter((m) => m.kind === "map").length + " map, " + loaded.modelArray.filter((m) => !m.writable).length + " not writable");
const dirtyArray = [];
for (const model of loaded.modelArray) {
	if (!model.writable) continue;
	const result = events._planFor(model.index, events.toText(model, loaded.tables));
	if (result.editArray.length > 0 || result.blockArray.length > 0) dirtyArray.push(model.index + ": " + result.editArray.length + " edits, " + result.blockArray.join("; "));
}
check("every writable event round-trips with nothing to change", dirtyArray.length === 0, dirtyArray.slice(0, 6).join(" | "));

const sample = loaded.modelArray.find((m) => m.index === "nettleSpecimen");
if (sample != null) {
	const text = events.toText(sample, loaded.tables);
	console.log("\n" + text.split("\n").map((line) => "    | " + line).join("\n"));
	const edited = text.replace("She holds the vial to the lamp.", "She holds the vial up to the lamp.").replace("t ...", "necro Hm.\nt ...");
	const planned = events._planFor("nettleSpecimen", edited);
	check("a changed line and an added line plan as one list replacement", planned.blockArray.length === 0 && planned.editArray.length === 1, JSON.stringify(planned.blockArray));
	const blocked = events._planFor("nettleSpecimen", text + "\nim 3\nnecro A whole new beat.\n");
	check("a new beat is refused in plain words, not written", blocked.blockArray.length === 1 && /beat/.test(blocked.blockArray[0]), JSON.stringify(blocked.blockArray));
}
//3. Party comment blocks (`leader block`) and a picture per girl (`im events/pool/{leader}`).
{
	const vm = require("vm");
	const tables = loaded.tables;
	const sketch = "name A quiet pool\n\nim events/pool/{leader}\nbody Warm water.\nleader block\nknight Must be an aquifer.\nnecro No signs of life. Yet.\n" +
		"second block\nvamp Ooh~\nend block\nlancer Everyone hears this one.\nt Narration closes nothing that is already closed.\n> Bathe | Heals.\n";
	const parsed = events.parseText(sketch, { tables: tables, speakerArray: [], firstImage: "" });
	const lineArray = parsed.beatArray[0].lineArray;
	check("`im events/pool/{leader}` keeps the token for the game to fill", parsed.beatArray[0].imagePath === "events/pool/{leader}", parsed.beatArray[0].imagePath);
	check("a leader block makes place-0 lines, each naming its character",
		lineArray[0].slot === 0 && lineArray[0].character === "brienne" && lineArray[1].slot === 0 && lineArray[1].character === "nettle", JSON.stringify(lineArray.slice(0, 2)));
	check("a second block makes place-1 lines", lineArray[2].slot === 1 && lineArray[2].character === "severine", JSON.stringify(lineArray[2]));
	check("`end block` returns to lines everybody hears", lineArray[3].slot == null && lineArray[3].speaker === "Cinder", JSON.stringify(lineArray[3]));
	const model = { name: "A quiet pool", rowArray: [], beatArray: parsed.beatArray };
	const again = events.parseText(events.toText(model, tables), { tables: tables, speakerArray: [], firstImage: "" });
	check("the blocks survive a round trip through the text exactly",
		JSON.stringify(again.beatArray[0].lineArray) === JSON.stringify(lineArray) && again.beatArray[0].imagePath === parsed.beatArray[0].imagePath);

	// A live map event with no line list yet: the desk writes one after the body text, and the file still loads.
	const spring = loaded.modelArray.find((m) => m.index === "handsInTheDark");
	check("the map event used below still has no line list", spring != null && spring.beatArray[0].lineArray.length === 0);
	if (spring != null) {
		const text = events.toText(spring, tables).replace(/(\nbody [^\n]*\n)/, "$1leader block\nknight Must be an aquifer.\n");
		const planned = events._planFor("handsInTheDark", text);
		check("a leader block can be added to a map event that has no lines yet", planned.blockArray.length === 0 && planned.editArray.length === 1, JSON.stringify(planned.blockArray));
		let source = fs.readFileSync(spring.file === undefined ? path.join(events.REPO, "scripts", "misc", "honeycomb", "honeycomb-content-map.js") : spring.file, "utf8");
		for (const edit of planned.editArray) source = source.slice(0, edit.start) + edit.text + source.slice(edit.end);
		let parses = true; try { new vm.Script(source); } catch (error) { parses = false; }
		check("and the edited file would still load, with the engine's leader condition in it", parses &&
			source.indexOf('condition: { index: "partyContains", character: "brienne", position: 0 }') >= 0);
	}
}
//4. Notes are sorted by whose turn it is (notes.js), and what the desk says about an event comes from the
//game (facts.js).
{
	const notes = require("./notes.js"), facts = require("./facts.js"), hc = loaded.hc;
	const note = (fields) => Object.assign({ status: "open", author: "noodle", kind: "note", replyArray: [] }, fields);
	check("a note Claude answered waits on Noodle", notes.sectionOf(note({ ask: true, replyArray: [{ author: "claude", text: "Done." }] })) === "you");
	check("an unanswered Ask Claude waits on Claude, and so does the older kind \"request\"", notes.sectionOf(note({ ask: true })) === "claude" && notes.sectionOf(note({ kind: "request" })) === "claude");
	check("a jotting and player feedback wait on nobody", notes.sectionOf(note({})) === "notes" && notes.sectionOf(note({ kind: "feedback" })) === "notes");
	check("a report never counts as open, and a reminder waits on Noodle", notes.sectionOf(note({ kind: "report", author: "claude" })) === "report" && notes.sectionOf(note({ kind: "reminder", author: "claude" })) === "you");
	check("his own open issue is his turn, and a closed note is done", notes.sectionOf(note({ kind: "issue" })) === "you" && notes.sectionOf(note({ status: "done", ask: true })) === "done");

	const nameMap = facts.characterNamesOf(hc), eventOf = (index) => hc.findDefinition(hc.eventArray, index);
	const bloom = facts.appearsFor(eventOf("theWeepingBloom"), hc, nameMap);
	check("The Weeping Bloom appears only with Nettle, in words that name her", bloom.characterArray.indexOf("nettle") >= 0 && !bloom.everyone && /Nettle is in the party/.test(bloom.text), bloom.text);
	check("the campfire is never drawn on the map", facts.appearsFor(eventOf("theCampfire"), hc, nameMap).never === true);
	check("a Lust Event has no appear rule of its own", facts.appearsFor(eventOf("nettleSpecimen"), hc, nameMap) === null);
	const doorGives = facts.givesOf(eventOf("theSealedDoor"), hc);
	check("what The Sealed Door gives is read from its effects, on every page", doorGives.indexOf("fight") >= 0 && doorGives.indexOf("relic") >= 0 && doorGives.indexOf("gold") >= 0, doorGives.join(","));
	const paysGold = { index: "paysGold", choiceArray: [{ text: "Pay", effectArray: [{ index: "gainResource", resource: "gold", amount: -20 }] }] };
	check("a gold cost is not counted as giving gold", facts.givesOf(paysGold, hc).indexOf("gold") < 0);
	const menu = facts.restMenu(hc, nameMap);
	check("the campfire's menu is the rest table plus a way out", menu.length === hc.restOptionArray.length + 1 && menu[menu.length - 1].text === "Move on", menu.map((row) => row.text).join(","));
	const bloomButtons = facts.buttonFacts(eventOf("theWeepingBloom"), hc)[0];
	check("a button with no typed sentence shows the game's own words", /Reroll/.test(bloomButtons[0].effectText), bloomButtons[0].effectText);
	const stray = facts.buttonFacts({ choiceArray: [{ previewText: "Heals 30%.", effectArray: [{ index: "heal", amount: 25, targetOverride: "allAllies" }] }] }, hc)[0][0].strayNumberArray;
	check("a typed number the effects never mention is caught", stray.join() === "30", stray.join());
}
console.log(failed === 0 ? "\nall good" : "\n" + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
