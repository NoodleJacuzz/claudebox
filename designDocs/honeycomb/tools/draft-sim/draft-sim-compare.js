/**
 * Compares the named outputs of draft-simulation.js.
 *
 * Usage:  node "!designDocs/honeycomb/tools/draft-sim/draft-sim-compare.js" base flat steep elite30 picky
 *
 * Reads DRAFT-SIM-DATA-<tag>.json beside this file and reports, per config and per rarity, the cards
 * whose pick rates are stable across models -- which is the signal the cut report is allowed to use.
 * A card that only sinks under one set of knobs is an artifact of that knob, not a verdict.
 */
const fs = require("fs");
const path = require("path");

const tags = process.argv.slice(2);
if (tags.length < 2) { console.error("Give at least two tags."); process.exit(1); }
const configs = tags.map((tag) => {
	const file = path.join(__dirname, "DRAFT-SIM-DATA-" + tag + ".json");
	return { tag: tag, data: JSON.parse(fs.readFileSync(file, "utf8")) };
});
const cards = configs[0].data.strength;
const count = cards.length;
const rateOf = (data, index) => data.offered[index] <= 0 ? null : data.picked[index] / data.offered[index];
const removeRateOf = (data, index) => {
	const copies = data.picked[index] + data.offered[index] * 0;
	return data.removed[index] / Math.max(1, data.picked[index] + 1);
};

function spearman(a, b) {
	const rank = (array) => {
		const order = array.map((value, index) => [value, index]).sort((x, y) => x[0] - y[0]);
		const result = new Array(array.length);
		order.forEach((entry, position) => { result[entry[1]] = position; });
		return result;
	};
	const ra = rank(a), rb = rank(b);
	const n = a.length;
	let d2 = 0;
	for (let index = 0; index < n; index++) d2 += Math.pow(ra[index] - rb[index], 2);
	return 1 - (6 * d2) / (n * (n * n - 1));
}

const rows = [];
for (let index = 0; index < count; index++) {
	const rateArray = configs.map((config) => rateOf(config.data, index)).filter((value) => value != null);
	if (rateArray.length === 0) continue;
	const mean = rateArray.reduce((sum, value) => sum + value, 0) / rateArray.length;
	const spread = Math.max.apply(null, rateArray) - Math.min.apply(null, rateArray);
	rows.push({
		index: index, card: cards[index], rates: configs.map((config) => rateOf(config.data, index)),
		mean: mean, spread: spread,
		removedMean: configs.reduce((sum, config) => sum + config.data.removed[index], 0) / configs.length,
	});
}

console.log("## Spearman correlation of pick-rate rankings between configs");
for (let a = 0; a < configs.length; a++) {
	const line = [];
	for (let b = 0; b < configs.length; b++) {
		const x = rows.map((row) => row.rates[a] == null ? row.mean : row.rates[a]);
		const y = rows.map((row) => row.rates[b] == null ? row.mean : row.rates[b]);
		line.push(spearman(x, y).toFixed(2));
	}
	console.log(configs[a].tag + ": " + line.join(", "));
}

for (const rarity of ["starter", "common", "rare"]) {
	const subset = rows.filter((row) => row.card.rarity === rarity);
	console.log("");
	console.log("## " + rarity + " -- lowest mean pick rate across " + configs.length + " configs");
	for (const row of subset.slice().sort((a, b) => a.mean - b.mean).slice(0, 12)) {
		console.log(row.card.index + " (" + row.card.name + ") mean " + (row.mean * 100).toFixed(1) + "% spread " + (row.spread * 100).toFixed(1) + " rates " + row.rates.map((value) => value == null ? "n/a" : (value * 100).toFixed(0) + "%").join("/"));
	}
	console.log("");
	console.log("## " + rarity + " -- highest mean pick rate");
	for (const row of subset.slice().sort((a, b) => b.mean - a.mean).slice(0, 8)) {
		console.log(row.card.index + " (" + row.card.name + ") mean " + (row.mean * 100).toFixed(1) + "% spread " + (row.spread * 100).toFixed(1) + "% rates " + row.rates.map((value) => value == null ? "n/a" : (value * 100).toFixed(0) + "%").join("/"));
	}
	console.log("");
	console.log("## " + rarity + " -- highest mean removals");
	for (const row of subset.slice().sort((a, b) => b.removedMean - a.removedMean).slice(0, 8)) {
		console.log(row.card.index + " (" + row.card.name + ") removed mean " + row.removedMean.toFixed(0));
	}
}

// Strength + synergy potential, independent of the draft, for cross-reference.
const base = configs[0].data;
console.log("");
console.log("## Strength and net synergy (base config)");
const synergySum = new Array(count).fill(0);
for (let i = 0; i < count; i++) for (let j = 0; j < count; j++) synergySum[i] += base.synergyMatrix[i][j];
for (const row of rows.slice().sort((a, b) => synergySum[a.index] - synergySum[b.index]).slice(0, 15)) {
	console.log(row.card.index + " (" + row.card.name + ", " + row.card.rarity + ") strength " + row.card.strength.toFixed(2) + " synergySum " + synergySum[row.index].toFixed(1) + " pick " + (row.mean * 100).toFixed(1) + "%");
}
