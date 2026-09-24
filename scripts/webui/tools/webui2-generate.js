// ============================================================================
//  WEBUI ENGINE v2 - combo-block generator
// ============================================================================
//
//    node scripts/webui/tools/webui2-generate.js --block <combo.txt> --mode dry
//    node scripts/webui/tools/webui2-generate.js --block <combo.txt> --mode run \
//         --out "<folder>" [--names "v1-1,v1-2,…"] [--style Oreteki18kin] [--size Semi-Wide]
//
//  Takes a combo block exactly as it would be pasted into the webui, compiles every
//  variant it expands to with the v2 engine, and sends each one to Forge.
//
//  HOW IT TALKS TO THE ENGINE. The engine files are loaded into a Node `vm` context
//  and called directly — `checkForDirt`, `assemblePrompt`, `buildPrompt`,
//  `v2ScanDispatchKeywords`, `removeDuplicates` — in the same order and with the same
//  arguments as `sendPromptArray` / `sendPrompt` use in webui.js. No browser, no
//  served page, no Playwright. This is how `outfits-generate.js`, `refs-generate.js`
//  and `card-prompts-generate.js` have always worked, and they are the runs that have
//  actually finished.
//
//  An earlier version of this file drove the real page in headless Chrome, on the
//  reasoning that a hand-built /sdapi/v1/txt2img payload drops the alwayson_scripts
//  the page configures. That reasoning is answered rather than ignored: the request
//  below is assembled from webui.js's own dispatch site, including the `Prompt Notes`
//  entry, so the Forge extension runs on these images too. The page-driving version
//  stalled after one image with Forge sitting idle, which is a class of failure a
//  script with no browser in it cannot have.
//
//  --mode dry  compiles and prints, sends nothing. ALWAYS first: a stray blank line in
//              a combo block multiplies the groups instead of listing them, and the dry
//              run is where that is cheap to find. It prints the variant count, the size
//              each variant resolved to, and the names the files would be given.
//  --mode run  generates and writes each PNG to --out.
//
//  SIDECARS, AND WHY THEY ARE ON BY DEFAULT. Each PNG gets a `.txt` beside it holding its own
//  `parameters` chunk: prompt, negative, every setting, and the seed. The PNG carries that chunk
//  itself, but only until somebody opens it in a paint tool and saves - which is the normal next
//  step for one of these - and then it is gone with no way to get the seed back. The sidecar is
//  the copy that survives editing. `--no-sidecars` turns them off.
//
//  NAMES. `--names` is a comma-separated list in variant order. With no `--names`, the
//  block's own `- ` comment lines are used: `- v1-1  at her desk, vial up to the lamp`
//  names that variant `v1-1`. That is only accepted when the number of `- ` lines equals
//  the number of compiled variants; otherwise the run stops and asks for `--names`,
//  because a silent off-by-one would mislabel every file after it.
//
//  SIZE. A bare `basicImageSizes` id in the block (`Semi-Wide` in the suffix line) sets
//  the size for every variant that carries it, exactly as it does in the page, and beats
//  `--size`. `--size` is the fallback for a block that names none.
//
//  STYLE. `Syurofluff*` is Syrup Town's. Honeycomb uses `Oreteki18kin`, the default here.
//  Noodle, session 48: "using the syurofluff style is for syrup town images."
//
//  Forge is shared with the Discord bridge, so the runner WAITS while somebody else's
//  job is running rather than stopping — a batch is never restarted from the top.
//
//  options: --style <id>   --size <basicImageSizes id>   --negative "<text>"
//           --names a,b,c  --out <folder>  --seed <n>  --limit <n>  --only <substring>
//           --save         (ALSO keep a copy in Forge's own output folder; off by default)
//           --no-sidecars  (skip the .txt beside each PNG; they are written by DEFAULT)
//           --wait <s>     (busy-poll interval, default 10)
//           --forge <url>  (default http://192.168.0.2:7000 — beef pc, NOT localhost)
//
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..", "..");
const ENGINE = path.join(ROOT, "scripts", "webui");

const argumentArray = process.argv.slice(2);
const option = (name, fallback) => { const at = argumentArray.indexOf(name); return at < 0 ? fallback : argumentArray[at + 1]; };

if (!argumentArray.length || argumentArray.includes("--help")) {
	console.log(fs.readFileSync(__filename, "utf8").split("\n").filter((line) => line.startsWith("//")).join("\n"));
	process.exit(0);
}

const blockPath = option("--block", null);
const mode = String(option("--mode", "dry")).toLowerCase();
const outFolder = option("--out", null);
const styleId = option("--style", "Oreteki18kin");
const sizeFallback = option("--size", "Semi-Wide");
const negativeInput = String(option("--negative", ""));
const only = String(option("--only", ""));
const limit = Number(option("--limit", Infinity));
const saveOnForge = argumentArray.includes("--save");
const writeSidecars = !argumentArray.includes("--no-sidecars");
const FORGE = String(option("--forge", "http://192.168.0.2:7000")).replace(/\/$/, "");

if (!blockPath) { console.error("--block <combo.txt> is required."); process.exit(1); }
if (mode !== "dry" && mode !== "run") { console.error("--mode is dry or run."); process.exit(1); }
if (mode === "run" && !outFolder) { console.error("--mode run needs --out <folder>."); process.exit(1); }

const block = fs.readFileSync(blockPath, "utf8");

// ---- the engine, loaded the way every other runner in this repo loads it -------------------
const quiet = { log() {}, info() {}, warn() {}, debug() {}, error: console.error };
const sandbox = { console: quiet, module: undefined };
vm.createContext(sandbox);
const webuiSource = fs.readFileSync(path.join(ENGINE, "webui.js"), "utf8");
const libraryList = webuiSource.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/)[1].match(/"([^"]+)"/g).map((quoted) => quoted.slice(1, -1));
for (const file of libraryList) vm.runInContext(fs.readFileSync(path.join(ENGINE, "libraries", file), "utf8"), sandbox, { filename: file });
// webui-regional.js is NOT in librariesList and is loaded by the page separately. It touches no DOM,
// so it comes along here and `rp` works headlessly exactly as it does in the browser.
for (const file of ["webui.js", "webui2-categories.js", "webui2.js", "webui-regional.js"]) vm.runInContext(fs.readFileSync(path.join(ENGINE, file), "utf8"), sandbox, { filename: file });
vm.runInContext("v2EnsureDictionaries()", sandbox);

const basicImageSizes = vm.runInContext("basicImageSizes", sandbox);
const basicStyleArray = vm.runInContext("basicStyleArray", sandbox);
const universalPrompt = vm.runInContext("universalPrompt", sandbox);
const sizeFor = (id) => basicImageSizes.find((entry) => entry.id === id);
const styleFor = (id) => basicStyleArray.find((entry) => entry.id === id);
if (!styleFor(styleId)) { console.error("unknown --style " + styleId + " (ids: " + basicStyleArray.map((s) => s.id).join(", ") + ")"); process.exit(1); }
if (!sizeFor(sizeFallback)) { console.error("unknown --size " + sizeFallback + " (ids: " + basicImageSizes.map((s) => s.id).join(", ") + ")"); process.exit(1); }

// ---- Phase 0, as sendPromptArray does it ----------------------------------------------------
// checkForDirt first, then the run seed hashed off the CLEANED whole block and BEFORE the split,
// so every variant in the run shares it and a combo sequence keeps the same furniture shot to shot.
let input = sandbox.checkForDirt(block);
let negative = negativeInput;
if (sandbox.extractedNegative && !negative.trim()) { negative = sandbox.extractedNegative; }
const promptRunSeed = sandbox.v2HashString(input);
const variantArray = sandbox.assemblePrompt(input, "combo");

// ---- names ----------------------------------------------------------------------------------
// The block's own `- ` comment lines, first token each. Only used when the count agrees with the
// number of variants: a mismatch means the mapping is a guess, and a guess mislabels every file
// after the first stray line.
const commentNames = block.split("\n").map((line) => line.trim())
	.filter((line) => line.startsWith("- "))
	.map((line) => line.slice(2).trim().split(/\s+/)[0]);
let nameArray = String(option("--names", "")).split(",").map((s) => s.trim()).filter(Boolean);
let nameSource = "--names";
if (!nameArray.length) {
	nameSource = "the block's `- ` comment lines";
	if (commentNames.length === variantArray.length) { nameArray = commentNames; }
	else { nameSource = "none (" + commentNames.length + " `- ` lines for " + variantArray.length + " variants)"; }
}

// ---- compile every variant --------------------------------------------------------------------
const jobArray = [];
for (let index = 0; index < variantArray.length; index++) {
	let variantInput = variantArray[index];
	const name = nameArray[index] || ("image-" + String(index + 1).padStart(2, "0"));
	if (only && !name.includes(only) && !variantInput.includes(only)) { continue; }

	// ---- REGIONAL PROMPTING -------------------------------------------------------------------
	// Read off the RAW input and stripped before compiling, exactly where sendPrompt reads it, so `rp`
	// never reaches the model as a tag. `rp1-1, brienne {…}, nettle {…}` puts one figure in each half.
	// An unreadable layout is FATAL rather than a quiet fall back to equal regions: a layout that
	// silently reverted would produce a picture that looks almost right, which is the worst outcome.
	let regionalRun = { active: false };
	if (typeof sandbox.extractRegionalTrigger === "function") {
		const trigger = sandbox.extractRegionalTrigger(variantInput);
		variantInput = trigger.prompt;
		if (trigger.error) {
			console.error("\n== " + name + ": Regional Prompter: " + trigger.error);
			process.exit(1);
		}
		if (trigger.active) { regionalRun = trigger; }
		// LATENT DESTROYS THE IMAGE ON THIS FORGE (Noodle, session 50): the extension's latent calc mode
		// and this build are not compatible, and the output comes back ruined rather than merely wrong.
		// Refused here rather than warned about, because it costs a whole batch to find out by looking.
		if (/(^|[,\s])latent([,\s]|$)/i.test(String(variantArray[index]))) {
			console.error("== " + name + ": `latent` is not usable on this Forge -- it destroys the output. " +
				"Use attention (the default) and prefer fewer regions; see webui_engine/REGIONAL-PROMPTING.md §5.");
			process.exit(1);
		}
	}

	// A COPY carrying the run seed, for the same reason webui.js makes one: a per-run value has no
	// business being saved as if it were a setting.
	const job = sandbox.buildPrompt(variantInput, negative, { promptSeed: promptRunSeed });
	if (job.errors && job.errors.length) {
		console.error("\n== " + name + ": v2 did not compile\n   " + job.errors.join("\n   "));
		process.exit(1);
	}

	// A size or style keyword in the block is a DIRECTIVE for this job and beats the flags. The job's
	// own reading is preferred over the raw scan where both answer, because the job read real records
	// and knows `(portrait)` from `"portrait"`.
	const scanned = sandbox.v2ScanDispatchKeywords(variantInput);
	let jobSizeId = (job.size || scanned.size || sizeFallback);
	if (jobSizeId === "Multiple") { jobSizeId = sizeFallback; }
	const jobStyleId = (job.style || scanned.style || styleId);
	const size = sizeFor(jobSizeId);
	const style = styleFor(jobStyleId);
	if (!size) { console.error("== " + name + ": unknown size `" + jobSizeId + "` from the block."); process.exit(1); }
	if (!style) { console.error("== " + name + ": unknown style `" + jobStyleId + "` from the block."); process.exit(1); }

	// The dispatch site in webui.js, line for line: dedupe the rendered prompt, then append the style
	// and the universal tags as `commonExtra`. Order matters — deduping after the append would let the
	// universal tags cull a tag the prompt asked for.
	// removeDuplicates splits on ", ", which does not match the comma-newline the v2 renderer joins
	// regions with -- running it on a regional prompt fuses the region separators. webui.js skips it
	// for the same reason, and so does this.
	const rendered = regionalRun.active ? job.prompt : sandbox.removeDuplicates(job.prompt);
	const commonExtra = [style.finalStyle, universalPrompt].filter(Boolean).join(", ");
	let prompt = rendered + ", " + commonExtra;
	let regionalArgs = null;
	if (regionalRun.active) {
		// The style and the universal tags describe the whole image, not whichever region sorts last,
		// so they are handed to the adapter to place in the COMMON block rather than concatenated on.
		const regional = sandbox.buildRegionalRequest(rendered, commonExtra, job, regionalRun);
		if (regional != null && regional.abort) {
			console.error("\n== " + name + ": Regional Prompter aborted the job.");
			process.exit(1);
		}
		if (regional != null) { prompt = regional.prompt; regionalArgs = regional.args; }
		else { console.warn("  " + name + ": only one region in this prompt; sending it normally."); }
	}
	// What the Forge `Prompt Notes` extension records. WITHOUT the style, because the recorded prompt
	// exists to be fed back in and a second style LoRA arriving from a sidecar stacks on the first.
	const cleanPrompt = rendered;

	jobArray.push({ name, variantInput, prompt, cleanPrompt, negative: job.negative, size, styleId: jobStyleId, regionalArgs });
}

console.log("webui2-generate: " + variantArray.length + " variant(s) compiled, " + jobArray.length + " to send"
	+ (only ? " (--only " + only + ")" : "") + "; names from " + nameSource + "; style " + styleId + "; run seed " + promptRunSeed);
for (const job of jobArray) {
	console.log("  " + job.name.padEnd(12) + job.size.width + "x" + job.size.height + " (" + job.size.id + ")  style " + job.styleId + (job.regionalArgs ? "  REGIONAL" : ""));
}
if (mode === "run" && !nameArray.length) {
	console.error("\nRefusing to send: no names. Add `--names a,b,c` in variant order, or give the block one `- ` comment line per variant.");
	process.exit(1);
}

// ---- Forge -------------------------------------------------------------------------------------
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function forgeIdle() {
	const progress = await (await fetch(FORGE + "/sdapi/v1/progress?skip_current_image=true")).json();
	return !(progress.state && progress.state.job_count > 0) && !(progress.progress > 0);
}
// WAIT rather than stop while Forge is busy with somebody else's job (usually the Discord bridge).
// A failed probe counts as busy so a network blip does not kill the run.
async function waitForForge() {
	const every = Math.max(2, Number(option("--wait", 10)));
	let waited = 0;
	for (;;) {
		let idle = false;
		try { idle = await forgeIdle(); } catch (error) { idle = false; }
		if (idle) { if (waited) { console.log("  Forge is free; continuing after " + waited + "s."); } return; }
		if (waited % (every * 3) === 0) { console.log("  Forge is busy (another job, likely a Discord user); waiting… " + waited + "s"); }
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

(async () => {
	if (mode === "dry") {
		for (const job of jobArray) {
			console.log("\n== " + job.name + "  (" + job.size.width + "x" + job.size.height + ")\n" + job.prompt
				+ "\nnegative: " + job.negative);
		}
		console.log("\ndry run: nothing was sent.");
		return;
	}

	fs.mkdirSync(outFolder, { recursive: true });
	let sent = 0;
	for (const job of jobArray) {
		if (sent >= limit) { console.log("--limit reached (" + limit + ")"); break; }
		// An explicit random seed rather than -1. With -1 the seed exists ONLY inside the PNG's own
		// metadata chunk, so an image edited and saved by any ordinary paint tool loses it for good.
		// Generating the number here puts it in the console log and in the sidecar as well, which is
		// why refs-generate.js and outfits-generate.js have always done it this way.
		const seed = Number(option("--seed", Math.floor(Math.random() * 2 ** 31)));
		const request = {
			prompt: job.prompt, negative_prompt: job.negative,
			steps: 30, sampler_name: "DPM++ 2M SDE", cfg_scale: 5,
			width: job.size.width, height: job.size.height,
			seed: seed, batch_size: 1,
			// FALSE by default: this runner writes the PNG itself, and TRUE drops a second copy into the
			// generation PC's own working folder. The API still returns the full `parameters` chunk either way.
			save_images: saveOnForge,
			// The same entry the browser attaches (promptNotesEntry, webui-regional.js), so the Forge
			// "Prompt Notes" extension moves the clean prompt to line 1 of the infotext with `Raw input`
			// beside it. Args are POSITIONAL and match FIELDS in forge-prompt-notes.py.
			alwayson_scripts: { "Prompt Notes": { args: [job.variantInput, job.cleanPrompt, ""] } },
		};
		if (job.regionalArgs != null) { request.alwayson_scripts["Regional Prompter"] = { args: job.regionalArgs }; }
		console.log("\n== " + job.name + "  (" + job.size.width + "x" + job.size.height + ", seed " + seed + ", style " + job.styleId + ")");
		await waitForForge();
		const started = Date.now();
		let data;
		try {
			const response = await fetch(FORGE + "/sdapi/v1/txt2img", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) });
			data = await response.json();
		} catch (error) {
			console.error("  POST failed: " + error.message + " — is Forge up at " + FORGE + "?");
			process.exit(1);
		}
		if (!data.images || !data.images.length) { console.log("  no image returned: " + JSON.stringify(data).slice(0, 600)); continue; }
		fs.writeFileSync(path.join(outFolder, job.name + ".png"), Buffer.from(data.images[0], "base64"));
		if (writeSidecars) {
			const parameters = pngTextChunk(data.images[0], "parameters");
			fs.writeFileSync(path.join(outFolder, job.name + ".txt"),
				(parameters ? parameters.replace(/\s*$/, "") : job.cleanPrompt + "\nNegative prompt: " + job.negative) + "\n", "utf8");
		}
		sent++;
		console.log("  saved " + job.name + ".png in " + ((Date.now() - started) / 1000).toFixed(0) + "s");
	}
	console.log("\nwritten: " + sent + " of " + jobArray.length + " -> " + outFolder);
})().catch((error) => { console.error(error); process.exit(1); });
