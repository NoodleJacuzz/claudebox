/**
 * Progression tree auditor for Honeycomb Catacombs.
 *
 * Not part of the game. Runs the rules in `!designDocs/honeycomb/relics/TREE-DESIGN.md` over the six
 * shipped trees: hard rules fail the process (exit 1), soft rules are printed for a human to judge.
 * The layout is authored in `!designDocs/skeletons/wip.json`; this file measures what actually shipped
 * in `honeycomb-content-characters.js`.
 *
 * Usage:  node "!designDocs/honeycomb/tools/audit-trees.js" [--verbose]
 *
 * The load order mirrors test-honeycomb.js and index.html; UI/scene files are omitted.
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
const layout = hc.tuning.progression.treeView;
const verbose = process.argv.indexOf("--verbose") >= 0;
const hardArray = [];

//---------------------------------------------------------------------------------------------------
//Hard rules (TREE-DESIGN.md section 4.1)
//---------------------------------------------------------------------------------------------------
function fail(rule, where, message) {
	hardArray.push({ rule, where, message });
}

//Every prerequisite, card and ability a node names must resolve. Shared by base and outfit nodes.
function checkReferences(characterIndex, node) {
	for (const addition of node.cardAdditionArray || []) {
		if (!hc.findDefinition(hc.cardArray, addition.index)) fail("H8", characterIndex + "/" + node.index, "unknown card " + addition.index);
	}
	for (const addition of node.abilityAdditionArray || []) {
		if (!hc.findDefinition(hc.abilityArray, addition.index)) fail("H8", characterIndex + "/" + node.index, "unknown ability " + addition.index);
	}
	for (const replacement of node.cardReplacementArray || []) {
		for (const key of ["from", "to"]) {
			if (replacement[key] != null && !hc.findDefinition(hc.cardArray, replacement[key])) {
				fail("H8", characterIndex + "/" + node.index, "unknown " + key + " card " + replacement[key]);
			}
		}
	}
	for (const upgrade of node.starterUpgradeArray || []) {
		if (!hc.findDefinition(hc.cardArray, upgrade.card)) fail("H8", characterIndex + "/" + node.index, "unknown starter card " + upgrade.card);
	}
	for (const replacement of node.randomReplaceArray || []) {
		if (!hc.findDefinition(hc.cardArray, replacement.from)) fail("H8", characterIndex + "/" + node.index, "unknown replace source " + replacement.from);
	}
	if (node.unlockEquipment != null && !hc.findDefinition(hc.equipmentArray, node.unlockEquipment)) {
		fail("H8", characterIndex + "/" + node.index, "unknown equipment " + node.unlockEquipment);
	}
}

function checkTree(character) {
	const characterIndex = character.index;
	const baseArray = character.progressionTree.nodeArray;
	const outfitNodeArray = [];
	for (const outfit of character.outfitArray) {
		for (const node of outfit.treeNodeArray || []) outfitNodeArray.push({ node, outfitIndex: outfit.index });
	}
	const allArray = baseArray.concat(outfitNodeArray.map((entry) => entry.node));

	// H1 -- unique indices across the base tree and every outfit tree.
	const seen = new Set();
	for (const node of allArray) {
		if (seen.has(node.index)) fail("H1", characterIndex + "/" + node.index, "duplicate node id");
		seen.add(node.index);
	}
	const idSet = seen;

	// H2 -- exactly one root in the base tree. An outfit-added root is an extra, reported as soft.
	// A node marked `free: true` may stand beside it with no prerequisite.
	const freeRootArray = baseArray.filter((node) => (node.requiresArray || []).length === 0 && node.free === true);
	const baseRootArray = baseArray.filter((node) => (node.requiresArray || []).length === 0 && node.free !== true);
	if (baseRootArray.length !== 1) fail("H2", characterIndex, baseRootArray.length + " base roots (want exactly 1)");
	const extraRootArray = outfitNodeArray.filter((entry) => (entry.node.requiresArray || []).length === 0);

	// H3/H4/H7/H8/H9 -- per node.
	for (const node of allArray) {
		for (const requirement of node.requiresArray || []) {
			if (!idSet.has(typeof requirement === "string" ? requirement : requirement.index)) {
				fail("H3", characterIndex + "/" + node.index, "unknown prerequisite " + JSON.stringify(requirement));
			}
		}
		if (node.x < 0 || node.y < 0 || node.y > 100) fail("H4", characterIndex + "/" + node.index, "off the background x=" + node.x + " y=" + node.y);
		if (node.name == null || node.name === "" || node.description == null || node.description === "") {
			fail("H7", characterIndex + "/" + node.index, "missing name or description");
		}
		//A node marked `free: true` costs nothing on purpose; any other zero is a mistake.
		if (hc.progression.nodeCost(node, 1) <= 0 && node.free !== true) fail("H9", characterIndex + "/" + node.index, "no cost");
		if (node.free === true && hc.progression.nodeCost(node, 1) !== 0) fail("H9", characterIndex + "/" + node.index, "marked free but costs " + hc.progression.nodeCost(node, 1));
		checkReferences(characterIndex, node);
	}

	// H5 -- every non-root reachable from the base root.
	const childMap = {};
	for (const node of allArray) {
		for (const requirement of node.requiresArray || []) {
			const key = typeof requirement === "string" ? requirement : requirement.index;
			(childMap[key] = childMap[key] || []).push(node.index);
		}
	}
	if (baseRootArray.length > 0) {
		const visited = new Set();
		const queue = [baseRootArray[0].index].concat(freeRootArray.map((node) => node.index));
		while (queue.length > 0) {
			const current = queue.shift();
			if (visited.has(current)) continue;
			visited.add(current);
			for (const child of childMap[current] || []) queue.push(child);
		}
		for (const node of allArray) {
			if (!visited.has(node.index)) fail("H5", characterIndex + "/" + node.index, "unreachable from the root");
		}
	}

	// H6 -- no self-requirement and no cycle.
	for (const node of allArray) {
		for (const requirement of node.requiresArray || []) {
			const key = typeof requirement === "string" ? requirement : requirement.index;
			if (key === node.index) fail("H6", characterIndex + "/" + node.index, "requires itself");
		}
	}
	const state = {};
	const visit = (index) => {
		if (state[index] === "visiting") { fail("H6", characterIndex + "/" + index, "dependency cycle"); return; }
		if (state[index] === "done") return;
		state[index] = "visiting";
		const node = allArray.find((entry) => entry.index === index);
		for (const requirement of (node == null ? [] : node.requiresArray) || []) {
			visit(typeof requirement === "string" ? requirement : requirement.index);
		}
		state[index] = "done";
	};
	for (const node of allArray) visit(node.index);

	// H10 -- no two nodes share an exact (x, y).
	const cornerMap = {};
	for (const node of allArray) {
		const key = node.x + "," + node.y;
		if (cornerMap[key] != null) fail("H10", characterIndex + "/" + node.index, "same (x, y) as " + cornerMap[key]);
		cornerMap[key] = node.index;
	}

	// H11 -- same-row nodes keep at least `minimumLaneGap` between them.
	const rowMap = {};
	for (const node of allArray) (rowMap[node.x] = rowMap[node.x] || []).push(node);
	for (const rowKey of Object.keys(rowMap)) {
		const row = rowMap[rowKey].slice().sort((left, right) => left.y - right.y);
		for (let index = 1; index < row.length; index++) {
			if (row[index].y - row[index - 1].y < layout.minimumLaneGap) {
				fail("H11", characterIndex + "/" + row[index].index, "only " + (row[index].y - row[index - 1].y) + " from " + row[index - 1].index + " on row x=" + rowKey);
			}
		}
	}

	return { characterIndex, baseArray, allArray, extraRootArray, childMap };
}

//---------------------------------------------------------------------------------------------------
//Soft reports (TREE-DESIGN.md section 4.2)
//---------------------------------------------------------------------------------------------------
function measure(character, tree) {
	const allArray = tree.allArray;
	//`x` is authored in arbitrary units that step 5-10 at a time, so a rule that counts ROWS must count
	//distinct x levels rather than units. Every metric below works in row indices.
	const rowArray = Array.from(new Set(allArray.map((node) => node.x))).sort((left, right) => left - right);
	const rowOf = (node) => rowArray.indexOf(node.x);
	const laneScore = (() => {
		let total = 0, count = 0;
		for (const node of allArray) {
			let best = Infinity;
			for (const other of allArray) {
				if (other === node || other.x !== node.x) continue;
				best = Math.min(best, Math.abs(other.y - (100 - node.y)));
			}
			if (best !== Infinity) { total += best; count += 1; }
		}
		return count === 0 ? 0 : total / count;
	})();

	// Edge crossings: a pair of prerequisite edges drawn as straight segments that intersect.
	const edgeArray = [];
	for (const node of allArray) {
		for (const requirement of node.requiresArray || []) {
			const key = typeof requirement === "string" ? requirement : requirement.index;
			const parent = allArray.find((entry) => entry.index === key);
			if (parent != null) edgeArray.push({ from: parent, to: node });
		}
	}
	const cross = (a, b, c, d) => {
		const side = (p, q, r) => Math.sign((rowOf(q) - rowOf(p)) * (r.y - p.y) - (q.y - p.y) * (rowOf(r) - rowOf(p)));
		return side(a, b, c) !== side(a, b, d) && side(c, d, a) !== side(c, d, b);
	};
	let crossingCount = 0;
	for (let index = 0; index < edgeArray.length; index++) {
		for (let other = index + 1; other < edgeArray.length; other++) {
			const left = edgeArray[index], right = edgeArray[other];
			if (left.from === right.from || left.to === right.to) continue;
			if (left.to === right.from || right.to === left.from) continue;
			if (cross(left.from, left.to, right.from, right.to)) crossingCount += 1;
		}
	}

	// Fork timing: an exclusive group should land within two rows of its join.
	const forkArray = [];
	const groupMap = {};
	for (const node of allArray) {
		if (node.exclusiveGroup == null) continue;
		(groupMap[node.exclusiveGroup] = groupMap[node.exclusiveGroup] || []).push(node);
	}
	for (const group of Object.keys(groupMap)) {
		const nodeArray = groupMap[group];
		const joinXArray = [];
		for (const node of nodeArray) {
			for (const requirement of node.requiresArray || []) {
				const key = typeof requirement === "string" ? requirement : requirement.index;
				const parent = allArray.find((entry) => entry.index === key);
				if (parent != null && nodeArray.indexOf(parent) < 0) joinXArray.push(parent.x);
			}
		}
		if (joinXArray.length === 0) continue;
		const nearestJoin = Math.max(...joinXArray.map((x) => rowArray.indexOf(x)));
		for (const node of nodeArray) {
			if (rowOf(node) - nearestJoin > 2) forkArray.push(node.index + "(" + (rowOf(node) - nearestJoin) + " rows)");
		}
	}

	// Row width and edge length.
	let widestRow = 0;
	const rowCount = {};
	for (const node of allArray) rowCount[node.x] = (rowCount[node.x] || 0) + 1;
	for (const key of Object.keys(rowCount)) widestRow = Math.max(widestRow, rowCount[key]);
	const longEdgeArray = edgeArray.filter((edge) => Math.abs(rowOf(edge.to) - rowOf(edge.from)) > 3).map((edge) => edge.from.index + ">" + edge.to.index);

	// Cost curve: a child should not cost less per rank than the prerequisite that opens it.
	let costInversionArray = [];
	for (const edge of edgeArray) {
		if (hc.progression.nodeCost(edge.to, 1) < hc.progression.nodeCost(edge.from, 1)) costInversionArray.push(edge.from.index + ">" + edge.to.index);
	}

	return {
		laneScore, crossingCount, forkArray, widestRow, longEdgeArray, costInversionArray,
		leafArray: allArray.filter((node) => (tree.childMap[node.index] || []).length === 0).map((node) => node.index),
	};
}

//---------------------------------------------------------------------------------------------------
//Run
//---------------------------------------------------------------------------------------------------
console.log("Honeycomb progression tree audit -- TREE-DESIGN.md");
console.log("lane gap " + layout.minimumLaneGap + " | max row " + layout.maximumRowNodes + " | nodes " +
	hc.characterArray.reduce((sum, character) => sum + (character.progressionTree == null ? 0 : character.progressionTree.nodeArray.length), 0));

const reportArray = [];
for (const character of hc.characterArray) {
	// A character flagged `inDevelopment` is gated off the roster and has no tree yet by design. The
	// boot warning report (rule `characterInDevelopment`) is what keeps that visible; see FEEDBACK-08 §A.
	if (character.inDevelopment === true) { console.log("  " + character.index + ": in development, skipped"); continue; }
	if (character.progressionTree == null) { fail("H1", character.index, "no progression tree"); continue; }
	const tree = checkTree(character);
	reportArray.push({ character, tree, metric: measure(character, tree) });
}

for (const entry of reportArray) {
	const metric = entry.metric;
	console.log("\n" + entry.character.index + " (" + entry.tree.allArray.length + " nodes)");
	console.log("  soft: symmetry " + metric.laneScore.toFixed(1) +
		" | crossings " + metric.crossingCount +
		" | widest row " + metric.widestRow +
		" | long edges " + metric.longEdgeArray.length +
		" | cost inversions " + metric.costInversionArray.length);
	if (metric.forkArray.length > 0) console.log("  soft: forks >2 rows from join: " + metric.forkArray.join(", "));
	if (metric.longEdgeArray.length > 0 && verbose) console.log("  soft: long edges: " + metric.longEdgeArray.join(", "));
	if (metric.costInversionArray.length > 0 && verbose) console.log("  soft: cost inversions: " + metric.costInversionArray.join(", "));
	if (verbose) console.log("  soft: leaves: " + metric.leafArray.join(", "));
	if (entry.tree.extraRootArray.length > 0) console.log("  soft: outfit roots: " + entry.tree.extraRootArray.map((node) => node.index).join(", "));
}

console.log("\n" + "-".repeat(60));
if (hardArray.length === 0) {
	console.log("OK -- every hard rule passes.");
	process.exit(0);
}
for (const finding of hardArray) console.log("FAIL " + finding.rule + " " + finding.where + ": " + finding.message);
console.log(hardArray.length + " hard finding(s).");
process.exit(1);
