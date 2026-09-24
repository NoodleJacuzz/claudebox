//===================================================================================================
//HONEYCOMB ART PIPELINE -- writes OUTFITS.md from outfit-designs.js
//===================================================================================================
//  node --max-old-space-size=2048 "!designDocs/honeycomb/art_pipeline/build-outfits-doc.js"
//
//NOODLE HAS FOUR NOTES IN THIS FILE. If a rebuilt OUTFITS.md does not hold four lines starting
//"Note from noodle:", something has eaten them -- look here before writing anything.
//NOODLE'S NOTES LIVE HERE, NOT IN OUTFITS.md. That file is overwritten wholesale by this script, so a
//note typed into it is destroyed by the next rebuild (which is exactly what happened in session 42).
//Anything of his that must survive goes in the out.push() blocks below, verbatim.
//One combined document for the 19 alternate outfits and their six designs each (A-F), outfits alphabetical
//inside each character. Regenerate after editing outfit-designs.js.
const fs = require("fs");
const path = require("path");
const designs = require(path.join(__dirname, "outfit-designs.js"));

const CAST = [
	{ folder: "knight", name: "Brienne", klass: "Warrior", core: "white bodysuit, red capelet, knight visor / visor up, single pauldron and pantsleg, buckler" },
	{ folder: "necro", name: "Nettle", klass: "Necromancer", core: "black hooded long dress, black staff and flaming skull, detached sleeves" },
	{ folder: "vamp", name: "Severine", klass: "Bloodletter", core: "black tricorne, long black coat over no shirt, ascot, white pants, red boots, claws" },
	{ folder: "lancer", name: "Cinder", klass: "Lancer", core: "huge wide-brim hat, cloak over a bronze breastplate and blouse, shorts, tights, flaming spear" },
	{ folder: "priest", name: "Clemence", klass: "Confessor", core: "white veil over veiled eyes, very long white dress, white/gold capelet, gold cuffs, cross print" },
	{ folder: "seer", name: "Cassadora", klass: "Hexer", core: "black leotard, blindfold over one eye, black cape, belts, thighboots, crystal ball and floating flaming orb" },
	{ folder: "chess", name: "Anastasia", klass: "Chessmaster", core: "white coat worn bancho over cross pasties and a black necktie, checkered pleated skirt, one fishnet thighhigh, platform boots" },
];
const VARIANT = {
	A: "core look, recoloured/re-dressed; **haircut changed** (see the design)",
	B: "**new colour palette and swapped weapon(s)** over the same idea",
	C: "**original** concept; the default outfit is ignored",
	D: "**lewd A** — the overt exposure identity (the only set allowed bikini / mostly-nude / see-through)",
	E: "**lewd B** — peeks and teases; partial reveals, slits and gaps",
	F: "**lewd C** — hypersexualised; harnesses, corsets, bondage and body-control",
};
const invented = new Set(designs.flatMap((d) => d.invented || []));

const out = [];
out.push("# Honeycomb alternate outfits — A–F (2026-09-15)", "");
out.push("**Brainstorm, not data.** All nineteen alternate outfits, six designs each (A–F, **114 total**). Replaces",
	"`OUTFITS-01.md` and `OUTFITS-02.md`. Outfits are alphabetical inside each character. The machine-readable",
	"source is `outfit-designs.js`; the test runner is `outfits-generate.js`. **Nothing here is in `charactersDB.js`.**", "");
out.push("Source: `honeycomb-content-characters.js` `outfitArray` (the themes) and the `*default` lines in",
	"`charactersDB.js` (the prompt shape). The placeholder hue shifts are ignored — palettes are chosen for the theme.", "");
out.push("| Set | Idea |", "|---|---|");
for (const [k, v] of Object.entries(VARIANT)) { out.push("| **" + k + "** | " + v + " |"); }
out.push("");
out.push("Conventions: ornaments as `[colour] [object] [location] ornament`; carried things positioned; a `!tag`",
	"removes a trait the entry injects (the A-set haircut, a swapped prop). `tagsV` / `tagsC` are added only for that",
	"sex — the gendered lewd tags live there (`cleavage` / `breasts` for V, `bulge` / penis family for C). Every D/E/F",
	"design carries at least one **real** lewd tag and at least one **invented** one (marked `†`, not in any dictionary",
	"or booru). All 114 compile with no errors; the only culls are the engine's usual defaults (an A-set `!tag`",
	"haircut swap, `no breasts`, `remove eyes`) and its own invented tags read as unknown, exactly as before.", "");

for (const c of CAST) {
	out.push("", "---", "", "## " + c.name + " — `" + c.folder + "` (" + c.klass + ")", "", "Default core: " + c.core + ".", "");
	const outfits = [...new Set(designs.filter((d) => d.character === c.folder).map((d) => d.index))].sort();
	for (const index of outfits) {
		out.push("### `" + index + "`", "");
		for (const d of designs.filter((x) => x.character === c.folder && x.index === index).sort((a, b) => a.variant.localeCompare(b.variant))) {
			const show = (list) => list.map((t) => (invented.has(t) ? "`" + t + "`†" : t)).join(", ");
			out.push("**" + d.variant + "** — *" + d.theme + "*", "");
			out.push("```", index + "; " + show(d.tags), "```");
			if (d.tagsV && d.tagsV.length) { out.push("- female only: " + show(d.tagsV)); }
			if (d.tagsC && d.tagsC.length) { out.push("- male only: " + show(d.tagsC)); }
			out.push("- TornDamage: `" + d.torn.join(", ") + "`", "");
		}
	}
}

out.push("", "---", "", "## The 57 lewd identities — unique across the whole lineup", "",
	"Every D/E/F design has its own medium (D), tease (E) and control tool (F). Across the whole 19-outfit",
	"lineup no medium, no tease and no tool repeats, and **every restraint and corset idea has been retired**",
	"(the pillory / egg / doll / petrification / gambling / taxidermy / marionette words were ruled unviable, and",
	"shackles, harness, leash, chastity, bit-gag/reins, shibari, crop/dominatrix and corset were one overlapping",
	"theme). The 19 tools: `body paint`, `slime`, animated weapons, `tentacles`, `mummy`, `pheromones`, `piercing`,",
	"`love potion`, `heat`, `brand`, `living clothes`, `inflation`, `hypnosis`, `orgasm denial`, `possession`,",
	"`body writing`, `glowing runes`, `burial` and `objectification` — one design each.", "",
	"Note from noodle: What on earth were you cooking, deepseek? \"animated weapons\"? \"heat\"? \"burial\"?! Throw all these out!", "",
	"| Outfit | D — exposure | E — tease | F — fetish |", "|---|---|---|---|");
for (const c of CAST) {
	const outfits = [...new Set(designs.filter((d) => d.character === c.folder).map((d) => d.index))].sort();
	for (const index of outfits) {
		const pick = (v) => { const d = designs.find((x) => x.character === c.folder && x.index === index && x.variant === v); return d ? d.theme : ""; };
		out.push("| `" + c.folder + "/" + index + "` | " + pick("D") + " | " + pick("E") + " | " + pick("F") + " |");
	}
}
out.push("");

out.push("", "---", "", "## The " + invented.size + " invented lewd tags (†)", "", "Made up for this pass; none is in the dictionaries or booru. Every D/E/F design names at least one.", "",
	[...invented].map((t) => "`" + t + "`").join(", "), "",
	"Note from noodle: Try moving closer to what's actually likely to be recognized by the AI.", "");
out.push("## Real lewd tags used", "", "From the dictionaries or common booru vocabulary (e.g. `covered nipples`, `plunging neckline`,",
	"`downblouse`, `armpit peek`, `micro bikini`, `crotchless panties`, `see-through clothes`, `tan lines`, `mud`,",
	"`wax`, `ice`, `slime`, `pheromones`, `piercing`, `love potion`, `heat`, `brand`, `living clothes`, `inflation`,",
	"`hypnosis`, `orgasm denial`, `body writing`, `objectification`). Gendered by sex where it matters.", "",
	"Note from noodle: tan lines, mud, wax, ice, love potion, inflation, hypnosis, and objectification are banned. Downblouse and armpit peek are hard to use, be sure you know what you're doing.", "",
	"Note from noodle: Some of the outfits came out alright, but, and I don't want to sound rude, it feels like they came out alright in spite of your efforts. Now I have stuff like \"wax\" in the data that probably did nothing, but needs cleaning.", "",
	"Please redo, I've already saved all my favorites from this attempt line. Decently high priority since I can't include the alt outfits in training data until I actually pick them out!");

fs.writeFileSync(path.join(__dirname, "OUTFITS.md"), out.join("\n"), "utf8");
console.log("wrote OUTFITS.md (" + designs.length + " designs, " + invented.size + " invented tags)");
