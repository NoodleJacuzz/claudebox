# Carrying the cloud sessions home

Written 2026-09-26, the last cloud session. Everything the cloud sessions produced is documentation
under `designDocs/honeycomb/`, plus one report file and a README line in `designDocs/playtest_notes/`
from the final day. Measured against the upload of 2026-09-24:

| What | Count |
|---|---|
| Files under `scripts/` changed | 0 |
| Files under `designDocs/honeycomb/` added | 51 |
| Files modified in place | 18 |
| Files moved (mostly into `Archive/demo1/`) | 127 |
| Files removed: 9 docs re-filed under `Archive/demo1/` at the same relative path, 3 `.pyc` caches | 12 |

Nothing in this repository belongs to Desktop Claude's settings. The `.claude/` folder was never
uploaded, and the `CLAUDE.md` at this repository's root is the cloud copy's own brief. **Copy neither.**

## The procedure

1. Download this branch as a ZIP and unzip it anywhere outside the game repo:
   `https://github.com/NoodleJacuzz/claudebox/archive/refs/heads/claude/desktop-migration-blockers-63w5vu.zip`
2. Open a PowerShell window in the unzipped folder's `migration\` and dry-run:
   ```
   powershell -ExecutionPolicy Bypass -File migrate-to-desktop.ps1
   ```
   It stops if the desktop edited anything under `!designDocs` since the upload (`git status` and
   `git log --since=2026-09-24`). If it lists commits, read them: a doc the desktop changed and the
   cloud also changed needs a hand merge before `-Apply`; anything else, re-run with `-IgnoreDesktopEdits`.
3. Read the dry run. Every line is a move into a quarantine folder under `%TEMP%` or a copy. No line
   should name `scripts\`, `.claude\`, `desk\data\` or `tools\balance\results\`.
4. Apply:
   ```
   powershell -ExecutionPolicy Bypass -File migrate-to-desktop.ps1 -Apply
   ```
5. Verify from the game repo root (`syrup-town`):
   ```
   node "!designDocs/honeycomb/tools/feedback-audit.js"    OK -- 142 items open
   node "!designDocs/honeycomb/tools/doc-links.js"         exit 0 (any MISSING names a .claude/ file)
   node "!designDocs/honeycomb/tools/test-honeycomb.js"    2805 passed, 0 failed
   ```
6. Commit the result in the game repo. Delete the quarantine folder once the checks pass.

Line endings: files the cloud rewrote are LF; untouched files keep their CRLF. Git may show
whole-file diffs on the rewritten ones. Harmless.

## After the copy: what Desktop Claude reconciles

- **`.claude/CLAUDE.md`** describes the tree as it stood before 2026-09-25. The layout is now four root
  files plus one folder per pipeline (`BASICS.md`, "Documentation rules"). Any line naming
  `FEEDBACK-NN.md`, `Archive/FEEDBACK-NN-DONE.md`, a workstream folder such as `rework/` or
  `lust_events/`, or the suite at the honeycomb root is stale.
- **The `honeycomb-session` skill** (synced to the account) has the same problem: its step 3 names a
  live `FEEDBACK-NN.md`; its suite command omits `tools/`; its documentation section names
  `Archive/FEEDBACK-NN-DONE.md`. The replacement for all three is the "Documentation rules" section of
  `BASICS.md` and the two commands in `CATCH-UP.md`.
- **The review rule** Noodle asked to have recorded "in your claude file" (2026-09-25) is in
  `BASICS.md` ("Design review happens on the desktop, in the frame"). If `.claude/CLAUDE.md` is where he
  meant, add the one line there too.

- **Noodle's batch of 2026-09-26**, verbatim and tiered, is waiting in two places: the Honeycomb half in
  `!designDocs/honeycomb/FEEDBACK.md` (inbox IN-10 to IN-24), the Syrup Town, memory-leak and WebUI half
  in `!designDocs/playtest_notes/REPORTS-2026-09-26.md`. Tier 1 is the first work after the checks pass.

## The prompt for Desktop Claude

> Honeycomb. The cloud sessions ended; their work is documentation only, and it is in the unzipped
> folder at `<PATH TO THE UNZIPPED FOLDER>`. Read `migration\MIGRATE-TO-DESKTOP.md` there first.
> Run `migration\migrate-to-desktop.ps1` as a dry run, show me its output, and stop. Do not copy the
> repository's `CLAUDE.md`, and do not touch `.claude\`, `scripts\` or `desk\data\`. When I say go,
> run it with `-Apply`, then run the three checks the document lists and show me the numbers. Then
> read the new `!designDocs\honeycomb\BASICS.md` and `CATCH-UP.md` and reconcile your own
> `.claude\CLAUDE.md` and the honeycomb-session skill with the new layout, as the document's
> "After the copy" section says. Commit when the checks pass. Then read my batch of 2026-09-26 in
> `FEEDBACK.md`'s inbox and `!designDocs\playtest_notes\REPORTS-2026-09-26.md`, file each Honeycomb
> item into its pipeline, and start on tier 1.
