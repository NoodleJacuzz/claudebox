/**
 * Checks that every image a scene asks for exists on disk, with the exact spelling.
 *
 * Catches three things reading the files will not:
 *  - a path whose CASE does not match the folder. Windows does not care, GitHub Pages and the
 *    Android build do, so these look fine locally and 404 for everyone else.
 *  - a portrait for an expression that character has no art for.
 *  - a thumbnail or scene image that was renamed or never drawn.
 *
 * Usage:  node scripts/misc/check-scene-images.js
 *         node scripts/misc/check-scene-images.js --only deity,trap
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const CHAR_DIR = path.join(ROOT, "scripts", "characters");
const IMAGES = path.join(ROOT, "images-webp");
const EXTRA_FILES = [
	path.join(ROOT, "scripts", "gameplay", "encounters.js"),
	path.join(ROOT, "scripts", "gameplay", "locations.js"),
	path.join(ROOT, "scripts", "gameplay", "title.js"),
];

const onlyArg = process.argv.indexOf("--only");
const only = onlyArg > -1 && process.argv[onlyArg + 1] ? process.argv[onlyArg + 1].split(",") : null;

//Every image on disk, spelled exactly as it is stored, plus a lowercase index so a path that is
//right apart from its capitals can be reported as the case problem it is rather than as missing art
const onDisk = new Set();
const lowerToReal = new Map();
(function walk(dir, prefix) {
	for (const name of fs.readdirSync(dir)) {
		const full = path.join(dir, name);
		if (fs.statSync(full).isDirectory()) {
			walk(full, prefix + name + "/");
			continue;
		}
		if (!name.endsWith(".webp")) continue;
		const rel = prefix + name.replace(/\.webp$/, "");
		onDisk.add(rel);
		lowerToReal.set(rel.toLowerCase(), rel);
	}
})(IMAGES, "");

//Shorthands cleanupImage expands before it looks for the file
const nicknames = [["sado/", "sadogato/"], ["fash/", "fashionista/"], ["shop/", "shopkeep/"]];

//Characters drawn from one folder image per expression rather than stacked layers
const FOLDER_CHARS = {deity: "feral", trap: "clothed", tink: "clothed"};

//Characters whose art is finished off by the restoration mod rather than shipped in images-webp.
//Their scenes name files that are legitimately absent from this repo, so checking them here would
//bury everything else. Pass --only doe to look at one of them anyway.
const MOD_ART = ["doe", "mommy"];

//Characters whose portrait is stacked from a body, a face and an outfit at draw time. A path like
//"mayor/clothed/happy" for one of them names no file and never did: drawCharacter builds it.
const LAYERED = (indexJsForLayered => {
	const line = /var finishedCharactersArray = \[([^\]]*)\]/.exec(indexJsForLayered);
	return line ? line[1].split(",").map(n => n.trim().replace(/["']/g, "")) : [];
})(fs.readFileSync(path.join(ROOT, "scripts", "index.js"), "utf8"));

function isLayeredPortrait(wanted) {
	const bits = wanted.split("/");
	return bits.length == 3 && LAYERED.includes(bits[0]);
}

const indexJs = fs.readFileSync(path.join(ROOT, "scripts", "index.js"), "utf8");
const exprSource = indexJs.slice(indexJs.indexOf("var expressionArray = ["));
const expressions = {};
const exprRe = /\{index: "([^"]+)", alts: "([^"]*)"/g;
let hit;
while ((hit = exprRe.exec(exprSource.slice(0, exprSource.indexOf("\n]")))) != null) {
	expressions[hit[1]] = hit[1];
	hit[2].split(",").map(a => a.trim()).filter(Boolean).forEach(a => { expressions[a] = hit[1]; });
}

function blocksOf(source) {
	const out = [];
	for (const pattern of [/\bcontent\s*:\s*`([\s\S]*?)`/g, /\bwriteHTML\s*\(\s*`([\s\S]*?)`/g]) {
		let match;
		while ((match = pattern.exec(source)) != null) {
			out.push({text: match[1], at: source.slice(0, match.index).split("\n").length});
		}
	}
	return out;
}

//cleanupImage rewrites a path before it fetches it: SEX becomes Meat or Veggie depending on that
//character's sex, and -light / -masc / -penis become whatever body the player has. A path counts as
//present when any one of the forms it can turn into is on disk.
function formsOf(wanted) {
	//cleanupImage strips the format folder and extension before it does anything else
	let base = wanted
		.replace(/^images(-webp|-png)?\//, "")
		.replace(/\.(webp|png)$/, "");
	for (const [from, to] of nicknames) base = base.replace(from, to);
	let forms = [base];
	if (base.includes("SEX")) {
		forms = [base.replace("-SEX/", "-meat/").replace("SEX", "Meat"),
			base.replace("-SEX/", "/").replace("SEX", "Veggie")];
	}
	const swaps = [["-light", ["-tan", "-dark"]], ["-masc", ["-fem"]], ["-penis", ["-pussy"]]];
	for (const [from, tos] of swaps) {
		const grown = [];
		for (const form of forms) {
			grown.push(form);
			if (form.includes(from)) for (const to of tos) grown.push(form.replace(from, to));
		}
		forms = grown;
	}
	return forms;
}

function existsOnDisk(wanted) {
	if (isLayeredPortrait(wanted)) return {ok: true};
	const forms = formsOf(wanted);
	for (const form of forms) if (onDisk.has(form)) return {ok: true};
	for (const form of forms) {
		const real = lowerToReal.get(form.toLowerCase());
		if (real) return {ok: false, why: "wrong case, the file is " + real};
	}
	return {ok: false, why: "no such image"};
}

const findings = [];
const files = fs.readdirSync(CHAR_DIR).filter(n => n.endsWith(".js"))
	.filter(n => only ? only.includes(n.replace(/\.js$/, "")) : !MOD_ART.includes(n.replace(/\.js$/, "")))
	.map(n => path.join(CHAR_DIR, n))
	.concat(only ? [] : EXTRA_FILES.filter(f => fs.existsSync(f)));

for (const file of files) {
	const rel = path.relative(ROOT, file).replace(/\\/g, "/");
	const source = fs.readFileSync(file, "utf8");
	const folder = path.basename(file, ".js");

	//Logbook and shop thumbnails carry their own path. Commented-out entries are blanked to spaces
	//first, keeping every offset intact so line numbers still point at the real line: several files
	//park old or unfinished entries behind // and /* */ on purpose.
	const live = source
		.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, " "))
		.replace(/^[ \t]*\/\/.*$/gm, m => m.replace(/[^\n]/g, " "));
	const thumbRe = /\bimage:\s*"([^"]+)"/g;
	let match;
	while ((match = thumbRe.exec(live)) != null) {
		if (match[1].indexOf("/") < 0) continue;
		const verdict = existsOnDisk(match[1]);
		if (!verdict.ok) {
			findings.push({file: rel, line: live.slice(0, match.index).split("\n").length,
				what: "thumbnail " + match[1], why: verdict.why});
		}
	}

	for (const block of blocksOf(source)) {
		const outfit = Object.assign({}, FOLDER_CHARS);
		block.text.split("\n").forEach(function (raw, offset) {
			const at = block.at + offset;
			const line = raw.replace(/\t/g, " ").trim();
			if (line == "" || line.includes("${") || line.includes("'+") || line.includes('"+')) return;
			const clean = line.replace(/[?!][A-Za-z][^;]*;/g, " ").replace(/\s+/g, " ").trim();
			if (clean == "") return;
			const words = clean.split(" ");

			if (words[0] == "outfit" && words.length >= 3) { outfit[words[1]] = words[2]; return; }

			if (words[0] == "im" && words[1]) {
				//A bare name means this character's own folder, the way cleanupImage resolves it.
				//A trailing semicolon is stripped by the parser, so it is not a broken path.
				const named = words[1].replace(/;+$/, "");
				const wanted = named.indexOf("/") < 0 ? folder + "/" + named : named;
				//SCENE and the body-variant suffixes are filled in at runtime
				if (wanted.includes("SCENE")) return;
				const verdict = existsOnDisk(wanted);
				if (!verdict.ok) findings.push({file: rel, line: at, what: "im " + wanted, why: verdict.why});
				return;
			}

			const big = /writeBig\(\s*["'`]([^"'`]+)["'`]/.exec(line);
			if (big) {
				const verdict = existsOnDisk(big[1]);
				if (!verdict.ok) findings.push({file: rel, line: at, what: "writeBig " + big[1], why: verdict.why});
				return;
			}

			//A portrait for one of the folder-image characters
			for (const name of words[0].split("+")) {
				if (!(name in FOLDER_CHARS)) continue;
				const wanted = name + "/" + outfit[name] + "/" + (expressions[words[1]] || "happy");
				const verdict = existsOnDisk(wanted);
				if (!verdict.ok) findings.push({file: rel, line: at, what: "portrait " + wanted, why: verdict.why});
			}
		});
	}
}

if (findings.length == 0) {
	console.log("check-scene-images: every image resolves.");
} else {
	console.log("check-scene-images: " + findings.length + " problem(s):");
	for (const f of findings) console.log("  " + f.file + ":~" + f.line + "  " + f.what + "   (" + f.why + ")");
	process.exitCode = 1;
}
