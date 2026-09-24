# webui/tools — the index

**Read this before building a tool.** Fourteen already exist here and nobody, including the person
who wrote them, can name them from memory. A session that skips this line writes the fifteenth
version of something — that has happened.

One line each: the question it answers. Run any of them with no arguments for its own usage header.

| Tool | Answers |
|---|---|
| `webui2-inspect.js` | **What does this tag actually do?** `who` (a character's real outfits and pose methods), `explain` (what one shortcut expands to, removes, and adds to the negative), `cover` (the reverse index — which shortcut already covers tags typed out by hand), `audit` (a character's methods and outfits scanned against the rules for what the image is FOR). `tags` (a verdict per tag on a line as typed — kept, aliased, culled, uncategorised or dropped). Works by diffing compiles, so it never goes stale. |
| `webui2-diff.js` | **Do v1 and v2 disagree on this prompt?** Runs both engines side by side, in bulk, headlessly. |
| `webui2-test.js` | **Is the engine still correct?** The headless suite. Run after any dictionary edit, not only after code. |
| `webui2-dispatch-test.js` | **Does the job reach Forge intact?** The dispatch seam. |
| `webui2-generate.js` | **Generate images from a combo block.** The general-purpose sender: it takes a block exactly as it would be pasted into the webui, compiles every variant with the v2 engine in a Node `vm` context — the same calls in the same order as `sendPromptArray` / `sendPrompt` — and POSTs each one to Forge with the `Prompt Notes` entry the page attaches. No browser. `--mode dry` sends nothing and says how many prompts the block compiles to (run it first; a stray blank line multiplies a combo group instead of listing it). `--mode run` writes the PNGs where `--out` says, named by the block's own `- ` comment lines or by `--names`, each with a `.txt` sidecar holding its `parameters` chunk. **The sidecars are the point:** the PNG carries that chunk itself only until someone opens it in a paint tool and saves, and the seed is then gone for good. Seeds are generated explicitly rather than left at -1 so they survive in the log and the sidecar too. Style defaults to `Oreteki18kin`; `Syurofluff*` is Syrup Town's. **Regional Prompting works here too** — it loads `webui-regional.js` and reads the `rp` trigger exactly where the page does, so `rp1-1 latent, brienne {…}, nettle {…}` generates a two-character shot with one figure per region. Waits while Forge is busy with somebody else's job. Needs Forge reachable; starts nothing. |
| `webui2-category-test.js` | **Do v1 and v2 categorise the same tag the same way?** Equivalence harness. |
| `webui2-lint.js` | **Is charactersDB well-formed?** Entries that are unreachable, inert, or duplicated. Its parser is forgiving in the worst way; this is what catches that. |
| `webui2-unknown.js` | **Which tags belong to no category?** A tag with no category never culls and never sorts. |
| `webui2-guess.js` | **Where would these uncategorised tags probably go?** Proposes, does not apply. |
| `webui2-sort.js` | **Move sorted tags into their dictionaries.** Dry run by default; `--apply` writes. |
| `webui2-characters.js` | **What state is charactersDB in?** Sex-twin pairs, drift between the two files, redundancy. |
| `webui2-names.js` | **Which namesArray block owns this codename?** Read TODO §0.5 first — 170 names are claimed twice and the two kinds of duplicate need opposite treatment. |
| `webui2-franchise.js` | **Import animadex franchises** into brandsDB2. |
| `webui2-animadex.js` | **What is in the animadex import?** Survey, before trusting it. |
| `webui2-handedits.js` | **What did Noodle change by hand after the tool handed him the prompt?** Recompiles a generated image's own `Raw input` and diffs it against the positive prompt that actually reached the model; the difference was typed into Forge. Sweeps 2,000 sidecars that already exist, so nothing has to be logged from here on. **Sorted by how many separate DAYS a tag appears on, not by image count** — a shortcut whose definition has changed reports as a hand edit on every image of one batch, and the days column is what tells the two apart. `--show` for one image, `--since` to cut to a window where the dictionaries have not moved. Findings go in `.claude/skills/syrup-town-images/reference/corrections.md`. |
| `forge-prompt-notes.py` | Forge-side companion; runs next to Forge, not here. |

## Rules

- **Anything that writes is dry-run by default** and needs `--apply`. Keep it that way.
- **A dictionary edit is a behaviour change.** `webui2-test.js` after data edits, not just code edits.
- **Nothing here reaches the network.** `testing = true` stops `sendPrompt` before the POST, and the
  sandbox's `fetch` throws. If a new tool needs the network, it does not belong in this folder.
- **Adding a tool means adding its row above**, in the same sentence-shaped form: the question it
  answers, not a description of how it works.
