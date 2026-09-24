// ============================================================================
//  WEBUI ENGINE v2 — dispatch seam test
// ============================================================================
//
//    node scripts/webui/tools/webui2-dispatch-test.js
//
//  Separate from webui2-test.js because it is the only thing here that needs a
//  DOM, and stubbing one inside the main harness would spoil the property that
//  makes that harness trustworthy: it loads the real files with no stubs at all.
//
//  This covers the ENGINE BRANCH and nothing else — that v1 still runs, that v2
//  runs, that "both" shows each, that an uncompilable prompt refuses to
//  dispatch, and that the LoRA is emitted exactly once.
//
// Smoke-tests the engine branch in sendPrompt with a stub DOM. No browser, no
// network: `testing = true` makes sendPrompt stop before the POST, so this
// exercises the branch, the display call and the size/style code only.
const fs = require("fs"), vm = require("vm"), path = require("path");
// One up from tools/: `here` means the engine directory, which is what every
// path below is relative to.
const here = path.join(__dirname, "..");

const elements = {};
function element(id) {
    if (!elements[id]) {
        elements[id] = {
            id: id, value: "", innerHTML: "", textContent: "",
            style: { display: "none" }, files: [],
            appendChild: function () {}, remove: function () {}
        };
    }
    return elements[id];
}

const sandbox = {
    console: { log() {}, info() {}, warn() {}, debug() {}, error: console.error },
    module: undefined,
    document: {
        getElementById: element,
        createElement: function () {
            return { style: "", innerHTML: "", textContent: "", appendChild: function () {} };
        }
    },
    localStorage: {
        store: {},
        getItem: function (k) { return this.store[k] || null; },
        setItem: function (k, v) { this.store[k] = v; }
    },
    fetch: function () { throw new Error("network reached — testing flag failed"); },
    window: {}
};
vm.createContext(sandbox);

const src = fs.readFileSync(path.join(here, "webui.js"), "utf8");
const libs = src.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/)[1]
    .match(/"([^"]+)"/g).map(q => q.slice(1, -1));
for (const f of libs) vm.runInContext(fs.readFileSync(path.join(here, "libraries", f), "utf8"), sandbox, { filename: f });
for (const f of ["webui.js", "webui2-categories.js", "webui2.js"]) vm.runInContext(fs.readFileSync(path.join(here, f), "utf8"), sandbox, { filename: f });
vm.runInContext("v2EnsureDictionaries(); testing = true;", sandbox);

let pass = 0, fail = 0;
function check(label, actual, want) {
    const ok = JSON.stringify(actual) === JSON.stringify(want);
    if (ok) { pass++; console.log("  ok    " + label); }
    else { fail++; console.log("  FAIL  " + label + "\n          want " + JSON.stringify(want) + "\n          got  " + JSON.stringify(actual)); }
}

async function run(engine, prompt, negative, layout) {
    element("resultArea").innerHTML = "";
    vm.runInContext("promptSettings.engine = " + JSON.stringify(engine) + ";", sandbox);
    vm.runInContext("promptLayout = " + JSON.stringify(layout || "sorted") + ";", sandbox);
    await sandbox.sendPrompt(prompt, negative || "", "Default", "1", "Syurofluff v7");
    return element("resultArea").innerHTML;
}

(async function () {
    console.log("\n== the engine branch in sendPrompt ==\n");

    const v1 = await run("v1", "1girl, blonde hair, head shot");
    check("v1 still renders", v1.length > 0, true);
    check("and it is v1's layout, not v2's", v1.indexOf("Character Keywords") !== -1, true);

    // `large breasts` is at the chest rung, which a head shot crops away — so
    // this prompt exercises the culled section of the trace as well.
    const v2 = await run("v2", "1girl, blonde hair, large breasts, head shot");
    check("v2 renders",              v2.indexOf("blonde hair") !== -1, true);
    // On its own it is just "the prompt" — badging it "v2:" is noise.
    check("and is not labelled v2",  v2.indexOf("v2: "), -1);
    // `sorted` is the working view: v1's sections, and the cull that actually
    // removed something. The trace is not in it — on a six-tag prompt it was
    // fifteen "added" rows of engine bookkeeping around one real result.
    check("sorted groups by domain",  v2.indexOf("Character Keywords") !== -1, true);
    check("and names the real cull",  v2.indexOf("Culled: ") !== -1, true);
    check("and leaves the trace out", v2.indexOf("Added ("), -1);

    const detailed = await run("v2", "1girl, blonde hair, large breasts, head shot", "", "detailed");
    check("detailed lists the categories", detailed.indexOf("Categories:") !== -1, true);
    check("and the trace in full",         detailed.indexOf("Added (") !== -1, true);
    check("and still groups by domain",    detailed.indexOf("Character Keywords") !== -1, true);

    const plain = await run("v2", "1girl, blonde hair, large breasts, head shot", "", "plain");
    check("plain is the prompt and nothing else", plain.indexOf("Character Keywords"), -1);
    check("but it is still the prompt",           plain.indexOf("blonde hair") !== -1, true);

    const both = await run("both", "1girl, blonde hair, head shot");
    check("compare shows v1", both.indexOf("v1: ") !== -1, true);
    check("compare shows v2", both.indexOf("v2: ") !== -1, true);

    // A prompt that cannot compile must stop, not generate.
    const broken = await run("v2", "1girl, {unclosed scope");
    check("an uncompilable prompt is refused", broken.indexOf("did not compile") !== -1, true);

    // The two things dispatch must never do twice.
    const lora = await run("v2", "1girl, <lora:leafan:1>, blonde hair");
    check("the lora is in the v2 string exactly once",
          (lora.match(/<lora:leafan:1>/g) || []).length, 1);

    // ---- the prompt-side size and style override ---------------------------
    // The keyword is read in the ENGINE and applied at DISPATCH, so this is the
    // only harness that can see the second half happen. `finalWidth` and
    // `finalHeight` are plain globals assigned just above the `testing` guard,
    // which is what makes them readable from here; `finalStyle` is a `let`
    // inside sendPrompt and is not, so the style half is proved on job.style in
    // the main harness and on the text scan below.
    console.log("\n   a size keyword in the prompt beats the dropdown\n");
    {
        const sizeOf = async function (prompt) {
            // "Default" is 1024x1024 — anything else came from the keyword.
            await run("v2", prompt);
            return vm.runInContext("finalWidth + \"x\" + finalHeight", sandbox);
        };
        check("the dropdown alone is 1024x1024", await sizeOf("1girl, blonde hair"), "1024x1024");
        check("`portrait` overrides it",         await sizeOf("1girl, portrait"),    "832x1216");
        check("`landscape` too",                 await sizeOf("1girl, landscape"),   "1216x832");
        check("and an alias resolves",           await sizeOf("1girl, wide"),        "1216x832");
        // Whole tag, which is the case Noodle named.
        check("`square jaw` changes nothing",    await sizeOf("1girl, square jaw"),  "1024x1024");
        // Rule 2b — the escape hatch for a keyword that is also a real tag.
        check("and neither does a quoted one",   await sizeOf('1girl, "landscape"'), "1024x1024");
    }

    console.log("\n   and it beats \"Multiple\", which is a fan-out and not a size\n");
    {
        // sendPromptArray is where "Multiple" turns one job into seven. Without
        // reading the keyword there too, a prompt that names a size would send
        // the same picture seven times.
        const sent = [];
        const real = sandbox.sendPrompt;
        sandbox.sendPrompt = async function (p, n, size) { sent.push(size); };
        try {
            await sandbox.sendPromptArray("1girl, blonde hair", "", "Multiple", "1", "Syurofluff v7");
            check("Multiple still fans out on its own", sent.length, 7);
            sent.length = 0;
            await sandbox.sendPromptArray("1girl, portrait", "", "Multiple", "1", "Syurofluff v7");
            check("a size keyword collapses it to one", sent.length, 1);
            check("and it is the size that was asked for", sent[0], "Portrait");
        }
        finally { sandbox.sendPrompt = real; }
    }

    // ---- the PAGE's startup order, in a context of its own -----------------
    // This is the only test that builds the dictionaries the way the browser
    // does, and it exists because a bug lived there that no other harness could
    // see. `generatetxt2img` builds the dictionaries v1 shares; cullDB is v2's
    // alone and it has never heard of it. v2EnsureDictionaries used to return
    // early when the shared ones were already built, taking cullDB with it — so
    // in the browser `cleanedCullArray` was empty and EVERY cull silently did
    // nothing, while every headless run passed.
    //
    // If a future v2-only dictionary is added and not ensured, this fails.
    console.log("\n   the page's startup order builds v2's own dictionaries too\n");
    {
        const page = { console: { log() {}, info() {}, warn() {}, debug() {}, error() {} },
                       module: undefined };
        vm.createContext(page);
        for (const f of libs) {
            vm.runInContext(fs.readFileSync(path.join(here, "libraries", f), "utf8"), page, { filename: f });
        }
        for (const f of ["webui.js", "webui2-categories.js", "webui2.js"]) {
            vm.runInContext(fs.readFileSync(path.join(here, f), "utf8"), page, { filename: f });
        }
        // Everything generatetxt2img does to the dictionaries, minus the DOM.
        vm.runInContext(`
            buildFinalKeywordSets("lite");
            generateSceneCategorySet();
            generateBackgroundCategorySet();
            cleanupCharacterArray();
            cleanupBrandArray();
            cleanupAliasArray();
            establishRules(cleaningArrayInitial, "initial");
            establishRules(cleaningArrayFinal, "final");
            cleanupNamesArray();
        `, page);

        vm.runInContext("v2EnsureDictionaries()", page);
        const commands = vm.runInContext("cleanedCullArray.length", page);
        check("cull commands exist after the page built the shared half",
              commands > 0, true);

        // Twice must be the same as once — nothing here reassigns its source
        // array, so a second pass would append every rule again.
        vm.runInContext("v2EnsureDictionaries()", page);
        check("and ensuring twice does not double them",
              vm.runInContext("cleanedCullArray.length", page), commands);

        const out = page.buildPrompt("nude, nipple slip, skirt lift, blue shirt", "", {}).prompt;
        check("so a coverage cull actually fires", out.indexOf("blue shirt"), -1);
        check("and the trigger survives it (Rule 17)", out.indexOf("nude") !== -1, true);

        console.log("\n   the prompt seed crosses the file boundary (SKYBOXES.md D·4)\n");

        // `promptRunSeed` is declared and hashed in webui.js; `v2HashString` is
        // DEFINED in webui2.js, which the page loads afterwards. That only works
        // because the call happens at click time rather than at load time — so
        // it is worth proving in the page's real load order rather than in the
        // main harness, which is why this lives here.
        check("webui.js can see the hash from webui2.js",
              vm.runInContext("typeof v2HashString", page), "function");
        check("and the run-seed global exists",
              vm.runInContext("typeof promptRunSeed", page), "number");

        // The guard in sendPromptArray degrades to 0 rather than throwing if
        // webui2.js is ever missing, and buildPrompt falls back to hashing its
        // own input. Both halves of that contract:
        check("a zero seed is falsy, so no promptSeed is passed",
              vm.runInContext("promptRunSeed ? true : false", page), false);
        const fallback = page.buildPrompt("1girl, playerHouse", "", {});
        check("and the fallback still produces one",
              typeof fallback.seed === "number" && fallback.seed > 0, true);

        // The settings COPY: promptSettings is persisted, so the per-run seed
        // must not end up in it and be restored next session as a choice.
        vm.runInContext("promptRunSeed = 4242;", page);
        const copied = vm.runInContext(
            "(function () { var s = Object.assign({}, promptSettings);" +
            " if (promptRunSeed) { s.promptSeed = promptRunSeed; }" +
            " return { onCopy: s.promptSeed, onOriginal: promptSettings.promptSeed }; })()", page);
        check("the seed rides on the copy",        copied.onCopy, 4242);
        check("and never touches promptSettings",  copied.onOriginal, undefined);
    }

    // ---- the REGIONAL adapter, in a context of its own ---------------------
    // Its own context because loading webui-regional.js puts an
    // extractRegionalTrigger in front of every sendPrompt above, and that
    // function normalises commas on prompts that asked for no regions at all.
    // The main block's job is the engine branch; this one's is the adapter.
    console.log("\n   the regional adapter\n");
    {
        const rp = { console: { log() {}, info() {}, warn() {}, debug() {}, error() {} },
                     module: undefined };
        vm.createContext(rp);
        for (const f of libs) {
            vm.runInContext(fs.readFileSync(path.join(here, "libraries", f), "utf8"), rp, { filename: f });
        }
        for (const f of ["webui.js", "webui2-categories.js", "webui2.js", "webui-regional.js"]) {
            vm.runInContext(fs.readFileSync(path.join(here, f), "utf8"), rp, { filename: f });
        }
        vm.runInContext("v2EnsureDictionaries()", rp);

        const build = (input, negative) => {
            const run = rp.extractRegionalTrigger(input);
            if (run.error) { return { error: run.error }; }
            const job = rp.buildPrompt(run.prompt, negative || "", {});
            const req = rp.buildRegionalRequest(job.prompt, "STYLE", job, run);
            return { run, job, req };
        };

        // The layout maths, which was measured and was never the problem.
        const twoFig = "frieren {head shot}, fern {full body}";
        check("a horizontal split is Columns",
              [build("rp1-2, " + twoFig).req.args[3], build("rp1-2, " + twoFig).req.args[6]],
              ["Columns", "1,2"]);
        check("a vertical split is Rows",
              [build("rp1/2, " + twoFig).req.args[3], build("rp1/2, " + twoFig).req.args[6]],
              ["Rows", "1,2"]);

        // Calc mode, typed beside the layout. Attention blends and is the default;
        // Latent runs the diffusion per region and separates hard.
        check("Attention is the default",       build("rp1/2, " + twoFig).req.args[11], "Attention");
        check("`latent` selects Latent",        build("rp1/2 latent, " + twoFig).req.args[11], "Latent");
        check("and the layout still parses",    build("rp1/2 latent, " + twoFig).req.args[6], "1,2");
        check("the word may come first",        build("rp latent 1/2, " + twoFig).req.args[11], "Latent");
        check("and works with no layout at all", build("rp latent, " + twoFig).req.args[11], "Latent");
        check("`attention` is accepted too",    build("rp1/2 attention, " + twoFig).req.args[11], "Attention");
        // It is per job and must never write back to the standing default.
        build("rp1/2 latent, " + twoFig);
        check("the setting is not overwritten",
              vm.runInContext("regionalSettings.calcmode", rp), "Attention");
        // An unreadable layout is still fatal, and the message names what was left
        // after the calc-mode words came out.
        check("a bad layout is still an error", !!build("rp 1-1/1, " + twoFig).error, true);

        // An EMPTIED common block. `2girls, duo` in the negative is culled out of
        // the prompt in Phase 7, and on a two-figure shot they were the whole
        // common line — so the adapter came in a line short, failed its `< 3`
        // guard, and generated with NO REGIONS and no message.
        {
            const negated = build("rp1/2, " + twoFig, "2girls, duo");
            check("the engine renders only two lines",
                  negated.job.prompt.split("\n").length, 2);
            check("but the adapter still builds a request", !!negated.req, true);
            check("with both figures in their own cells",   negated.req.cells, 2);
            // The style has to be in the common block whatever else is.
            check("and the style in the common block",
                  negated.req.prompt.indexOf("STYLE BREAK"), 0);
        }
        // The ordinary path is unchanged: line 0 is still the common block.
        {
            const normal = build("rp1/2, " + twoFig);
            check("a normal run keeps its common line", normal.job.hasCommonLine, true);
            check("and still has two cells",            normal.req.cells, 2);
        }
    }

    console.log("\n" + pass + " passed, " + fail + " failed\n");
    process.exit(fail ? 1 : 0);
})();
