// ============================================================================
//  WEBUI ENGINE v2 — character database linter
// ============================================================================
//
//    node scripts/webui/tools/webui2-lint.js              both files
//    node scripts/webui/tools/webui2-lint.js --quiet      counts only
//
//  charactersDB.js is hand-written, 509 characters and 631 outfits deep, and
//  the parser that reads it is forgiving in the worst way: it splits on "; "
//  and whatever it gets, it keeps. A line that does not fit produces a silently
//  unreachable entry rather than an error.
//
//  That is survivable at 509. It is not survivable at the scale an animadex
//  import would land in charactersDB2.js, so this exists BEFORE that import
//  does — run it on the import and read the output before trusting it.
//
//  Findings are ranked by what they cost:
//
//    BROKEN   the entry cannot be reached at all. Someone typed it and it does
//             not exist as far as the engine is concerned.
//    INERT    parsed, reachable, does nothing. Usually a stub left to fill in.
//    ODD      legal, works, and worth a look — a duplicate, a lone outfit name.
//
//  This reports. It does not edit: what looks like a typo is sometimes a
//  decision, and a linter that rewrites a hand-written database on a guess is
//  worse than the problem.
// ============================================================================

const fs = require("fs");
const vm = require("vm");
const path = require("path");

// One up from tools/: `here` means the engine directory, which is what every
// path below is relative to.
const here = path.join(__dirname, "..");
const quiet = process.argv.indexOf("--quiet") !== -1;

// The parser sees the template's CONTENTS, so read them the way the page does
// and keep the offset so a finding can name a real line in a real file.
function loadDatabase(file, variableName) {
    const full = path.join(here, "libraries", file);
    if (!fs.existsSync(full)) { return null; }
    const source = fs.readFileSync(full, "utf8");
    const sandbox = { console: { log() {}, info() {}, warn() {}, debug() {}, error() {} } };
    vm.createContext(sandbox);
    vm.runInContext(source, sandbox, { filename: file });
    const text = sandbox[variableName];
    if (typeof text !== "string") { return null; }

    const marker = source.indexOf(variableName);
    const backtick = source.indexOf("`", marker);
    const offset = source.slice(0, backtick).split("\n").length;
    return { file, lines: text.split("\n"), offset };
}

const databases = [
    loadDatabase("charactersDB.js", "characterArray"),
    loadDatabase("charactersDB2.js", "characterArray2")
].filter(Boolean);

const findings = [];
const report = (level, db, index, line, rule, note) => {
    findings.push({ level, rule, note,
                    where: `${db.file}:${db.offset + index}`,
                    line: String(line).trim() });
};

// A character seen in an earlier file outranks a later one, which is the rule
// cleanupCharacterArray applies. Tracked across files so the import can be told
// what it is duplicating rather than adding.
const seenAcrossFiles = {};

for (const db of databases) {
    const seenHere = {};
    const outfitsPerCharacter = {};
    const outfitNameUses = {};
    let current = null;

    for (let i = 0; i < db.lines.length; i++) {
        const raw = db.lines[i];
        // LEADING whitespace only. The trailing space is the entire difference
        // between `*default;` and `*default; ` — the first keeps the semicolon
        // in its name and becomes unreachable, the second parses perfectly and
        // is merely empty. Trimming both ends hid that and reported twelve
        // working-but-empty outfits as broken.
        const line = raw.replace(/^\s+/, "");
        if (!line.trim() || line[0] === "-" || line[0] === "#" || line[0] === "/") { continue; }

        const isCharacter = line[0] === ".";
        const isOutfit = line[0] === "*";
        const semicolon = line.indexOf(";");

        // ---- shape of the line itself ----------------------------------
        if (semicolon === -1) {
            // Not a stub, not an entry: the parser will staple it onto whatever
            // came last as a replacement rule, which is rarely what was meant.
            report(isCharacter || isOutfit ? "BROKEN" : "ODD", db, i, line,
                   "no semicolon",
                   isCharacter || isOutfit
                       ? "an entry with no `;` has no payload and no name split"
                       : "will be read as a replacement rule for the entry above");
            continue;
        }

        const payload = line.slice(semicolon + 1);

        // No separator at all. The parser splits on "; ", so the name keeps its
        // semicolon: `*default;` is keyed ".codename*default;" and nothing will
        // ever ask for an outfit called "default;". This is the one that bites.
        if (payload === "") {
            // For a NAME this is still fatal. For a replacement rule it is a
            // PURGE and always was meant to be — `crown;` says this character has
            // none. Phase 4 skipped those lines until 2026-08-08; it culls now,
            // the same way cleaningDB has always read a blank replacement, so
            // there is nothing left to report.
            if (isOutfit || isCharacter) {
                report("BROKEN", db, i, line, "no space after `;`, and nothing after it",
                       "the name keeps the semicolon — the entry is unreachable");
            }
            continue;
        }
        if (payload[0] !== " ") {
            report("BROKEN", db, i, line, "no space after `;`",
                   "the parser splits on \"; \" — without the space the whole line is the name");
            continue;
        }
        // Separator present, payload empty. Parses correctly and produces a real
        // but empty entry: reachable, and does nothing when reached.
        if (!payload.trim()) {
            // An empty `*default; ` is the DOCUMENTED way to say a character has
            // no clothing tags — REPLACE-OVERHAUL §E. It is reachable, so it
            // consumes the `default` tag and the word never reaches the prompt;
            // omitting the line instead leaves `default` visible in the output.
            // The animadex import writes thousands of these on purpose.
            if (isOutfit && line.slice(1, semicolon).trim().toLowerCase() === "default") { continue; }
            report("INERT", db, i, line, "empty payload",
                   isOutfit ? "a reachable outfit that adds no tags"
                            : "nothing to add or replace with");
            continue;
        }

        // ---- identity ---------------------------------------------------
        if (isCharacter) {
            const codename = line.slice(0, semicolon).toLowerCase();
            current = codename;
            outfitsPerCharacter[codename] = outfitsPerCharacter[codename] || {};

            if (seenHere[codename]) {
                // Verified against the engine rather than assumed, and it is the
                // opposite of the outfit case below: buildCharacterIndex writes
                // `index.codenames[key] = entry` in a loop, so the LAST entry
                // overwrites — while findOutfit returns on its FIRST match. Two
                // kinds of duplicate in one file resolving opposite ways is
                // itself worth knowing.
                report("ODD", db, i, line, "duplicate codename",
                       `also at ${seenHere[codename]} — both parse, and the LAST one wins (buildCharacterIndex overwrites)`);
            } else if (seenAcrossFiles[codename]) {
                report("ODD", db, i, line, "shadowed by a higher-authority file",
                       `charactersDB already defines it at ${seenAcrossFiles[codename]}; this entry is skipped whole`);
            }
            seenHere[codename] = seenHere[codename] || `${db.file}:${db.offset + i}`;
            seenAcrossFiles[codename] = seenAcrossFiles[codename] || `${db.file}:${db.offset + i}`;
            continue;
        }

        if (isOutfit) {
            const name = line.slice(1, semicolon).toLowerCase();
            outfitNameUses[name] = (outfitNameUses[name] || 0) + 1;
            if (!current) {
                report("BROKEN", db, i, line, "outfit before any character",
                       "nothing owns it, so it is keyed against an empty codename");
                continue;
            }
            if (outfitsPerCharacter[current][name]) {
                report("ODD", db, i, line, "duplicate outfit",
                       `${current} already has a "${name}" at ${outfitsPerCharacter[current][name]} — the FIRST one wins (findOutfit returns on first match)`);
            }
            outfitsPerCharacter[current][name] = `${db.file}:${db.offset + i}`;
            continue;
        }

        // ---- a replacement rule ------------------------------------------
        if (!current) {
            report("BROKEN", db, i, line, "replacement before any character",
                   "nothing owns it");
        }
    }

    // An outfit name used exactly once across a whole database is more often a
    // typo than a costume — `pajamas` next to 630 others is fine, `pyjamas` is
    // not. Reported as ODD because plenty of one-offs are real.
    if (!quiet) {
        const lonely = Object.keys(outfitNameUses).filter(n => outfitNameUses[n] === 1).sort();
        if (lonely.length) {
            console.log(`\n  outfit names used exactly once in ${db.file} (typo candidates):`);
            console.log("    " + lonely.join(", "));
        }
    }
}

// ---------------------------------------------------------------------------

const levels = ["BROKEN", "INERT", "ODD"];
const counts = {};
for (const level of levels) { counts[level] = findings.filter(f => f.level === level).length; }

console.log("\n=== charactersDB lint ===");
for (const db of databases) {
    const entries = db.lines.filter(l => l.trim() && l.trim()[0] === ".").length;
    const outfits = db.lines.filter(l => l.trim() && l.trim()[0] === "*").length;
    console.log(`  ${db.file}: ${entries} characters, ${outfits} outfits`);
}
console.log(`\n  BROKEN ${counts.BROKEN}   INERT ${counts.INERT}   ODD ${counts.ODD}`);

if (!quiet) {
    for (const level of levels) {
        const group = findings.filter(f => f.level === level);
        if (!group.length) { continue; }
        console.log(`\n--- ${level} (${group.length}) ---`);
        const byRule = {};
        for (const f of group) { (byRule[f.rule] = byRule[f.rule] || []).push(f); }
        for (const rule of Object.keys(byRule)) {
            console.log(`\n  ${rule} — ${byRule[rule][0].note}`);
            for (const f of byRule[rule]) {
                console.log(`    ${f.where}  ${JSON.stringify(f.line)}`);
            }
        }
    }
}

console.log("");
process.exit(counts.BROKEN ? 1 : 0);
