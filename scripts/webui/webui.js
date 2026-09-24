// Generation variables
	// Promptsending variables
var targetIP = "http://192.168.0.2";
var targetPort = "7000";
var targetAddress = "/sdapi/v1/txt2img";
var targetFull = targetIP + ":" + targetPort + targetAddress;
var clearScreen = false;
var testing = false;
var promptMode = "single";
var promptLayout = "sorted";
var promptBoost = true;
var finalWidth = 1024;
var finalHeight = 1024;
var img2imgPreviewSize = 200;
var fileInput;
var denoising_strength;
	//Default prompt settings
// Single source of truth for settings shape. Adding a key here is all that is needed for it
// to exist on every load - loadSettingsObject() spreads saved values over these, so an option
// added after a save was written is still present instead of coming back undefined.
const settingsDefaults = {
    lastPrompt: "",
    lastNegative: "",
    lastSize: "Default",
    lastBatch: "1",
    lastStyle: "Syurofluff v7",
    lastMode: "single",   // generation mode - the modeInput selector
    lastLayout: "sorted", // output layout - the layoutInput selector
    engine: "v2"          // "v1" | "v2" | "both" - which prompt compiler sendPromptArray uses
};
// Copy, not a reference. promptSettings = promptBackup aliased them, so the first save
// mutated the defaults and there was no backup left to fall back to.
var promptSettings = Object.assign({}, settingsDefaults);

function loadSettingsObject() {
    var stored = {};
    try {
        stored = JSON.parse(localStorage.getItem("promptSettings")) || {};
    }
    catch (e) {
        console.warn("promptSettings unreadable, using defaults");
        stored = {};
    }
    return Object.assign({}, settingsDefaults, stored);
}
var universalPrompt = "uncensored, masterpiece, best quality, amazing quality, very aesthetic, absurdres, newest";
var basicNegative = "empty eyes, red eyelashes, blush stickers, whiskers, messy hair, glowing, white outline, text, japanese text, english text, comic, multiple views, sketch, sketchy, manly, masculine, masculine male, bara, pectorals, small anus, small nipples, tearing up, tanlines, clothed pov, anthro pov, anthro on anthro, furry pov, furry with furry"; //Overwritten by anything in the prompt
var universalNegative = `(glistening, greasy, shiny, shiny skin), (glistening eyes, sidelit eyes, sparkling eyes, unpolished eyes), (desaturated, unsaturated, solid blacks), (sketchy, light outline, colored outline, stray hairs, unpolished), 
lowres, realistic, worst quality, bad quality, glistening skin, glistening body, bad anatomy, jpeg artifacts, signature, watermark, old, oldest, censored, mosaic censorship, bar_censor, conjoined, patreon username, patreon logo, sketch, sketch lines, pencil sketch,
blurry, small clitoris, small anus, puckered anus, veiny tentacle, penis tentacle, veiny dildo, small insertion, blush stickers, whiskers, crotch tuft, pubic hair, yellow fluid, pee, 
messy hair, blue fluid, blue cum, older male, larger male, masculine male, muscular male, overweight male, tanlines, empty eyes, white pupils, red eyelashes, eye bags, eye wrinkles, simple background, white background, plain, boring, sfw, sweat, excessive sweat, afterimage, blur, blurry, motion blur, red penis, latex, shiny clothes, white, shiny, shiny skin, shiny anus, shiny penis, too many fingers, too many toes, 6 toes,`;
//Prompt style list
const basicStyleArray = [
	{id: "Syurofluff v7", finalStyle: "<lora:Syurofluff v7.3 128x64-000040:0.8>, syuro"},
	{id: "Syurofluff v9", finalStyle: "<lora:Syurofluff v9.2 128x64-000060:0.8>"},
	{id: "Syurofluff v9.7", finalStyle: "<lora:Syurofluff v9.7.1 128x64-000100:0.6>, (polished), rikose, syuro"},
	{id: "Insanity", finalStyle: "<lora:Insanity 128x64-000020:0.5>, <lora:Syurofluff v9.2 128x64-000060:0.5>"},
	{id: "Syuro", finalStyle: "<lora:Syuro - Noodle:1>, syuro"},
	{id: "Ahemaru", finalStyle: "<lora:ahemaru - yeetyah145:0.7> ahemaru, (henriiku \(ahemaru\))"},
	{id: "Oreteki18kin", finalStyle: "<lora:Syurofluff v9.7.1 128x64-000100:0.4>, (polished), oreteki18kin \(kechin\), rikose, asanagi, syuro"},
	{id: "Amazon", finalStyle: "<lora:Amazon - RMFAN:1> taitara"},
	{id: "Fisticuffs", finalStyle: "<lora:fisticuffs club - rocko20:1> fisticuffs club style"},
	{id: "Hard Degenerate", finalStyle: "<lora:hard-degenerate - faminto:1> degenerado, hard degenerate"},
	{id: "Honeycomb", finalStyle: "<lora:Honeycomb v1c-000040:1>, (polished), oreteki18kin \(kechin\), rikose, asanagi, syuro"},
	{id: "None", finalStyle: ""},
];
//Prompt size list
const basicImageSizes = [
    {id: "Default", height: 1024, width: 1024},
    {id: "Semi-Tall", height: 1152, width: 896},
    {id: "Portrait", height: 1216, width: 832},
    {id: "Vertical", height: 1408, width: 704},
    {id: "Semi-Wide", height: 896, width: 1152},
    {id: "Landscape", height: 832, width: 1216},
    {id: "Horizontal", height: 704, width: 1408},
    {id: "Multiple", height: 1024, width: 1024},
];
// ---- PROMPT-SIDE OVERRIDES FOR THE TWO DROPDOWNS --------------------------
// A bare tag in the prompt sets the size or the style selector for that job.
// The match is WHOLE TAG and case-insensitive, so `square jaw` is a jaw and
// only a lone `square` is an aspect ratio. Every `id` in the two arrays above
// already matches itself and needs no row here — these are the extra spellings.
//
// Both tables are meant to be EDITED. Adding a spelling is one line; removing a
// word that collides with a tag you actually want to write is deleting one.
//
// KNOWN COLLISIONS, included deliberately because they are the words that were
// asked for. Each of these is also a real tag somewhere:
//   `landscape`     scenery, and a live member of singletonKeywordDB
//   `portrait`      framing, and what cleaningDB's `Penis chart` rule emits
//   `vertical` / `horizontal`   both appear in sceneDB and bodyKeywordDB lines
//   `syuro`, `ahemaru`, `oreteki18kin`   real artist tags, and all three are
//                   already inside the finalStyle strings above
// The escape hatch is Rule 2b: a tag in DOUBLE QUOTES is literal, so `"landscape"`
// stays a scenery tag and never touches the dropdown.
//
// Size is read before style, so an alias listed in both would be read as a size.
//
// Every id matches ITSELF as well, except the ones listed here. `Default` is the
// name of every character's default outfit and `Syuro` is a trigger word that
// three of the styles above already append — both were being eaten as directives
// the moment ids started self-matching, and the test suite caught both. A word
// blocked here is only blocked as an ID: give it an alias row and it works again.
const basicKeywordBlockedArray = ["default", "syuro"];
const basicSizeKeywordArray = [
	["square", "Default"],
	["1:1", "Default"],
	["semitall", "Semi-Tall"],
	["semi tall", "Semi-Tall"],
	["7:9", "Semi-Tall"],
	["portrait", "Portrait"],
	["2:3", "Portrait"],
	["1:2", "Vertical"],
	["semiwide", "Semi-Wide"],
	["semi wide", "Semi-Wide"],
	["9:7", "Semi-Wide"],
	["landscape", "Landscape"],
	["wide", "Landscape"],
	["3:2", "Landscape"],
	["2:1", "Horizontal"],
	["all sizes", "Multiple"],
	["every size", "Multiple"],
];
const basicStyleKeywordArray = [
	["syurofluff", "Syurofluff v9.7"],
	["syurofluff v9.7", "Syurofluff v9.7"],
	["v9.7", "Syurofluff v9.7"],
	["9.7", "Syurofluff v9.7"],
	["v9", "Syurofluff v9"],
	["v7", "Syurofluff v7"],
	["oreteki", "Oreteki18kin"],
	["oreteki18kin", "Oreteki18kin"],
	["fisticuffs club", "Fisticuffs"],
	["degenerate", "Hard Degenerate"],
	["nostyle", "None"],
	["no style", "None"],
	// The ARTIST names each LoRA reproduces. Left off by default because they are
	// real booru tags first and a style request second — `taitara` in particular
	// is used as a plain tag in the test suite, and every one of these is already
	// inside its own finalStyle string, so the style adds them back anyway.
	// Uncomment a line to make typing that artist pick the style.
	//["kechin", "Oreteki18kin"],
	//["henriiku", "Ahemaru"],
	//["taitara", "Amazon"],
	//["rmfan", "Amazon"],
	//["rocko", "Fisticuffs"],
	//["degenerado", "Hard Degenerate"],
	//["faminto", "Hard Degenerate"],
];
// Simple shortcut array
// Display name -> SYRUP STEM. The stem names a fur/fleshy PAIR rather than an
// entry, and replaceBasicShortcuts picks the form: `.fur` by default, `.fleshy`
// when `not furry` is in the prompt.
//
// This used to map straight to `.furMayor` and then string-replace `.fur` with
// `.syrup`, which worked only while `.syrup` meant "the human one". Since the
// 2026-08-15 charactersDB reorganisation it means "either one", so the old swap
// would have pointed at entries that no longer exist. See webui2.js's
// `resolveSyrupVariant` — v2 does the same job at its own layer.
var basicShortcutArray = [
	["angelica", ".syrupMayor"],
	["bluebell", ".syrupShop"],
	["cayenne", ".syrupCarp"],
	["garnet", ".syrupFoxF"],
	["jasper", ".syrupFoxM"],
	["sorbet", ".syrupWolf"],
	["wilf", ".syrupWilf"],
	["sharly", ".syrupSado"],
	["sado", ".syrupSado"],
	["silf", ".syrupSilf"],
	["mary-lou", ".syrupMilf"],
	["mary lou", ".syrupMilf"],
	["khanna", ".syrupNun"],
	["marlow", ".syrupMesu"],
	["riley", ".syrupFash"],
	["fash", ".syrupSado"],
	["helena", ".syrupHyena"],
	["nutmeg", ".syrupDoe"],
	["cinnamon", ".syrupMommy"],
	["deity", ".syrupDeity"],
	["succabus", ".syrupSuccabus"],
	["lamy", ".syrupHiero"],
    //disabled until better name is found
	//["shee", ".syrupShee"],
	//["caprine", ".syrupCaprine"],

	// Role names. Moved here from aliasDB's aliasArray on 2026-08-17 — they were
	// the last three display names that only worked through it, so without them
	// retiring that array would have been a silent regression.
	["carpenter", ".syrupCarp"],
	["sadogato", ".syrupSado"],
	["fashionista", ".syrupFash"],

	// Forcing a form, bypassing the stem. Also from aliasArray. `.furCarp` is
	// directly typeable, so these are spelling conveniences rather than syntax.
	["furcarpenter", ".furCarp"],
	["fursadogato", ".furSado"],
	["furfashionista", ".furFash"],
	["furhelena", ".furHyena"],
	["fleshycarpenter", ".fleshyCarp"],
	["fleshysadogato", ".fleshySado"],
	["fleshyfashionista", ".fleshyFash"],
	["fleshyhelena", ".fleshyHyena"],
]
// basicNegativeArray MOVED to libraries/negativeDB.js on 2026-08-07 and is
// GENERATED there from cleanedNegativeArray, so both engines read one source.
// Do not redeclare it here: the libraries load before this file, so a var here
// would silently clobber the real one.
	// Genital shortcut array
var genitalSizeTags = ["small ", "large ", "huge ", "hyper ", "big ", "medium ", ""];
var genitalColorTags = ["glowing ", "light ", "white ", "grey ", "black ", "dark ", "maroon ", "pink ", "red ", "orange ", "brown ", "tan ", "yellow ", "lime ", "green ", "teal ", "aqua ", "blue ", "periwinkle ", "purple ", "violet ", "rainbow ", "gold ", "silver ", "bronze ", "copper ", "metal ", "steel ", ""]
var genitalVariantTags = ["light ", "dark ", ""]
var genitalShortcutArray = [ //Automatically appends capitalized colors and sizes
	["Foreskin", "humanoid penis, foreskin", "penis"],
	["Glans", "humanoid penis, glans", "penis"],
	["Canine", "canine penis, knot", "penis"],
	["Equine", "equine penis, medial ring", "penis"],
	["Cetacean", "cetacean penis, tapering penis", "penis"],
	["Porcine", "porcine penis, spiral penis, tapering penis", "penis"],
	["Feline", "feline penis, barbed penis, barbed glans, tapering penis", "penis"],
	["Saggy", "saggy balls", "balls"],
	["Veiny", "veiny balls", "balls"],
	["Clenched", "clenched balls, veiny balls, throbbing balls", "balls"],
	["Peach", "peach pussy, cleft of venus, fat mons", "pussy"],
	["Pussy", "clitoris, clitoral hood, cleft of venus", "pussy"],
];
	// Keyword database variables
var librariesList = [
	"aliasDB.js", 
	"brandsDB2.js",
	"charactersDB.js",
	"charactersDB2.js",   // the import. Loaded after, and outranked by, the above.
	"bodyKeywordDB.js",
	"clothingKeywordDB.js",
	"sceneDB.js",
    "backgroundDB.js",
	"modifierKeywordDB.js",
	"singletonKeywordDB.js",
	"cleaningDB.js",
	"defaultDB.js",
	"negativeDB.js",
	"cullDB.js",
];
let finalKeywordSet = null;
var cleanedCharacterArray = [];
var cleanedOutfitArray = [];
var outfitTypesList = [];
var cleanedAliasArray = [];
var rulesArrayInitial = [];
var rulesArrayFinal = [];

// Generation scene startup
function generatetxt2img() {
    // Load autosave
	promptSettings = loadSettingsObject();
	// Build keyword sets. LITE: body and clothes members are not generated, because
	// v2 is the default engine and answers those two by taking a tag apart. The v1
	// path calls ensureFullKeywordSets() and pays for them only if it is used.
	buildFinalKeywordSets("lite")
    generateSceneCategorySet();
    generateBackgroundCategorySet();
	// Build character database
	cleanupCharacterArray();
	cleanupBrandArray();
	cleanupAliasArray();
	establishRules(cleaningArrayInitial, "initial");
	establishRules(cleaningArrayFinal, "final");
    cleanupNamesArray();
	// Build scene
	buildGenerationScene();
    writeText("No, the generate button will not work on your end, it's not a bug, it's just only set up on my machine for my LAN network.");
    writeHTML(`finish`);
    // Everything past this point binds state to DOM nodes, so it has to run after
    // the LAST thing that writes to `output`. writeHTML('finish') ends up in
    // writeFunction, which does `output.innerHTML +=` - that reserializes the
    // whole area and hands back fresh nodes. A serialized <select> carries its
    // markup, never the `.value` assigned from script, and a fresh node carries
    // no listeners. Binding above this line is why the three selectors came back
    // as their first option on every refresh, and why the img2img preview never
    // drew.
	//Add event handler for img2img upload button
    setupInitImageHandler();
	// Check for last prompt settings/load default values
	loadPromptSettings();
}

// Generate prompt
async function sendPromptArray(prompt, negative, size, batch, style) {
    // Clean booru/txt dirt once, on the raw input, and write the result back into the
    // textareas. The messy pasted version is never wanted again, and copying the cleaned
    // text back by hand was the annoying part.
    var cleanedPrompt = checkForDirt(prompt);
    if (cleanedPrompt != prompt) {
        prompt = cleanedPrompt;
        document.getElementById('promptInput').value = prompt;
    }
    // Only adopt a harvested negative when the box is empty, so a curated one is never lost
    if (extractedNegative != "" && negative.trim() == "") {
        negative = extractedNegative;
        document.getElementById('negativeInput').value = negative;
    }

	// Autosave prompt
	savePromptSettings(prompt, negative, size, batch, style);

    // ---- THE PROMPT SEED — Phase 0 (SKYBOXES.md D·4) ----------------------
    // Hashed here and nowhere else, for two reasons that both need this exact
    // spot:
    //
    //   AFTER checkForDirt, because the cleaned text is what gets written back
    //   into the textarea. Hashing the messy pasted version would mean the
    //   prompt on screen no longer reproduces the image it made.
    //
    //   BEFORE assemblePrompt, because that is what splits a combo block into
    //   one job per image. One hash of the whole block gives every job in the
    //   run the same value, which is what makes a combo sequence share its
    //   background details. Hashing each job's own text instead would change
    //   the furniture from shot to shot.
    //
    // v1 ignores it entirely. Nothing here changes what v1 sends.
    promptRunSeed = (typeof v2HashString === "function") ? v2HashString(prompt) : 0;

    promptArray = assemblePrompt(prompt, promptMode);

    // Check for img2img
	if (checkGenType() == "img2img") {
		targetAddress = "/sdapi/v1/img2img";
		fileInput = document.getElementById('initImage');
        denoising_strength = parseInt(document.getElementById('denoiseInput').value);
		if (denoising_strength >= 1) {
            if (denoising_strength > 10) {
                denoising_strength = denoising_strength / 10;
            };
            denoising_strength = denoising_strength / 10;
        }
	}
	else {
		targetAddress = "/sdapi/v1/txt2img";
	}
	targetFull = targetIP + ":" + targetPort + targetAddress;
	
	// Clear result div
	clearResult();

    // ---- THE DISCORD BRIDGE'S GPU CLAIM -----------------------------------
    // Tells the bridge the GPU is spoken for, so it holds its queue rather than
    // dispatching on top of this run. Forge's /progress says a job is running but
    // never says whose, so without this the bridge can only infer it from a poll
    // ten seconds late - and if it dispatches in that window, Forge queues both
    // internally where neither can be inspected or reordered.
    //
    // Everything about it is optional. bridgeClaim() swallows its own errors, so
    // with no bridge running, the wrong port, or no network at all, this is two
    // failed fetches and generation proceeds exactly as it always did.
    await bridgeClaim("claim");
    try {
        for (var promptCounter = 0; promptCounter < promptArray.length; promptCounter++) {
            // A size keyword in the prompt has to be read HERE as well as inside
            // sendPrompt, because this is where "Multiple" fans one job out over
            // seven aspect ratios. Without it, a prompt that says `portrait` and
            // a dropdown that says Multiple send the same picture seven times.
            //
            // Read per job, not once for the block: in `multiple` mode each line
            // is its own prompt and gets to name its own size.
            var jobSize = size;
            if (typeof v2ScanDispatchKeywords === "function") {
                var jobOverride = v2ScanDispatchKeywords(promptArray[promptCounter]).size;
                if (jobOverride) { jobSize = jobOverride; }
            }
            if (jobSize ==  "Multiple") {
                for (var sizeIndex = 0; sizeIndex < basicImageSizes.length-1; sizeIndex++) {
                    await sendPrompt(promptArray[promptCounter], negative, basicImageSizes[sizeIndex].id, batch, style);
                }
            }
            else {
                await sendPrompt(promptArray[promptCounter], negative, jobSize, batch, style);
            }
        }
    }
    finally {
        // finally, not after the loop: sendPrompt returns early on a v2 compile
        // error and on the "both" comparison path, and a throw anywhere inside
        // would otherwise leave the claim held until it expired on its own.
        await bridgeClaim("release");
    }
}

// A bare GET so no CORS preflight is involved - the page is often opened from
// file://, where an Origin of null plus a JSON content-type would need one. The
// bridge answers with Access-Control-Allow-Origin: *.
//
// The claim expires on the bridge's side as well, so a tab closed mid-generation
// unblocks the queue by itself rather than wedging it.
var bridgeClaimURL = "http://127.0.0.1:7799";
async function bridgeClaim(action) {
    if (typeof fetch !== "function" || !bridgeClaimURL) { return; }
    try {
        await fetch(bridgeClaimURL + "/" + action, {
            method: "GET",
            mode: "cors",
            cache: "no-store",
            // Two seconds. This sits in front of every generation, so a bridge
            // that is not running must cost a moment rather than a wait.
            signal: (typeof AbortSignal !== "undefined" && AbortSignal.timeout)
                        ? AbortSignal.timeout(2000) : undefined
        });
    }
    catch (err) {
        // No bridge, or it is down. Not an error - the browser client works on
        // its own and always has.
    }
}

var print_promptInfo = true;
var promptBoosted = [];
// Set once per RUN by sendPromptArray, read by every job in it. Declared here
// rather than inside that function so a direct sendPrompt call still finds a
// defined value — 0 means "nobody hashed anything", and buildPrompt falls back
// to hashing its own input.
var promptRunSeed = 0;
function promptInfo(prompt) {
    if (print_promptInfo == true) {
        console.info(prompt);
    }
}
async function sendPrompt(prompt, negative, size, batch, style) {
    // The prompt exactly as typed, captured before anything at all has run —
    // triggers included, so what lands in the image footer is a string that can
    // be pasted straight back in and reproduce this generation.
    var originalInput = String(prompt == null ? "" : prompt);

    // ---- REGIONAL PROMPTER TRIGGER ---------------------------------------
    // Read and stripped here, off the raw input, so `rp` never becomes a tag.
    // v1 emits a single flat line and has no regions to divide, so the trigger
    // only means anything on the v2 path.
    var regionalRun = { active: false };
    if (typeof extractRegionalTrigger === "function") {
        var regionalTrigger = extractRegionalTrigger(prompt);
        prompt = regionalTrigger.prompt;
        if (regionalTrigger.error) {
            // Fatal for the same reason a v2 compile error is: a layout that fell
            // back to equal regions would produce a picture that looks almost
            // right, and that is the hardest kind of wrong to spot.
            console.error("Regional Prompter: " + regionalTrigger.error);
            return;
        }
        if (regionalTrigger.active && promptSettings.engine == "v2") {
            regionalRun = regionalTrigger;
        }
        else if (regionalTrigger.active) {
            console.warn("Regional Prompter: ignored, it needs engine v2 (currently " + promptSettings.engine + ").");
        }
    }

    // ---- ENGINE BRANCH ---------------------------------------------------
    // promptSettings.engine is "v1" (the default), "v2", or "both".
    //
    // v2 is buildPrompt() in webui2.js and it returns a FINISHED string: the
    // LoRA references and universalNegative are already inside it. Nothing
    // below may add either again, which is why the v2 path skips the whole v1
    // block rather than sharing any of it.
    var v2Job = null;
    if (promptSettings.engine == "v2" || promptSettings.engine == "both") {
        // A COPY carrying the run seed. promptSettings is persisted to
        // localStorage, and a per-run value has no business being saved and
        // restored — it would read as a setting the user had chosen.
        var v2Settings = Object.assign({}, promptSettings);
        if (promptRunSeed) { v2Settings.promptSeed = promptRunSeed; }
        v2Job = buildPrompt(prompt, negative, v2Settings);
        logV2Summary(v2Job);
        if (v2Job.errors.length > 0) {
            // Unbalanced parens, a bad scope. Fatal on purpose - a broken prompt
            // is worth more as an error message than as an image.
            console.error("v2 did not compile:", v2Job.errors);
            displayV2Prompt(v2Job, "v2 — did not compile, nothing sent");
            return;
        }
    }

    if (promptSettings.engine == "v2") {
        prompt = v2Job.training ? v2Job.contracted : v2Job.prompt;
        negative = v2Job.negative;
        // No label: on its own this is just "the prompt", and saying "v2:" over
        // it is noise. The comparison view below still labels both.
        displayV2Prompt(v2Job, "");
    }
    else {
    // The v1 pipeline, unchanged. It is deliberately NOT re-indented inside this
    // else: a 150-line reindent would bury the handful of lines that actually
    // changed, and this is the file that has to stay reviewable.

    // Prompt comma and parenthesis normalization
    promptInfo("Pre-normalization: " + prompt);
    promptInfo("Now checking for dirt");
    prompt = checkForDirt(prompt);
    // A size or style keyword is a DIRECTIVE, not a tag, and v1 has no record
    // stream to consume it in — so it comes out of the text here. v2 does the
    // same job properly, on records, in Phase 1.
    if (typeof v2ScanDispatchKeywords === "function") {
        prompt = v2ScanDispatchKeywords(prompt).kept;
    }
    promptInfo("Now normalizing spacing");
    // Before normalizeSpacing, never after — it ends by writing paren sentinels
    // that are themselves made of underscores. See stripInputUnderscores.
    prompt = stripInputUnderscores(prompt);
    prompt = normalizeSpacing(prompt);
    negative = normalizeSpacing(negative);

    promptInfo("Checking for wildcards");
    prompt = replaceWildcards(prompt);

    promptInfo("Now normalizing parenthesis");
    prompt = normalizeParenthesis(prompt);
    negative = normalizeParenthesis(negative);
    var startingPrompt = prompt;

    promptBoosted = extractParenthesis(prompt);
    var rawBoostedKeywords = "";
    if (promptBoosted) {
        if (promptBoosted.length > 0) {
            for (var promptCounter = 0; promptCounter < promptBoosted.length; promptCounter++) {
                prompt = prompt.replace(promptBoosted[promptCounter], "");
                var splitBoosted = promptBoosted[promptCounter].split(", ");
                for (var splitCounter = 0; splitCounter < splitBoosted.length; splitCounter++) {
                    rawBoostedKeywords += splitBoosted[splitCounter] + ", ";
                }
            }
            // Shield the escaped disambiguation parens ("frieren \(sousou no frieren\)")
            // before stripping the bare emphasis parens, or the "(" inside "\(" is eaten
            // and leaves an orphaned backslash behind.
            prompt = protectParens(prompt);
            prompt = prompt.replaceAll("(", "");
            prompt = prompt.replaceAll(")", "");
            prompt = restoreParens(prompt);
        }
    }
    var splitBoostedKeywords = rawBoostedKeywords.split(", ");
    for (var splitCounter = 0; splitCounter < splitBoostedKeywords.length; splitCounter++) {
        prompt = prompt += ", " + splitBoostedKeywords[splitCounter];
    }

    // Prompt subitem color normalization
    promptInfo("Pre-color normalization: " + prompt);
    prompt = normalizeSubitemKeywords(prompt, clothesKeywordDB, modifierKeywordDB);
    prompt = normalizeSubitemKeywords(prompt, bodyKeywordDB, modifierKeywordDB);
    prompt = removeDuplicates(prompt);

    // Prompt initial cleaning
    promptInfo("Pre-cleanup: " + prompt);
    prompt = replaceInitialCleanup(prompt);
    prompt = replaceCleanup(prompt, negative, rulesArrayInitial);

    // Prompt full category replacements
    promptInfo("Pre-replacements: "+prompt);
    var culled = "";
    prompt = replaceTargetCategories(prompt)[0];
    promptInfo("Replacement culled: "+culled);

    // Prompt alias replacement
    promptInfo("Pre-alias replacements: "+prompt);
    prompt = replaceAliasShortcuts(prompt);

    // Prompt character shortcuts
    promptInfo("Pre-basic replacements: "+prompt);
    prompt = replaceBasicShortcuts(prompt);

    // Prompt character and outfit replacement
    promptInfo("Pre-character replacements: "+prompt);
    prompt = replaceCharacterShortcuts(prompt);

    // Prompt genital shortcut unpacking (Huge Foreskin -> huge penis, humanoid penis, foreskin)
    promptInfo("Pre-genital replacements: "+prompt);
    prompt = replaceGenitalShortcuts(prompt);

    // Prompt Alias replacement
    promptInfo("Pre-alias replacements: "+prompt);
    prompt = replaceAliasCleanup(prompt);

    promptInfo("Pre-defaults: "+prompt);
    prompt = promptDefaults(prompt, negative);
    // Prompt keyword sorting by category
    promptInfo("Pre-category sorting: "+prompt);
    prompt = sortPromptByCategory(prompt);
    // Prompt keyword sorting by item
    promptInfo("Pre-item sorting: "+prompt);
    // Prompt inclusion protection (specifying what areas not to cull)
    // Prompt culling
    promptInfo("Pre-culling: "+prompt);
    culled += removeDuplicates(", " + cullTargetCategories(prompt)[1]);
    culled = normalizeSpacing(culled);

    culled = culled.split(", ");
    prompt = prompt.split(", ");
    prompt = prompt.filter(word => !culled.includes(word));
    culled = culled.join(", ");
    prompt = prompt.join(", ");

    promptInfo("Culled: "+culled);

    // Unculling rules
    var promptCulled = uncullTargetCategories(prompt, culled);
    prompt = promptCulled[0];
    culled = promptCulled[1];
    promptInfo("Culled: "+culled);
    
    // Negative cleanup
    var negativeCleaned = negativeCleanup(negative, prompt)
    prompt = negativeCleaned[1];
    negative = negativeCleaned[0];
    // Prompt cull by negative
    
    // Prompt final error correction
    //promptInfo(prompt);
    prompt = replaceCleanup(prompt, negative, rulesArrayFinal);
    for (var splitCounter = 0; splitCounter < splitBoostedKeywords.length; splitCounter++) {
        prompt = prompt.replace(splitBoostedKeywords[splitCounter], "");
    }
    startingPrompt = startingPrompt.split(", ");
    for (var weakIndex = 0; weakIndex < startingPrompt.length; weakIndex++) {
        if (!prompt.includes(startingPrompt[weakIndex])) {
            culled += ", " + startingPrompt[weakIndex];
        }
    }
    

    //Display full sorted prompt in display area
    var parts = prompt.split(", ");
    for (partsIndex = 0; partsIndex < parts.length; partsIndex++) {
        for (weakIndex = 0; weakIndex < weakKeywordsArray.length; weakIndex++) {
            if (parts[partsIndex] == weakKeywordsArray[weakIndex]) {
                console.info("test")
                promptBoosted.push(parts[partsIndex]);
                prompt = prompt.replace(parts[partsIndex], "");
            }   
        }
    }

    displayPrompt(prompt, culled, startingPrompt);

    if (promptBoosted) {
        if (promptBoosted.length > 0) {
            for (var promptCounter = 0; promptCounter < promptBoosted.length; promptCounter++) {
                prompt = "(" + promptBoosted[promptCounter] + "), " + prompt;
            }
        }
    }
    
    promptInfo("Post-culling: "+prompt);
    prompt = restoreParens(prompt);
    //promptInfo(prompt);
    }
    // ---- end of the v1 pipeline ------------------------------------------

    // "both" is the differ: run each engine, show them side by side, and never
    // generate. Seeing what changed is the entire point, and an image would only
    // cost time and confuse which prompt produced it.
    if (promptSettings.engine == "both") {
        displayV2Prompt({ prompt: restoreParens(prompt), trace: {}, errors: [] }, "v1");
        displayV2Prompt(v2Job, "v2");
        console.info("v1:", restoreParens(prompt));
        console.info("v2:", v2Job.prompt);
        return;
    }

    // ---- PROMPT-SIDE SIZE / STYLE OVERRIDE -------------------------------
    // A bare `portrait` or `oreteki` in the prompt beats whatever the two
    // dropdowns say, for this job only. The keyword itself never reaches the
    // model: v2 consumed it in Phase 1 and reported it on the job, and the v1
    // path stripped it out of the text above.
    //
    // The job is preferred over the scan where both answer, because the job's
    // reading came off real records — `(portrait)` and `"portrait"` mean
    // different things and only the tokenizer knows which is which.
    var dispatchOverride = (typeof v2ScanDispatchKeywords === "function")
                               ? v2ScanDispatchKeywords(originalInput)
                               : { size: null, style: null };
    if (v2Job && v2Job.size)  { dispatchOverride.size  = v2Job.size; }
    if (v2Job && v2Job.style) { dispatchOverride.style = v2Job.style; }
    // "Multiple" is not a size, it is a fan-out, and sendPromptArray has already
    // acted on it by calling this seven times with a real size each time. Letting
    // it through here would overwrite all seven with the 1024x1024 placeholder row.
    if (dispatchOverride.size == "Multiple") { dispatchOverride.size = null; }
    if (dispatchOverride.size)  { size  = dispatchOverride.size; }
    if (dispatchOverride.style) { style = dispatchOverride.style; }

    // Image size logic
    if (size && checkGenType() == "txt2img") {
        for (i = 0; i < basicImageSizes.length; i++) {
            if (basicImageSizes[i].id == size) {
                finalWidth = basicImageSizes[i].width;
                finalHeight = basicImageSizes[i].height;
            }
        }
    }
    // Image style logic
    let finalStyle = "";
    if (style) {
        for (i = 0; i < basicStyleArray.length; i++) {
            if (basicStyleArray[i].id == style) {
                finalStyle = basicStyleArray[i].finalStyle;
            }
        }
    }
    let finalBatchCount = Math.max(1, Math.min(parseInt(batch) || 1, 4));

    // Image generation loop
    // removeDuplicates splits on ", ", which does not match the ",\n" the v2
    // renderer joins its lines with — so today the newline-adjacent tags fuse
    // into one token and survive by accident. Once those separators become
    // " BREAK " the split starts matching normally, and the first casualty is the
    // `1girl` that v2PerFigureCounts deliberately gives to every subject.
    if (!regionalRun.active) {
        prompt = removeDuplicates(prompt);
    }
    if (testing != true) {
        // Image-by-image loop
        console.info("Generating image with prompt \"" + prompt + "\" and negative prompt \"" + negative + "\".");
        for (let i = 0; i < finalBatchCount; i++) {
            const progressBar = document.createElement('div');
            progressBar.style = `
                width: 100%;
                height: 10px;
                background: #444;
                margin: 10px 0;
                position: relative;
                overflow: hidden;
            `;
            const innerBar = document.createElement('div');
            innerBar.style = `
                height: 100%;
                width: 0%;
                background: lime;
                transition: width 0.2s linear;
            `;
            progressBar.appendChild(innerBar);
            document.getElementById('resultArea').appendChild(progressBar);
            // The style and universal tags describe the image, not whoever sorts
            // last, so in regional mode they are handed to the adapter to place in
            // the common block rather than concatenated onto the final region.
            var commonExtra = finalStyle + ", " + universalPrompt;
            var finalPrompt = prompt + ", " + commonExtra;
            var regional = null;
            if (regionalRun.active) {
                regional = buildRegionalRequest(prompt, commonExtra, v2Job, regionalRun);
                if (regional && regional.abort) { return; }
                if (regional) { finalPrompt = regional.prompt; }
                else { console.warn("Regional Prompter: only one region in this prompt, sending it normally."); }
            }
            var request = {
                prompt: finalPrompt,
                // universalNegative is already appended inside negativeCleanup, where it also
                // gets filtered against the prompt. Appending it again here double-weighted it.
                negative_prompt: negative,
                steps: 30,
                sampler_name: "DPM++ 2M SDE",
                cfg_scale: 5,
                width: finalWidth,
                height: finalHeight,
                seed: -1,
                batch_size: 1,
                save_images: true
            };
            if (regional) {
                request.alwayson_scripts = { "Regional Prompter": { args: regional.args } };
            }
            // The clean prompt is worth recording whether or not regions were
            // used — it is the same string either way when they were not.
            if (typeof promptNotesEntry === "function") {
                var notes = promptNotesEntry(
                    originalInput,
                    buildCleanPrompt(prompt, commonExtra),
                    ""
                );
                if (notes) {
                    request.alwayson_scripts = request.alwayson_scripts || {};
                    request.alwayson_scripts[notes.name] = { args: notes.args };
                }
            }
            const promptDisplay = document.createElement('p');
            promptDisplay.textContent = finalPrompt;
            // "Last prompt", singular. This used to appendChild onto whatever was
            // already there, so a session's worth of full prompts piled up inside
            // a collapsed box and never came back out.
            const fullPromptBox = document.getElementById('fullPrompt');
            fullPromptBox.innerHTML = "";
            fullPromptBox.appendChild(promptDisplay);
            if (checkGenType() == "img2img") {
                var base64Img = await getBase64(fileInput.files[0]);
                request.init_images = [base64Img];
                request.denoising_strength = denoising_strength;
            }
            console.info(request);
            try {
                var response = await fetch(targetFull, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(request)
                });

                const data = await response.json();
                stopPolling = true;
                innerBar.style.width = "100%";
                if (data.images && data.images.length > 0) {
                    if (clearScreen == true) {
                        clearResult();
                    }
                    data.images.forEach((b64, idx) => {
                        const img = document.createElement('img');
                        img.src = "data:image/png;base64," + b64;
                        img.className = "generatedImage";
                        img.style = "max-width: 100%; margin-top: 10px;";
                        document.getElementById('resultArea').appendChild(img);
                    });
                    pruneOldImages();

                    if (data.info) {
                        const info = JSON.parse(data.info);
                        const filenames = info.filenames || [];
                        filenames.forEach(name => {
                            const p = document.createElement('p');
                            p.textContent = `Saved as: ${name}`;
                            p.style.color = "#aaa";
                            document.getElementById('resultArea').appendChild(p);
                        });
                    }
                } else {
                    const error = document.createElement('p');
                    error.textContent = "No image returned.";
                    error.style.color = "red";
                    document.getElementById('resultArea').appendChild(error);
                }

            } catch (err) {
                innerBar.style.background = "red";
                const error = document.createElement('p');
                error.textContent = "Error: " + err.message;
                error.style.color = "red";
                document.getElementById('resultArea').appendChild(error);
            }
        }
    }
}

// Finds the next `<keyword>(` at or after `from`, tolerating whitespace between
// the name and the paren. `random (male)` is how people actually type it, and
// without this it survives every phase and comes out as literal text in the
// prompt, which reads as the engine being broken.
// Returns { index, length } where length spans the name, the spaces AND the
// opening paren, so callers can seek straight to the first tag.
function findCommand(text, keyword, from) {
    const opener = new RegExp(keyword + "\\s*\\(", "g");
    opener.lastIndex = Math.max(0, from);
    const match = opener.exec(text);
    return match ? { index: match.index, length: match[0].length } : null;
}

function replaceWildcards(prompt) {
    //1. Random character
    // The specific commands we want to look for
    const simpleKeywordAliases = [
        ["female", "1girl"],
        ["male", "1boy, cute boy, femboy"],
        ["boy", "cute boy, femboy"],
        ["fem", "female, 1girl, furry female"],
        ["masc", "male, 1boy, furry male"],
        ["anygirl", "female, 1girl, furry female"],
        ["anyboy", "male, 1boy, furry male"],
        ["tan", "tan skin, tanlines, dark skin, dark-skinned female, brown skin, very dark skin"],
        ["milf", "plump, mature female, chubby"],
    ]
    // Longest first, so `random` never eats the head of `randomChar`. The opening
    // paren is matched separately rather than being part of the name, because a
    // space between the two is a spelling of the same command — see findCommand.
    const keywords = ['randomCharacter', 'randomChar', 'random'];
    // Fixed: changed from promptString to prompt to match the parameter
    let result = prompt;
    let replaceOld = false;
    let suffixHelper = "";

    // Check for each keyword variant
    for (const keyword of keywords) {
        let startIndex = 0;
        let command;

        // Keep looking as long as the keyword is found
        while ((command = findCommand(result, keyword, startIndex)) !== null) {
            startIndex = command.index;
            let openParens = 1;
            let endIndex = -1;

            // Start parsing character-by-character immediately after the keyword
            // and whatever whitespace was written between it and the paren.
            for (let i = startIndex + command.length; i < result.length; i++) {
                // Skip escaped characters
                if (result[i] === '\\') {
                    i++; 
                    continue;
                }
                
                if (result[i] === '(') openParens++;
                if (result[i] === ')') openParens--;

                // When we hit 0, we've found the matching closing parenthesis
                if (openParens === 0) {
                    endIndex = i;
                    break;
                }
            }

            // If we successfully found the closing parenthesis
            if (endIndex !== -1) {
                // Extract the tags string inside the parentheses
                const tagsString = result.substring(startIndex + command.length, endIndex);

                // Clean up the required tags.
                //
                // BOTH SIDES ARE UNESCAPED before they are compared. This runs in
                // text space, where a name's parens are written `\(fate\)`, but
                // the character array holds v1's escaped form too — so a match
                // used to require the two spellings to agree, and typing
                // `random(fate (series))` the natural way silently found nothing
                // and left the whole command in the prompt as a literal tag.
                // Invisible while the databases were 508 hand-written characters
                // with barely a paren between them; the animadex import made it
                // 22,273 characters whose franchise tag is parenthesised.
                const bare = (t) => t.replace(/\\([()])/g, "$1").trim().toLowerCase();
                const requiredTags = tagsString.split(',').map(bare);

                // Filter the LIVE character array (Make sure cleanedCharacterArray is accessible in this scope)
                const validCharacters = cleanedCharacterArray.filter(char => {
                    // Clean the character's prompt string, unescaped to match
                    const charTags = String(char.prompt || "").split(',').map(bare);
                    
                    // Ensure EVERY required tag (or its alias) is present
                    return requiredTags.every(rt => {
                        // Check if this required tag has an entry in our alias list
                        const aliasMapping = simpleKeywordAliases.find(aliasRow => aliasRow[0] === rt);
                        
                        if (aliasMapping) {
                            // Split the comma-separated aliases into an array
                            const validOptions = aliasMapping[1].split(',').map(a => a.trim().toLowerCase());
                            
                            // Include the original tag itself just to be safe
                            validOptions.push(rt);
                            
                            // The character must have AT LEAST ONE of these valid options
                            return validOptions.some(option => charTags.includes(option));
                        }
                        
                        // If there is no alias for this tag, do a strict check
                        return charTags.includes(rt);
                    });
                });

                if (validCharacters.length > 0) {
                    // Pick a random character from the valid options
                    const randomChar = validCharacters[Math.floor(Math.random() * validCharacters.length)];
                    
                    // Rebuild the string with the codename swapped in
                    const before = result.substring(0, startIndex);
                    const after = result.substring(endIndex + 1);
                    result = before + randomChar.codename + after;

                    // Move the index forward past the newly inserted codename
                    startIndex += randomChar.codename.length;
                    
                    if (replaceOld) {
                        suffixHelper += ", replace all character";
                    }
                } else {
                    console.warn(`No character found for tags: ${tagsString}`);
                    startIndex = endIndex + 1;
                }
            } else {
                // Malformed command (no closing parenthesis found), skip ahead
                startIndex += command.length;
            }
        }
    }

    // 2. Random outfit
    // WIP

    // 3. Random background
    // WIP

    return result+suffixHelper;
}

function testWildcards() {
    // --- TESTING ---
    const inputString = "1girl, solo, car, driving, samus aran \\(metroid\\), incorrectly used (parenthesis), randomChar(female), default";

    console.debug("Original String:");
    console.debug(inputString);

    console.debug("\nProcessed String (Testing 'fem' alias mapping to '1girl'):");
    console.debug(replaceWildcards(inputString));

    console.debug("\nTesting a failure (masc, red hair):");
    console.debug(replaceWildcards("randomChar(masc, red hair), test string"));
}

// #region Non-Generation Related Functions *****************************

// Load last prompt settings
// The one place saved settings are pushed back into the UI. All six controls
// belong here rather than split across two call sites, because every one of them
// has the same requirement: it must run after the last write to `output`.
function loadPromptSettings() {
	promptSettings = loadSettingsObject();
    setPromptSettings(promptSettings.lastPrompt, promptSettings.lastNegative, promptSettings.lastSize, promptSettings.lastBatch, promptSettings.lastStyle);
    restoreSelectors();
}

function preparePromptSettings(prompt, negative, size, batch, style) {
    //Clean universal keywords out of inserted prompt
    prompt = prompt.split(", ");
    var universalKeywords = universalPrompt.split(", ");
    for (universalIndex = 0; universalIndex < universalKeywords.length; universalIndex++) {
        for (promptIndex = 0; promptIndex < prompt.length; promptIndex++) {
            if (prompt[promptIndex] == universalKeywords[universalIndex]) {
                prompt.splice(promptIndex, 1);
                promptIndex--;
            }
        }
    }
    //Clean universal negatives out of inserted negative prompt
    negative = negative.split(", ");
    universalKeywords = universalNegative.split(", ");
    for (universalIndex = 0; universalIndex < universalKeywords.length; universalIndex++) {
        for (negativeIndex = 0; negativeIndex < negative.length; negativeIndex++) {
            if (negative[negativeIndex] == universalKeywords[universalIndex]) {
                negative.splice(negativeIndex, 1);
                negativeIndex--;
            }
        }
    }
    //Try to find image size, default to 1024x1024
    var finalSize = basicImageSizes[0];
    if (typeof size == 'object') {
        if (isNumeric(size[0]) && isNumeric(size[1])) {
            //Find closest legal size that matches aspect ratio
            var closestSizeCloseness = 1;
            for (basicSizeIndex = 0; basicSizeIndex < basicImageSizes.length; basicSizeIndex++) {
                var sizeCloseness = Math.abs(size[0] / size[1] - basicImageSizes[basicSizeIndex].width / basicImageSizes[basicSizeIndex].height);
                if (sizeCloseness < closestSizeCloseness) {
                    closestSizeCloseness = sizeCloseness;
                    finalSize = basicImageSizes[basicSizeIndex];
                }
            }
        }
    }
    if (size.includes("Steps") || size.includes("Seed") || size.includes("Model") || size.includes("Height")) {
        size = size.split("Size: ")[1];
        size = size.split(",")[0];
        size = size.split("x");
        if (isNumeric(size[0]) && isNumeric(size[1])) {
            //Find closest legal size that matches aspect ratio
            var closestSizeCloseness = 1;
            for (basicSizeIndex = 0; basicSizeIndex < basicImageSizes.length; basicSizeIndex++) {
                var sizeCloseness = Math.abs(size[0] / size[1] - basicImageSizes[basicSizeIndex].width / basicImageSizes[basicSizeIndex].height);
                if (sizeCloseness < closestSizeCloseness) {
                    closestSizeCloseness = sizeCloseness;
                    finalSize = basicImageSizes[basicSizeIndex];
                }
            }
        }
    }
    batch = 1
    if (prompt.includes("syuro")) {
        style = basicStyleArray[0];
    }
    // `.id`, not the whole entry. Every other caller of setPromptSettings passes
    // the id string, and a selector cannot be set from an object.
    // pickSelectorValue now copes with either, but sending the right thing is
    // what stops the next reader having to know that.
    setPromptSettings(prompt.join(", "), negative.join(", "),
                      finalSize.id, batch, (style && style.id) ? style.id : style);
}

function setPromptSettings(prompt, negative, size, batch, style) {
	document.getElementById('promptInput').innerHTML = prompt
	document.getElementById('negativeInput').innerHTML = negative
    // Through pickSelectorValue rather than a bare `.value =`, so an unrecognised
    // saved value falls back to the first option instead of leaving the selector
    // blank, and so the choice survives a later reserialization of `output`.
    pickSelectorValue(document.getElementById('sizeInput'), size);
    pickSelectorValue(document.getElementById('styleInput'), style);
    var batchInput = document.getElementById('batchInput');
    if (batchInput) {
        batchInput.value = batch;
        batchInput.setAttribute("value", batch);
    }
}

// Generation scene construction
function buildGenerationScene() {
	document.getElementById('output').innerHTML = '<div id="txt2imgArea"></div>';
    document.getElementById('txt2imgArea').innerHTML += `
        <div id="resultArea"></div>
    `;
	
	// Prompt input fields
    document.getElementById('txt2imgArea').innerHTML += `
        <textarea id="promptInput" class="mobilePromptInput" placeholder="Enter your prompt here..."></textarea>
    `;
	
	//Place the generate button above the negative on mobile, below on desktop
    var generateButton = `<button class="mobileGenerateButton" onclick="generateButton(promptInput.value, negativeInput.value, sizeInput.value, batchInput.value, styleInput.value)">Generate</button>`;
    var testButton = `<button class="mobileGenerateButton" onclick="testButton(promptInput.value, negativeInput.value, sizeInput.value, batchInput.value, styleInput.value)">Test</button>`;
    var negativeButton = `<textarea id="negativeInput" class="mobilePromptInput" placeholder="Enter your negative prompt here..."></textarea>`;
    if (window.matchMedia('(orientation: portrait)').matches) {
        document.getElementById('txt2imgArea').innerHTML += generateButton;
        document.getElementById('txt2imgArea').innerHTML += testButton;
        document.getElementById('txt2imgArea').innerHTML += negativeButton;
    }
    else {
        document.getElementById('txt2imgArea').innerHTML += negativeButton;
        document.getElementById('txt2imgArea').innerHTML += generateButton;
        document.getElementById('txt2imgArea').innerHTML += testButton;
    }
	
	//Batch count entry
    document.getElementById('txt2imgArea').innerHTML += `
        <p class="centeredText">Batch count: <input type="number" id="batchInput" style = "margin:auto; transform:scale(1.5);margin-left:15px;" min="1" max="4" value="`+promptSettings.lastBatch+`" placeholder="1 to 4"></p>
    `;
    //Size dropdown selection
    document.getElementById('txt2imgArea').innerHTML += `
        <p class="centeredText" id="sizeText">Image size:</p>
    `;


    document.getElementById('sizeText').innerHTML += `
            <select id="sizeInput" style = "margin:auto;transform:scale(1.5);margin-left:15px;">
            </select>
    `;
    for (var i = 0; i < basicImageSizes.length; i++) {
        document.getElementById('sizeInput').innerHTML += `
            <option value="${basicImageSizes[i].id}">${basicImageSizes[i].id}</option>
        `;
    }
    document.getElementById('sizeInput').value = promptSettings.lastSize;
    //Style dropdown selection
    document.getElementById('txt2imgArea').innerHTML += `
        <p class="centeredText" id="styleText">Image Style:</p>
    `;
    document.getElementById('styleText').innerHTML += `
            <select id="styleInput" style = "margin:auto;transform:scale(1.5);margin-left:25px;">
            </select>
    `;
    for (var i = 0; i < basicStyleArray.length; i++) {
        document.getElementById('styleInput').innerHTML += `
                <option value="${basicStyleArray[i].id}">${basicStyleArray[i].id}</option>
        `;
    }
	//Collapsable dropdown box for advanced settings
    document.getElementById('txt2imgArea').innerHTML += `
        <div id ="closedBox" class="centeredText" onclick="advancedButton()">Advanced Settings v</div>
        <div id ="openBox" class="centeredText" style="display:none"><span onclick="advancedButton()">Advanced Settings ^<br></div>
        <div id ="closedHelper" class="centeredText" onclick="guideButton()">Basic Guide v</div>
        <div id ="openHelper" class="centeredText" style="display:none"><span onclick="guideButton()">Basic Guide ^<br></div>
    `;
    //Clear prompt, clear negative, reset to default, and clear everything buttons
    document.getElementById('openBox').innerHTML += `
        <p class="centeredText" id="modeText">Generation mode:
            <select id="modeInput" onchange="saveSelectors()" style = "margin:auto;transform:scale(1.5);margin-left:15px;">
                <option value="single">Single</option>
                <option value="multiple">Multiple</option>
                <option value="combo">Combo</option>
            </select>
        </p>
        <p class="centeredText" id="layoutText">Prompt output layout:
            <select id="layoutInput" onchange="saveSelectors()" style = "margin:auto;transform:scale(1.5);margin-left:15px;">
                <option value="sorted">Sorted</option>
                <option value="plain">Plain</option>
                <option value="detailed">Detailed</option>
            </select>
        </p>
        <p class="centeredText" id="engineText">Prompt engine:
            <select id="engineInput" onchange="saveSelectors()" style = "margin:auto;transform:scale(1.5);margin-left:15px;">
                <option value="v1">v1</option>
                <option value="v2">v2</option>
                <option value="both">Compare (no image)</option>
            </select>
        </p>
        <button class="mobileResetButton" onclick="promptInput.value = '';">Clear Prompt</button>
        <button class="mobileResetButton" onclick="negativeInput.value = '';">Clear Negative</button>
        <button class="mobileResetButton" onclick="resetButton('default')">Reset to last generation</button>
        <button class="mobileResetButton" onclick="resetButton('full')">Clear everything</button><br>
        <p class="centeredText">Upload source image, denoising strength: <input type="number" id="denoiseInput" style = "margin:auto; transform:scale(1.5);margin-left:15px;" min="0" max="10" value="6"></p>
        <input type="file" id="initImage" accept="image/*">
        <p class="centeredText">Last prompt full text: <br><span id="fullPrompt"></span></p>
    `;
    // The three selectors above are rendered from a template literal, so their
    // saved values have to be written back afterwards - a <select> ignores an
    // options list and shows whatever `.value` says. That restore does NOT belong
    // here: writeHTML('finish') still has to run after this function and it
    // reserializes `output`, which throws the assignment away. It lives at the
    // end of loadPromptSettings() instead, which generatetxt2img calls last.
    //Guide
    document.getElementById('openHelper').innerHTML += `
        <p class='centeredText'>This script that simplifies the process of building prompts for Stable Diffusion. Currently it features sorting, pruning, character & outfit autofill, and character & outfit replacement. See the guide <span onclick="window.open('https://docs.google.com/document/d/1CLGdmyOF2ILvL_shJJ-fzqRBJI0CprhSO-DxaZmYMZQ/edit?usp=sharing')" style="text-decoration:underline;cursor:pointer;color:blue;">here</span> for more information. </p>
        <p class='centeredText'>Sorting: Write something in the prompt box, then click "test" for it to sort and prune your prompt. At the moment, it can only handle bodypart and clothing tags.</p>
        <p class='centeredText'>Pruning: Write 'nude', 'lower body only' 'feet out of frame', or something similar and the script should remove keywords that shouldn't be shown.</p>
        <p class='centeredText'>Autofill: Put a . before a character's name (use gelbooru tags, with or without series name in escaped parenthesis) to have it auto-fill in that character's details, and add 'default' to the prompt to have it auto-fill their default outfit.</p>
        <p class='centeredText'>Shortcuts: Basic words like 'penis', 'pussy', and 'balls' can be replaced depending on the character with more detailed prompts.</p>
        <p class='centeredText'>Replace: Put "replace all clothes" and / or "replace all body" in the prompt to remove the outfit and bodypart tags in the prompt. Feel free to give them a try:</p>
        <p class='centeredText'>.sy-angelica, default, penis, balls, Simple</p>
        <p class='centeredText'>.lucoa \\(maidragon\\), default, topless, penis, balls</p>
        <p class='centeredText'>1girl, wide hips, flat chest, red shirt, red shorts, replace all clothes, replace all body, .osana najimi, default</p>
    `;
}

// The engine choice rides on promptSettings so it survives a reload, exactly
// like every other setting. It defaults to "v2" in settingsDefaults - v1 is kept
// only as a comparison target until v2 is signed off, and then it goes.
function readEngineSetting() {
    var picker = document.getElementById('engineInput');
    if (picker) { promptSettings.engine = picker.value; }
}

// Persists the three selectors THE MOMENT one changes, rather than waiting for a
// generation. That wait was the actual bug: restoreSelectors always worked, but
// savePromptSettings only ever ran from inside sendPromptArray, so changing a
// dropdown and refreshing without generating threw the change away.
function saveSelectors() {
    if (promptSettings == undefined) { promptSettings = loadSettingsObject(); }
    var mode   = document.getElementById('modeInput');
    var layout = document.getElementById('layoutInput');
    var engine = document.getElementById('engineInput');
    if (mode)   { promptMode = mode.value;     promptSettings.lastMode = mode.value; }
    if (layout) { promptLayout = layout.value; promptSettings.lastLayout = layout.value; }
    if (engine) { promptSettings.engine = engine.value; }
    // Re-stamp the `selected` attributes to match what was just picked. Without
    // this the attribute still names the option restoreSelectors chose at load,
    // and a later reserialization of `output` would silently undo the change.
    if (mode)   { pickSelectorValue(mode,   mode.value); }
    if (layout) { pickSelectorValue(layout, layout.value); }
    if (engine) { pickSelectorValue(engine, engine.value); }
    localStorage.setItem("promptSettings", JSON.stringify(promptSettings));
}

// Puts the saved values back into the three <select>s. Also seeds the globals,
// so a generation triggered before anything is clicked uses the saved mode
// rather than whichever option happened to be listed first.
function restoreSelectors() {
    var pairs = [
        ["modeInput",   "lastMode"],
        ["layoutInput", "lastLayout"],
        ["engineInput", "engine"]
    ];
    for (var i = 0; i < pairs.length; i++) {
        var picker = document.getElementById(pairs[i][0]);
        var saved = promptSettings[pairs[i][1]];
        if (picker && saved) { pickSelectorValue(picker, saved); }
    }
    if (promptSettings.lastMode)   { promptMode = promptSettings.lastMode; }
    if (promptSettings.lastLayout) { promptLayout = promptSettings.lastLayout; }
}

// Sets a <select> by BOTH the live `.value` and the `selected` ATTRIBUTE on the
// chosen option. The attribute is the part that matters: `.value` is live state
// and dies the moment an ancestor is reserialized by an `innerHTML +=`, which is
// how these three kept resetting. An attribute is markup, so it survives the
// round trip and the selector comes back correct even if something writes to
// `output` again later.
//
// Deliberately tolerant about what it is handed, because the callers are not
// consistent: the "paste generation data" path passes whole basicImageSizes and
// basicStyleArray ENTRIES where everything else passes the id string, and
// `.value = {object}` matches no option and leaves the selector blank.
//
// A value that matches nothing falls back to the FIRST option, which is the
// default for every one of these selectors. Blank is never what was wanted — it
// sends whatever the browser decides and gives no sign anything went wrong.
function pickSelectorValue(picker, value) {
    if (!picker || !picker.options) { return null; }
    if (value && typeof value === "object" && value.id != null) { value = value.id; }
    value = String(value == null ? "" : value);

    var chosen = null;
    for (var i = 0; i < picker.options.length; i++) {
        if (picker.options[i].value === value) { chosen = value; break; }
    }
    if (chosen == null && picker.options.length) { chosen = picker.options[0].value; }

    picker.value = chosen;
    for (var j = 0; j < picker.options.length; j++) {
        if (picker.options[j].value === chosen) { picker.options[j].setAttribute("selected", "selected"); }
        else { picker.options[j].removeAttribute("selected"); }
    }
    return chosen;
}

// UI buttons
function generateButton(prompt, negative, size, batch, style) {
    promptMode = document.getElementById('modeInput').value;
    promptLayout = document.getElementById('layoutInput').value;
    readEngineSetting();
	testing = false;
	sendPromptArray(prompt, negative, size, batch, style);
}

function testButton(prompt, negative, size, batch, style) {
    promptMode = document.getElementById('modeInput').value;
    promptLayout = document.getElementById('layoutInput').value;
    readEngineSetting();
	testing = true;
	sendPromptArray(prompt, negative, size, batch, style);
}

// ---------------------------------------------------------------------------
//  Combo blocks
// ---------------------------------------------------------------------------
//  A named run of tags that variants opt in and out of, so a location does not
//  have to be retyped on every pose that wants it.
//
//      [char]      1girl, red hair
//      [location]  indoors, bedroom
//      ![lighting] god rays, backlit
//
//      - poses
//      standing, frown
//      sitting, legs crossed  [lighting]
//      outdoors, flowers      ![location]
//
//  A line that STARTS with a bracket naming a block nobody has declared yet is a
//  declaration. It names the run and says whether the run is on by default:
//  `[location]` is on, `![lighting]` is off until a variant asks for it.
//  Declaration lines never assemble - they are stripped before the cartesian
//  runs, which is what stops them multiplying the variant count.
//
//  Everywhere after that a bracket is a request: `[lighting]` switches the block
//  on for that variant alone, `![location]` switches it off. `!` means what it
//  means everywhere else in this engine - negation - so it sits OUTSIDE the
//  bracket. `[!location]` would name a block called `!location`.
//
//  Requiring the bracket to be first on the line, as well as unseen, is what
//  keeps this from depending on line order: a variant that happens to lead with
//  a block reference is still a variant, because the block already exists.
var comboDeclaration = /^(!?)\[([^\][]+)\]/;
var comboReference   = /(!?)\[([^\][]+)\]/g;

function declareComboBlocks(prompt) {
    var blocks = [];
    var byName = {};
    var kept = [];
    var lines = String(prompt).split("\n");
    for (var i = 0; i < lines.length; i++) {
        var found = lines[i].trim().match(comboDeclaration);
        var name = found ? found[2].trim().toLowerCase() : null;
        if (name && !Object.prototype.hasOwnProperty.call(byName, name)) {
            var block = {
                name: name,
                on: found[1] !== "!",
                tags: tidyComboList(lines[i].trim().slice(found[0].length))
            };
            byName[name] = block;
            blocks.push(block);
            continue;
        }
        kept.push(lines[i]);
    }
    return { blocks: blocks, prompt: kept.join("\n") };
}

// Resolves one variant's bracket requests and puts the blocks it ends up wanting
// in front of its own tags, in DECLARATION order rather than request order - a
// block is the setting the variant happens in, and where the request was typed
// says nothing about where the tags belong.
function applyComboBlocks(variant, declared) {
    if (!declared.blocks.length) { return variant; }
    var wanted = {};
    for (var b = 0; b < declared.blocks.length; b++) {
        wanted[declared.blocks[b].name] = declared.blocks[b].on;
    }

    var body = String(variant).replace(comboReference, function (whole, bang, name) {
        var key = name.trim().toLowerCase();
        // An undeclared name is left in the text rather than swallowed. It is far
        // likelier to be a typo than a tag, and a typo you can see costs less
        // than one that silently drops half a prompt.
        if (!Object.prototype.hasOwnProperty.call(wanted, key)) { return whole; }
        wanted[key] = bang !== "!";
        return "";
    });

    var lead = "";
    for (var i = 0; i < declared.blocks.length; i++) {
        if (!wanted[declared.blocks[i].name] || !declared.blocks[i].tags) { continue; }
        lead += declared.blocks[i].tags + ", ";
    }
    return tidyComboList(lead + body);
}

// Removing a bracket leaves the comma that sat beside it behind, and a variant
// can end up starting or ending with one. Splitting and dropping the empties is
// simpler than working out which exact comma to remove at the source.
function tidyComboList(text) {
    return String(text).split(",")
        .map(function (t) { return t.trim(); })
        .filter(Boolean)
        .join(", ");
}

function assemblePrompt(prompt, mode) {
    switch (mode) {
        case "single":
            prompt = prompt.split("\n")
            prompt = prompt.join(", ");
            prompt = [prompt];
        break;
        case "multiple":
            prompt = prompt.split("\n")
        break;
        case "combo":
            /*Assemble all possible combinations of each line, using empty lines as separators. Example:
//Test 1
Line 1
Line 2

Line A
Line B

//Test 2
Red
Blue

Fish
Dog

            Result:
            Line 1, Line A
            Line 1, Line B
            Line 2, Line A
            Line 2, Line B
            Red Fish
            Red Dog
            Blue Fish
            Blue Dog
            */

            // Named blocks come out first: they are not assembly lines, and
            // leaving them in would multiply the variant count by however many
            // blocks were declared.
            const declared = declareComboBlocks(prompt);
            prompt = declared.prompt;

            // Split into combo sets by lines starting with //
            const sets = prompt
                .split(/\n(?=\/\/)/)   // keep // as delimiter line
                .map(set => set
                    .replace(/^\/\/.*$/gm, '') // remove the header lines themselves
                    .trim()
                )
                .filter(Boolean);

            function cartesian(arrays) {
                return arrays.reduce((acc, curr) => {
                    const result = [];
                    acc.forEach(a => {
                        curr.forEach(b => {
                            result.push(a.concat([b]));
                        });
                    });
                    return result;
                }, [[]]);
            }

            let allResults = [];

            for (const set of sets) {

                const groups = set
                    .split(/\n\s*\n/) // empty lines separate groups
                    .map(group =>
                        group
                            .split(/\n/)
                            .map(line => line.trim())
                            .filter(line => line && !line.startsWith('-')) // ONLY '-' is comment
                            .map(line => line.split(',').map(s => s.trim()).join(', '))
                    )
                    .filter(group => group.length > 0);

                const combinations = cartesian(groups).map(arr => arr.join(', '));
                allResults.push(...combinations);
            }

            prompt = allResults.map(function (variant) {
                return applyComboBlocks(variant, declared);
            });
            console.info(prompt);
        break;
    }
    return prompt
}

function advancedButton() {
    var closedBox = document.getElementById('closedBox');
    var openBox = document.getElementById('openBox');
    if (closedBox.style.display != "none") { //If the box is already closed, open it
        closedBox.style.display = "none";
        openBox.style.display = "block";
    }
    else {
        closedBox.style.display = "block";
        openBox.style.display = "none";
        //Erase the currently uploaded initImage
        clearInitImage();
    }
}
function guideButton() {
    var closedHelper = document.getElementById('closedHelper');
    var openHelper = document.getElementById('openHelper');
    if (closedHelper.style.display != "none") { //If the box is already closed, open it
        closedHelper.style.display = "none";
        openHelper.style.display = "block";
    }
    else {
        closedHelper.style.display = "block";
        openHelper.style.display = "none";
    }
}

function resetButton(type) {
    if (type == "default") {
        promptSettings = loadSettingsObject();
        promptInput.value = promptSettings.lastPrompt;
        negativeInput.value = promptSettings.lastNegative;
        sizeInput.value = promptSettings.lastSize;
        batchInput.value = promptSettings.lastBatch;
        styleInput.value = promptSettings.lastStyle;
    }
    else if (type == "full") {
        promptInput.value = "";
        negativeInput.value = "";
        sizeInput.value = "Default";
        batchInput.value = "1";
        styleInput.value = "Syurofluff v7";
    }
}

// Image upload button
function findClosestSize(width, height) {
  const aspect = width / height;

  let best = null;
  let bestScore = Infinity;

  for (const option of basicImageSizes) {
    const optionAspect = option.width / option.height;

    // score combines aspect ratio difference + scale difference
    const aspectDiff = Math.abs(aspect - optionAspect);

    // relative difference in total pixel count
    const pixelDiff = Math.abs((width * height) - (option.width * option.height)) 
                      / (option.width * option.height);

    const score = aspectDiff + pixelDiff; // weight both equally
    if (score < bestScore) {
      bestScore = score;
      best = option;
    }
  }
  return best;
}

function setupInitImageHandler() {
  const input = document.getElementById("initImage");
  if (!input) return;

  input.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = function () {
      const finalWidth = img.width;
      const finalHeight = img.height;
      console.info("Original:", finalWidth, "x", finalHeight);

      // pick the closest match
      const closest = findClosestSize(finalWidth, finalHeight);
      console.info("Closest match:", closest.id, closest.width, "x", closest.height);

      // draw preview canvas at 200px width (scaled from original, not snapped)
      const displayWidth = 200;
      const displayHeight = (img.height / img.width) * displayWidth;

      let canvas = input.nextElementSibling;
      if (!canvas || canvas.tagName.toLowerCase() !== "canvas") {
        canvas = document.createElement("canvas");
        input.insertAdjacentElement("afterend", canvas);
      }

      canvas.width = displayWidth;
      canvas.height = displayHeight;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
    };

    img.src = URL.createObjectURL(file);
  });
}

function clearInitImage() {
  const input = document.getElementById("initImage");
  if (input) {
    input.value = ""; // clears the file selection
  }

  // remove the preview canvas if it exists
  const canvas = input && input.nextElementSibling;
  if (canvas && canvas.tagName.toLowerCase() === "canvas") {
    canvas.remove();
  }
}

// #endregion Non-Generation Related Functions *****************************


// #region Prompt Generation Functions *****************************

// Autosave prompt
function savePromptSettings(prompt, negative, size, batch, style) {
    if (promptSettings == undefined) {
        promptSettings = loadSettingsObject();
    }
    promptSettings.lastPrompt = prompt;
    promptSettings.lastNegative = negative;
    promptSettings.lastSize = size;
    promptSettings.lastBatch = batch;
    promptSettings.lastStyle = style;
    // Generation mode, output layout and engine were never saved, so all three
    // reset on every refresh. Everything the settings box can change belongs in
    // here or it is not really a setting.
    promptSettings.lastMode = promptMode;
    promptSettings.lastLayout = promptLayout;
	localStorage.setItem("promptSettings",JSON.stringify(promptSettings));
}

// Img2img check
function checkGenType() {
	if (document.getElementById('initImage').files.length > 0 && document.getElementById('openBox').style.display != "none") {
		return "img2img";
	}
	else {
		return "txt2img";
	}
}

// Normalize prompt commas
// An underscore in the input is a booru artefact — `red_hair` is `red hair`, and
// every dictionary in this project is written the natural way, so an underscored
// tag matches nothing and travels to the model as an unknown word. A handful of
// LoRAs genuinely want the underscored spelling; those live in cleaningDB as
// replacement VALUES (`spread_pussy`, `huge_condom`, `oraora_rush`), which are
// injected in tag space long after this runs and are not touched.
//
// TWO ORDERING CONSTRAINTS, and both are load-bearing:
//   AFTER the LoRA lift, or before it — the `<…>` guard makes either safe.
//     `<lora:some_name:1>` and `<embedding:foo_bar>` keep their underscores.
//   BEFORE normalizeSpacing, always. That function ENDS by calling protectParens,
//     which writes `__lparen__` sentinels into the text. Stripping underscores
//     after it would eat them and leave the escaped names in pieces.
function stripInputUnderscores(prompt) {
    return String(prompt == null ? "" : prompt).replace(/<[^>]*>|_/g, function (match) {
        return match === "_" ? " " : match;
    });
}

function normalizeSpacing(prompt) {
    prompt = prompt.trim();
	prompt = prompt.split(",");
	for (var promptIndex = 0; promptIndex < prompt.length; promptIndex++) {
        if (prompt[promptIndex] == "") {
            prompt.splice(promptIndex, 1);
            promptIndex--;
        }
        else {
            while (prompt[promptIndex][0] == " ") {
                prompt[promptIndex] = prompt[promptIndex].slice(1);
                //console.info("Removed leading space from '", prompt[promptIndex]);
            }
            while (prompt[promptIndex].endsWith(" ")) {
                prompt[promptIndex] = prompt[promptIndex].slice(0, -1);
            }
            if (prompt[promptIndex].startsWith("fl ")) {
                prompt[promptIndex] = "fl-" + prompt[promptIndex].slice(3);
            }
            if (prompt[promptIndex].startsWith("fl_")) {
                prompt[promptIndex] = "fl-" + prompt[promptIndex].slice(3);
            }
            if (prompt[promptIndex].startsWith("sy ")) {
                prompt[promptIndex] = "sy-" + prompt[promptIndex].slice(3);
            }
            if (prompt[promptIndex].startsWith("sy_")) {
                prompt[promptIndex] = "sy-" + prompt[promptIndex].slice(3);
            }
            if (!prompt[promptIndex].startsWith(" ")) {
                prompt[promptIndex] = " " + prompt[promptIndex];
            }
        }
	}
    //Protect \( and \) by transforming them
    prompt = prompt.join(",")
    prompt = prompt.slice(1);

	return protectParens(prompt);
}

// Normalize prompt subitem coloring
function normalizeSubitemKeywords(keywordString, keywordDB, modifierDB) {
    //console.info("Normalizing subitem keywords of: ", keywordString);
	const parts = keywordString.split(", ").map(s => s.trim()).filter(Boolean);
	const result = [];

	// Prebuild lookup: subitem → parent item
	const subitemToItem = {};
	for (const [category, itemsObj] of Object.entries(keywordDB)) {
		for (const [item, subitems] of Object.entries(itemsObj)) {
			for (const sub of subitems) {
			    subitemToItem[sub.toLowerCase()] = item;
			}
		}
	}

	for (const part of parts) {
		let normalized = part;
		let matched = false;

		for (const [sub, parentItem] of Object.entries(subitemToItem)) {
			// exact subitem
			if (part === sub) {
				normalized = sub;
				matched = true;
				break;
			}

			// (color) subitem
			for (const color of modifierDB.colors || []) {
				if (part === `${color.toLowerCase()} ${sub}`) {
					normalized = `${sub}, ${color} ${parentItem}`;
					matched = true;
					break;
				}
			}
			if (matched) break;

			// (variant) (color) subitem
			for (const variant of modifierDB.variants || []) {
				for (const color of modifierDB.colors || []) {
					if (part === `${variant.toLowerCase()} ${color.toLowerCase()} ${sub}`) {
						normalized = `${sub}, ${variant} ${color} ${parentItem}`;
						matched = true;
						break;
					}
				}
				if (matched) break;
			}
			if (matched) break;
		}

		result.push(normalized);
	}

	return result.join(", ");
}

//Displaying prompt on screen: Split apart parenthesis within items
function normalizeParenthesis(prompt, mode) {
    if (mode == null) {
        mode = "keep";
    }
	prompt = prompt.replaceAll("\\", "/")
    var parts = prompt.split(", ")

    for (promptIndex = 0; promptIndex < parts.length; promptIndex++) {
        var keyword = parts[promptIndex];
        var fixedKeyword = "";
        //First: Preserve any parenthesis that entirely encapsulates keywords
        var keywordPrefix = "";
        var keywordSuffix = "";
        while (keyword.startsWith("(")) {
            keywordPrefix += "(";
            keyword = keyword.slice(1);
        }
        var leftCount = 0;
        if (keyword.match(/\(/g)) {
            leftCount = keyword.match(/\(/g).length;
        }
        var rightCount = 0;
        if (keyword.match(/\)/g)) {
            rightCount = keyword.match(/\)/g).length;
        }
        //console.info(leftCount, " vs ", rightCount)
        while (leftCount < rightCount && keyword.endsWith(")")) {
            keywordSuffix += ")";
            keyword = keyword.slice(0, -1);
            leftCount--;
        }
        
        keyword = keyword.replaceAll("(", "/(")
        keyword = keyword.replaceAll(")", "/)")
        while (keyword.includes("//")) {
            keyword = keyword.replace("//", "/");
        }
        if (mode == "keep") {
            parts[promptIndex] = keywordPrefix + keyword + keywordSuffix;
        }
        else {
            parts[promptIndex] = keyword;
        }
    }

    prompt = parts.join(", ")
    prompt = prompt.replaceAll("/", "\\")
	return prompt;
}

function extractParenthesis(prompt) {
    var extractedKeywords = [];
    //Goal: Extract a copy of all keywords contained within parenthesis
    //Step 1: Temporarily replace all \\( and \\) to avoid mixing with brand names and clarification
    prompt = prompt.replaceAll("\\(", "__LEFTPARENTHESIS__")
    prompt = prompt.replaceAll("\\)", "__RIGHTPARENTHESIS__")
    prompt = prompt.replaceAll("\(\(\(", "(")
    prompt = prompt.replaceAll("\)\)\)", ")")
    prompt = prompt.replaceAll("\(\(", "(")
    prompt = prompt.replaceAll("\)\)", ")")

    //Step 2: Extract sections of keywords contained within parenthesis
    var parenthesisLCount = countParenthesis(prompt);
    for (parenIndex = 0; parenIndex < parenthesisLCount; parenIndex++) {
        extractedKeywords.push(prompt.split("\(")[1].split("\)")[0]);
        prompt = prompt.replace("\(", "");
        prompt = prompt.replace("\)", "");
    }
    var parts = prompt.split(", ");
    for (partsIndex = 0; partsIndex < parts.length; partsIndex++) {
        for (weakIndex = 0; weakIndex < weakKeywordsArray.length; weakIndex++) {
            if (parts[partsIndex] == weakKeywordsArray[weakIndex]) {
                extractedKeywords.push(parts[partsIndex]);
            }   
        }
    }
    return extractedKeywords;
}

function countParenthesis(prompt) {
    var parenthesisLCount = 0;
    var parenthesisRCount = 0;
    for (promptIndex = 0; promptIndex < prompt.length; promptIndex++) {
        if (prompt[promptIndex] == "(") {
            parenthesisLCount++;
        }
        if (prompt[promptIndex] == ")") {
            parenthesisRCount++;
        }
    }
    console.info(parenthesisLCount, " vs ", parenthesisRCount)
    if (parenthesisLCount != parenthesisRCount) {
        console.error("Parenthesis mismatch (" + parenthesisLCount + " open vs " + parenthesisRCount + " close) - emphasis handling skipped for: ", prompt);
        return 0;
    }
    else {
        return parenthesisLCount;
    }
}

function displayPrompt(prompt, culled, startingPrompt) {
    if (startingPrompt == null) {
        startingPrompt = prompt;
    }
    var textToDisplay = restoreParens(normalizeParenthesis(prompt));
    textToDisplay = removeDuplicates(textToDisplay);

    switch (promptLayout) {
        // `detailed` is a v2 layout. v1 has no trace to show, so it gives the
        // fullest thing it has rather than silently dropping to plain.
        case "detailed":
        case "sorted": {
            var bodyKeywords = restoreParens(cullBulkKeywords(textToDisplay, "remove body")[1]);
            bodyKeywords = sortPromptByItem(bodyKeywords, "body");
            textToDisplay = cullBulkKeywords(textToDisplay, "remove body")[0];

            var clothesKeywords = restoreParens(cullBulkKeywords(textToDisplay, "remove clothes")[1]);
            clothesKeywords = sortPromptByItem(clothesKeywords, "clothes");
            textToDisplay = cullBulkKeywords(textToDisplay, "remove clothes")[0];

            var sceneKeywords = restoreParens(cullBulkKeywords(textToDisplay, "remove scene")[1]);
            sceneKeywords = sortPromptByItem(sceneKeywords, "scene");
            textToDisplay = cullBulkKeywords(textToDisplay, "remove scene")[0];

            var backgroundKeywords = restoreParens(cullBulkKeywords(textToDisplay, "remove background")[1]);
            backgroundKeywords = sortPromptByItem(backgroundKeywords, "background");
            textToDisplay = cullBulkKeywords(textToDisplay, "remove background")[0];

            var stringToPrint = "";
            if (promptBoosted) {
                if (promptBoosted.length > 0) {
                    for (var boostCounter = 0; boostCounter < promptBoosted.length; boostCounter++) {
                        stringToPrint += "(" + promptBoosted[boostCounter] + ")";
                        if (boostCounter < promptBoosted.length - 1) {
                            stringToPrint += ", ";
                        }
                        else {
                            stringToPrint += ",<br>";
                        }
                    }
                }
            }
            if (restoreParens(bodyKeywords).length > 0) {
                bodyKeywords = highlightNewKeywords(bodyKeywords, startingPrompt);
                stringToPrint += "<span class=\"unselectable\">Character Keywords: </span>" + restoreParens(bodyKeywords)+",<br>";
            }
            if (restoreParens(clothesKeywords).length > 0) {
                clothesKeywords = highlightNewKeywords(clothesKeywords, startingPrompt);
                stringToPrint += "<span class=\"unselectable\">Clothing Keywords: </span>" + restoreParens(clothesKeywords)+",<br>";
            }
            if (restoreParens(sceneKeywords).length > 0) {
                sceneKeywords = highlightNewKeywords(sceneKeywords, startingPrompt);
                stringToPrint += "<span class=\"unselectable\">Scene Keywords: </span>" + restoreParens(sceneKeywords)+",<br>";
            }
            if (restoreParens(backgroundKeywords).length > 0) {
                backgroundKeywords = highlightNewKeywords(backgroundKeywords, startingPrompt);
                stringToPrint += "<span class=\"unselectable\">Background Keywords: </span>" + restoreParens(backgroundKeywords)+",<br>";
            }
            if (restoreParens(textToDisplay).length > 0) {
                textToDisplay = highlightNewKeywords(textToDisplay, startingPrompt);
                stringToPrint += "<span class=\"unselectable\">Unknown Keywords: </span>" + restoreParens(textToDisplay);
            }
            break;
        }
        default: {
            var stringToPrint = "";
            if (promptBoosted) {
                if (promptBoosted.length > 0) {
                    for (var boostCounter = 0; boostCounter < promptBoosted.length; boostCounter++) {
                        stringToPrint += "(" + promptBoosted[boostCounter] + ")";
                        if (boostCounter < promptBoosted.length - 1) {
                            stringToPrint += ", ";
                        }
                        else {
                            stringToPrint += ",<br>";
                        }
                    }
                }
            }
            var textToDisplay = restoreParens(normalizeParenthesis(prompt));
            textToDisplay = removeDuplicates(textToDisplay);
            textToDisplay = highlightNewKeywords(textToDisplay, startingPrompt);
            stringToPrint = restoreParens(textToDisplay);
        }
    }
    if (culled) {
        if (culled.length > 0) {
            if (culled[0] == ",") {
                culled = culled.substring(1);
            }
            if (culled[0] == " ") {
                culled = culled.substring(1);
            }
            stringToPrint += "<br><span class=\"unselectable\">Culled keywords: </span><span class=\"removedKeyword\"> "+removeDuplicates(restoreParens(culled))+" </span>";
        }
    }

	if (document.getElementById('resultArea')) {
        document.getElementById('resultArea').innerHTML += "<br>" + stringToPrint;
    }
    else {
        return stringToPrint;
    }
}

// The v2 display. It prints the string the engine produced and then reads back
// over job.records — it never recomputes what a tag IS, only where to file it.
// Newlines are v2's grouping (Rule 12) and become line breaks here so a figure's
// tags can be selected in one drag.
//
// Three layouts, and the difference is how much of the derivation is shown:
//
//   plain      the prompt, coloured, and nothing else
//   sorted     plus v1's domain groups. The default, and the one for working in
//   detailed   plus the exact category of every tag and the whole trace
//
// `sorted` used to print what `detailed` prints now, and on a six-tag prompt
// that was fifteen "added" rows, twelve "culled" rows and two "declined" rows to
// find one real cull in. The engine had not done anything wrong; the display was
// reporting its internal bookkeeping as though it were results.
// One line to the console per compile. The engine keeps a full trace and none of
// it used to leave the page, so a compile that quietly did nothing looked exactly
// like a compile that had nothing to do — which is how an empty `cleanedCullArray`
// went unnoticed in the browser while every headless run passed.
//
// The dictionary sizes are the half that matters: a zero there is a loading
// problem, not a prompt problem, and it is the first thing to check.
function logV2Summary(job) {
    if (typeof console === "undefined" || !job) { return; }
    var trace = job.trace || {};
    var live = 0;
    for (var i = 0; i < (job.records || []).length; i++) {
        if (job.records[i].culledBy == null) { live++; }
    }
    var dictionaries =
        (typeof cleanedCullArray !== "undefined" ? cleanedCullArray.length : 0) + " cull, " +
        (typeof cleanedDefaultArray !== "undefined" ? cleanedDefaultArray.length : 0) + " default, " +
        (typeof rulesArrayFinal !== "undefined" ? rulesArrayFinal.length : 0) + " final rules";

    console.log(
        "v2: " + live + " tags out of " + (job.records || []).length + " records  |  " +
        "added " + ((trace.added || []).length) +
        ", culled " + ((trace.culled || []).length) +
        ", declined " + ((trace.declined || []).length) +
        ", unknown " + ((trace.unknown || []).length) +
        ", unmatched " + ((trace.unmatched || []).length) +
        ", conflicts " + ((trace.conflicts || []).length) +
        "  |  dictionaries: " + dictionaries +
        (job.errors && job.errors.length ? "  |  ERRORS: " + job.errors.length : ""));
}

function displayV2Prompt(job, label) {
    if (!document.getElementById('resultArea')) { return; }
    var out = "";
    // Only badge the output when there is something to tell it apart from. On
    // its own it is just "the prompt" and saying so is noise.
    if (label) { out += "<br><span class=\"unselectable\">" + label + ": </span>"; }
    else { out += "<br>"; }
    out += colourByOrigin(job);

    if (job.errors && job.errors.length > 0) {
        out += "<br><span class=\"removedKeyword\"> " + job.errors.join("; ") + " </span>";
    }
    if (promptLayout != "plain")     { out += renderV2Groups(job); }
    if (promptLayout == "detailed")  { out += renderV2Categories(job) + renderV2Trace(job); }
    document.getElementById('resultArea').innerHTML += out;
}

// v1's sections, in v1's order, rebuilt on v2's records. The domain comes from
// the category NAME through deriveCategoryAttributes — the same derivation the
// culling phases use — so this view cannot disagree with what the engine did.
//
// Boosters sit second to last, immediately before the unknowns, because purple
// means nothing until you have seen the list of things that are purple.
var v2DisplayGroups = [
    ["body",       "Character Keywords"],
    ["clothes",    "Clothing Keywords"],
    ["scene",      "Scene Keywords"],
    ["prop",       "Prop Keywords"],
    ["background", "Background Keywords"]
];

function renderV2Groups(job) {
    var records = (job.records || []).filter(function (r) {
        return r.culledBy == null && !(r.system && !r.system.emit);
    });
    var buckets = {}, boosters = [], unknown = [];
    for (var i = 0; i < records.length; i++) {
        if (records[i].booster) { boosters.push(records[i]); continue; }
        var domain = domainOfRecord(records[i]);
        if (!domain) { unknown.push(records[i]); continue; }
        if (!buckets[domain]) { buckets[domain] = []; }
        buckets[domain].push(records[i]);
    }

    var out = "";
    for (var g = 0; g < v2DisplayGroups.length; g++) {
        out += renderV2Group(v2DisplayGroups[g][1], buckets[v2DisplayGroups[g][0]]);
    }
    out += renderV2Group("Boosters", boosters);
    out += renderV2Group("Unknown Keywords", unknown);
    out += renderV2Group("Culled", (job.records || []).filter(isReportableCull));
    return out;
}

function domainOfRecord(record) {
    var cats = record.categories || [];
    for (var i = 0; i < cats.length; i++) {
        var attributes = deriveCategoryAttributes(cats[i]);
        if (attributes.domain) { return attributes.domain; }
    }
    // 2728 names blocks against one keyword file, so most characters are not in
    // a category at all — but a figure is never an unknown keyword.
    if (record.character) { return "body"; }
    return null;
}

// A cull worth reporting is one that removed something the prompt really had.
// An engine rule that injects a marker and then purges it — `no hands`,
// `remove ears`, `no forehead` — has removed nothing, and eleven of those buried
// the single cull that mattered.
function isReportableCull(record) {
    if (record.culledBy == null) { return false; }
    if (record.system && !record.system.emit) { return false; }
    // A reference or a command that did its job and stood down.
    if (/consumed$/.test(String(record.culledBy))) { return false; }
    // Born of a rule and purged by a rule: it never existed outside the engine.
    // Something you TYPED being purged is still worth saying, so source matters.
    if (record.source != "input" && String(record.culledBy).indexOf("rule:") === 0) {
        return false;
    }
    return true;
}

function renderV2Group(title, records) {
    if (!records || !records.length) { return ""; }
    return "<br><span class=\"unselectable\">" + title + ": </span>"
         + records.map(renderV2Keyword).join(", ");
}

// One green for everything the engine added, and the keyword by itself — what
// produced it moves to the tooltip. Reading the prompt is the job; reading the
// derivation is what `detailed` is for.
function renderV2Keyword(record) {
    var text = escapeForDisplay(record.text);
    if (record.culledBy != null) {
        return "<span class=\"removedKeyword\" title=\"" + escapeForDisplay(record.culledBy) + "\">" + text + "</span>";
    }
    if (record.booster) {
        return "<span style=\"color:#c060ff\" title=\"booster — dropped from a training caption\">" + text + "</span>";
    }
    if (record.source !== "input") {
        return "<span class=\"newKeyword\" title=\"" + escapeForDisplay(record.source) + "\">" + text + "</span>";
    }
    return text;
}

function escapeForDisplay(text) {
    return String(text == null ? "" : text)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// The prompt, with every tag coloured by where it came from. v1 highlights new
// and removed keywords; v2 knows more than that, so it says more.
function colourByOrigin(job) {
    var records = (job.records || []).filter(function (r) {
        return r.culledBy == null && !(r.system && !r.system.emit);
    });
    if (!records.length) { return trailingComma(String(job.prompt || "").replaceAll("\n", "<br>")); }

    var byText = {};
    for (var i = 0; i < records.length; i++) { byText[records[i].text.toLowerCase()] = records[i]; }

    return trailingComma(String(job.prompt || "").split("\n").map(function (line) {
        return line.split(", ").map(function (piece) {
            var bare = piece.replace(/^\(+|\)+$/g, "").replace(/:[-\d.]+\)?$/, "")
                            .replace(/\\([()])/g, "$1").trim().toLowerCase();
            var record = byText[bare];
            if (!record) { return piece; }
            if (record.booster) { return "<span style=\"color:#c060ff\" title=\"booster — dropped from a training caption\">" + piece + "</span>"; }
            if (record.source !== "input") { return "<span class=\"newKeyword\" title=\"" + record.source + "\">" + piece + "</span>"; }
            if (!record.categories || !record.categories.length) { return "<span style=\"color:#d08000\" title=\"in no category — never culls, never sorts\">" + piece + "</span>"; }
            return piece;
        }).join(", ");
    }).join("<br>"));
}

// The prompt ends in a comma, final keyword included. The data-entry tools these
// get pasted into split on it and swallow the last tag without it, so a check
// that trims it is working against the reader. Added at the display rather than
// in promptRender: `job.prompt` is also what gets POSTed and what 340 tests
// compare against, and neither of those wants a dangling comma.
function trailingComma(html) {
    return /,\s*$/.test(html) ? html : html + ",";
}

// Which category each tag landed in. Sorting alone does not tell you that, and
// "why is this here" is the question a sorted prompt raises.
function renderV2Categories(job) {
    var records = (job.records || []).filter(function (r) {
        return r.culledBy == null && !(r.system && !r.system.emit);
    });
    if (!records.length) { return ""; }
    var groups = {}, order = [];
    for (var i = 0; i < records.length; i++) {
        var name = (records[i].categories && records[i].categories.length)
            ? records[i].categories[0] : "uncategorized";
        if (!groups[name]) { groups[name] = []; order.push(name); }
        groups[name].push(records[i].text);
    }
    order.sort();
    var out = "<br><span class=\"unselectable\">Categories:</span>";
    for (var g = 0; g < order.length; g++) {
        out += "<br><span class=\"unselectable\">&nbsp;&nbsp;" + order[g] + ": </span>"
             + groups[order[g]].join(", ");
    }
    return out;
}

// The trace, in full. Screen space is not the constraint while testing, and a
// bare count tells you something happened without telling you what.
function renderV2Trace(job) {
    var trace = job.trace || {};
    var out = "";
    var section = function (title, list, format, colour) {
        if (!list || !list.length) { return ""; }
        var body = list.map(format).join(", ");
        return "<br><span class=\"unselectable\">" + title + " (" + list.length + "): </span>"
             + "<span style=\"color:" + colour + "\">" + body + "</span>";
    };
    out += section("Added", trace.added, function (a) {
        return a.text + (a.rule ? " <span class=\"unselectable\">[" + a.rule + "]</span>" : "");
    }, "#20a020");
    // A decline for a tag that IS in the output reads as a bug that is not
    // there. It happens whenever two rules ask for the same tag: the first one
    // put it in, the gate turned the second one away, and both are true. The
    // second is only worth saying when the tag is genuinely absent.
    var live = {};
    for (var i = 0; i < (job.records || []).length; i++) {
        var record = job.records[i];
        if (record.culledBy == null) { live[String(record.text).toLowerCase()] = true; }
    }
    var declined = (trace.declined || []).filter(function (d) {
        return !live[String(d.text).toLowerCase()];
    });
    out += section("Declined", declined, function (d) {
        return d.text + " <span class=\"unselectable\">[" + (d.blockedBy ? "blocked by " + d.blockedBy + ", " : "") + d.rule + "]</span>";
    }, "#a08000");
    out += section("Culled", trace.culled, function (c) {
        return c.text + " <span class=\"unselectable\">[" + c.rule + "]</span>";
    }, "#c02020");
    out += section("Unknown", trace.unknown, function (u) { return u; }, "#d08000");
    out += section("Unmatched commands", trace.unmatched, function (u) {
        return u.text + " <span class=\"unselectable\">[" + u.rule + "]</span>";
    }, "#c02020");
    out += section("Conflicts", trace.conflicts, function (c) {
        return c.text + " <span class=\"unselectable\">[" + c.rule + "]</span>";
    }, "#c02020");
    return out;
}

function highlightNewKeywords(keywords, startingPrompt) {
    var splitKeywords = keywords.split(", ");
    var splitStartingPrompt = startingPrompt
    for (splitKeywordsIndex = 0; splitKeywordsIndex < splitKeywords.length; splitKeywordsIndex++) {
        console.info("Checking keyword: " + splitKeywords[splitKeywordsIndex]);
        var newKeyword = true;
        for (splitStartingIndex = 0; splitStartingIndex < splitStartingPrompt.length; splitStartingIndex++) {
            if (splitStartingPrompt[splitStartingIndex] == splitKeywords[splitKeywordsIndex]) {
                newKeyword = false;
            }
        }
        if (newKeyword == true) {
            console.info("New keyword: " + splitKeywords[splitKeywordsIndex]);
            splitKeywords[splitKeywordsIndex] = "<span class=\"newKeyword\">" + splitKeywords[splitKeywordsIndex] + "</span>";
        }
    }
    return splitKeywords.join(", ");
}

// Initial Cleaning - Clean prompt of bad and untranslated tags top level
function replaceInitialCleanup(prompt) {
    //Part 0: Top-Level Replacements
    for (let replacementIndex = 0; replacementIndex < cleaningArrayTop.length; replacementIndex++) {
        if (prompt.includes(cleaningArrayTop[replacementIndex][0])) {
            prompt = prompt.replaceAll(cleaningArrayTop[replacementIndex][0], cleaningArrayTop[replacementIndex][1]);
		}
	}
    if (prompt.includes("thighboots")) {
        prompt = prompt.replaceAll("footwear", "thighboots");
    }
    else if (prompt.includes("boots")) {
        prompt = prompt.replaceAll("footwear", "boots");
    }
    else {
        prompt = prompt.replaceAll("footwear", "shoes");
    }
    if (prompt.includes(" helmet")) {
        prompt = prompt.replaceAll("headwear", "helmet");
    }
    else {
        prompt = prompt.replaceAll("headwear", "hat");
    }
    prompt = prompt.replaceAll("armwear", "gloves");
    prompt = prompt.replaceAll(", ;)", ", wink, one eye closed, mouth closed, smile");
    prompt = prompt.replaceAll(", :d", ", open mouth, smile");
    prompt = prompt.replaceAll(", ;d", ", wink, one eye closed, open mouth, smile");
    prompt = prompt.replaceAll(", xd", ", eyes closed, open mouth, laughing");
    prompt = prompt.replaceAll(", d:", ", open mouth, frown");
    prompt = prompt.replaceAll(", :p", ", tongue out, mouth closed, blep, mlem");
    prompt = prompt.replaceAll(", ;p", ", wink, one eye closed, tongue out, mouth closed, blep, mlem");
    prompt = prompt.replaceAll(", :q", ", tongue out, mouth closed, licking lips");
    prompt = prompt.replaceAll(", ;p", ", wink, one eye closed, tongue out, mouth closed, licking lips");
	return prompt;
}

function replaceAliasCleanup(prompt) {
    var keywordsToClean = prompt.split(", ");
    //Example format:
    //cleaningAliasList[0] == "1girl, female, 1girls, woman"
    var tagmeStage = 0;
    if (prompt.includes(", tagme")) {
        tagmeStage = 1;
    }
    //Replace redundant aliases with first entry in the cleaning array list
    for (let replacementIndex = 0; replacementIndex < cleaningAliasList.length; replacementIndex++) {
        var aliasList = cleaningAliasList[replacementIndex][tagmeStage].split(", ");
        for (let keywordIndex = 0; keywordIndex < keywordsToClean.length; keywordIndex++) {
            if (aliasList.includes(keywordsToClean[keywordIndex])) {
                keywordsToClean[keywordIndex] = cleaningAliasList[replacementIndex][0];
                if (tagmeStage > 0) {
                    //Tagme boost, add the second alias
                    keywordsToClean.push(cleaningAliasList[replacementIndex][1]);
                }
            }
        }
    }
    return removeDuplicates(keywordsToClean.join(", "));
}

function promptDefaults(prompt, negative) {
    // Exception type 4 reads the MEMBERS of a category, not just its name.
    ensureFullKeywordSets();
    //Formatting example of cleanedDefaultArray:
    /*
	{
	  "requirements": [
		""
	  ],
	  "additions": [
		"looking at viewer "
	  ],
	  "exceptions": [
		"'looking '",
		"rolling eyes",
		"constricted pupils",
		"'-eyed'",
		"facing away",
		"eye contact",
		"eyes closed",
		"obscured eyes",
		"sceneEyes",
		"sceneHead",
		"sceneOrbital"
	  ]
	}
	  {
	  "requirements": [
		[
		  "'dress'"
		],
	  ],
	  "additions": [
		"long dress"
	  ],
	  "exceptions": [
		"short dress"
	  ]
	}
    */

    //Formatting example of exclusiveCategories:
    /*
	{
	  "index": "expression exclusivity 1",
	  "contents": [
		"happy",
		"crazy",
		"sad, crying",
		"angry, furious",
		"confused",
		"shocked",
		"scared",
		"emotionless",
		"obscured eyes, hidden eyes",
	  ]
	}
    */

    var parts = prompt.split(", ").filter(Boolean);
    var promptSet = new Set(parts);

    //Go default by default checking if the prompt meets all requirements
    for (let defaultIndex = 0; defaultIndex < cleanedDefaultArray.length; defaultIndex++) {
        const current = cleanedDefaultArray[defaultIndex];
        //console.log("Current default:", current);  
        const requirements = current.requirements || [];
        const additions = current.additions || [];
        const exceptions = current.exceptions || [];

        //Requirement checking, for reach requirement...
        let requirementsMet = true;
        for (const req of requirements) {
            //console.info("Requirement:", req);
            //Empty requirement means auto-pass
            if (!req || (Array.isArray(req) && req.length === 0)) continue;

            let thisRequirementMet = false;
            //Requirement type 1 (quotation marks): check if string bewteen quotes is present in full prompt
            if (req.startsWith(`'`) && req.endsWith(`'`)) {
                const keyword = req.slice(1, -1);
                if (prompt.includes(keyword)) thisRequirementMet = true;
            }
            else if (req.startsWith(`"`) && req.endsWith(`"`)) {
                const keyword = req.slice(1, -1);
                if (prompt.includes(keyword)) thisRequirementMet = true;
            }

            //Requirement type 2 ("(color)"): check color-based variants
            else if (req.includes("(color)")) {
                for (const color of simpleColorArray) {
                    const variants = [
                        `${color} ${req.replace("(color)", "").trim()}`,
                        `light ${color} ${req.replace("(color)", "").trim()}`,
                        `dark ${color} ${req.replace("(color)", "").trim()}`,
                        `${color}-striped ${req.replace("(color)", "").trim()}`
                    ];
                    if (variants.some(v => promptSet.has(v))) {
                        thisRequirementMet = true;
                        break;
                    }
                }
            }

            //Requirement type 3 ("(type)"): check if any type+" "+keyword is present exactly
            else if (req.includes("(type) ")) {
                for (const type of simpleTypeArray) {
                    if (promptSet.has(`${type} ${req.replace("(type) ", "").trim()}`)) {
                        thisRequirementMet = true;
                        break;
                    }
                }
            }

            //Requirement type final (no special instructions): check if keyword is present exactly
            else {
                if (promptSet.has(req.trim())) thisRequirementMet = true;
            }

            if (!thisRequirementMet) {
                requirementsMet = false;
                break; // cancel early if any are failed
            }
        }

        //Proceed only if all requirements met, cancel early if any are failed (empty requirements means auto-pass)
        if (!requirementsMet) continue;

        //Exception checking, for each exception...
        let exceptionTriggered = false;
        for (const exc of exceptions) {
            //console.info("Exception:", exc);
            if (!exc) continue;

            //Exception type 1 (quotation marks): check if string bewteen quotes is present in full prompt
            if (exc.startsWith(`'`) && exc.endsWith(`'`)) {
                const keyword = exc.slice(1, -1);
                if (prompt.includes(keyword)) {
                    exceptionTriggered = true;
                    break;
                }
            }
            if (exc.startsWith(`"`) && exc.endsWith(`"`)) {
                const keyword = exc.slice(1, -1);
                if (prompt.includes(keyword)) {
                    exceptionTriggered = true;
                    break;
                }
            }

            //Exception type 2 ("(color)"): check color variants
            else if (exc.includes("(color)")) {
                for (const color of simpleColorArray) {
                    const variants = [
                        `${color} ${exc.replace("(color)", "").trim()}`,
                        `light ${color} ${exc.replace("(color)", "").trim()}`,
                        `dark ${color} ${exc.replace("(color)", "").trim()}`,
                        `${color}-striped ${exc.replace("(color)", "").trim()}`
                    ];
                    if (variants.some(v => promptSet.has(v))) {
                        exceptionTriggered = true;
                        break;
                    }
                }
            }

            //Exception type 3 ("(type)"): check if any type+" "+keyword is present exactly
            else if (exc.includes("(type) ")) {
                for (const type of simpleTypeArray) {
                    if (promptSet.has(`${type} ${exc.replace("(type) ", "").trim()}`)) {
                        exceptionTriggered = true;
                        break;
                    }
                }
            }

            //Exception type 4 ("scene"): check if any keyword from finalKeywordSet.[exception] is present exactly
            else if (exc.startsWith("scene")) {
                const setName = exc;
                if (finalKeywordSet[setName]) {
                    for (const sceneWord of finalKeywordSet[setName]) {
                        if (promptSet.has(sceneWord)) {
                            exceptionTriggered = true;
                            break;
                        }
                    }
                }
            }

            //Exception type final (no special instructions): check if keyword is present exactly
            else {
                if (promptSet.has(exc.trim())) {
                    exceptionTriggered = true;
                    break;
                }
            }

            if (exceptionTriggered) break; // cancel early if any are met
        }

        //Proceed only if no exceptions met, cancel early if any are met (empty exceptions means auto-pass)
        if (exceptionTriggered) continue;

        //console.info("Requirements met, exceptions not triggered. Continuing on: ", current);

        //Addition appending, for each keyword to be appended...
        promptSet = appendWords(promptSet, negative, additions);
    }

    return Array.from(promptSet).join(", ");
}

function appendWords(promptSet, negative, additions) {
    var negativeSet = new Set(negative.split(", ").filter(Boolean));
	for (const addition of additions) {
		var trimmedAdd = addition.trim();
		if (promptSet.has(trimmedAdd)) continue; // already present

		let addAllowed = true;

		console.log("Keyword to be appended: "+ trimmedAdd);   
		if (setOfKeywordsToTriggerExclusiveCategory.has(trimmedAdd)) {
			//console.info("Potential conflict. Checking exclusive categories...");
			for (const cat of exclusiveCategories) {
				var catConflict = false;
				//console.info(cat);
				for (const fullLine of cat.contents) {
					if (!fullLine.includes(", ")) {
						if (trimmedAdd == fullLine) {
							catConflict = true;
							break;
						}
					}
					else {
						//If a comma is present, if means this is a collection of synonyms.
						const expandedLine = fullLine.split(", ");
						for (var word of expandedLine) {
							if (trimmedAdd == word) {
								catConflict = true;
								break;
							}
						}
					}
				}
				if (catConflict == true) {
					console.log("Keyword conflicts with exclusive category:", cat.index, " - Now checking if another keyword in that category is already present in the prompt...");
					for (const fullLine of cat.contents) {
						if (fullLine.includes(", ")) {
							const splitLine = fullLine.split(", ");
							for (var word of splitLine) {
								if (promptSet.has(word) && splitLine.includes(trimmedAdd) == false) {
									addAllowed = false;
								}
							}
						}
						else {
							if (promptSet.has(fullLine)) {
								addAllowed = false;
							}
						}
					}
				}
				/*
				// Expand comma-separated entries into individual keywords
				const expandedGroups = cat.contents.map(c => c.split(", ").map(x => x.trim()));
				for (const group of expandedGroups) {
					// If the group contains the addition keyword, check if any other in the group is present
					if (group.includes(trimmedAdd)) {
						if (group.some(g => g !== trimmedAdd && promptSet.has(g))) {
							addAllowed = false;
							break;
						}
					}
					// Or if any synonym group includes a prompt keyword that blocks this addition
					else if (group.some(g => promptSet.has(g)) && group.some(g => g === trimmedAdd)) {
						addAllowed = false;
						break;
					}
				}
				*/
			}
			if (!addAllowed || negativeSet.has(trimmedAdd)) {
				continue;
			}
			else {
				promptSet.add(trimmedAdd);
			}
		}
		else {
			if (!addAllowed || negativeSet.has(trimmedAdd)) {
				continue;
			}
			else {
				promptSet.add(trimmedAdd);
			}
		}
	}
    return promptSet;
}


// Replace whole categories if ordered
function replaceTargetCategories(prompt) {
    prompt = prompt.replace("remove all ", "replace ");
    prompt = prompt.replace("remove ", "replace ");
    prompt = prompt.replace("replace all ", "replace ");
    prompt = prompt.replace("replace clothing", "replace clothes");
    prompt = prompt.replace("replace character", "replace body");
    prompt = prompt.replace("replace shot", "replace scene");
    prompt = prompt.replace("replace location", "replace background");
    prompt = prompt.replace("replace bg", "replace background");
    var culledKeywords = "";
	var quickPromptsReplaceArray = ["clothes", "body", "scene", "background"];
    for (var quickPromptsReplaceIndex = 0; quickPromptsReplaceIndex < quickPromptsReplaceArray.length; quickPromptsReplaceIndex++) {
        //console.info("Checking for " + quickPromptsReplaceArray[quickPromptsReplaceIndex]);
        if (prompt.includes("replace " + quickPromptsReplaceArray[quickPromptsReplaceIndex])) {
            if (quickPromptsReplaceArray[quickPromptsReplaceIndex] == "body") {
                //todo
            }
            console.info("Replacing " + quickPromptsReplaceArray[quickPromptsReplaceIndex]);
            var bulkResult = cullBulkKeywords(prompt, "replace " + quickPromptsReplaceArray[quickPromptsReplaceIndex]);
            culledKeywords += (culledKeywords ? ", " : "") + bulkResult[1];
            prompt = bulkResult[0];
            prompt = prompt.replaceAll("replace " + quickPromptsReplaceArray[quickPromptsReplaceIndex], "");
        }
    }
	return [prompt, culledKeywords];
}

// Prompt alias replacements
function replaceAliasShortcuts(prompt) {
	prompt = prompt.split(", ");
	// cleanupAliasArray parses into cleanedAliasArray and leaves aliasArray a raw string,
	// so iterating aliasArray walked characters and .target was always undefined.
	for (var alias = 0; alias < cleanedAliasArray.length; alias++) {
		if (!cleanedAliasArray[alias].target || !cleanedAliasArray[alias].replacement) {
			continue; // blank lines in aliasDB parse to an empty entry
		}
		var aliasTarget = "." + cleanedAliasArray[alias].target.trim().toLowerCase();
		var aliasReplacement = "." + cleanedAliasArray[alias].replacement.trim().toLowerCase();
		for (promptIndex = 0; promptIndex < prompt.length; promptIndex++) {
			// prompt is an array here, so assign the element - .replaceAll would throw
			if (prompt[promptIndex].toLowerCase() == aliasTarget) {
				prompt[promptIndex] = aliasReplacement;
			}
		}
	}
	return prompt.join(", ");
}

// Which codenames actually exist, built once from cleanedCharacterArray. Kept
// local to v1 rather than borrowing v2's buildCharacterIndex, so v1 still works
// with webui2.js absent.
var v1CodenameSet = null;
function knownCodename(codename) {
	if (!v1CodenameSet) {
		v1CodenameSet = {};
		if (typeof cleanedCharacterArray !== "undefined") {
			for (var c = 0; c < cleanedCharacterArray.length; c++) {
				var entry = cleanedCharacterArray[c];
				if (entry && entry.codename) {
					v1CodenameSet[String(entry.codename).trim().toLowerCase()] = true;
				}
			}
		}
	}
	return !!v1CodenameSet[String(codename).toLowerCase()];
}

// `.syrupMayor` names a PAIR. Returns the form to actually use — `.fleshy` when
// asked for and available, `.fur` otherwise, and the stem itself when there is
// no pair at all, which is how a universal character like `.syrupYu` works
// without needing to be listed anywhere.
function resolveSyrupStemV1(stem, wantsFleshy) {
	var lower = String(stem).toLowerCase();
	if (lower.indexOf(".syrup") !== 0) { return lower; }
	var name = lower.slice(6);
	var fur = ".fur" + name;
	var fleshy = ".fleshy" + name;
	var hasFur = knownCodename(fur);
	var hasFleshy = knownCodename(fleshy);
	if (!hasFur && !hasFleshy) { return lower; }
	if (wantsFleshy && hasFleshy) { return fleshy; }
	if (hasFur) { return fur; }
	return fleshy;
}

// Prompt character shortcut replacements
function replaceBasicShortcuts(prompt) {
    prompt = prompt.split(", ");
	// Read ONCE, off the typed prompt. A fleshy entry's own text contains
	// `not furry`, so deciding this per-tag as expansion proceeds would let the
	// first human in a mixed scene turn everyone after her human too.
	var wantsFleshy = prompt.includes("not furry");
	for (var shorty = 0; shorty < basicShortcutArray.length; shorty++) {
        for (var promptIndex = 0; promptIndex < prompt.length; promptIndex++) {
            if (prompt[promptIndex] == basicShortcutArray[shorty][0]) {
                prompt[promptIndex] = resolveSyrupStemV1(basicShortcutArray[shorty][1], wantsFleshy);
            }
        }
    }
	return prompt.join(", ");
}

// Prompt outfit and character replacements
function replaceCharacterShortcuts(prompt) {
	//First check if any characters present
    var foundCharacter = "";
    prompt = prompt.split(", ");
    for (var charName = 0; charName < cleanedCharacterArray.length; charName++) {
        for (promptIndex = 0; promptIndex < prompt.length; promptIndex++) {
            if (prompt[promptIndex].toLowerCase() == cleanedCharacterArray[charName].codename) {
                foundCharacter = cleanedCharacterArray[charName].codename;
                promptIndex = prompt.length;
            }
        }
    }
    //If no characters present, try again with brands removed
    if (foundCharacter == "") {
        //console.info("No characters found, doing things the hard way");
        for (var brand = 0; brand < brandArray.length; brand++) {
            for (var charName = 0; charName < cleanedCharacterArray.length; charName++) {
                for (promptIndex = 0; promptIndex < prompt.length; promptIndex++) {
                    if (prompt[promptIndex].toLowerCase().replace(brandArray[brand], "") == "."+cleanedCharacterArray[charName].codename.replace(brandArray[brand], "")) {
                        foundCharacter = cleanedCharacterArray[charName].codename;
                        promptIndex = prompt.length;
                    }
                }
            }
        }
    }
    //If no characters STILL present, try again using first keyword of characters
    if (foundCharacter == "" && prompt.join(", ").includes(".")) {
        console.info("Still no characters found, now doing things the REALLY hard way.")
        for (var charName = 0; charName < cleanedCharacterArray.length; charName++) {
            var firstKeyword = cleanedCharacterArray[charName].prompt.split(", ")[0];
            var characterName = "";
            //Case 1: First keyword contains \\(
            if (firstKeyword.includes("\\(")) {
                characterName = firstKeyword.split(" \\(")[0];
            }
            //Case 2: First keyword contains ()
            else if (firstKeyword.includes("(")) {
                characterName = firstKeyword.split(" (")[0];
            }
            //Case 3: First keyword does not contain ()
            else {
                characterName = firstKeyword;
            }
            for (promptIndex = 0; promptIndex < prompt.length; promptIndex++) {
                //console.info("Comparing " + prompt[promptIndex] + " to " + characterName + " and " + firstKeyword);
                if (restoreParens(prompt[promptIndex].toLowerCase()) == "."+characterName || restoreParens(prompt[promptIndex].toLowerCase()) == "."+firstKeyword) {
                    foundCharacter = cleanedCharacterArray[charName].codename;
                    promptIndex = prompt.length;
                }
            }
        }
    }
    //Replace basic outfit types with first found character
    if (foundCharacter != "") {
        for (var outfitType = 0; outfitType < outfitTypesList.length; outfitType++) {
            for (promptIndex = 0; promptIndex < prompt.length; promptIndex++) {
                if (prompt[promptIndex].toLowerCase() == outfitTypesList[outfitType] || "*"+prompt[promptIndex].toLowerCase() == outfitTypesList[outfitType]) {
                    prompt[promptIndex] = foundCharacter+"*"+outfitTypesList[outfitType];
                }
            }
        }
    }
    var replacementsToMakeArray = [];
    //Actually replace character and outfit details, first checking codenames exactly
    for (var charName = 0; charName < cleanedCharacterArray.length; charName++) {
        for (promptIndex = 0; promptIndex < prompt.length; promptIndex++) {
            if (prompt[promptIndex].toLowerCase() == cleanedCharacterArray[charName].codename) {
                prompt[promptIndex] = cleanedCharacterArray[charName].prompt;
                for (var replacements = 0; replacements < cleanedCharacterArray[charName].replacements.length; replacements++) {
                    replacementsToMakeArray.push(cleanedCharacterArray[charName].replacements[replacements]);
                }
            }
        }
    }
    for (var outfitName = 0; outfitName < cleanedOutfitArray.length; outfitName++) {
        for (promptIndex = 0; promptIndex < prompt.length; promptIndex++) {
            if (prompt[promptIndex].toLowerCase() == cleanedOutfitArray[outfitName].codename) {
                prompt[promptIndex] = cleanedOutfitArray[outfitName].prompt;
                for (var replacements = 0; replacements < cleanedOutfitArray[outfitName].replacements.length; replacements++) {
                    replacementsToMakeArray.push(cleanedOutfitArray[outfitName].replacements[replacements]);
                }
            }
        }
    }
    if (prompt.join(", ").includes(".")) {//If . is still present in the prompt, try replacing again with brands removed
        for (var brand = 0; brand < brandArray.length; brand++) {
            for (var charName = 0; charName < cleanedCharacterArray.length; charName++) {
                for (promptIndex = 0; promptIndex < prompt.length; promptIndex++) {
                    if (prompt[promptIndex].toLowerCase().replace(brandArray[brand], "") == "."+cleanedCharacterArray[charName].codename.replace(brandArray[brand], "")) {
                        prompt[promptIndex] = cleanedCharacterArray[charName].prompt;
                        for (var replacements = 0; replacements < cleanedCharacterArray[charName].replacements.length; replacements++) {
                            replacementsToMakeArray.push(cleanedCharacterArray[charName].replacements[replacements]);
                        }
                    }
                }
            }
            for (var outfitName = 0; outfitName < cleanedOutfitArray.length; outfitName++) {
                for (promptIndex = 0; promptIndex < prompt.length; promptIndex++) {
                    if (prompt[promptIndex].toLowerCase().replace(brandArray[brand], "") == "."+cleanedOutfitArray[outfitName].codename.replace(brandArray[brand], "")) {
                        prompt[promptIndex] = cleanedOutfitArray[outfitName].prompt;
                        for (var replacements = 0; replacements < cleanedOutfitArray[outfitName].replacements.length; replacements++) {
                            replacementsToMakeArray.push(cleanedOutfitArray[outfitName].replacements[replacements]);
                        }
                    }
                }
            }
        }
    }
    if (prompt.join(", ").includes(".")) {//If . is still present in the prompt, try replacing again by checking character's first keywords
        for (var charName = 0; charName < cleanedCharacterArray.length; charName++) {
            var firstKeyword = cleanedCharacterArray[charName].prompt.split(", ")[0];
            var characterName = "";
            //Case 1: First keyword contains \\(
            if (firstKeyword.includes("\\(")) {
                characterName = firstKeyword.split(" \\(")[0];
            }
            //Case 2: First keyword contains ()
            else if (firstKeyword.includes("(")) {
                characterName = firstKeyword.split(" (")[0];
            }
            //Case 3: First keyword does not contain ()
            else {
                characterName = firstKeyword;
            }
            for (promptIndex = 0; promptIndex < prompt.length; promptIndex++) {
                //console.info("Comparing " + prompt[promptIndex] + " to " + characterName + " and " + firstKeyword);
                if (restoreParens(prompt[promptIndex].toLowerCase()) == "."+characterName || restoreParens(prompt[promptIndex].toLowerCase()) == "."+firstKeyword) {
                    prompt[promptIndex] = cleanedCharacterArray[charName].prompt;
                    for (var replacements = 0; replacements < cleanedCharacterArray[charName].replacements.length; replacements++) {
                        replacementsToMakeArray.push(cleanedCharacterArray[charName].replacements[replacements]);
                    }
                }
            }
        }
    }
    prompt = prompt.join(", ")
    prompt = prompt.split(", ");

    //Character and outfit replacements
    //console.info(replacementsToMakeArray);
    for (var replacement = 0; replacement < replacementsToMakeArray.length; replacement++) {
        for (promptIndex = 0; promptIndex < prompt.length; promptIndex++) {
            //console.info(prompt[promptIndex])
            if (prompt[promptIndex] == replacementsToMakeArray[replacement].split("; ")[0]) {
                prompt[promptIndex] = replacementsToMakeArray[replacement].split("; ")[1];
            }
        }
    }
    return prompt.join(", ");
}

// Prompt genital shortcut unpacking
function replaceGenitalShortcuts(prompt) {
    var keywordsToClean = prompt.split(", ")
    for (keyword = 0; keyword < keywordsToClean.length; keyword++) {
        //console.info("Checking shortcut keyword: "+keywordsToClean[keyword].charAt(0).toUpperCase() + keywordsToClean[keyword].toLowerCase().slice(1))
        keywordsToClean[keyword] = keywordsToClean[keyword].replace("S. ", "Small ");
        keywordsToClean[keyword] = keywordsToClean[keyword].replace("L. ", "Large ");
        keywordsToClean[keyword] = keywordsToClean[keyword].replace("H. ", "Huge ");
        keywordsToClean[keyword] = keywordsToClean[keyword].replace("G. ", "Hyper ");
        for (size = 0; size < genitalSizeTags.length; size++) {
            for (color = 0; color < genitalColorTags.length; color++) {
                for (colorVariant = 0; colorVariant < genitalVariantTags.length; colorVariant++) {
                    for (shortcut = 0; shortcut < genitalShortcutArray.length; shortcut++) {
                        var nameToTest = 
                            genitalSizeTags[size].charAt(0).toUpperCase() + genitalSizeTags[size].slice(1) +
                            genitalVariantTags[colorVariant].charAt(0).toUpperCase() + genitalVariantTags[colorVariant].slice(1) +
                            genitalColorTags[color].charAt(0).toUpperCase() + genitalColorTags[color].slice(1) +
                            genitalShortcutArray[shortcut][0] + ''
                        ;
                        //Convert to proper case for testing
                        nameToTest = nameToTest.charAt(0).toUpperCase() + nameToTest.toLowerCase().slice(1);
                        //console.info(`Checking ${nameToTest}`);
                        if (keywordsToClean[keyword].charAt(0) + keywordsToClean[keyword].toLowerCase().slice(1) == nameToTest) {
                            //console.info(`Found shortcut ${nameToTest}`);
                            keywordsToClean[keyword] = genitalShortcutArray[shortcut][1];
                            var keywordToAdd = "";
                            if (genitalSizeTags[size] != "" && genitalSizeTags[size] != "medium") {
                                keywordToAdd += ", "+genitalSizeTags[size] + genitalShortcutArray[shortcut][2];
                            }
                            if (genitalVariantTags[colorVariant] != "") {
                                if (genitalColorTags[color] != "") {
                                    keywordToAdd += ", "+genitalVariantTags[colorVariant] + genitalColorTags[color] + genitalShortcutArray[shortcut][2];
                                }
                                else {
                                    keywordToAdd += ", "+genitalVariantTags[colorVariant] + genitalShortcutArray[shortcut][2];
                                }
                            }
                            else {
                                keywordToAdd += ", "+genitalColorTags[color] + genitalShortcutArray[shortcut][2];
                            }
                            keywordsToClean[keyword] += keywordToAdd;
                        }
                    }
                }
            }
        }
    }
    prompt = keywordsToClean.join(", ");
    return prompt
}

// Prompt keyword sorting by category
function sortPromptByCategory(prompt) {
	var bodyKeywords = cullBulkKeywords(restoreParens(prompt), "remove body")[1];
	prompt = cullBulkKeywords(prompt, "remove body")[0];
	var clothesKeywords = cullBulkKeywords(restoreParens(prompt), "remove clothes")[1];
	prompt = cullBulkKeywords(prompt, "remove clothes")[0];
	var sceneKeywords = cullBulkKeywords(restoreParens(prompt), "remove scene")[1];
	prompt = cullBulkKeywords(prompt, "remove scene")[0];
    var backgroundKeywords = cullBulkKeywords(restoreParens(prompt), "remove background")[1];
    prompt = cullBulkKeywords(prompt, "remove background")[0];
	return protectParens(sortPromptByItem(bodyKeywords, "body") + ", " + sortPromptByItem(clothesKeywords, "clothes") + ", " + sortPromptByItem(sceneKeywords, "scene") + ", " + sortPromptByItem(backgroundKeywords, "background") + ", " + prompt);
}

// Prompt keyword sorting by item
function sortPromptByItem(prompt) {
	// v1 compares text, so it needs the real members. No cost once they are built.
	ensureFullKeywordSets();
	/*prompt = prompt.split(", ");
	return removeDuplicates(prompt.join(", "));*/
     // Split input string into tags
  if (!prompt) return "";

  const tags = prompt.split(",").map(t => t.trim()).filter(Boolean);

  // Build a Map only for tags present in this prompt
  const priorityIndex = new Map();
  let idx = 0;

  for (const tag of tags) {
    for (const [catName, catSet] of Object.entries(finalKeywordSet)) {
      if (catSet.has(tag) && !priorityIndex.has(tag)) {
        priorityIndex.set(tag, idx++);
      }
    }
  }

  // Sort
  const sorted = tags.slice().sort((a, b) => {
    const ia = priorityIndex.has(a) ? priorityIndex.get(a) : Infinity;
    const ib = priorityIndex.has(b) ? priorityIndex.get(b) : Infinity;
    return ia - ib || a.localeCompare(b);
  });

  return sorted.join(", ");
}

// Prompt inclusion protection

// Prompt culling
var quickPromptsCullArray = ["remove clothes", "remove body", "remove scene", "remove background", "nude", "topless", "bottomless", "barefoot", "cowboy shot", "upper body only", "head out of frame", "eyes out of frame", "lower body only", "feet out of frame", "head only", "head shot", "chest up", "chest shot", "crotch shot", "ass shot", "butt shot", "foot shot", "closed eyes", "closed mouth", "facing away", "bulge", "cameltoe", "clitoris slip", "areola slip", "covered nipples", "legless", "featureless breasts", "featureless crotch"];
function cullTargetCategories(prompt) {
	var culledKeywords = ""
	var prompt = prompt.split(", ");

    for (var promptIndex = 0; promptIndex < prompt.length; promptIndex++) {
        if (prompt[promptIndex] != "" && quickPromptsCullArray.includes(prompt[promptIndex])) {
            for (var cullingIndex = 0; cullingIndex < quickPromptsCullArray.length; cullingIndex++) {
                if (prompt[promptIndex] == quickPromptsCullArray[cullingIndex]) {
                    culledKeywords += ", " + cullBulkKeywords(prompt.join(", "), prompt[promptIndex])[1];
                }
            }
        }
    }
    culledKeywords = culledKeywords.split(",");
    culledKeywords = removeDuplicates(culledKeywords.join(", "));

    //console.info(culledKeywords);
	return [prompt.join(", "), culledKeywords];
}

function uncullTargetCategories(prompt, culled) {
    if (culled == null) {
        culled = "";
    }
    culledKeywords = culled.split(", ");
    if (culledKeywords.length > 0) {
        for (culledIndex = 0; culledIndex < culledKeywords.length; culledIndex++) {
            if (prompt.includes("hooved hands")) {
                if (culledKeywords[culledIndex].includes("hooves")) {
                    prompt = prompt+", "+culledKeywords[culledIndex];
                    culledKeywords.splice(culledIndex, 1);
                    culledIndex--;
                }
            }
        }
        culled = culledKeywords.join(", ");
    }
    return [prompt, culled]
}

function cullKeywords(keywordString, categoryName, protectedKeyword) {
    ensureFullKeywordSets();
    if (protectedKeyword == null) {
        protectedKeyword = "";
    }
    // An unknown category name would throw on .has() and kill the whole generation.
    // Happens when a cull list names a category that was never built, or when a tag in
    // quickPromptsCullArray has no matching case and the category string gets iterated
    // character by character.
    if (!finalKeywordSet[categoryName]) {
        console.warn("Unknown cull category, skipping: ", categoryName);
        return { remaining: keywordString, culled: "" };
    }
    //console.info(categoryName);
    const keywordArray = keywordString.split(", ");
    const keepArray = [];
    const cullArray = [];

    for (const kw of keywordArray) {
        if (finalKeywordSet[categoryName].has(kw) && kw != protectedKeyword) {
            cullArray.push(kw);
        } else {
            keepArray.push(kw);
        }
    }

    return {
        remaining: keepArray.join(", "),
        culled: cullArray.join(", ")
    };
}

function cullBulkKeywords(keywordString, categoryNames) {
    //console.info("Culling "+categoryNames);
    var protectedKeyword = "";
    if (typeof categoryNames === "string") {
        protectedKeyword = categoryNames;
    }
    switch (categoryNames) { 
        case "replace clothes": {
            categoryNames = [
                "clothesFullwear", "clothesHeadwear", "clothesForeheadwear", "clothesFacewear", "clothesEyewear", "clothesMouthwear", "clothesEarwear", "clothesNeckwear", "clothesShoulderwear", "clothesArmwear", "clothesWristwear", "clothesHandwear", "clothesUpperwear", "clothesUpperwearOuter", "clothesUpperwearMiddle", "clothesUpperwearInner", "clothesUpperwearUnder", "clothesUpperwear", "clothesNipplewear", "clothesWaistwear", "clothesLowerwear", "clothesLowerwearOuter", "clothesLowerwearInner", "clothesLowerwearUnder", "clothesLowerwear", "clothesLegwearUpper", "clothesLegwearLower", "clothesFootwear", "weapons", "clothesUnsorted",
            ] 
        break; 
        }
        case "replace body": {
            categoryNames = [
                "bodyBrand", "bodyRace", "bodyHead", "bodyHair", "bodyFace", "bodyOrbital", "bodyEyes", "bodyMuzzle", "bodyTeeth", "bodyTorso", "bodyBack", "bodyWings", "bodyChest", "bodyBreasts", "bodyAreolae", "bodyNipples", "bodyArms", "bodyHands", "bodyFingernails", "bodyBelly", "bodyWaist", "bodyPenis", "bodyBalls", "bodyPussy", "bodyClit", "bodyButt", "bodyAnus", "bodyTail", "bodyLegs", "bodyFeet", "bodyToenails", "bodyUnsorted",
            ] 
        break; 
        }
        case "replace scene": {
            categoryNames = [
                "sceneFullwear",
                "sceneHeadwear",
                "sceneForeheadwear",
                "sceneFacewear",
                "sceneEyewear",
                "sceneMouthwear",
                "sceneEarwear",
                "sceneNeckwear",
                "sceneShoulderwear",
                "sceneArmwear",
                "sceneWristwear",
                "sceneHandwear",
                "sceneUpperwearOuter",
                "sceneUpperwearMiddle",
                "sceneUpperwearInner",
                "sceneUpperwearUnder",
                "sceneUpperwear",
                "sceneNipplewear",
                "sceneWaistwear",
                "sceneLowerwearOuter",
                "sceneLowerwearInner",
                "sceneLowerwearUnder",
                "sceneLowerwear",
                "sceneLegwearUpper",
                "sceneLegwearLower",
                "sceneFootwear",
                "sceneRace",
                "sceneHead",
                "sceneHair",
                "sceneFace",
                "sceneOrbital",
                "sceneEyes",
                "sceneMuzzle",
                "sceneTeeth",
                "sceneTorso",
                "sceneWings",
                "sceneChest",
                "sceneBreasts",
                "sceneNipples",
                "sceneArms",
                "sceneHands",
                "sceneFingernails",
                "sceneWaist",
                "sceneTail",
                "scenePenis",
                "sceneBalls",
                "scenePussy",
                "sceneClit",
                "sceneButt",
                "sceneAnus",
                "sceneLegs",
                "sceneFeet",
                "sceneToenails",
                "sceneCount",
                "sceneInternal",
                "sceneCum",
                "sceneFx",
                "sceneToys",
                "scenePartner",
                "sceneCamera",
                "sceneUnsorted",
            ] 
        break; 
        }
        case "replace background": {
            categoryNames = [
                "backgroundSimple",
                "backgroundIndoors",
                "backgroundOutdoors",
                "backgroundOther",
                "backgroundObjects",
                "backgroundUnsorted",
            ] 
        break; 
        }
        case "remove clothes": {
            categoryNames = [
                "clothesFullwear", "clothesHeadwear", "clothesForeheadwear", "clothesFacewear", "clothesEyewear", "clothesMouthwear", "clothesEarwear", "clothesNeckwear", "clothesShoulderwear", "clothesArmwear", "clothesWristwear", "clothesHandwear", "clothesUpperwear", "clothesUpperwearOuter", "clothesUpperwearMiddle", "clothesUpperwearInner", "clothesUpperwearUnder", "clothesUpperwear", "clothesNipplewear", "clothesWaistwear", "clothesLowerwear", "clothesLowerwearOuter", "clothesLowerwearInner", "clothesLowerwearUnder", "clothesLowerwear", "clothesLegwearUpper", "clothesLegwearLower", "clothesFootwear", "weapons", "clothesUnsorted",
            ] 
        break; 
        }
        case "remove body": {
            categoryNames = [
                "bodyBrand", "bodyRace", "bodyHead", "bodyHair", "bodyFace", "bodyOrbital", "bodyEyes", "bodyMuzzle", "bodyTeeth", "bodyTorso", "bodyBack", "bodyWings", "bodyChest", "bodyBreasts", "bodyAreolae", "bodyNipples", "bodyArms", "bodyHands", "bodyFingernails", "bodyBelly", "bodyWaist", "bodyPenis", "bodyBalls", "bodyPussy", "bodyClit", "bodyButt", "bodyAnus", "bodyTail", "bodyLegs", "bodyFeet", "bodyToenails", "bodyUnsorted",
            ] 
        break; 
        }
        case "remove scene": {
            categoryNames = [
                "sceneFullwear",
                "sceneHeadwear",
                "sceneForeheadwear",
                "sceneFacewear",
                "sceneEyewear",
                "sceneMouthwear",
                "sceneEarwear",
                "sceneNeckwear",
                "sceneShoulderwear",
                "sceneArmwear",
                "sceneWristwear",
                "sceneHandwear",
                "sceneUpperwearOuter",
                "sceneUpperwearMiddle",
                "sceneUpperwearInner",
                "sceneUpperwearUnder",
                "sceneUpperwear",
                "sceneNipplewear",
                "sceneWaistwear",
                "sceneLowerwearOuter",
                "sceneLowerwearInner",
                "sceneLowerwearUnder",
                "sceneLowerwear",
                "sceneLegwearUpper",
                "sceneLegwearLower",
                "sceneFootwear",
                "sceneRace",
                "sceneHead",
                "sceneHair",
                "sceneFace",
                "sceneOrbital",
                "sceneEyes",
                "sceneMuzzle",
                "sceneTeeth",
                "sceneTorso",
                "sceneWings",
                "sceneChest",
                "sceneBreasts",
                "sceneNipples",
                "sceneArms",
                "sceneHands",
                "sceneFingernails",
                "sceneWaist",
                "sceneTail",
                "scenePenis",
                "sceneBalls",
                "scenePussy",
                "sceneClit",
                "sceneButt",
                "sceneAnus",
                "sceneLegs",
                "sceneFeet",
                "sceneToenails",
                "sceneCount",
                "sceneInternal",
                "sceneCum",
                "sceneFx",
                "sceneToys",
                "scenePartner",
                "sceneCamera",
                "sceneUnsorted",
            ] 
        break; 
        }
        case "remove background": {
            categoryNames = [
                "backgroundSimple",
                "backgroundIndoors",
                "backgroundOutdoors",
                "backgroundOther",
                "backgroundObjects",
                "backgroundUnsorted",
            ] 
        break; 
        }
        case "nude": {
            categoryNames = [
                "clothesFullwear", "clothesUpperwearOuter", "clothesUpperwearMiddle", "clothesUpperwearInner", "clothesUpperwearUnder", "clothesUpperwear", "clothesLowerwearOuter", "clothesLowerwearInner", "clothesLowerwearUnder", "clothesLowerwear"
            ]
        break; 
        }
        case "topless": {
            categoryNames = [
                "clothesUpperwearOuter", "clothesUpperwearMiddle", "clothesUpperwearInner", "clothesUpperwearUnder", "clothesUpperwear"
            ]
        break; 
        }
        case "bottomless": {
            categoryNames = [
                "clothesLowerwearInner", "clothesLowerwearUnder", "clothesLowerwear"
            ]
        break; 
        }
        case "barefoot": {
            categoryNames = [
                "clothesLegwearUpper", "clothesLegwearLower", "clothesFootwear"
            ]
        break; 
        }
        case "cowboy shot": {
            categoryNames = [
                "clothesLegwearLower", "clothesFootwear", "bodyFeet", "bodyToenails"
            ]
        break; 
        }
        case "upper body only": {
            categoryNames = [
                "clothesLowerwearOuter", "clothesLowerwearInner", "clothesLowerwearUnder", "clothesLowerwear", "clothesLegwearUpper", "clothesLegwearLower", "clothesFootwear", "bodyPenis", "bodyBalls", "bodyPussy", "bodyClit", "bodyButt", "bodyAnus", "bodyTail", "bodyLegs", "bodyFeet", "bodyToenails",
            ]
        break; 
        }
        case "lower body only": {
            categoryNames = [
                "clothesHeadwear", "clothesForeheadwear", "clothesFacewear", "clothesEyewear", "clothesMouthwear", "clothesEarwear", "clothesNeckwear", "clothesShoulderwear", "clothesArmwear", "clothesWristwear", "clothesHandwear", "clothesUpperwearOuter", "clothesUpperwearMiddle", "clothesUpperwearInner", "clothesUpperwearUnder", "clothesUpperwear", "clothesNipplewear", "bodyHead", "bodyHair", "bodyFace", "bodyOrbital", "bodyEyes", "bodyMuzzle", "bodyTeeth", "bodyTorso", "bodyBack", "bodyWings", "bodyChest", "bodyBreasts", "bodyAreolae", "bodyNipples", "bodyArms", "bodyHands", "bodyFingernails"
            ]
        break; 
        }
        case "head out of frame": {
            categoryNames = [
                "clothesHeadwear", "clothesForeheadwear", "clothesFacewear", "clothesEyewear", "clothesMouthwear", "clothesEarwear", "clothesNeckwear", "bodyHead", "bodyHair", "bodyFace", "bodyOrbital", "bodyEyes", "bodyMuzzle", "bodyTeeth", 
            ]
        break; 
        }
        case "eyes out of frame": {
            // The crop sits at eye level and cuts upward, so the eyes, brow, hair and anything
            // worn up there go; the lower face stays. Previously cut face/muzzle/teeth and kept
            // bodyEyes — the exact inverse of what the command names.
            categoryNames = [
                "clothesHeadwear", "clothesForeheadwear", "clothesEyewear", "bodyHead", "bodyHair", "bodyEyes", "bodyOrbital",
            ]
        break;
        }
        case "feet out of frame": {
            categoryNames = [
                "clothesLegwearLower", "clothesFootwear", "bodyFeet", "bodyToenails"
            ]
        break; 
        }
        case "head only": 
        case "head shot": {
            categoryNames = [
                "clothesFullwear", "clothesShoulderwear", "clothesArmwear", "clothesWristwear", "clothesHandwear", "clothesUpperwearOuter", "clothesUpperwearMiddle", "clothesUpperwearInner", "clothesUpperwearUnder", "clothesUpperwear", "clothesNipplewear", "clothesWaistwear", "clothesLowerwearOuter", "clothesLowerwearInner", "clothesLowerwearUnder", "clothesLegwearUpper", "clothesLegwearLower", "clothesLowerwear", "clothesFootwear", "weapons", "bodyBack", "bodyWings", "bodyChest", "bodyBreasts", "bodyAreolae", "bodyNipples", "bodyArms", "bodyHands", "bodyFingernails", "bodyBelly", "bodyWaist", "bodyPenis", "bodyBalls", "bodyPussy", "bodyClit", "bodyButt", "bodyAnus", "bodyTail", "bodyLegs", "bodyFeet", "bodyToenails",
            ] 
        break; 
        }
        case "chest up": {
            categoryNames = [
                "clothesWaistwear", "clothesLowerwearOuter", "clothesLowerwearInner", "clothesLowerwearUnder", "clothesLegwearUpper", "clothesLegwearLower", "clothesLowerwear", "clothesFootwear", "weapons", "bodyBelly", "bodyWaist", "bodyPenis", "bodyBalls", "bodyPussy", "bodyClit", "bodyButt", "bodyAnus", "bodyTail", "bodyLegs", "bodyFeet", "bodyToenails",
            ] 
        break; 
        }
        case "chest shot": {
            // Was head shot's body list pasted in, so a chest shot deleted the chest and kept
            // the shirt. Now cuts head-and-above plus belly-and-below, keeping neck through
            // torso: chest, breasts, areolae, nipples, arms, hands, fingernails, back, wings.
            categoryNames = [
                "clothesHeadwear", "clothesForeheadwear", "clothesFacewear", "clothesEyewear", "clothesMouthwear", "clothesEarwear", "bodyHead", "bodyHair", "bodyFace", "bodyOrbital", "bodyEyes", "bodyMuzzle", "bodyTeeth", "clothesWaistwear", "clothesLowerwearOuter", "clothesLowerwearInner", "clothesLowerwearUnder", "clothesLegwearUpper", "clothesLegwearLower", "clothesLowerwear", "clothesFootwear", "weapons", "bodyBelly", "bodyWaist", "bodyPenis", "bodyBalls", "bodyPussy", "bodyClit", "bodyButt", "bodyAnus", "bodyTail", "bodyLegs", "bodyFeet", "bodyToenails",
            ]
        break;
        }
        case "ass shot": {
            categoryNames = [
                "clothesHeadwear", "clothesForeheadwear", "clothesFacewear", "clothesEyewear", "clothesMouthwear", "clothesEarwear", "clothesNeckwear", "clothesShoulderwear", "clothesArmwear", "clothesWristwear", "clothesHandwear", "clothesUpperwearOuter", "clothesUpperwearMiddle", "clothesUpperwearInner", "clothesUpperwearUnder", "clothesUpperwear", "clothesNipplewear", "bodyHead", "bodyHair", "bodyFace", "bodyOrbital", "bodyEyes", "bodyMuzzle", "bodyTeeth", "bodyTorso", "bodyBack", "bodyWings", "bodyChest", "bodyBreasts", "bodyAreolae", "bodyNipples", "bodyArms", "bodyHands", "bodyFingernails", "clothesLegwearLower", "clothesFootwear", "bodyFeet", "bodyToenails"
            ] 
        break; 
        }
        case "crotch shot": {
            categoryNames = [
                "clothesHeadwear", "clothesForeheadwear", "clothesFacewear", "clothesEyewear", "clothesMouthwear", "clothesEarwear", "clothesNeckwear", "clothesShoulderwear", "clothesArmwear", "clothesWristwear", "clothesHandwear", "clothesUpperwearOuter", "clothesUpperwearMiddle", "clothesUpperwearInner", "clothesUpperwearUnder", "clothesUpperwear", "clothesNipplewear", "bodyHead", "bodyHair", "bodyFace", "bodyOrbital", "bodyEyes", "bodyMuzzle", "bodyTeeth", "bodyTorso", "bodyBack", "bodyWings", "bodyChest", "bodyBreasts", "bodyAreolae", "bodyNipples", "bodyArms", "bodyHands", "bodyFingernails", "clothesLegwearLower", "clothesFootwear", "bodyFeet", "bodyToenails"
            ] 
        break; 
        }
        case "closed eyes": {
            categoryNames = [
                "bodyEyes"
            ] 
        break; 
        }
        case "closed mouth": {
            categoryNames = [
                "bodyTeeth"
            ] 
        break; 
        }
        case "facing away": {
            categoryNames = [
                "clothesForeheadwear", "clothesFacewear", "clothesEyewear", "clothesMouthwear", "clothesNipplewear", "bodyFace", "bodyOrbital", "bodyEyes", "bodyMuzzle", "bodyTeeth", "bodyAreolae", "bodyNipples", "bodyBelly", "bodyClit"
            ] 
        break; 
        }
        case "bulge": {
            categoryNames = [
                "bodyPenis", "bodyBalls"
            ] 
        break; 
        }
        case "cameltoe": {
            categoryNames = [
                "bodyPussy", "bodyClit"
            ] 
        break; 
        }
        case "clitoris slip": {
            categoryNames = [
                "bodyPussy"
            ] 
        break; 
        }
        case "areola slip": {
            // The areola IS visible — that is what a slip means — so culling bodyNipples was
            // backwards and kept eating puffy/inverted/large nipples. What is not there is the
            // covering that failed.
            categoryNames = [
                "clothesNipplewear"
            ]
        break;
        }
        case "covered nipples": {
            // Something is over them, so areola detail (colour, size) cannot be seen. The
            // nipple tags stay: shape through fabric is the whole point of the tag.
            categoryNames = [
                "bodyAreolae"
            ]
        break;
        }
        case "legless": {
            categoryNames = [
                "clothesLegwearLower", "clothesFootwear", "bodyLegs", "bodyFeet", "bodyToenails",
            ] 
        break; 
        }
        case "featureless breasts": {
            categoryNames = [
                "bodyAreolae", "bodyNipples"
            ] 
        break; 
        }
        case "featureless crotch": {
            categoryNames = [
                "bodyPenis", "bodyBalls", "bodyPussy", "bodyClit",
            ] 
        break; 
        }
    };
    if (!protectedKeyword.includes("replace") && !protectedKeyword.includes("remove")) {
        var expandedCategoryNames = [];
        for (categoryCountIndex = 0; categoryCountIndex < categoryNames.length; categoryCountIndex++) {
            expandedCategoryNames.push(categoryNames[categoryCountIndex]);
            if (categoryNames[categoryCountIndex].includes("body")) {
                expandedCategoryNames.push(categoryNames[categoryCountIndex].replace("body", "scene"));
            }
            if (categoryNames[categoryCountIndex].includes("clothes")) {
                expandedCategoryNames.push(categoryNames[categoryCountIndex].replace("clothes", "scene"));
            }
        }
        categoryNames = expandedCategoryNames;
    }

    let remaining = keywordString;
    let culled = [];

    for (const category of categoryNames) {
        //console.info(keywordString, categoryNames);
        const results = cullKeywords(remaining, category, protectedKeyword);
        remaining = results.remaining;
        if (results.culled) {
            culled.push(results.culled);
        }
        //console.info(remaining, culled);
    }

    return [
        remaining.trim().replace(/^,|,$/g, ""),
        culled.join(", ")
    ];
}

// Negative cleanup
// Strip colour/size modifiers off a keyword: "dark red shirt" -> "shirt"
function stripKeywordModifiers(keyword) {
    var stripped = "" + keyword;
    stripped = stripped.replace("light ", "");
    stripped = stripped.replace("dark ", "");
    for (var colorIndex = 0; colorIndex < simpleColorArray.length; colorIndex++) {
        stripped = stripped.replace(simpleColorArray[colorIndex]+" ", "");
    }
    for (var typeIndex = 0; typeIndex < simpleTypeArray.length; typeIndex++) {
        stripped = stripped.replace(simpleTypeArray[typeIndex]+" ", "");
    }
    return stripped;
}

function negativeCleanup(negative, prompt) {
    var keywordsToRemove = [];
    // A removal term keeps whatever specificity it was written with:
    // "!hair" culls any hair, "!white hair" culls only white hair.
    function addRemovalTerm(term) {
        if (!term || term.trim() == "") {
            return;
        }
        var stripped = stripKeywordModifiers(term);
        keywordsToRemove.push({ term: term, stripped: stripped, specific: stripped != term });
    }

    //Clean !keywords out of prompt
    promptKeywords = prompt.split(", ");
    for (promptIndex = 0; promptIndex < promptKeywords.length; promptIndex++) {
        if (promptKeywords[promptIndex].startsWith("!")) {
            addRemovalTerm(promptKeywords[promptIndex].replace("!", ""));
            promptKeywords.splice(promptIndex, 1);
            promptIndex--;
        }
    }

    //Clean negatives out of prompt
    negativeKeywords = negative.split(", ");
    for (negativeIndex = 0; negativeIndex < negativeKeywords.length; negativeIndex++) {
        addRemovalTerm("" + negativeKeywords[negativeIndex]);
    }
    console.info(keywordsToRemove);

    for (promptIndex = 0; promptIndex < promptKeywords.length; promptIndex++) {
        for (cleaningIndex = 0; cleaningIndex < keywordsToRemove.length; cleaningIndex++) {
            var removal = keywordsToRemove[cleaningIndex];
            // A modified term ("white hair") matches exactly; a bare term ("hair")
            // matches any modified form of itself ("red hair", "dark blue hair").
            var isMatch = removal.specific
                ? promptKeywords[promptIndex] == removal.term
                : stripKeywordModifiers(promptKeywords[promptIndex]) == removal.stripped;
            //console.info("Testing " + promptKeywords[promptIndex] + " against " + removal.term);
            if (isMatch) {
                console.info("Match found");
                promptKeywords.splice(promptIndex, 1);
                promptIndex--;
                break;
            }
            if (removal.stripped == "penis") {
                if (promptKeywords[promptIndex] == "knot" || promptKeywords[promptIndex] == "medial ring" || promptKeywords[promptIndex] == "erection" || promptKeywords[promptIndex] == "erect penis" || promptKeywords[promptIndex] == "flaccid" || promptKeywords[promptIndex] == "flaccid penis" || promptKeywords[promptIndex] == "semi-erect" || promptKeywords[promptIndex] == "soft penis" || promptKeywords[promptIndex] == "half-erect") {
                    promptKeywords.splice(promptIndex, 1);
                    promptIndex--;
                }
            }
            if (removal.stripped == "pussy") {
                if (promptKeywords[promptIndex] == "plump labia" || promptKeywords[promptIndex] == "cleft of venus") {
                    promptKeywords.splice(promptIndex, 1);
                    promptIndex--;
                }
            }
        }
    }
    prompt = promptKeywords.join(", ");
    //console.info("promptKeywords:", promptKeywords);

    //Clean negatives
    negative += ", ";
    if (negative == ", ") {
        negative = "";
    }

    //Add basic shortcut negatives
    for (negativeIndex = 0; negativeIndex < basicNegativeArray.length; negativeIndex++) {
        var requirementsMet = 0;
        var requirementKeywords = basicNegativeArray[negativeIndex][0].split(", ");
        for (keywordIndex = 0; keywordIndex < requirementKeywords.length; keywordIndex++) {
            for (promptIndex = 0; promptIndex < promptKeywords.length; promptIndex++) {
                //console.info("Testing " + requirementKeywords[keywordIndex] + " against " + promptKeywords[promptIndex]);
                if (requirementKeywords[keywordIndex] == promptKeywords[promptIndex]) {
                    //console.info("Requirement met");
                    requirementsMet++;
                }
            }
        }
        //console.info("Testing requirement for " + basicNegativeArray[negativeIndex][1] + ": " + requirementsMet + "/" + requirementKeywords.length);
        if (requirementsMet == requirementKeywords.length) {
            negative += ", " + basicNegativeArray[negativeIndex][1];
        }
    }

    negative += ", " + basicNegative;
    negative += ", " + universalNegative;
    negativeKeywords = negative.split(",");
    negativeKeywords = negativeKeywords.map(k => k.trim()).filter(k => k !== "");
    //console.info("negativeKeywords:", negativeKeywords);

    //Clean positives out of automatic negatives
    for (let i = 0; i < negativeKeywords.length; i++) {
        if (promptKeywords.includes(negativeKeywords[i])) {
            negativeKeywords.splice(i, 1);
            i--;
        }
    }
    negative = negativeKeywords.join(", ");
    return [negative, prompt];
}

// Prompt cull by negative

// Prompt final corrections

function replaceCleanup(prompt, negative, ruleset) {
	// Split prompt into keywords and trim each one
	let keywords = prompt.split(",").map(k => k.trim()).filter(k => k !== "");

	// Apply each rule one-by-one
	for (const rule of ruleset) {
		const requirements = rule.requirement
			? rule.requirement.split(",").map(s => s.trim()).filter(s => s !== "")
			: [];
		const exceptions = rule.exception
			? rule.exception.split(",").map(s => s.trim()).filter(s => s !== "")
			: [];
		const targets = rule.target
			? rule.target.split(",").map(s => s.trim()).filter(s => s !== "")
			: [];

		// Check requirements and exceptions
		const requirementsMet = requirements.every(req => keywords.includes(req));
		const exceptionsAbsent = exceptions.every(exc => !keywords.includes(exc));

		if (requirementsMet && exceptionsAbsent) {
			let replacementMade = false;

			for (let i = 0; i < keywords.length; i++) {
				if (targets.includes(keywords[i])) {
					if (!replacementMade) {
						if (rule.replacement === "") {
							keywords.splice(i, 1);
							i--;
						} else {
							const replacements = rule.replacement
								.split(",")
								.map(r => r.trim())
								.filter(r => r !== "");
							keywords.splice(i, 1, ...replacements);
							i += replacements.length - 1;
						}
						replacementMade = true;
					} else {
						keywords.splice(i, 1);
						i--;
					}
				}
			}
		}
	}
	
	//console.info("keywords:", keywords);  
    let negativeKeywords = negative.split(",");
    negativeKeywords = negativeKeywords.map(k => k.trim()).filter(k => k !== "");
    //console.info("negativeKeywords:", negativeKeywords);
    for (let keywordCounter = 0; keywordCounter < keywords.length; keywordCounter++) {
        if (negativeKeywords.includes(keywords[keywordCounter])) {
            //console.info(`Removing ${keywords[keywordCounter]}`);
            keywords.splice(keywordCounter, 1);
            keywordCounter--;
        }
    }
	// Reassemble and return result
	keywords = keywords.join(", ");
	keywords = keywords.replaceAll("o-face", ":o");
	keywords = keywords.replaceAll("catty face", ":3");
	keywords = keywords.replaceAll("triangle face", ":<");
	keywords = keywords.replaceAll("###", ":");
	return keywords;
}

// Prompt size and color redundancy cleanup

// Clear result div
// How many generated images stay in the page. Each one is a base64 data URI
// plus its decoded bitmap, so a long session used to end with the tab out of
// memory, and the only lever was `clearScreen` — which throws away EVERY image
// on EVERY generation and can only be set by editing this file.
//
// Pruning loses nothing: Forge has already written each image to disk on the
// generating machine, which is what the "Saved as:" line under it records.
// Those lines are deliberately left behind when the image goes, so the history
// of what was made survives even though the pixels do not.
var keptImageCount = 12;

function pruneOldImages() {
    var area = document.getElementById('resultArea');
    if (!area || !area.querySelectorAll) { return; }
    // Only the ones this file appended, and a static NodeList rather than a live
    // HTMLCollection so the indices stay valid while nodes are being removed.
    var images = area.querySelectorAll('img.generatedImage');
    var surplus = images.length - keptImageCount;
    for (var i = 0; i < surplus; i++) {
        // Drop the data URI BEFORE unlinking. The decoded bitmap is held against
        // the src, and a detached node with a live src can outlive the removal.
        images[i].src = "";
        if (images[i].parentNode) { images[i].parentNode.removeChild(images[i]); }
    }
}

function clearResult() {
    document.getElementById('resultArea').innerHTML = "";
	var existingResult = document.getElementById('result');
    if (existingResult) existingResult.remove();
	
	let resultDiv;
    resultDiv = document.getElementById('resultArea');
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'resultArea';
        document.getElementById('output').appendChild(resultDiv);
    }
    else if (testing != true) {
        resultDiv.innerHTML = "";
    }
}

function protectParens(prompt) {
    return prompt
    .replaceAll(/\\\(/g, "__lparen__") // replace "\("
    .replaceAll(/\\\)/g, "__rparen__"); // replace "\)"
}

function restoreParens(prompt) {
    prompt = prompt.replaceAll("__lparen__", "\\(");
    prompt = prompt.replaceAll("__rparen__", "\\)");
    //console.debug(prompt);
    return prompt
    .replaceAll("__lparen__", "\\(")
    .replaceAll("__rparen__", "\\)");
}

// #endregion Prompt Generation Functions***************************** 



// #region Database Assembly Functions *****************************

// Database Loading
function loadLibraries() {
    for (libraryIndex = 0; libraryIndex < librariesList.length; libraryIndex++) {
        var filename = "scripts/webui/libraries/"+librariesList[libraryIndex];
        var fileref=document.createElement('script');
        fileref.setAttribute("src", filename);
        
        fileref.onload = function() {
            //console.log("Successfully loaded file "+data.story[coreIndex].index+".js to the game");
        }
        
        fileref.onerror = function() {
            //console.log("Error! Script load failure, tried to add "+data.story[coreIndex].index+" to the game, but something went wrong! Is the .js file you are trying to load present in the character's folder? Did you misspell the index?");
        }
        
        //Append new script file
        document.getElementsByTagName("head")[0].appendChild(fileref);
        
        //Delete script file afterwards
        var select = document.getElementsByTagName("head")[0];
        select.removeChild(select.lastChild);
    }
}

// Which `-/` sections of cleaningDB hold BOOSTERS — tags that steer generation
// and describe nothing that is in the picture, so a training caption drops them.
// v2 reads this through `rule.section`; v1 does not use it at all.
//
// It is a LIST because the alternative was a guess. v2 used to call any rule a
// booster if its replacement led with its own target, which is the shape the
// boost section is written in — but 71 rules elsewhere in the file happen to
// have that shape too, all 46 of `bodyparts removal (TEMPORARY)` among them, so
// `backboob` and friends were being dropped from every contracted caption.
//
// Add a section name here to promote it wholesale. `LORA boosters` in
// cleaningArrayInitial is the obvious candidate — its trigger words describe
// nothing either — but it is written in a different shape and has not been
// checked, so it is deliberately not listed yet.
var boosterSectionList = ["Boost keywords"];

function establishRules(library, libraryTarget) {
    var lines = library.split("\n");
    // The `-/ Name` headers are the file's own structure and were being thrown
    // away with the comments. Tracked so a rule knows which section it came from.
    var currentSection = "";
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].indexOf("-/") == 0) {
            currentSection = lines[i].slice(2).trim();
            continue;
        }
        if (lines[i] == "" || lines[i][0] == "-") {
            continue;
        }
        lines[i] = lines[i].replaceAll(":o", "###o");
        lines[i] = lines[i].replaceAll(":3", "###3");
        lines[i] = lines[i].replaceAll(":<", "###<");
        lines[i] = lines[i].replaceAll("lora:", "lora###");
        lines[i] = lines[i].replaceAll(":0.", "###0.");
        lines[i] = lines[i].replaceAll(":1>", "###1>");
        if (lines[i].includes("(color)")) {
            var simpleColorArray = ["red", "orange", "yellow", "aqua", "green", "teal", "blue", "purple", "pink", "maroon", "black", "white", "grey", "gold", "silver", "rainbow"];
            for (var color = 0; color < simpleColorArray.length; color++) {
                if (libraryTarget == "initial") {
                    establishRule(lines[i].replaceAll("(color)", simpleColorArray[color]), rulesArrayInitial, currentSection);
                }
                else {
                    establishRule(lines[i].replaceAll("(color)", simpleColorArray[color]), rulesArrayFinal, currentSection);
                }
            }
        }
        else {
            if (libraryTarget == "initial") {
                establishRule(lines[i], rulesArrayInitial, currentSection);
            }
            else {
                establishRule(lines[i], rulesArrayFinal, currentSection);
            }
        }
    }
}

// Simple Array Cleanup
//
// Two files, in authority order. charactersDB.js is hand-written and wins;
// charactersDB2.js is where a bulk import lands (animadex first) and yields to
// it. A hand-written entry carries decisions a scraped one cannot — which
// outfit is `default`, what `penis` should expand to for her — and an import
// that happened to run later must not take those away.
function cleanupCharacterArray() {
    // Guarded on the raw text still being text, which is what makes a second
    // call a no-op. Both files are consumed here, so both convert here.
    if (typeof characterArray != "string") { return; }
    characterArray = escapeStoredNames(characterArray).split("\n");
    cleanedCharacterArray = [];
    cleanedOutfitArray = [];
    outfitTypesList = [];

    ingestCharacterLines(characterArray);

    // Everything ingested so far is HAND-WRITTEN. Marked here because it is the
    // only moment the two files are distinguishable — after this they are one
    // array with no record of where each entry came from.
    //
    // v2 needs it for the name tiebreak: `rosalina` is a namesArray alias of both
    // `.marioRosalina` (curated, with outfits) and `.rosalina` (imported, without),
    // and the curated one has to win. `charactersDB outranks charactersDB2` used
    // to mean only "identical codename", which never arbitrated this case.
    for (var handIndex = 0; handIndex < cleanedCharacterArray.length; handIndex++) {
        cleanedCharacterArray[handIndex].handWritten = true;
    }

    if (typeof characterArray2 != "undefined" && characterArray2 != null) {
        if (typeof characterArray2 == "string") { characterArray2 = escapeStoredNames(characterArray2).split("\n"); }
        var shadowed = ingestCharacterLines(characterArray2);
        if (shadowed.length) {
            // Said out loud. An import colliding heavily means it is duplicating
            // work rather than adding to it, and that is worth knowing before
            // wondering why an entry does not behave the way the import says.
            console.info("charactersDB2: " + shadowed.length +
                         " entries shadowed by charactersDB — " + shadowed.slice(0, 10).join(", ") +
                         (shadowed.length > 10 ? ", …" : ""));
        }
    }
}

// Everything that used to be the body of cleanupCharacterArray, so both files
// go through exactly the same parse. Returns the codenames it declined.
//
// The taken-list is snapshotted BEFORE this file is read, not built as it goes:
// charactersDB itself already holds three duplicate codenames, and deduping
// within a file would silently change data v1 has always been given.
function ingestCharacterLines(lines) {
    var taken = {};
    for (var t = 0; t < cleanedCharacterArray.length; t++) {
        taken[cleanedCharacterArray[t].codename] = true;
    }
    var lastName = "";
    var lastEntry = "character";
    var skipping = false;
    var shadowed = [];

    for (var charIndex = 0; charIndex < lines.length; charIndex++) {
        //Drop empty lines
        if (lines[charIndex] == "" || lines[charIndex][0] == "-" || lines[charIndex][0] == "#" || lines[charIndex][0] == "/") {
            continue;
        }
        switch (lines[charIndex][0]) {
            case ".":
                var codename = lines[charIndex].split("; ")[0].toLowerCase();
                // A shadowed character takes her whole block with her — the
                // replacement and outfit lines below her belong to her, and
                // letting them fall through would staple them to whoever was
                // parsed last.
                skipping = Object.prototype.hasOwnProperty.call(taken, codename);
                if (skipping) { shadowed.push(codename); break; }
                var newCharacter = {};
                newCharacter.codename = codename;
                newCharacter.prompt = lines[charIndex].split("; ")[1];
                newCharacter.replacements = [];
                cleanedCharacterArray.push(cleanupCharacterShortcut(newCharacter));
                lastEntry = "character";
                lastName = codename;
            break;
            case "*":
                if (skipping) { break; }
                var newOutfit = {};
                var outfitType = lines[charIndex].split("; ")[0];
                if (!outfitTypesList.includes(outfitType.replace("*", ""))) {
                    outfitTypesList.push(outfitType.replace("*", ""));
                }
                newOutfit.codename = lastName+lines[charIndex].split("; ")[0].toLowerCase();
                newOutfit.prompt = lines[charIndex].split("; ")[1];
                newOutfit.replacements = [];
                cleanedOutfitArray.push(cleanupCharacterShortcut(newOutfit));
                lastEntry = "outfit";
            break;
            default:
                if (skipping) { break; }
                if (lastEntry == "character") {
                    cleanedCharacterArray[cleanedCharacterArray.length - 1].replacements.push(lines[charIndex]);
                }
                else if (lastEntry == "outfit") {
                    cleanedOutfitArray[cleanedOutfitArray.length - 1].replacements.push(lines[charIndex]);
                }
        }
    }
    return shadowed;
}

function cleanupCharacterShortcut(newCharacter) {
    var replacementsListFuzzy = [
        ["penis", "(color), (type), knot, medial ring"],
        ["balls", "(color), (type), saggy balls, hyper saggy, clenched balls, clenching balls, veiny balls, throbbing balls"],
        ["pussy", "(color), (type), fat mons, plump labia, cleft of venus"],
        ["nipples", "(color), (type), erect nipples, puffy nipples, large areolae, large areolas, puffy areolas"],
        //["breasts", "(color), (type), flat chest, sagging breasts, perky breasts"],
    ];
    if (!newCharacter.prompt) {
        newCharacter.prompt = "";
    }
    var splitCharacterPrompt = newCharacter.prompt.split(", ");
    //console.info(splitCharacterPrompt);
    for (var replacementIndex = 0; replacementIndex < replacementsListFuzzy.length; replacementIndex++) {
        var newReplacement = replacementsListFuzzy[replacementIndex][0]+"; ";
        var replacementFound = false;
        for (var shortcutIndex = 0; shortcutIndex < splitCharacterPrompt.length; shortcutIndex++) {
            //console.info(splitCharacterPrompt[shortcutIndex]);
            if (newCharacter.prompt.includes(replacementsListFuzzy[replacementIndex][0])) {
                var replacementTestList = replacementsListFuzzy[replacementIndex][1].split(", ");
                for (testIndex = 0; testIndex < replacementTestList.length; testIndex++) {
                    //console.info(splitCharacterPrompt[shortcutIndex]);
                    if (replacementTestList[testIndex].includes("(color)")) {
                        for (var colorIndex = 0; colorIndex < simpleColorArray.length; colorIndex++) {
                            if (splitCharacterPrompt[shortcutIndex].includes("light "+simpleColorArray[colorIndex] + " " + replacementsListFuzzy[replacementIndex][0])) {
                                newReplacement += splitCharacterPrompt[shortcutIndex]+", ";
                                splitCharacterPrompt.splice(shortcutIndex, 1);
                                shortcutIndex--;
                                replacementFound = true;
                                break;
                            }
                            if (splitCharacterPrompt[shortcutIndex].includes("dark "+simpleColorArray[colorIndex] + " " + replacementsListFuzzy[replacementIndex][0])) {
                                newReplacement += splitCharacterPrompt[shortcutIndex]+", ";
                                splitCharacterPrompt.splice(shortcutIndex, 1);
                                shortcutIndex--;
                                replacementFound = true;
                                break;
                            }
                            if (splitCharacterPrompt[shortcutIndex] == simpleColorArray[colorIndex] + " " + replacementsListFuzzy[replacementIndex][0]) {
                                newReplacement += splitCharacterPrompt[shortcutIndex]+", ";
                                splitCharacterPrompt.splice(shortcutIndex, 1);
                                shortcutIndex--;
                                replacementFound = true;
                                break;
                            }
                        }
                    }
                    else if (replacementTestList[testIndex].includes("(type)")) {
                        for (var typeIndex = 0; typeIndex < simpleTypeArray.length; typeIndex++) {
                            if (splitCharacterPrompt[shortcutIndex] == simpleTypeArray[typeIndex] + " " + replacementsListFuzzy[replacementIndex][0]) {
                                newReplacement += splitCharacterPrompt[shortcutIndex]+", ";
                                splitCharacterPrompt.splice(shortcutIndex, 1);
                                shortcutIndex--;
                                replacementFound = true;
                                break;
                            }
                        }
                    }
                    else {
                        //console.info(splitCharacterPrompt[shortcutIndex]);
                        if (splitCharacterPrompt[shortcutIndex] == replacementTestList[testIndex]) {
                            newReplacement += splitCharacterPrompt[shortcutIndex]+", ";
                            splitCharacterPrompt.splice(shortcutIndex, 1);
                            shortcutIndex--;
                            replacementFound = true;
                            break;
                        }
                    }
                }
            }
        }
        if (replacementFound) {
            newCharacter.replacements.push(newReplacement);
            if (replacementsListFuzzy[replacementIndex][0] == "nipples") {
                newCharacter.replacements.push(newReplacement.replace("nipples", "nipple"));
                newCharacter.replacements.push(newReplacement.replace("nipples", "areolas"));
                newCharacter.replacements.push(newReplacement.replace("nipples", "areola"));
            }
        }
    }
    newCharacter.prompt = splitCharacterPrompt.join(", ");
    return newCharacter;
}

function cleanupBrandArray() {
    if (typeof brandArray == "string") {
		brandArray = brandArray.split("\n");
		for (var brand = 0; brand < brandArray.length; brand++) {
			if (brandArray[brand] != "") {
				brandArray[brand] = "."+brandArray[brand];
			}
		}
	}
}

// RETIRED 2026-08-17. `aliasArray` no longer exists — every line in it had
// become redundant, and aliasDB.js now holds namesArray instead. The guard below
// makes this a no-op rather than a crash, and the function is kept so that
// pasting an old aliasDB back in still works.
//
// Syrup Town display names live in `basicShortcutArray` above, which v2 reads
// directly since the same date. One list, one question.
function cleanupAliasArray() {
    if (typeof aliasArray == "string") {
		var splitAliasArray = aliasArray.split("\n");
		for (var alias = 0; alias < splitAliasArray.length; alias++) {
			var aliasTarget = splitAliasArray[alias].split("; ")[0];
			var aliasReplacement = splitAliasArray[alias].split("; ")[1];
			cleanedAliasArray.push({target: aliasTarget, replacement: aliasReplacement});
		}
	}
}

// Simple Array Cleanup
// namesArray is the block format in aliasDB.js (moved there from brandsDB2.js
// on 2026-08-17):
//
//   - ==== franchise ====        section heading, a comment
//
//   nami (one piece)             canonical tag
//   nami (orange town)           aliases, until a blank line
//   .onepiecenami
//
// Every tag registers as bodyBrand, plus its cosplay and costume forms as
// clothesFullwear, which is what the previous flat format did. Tags are stored
// unescaped, so both the bare and backslashed forms are registered - v1 matches
// against escaped text, v2 against unescaped.
//
// Also builds cleanedNamesArray, the parsed index both engines read rather than
// parsing this file twice.
var cleanedNamesArray = [];
var namesByTag = {};
var franchiseList = [];

// The one section heading in brandsDB2 that means "these are brand keywords but
// not characters". Compared lowercase.
var genericTermsSection = "generic terms";

// A character name plus one of these IS an outfit, derived from the names list
// rather than stored per character — ANIMADEX-IMPORT.md's "Automate fixing".
// 7297 names against 6 suffixes is far cheaper than writing them out.
var costumeSuffixes = ["cosplay", "1st costume", "2nd costume", "3rd costume",
                       "4th costume", "5th costume"];

function cleanupNamesArray() {
    if (typeof namesArray != "string") { return; }
    namesArray = namesArray.split("\n");

    function register(tag) {
        if (!tag) { return; }
        var escaped = tag.replace(/\(/g, "\\(").replace(/\)/g, "\\)");
        var forms = escaped == tag ? [tag] : [tag, escaped];
        for (var f = 0; f < forms.length; f++) {
            addSingletonToSets(finalKeywordSet, "bodyBrand", forms[f]);
            for (var s = 0; s < costumeSuffixes.length; s++) {
                // BOTH escapings. The suffix used to be written escaped only, so
                // `2b (nier) (cosplay)` — which is what a v2 record holds, since
                // v2 stores tags unescaped (Rule 1b) — matched nothing, and every
                // cosplay and costume tag in the database read as uncategorised.
                // v1 compares the escaped text, so that form has to stay too.
                addSingletonToSets(finalKeywordSet, "clothesFullwear",
                                   forms[f] + " \\(" + costumeSuffixes[s] + "\\)");
                addSingletonToSets(finalKeywordSet, "clothesFullwear",
                                   forms[f] + " (" + costumeSuffixes[s] + ")");
            }
        }
    }

    var franchise = "";
    var block = null;
    var generic = false;
    for (var i = 0; i < namesArray.length; i++) {
        var line = namesArray[i].trim();

        if (line == "") { block = null; continue; }
        if (line.charAt(0) == "-") {
            var heading = line.match(/^-\s*=+\s*(.+?)\s*=+$/);
            if (heading) {
                franchise = heading[1].trim();
                // The generic section is not a franchise and its name is not a
                // tag, so neither gets registered. Everything under it is a
                // brand keyword that is NOT a character - a studio, a series, a
                // species marker - and must never be counted as a figure.
                generic = franchise.toLowerCase() == genericTermsSection;
                if (generic) { franchise = ""; continue; }
                if (franchiseList.indexOf(franchise) == -1) { franchiseList.push(franchise); }
                register(franchise);
            }
            continue;   // every other "-" line is an ordinary comment
        }

        // One term per line in the generic section. A generic term has no
        // aliases by definition, so nothing there opens a multi-line block and
        // no blank line is needed between entries.
        if (!block || generic) {
            block = { canonical: line, franchise: franchise, aliases: [], generic: generic };
            cleanedNamesArray.push(block);
        } else {
            block.aliases.push(line);
        }
        register(line);
        namesByTag[line.toLowerCase()] = block;
    }
}

// Replacement Array Cleanup
function establishRule(rule, libraryTarget, section) {
    const initialRule = rule;
    rule = rule.replace("!", "")
    // `section` is the `-/ Name` header this line sat under. v2 reads it to
    // tell a BOOSTER from an ordinary reinforcing rule; see boosterSectionList.
    var libraryLine = {requirement: "", target: "", replacement: "", exception: "", section: section || ""};
    if (rule.includes(":")) {
        //Requirement. Everything to the left of : is the requirement
        libraryLine.requirement = rule.split(":")[0];
        //Remove the requirement from the line
        rule = rule.split(":")[1];
        if (libraryLine.requirement[0] == " ") {
            libraryLine.requirement = libraryLine.requirement.substring(1);
        }
    }
    if (rule.includes("[") && rule.includes("]")) {
        //console.info("Exception present in:", rule);
        //Exception. Everything within [] is the exception
        libraryLine.exception = rule.split("[")[1].split("]")[0];
        //Remove the exception from the line
        rule = rule.split("[")[0] + rule.split("]")[1];
        rule = rule.replace("[", "").replace("]", "");
        if (libraryLine.exception[0] == " ") {
            libraryLine.exception = libraryLine.exception.substring(1);
        }
    }
    if (rule.includes(";")) {
        //Separator between the target (left of the semicolon) and the replacement (right of the semicolon)
        libraryLine.target = rule.split(";")[0];
        if (libraryLine.target[0] == " ") {
            libraryLine.target = libraryLine.target.substring(1);
        }
        libraryLine.replacement = rule.split(";")[1];
        if (libraryLine.replacement[0] == " ") {
            libraryLine.replacement = libraryLine.replacement.substring(1);
        }
        // ---- PUT THE COLONS BACK ------------------------------------------
        // establishRules sentinels `:o`, `:3`, `:<`, `lora:`, `:0.` and `:1>`
        // into `###…` before this runs, for one reason only: the splits above
        // use `:` as the requirement separator and `;` as the target separator,
        // so a colon inside a VALUE would be misread. Both splits are done now,
        // and the sentinel has no job left.
        //
        // It used to survive all the way to output, where only v1 undid it — one
        // `replaceAll("###", ":")` at the end of its keyword cleanup. v2 reads
        // these fields directly and never had that step, so 65 rules handed it
        // mangled text: `Ohogao` emitted a literal `###o` tag AND
        // `<lora###ohogao - magochi###1>`, which liftLoraReferences cannot match,
        // so a broken LoRA reference travelled into the prompt as words.
        //
        // Undoing it HERE fixes both engines at once and cannot desync them.
        // v1's own `###` pass still runs and is now a no-op, which is correct —
        // it is v1's line to delete, not this one's.
        libraryLine.requirement = libraryLine.requirement.replaceAll("###", ":");
        libraryLine.target      = libraryLine.target.replaceAll("###", ":");
        libraryLine.replacement = libraryLine.replacement.replaceAll("###", ":");
        libraryLine.exception   = libraryLine.exception.replaceAll("###", ":");
        libraryTarget.push(libraryLine);
    }
    else {
        console.error("Invalid library line: ", initialRule, " on line ", i);
    }
}

// KeywordDB Parsing
function parseKeywordDB(keywordDB, modifierDB) {
  const parsed = {};
  for (const category of Object.keys(keywordDB)) {
    parsed[category] = [];
    const itemsObj = keywordDB[category];
    // Expect itemsObj to be { item: [subitems...] }
    for (const itemName of Object.keys(itemsObj)) {
      const rawSubs = Array.isArray(itemsObj[itemName]) ? itemsObj[itemName] : [];
      const expandedSubs = [];
      for (const sub of rawSubs) {
        // expand placeholders if any
        const ex = expandPlaceholders(sub, modifierDB);
        for (const e of ex) expandedSubs.push(e);
      }
      // ensure unique subitems
      const uniqueSubs = Array.from(new Set(expandedSubs.map(s => s.trim()).filter(Boolean)));
      parsed[category].push({ item: itemName.trim(), subitems: uniqueSubs });
    }
  }
  return parsed;
}

// Assemble keyword category sets

function generateClothesCategorySet(categoryName, itemsArr, modifierDB, singletons = []) {
  const set = new Set();

  // helpers to add safely
  const add = s => {
    if (!s || !s.trim()) return;
    set.add(s.trim());
  };

  // category-specific modifiers mapping
  const categoryModifiers = {
    clothesFullwear: modifierDB.modifiersSleeves || [],
    clothesUpperwearOuter: modifierDB.modifiersSleeves || [],
    clothesUpperwearMiddle: modifierDB.modifiersSleeves || [],
    clothesUpperwearInner: modifierDB.modifiersSleeves || [],
    clothesLowerwearInner: modifierDB.modifiersLowerwear || [],
    clothesLowerwearUnder: modifierDB.modifiersLowerwear || [],
    clothesFootwear: modifierDB.modifiersFootwear || []
  };

  for (const { item, subitems } of itemsArr) {
    // ---- ITEM rules (per your database plan) ----
    add(item); // (item)

    // (color) (item)
    (modifierDB.colors || []).forEach(color => add(`${color} ${item}`));

    // (variant) (color) item
    (modifierDB.variants || []).forEach(variant =>
      (modifierDB.colors || []).forEach(color => add(`${variant} ${color} ${item}`))
    );

    // (variant) item
    (modifierDB.variants || []).forEach(variant => add(`${variant} ${item}`));

    // (size) (item)
    (modifierDB.sizes || []).forEach(size => add(`${size} ${item}`));

    // (color)-trim (item)
    (modifierDB.colors || []).forEach(color => add(`${color}-trim ${item}`));

    // (color) inner (item)
    (modifierDB.colors || []).forEach(color => add(`${color} inner ${item}`));

    // (color) inner-(item) - hyphenated twin, added 2026-08-08, for
    // `red inner-cape`. Beside the spaced form, not instead of it.
    (modifierDB.colors || []).forEach(color => add(`${color} inner-${item}`));

    // (color) under(item)
    (modifierDB.colors || []).forEach(color => add(`${color} under${item}`));

    // (color) (item) gradient
    (modifierDB.colors || []).forEach(color => add(`${color} ${item} gradient`));

    // (ornament)-print (item)
    (modifierDB.ornaments || []).forEach(orn => add(`${orn}-print ${item}`));

    // (color) (ornament)-print (item)
    (modifierDB.colors || []).forEach(color =>
      (modifierDB.ornaments || []).forEach(orn => add(`${color} ${orn}-print ${item}`))
    );

    // (color)-striped (item)
    (modifierDB.colors || []).forEach(color => add(`${color}-striped ${item}`));

    // (item) (ornament)
    (modifierDB.ornaments || []).forEach(orn => add(`${item} ${orn}`));

    // (ornament) (item) - added 2026-08-08. Only the reversed order existed, so
    // `earrings ball` was a keyword and `ball earrings` was not.
    (modifierDB.ornaments || []).forEach(orn => add(`${orn} ${item}`));

    // (color) (ornament) (item) ornament  <-- faithful to your plan
    (modifierDB.colors || []).forEach(color =>
      (modifierDB.ornaments || []).forEach(orn => add(`${color} ${orn} ${item} ornament`))
    );

    // (ornament) (item) ornament - colourless. Added 2026-08-08: only the
    // coloured form existed, so `fish hair ornament` was uncategorised while
    // `blue fish hair ornament` was fine.
    (modifierDB.ornaments || []).forEach(orn => add(`${orn} ${item} ornament`));
    // ...and the PLURAL of both, for `black ribbon hair ornaments`.
    (modifierDB.ornaments || []).forEach(orn => add(`${orn} ${item} ornaments`));
    (modifierDB.colors || []).forEach(color =>
      (modifierDB.ornaments || []).forEach(orn => add(`${color} ${orn} ${item} ornaments`))
    );

    // (color) trim (item)
    (modifierDB.colors || []).forEach(color => add(`${color} trim ${item}`));

    // (modifier) (item) -> include global modifiers + category-specific modifiers
    [
      ...(modifierDB.modifiersGlobal || []),
      ...(categoryModifiers[categoryName] || [])
    ].forEach(mod => add(`${mod} ${item}`));

    // (prefix action) (item)
    (modifierDB.actionPrefixes || []).forEach(pref => {
      add(`${pref} ${item}`);
      // (prefix action) own (item)
      add(`${pref} own ${item}`);
    });

    // (item) (suffix action)
    (modifierDB.actionSuffixes || []).forEach(suf => add(`${item} ${suf}`));

    // ---- SUBITEM rules (only the subitem-specific plan items) ----
    for (const sub of subitems) {
      add(sub); // (subitem)

      (modifierDB.actionPrefixes || []).forEach(pref => {
        add(`${pref} ${sub}`);       // (prefix action) (subitem)
        add(`${pref} own ${sub}`);   // (prefix action) own (subitem)
      });

      (modifierDB.actionSuffixes || []).forEach(suf => {
        add(`${sub} ${suf}`); // (subitem) (suffix action)
      });
    }
  }

  // ---- singletons (category-only keywords) ----
  (singletons || []).forEach(s => add(s));

  return set;
}

function generateBodyCategorySet(categoryName, itemsArr, modifierDB, singletons = []) {
  const set = new Set();
    //console.info(itemsArr);

  // safe adder
  const add = s => {
    if (!s || !s.trim()) return;
    set.add(s.trim());
  };

  for (const { item, subitems } of itemsArr) {
    //console.info(`Processing body item: ${item}`);
    // ---- PART rules ----
    add(item); // (item)
    add(`${item}less`); // (item)less
    add(`${item} out`); // (item) out
    add(`${item} outline`); // (item) outline

    // (size) (item)
    (modifierDB.size || []).forEach(size => add(`${size} ${item}`));

    // (color) (item)
    (modifierDB.colors || []).forEach(color => add(`${color} ${item}`));

    // (variant) (item)
    (modifierDB.variants || []).forEach(variant => add(`${variant} ${item}`));

    // (state) (item)
    (modifierDB.state || []).forEach(state => add(`${state} ${item}`));

    // (variant) (color) (item)
    (modifierDB.variants || []).forEach(variant =>
      (modifierDB.colors || []).forEach(color => add(`${variant} ${color} ${item}`))
    );

    // (color)-tipped (item)
    (modifierDB.colors || []).forEach(color => add(`${color}-tipped ${item}`));
    (modifierDB.variants || []).forEach(variant =>
      (modifierDB.colors || []).forEach(color => add(`${variant} ${color}-tipped ${item}`))
    );

    // (color) (item) tips
    (modifierDB.colors || []).forEach(color => add(`${color} ${item} tips`));
    (modifierDB.variants || []).forEach(variant =>
      (modifierDB.colors || []).forEach(color => add(`${variant} ${color} ${item} tips`))
    );
    // (variant (item) tips
    (modifierDB.variants || []).forEach(variant => add(`${variant} ${item} tips`));

    // (color) (item) tip
    (modifierDB.colors || []).forEach(color => add(`${color} ${item} tip`));
    (modifierDB.variants || []).forEach(variant =>
      (modifierDB.colors || []).forEach(color => add(`${variant} ${color} ${item} tip`))
    );
    // (variant (item) tip
    (modifierDB.variants || []).forEach(variant => add(`${variant} ${item} tip`));

    // (color) inner (item)
    (modifierDB.colors || []).forEach(color => add(`${color} inner ${item}`));
    (modifierDB.variants || []).forEach(variant =>
      (modifierDB.colors || []).forEach(color => add(`${variant} ${color} inner ${item}`))
    );

    // (color) inner-(item) - hyphenated twin, added 2026-08-08.
    (modifierDB.colors || []).forEach(color => add(`${color} inner-${item}`));
    (modifierDB.variants || []).forEach(variant =>
      (modifierDB.colors || []).forEach(color => add(`${variant} ${color} inner-${item}`))
    );

    // (color) gradient (item)
    (modifierDB.colors || []).forEach(color => add(`${color} gradient ${item}`));
    (modifierDB.variants || []).forEach(variant =>
      (modifierDB.colors || []).forEach(color => add(`${variant} ${color} gradient ${item}`))
    );

    // (color) streaked (item)
    (modifierDB.colors || []).forEach(color => add(`${color} streaked ${item}`));
    (modifierDB.variants || []).forEach(variant =>
      (modifierDB.colors || []).forEach(color => add(`${variant} ${color} streaked ${item}`))
    );

    // (color)-streaked (item) - hyphenated twin, added 2026-08-08. Kept beside
    // the spaced form rather than replacing it; both spellings exist in the data.
    (modifierDB.colors || []).forEach(color => add(`${color}-streaked ${item}`));
    (modifierDB.variants || []).forEach(variant =>
      (modifierDB.colors || []).forEach(color => add(`${variant} ${color}-streaked ${item}`))
    );

    // (color) (item) streak
    (modifierDB.colors || []).forEach(color => add(`${color} ${item} streak`));
    (modifierDB.variants || []).forEach(variant =>
      (modifierDB.colors || []).forEach(color => add(`${variant} ${color} ${item} streak`))
    );

    // (color)-striped (item)
    (modifierDB.colors || []).forEach(color => add(`${color}-striped ${item}`));
    (modifierDB.variants || []).forEach(variant =>
      (modifierDB.colors || []).forEach(color => add(`${variant} ${color}-striped ${item}`))
    );

    // (color) (ornament) (item) ornament
    (modifierDB.colors || []).forEach(color => {
      (modifierDB.ornaments || []).forEach(ornament => add(`${color} ${ornament} ${item} ornament`));
    });

    // (ornament) (item) ornament - colourless, added 2026-08-08. Only the
    // coloured form existed, so `fish hair ornament` was uncategorised while
    // `blue fish hair ornament` was fine. TODO.md recorded this one already.
    (modifierDB.ornaments || []).forEach(ornament => add(`${ornament} ${item} ornament`));
    // ...and the PLURALS, for `black ribbon hair ornaments`.
    (modifierDB.ornaments || []).forEach(ornament => add(`${ornament} ${item} ornaments`));
    (modifierDB.colors || []).forEach(color => {
      (modifierDB.ornaments || []).forEach(ornament => add(`${color} ${ornament} ${item} ornaments`));
    });

    // ---- SYMBOL rules ----
    (modifierDB.symbols || []).forEach(sym => {
      add(`${sym} on ${item}`);
      add(`${sym} over ${item}`);
      add(`${item} ${sym}`);

      (modifierDB.colors || []).forEach(color => {
        add(`${color} ${sym}`);
        add(`${color} ${sym} on ${item}`);
        add(`${color} ${sym} over ${item}`);
        add(`${color} ${item} ${sym}`);
      });

      (modifierDB.shapes || []).forEach(shape => {
        add(`${shape} ${sym}`);
        add(`${shape} ${sym} on ${item}`);
        add(`${shape} ${sym} over ${item}`);
        add(`${shape} ${item} ${sym}`);

        (modifierDB.colors || []).forEach(color => {
          add(`${color} ${shape} ${sym}`);
          add(`${color} ${shape} ${sym} on ${item}`);
          add(`${color} ${shape} ${sym} over ${item}`);
          add(`${color} ${shape} ${item} ${sym}`);
        });
      });
    });

    // ---- ORNAMENT rules ----
    (modifierDB.ornaments || []).forEach(orn => {
      add(`${item} ${orn}`);
      (modifierDB.colors || []).forEach(color => add(`${color} ${item} ${orn}`));
      (modifierDB.variants || []).forEach(variant =>
        (modifierDB.colors || []).forEach(color => add(`${variant} ${color} ${item} ${orn}`))
      );

      add(`${item} ${orn} ornament`);
      (modifierDB.colors || []).forEach(color => add(`${color} ${item} ${orn} ornament`));
      (modifierDB.variants || []).forEach(variant =>
        (modifierDB.colors || []).forEach(color => add(`${variant} ${color} ${item} ${orn} ornament`))
      );

      add(`${orn} ${item} piercing`);
      (modifierDB.colors || []).forEach(color => add(`${color} ${orn} ${item} piercing`));
      (modifierDB.variants || []).forEach(variant =>
        (modifierDB.colors || []).forEach(color => add(`${variant} ${color} ${orn} ${item} piercing`))
      );
    });

    // ---- SUBPARTS ----
    for (const sub of subitems) {
      add(sub); // bare subitem
    }
  }

  // ---- singletons (category-only keywords) ----
  (singletons || []).forEach(s => add(s));

  return set;
}

function generateSceneCategorySet() {
    if (typeof sceneKeywordArray == "string") {
        sceneKeywordArray = sceneKeywordArray.split("\n");
        simpleBodypartsArray = simpleBodypartsArray.split("\n");
        simpleIntercourseArray = simpleIntercourseArray.split("\n");
        simpleObjectArray = simpleObjectArray.split("\n");
        simpleHandArray = simpleHandArray.split("\n");
        simpleHandsTo = simpleHandsTo.split("\n");
        simpleArmArray = simpleArmArray.split("\n");
        simpleArmsTo = simpleArmsTo.split("\n");
        simpleLegArray = simpleLegArray.split("\n");
        const wildcardMap = {
        "(bodypart)": simpleBodypartsArray,
        "(object)": simpleObjectArray,
        "(intercourse)": simpleIntercourseArray,
        "(color)": modifierKeywordDB.colors,
        "(hands)": simpleHandArray,
        "(handsto)": simpleHandsTo,
        "(arms)": simpleArmArray,
        "(armsto)": simpleArmsTo,
        "(legs)": simpleLegArray
        };
        function expandWildcards(keyword, map, depth = 0, maxDepth = 100000) {
        if (depth > maxDepth) {
            console.warn("Max recursion depth reached at:", keyword);
            return [keyword];
        }

        for (const [wildcard, replacements] of Object.entries(map)) {
            if (keyword.includes(wildcard)) {
            if (!replacements || replacements.length === 0) {
                console.warn(`Wildcard ${wildcard} has no replacements, skipping:`, keyword);
                return [keyword]; // avoid infinite loop on empty arrays
            }

            let results = [];
            for (const replacement of replacements) {
                const replaced = keyword.replaceAll(wildcard, replacement);
                results.push(...expandWildcards(replaced, map, depth + 1, maxDepth));
            }

            // If this expands into *huge* sets, log how big
            if (results.length > 1000) {
                //console.warn(`Expansion of ${wildcard} at depth ${depth} created ${results.length} results`);
            }

            return results;
            }
        }

        // No wildcards left
        return [keyword];
        }

        var tagCategory = "";
        //Basic set of scene keyword creation
        for (var sceneIndex = 0; sceneIndex < sceneKeywordArray.length; sceneIndex++) {
            if (sceneKeywordArray[sceneIndex] == "") {
                tagCategory = "";
            }
            else {
                if (tagCategory == "") {
                    tagCategory = sceneKeywordArray[sceneIndex];
                }
                else {
                    const expandedKeywords = expandWildcards(sceneKeywordArray[sceneIndex], wildcardMap);

                    for (const keyword of expandedKeywords) {
                        addSingletonToSets(
                        finalKeywordSet,
                        "scene" + tagCategory[0].toUpperCase() + tagCategory.slice(1),
                        keyword
                        );
                    }
                }
            }
        }
        //Advanced set of scene keyword creation
        //Step 1: Obtain list of clothing and body items from final keyword set
        var fullCategoryList = Object.keys(finalKeywordSet);
        var clothingCategoryList = [];
        var bodyCategoryList = [];
        for (categoryCountIndex = 0; categoryCountIndex < fullCategoryList.length; categoryCountIndex++) {
            if (fullCategoryList[categoryCountIndex].startsWith("clothes")) {
                clothingCategoryList.push(fullCategoryList[categoryCountIndex]);
            }
        }
        for (categoryCountIndex = 0; categoryCountIndex < fullCategoryList.length; categoryCountIndex++) {
            if (fullCategoryList[categoryCountIndex].startsWith("body")) {
                bodyCategoryList.push(fullCategoryList[categoryCountIndex]);
            }
        }
        //Step 2: Algorhmically create clothing keywords and assign them to the correct category
        clothingSceneActionsArray = clothingSceneActionsArray.split("\n");
        var clothingItemList = [];
        for (var categoryCountIndex = 0; categoryCountIndex < clothingCategoryList.length; categoryCountIndex++) {
            clothingItemList = eval(`Object.keys(clothesKeywordDB.`+clothingCategoryList[categoryCountIndex]+`);`)
            for (clothingItemIndex = 0; clothingItemIndex < clothingItemList.length; clothingItemIndex++) {
                for (sceneActionIndex = 0; sceneActionIndex < clothingSceneActionsArray.length; sceneActionIndex++) {
                    if (clothingSceneActionsArray[sceneActionIndex] != "") {
                        /*
                        addSingletonToSets(
                            finalKeywordSet, 
                            clothingCategoryList[categoryCountIndex], 
                            clothingSceneActionsArray[sceneActionIndex].replace("(clothing)", clothingItemList[clothingItemIndex])
                        );
                        */
                        addSingletonToSets(
                            finalKeywordSet, 
                            clothingCategoryList[categoryCountIndex].replace("clothes", "scene"), 
                            clothingSceneActionsArray[sceneActionIndex].replace("(clothing)", clothingItemList[clothingItemIndex])
                        );
                    }
                }
            }
        }
        //Step 3: Algorhimically create body keywords and assign them to the correct category
        complexBodypartsArray = complexBodypartsArray.split("\n");
        bodySceneActionsArray = bodySceneActionsArray.split("\n");
        for (sceneActionIndex = 0; sceneActionIndex < bodySceneActionsArray.length; sceneActionIndex++) {
            if (bodySceneActionsArray[sceneActionIndex] != "") {
                for (categoryCountIndex = 0; categoryCountIndex < complexBodypartsArray.length; categoryCountIndex++) {
                    if (complexBodypartsArray[categoryCountIndex] != "") {
                        var bodypartTag = complexBodypartsArray[categoryCountIndex].split(";")[0];
                        var bodypartCategory = complexBodypartsArray[categoryCountIndex].split(";")[1];
                        //console.info("scene" + bodypartCategory[1].toUpperCase() + bodypartCategory.slice(2))
                        /*
                        addSingletonToSets(
                            finalKeywordSet, 
                            "body" + bodypartCategory[0].toUpperCase() + bodypartCategory.slice(1), 
                            bodySceneActionsArray[sceneActionIndex].replace("(bodypart)", bodypartTag)
                        );
                        */
                        addSingletonToSets(
                            finalKeywordSet, 
                            "scene" + bodypartCategory[1].toUpperCase() + bodypartCategory.slice(2), 
                            bodySceneActionsArray[sceneActionIndex].replace("(bodypart)", bodypartTag)
                        );
                    };
                }
            }
        }
        complexIntercourseArray = complexIntercourseArray.split("\n");
        intercourseSceneActionsArray = intercourseSceneActionsArray.split("\n");
        for (sceneActionIndex = 0; sceneActionIndex < intercourseSceneActionsArray.length; sceneActionIndex++) {
            if (intercourseSceneActionsArray[sceneActionIndex] != "") {
                for (categoryCountIndex = 0; categoryCountIndex < complexIntercourseArray.length; categoryCountIndex++) {
                    if (complexIntercourseArray[categoryCountIndex] != "") {
                        var bodypartTag = complexIntercourseArray[categoryCountIndex].split(";")[0];
                        var bodypartCategory = complexIntercourseArray[categoryCountIndex].split(";")[1];
                        //console.info("scene" + bodypartCategory[1].toUpperCase() + bodypartCategory.slice(2))
                        addSingletonToSets(
                            finalKeywordSet, 
                            "scene" + bodypartCategory[1].toUpperCase() + bodypartCategory.slice(2), 
                            intercourseSceneActionsArray[sceneActionIndex].replace("(intercourse)", bodypartTag)
                        );
                    };
                }
            }
        }
    }
}

function generateBackgroundCategorySet() {
    if (typeof backgroundKeywordArray == "string") {
        backgroundKeywordArray = backgroundKeywordArray.split("\n");
        simpleTexArray = simpleTexArray.split("\n");

        var tagCategory = "";
        for (var backgroundIndex = 0; backgroundIndex < backgroundKeywordArray.length; backgroundIndex++) {
            if (backgroundKeywordArray[backgroundIndex] == "") {
                tagCategory = "";
            }
            else {
                if (tagCategory == "") {
                    tagCategory = backgroundKeywordArray[backgroundIndex];
                }
                else {
                    if (backgroundKeywordArray[backgroundIndex].includes("(object)")) {
                        for (var objectIndex = 0; objectIndex < simpleObjectArray.length; objectIndex++) {
                            if (backgroundKeywordArray[backgroundIndex].includes("(bodypart)")) {
                                for (var bodypartIndex = 0; bodypartIndex < simpleBodypartsArray.length; bodypartIndex++) {
                                    addSingletonToSets(
                                        finalKeywordSet, 
                                        "background"+tagCategory[0].toUpperCase() + tagCategory.slice(1), 
                                        backgroundKeywordArray[backgroundIndex]
                                        .replace("(bodypart)", simpleBodypartsArray[bodypartIndex])
                                        .replace("(object)", simpleObjectArray[objectIndex])
                                    );
                                }
                            }
                            else if (backgroundKeywordArray[backgroundIndex].includes("(tex)")) {
                                for (var intercourseIndex = 0; intercourseIndex < simpleTexArray.length; intercourseIndex++) {
                                    addSingletonToSets(
                                        finalKeywordSet, 
                                        "background"+tagCategory[0].toUpperCase() + tagCategory.slice(1), 
                                        backgroundKeywordArray[backgroundIndex]
                                        .replace("(tex)", simpleTexArray[intercourseIndex])
                                        .replace("(object)", simpleObjectArray[objectIndex])
                                    );
                                }
                            }
                            else if (backgroundKeywordArray[backgroundIndex].includes("(color)")) {
                                for (var colorIndex = 0; colorIndex < modifierKeywordDB.colors.length; colorIndex++) {
                                    addSingletonToSets(
                                        finalKeywordSet, 
                                        "background"+tagCategory[0].toUpperCase() + tagCategory.slice(1), 
                                        backgroundKeywordArray[backgroundIndex]
                                        .replace("(color)", modifierKeywordDB.colors[colorIndex])
                                        .replace("(object)", simpleObjectArray[objectIndex])
                                    );
                                }
                            }
                            else {
                                addSingletonToSets(
                                    finalKeywordSet, 
                                    "background"+tagCategory[0].toUpperCase() + tagCategory.slice(1), 
                                    backgroundKeywordArray[backgroundIndex].replace("(object)", simpleObjectArray[objectIndex])
                                );
                            }
                        }
                    }
                    else {
                        if (backgroundKeywordArray[backgroundIndex].includes("(bodypart)")) {
                            for (var bodypartIndex = 0; bodypartIndex < simpleBodypartsArray.length; bodypartIndex++) {
                                addSingletonToSets(finalKeywordSet, "background"+tagCategory[0].toUpperCase() + tagCategory.slice(1), backgroundKeywordArray[backgroundIndex].replace("(bodypart)", simpleBodypartsArray[bodypartIndex]));
                            }
                        }
                        else if (backgroundKeywordArray[backgroundIndex].includes("(tex)")) {
                            for (var intercourseIndex = 0; intercourseIndex < simpleTexArray.length; intercourseIndex++) {
                                addSingletonToSets(finalKeywordSet, "background"+tagCategory[0].toUpperCase() + tagCategory.slice(1), backgroundKeywordArray[backgroundIndex].replace("(tex)", simpleTexArray[intercourseIndex]));
                            }
                        }
                        else if (backgroundKeywordArray[backgroundIndex].includes("(color)")) {
                            for (var colorIndex = 0; colorIndex < modifierKeywordDB.colors.length; colorIndex++) {
                                addSingletonToSets(finalKeywordSet, "background"+tagCategory[0].toUpperCase() + tagCategory.slice(1), backgroundKeywordArray[backgroundIndex].replace("(color)", modifierKeywordDB.colors[colorIndex]));
                            }
                        }
                        else {
                            addSingletonToSets(finalKeywordSet, "background"+tagCategory[0].toUpperCase() + tagCategory.slice(1), backgroundKeywordArray[backgroundIndex]);
                        }
                    }
                }
            }
        }
    }
}

var totalKeywords = 0;
// Combine assembled DBs into finalKeywordSet
function buildAllFinalKeywordSets(keywordDB, modifierDB, singletonsPerCategory = {}, databaseType) {
  console.log("Parsing keyword DB...");
  const parsed = parseKeywordDB(keywordDB, modifierDB);

  const finalSets = {};
  let total = 0;
  for (const category of Object.keys(parsed)) {
    const singletons = singletonsPerCategory[category] || [];
    var set = "";
    if (databaseType == "clothes") {
        set = generateClothesCategorySet(category, parsed[category], modifierDB, singletons);
    }
    if (databaseType == "body") {
        set = generateBodyCategorySet(category, parsed[category], modifierDB, singletons);
    }

    finalSets[category] = set;
    total += set.size;
    //console.log(`Category '${category}': ${set.size} keywords`);
  }
  console.log(`Total keywords across all categories: ${total}`);
  totalKeywords = total;
  return finalSets;
}

// "full" once the body and clothes members have actually been generated, "lite"
// while they are empty placeholders, null before anything is built.
var finalKeywordSetMode = null;

// Body and clothes are 98.9% of the pre-expanded set — 8.03 M of 8.12 M — and
// they are exactly what webui2-categories.js answers by taking a tag apart
// instead of looking it up. In LITE mode their members are never generated: the
// categories are created empty so everything that reads Object.keys() still
// works, and v2's categoriesOf routes those two domains to the matcher.
//
// Scene and background stay pre-expanded because they are 47 K between them and
// the matcher does not model them.
//
// v1 compares text and needs the real members, so anything on the v1 path calls
// ensureFullKeywordSets() first.
function buildFinalKeywordSets(mode) {
	mode = mode === "lite" ? "lite" : "full";
	if (finalKeywordSet != null && finalKeywordSetMode === mode) { return; }
	if (finalKeywordSet != null && finalKeywordSetMode === "full") { return; }   // never downgrade

	var sceneAndBackground = {};
	if (finalKeywordSet != null) {
		// Upgrading lite -> full. Scene and background were generated against the
		// lite skeleton and must not be thrown away; regenerating them would run
		// their wildcard expansion a second time and double every entry.
		for (var existing in finalKeywordSet) {
			if (!Object.prototype.hasOwnProperty.call(finalKeywordSet, existing)) { continue; }
			if (existing.indexOf("scene") === 0 || existing.indexOf("background") === 0) {
				sceneAndBackground[existing] = finalKeywordSet[existing];
			}
		}
	}

	if (mode === "lite") {
		clothesKeywordSets = emptyKeywordSets(clothesKeywordDB);
		bodyKeywordSets = emptyKeywordSets(bodyKeywordDB);
	} else {
		clothesKeywordSets = buildAllFinalKeywordSets( clothesKeywordDB, modifierKeywordDB, singletonKeywordDB, "clothes" );
		bodyKeywordSets = buildAllFinalKeywordSets(bodyKeywordDB, modifierKeywordDB, singletonKeywordDB, "body");
	}

	// merge them into one final object
	finalKeywordSet = {
	...clothesKeywordSets,
	...bodyKeywordSets,
	...sceneAndBackground
	};
	finalKeywordSetMode = mode;
}

// One empty Set per category, so the NAMES are all present. Scene generation
// reads Object.keys(finalKeywordSet) to find the clothes and body categories and
// then goes to the keyword DBs for the items, so names alone are enough for it.
function emptyKeywordSets(keywordDB) {
	var sets = {};
	for (var category in keywordDB) {
		if (!Object.prototype.hasOwnProperty.call(keywordDB, category)) { continue; }
		sets[category] = new Set();
	}
	return sets;
}

// Call before anything that reads the MEMBERS of a body or clothes category.
// Cheap when the sets are already full; ~4 seconds and ~8 M entries when not.
function ensureFullKeywordSets() {
	if (finalKeywordSetMode === "full") { return; }
	buildFinalKeywordSets("full");
}

// Add singletonKeywordDB entries to finalKeywordSet
function addSingletonToSets(finalSets, categoryName, keyword) {
  if (!finalSets[categoryName]) {
    finalSets[categoryName] = new Set();
  }
  finalSets[categoryName].add(keyword.trim());
  //console.info(`Added singleton '${keyword}' to category '${categoryName}' (now ${finalSets[categoryName].size} entries)`);
}

// #endregion Database Assembly Functions *****************************



// #region Misc Helper Functions *****************************

// Keyword placeholder expander helper
const placeholderMap = {
  color: "colors",
  variant: "variants",
  size: "sizes",
  ornament: "ornaments",
  shape: "shapes",
  species: "species",
};

function expandPlaceholders(str, modifierDB) {
  const regex = /\(([^)]+)\)/; // matches first "(token)"
  const m = str.match(regex);
  if (!m) return [str];

  const token = m[1].trim(); // e.g., "shape" or "color"
  const dbKey = placeholderMap[token];
  if (!dbKey || !Array.isArray(modifierDB[dbKey]) || modifierDB[dbKey].length === 0) {
    console.warn(`Unknown placeholder: ${token}`);
    // unknown placeholder - return as-is to avoid losing it
    return [str];
  }

  const expansions = [];
  // replace only the first occurrence (regex finds first), then recursively expand any remaining placeholders
  for (const val of modifierDB[dbKey]) {
    const replaced = str.replace(regex, val);
    const further = expandPlaceholders(replaced, modifierDB);
    for (const f of further) expansions.push(f);
  }
  return expansions;
}

// Duplicate remover helper
function removeDuplicates(prompt) {
    prompt = prompt.replaceAll(", ,", ",");
    var keywords = prompt.split(", ");
    var uniqueKeywords = [];
    for (keywordIndex = 0; keywordIndex < keywords.length; keywordIndex++) {
        if (uniqueKeywords.indexOf(keywords[keywordIndex]) == -1) {
            uniqueKeywords.push(keywords[keywordIndex]);
        }
    }
    return uniqueKeywords.join(", ");
}

async function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); // strip data:image/png;base64,
        reader.onerror = reject;
    });
}

// #endregion Misc Helper Functions *****************************





// Testing box used to check for missing keywords

//Test for single keywords per line
var dirtyDatabase = `
artist:fisticuffs club
`

function cleanDirtyDatabase() {
    // Split dirty DB into lines, trim whitespace, filter blanks
    const dirtyKeywords = dirtyDatabase
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

    // Collect all known keywords into a single Set
    const allKeywords = new Set();
    for (const category in finalKeywordSet) {
        for (const kw of finalKeywordSet[category]) {
            allKeywords.add(kw);
        }
    }

    // Keep only those not already in DB
    const cleaned = dirtyKeywords.filter(kw => !allKeywords.has(kw));

    return cleaned;
}

//Test for multiple keywords per line
var dirtyArray = `
1futa, black gloves, blonde hair, blush, breasts, character:lumine (genshin impact), creator:masso nullbuilt, crop top, erection, fingerless gloves, flower, flower on head, foreskin, foreskin insertion, foreskin pull, futanari, gloves, hair between eyes, large breasts, large penis, looking at penis, looking down, medium breasts, meta:highres, navel, open mouth, penis, rating:explicit, series:genshin impact, smegma, solo, solo focus, sweat, testicles, thighs, tongue, urethra, urethral fingering, urethral insertion, veins, veiny penis, white background, yellow eyes
1girl, 10s, breasts, cameltoe, character:dragon yukano, covered erect nipples, creator:henriiku (ahemaru), female focus, from below, gigantic breasts, grey hair, huge breasts, impossible clothes, long hair, meta:highres, ninja, nipples, puffy nipples, purple eyes, rating:questionable, ribbon, scarf, series:ninja slayer, solo, standing
`;

function cleanDirtyArray(mode) {
    dirtyArray = dirtyArray.split("\n")
    for (var dirtyIndex = 0; dirtyIndex < dirtyArray.length; dirtyIndex++) {
        dirtyArray[dirtyIndex] = dirtyArray[dirtyIndex].trim();
        if (dirtyArray[dirtyIndex] != "") {
            dirtyArray[dirtyIndex] = checkForDirt(dirtyArray[dirtyIndex]);
            dirtyArray[dirtyIndex] = normalizeSpacing(dirtyArray[dirtyIndex]);
            dirtyArray[dirtyIndex] = normalizeParenthesis(dirtyArray[dirtyIndex], "remove");
            dirtyArray[dirtyIndex] = replaceInitialCleanup(dirtyArray[dirtyIndex]);
            dirtyArray[dirtyIndex] = normalizeSubitemKeywords(dirtyArray[dirtyIndex], clothesKeywordDB, modifierKeywordDB);
            dirtyArray[dirtyIndex] = normalizeSubitemKeywords(dirtyArray[dirtyIndex], bodyKeywordDB, modifierKeywordDB);
            dirtyArray[dirtyIndex] = replaceFinalCleanup(dirtyArray[dirtyIndex].trim(), "syuro, uncensored, masterpiece, best quality, amazing quality, very aesthetic, absurdres, newest");
        }
        else {
            dirtyArray.splice(dirtyIndex, 1);
            dirtyIndex--;
        }
    }
    if (mode) {
        if (mode == "cleanup") {
            return dirtyArray.join("\n");
        }
    }
    else {
        //Drop any tag starting with "artist: "
        dirtyArray = dirtyArray.join(", ");
        dirtyArray = dirtyArray.split(", ");
        for (var dirtyIndex = 0; dirtyIndex < dirtyArray.length; dirtyIndex++) {
            if (dirtyArray[dirtyIndex].startsWith("artist: ")) {
                dirtyArray.splice(dirtyIndex, 1);
                dirtyIndex--;
            }
        }
        dirtyArray = dirtyArray.join(", ");
        return displayPrompt(dirtyArray);
    }
}

var extractedCharacters = "";
var extractedSeries = "";
var extractedRaces = "";
var extractedMeta = "";
var extractedArtists = "";
var extractedNegative = "";

// One line of a `--prompt "…" --negative_prompt "…"` paste. Returns the prompt
// half and the negative half; a line carrying neither flag comes back untouched.
//
// Split out of checkForDirt so it can run PER LINE. Run on the whole block it
// folded a multi-line paste down to whichever line happened to carry the flag
// and threw every other line away — see the note at the call site.
function extractCommandLineFlags(line) {
    var out = { prompt: line, negative: "" };
    if (line.indexOf("negative_prompt") === -1 && line.indexOf("--prompt") === -1) { return out; }

    var body = line;
    if (line.indexOf("negative_prompt") !== -1) {
        var halves = line.split(`\" --negative_prompt`);
        //Keep the negative rather than parsing it out and dropping it
        if (halves[1]) {
            var negativeQuoted = halves[1].split(`\"`);
            if (negativeQuoted[1]) {
                out.negative = negativeQuoted[1].trim();
            }
        }
        //Fall back to the untouched half rather than undefined if the flag is absent
        body = halves[0];
    }
    if (body.includes(`--prompt \"`)) {
        body = body.split(`--prompt \"`)[1];
        //A `--prompt "x"` with no negative flag after it still owns a closing quote
        if (body.indexOf(`\"`) !== -1) { body = body.split(`\"`)[0]; }
    }
    out.prompt = body;
    return out;
}

function checkForDirt(prompt) {
    extractedNegative = "";
    //Case 1: extracted from uncleaned .txt, or a `--prompt "…"` command line.
    //
    //PER LINE, because a newline is a prompt boundary everywhere else in this
    //engine — assemblePrompt splits `multiple` mode on it and v2 folds it to a
    //comma. Doing this to the whole block meant that
    //
    //    test
    //    --prompt "test2" --negative_prompt "futanari"
    //
    //split once on the flag and kept only `test2`: the first line was inside the
    //discarded half, so pasting several jobs at once silently generated one.
    if (prompt.includes("negative_prompt") || prompt.includes("--prompt")) {
        var lines = prompt.split("\n");
        for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            var extracted = extractCommandLineFlags(lines[lineIndex]);
            lines[lineIndex] = extracted.prompt;
            //First one wins. The negative box is one field for the whole run, so
            //several lines each carrying their own cannot all be honoured, and
            //silently concatenating them would ask for tags nobody typed.
            if (extracted.negative != "" && extractedNegative == "") {
                extractedNegative = extracted.negative;
            }
        }
        prompt = lines.join("\n");
    }
    //Case 2: Copypasted from gelbooru
    if (prompt[0] == "?") {
        //Tricky situation, check if there are at least 3 ? in the prompt
        if (prompt.split("?").length > 3) {
            prompt = cleanGelbooru(prompt);
        }
    }
    if (prompt.includes("Tag?")) {
        prompt = cleanGelbooru(prompt);
    }
    //Case 3: <lora:Syurofluff present
    if (prompt.includes("<lora:")) {
        //Remove brackets containing syurofluff lora
        prompt = prompt.replace(/<lora:Syurofluff.*>/g, "");
    }
    //Case 4: Mobile gelbooru, numbers instead of commas (IE rosalina 2561girl 6000hat 398)
    //A mobile paste is defined by having no commas, not by having digits. Counting digits
    //alone flagged clean prompts like "1girl, 2girls, 3boys, 2024, 4koma, 6+boys" as dirty
    //and ran them through the mobile parser.
    //
    //Counted PER LINE for the same reason Case 1 is split per line: a newline is a
    //prompt boundary. Over the whole block, three one-tag lines — `1girl`, `1boy`,
    //`2girls` — are three digit runs and no commas, and the mobile parser ran on a
    //paste that was already clean.
    var dirtLines = prompt.split("\n");
    for (var dirtLineIndex = 0; dirtLineIndex < dirtLines.length; dirtLineIndex++) {
        var digitRuns = (dirtLines[dirtLineIndex].match(/\d+/g) || []).length;
        var commaCount = (dirtLines[dirtLineIndex].match(/,/g) || []).length;
        if (digitRuns > commaCount + 1) {
            dirtLines[dirtLineIndex] = cleanMobile(dirtLines[dirtLineIndex]);
        }
    }
    prompt = dirtLines.join("\n");

    //Cleanup
    prompt = prompt.split(",");
    for (promptIndex = 0; promptIndex < prompt.length; promptIndex++) {
        //Always step back after a splice and re-test the shifted element. Guarding the
        //decrement on promptIndex > 0 skipped whatever moved into position 0, and could
        //read undefined off the end of a one-element array.
        if (prompt[promptIndex].includes("meta:")) {
            extractedMeta += prompt[promptIndex].replace("meta:", "") + ", ";
            prompt.splice(promptIndex, 1);
            promptIndex--;
            continue;
        }
        if (prompt[promptIndex].includes("artist:")) {
            extractedArtists += prompt[promptIndex].replace("artist:", "") + ", ";
            prompt.splice(promptIndex, 1);
            promptIndex--;
            continue;
        }
        if (prompt[promptIndex].includes("creator:")) {
            extractedArtists += prompt[promptIndex].replace("creator:", "") + ", ";
            prompt.splice(promptIndex, 1);
            promptIndex--;
            continue;
        }
        if (prompt[promptIndex].includes("species:")) {
            prompt[promptIndex] = prompt[promptIndex].replace("species:", "");
            extractedRaces += prompt[promptIndex] + ", ";
        }
        if (prompt[promptIndex].includes("series:")) {
            prompt[promptIndex] = prompt[promptIndex].replace("series:", "");
            extractedSeries += prompt[promptIndex] + ", ";
        }
        if (prompt[promptIndex].includes("character:")) {
            prompt[promptIndex] = prompt[promptIndex].replace("character:", "");
            extractedCharacters += prompt[promptIndex] + ", ";
            if (prompt[promptIndex].includes("\\(")) {
                var newSeries = prompt[promptIndex].split("\\(")[1];
                newSeries = newSeries.split("\\)")[0];
                extractedSeries += newSeries + ", ";
            }
        }
        if (prompt[promptIndex].includes("\\(fate")) {
            extractedCharacters += prompt[promptIndex] + ", ";
        }
        if (prompt[promptIndex].includes("\\(pokemon")) {
            extractedCharacters += prompt[promptIndex] + ", ";
        }
        if (prompt[promptIndex].includes("\\(league of legends")) {
            extractedCharacters += prompt[promptIndex] + ", ";
        }
    }
    extractedCharacters = removeDuplicates(extractedCharacters);
    extractedSeries = removeDuplicates(extractedSeries);
    prompt = prompt.join(",");
    return prompt;
}

function cleanGelbooru(input, { asArray = false } = {}) {
    if (!input) return asArray ? [] : "";

    // normalize non-breaking spaces
    input = input.replace(/\u00A0/g, " ");
    // Protect artist names
    input = input.replace ("Artist? ", "artist: ")

    // split on question marks (they're the main separators in the copy)
    const parts = input.split("?");

    // category words to remove (case-insensitive). Removed anywhere in a segment.
    const removeCategories = /(?:Character|Copyright|Deprecated|Metadata|Tag)/gi;

    var out = [];

    for (let i = 0; i < parts.length; i++) {
        const raw = parts[i];
        const rawTrim = raw.trim();

        // an empty segment between two '?' characters indicates a literal "?" tag.
        // but ignore a leading empty segment (i === 0) because that usually comes from a header.
        if (rawTrim === "") {
            if (i > 0) out.push("?");
            continue;
        }

        // remove category words even if attached (e.g. "51Character")
        let seg = raw.replace(removeCategories, "").trim();

        // if removing categories left it empty, it was purely a section label
        if (seg === "") continue;

        // remove standalone numeric tokens (tag counts), but keep numbers embedded in words (e.g. "1boy")
        seg = seg.replace(/\s+\d+$/g, "").trim();

        if (!seg) continue;

        // collapse internal whitespace and push
        seg = seg.replace(/\s+/g, " ").trim();
        out.push(seg);
    }
    out = out.filter(tag => !/^\d+$/.test(tag));

    out = out.join(", ");
    out = out.replaceAll(", ?,", ", question mark,");
    out = out.replaceAll(", ??,", ", question mark,");
    out = out.replaceAll(", !,", ", exclamation point,");
    out = out.replaceAll(", !!,", ", exclamation point,");
    out = out.replaceAll(", ?!,", ", question mark, exclamation point,");
    out = out.replaceAll(", !?,", ", question mark, exclamation point,");
    return out;
}

function cleanMobile(input) {
  const exceptions = ['girl','girls','futa','futas','boy','boys'];

  const s = input || "";
  const n = s.length;
  let i = 0;
  let current = "";
  const tags = [];

  while (i < n) {
    const ch = s[i];

    if (/\d/.test(ch)) {
      // consume the whole number
      let j = i;
      while (j < n && /\d/.test(s[j])) j++;
      const numStr = s.slice(i, j);

      // check if number is immediately followed by an exception word (preserve case)
      let matchedSuffix = null;
      let matchedLen = 0;
      for (const ex of exceptions) {
        const exLen = ex.length;
        if (j + exLen <= n) {
          const slice = s.slice(j, j + exLen);
          if (slice.toLowerCase() === ex && (j + exLen === n || !/\w/.test(s[j + exLen]))) {
            matchedSuffix = slice; // keep original casing
            matchedLen = exLen;
            break;
          }
        }
      }

      if (matchedSuffix) {
        // finalize the tag we were building (if any)
        const t = current.trim();
        if (t) tags.push(t);
        current = "";

        // keep only the last digit + the exception suffix
        const lastDigit = numStr[numStr.length - 1];
        tags.push(lastDigit + matchedSuffix);

        // advance past the suffix
        i = j + matchedLen;
        continue;
      } else {
        // digits are a separator/count -> finalize current tag and skip the digits
        const t = current.trim();
        if (t) tags.push(t);
        current = "";
        i = j;
        // skip any whitespace after the number
        while (i < n && /\s/.test(s[i])) i++;
        continue;
      }
    } else {
      // accumulate characters as part of the current tag (includes spaces, punctuation, backslashes, etc.)
      current += ch;
      i++;
    }
  }

  // push last buffered tag
  const last = current.trim();
  if (last) tags.push(last);

  // normalize internal whitespace in tags (collapse multiple spaces) and join
  return tags
    .map(t => t.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join(', ');
}