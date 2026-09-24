// ============================================================================
//  WEBUI ENGINE v2 — charactersDB status report
// ============================================================================
//
//    node scripts/webui/tools/webui2-characters.js              all three sections
//    node scripts/webui/tools/webui2-characters.js --pairs      1 only
//    node scripts/webui/tools/webui2-characters.js --diff       2 only
//    node scripts/webui/tools/webui2-characters.js --redundant  3 only
//    node scripts/webui/tools/webui2-characters.js --all        3 covers charactersDB2 too
//    node scripts/webui/tools/webui2-characters.js --full       no truncation
//
//  ---------------------------------------------------------------------------
//  FIX MODES — every one of these WRITES to charactersDB.js
//  ---------------------------------------------------------------------------
//  ALL of them are a DRY RUN unless you add --apply. On --apply the whole file
//  is copied to scripts/webui/_backups/charactersDB.<timestamp>.<mode>.js FIRST,
//  every time, so the previous state is always one file-copy away.
//
//  They edit LINE BY LINE: the matched `.codename;` or `*outfit;` line is
//  rewritten and nothing else in the file is touched — no reflow, no reorder,
//  no reformat. If the number of lines matched does not equal the number of
//  entries to change, NOTHING is written and it says so.
//
//    --fix-duplicates   The same tag twice in one line. Covers entries AND
//                       outfit lines. No judgement in it at all — the engine
//                       already deduped, so this only tidies the source.
//                       SAFE TO RUN ANY TIME.
//
//    --fix-furry        `furry female` -> `female`, `furry male` -> `male`, so
//                       Phase 4 derives the right tag per figure.
//                       ADDS `anthro` FIRST where the entry has no other furry
//                       marker — `furry female` is itself one of v2FurryMarkers,
//                       so a bare swap would silently turn her human.
//
//    --fix-rules        Applies the `characterRules` block below. Renames run
//                       first, then conditional removals, so a rename can feed a
//                       removal. This mode claims NO proof — the rule list is
//                       the judgement, this is only the machinery. EDIT THE LIST
//                       rather than reaching for --fix-redundant.
//
//    --fix-redundant    Tags whose removal leaves the compiled prompt IDENTICAL.
//                       READ THE CAVEATS ON IT BEFORE USING. Measured in ONE
//                       context (her tags alone, solo, no scene), and
//                       output-identical is not filter-identical — `random(...)`
//                       reads the stored text, so a removal that changes no
//                       image can still change which characters a wildcard
//                       returns. Best used on a single entry you are already
//                       editing, never as a bulk sweep.
//
//  Typical order after a big hand-edit:
//      --fix-rules --apply        then      --fix-duplicates --apply
//  (a rename can create a duplicate; dedupe last and it is cleaned up)
//
//  Three questions, three sections:
//
//    1  PAIRS      does every `.fur` have a `.fleshy`, and the reverse? A missing
//                  half means `not furry` silently hands back the wrong body.
//    2  DIFF       for a pair that exists, what is UNIQUE to each side. Shared
//                  tags are noise here and are not printed.
//    3  REDUNDANT  which tags a character already gets for free. `shortstack`
//                  brings `wide hips, thick thighs`, so writing `wide hips`
//                  beside it is a line that maintains itself wrong later.
//
//  Section 3 reads the REAL defaultDB through the engine's own
//  `defaultRequirementMet`, so it cannot drift from what the engine does. The
//  three report sections never write; only the fix modes above do, and only
//  with --apply.
// ============================================================================

// ============================================================================
//  THE RULES — edit this block, it is the whole point of --fix-rules
// ============================================================================
//  Noodle's own list, in the dictionaries' own syntax. Two forms:
//
//     target; replacement          rename, unconditional
//     requirement: targets;        remove those targets when the requirement
//                                  is present. Empty right side = remove.
//     requirement: targets; new    conditional rename, supported but unused
//
//  A line starting with `-` is a COMMENT, the same as everywhere else in this
//  project — that is what keeps the disabled block below inert.
//
//  Aliases run FIRST, then removals, so a rename can feed a removal:
//  `otoko-no-ko` becomes `femboy`, and `femboy: girly, flat chest` then fires
//  on it. One pass each; removals do not cascade into other removals.
//
//  Targets are matched as WHOLE TAGS, case-insensitively. Never substrings —
//  `tan` must not touch `tanuki`.
// ============================================================================

var characterRules = `
-/ Replace known safe aliases
mature female; milf
always closed eyes; eyes closed
loli; cute girl
shota; cute boy
otoko-no-ko; femboy
otoko no ko; femboy

-/ Remove known safe redundancies
shortstack: wide hips, thick thighs;
plump: wide hips, thick thighs, curvy;
femboy: girly, flat chest;
cute boy: flat chest;
cute girl: petite, flat chest;
wide hips: thick thighs;
kuudere: emotionless, expressionless;
tan: tanlines;
no eyes: eyeless;
no mouth: mouthless;
no nose: noseless;
no arms: armless;
no legs: legless;
asian female: asian;
goblin: green skin, big ears;

-/ Replacements disabled until parasites are actually added
- not furry: human;
- //Potential consideration: maybe the other way around would be better, to avoid applying 'human' to 'goblin' and similar cases, deferred to later
- tall: taller female, long legs;
- athletic: athletic female, toned;
- mesugaki: smug;
- shortstack: large breasts;
- plump: huge breasts;
`;

const fs = require("fs");
const vm = require("vm");
const path = require("path");

const here = path.join(__dirname, "..");
const args = process.argv.slice(2);
const has = f => args.indexOf(f) !== -1;
const fixDupes    = has("--fix-duplicates");
const fixFurry    = has("--fix-furry");
const fixRedundant= has("--fix-redundant");
const fixRules    = has("--fix-rules");
const anyFix      = fixDupes || fixFurry || fixRedundant || fixRules;
const apply       = has("--apply");

const only = anyFix || has("--pairs") || has("--diff") || has("--redundant");
const wantPairs     = (!only || has("--pairs")) && !anyFix;
const wantDiff      = (!only || has("--diff")) && !anyFix;
const wantRedundant = (!only || has("--redundant")) && !anyFix;
const includeImport = has("--all");
const full          = has("--full");

// ---------------------------------------------------------------------------

const quiet = { log() {}, info() {}, warn() {}, debug() {}, error: console.error };
const sandbox = { console: quiet, module: undefined };
vm.createContext(sandbox);

const lib = path.join(here, "libraries");
const webuiSrc = fs.readFileSync(path.join(here, "webui.js"), "utf8");
const listMatch = webuiSrc.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/);
if (!listMatch) { throw new Error("librariesList not found in webui.js"); }
for (const file of listMatch[1].match(/"([^"]+)"/g).map(q => q.slice(1, -1))) {
    vm.runInContext(fs.readFileSync(path.join(lib, file), "utf8"), sandbox, { filename: file });
}
for (const file of ["webui.js", "webui2-categories.js", "webui2.js"]) {
    vm.runInContext(fs.readFileSync(path.join(here, file), "utf8"), sandbox, { filename: file });
}
vm.runInContext("v2EnsureDictionaries()", sandbox);

// charactersDB2 is generated and outranked; its entries are not hand-curated and
// their redundancy is not actionable. Read charactersDB.js's own text for the
// codenames it declares, which is the only reliable way to tell the two apart —
// a parsed entry carries no marker saying which file it came from.
const handWritten = new Set(
    (fs.readFileSync(path.join(lib, "charactersDB.js"), "utf8")
       .match(/^\.[A-Za-z0-9_-]+(?=;)/gm) || []).map(s => s.toLowerCase()));

const characters = sandbox.cleanedCharacterArray || [];
const outfits    = sandbox.cleanedOutfitArray || [];
const byCodename = new Map();
for (const e of characters) {
    if (e && e.codename) { byCodename.set(String(e.codename).toLowerCase(), e); }
}

const tagsOf = entry => String(entry && entry.prompt || "")
    .split(",").map(t => t.trim()).filter(Boolean);

function heading(n, title, sub) {
    console.log("\n" + "=".repeat(78));
    console.log("  " + n + " · " + title);
    if (sub) { console.log("     " + sub); }
    console.log("=".repeat(78) + "\n");
}

function listOrCap(items, cap) {
    return (full || items.length <= cap) ? items : items.slice(0, cap)
        .concat(["…and " + (items.length - cap) + " more (--full to see them)"]);
}

// ===========================================================================
//  1 · PAIRS
// ===========================================================================

const FUR = ".fur", FLESHY = ".fleshy", SYRUP = ".syrup";
const stems = { fur: new Set(), fleshy: new Set(), syrup: new Set() };
for (const code of byCodename.keys()) {
    if (!handWritten.has(code)) { continue; }
    if (code.startsWith(FUR))         { stems.fur.add(code.slice(FUR.length)); }
    else if (code.startsWith(FLESHY)) { stems.fleshy.add(code.slice(FLESHY.length)); }
    else if (code.startsWith(SYRUP))  { stems.syrup.add(code.slice(SYRUP.length)); }
}
const paired    = [...stems.fur].filter(s => stems.fleshy.has(s)).sort();
const furOnly   = [...stems.fur].filter(s => !stems.fleshy.has(s)).sort();
const fleshOnly = [...stems.fleshy].filter(s => !stems.fur.has(s)).sort();

if (wantPairs) {
    heading(1, "PAIRS", "does every .fur have a .fleshy, and the reverse?");
    console.log(`  ${stems.fur.size} fur · ${stems.fleshy.size} fleshy · ${stems.syrup.size} universal`);
    console.log(`  ${paired.length} complete pairs\n`);

    if (furOnly.length) {
        console.log(`  FUR WITH NO FLESHY — ${furOnly.length}`);
        console.log("  `not furry` on any of these hands back the furry form instead.\n");
        for (const s of listOrCap(furOnly, 40)) { console.log("    .fur" + s); }
        console.log("");
    }
    if (fleshOnly.length) {
        console.log(`  FLESHY WITH NO FUR — ${fleshOnly.length}\n`);
        for (const s of listOrCap(fleshOnly, 40)) { console.log("    .fleshy" + s); }
        console.log("");
    }
    if (!furOnly.length && !fleshOnly.length) { console.log("  Every pair is complete.\n"); }

    // A universal character that ALSO has variants is ambiguous: the stem
    // resolver prefers the variants, so the .syrup entry becomes unreachable.
    const shadowed = [...stems.syrup].filter(s => stems.fur.has(s) || stems.fleshy.has(s));
    if (shadowed.length) {
        console.log(`  SHADOWED UNIVERSALS — ${shadowed.length}`);
        console.log("  A .syrup entry that also has a .fur/.fleshy is unreachable — the stem");
        console.log("  resolver prefers the variants, so the .syrup entry is never used.\n");
        for (const s of shadowed) { console.log("    .syrup" + s); }
        console.log("");
    }

    // Every shortcut and alias that points somewhere nothing lives.
    const dangling = [];
    for (const [name, target] of (sandbox.basicShortcutArray || [])) {
        const t = String(target).toLowerCase();
        const stem = t.startsWith(SYRUP) ? t.slice(SYRUP.length) : null;
        const ok = stem
            ? (byCodename.has(FUR + stem) || byCodename.has(FLESHY + stem) || byCodename.has(t))
            : byCodename.has(t);
        if (!ok) { dangling.push(`basicShortcutArray  ${name} -> ${target}`); }
    }
    for (const a of (sandbox.cleanedAliasArray || [])) {
        if (!a || !a.target || !a.replacement) { continue; }
        const t = "." + String(a.replacement).trim().toLowerCase();
        const stem = t.startsWith(SYRUP) ? t.slice(SYRUP.length) : null;
        const ok = stem
            ? (byCodename.has(FUR + stem) || byCodename.has(FLESHY + stem) || byCodename.has(t))
            : byCodename.has(t);
        if (!ok) { dangling.push(`aliasDB             ${a.target} -> ${a.replacement}`); }
    }
    if (dangling.length) {
        console.log(`  POINTS AT NOTHING — ${dangling.length}`);
        console.log("  The name resolves, then the codename it resolves to does not exist.\n");
        for (const d of listOrCap(dangling, 30)) { console.log("    " + d); }
        console.log("");
    } else {
        console.log("  Every shortcut and alias resolves to a real entry.\n");
    }

    // A tag written twice in one entry. Harmless to the engine — dedupe catches
    // it — but it is always a copy-paste slip, and it hides an intended tag that
    // was meant to be there instead.
    const dupes = [];
    for (const e of characters) {
        const code = String(e.codename || "").toLowerCase();
        if (!handWritten.has(code)) { continue; }
        const seen = new Map();
        for (const t of tagsOf(e)) {
            const k = t.toLowerCase();
            seen.set(k, (seen.get(k) || 0) + 1);
        }
        const twice = [...seen.entries()].filter(([, n]) => n > 1).map(([t, n]) => `${t} x${n}`);
        if (twice.length) { dupes.push(`${code}  —  ${twice.join(", ")}`); }
    }
    if (dupes.length) {
        console.log(`  DUPLICATE TAGS WITHIN ONE ENTRY — ${dupes.length}`);
        console.log("  Harmless (dedupe catches them) but always a slip, and each one may be");
        console.log("  standing where a different tag was meant to go.\n");
        for (const d of listOrCap(dupes, 30)) { console.log("    " + d); }
        console.log("");
    }
}

// ===========================================================================
//  2 · DIFF
// ===========================================================================

if (wantDiff) {
    heading(2, "DIFF", "what is UNIQUE to each side of a pair. Shared tags are not printed.");
    let identical = 0;
    for (const stem of paired) {
        const fur = byCodename.get(FUR + stem);
        const fle = byCodename.get(FLESHY + stem);
        const furTags = tagsOf(fur), fleTags = tagsOf(fle);
        const furSet = new Set(furTags.map(t => t.toLowerCase()));
        const fleSet = new Set(fleTags.map(t => t.toLowerCase()));
        const onlyFur = furTags.filter(t => !fleSet.has(t.toLowerCase()));
        const onlyFle = fleTags.filter(t => !furSet.has(t.toLowerCase()));

        // Outfits are keyed `codename*outfit`; a missing one is a real gap.
        const outfitsOf = code => outfits
            .filter(o => String(o.codename).toLowerCase().startsWith(code + "*"))
            .map(o => String(o.codename).toLowerCase().split("*")[1]);
        const furOut = new Set(outfitsOf(FUR + stem));
        const fleOut = new Set(outfitsOf(FLESHY + stem));
        const missingFle = [...furOut].filter(o => !fleOut.has(o));
        const missingFur = [...fleOut].filter(o => !furOut.has(o));

        if (!onlyFur.length && !onlyFle.length && !missingFle.length && !missingFur.length) {
            identical++;
            continue;
        }
        console.log(`  ── ${stem} ${"─".repeat(Math.max(0, 60 - stem.length))}`);
        console.log(`     shared ${furTags.length - onlyFur.length} tags`);
        if (onlyFur.length) { console.log(`     fur only    (${onlyFur.length})  ${onlyFur.join(", ")}`); }
        if (onlyFle.length) { console.log(`     fleshy only (${onlyFle.length})  ${onlyFle.join(", ")}`); }
        if (missingFle.length) { console.log(`     ⚠ outfits the FLESHY side lacks: ${missingFle.join(", ")}`); }
        if (missingFur.length) { console.log(`     ⚠ outfits the FUR side lacks:    ${missingFur.join(", ")}`); }
        console.log("");
    }
    if (identical) { console.log(`  ${identical} pairs are identical on both sides.\n`); }
}

// ===========================================================================
//  3 · REDUNDANT
// ===========================================================================
//  A tag is redundant when the OTHER tags in the same entry already produce it
//  through defaultDB. Evaluated with the engine's own `defaultRequirementMet`,
//  against records carrying real categories, so this cannot drift from what the
//  engine actually does.
//
//  Exceptions are honoured: a default whose exception list is satisfied does not
//  fire, and therefore makes nothing redundant.

if (wantRedundant) {
    heading(3, "REDUNDANT", "tags an entry already gets for free from defaultDB.");

    const defaults = sandbox.cleanedDefaultArray || [];
    const makeRecords = tags => tags.map((t, i) => {
        const r = sandbox.makeRecord(t, i);
        r.categories = sandbox.categoriesOf ? sandbox.categoriesOf(t) : [];
        return r;
    });
    const fakeJob = { solo: true, subjects: [], trace: { added: [], declined: [], culled: [], unknown: [], unmatched: [], conflicts: [] } };

    function redundantIn(tags) {
        if (tags.length < 2) { return []; }
        const records = makeRecords(tags);
        const present = new Map(tags.map(t => [t.toLowerCase(), t]));
        const produced = new Map();
        for (const entry of defaults) {
            const reqs = entry.requirements || [];
            const adds = entry.additions || [];
            const excs = entry.exceptions || [];
            if (!adds.length || !reqs.length) { continue; }
            let met = true;
            for (const r of reqs) {
                if (!sandbox.defaultRequirementMet(r, records, fakeJob)) { met = false; break; }
            }
            if (!met) { continue; }
            for (const e of excs) {
                if (sandbox.defaultRequirementMet(e, records, fakeJob)) { met = false; break; }
            }
            if (!met) { continue; }
            for (const a of adds) {
                const key = String(a).trim().toLowerCase();
                // A rule that requires the very tag it adds is a no-op, not a
                // redundancy — `femboy; femboy, girly` is reinforcement.
                if (reqs.some(r => String(r).trim().toLowerCase() === key)) { continue; }
                if (present.has(key) && !produced.has(key)) {
                    produced.set(key, reqs.join(", "));
                }
            }
        }
        return [...produced.entries()].map(([tag, why]) => ({ tag: present.get(tag), why }));
    }

    const targets = [];
    for (const e of characters) {
        const code = String(e.codename || "").toLowerCase();
        if (!includeImport && !handWritten.has(code)) { continue; }
        targets.push({ code, tags: tagsOf(e) });
    }
    for (const o of outfits) {
        const code = String(o.codename || "").toLowerCase();
        const base = code.split("*")[0];
        if (!includeImport && !handWritten.has(base)) { continue; }
        targets.push({ code, tags: tagsOf(o) });
    }

    let totalTags = 0, hits = 0, entriesHit = 0;
    const rows = [];
    for (const t of targets) {
        totalTags += t.tags.length;
        const found = redundantIn(t.tags);
        if (!found.length) { continue; }
        entriesHit++;
        hits += found.length;
        rows.push({ code: t.code, found });
    }

    console.log(`  ${targets.length} entries and outfits checked, ${totalTags} tags`);
    console.log(`  ${hits} redundant tags across ${entriesHit} of them` +
                (includeImport ? "  (charactersDB2 included)" : "  (charactersDB only — --all adds the import)") + "\n");

    // RECIPROCAL rules are the trap in acting on this report. `wide hips` implies
    // `thick thighs` AND the reverse, so each reads as redundant and deleting
    // BOTH leaves the character with neither. Marked so a bulk edit cannot walk
    // into it — exactly one of a reciprocal pair may go.
    const impliesMap = new Map();
    for (const entry of defaults) {
        const reqs = (entry.requirements || []).map(r => String(r).trim().toLowerCase());
        if (reqs.length !== 1) { continue; }
        for (const a of (entry.additions || [])) {
            const k = reqs[0];
            if (!impliesMap.has(k)) { impliesMap.set(k, new Set()); }
            impliesMap.get(k).add(String(a).trim().toLowerCase());
        }
    }
    const isReciprocal = (why, tag) => {
        const a = String(why).trim().toLowerCase(), b = String(tag).trim().toLowerCase();
        return impliesMap.has(a) && impliesMap.get(a).has(b) &&
               impliesMap.has(b) && impliesMap.get(b).has(a);
    };

    let reciprocalCount = 0;
    for (const r of rows) {
        for (const f of r.found) {
            f.reciprocal = isReciprocal(f.why, f.tag);
            if (f.reciprocal) { reciprocalCount++; }
        }
    }

    for (const r of listOrCap(rows, 60)) {
        if (typeof r === "string") { console.log("  " + r); continue; }
        console.log(`  ── ${r.code}`);
        for (const f of r.found) {
            console.log(`     ${f.tag.padEnd(28)} ${f.reciprocal ? "⇄" : " "} already implied by  ${f.why}`);
        }
    }

    if (reciprocalCount) {
        console.log(`\n  ⇄ marks a RECIPROCAL pair — ${reciprocalCount} of the ${hits}.`);
        console.log("  Each implies the other, so both read as redundant and BOTH ARE NOT.");
        console.log("  Remove one or the other, never the pair.");
    }

    // Which implications cause the most redundancy overall — one line to fix in
    // an entry is worth less than knowing which rule to write entries against.
    const byRule = new Map();
    for (const r of rows) {
        for (const f of r.found) {
            const k = (f.reciprocal ? "⇄ " : "  ") + f.why + "  ->  " + f.tag;
            byRule.set(k, (byRule.get(k) || 0) + 1);
        }
    }
    const top = [...byRule.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
    if (top.length) {
        console.log("\n  MOST COMMON, so the most worth knowing while writing entries:\n");
        for (const [k, n] of top) { console.log(`    ${String(n).padStart(4)}x  ${k}`); }
    }
    console.log("");
}

// ===========================================================================
//  FIXES — dry run by default, `--apply` writes
// ===========================================================================
//  Every write goes through one function and one backup. charactersDB.js is a
//  template literal, so edits are LINE-BASED against the raw text: find the
//  `.codename;` line, rewrite its tag list, leave everything else byte-identical.
//  Nothing here reflows, reorders or reformats, and no line but the matched one
//  is touched.

const dbPath = path.join(lib, "charactersDB.js");

// Same as rewriteEntries but reaches OUTFIT lines too. An outfit is written
// `*name; tags` under whichever `.codename;` it follows, so the file has to be
// walked in order to know which character each belongs to — the key is
// `.codename*name`, matching how cleanedOutfitArray names them.
function rewriteEntriesAndOutfits(edits, label) {
    const raw = fs.readFileSync(dbPath, "utf8");
    const eol = raw.indexOf("\r\n") !== -1 ? "\r\n" : "\n";
    const lines = raw.split(/\r?\n/);
    let touched = 0;
    let current = null;
    for (let i = 0; i < lines.length; i++) {
        const charMatch = lines[i].match(/^(\.[A-Za-z0-9_-]+);[ \t]*(.*)$/);
        if (charMatch) {
            current = charMatch[1].toLowerCase();
            if (edits.has(current)) {
                lines[i] = charMatch[1] + "; " + edits.get(current).join(", ");
                touched++;
            }
            continue;
        }
        const outfitMatch = lines[i].match(/^(\*[A-Za-z0-9_-]+);[ \t]*(.*)$/);
        if (outfitMatch && current) {
            const key = current + outfitMatch[1].toLowerCase();
            if (edits.has(key)) {
                lines[i] = outfitMatch[1] + "; " + edits.get(key).join(", ");
                touched++;
            }
        }
    }
    if (touched !== edits.size) {
        console.log("\n  WARNING: " + edits.size + " to change but " + touched + " lines matched.");
        console.log("    Nothing written.");
        return false;
    }
    if (!apply) {
        console.log("\n  DRY RUN — " + touched + " lines would change. Re-run with --apply to write.");
        return false;
    }
    const backupDir = path.join(here, "_backups");
    if (!fs.existsSync(backupDir)) { fs.mkdirSync(backupDir, { recursive: true }); }
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backup = path.join(backupDir, "charactersDB." + stamp + "." + label + ".js");
    fs.writeFileSync(backup, raw, "utf8");
    fs.writeFileSync(dbPath, lines.join(eol), "utf8");
    console.log("\n  WROTE " + touched + " lines.");
    console.log("  Backup: scripts/webui/_backups/" + path.basename(backup));
    return true;
}

function rewriteEntries(edits, label) {
    const raw = fs.readFileSync(dbPath, "utf8");
    // charactersDB.js is CRLF. `.` does NOT match `\r` in JavaScript — it is a
    // line terminator — so a `(.*)$` pattern silently matches NOTHING here. The
    // carriage return is split off, matched against, and put back, so the file
    // keeps the line endings it came with.
    const eol = raw.indexOf("\r\n") !== -1 ? "\r\n" : "\n";
    const lines = raw.split(/\r?\n/);
    let touched = 0;
    for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(/^(\.[A-Za-z0-9_-]+);[ \t]*(.*)$/);
        if (!m) { continue; }
        const code = m[1].toLowerCase();
        if (!edits.has(code)) { continue; }
        lines[i] = m[1] + "; " + edits.get(code).join(", ");
        touched++;
    }
    if (touched !== edits.size) {
        console.log("\n  WARNING: " + edits.size + " entries to change but " + touched + " lines matched.");
        console.log("    Nothing written. An entry may span lines or be formatted unusually.");
        return false;
    }
    if (!apply) {
        console.log("\n  DRY RUN — " + touched + " entries would change. Re-run with --apply to write.");
        return false;
    }
    const backupDir = path.join(here, "_backups");
    if (!fs.existsSync(backupDir)) { fs.mkdirSync(backupDir, { recursive: true }); }
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backup = path.join(backupDir, "charactersDB." + stamp + "." + label + ".js");
    fs.writeFileSync(backup, raw, "utf8");
    fs.writeFileSync(dbPath, lines.join(eol), "utf8");
    console.log("\n  WROTE " + touched + " entries.");
    console.log("  Backup: scripts/webui/_backups/" + path.basename(backup));
    return true;
}

// ---------------------------------------------------------------------------
//  --fix-duplicates
// ---------------------------------------------------------------------------
//  The same tag written twice in one entry. Removing the second changes nothing
//  the engine does — dedupe already handled it — so this is the one fix with no
//  judgement in it at all. The first occurrence keeps its position.

if (fixDupes) {
    heading("FIX", "duplicate tags", "the same tag twice in one line. Zero behaviour change.");
    const edits = new Map();
    let charHits = 0, outfitHits = 0;
    // OUTFITS TOO. The first version of this walked `characters` only, so eleven
    // outfit lines with a doubled `bottomless` or `areola slip` went unreported
    // by section 1 and untouched by the fix. An outfit line is a tag list like
    // any other.
    for (const source of [characters, outfits]) {
        for (const e of source) {
            const code = String(e.codename || "").toLowerCase();
            if (!handWritten.has(code.split("*")[0])) { continue; }
            const tags = tagsOf(e);
            const seen = new Set();
            const kept = [], dropped = [];
            for (const t of tags) {
                const k = t.toLowerCase();
                if (seen.has(k)) { dropped.push(t); continue; }
                seen.add(k);
                kept.push(t);
            }
            if (dropped.length) {
                edits.set(code, kept);
                if (code.indexOf("*") === -1) { charHits++; } else { outfitHits++; }
                console.log("  " + code.padEnd(26) + " drop " + dropped.join(", "));
            }
        }
    }
    console.log("\n  " + edits.size + " lines carry a duplicate — " +
                charHits + " entries, " + outfitHits + " outfits.");
    if (edits.size) { rewriteEntriesAndOutfits(edits, "dupes"); }
}

// ---------------------------------------------------------------------------
//  --fix-furry
// ---------------------------------------------------------------------------
//  `furry female` -> `female`, so Phase 4 derives the right tag per figure the
//  same way it does for `1girl`. That derivation is real and works — but it keys
//  off `v2FurryMarkers`, and `furry female` is ITSELF one of those markers.
//
//  So swapping it out of an entry carrying no OTHER marker silently turns her
//  human. `anthro` is added first for exactly those entries, and the swap only
//  happens on an entry provably still furry afterwards.

if (fixFurry) {
    heading("FIX", "furry male/female -> male/female",
            "adds anthro first where it is the only thing holding the furry reading up.");
    const OTHER = ["anthro", "furry", "feral", "kemono"];
    const edits = new Map();
    let needAnthro = 0, plainSwap = 0;
    for (const e of characters) {
        const code = String(e.codename || "").toLowerCase();
        if (!handWritten.has(code)) { continue; }
        const tags = tagsOf(e);
        const lower = tags.map(t => t.toLowerCase());
        const hasFF = lower.indexOf("furry female") !== -1;
        const hasFM = lower.indexOf("furry male") !== -1;
        if (!hasFF && !hasFM) { continue; }
        const hasOther = lower.some(t => OTHER.indexOf(t) !== -1);
        const out = [];
        for (const t of tags) {
            const k = t.toLowerCase();
            if (k === "furry female")    { out.push("female"); }
            else if (k === "furry male") { out.push("male"); }
            else { out.push(t); }
        }
        if (!hasOther) {
            // Straight after the identity tag, which is where a species marker
            // reads naturally and where the rest of the file already puts it.
            out.splice(1, 0, "anthro");
            needAnthro++;
            console.log("  " + code.padEnd(24) + " + anthro,  " +
                        (hasFF ? "furry female -> female" : "furry male -> male"));
        } else { plainSwap++; }
        edits.set(code, out);
    }
    console.log("\n  " + edits.size + " entries state furry male/female.");
    console.log("    " + plainSwap + " already carry anthro/furry/feral/kemono — straight swap.");
    console.log("    " + needAnthro + " carry NO other marker — anthro added, or they turn human.");
    if (edits.size) { rewriteEntries(edits, "furry"); }
}

// ---------------------------------------------------------------------------
//  --fix-redundant
// ---------------------------------------------------------------------------
//  The one that needs proof rather than a rule. A tag is removed ONLY when
//  compiling the entry without it produces a BYTE-IDENTICAL prompt — measured,
//  not reasoned.
//
//  That handles reciprocal pairs correctly for free: removals are applied ONE AT
//  A TIME against a re-measured baseline, so `wide hips` may go and then
//  `thick thighs` fails its own check, because nothing implies it any more.
//
//  PROTECTED tags are never removed however redundant they look. The stored
//  prompt is not only an instruction to the engine — `random(female)` FILTERS on
//  this text, so a tag that changes nothing in the output can still change which
//  characters a wildcard is able to return.

const PROTECTED = new Set([
    "female", "male", "furry female", "furry male", "1girl", "1boy",
    "anthro", "furry", "feral", "kemono", "human", "not furry",
    "futanari", "femboy", "cute boy", "cute girl"
]);

if (fixRedundant) {
    heading("FIX", "redundant tags",
            "removed only when the compiled prompt is byte-identical without them.");
    const compile = text => sandbox.buildPrompt(text, "", {}).prompt;
    const edits = new Map();
    let removed = 0, refused = 0, protectedHits = 0, untestable = 0;
    const refusals = [];

    for (const e of characters) {
        const code = String(e.codename || "").toLowerCase();
        if (!handWritten.has(code)) { continue; }
        let tags = tagsOf(e);
        if (tags.length < 3) { continue; }

        // THE IDENTITY TAG MUST NOT BE IN THE TEST PROMPT.
        //
        // `sy-shop` on its own re-expands her whole charactersDB entry, so
        // compiling her tag list and her tag list MINUS ONE gives the same
        // string every time — the expansion puts the missing tag straight back.
        // A first version of this compared exactly that and reported 2112 tags
        // as "provably removable", including `light blue hair` and `cat tail`.
        // It was measuring the expansion, not the redundancy.
        //
        // So the candidate set is tested WITHOUT her name, which is also the
        // right question: does the REST of her description already imply this?
        const identity = tags[0];
        let body = tags.slice(1);
        if (!body.length) { continue; }

        // Even without the identity tag another tag may resolve to a character
        // and expand — `firstStoredTag` accepts an uncategorised leading tag.
        // An entry where that happens cannot be measured this way, so it is
        // skipped rather than guessed at.
        const expanded = job => (job.records || []).some(
            r => String(r.source || "").indexOf("charactersDB") !== -1);
        let baseJob;
        try { baseJob = sandbox.buildPrompt(body.join(", "), "", {}); } catch (err) { continue; }
        if (expanded(baseJob)) { untestable++; continue; }
        let baseline = baseJob.prompt;
        const dropped = [];

        for (let i = body.length - 1; i >= 0; i--) {
            const candidate = body[i];
            if (PROTECTED.has(candidate.toLowerCase())) { protectedHits++; continue; }
            const trial = body.slice(0, i).concat(body.slice(i + 1));
            if (!trial.length) { continue; }
            let outJob;
            try { outJob = sandbox.buildPrompt(trial.join(", "), "", {}); } catch (err) { continue; }
            if (expanded(outJob)) { continue; }
            if (outJob.prompt === baseline) {
                body = trial;
                dropped.push(candidate);
                removed++;
            } else {
                refused++;
                if (refusals.length < 12) { refusals.push(code + ": " + candidate); }
            }
        }
        if (dropped.length) {
            edits.set(code, [identity].concat(body));
            console.log("  " + code.padEnd(24) + " drop " + dropped.reverse().join(", "));
        }
    }

    console.log("\n  " + removed + " tags removable across " + edits.size + " entries — each PROVEN by compile.");
    console.log("  " + protectedHits + " candidates skipped as PROTECTED (identity, gender, species).");
    console.log("  " + refused + " looked redundant but changed the output, so were kept.");
    console.log("  " + untestable + " entries skipped — a tag in them expands a character, so no clean measurement.");
    if (refusals.length) {
        console.log("\n  A few that were kept, as a sanity check on the method:");
        for (const r of refusals) { console.log("    " + r); }
    }
    console.log("\n  NOT covered: whether anything FILTERS on a removed tag. random(...) reads the");
    console.log("  stored text, so an output-identical removal can still change which characters");
    console.log("  a wildcard returns. PROTECTED covers the obvious ones only.");
    if (edits.size) { rewriteEntries(edits, "redundant"); }
}

// ---------------------------------------------------------------------------
//  --fix-rules
// ---------------------------------------------------------------------------
//  Applies `characterRules` at the top of this file. Unlike --fix-redundant this
//  makes NO claim to have proven anything — it does exactly what the list says,
//  which is the point. The list is the judgement; this is the machinery.

function splitTags(text) {
    return String(text).split(",").map(t => t.trim()).filter(Boolean);
}

function parseCharacterRules(text) {
    const rules = [];
    const malformed = [];
    const lines = String(text).split(/\r?\n/);
    for (let n = 0; n < lines.length; n++) {
        const line = lines[n].trim();
        // Blank, `-/ section`, or `- disabled`. One rule, same as the dictionaries.
        if (!line || line.charAt(0) === "-") { continue; }
        const semi = line.indexOf(";");
        if (semi === -1) {
            malformed.push({ line: n + 1, text: line, why: "no `;` — nothing says where the target ends" });
            continue;
        }
        const head = line.slice(0, semi).trim();
        const tail = line.slice(semi + 1).trim();
        const colon = head.indexOf(":");
        if (colon !== -1) {
            const require = head.slice(0, colon).trim();
            const targets = splitTags(head.slice(colon + 1));
            if (!require || !targets.length) {
                malformed.push({ line: n + 1, text: line, why: "requirement or target is empty" });
                continue;
            }
            rules.push({ kind: tail ? "conditional-rename" : "remove", require, targets, replacement: tail });
        } else {
            const targets = splitTags(head);
            if (!targets.length || !tail) {
                malformed.push({ line: n + 1, text: line, why: "a rename needs both sides" });
                continue;
            }
            rules.push({ kind: "alias", targets, replacement: tail });
        }
    }
    return { rules, malformed };
}

if (fixRules) {
    heading("FIX", "apply characterRules", "the curated list at the top of this file.");
    const { rules, malformed } = parseCharacterRules(characterRules);
    const aliases  = rules.filter(r => r.kind === "alias");
    const removals = rules.filter(r => r.kind !== "alias");

    console.log("  " + aliases.length + " renames, " + removals.length + " conditional removals.");
    if (malformed.length) {
        console.log("\n  MALFORMED — skipped, nothing guessed at:\n");
        for (const m of malformed) { console.log("    line " + m.line + ": " + m.text + "\n      " + m.why); }
        console.log("");
    }

    const edits = new Map();
    const tally = new Map();
    const bump = k => tally.set(k, (tally.get(k) || 0) + 1);

    function applyTo(tags) {
        // Aliases first, so a rename can satisfy a removal's requirement.
        let out = tags.map(t => {
            for (const r of aliases) {
                if (r.targets.some(x => x.toLowerCase() === t.toLowerCase())) {
                    bump(t.toLowerCase() + " -> " + r.replacement);
                    return r.replacement;
                }
            }
            return t;
        });
        // A rename can produce a duplicate of a tag already there.
        const seen = new Set();
        out = out.filter(t => {
            const k = t.toLowerCase();
            if (seen.has(k)) { bump("(deduped after rename) " + k); return false; }
            seen.add(k);
            return true;
        });
        // Then removals, judged against the post-rename tag set.
        for (const r of removals) {
            const lower = out.map(t => t.toLowerCase());
            if (lower.indexOf(r.require.toLowerCase()) === -1) { continue; }
            for (const target of r.targets) {
                const at = out.map(t => t.toLowerCase()).indexOf(target.toLowerCase());
                if (at === -1) { continue; }
                // Never let a rule eat the tag that triggered it.
                if (target.toLowerCase() === r.require.toLowerCase()) { continue; }
                if (r.kind === "conditional-rename") { out[at] = r.replacement; }
                else { out.splice(at, 1); }
                bump(r.require + ": " + target);
            }
        }
        return out;
    }

    let changed = 0;
    for (const source of [characters, outfits]) {
        for (const e of source) {
            const code = String(e.codename || "").toLowerCase();
            const base = code.split("*")[0];
            if (!handWritten.has(base)) { continue; }
            const before = tagsOf(e);
            if (!before.length) { continue; }
            const after = applyTo(before);
            if (after.join(", ") === before.join(", ")) { continue; }
            edits.set(code, after);
            changed++;
            if (changed <= 25 || full) {
                const gone = before.filter(t => after.indexOf(t) === -1);
                console.log("  " + code.padEnd(26) + gone.join(", "));
            }
        }
    }
    if (changed > 25 && !full) { console.log("  …and " + (changed - 25) + " more (--full to see them)"); }

    console.log("\n  " + changed + " entries and outfits would change.\n");
    const ranked = [...tally.entries()].sort((a, b) => b[1] - a[1]);
    console.log("  WHAT EACH RULE ACTUALLY DID:\n");
    for (const [k, n] of ranked) { console.log("    " + String(n).padStart(4) + "x  " + k); }
    const fired = new Set(ranked.map(([k]) => k.split(":")[0].split(" ->")[0]));
    const idle = rules.filter(r =>
        !ranked.some(([k]) => k.indexOf(r.kind === "alias" ? r.targets[0] : r.require) === 0));
    if (idle.length) {
        console.log("\n  RULES THAT MATCHED NOTHING.");
        console.log("  NOT an error by itself — a rule whose job is to catch a mistake you have");
        console.log("  not made yet SHOULD match nothing. Glance for typos, otherwise ignore.\n");
        for (const r of idle) {
            console.log("    " + (r.kind === "alias" ? r.targets.join(", ") + "; " + r.replacement
                                                    : r.require + ": " + r.targets.join(", ") + ";"));
        }
    }
    if (edits.size) { rewriteEntriesAndOutfits(edits, "rules"); }
}
