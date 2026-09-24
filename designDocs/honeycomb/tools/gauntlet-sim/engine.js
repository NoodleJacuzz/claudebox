//Headless Honeycomb engine for scratch experiments. Mirrors newEngine() in tools/test-honeycomb.js.
const fs = require("fs");
const vm = require("vm");
const path = require("path");
const ROOT = path.resolve(__dirname, "..", "..", "..", "..", "scripts", "misc");
const suite = fs.readFileSync(path.resolve(__dirname, "..", "test-honeycomb.js"), "utf8");
const FILES = eval(suite.slice(suite.indexOf("const FILES = [") + "const FILES = ".length, suite.indexOf("];", suite.indexOf("const FILES = [")) + 1));
module.exports = function newEngine(options) {
	const store = {};
	const errorArray = [];
	const sandbox = {
		console: { log() {}, warn(...a) { if (options && options.warn) console.log("[warn]", ...a); }, debug() {}, info() {},
			error(...a) { errorArray.push(a.join(" ")); console.error("[engine error]", ...a); } },
		localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
		Date, Math, JSON, encodeURI, encodeURIComponent, decodeURIComponent,
		Object, Array, String, Number, Infinity, parseInt, parseFloat, setTimeout, clearTimeout,
		document: { getElementById: () => null, createElement: () => ({ style: { setProperty() {} }, appendChild() {}, classList: { add() {}, remove() {} } }), body: null },
	};
	sandbox.window = sandbox;
	vm.createContext(sandbox);
	for (const file of FILES) vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), sandbox, { filename: file });
	sandbox.honeycomb.__errors = errorArray;
	return sandbox.honeycomb;
};
