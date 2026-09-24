//===================================================================================================
//HONEYCOMB ART PIPELINE -- Chess runner (the raw-prompt seventh girl)
//===================================================================================================
//Chess has no charactersDB entry; her `-a` sidecars carry her own prompt. This reads each, prepends the
//damaged-state tags (or Brienne's breakdown for `broken`), and runs the result through the SAME engine and
//Honeycomb style as the core cast, so her images match. Refinements mirror refs-generate.js: every pose
//except basic/broken/exposed is a side view with the front view in the negative, `-b` carries the arousal
//set, and offense leads with the action words.
//
//  node --max-old-space-size=2048 "!designDocs/honeycomb/art_pipeline/chess-generate.js" --variants 9 --size Vertical
//  options: --variants <n>  --size <basicImageSizes id>  --style <id>  --out <folder>  --dry
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..", "..");
const ENGINE = path.join(ROOT, "scripts", "webui");
const CHESS = path.join(ROOT, "!designDocs", "honeycomb", "!imageStorage", "_source", "refsTests", "chess");
const FORGE = "http://192.168.0.2:7000";

const argumentArray = process.argv.slice(2);
const option = (name, fallback) => { const at = argumentArray.indexOf(name); return at < 0 ? fallback : argumentArray[at + 1]; };
const dry = argumentArray.includes("--dry");
const variants = Number(option("--variants", 1));
const sizeId = option("--size", "Vertical");
const styleId = option("--style", "Honeycomb");
const outFolder = option("--out", CHESS);

//Noodle, 2026-09-19: the only difference a `-b` carries for her.
const B_PREFIX = ["peach pussy", "torn skirt", "pussy exposed", "cleft of venus", "covered nipples", "covered erect nipples", "huge nipples", "erect nipples", "nipple peek", "hyper nipples", "gigantic nipples"];
//Brienne's breakdown (POSES-01/METHOD knight breakdown), the model for Chess's `broken`.
const BRIENNE_BREAKDOWN = ["cowboy shot", "shaded face", "glowing eyes", "standing", "crazy", "wide-eyed", "hands to own head", "hypnosis", "'brainwashing'", "pink eyes", "teeth", "frown", "torn clothes", "sweat"];
const DAMAGE_MOOD = ["sweat", "blush", "embarrassed", "horny", "pent-up"];

const TARGET_ARRAY = [
	{ name: "basic-b", pose: "basic", side: false, mood: true, action: false, broken: false },
	{ name: "combat-b", pose: "combat", side: true, mood: true, action: false, broken: false },
	{ name: "offense-b", pose: "offense", side: true, mood: true, action: true, broken: false },
	{ name: "hurt-b", pose: "hurt", side: true, mood: true, action: false, broken: false },
	{ name: "support-b", pose: "support", side: true, mood: true, action: false, broken: false },
	{ name: "broken", pose: "basic", side: false, mood: false, action: false, broken: true },
];

const readPositive = (pose) => fs.readFileSync(path.join(CHESS, "chess1V-" + pose + "-a.txt"), "utf8").split(/\r?\n/)[0].trim();
function refinePrefix(target) {
	const prefix = [];
	if (target.action) { prefix.push("dynamic pose", "attacking", "action pose"); }
	if (target.side) { prefix.push("from side"); }
	if (target.mood) { prefix.push(...DAMAGE_MOOD); }
	return prefix;
}

const quiet = { log() {}, info() {}, warn() {}, debug() {}, error: console.error };
const sandbox = { console: quiet, module: undefined };
vm.createContext(sandbox);
const webuiSource = fs.readFileSync(path.join(ENGINE, "webui.js"), "utf8");
const libraryList = webuiSource.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/)[1].match(/"([^"]+)"/g).map((q) => q.slice(1, -1));
for (const file of libraryList) vm.runInContext(fs.readFileSync(path.join(ENGINE, "libraries", file), "utf8"), sandbox, { filename: file });
for (const file of ["webui.js", "webui2-categories.js", "webui2.js"]) vm.runInContext(fs.readFileSync(path.join(ENGINE, file), "utf8"), sandbox, { filename: file });
vm.runInContext("v2EnsureDictionaries()", sandbox);

const style = vm.runInContext("basicStyleArray", sandbox).find((entry) => entry.id === styleId);
const size = vm.runInContext("basicImageSizes", sandbox).find((entry) => entry.id === sizeId);
const universalPrompt = vm.runInContext("universalPrompt", sandbox);
if (!style || !size) { console.error("unknown --style or --size"); process.exit(1); }

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function forgeIdle() {
	const progress = await (await fetch(FORGE + "/sdapi/v1/progress?skip_current_image=true")).json();
	return !(progress.state && progress.state.job_count > 0) && !(progress.progress > 0);
}
async function waitForForge() {
	let waited = 0;
	for (;;) {
		let idle = false;
		try { idle = await forgeIdle(); } catch (error) { idle = false; }
		if (idle) { if (waited) { console.log("Forge free after " + waited + "s."); } return; }
		if (waited % 30 === 0) { console.log("Forge busy; waiting… " + waited + "s"); }
		await sleep(10000); waited += 10;
	}
}
function nextFileBase(folder, name) {
	const pattern = new RegExp("^" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "-(\\d+)\\.(?:png|txt)$", "i");
	let highest = 0;
	for (const file of fs.readdirSync(folder)) { const match = file.match(pattern); if (match && match[1].length <= 4) { highest = Math.max(highest, Number(match[1])); } }
	return name + "-" + String(highest + 1).padStart(3, "0");
}
function pngTextChunk(base64, keyword) {
	const buffer = Buffer.from(base64, "base64");
	if (buffer.length < 8 || buffer.readUInt32BE(0) !== 0x89504e47) { return null; }
	let at = 8;
	while (at + 12 <= buffer.length) {
		const length = buffer.readUInt32BE(at); const type = buffer.toString("latin1", at + 4, at + 8); const start = at + 8; const end = start + length;
		if (end + 4 > buffer.length) { return null; }
		if (type === "tEXt" || type === "iTXt") {
			const zero = buffer.indexOf(0, start);
			if (zero !== -1 && zero < end && buffer.toString("latin1", start, zero) === keyword) { return buffer.toString("utf8", zero + 1, end); }
		}
		if (type === "IEND") { break; }
		at = end + 4;
	}
	return null;
}

(async () => {
	fs.mkdirSync(outFolder, { recursive: true });
	for (const target of TARGET_ARRAY) {
		const sourcePositive = readPositive(target.pose);
		const prefix = target.broken ? BRIENNE_BREAKDOWN : B_PREFIX;
		const input = prefix.join(", ") + ", " + sourcePositive;
		const job = sandbox.buildPrompt(input, "", {});
		const prefixText = refinePrefix(target);
		const prompt = (prefixText.length ? prefixText.join(", ") + ", " : "") + job.prompt.replace(/\n/g, " ") + ", " + [style.finalStyle, universalPrompt].filter(Boolean).join(", ");
		const negative = (target.side ? "(looking at viewer, straight on, from front), " : "") + job.negative;
		const name = "chess1V-" + target.name;
		for (let variant = 0; variant < variants; variant++) {
			const seed = Number(option("--seed", Math.floor(Math.random() * 2 ** 31)));
			const request = {
				prompt: prompt, negative_prompt: negative, steps: 30, sampler_name: "DPM++ 2M SDE", cfg_scale: 5,
				width: size.width, height: size.height, seed: seed, batch_size: 1, save_images: false,
				alwayson_scripts: { "Prompt Notes": { args: [input, job.prompt, ""] } },
			};
			console.log("\n== " + name + "  (" + size.width + "x" + size.height + " (" + size.id + "), seed " + seed + ", style " + styleId + ", " + (variant + 1) + "/" + variants + ")\n" + prompt);
			if (dry) { break; }
			await waitForForge();
			const response = await fetch(FORGE + "/sdapi/v1/txt2img", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) });
			const data = await response.json();
			if (!data.images || !data.images.length) { console.log("no image returned: " + JSON.stringify(data).slice(0, 500)); continue; }
			const base = nextFileBase(outFolder, name);
			fs.writeFileSync(path.join(outFolder, base + ".png"), Buffer.from(data.images[0], "base64"));
			const parameters = pngTextChunk(data.images[0], "parameters");
			if (parameters) { fs.writeFileSync(path.join(outFolder, base + ".txt"), parameters.replace(/\s*$/, "") + "\n", "utf8"); }
			console.log("saved " + base + ".png");
		}
	}
})().catch((error) => { console.error(error); process.exit(1); });
