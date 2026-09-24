//===================================================================================================
//HONEYCOMB CATACOMBS -- font metrics generator (developer tool, never loaded by the game)
//===================================================================================================
//Art pass, 2026-09-14: "Judging card length should not be a manual task, we should be able to compare font
//width with a known working card at all three sizes and add it to the audit."
//
//Reads the advance width of every character the card faces can print straight out of the font files (the
//OpenType `cmap`, `head`, `hhea` and `hmtx` tables; no library, no browser) and writes them as a plain table
//the game loads like any other script, so the width check works offline and headless:
//
//  node "!designDocs/honeycomb/tools/generate-font-metrics.js"
//
//Rerun after changing a font file or the font list below. The output is GENERATED: edit this tool, never
//scripts/misc/honeycomb/honeycomb-font-metrics.js by hand. Kerning is not read, so a measured line is never
//narrower than the browser draws it.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..", "..");
const OUTPUT = path.join(ROOT, "scripts", "misc", "honeycomb", "honeycomb-font-metrics.js");

//Every font a card face prints in, by the CSS token that names it (scripts/css/honeycomb.css :root).
const FONT_ARRAY = [
	{ index: "display", cssToken: "--hc-font-display", file: "scripts/fonts/norwester.otf" },
	{ index: "body", cssToken: "--hc-font-body", file: "scripts/fonts/railway.otf" },
];

//The characters measured: printable ASCII, Latin-1, general punctuation and the arrows and marks card text
//uses. A character outside the list is measured at the font's widest measured letter.
const RANGE_ARRAY = [[0x20, 0x7e], [0xa0, 0xff], [0x2010, 0x2027], [0x2190, 0x2199], [0x25b6, 0x25c0], [0x27e8, 0x27e9]];

function readTables(buffer) {
	const tableCount = buffer.readUInt16BE(4);
	const tables = {};
	for (let tableIndex = 0; tableIndex < tableCount; tableIndex++) {
		const record = 12 + tableIndex * 16;
		tables[buffer.toString("latin1", record, record + 4)] = { offset: buffer.readUInt32BE(record + 8), length: buffer.readUInt32BE(record + 12) };
	}
	return tables;
}

//The Unicode cmap subtable as a code point -> glyph id lookup. Formats 4 and 12 cover every font in use.
function readCharacterMap(buffer, table) {
	const base = table.offset;
	const subtableCount = buffer.readUInt16BE(base + 2);
	let chosen = null;
	for (let subtableIndex = 0; subtableIndex < subtableCount; subtableIndex++) {
		const record = base + 4 + subtableIndex * 8;
		const platform = buffer.readUInt16BE(record);
		const encoding = buffer.readUInt16BE(record + 2);
		const offset = base + buffer.readUInt32BE(record + 4);
		const format = buffer.readUInt16BE(offset);
		const unicode = platform === 0 || (platform === 3 && (encoding === 1 || encoding === 10));
		if (!unicode || (format !== 4 && format !== 12)) continue;
		if (chosen == null || format === 12) chosen = { offset: offset, format: format };
	}
	if (chosen == null) throw new Error("no Unicode cmap subtable in format 4 or 12");
	const offset = chosen.offset;
	if (chosen.format === 12) {
		const groupCount = buffer.readUInt32BE(offset + 12);
		return (codePoint) => {
			for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
				const group = offset + 16 + groupIndex * 12;
				const start = buffer.readUInt32BE(group);
				const end = buffer.readUInt32BE(group + 4);
				if (codePoint >= start && codePoint <= end) return buffer.readUInt32BE(group + 8) + (codePoint - start);
			}
			return 0;
		};
	}
	const segmentCount = buffer.readUInt16BE(offset + 6) / 2;
	const endBase = offset + 14;
	const startBase = endBase + segmentCount * 2 + 2;
	const deltaBase = startBase + segmentCount * 2;
	const rangeBase = deltaBase + segmentCount * 2;
	return (codePoint) => {
		for (let segment = 0; segment < segmentCount; segment++) {
			const end = buffer.readUInt16BE(endBase + segment * 2);
			if (codePoint > end) continue;
			const start = buffer.readUInt16BE(startBase + segment * 2);
			if (codePoint < start) return 0;
			const delta = buffer.readInt16BE(deltaBase + segment * 2);
			const rangeOffset = buffer.readUInt16BE(rangeBase + segment * 2);
			if (rangeOffset === 0) return (codePoint + delta) & 0xffff;
			const glyph = buffer.readUInt16BE(rangeBase + segment * 2 + rangeOffset + (codePoint - start) * 2);
			return glyph === 0 ? 0 : (glyph + delta) & 0xffff;
		}
		return 0;
	};
}

function measureFont(font) {
	const buffer = fs.readFileSync(path.join(ROOT, font.file));
	const tables = readTables(buffer);
	["head", "hhea", "hmtx", "cmap"].forEach((tag) => { if (tables[tag] == null) throw new Error(font.file + " has no " + tag + " table"); });
	const unitsPerEm = buffer.readUInt16BE(tables.head.offset + 18);
	const metricCount = buffer.readUInt16BE(tables.hhea.offset + 34);
	const glyphFor = readCharacterMap(buffer, tables.cmap);
	//Glyphs past the last full metric share its advance (OpenType hmtx).
	const advanceOf = (glyph) => buffer.readUInt16BE(tables.hmtx.offset + Math.min(glyph, metricCount - 1) * 4);
	const advance = {};
	let widest = 0;
	RANGE_ARRAY.forEach(([first, last]) => {
		for (let codePoint = first; codePoint <= last; codePoint++) {
			const glyph = glyphFor(codePoint);
			if (glyph === 0 && codePoint !== 0x20) continue;
			const width = Number((advanceOf(glyph) / unitsPerEm).toFixed(4));
			advance[String.fromCodePoint(codePoint)] = width;
			if (/[A-Za-z]/.test(String.fromCodePoint(codePoint))) widest = Math.max(widest, width);
		}
	});
	return { index: font.index, cssToken: font.cssToken, file: font.file, unitsPerEm: unitsPerEm, fallbackAdvance: widest, advance: advance };
}

const metricArray = FONT_ARRAY.map(measureFont);
const lines = [
	"//===================================================================================================",
	"//Honeycomb Catacombs -- font metrics  (GENERATED by !designDocs/honeycomb/tools/generate-font-metrics.js; do not edit)",
	"//===================================================================================================",
	"//The advance width of every measured character, in EMS, read from the font files the card faces print in.",
	"//Read by the card fit rule in honeycomb-warnings.js (honeycomb.warnings.textWidthEm) so a card's lines can be",
	"//measured with no browser. Rerun the generator after changing a font.",
	"honeycomb.fontMetricArray = " + JSON.stringify(metricArray, null, "\t").replace(/\n\t\t\t"/g, " \"").replace(/\n\t\t}/g, " }") + ";",
	"",
];
//`--check` writes nothing and exits non-zero when the table on disk is not what the font files say (test [76]).
if (process.argv.includes("--check")) {
	const current = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, "utf8") : "";
	const upToDate = current === lines.join("\n");
	console.log(upToDate ? "font metrics are up to date" : "font metrics are STALE: rerun generate-font-metrics.js");
	process.exit(upToDate ? 0 : 1);
}
fs.writeFileSync(OUTPUT, lines.join("\n"), "utf8");
metricArray.forEach((metric) => console.log(metric.index, metric.file, "unitsPerEm", metric.unitsPerEm, "characters", Object.keys(metric.advance).length,
	"M", metric.advance.M, "i", metric.advance.i, "fallback", metric.fallbackAdvance));
console.log("wrote", path.relative(ROOT, OUTPUT));
