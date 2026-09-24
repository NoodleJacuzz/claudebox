//===================================================================================================
//HONEYCOMB ART PIPELINE -- refs report (developer tool; step 1 of BRIEF.md)
//===================================================================================================
//Reads every sidecar in `v13 spire images/_source/refsPNG/characters/` (`<char><outfit><C|V>-<pose>.txt`)
//and prints, per character and outfit, which images carry each tag. The listing is the input to the
//judgement pass; this tool never decides whether a difference is right.
//
//  node "!designDocs/honeycomb/art_pipeline/refs-report.js"                 matrix for every character
//  node "!designDocs/honeycomb/art_pipeline/refs-report.js" lancer          one character
//  node "!designDocs/honeycomb/art_pipeline/refs-report.js" --tidy          dry run of the mechanical tidy
//  node "!designDocs/honeycomb/art_pipeline/refs-report.js" --tidy --write  apply it
//
//THE TIDY is mechanical only, never a judgement: it removes a `Negative prompt:` line (left over from a
//generation's metadata), removes every `<lora:...>` call, and removes a tag written twice in one sidecar
//(the first spelling and weight are kept). Back up the folder before `--write`; nothing else is an undo.
//
//Matrix legend: each row is one tag, then the images carrying it, as `C:a b  V:a b bd df of sp ex`.
//Rows are grouped: in every image, in every image of one sex only, and partial (the ones to read).
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..", "..");
const REFS = path.join(ROOT, "!designDocs", "honeycomb", "!imageStorage", "_source", "refsPNG", "characters");
const POSE_SHORT = { "basic-a": "a", "basic-b": "b", "breakdown-a": "bd", "breakdown-b": "bd-b", "defense-a": "df", "defense-b": "df-b", "offense-a": "of", "offense-b": "of-b", "support-a": "sp", "support-b": "sp-b", exposed: "ex" };
const POSE_ORDER = ["basic-a", "basic-b", "exposed", "breakdown-a", "breakdown-b", "defense-a", "defense-b", "offense-a", "offense-b", "support-a", "support-b"];

const argumentArray = process.argv.slice(2);
const tidy = argumentArray.includes("--tidy");
const write = argumentArray.includes("--write");
const only = argumentArray.filter((argument) => !argument.startsWith("--"))[0];

//A tag with its emphasis parentheses taken off, and how many there were.
function readTag(raw) {
	let text = raw.trim();
	let weight = 0;
	while (text.startsWith("(") && text.endsWith(")")) { text = text.slice(1, -1).trim(); weight++; }
	text = text.replace(/^\(+|\)+$/g, "").trim();
	//A single-quoted tag is PROTECTED from the webui engine's rules (Rule 2c). The matrix compares it by its text,
	//so `'wide hips'` and `wide hips` are one tag, and the quotes are kept when it is written back.
	const quoted = /^'.*'$/.test(text) && text.length > 1;
	if (quoted) text = text.slice(1, -1).trim();
	//Written back in one spelling, so a member split out of a group reads `(shaded face)`, not `( shaded face)`.
	const inner = quoted ? "'" + text + "'" : text;
	return { text: text, weight: weight, quoted: quoted, raw: "(".repeat(weight) + inner + ")".repeat(weight) };
}

//Splits a sidecar's prompt line into tags. A group `(a, b)` spreads its weight to each member.
function splitPrompt(line) {
	const tagArray = [];
	let depth = 0;
	let current = "";
	let groupWeight = 0;
	for (const character of line) {
		if (character === "(") { depth++; current += character; continue; }
		if (character === ")") { depth = Math.max(0, depth - 1); current += character; continue; }
		if (character === "," && depth === 0) { tagArray.push(current); current = ""; continue; }
		if (character === "," && depth > 0) {
			//Inside a group: close this member and reopen the group's parentheses for the next.
			const open = (current.match(/^\s*\(+/) || [""])[0].trim().length;
			groupWeight = Math.max(groupWeight, open);
			tagArray.push(current + ")".repeat(depth));
			current = "(".repeat(depth);
			continue;
		}
		current += character;
	}
	if (current.trim() !== "") tagArray.push(current);
	return tagArray.map((raw) => raw.trim()).filter((raw) => raw !== "" && raw.replace(/[()]/g, "").trim() !== "");
}

function parseSidecar(fileName) {
	const match = fileName.match(/^([a-z]+)(\d+)([CV])-([a-z0-9-]+)\.txt$/);
	if (match == null) return null;
	const source = fs.readFileSync(path.join(REFS, fileName), "utf8");
	const lineArray = source.split(/\r?\n/);
	const promptLine = lineArray.filter((line) => line.trim() !== "" && !/^Negative prompt:/i.test(line)).join(", ");
	const negativeLine = lineArray.find((line) => /^Negative prompt:/i.test(line));
	return {
		fileName: fileName, character: match[1], outfit: match[2], sex: match[3], pose: match[4],
		source: source, negative: negativeLine != null,
		loraArray: promptLine.match(/<lora:[^>]*>/g) || [],
		tagArray: splitPrompt(promptLine.replace(/<lora:[^>]*>/g, "")).map(readTag),
	};
}

const sidecarArray = fs.readdirSync(REFS).filter((name) => name.endsWith(".txt")).map(parseSidecar).filter(Boolean);

if (tidy) {
	sidecarArray.forEach((sidecar) => {
		const noteArray = [];
		if (sidecar.negative) noteArray.push("negative prompt line removed");
		sidecar.loraArray.forEach((lora) => noteArray.push("removed " + lora));
		const seen = new Set();
		const keptArray = [];
		sidecar.tagArray.forEach((tag) => {
			if (seen.has(tag.text)) { noteArray.push("duplicate \"" + tag.text + "\" removed"); return; }
			seen.add(tag.text);
			keptArray.push(tag.raw);
		});
		if (noteArray.length === 0) return;
		console.log(sidecar.fileName + ": " + noteArray.join("; "));
		if (write) fs.writeFileSync(path.join(REFS, sidecar.fileName), keptArray.join(", ") + "\n", "utf8");
	});
	console.log(write ? "written" : "dry run (add --write to apply)");
	process.exit(0);
}

const groupMap = new Map();
sidecarArray.forEach((sidecar) => {
	const key = sidecar.character + sidecar.outfit;
	if (!groupMap.has(key)) groupMap.set(key, []);
	groupMap.get(key).push(sidecar);
});

for (const [key, memberArray] of groupMap) {
	if (only != null && !key.startsWith(only)) continue;
	memberArray.sort((a, b) => (a.sex + POSE_ORDER.indexOf(a.pose)).localeCompare(b.sex + POSE_ORDER.indexOf(b.pose)));
	const label = (sidecar) => POSE_SHORT[sidecar.pose] || sidecar.pose;
	const tagMap = new Map();
	memberArray.forEach((sidecar) => sidecar.tagArray.forEach((tag) => {
		if (!tagMap.has(tag.text)) tagMap.set(tag.text, new Map());
		tagMap.get(tag.text).set(sidecar, tag.weight);
	}));
	const holders = (sexIndex) => memberArray.filter((sidecar) => sidecar.sex === sexIndex);
	const describe = (carrierMap) => ["C", "V"].map((sexIndex) => {
		const carried = holders(sexIndex).filter((sidecar) => carrierMap.has(sidecar));
		return carried.length === 0 ? "" : sexIndex + ":" + carried.map((sidecar) => label(sidecar) + (carrierMap.get(sidecar) > 0 ? "(w" + carrierMap.get(sidecar) + ")" : "")).join(" ");
	}).filter(Boolean).join("  ");
	const everyArray = [];
	const sexOnlyArray = [];
	const partialArray = [];
	for (const [text, carrierMap] of tagMap) {
		const weights = new Set(carrierMap.values());
		const weightNote = weights.size > 1 ? "  [weights differ]" : "";
		if (carrierMap.size === memberArray.length) { everyArray.push(text + weightNote); continue; }
		const sexIndex = ["C", "V"].find((candidate) => holders(candidate).length > 0 &&
			holders(candidate).every((sidecar) => carrierMap.has(sidecar)) && [...carrierMap.keys()].every((sidecar) => sidecar.sex === candidate));
		if (sexIndex != null) { sexOnlyArray.push(sexIndex + " only: " + text + weightNote); continue; }
		partialArray.push(text.padEnd(28) + describe(carrierMap) + weightNote);
	}
	console.log("\n=== " + key + "  (" + memberArray.map((sidecar) => sidecar.sex + "-" + label(sidecar)).join(", ") + ")");
	memberArray.forEach((sidecar) => {
		if (sidecar.negative || sidecar.loraArray.length) console.log("  ! " + sidecar.fileName + (sidecar.negative ? " has a negative prompt line" : "") + (sidecar.loraArray.length ? " calls " + sidecar.loraArray.join(" ") : ""));
	});
	console.log("  in every image: " + everyArray.join(", "));
	if (sexOnlyArray.length) console.log("  " + sexOnlyArray.join("\n  "));
	console.log("  partial:\n    " + partialArray.join("\n    "));
}
