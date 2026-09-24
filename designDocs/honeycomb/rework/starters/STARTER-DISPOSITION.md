# STARTER-DISPOSITION — retiring and graduating the replaced starters

The new starting decks (session 25) replaced the old ones. Under STARTER-REWORK-01 §1.2 every former
starter must be **removed for redundancy**, **placed behind a node/outfit**, **made a relic**, or
**graduated into a common/rare**. This is that ledger.

**Key fact:** `starter` rarity is never offered (`tuning.reward.offerableRarityArray` is
`["common","rare"]`), so any old card still on `starter` is unobtainable right now. Session 20 already
graduated eleven of them to `common` (Shield Bash, Challenge, Tithe, Infect, Miasma, Pollen Kiss, Claw
Flurry, Mark Prey, Blood Pact, Transfusion, Crystal Gaze). These are the rest.

**RETIRE** = delete from `cardArray` (+ its `cardSfxMap` entry). **GRADUATE** = set the rarity so it
becomes offerable again. The new basic already carries the name, effect and progression ladder where a
name is reused, so a retired card is superseded, not lost.

**Status (session 25):** the ten GRADUATE rows are DONE. `nettleReap`, `severineArc`, `cassadoraFizzle`,
`cassadoraTurncoat`, `cinderFallBack`, `cinderCharge`, `clemenceConfide`, `clemenceSoftWords` are now
`common`; `severineEnthrall` and `clemencePrayer` are `rare`. The five new basics whose old holders named
a starter broken form took it over — `brienneGrit`→Backs to the Wall, `nettleVenomTouch`→Pollen Burst,
`severineRend`→Prey No More, `cassadoraWispBolt`→Turned Coat, `cinderSwitch`→Misstep — so the
starter-rank broken-form coverage survives the retirements. Suite **1282/0**. The ten RETIRE rows are
still present on `starter` (thus unobtainable) and are deleted with the tree rewrite + test migration.

| Old card | Index | Action | Target | Why |
|---|---|---|---|---|
| Sword Strike | `brienneStrike` | RETIRE | — | `brienneCleave` is the same card and now owns the name |
| Brace | `brienneGuard` | RETIRE | — | `brienneGrit` is the same card and now owns the name |
| Grave Touch | `nettleStrike` | RETIRE | — | redundant plain damage; Noodle's own "unflavorful" example |
| Wither | `nettleWither` | RETIRE | — | name + identity now the new `nettleVenomTouch`; session 24: "not blindly graduated" |
| Reap | `nettleReap` | GRADUATE | common | audit KEEP, "poison's fair payoff" |
| Enthrall | `severineEnthrall` | GRADUATE | **rare** | audit KEEP; a 7-Lust bomb, session 24 flagged it — rare, not common |
| Drain | `severineDrain` | RETIRE | — | `severineQuaff` is the same card and now owns the name |
| Crimson Arc | `severineArc` | GRADUATE | common | audit KEEP; the AoE body, session 24 flagged it |
| Wisplight | `cassadoraBolt` | RETIRE | — | `cassadoraWispBolt` now owns the name |
| Second Thoughts | `cassadoraSecondThoughts` | RETIRE | — | `cassadoraUnravel` now owns the name |
| Fizzle | `cassadoraFizzle` | GRADUATE | common | audit KEEP |
| Turncoat | `cassadoraTurncoat` | GRADUATE | common | audit KEEP |
| Lance Thrust | `cinderThrust` | RETIRE | — | `cinderImpale` now owns the name |
| Fall Back | `cinderFallBack` | GRADUATE | common | audit KEEP, "the step that feeds the charge" |
| Flame Charge | `cinderCharge` | GRADUATE | common | audit KEEP |
| Change Places | `cinderChangePlaces` | RETIRE | — | `cinderSwitch` now owns the name |
| Offering | `clemenceOffering` | RETIRE | — | `clemenceGrant` now owns the name (the heal) |
| Fervent Prayer | `clemencePrayer` | GRADUATE | **rare** | energy generation was too strong as a free starter; fine as a rare |
| Confide | `clemenceConfide` | GRADUATE | common | session 24: "not a relic" → it is a card |
| Soft Words | `clemenceSoftWords` | GRADUATE | common | audit KEEP |

**Too powerful to graduate as-is, hence RETIRE rather than common:** Sword Strike / Brace / Drain /
Lance Thrust / Wisplight / Second Thoughts / Change Places / Offering are retirements for the plain
reason of name-and-effect reuse, not power. The only genuine power flags in the retired set are
**Wither** (dense poison on-ramp, superseded by the new Wither + its ladder) and **Grave Touch** (a
second vanilla body in a one-body starter).

**Engine follow-up for the RETIRE set:** five of the retired indices are still referenced by old content
that the tree rewrite is about to delete (`brienneStrike` Duelist's Blade, `nettleMiasma` `netRot`,
`severineBloodPact` `severinePact`, `cassadoraCrystalGaze` `casStill`, `clemenceOffering` `clmGrace`),
and ~80 test assertions name retired starters and must be repointed at the new equivalents. Removals run
after those.
