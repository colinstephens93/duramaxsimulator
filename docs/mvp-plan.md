# MVP plan: from the Phase 3 checkpoint to a shippable engine library

Status: written 2026-11-05 at checkpoint `e13290b`. This is the executable plan. It names every remaining package, its files, its steps, its checks and its stop conditions. The design is in [engine-library-plan.md](engine-library-plan.md). The rules are in [agent-runbook.md](agent-runbook.md). The state at the checkpoint is in [handoff.md](handoff.md). The next prompt is in [prompts/3.3a-family-takes-entry.md](prompts/3.3a-family-takes-entry.md).

Where this plan and the design disagree, this plan says so and names the decision (section 7). Nobody changes a decision silently.

---

## 1. What the MVP is

**Recommended definition (decision D1, to be confirmed by the human).** The MVP is Phases 0 to 4 and Phase 6 of the engine-library plan. Phase 5 (the inline-six) is out. The plan's cut line (section 11, item 3) says: drop Phase 5 first, then LBZ, and never cut Phases 0 to 3. Phases 0 to 3 are therefore the floor. Phase 4 (LBZ) is in because a library with one engine is not yet the product the plan describes.

### In the MVP

1. **LLY, behaviour unchanged.** Its numbers, traces and six views match the baseline. The baseline is re-captured once, in Phase 6, after the logged copy corrections and the chair move.
2. **LBZ, a second real engine** built from [research/lbz.md](research/lbz.md). It is selectable from a dropdown and from `?engine=lbz`, with complete provenance and spec copy.
3. **Runtime switching** (plan section 7). The stand is rebuilt for each engine, the old model and stand are disposed, and GPU resource counts return to baseline after ten round trips.
4. **Walk mode collides with props** (footprints, package 3.7). The console chair moves outside the walk circle in Phase 6 (package 6.6).
5. **Every check green:** `npm test`, `npm run check`, `npm run build`, `npm run test:browser`, `npm run baseline:compare` and `npm run check:dist`.
6. **Documentation current:** the README (an Engines section, the file map, the tests, an "Add an engine" guide), this plan's status, the handoff, the runbook, the build log, and the QA recipe (new hook name).
7. **Cleanup:** the `archive/` folder removed from the working tree (kept in git history), the `window.__LLY__` alias removed, and the unused exports removed.

### Out of the MVP

- Phase 5, the inline-six: its own family, the `shared/` generators, its layout tests and its smoke test.
- LBZ's visual differences (thicker rods, larger cooler, glow plugs). They are not modelled, and the copy must not claim them.
- The LLY rod-length correction to 163.0 mm, unless the human decides it (D13).
- Open QA gaps, unless the human decides them (D9): the outline's hidden-edge colour, the default exploded-view camera width, and the quick-part buttons for internal parts.
- The out-of-scope list in plan section 1: in-app editing, a live dyno import, two engines in one cell, side-by-side views, overhead-cam valvetrains, non-four-stroke cycles, and downloaded models.

### MVP acceptance (all must hold at the Phase 6 gate)

- **A1.** `npm test` passes. The test count rises from 207 as packages add tests. Report each count and say what it added.
- **A2.** `npm run check` reports PASS for all five checks, including provenance for every entry (LLY and LBZ).
- **A3.** `npm run build` passes, and `npm run check:dist` passes: the test copy is absent from `dist/`, and each engine is its own chunk.
- **A4.** `npm run test:browser` passes: the swap test (ten round trips, a clean console, resource counts at baseline, cutaway kept), `PART_IDS` against `model.parts` for every entry, and the LLY and LBZ smoke tests.
- **A5.** `npm run baseline:compare` passes against the re-captured baseline (after 6.1 and 6.6).
- **A6.** The human has passed the Phase 3, 4 and 6 gates (section 6), and the manual QA checklist (section 5.4) is complete for LLY and LBZ.
- **A7.** The documents in section 8 are current, and the handoff says so.
- **A8.** `engine-library` is merged into `master` after the Phase 6 gate. The Phase 6 commit is tagged `phase-6-done`. Only the human merges.

---

## 2. How the work runs

### Roles

- **Human.** Approves gates, decides the open decisions in section 7, and provides the GitHub remote.
- **Harness, or any other AI tool.** Runs one package's prompt, step by step, and reports the outputs. The harness shell is Windows PowerShell 5.1 (see [harness-notes.md](harness-notes.md)).
- **Lead.** Checks each prompt against the repo before it runs, verifies each result (section 5.2), writes the review entry in the build log, and keeps the handoff current.

Any AI tool can take any role, as long as it follows [AGENTS.md](../AGENTS.md).

### The package loop

Repeat for every package:

1. **Lead:** check the prompt against the repo. Every symbol and line number it names must still exist. Save the prompt in `docs/prompts/` under the package ID.
2. **Human:** run the prompt in the harness, and paste the results back.
3. **Lead:** verify the result (section 5.2). If a check fails, send the package back. Never accept a claimed pass without the output.
4. **Lead:** append the review entry to `docs/build-log.md`, and update the handoff.
5. **Human, when asked:** a WIP checkpoint commit may be made to save progress (no tag).
6. **Gate:** the human checks what section 6 lists. Only the human approves the phase commit and the tag.

### The prompt template

Every prompt has these parts, in this order. Keep them short, and name the exact files.

```text
HARNESS PROMPT: PACKAGE <id> (<name>)
Repo, branch, shell, and the package's one goal.
STARTING STATE: HEAD, the expected checks and their expected values, what must not be committed.
GOAL: the outcome, and what must not change.
FILE LIST: the only files that may change, and what may be created or deleted.
STEPS: numbered, each exact enough to check (names, line numbers as of the checkpoint, and the match count each replacement should give).
EXPECTED: the test and check counts, the baseline result, and git status.
LOG: the build log entry, with its fields.
STOP AND REPORT: the conditions from this plan's section for the package.
REPORT BACK: exactly what to paste.
```

---

## 3. Current status and the next package

- **Done and gated:** Phase 0 (`phase-0-done`), Phase 1 (`phase-1-done`), Phase 2 (`phase-2-done`).
- **Done, not gated:** 3.1 (registry), 3.2a (environment split), 3.2b (branding and gauges in the entry). All three are in the checkpoint commit `e13290b`.
- **Next:** 3.3a, the V8 family takes the entry. Its prompt is ready: [prompts/3.3a-family-takes-entry.md](prompts/3.3a-family-takes-entry.md).
- **Blocking decisions before Phase 4:** D4, D5 and D6 (section 7).

Phase 2's gate passed while the family still read the LLY module. That gap is the first work in Phase 3 (packages 3.3a and 3.3b). Decision D2 records it.

---

## 4. The packages

Sizes are relative (S, M, L). Line numbers are as of `e13290b`. Re-grep before editing, because they drift.

### 4.1 Phase 3: switching at runtime (remaining)

**Why 3.3 is four packages.** The runbook's 3.3 was one package. The lead review found three things that one package could not carry: the family and the kinematics still read the LLY module (so a second entry would show LLY's geometry and calibrations); the stand must be built and disposed per engine (plan section 7, steps 6 and 7); and the interim `active.js` binding feeds three modules. The split follows the 3.2a and 3.2b precedent. A migration of a test's imports goes in the package that removes the export the test depends on.

#### 3.3a: the V8 family takes the entry (S, prompt ready)

- **Goal:** `buildEngine(materials, entry)` and `EngineBuilder(materials, entry)`. The family stops importing the LLY module. LLY's output does not change.
- **Files:** `src/engines/families/v8-ohv.js`, `src/main.js` (one line), `scripts/capture-browser.mjs` (one call and one import), `tests/picking.test.mjs` (planned migration), `docs/build-log.md`.
- **Steps:** the prompt in [prompts/3.3a-family-takes-entry.md](prompts/3.3a-family-takes-entry.md). Do not restate it here.
- **Verify:** `npm test` 207 passing; `npm run check` PASS; `npm run build`; `npm run baseline:compare` exit 0.
- **Stop if:** any view, trace or geometry changes beyond render noise; an `lly` identifier remains in code.

#### 3.3b: kinematics take the entry (M)

- **Goal:** `kinematicsFor(entry)` in `src/engines/families/v8-ohv-kinematics.js` returns the values the family needs (cylinders, firing order, valve timing, station positions, bank offsets, calibrations, crank radius, rod length, redline). The family uses that result, not the module-level LLY constants.
- **Module-level exports stay.** `CYLINDERS`, `CYLINDER_BY_NUMBER`, `CALIBRATIONS` and the rest stay as exports derived from the LLY entry, because `audio.js`, `specs.js` and `main.js` still import them. Package 3.3d removes them. So 3.3b changes no test import.
- **Files:** `src/engines/families/v8-ohv-kinematics.js`, `src/engines/families/v8-ohv.js` (the family's imports and uses), `tests/kinematics.test.mjs` only if an assertion needs the new function (an import addition, logged).
- **New tests:** `kinematicsFor(lly)` equals the existing exports (regression); `kinematicsFor(clone)` changes when the clone's `valvetrain.timing.intake.centerDeg` changes (proves the entry is read). Put them in a new file, `tests/kinematics-entry.test.mjs`.
- **Verify:** `npm test` (207 plus the new tests; report the count); `npm run check`; `npm run build`; `npm run baseline:compare` exact.
- **Stop if:** any LLY output changes. Stop even if the change is one pixel at delta 1 in the trace or geometry.

#### 3.3c: the stand is built per engine, the cell once (M)

- **Goal:** `buildEnvironment(scene, renderer, materials, entry)` builds the cell only. The stand is built by a separate call that the swap also uses. `buildStand` is called from `main.js`, not from inside the cell build. The stand's collision volumes (dyno box and guard) come back from the stand build. The stand's values stay LLY's until Phase 5 (decision D10).
- **Random order.** `withSeededRandom` wraps the build, so the order of `Math.random` calls matters. Before moving the stand call, check with `Select-String -Path src\environment\stand.js -Pattern 'Math.random'` that the stand draws no random numbers. If it draws none, the order of the cell's random calls is unchanged.
- **Files:** `src/environment/cell.js`, `src/environment/stand.js`, `src/main.js` (the call sites). `tests/fixture.test.mjs` stays unchanged, because it tests the cell.
- **Verify:** `npm test`; `npm run check`; `npm run build`; `npm run baseline:compare` exact.
- **Stop if:** the baseline changes; a stand value changes; the random-call order changes.

#### 3.3d: the swap, the picker, the engine reference and the QA hook (L)

- **Goal:** plan section 7 in `src/core/swap.js`: `switchEngine(id)` with the input lock, the request token, the stop, the overlay, the load, the build, the dispose, the reset, the rebind and the finish.
- **Pieces:**
  - The request-token logic is a pure helper with its own Node test.
  - `main.js` holds a mutable engine reference (for example `current = { id, entry, copy, family, model, stand }`).
  - `?engine=` is read at boot with `parseEngineParam` (from 3.1).
  - The picker is a dropdown in the top bar, built from `ENGINE_IDS`. It calls `switchEngine`.
  - `installQaHook(window, hook)` sets `window.__ENGINE__`, and `window.__LLY__` as the alias (plan section 3, "QA hook").
  - `model.telemetry(rpm, calibrationId, firing)` (plan section 5, the runtime contract) wraps `telemetryValues`.
  - `TestCellAudio.configure(config)` is added, and the swap calls it (plan section 7, step 9).
  - The tachometer is rebuilt on swap. The plan notes that `buildTachometer()` returns early once its SVG has children (plan section 2, from 2026-10-29; re-check before changing it).
  - `collision.js` and `specs.js` read the current entry or copy at call time. Neither imports `active.js`.
  - `src/engines/active.js` is deleted, and the module-level exports from 3.3b are removed, with their consumers migrated.
  - The module-level exports removed here have test importers, and each one migrates (planned, plan section 8): `tests/kinematics.test.mjs`, `tests/audio-pulses.test.mjs`, `tests/helpers/fake-audio.mjs`, and our `tests/registry.test.mjs` (imports only). `tests/collision.test.mjs` also migrates: its 1.03 m assertions read `walk.clearanceRadiusM`, and its import path changes. Log each migration.
- **Files:** the ones above, plus `index.html` and `src/ui/bind.js` for the picker, `src/audio.js` for `configure`, and `docs/build-log.md`.
- **New tests:** the token helper (Node); `model.telemetry` is covered by the browser test in 3.6, because the family needs a browser to build.
- **Verify:** `npm test`; `npm run check`; `npm run build`; `npm run baseline:compare` exact. Also, `npm run build` must no longer print the INEFFECTIVE_DYNAMIC_IMPORT warning for `copy.js`, because `active.js` is gone. Report whether it does.
- **Stop if:** the LLY baseline changes; a swap leaves a stale value (report it; do not paper over it).

#### 3.4: the test-only copy of LLY (S)

- **Goal:** a copy in `tests/fixtures/engines/lly-copy/` (`index.js` and `copy.js`). It changes identity, ratings (calibration labels and peaks), curves, and the spec copy. It keeps the stroke, bore, layout, valve timing, look and explode data, because the V8 family's crank throw is a literal (plan section 4).
- **Registration:** `ENGINE_IDS` gains `lly-copy` only when `import.meta.env?.MODE === 'test'`. Node sees `['lly']`, and `tests/registry.test.mjs` keeps its assertion.
- **Provenance:** every value in the copy is labelled `design`. The copy is not an engine, so the provenance check does not scan it; its Node test runs `validateEntry` instead.
- **Files:** the two new fixture files, `src/engines/index.js` (the mode-gated loader), a new `tests/lly-copy.test.mjs`, `docs/build-log.md`.
- **Verify:** `npm test`; `npm run check`; after `npm run build`, `Select-String` for `lly-copy` in `dist` finds nothing.
- **Stop if:** the copy appears in a production build.

#### 3.5: resource ownership and disposal (M)

- **Goal:** each build's models, geometries, textures and cloned materials are disposed with that build. Shared assets from `createMaterials()` are never disposed (plan section 7, resource rules).
- **Approach (decision D7).** The plan says the resource tracker is passed into the builders. The lead recommends an ownership walk instead: collect every geometry, material and texture reachable from the build's root, skip anything in the shared set, and dispose the rest. Threading a tracker through several hundred constructor sites is larger and riskier than the walk. If the human rejects D7, this package needs a tracker design first.
- **Files:** a new `src/core/resources.js` (the walk), `src/engines/families/v8-ohv.js` (`dispose()`), `src/environment/stand.js` (its dispose), `src/core/swap.js` (calls dispose on the old model and stand after the new ones build), a new `tests/resources.test.mjs` with fake objects.
- **Verify:** `npm test`; `npm run check`; `npm run baseline:compare` exact. The browser count check comes in 3.6.
- **Stop if:** a shared material is disposed (the Node test must catch it).

#### 3.6: the browser runner and the swap test (M)

- **Goal:** `npm run test:browser` starts Vite with `createServer({ mode: 'test' })` on a free port, drives the app with Playwright through the installed Chrome (`channel: 'chrome'`), and runs every `tests/browser/*.browser.mjs`.
- **Checks:**
  1. The swap: ten round trips (ten swaps away and back, so twenty swaps). The console has no errors. `renderer.info.memory` (geometries and textures) returns to the count taken after the first round trip. The cutaway state survives every swap.
  2. `PART_IDS` against `model.parts` for LLY and the copy.
  3. Smoke: start, a preset, and the calibration toggle.
- **Files:** `scripts/run-browser-tests.mjs` (new), `tests/browser/swap.browser.mjs` (new), `package.json` (one script, `test:browser`, which the runbook allows in section 9).
- **Verify:** `npm run test:browser` passes; `npm test`; `npm run check`; `npm run baseline:compare` exact.
- **Stop if:** any console error; a count that does not return to baseline; a swap that loses the cutaway.

#### 3.7: prop footprints (M)

- **Goal:** each prop in the cell has a footprint, a circle or a box, in cell coordinates. The footprints are constants, so Node can test them without WebGL. A browser check confirms the meshes sit where the constants say.
- **Test:** no footprint overlaps the walk circle (centre (0, −0.05) m, radius 1.03 m) or the dyno guard, except the console chair. The chair is exempt by name until Phase 6 (decision D12, plan section 11 item 2). The exemption comment cites plan section 11, item 2, and the build log records it.
- **QA gap closed.** The QA recipe lists walk mode with no prop collision: a work-lamp post near (−2.0, 1.7) and a tool chest at (2.82, 1.16). This package fixes it.
- **Files:** `src/environment/cell.js` (the footprint constants), `src/collision.js` (if `buildWalkWorld` needs them), a new `tests/footprints.test.mjs`, `docs/qa-recipe.md` (the status of the gap), `docs/build-log.md`.
- **Verify:** `npm test`; `npm run check`; `npm run baseline:compare` exact (props do not move).
- **Stop if:** a footprint overlaps the walk circle or the guard and is not the chair.

#### 3.8: Phase 3 acceptance (S)

- **Commands:** `npm test`; `npm run check`; `npm run test:browser`; `npm run baseline:compare` (LLY).
- **Then the Phase 3 gate (section 6).** No phase commit until the human approves.

### 4.2 Phase 4: LBZ, from the research

#### 4.0: decisions before any LBZ code (human, no code)

The LBZ research sheet does not fill every field the entry needs, and the runbook's rules conflict with the builder. These are decisions for the human, recorded in plan section 11 before 4.1 starts.

- **D4, LBZ rod length.** [research/lbz.md](research/lbz.md) section 8 proposes 163.0 mm (medium confidence, from family listings). Section 7 lists the LBZ-specific rod length as a gap. Runbook rule 7 says a gap is `null`. A `null` rod length would make the piston kinematics return NaN, which is a builder change, and the plan says to stop and re-plan. *Default:* 163.0 mm with status `medium`, and a note in the entry that it comes from the family listings.
- **D5, LBZ valve timing and lift.** Section 7 lists valve lift and cam duration as gaps. The builder needs numbers. *Default:* LLY's values, labelled `design`, and the copy makes no claim that LBZ's valve timing differs. Runbook rule 7 then needs one amendment: a `design` value that the human approves in plan section 11 is allowed. The amendment is a runbook edit and is logged.
- **D6, LBZ behaviour and look values.** Nothing in the research gives the curves, the start-up, the audio, the walk limits, the dyno, the look, the explode offsets or the UI copy. The entry needs all 22 keys (`REQUIRED_KEYS` in `src/engines/schema.js`). *Default:* LLY's values, labelled `design`. The copy says only what the research supports.
- **Calibrations.** LBZ has two. Silverado and Sierra HD: 650 lb-ft at 1,600 rpm, 360 hp at 3,200 rpm. Kodiak and TopKick LPD: 605 lb-ft at 1,600 rpm, 310 hp at 3,000 rpm (research README decision 3; lbz.md section 8). The keys are `allison` and `kodiak`, as section 8 proposes.

Output: decisions D4 to D6 recorded in plan section 11 by the human, and the handoff updated.

#### 4.1: the LBZ entry (M)

- **Goal:** `src/engines/lbz/index.js` with all 22 keys, including identity, geometry, compression, ratings, the two calibrations, turbo geometry, features and oil from lbz.md section 8, and the behaviour and look keys from D6.
- **Files:** `src/engines/lbz/index.js` (new). Nothing else. `src/engines/index.js` changes in 4.4.
- **Verify:** `validateEntry(lbz)` returns an empty array (a new Node test); `npm run check` provenance for LBZ.
- **Stop if:** a value has no source and no `design` label; a `null` is needed where the builder cannot take it (stop and re-plan, as the plan requires); the entry needs a change to a builder file.

#### 4.2: the LBZ spec copy (M)

- **Goal:** `src/engines/lbz/copy.js` exports `COMPONENT_CARDS`, `pistonCard`, `rodCard` and `engineSummary`, with one card for every `PART_IDS` entry. Today the registry test checks spec copy only through `src/specs.js`, which is LLY. Package 4.4 makes it loop over `ENGINE_IDS` and check each loaded copy's `COMPONENT_CARDS` against `PART_IDS`.
- **Rules:** claim only what the research supports. Do not claim the rod, piston or cooler differences (plan section 5, Phase 4). The trademarked name is allowed only in the LBZ entry.
- **Files:** `src/engines/lbz/copy.js` (new).

#### 4.3: provenance records (S)

- **Goal:** a provenance record for every numeric value in the LBZ entry, citing its source IDs from [research/sources.md](research/sources.md). A `null` appears only where the sheet lists a gap. This is merged into 4.1 unless it is large.

#### 4.4: register LBZ, and its browser smoke test (S)

- **Goal:** `ENGINE_IDS` becomes `['lly', 'lbz']`, and `LOADERS` gains `lbz`. The picker lists LBZ with no code change, because it is built from `ENGINE_IDS`. A browser smoke test runs LBZ: it loads, the stand and labels show LBZ branding, start, a preset and the calibration toggle work.
- **Files:** `src/engines/index.js`, `tests/browser/lbz.browser.mjs` (new), `tests/registry.test.mjs`. The registry test changes in three places, each logged as a planned change to our own test: the `ENGINE_IDS` assertion; the `?engine=lbz` assertion, which now expects `{ id: 'lbz', requested: 'lbz', fallback: false }` instead of a fallback; and the spec-copy test, which loops over `ENGINE_IDS`.

#### 4.5: Phase 4 acceptance (S)

- **Commands:** `npm test`; `npm run check` (includes provenance); `npm run test:browser`; `npm run baseline:compare` (LLY unchanged).
- **Scope:** changes stay inside `src/engines/lbz/`, the registry list, and the tests. Anything else is a stop.
- **Then the Phase 4 gate (section 6).** Nobody signs off on values.

### 4.3 Phase 6: hardening, research corrections and cleanup

Runbook numbering is kept. Package 6.8 is optional.

- **6.1 Copy corrections (M).** Apply every item in [research/lly.md](research/lly.md) section 8, for LLY and for LBZ where it applies. This includes the Allison label ("Allison 1000 automatic"), the unsourced starter and glow-plug claims (remove or mark them), the seven-hole qualifier (2006), and the Allison speed-count removal (research decision 7). The injector wording follows D11. The baseline changes after this package and 6.6, and those changes are logged. Rule 2 allows it only in this phase.
- **6.2 Remove the alias and the unused exports (S).** Remove `window.__LLY__` and keep `window.__ENGINE__`. `installQaHook` drops the alias line, and the registry test "installs both QA names to the same hook" changes to check `__ENGINE__` only. Both are planned changes, logged. Remove `ENGINE_SPEC_SUMMARY`, `INSPECTABLE_IDS`, `HEAD_TOP` and `ROCKER_Y` (plan section 6), unless one is kept on purpose, and say so. Update [qa-recipe.md](qa-recipe.md) in the same package (plan risk table: "QA hook renamed").
- **6.3 README (M).** The Engines section, the file map, the tests section and an "Add an engine" guide (a section of the README, or a separate file linked from it).
- **6.4 Remove `archive/` (S).** `git rm -r archive/`. Git history keeps it. Nothing in `src/` or `tests/` may import from it.
- **6.5 Dist check (S).** `scripts/check-dist.mjs` and the npm script `check:dist` (runbook section 9). It checks that the test copy's ID is absent from `dist/` and that each engine is its own chunk.
- **6.6 Console chair (M).** The lead proposes a position for the chair outside the walk circle, from the cell coordinates, and gives the distance check. The human approves it. Then move the chair, remove its exemption from `tests/footprints.test.mjs`, and re-capture the baselines after 6.1 and 6.6. Log each change and its reason. The re-capture is the only baseline change in the MVP.
- **6.7 Acceptance (S).** Every check: `npm test`, `npm run check`, `npm run build`, `npm run check:dist`, `npm run test:browser` (all entries), and `npm run baseline:compare` against the re-captured baseline. The footprint test passes with no exemption.
- **6.8 Optional: the pointer-lock rejection (S, D9).** `canvas.requestPointerLock?.()` returns a promise that nothing awaits or catches, in `enterWalk()` and in the canvas pointerdown handler ([qa-recipe.md](qa-recipe.md), section g). Only if the human approves D9. Catch the promise and nothing else.
- **Gate 6 and merge (section 6).** The human checks the copy corrections, the chair's new position, the re-captured baseline and the QA run on all entries, then approves the merge of `engine-library` into `master`.

---

## 5. Test plan

### 5.1 The layers

| Layer | Command | Proves | Runs |
| --- | --- | --- | --- |
| Node unit tests | `npm test` | Entry validity, physics identities, the registry, telemetry, audio pulses, collision, footprints, resources, the swap token | Every package |
| Static check | `npm run check` | Names and numbers outside `src/engines/`, encoding, engine IDs, and provenance for every entry | Every package |
| Build | `npm run build` | The bundle builds; the chunk and import warnings are the expected ones | Every package from 3.3a |
| Numeric baseline | `npm test` (`tests/baseline.test.mjs`) | LLY's curves match `tests/baseline/lly-curves.json` exactly | Every package |
| Browser baseline | `npm run baseline:compare` | LLY's trace, geometry and six views match the baseline; the browser version and renderer match | Every package from 3.3a |
| Browser tests | `npm run test:browser` | The swap, `PART_IDS` against `model.parts`, and the smoke tests for each entry | From 3.6 |
| Dist check | `npm run check:dist` | The test copy is absent from `dist/`; each engine is its own chunk | From 6.5 |
| Manual QA | the checklist in 5.4 | What the tests cannot see: feel, labels, sound, and the view | At each gate |

The browser baseline is split. The trace and geometry JSON, and the numeric baseline, are tracked under `tests/baseline/`. The six PNG views and `meta.json` are in `.qa/baseline/`, which git ignores. On a new machine, recreate them before the compare can run, as [harness-notes.md](harness-notes.md) describes.

### 5.2 The lead's checklist after each package

Run these in order, and keep the output for the review entry. Do not accept a claimed pass without the output.

1. `git status --short` and `git diff --stat` match the package's file list. Nothing else changed.
2. `npm test`: the count, and the difference from the previous count, is explained by the package's new tests.
3. `npm run check`: Result PASS; provenance counts as the package expects.
4. `npm run build`: passes; the warnings are the expected ones.
5. `npm run baseline:compare`: exit 0; Trace and Geometry PASS; all six views PASS. The home view may show 0 or 1 pixel at delta 1.
6. The package's acceptance greps (`Select-String`) give the expected result.
7. SHA-256 of each changed file (`Get-FileHash`) is recorded in the review entry.
8. Read the diff of every changed call site yourself. A passing check does not show that a call site is right.
9. Write the review entry in `docs/build-log.md`. Name anything that was not verified.

### 5.3 New tests by package

| Package | New or changed tests | Kind |
| --- | --- | --- |
| 3.3a | `tests/picking.test.mjs` (import and helper only) | Migration |
| 3.3b | `tests/kinematics-entry.test.mjs` | Node |
| 3.3c | none; the baseline proves the stand build | Browser baseline |
| 3.3d | token helper test; migrations of `tests/kinematics.test.mjs`, `tests/audio-pulses.test.mjs`, `tests/helpers/fake-audio.mjs`, `tests/registry.test.mjs` (imports) and `tests/collision.test.mjs` | Node, migration |
| 3.4 | `tests/lly-copy.test.mjs` | Node |
| 3.5 | `tests/resources.test.mjs` | Node |
| 3.6 | `tests/browser/swap.browser.mjs`, `tests/browser/smoke.browser.mjs` | Browser |
| 3.7 | `tests/footprints.test.mjs` | Node |
| 4.1 | `validateEntry(lbz)` test | Node |
| 4.4 | `tests/browser/lbz.browser.mjs`; `tests/registry.test.mjs` (the ID list, the `?engine=lbz` assertion, the spec-copy loop) | Browser, migration |
| 6.5 | `scripts/check-dist.mjs` run by `npm run check:dist` | Dist |
| 6.6 | `tests/footprints.test.mjs` exemption removed | Node |

### 5.4 The manual QA checklist (for each gate)

The human runs the app at `npm run dev` or `npm run preview`, in a normal Chrome window, without `?qa=1`, and checks:

- LLY opens on the cell, idles at 680 rpm, and the camera intro plays.
- START, STOP, the presets (`1` to `5`) and the RPM slider run, and the telemetry updates.
- Cutaway (`C`) and explode (`E`) work, and `A` assembles. Clicking through the faded castings selects an internal part and opens its card.
- The calibration switch changes the numbers (Allison and ZF for LLY; the two LBZ calibrations for LBZ).
- Walk mode (`V`, then WASD and the mouse) stops at the walls, the stand, the guard and the props. It does not pass through them. Exit with `V`.
- Audio: `S` toggles it, and no error appears in the console.
- `CAPTURE` downloads a PNG of the 3D view.
- The swap (Phase 3 gate): the dropdown and `?engine=` switch engines, the labels and the branding change, the engine starts at 0 rpm, and the cutaway and explode carry over.
- The console shows no errors during any of this.

---

## 6. Gates (human)

A gate stops the build. The lead writes the review entry and waits. Nothing is committed, tagged or started until the human approves.

| Gate | The human checks | Then |
| --- | --- | --- |
| Phase 3 | The swap by hand (section 5.4), the stand and the props, and the review entries for 3.3a to 3.8 | Phase commit on `engine-library`; tag `phase-3-done` |
| Phase 4 | The provenance check has passed; LBZ runs in the browser (5.4); D4 to D6 were decided. No value sign-off. | Phase commit; tag `phase-4-done` |
| Phase 6 | The copy corrections, the chair's new position, the re-captured baseline, the QA run on all entries, and the merge | Phase commit; tag `phase-6-done`; merge to `master` (human) |

The Phase 0 gate also checked a visible-window FPS reading (plan section 6). Repeat it at the Phase 6 gate: run `npm run preview`, open the address without `?qa=1`, wait 30 seconds, then run `window.__LLY__.getFpsSamples()` in the console, and send the result to the lead. Once `__LLY__` is removed in 6.2, use `window.__ENGINE__.getFpsSamples()`.

---

## 7. Decisions

The human decides these. The default is what happens if nobody answers before the package that needs it. A default that changes a value or a baseline needs the human's approval first.

| ID | Question | Default | Needed before |
| --- | --- | --- | --- |
| D1 | MVP definition: Phases 0 to 4 and 6, Phase 5 out? | Yes, as section 1 | Phase 4 |
| D2 | The Phase 2 gap (the family still reads LLY): treat it as Phase 3 work, and leave the Phase 2 gate as approved? | Yes | 3.3a |
| D3 | The GitHub remote | Resolved 2026-11-05: `origin` is `https://github.com/colinstephens93/duramaxsimulator.git`, and the branches and tags are pushed | Done |
| D4 | LBZ rod length: 163.0 mm (status `medium`), or `null`? | 163.0 mm, with a note | 4.1 |
| D5 | LBZ valve timing and lift (a gap in the research): LLY's values labelled `design`? And amend runbook rule 7 to allow approved `design` values? | Yes, and yes | 4.1 |
| D6 | LBZ behaviour and look values (not in the research): LLY's values labelled `design`, with copy that claims only what the research supports? | Yes | 4.1 |
| D7 | Disposal by an ownership walk instead of a resource tracker threaded through the builders? | Yes; recorded as a deviation from plan section 7 | 3.5 |
| D8 | Audio fires above 80 rpm (`audio.firingAboveRpm`), and the engine's firing gate is 90 rpm (`startSequence.firingAboveRpm`). Keep both? | Keep both, and record why in the log | 3.3d |
| D9 | QA gaps in the MVP: fix the pointer-lock rejection (6.8) and the prop collision (3.7)? Leave open the outline's hidden-edge colour, the exploded-view camera width and the internal quick-part buttons? | Fix the two; leave the three open | 6.8 |
| D10 | Stand values per engine (mounts, pedestal, guard, flywheel, engine centre, and the dyno label with "1,000 LB-FT"): Phase 5? | Phase 5; accepted by running 3.2b | 5.x (post-MVP) |
| D11 | Injector wording in the copy ("piezoelectric" in the brief; the research favours solenoid). Plan section 11, item 1. | Keep "piezoelectric" until decided | 6.1 |
| D12 | Console chair: the new position (plan section 11, item 2). | The lead proposes; the human approves | 6.6 |
| D13 | LLY rod length corrected from 184 mm to 163.0 mm, as a separate logged change (plan section 3). | Not in the MVP; 184 mm stays, documented as stylised | After the MVP |
| D14 | The commit author and trailer. | The configured git user (Colin Stephens); the trailer `Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>` | Every commit |

---

## 8. Documents to keep current

| Document | What changes, and when |
| --- | --- |
| [handoff.md](handoff.md) | At every checkpoint and gate: the state, the next package, the open decisions. Rewrite it; keep the history in the build log. |
| [mvp-plan.md](mvp-plan.md) | When a package's facts change (a line number, a decision, a new gap). Never silently. |
| [engine-library-plan.md](engine-library-plan.md) | Status markers at each phase; section 11 when a decision is made. Design changes need the human's approval. |
| [agent-runbook.md](agent-runbook.md) | When a rule changes (rule 7 at D5; rule 8 and 9 at D3 and checkpoints) and when the package list changes (3.3 split). |
| [build-log.md](build-log.md) | At every package and gate. Append only; a correction is a new entry that says what it corrects. |
| [qa-recipe.md](qa-recipe.md) | At 3.3d (the new hook name), at 3.7 (the gap's status), and at 6.2. Line numbers are checked against the code at each change. |
| [harness-notes.md](harness-notes.md) | When the harness or its shell changes. |
| [README.md](../README.md) | At 6.3, in full. Smaller edits at 3.3d and 4.4 (the picker and LBZ). |
| [AGENTS.md](../AGENTS.md) | When the start-up steps or a hard rule changes. |
| [research/](research/README.md) | Only by the research owner. The build never edits research sheets. A correction goes into the sheet first, then into the entry (plan risk table). |

---

## 9. Git and release policy

- **Branches.** `engine-library` is the working branch. `master` is the base. It holds the app before the refactor, at `864f014`. Nobody resets a shared branch (plan section 10).
- **Checkpoints.** A WIP commit may be made when the human asks to save progress. It is labelled `WIP` in the subject, is not tagged, and does not replace the phase commit.
- **Phase commits.** One commit per phase, after the gate is approved, on `engine-library`. Tag the commit `phase-N-done`.
- **Remote.** `origin` is `https://github.com/colinstephens93/duramaxsimulator.git` (set 2026-11-05, decision D3). Push after an approved gate, or when the human asks, and push `master`, `engine-library` and the tags. The runbook's rule 8 applies: push only when the human names the remote and asks.
- **Merge.** After the Phase 6 gate, the human merges `engine-library` into `master`.
- **Rollback.** Create a new branch from a tag (plan section 10). Never reset a branch that others use.
- **Commit messages.** Write the message to a file outside the repo and run `git commit -F <file>`. End every message with the trailer in D14.
- **Staging.** Stage explicit paths. Git's LF-to-CRLF warnings are harmless: the repository stores LF, and `core.autocrlf` is `true`.

---

## 10. Risks

Plan section 9 has the design risks. These are the ones this review found.

| Risk | What we do |
| --- | --- |
| The family reads LLY, so a second entry shows LLY's geometry and calibrations | 3.3a and 3.3b; the baseline and a test that changes a clone's timing |
| The stand must be rebuilt per engine, and the seed order of `Math.random` must not change | 3.3c checks the stand draws no random numbers before it moves |
| A rebuilt scene keeps old GPU resources | 3.5 ownership walk; 3.6 counts after round trips |
| LBZ has gaps the builder cannot take as `null` | D4 to D6, decided before 4.1 |
| The runbook's rule 7 (`null` for gaps) conflicts with a builder that needs numbers | D5 amends the rule, with the human's approval |
| A test's imports change, and its assertions drift with them | Migrations are listed, logged, and assertion-free; each is named in section 5.3 |
| The chair or a prop is placed by eye, and the footprint test passes by accident | 6.6 proposes a position with its distances; the test's exemption is removed in the same package |
| Windows PowerShell 5.1 breaks the source files, or the harness uses commands it lacks | [harness-notes.md](harness-notes.md); prompts use `Select-String` and Node scripts |
| Chrome updates, and the baseline's browser version no longer matches | `baseline:compare` fails on the version. Stop and report. Re-capture only in a logged package |
| A pass is claimed without its output | Each review entry records every command and its output (section 5.2) |
| Work exists only on this machine | Resolved 2026-11-05: `origin` is set (D3). Push after each approved gate (section 9). |

---

## 11. Done

The MVP is done when every item in section 1's acceptance (A1 to A8) is true, and the handoff says so, with the Phase 6 commit tagged `phase-6-done` and merged to `master` by the human.
