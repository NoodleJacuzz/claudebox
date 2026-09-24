//===================================================================================================
//HONEYCOMB ART PIPELINE -- alternate-outfit test runner
//===================================================================================================
//Sends every design in outfit-designs.js (A-F for all 19 alternate outfits) to Forge as a visual test run,
//for BOTH sexes. The prompt is:
//
//  .hc<Char><V|C>, PoseA, <design tags>
//
//so the pose is identical across every outfit -- `PoseA` is step 6's standing shortcut -- and only the outfit
//changes. NO CONTROLNET on this pass (Noodle, 2026-09-14): this is a look-and-see, and a depth-model reference
//may be added later to lock the pose between outfits. Style `Honeycomb`, Prompt Notes attached, PNG + its own
//`parameters` sidecar, saved as `<char>1<sex>-<outfit>-<variant>-NNN`.
//
//  node --max-old-space-size=2048 "!designDocs/honeycomb/art_pipeline/outfits-generate.js" --dry
//  node --max-old-space-size=2048 "!designDocs/honeycomb/art_pipeline/outfits-generate.js"
//  options: --size "<basicImageSizes id>" (default Vertical)  --style "<id>" (default Honeycomb)
//           --sexes V,C  --variants A,B,C,D  --only <substring>  --limit <n>  --seed <n>
//           --out <folder>  --wait <seconds>  --dry
//
//Waits (does not stop) while Forge is busy with somebody else's job.
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..", "..");
const ENGINE = path.join(ROOT, "scripts", "webui");
const FORGE = "http://192.168.0.2:7000";
const DESIGNS = require(path.join(__dirname, "outfit-designs.js"));

const argumentArray = process.argv.slice(2);
const option = (name, fallback) => { const at = argumentArray.indexOf(name); return at < 0 ? fallback : argumentArray[at + 1]; };
const dry = argumentArray.includes("--dry");
const outFolder = option("--out", path.join(ROOT, "!designDocs", "honeycomb", "!imageStorage", "_source", "refsTests", new Date().toISOString().slice(0, 10), "outfits"));
const sexes = String(option("--sexes", "V,C")).split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
const variants = String(option("--variants", "A,B,C,D,E,F")).split(",").map((s) => s.trim().toUpperCase());
const only = option("--only", "");
//--save asks Forge to ALSO keep the image in its own output folder, which is how a run is looked at
//from a phone. Off by default: the runner writes the PNG itself and a second copy is clutter.
const saveOnForge = argumentArray.includes("--save");
//--extra appends tags to every prompt in the run. `--extra "action pose, dynamic"` is Noodle's: a figure
//standing stock-straight in all 114 gives each outfit less chance to sell itself than one in motion.
const extraTags = String(option("--extra", "")).trim();
const limit = Number(option("--limit", Infinity));

const quiet = { log() {}, info() {}, warn() {}, debug() {}, error: console.error };
const sandbox = { console: quiet, module: undefined };
vm.createContext(sandbox);
const webuiSource = fs.readFileSync(path.join(ENGINE, "webui.js"), "utf8");
const libraryList = webuiSource.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/)[1].match(/"([^"]+)"/g).map((q) => q.slice(1, -1));
for (const file of libraryList) vm.runInContext(fs.readFileSync(path.join(ENGINE, "libraries", file), "utf8"), sandbox, { filename: file });
for (const file of ["webui.js", "webui2-categories.js", "webui2.js"]) vm.runInContext(fs.readFileSync(path.join(ENGINE, file), "utf8"), sandbox, { filename: file });
vm.runInContext("v2EnsureDictionaries()", sandbox);

const styleId = option("--style", "Honeycomb");
const style = vm.runInContext("basicStyleArray", sandbox).find((entry) => entry.id === styleId);
const sizeId = option("--size", "Vertical");
const size = vm.runInContext("basicImageSizes", sandbox).find((entry) => entry.id === sizeId);
const universalPrompt = vm.runInContext("universalPrompt", sandbox);
if (!style || !size) { console.error("unknown --style or --size"); process.exit(1); }

const entryFor = (character, sex) => ".hc" + character.charAt(0).toUpperCase() + character.slice(1) + sex;

async function forgeIdle() {
	const progress = await (await fetch(FORGE + "/sdapi/v1/progress?skip_current_image=true")).json();
	return !(progress.state && progress.state.job_count > 0) && !(progress.progress > 0);
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitForForge() {
	const every = Math.max(2, Number(option("--wait", 10)));
	let waited = 0;
	for (;;) {
		let idle = false;
		try { idle = await forgeIdle(); } catch (error) { idle = false; }
		if (idle) { if (waited) { console.log("Forge is free; continuing after " + waited + "s."); } return; }
		if (waited % (every * 3) === 0) { console.log("Forge is busy (another job, likely a Discord user); waiting… " + waited + "s"); }
		await sleep(every * 1000);
		waited += every;
	}
}
function pngTextChunk(base64, keyword) {
	const buffer = Buffer.from(base64, "base64");
	if (buffer.length < 8 || buffer.readUInt32BE(0) !== 0x89504e47) { return null; }
	let at = 8;
	while (at + 12 <= buffer.length) {
		const length = buffer.readUInt32BE(at);
		const type = buffer.toString("latin1", at + 4, at + 8);
		const start = at + 8; const end = start + length;
		if (end + 4 > buffer.length) { return null; }
		if (type === "tEXt" || type === "iTXt") {
			const zero = buffer.indexOf(0, start);
			if (zero !== -1 && zero < end && buffer.toString("latin1", start, zero) === keyword) {
				if (type === "tEXt") { return buffer.toString("utf8", zero + 1, end); }
				let cursor = zero + 1; const compressed = buffer[cursor]; cursor += 2;
				cursor = buffer.indexOf(0, cursor) + 1; cursor = buffer.indexOf(0, cursor) + 1;
				if (!compressed) { return buffer.toString("utf8", cursor, end); }
			}
		}
		if (type === "IEND") { break; }
		at = end + 4;
	}
	return null;
}
function nextFileBase(folder, name) {
	const pattern = new RegExp("^" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "-(\\d+)\\.(?:png|txt)$", "i");
	let highest = 0;
	if (fs.existsSync(folder)) {
		for (const file of fs.readdirSync(folder)) {
			const match = file.match(pattern);
			if (match && match[1].length <= 4) { highest = Math.max(highest, Number(match[1])); }
		}
	}
	return name + "-" + String(highest + 1).padStart(3, "0");
}

const jobList = [];
for (const design of DESIGNS) {
	if (!variants.includes(design.variant)) { continue; }
	if (only && !(design.character + "-" + design.index + "-" + design.variant).includes(only)) { continue; }
	for (const sex of sexes) { jobList.push({ design, sex }); }
}
console.log("outfits-generate: " + jobList.length + " image(s) (" + DESIGNS.length + " designs, sexes " + sexes.join("/") + "), " + size.width + "x" + size.height + " (" + size.id + "), style " + styleId + ", no ControlNet");

(async () => {
	fs.mkdirSync(outFolder, { recursive: true });
	let sent = 0;
	for (const { design, sex } of jobList) {
		if (sent >= limit) { console.log("--limit reached (" + limit + ")"); break; }
		const sexTags = sex === "V" ? (design.tagsV || []) : (design.tagsC || []);
		const input = entryFor(design.character, sex) + ", PoseA, " + design.tags.concat(sexTags).join(", ")
			+ (extraTags ? ", " + extraTags : "");
		const job = sandbox.buildPrompt(input, "", {});
		const prompt = job.prompt.replace(/\n/g, " ") + ", " + [style.finalStyle, universalPrompt].filter(Boolean).join(", ");
		const cleanPrompt = typeof sandbox.removeDuplicates === "function" ? sandbox.removeDuplicates(job.prompt) : job.prompt;
		const name = design.character + "1" + sex + "-" + design.index + "-" + design.variant;
		const seed = Number(option("--seed", Math.floor(Math.random() * 2 ** 31)));
		const request = {
			prompt: prompt, negative_prompt: job.negative, steps: 30, sampler_name: "DPM++ 2M SDE", cfg_scale: 5,
			width: size.width, height: size.height, seed: seed, batch_size: 1, save_images: saveOnForge,
			alwayson_scripts: { "Prompt Notes": { args: [input, cleanPrompt, ""] } },
		};
		console.log("\n== " + name + "  (" + size.width + "x" + size.height + ", seed " + seed + ")\n" + prompt);
		if (dry) { sent++; continue; }
		await waitForForge();
		const started = Date.now();
		const response = await fetch(FORGE + "/sdapi/v1/txt2img", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) });
		const data = await response.json();
		if (!data.images || !data.images.length) { console.log("no image returned: " + JSON.stringify(data).slice(0, 600)); continue; }
		const base = nextFileBase(outFolder, name);
		fs.writeFileSync(path.join(outFolder, base + ".png"), Buffer.from(data.images[0], "base64"));
		const parameters = pngTextChunk(data.images[0], "parameters");
		if (parameters) { fs.writeFileSync(path.join(outFolder, base + ".txt"), parameters.replace(/\s*$/, "") + "\n", "utf8"); }
		else { fs.writeFileSync(path.join(outFolder, base + ".txt"), cleanPrompt + "\nNegative prompt: " + job.negative + "\n", "utf8"); }
		sent++;
		console.log("saved " + base + ".png in " + ((Date.now() - started) / 1000).toFixed(0) + "s");
	}
})().catch((error) => { console.error(error); process.exit(1); });
