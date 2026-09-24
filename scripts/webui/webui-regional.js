// ============================================================================
//  REGIONAL PROMPTER — output-stage adapter
// ============================================================================
//  Kept in its own file so it can be deleted in one step.
//
//  Nothing upstream knows this exists. v2's renderer already emits the exact
//  shape the extension wants — one common line, then one line per subject,
//  joined with ",\n" (promptRender, webui2.js) — so the entire adapter is a
//  string rewrite applied after the prompt is otherwise final, plus an
//  alwayson_scripts block bolted onto the request.
//
//  The extension is armed PER REQUEST by args[0]. It is never toggled in the
//  Forge UI, and a prompt that does not ask for regions generates exactly as it
//  did before in the same session.
//
//  Layout language and the mapping onto the extension: !designDocs/webui_engine/REGIONAL-PROMPTING.md

var regionalSettings = {
    enabled:    true,        // master switch; false makes every trigger inert
    mode:       "Matrix",
    calcmode:   "Attention", // Latent re-runs diffusion per region and costs
                             // roughly in proportion to the region count
    useCommon:  true,
    baseRatio:  "0.2",       // what `rpx` blends: 0.2 = 20% base + 80% region
    debug:      false,
    threshold:  "0.4",       // RP's own default. Prompt mode only, unused in Matrix

    // RP's "Options" checkbox group, BY EXACT LABEL. Empty means the untouched
    // UI. Read off /sdapi/v1/script-info on 2026-09-07, so these strings are the
    // installed extension's and not a guess:
    //
    //   "disable convert 'AND' to 'BREAK'"   "Use LoHa or other"
    //   "Use BREAK to change chunks"         "Flip prompts"
    //   "Comment Out `#`"                    "Enabled only in Hires Fix"
    //   "Disabled in Hires Fix"              "debug"      "debug2"
    //
    // `Use BREAK to change chunks` is the one worth trying first on a bleeding
    // layout: every region here is longer than a 75-token chunk once the common
    // block is prepended, and that option is the only setting that names the
    // BREAK/chunk interaction at all.
    options:    [],

    // Corner inset size, as a fraction of the image's width and height. Picked
    // at random from this range per generation, which is what was asked for —
    // the chosen value is recoverable afterwards because RP writes the ratios
    // into the footer.
    cutMin:     0.125,
    cutMax:     0.25,

    // Moved into the base section by `rpx`, and left in the common block
    // otherwise. Deliberately short: a tag only belongs here if it states HOW
    // MANY figures are in the shot, since that is the claim a region should not
    // be repeating. `duo` earns its place in common when the fix is off — it is
    // what makes two figures look at each other.
    countTags: ["2girls", "3girls", "4girls", "5girls", "6girls",
                "2boys", "3boys", "4boys",
                "multiple girls", "multiple boys", "duo", "trio", "quartet",
                "group", "crowd"]
};

// ---------------------------------------------------------------------------
//  Layout language
// ---------------------------------------------------------------------------
//  `-` is "beside", `/` is "above", parentheses nest one level.
//
//      layout := seq
//      seq    := term (('-' | '/') term)*     one separator per level
//      term   := number | [number] '(' seq ')'
//
//  Mixing separators at one level is an ERROR, not a precedence rule. `1-1/1`
//  has two readings and picking one silently produces a plausible wrong image.

function parseLayout(text) {
    var src = String(text == null ? "" : text).replace(/\s+/g, "");
    if (src === "") { return { error: "empty layout" }; }

    var pos = 0;

    function parseSeq(depth) {
        var terms = [parseTerm(depth)];
        var axis = null;
        while (pos < src.length && (src[pos] === "-" || src[pos] === "/")) {
            var sep = src[pos] === "-" ? "cols" : "rows";
            if (axis === null) { axis = sep; }
            else if (axis !== sep) {
                throw new Error("mixed '-' and '/' at the same level — parenthesise one of them");
            }
            pos++;
            terms.push(parseTerm(depth));
        }
        if (axis === null) { return terms[0]; }   // a bare number, or one group
        return { axis: axis, terms: terms };
    }

    // A group may carry its own weight in front of it — `2(1-1)/1` is a
    // double-height row of two above a single. Without one it counts as ONE
    // unit, which is what makes `(1-1-1-1)/1` two equal halves rather than a
    // strip along the bottom. Summing the contents instead would mean adding a
    // character to the top row silently squashed the one below it.
    function parseTerm(depth) {
        var start = pos;
        while (pos < src.length && /[0-9.]/.test(src[pos])) { pos++; }
        var stated = pos > start ? parseFloat(src.slice(start, pos)) : null;

        if (src[pos] === "(") {
            if (depth >= 1) {
                throw new Error("nested deeper than two levels — the extension cannot divide that");
            }
            pos++;
            var inner = parseSeq(depth + 1);
            if (src[pos] !== ")") { throw new Error("unclosed ( in layout"); }
            pos++;
            if (stated != null && !(stated > 0)) { throw new Error("weights must be greater than zero"); }
            inner.weight = stated == null ? 1 : stated;
            return inner;
        }

        if (stated == null) { throw new Error("expected a number at position " + pos); }
        if (!(stated > 0)) { throw new Error("weights must be greater than zero"); }
        return { weight: stated };
    }

    var tree;
    try {
        tree = parseSeq(0);
        if (pos !== src.length) { throw new Error("unexpected '" + src[pos] + "' in layout"); }
    } catch (err) {
        return { error: err.message };
    }
    if (tree.terms == null) { return { error: "a layout needs at least two regions" }; }
    return { tree: tree };
}

// A group is ONE OUTER SLICE: its own size first, then the splits inside it. The
// raggedness is the point — it is what lets a row of four sit above a row of one.
function layoutToRatios(tree) {
    var outer = tree.axis;
    var groups = [];
    var regions = 0;
    var twoDimensional = false;

    for (var i = 0; i < tree.terms.length; i++) {
        var term = tree.terms[i];
        if (term.terms == null) {
            groups.push([term.weight, term.weight]);   // an undivided slice: one cell
            regions += 1;
            continue;
        }
        if (term.axis === outer) {
            return { error: "a nested group must divide the other way than its parent" };
        }
        twoDimensional = true;
        var inner = [term.weight];
        for (var j = 0; j < term.terms.length; j++) {
            if (term.terms[j].terms != null) {
                return { error: "nested deeper than two levels — the extension cannot divide that" };
            }
            inner.push(term.terms[j].weight);
        }
        groups.push(inner);
        regions += term.terms.length;
    }

    // 1D collapses to a plain comma list, which is the documented simple form and
    // avoids handing the extension a 2D string with degenerate groups.
    if (!twoDimensional) {
        return {
            ratios:  groups.map(function (g) { return trimNumber(g[0]); }).join(","),
            submode: outer === "cols" ? "Columns" : "Rows",
            flip:    false,
            regions: regions
        };
    }

    // SAME FORMULA AS THE 1D BRANCH ABOVE, and that is the point of this change.
    //
    // This used to send `Columns` for every 2D layout and express an outer `-`
    // with `flip`, on the strength of the README's prose claiming that the
    // extension's "Columns" means "split into rows FIRST". The live API disagrees:
    // argument 4 is labelled **"Main Splitting"**, choices `Columns / Rows /
    // Random` — it names the direction of the OUTER split, exactly as the 1D
    // branch has always assumed.
    //
    // So the file held two readings of one argument, and it was the 2D pair that
    // was inverted: `(1-1)/1` is "two beside each other, one below", and sending
    // `Columns` for it asks for "two stacked on the left, one on the right".
    //
    // The ratio string does not change — a `;` group is still `[outerSize,
    // ...inner]` and that half was confirmed against the README's worked example.
    // Only which way the outer division runs was wrong, and `flip` is no longer
    // needed to express anything, which retires the one row of that table nobody
    // had ever verified.
    return {
        ratios:  groups.map(function (g) { return g.map(trimNumber).join(","); }).join(";"),
        submode: outer === "cols" ? "Columns" : "Rows",
        flip:    false,
        regions: regions
    };
}

function trimNumber(value) {
    return String(Math.round(value * 1000) / 1000);
}

// ---------------------------------------------------------------------------
//  Cutaways
// ---------------------------------------------------------------------------
//  An inset in one corner, showing an alternate view. The extension has no
//  concept of one, and it is NOT a grid cell: a box in the corner leaves the
//  main image an L-shape, which no two-level ratio can describe as a single
//  region.
//
//  So it is built as three cells and the main subject is simply SENT TWICE —
//  once for the strip beside the inset, once for the full-width remainder.
//  Duplicating a region's text costs nothing and the seam is invisible because
//  both cells carry identical conditioning.
//
//      top-right, one main subject          top-right, two main subjects
//      ┌────────────┬────┐                  ┌──────┬─────┬────┐
//      │   main     │ cut│                  │ main1│main2│ cut│
//      ├────────────┴────┤                  ├──────┴┬────┴────┤
//      │      main       │                  │ main1 │  main2  │
//      └─────────────────┘                  └───────┴─────────┘
//
//  The inset eats its width out of the column it sits against, so the other
//  main columns keep their boundaries between the two rows.
//
//  THE CUTAWAY IS THE LAST SUBJECT in the prompt. Everything before it lays out
//  in the main area as usual.

var regionalCorners = { tl: "top-left", tr: "top-right", bl: "bottom-left", br: "bottom-right" };

function cutawayLayout(weights, corner, fraction) {
    var total = 0;
    for (var i = 0; i < weights.length; i++) { total += weights[i]; }

    var inset = fraction * total;
    var edge = corner.charAt(1) === "r" ? weights.length - 1 : 0;

    // The inset cannot eat its whole neighbour. With one main subject at a
    // quarter this never binds; with four narrow columns it does, and silently
    // producing a zero-width cell would make the extension divide somewhere
    // unrelated.
    if (inset > weights[edge] * 0.75) {
        inset = weights[edge] * 0.75;
        fraction = inset / total;
    }

    var narrow = weights.slice();
    narrow[edge] = weights[edge] - inset;

    var mains = [];
    for (var m = 1; m <= weights.length; m++) { mains.push(m); }
    var cutLine = weights.length + 1;

    var insetCols, insetPlan;
    if (corner.charAt(1) === "r") {
        insetCols = narrow.concat([inset]);
        insetPlan = mains.concat([cutLine]);
    } else {
        insetCols = [inset].concat(narrow);
        insetPlan = [cutLine].concat(mains);
    }

    var insetGroup = [fraction].concat(insetCols);
    var mainGroup  = [1 - fraction].concat(weights);

    var groups, plan;
    if (corner.charAt(0) === "t") {
        groups = [insetGroup, mainGroup];
        plan   = insetPlan.concat(mains);
    } else {
        groups = [mainGroup, insetGroup];
        plan   = mains.concat(insetPlan);
    }

    return {
        ratios:   groups.map(function (g) { return g.map(trimNumber).join(","); }).join(";"),
        submode:  "Columns",
        flip:     false,
        plan:     plan,
        subjects: weights.length + 1,
        corner:   corner,
        fraction: fraction
    };
}

// ---------------------------------------------------------------------------
//  Resolution
// ---------------------------------------------------------------------------
//  Deferred until the subject count is known, because `rp` on its own means
//  "one region per subject" and that cannot be answered at trigger time.
//
//  `plan` is the running order of subject lines, 1-based. Without a cutaway it
//  is just 1..n; with one it repeats the main subjects across two rows.

function resolveLayout(tree, cut, subjectCount) {
    if (cut) {
        var mains = subjectCount - 1;
        if (mains < 1) {
            return { error: "a cutaway needs a subject to cut away FROM — add one before it" };
        }

        var weights = [];
        if (tree == null) {
            for (var i = 0; i < mains; i++) { weights.push(1); }
        } else {
            if (tree.axis !== "cols") {
                return { error: "a cutaway needs a side-by-side main layout — use '-', not '/'" };
            }
            for (var t = 0; t < tree.terms.length; t++) {
                if (tree.terms[t].terms != null) {
                    return { error: "a cutaway cannot be combined with a nested layout" };
                }
                weights.push(tree.terms[t].weight);
            }
            if (weights.length !== mains) {
                return { error: "the layout has " + weights.length + " main region(s) but the prompt has " +
                                mains + " subject(s) before the cutaway" };
            }
        }

        var corner = cut.corner || pickCorner();
        var fraction = cut.fraction != null ? cut.fraction : pickFraction();
        return cutawayLayout(weights, corner, fraction);
    }

    if (tree == null) {
        var flat = [];
        for (var a = 1; a <= subjectCount; a++) { flat.push(a); }
        return {
            ratios:   new Array(subjectCount).join("1,") + "1",
            submode:  "Columns",
            flip:     false,
            plan:     flat,
            subjects: subjectCount
        };
    }

    var mapped = layoutToRatios(tree);
    if (mapped.error) { return mapped; }
    var order = [];
    for (var b = 1; b <= mapped.regions; b++) { order.push(b); }
    mapped.plan = order;
    mapped.subjects = mapped.regions;
    return mapped;
}

function pickCorner() {
    var keys = ["tl", "tr", "bl", "br"];
    return keys[Math.floor(Math.random() * keys.length)];
}

function pickFraction() {
    var lo = regionalSettings.cutMin, hi = regionalSettings.cutMax;
    return lo + Math.random() * (hi - lo);
}

// ---------------------------------------------------------------------------
//  Triggers
// ---------------------------------------------------------------------------
//  Read off the RAW input and stripped before the engine sees a single tag, so
//  they never become records and never reach a dictionary. This is also what
//  lets a layout carry `(` and `/`: the gelbooru cleanup runs later and never
//  sees them. Moving this extraction downstream breaks the language.
//
//  A SPACE separates the word from its argument — one keypress on a phone. `=`
//  and `:` are accepted too, and no separator at all works (`rp1-1`), but the
//  space is the intended form.
//
//      rp                 equal regions, one per subject
//      rp 1-1             two beside each other
//      rp (1-1-1-1)/2     four across the top, one below at double height
//      rpx                the same as `rp`, plus the count-tag fix
//      rpx 3-1            so the fix rides along with any layout
//      rpcut              the last subject becomes a corner inset, random corner
//      rpcut tr           ...in a named corner: tl, tr, bl, br
//      rpcut tr 0.2       ...at a stated size, as a fraction of the image
//
//  `rpcut` arms the extension by itself — it does not need `rp` beside it. It
//  still accepts one: `rp 2-1, rpcut tl` lays the mains out and then insets.
//
//  `rp` is matched only when not followed by a letter, so `rpg maker` is left
//  alone. An argument that is present but unreadable is an ERROR rather than a
//  silent fallback to equal regions — see extractRegionalTrigger.

function extractRegionalTrigger(prompt) {
    var result = { prompt: prompt, active: false, tree: null, cut: null,
                   useBase: false, baseRatio: regionalSettings.baseRatio,
                   // null means "whatever regionalSettings says". Only a word
                   // typed in the prompt overrides it, and only for that job.
                   calcmode: null, error: null };
    if (!regionalSettings.enabled) { return result; }
    var text = String(prompt == null ? "" : prompt);

    // Cutaway first: `rpcut` would otherwise have to be excluded from the `rp`
    // pattern by hand.
    var cutPattern = /(^|,)\s*rpcut(?![a-z])\s*(?:[:=]\s*)?([^,]*?)\s*(?=,|$)/i;
    var cutMatch = text.match(cutPattern);
    if (cutMatch) {
        result.cut = { corner: null, fraction: null };
        text = text.replace(cutPattern, "$1");
        var cutArgs = cutMatch[2] ? cutMatch[2].split(/\s+/) : [];
        for (var c = 0; c < cutArgs.length; c++) {
            var arg = cutArgs[c].toLowerCase();
            if (regionalCorners[arg]) { result.cut.corner = arg; continue; }
            var size = parseFloat(arg);
            if (size > 0 && size < 1) { result.cut.fraction = size; continue; }
            result.prompt = tidyRegionalCommas(text);
            result.error = "rpcut \"" + cutArgs[c] + "\": expected a corner (tl, tr, bl, br) " +
                           "or a size between 0 and 1";
            return result;
        }
    }

    var pattern = /(^|,)\s*rp(x?)(?![a-z])\s*(?:[:=]\s*)?([^,]*?)\s*(?=,|$)/i;
    var match = text.match(pattern);
    if (!match) {
        // `rpcut` arms the extension on its own. A cutaway never coexists with an
        // ordinary multi-region shot, so requiring `rp` beside it was a word that
        // could only ever be typed and never varied.
        result.active = !!result.cut;
        result.prompt = tidyRegionalCommas(text);
        return result;
    }

    result.active = true;
    result.useBase = match[2] !== "";
    result.prompt = tidyRegionalCommas(text.replace(pattern, "$1"));

    // ---- CALC MODE, written beside the layout --------------------------
    // `rp 1/2 latent`, `rp latent`, `rpx1/2 attention`. Split off the same way
    // rpcut reads its corner and size, so the language gains a word rather than
    // a trigger — `rpl` and `rpxl` would have been two more things to remember.
    //
    // WHY IT IS WORTH TYPING: Attention is fast and BLENDS. It steers the
    // attention maps, so neighbouring regions bleed into each other, and it gets
    // worse the more regions there are and the less equal they are — which is
    // exactly the shape of "1/1 is a clean split, 1/2 goes muddy, 1/1/1 falls
    // apart". Latent runs the diffusion per region and separates hard, at
    // roughly the region count in time. Nothing else in this adapter changes
    // between the two, so it is a clean A/B on the same seed.
    var layoutText = match[3] || "";
    if (layoutText) {
        var words = layoutText.split(/\s+/).filter(Boolean);
        var kept = [];
        for (var w = 0; w < words.length; w++) {
            var lowered = words[w].toLowerCase();
            if (lowered === "latent")         { result.calcmode = "Latent";    continue; }
            if (lowered === "attention")      { result.calcmode = "Attention"; continue; }
            kept.push(words[w]);
        }
        layoutText = kept.join(" ");
    }

    if (layoutText) {
        var parsed = parseLayout(layoutText);
        if (parsed.error) {
            // Fatal, and deliberately so. A layout that failed to parse would
            // otherwise fall back to equal regions and produce a picture that
            // looks almost right, which is the hardest kind of wrong to notice.
            result.error = "layout \"" + layoutText + "\": " + parsed.error;
            return result;
        }
        result.tree = parsed.tree;
    }
    return result;
}

// A trigger leaves a hole where it was removed.
function tidyRegionalCommas(text) {
    return String(text == null ? "" : text)
        .replace(/\s*,\s*(?=,)/g, "")
        .replace(/^[\s,]+/, "")
        .replace(/[\s,]+$/, "")
        .replace(/\s*,\s*/g, ", ");
}

// ---------------------------------------------------------------------------
//  Conversion
// ---------------------------------------------------------------------------

// Tolerant of a trailing comma on each line or none, because the renderer's join
// puts one there and hand-written examples usually do not.
function splitRenderedRegions(rendered) {
    return String(rendered == null ? "" : rendered)
        .split(/\r?\n/)
        .map(function (line) { return line.replace(/^[\s,]+/, "").replace(/[\s,]+$/, ""); })
        .filter(function (line) { return line !== ""; });
}

// promptRender re-attaches job.lora with ", " at the very END of the joined
// string, which puts every LoRA reference inside the LAST subject's region. That
// is silently wrong — a LoRA is not an attribute of whoever happens to sort last
// — so they are lifted back out and reissued in the common block.
function liftLoraToCommon(lines, lora) {
    if (!lora || !lora.length || lines.length === 0) { return lines; }
    var last = lines.length - 1;
    var moved = [];
    for (var i = 0; i < lora.length; i++) {
        var needle = String(lora[i]);
        if (needle === "" || lines[last].indexOf(needle) === -1) { continue; }
        lines[last] = tidyRegionalCommas(lines[last].split(needle).join(""));
        moved.push(needle);
    }
    if (moved.length) {
        lines[0] = tidyRegionalCommas(lines[0] + ", " + moved.join(", "));
    }
    return lines;
}

// Pulls the count tags out of the common line and hands them back as a base
// section. The common block is concatenated onto every region, so `2girls` there
// tells each region to draw two people; a base section is BLENDED at baseRatio
// instead, which states the figure count once without repeating it per region.
function splitCountTags(commonLine) {
    var kept = [], moved = [];
    var parts = commonLine.split(", ");
    for (var i = 0; i < parts.length; i++) {
        var bare = parts[i].replace(/^\(+|\)+$/g, "").replace(/:[0-9.]+$/, "").toLowerCase().trim();
        if (regionalSettings.countTags.indexOf(bare) !== -1) { moved.push(parts[i]); }
        else { kept.push(parts[i]); }
    }
    return { common: kept.join(", "), base: moved.join(", ") };
}

// The layout in plain English, so it can be checked against the picture.
//
// This exists because `submode: Rows` is not a claim anybody can falsify by
// looking at an image, and the ONE thing most likely to be wrong about this
// adapter is which way round the axes come out — see REGIONAL-PROMPTING.md §7,
// where the 1D and 2D readings of `submode` currently disagree with each other.
// A log line that says "three bands, top to bottom" is wrong out loud.
function describeLayout(layout, subjectCount) {
    var cells = layout.plan.length;
    var shape;
    if (layout.corner) {
        shape = cells + " cells with a corner inset";
    } else if (layout.ratios.indexOf(";") !== -1) {
        shape = cells + " cells in a grid";
    } else if (layout.submode === "Rows") {
        shape = cells + " bands, TOP TO BOTTOM";
    } else {
        shape = cells + " columns, LEFT TO RIGHT";
    }
    // Unequal weights are the case where a rotation is easiest to see, so name
    // the proportions rather than making anyone divide the ratio string.
    var weights = layout.ratios.split(/[;,]/).map(Number).filter(function (n) { return n > 0; });
    var total = weights.reduce(function (a, b) { return a + b; }, 0);
    var share = (total > 0 && weights.length === cells)
        ? " (" + weights.map(function (w) { return Math.round(w / total * 100) + "%"; }).join(" / ") + ")"
        : "";
    return shape + share + ", one per subject (" + subjectCount + ")";
}

// Returns null when the prompt has nothing to divide, which is the signal to send
// an ordinary request. One line means one subject, and a lone region is a plain
// generation wearing a costume.
function buildRegionalRequest(rendered, commonExtra, v2Job, run) {
    var lines = splitRenderedRegions(rendered);

    // Line 0 is the common block — EXCEPT when there was nothing to put in it.
    // The renderer drops an empty common line, and from the flat string that is
    // indistinguishable from a prompt with one fewer figure, so this used to come
    // in a line short, fail the guard below, and generate with no regions and no
    // message. Reachable by typing `2girls, duo` into the negative box: Phase 7
    // culls them out of the prompt, and on a two-figure shot they were the whole
    // common block.
    //
    // `job.hasCommonLine` is set by promptRender, which is the only thing that
    // knows. The `lines.length > 2` fallback is for a caller with no job.
    var hasCommon = (v2Job && typeof v2Job.hasCommonLine === "boolean")
                        ? v2Job.hasCommonLine
                        : lines.length > 2;
    // An empty common block is still a common block: the style and the universal
    // quality tags are about to be put in it, and they belong to the image.
    if (!hasCommon && lines.length) { lines = [""].concat(lines); }

    if (lines.length < 3) { return null; }

    lines = liftLoraToCommon(lines, v2Job && v2Job.lora);

    // Style and the universal quality tags are properties of the IMAGE. Appended
    // after the last BREAK they would decorate one girl and leave the others
    // plain, so they join the common block instead.
    if (commonExtra) { lines[0] = tidyRegionalCommas(lines[0] + ", " + commonExtra); }

    // A word typed beside the layout wins for THIS job only; regionalSettings
    // is the standing default and is never written to.
    var calcmode = (run && run.calcmode) || regionalSettings.calcmode;

    var subjectCount = lines.length - 1;
    var layout = resolveLayout(run && run.tree, run && run.cut, subjectCount);
    if (layout.error) {
        console.error("Regional Prompter: " + layout.error + " Nothing sent.");
        return { abort: true };
    }

    // The count disagreeing is the failure that produces a plausible-looking
    // image with two subjects fused into one cell, so it is worth stopping for
    // rather than letting the extension reinterpret it.
    if (layout.subjects !== subjectCount) {
        console.error("Regional Prompter: the layout wants " + layout.subjects + " subject(s) but the prompt has " +
                      subjectCount + ". Nothing sent — fix one or the other.");
        return { abort: true };
    }

    var baseSection = "";
    if (run && run.useBase) {
        var split = splitCountTags(lines[0]);
        if (split.base === "") {
            // WARN, not info, and it names the usual cause. `rpx` works by moving
            // the count tags out of the common block, so if they are not there it
            // does nothing at all — and the commonest reason they are not there is
            // that they are in the NEGATIVE box, where they were culled out of the
            // prompt on the way past (Phase 7, cullByNegativeEntry).
            //
            // That combination is worth shouting about: a negative saying "not two
            // girls" is fighting a layout that is asking for a region each.
            console.warn("Regional Prompter: rpx found no count tags to move, so it did nothing. " +
                         "If a count tag (2girls, duo, 3girls…) is in your NEGATIVE box, it was " +
                         "culled out of the prompt before this ran — and it is also telling the " +
                         "model not to draw the figures the regions are for.");
        } else {
            lines[0] = split.common;
            baseSection = split.base;
        }
    }

    var ordered = layout.plan.map(function (index) { return lines[index]; });
    var sections = baseSection ? [lines[0], baseSection].concat(ordered) : [lines[0]].concat(ordered);

    // Say what the picture is SUPPOSED to look like, in words, before saying it
    // in the extension's vocabulary. `Rows` and `1,1,1` cannot be checked against
    // an image by anyone who has not read the extension's README, so a layout
    // that came out rotated was invisible — the log agreed with itself either
    // way. "three bands, top to bottom" is falsifiable at a glance.
    console.info("Regional Prompter: " + describeLayout(layout, subjectCount) +
                 (layout.corner ? ", cutaway " + regionalCorners[layout.corner] +
                                  " at " + Math.round(layout.fraction * 100) + "%" : "") +
                 (baseSection ? ", base blended at " + run.baseRatio : "") +
                 ", " + calcmode + " mode");
    console.info("  if the image does not look like that, the layout is being rotated — " +
                 "say so, it is a one-line fix. Extension args: ratios " + layout.ratios +
                 ", submode " + layout.submode + ", flip " + layout.flip);
    console.info("  common  | " + lines[0]);
    if (baseSection) { console.info("  base    | " + baseSection); }
    for (var p = 0; p < layout.plan.length; p++) {
        console.info("  cell" + (p + 1) + "   | " + lines[layout.plan[p]]);
    }

    return {
        prompt:  sections.join(" BREAK "),
        cells:   layout.plan.length,
        ratios:  layout.ratios,
        args:    regionalArgs(layout.ratios, layout.submode, layout.flip,
                              baseSection ? run.baseRatio : "0", !!baseSection, calcmode)
    };
}

// ---------------------------------------------------------------------------
//  The args array
// ---------------------------------------------------------------------------
//  POSITIONAL, and the order belongs to the installed version of the extension —
//  not to this file, and not to the README, whose argument table and worked
//  example disagree about the length.
//
//  **Verified against the live API on 2026-09-07**, after the extension was
//  updated: 20 arguments, every one aligned. The labels below are the
//  extension's own, copied from that response rather than guessed, which is how
//  three of them turned out to be the wrong TYPE — see 13, 16 and 17.
//
//  Re-check after every extension update. It is one call:
//      curl http://192.168.0.2:7000/sdapi/v1/script-info
//  Find `"name": "regional prompter"` with `is_img2img: false` and read its
//  `args` in order. Nothing else in this project encodes it.

function regionalArgs(ratios, submode, flip, baseRatio, useBase, calcmode) {
    return [
        true,                          //  1  Active
        regionalSettings.debug,        //  2  Debug
        regionalSettings.mode,         //  3  Mode
        submode,                       //  4  Submode
        "Mask",                        //  5  Mask mode      (unused in Matrix)
        "Prompt",                      //  6  Prompt mode    (unused in Matrix)
        ratios,                        //  7  Divide ratios
        baseRatio,                     //  8  Base ratios
        useBase,                       //  9  Use base
        regionalSettings.useCommon,    // 10  Use common prompt
        false,                         // 11  Use common negative prompt
        calcmode || regionalSettings.calcmode, // 12  Generation Mode (per-job, see the trigger)
        // 13  Options — a CheckboxGroup, so it wants a LIST OF LABELS. A bare
        //     `false` was being sent here, which is a type mismatch: RP reads
        //     this with `in`, and `"x" in False` is not a question Python can
        //     answer. It has been surviving, not working. `[false]` is the
        //     untouched UI state, verified 2026-09-07.
        (regionalSettings.options && regionalSettings.options.length)
            ? regionalSettings.options : [false],
        "0",                           // 14  LoRA in negative textencoder
        "0",                           // 15  LoRA in negative U-net
        regionalSettings.threshold,    // 16  threshold — RP's own default is 0.4,
                                       //     and "0" was a guess. Prompt mode only.
        null,                          // 17  (unlabelled) — RP's default is None,
                                       //     not "". Mask image, unused in Matrix.
        "0",                           // 18  LoRA stop step
        "0",                           // 19  LoRA hires stop step
        flip                           // 20  Flip
    ];
}

// ============================================================================
//  PROMPT NOTES — extra fields in the .txt sidecar
// ============================================================================
//  Driven by a companion script that must be installed on the Forge machine
//  first: scripts/webui/tools/forge-prompt-notes.py, copied to
//  <forge root>/extensions/prompt-notes/scripts/. Until it is there, leave this
//  DISABLED — Forge rejects an alwayson_scripts entry naming a script it has
//  never heard of, which would fail every generation rather than degrade.

var promptNotesSettings = {
    enabled:    true,           // needs forge-prompt-notes.py installed; false if it is not
    scriptName: "Prompt Notes", // must match the script's title()

    // Whether the recorded prompt carries the style LoRA and the universal
    // quality tags — `commonExtra` at the dispatch site, which is finalStyle plus
    // universalPrompt.
    //
    // FALSE, because the recorded prompt exists to be fed back in. On a batch
    // img2img pass the img2img prompt box already supplies a style, and a second
    // one arriving from the sidecar stacks two style LoRAs on the same image.
    // Stripping it afterwards by hand is not possible either: nothing in the
    // string distinguishes the style LoRA from the character LoRAs.
    //
    // Here they CAN be told apart, because the two never mix. Character LoRAs are
    // lifted out of the input by the engine and live in job.lora; the style LoRA
    // is appended at dispatch and never enters the pipeline at all.
    //
    // The image is still GENERATED with all of it. This only decides what the
    // .txt says.
    cleanIncludesStyle: false
};

// The RP-free prompt, for everything that happens to an image AFTER generation.
// The BREAKs and the cutaway's duplicated regions are scaffolding the generator
// needs and every downstream tool trips over.
//
// Same dedupe as the non-regional send, and the renderer's line structure left
// intact — a regional image and an ordinary one then carry the same shape of
// prompt, and one bulk-cleanup pass reads both. Nothing here may flatten the
// newlines; they survive into the .txt unharmed, because line 1 of an infotext
// is free-form text right up to the "Negative prompt:" line.
//
// The style suffix is dropped — see `cleanIncludesStyle` above for why, and note
// that this is the ONE deliberate difference from what was actually sent. The
// full string is preserved in the `Generated prompt` field either way.
//
// If a training caption is what this is ultimately feeding, `v2Job.contracted`
// is a better source still — it drops the boosters, which steer generation and
// describe nothing that is in the picture.
function buildCleanPrompt(rendered, commonExtra) {
    var clean = String(rendered == null ? "" : rendered);
    if (typeof removeDuplicates === "function") { clean = removeDuplicates(clean); }
    if (commonExtra && promptNotesSettings.cleanIncludesStyle) {
        clean = clean + ", " + commonExtra;
    }
    return clean;
}

// Args are POSITIONAL and must match FIELDS in forge-prompt-notes.py:
// original input, clean prompt, free-text note.
function promptNotesEntry(originalInput, cleanPrompt, note) {
    if (!promptNotesSettings.enabled) { return null; }
    return {
        name: promptNotesSettings.scriptName,
        args: [String(originalInput == null ? "" : originalInput),
               String(cleanPrompt == null ? "" : cleanPrompt),
               String(note == null ? "" : note)]
    };
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        buildCleanPrompt: buildCleanPrompt,
        promptNotesEntry: promptNotesEntry,
        promptNotesSettings: promptNotesSettings,
        parseLayout: parseLayout,
        layoutToRatios: layoutToRatios,
        resolveLayout: resolveLayout,
        extractRegionalTrigger: extractRegionalTrigger,
        buildRegionalRequest: buildRegionalRequest,
        regionalSettings: regionalSettings
    };
}
