/**
 * Packed save reader and writer for Honeycomb Catacombs. Not part of the game.
 *
 * Since 2026-09-23 Copy / Load Save and Save to .noodle file hand out the save PACKED: deflated and
 * written as base64 behind tuning.save.packedPrefix ("HC1~..."). That is about a quarter of the plain
 * length, and unreadable. This turns one back into the plain JSON report, and the other way round,
 * through the game's own honeycomb.save.pack / unpack, so the tool and the game cannot disagree.
 *
 * Usage:
 *   node "!designDocs/honeycomb/tools/save-text.js" unpack <file> [out.json]   packed or plain -> JSON
 *   node "!designDocs/honeycomb/tools/save-text.js" pack   <file> [out.noodle] JSON -> packed
 *   node "!designDocs/honeycomb/tools/save-text.js" check  <file>              round trip + sizes
 *
 * `check` prints one JSON line and exits 1 if the round trip changed anything. Suite block [140] runs it,
 * because the suite itself is synchronous and packing is not.
 */
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..", "..", "..", "scripts", "misc");
const FILES = eval(fs.readFileSync(path.join(__dirname, "card-inventory.js"), "utf8").match(/const FILES = (\[[\s\S]*?\]);/)[1]);

function newEngine() {
	const store = {};
	const sandbox = {
		console: { log() {}, warn() {}, debug() {}, info() {}, error() {} },
		localStorage: {
			getItem: (key) => (key in store ? store[key] : null),
			setItem: (key, value) => { store[key] = String(value); },
			removeItem: (key) => { delete store[key]; },
		},
		Date, Math, JSON, encodeURI, encodeURIComponent, decodeURIComponent, Object, Array, String, Number, Infinity,
		parseInt, parseFloat, setTimeout, clearTimeout, Promise, Uint8Array,
		// The browser APIs honeycomb.save.pack needs, all of which Node 18 has.
		CompressionStream, DecompressionStream, Response, TextEncoder, TextDecoder, btoa, atob,
		document: { getElementById: () => null, createElement: () => ({ style: { setProperty() {} }, appendChild() {}, classList: { add() {}, remove() {} } }), body: null },
	};
	sandbox.window = sandbox;
	vm.createContext(sandbox);
	for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sandbox, { filename: f });
	return sandbox.honeycomb;
}

async function main() {
	const [mode, inPath, outPath] = process.argv.slice(2);
	if (!["pack", "unpack", "check"].includes(mode) || inPath == null) {
		console.log("usage: save-text.js pack|unpack|check <file> [out]");
		process.exit(2);
	}
	const hc = newEngine();
	const text = fs.readFileSync(inPath, "utf8").trim();

	if (mode === "unpack") {
		const plain = await hc.save.unpack(text);
		const pretty = JSON.stringify(JSON.parse(plain), null, "\t");
		if (outPath) fs.writeFileSync(outPath, pretty); else console.log(pretty);
		return;
	}
	if (mode === "pack") {
		const packed = await hc.save.pack(await hc.save.unpack(text));
		if (outPath) fs.writeFileSync(outPath, packed); else console.log(packed);
		return;
	}

	// check: the plain text, packed and unpacked, must come back identical, and must load through the
	// same path the Load button uses (fromAnyText) into the same state that plain text loads into.
	const plain = await hc.save.unpack(text);
	const packed = await hc.save.pack(plain);
	const back = await hc.save.unpack(packed);
	const loadedPacked = await hc.save.fromAnyText(packed);
	const statePacked = JSON.stringify(hc.state);
	const loadedPlain = await hc.save.fromAnyText(plain);
	const statePlain = JSON.stringify(hc.state);
	// A damaged paste: the packed text cut short must be refused, not half-loaded.
	hc.state = null;
	const loadedDamaged = await hc.save.fromAnyText(packed.slice(0, Math.floor(packed.length / 2)));
	const result = {
		plainLength: plain.length,
		packedLength: packed.length,
		prefixOk: hc.save.isPacked(packed),
		roundTripIdentical: back === plain,
		loadedPacked, loadedPlain,
		sameStateEitherWay: statePacked === statePlain,
		damagedRefused: loadedDamaged === false && hc.state === null,
		fileName: hc.save.fileName(new Date(2026, 8, 3, 7, 5)),
	};
	console.log(JSON.stringify(result));
	const ok = result.prefixOk && result.roundTripIdentical && loadedPacked && loadedPlain && result.sameStateEitherWay && result.damagedRefused;
	process.exit(ok ? 0 : 1);
}

main().catch((error) => { console.error(error); process.exit(1); });
