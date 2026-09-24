// Honeycomb Catacombs -- turn-time audit  (round 07, C)
//
// Answers "is the game slow, or is the device?" with numbers. It starts a fresh three-member fight, turns
// the perf monitor on, measures the three hot paths directly (a full repaint, the held-card forecast, and
// the per-move hit test), then plays a whole turn and compares each replay's EXPECTED duration (what its
// beats asked for) against its ACTUAL duration. The gap is main-thread time the browser did not spend
// keeping up -- which is what "choppy" is.
//
// Run it through the agent browser:
//   node "!designDocs/honeycomb/tools/agent-browser.js" --out shot.png --wait 6000 --after 1000 \
//     --eval-file "!designDocs/honeycomb/tools/audit-turn-time.js" --console
// On a phone, the debug panel's "Toggle performance monitor" + "Report performance" do the same live.
//
// Reading it:
//   frameStats.average  ~16.7ms is a smooth 60fps; ~8.3ms is 120fps. p95/worst show the hitches.
//   cadenceMs           the fastest tenth of frames: what the display allows. ~33.3ms means the page is
//                       capped at 30Hz (a battery saver), and then half of droppedFrames are on time.
//   missedFrames        frames over 1.5 cadences -- late against THIS display. Trust it over droppedFrames.
//   droppedFrames       frames longer than 33ms -- visible stutter at 60Hz.
//   longTaskStats       main-thread blocks over 50ms. Any of these is a real hitch.
//   replayArray[].overrunMs  actual minus expected. Near zero means the replay kept its own clock.
//   repaint/refreshAim/fighterAtPoint  the per-event cost. A pointermove that spends >8ms is a dropped
//                                      frame at 120Hz, >16ms at 60Hz, on THIS device.
(async () => {
	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	const sample = (label, fn, count) => {
		const values = [];
		for (let index = 0; index < count; index++) {
			const start = performance.now();
			fn();
			values.push(performance.now() - start);
		}
		return { label: label, stats: honeycomb.perf.stats(values) };
	};

	honeycomb.state = honeycomb.newProfile();
	honeycomb.newRun([
		{ characterIndex: "brienne", outfitIndex: "default" },
		{ characterIndex: "severine", outfitIndex: "default" },
		{ characterIndex: "nettle", outfitIndex: "default" },
	], 42);
	honeycomb.combat.begin("hollowPatrol", {});
	honeycomb.scene.go("combat");
	await sleep(2200);

	honeycomb.perf.start();
	const combat = honeycomb.state.run.combat;

	// Hot path 1: the whole screen rebuilt from innerHTML, which every closing beat does.
	const repaint = sample("repaint", () => honeycomb.combatScene.repaint(), 20);

	// Hot path 2: the held-card forecast (a real dry run of the action, rolled back) and the per-move
	// hit test every pointermove runs.
	const handArray = combat.handArray.map((id) => ({ id: id, card: honeycomb.combat.resolveById(id) }));
	const attack = handArray.find((held) => held.card != null &&
		honeycomb.targetModeRequiresPick(held.card.targetMode) &&
		honeycomb.targetModeKind(held.card.targetMode) === "entity");
	let refreshAim = { label: "refreshAim", stats: honeycomb.perf.stats([]) };
	let fighterAtPoint = { label: "fighterAtPoint", stats: honeycomb.perf.stats([]) };
	if (attack != null && combat.enemyArray.length > 0) {
		const targetId = combat.enemyArray[0].instanceId;
		refreshAim = sample("refreshAim", () => honeycomb.combatScene.refreshAim(attack.id, targetId), 20);
		const box = honeycomb.combatScene.fighterElement(targetId).getBoundingClientRect();
		const x = box.left + box.width / 2;
		const y = box.top + box.height / 2;
		fighterAtPoint = sample("fighterAtPoint", () => honeycomb.combatScene.fighterAtPoint(x, y), 40);
	}

	// Hot path 3: a REAL drag, end to end. Synthetic pointer events drive the actual handlers, so the
	// per-move cost is the true one -- the forecast, the hit test, the focus, the arrow. This is the path
	// the phone stutters on.
	honeycomb.perf.dragArray = [];
	let drag = { moves: 0, stats: honeycomb.perf.stats([]) };
	const cardElement = document.querySelector("#honeycombHand .hcHandCard");
	if (cardElement != null) {
		const cardBox = cardElement.getBoundingClientRect();
		const startX = cardBox.left + cardBox.width / 2;
		const startY = cardBox.top + cardBox.height / 2;
		const fire = (type, x, y) => cardElement.dispatchEvent(new PointerEvent(type, {
			bubbles: true, cancelable: true, pointerId: 7, pointerType: "touch", isPrimary: true,
			clientX: x, clientY: y,
		}));
		fire("pointerdown", startX, startY);
		const moveCount = 60;
		for (let step = 0; step < moveCount; step++) {
			const t = step / (moveCount - 1);
			fire("pointermove", startX + (window.innerWidth * 0.55 - startX) * t, startY - 140 * t);
		}
		// Back over the hand, so the release cancels rather than playing the card.
		fire("pointermove", startX, startY);
		fire("pointerup", startX, startY);
		drag = { moves: honeycomb.perf.dragArray.length, stats: honeycomb.perf.stats(honeycomb.perf.dragArray) };
	}
	await sleep(200);

	// Hot path 4: a whole turn, measured replay by replay.
	honeycomb.combatScene.onEndTurn();
	let waited = 0;
	while (honeycomb.combatScene.busy == true && waited < 20000) {
		await sleep(50);
		waited += 50;
	}
	await sleep(300);

	const report = honeycomb.perf.report();
	honeycomb.perf.stop();
	return JSON.stringify({
		device: {
			viewport: window.innerWidth + "x" + window.innerHeight,
			devicePixelRatio: window.devicePixelRatio,
			hardwareConcurrency: navigator.hardwareConcurrency,
			userAgent: navigator.userAgent,
		},
		frameStats: report.frameStats,
		cadenceMs: report.cadenceMs,
		missedFrames: report.missedFrames,
		droppedFrames: report.droppedFrames,
		longTaskStats: report.longTaskStats,
		longTaskArray: report.longTaskArray.slice(0, 12),
		replayArray: report.replayArray,
		repaint: repaint,
		refreshAim: refreshAim,
		fighterAtPoint: fighterAtPoint,
		drag: drag,
	});
})()
