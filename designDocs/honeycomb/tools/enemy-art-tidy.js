//ENEMY ART TIDY (2026-09-21).
//
//Noodle's rule: "Basic combat sprites use -combat. Ordinary enemies should have -combat and -offense,
//that's it. Players, bosses, special specific peeps get other sprites. -basic is used for the standing
//sprites in the teambuilding scene."
//
//This tool makes the enemy art folder obey that rule. It MOVES files into an archive folder outside the
//game's art tree and never deletes one, because the project has no version control.
//
//  node enemy-art-tidy.js            dry run: prints what would happen and changes nothing
//  node enemy-art-tidy.js --apply    does it
//
//What it does to each ordinary enemy folder (enemies/<folder>/<variant>/):
//  1. No `1-combat` but a `1-basic`: the `1-basic` is RENAMED to `1-combat`, so the enemy keeps a drawing.
//  2. A `1-basic` that is byte-for-byte the same file as `1-combat`: archived. Nothing is lost.
//  3. Any other file the placeholder generator wrote (listed in `.generated.txt`): archived.
//  4. Any other file that is REAL art and outside the rule: left where it is and REPORTED, for Noodle to
//     decide. This tool never moves a drawing it cannot prove is a placeholder or a duplicate.
//A folder is left completely alone when an enemy that uses it declares its own art set (`artPoseArray`
//on the definition -- a boss or a special case).
//
//Suite block [126] checks the same rule, so a folder that drifts again fails the suite.
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..", "..", "..", "scripts", "misc");
const IMAGES = path.resolve(__dirname, "..", "..", "..", "v13 spire images");
const ARCHIVE = path.resolve(__dirname, "..", "!imageStorage", "_source", "_archive-enemy-poses");
const APPLY = process.argv.indexOf("--apply") >= 0;
const ALLOWED = ["1-combat.webp", "1-offense.webp", ".generated.txt"];

const FILES = eval(fs.readFileSync(path.join(__dirname, "card-inventory.js"), "utf8").match(/const FILES = (\[[\s\S]*?\]);/)[1]);
const sandbox = {
	console: { log() {}, warn() {}, debug() {}, info() {}, error() {} },
	localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
	Date, Math, JSON, encodeURI, encodeURIComponent, decodeURIComponent, Object, Array, String, Number, Infinity, parseInt, parseFloat, setTimeout, clearTimeout,
	document: { getElementById: () => null, createElement: () => ({ style: { setProperty() {} }, appendChild() {}, classList: { add() {}, remove() {} } }), body: null },
};
sandbox.window = sandbox;
vm.createContext(sandbox);
for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sandbox, { filename: f });
const hc = sandbox.honeycomb;

//Which enemy definitions draw from which folder.
const usersByFolder = {};
for (const enemy of hc.enemyArray) {
	const key = (enemy.artFolder == null ? enemy.index : enemy.artFolder) + "/" + (enemy.artVariant == null ? "default" : enemy.artVariant);
	(usersByFolder[key] = usersByFolder[key] || []).push(enemy);
}

const readManifest = (folderPath) => {
	const file = path.join(folderPath, ".generated.txt");
	if (!fs.existsSync(file)) return { headerArray: [], nameArray: [] };
	const lineArray = fs.readFileSync(file, "utf8").split(/\r?\n/);
	return { headerArray: lineArray.filter((line) => line.startsWith("#")), nameArray: lineArray.filter((line) => line !== "" && !line.startsWith("#")) };
};
const sameBytes = (a, b) => fs.statSync(a).size === fs.statSync(b).size && fs.readFileSync(a).equals(fs.readFileSync(b));

const enemyRoot = path.join(IMAGES, "enemies");
const count = { renamed: 0, archived: 0, reported: 0, special: 0, clean: 0 };
const reportArray = [];
for (const folder of fs.readdirSync(enemyRoot).sort()) {
	const folderPath = path.join(enemyRoot, folder);
	if (!fs.statSync(folderPath).isDirectory()) continue;
	for (const variant of fs.readdirSync(folderPath).sort()) {
		const variantPath = path.join(folderPath, variant);
		if (!fs.statSync(variantPath).isDirectory()) continue;
		const key = folder + "/" + variant;
		const userArray = usersByFolder[key] || [];
		if (userArray.length === 0) reportArray.push(key + ": no enemy definition uses this folder");
		if (userArray.some((enemy) => enemy.artPoseArray != null)) {
			count.special += 1;
			console.log("  special, left alone   " + key);
			continue;
		}

		const manifest = readManifest(variantPath);
		let generatedArray = manifest.nameArray.slice();
		const actionArray = [];
		const has = (name) => fs.existsSync(path.join(variantPath, name));

		//1. An enemy with only a `1-basic` keeps it, under the name the game asks for.
		if (!has("1-combat.webp") && has("1-basic.webp")) {
			actionArray.push({ verb: "rename", from: "1-basic.webp", to: "1-combat.webp" });
			generatedArray = generatedArray.map((name) => (name === "1-basic.webp" ? "1-combat.webp" : name));
		}
		const renamedBasic = actionArray.length > 0;

		for (const name of fs.readdirSync(variantPath).sort()) {
			if (ALLOWED.indexOf(name) >= 0) continue;
			if (name === "1-basic.webp" && renamedBasic) continue;
			const isGenerated = manifest.nameArray.indexOf(name) >= 0;
			const isDuplicateBasic = name === "1-basic.webp" && has("1-combat.webp") &&
				sameBytes(path.join(variantPath, name), path.join(variantPath, "1-combat.webp"));
			if (isGenerated || isDuplicateBasic) {
				actionArray.push({ verb: "archive", from: name, why: isDuplicateBasic ? "identical to 1-combat" : "generated placeholder" });
				generatedArray = generatedArray.filter((one) => one !== name);
			} else {
				count.reported += 1;
				reportArray.push(key + "/" + name + ": real art outside the rule, left in place");
			}
		}

		if (actionArray.length === 0) { count.clean += 1; continue; }
		console.log("  " + key);
		for (const action of actionArray) {
			if (action.verb === "rename") {
				count.renamed += 1;
				console.log("      rename  " + action.from + " -> " + action.to);
				if (APPLY) fs.renameSync(path.join(variantPath, action.from), path.join(variantPath, action.to));
			} else {
				count.archived += 1;
				console.log("      archive " + action.from + "  (" + action.why + ")");
				if (APPLY) {
					const target = path.join(ARCHIVE, folder, variant);
					fs.mkdirSync(target, { recursive: true });
					fs.renameSync(path.join(variantPath, action.from), path.join(target, action.from));
				}
			}
		}
		//The manifest keeps listing only what is still in the folder, so the generator's "unlisted means
		//real art" rule stays true. A folder with nothing generated left in it loses its manifest.
		if (APPLY && fs.existsSync(path.join(variantPath, ".generated.txt"))) {
			if (generatedArray.length === 0) {
				const target = path.join(ARCHIVE, folder, variant);
				fs.mkdirSync(target, { recursive: true });
				fs.renameSync(path.join(variantPath, ".generated.txt"), path.join(target, ".generated.txt"));
			} else {
				fs.writeFileSync(path.join(variantPath, ".generated.txt"), manifest.headerArray.concat(generatedArray).join("\n") + "\n");
			}
		}
	}
}

console.log("\n" + (APPLY ? "DONE" : "DRY RUN -- nothing was changed; add --apply to do it"));
console.log("renamed " + count.renamed + ", archived " + count.archived + ", special folders left alone " + count.special +
	", already clean " + count.clean + ", reported " + count.reported);
if (APPLY) console.log("archive: " + ARCHIVE);
if (reportArray.length > 0) console.log("\nFOR NOODLE TO DECIDE:\n  " + reportArray.join("\n  "));
