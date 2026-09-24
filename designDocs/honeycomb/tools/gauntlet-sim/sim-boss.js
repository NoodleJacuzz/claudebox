//How hard the gauntlet hits, MEASURED: the enemy side's raw output per turn against a party that never
//falls (healed and soothed every turn, no Temporary HP, so every point thrown is counted). Eight turns,
//twenty seeds, with and without the fight's opening buffs.
const newEngine = require("./engine.js");
function run(encounterIndex, buffed, seed) {
	const hc = newEngine();
	if (!buffed) for (const e of hc.encounterArray) { delete e.enemyStartingStatusArray; delete e.enemyStartingTemporaryHealth; }
	hc.state = hc.newProfile();
	hc.newRun([{ characterIndex: "brienne", outfitIndex: "default" }, { characterIndex: "severine", outfitIndex: "default" }, { characterIndex: "clemence", outfitIndex: "default" }], seed);
	hc.combat.begin(encounterIndex, {});
	const perTurn = [];
	for (let turn = 0; turn < 8; turn++) {
		const party = hc.state.run.partyArray.filter((m) => m.characterIndex);
		party.forEach((m) => { m.maxHealth = 9999; m.health = 9999; m.lust = 0; m.temporaryHealth = 0; });
		hc.combat.endPlayerTurn(); hc.combat.runEnemyTurn();
		const after = hc.state.run.partyArray.filter((m) => m.characterIndex);
		let taken = 0; after.forEach((m) => { taken += (9999 - m.health) + (m.lust || 0); });
		perTurn.push(taken);
		if (hc.state.run.combat == null || ["victory", "defeat"].indexOf(hc.state.run.combat.phase) >= 0) break;
		hc.combat.startPlayerTurn();
	}
	return perTurn;
}
for (const encounter of ["gauntletWhiteOpening", "gauntletBlackReply", "gauntletDrawnToEvil", "gauntletGrandmaster"]) {
	for (const buffed of [false, true]) {
		const sums = new Array(8).fill(0); let n = 0;
		for (let seed = 1; seed <= 20; seed++) { const r = run(encounter, buffed, seed); r.forEach((v, i) => { sums[i] += v; }); n++; }
		const avg = sums.map((s) => Math.round(s / n));
		console.log(encounter.padEnd(22), buffed ? "BUFFED  " : "unbuffed", "per turn:", avg.join(" "), "| mean", Math.round(avg.reduce((a, b) => a + b, 0) / avg.length));
	}
}
