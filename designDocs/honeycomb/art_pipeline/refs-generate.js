//===================================================================================================
//HONEYCOMB ART PIPELINE -- generation runner (step 5's test images; the seed of step 10's batch runner)
//===================================================================================================
//Builds a slot's prompt from pose-templates.js -- step 6's SHORTCUT (`.hcKnightV, default, PoseDefense`), so the
//prompt sent here is the one the webui produces and the one in MISSING-PROMPTS.md. Compiles it with the webui v2
//engine, and sends it to Forge with a
//ControlNet `reference_only` unit on the character's own `-basic-a` image at timesteps 0.7-1.0, style fidelity 0.5 (BRIEF step 10, Noodle: the
//`-a` image alone is enough as the reference). The request mirrors webui.js's own: steps, sampler, cfg, universal
//prompt, style, and the SAME two alwayson_scripts the browser sends — `controlnet` and `Prompt Notes`. So the Forge
//"Prompt Notes" extension runs here too: line 1 of the infotext becomes the clean compiled prompt (no style), with
//`Raw input` beside it. The sidecar written next to each PNG is that PNG's own `parameters` text chunk, so a
//refsTests .txt is the same shape as a final .txt. If Forge is busy (a Discord user), the runner WAITS and retries
//rather than stopping, so a batch does not have to be restarted from the top.
//
//  node --max-old-space-size=2048 "!designDocs/honeycomb/art_pipeline/refs-generate.js" priest1V-support-a lancer1V-offense-a
//  node --max-old-space-size=2048 "!designDocs/honeycomb/art_pipeline/refs-generate.js" --missing [--limit 5] [--size Portrait] [--sexes V]
//  options: --style "<basicStyleArray id>" (default Honeycomb)  --size "<basicImageSizes id>" (default Vertical)
//           --sexes V,C (which of C/V to send; V is the injected art, C is kept as the gender-swap test bed)
//           --seed <n> (default random)  --dry (print the request, send nothing)  --out <folder>
//           --missing (every missing slot)  --limit <n> (stop after n)  --wait <seconds> (busy poll, 10)
//           --start / --end / --weight   override the reference unit (settled defaults 0.7 / 1.0 / 1; style fidelity 0.5)
//           --reference on|off (default off: the trained Honeycomb LoRA replaced the ControlNet crutch; `on` restores it)
//           --variants <n> (n images per slot, default 1; run twice with `--size Vertical` then `--size Portrait`)
//
//Saved as `<slot>-NNN`, an incrementing counter from 1 (never the seed), so a folder of variants compares by eye and
//the keeper just drops its `-NNN` to slot in. The seed still lives in the infotext. `--missing` ignores the output
//folder on purpose: run it again to accumulate `-002`, `-003`, … for every slot, then pick and delete the rest. A
//wider slot is a named run with a wider `--size`.
//
//The reference image is ALWAYS the character and gender's `-basic-a` (BRIEF round 2), attached as a ControlNet
//`reference_only` unit; nothing else needs choosing per slot. OFF by default since the trained Honeycomb LoRA
//(Noodle, art pass) holds the look without it. `--reference on` brings it back if a batch drifts.
//
//It waits, rather than stopping, while Forge reports a job running, so it never queues behind someone's own
//generation and never has to be restarted.
const fs = require("fs");
const vm = require("vm");
const path = require("path");
const templates = require("./pose-templates.js");

const ROOT = path.join(__dirname, "..", "..", "..");
const ENGINE = path.join(ROOT, "scripts", "webui");
const REFS = path.join(ROOT, "!designDocs", "honeycomb", "!imageStorage", "_source", "refsPNG", "characters");
const FORGE = "http://192.168.0.2:7000";
//Noodle, 2026-09-14: "Timestep range should be 0.7 to 1.0, always." and "Style fidelity should be at 0.5" (left out, the unit
//defaults to 1.0, which does not look good). Style fidelity is the reference preprocessor's threshold_a.
const REFERENCE = { module: "reference_only", weight: 1, guidanceStart: 0.7, guidanceEnd: 1.0, styleFidelity: 0.5 };

const argumentArray = process.argv.slice(2);
const option = (name, fallback) => { const at = argumentArray.indexOf(name); return at < 0 ? fallback : argumentArray[at + 1]; };
//The trained Honeycomb LoRA holds the cast on-model, so ControlNet reference is off unless asked for.
const useReference = String(option("--reference", "off")).toLowerCase() === "on";

//Noodle's refinement pass (2026-09-19). Additions go at the START of the prompt. Every pose except the
//standing basics, the broken cut-in and the exposed cut-in is a side view, and the forward-facing default is
//pushed into the negative. Damaged `-b` poses carry the arousal set. Attacking poses lead with the action words.
const FRONT_EXEMPT = ["a", "b", "exposed"];
const DAMAGED_STATE = ["b", "breakdown-b", "defense-b", "offense-b", "support-b"];
const ATTACKING_STATE = ["offense", "offense-b"];
const DAMAGE_MOOD = ["sweat", "blush", "embarrassed", "horny", "pent-up"];
function refinePrompt(slot, prompt) {
	const prefix = [];
	if (ATTACKING_STATE.includes(slot)) { prefix.push("dynamic pose", "attacking", "action pose"); }
	if (!FRONT_EXEMPT.includes(slot)) { prefix.push("from side"); }
	if (DAMAGED_STATE.includes(slot)) { prefix.push(...DAMAGE_MOOD); }
	return prefix.length ? prefix.join(", ") + ", " + prompt : prompt;
}
function refineNegative(slot, negative) {
	if (FRONT_EXEMPT.includes(slot)) { return negative; }
	return "(looking at viewer, straight on, from front), " + (negative || "");
}

//Combat has no charactersDB Pose rule (added 2026-09-19), so the runner builds its input directly from the
//generic CORE plus the character's body state.
function buildInputFor(character, sex, slot) {
	if (slot !== "combat" && slot !== "combat-b") { return templates.buildShortcutInput(character, sex, slot); }
	const tagArray = [templates.ENTRY[character] + sex, "default"]
		.concat(templates.CORE[slot] || [])
		.concat(templates.resolveSexStates(templates.SEX[character][slot] || templates.SEX[character][templates.SEX_LEVEL[slot]] || [], sex))
		.concat(templates.BACKGROUND || []);
	return [...new Set(tagArray)].join(", ");
}

//Hoist the pose factors to the front of the compiled prompt (Noodle, 2026-09-19). A top-level comma split
//keeps `(green eyes, glowing eyes)` groups whole.
function splitTopLevel(text) {
	const out = []; let depth = 0, current = "";
	for (const character of text) {
		if (character === "(" || character === "[") { depth++; }
		else if (character === ")" || character === "]") { depth = Math.max(0, depth - 1); }
		if (character === "," && depth === 0) { if (current.trim()) { out.push(current.trim()); } current = ""; }
		else { current += character; }
	}
	if (current.trim()) { out.push(current.trim()); }
	return out;
}
const normTag = (text) => String(text).trim().toLowerCase().replace(/^\(+/, "").replace(/\)+$/, "").replace(/'/g, "").replace(/:\s*[\d.]+$/, "").trim();
function poseTagSet(character, sex, slot) {
	const tagArray = [];
	tagArray.push(...(templates.CORE[slot] || []));
	tagArray.push(...(templates.methodFor(character, slot) || []));
	if (templates.DAMAGED_SLOTS.includes(slot)) { tagArray.push(...(templates.DAMAGE[character] || [])); }
	tagArray.push(...templates.resolveSexStates(templates.SEX[character][slot] || templates.SEX[character][templates.SEX_LEVEL[slot]] || [], sex));
	tagArray.push(...((templates.DROP[character] || {})[slot] || []));
	return new Set(tagArray.map(normTag));
}
function hoistPoseTags(prompt, want) {
	const front = [], back = [];
	for (const tag of splitTopLevel(prompt)) { (want.has(normTag(tag)) ? front : back).push(tag); }
	return front.concat(back).join(", ");
}
let slotNames = argumentArray.filter((argument, index) => !argument.startsWith("--") && !(index > 0 && argumentArray[index - 1].startsWith("--") && argumentArray[index - 1] !== "--dry"));
const dry = argumentArray.includes("--dry");
const outFolder = option("--out", path.join(ROOT, "!designDocs", "honeycomb", "!imageStorage", "_source", "refsTests", new Date().toISOString().slice(0, 10)));
//`--sexes V,C`: limit a run to a subset of C/V. Only V art is injected into the game; C is kept as the gender-swap
//test bed. Same spelling as outfits-generate.js so the two runners read alike.
const sexes = String(option("--sexes", "V,C")).split(",").map((sex) => sex.trim().toUpperCase()).filter(Boolean);
//`--missing`: every slot with no REFERENCE sidecar — the `.txt` beside the character PNG, the same test
//pose-templates.js uses. It deliberately does NOT look at the output folder, so running it again re-sends the same
//set and each slot gains the next `-NNN`: that is how variants are accumulated before one is picked. The reference
//for each is that character and sex's `-basic-a.png`.
if (argumentArray.includes("--missing")) {
	slotNames = [];
	for (const character of Object.keys(templates.ENTRY)) {
		for (const sex of sexes) {
			for (const slot of templates.SLOT_ARRAY) {
				const name = character + "1" + sex + "-" + templates.FILE_SLOT[slot];
				if (!fs.existsSync(path.join(REFS, name + ".txt"))) { slotNames.push(name); }
			}
		}
	}
	const limit = Number(option("--limit", slotNames.length));
	slotNames = slotNames.slice(0, limit);
	console.log("--missing: " + slotNames.length + " slot(s) to send");
}
//The reference window can be overridden for an experiment; the settled values are the defaults above.
REFERENCE.guidanceStart = Number(option("--start", REFERENCE.guidanceStart));
REFERENCE.guidanceEnd = Number(option("--end", REFERENCE.guidanceEnd));
REFERENCE.weight = Number(option("--weight", REFERENCE.weight));

const quiet = { log() {}, info() {}, warn() {}, debug() {}, error: console.error };
const sandbox = { console: quiet, module: undefined };
vm.createContext(sandbox);
const webuiSource = fs.readFileSync(path.join(ENGINE, "webui.js"), "utf8");
const libraryList = webuiSource.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/)[1].match(/"([^"]+)"/g).map((quoted) => quoted.slice(1, -1));
for (const file of libraryList) vm.runInContext(fs.readFileSync(path.join(ENGINE, "libraries", file), "utf8"), sandbox, { filename: file });
for (const file of ["webui.js", "webui2-categories.js", "webui2.js"]) vm.runInContext(fs.readFileSync(path.join(ENGINE, file), "utf8"), sandbox, { filename: file });
vm.runInContext("v2EnsureDictionaries()", sandbox);

//Noodle: "I've just added the Honeycomb style to the styles list, please use that when sending requests."
const styleId = option("--style", "Honeycomb");
const style = vm.runInContext("basicStyleArray", sandbox).find((entry) => entry.id === styleId);
//`--size` is a `basicImageSizes` id by name, never a raw WxH: the two numbers are easy to transpose (a "1216x832"
//was meant as height 1216 x width 832, which is `Portrait`, not `Landscape`), and the table already carries a name
//for every size. `Portrait` and `Semi-Tall` are the two wide-on-a-tall-grid shots.
const sizeId = option("--size", "Vertical");
const size = vm.runInContext("basicImageSizes", sandbox).find((entry) => entry.id === sizeId);
if (!style || !size) { console.error("unknown --style or --size (use a basicImageSizes id: Vertical, Portrait, Semi-Tall, Semi-Wide, Landscape, Horizontal, …)"); process.exit(1); }
const universalPrompt = vm.runInContext("universalPrompt", sandbox);

async function forgeIdle() {
	const progress = await (await fetch(FORGE + "/sdapi/v1/progress?skip_current_image=true")).json();
	return !(progress.state && progress.state.job_count > 0) && !(progress.progress > 0);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//Forge is shared with the Discord bridge, so it is often occupied by somebody else's job. WAIT rather than stop:
//stomping off meant a batch was restarted from the top every time a Discord user generated. A failed progress
//probe is treated as busy too, so a blip does not kill the run. `--wait <seconds>` sets the poll interval.
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

//The PNG Forge returns carries its full `parameters` text chunk - the same infotext the browser saves next to a
//generated image, Prompt Notes' `Raw input` / `Clean prompt` fields included. Writing THAT to the sidecar is what
//makes a refsTests .txt byte-for-byte the same shape as a final .txt; a hand-built summary would not be.
function pngTextChunk(base64, keyword) {
	const buffer = Buffer.from(base64, "base64");
	if (buffer.length < 8 || buffer.readUInt32BE(0) !== 0x89504e47) { return null; }
	let at = 8;
	while (at + 12 <= buffer.length) {
		const length = buffer.readUInt32BE(at);
		const type = buffer.toString("latin1", at + 4, at + 8);
		const start = at + 8;
		const end = start + length;
		if (end + 4 > buffer.length) { return null; }
		if (type === "tEXt" || type === "iTXt") {
			const zero = buffer.indexOf(0, start);
			if (zero !== -1 && zero < end && buffer.toString("latin1", start, zero) === keyword) {
				if (type === "tEXt") { return buffer.toString("utf8", zero + 1, end); }
				let cursor = zero + 1;
				const compressed = buffer[cursor]; cursor += 2;                 // flag + method
				cursor = buffer.indexOf(0, cursor) + 1;                          // language tag
				cursor = buffer.indexOf(0, cursor) + 1;                          // translated keyword
				if (!compressed) { return buffer.toString("utf8", cursor, end); }
			}
		}
		if (type === "IEND") { break; }
		at = end + 4;
	}
	return null;
}

//The saved name is `<slot>-NNN`, an incrementing counter, not the seed — so a folder of variants sorts and compares
//by eye, and the one that is kept just drops its `-NNN` suffix to slot in beside the existing art. The seed still
//lives in the infotext. A numeric suffix of more than four digits is an old `<slot>-<seed>` name and is ignored,
//so the counter cannot jump to a seed-sized number.
function nextFileBase(folder, name) {
	const pattern = new RegExp("^" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "-(\\d+)\\.(?:png|txt)$", "i");
	let highest = 0;
	for (const file of fs.readdirSync(folder)) {
		const match = file.match(pattern);
		if (match && match[1].length <= 4) { highest = Math.max(highest, Number(match[1])); }
	}
	return name + "-" + String(highest + 1).padStart(3, "0");
}

(async () => {
	fs.mkdirSync(outFolder, { recursive: true });
	for (const name of slotNames) {
		//Names use the file slots (`priest1V-support-a`); FILE_SLOT maps them back to the template slot.
		const slotOfFile = Object.fromEntries(Object.entries(templates.FILE_SLOT).map(([slot, file]) => [file, slot]));
		const match = name.match(/^([a-z]+)1([CV])-(.+)$/);
		if (!match) { console.log("skip " + name + ": expected <char>1<V|C>-<slot>"); continue; }
		const [, character, sex, fileSlot] = match;
		if (!sexes.includes(sex)) { console.log("skip " + name + ": sex " + sex + " not in --sexes " + sexes.join(",")); continue; }
		const slot = slotOfFile[fileSlot];
		if (!slot) { console.log("skip " + name + ": unknown slot " + fileSlot); continue; }
		const input = buildInputFor(character, sex, slot);
		const job = sandbox.buildPrompt(input, "", {});
		const hoisted = hoistPoseTags(job.prompt.replace(/\n/g, " "), poseTagSet(character, sex, slot));
		const prompt = refinePrompt(slot, hoisted + ", " + [style.finalStyle, universalPrompt].filter(Boolean).join(", "));
		//The BROWSER sends this too (`promptNotesEntry` in webui-regional.js): the Forge "Prompt Notes"
		//extension writes "Raw input" and "Clean prompt" into the infotext and moves the clean prompt — the
		//compiled one WITHOUT the style LoRA and universal tags — to line 1. The style still reaches SD in
		//`prompt`; this only decides what the file records. Positioning matches forge-prompt-notes.py.
		const cleanBase = typeof sandbox.removeDuplicates === "function" ? sandbox.removeDuplicates(hoisted) : hoisted;
		const cleanPrompt = refinePrompt(slot, cleanBase);
		const alwaysonScripts = { "Prompt Notes": { args: [input, cleanPrompt, ""] } };
		let referenceNote = "no ControlNet";
		if (useReference) {
			const referencePath = path.join(REFS, character + "1" + sex + "-basic-a.png");
			alwaysonScripts.controlnet = { args: [{
				enabled: true, module: REFERENCE.module, model: "None", weight: REFERENCE.weight,
				image: fs.readFileSync(referencePath).toString("base64"), resize_mode: "Crop and Resize",
				guidance_start: REFERENCE.guidanceStart, guidance_end: REFERENCE.guidanceEnd, threshold_a: REFERENCE.styleFidelity, pixel_perfect: false, control_mode: "Balanced",
			}] };
			referenceNote = "reference " + path.basename(referencePath);
		}
		const variantCount = Number(option("--variants", 1));
		for (let variant = 0; variant < variantCount; variant++) {
			const seed = Number(option("--seed", Math.floor(Math.random() * 2 ** 31)));
			const request = {
				prompt: prompt, negative_prompt: refineNegative(slot, job.negative), steps: 30, sampler_name: "DPM++ 2M SDE", cfg_scale: 5,
				width: size.width, height: size.height, seed: seed, batch_size: 1, save_images: false,
				//save_images FALSE: the runner writes the PNG itself, and TRUE would drop a second copy into the
				//generation PC's own output folder (Noodle's working folder). The API still returns a PNG carrying
				//its full `parameters` chunk with save_images off (discord bridge, verified 2026-08-24).
				alwayson_scripts: alwaysonScripts,
			};
			console.log("\n== " + name + "  (" + referenceNote + ", " + size.width + "x" + size.height + " (" + size.id + "), seed " + seed + ", style " + styleId + ", " + (variant + 1) + "/" + variantCount + ")\n" + prompt);
			if (dry) { console.log("negative: " + request.negative_prompt); break; }
			await waitForForge();
			const started = Date.now();
			const response = await fetch(FORGE + "/sdapi/v1/txt2img", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) });
			const data = await response.json();
			if (!data.images || !data.images.length) { console.log("no image returned: " + JSON.stringify(data).slice(0, 600)); continue; }
			const base = nextFileBase(outFolder, name);
			fs.writeFileSync(path.join(outFolder, base + ".png"), Buffer.from(data.images[0], "base64"));
			//The sidecar IS the image's own infotext, not a summary of it — the same text a final .txt carries.
			const parameters = pngTextChunk(data.images[0], "parameters");
			if (parameters) {
				fs.writeFileSync(path.join(outFolder, base + ".txt"), parameters.replace(/\s*$/, "") + "\n", "utf8");
			} else {
				console.warn("  WARNING: the returned PNG has no `parameters` chunk; writing a minimal sidecar.");
				fs.writeFileSync(path.join(outFolder, base + ".txt"), cleanPrompt + "\nNegative prompt: " + job.negative + "\n", "utf8");
			}
			console.log("saved " + base + ".png in " + ((Date.now() - started) / 1000).toFixed(0) + "s (" + data.images.length + " image(s) returned)");
		}
	}
})().catch((error) => { console.error(error); process.exit(1); });
