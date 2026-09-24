/**
 * Card inventory for Honeycomb Catacombs.
 *
 * Not part of the game. Prints every card in `honeycomb.cardArray` -- index, name, owner, rarity,
 * archetype, cost, target mode, flags, effect chain and resolved rules text at every upgrade -- to
 * stdout, so a balance or audit pass can see the whole pool at once without reading the source.
 *
 * Usage:  node "!designDocs/honeycomb/tools/card-inventory.js" [rarityFilter,comma,separated]
 *   e.g.  node "!designDocs/honeycomb/tools/card-inventory.js" starter,common,rare
 *         node "!designDocs/honeycomb/tools/card-inventory.js"            (every card, enemy moves included)
 *
 * Exits 0. The load order mirrors test-honeycomb.js and index.html; UI/scene files are omitted.
 */
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..", "..", "scripts", "misc");
const FILES = [
	"honeycomb.js",
	"honeycomb/honeycomb-tuning.js",
	"honeycomb/honeycomb-state.js",
	"honeycomb/honeycomb-effects.js",
	"honeycomb/honeycomb-entities.js",
	"honeycomb/honeycomb-tags.js",
	"honeycomb/honeycomb-content-statuses.js",
	"honeycomb/honeycomb-content-cards.js",
	"honeycomb/honeycomb-content-characters.js",
	"honeycomb/honeycomb-content-abilities.js",
	"honeycomb/honeycomb-abilities.js",
	"honeycomb/honeycomb-content-enemies.js",
	"honeycomb/honeycomb-content-map.js",
	"honeycomb/honeycomb-content-lust-events.js",
	"honeycomb/honeycomb-progression.js",
	"honeycomb/honeycomb-combat.js",
	"honeycomb/honeycomb-text-tooltips.js",
	"honeycomb/honeycomb-tooltip.js",
	"honeycomb/honeycomb-choices.js",
	"honeycomb/honeycomb-forecast.js",
	"honeycomb/honeycomb-map.js",
	"honeycomb/honeycomb-overlays-map.js",
	"honeycomb/honeycomb-lust-events.js",
	"honeycomb/honeycomb-art.js",
];

function newEngine() {
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
	for (const file of FILES) {
		vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), sandbox, { filename: file });
	}
	return sandbox.honeycomb;
}

const hc = newEngine();
hc.state = hc.newProfile();
const filterArray = process.argv[2] == null ? [] : process.argv[2].split(",");
const clean = (text) => String(text == null ? "" : text).replace(/\s+/g, " ").trim();

console.log("=== ARCHETYPES ===");
for (const archetype of hc.archetypeArray) console.log(`${archetype.characterIndex}/${archetype.index} (${archetype.role})`);
console.log("\n=== STATUSES ===");
for (const status of hc.statusArray) {
	const fields = ["isDebuff", "cardType", "stackType", "maximumStacks", "keepsCardsWhileBroken", "redirectsAttacks", "turnsIntent", "stolenCardsExhaust", "stolenCardsPersist"]
		.map((field) => status[field] === undefined ? "" : `${field}=${status[field]}`).filter(Boolean).join(" ");
	console.log(`${status.index} | ${status.name} | ${fields}`);
}

console.log("\n=== CARDS ===");
for (const card of hc.cardArray) {
	if (filterArray.length > 0 && filterArray.indexOf(card.rarity) < 0) continue;
	const resolved = hc.resolveCard({ cardIndex: card.index, upgradeLevel: 0 });
	const cost = card.costArray == null ? "unplayable" : JSON.stringify(card.costArray);
	const flags = ["exhausts", "ethereal", "innate", "retain"].filter((flag) => card[flag] === true).join(",");
	const effectIndexArray = [];
	const walk = (list) => {
		for (const entry of list || []) {
			if (entry == null) continue;
			effectIndexArray.push(entry.index + (entry.status ? ":" + entry.status : "") + (entry.card ? ":" + entry.card : "") + (entry.enemy ? ":" + entry.enemy : "") + (entry.character ? ":" + entry.character : ""));
			walk(entry.effectArray);
			walk(entry.thenArray);
			walk(entry.elseArray);
			for (const option of entry.optionArray || []) walk(option.effectArray);
		}
	};
	walk(card.effectArray);
	console.log("---");
	console.log(`${card.index} | ${card.name} | ${card.characterIndex} | ${card.rarity}${card.archetype ? " | arc:" + card.archetype : ""} | cost:${cost} | ${card.targetMode}${flags ? " | " + flags : ""}${card.tagArray ? " | tags:" + card.tagArray.join(",") : ""}${card.brokenCard ? " | broken:" + card.brokenCard : ""}`);
	console.log(`  FX: ${effectIndexArray.join(" > ")}`);
	console.log(`  TXT: ${clean(hc.cardText(resolved))}`);
	for (let level = 1; level <= (card.upgradeArray ? card.upgradeArray.length : 0); level++) {
		const upgraded = hc.resolveCard({ cardIndex: card.index, upgradeLevel: level });
		console.log(`  +${level} TXT: ${clean(hc.cardText(upgraded))}`);
	}
}
