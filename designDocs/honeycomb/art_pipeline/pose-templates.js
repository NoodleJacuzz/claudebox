//===================================================================================================
//HONEYCOMB ART PIPELINE -- pose templates (steps 4 and 5 of BRIEF.md)
//===================================================================================================
//A pose prompt is built in layers, which is what step 4 found the reference sidecars to be made of:
//
//  .hc<Char><V|C>, default     identity + outfit (charactersDB.js, step 3)
//  CORE[slot]                  what EVERY character does in that pose
//  METHOD[char][slot]          how THIS character does it (Nettle blocks with a magic shield, Severine with her arms)
//  DAMAGE[char]                the outfit's own tears, for any damaged slot
//  SEX[char][V|C][level]       what the pose shows of the body, by sex: a (clothed), lite (damaged), full (exposed), lust;
//                              a key named after a slot (`defense`) overrides the level for that one slot
//  DROP[char][slot]            outfit props the pose cannot have (`!black staff` in a breakdown)
//
//Read POSES-01.md for WHY each layer holds what it holds. A single-quoted tag is protected (webui Rule 2c): it is
//a tag the engine would otherwise rewrite or add carry-ons to, found by refs-census.js --triggers.
//
//  node --max-old-space-size=2048 "!designDocs/honeycomb/art_pipeline/pose-templates.js"            score + write prompts
//  node --max-old-space-size=2048 "!designDocs/honeycomb/art_pipeline/pose-templates.js" --score    score only
//
//SCORE: every existing sidecar is rebuilt from the templates and both are compiled. The score is the share of the
//sidecar's compiled tags the template reproduces, and the extras it adds. PROMPTS: every slot with no sidecar is
//compiled and written to MISSING-PROMPTS.md, with what the engine added to each, for review (step 7).
const fs = require("fs");
const vm = require("vm");
const path = require("path");

//Slots. Noodle's file names (2026-09-14): `<pose>-a` undamaged, `<pose>-b` damaged, so the two sit side by side;
//`exposed` is the damage moment itself and has no suffix. Internally `a`/`b` are the standing (`basic`) pose and a
//trailing `-b` marks a damaged version; FILE_SLOT turns an internal slot into its file name.
const SLOT_ARRAY = ["a", "b", "exposed", "breakdown", "breakdown-b", "defense", "defense-b", "offense", "offense-b", "support", "support-b", "combat", "combat-b"];
const FILE_SLOT = { a: "basic-a", b: "basic-b", exposed: "exposed", breakdown: "breakdown-a", "breakdown-b": "breakdown-b",
	defense: "defense-a", "defense-b": "defense-b", offense: "offense-a", "offense-b": "offense-b", support: "support-a", "support-b": "support-b",
	combat: "combat-a", "combat-b": "combat-b" };
const DAMAGED_SLOTS = ["b", "exposed", "breakdown-b", "defense-b", "offense-b", "support-b", "combat-b"];
const SEX_LEVEL = { a: "a", b: "lite", exposed: "full", breakdown: "lust", "breakdown-b": "lust", defense: "a", offense: "a", support: "a", combat: "a",
	"defense-b": "lite", "offense-b": "lite", "support-b": "lite", "combat-b": "lite" };
const BACKGROUND = ["solo", "simple background", "white background"];

const CORE = {
	a: ["standing", "full body"],
	b: ["standing", "full body", "torn clothes", "sweat"],
	exposed: ["standing", "full body", "torn clothes", "exposed", "blush"],
	breakdown: ["cowboy shot", "shaded face", "glowing eyes"],
	//DEFENSE IS BEING HIT (Noodle, 2026-09-14): "not a character using a defensive skill or dodging the attack, it is
	//when an attack hits them." A reaction, not a guard; METHOD says how each character takes it.
	defense: ["dynamic", "action pose", "'pain'", "wince", "full body"],
	offense: ["dynamic", "action pose", "attacking", "full body"],
	support: ["dynamic", "full body"],
	//The general combat stance (2026-09-19). `'looking to the side'` is protected so `hair over eyes` /
	//`obscured eyes` cannot cull it.
	combat: ["dynamic", "action pose", "full body", "from side", "looking forward", "battle pose", "'looking to the side'"],
};
CORE["breakdown-b"] = CORE.breakdown.concat(["torn clothes", "sweat"]);
CORE["defense-b"] = CORE.defense.concat(["torn clothes", "sweat"]);
CORE["offense-b"] = CORE.offense.concat(["torn clothes", "sweat"]);
CORE["support-b"] = CORE.support.concat(["torn clothes", "sweat"]);
CORE["combat-b"] = CORE.combat.concat(["torn clothes", "sweat"]);

//The outfit's tears. Only the default outfit so far; an alternate outfit brings its own line.
const DAMAGE = {
	knight: ["torn bodysuit", "crotch tear"],
	lancer: ["'torn hat'", "torn blouse", "torn tights", "torn shorts"],
	necro: ["torn dress"],
	priest: ["torn dress"],
	seer: ["torn leotard"],
	vamp: ["torn coat", "torn pants", "torn hat"],
};

//What the pose shows of the body, sex-NEUTRAL. The `Groin*`/`BustOut` tokens resolve per figure in
//cleaningDB's "Honeycomb sex states" (cleaningArrayFinal), and the character's own `Groin; pussy` /
//`Groin; penis` noun in charactersDB feeds their `pussy;`/`penis;` bodypart default. `Groin` alone is
//the bare bodypart; a state token is the state. `a` also serves every undamaged action slot.
const SEX = {
	knight: {
		a: [],
		lite: ["'nipple slip'", "covered nipples", "'erect nipples'", "no panties", "GroinHand", "arm crossed", "arm under breasts"],
		full: ["BustOut", "Groin", "GroinExposed"],
		lust: ["GroinTent"],
	},
	lancer: {
		a: [],
		lite: ["underboob", "GroinTent"],
		full: ["BustOut", "Groin", "GroinExposed"],
		lust: ["'areola slip'", "GroinFluidCloth"],
	},
	necro: {
		a: [],
		defense: ["upskirt", "GroinPeek"],
		lite: ["GroinHand", "GroinFluid", "GroinTent"],
		full: ["GroinHand", "Groin", "GroinExposed", "GroinFluid"],
		lust: ["GroinFluid", "squirting through clothes", "GroinFluidCloth", "covered nipples", "'areola slip'", "GroinTent"],
	},
	priest: {
		a: [],
		lite: ["covered nipples", "GroinOutline"],
		full: ["BustOut", "gold pasties"],
		lust: ["'areola slip'", "GroinFluidCloth", "GroinTent"],
	},
	seer: {
		a: [],
		defense: ["'nipple slip'", "GroinTent"],
		lite: ["'nipple slip'", "GroinTent"],
		full: ["'nipple slip'", "Groin", "GroinExposed", "GroinHand"],
		lust: ["GroinFluidCloth", "'areola slip'", "GroinTent"],
	},
	vamp: {
		a: [],
		lite: ["covered nipples", "GroinTent"],
		full: ["BustOut", "Groin", "GroinExposed", "GroinFluid"],
		lust: ["'areola slip'", "GroinFluidCloth", "GroinFluid", "GroinTent"],
	},
};

//Honeycomb-only state vocabulary. Expanded HERE, in the art pipeline, never by the engine, so no invented token
//reaches a shared dictionary. `pussy` / `penis` still hit the character's own bodypart default at generation time.
const SEX_STATES = {
	Groin: { V: ["pussy"], C: ["penis"] },
	GroinExposed: { V: ["pussy exposed"], C: ["penis exposed", "erection"] },
	GroinOutline: { V: ["cameltoe"], C: ["bulge", "penis outline"] },
	GroinPeek: { V: ["pussy peek"], C: ["balls peek"] },
	GroinTent: { V: ["cameltoe"], C: ["tenting", "erection under clothes"] },
	GroinHand: { V: ["hand over crotch", "covering crotch"], C: ["hand over penis", "hand over crotch", "covering crotch"] },
	GroinStim: { V: ["rubbing pussy"], C: ["balls squish"] },
	GroinFluid: { V: ["pussy juice", "excessive pussy juice", "pussy juice string"], C: ["precum", "excessive precum", "precum string", "precum squirt"] },
	GroinFluidCloth: { V: ["pussy juice through clothes", "pussy juice stain"], C: ["precum through clothes", "precum stain"] },
	BustOut: { V: ["'breasts out'", "'nipples'"], C: ["puffy nipples"] },
};
function resolveSexStates(tagArray, sex) {
	const target = sex === "C" ? "C" : "V";
	const out = [];
	for (const tag of tagArray) {
		const state = SEX_STATES[tag];
		if (state) { out.push(...state[target]); } else { out.push(tag); }
	}
	return out;
}

//How each character performs each pose. Existing slots copy their sidecar; the rest are read from the character's
//identity (POSES-01.md, "The cast"). A damaged action inherits its undamaged method unless it says otherwise.
const METHOD = {
	knight: {
		a: ["looking at viewer", "holding sword", "planted sword"],
		b: ["looking to the side", "planted sword", "one eye closed", "wince", "blush", "embarrassed", "covering crotch"],
		exposed: ["planted sword", "looking to the side", "clenched teeth", "v-shaped eyebrows", "embarrassed", "arm across chest", "covering chest", "covering crotch"],
		breakdown: ["standing", "crazy", "wide-eyed", "hands to own head", "hypnosis", "'brainwashing'", "pink eyes", "teeth", "frown"],
		defense: ["holding sword", "clenched teeth", "one eye closed", "staggering", "v-shaped eyebrows", "angry"],
		offense: ["standing", "holding sword", "slashing", "furrowed brow", "determined"],
		support: ["holding sword", "hand on own chest", "determined", "closed mouth", "looking at viewer", "aura"],
	},
	lancer: {
		a: ["shadowed face", "grin", "holding spear"],
		b: ["hair over eyes", "obscured eyes", "holding spear", "hand over face", "covering face", "wavy mouth", "blush", "embarrassed"],
		exposed: ["holding spear", "hand on hat", "open mouth", "wavy mouth", "embarrassed", "arm across chest", "covering chest"],
		breakdown: ["crazy smile", "teeth", "pink eyes", "hand on hat", "'drooling'", "'horny'"],
		defense: ["holding spear", "hand on hat", "open mouth", "teeth", "sweat", "leaning back"],
		offense: ["holding spear", "lunging", "fire", "motion lines", "grin", "open mouth"],
		support: ["holding spear", "hand on hat", "grin", "shadowed face", "fire"],
	},
	necro: {
		a: ["knee up", "stepping on head"],
		b: ["knee up", "stepping on head", "angry", "anger vein"],
		exposed: ["knee up", "stepping on head", "angry", "anger vein", "clenched teeth", "embarrassed"],
		breakdown: ["standing", "pulling own hair", "green eyes", "'ear blush'", "'heavy blush'", "'profusely blushing'", "hair pulling", "clutching hair", "hands on own head", "headache", "'pain'",
			"bent over", "leaning forward", "knees together", "legs together", "from front", "yandere", ":o", "'horny'", "'pent-up'", "'aroused'", "sweat"],
		defense: ["angry", "anger vein", "clenched teeth", "hair flip", "wind blow"],
		offense: ["standing", "knee up", "angry", "clenched teeth", "standing on one leg"],
		support: ["standing", "legs spread", "'wide stance'", "spellcasting", ":o"],
	},
	priest: {
		a: ["smile", "hands up", "palms up"],
		b: ["smile", "blush", "hand on own cheek", "hand on own chest"],
		exposed: ["battle damage", "smile", "hands on own chest", "exhibitionism", "wavy mouth"],
		breakdown: ["happy tears", "open mouth", "smile", "blush", "trembling", "hands on own face", "'horny'"],
		defense: ["smile", "wavy mouth", "blush", "trembling", "hands on own chest"],
		offense: ["outstretched hand", "light particles", "smile"],
		support: ["praying", "own hands clasped", "light particles", "smile"],
	},
	seer: {
		a: ["looking at viewer", "hand up", "hand on hip", "'wide stance'"],
		b: ["looking at viewer", "hand on hip", "'nervous smile'", "sweatdrop", "blush"],
		exposed: ["battle damage", "sweat", "looking at viewer", "embarrassed", "open mouth", "frown", "wide-eyed", "spiral eyes", "flying sweatdrops", "arm across chest", "covering chest", "covering crotch", "knee up", "standing on one leg"],
		breakdown: ["pink eyes", "crazy smile", "tongue out", "'drooling'", "hands to own head", "'horny'", "wide-eyed", "heavy blush"],
		defense: ["surprised", "open mouth", "wide-eyed", "sweatdrop", "leaning back"],
		offense: ["pointing at viewer", "smirk", "blue fire"],
		support: ["hand up", "magic circle", "blue fire", "smug", "looking at viewer"],
	},
	vamp: {
		a: ["smile", "licking lips", "outstretched arm"],
		b: ["clenched teeth", "fangs", "glaring", "blush"],
		exposed: ["sweat", "open mouth", "looking down", "'full-face blush'", "embarrassed"],
		breakdown: ["smile", "licking lips", "crazy", "open mouth", "tongue out", "'drool'", "'drooling'", "pink eyes", "laughing", "'mind break'", "blush", "'horny'", "hands to own face", "yandere", "wide open mouth"],
		defense: ["clenched teeth", "fangs", "looking down", "narrowed eyes", "arms crossed"],
		offense: ["slash", "energy", "open mouth", "sharp teeth", "from front", "looking at viewer"],
		support: ["arm up", "arm outstretched", "open mouth", "sharp teeth", "from front"],
	},
};

//Outfit props a pose cannot hold. Negation (`!tag`) removes what the outfit injects.
const DROP = {
	necro: { breakdown: ["!black staff"], "breakdown-b": ["!black staff"] },
};

const ENTRY = { knight: ".hcKnight", lancer: ".hcLancer", necro: ".hcNecro", priest: ".hcPriest", seer: ".hcSeer", vamp: ".hcVamp" };

//Step 6: the typed shortcut. One Capitalized keyword per slot, so it collides with no booru tag and no
//existing macro (CATCH-UP, "Step 6"). Typing `.hcKnightV, default, PoseDefense` is the whole input: the CORE
//rules in cleaningDB add what every character does, the character's own entry adds how SHE does it.
//Capitalized on purpose — the engine keeps two vocabularies and this is the authoring one.
const POSE_TOKEN = { a: "PoseA", b: "PoseB", exposed: "PoseExposed", breakdown: "PoseBreakdown", "breakdown-b": "PoseBreakdownB",
	defense: "PoseDefense", "defense-b": "PoseDefenseB", offense: "PoseOffense", "offense-b": "PoseOffenseB",
	support: "PoseSupport", "support-b": "PoseSupportB", combat: "PoseCombat", "combat-b": "PoseCombatB" };

function methodFor(character, slot) {
	const own = METHOD[character][slot];
	if (own) return own;
	return METHOD[character][slot.replace(/-b$/, "")] || [];
}

//The input for one character, sex and slot, as a person would type it.
function buildInput(character, sex, slot) {
	const tagArray = [ENTRY[character] + sex, "default"]
		.concat(CORE[slot], methodFor(character, slot))
		.concat(DAMAGED_SLOTS.includes(slot) ? DAMAGE[character] : [])
		.concat(resolveSexStates(SEX[character][slot] || SEX[character][SEX_LEVEL[slot]] || [], sex))
		.concat((DROP[character] || {})[slot] || [], BACKGROUND);
	return [...new Set(tagArray)].join(", ");
}

//The same slot as a person types it once step 6's rules are in the dictionaries: pose first, so the pose tags
//land AHEAD of the character entry in the compiled prompt (Noodle, 2026-09-19: pose factors at the start).
function buildShortcutInput(character, sex, slot) {
	return POSE_TOKEN[slot] + ", " + ENTRY[character] + sex + ", default";
}

module.exports = { SLOT_ARRAY, FILE_SLOT, CORE, DAMAGE, SEX, SEX_STATES, resolveSexStates, METHOD, DROP, ENTRY, SEX_LEVEL, DAMAGED_SLOTS, BACKGROUND, POSE_TOKEN, buildInput, buildShortcutInput, methodFor };
if (require.main !== module) return;

const ROOT = path.join(__dirname, "..", "..", "..");
const ENGINE = path.join(ROOT, "scripts", "webui");
const REFS = path.join(ROOT, "!designDocs", "honeycomb", "!imageStorage", "_source", "refsPNG", "characters");
const quiet = { log() {}, info() {}, warn() {}, debug() {}, error: console.error };
const sandbox = { console: quiet, module: undefined };
vm.createContext(sandbox);
const webuiSource = fs.readFileSync(path.join(ENGINE, "webui.js"), "utf8");
const libraryList = webuiSource.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/)[1].match(/"([^"]+)"/g).map((quoted) => quoted.slice(1, -1));
for (const file of libraryList) vm.runInContext(fs.readFileSync(path.join(ENGINE, "libraries", file), "utf8"), sandbox, { filename: file });
for (const file of ["webui.js", "webui2-categories.js", "webui2.js"]) vm.runInContext(fs.readFileSync(path.join(ENGINE, file), "utf8"), sandbox, { filename: file });
vm.runInContext("v2EnsureDictionaries()", sandbox);

const tagsOf = (prompt) => prompt.split(/,\s*|\n/).map((tag) => tag.trim().replace(/^\(+|\)+$/g, "").replace(/:[\d.]+$/, "")).filter(Boolean);

//--sync [--write]: Noodle, 2026-09-14: "If I should forget or change a character keyword, please have the pose-building
//script append that keyword to the images. For instance, Severine is meant to have grey hair. I've added that to
//charactersDB." Every tag the character's entry or default outfit writes and a sidecar lacks is appended to that
//sidecar, UNLESS the pose drops it (DROP) or the engine culls it in that sidecar's framing (shoes in a cowboy shot).
//A changed keyword's OLD spelling is not removed; the dry run lists what would be appended.
if (process.argv.includes("--sync")) {
	const bare = (raw) => raw.trim().replace(/^\(+|\)+$/g, "").replace(/^'(.*)'$/, "$1").trim().toLowerCase();
	const dbLines = fs.readFileSync(path.join(ENGINE, "libraries", "charactersDB.js"), "utf8").split(/\r?\n/);
	const entryTagsFor = (code) => {
		const at = dbLines.findIndex((line) => line.startsWith(code + ";"));
		if (at < 0) return [];
		const tags = dbLines[at].slice(code.length + 1).split(/,\s*/).map((tag) => tag.trim()).slice(1);
		const outfit = dbLines.slice(at + 1).find((line) => line.startsWith("*default;") || line.startsWith("."));
		if (outfit && outfit.startsWith("*default;")) tags.push(...outfit.slice(9).split(/,\s*/).map((tag) => tag.trim()));
		return tags.filter((tag) => tag && !["female", "male"].includes(bare(tag)));
	};
	const colorArray = vm.runInContext("modifierKeywordDB.colors", sandbox).map((color) => String(color).toLowerCase());
	const slotOfFile = Object.fromEntries(Object.entries(FILE_SLOT).map(([slot, file]) => [file, slot]));
	let appended = 0;
	for (const fileName of fs.readdirSync(REFS).filter((name) => name.endsWith(".txt")).sort()) {
		const match = fileName.match(/^([a-z]+)1([CV])-(.+)\.txt$/);
		if (!match || !ENTRY[match[1]] || !slotOfFile[match[3]]) { console.log("  ? " + fileName + " (not a known character and slot)"); continue; }
		const [, character, sex, fileSlot] = match;
		const drops = ((DROP[character] || {})[slotOfFile[fileSlot]] || []).map((tag) => bare(tag.replace(/^!/, "")));
		const raw = fs.readFileSync(path.join(REFS, fileName), "utf8").trim();
		const present = new Set(raw.split(/,\s*/).map(bare));
		const additions = [];
		for (const tag of entryTagsFor(ENTRY[character] + sex)) {
			const key = bare(tag);
			if (present.has(key) || drops.includes(key)) continue;
			//A pose may recolour a part on purpose (a breakdown's pink eyes): a colour is not appended over another colour.
			const coloured = key.match(new RegExp("^(" + colorArray.join("|") + ") (.+)$"));
			if (coloured && [...present].some((have) => have !== key && have.endsWith(" " + coloured[2]) && colorArray.includes(have.slice(0, -coloured[2].length - 1)))) continue;
			//Kept only if it survives the engine in this very sidecar: a framing cull means the pose cannot show it.
			if (!tagsOf(sandbox.buildPrompt(raw + ", " + tag, "", {}).prompt).map((t) => t.toLowerCase()).includes(key)) continue;
			additions.push(tag);
		}
		if (!additions.length) continue;
		appended += additions.length;
		console.log("  " + fileName + ": + " + additions.join(", "));
		//Each keyword goes in right after the nearest tag that precedes it in the entry, since the engine keeps position
		//order inside a category and the step 3 round trip compares order. No such neighbour: it goes at the end.
		const entryOrder = entryTagsFor(ENTRY[character] + sex).map(bare);
		const tagList = raw.split(/,\s*/);
		for (const tag of additions) {
			const before = entryOrder.slice(0, entryOrder.indexOf(bare(tag))).reverse().find((key) => tagList.some((have) => bare(have) === key));
			const at = before == null ? -1 : tagList.findIndex((have) => bare(have) === before);
			if (at < 0) tagList.push(tag); else tagList.splice(at + 1, 0, tag);
		}
		if (process.argv.includes("--write")) fs.writeFileSync(path.join(REFS, fileName), tagList.join(", ") + "\n", "utf8");
	}
	console.log(appended + " tag(s) " + (process.argv.includes("--write") ? "appended" : "would be appended (add --write)"));
	process.exit(0);
}

const scoreArray = [];
const missingArray = [];
for (const character of Object.keys(ENTRY)) {
	for (const sex of ["V", "C"]) {
		for (const slot of SLOT_ARRAY) {
			const input = buildInput(character, sex, slot);
			const job = sandbox.buildPrompt(input, "", {});
			const sidecarPath = path.join(REFS, character + "1" + sex + "-" + FILE_SLOT[slot] + ".txt");
			if (fs.existsSync(sidecarPath)) {
				const want = new Set(tagsOf(sandbox.buildPrompt(fs.readFileSync(sidecarPath, "utf8").trim(), "", {}).prompt));
				const got = new Set(tagsOf(job.prompt));
				const missing = [...want].filter((tag) => !got.has(tag));
				const extra = [...got].filter((tag) => !want.has(tag));
				scoreArray.push({ name: character + "1" + sex + "-" + FILE_SLOT[slot], score: (want.size - missing.length) / want.size, missing, extra });
			} else {
				//What the entry and outfit compile to on their own is not a carry-on of the pose.
				const shortcutInput = buildShortcutInput(character, sex, slot);
				const shortcutJob = sandbox.buildPrompt(shortcutInput, "", {});
				const templateJob = sandbox.buildPrompt(input, "", {});
				const inputTags = new Set(tagsOf(input.replace(/'/g, "")).concat(tagsOf(sandbox.buildPrompt(ENTRY[character] + sex + ", default, solo, simple background, white background", "", {}).prompt)));
				const added = tagsOf(shortcutJob.prompt).filter((tag) => !inputTags.has(tag) && !/^(1girl|1boy|solo|female focus|male focus|hc-)/.test(tag));
				const templateTags = new Set(tagsOf(templateJob.prompt));
				const shortcutTags = new Set(tagsOf(shortcutJob.prompt));
				missingArray.push({ name: character + "1" + sex + "-" + FILE_SLOT[slot], input: shortcutInput, prompt: shortcutJob.prompt, added,
					templateOnly: [...templateTags].filter((tag) => !shortcutTags.has(tag)),
					shortcutOnly: [...shortcutTags].filter((tag) => !templateTags.has(tag)) });
			}
		}
	}
}

console.log("\n### Template vs existing sidecar (share of the sidecar's compiled tags reproduced)");
scoreArray.sort((a, b) => a.score - b.score).forEach((entry) => {
	console.log("  " + entry.score.toFixed(2) + "  " + entry.name.padEnd(20) + (entry.missing.length ? " missing: " + entry.missing.join(", ") : "") +
		(entry.extra.length ? " | extra: " + entry.extra.join(", ") : ""));
});
const mean = scoreArray.reduce((sum, entry) => sum + entry.score, 0) / scoreArray.length;
console.log("  mean " + mean.toFixed(3) + " over " + scoreArray.length + " sidecars; " + missingArray.length + " slots have no sidecar");

if (!process.argv.includes("--score")) {
	const lines = ["# Missing pose prompts (GENERATED by pose-templates.js; do not edit)", "",
		"Every slot with no reference sidecar, compiled from the step 6 SHORTCUT (`refs-shortcuts.js --write` puts the",
		"rules in the dictionaries). **Input** is what to type; **Prompt** is what reaches Stable Diffusion; **Engine",
		"added** lists tags neither the input nor the entry/outfit wrote (review these in step 7: a carry-on that does",
		"not fit the pose is a rule to fix or a tag to quote). **Template differs** lists where the shortcut resolved a",
		"tag differently from the step 5 template input — the insertion gate's exclusivity, or a Phase-2 tag injected in",
		"Phase 4. `refs-shortcuts.js` reports the same differences for every slot.", ""];
	for (const entry of missingArray) {
		lines.push("## " + entry.name, "", "- **Input:** `" + entry.input + "`", "- **Prompt:** `" + entry.prompt.replace(/\n/g, " ") + "`",
			"- **Engine added:** " + (entry.added.length ? entry.added.join(", ") : "nothing"));
		if (entry.templateOnly.length || entry.shortcutOnly.length) {
			lines.push("- **Template differs:** " + (entry.templateOnly.length ? "template-only: " + entry.templateOnly.join(", ") : "") +
				(entry.templateOnly.length && entry.shortcutOnly.length ? " · " : "") +
				(entry.shortcutOnly.length ? "shortcut-only: " + entry.shortcutOnly.join(", ") : ""));
		}
		lines.push("");
	}
	fs.writeFileSync(path.join(__dirname, "MISSING-PROMPTS.md"), lines.join("\n"), "utf8");
	console.log("  wrote MISSING-PROMPTS.md");
}
