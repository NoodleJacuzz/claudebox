# ART-GUIDE section 1, as it stood before 2026-09-22

Replaced by Noodle's image list (the 1/2/3 tiers, the cut-ins and their backups). Kept so the old nine-file
layout can be looked up; it is no longer the rule.

## 1. Characters — 9 files per outfit

```
characters/<character>/<outfit>/0-portrait      face, square
characters/<character>/<outfit>/1-basic         standing        ┐
characters/<character>/<outfit>/1-damaged       recoiling       │ healthy
characters/<character>/<outfit>/1-offense       attacking       │
characters/<character>/<outfit>/1-passive       gesturing       ┘
characters/<character>/<outfit>/2-basic                         ┐
characters/<character>/<outfit>/2-damaged                       │ hurt (below 50% HP)
characters/<character>/<outfit>/2-offense                       │
characters/<character>/<outfit>/2-passive                       ┘
```

The leading number is a **health tier**, the word is a **pose**. Files sort into a readable order
inside the folder: portrait, then all four healthy poses, then all four hurt ones.

| Pose | When it shows | Duration |
|---|---|---|
| `basic` | resting | held |
| `damaged` | struck by anything | ~180ms |
| `offense` | plays an **attack** card | ~220ms |
| `passive` | plays a **skill / power / curse** card | ~220ms |

`damaged`, `offense` and `passive` are held briefly then revert to `basic` — they are single frames,
not animations. Timings live in `honeycomb.tuning.animation`.

