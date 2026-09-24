"""
HONEYCOMB -- the PNG archive: `v13 spire png/` -> `v13 spire images/`
=======================================================================

`v13 spire png/` IS THE ORIGINAL. It mirrors the game's art folder: a finished picture goes in at the
path it will have in the game, as a .png, and it STAYS THERE FOREVER. This converts it to .webp and
writes that .webp to the SAME relative path under `v13 spire images/`. Nothing is renamed, no folder is
chosen, and nothing is deleted -- the path in the archive IS the path in the game.

    v13 spire png/characters/necro/lust/v1-1.png  ->  v13 spire images/characters/necro/lust/v1-1.webp

which `honeycomb.image` then serves for the content path `characters/necro/lust/v1-1`. Content never
writes the extension: `honeycomb.imageFormat` decides it, and it says webp.

    python "!designDocs/honeycomb/tools/png-to-webp.py"            # what it WOULD do; writes nothing
    python "!designDocs/honeycomb/tools/png-to-webp.py" --apply    # convert

    --apply         actually write. Without it this is a report and nothing else.
    --only <text>   only paths containing <text>
    --force         re-encode even where the .webp is already newer than its .png
    --quality <n>   default 88, the number generate-placeholder-art.py uses for every other asset
    --lossless      ignore --quality and encode losslessly. For flat art and UI, not for scene art:
                    it is several times the size on a rendered picture and no better to look at.

IT NEVER DELETES A .png. Noodle, 2026-09-21, on the version that did:

> This must change, and how the desk stores outgoing png files changed, immediately, I am extremely
> thankful I accidentally copied Nettle's venom images. Had I decided to ask you to generate and export
> images today instead of doing this, I would have lost days of work.

The old version treated this folder as a staging tray and removed each .png after converting it, which
made the .webp the only surviving copy of every picture that passed through. The desk writes its Forge
output straight into this folder, so a desk generation followed by a conversion destroyed the original.
There is no flag to bring that behaviour back.

BECAUSE THE .png STAYS, THE QUESTION CHANGES from "what is in the folder" to "which .webp is out of
date". A .png whose .webp is newer than it is is SKIPPED, so running this again after adding one file
converts that one file and leaves the rest alone. `--force` re-encodes everything the filter selects.

WHAT IT REPORTS. A .png whose .webp already exists AND is older is an overwrite of live game art, so
the report names every one of them under their own heading with the two file sizes. It still proceeds
on --apply, because replacing a picture with a better version of itself is the whole workflow -- but it
is never silent about it, because replacing the WRONG picture is silent otherwise.

A FOLDER WHOSE NAME BEGINS WITH `_` IS SKIPPED WHOLE. It is a working folder (`_workbench`, `_standins`),
not somewhere the game looks. The walk does not go into it, and the report names each one once.
A picture is ready when it is moved to its real path.

A SPRITE POSE IS WRITTEN AT THE STANDARD HEIGHT, AND THAT IS THE POINT OF THIS STEP. Every pose a
fighter swaps between while standing in one place -- `1-combat`, `1-offense`, `1-passive`, `1-damaged`,
`1-basic`, their tier-2 twins and `exposed` -- is scaled so the picture is exactly SPRITE_HEIGHT tall,
keeping its own width. Nothing is cropped, padded or moved; only the scale changes. Noodle, 2026-09-21:

> chess1V's images were designed such that combat, support, and offense were all designed with the same
> image height in mind. If all of them were 1216, or if all of them were 1408, they would all be
> perfectly sized.

> [1216], because if it's 1408 then we'd have some images needing to be scaled up instead of almost
> always scaling down

WHY IT MATTERS. The game sizes a sprite by its CANVAS, not by the figure drawn on it. When two poses
share a canvas height, a figure drawn shorter in one of them reads as crouching, which is the whole
intent of a support pose. When they do not, the difference is an export accident and the game cannot
tell it from a drawing decision. Anastasia's `1-passive` ended up 650x1300 against her `1-combat`'s
832x1216 for exactly that reason: a 1300 cap in the other art tool shrank her 704x1408 source and left
her 832x1216 source alone.

IT NEVER UPSCALES. A picture already shorter than the standard is written unchanged and named in the
report, because enlarging a drawing to meet a rule costs quality the rule was not worth. Two enemies are
deliberately below it and are listed in SHORT_ON_PURPOSE: the Juggernaut is the one square source and
the Matriarch is drawn landscape, both documented in reference/ART-GUIDE.md §2.

A PORTRAIT, A CUT-IN AND A SCENE PICTURE ARE NOT SPRITES. `0-portrait` is a face at its own size,
`broken`/`recover` are cut-ins framed by their own boxes, and everything under `lust/` or `events/` is a
scene. None of them ever stands beside another of them in one frame, so none of them is touched.

EVERYTHING ELSE KEEPS THE SIZE THE GAME ALREADY USES (2026-09-22). An original is usually far larger than
the picture the game loads: the icons are 1024 square in `_source/` and 256 in the game, and Noodle cut
the card chrome down to 768x980 from 1176x1500 on 2026-09-21 for performance. Once those originals sit in
this archive, converting one at its own size would quietly put the large picture back. So a picture that
is not a sprite pose, whose game copy already exists, is SMALLER, and is the SAME SHAPE (within
SAME_SHAPE_TOLERANCE), is written at the game copy's size. A different shape means a new drawing, which is
written at its own size and named in the report. Nothing is ever enlarged.

ANYTHING THAT IS NOT A .png IS LEFT ALONE, in place, untouched -- the prompt sidecars that sit beside a
generated image are the record of how it was made, they belong beside the original, and they are never
moved or removed.
"""

import argparse
import os
import re
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is missing: python -m pip install Pillow")

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
ARCHIVE = os.path.join(ROOT, "v13 spire png")
GAME = os.path.join(ROOT, "v13 spire images")

#Matches honeycomb.imageFormat in scripts/misc/honeycomb.js. If that constant ever changes, this is the
#other half of the pair and has to change with it.
IMAGE_FORMAT = "webp"

#THE STANDARD SPRITE HEIGHT. Every pose a fighter swaps between is written at exactly this many pixels
#tall. It is the height of `honeycomb.tuning.art.spriteCanvas` (832x1216) in
#scripts/misc/honeycomb/honeycomb-tuning.js, which is the canvas the engine measures every other one
#against -- the two are one number in two files, and suite block [127] fails if they drift apart.
SPRITE_HEIGHT = 1216

#Which files are sprite poses. `0-portrait` is a face, not a pose, and is deliberately absent. Tier 3 is
#the Broken set (2026-09-22, reference/ART-GUIDE.md section 1). `1-broken`/`2-broken` are cut-ins, not poses.
SPRITE_NAME = re.compile(r"^([123]-(combat|offense|passive|damaged|basic)|exposed)$")

#THE CHARACTER CUT-INS ARE WRITTEN AT THE SAME HEIGHT (2026-09-22). They are not poses, but they were
#arriving at 1664x2432 and up -- four times a pose -- and are never drawn taller than the screen. Noodle:
#"please do size the cut-ins to a reasonable amount, 1216 would be fine." Performance B43.
CUT_IN_NAME = re.compile(r"^([12]-broken|recover)$")

#Folders whose drawing is BELOW the standard on purpose, so being short is not reported as a fault.
#Both are documented in reference/ART-GUIDE.md §2: the Juggernaut is the one square source (1024x1024)
#and the Matriarch is drawn landscape (1152x896) and anchored, so height alone already sizes her.
SHORT_ON_PURPOSE = ("enemies/juggernaut/", "enemies/matriarch/")

#How far apart two aspect ratios may be and still count as the same picture at two sizes, as a fraction of
#the game copy's ratio. Resizing to a whole pixel moves a ratio by well under 1%: 1176x1500 -> 768x980 is
#0.03%. A redrawn picture on a new canvas is further off than this and keeps its own size.
SAME_SHAPE_TOLERANCE = 0.01

#88, the same number every other Honeycomb asset is written at (generate-placeholder-art.py, WEBP_QUALITY).
#Method 6 is the slowest and smallest setting; a handful of scene images is not worth tuning down for.
DEFAULT_QUALITY = 88
ENCODE_METHOD = 6


def human(size):
    return "%.0fKB" % (size / 1024.0) if size < 1024 * 1024 else "%.1fMB" % (size / 1024.0 / 1024.0)


def is_sprite_pose(relative):
    """True for a pose a fighter swaps between in place, which is what the standard height governs."""
    parts = relative.split("/")
    if len(parts) < 2 or parts[0] not in ("characters", "enemies"):
        return False
    #A scene or a cut-in sits in its own folder and is not a pose, whatever it is called.
    if "lust" in parts[:-1] or "events" in parts[:-1]:
        return False
    return SPRITE_NAME.match(os.path.splitext(parts[-1])[0]) is not None


def is_cut_in(relative):
    """True for a character's own Broken or recovery cut-in picture, which is written at SPRITE_HEIGHT."""
    parts = relative.split("/")
    return len(parts) >= 2 and parts[0] == "characters" and CUT_IN_NAME.match(os.path.splitext(parts[-1])[0]) is not None


def sprite_scale(image, relative):
    """The picture at the standard height, plus what happened, as (image, note).

    note is None when nothing was needed. It is a sentence otherwise, so the report can say what it
    did rather than the caller guessing from the sizes.
    """
    if not is_sprite_pose(relative) and not is_cut_in(relative):
        return image, None
    if image.height == SPRITE_HEIGHT:
        return image, None
    if image.height < SPRITE_HEIGHT:
        if relative.startswith(SHORT_ON_PURPOSE):
            return image, None
        return image, "shorter than the standard and left alone; enlarging it would cost quality"
    width = max(1, round(image.width * SPRITE_HEIGHT / float(image.height)))
    return image.resize((width, SPRITE_HEIGHT), Image.LANCZOS), \
        "scaled %dx%d -> %dx%d" % (image.width, image.height, width, SPRITE_HEIGHT)


def game_size_scale(image, relative, target):
    """The picture at the size the game already loads, plus what happened, as (image, note).

    Only for a picture that is not a sprite pose and already has a game copy. See the header, "EVERYTHING
    ELSE KEEPS THE SIZE THE GAME ALREADY USES". note is None when the picture is written as it is.
    """
    if is_sprite_pose(relative) or is_cut_in(relative) or not os.path.exists(target) or os.path.getsize(target) == 0:
        return image, None
    with Image.open(target) as current:
        width, height = current.size
    if (width, height) == image.size:
        return image, None
    ratio = image.width / float(image.height)
    gameRatio = width / float(height)
    if abs(ratio - gameRatio) > gameRatio * SAME_SHAPE_TOLERANCE:
        return image, "a different shape from the game's %dx%d, so written at its own size" % (width, height)
    if width > image.width:
        return image, "smaller than the game's %dx%d and left alone; enlarging it would cost quality" % (width, height)
    return image.resize((width, height), Image.LANCZOS), \
        "kept the game's size: %dx%d -> %dx%d" % (image.width, image.height, width, height)


def is_working_path(relative):
    """True for a path with a `_folder` in it: a bench, not a place the game ever looks."""
    return any(part.startswith("_") for part in relative.split("/")[:-1])


def archive_files(only):
    """Every .png in the archive, as (source, target, relative path), in a stable order, and the `_`
    folders that were skipped without being walked, as relative paths."""
    found = []
    skipped = []
    for folder, directories, files in os.walk(ARCHIVE):
        # Pruned in place, which is how os.walk is told not to descend.
        for name in sorted(directories):
            if name.startswith("_"):
                skipped.append(os.path.relpath(os.path.join(folder, name), ARCHIVE).replace("\\", "/"))
        directories[:] = sorted(name for name in directories if not name.startswith("_"))
        for name in sorted(files):
            if not name.lower().endswith(".png"):
                continue
            source = os.path.join(folder, name)
            relative = os.path.relpath(source, ARCHIVE).replace("\\", "/")
            if only and only not in relative:
                continue
            target = os.path.join(GAME, os.path.splitext(relative)[0] + "." + IMAGE_FORMAT)
            found.append((source, target, relative))
    return found, skipped


def is_stale(source, target):
    """True when the .webp needs writing: it is missing, empty, or older than the .png beside it."""
    if not os.path.exists(target) or os.path.getsize(target) == 0:
        return True
    return os.path.getmtime(source) > os.path.getmtime(target)


def convert(source, target, relative, quality, lossless):
    os.makedirs(os.path.dirname(target), exist_ok=True)
    with Image.open(source) as image:
        #Transparency is kept when it is there and never invented when it is not: an RGB picture saved
        #as RGBA carries an alpha channel of solid 255 and costs size for nothing.
        image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
        image, note = sprite_scale(image, relative)
        if note is None:
            image, note = game_size_scale(image, relative, target)
        if lossless:
            image.save(target, "WEBP", lossless=True, method=ENCODE_METHOD)
        else:
            image.save(target, "WEBP", quality=quality, method=ENCODE_METHOD)
    return note


def main():
    parser = argparse.ArgumentParser(add_help=True, description="v13 spire png -> v13 spire images")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--only", default="")
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--quality", type=int, default=DEFAULT_QUALITY)
    parser.add_argument("--lossless", action="store_true")
    options = parser.parse_args()

    if not os.path.isdir(ARCHIVE):
        sys.exit("no archive folder: " + ARCHIVE)

    everything, skipped = archive_files(options.only)
    if not everything:
        print("Nothing matched" + (" for --only " + options.only if options.only else "") + " in: " + ARCHIVE)
        return

    # A `_` folder is never walked (archive_files), so this only catches a file named into one by
    # --only; it is kept as a belt to the braces.
    refused = [row for row in everything if is_working_path(row[2])]
    candidates = [row for row in everything if not is_working_path(row[2])]
    current = [row for row in candidates if not options.force and not is_stale(row[0], row[1])]
    work = [row for row in candidates if options.force or is_stale(row[0], row[1])]

    fresh = [row for row in work if not os.path.exists(row[1])]
    replacing = [row for row in work if os.path.exists(row[1])]

    print("%d .png in the archive -> %s, %s"
          % (len(everything), os.path.basename(GAME),
             "lossless" if options.lossless else "quality %d" % options.quality))
    if fresh:
        print("\nNEW -- nothing is at these paths yet:")
        for source, _target, relative in fresh:
            print("  %-52s %s" % (os.path.splitext(relative)[0] + "." + IMAGE_FORMAT,
                                  human(os.path.getsize(source))))
    if replacing:
        print("\nOVERWRITING -- live game art already exists at these paths:")
        for source, target, relative in replacing:
            print("  %-52s %s -> replaces %s"
                  % (os.path.splitext(relative)[0] + "." + IMAGE_FORMAT,
                     human(os.path.getsize(source)), human(os.path.getsize(target))))
    if current:
        print("\nUP TO DATE -- the .webp is newer than the .png, so these are skipped (--force overrides):")
        for _source, _target, relative in current:
            print("  %s" % relative)
    if skipped:
        print("\nSKIPPED -- a `_folder` is a working bench, not a game path, so these were not looked inside:")
        for relative in skipped:
            print("  %s/" % relative)
    if refused:
        print("\nNOT A GAME PATH -- a `_folder` is a working bench, so these are left where they are:")
        for _source, _target, relative in refused:
            print("  %s" % relative)

    if not work:
        print("\nNothing to do.")
        return

    planArray = []
    sizeArray = []
    for source, target, relative in work:
        with Image.open(source) as image:
            if is_sprite_pose(relative) or is_cut_in(relative):
                _scaled, note = sprite_scale(image, relative)
                if note is not None:
                    planArray.append((relative, note))
            else:
                _scaled, note = game_size_scale(image, relative, target)
                if note is not None:
                    sizeArray.append((relative, note))
    if planArray:
        print("\nSPRITE POSES -- written at the standard height of %d:" % SPRITE_HEIGHT)
        for relative, note in planArray:
            print("  %-52s %s" % (relative, note))
    if sizeArray:
        print("\nGAME SIZE -- a picture the game already loads keeps the size it loads it at:")
        for relative, note in sizeArray:
            print("  %-52s %s" % (relative, note))

    if not options.apply:
        print("\nNothing was written. Add --apply to convert. The .png originals are never touched.")
        return

    print("\nWRITING:")
    written = 0
    for source, target, relative in work:
        try:
            note = convert(source, target, relative, options.quality, options.lossless)
        except Exception as error:                                  # noqa: BLE001 - reported, not raised
            print("  FAILED %s: %s" % (relative, error))
            continue
        written += 1
        print("  %-52s %s%s" % (os.path.splitext(relative)[0] + "." + IMAGE_FORMAT,
                                human(os.path.getsize(target)),
                                "" if note is None else "   [" + note + "]"))

    print("\nwritten: %d of %d; .png kept: %d (every one of them)" % (written, len(work), len(everything)))


if __name__ == "__main__":
    main()
