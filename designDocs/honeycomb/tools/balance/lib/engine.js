/**
 * Loads the real Honeycomb engine into a Node `vm` sandbox for the balance tests. Not part of the game.
 *
 * Shared by Basic Bite and All the Crunch (balance_tests/BRIEF.md Step 2) so the two tests can never
 * load the game differently. The file list is read from `tools/card-inventory.js`, the same place every
 * other headless tool takes it from, so a file added to the game is picked up here without an edit.
 *
 * The game's scenes and overlays are UI. Under a headless engine they are replaced with functions that
 * do nothing, so a map node that "opens a scene" simply returns and the simulation carries on.
 */
const fs = require("fs"), vm = require("vm"), path = require("path");

const ROOT = path.resolve(__dirname, "..", "..", "..", "..", "..", "scripts", "misc");
const inventorySource = fs.readFileSync(path.join(__dirname, "..", "..", "card-inventory.js"), "utf8");
const FILES = eval(inventorySource.match(/const FILES = (\[[\s\S]*?\]);/)[1]);

//options.gauntlet      true or false sets tuning.chessmaster.gauntlet.enabled on THIS loaded copy only. The
//                      switch in the file is Noodle's and is never edited (BRIEF rule 4). Left undefined,
//                      the file's own value stands.
//options.extraFileArray  more files under scripts/misc, loaded after the standard list.
//options.drivenOverlays   true loads the game's own overlay and UI files, and makes `overlay.open` RUN an
//                      overlay's build against a fake element, so an event, shop, treasure or victory
//                      screen does what it does for a player and a simulation can then read the state
//                      it left. The alternative (a do-nothing `open`) is what Basic Bite uses. A
//                      question a card or event asks is not built; it is parked in `honeycomb.parkedChoice`
//                      for the caller to answer. `scene.go` records a request for a fight in
//                      `honeycomb.requestedFight` instead of drawing anything (session 53, BRIEF Step 4).
const DRIVEN_FILES = [
	"honeycomb/honeycomb-ui.js",
	"honeycomb/honeycomb-overlays-combat.js",
];

function loadEngine(options) {
	options = options || {};
	const store = {};
	const sandbox = {
		console: { log() {}, warn() {}, debug() {}, info() {}, error() {} },
		localStorage: {
			getItem: (key) => (key in store ? store[key] : null),
			setItem: (key, value) => { store[key] = String(value); },
			removeItem: (key) => { delete store[key]; },
		},
		Date, Math, JSON, encodeURI, encodeURIComponent, decodeURIComponent,
		Object, Array, String, Number, Infinity, parseInt, parseFloat, setTimeout, clearTimeout,
		document: {
			getElementById: () => null,
			createElement: () => ({ style: { setProperty() {} }, appendChild() {}, classList: { add() {}, remove() {} } }),
			body: null,
		},
	};
	sandbox.window = sandbox;
	vm.createContext(sandbox);
	const loadList = FILES.concat(options.drivenOverlays ? DRIVEN_FILES : [], options.extraFileArray || []);
	for (const file of loadList) {
		vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), sandbox, { filename: file });
	}
	const honeycomb = sandbox.honeycomb;

	const nothing = function () {};
	if (honeycomb.scene != null) honeycomb.scene.go = nothing;
	if (honeycomb.overlay != null) { honeycomb.overlay.open = nothing; honeycomb.overlay.close = nothing; }
	//Runs on every map move; a simulation has nowhere to write to.
	if (honeycomb.save != null) honeycomb.save.autosave = nothing;

	if (options.drivenOverlays) installDrivenOverlays(honeycomb);

	if (options.gauntlet != null) honeycomb.tuning.chessmaster.gauntlet.enabled = options.gauntlet === true;
	return honeycomb;
}

//Replaces the do-nothing overlay and scene stubs with ones a simulation can read back.
function installDrivenOverlays(honeycomb) {
	honeycomb.parkedChoice = null;
	honeycomb.requestedFight = null;
	honeycomb.overlay.openArray.length = 0;
	honeycomb.overlay.open = function (overlayIndex, params) {
		if (overlayIndex === "choice") { honeycomb.parkedChoice = params; return; }
		const definition = honeycomb.findDefinition(honeycomb.overlayArray, overlayIndex);
		if (definition == null) return;
		const layer = { innerHTML: "", style: {}, className: "", onclick: null };
		honeycomb.overlay.openArray.push({ index: overlayIndex, element: layer, params: params == null ? {} : params });
		definition.build(layer, params == null ? {} : params);
	};
	honeycomb.overlay.close = function (overlayIndex) {
		for (let scan = honeycomb.overlay.openArray.length - 1; scan >= 0; scan--) {
			if (overlayIndex != null && honeycomb.overlay.openArray[scan].index !== overlayIndex) continue;
			honeycomb.overlay.openArray.splice(scan, 1);
			if (overlayIndex != null) return;
		}
	};
	honeycomb.overlay.closeAll = function () { honeycomb.overlay.openArray.length = 0; };
	honeycomb.scene.go = function (sceneIndex, params) {
		if (sceneIndex === "combat") honeycomb.requestedFight = params == null ? {} : params;
	};
}

module.exports = { loadEngine, ROOT, FILES };
