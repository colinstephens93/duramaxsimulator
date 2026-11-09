# Cloud development validation

Date: 2026-11-06. D15 was approved after task 1. The task-2 reference remains unchanged. Current comparisons also require the explicitly approved 3.3a capture-helper and 3.3d runner migration hashes below. Current application status is in [handoff.md](handoff.md); migration decisions are in [the 3.3d record](prompts/3.3d-runtime-switching.md).


## Current Phase 6 workflow (2026-11-08)

Phase 6 intentionally corrects one stored calibration label and moves the chair outside the walk circle. The original supplemental reference remains preserved at .qa/cloud/reference; it is historical and its original-input hashes correctly reject the changed numeric fixture. Do not use the historical comparison commands below for current acceptance.

The expressly approved re-capture uses a separate fixed .qa/cloud/reference-phase6 target and records current source/harness/original-file hashes and baselinePurpose. It never overwrites either reference. Default capture still requires unchanged source; only the explicitly approved Phase 6 command permits the documented uncommitted application changes.

```bash
# Once only, in the authorized 6.6 package; refuses an existing target.
node scripts/cloud-baseline.mjs capture-phase6 --approved-phase6-recapture
# Independent current comparison; never refreshes the reference.
node scripts/cloud-baseline.mjs compare-phase6
```

Capture helper migration is hook-name-only: 6a35a9d78eb2bb2710c3c0de11fbb294a61b05e7e8377a0bcac4ca05b1ce8630 → 86c1c8b65055e5d9c82fd029d4dcf54f5978ad26a1745172f9a8b74a1097998f. Phase-6 runner extension: 63bc7c25c8d46c78346039eb36c4234b2011d528fa2caac86173674d68947493 → 0cda34e27727a17fa629b19e9fd83f915ff6b61c385535c83cf9f5f04c20148b. New captures record those actual files; compare-phase6 requires them unchanged. Comparator, thresholds, renderer policy and capture scenarios are unchanged. Missing/invalid approval and unknown options fail before browser work. Original Windows visual/manual/audio/FPS acceptance remains outstanding; this software reference does not replace it.

## Task 1: prepare development in the published cloud environment

The human requested remaining work one task at a time, with decisions and changes documented and a completion report before the next task. This task prepares the instructions and identifies the validation prerequisite. It does not implement package 3.3a.

The existing checkout is `/workspace/duramaxsimulator`, at `910f643`, with code checkpoint `e13290b`. Use that isolated checkout; do not create a worktree. The shell is Bash and Node is 24. The published snapshot includes Google Chrome at `/workspace/chrome-runtime/opt/google/chrome/chrome` and an external smoke helper at `/workspace/duramax-smoke.mjs`.

## Evidence

- `npm test`: 207 pass, 37 suites, 0 fail, 0 skipped.
- `npm run check`: all five checks pass; provenance 229 values, 65 records, 0 without record.
- `npm run build`: passes, 45 modules, `index-a5BqzR3z.js`; documented dynamic-import and chunk-size warnings remain.
- `npm run baseline:compare`: exits 1, `Missing .qa/baseline. Run npm run baseline:capture first.` This suggestion is not authorization to capture.
- The tracked browser metadata describes Windows Chrome 157.0.8103.39 on Intel Arc/Direct3D. The cloud Chrome observed during onboarding was 157.0.8103.38 with software rendering.
- `scripts/capture-browser.mjs` requires `channel: 'chrome'` and rejects a renderer containing SwiftShader. `scripts/compare-browser.mjs` requires identical browser metadata before comparison. These guards remain unchanged.
- The onboarding smoke check establishes basic rendering and engine controls; it does not establish trace, geometry or six-view equivalence.

## D15: approved supplemental cloud regression workflow

Approved scope: a separate, explicitly labelled Linux/Chrome/software-rendering reference captured from the unchanged application code at `910f643` before package 3.3a, used for cloud before/after regression checks. This is a new local reference, not a replacement for the original Windows reference or proof of Windows visual equivalence.

The workflow must be implemented and verified before touching application code:

1. Add a separate cloud runner and shared capture support as necessary. Keep existing default browser selection, SwiftShader rejection, Windows baseline files, assertions and comparison thresholds unchanged. Any optional cloud mode must be explicit; do not silently fall back after a Windows check fails.
2. Use the installed Google Chrome executable, with WebGL 2 and its actual software renderer recorded. Capture the existing deterministic traces at 1x and 0.12x, geometry and six 1280 by 800 views. Keep the original scenarios and error checks. Investigate errors rather than suppressing them.
3. Store supplemental artifacts only under ignored `.qa/cloud/`, with HEAD, hashes of relevant source and capture code, browser version, renderer, viewport and thresholds. Do not write `tests/baseline/` or `.qa/baseline/`.
4. Capture twice before application changes. Compare trace and geometry exactly, and views using the existing rule (channel delta greater than 8, at most 1,024 changed pixels per view). Require matching metadata and zero console/page errors. Diagnose any nondeterminism before accepting the reference.
5. Compare simulation and geometry payloads with the tracked original JSON where feasible, reporting platform metadata separately. Report any differences; do not normalize measured values to force a pass.
6. Keep capture and comparison separate commands. A comparison must never refresh its reference. Missing/stale artifacts, changed metadata or assertions must fail with an actionable message.
7. Run the supplemental comparison for 3.3a and subsequent cloud packages. Continue reporting the original `npm run baseline:compare` as blocked here. Windows regression acceptance and manual human gates remain outstanding until performed in the supported environment, unless the human explicitly revises that requirement.

Task-2 file scope: `scripts/cloud-baseline.mjs`, `scripts/cloud-regression.mjs`, `scripts/capture-browser.mjs`, `tests/cloud-regression.test.mjs`, and documentation in this file, the prompt, handoff, runbook, MVP plan, engine-library plan and append-only build log. The last plan records D15 in its decision log. Changes to `scripts/capture-browser.mjs` expose explicit configuration with original defaults preserved; no application modules, baseline data, existing assertions, dependency declarations or lockfiles change.

## Commands and safeguards

Run from `/workspace/duramaxsimulator`:

```bash
# One-time capture, before application changes; refuses an existing reference.
node scripts/cloud-baseline.mjs capture
# Historical pre-Phase-6 comparison only; current commands are above.
node scripts/cloud-baseline.mjs compare \
  --reviewed-capture-change=f42458b50bd358b7a898c2f95fc982fc17dbed8d6923dcdc9b2bbed59cf4c681:6a35a9d78eb2bb2710c3c0de11fbb294a61b05e7e8377a0bcac4ca05b1ce8630 \
  --reviewed-runner-change=de7dc2ff054d4eb100442e3d56a49a2d87371b47caf9dfb89139d45b97f3e035:63bc7c25c8d46c78346039eb36c4234b2011d528fa2caac86173674d68947493
```

The Chrome executable defaults to `/workspace/chrome-runtime/opt/google/chrome/chrome`. `CLOUD_CHROME_PATH` may select another installed Google Chrome; its executable hash, browser version and renderer must match the reference for comparison. Processes run locally and close after capture. References live in `.qa/cloud/reference/`; each comparison writes a separate `.qa/cloud/run-*/` directory with the current artifacts and comparison evidence. No npm script or dependency change is needed.

Cloud rendering decision: trial software captures spent several minutes on the first view with the original per-step rasterization. The explicit cloud path instead calls the existing QA `render(count)` to advance the same 120 home-camera steps and 300 cutaway/explode steps, then compose the final frame. Camera and simulation step counts, fixtures, viewport, six views, assertions and pixel tolerances are preserved. The original Windows path still calls `render(1)` per step. The cloud manifest records this rendering strategy; it is not a claim of identical intermediate frame rendering. A real-Chrome loop-versus-batch check measures simulation/camera state and final pixels for representative home and cutaway states before reference acceptance.

References record HEAD, all tracked and nonignored untracked application-source hashes, harness hashes, original-reference hashes, Chrome executable hash, timestamps, browser metadata, viewport, thresholds and per-artifact hashes. Capture requires a clean application source tree. Before/after input hashes must match within each capture. Missing/corrupt artifacts, capped trace stages, console/page errors, changed metadata, changed original references or an unreviewed harness change fail. Source changes between reference and current are expected during development and are measured, not rejected as stale inputs.

Package 3.3a deliberately changes the capture benchmark's import and build call. After reviewing that exact migration, use:

```bash
node scripts/cloud-baseline.mjs compare --reviewed-capture-change=OLD_SHA256:NEW_SHA256
```

The old hash must equal the reference's `scripts/capture-browser.mjs` hash and the new hash must equal the current file. The runner records the review in its comparison report and keeps both manifests intact. Unreviewed harness changes still fail. This option authorizes no scenario, assertion, threshold or renderer change. Review the diff and log the reason before using it; do not use it to accept unexplained regressions.

### Approved runner migration in 3.3d

The planned removal of tracked `src/engines/active.js` exposed an inventory assumption: reading every tracked path failed with ENOENT. The human separately approved deletion-aware inventory and an exact runner-hash review. Current manifests record `deletedSource` from Git's deleted-file list and hash the remaining actual files; they do not fabricate contents or silently skip unreadable paths. Before/after provenance checks still include the deleted-file inventory.

`--reviewed-runner-change=OLD_SHA256:NEW_SHA256` requires the reference's exact old runner hash and actual current runner hash. It adjusts only a temporary compatibility expectation for that file, records the review in the report, and never writes the reference. The commands above include the approved values. Missing runner review, incorrect old hash and incorrect new hash were all verified to fail before capture. Other harness files, browser metadata, source stability, console errors, artifact integrity, exact trace/geometry and pixel thresholds retain their existing checks.

The same scope approval covered an import-only migration in `scripts/capture-numeric.mjs` to explicit `kinematicsFor(lly)` bindings. Its capture functions/normalizer and all stored numeric data/assertions are unchanged; the full Node suite again exercises the original numeric baseline.

Original Windows payload comparisons omit only the top-level browser metadata and report the exact payload result separately. Platform metadata is retained in the report. No measured value is normalized. Original Windows visual acceptance remains outstanding.

## Decisions made in task 1

- Follow the user's requested cadence: one task, document it, report completion, then wait.
- Treat the published environment as existing infrastructure. Do not reapply onboarding configuration, publish, reinstall dependencies or commit/tag/push as part of this task.
- Preserve all baseline protections. D15 was proposed without inferring approval from the general development request, then separately approved by the human before task 2.
- D1/D2 and later engine-data decisions keep their documented status and defaults; no engine value or MVP scope decision is changed by this preparation task.

## Task-2 handoff (historical)

Task 2 ended before application changes. Subsequent packages use that original reference. Follow the current handoff and both exact hash reviews above; the historical task-2 results below describe its original repeatability check.

## Task 2 results

- Reference: `.qa/cloud/reference/`, captured from unchanged application source at `910f64339b6a79d53f0fcd39cb13b36c64620f4a`; provenance covers 21 application source files, three harness files and the three original JSON references.
- Browser: Google Chrome 157.0.8103.38; renderer `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)`.
- Independent comparison: `.qa/cloud/run-1793975909914-8745/comparison.json`. Both traces and geometry match exactly. All six views have 0 changed pixels, 0 differing pixels and maximum channel delta 0. Both captures have no console/page errors and no capped trace stages.
- The trace and geometry payloads also match the tracked original Windows JSON exactly when only the top-level browser metadata is separated for reporting. Original Windows pixel equivalence is not established.
- Checksums of every reference file before and after comparison match. An attempted second capture was rejected without overwriting the reference. Missing-reference and invalid-command checks failed as intended.
- Five new automated guard tests cover incomplete/corrupt references, changed thresholds/errors, changed browser/originals/executable/harness, expected application changes, and exact reviewed capture migrations. Full Node suite: 212 tests pass, 37 suites, 0 fail, 0 skipped. Repository checks and production build pass with the existing warnings.
- Real Chrome comparator boundary checks: 1,024 pixels at delta 9 pass; 1,025 at delta 9 fail; 1,025 at delta 8 count as 0 changed pixels; wrong image dimensions fail.
- Real Chrome composition check: after settling the camera, four fixed steps using a loop versus a batch produce identical sampled simulation/camera state and 0 differing pixels in representative home and cutaway views. Initial unbatched trial captures were stopped before any reference was saved, after diagnosing impractical software-rendering cost. No existing reference was refreshed.
- Documentation links and whitespace checks pass. No application, existing test assertions, original baseline, dependency declaration or lockfile changes. Original compare script is unchanged. No staging, commits, tags, pushes, environment draft changes or publication.

These ignored reference artifacts are local workspace evidence, not Git-tracked portable baselines. Do not infer that a fresh environment has them. If absent, recover the approved reference with its provenance or arrange a deliberately reviewed capture from the approved unchanged source; do not capture from modified application code merely to make comparison pass.

## Phase 6 final results

New reference .qa/cloud/reference-phase6 was captured only with the explicit authorized command. Attempting a second capture is refused before browser work; both old/new saved reference checksums remain unchanged. Independent compare-phase6 exits 0: .qa/cloud/run-1794176141888-12227/comparison.json, exact traces/geometry, all six views 0 changed/differing pixels and maximum channel delta 0, zero console/page errors/capped stages. Original Windows trace/geometry payloads remain exact with metadata reported separately. An EOF-only whitespace cleanup in specs.js occurred after reference creation; the independent current capture records its actual source hash, with no semantic/render change.

Cross-version audit .qa/cloud/phase6-reference-audit.json confirms old/new trace/geometry exactness and records the intentional chair image differences (historical-reference pixel checks fail as expected). Representative old/new home and new walk-start captures were inspected: the engine/cell remain consistent, and the chair has moved away from the engine. Rules/thresholds/renderer policy were not relaxed. The tracked numeric fixture changed exactly one corrected Allison label and no measured value. Original Windows six-view re-capture/comparison, manual/audio and visible-window FPS acceptance remain pending.
