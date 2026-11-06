# Handoff: engine library

Read this first. It says where the work stands and what to do next. It is rewritten at each checkpoint and gate. The history is in [build-log.md](build-log.md).

Last updated: 2026-11-05. The code checkpoint is `e13290b`. The documentation commits follow it on `engine-library`, and `origin` is up to date with the branch (section 9).

---

## 1. Where things stand

- **Project.** A Duramax LLY test-cell app (Three.js, Vite 8), being turned into an engine library: any engine runs from its own data, and every number carries a recorded source. The design is [engine-library-plan.md](engine-library-plan.md). The rules and packages are [agent-runbook.md](agent-runbook.md). The plan to the MVP is [mvp-plan.md](mvp-plan.md).
- **Local repository.** `C:\Users\colin\Documents\DeepSeek\engineroom` (Windows 11).
- **Branches.** `engine-library` is the working branch. `master` is the base, at `864f014` (the app before the refactor).
- **Remote: `origin`** is `https://github.com/colinstephens93/duramaxsimulator.git`. The repository was empty until 2026-11-05, when `master`, `engine-library` and the four tags were pushed to it. Pushes use Git Credential Manager; the GitHub CLI (`gh`) is not installed. Section 9 gives the push commands.
- **Tags.** `phase-0-start` (`864f014`), `phase-0-done`, `phase-1-done`, and `phase-2-done` (`9194098`). Tags mark approved gates only.
- **Latest code checkpoint.** `e13290b`, "WIP: Phase 3 checkpoint, registry and environment split (3.1 to 3.2b)". It is a checkpoint, not a gate, and it is not tagged.
- **Working tree.** Clean after the documentation commit.

## 2. Phase status

| Phase | Status | Evidence and notes |
| --- | --- | --- |
| 0. Safety net | Done, gate approved | `phase-0-done` |
| 1. LLY into one entry | Done, gate approved | `phase-1-done` |
| 2. Core reads the entry | Done, gate approved 2026-11-05 | `phase-2-done`. The review after the gate found that the family and kinematics still read the LLY module. That gap is the first work in Phase 3 (decision D2). |
| 3. Switching at runtime | In progress | 3.1, 3.2a and 3.2b done (lead-verified; checkpoint `e13290b`). 3.3a has its prompt ready. 3.3b to 3.3d and 3.4 to 3.8 not started. |
| 4. LBZ | Not started | Blocked on decisions D4 to D6 |
| 5. Inline-six | Post-MVP | Cut from the MVP (decision D1) |
| 6. Hardening and cleanup | Not started | |

## 3. Verification at the checkpoint (`e13290b`)

- **`npm test`:** 207 pass, 0 fail. 37 suites in 11 test files.
- **`npm run check`:** PASS, 0 of 5 failed. Names 0 matches. Numbers 0 matches. Encoding 0 matches. IDs 0 matches. Provenance: 229 values, 65 records, 0 without a record.
- **`npm run build`:** passes, 45 modules, bundle `index-a5BqzR3z.js`. The `copy.js` INEFFECTIVE_DYNAMIC_IMPORT warning and the chunk-size warning are expected.
- **`npm run baseline:compare`:** exit 0 on Chrome 157.0.8103.39 (ANGLE, Intel Arc 140V, Direct3D 11). Trace PASS, Geometry PASS, six views PASS. The home view shows 0 or 1 pixel at channel delta 1; that render noise varies between runs. No console errors.
- **Lead review of 3.2b.** Each branding string appears as a quoted literal in HEAD's `src/environment.js`. The gauge divisors equal the old constants over 70,399 sample rpm values. The file sizes match the harness's: `cell.js` 1,381 lines, `stand.js` 548, `lly/index.js` 654.
- **SHA-256 at the checkpoint:** `src/environment/cell.js` `189FDCE00E297DC7EC9062FFE0C8E70F461069783F17529B444D3E8B285C09C8`; `src/environment/stand.js` `B6EFF40FBE63D02D8486953B05B026A81FC437629A4AA5B12AB43A4477C4F3D0`; `src/engines/lly/index.js` `EAF77F33141856480C7E798312D569D03262045F1E764C756D9438BD03897F6A`.

## 4. Next step

1. **The human decides D1 and D2.** The defaults are set (section 5). Say so if you disagree.
2. **Run the 3.3a prompt:** [prompts/3.3a-family-takes-entry.md](prompts/3.3a-family-takes-entry.md), in the harness (Windows PowerShell 5.1). It is revised for PowerShell and is ready to run.
3. **The lead verifies** the result (mvp-plan section 5.2), writes the review entry in `build-log.md`, and updates this file. A WIP checkpoint is made only when the human asks.
4. **Then 3.3b, 3.3c and 3.3d**, then 3.4 to 3.8 and the Phase 3 gate (mvp-plan section 4.1). Each prompt is saved in `docs/prompts/` before it runs.

## 5. Open decisions

The human decides these. The default applies if nobody answers before the package that needs it. The full text is in [mvp-plan.md](mvp-plan.md) section 7. When a decision is made, update both places.

| ID | Question | Default | Needed before |
| --- | --- | --- | --- |
| D1 | MVP = Phases 0 to 4 and 6; Phase 5 out? | Yes | Phase 4 |
| D2 | The Phase 2 gap is Phase 3 work; Phase 2 gate not reopened? | Yes | 3.3a |
| D3 | GitHub remote | Resolved 2026-11-05: `origin` is `https://github.com/colinstephens93/duramaxsimulator.git`, and the branches and tags are pushed | Done |
| D4 | LBZ rod length: 163.0 mm (`medium`) or `null`? | 163.0 mm, with a note | 4.1 |
| D5 | LBZ valve timing and lift (a gap): LLY's values labelled `design`, and amend rule 7? | Yes, and yes | 4.1 |
| D6 | LBZ behaviour and look values (not in the research): LLY's values labelled `design`? | Yes | 4.1 |
| D7 | Disposal by an ownership walk, not a resource tracker? | Yes; a deviation from plan section 7 | 3.5 |
| D8 | Audio firing above 80 rpm and the engine's firing gate at 90 rpm: keep both? | Keep both; record why | 3.3d |
| D9 | QA gaps: fix the pointer-lock rejection and the prop collision; leave three open? | Fix the two; leave three open | 6.8 |
| D10 | Stand values per engine, and the dyno label, in Phase 5? | Phase 5 (accepted by running 3.2b) | Post-MVP |
| D11 | Injector wording in the copy ("piezoelectric" vs the research's solenoid) | Keep "piezoelectric" until decided | 6.1 |
| D12 | Console chair: the new position outside the walk circle | The lead proposes; the human approves | 6.6 |
| D13 | LLY rod length 184 mm to 163.0 mm as a separate logged change | Not in the MVP | After the MVP |
| D14 | Commit author and trailer | Git user Colin Stephens; trailer `Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>` | Every commit |

## 6. Known issues and nits (none blocks the next package)

- **`src/environment/stand.js` lines 388–389** carry the dyno label `DYNO` and `EDDY CURRENT ABSORBER · 1,000 LB-FT`. The rating duplicates `dyno.ratedLbFt`. It moves with the stand values in Phase 5 (D10). The Numbers check does not match `1,000`, so it passes.
- **`cell.setBranding` has no test yet.** The baseline covers the build path only. The swap (3.3d) calls it, and the browser test (3.6) should check the label text.
- **The redline fallback.** `src/environment/cell.js` falls back to `redlineRpm = 1` when no entry is passed, which pegs every gauge bar. `main.js` always passes the entry, so nothing shows it. Make the entry required in 3.3c or 3.3d.
- **The family and kinematics read the LLY module** (D2; 3.3a and 3.3b).
- **`src/engines/active.js`** still binds `main.js`, `specs.js` and `collision.js` (3.3d). Until it is removed, every build prints the `copy.js` INEFFECTIVE_DYNAMIC_IMPORT warning.
- **The model has no `telemetry()` and no `dispose()`** (3.3d and 3.5).
- **Bundle size.** The bundle is about 1.3 MB, and Vite warns above 500 kB. Code-splitting each engine is in the plan, and `check:dist` checks it (6.5).
- **`src/engines/schema.js`** has an unused `skipCurves` branch.
- **`tests/registry.test.mjs`.** The bank-cadence test checks the flag only; it does not assert that there are two banks.
- **`tests/audio-pulses.test.mjs` line 7** has an outdated comment.
- **`docs/build-log.md` line 3335** has the leftover phrase "No 2.7 work started". It is history, not a current claim.
- **`scripts/check.mjs`.** The IDs check hard-codes `lbz` and `generic-i6` as planned IDs, on purpose.
- **The Numbers rule** covers 3250, 3000, 3200 and 26000, as the plan defines it. It does not cover 2500 or `1,000`.
- **`docs/qa-recipe.md`** line numbers were checked on 2026-11-05. They drift as code moves; search for the symbol if a number misses.

## 7. Known QA gaps (from [qa-recipe.md](qa-recipe.md), section g)

- **Walk mode has no prop collision.** Fixed in 3.7.
- **The outline's hidden-edge colour is nearly invisible.** Open (D9).
- **`requestPointerLock` can reject as an uncaught promise** in `enterWalk()` and in the canvas pointerdown handler. Still present at the checkpoint (`src/main.js` lines 454 and 1305). Fix in 6.8 if D9 says so.
- **The quick-part buttons for internal parts show nothing in the assembled view.** Open (D9). Not re-checked since Phase 2.
- **The default exploded-view camera is too wide.** Open (D9).
- **Injector wording** is open (D11).

## 8. How to resume (any AI tool or contributor)

1. Read [AGENTS.md](../AGENTS.md), then this file, then [mvp-plan.md](mvp-plan.md) sections 1, 2 and 4.
2. `git status --short` should be empty. `git log --oneline -4` should show the documentation commits on top of `e13290b`. `git ls-remote origin` should show `engine-library` at the SHA that `git rev-parse engine-library` prints, once the latest commit has been pushed.
3. `npm test` should report 207 passing. `npm run check` should report PASS, with 229 values, 65 records and 0 without a record.
4. Check section 5 for any decision the next package needs. If one is open, stop and ask the human.
5. Run the next package's prompt (section 4). Verify it, and log it. Do not commit, tag or push unless the human asks.
6. On a new machine, `npm run baseline:compare` fails until the git-ignored PNG baseline in `.qa/baseline/` exists. [harness-notes.md](harness-notes.md) gives the steps to recreate it, and says that needs the human's approval.

## 9. GitHub

`origin` is `https://github.com/colinstephens93/duramaxsimulator.git`. The repository was empty until 2026-11-05, when `master`, `engine-library` and the four tags were pushed. GitHub's default branch is `engine-library`.

Push only when the human asks, and only to `origin`:

```bash
git push origin engine-library
git push origin master
git push origin --tags
```

Check that the remote matches the local branches:

```bash
git ls-remote origin
git rev-parse master engine-library
```

The local and remote SHAs must match after each push. Never force-push.

Every commit carries the git author configured on this machine. If the repository is public, that author is visible in its history.

## 10. Files that matter

- [../AGENTS.md](../AGENTS.md): start here.
- [mvp-plan.md](mvp-plan.md): the executable plan, with decisions in section 7.
- [engine-library-plan.md](engine-library-plan.md): the design. Section 11 holds the decision log.
- [agent-runbook.md](agent-runbook.md): the rules, stop conditions, gates and packages.
- [build-log.md](build-log.md): the history. Append only.
- [qa-recipe.md](qa-recipe.md): how to drive and check the app.
- [harness-notes.md](harness-notes.md): Windows PowerShell 5.1 and tool notes.
- [prompts/](prompts/): the harness prompts.
- [research/](research/README.md): the values. The authority. The build does not edit it.
- [../lly_report.md](../lly_report.md) and [../prompt_v2.md](../prompt_v2.md): the original notes and brief. Historical.
