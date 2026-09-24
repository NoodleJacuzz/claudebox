// cullDB.js - what each cull command removes.
//
// This replaces the hand-pasted category lists in cullBulkKeywords
// (webui.js:2147). Those were 24 commands each naming up to forty categories by
// hand, which is how `chest shot` ended up carrying `head shot`'s list and
// deleting the chest it was named after.
//
// The model this file is written against (TAXONOMY.md §4 and §6, archived
// 2026-08-06 — what follows is the whole of it):
//
//   The 18-rung PART LADDER runs head to toe and every domain shares it, so
//   `bodyChest`, `clothesUpperwearOuter` and `sceneChest` are all part `chest`.
//   A framing cull is therefore a RANGE - you write where the crop is, not which
//   thirty categories fall outside it.
//
//     1 head    2 eyes    3 face    4 mouth   5 neck    6 shoulders
//     7 arms    8 hands   9 chest  10 back   11 torso  12 belly
//    13 waist  14 groin  15 rear   16 thighs 17 calves 18 feet
//
//   Off the ladder: fullwear, whole (race and brand - never cropped away),
//   the scene-only parts, the background-only parts, and unsorted.
//
// LINE FORMAT
//
//     <command> ; <class> ; <clauses>
//
//   class      framing | coverage | state | background
//              framing, coverage and background are HARD culls: only an explicit
//              `keep` reverses one. state is FUZZY and Phase 6 may argue with it.
//              (Rule 16.)
//
//   clauses    comma-separated, in any order:
//
//     below <part>        that rung and everything under it
//     above <part>        that rung and everything over it
//     only <parts...>     keep those rungs, cut the rest of the LADDER
//     <parts...>          cut exactly these rungs
//     <categoryName>...   cut exactly these categories - the escape hatch, for
//                         when naming one or four outright is clearer than any
//                         predicate. Recognised by the camelCase domain prefix.
//     domain: <list>      restrict to domains. `+ x` ADDS to the default.
//                         Default is body + clothes, and scene comes along
//                         automatically - see below.
//     layer: <list>       restrict to layers
//     except <things>     categories, parts or `layer: x` to spare
//
// SCENE COMES ALONG AUTOMATICALLY. Every body* and clothes* category culled here
// also culls its scene* twin, exactly as v1 does. A cull that means "you cannot
// see this" reaches the action too. `remove clothes` and `replace clothes` do
// NOT expand, which is why removing an outfit takes `short skirt` and leaves
// `skirt lift` - but those are reset commands and are not in this file at all.
//
// NOTHING HERE ASSERTS EXCLUSIVITY. That is exclusivesArray's job.

var cullArray = `
- ---- framing: where the crop is ----

head out of frame   ; framing  ; above neck
eyes out of frame   ; framing  ; above eyes
head only           ; framing  ; below shoulders, fullwear, domain: + prop
head shot           ; framing  ; below shoulders, fullwear, domain: + prop
chest up            ; framing  ; below belly, domain: + prop
chest shot          ; framing  ; only neck shoulders arms hands chest back torso, domain: + prop
upper body only     ; framing  ; below groin
lower body only     ; framing  ; above torso
ass shot            ; framing  ; only belly waist groin rear thighs
crotch shot         ; framing  ; only belly waist groin rear thighs
cowboy shot         ; framing  ; below calves
feet out of frame   ; framing  ; below feet
legless             ; framing  ; below thighs

- ---- coverage: what is or is not being worn ----

barefoot            ; coverage ; domain: clothes, thighs calves feet
nude                ; coverage ; domain: clothes, chest groin fullwear
topless             ; coverage ; domain: clothes, chest, except clothesNipplewear
bottomless          ; coverage ; domain: clothes, groin, except layer: outer

- ---- coverage: the shape shows but the detail does not ----

bulge               ; coverage ; bodyPenis bodyBalls
cameltoe            ; coverage ; bodyPussy bodyClit
clitoris slip       ; coverage ; bodyPussy
featureless breasts ; coverage ; bodyAreolae bodyNipples
featureless crotch  ; coverage ; bodyPenis bodyBalls bodyPussy bodyClit

- ---- state: true right now, and Phase 6 may argue ----

- \`closed eyes\` is renamed to \`eyes closed\` by a cleaning rule long before this
- file is read, so the CANONICAL spelling is what has to be listed. v1 lists
- "closed eyes" in quickPromptsCullArray and its cull has therefore been dead for
- as long as that rename has existed. Both spellings are here so it cannot
- happen again from either direction.

closed eyes         ; state    ; bodyEyes
eyes closed         ; state    ; bodyEyes
closed mouth        ; state    ; bodyTeeth
mouth closed        ; state    ; bodyTeeth

- \`areola slip\` means the areola is visible and THE NIPPLE ITSELF IS NOT -
- covered by clothing, by a hand, by a censor bar. So it removes the nipple
- descriptors and leaves everything else alone. It does NOT mean nude: this is a
- dress the areolae are peeking out of.
-
- Both are \`state\` and therefore FUZZY, because Phase 6 has to be able to argue
- with them. They were commented out of v1 entirely for want of that.

areola slip         ; state    ; bodyNipples
covered nipples     ; state    ; bodyNipples

- \`facing away\` is the one genuine irregular. It cuts by WHICH SIDE OF THE BODY
- you can see, which is not a range on any head-to-toe ladder, so it enumerates.
- Note what is absent: headwear and earwear, because a hat and an earring are
- perfectly visible from behind. If a second command ever needs this same cut,
- that is the moment to add a front/back axis - not before.

facing away         ; state    ; bodyFace bodyEyes bodyOrbital bodyMuzzle bodyTeeth bodyAreolae bodyNipples bodyBelly bodyClit clothesForeheadwear clothesFacewear clothesEyewear clothesMouthwear clothesNipplewear

- ---- background ----
-
- Noodle 2026-08-05: \`indoors\` and \`outdoors\` were PROPOSED as culls of each
- other and REJECTED - both appear together constantly, answering a door, a
- window in the scene. They are not here and should not be added.
-
- \`white background\` was also rejected: a white background is often just an
- indoor shot with white walls.

-
- Honeycomb art pass 2026-09-14 (step 2a): \`objects\` was taken out of this cull.
- backgroundObjects is simpleObjectArray (sceneDB.js) expanded - skull, sword,
- staff, shield, book, lantern - which is to say the props a character HOLDS. On a
- white background those are exactly what is left in the picture, and the cull was
- deleting a character's own weapon: flaming skull on 12 of 35 reference sidecars,
- black staff on 7, planted sword on 4. Scenery that genuinely contradicts a simple
- background lives in indoors, outdoors and other, and is still culled.

simple background   ; background ; domain: background, indoors outdoors other
`;

// ---------------------------------------------------------------------------
//  Cull blockers - Rule 22
// ---------------------------------------------------------------------------
//  A blocker DISARMS A CLASS of cull for the whole job rather than protecting
//  particular tags, which is why it needs to know nothing about categories.
//
//      <command> ; <classes it disarms>
//
//  `<part> cutaway` is parameterised: any tag reading "<ladder rung> cutaway"
//  spares that rung from every cull. It is generated, not listed.

var cullBlockerArray = `
multiple views      ; framing
unworn clothing     ; coverage
`;

// ---------------------------------------------------------------------------
//  Contradictions — a tag the rest of the prompt says cannot be true
// ---------------------------------------------------------------------------
//      <tag> ; <any of these contradicts it> ; <unless any of these>
//
//  The tag is FUZZY-culled, so it never fires whatever cull it carried, and
//  Phase 6 can still restore it.
//
//  The exception column exists so this stays ONE PASS. `areola slip` is
//  contradicted by being topless — unless she is covering herself, in which case
//  it is plausible again. Expressed as cull-then-uncull that would need the cull
//  phase to run twice, which Rule 15 forbids; expressed as requirement-plus-
//  exception it is a single decision with the same answer.

var cullContradictionArray = `
areola slip ; topless, breasts out, open clothes, nipple slip ; covering breasts, covering self
`;

// ---------------------------------------------------------------------------
//  Unculling — Phase 6
// ---------------------------------------------------------------------------
//      <requirements, ALL of them> ; <categories or tags to restore>
//
//  Write two lines for an either/or. Requirements go through isPresent, so a
//  quoted term is a substring — `'see-through'` reaches `see-through dress`,
//  `see-through shirt` and the rest without listing them.
//
//  ONLY FUZZY CULLS CAN BE REVERSED (Rule 16). A framing cull is hard: if the
//  head is out of frame it is out of frame, and no condition argues with that.

var uncullArray = `
- Through see-through fabric you can see the nipple as well as the areola, so
- the descriptors areola slip removed come back.
areola slip, 'see-through' ; bodyNipples

- The same argument, one layer further in. 'covered nipples' says the nipple is
- under the fabric, not that it is invisible — and if the fabric is see-through
- you can read its shape and colour through it. Written 2026-08-07; it was always
- implied by the areola slip line above and had only been specified for the slip.
- (No backticks in this file: the whole array is a template literal.)
covered nipples, 'see-through' ; bodyNipples

- v1 does this one already, in uncullTargetCategories: hooved hands means the
- hooves are on the HANDS, so a cull that took the feet has to give them back.
hooved hands ; hooves
`;

// ---------------------------------------------------------------------------
//  Dependencies — Phase 7's sweep
// ---------------------------------------------------------------------------
//      <child> ; <parent>
//
//  The child cannot exist without the parent, so it goes when the parent does —
//  FROM ANY CAUSE, not only an explicit `!penis`. A framing cull that took the
//  groin takes the knot with it.
//
//  The parent is matched at specificity, so `huge penis` satisfies `penis` and
//  the sweep does not fire on a figure who merely has a differently-worded one.
//
//  This is not new data. It was two hard-coded `if` blocks inside
//  negativeCleanup (webui.js:2595), reachable only when the parent was named in
//  the negative field. Same entries, now visible and now general.

var dependencyArray = `
knot            ; penis
medial ring     ; penis
erection        ; penis
erect penis     ; penis
flaccid         ; penis
flaccid penis   ; penis
semi-erect      ; penis
soft penis      ; penis
half-erect      ; penis
plump labia     ; pussy
cleft of venus  ; pussy
- Added 2026-08-08. Both are parts OF a pussy in the same sense as the two above,
- and both are in the Pussy shortcut's own expansion — so the bodypart defaults
- put them in the prompt and, without these rows, left them behind when the pussy
- itself was swapped out for a male figure's penis.
clitoris        ; pussy
clitoral hood   ; pussy
`;

// ---------------------------------------------------------------------------
//  Negatives a cull command implies
// ---------------------------------------------------------------------------
//      <cull command> ; <negative tags>
//
//  A framing cull says which crop this is, and the crops it is NOT belong in the
//  negative. v1's basicNegativeArray has 47 entries and none of them are
//  framings, so this is the gap CORPUS Phase 7 Probe B names.
//
//  A STARTER, not a finished set. Anything already in the prompt is dropped from
//  the negative afterwards, so an entry here can afford to be generous.

var cullNegativeArray = `
head shot         ; full body, cowboy shot, upper body only, wide shot
head only         ; full body, cowboy shot, upper body only, wide shot
chest up          ; full body, cowboy shot, wide shot
upper body only   ; full body, cowboy shot
cowboy shot       ; full body, feet
lower body only   ; head, face
`;

// ---------------------------------------------------------------------------
//  Parsing
// ---------------------------------------------------------------------------
//  Produces cleanedCullArray and cleanedCullBlockers. Resolving a command to a
//  set of categories happens in the engine, not here - this file only says what
//  was written.

var cleanedCullArray = [];
var cleanedCullBlockers = {};
var cleanedCullContradictions = [];
var cleanedUncullArray = [];
var cleanedDependencyArray = [];
var cleanedCullNegatives = {};

function splitCullList(text) {
    return String(text == null ? "" : text).split(",")
        .map(function (t) { return t.trim(); })
        .filter(function (t) { return t !== ""; });
}

// Called by v2EnsureDictionaries, which may now run after the page has already
// built the shared dictionaries. Nothing here reassigns `cullArray`, so without
// this guard a second call would append every command, blocker, contradiction,
// dependency and uncull a second time — silently doubling the ruleset.
var cullArrayCleaned = false;

function cleanupCullArray() {
    if (cullArrayCleaned) { return; }
    cullArrayCleaned = true;
    if (typeof cullArray !== "string") { return; }
    var lines = cullArray.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line === "" || line.charAt(0) === "-") { continue; }
        var parts = line.split(";");
        if (parts.length < 3) { console.warn("cullDB: skipping malformed line:", line); continue; }
        var command = parts[0].trim().toLowerCase();
        var group = parts[1].trim().toLowerCase();
        var body = parts.slice(2).join(";");

        var entry = {
            command: command,
            group: group,
            strength: group === "state" ? "fuzzy" : "hard",
            below: null, above: null, only: null,
            parts: [], categories: [], domains: null, addDomains: [],
            layers: null, exceptCategories: [], exceptParts: [], exceptLayers: []
        };

        var clauses = body.split(",");
        for (var c = 0; c < clauses.length; c++) {
            var clause = clauses[c].trim();
            if (clause === "") { continue; }
            var words = clause.split(/\s+/);
            var head = words[0].toLowerCase();
            var rest = words.slice(1);

            if (head === "below")       { entry.below = rest[0]; continue; }
            if (head === "above")       { entry.above = rest[0]; continue; }
            if (head === "only")        { entry.only = rest; continue; }
            if (head === "domain:")     { readDomains(entry, rest); continue; }
            if (head === "layer:")      { entry.layers = rest; continue; }
            if (head === "except")      { readExcept(entry, rest); continue; }

            // A bare clause is a list of parts, of categories, or of both.
            for (var w = 0; w < words.length; w++) { addTarget(entry, words[w]); }
        }
        cleanedCullArray.push(entry);
    }

    if (typeof cullBlockerArray === "string") {
        var blockerLines = cullBlockerArray.split("\n");
        for (var b = 0; b < blockerLines.length; b++) {
            var blockerLine = blockerLines[b].trim();
            if (blockerLine === "" || blockerLine.charAt(0) === "-") { continue; }
            var half = blockerLine.split(";");
            if (half.length < 2) { continue; }
            cleanedCullBlockers[half[0].trim().toLowerCase()] =
                half[1].trim().toLowerCase().split(/\s+/);
        }
    }

    if (typeof cullContradictionArray === "string") {
        var contraLines = cullContradictionArray.split("\n");
        for (var c = 0; c < contraLines.length; c++) {
            var contraLine = contraLines[c].trim();
            if (contraLine === "" || contraLine.charAt(0) === "-") { continue; }
            var columns = contraLine.split(";");
            if (columns.length < 2) { continue; }
            cleanedCullContradictions.push({
                tag: columns[0].trim().toLowerCase(),
                contradictedBy: splitCullList(columns[1]),
                unless: columns.length > 2 ? splitCullList(columns[2]) : []
            });
        }
    }

    if (typeof dependencyArray === "string") {
        var depLines = dependencyArray.split("\n");
        for (var d = 0; d < depLines.length; d++) {
            var depLine = depLines[d].trim();
            if (depLine === "" || depLine.charAt(0) === "-") { continue; }
            var pair = depLine.split(";");
            if (pair.length < 2) { continue; }
            cleanedDependencyArray.push({
                child: pair[0].trim().toLowerCase(),
                parent: pair[1].trim().toLowerCase()
            });
        }
    }

    if (typeof cullNegativeArray === "string") {
        var negLines = cullNegativeArray.split("\n");
        for (var n = 0; n < negLines.length; n++) {
            var negLine = negLines[n].trim();
            if (negLine === "" || negLine.charAt(0) === "-") { continue; }
            var negParts = negLine.split(";");
            if (negParts.length < 2) { continue; }
            cleanedCullNegatives[negParts[0].trim().toLowerCase()] =
                splitCullList(negParts.slice(1).join(";"));
        }
    }

    if (typeof uncullArray === "string") {
        var uncullLines = uncullArray.split("\n");
        for (var u = 0; u < uncullLines.length; u++) {
            var uncullLine = uncullLines[u].trim();
            if (uncullLine === "" || uncullLine.charAt(0) === "-") { continue; }
            var sides = uncullLine.split(";");
            if (sides.length < 2) { continue; }
            cleanedUncullArray.push({
                requirements: splitCullList(sides[0]),
                restores: splitCullList(sides.slice(1).join(";"))
            });
        }
    }
}

// A category is camelCase with a domain prefix; a part is one lowercase word.
// That is the whole distinction and it is why category names must stay camelCase.
function isCategoryName(word) {
    return /[A-Z]/.test(word);
}

function addTarget(entry, word) {
    word = word.trim();
    if (word === "") { return; }
    if (isCategoryName(word)) { entry.categories.push(word); }
    else { entry.parts.push(word.toLowerCase()); }
}

function readDomains(entry, words) {
    for (var i = 0; i < words.length; i++) {
        var word = words[i].trim().toLowerCase();
        if (word === "" ) { continue; }
        if (word === "+") { continue; }
        // "domain: + prop" adds to the default rather than replacing it. The
        // marker sits on the previous word, so look back one.
        if (i > 0 && words[i - 1].trim() === "+") { entry.addDomains.push(word); continue; }
        if (words[0].trim() === "+") { entry.addDomains.push(word); continue; }
        if (!entry.domains) { entry.domains = []; }
        entry.domains.push(word);
    }
}

function readExcept(entry, words) {
    var layerMode = false;
    for (var i = 0; i < words.length; i++) {
        var word = words[i].trim();
        if (word === "") { continue; }
        if (word.toLowerCase() === "layer:") { layerMode = true; continue; }
        if (layerMode) { entry.exceptLayers.push(word.toLowerCase()); continue; }
        if (isCategoryName(word)) { entry.exceptCategories.push(word); }
        else { entry.exceptParts.push(word.toLowerCase()); }
    }
}
