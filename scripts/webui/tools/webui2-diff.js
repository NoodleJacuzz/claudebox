// ============================================================================
//  WEBUI ENGINE — headless differ
// ============================================================================
//
//    node scripts/webui/tools/webui2-diff.js "a prompt" "another prompt" ...
//    node scripts/webui/tools/webui2-diff.js --file prompts.txt
//
//  Runs BOTH engines over the same prompts and prints them side by side. Same
//  job as the "Compare (no image)" dropdown, but in bulk and without a browser —
//  which is what the corpus phase needs.
//
//  It stubs a DOM because v1's pipeline writes its result into the page as it
//  goes. `testing = true` stops sendPrompt before the POST, so nothing is
//  generated and nothing leaves the machine.
//
//  Add --records to dump v2's full record list for each prompt.
// ============================================================================

const fs = require("fs");
const vm = require("vm");
const path = require("path");

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
    console: { log() {}, info() {}, warn() {}, debug() {}, error() {} },
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
    fetch: function () { throw new Error("network reached — the testing flag failed"); },
    window: {}
};
vm.createContext(sandbox);

const src = fs.readFileSync(path.join(here, "webui.js"), "utf8");
const libs = src.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/)[1]
    .match(/"([^"]+)"/g).map(function (q) { return q.slice(1, -1); });
for (const f of libs) {
    vm.runInContext(fs.readFileSync(path.join(here, "libraries", f), "utf8"), sandbox, { filename: f });
}
for (const f of ["webui.js", "webui2-categories.js", "webui2.js"]) {
    vm.runInContext(fs.readFileSync(path.join(here, f), "utf8"), sandbox, { filename: f });
}
// `plain` layout keeps v1's output a bare string instead of the category markup.
vm.runInContext("v2EnsureDictionaries(); testing = true; promptLayout = 'plain';", sandbox);

const args = process.argv.slice(2);
const showRecords = args.indexOf("--records") !== -1;
let prompts = args.filter(function (a) { return a.indexOf("--") !== 0; });

const fileFlag = args.indexOf("--file");
if (fileFlag !== -1) {
    const listed = fs.readFileSync(args[fileFlag + 1], "utf8").split("\n")
        .map(function (l) { return l.trim(); })
        .filter(function (l) { return l && l.charAt(0) !== "#"; });
    prompts = prompts.filter(function (p) { return p !== args[fileFlag + 1]; }).concat(listed);
}

if (!prompts.length) {
    console.log("usage: node webui2-diff.js \"prompt\" [...]  |  --file prompts.txt  [--records]");
    process.exit(1);
}

(async function () {
    let differ = 0;
    for (const input of prompts) {
        element("resultArea").innerHTML = "";
        vm.runInContext("promptSettings.engine = 'v1';", sandbox);
        await sandbox.sendPrompt(input, "", "Default", "1", "Syurofluff v7");
        const v1 = element("resultArea").innerHTML.replace(/<[^>]*>/g, "").trim();

        const job = sandbox.buildPrompt(input, "", {});
        const v2 = job.prompt.replace(/\n/g, " / ");

        console.log("### " + input);
        console.log("  v1: " + v1);
        console.log("  v2: " + v2);

        // Set difference both ways — the useful signal is which TAGS appeared or
        // vanished, not that the order changed. Order is expected to differ.
        const split = function (s) {
            return s.split(",").map(function (t) { return t.trim().replace(/^\(+|\)+$/g, ""); })
                    .filter(Boolean);
        };
        const a = split(v1), b = split(v2);
        const gained = b.filter(function (t) { return a.indexOf(t) === -1; });
        const lost   = a.filter(function (t) { return b.indexOf(t) === -1; });
        if (gained.length) { console.log("   +v2 only: " + gained.join(", ")); }
        if (lost.length)   { console.log("   -v1 only: " + lost.join(", ")); }
        if (gained.length || lost.length) { differ++; }
        if (job.errors.length) { console.log("   ERRORS: " + job.errors.join("; ")); }

        if (showRecords) {
            for (const r of job.records) {
                const flags = [
                    r.culledBy ? "culled:" + r.culledBy : null,
                    r.owner ? "owner:" + r.owner : null,
                    r.booster ? "booster" : null,
                    r.source !== "input" ? r.source : null
                ].filter(Boolean).join("  ");
                console.log("      " + JSON.stringify(r.text).padEnd(30) + " " + flags);
            }
        }
        console.log("");
    }
    console.log(prompts.length + " prompts, " + differ + " with a tag-level difference");
})();
