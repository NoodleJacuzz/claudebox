//===================================================================================================
//HONEYCOMB ART PIPELINE -- step 6 shortcut tests (a review sheet, not the engine suite)
//===================================================================================================
//Checks that the pose shortcuts actually work, end to end, and writes the results to SHORTCUTS-TESTS.md so
//Noodle can read them without watching a terminal. It is deliberately separate from webui2-test.js: this is
//the step-6 CONTRACT (data + generated rules), while the engine suite is the engine's own regression net.
//
//  node --max-old-space-size=2048 "!designDocs/honeycomb/art_pipeline/refs-shortcuts-test.js"
//
//What it asserts, per slot:
//  1. the `Pose…` token never reaches the model;
//  2. no protection quote reaches the model;
//  3. identity, gender and framing are right (the entry + CORE landed);
//  4. damage is on every damaged slot and off every undamaged one;
//  5. every METHOD tag lands, except the 13 differences the insertion gate or a late Phase-2 tag causes;
//  6. the shortcut compiles to the step-5 template, with exactly those 13 differences.
//It also checks the four generated blocks are present in the dictionaries and that an unclaimed token is purged.
const fs = require("fs");
const path = require("path");
const templates = require("./pose-templates.js");
const shortcuts = require("./refs-shortcuts.js");

const sandbox = shortcuts.loadSandbox(shortcuts.injectedSources(shortcuts.buildBlocks()));
const REPORT = path.join(__dirname, "SHORTCUTS-TESTS.md");

const bare = (raw) => String(raw).trim().replace(/^\(+|\)+$/g, "").replace(/^'(.*)'$/i, "$1").replace(/:[\d.]+$/, "").trim().toLowerCase();
const tagsOf = (prompt) => shortcuts.tagsOf(prompt).map(bare);

let pass = 0; const failures = []; const rows = [];
function check(label, satisfied, detail) { if (satisfied) { pass++; } else { failures.push({ label, detail }); } }

// The differences the shortcut path resolves differently from the template. Golden on purpose: step 7 may
// change them, and changing them should update this list in the same commit.
const GOLDEN = {
	"lancer1V-basic-b":   { missing: ["covering face"], extra: [] },
	"lancer1C-basic-b":   { missing: ["covering face"], extra: [] },
	"lancer1V-offense-a": { missing: ["open mouth"], extra: [] },
	"lancer1V-offense-b": { missing: ["open mouth"], extra: [] },
	"lancer1C-offense-a": { missing: ["open mouth"], extra: [] },
	"lancer1C-offense-b": { missing: ["open mouth"], extra: [] },
	"necro1V-basic-a":    { missing: [], extra: ["female focus"] },
	"necro1V-basic-b":    { missing: [], extra: ["female focus"] },
	"necro1V-exposed":    { missing: [], extra: ["female focus"] },
	"vamp1V-breakdown-a": { missing: ["laughing"], extra: [] },
	"vamp1V-breakdown-b": { missing: ["laughing"], extra: [] },
	"vamp1C-breakdown-a": { missing: ["laughing"], extra: [] },
	"vamp1C-breakdown-b": { missing: ["laughing"], extra: [] },
};
const goldenOf = (name) => GOLDEN[name] || { missing: [], extra: [] };
const sameList = (a, b) => a.length === b.length && a.every((x) => b.indexOf(x) !== -1);

// ---- 1. the generated blocks are in the dictionaries ----------------------
const cleaningSrc = fs.readFileSync(shortcuts.CLEANING, "utf8");
const charactersSrc = fs.readFileSync(shortcuts.CHARACTERS, "utf8");
const blockCore = /Honeycomb pose templates \(GENERATED[\s\S]*?PoseDefense;[\s\S]*?end Honeycomb pose templates/.test(cleaningSrc);
const blockPurge = /Honeycomb pose purge \(GENERATED[\s\S]*?PoseSupportB;\s*[\r\n]+---------------------- end Honeycomb pose purge/.test(cleaningSrc);
const blockMethods = (charactersSrc.match(/Honeycomb pose methods \(GENERATED/g) || []).length === 12;
const blockDamage = (charactersSrc.match(/Honeycomb pose damage \(GENERATED/g) || []).length === 12;
check("the CORE block is written into cleaningArrayInitial", blockCore);
check("the purge block is written into cleaningArrayFinal", blockPurge);
check("all 12 entries carry method blocks", blockMethods);
check("all 12 entries carry outfit damage blocks", blockDamage);

// ---- 2. every slot --------------------------------------------------------
for (const character of Object.keys(templates.ENTRY)) {
	for (const sex of ["V", "C"]) {
		for (const slot of templates.SLOT_ARRAY) {
			const name = character + "1" + sex + "-" + templates.FILE_SLOT[slot];
			const job = sandbox.buildPrompt(templates.buildShortcutInput(character, sex, slot), "", {});
			const prompt = job.prompt;
			const tags = tagsOf(prompt);
			const templateTags = new Set(tagsOf(sandbox.buildPrompt(templates.buildInput(character, sex, slot), "", {}).prompt));
			const got = new Set(tags);

			const tokenGone = !tags.some((t) => t === templates.POSE_TOKEN[slot].toLowerCase());
			const noQuotes = prompt.indexOf("'") === -1;
			const gender = tags.indexOf(sex === "V" ? "1girl" : "1boy") !== -1;
			const framing = tags.indexOf("solo") !== -1 && tags.indexOf("simple background") !== -1;
			const identity = tags.indexOf(({ knight: "hc-kn1ght", lancer: "hc-l4ncer", necro: "hc-n3cro", priest: "hc-pr1est", seer: "hc-s3er", vamp: "hc-v4mp" })[character]) !== -1;

			const damaged = templates.DAMAGED_SLOTS.includes(slot);
			const damageTags = (templates.DAMAGE[character] || []).map(bare);
			const damage = damaged ? damageTags.every((t) => got.has(t)) : damageTags.every((t) => !got.has(t));

			const method = (templates.methodFor(character, slot) || []).map(bare);
			const golden = goldenOf(name);
			const goldenMissing = golden.missing.map(bare);
			// A METHOD tag the ENGINE itself dropped (smirk → grin, a cleaning rewrite) is not the shortcut's
			// fault, so only a tag the TEMPLATE kept counts as one the shortcut must keep too.
			const missingMethod = method.filter((t) => templateTags.has(t) && !got.has(t) && goldenMissing.indexOf(t) === -1);

			const missing = [...templateTags].filter((t) => !got.has(t)).sort();
			const extra = [...got].filter((t) => !templateTags.has(t)).sort();
			const diffOk = sameList(missing, golden.missing.slice().sort()) && sameList(extra, golden.extra.slice().sort());

			rows.push({ name, tokenGone, noQuotes, gender, framing, identity, damage, missingMethod, missing, extra, diffOk });

			check(name + " · token purged", tokenGone);
			check(name + " · no quote reaches the model", noQuotes);
			check(name + " · gender and framing", gender && framing);
			check(name + " · identity tag reaches the model", identity);
			check(name + " · damage " + (damaged ? "present" : "absent"), damage);
			check(name + " · method tags land", missingMethod.length === 0, "dropped: " + missingMethod.join(", "));
			check(name + " · matches the template (minus the golden 13)", diffOk, "missing: " + missing.join(", ") + " | extra: " + extra.join(", "));
		}
	}
}

// ---- 3. the mechanics a per-slot loop cannot see --------------------------
let dropOk, femboyOk, orphanOk, addsTagsOk;
{
	// DROP: Nettle's breakdown drops the staff, and only there.
	const breakdown = sandbox.buildPrompt(".hcNecroV, default, PoseBreakdown", "", {});
	const basic = sandbox.buildPrompt(".hcNecroV, default, PoseA", "", {});
	const dropsOnPose = tagsOf(breakdown.prompt).indexOf("black staff") === -1;
	const keepsElsewhere = tagsOf(basic.prompt).indexOf("black staff") !== -1;
	dropOk = dropsOnPose && keepsElsewhere;
	check("DROP: `!black staff` removes the prop on the slot that names it", dropsOnPose);
	check("DROP: and leaves it alone on every other slot", keepsElsewhere);
}
{
	// A femboy's C entry carries 'male only'; the knight (not a femboy) does not.
	const femboy = sandbox.buildPrompt(".hcLancerC, default, PoseA", "", {});
	const knight = sandbox.buildPrompt(".hcKnightC, default, PoseA", "", {});
	const femboyHas = tagsOf(femboy.prompt).indexOf("male only") !== -1;
	const knightHasNot = tagsOf(knight.prompt).indexOf("male only") === -1;
	femboyOk = femboyHas && knightHasNot;
	check("femboy C carries `male only`", femboyHas);
	check("non-femboy C does not", knightHasNot);
}
{
	// A token nobody claims is purged rather than emitted.
	const orphan = sandbox.buildPrompt("1girl, PoseDefense", "", {});
	orphanOk = !/posedefense/i.test(orphan.prompt);
	check("an unclaimed token is purged", orphanOk);
}
{
	// The shortcut is more than the bare character: the pose actually adds tags.
	const bareCharacter = sandbox.buildPrompt(".hcKnightV, default", "", {});
	const posed = sandbox.buildPrompt(".hcKnightV, default, PoseDefense", "", {});
	addsTagsOk = tagsOf(posed.prompt).length > tagsOf(bareCharacter.prompt).length;
	check("the pose adds tags the bare character does not have", addsTagsOk);
}

// ---- the report -----------------------------------------------------------
const mark = (ok) => (ok ? "ok" : "**FAIL**");
const lines = ["# Step 6 shortcut tests (GENERATED by `refs-shortcuts-test.js`; do not edit)", "",
	"**" + pass + " passed, " + failures.length + " failed.**", "",
	"Each slot is typed as `.hc<Char><V|C>, default, <Pose…>` and compiled by the webui v2 engine, then compared",
	"to the step 5 template input. `Golden` means the difference is the insertion gate's exclusivity resolving a",
	"mutually-exclusive pair differently from a typed tag, or a Phase-2 tag arriving in Phase 4 — step 7 owns",
	"whether that is right.", "",
	"## Generated blocks in the dictionaries", "",
	"- " + mark(blockCore) + " CORE block in `cleaningArrayInitial`", 
	"- " + mark(blockPurge) + " purge block in `cleaningArrayFinal`", 
	"- " + mark(blockMethods) + " 12 entry method blocks", 
	"- " + mark(blockDamage) + " 12 outfit damage blocks", "",
	"(re-run `refs-shortcuts.js --write` if any of these is missing)", "",
	"## Every slot", "",
	"| Slot | Token | Quotes | Gender+framing | Identity | Damage | Method | vs template |",
	"|---|---|---|---|---|---|---|---|"];
for (const row of rows) {
	lines.push("| `" + row.name + "` | " + mark(row.tokenGone) + " | " + mark(row.noQuotes) + " | " + mark(row.gender && row.framing) +
		" | " + mark(row.identity) + " | " + mark(row.damage) + " | " + (row.missingMethod.length ? "**" + row.missingMethod.join(", ") + "**" : "ok") +
		" | " + (row.diffOk ? (row.missing.length || row.extra.length ? "golden" : "identical") : "**" + (row.missing.length ? "missing " + row.missing.join(", ") : "") + (row.extra.length ? " extra " + row.extra.join(", ") : "") + "**") + " |");
}
lines.push("", "## The golden 13", "", "| Slot | What the shortcut resolves differently |", "|---|---|");
for (const [name, diff] of Object.entries(GOLDEN)) {
	lines.push("| `" + name + "` | " + (diff.missing.length ? "template-only: " + diff.missing.join(", ") : "") +
		(diff.missing.length && diff.extra.length ? " · " : "") + (diff.extra.length ? "shortcut-only: " + diff.extra.join(", ") : "") + " |");
}
lines.push("", "## Mechanics", "",
	"- " + mark(dropOk) + " DROP (`!black staff` on Nettle's breakdown only)",
	"- " + mark(femboyOk) + " femboy `male only`",
	"- " + mark(orphanOk) + " unclaimed token purged",
	"- " + mark(addsTagsOk) + " the pose adds tags", "");
if (failures.length) {
	lines.push("## Failures", "");
	for (const fail of failures) { lines.push("- **" + fail.label + "**" + (fail.detail ? " — " + fail.detail : "")); }
}
fs.writeFileSync(REPORT, lines.join("\n"), "utf8");

console.log(pass + " passed, " + failures.length + " failed");
for (const fail of failures) { console.log("  FAIL  " + fail.label + (fail.detail ? " — " + fail.detail : "")); }
console.log("wrote " + path.basename(REPORT) + " for review");
