# Prompt Notes — a Forge-side companion to the webui engine.
#
# NOT loaded by the game. This file belongs on the Forge machine, at:
#     <forge root>/extensions/prompt-notes/scripts/prompt_notes.py
# then restart Forge. It is kept in the repo so it lives next to the client code
# that drives it rather than only inside an install nothing else tracks.
#
# Every field written into extra_generation_params becomes a "Key: value" pair in
# the PNG infotext and the .txt sidecar. Forge quotes any value containing a
# comma on the way out — which is why the RP footer reads `RP Ratios: "1,1"` —
# so notes may contain commas freely.
#
# Driven over the API the same way Regional Prompter is:
#
#     "alwayson_scripts": {
#         "Prompt Notes": { "args": ["rp 1-1, frieren, fern", "frieren, fern, ...", ""] }
#     }
#
# "Clean prompt" is the point of the whole thing for regional shots: the prompt
# actually sent carries BREAKs and, for a cutaway, the main subject twice. Those
# cost nothing at generation time and break every downstream script, so the
# unscaffolded version travels alongside the image.
#
# Args are positional and in the order ui() returns them. Adding a field means
# adding a Textbox here, a name in FIELDS, and one more array slot on the client.

import gradio as gr
from modules import scripts

# Label shown in the footer  ->  label shown in the Forge UI.
# The footer key is what ends up in the .txt, so keep these short and stable:
# renaming one silently breaks any search across previously generated images.
FIELDS = [
    ("Raw input",    "Raw input — the shorthand exactly as typed, before the engine compiled it"),
    ("Clean prompt", "Clean prompt — the compiled prompt without BREAKs or duplicated regions"),
    ("Notes",        "Notes — free text, whatever is worth remembering about this run"),
]

# The field the actually-sent prompt is demoted to when it gives up line 1.
#
# It was "RP-Compatible" while BREAKs were the only thing line 1 lost. Renamed
# because the style LoRA and the universal quality tags come off line 1 too, so a
# non-regional shot was carrying a field named after an extension it never
# touched.
#
# This is the reproducibility record: line 1 is what to feed back in, this is
# what was actually sent.
GENERATED_FIELD = "Generated prompt"

# Whether to write that field when the only difference is a SUFFIX.
#
# False, since 2026-08-26. On an ordinary image the sent prompt is exactly the
# clean prompt with the style LoRA and the universal quality tags appended - the
# same constant tail on every image this client has ever produced - so the field
# was a near-duplicate of line 1 in every footer, differing only by a string that
# is identical everywhere and therefore tells nobody anything.
#
# On a REGIONAL image the difference is interleaved rather than appended: BREAKs
# sit between the regions and a cutaway repeats its subject. That is not a suffix,
# the prefix test below fails, and the field is written - which is the case it
# existed for.
#
# Set True to have it on every image again.
KEEP_GENERATED_WHEN_ONLY_SUFFIX = False

# Where the two prompts end up in the saved .txt.
#
#   True   line 1 carries the CLEAN prompt — no BREAKs, no duplicated cutaway
#          regions, newlines intact — and the prompt actually generated from is
#          demoted to the `RP-Compatible` field. A regional image and an ordinary
#          one then have the same shape, so one bulk-cleanup pass reads both and
#          nothing downstream has to know the extension exists.
#
#   False  the other way around, and how Forge behaves without this script: line
#          1 is the prompt generated from, BREAKs and all, with the clean version
#          in the `Clean prompt` field.
#
# UNVERIFIED — written 2026-08-09 against a machine that could not run it. It
# rests on postprocess_image running before the image is saved. Confirm with one
# regional generation: if line 1 still has BREAKs in it, the hook fires too late,
# and setting this back to False restores the previous behaviour exactly.
#
# The swap only ever changes what is RECORDED. Conditioning happened long before
# this hook, so the image itself is identical either way.
REPLACE_PROMPT_WITH_CLEAN = True

# Belt and braces for while the swap above was unproven: it kept writing
# `Clean prompt` as a field even though line 1 was supposed to carry it, so a
# swap that silently failed could not lose the clean prompt.
#
# OFF since 2026-08-09 — the swap was confirmed working on a real generation, and
# the field was an exact duplicate of line 1. Turn it back on if a Forge update
# ever moves postprocess_image after the save, which is the one thing that would
# make line 1 revert to the BREAK-laden prompt.
KEEP_CLEAN_FIELD = False


def _only_appends(clean, generated):
    """True when `generated` is `clean` with something stuck on the end.

    Whitespace is normalised on both sides first: the client joins the renderer's
    per-figure groups with ",\n" and the tail is appended after a plain ", ", so
    an exact prefix test fails on the newline alone.
    """
    a = " ".join(str(clean).split())
    b = " ".join(str(generated).split())
    return bool(a) and b.startswith(a)


class PromptNotesScript(scripts.Script):
    # Must match the alwayson_scripts key sent by the client, case-insensitively.
    def title(self):
        return "Prompt Notes"

    def show(self, is_img2img):
        return scripts.AlwaysVisible

    def ui(self, is_img2img):
        boxes = []
        with gr.Accordion("Prompt Notes", open=False):
            for key, label in FIELDS:
                boxes.append(gr.Textbox(label=label, value="", lines=2))
        return boxes

    def process(self, p, *args):
        # Blank fields are skipped rather than written empty, so a footer only
        # ever carries the keys that were actually used and stays readable.
        for (key, _label), value in zip(FIELDS, args):
            text = str(value).strip() if value is not None else ""
            if text:
                p.extra_generation_params[key] = text

    # Runs once per image, just before it is written out. create_infotext takes
    # line 1 from p.all_prompts, so rewriting that entry here is what moves the
    # clean prompt to the front.
    def postprocess_image(self, p, pp, *args):
        if not REPLACE_PROMPT_WITH_CLEAN:
            return

        clean = str(args[1]) if len(args) > 1 and args[1] else ""
        if not clean.strip():
            return

        # THIS image's entry, not every entry. The client sends one prompt per
        # request so they are all identical today, but a wildcard extension or a
        # batch count gives each image its own prompt, and blanket-replacing
        # would relabel images with a neighbour's text. The arithmetic is the
        # same create_infotext uses to pick its own index.
        batch_size = getattr(p, "batch_size", 1) or 1
        index = getattr(p, "iteration", 0) * batch_size + getattr(p, "batch_index", 0)

        generated = ""
        all_prompts = getattr(p, "all_prompts", None)
        if all_prompts and 0 <= index < len(all_prompts):
            generated = all_prompts[index]
            all_prompts[index] = clean
        else:
            generated = getattr(p, "prompt", "")

        prompts = getattr(p, "prompts", None)
        batch_index = getattr(p, "batch_index", 0)
        if prompts and 0 <= batch_index < len(prompts):
            prompts[batch_index] = clean

        # Only worth recording when it differs in a way that MATTERS.
        #
        # Identical strings are the trivial case. The one that actually mattered
        # is the near-identical one: an ordinary image's sent prompt is the clean
        # prompt plus a constant tail, and recording that in every footer is a
        # second copy of line 1 with the same suffix bolted on. A regional image
        # differs in the MIDDLE - BREAKs between regions - so the prefix test
        # fails and the field is written.
        if generated and generated.strip() != clean.strip():
            if KEEP_GENERATED_WHEN_ONLY_SUFFIX or not _only_appends(clean, generated):
                p.extra_generation_params[GENERATED_FIELD] = generated

        if not KEEP_CLEAN_FIELD:
            p.extra_generation_params.pop("Clean prompt", None)
