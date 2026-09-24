//===================================================================================================
//HONEYCOMB ART PIPELINE -- regenerate from a sidecar (exact-recovery runner)
//===================================================================================================
//A PNG is lost or damaged but its `.txt` sidecar survives. That sidecar IS the PNG's own `parameters`
//infotext, so it carries everything the generation needs: the clean compiled prompt, the negative, the
//steps/sampler/cfg/seed/size, and (for a reference shot) the ControlNet unit. This runner reads each
//sidecar and re-sends that exact request to Forge, writing the returned PNG into the same `<base>.png`
//and the returned infotext into `<base>.txt`.
//
//TOKEN FIDELITY (`--token legacy`, default): the `seer` rename rewrote the sidecars, so their prompt now
//carries `hc-s3er` (was `hc-sku1l`) and their Raw input `.hcSeer` (was `.hcSkull`). Those tokenise
//differently, so an exact recovery must send the OLD tokens. In legacy mode the request uses `hc-sku1l`
///`.hcSkull` and the written sidecar is normalised back to the seer tokens, so the repository stays
//consistent while the image matches what was lost. `--token seer` sends the sidecar as-is.
//
//  node --max-old-space-size=2048 "!designDocs/honeycomb/art_pipeline/regenerate-from-sidecar.js" \
//       --folder "...\refsTests\2026-09-15\outfits-round3" [--match grifter] [--limit 5] [--dry] [--force]
//  options: --folder <dir> (required, searched recursively)  --match <substring>  --limit <n>
//           --out <dir> (write elsewhere)  --token legacy|seer  --dry  --force (redo valid PNGs too)
//           --wait <seconds>  --reference on|off (default off: the trained Honeycomb LoRA replaced the ControlNet crutch)
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..", "..");
const ENGINE = path.join(ROOT, "scripts", "webui");
const REFS = path.join(ROOT, "!designDocs", "honeycomb", "!imageStorage", "_source", "refsPNG", "characters");
const FORGE = "http://192.168.0.2:7000";

const argumentArray = process.argv.slice(2);
const option = (name, fallback) => { const at = argumentArray.indexOf(name); return at < 0 ? fallback : argumentArray[at + 1]; };
const has = (name) => argumentArray.indexOf(name) >= 0;
const folder = option("--folder", null);
const match = option("--match", "");
const limit = Number(option("--limit", Infinity));
const outOverride = option("--out", null);
const tokenMode = option("--token", "legacy");
const dry = has("--dry");
const force = has("--force");
//A sidecar carries whether its shot used ControlNet. Off by default; `on` re-attaches the same unit.
const useReference = String(option("--reference", "off")).toLowerCase() === "on";
if (!folder) { console.error("--folder <dir> is required"); process.exit(1); }

const quiet = { log() {}, info() {}, warn() {}, debug() {}, error: console.error };
const sandbox = { console: quiet, module: undefined };
vm.createContext(sandbox);
const webuiSource = fs.readFileSync(path.join(ENGINE, "webui.js"), "utf8");
const libraryList = webuiSource.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/)[1].match(/"([^"]+)"/g).map((q) => q.slice(1, -1));
for (const file of libraryList) vm.runInContext(fs.readFileSync(path.join(ENGINE, "libraries", file), "utf8"), sandbox, { filename: file });
for (const file of ["webui.js", "webui2-categories.js", "webui2.js"]) vm.runInContext(fs.readFileSync(path.join(ENGINE, file), "utf8"), sandbox, { filename: file });
vm.runInContext("v2EnsureDictionaries()", sandbox);

const style = vm.runInContext("basicStyleArray", sandbox).find((entry) => entry.id === "Honeycomb");
const universalPrompt = vm.runInContext("universalPrompt", sandbox);
if (!style) { console.error("Honeycomb style not found"); process.exit(1); }

const toLegacy = (s) => String(s).replace(/hc-s3er/g, "hc-sku1l").replace(/\.hcSeer/g, ".hcSkull");
const toSeer = (s) => String(s).replace(/hc-sku1l/g, "hc-s3er").replace(/\.hcSkull/g, ".hcSeer");
const forSend = tokenMode === "legacy" ? toLegacy : (s) => String(s);

function isValidPng(file) {
	const b = fs.readFileSync(file);
	return b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
}

function parseSidecar(text) {
	const negAt = text.indexOf("\nNegative prompt:");
	const cleanPrompt = text.slice(0, negAt < 0 ? text.length : negAt).trim();
	let negative = "";
	if (negAt >= 0) {
		const rest = text.slice(negAt + 1);
		const stepsAt = rest.indexOf("\nSteps:");
		negative = (stepsAt < 0 ? rest : rest.slice(0, stepsAt)).replace(/^Negative prompt:\s*/, "").trim();
	}
	const g = (re, d) => { const m = text.match(re); return m ? m[1] : d; };
	return {
		cleanPrompt, negative,
		steps: Number(g(/Steps:\s*(\d+)/, 30)),
		sampler: String(g(/Sampler:\s*([^,\n]+)/, "DPM++ 2M SDE")).trim(),
		cfg: Number(g(/CFG scale:\s*([\d.]+)/, 5)),
		seed: Number(g(/Seed:\s*(\d+)/, 0)),
		size: String(g(/Size:\s*(\d+x\d+)/, "704x1408")),
		rawInput: String(g(/Raw input:\s*"([^"]*)"/, "")),
		hasControlNet: /ControlNet 0:/.test(text),
		cnWeight: Number(g(/Weight:\s*([\d.]+)/, 1)),
		cnStart: Number(g(/Guidance Start:\s*([\d.]+)/, 0.7)),
		cnEnd: Number(g(/Guidance End:\s*([\d.]+)/, 1.0)),
		cnThresholdA: Number(g(/Threshold A:\s*([\d.]+)/, 0.5)),
	};
}

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
			}
		}
		if (type === "IEND") { break; }
		at = end + 4;
	}
	return null;
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
		if (idle) { if (waited) { console.log("Forge free after " + waited + "s."); } return; }
		if (waited % (every * 3) === 0) { console.log("Forge busy (likely a Discord user); waiting… " + waited + "s"); }
		await sleep(every * 1000);
		waited += every;
	}
}

const targets = [];
(function walk(dir) {
	for (const name of fs.readdirSync(dir)) {
		const full = path.join(dir, name);
		if (fs.statSync(full).isDirectory()) { walk(full); continue; }
		if (name.endsWith(".txt") && full.includes(match)) { targets.push(full); }
	}
})(folder);
targets.sort();
console.log("regenerate-from-sidecar: " + targets.length + " sidecar(s) under " + folder + " (token " + tokenMode + ")");

(async () => {
	let sent = 0;
	for (const txtPath of targets) {
		if (sent >= limit) { console.log("--limit reached (" + limit + ")"); break; }
		const base = txtPath.replace(/\.txt$/, "");
		const pngPath = base + ".png";
		if (!force && fs.existsSync(pngPath) && isValidPng(pngPath)) { continue; }
		const info = parseSidecar(fs.readFileSync(txtPath, "utf8"));
		const name = path.basename(base);
		const parsedName = name.match(/^([a-z]+)1([CV])-/);
		if (!parsedName) { console.log("skip " + name + ": no <char>1<V|C> prefix"); continue; }
		const character = parsedName[1];
		const sex = parsedName[2];
		const [width, height] = info.size.split("x").map(Number);

		const request = {
			prompt: forSend(info.cleanPrompt) + ", " + [style.finalStyle, universalPrompt].filter(Boolean).join(", "),
			negative_prompt: info.negative,
			steps: info.steps, sampler_name: info.sampler, cfg_scale: info.cfg,
			width: width, height: height, seed: info.seed, batch_size: 1, save_images: false,
			alwayson_scripts: { "Prompt Notes": { args: [forSend(info.rawInput), forSend(info.cleanPrompt), ""] } },
		};
		if (useReference && info.hasControlNet) {
			const referencePath = path.join(REFS, character + "1" + sex + "-basic-a.png");
			if (!fs.existsSync(referencePath)) { console.log("skip " + name + ": no reference " + path.basename(referencePath)); continue; }
			request.alwayson_scripts.controlnet = { args: [{
				enabled: true, module: "reference_only", model: "None", weight: info.cnWeight,
				image: fs.readFileSync(referencePath).toString("base64"), resize_mode: "Crop and Resize",
				guidance_start: info.cnStart, guidance_end: info.cnEnd, threshold_a: info.cnThresholdA,
				pixel_perfect: false, control_mode: "Balanced",
			}] };
		}
		console.log("\n== " + name + "  seed " + info.seed + "  " + info.size + "  " + info.steps + " steps  cfg " + info.cfg + "  controlnet=" + info.hasControlNet);
		if (dry) { sent++; continue; }
		await waitForForge();
		const started = Date.now();
		const response = await fetch(FORGE + "/sdapi/v1/txt2img", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) });
		const data = await response.json();
		if (!data.images || !data.images.length) { console.log("no image returned: " + JSON.stringify(data).slice(0, 500)); continue; }
		fs.writeFileSync(outOverride ? path.join(outOverride, path.basename(pngPath)) : pngPath, Buffer.from(data.images[0], "base64"));
		const parameters = pngTextChunk(data.images[0], "parameters");
		const sidecarText = parameters ? parameters.replace(/\s*$/, "") + "\n" : (forSend(info.cleanPrompt) + "\nNegative prompt: " + info.negative + "\n");
		fs.writeFileSync(outOverride ? path.join(outOverride, path.basename(txtPath)) : txtPath, tokenMode === "legacy" ? toSeer(sidecarText) : sidecarText, "utf8");
		sent++;
		console.log("saved " + name + " in " + ((Date.now() - started) / 1000).toFixed(0) + "s");
	}
})().catch((error) => { console.error(error); process.exit(1); });
