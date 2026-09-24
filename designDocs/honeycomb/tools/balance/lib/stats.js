/**
 * Small counting helpers for the balance reports. Not part of the game.
 */

//The 95% Wilson interval for a share, as {low, high} in 0..1. Used to say whether two win rates differ.
function wilson(wins, total) {
	if (total === 0) return { low: 0, high: 1 };
	const z = 1.96;
	const p = wins / total;
	const denominator = 1 + z * z / total;
	const centre = (p + z * z / (2 * total)) / denominator;
	const half = z * Math.sqrt(p * (1 - p) / total + z * z / (4 * total * total)) / denominator;
	return { low: Math.max(0, centre - half), high: Math.min(1, centre + half) };
}

function percent(value) { return Math.round(value * 1000) / 10 + "%"; }

//"212 of 1000 runs won (21.2%, somewhere between 18.8% and 23.9%)"
function describeShare(wins, total, noun) {
	const range = wilson(wins, total);
	return wins + " of " + total + " " + noun + " (" + percent(total === 0 ? 0 : wins / total) + ", somewhere between " + percent(range.low) + " and " + percent(range.high) + ")";
}

//True when two shares have ranges that do not overlap, which is the only time a report says they differ.
function clearlyDifferent(winsA, totalA, winsB, totalB) {
	const a = wilson(winsA, totalA), b = wilson(winsB, totalB);
	return a.low > b.high || b.low > a.high;
}

function mean(values) { return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length; }

module.exports = { wilson, percent, describeShare, clearlyDifferent, mean };
