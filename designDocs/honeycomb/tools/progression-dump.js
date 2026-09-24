/**
 * Progression dump for Honeycomb Catacombs (AUDIT-01). Not part of the game.
 * Prints every starter, outfit, signature card and tree node, with the card text the game prints at each rank.
 * Usage:  node "!designDocs/honeycomb/tools/progression-dump.js" [all|outfits|tree]
 */
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..", "..", "..", "scripts", "misc");
const src = fs.readFileSync(path.join(__dirname, "card-inventory.js"), "utf8");
const FILES = eval(src.match(/const FILES = (\[[\s\S]*?\]);/)[1]);
function newEngine() {
	const store = {};
	const sandbox = {
		console: { log() {}, warn() {}, debug() {}, info() {}, error() {} },
		localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
		Date, Math, JSON, encodeURI, encodeURIComponent, decodeURIComponent, Object, Array, String, Number, Infinity, parseInt, parseFloat, setTimeout, clearTimeout,
		document: { getElementById: () => null, createElement: () => ({ style: { setProperty() {} }, appendChild() {}, classList: { add() {}, remove() {} } }), body: null },
	};
	sandbox.window = sandbox;
	vm.createContext(sandbox);
	for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sandbox, { filename: f });
	return sandbox.honeycomb;
}
const hc = newEngine();
hc.state = hc.newProfile();
const mode = process.argv[2] || "all";
const clean = (t) => String(t == null ? "" : t).replace(/\s+/g, " ").trim();
function text(cardIndex, owner, level) {
	const inst = { cardIndex, instanceId: "x", upgradeLevel: level || 0, upgradeOwner: owner };
	const r = hc.resolveCard(inst);
	if (!r) return "<<MISSING CARD " + cardIndex + ">>";
	let t;
	try { t = hc.cardText(r); } catch (e) { t = "<<TEXT THROWS: " + e.message + ">>"; }
	const cost = r.costArray == null ? "-" : r.costArray.energy;
	return `[${cost}] ${r.name} (${r.targetMode}${r.typeArray ? " " + r.typeArray.join("/") : ""}): ${clean(t)}`;
}
for (const ch of hc.characterArray) {
	if (!ch.progressionTree) continue;
	console.log("\n################ " + ch.index + " ################");
	const base = { characterIndex: ch.index, outfitIndex: "default", equipmentArray: [] };
	hc.state.profile.progressionArray = {};
	console.log("STARTERS:");
	for (const s of ch.startingCardArray) console.log("  " + s.count + "x " + text(s.index, base));
	if (mode == "all" || mode == "outfits") {
		console.log("OUTFITS:");
		for (const o of ch.outfitArray) {
			const keys = Object.keys(o).filter((k) => !["index", "name", "description", "hooks"].includes(k));
			console.log(`  - ${o.index} "${o.name}": ${clean(o.description)}`);
			console.log(`      fields: ${keys.map((k) => k + "=" + JSON.stringify(o[k])).join("; ")}`);
			if (o.hooks) console.log(`      hooks: ${Object.keys(o.hooks).join(", ")}`);
			for (const a of o.cardAdditionArray || []) console.log("      SIG: " + text(a.index, { characterIndex: ch.index, outfitIndex: o.index, equipmentArray: [] }));
		}
	}
	if (mode == "all" || mode == "tree") {
		console.log("TREE:");
		for (const n of ch.progressionTree.nodeArray) {
			const fields = Object.keys(n).filter((k) => !["index", "name", "description", "x", "y", "cost", "requiresArray", "exclusiveGroup", "previewCardArray", "rankMaximum"].includes(k));
			console.log(`  * ${n.index} "${n.name}" [${n.rankMaximum || 1}r, ${n.cost}${n.exclusiveGroup ? ", " + n.exclusiveGroup : ""}] ${clean(n.description)}`);
			console.log(`      fields: ${fields.join(", ") || "(NONE)"}`);
			const cards = new Set();
			for (const u of n.starterUpgradeArray || []) cards.add(u.card);
			for (const c of cards) {
				for (let rank = 1; rank <= (n.rankMaximum || 1); rank++) {
					hc.state.profile.progressionArray = { [ch.index]: Array(rank).fill(n.index) };
					console.log(`      r${rank} -> ` + text(c, base));
				}
			}
			for (const k of ["cardAdditionArray", "cardRemovalArray", "cardReplacementArray", "randomReplaceArray", "abilityAdditionArray"]) if (n[k]) console.log(`      ${k}: ${JSON.stringify(n[k])}`);
			if (n.abilityUpgradeArray) for (const au of n.abilityUpgradeArray) console.log(`      abilityUpgrade ${au.ability}: text=${JSON.stringify(au.text)} disable=${au.disableMechanic} eff=${JSON.stringify(au.effectArray)}`);
			hc.state.profile.progressionArray = {};
		}
	}
}
