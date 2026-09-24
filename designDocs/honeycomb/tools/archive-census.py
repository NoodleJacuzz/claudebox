"""
HONEYCOMB -- which game pictures have an original, and which do not
=====================================================================

`v13 spire png/` is the archive of originals and `v13 spire images/` is what the game loads. Every
picture in the game SHOULD have its original at the matching path in the archive. Many do not, because
until 2026-09-21 the conversion step deleted each .png after converting it. Noodle:

> Many images were undoubtably turned into .webp and forgotten (or heaven forbid, deleted).

This says which ones, and where a likely original still sits, so filling the archive is a worklist
rather than a hunt.

    python "!designDocs/honeycomb/tools/archive-census.py"                 # the summary
    python "!designDocs/honeycomb/tools/archive-census.py" --list          # every orphan, by area
    python "!designDocs/honeycomb/tools/archive-census.py" --area characters
    python "!designDocs/honeycomb/tools/archive-census.py" --found         # only orphans with a candidate
    python "!designDocs/honeycomb/tools/archive-census.py" --plan          # the copy list, safe rows only

A GAME PICTURE MADE FROM ANOTHER PICTURE MUST NOT BE GIVEN AN ORIGINAL. `characters/knight/recover.webp`
matches `knight1V-basic-a.png` at 1.000, but it is not that picture: generate-placeholder-art.py builds
it by tinting the standing art (`build_recover_portraits`, and `build_broken_portraits` beside it).
Copying the standing art into the archive as `recover.png` would look right and then quietly destroy the
cut-in the next time anything converted it, because the conversion has no tint in it.

They are caught by counting: when several game paths pick the same source as their best match, at most
one of them IS that picture and the rest are made from it. Every row in such a group is marked SHARED
and left out of `--plan`. Judge those by hand -- usually the answer is that none of them needs an
original, because the generator rebuilds them all from a source that is already in `_source/`.

IT READS AND WRITES NOTHING. There is no --apply and there should never be one: deciding that a
particular loose file in `_source/` is the original of a particular game picture is a judgement, and a
wrong guess copies the wrong art over a good path.

WHAT COUNTS AS NOT NEEDING AN ORIGINAL. A folder holding `.generated.txt` was written by
generate-placeholder-art.py, so it can be rebuilt from its own source at any time and its .webp is not
the only copy of anything. Those are counted separately rather than listed as losses.

HOW A CANDIDATE IS FOUND: BY WHAT THE PICTURE LOOKS LIKE, not by its name. Matching on names was tried
first and was useless -- "knight" matches `butterflyknight-a.png` and three hundred others. Instead every
loose .png under `_source/` and the archive is reduced to a 16x16 grey thumbnail, the game picture is
reduced the same way, and they are ranked by how well the two correlate. That survives the usual
difference between an original and the picture made from it: the original often still has its painted
background while the game copy has been cut out, which wrecks an absolute comparison but leaves the
figure's shape intact for a correlation.

A SCORE IS A SUGGESTION, NEVER A CONCLUSION. Above about 0.95 the two are almost certainly the same
picture; between 0.8 and 0.95 they are worth opening side by side; below that the list is telling you it
found nothing. A picture whose best score is low is the one that matters: nothing on this disk looks
like it, so its original is genuinely gone.

The thumbnails are cached under the scratchpad so a second run is quick. `--rescan` rebuilds the cache.
"""

import argparse
import json
import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is missing: python -m pip install Pillow")

#Pillow moved the resampling filters onto an enum and deprecated the old spelling. Both are read here so
#the tool runs on whichever version is installed without printing a warning over its own report.
LANCZOS = getattr(getattr(Image, "Resampling", Image), "LANCZOS")

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
ARCHIVE = os.path.join(ROOT, "v13 spire png")
GAME = os.path.join(ROOT, "v13 spire images")

#Not part of the game's art: `_source` is working material and `mockups` are reference pictures.
SKIP_TOP = ("_source", "mockups")

#FILES generate-placeholder-art.py BUILDS FROM ANOTHER DRAWING, so no original is owed for them and one
#must not be invented. The cut-in builders (`build_broken_portraits`, `build_recover_portraits`) take a
#character's standing art and apply a tint and a brightness change; the BG pair is a flat wash. Putting
#the standing art into the archive under these names would read as correct and then destroy the tint the
#next time anything converted it. Read off the generator, not guessed -- if those builders change, this
#changes with them.
#
#The one exception is a drawn cut-in delivered as `broken.png` beside the target, which the builder
#converts instead of building. Anastasia's is drawn, which is why `characters/chess/broken` is not here.
DERIVED_LEAF = ("broken", "recover", "brokenBG", "recoverBG")
DERIVED_EXCEPT = ("characters/chess/broken",)

#THE GENERATOR'S OWN RECIPE TABLES (2026-09-22, ART-RESTRUCTURE step 2). Card art, map backdrops and
#panels, the Lewd frames and icon, the Broken masks, the Exposed title and every downsized card frame are
#written from a table in generate-placeholder-art.py, and none of them sit in a folder with a manifest.
#Before this they were counted as 164 lost originals. The tables are read out of the generator's source
#with `ast` rather than by importing it, so nothing in the generator runs, and a recipe added there is
#picked up here with no second list to keep in step.
GENERATOR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "generate-placeholder-art.py")
#Table name -> (folder the stems are written into, which element of each row is the output).
GENERATOR_STEM_TABLES = {
    "CARD_ART_RECIPES": ("cards/art", 0),
    "ABSTRACT_CARD_RECIPES": ("cards/art", 0),
    "MAP_BACKDROPS": ("map", 0),
    "BACKGROUND_RECIPES": ("map", 0),
    "PANEL_RECIPES": ("map", 0),
    "LEWD_FRAME_ARRAY": ("", 1),
    "BROKEN_MASK_ARRAY": ("", 1),
}
#Outputs that are one path rather than a table: the Lewd icon (second element of LEWD_ICON) and the
#Exposed title, which build_exposed_text writes to a fixed path.
GENERATOR_SINGLE_OUTPUTS = ("ui/exposed/exposedText",)
#build_card_frame_sizes writes a copy of EVERY frame in cards/frames at each of these suffixes.
FRAME_FOLDER = "cards/frames"

#GENERATED FILES LEFT BEHIND WHEN THE GENERATOR LET GO OF A FOLDER (2026-09-22, ART-RESTRUCTURE C).
#Five Celestial pieces had their drawn `1-combat` taken off `.generated.txt` once its original was in the
#archive. Their `1-offense` is the generator's tilt of that same drawing, and it had to come off the list
#too: on a rerun the generator deletes every listed file, but writes nothing beside a real `1-combat`, so a
#listed offense would have been deleted and never replaced. They are still generator output, so no
#original is owed. A drawn offense replaces one by being dropped into the archive at its path.
FROZEN_DERIVED = tuple("enemies/celestial%s/default/1-offense" % piece
                       for piece in ("Pawn", "Knight", "Bishop", "Rook", "King"))

#The thumbnail every picture is reduced to before being compared. 16x16 is small enough that a few
#thousand of them cost nothing to hold and compare, and large enough to tell two drawings apart.
THUMB = 16

#Where the thumbnails are kept between runs. The scratchpad, not the repo: it is derived data about the
#repo, it is rebuilt from the repo at any time, and it has no business being stored beside the art.
CACHE = os.path.join(os.environ.get("TEMP", os.path.expanduser("~")),
                     "honeycomb-archive-census-thumbs.json")


def relative_paths(root, extension, skip_top=()):
    """Every file with this extension under root, as forward-slashed relative paths."""
    found = set()
    for folder, _directories, files in os.walk(root):
        relative_folder = os.path.relpath(folder, root).replace("\\", "/")
        top = relative_folder.split("/")[0]
        if top in skip_top:
            continue
        for name in files:
            if not name.lower().endswith(extension):
                continue
            relative = os.path.join(relative_folder, name).replace("\\", "/")
            found.add(relative[2:] if relative.startswith("./") else relative)
    return found


def generated_folders():
    """Folders the placeholder generator owns, which do not need an original kept for them."""
    owned = set()
    for folder, _directories, files in os.walk(GAME):
        if ".generated.txt" in files:
            relative = os.path.relpath(folder, GAME).replace("\\", "/")
            owned.add(relative[2:] if relative.startswith("./") else relative)
    return owned


def generator_outputs():
    """(stems the generator writes from its tables, frame-size suffixes), both read from its source.

    A stem is a game path with no extension. A drawn `.png` beside a Lewd or Exposed target makes the
    generator convert it instead of building, so such a target is dropped from the set: it is a drawing.
    """
    import ast
    with open(GENERATOR, encoding="utf-8") as handle:
        tree = ast.parse(handle.read())
    tableMap = {}
    for node in tree.body:
        if isinstance(node, ast.Assign) and len(node.targets) == 1 and isinstance(node.targets[0], ast.Name):
            tableMap[node.targets[0].id] = node.value

    def text_at(row, position):
        if isinstance(row, (ast.Tuple, ast.List)) and len(row.elts) > position:
            one = row.elts[position]
            if isinstance(one, ast.Constant) and isinstance(one.value, str):
                return one.value
        return None

    stemSet = set()
    for name, (folder, position) in GENERATOR_STEM_TABLES.items():
        table = tableMap.get(name)
        if table is None:
            sys.exit("generate-placeholder-art.py has no table " + name + "; update GENERATOR_STEM_TABLES")
        for row in table.elts:
            value = text_at(row, position)
            if value is None:
                continue
            stem = os.path.splitext(value)[0]
            stemSet.add(folder + "/" + stem if folder else stem)
    lewdIcon = text_at(tableMap.get("LEWD_ICON"), 1)
    if lewdIcon:
        stemSet.add(os.path.splitext(lewdIcon)[0])
    stemSet.update(GENERATOR_SINGLE_OUTPUTS)
    stemSet = set(one for one in stemSet if not os.path.exists(os.path.join(GAME, one + ".png")))

    suffixArray = []
    for row in getattr(tableMap.get("CARD_FRAME_SIZE_SHARES"), "elts", []):
        suffix = text_at(row, 0)
        if suffix:
            suffixArray.append(suffix)
    if not suffixArray:
        sys.exit("generate-placeholder-art.py has no CARD_FRAME_SIZE_SHARES; update archive-census.py")
    return stemSet, tuple(suffixArray)


def thumbnail(path):
    """A picture as a flat list of THUMB*THUMB greys, or None when it cannot be read.

    Composited onto white first, so a cut-out picture and the same picture with its background still on
    it reduce to comparable shapes rather than one of them being mostly transparent.
    """
    try:
        with Image.open(path) as image:
            image = image.convert("RGBA")
            flat = Image.new("RGBA", image.size, (255, 255, 255, 255))
            flat.alpha_composite(image)
            small = flat.convert("L").resize((THUMB, THUMB), LANCZOS)
            return list(small.getdata())
    except Exception:                                   # noqa: BLE001 - an unreadable file is just skipped
        return None


def correlation(left, right):
    """How alike two thumbnails are, from -1 to 1. Flat against anything is 0 rather than an error."""
    count = len(left)
    leftMean = sum(left) / float(count)
    rightMean = sum(right) / float(count)
    leftSpread = sum((one - leftMean) ** 2 for one in left)
    rightSpread = sum((one - rightMean) ** 2 for one in right)
    if leftSpread <= 0 or rightSpread <= 0:
        return 0.0
    together = sum((left[i] - leftMean) * (right[i] - rightMean) for i in range(count))
    return together / ((leftSpread * rightSpread) ** 0.5)


def candidate_index(rescan):
    """Every loose .png that could be somebody's original, as {repo-relative path: thumbnail}."""
    cached = {}
    if not rescan and os.path.exists(CACHE):
        try:
            cached = json.load(open(CACHE, encoding="utf-8"))
        except Exception:                               # noqa: BLE001 - a bad cache is just rebuilt
            cached = {}

    index = {}
    fresh = 0
    for root in (os.path.join(ROOT, "!designDocs", "honeycomb", "!imageStorage", "_source"), ARCHIVE):
        if not os.path.isdir(root):
            continue
        for folder, _directories, files in os.walk(root):
            for name in sorted(files):
                if not name.lower().endswith(".png"):
                    continue
                full = os.path.join(folder, name)
                key = os.path.relpath(full, ROOT).replace("\\", "/")
                if key in cached:
                    index[key] = cached[key]
                    continue
                thumb = thumbnail(full)
                if thumb is None:
                    continue
                index[key] = thumb
                fresh += 1
                if fresh % 200 == 0:
                    print("  ...read %d new picture(s)" % fresh)
    if fresh:
        try:
            json.dump(index, open(CACHE, "w", encoding="utf-8"))
        except Exception:                               # noqa: BLE001 - a cache that will not save is fine
            pass
    return index


def candidates_for(game_path, index, keep):
    """The loose PNGs that look most like this game picture, best first. A SUGGESTION only."""
    mine = thumbnail(os.path.join(GAME, game_path))
    if mine is None:
        return []
    scored = []
    for key, thumb in index.items():
        scored.append((correlation(mine, thumb), key))
    scored.sort(reverse=True)
    return scored[:keep]


def main():
    parser = argparse.ArgumentParser(add_help=True, description="which game pictures have no original")
    parser.add_argument("--list", action="store_true", help="name every orphan")
    parser.add_argument("--area", default="", help="only this top folder (characters, enemies, cards...)")
    parser.add_argument("--found", action="store_true", help="only orphans with a convincing candidate")
    parser.add_argument("--plan", action="store_true",
                        help="print the copy list: found originals that no other picture also claims")
    parser.add_argument("--rescan", action="store_true", help="rebuild the thumbnail cache from disk")
    parser.add_argument("--sure", type=float, default=0.95,
                        help="score at or above which a candidate is called a match (default 0.95)")
    options = parser.parse_args()

    if not os.path.isdir(GAME):
        sys.exit("no game folder: " + GAME)

    gameArray = sorted(relative_paths(GAME, ".webp", SKIP_TOP))
    archiveSet = set(os.path.splitext(one)[0] for one in relative_paths(ARCHIVE, ".png"))
    owned = generated_folders()
    builtStemSet, frameSuffixArray = generator_outputs()

    if options.area:
        gameArray = [one for one in gameArray if one.split("/")[0] == options.area]

    keptArray, generatedArray, orphanArray = [], [], []
    for relative in gameArray:
        stem = os.path.splitext(relative)[0]
        folder = os.path.dirname(relative)
        leaf = os.path.basename(stem)
        if stem in archiveSet:
            keptArray.append(relative)
        elif folder in owned:
            generatedArray.append(relative)
        elif leaf in DERIVED_LEAF and stem not in DERIVED_EXCEPT:
            generatedArray.append(relative)
        elif stem in builtStemSet or stem in FROZEN_DERIVED:
            generatedArray.append(relative)
        elif folder == FRAME_FOLDER and leaf.endswith(frameSuffixArray):
            generatedArray.append(relative)
        else:
            orphanArray.append(relative)

    print("GAME PICTURES: %d%s" % (len(gameArray), " in " + options.area if options.area else ""))
    print("  %5d have their original in the archive" % len(keptArray))
    print("  %5d are built from another drawing, so no original is owed" % len(generatedArray))
    print("  %5d have NO original in the archive" % len(orphanArray))

    byArea = {}
    for relative in orphanArray:
        byArea.setdefault(relative.split("/")[0], []).append(relative)
    print("\nOrphans by area:")
    for area in sorted(byArea, key=lambda one: -len(byArea[one])):
        print("  %-16s %d" % (area, len(byArea[area])))

    #--plan needs the same work --list does, so it is not stopped here.
    if not options.list and not options.plan:
        print("\nAdd --list to name them, --plan for the copy list, --area <folder> to narrow.")
        return

    print("\nReading the pictures that could be originals...")
    index = candidate_index(options.rescan)
    print("  %d loose .png to compare against" % len(index))

    #Every orphan's ranking is worked out first, because whether a row is SHARED depends on what the
    #other rows picked, and that cannot be known while printing them one at a time.
    rankMap = {}
    for area in sorted(byArea):
        for relative in byArea[area]:
            rankMap[relative] = candidates_for(relative, index, 3)

    claimCount = {}
    for relative, hitArray in rankMap.items():
        if hitArray and hitArray[0][0] >= options.sure:
            claimCount[hitArray[0][1]] = claimCount.get(hitArray[0][1], 0) + 1

    def verdict(hitArray):
        """One of: 'found', 'shared', 'gone'. See the header for why 'shared' is not 'found'."""
        if not hitArray or hitArray[0][0] < options.sure:
            return "gone"
        return "shared" if claimCount.get(hitArray[0][1], 0) > 1 else "found"

    if options.plan:
        print("\nTHE COPY LIST. Each line is one original to put into the archive at the game's own path.")
        print("Rows another picture also claims are left out; run without --plan to see them.")
        print("Nothing here has been done. Copy, do not move: the file stays where it is as well.\n")
        planned = 0
        for area in sorted(byArea):
            rowArray = [one for one in byArea[area] if verdict(rankMap[one]) == "found"]
            if not rowArray:
                continue
            print("--- %s (%d) ---" % (area, len(rowArray)))
            for relative in rowArray:
                source = rankMap[relative][0][1]
                target = "v13 spire png/" + os.path.splitext(relative)[0] + ".png"
                print('  copy "%s"\n    to "%s"' % (source, target))
                planned += 1
            print("")
        print("%d file(s) to copy." % planned)
        return

    print("\nEVERY ORPHAN, with the loose .png that looks most like it.")
    print("A score is a SUGGESTION. At or above %.2f the two are almost certainly the same picture;" % options.sure)
    print("between 0.80 and %.2f open them side by side; below that nothing on this disk looks like it." % options.sure)
    print("SHARED means another game picture picked the same source, so this one is probably MADE from it.")
    countMap = {"found": 0, "shared": 0, "gone": 0}
    for area in sorted(byArea):
        print("\n--- %s ---" % area)
        for relative in byArea[area]:
            hitArray = rankMap[relative]
            state = verdict(hitArray)
            countMap[state] += 1
            if options.found and state != "found":
                continue
            print("  %-52s %s" % (relative, state.upper()))
            if not hitArray:
                print("      nothing to compare against")
            for score, key in hitArray:
                print("      %.3f  %s" % (score, key))

    print("\n%d orphan(s) have an original on disk that nothing else claims -- run --plan for the copy list."
          % countMap["found"])
    print("%d share their best match with another picture, so they are probably made from it." % countMap["shared"])
    print("%d have nothing that looks like them; those originals are gone." % countMap["gone"])


if __name__ == "__main__":
    main()
