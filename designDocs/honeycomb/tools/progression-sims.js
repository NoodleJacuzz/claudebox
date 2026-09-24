/**
 * Behavioural sims for Honeycomb Catacombs (AUDIT-01). Not part of the game.
 * Plays a card or ability in a headless fight and measures HP, statuses and meters.
 * Usage:  node "!designDocs/honeycomb/tools/progression-sims.js" [testName]
 */
const src = require("fs").readFileSync(require("path").join(__dirname, "progression-dump.js"), "utf8").split("const hc = newEngine();")[0];
eval(src);
const clean = (t) => String(t == null ? "" : t).replace(/\s+/g, " ").trim();

//A fresh engine, a one- or two-member party, selected nodes written straight into the profile.
function setup(party, nodes, encounter) {
	const hc = newEngine();
	hc.state = hc.newProfile();
	hc.state.profile.progressionArray = nodes || {};
	const run = hc.newRun(party, 4242);
	const combat = hc.combat.begin(encounter || "deepSwarm", {});
	return { hc, run, combat, ctx: () => hc.newEffectContext({ combat: hc.state.run.combat }) };
}
function member(s, ch) { return s.hc.state.run.partyArray.find((m) => m.characterIndex === ch); }
function give(s, cardIndex, ownerCh) {
	const inst = s.hc.addCardToPile ? null : null;
	const gained = s.hc.addCardToRunDeck(cardIndex, null);
	s.hc.state.run.combat.handArray.push(gained.instanceId);
	return gained;
}
function play(s, inst, targetId, answer) {
	let r = s.hc.combat.playCard(inst.instanceId, targetId);
	let g = 0;
	while (r.reason === "needsChoice" && g++ < 6) {
		const opts = r.choice.optionArray;
		const pick = answer != null ? answer(r.choice) : (opts && opts.length ? [opts[0].index] : []);
		r = s.hc.combat.playCard(inst.instanceId, targetId, r.answerArray.concat([{ chosenArray: pick }]));
	}
	return r;
}
function stacks(e, st) { const x = (e.statusArray || []).find((q) => q.index === st); return x ? x.stacks : 0; }
function out(label, v) { console.log(label.padEnd(60) + " " + v); }

const tests = {
	meterWithWheel() {
		for (const nodes of [["briAbility1"], ["briAbility1", "briWheel1"]]) {
			const s = setup([{ characterIndex: "brienne", outfitIndex: "default" }], { brienne: nodes });
			const b = member(s, "brienne");
			const brace = give(s, "brienneGrit");
			play(s, brace, null);
			const brace2 = give(s, "brienneGrit");
			play(s, brace2, null);
			out(`Brienne ${nodes.join("+")}: 2x Brace -> Resolve`, s.hc.mechanicValue(b, "resolve") + " (active " + s.hc.mechanicActive(b) + ")");
		}
		for (const nodes of [["cinAbility1"], ["cinAbility1", "cinWheel1"]]) {
			const s = setup([{ characterIndex: "cinder", outfitIndex: "default" }, { characterIndex: "brienne", outfitIndex: "default" }], { cinder: nodes });
			const c = member(s, "cinder"), b = member(s, "brienne");
			const sw = give(s, "cinderSwitch");
			play(s, sw, b.instanceId);
			const t = give(s, "cinderImpale");
			play(s, t, s.combat.enemyArray[0].instanceId);
			out(`Cinder ${nodes.join("+")}: swap + thrust -> Stride`, s.hc.mechanicValue(c, "stride"));
			if (nodes.length > 1) out("   Momentum usable?", JSON.stringify(s.hc.abilities.usability(c, "cinderBackflip", s.hc.state.run.combat)));
		}
	},
	swingTarget() {
		const s = setup([{ characterIndex: "brienne", outfitIndex: "default" }], { brienne: ["briAbility1", "briWheel2"] });
		const b = member(s, "brienne");
		b.temporaryHealth = 10;
		const hpB = b.health, eh = s.combat.enemyArray.map((e) => e.health).join(",");
		const r = s.hc.abilities.use(b.instanceId, "brienneBrace", null);
		out("Swing: played/reason", r.played + "/" + r.reason);
		out("Swing: Brienne hp before/after, tHP after", hpB + " -> " + b.health + ", tHP " + b.temporaryHealth);
		out("Swing: enemy hp before/after", eh + " -> " + s.hc.state.run.combat.enemyArray.map((e) => e.health).join(","));
	},
	lanceTarget() {
		const s = setup([{ characterIndex: "cinder", outfitIndex: "default" }], { cinder: ["cinAbility1", "cinWheel3"] });
		const c = member(s, "cinder");
		s.hc.addMechanic(c, "stride", 3, s.ctx());
		const hp = c.health, eh = s.combat.enemyArray.map((e) => e.health).join(",");
		const r = s.hc.abilities.use(c.instanceId, "cinderBackflip", null);
		out("Lance: played/reason (stride forced to 3)", r.played + "/" + r.reason + " stride now " + s.hc.mechanicValue(c, "stride"));
		out("Lance: Cinder hp before/after", hp + " -> " + c.health);
		out("Lance: enemy hp before/after", eh + " -> " + s.hc.state.run.combat.enemyArray.map((e) => e.health).join(","));
	},
	drink() {
		for (const nodes of [[], ["severineAtt2"]]) {
			const s = setup([{ characterIndex: "severine", outfitIndex: "default" }], { severine: nodes }, "loneSporeling");
			const sv = member(s, "severine");
			sv.health = 10; sv.temporaryHealth = 0;
			const e = s.combat.enemyArray[0];
			const eh = e.health;
			play(s, give(s, "severineRend"), e.instanceId);
			out(`Claw Flurry ${nodes.join("") || "(base)"}: enemy lost / Severine healed`, (eh - e.health) + " / " + (sv.health - 10));
		}
	},
	bloodTax() {
		const s = setup([{ characterIndex: "severine", outfitIndex: "default" }], { severine: ["severineDef1"] }, "loneSporeling");
		const sv = member(s, "severine");
		const e = s.combat.enemyArray[0];
		out("Blood Tax: enemy Strength before", stacks(e, "strength"));
		const r = play(s, give(s, "severineQuaff"), e.instanceId, (ch) => [ch.optionArray[1].index]);
		out("Blood Tax 'steal up to 2' from 0-Strength enemy -> Severine Strength", stacks(sv, "strength") + " (played " + r.played + ")");
	},
	zeroDamage() {
		const s = setup([{ characterIndex: "nettle", outfitIndex: "default" }], { nettle: ["netAtt1", "netAtt1"] }, "loneSporeling");
		const n = member(s, "nettle");
		const e = s.combat.enemyArray[0];
		s.hc.applyStatus ? null : null;
		n.statusArray.push({ index: "strength", stacks: 3 });
		const eh = e.health;
		play(s, give(s, "nettleVenomTouch"), e.instanceId);
		out("Wither rank 2 ('pure negative', 0 dmg) with 3 Strength -> enemy hp lost", eh - e.health + " (poison " + stacks(e, "poison") + ")");
	},
	strengthThisTurn() {
		const s = setup([{ characterIndex: "brienne", outfitIndex: "default" }], { brienne: ["briDef3"] }, "loneSporeling");
		const b = member(s, "brienne");
		play(s, give(s, "brienneGrit"), null, (ch) => [ch.optionArray[1].index]);
		out("Brace D3 'Strength this turn': Strength now", stacks(b, "strength") + " statuses " + JSON.stringify(b.statusArray.map((q) => q.index + ":" + q.stacks)));
		s.hc.combat.endPlayerTurn(); s.hc.combat.runEnemyTurn(); s.hc.combat.startPlayerTurn(s.ctx());
		const b2 = member(s, "brienne");
		out("   ...next turn Strength", stacks(b2, "strength"));
	},
	step() {
		const s = setup([{ characterIndex: "cinder", outfitIndex: "default" }, { characterIndex: "brienne", outfitIndex: "default" }], { cinder: ["cinAtt3"] }, "loneSporeling");
		const run = s.hc.state.run;
		const c = member(s, "cinder");
		out("Step: party order (front first)", s.hc.livingEntityArray("ally", run.combat).map((m) => m.characterIndex).join(","));
		// Put Cinder at the back so "already in front" should be false.
		const b = member(s, "brienne");
		const sw = give(s, "cinderSwitch");
		play(s, sw, b.instanceId);
		out("Step: order after swap", s.hc.livingEntityArray("ally", s.hc.state.run.combat).map((m) => m.characterIndex).join(","));
		const e = s.hc.state.run.combat.enemyArray[0];
		const eh = e.health;
		play(s, give(s, "cinderImpale"), e.instanceId);
		out("Step from the BACK -> damage (design: 6)", eh - e.health);
	},
	finish() {
		const s = setup([{ characterIndex: "severine", outfitIndex: "huntress" }], {}, "loneSporeling");
		const e = s.combat.enemyArray[0];
		const eh = e.health;
		play(s, give(s, "severineFinish"), e.instanceId);
		out("Finish at full HP both sides (design 10; outfit passive may add)", eh - e.health);
	},
	cut() {
		const s = setup([{ characterIndex: "severine", outfitIndex: "crimsonCovenant" }], {}, "loneSporeling");
		const sv = member(s, "severine");
		const hp = sv.health, e = s.combat.enemyArray[0], eh = e.health;
		sv.temporaryHealth = 0;
		play(s, give(s, "severineCut"), e.instanceId);
		out("Cut: Severine hp lost / enemy hp lost / Severine Strength", (hp - sv.health) + " / " + (eh - e.health) + " / " + stacks(sv, "strength"));
	},
	bloodlust() {
		const s = setup([{ characterIndex: "severine", outfitIndex: "default" }], { severine: ["severineAbility1", "severineWheel1"] }, "loneSporeling");
		const sv = member(s, "severine");
		s.hc.abilities.use(sv.instanceId, "severineBloodTap", null);
		out("Bloodlust: lust / Strength (design: 5 lust AND 1 Strength?)", sv.lust + " / " + stacks(sv, "strength"));
	},
	mortification() {
		const s = setup([{ characterIndex: "clemence", outfitIndex: "default" }, { characterIndex: "brienne", outfitIndex: "default" }], { clemence: ["clmAbility1", "clmWheel2"] }, "loneSporeling");
		const c = member(s, "clemence"), b = member(s, "brienne");
		b.temporaryHealth = 8;
		c.statusArray.push({ index: "strength", stacks: 3 });
		const hb = b.health, hc2 = c.health;
		s.hc.abilities.use(c.instanceId, "clemenceAbsolve", null);
		out("Mortification 'lose 10 life': Brienne hp lost (8 tHP, Clem 3 Str)", (hb - b.health) + " tHP left " + b.temporaryHealth + "; Clemence lost " + (hc2 - c.health));
	},
	priceSelf() {
		const s = setup([{ characterIndex: "severine", outfitIndex: "default" }], { severine: ["severineAtt3"] }, "loneSporeling");
		const sv = member(s, "severine");
		sv.statusArray.push({ index: "strength", stacks: 2 });
		const hp = sv.health, e = s.combat.enemyArray[0], eh = e.health;
		sv.temporaryHealth = 0;
		play(s, give(s, "severineRend"), e.instanceId);
		out("Price with 2 Strength: enemy lost / Severine lost", (eh - e.health) + " / " + (hp - sv.health));
	},
};
const which = process.argv[2];
for (const k of Object.keys(tests)) {
	if (which && which !== k) continue;
	try { tests[k](); } catch (err) { out(k + " THREW", err.message + "\n" + err.stack.split("\n").slice(1, 3).join("\n")); }
}
