//===================================================================================================
//HONEYCOMB ART PIPELINE -- card-art test runner
//===================================================================================================
//Compiles the hand-authored lines in CARD-PROMPTS-01.md through the webui v2 engine and sends them to
//Forge the same way refs-generate.js does: Honeycomb style, Prompt Notes, ControlNet reference_only
//on the character's `-basic-a`. Horizontal cards go Landscape; vertical go Portrait. Action poses use
//the 0.3–0.8 reference window so they do not freeze on the standing ref.
//
//  node --max-old-space-size=2048 "!designDocs/honeycomb/art_pipeline/card-prompts-generate.js"
//  options: --only brienne  --limit <n>  --dry  --out <folder>  --wait <seconds>  --style Honeycomb
//           --reference on|off (default off: the trained Honeycomb LoRA replaced the ControlNet crutch)
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..", "..");
const ENGINE = path.join(ROOT, "scripts", "webui");
const REFS = path.join(ROOT, "!designDocs", "honeycomb", "!imageStorage", "_source", "refsPNG", "characters");
const MD = path.join(__dirname, "..", "CARD-PROMPTS-01.md");
const FORGE = "http://192.168.0.2:7000";
const ENTRY_FOLDER = { ".hcKnightV": "knight", ".hcNecroV": "necro", ".hcVampV": "vamp", ".hcLancerV": "lancer", ".hcPriestV": "priest", ".hcSeerV": "seer" };

const argumentArray = process.argv.slice(2);
const option = (name, fallback) => { const at = argumentArray.indexOf(name); return at < 0 ? fallback : argumentArray[at + 1]; };
const dry = argumentArray.includes("--dry");
//The trained Honeycomb LoRA holds the cast on-model, so ControlNet reference is off unless asked for.
const useReference = String(option("--reference", "off")).toLowerCase() === "on";
const only = String(option("--only", "brienne")).toLowerCase();
const limit = Number(option("--limit", Infinity));
const outFolder = option("--out", path.join(ROOT, "!designDocs", "honeycomb", "!imageStorage", "_source", "refsTests", new Date().toISOString().slice(0, 10), "cards-" + only));

const quiet = { log() {}, info() {}, warn() {}, debug() {}, error: console.error };
const sandbox = { console: quiet, module: undefined };
vm.createContext(sandbox);
const webuiSource = fs.readFileSync(path.join(ENGINE, "webui.js"), "utf8");
const libraryList = webuiSource.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/)[1].match(/"([^"]+)"/g).map((quoted) => quoted.slice(1, -1));
for (const file of libraryList) vm.runInContext(fs.readFileSync(path.join(ENGINE, "libraries", file), "utf8"), sandbox, { filename: file });
for (const file of ["webui.js", "webui2-categories.js", "webui2.js"]) vm.runInContext(fs.readFileSync(path.join(ENGINE, file), "utf8"), sandbox, { filename: file });
vm.runInContext("v2EnsureDictionaries()", sandbox);

const styleId = option("--style", "Honeycomb");
const style = vm.runInContext("basicStyleArray", sandbox).find((entry) => entry.id === styleId);
const sizeById = Object.fromEntries(vm.runInContext("basicImageSizes", sandbox).map((row) => [row.id, row]));
const universalPrompt = vm.runInContext("universalPrompt", sandbox);
if (!style) { console.error("unknown --style"); process.exit(1); }

function parseJobs() {
	const jobs = [];
	let character = "";
	for (const line of fs.readFileSync(MD, "utf8").split(/\r?\n/)) {
		const heading = line.match(/^## (\w+)/);
		if (heading) { character = heading[1].toLowerCase(); continue; }
		const row = line.match(/^\| ([^|]+?) † \| \w+ \| (horizontal|vertical) \| [^|]+ \| `(\.[^`]+)` \|$/);
		if (!row) continue;
		if (only && character !== only) continue;
		const input = row[3];
		const entry = input.split(",")[0].trim();
		jobs.push({
			character: character,
			name: row[1].trim(),
			layout: row[2],
			input: input,
			entry: entry,
			folder: ENTRY_FOLDER[entry],
			action: /action pose|dynamic|slashing|running|walking|fighting|monster|pinning/.test(input),
			nude: /,\s*nude,/.test(input),
		});
	}
	return jobs;
}

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
function slug(name) {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const jobs = parseJobs();
console.log("card-prompts-generate: " + jobs.length + " card(s), style " + styleId + ", ControlNet reference " + (useReference ? "reference_only on -basic-a" : "off"));

(async () => {
	fs.mkdirSync(outFolder, { recursive: true });
	let sent = 0;
	for (const card of jobs) {
		if (sent >= limit) { console.log("--limit reached (" + limit + ")"); break; }
		const size = sizeById[card.layout === "vertical" ? "Portrait" : "Landscape"];
		const job = sandbox.buildPrompt(card.input, "", {});
		const prompt = job.prompt.replace(/\n/g, " ") + ", " + [style.finalStyle, universalPrompt].filter(Boolean).join(", ");
		const cleanPrompt = typeof sandbox.removeDuplicates === "function" ? sandbox.removeDuplicates(job.prompt) : job.prompt;
		const referencePath = path.join(REFS, card.folder + "1V-basic-a.png");
		const seed = Number(option("--seed", Math.floor(Math.random() * 2 ** 31)));
		const start = card.action ? 0.3 : 0.7;
		const fileName = card.character + "-" + slug(card.name);
		const alwayson = { "Prompt Notes": { args: [card.input, cleanPrompt, ""] } };
		if (useReference && !card.nude) {
			alwayson.controlnet = { args: [{
				enabled: true, module: "reference_only", model: "None", weight: 1,
				image: fs.readFileSync(referencePath).toString("base64"), resize_mode: "Crop and Resize",
				guidance_start: start, guidance_end: 1.0, threshold_a: 0.5, pixel_perfect: false, control_mode: "Balanced",
			}] };
		}
		const request = {
			prompt: prompt, negative_prompt: job.negative, steps: 30, sampler_name: "DPM++ 2M SDE", cfg_scale: 5,
			width: size.width, height: size.height, seed: seed, batch_size: 1, save_images: false,
			alwayson_scripts: alwayson,
		};
		console.log("\n== " + fileName + "  (" + size.id + " " + size.width + "x" + size.height + ", " + (useReference && !card.nude ? "ref " + start + "-1.0" : "no ControlNet") + ", seed " + seed + ")\n" + prompt);
		if (dry) { sent++; continue; }
		await waitForForge();
		const started = Date.now();
		const response = await fetch(FORGE + "/sdapi/v1/txt2img", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) });
		const data = await response.json();
		if (!data.images || !data.images.length) { console.log("no image returned: " + JSON.stringify(data).slice(0, 600)); continue; }
		const base = nextFileBase(outFolder, fileName);
		fs.writeFileSync(path.join(outFolder, base + ".png"), Buffer.from(data.images[0], "base64"));
		const parameters = pngTextChunk(data.images[0], "parameters");
		if (parameters) { fs.writeFileSync(path.join(outFolder, base + ".txt"), parameters.replace(/\s*$/, "") + "\n", "utf8"); }
		else { fs.writeFileSync(path.join(outFolder, base + ".txt"), cleanPrompt + "\nNegative prompt: " + job.negative + "\n", "utf8"); }
		sent++;
		console.log("saved " + base + ".png in " + ((Date.now() - started) / 1000).toFixed(0) + "s");
	}
	console.log("\ndone: " + sent + " image(s) → " + outFolder);
})().catch((error) => { console.error(error); process.exit(1); });
