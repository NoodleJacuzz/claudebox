/**
 * Checks scene-script lines for a first word writeHTML will not understand.
 * Unknown first words print as a red "Unknown command" in-game.
 *
 * Usage:  node scripts/misc/check-scene-lines.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const CHAR_DIR = path.join(ROOT, "scripts", "characters");
const EXTRA_FILES = [
	path.join(ROOT, "scripts", "gameplay", "encounters.js"),
	path.join(ROOT, "scripts", "gameplay", "data.story.js"),
	path.join(ROOT, "scripts", "gameplay", "locations.js"),
	path.join(ROOT, "scripts", "gameplay", "title.js"),
];

const COMMANDS = new Set([
	"define", "outfit", "bg", "t", "special", "sp", "im", "trans", "mtrans",
	"cancel", "event", "finish", "raisetrust", "addtrust", "settrust",
	"addflag", "removeflag", "toggleflag", "func", "button", "dual", "bar",
	"eval", "passtime", "...",
]);

const SHORTCUTS = ["fash", "shop", "sado", "carp", "player"];
const SPIRITS = ["angy", "lusty", "weepy", "bratty"];

function listCharacters() {
	return fs.readdirSync(CHAR_DIR)
		.filter((name) => name.endsWith(".js"))
		.map((name) => name.replace(/\.js$/, ""));
}

function stripRequirements(line) {
	return line.replace(/[?!][A-Za-z][^;]*;/g, " ").replace(/\s+/g, " ").trim();
}

function extractBlocks(source) {
	const blocks = [];
	const patterns = [
		/\bcontent\s*:\s*`([\s\S]*?)`/g,
		/\bwriteHTML\s*\(\s*`([\s\S]*?)`/g,
	];
	for (const pattern of patterns) {
		let match;
		while ((match = pattern.exec(source)) != null) {
			blocks.push(match[1]);
		}
	}
	return blocks;
}

function speakersIn(source, characters) {
	const names = new Set(characters.concat(SHORTCUTS, SPIRITS, ["sphinx"]));
	const defineRe = /\bdefine\s+([A-Za-z][A-Za-z0-9]*)\s*=/g;
	let match;
	while ((match = defineRe.exec(source)) != null) {
		names.add(match[1]);
	}
	return names;
}

function firstWord(line) {
	const cleaned = stripRequirements(line.replace(/\t/g, "")).replace(/^ +/, "");
	if (cleaned === "") return null;
	return { word: cleaned.split(" ")[0], cleaned };
}

function checkFile(filePath, characters) {
	const source = fs.readFileSync(filePath, "utf8");
	const names = speakersIn(source, characters);
	const findings = [];
	const blocks = extractBlocks(source);
	const rel = path.relative(ROOT, filePath);
	blocks.forEach((block, blockIndex) => {
		const lines = block.split("\n");
		lines.forEach((raw, offset) => {
			const parsed = firstWord(raw);
			if (parsed == null) return;
			if (parsed.cleaned.includes("${") || parsed.cleaned.includes("'+") || parsed.cleaned.includes("\"+")) return;
			const key = parsed.word.toLowerCase();
			if (COMMANDS.has(key) || names.has(key) || names.has(parsed.word)) return;
			findings.push({
				file: rel,
				block: blockIndex + 1,
				line: parsed.cleaned,
				word: parsed.word,
			});
		});
	});
	return findings;
}

function main() {
	const characters = listCharacters();
	const files = fs.readdirSync(CHAR_DIR)
		.filter((name) => name.endsWith(".js"))
		.map((name) => path.join(CHAR_DIR, name))
		.concat(EXTRA_FILES.filter((file) => fs.existsSync(file)));

	const findings = [];
	for (const file of files) {
		findings.push.apply(findings, checkFile(file, characters));
	}

	if (findings.length === 0) {
		console.log("check-scene-lines: 0 unknown first words.");
		return;
	}
	console.log("check-scene-lines: " + findings.length + " unknown first word(s):");
	for (const hit of findings) {
		console.log("  " + hit.file + "  [" + hit.word + "]  " + hit.line);
	}
	process.exitCode = 1;
}

main();
