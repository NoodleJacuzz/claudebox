//===================================================================================================
//HONEYCOMB CATACOMBS -- sprite canvas metrics generator (developer tool, never loaded by the game)
//===================================================================================================
//Reads the pixel size of every character and enemy .webp on disk and writes it as a plain table the
//game loads like any other script:
//
//  node "!designDocs/honeycomb/tools/generate-sprite-metrics.js"
//
//IT DOES TWO JOBS.
//
//1. THE GAME reads it as `honeycomb.spriteMetricMap`. A sprite is sized by its canvas SHAPE
//   (honeycomb.art.normaliseCanvas), and without this table that shape could only be learned by loading
//   the picture and reading `naturalWidth`, so every sprite needed a `load` callback before it was the
//   right size. With the table the correction is written straight into the tag. Measured honestly: this
//   removes the dependency, not a visible pop -- the browser was already firing `load` before it painted
//   the new picture, so no wrong frame was reaching the screen from that path. See the measurements in
//   honeycomb.combatScene.applyPose and honeycomb.art.applyCanvas, including two fixes that were tried
//   here and did NOT work.
//
//2. THE ART PASS reads what it prints. The shape census says how many different canvases are in use,
//   and the last section names every folder whose poses are not the same height -- which is the fault
//   Noodle described on 2026-09-21: "chess1V's images were designed such that combat, support, and
//   offense were all designed with the same image height in mind. If all of them were 1216, or if all
//   of them were 1408, they would all be perfectly sized."
//
//RERUN THIS after any art lands: png-to-webp.py, generate-placeholder-art.py, or a file dropped in by
//hand. A path this table does not know still works -- honeycomb.art.normaliseCanvas measures it on load
//exactly as before -- so a stale table costs the old behaviour for that one picture and nothing else.
//
//The output is GENERATED: edit this tool, never scripts/misc/honeycomb/honeycomb-sprite-metrics.js.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..", "..");
const IMAGES = path.join(ROOT, "v13 spire images");
const OUTPUT = path.join(ROOT, "scripts", "misc", "honeycomb", "honeycomb-sprite-metrics.js");

//The two folders a fighter's drawing can come from. Cards, icons and UI are framed by their own boxes
//and are never normalised, so measuring them would be weight for nothing.
const AREA_ARRAY = ["characters", "enemies"];

//---------------------------------------------------------------------------------------------------
//Reading a .webp header. Three container shapes, all inside the same RIFF wrapper.
//---------------------------------------------------------------------------------------------------
//VP8  -- lossy.    Size sits after a 3-byte start code and the 0x9d012a signature.
//VP8L -- lossless. Width and height are 14 bits each, packed little-endian after a 0x2f signature.
//VP8X -- extended. Both are 24-bit, and the stored value is one LESS than the real size.
function webpSize(file) {
	const buffer = fs.readFileSync(file);
	if (buffer.length < 30) return null;
	if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") return null;
	const kind = buffer.toString("ascii", 12, 16);

	if (kind === "VP8X") {
		return { width: buffer.readUIntLE(24, 3) + 1, height: buffer.readUIntLE(27, 3) + 1 };
	}
	if (kind === "VP8L") {
		if (buffer[20] !== 0x2f) return null;
		const bits = buffer.readUInt32LE(21);
		return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
	}
	if (kind === "VP8 ") {
		if (buffer[23] !== 0x9d || buffer[24] !== 0x01 || buffer[25] !== 0x2a) return null;
		return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
	}
	return null;
}

function walk(folder, found) {
	if (!fs.existsSync(folder)) return found;
	for (const name of fs.readdirSync(folder).sort()) {
		const full = path.join(folder, name);
		if (fs.statSync(full).isDirectory()) { walk(full, found); continue; }
		if (!name.toLowerCase().endsWith(".webp")) continue;
		found.push(full);
	}
	return found;
}

//THE GENERATOR'S OWN FILES (2026-09-22). A file named in its folder's `.generated.txt` is a stand-in the
//placeholder generator wrote, and its row carries a third value, 1. The game reads it to put the Broken
//tint on stand-ins only (honeycomb.art.isPlaceholderArt). Noodle: "That should probably be on placeholders
//only, like how placeholder half-health sprites had the red blotches."
//A file on `.copies.txt` is generated but copies a real drawing, so it is not marked as a stand-in.
const manifestCache = {};
function listFile(folder, name) {
	const key = folder + "|" + name;
	if (manifestCache[key] === undefined) {
		const manifest = path.join(folder, name);
		manifestCache[key] = fs.existsSync(manifest)
			? fs.readFileSync(manifest, "utf8").split(/\r?\n/).filter((line) => line !== "" && line[0] !== "#") : [];
	}
	return manifestCache[key];
}
function isGenerated(file) {
	const folder = path.dirname(file), base = path.basename(file);
	return listFile(folder, ".generated.txt").indexOf(base) >= 0 && listFile(folder, ".copies.txt").indexOf(base) < 0;
}

function main() {
	const rowArray = [];
	const unreadableArray = [];
	for (const area of AREA_ARRAY) {
		for (const file of walk(path.join(IMAGES, area), [])) {
			const size = webpSize(file);
			//The content path: what honeycomb.image is given, with no folder and no extension.
			const key = path.relative(IMAGES, file).replace(/\\/g, "/").replace(/\.webp$/i, "");
			if (size == null || size.width <= 0 || size.height <= 0) { unreadableArray.push(key); continue; }
			rowArray.push({ key: key, width: size.width, height: size.height, generated: isGenerated(file) });
		}
	}

	const bodyArray = rowArray.map((row) => '\t"' + row.key + '": [' + row.width + ", " + row.height + (row.generated ? ", 1" : "") + "]");
	const text =
		"//===================================================================================================\n" +
		"//Honeycomb Catacombs -- sprite canvas metrics  (GENERATED by !designDocs/honeycomb/tools/generate-sprite-metrics.js; do not edit)\n" +
		"//===================================================================================================\n" +
		"//The pixel size of every character and enemy drawing on disk, by its content path. Read by\n" +
		"//honeycomb.art.canvasSize so a sprite's width correction can be written into its tag rather than\n" +
		"//waiting for the picture to load. Rerun the generator after any art lands. A path that is missing\n" +
		"//here is measured on load instead, exactly as it used to be. A third value of 1 marks a stand-in the\n" +
		"//placeholder generator wrote (it is on its folder's .generated.txt).\n" +
		"honeycomb.spriteMetricMap = {\n" + bodyArray.join(",\n") + "\n};\n";

	fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
	fs.writeFileSync(OUTPUT, text);

	console.log("measured " + rowArray.length + " drawing(s) -> " + path.relative(ROOT, OUTPUT));
	const shapeMap = {};
	for (const row of rowArray) {
		const shape = row.width + "x" + row.height;
		shapeMap[shape] = (shapeMap[shape] || 0) + 1;
	}
	console.log("\ncanvas shapes in use:");
	for (const shape of Object.keys(shapeMap).sort((a, b) => shapeMap[b] - shapeMap[a])) {
		console.log("  " + shape.padEnd(12) + shapeMap[shape]);
	}
	if (unreadableArray.length > 0) {
		console.log("\ncould not read a size from " + unreadableArray.length + " file(s):");
		for (const key of unreadableArray) console.log("  " + key);
	}

	//WHICH FOLDERS DISAGREE WITH THEMSELVES. A fighter's poses stand in for one another in the same
	//frame, so they have to share a canvas: Noodle, 2026-09-21, "chess1V's images were designed such
	//that combat, support, and offense were all designed with the same image height in mind. If all of
	//them were 1216, or if all of them were 1408, they would all be perfectly sized." A folder listed
	//here holds poses drawn to different heights, and the game cannot tell a crouch from a bad export.
	//
	//`1-basic` and `0-portrait` are NOT combat poses -- basic is the teambuilding standing sprite and
	//the portrait is a face -- so neither is counted against a folder's agreement.
	//What is compared: the poses a fighter SWAPS BETWEEN while standing in one place. That is the
	//numbered poses and `exposed`. Not `1-basic` or `2-basic` (the teambuilding standing sprite), not
	//`0-portrait` (a face), and not the cut-in art and backdrops in a character's root folder, none of
	//which ever stands beside another of them in the same frame.
	const POSE = /^[123]-(combat|offense|passive|damaged)$|^exposed$/;
	const folderMap = {};
	for (const row of rowArray) {
		const cut = row.key.lastIndexOf("/");
		const folder = row.key.slice(0, cut);
		const name = row.key.slice(cut + 1);
		if (!POSE.test(name)) continue;
		(folderMap[folder] = folderMap[folder] || []).push({ name: name, height: row.height, width: row.width });
	}
	const disagreeing = [];
	for (const folder of Object.keys(folderMap).sort()) {
		const heightArray = folderMap[folder].map((one) => one.height);
		if (new Set(heightArray).size > 1) disagreeing.push(folder);
	}
	console.log("\nFOLDERS WHOSE COMBAT POSES ARE NOT THE SAME HEIGHT (" + disagreeing.length + "):");
	if (disagreeing.length === 0) console.log("  none -- every fighter's poses agree");
	for (const folder of disagreeing) {
		console.log("  " + folder);
		for (const one of folderMap[folder].sort((a, b) => a.name.localeCompare(b.name))) {
			console.log("      " + one.name.padEnd(14) + one.width + "x" + one.height);
		}
	}
}

main();
