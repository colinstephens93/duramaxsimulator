# Agent runbook: building the engine library

For the AI agent that builds [engine-library-plan.md](engine-library-plan.md). These rules apply to any model and any agent harness. Engine values come from [research/](research/README.md), and the build never researches them. Nobody signs off on values. A human approves the code gates. If this runbook and the plan disagree, stop and report. Don't pick one.

## 1. Harness check (before Phase 0)

The harness must provide:

- A shell that runs Node 20.19 or later, or 22.12 or later, plus npm and git, on Windows. (The machine has Node 24.)
- Tools to read and edit files.
- The installed Chrome, through Playwright's `channel: 'chrome'`. This is decided. The probe passed on 2026-10-29 with Chrome 156.0.8078.48 and WebGL 2 on the Intel Arc 140V GPU. Do not download a separate Chromium.

If an item is missing, stop and report which one. Don't work around it. Package 0.2 repeats the WebGL check.

## 2. Operating rules

1. Work only on the package you are on. Log every change in `docs/build-log.md`.
2. Never edit a test, a baseline or a check to make it pass. Baselines change only in a phase that regenerates them, and the log says why. The test-import migrations in plan section 8, and the chair exemption in package 3.7, are planned edits. Log each one.
3. No new dependencies and no version changes. The only `package.json` edits allowed are the npm scripts named in section 9.
4. Delete nothing except what a package names (for example, the file a split replaces) and what Phase 6 names. Move files with `git mv`.
5. Don't rewrite source files with PowerShell. Use the file tools, or a Node script that reads and writes UTF-8. Delete with git or Node, not `Remove-Item -Recurse`, which can follow directory junctions (plan section 10).
6. Report a check as passing only after you ran it and read its final lines. Paste those lines into the log.
7. **Values come from the research.** Every numeric engine value comes from [research/lly.md](research/lly.md), [research/lbz.md](research/lbz.md) or [research/inline6.md](research/inline6.md), and carries a provenance record that cites the source IDs in [research/sources.md](research/sources.md). If a value is not in the research, write `null`, log it, and move on without it. Never fill a gap from memory, and never research a value during the build.
8. Never run `git reset --hard`, `git checkout --` or `git push`. Tags mark gates. Rollback is a human decision.
9. Commit at the end of each phase, on the phase branch (`engine-library`), after the human approves that phase's gate. Use the author and trailer the repo is configured with (plan section 10).
10. The open decisions in plan section 11 belong to the human. Values are not open decisions. If a decision is needed before a package and it isn't recorded, stop.
11. Plan section 6 lists each phase's deliverables, and the packages cover them. If a deliverable has no package, stop and report.

## 3. Resume protocol

At the start of every session:

1. Read the plan section for the current phase, plan section 8 (the checks), and plan section 11.
2. Read `docs/build-log.md`. On the first session it does not exist yet, so start at package 0.1.
3. Run `git status` and `npm test`.
4. Continue from the first open item in the log.

If `git status` shows changes that the log doesn't explain, stop and report them.

**Starting state.** On 2026-10-30, before 0.1, `master` is at `864f014` with no tags. Three items are uncommitted: `docs/` (untracked: the plan, this runbook and `docs/research/`), and edits to `README.md` and `lly_report.md` from the documentation audit. The first log entry lists all three under Files. Don't revert them. They go into the Phase 0 commit, unless the human commits them first. On the first session, this note is the explanation that the check above needs.

## 4. Build log

Create `docs/build-log.md` in package 0.1, then append one entry per package:

```
## YYYY-MM-DD · <package id> <name>
Files: <created, changed, moved>
Commands: <each command, with the last lines of its output>
Provenance: <records added, with their source IDs; nulls and why>
Judgement calls: <anything the plan and research did not decide>
Open: <anything unfinished>
```

## 5. Stop conditions

Stop, write the log entry, and report to the human when:

- An acceptance command fails, and the fix isn't clear after two attempts.
- A baseline changes outside a phase that regenerates it.
- The package needs a file outside its list.
- A tool is missing, or a download is needed that the human hasn't approved.
- A numeric value has no provenance record, or is not in the research.
- The plan and the code disagree in a way the plan doesn't cover.

## 6. Human gates

A gate stops the build. At a gate the agent writes its log entry, reports, and waits. It doesn't commit, tag, or start the next phase until the human approves.

| Gate | The human checks |
| --- | --- |
| Phase 0 | The baseline files, that a second capture matches the first, and the FPS reading in a visible window (plan section 6) |
| Phase 1 | `git diff --stat` and the moves, with no number changes |
| Phase 2 | The LLY in the browser, against the baseline views |
| Phase 3 | The swap in the browser, by hand |
| Phase 4 | The provenance check has passed, and the LBZ entry runs in the browser. No value sign-off. |
| Phase 5 | The inline-six, visually and in motion |
| Phase 6 | The copy corrections, the chair's new position, the re-captured baseline, and the merge to `master` |

The Phase 0 FPS reading is taken after 0.8. Run `npm run build`, then `npm run preview`. Open the printed address in a normal Chrome window, without `?qa=1`, and leave it running for 30 seconds. In the DevTools console (F12), run `window.__LLY__.getFpsSamples()` and send the result to the agent. It returns up to six per-second values, and the agent logs their average. Note whether the app lowered its quality. It does so when the average drops below 44 fps.

## 7. Pilot

Run Phase 0, pass its gate, then run the first package of Phase 1. Judge the agent by the gate results, not by its summary. Don't start Phase 2 until the pilot's gates pass.

## 8. Packages and acceptance commands

Each package names its files, or points to the plan section that does. Stay inside the list, and stop if you need more.

### Phase 0: safety net

- **0.1** Create branch `engine-library`, then tag `phase-0-start`. Create `docs/build-log.md`. Run `npm test` and `npm run build`. Record the sizes Vite prints for the JS and CSS files in the build log. This is a record, not a gate.
- **0.2** Write `scripts/webgl-probe.mjs`. It launches Chrome with `channel: 'chrome'`, checks WebGL 2 (reading the renderer through `WEBGL_debug_renderer_info`) and counts `requestAnimationFrame` frames over 500 ms. It records the browser version, the renderer string and the frame count in the build log.
- **0.3** Write `scripts/check.mjs` with the name, numbers, encoding, ID and provenance checks from plan section 8, and add `npm run check`. Record today's output. The name and number checks are expected to fail, because the LLY names and literal numbers are still in `src/`. Log every match they report, and don't change the source to clear them. The provenance check passes vacuously, because there are no entries yet.
- **0.4** Under `?qa=1`, seed `Math.random` around scene construction, and drive time-dependent animation from the simulation clock. Under `?qa=1`, `animate()` does not advance the simulation, the camera or the telemetry. `window.__LLY__.render(count)` steps all three in fixed 1/60 s steps, as a normal frame does, and then renders once. The intro tween runs on that clock too. Normal mode (no `?qa=1`) behaves exactly as before. Change nothing else the app shows. Log every wall-clock read you change, and each one you leave alone with its reason. Plan section 2 lists them. Run `npm test` and `npm run build`; both must pass, and the log records the counts.
- **0.5** Write `scripts/capture-numeric.mjs` and `tests/baseline.test.mjs`. Generate `tests/baseline/lly-curves.json`.
- **0.6a** In `scripts/capture-browser.mjs`, capture `tests/baseline/lly-trace.json` and `tests/baseline/lly-geometry.json` as plan section 8 defines them, and measure the `buildEngine` time for LLY, which sets the swap budget (plan section 6). Serve the app with Vite's `createServer` on a free port. The code has no `import.meta.env` branches, so the dev server runs the same code. Launch Chrome with the launch arguments in `scripts/webgl-probe.mjs`, and record the browser version and the renderer string. Stop without writing any file if the renderer contains SwiftShader. Set `baseline:capture` to run `scripts/capture-numeric.mjs` and then `scripts/capture-browser.mjs`.
- **0.6b** Add the six views from plan section 8 to `scripts/capture-browser.mjs`, written to `.qa/baseline/` (git-ignored). Write `scripts/compare-browser.mjs`. It captures into `.qa/current/`, compares the two JSON files exactly and the six views by the rule in plan section 8, and refuses to compare when the browser version or renderer differs from the recorded one. Add `baseline:compare`.
- **0.7** Write `docs/qa-recipe.md`. Port the facts from the browser QA notes: the rAF shim, the hooks, the gotchas and the hidden-pane limits. The notes are at `C:\Users\colin\.claude\projects\C--Users-colin-Documents-DeepSeek-engineroom\memory\browser-qa-recipe.md`. If you cannot read that file, stop and report (section 5).
- **0.8** Acceptance:
  - `npm test`
  - `npm run baseline:capture`, run twice
  - `npm run baseline:compare`, which must match
  - `npm run build`
  - `npm run check`, expected to fail on the name and number checks, with its output logged

  After the human approves the Phase 0 gate, tag `phase-0-done`.

### Phase 1: move LLY into one entry

- **1.1** Create `src/engines/lly/index.js` from [research/lly.md](research/lly.md) section 9. Use the baseline values where the sheet differs: rod length 184 mm, and the current calibration labels. Copy each value exactly and change no value kinds. Add a provenance record for each numeric value.
- **1.2** Create `src/engines/lly/copy.js` by moving the LLY spec copy out of `specs.js`. The text stays the same.
- **1.3** Point `kinematics.js`, `engine.js`, `specs.js`, `collision.js`, `main.js` and `audio.js` at the entry through re-exports.
- **1.4** Keep `lly_report.md` at the root. The provenance records cite `docs/research/lly.md` and source S31.
- **1.5** Acceptance: `npm test`, then `npm run baseline:compare`, then `git diff --stat`, then `npm run check` (the provenance check must pass for the LLY entry).

### Phase 2: core reads the entry

- **2.1** Write `src/core/telemetry.js`. Move the curve functions and the gates into it, reading from the entry. Rail values stay in psi and are scaled after interpolation (plan section 5). The numeric baseline must still pass.
- **2.2** Write `src/core/simulation.js`. Move the start-up and the damping into it, reading `entry.startSequence`. The trace baseline must still pass.
- **2.3** Move `src/engine.js` to `src/engines/families/v8-ohv.js` with `git mv`, and update the imports that point at it. Take identity, layout, valve timing, look, explode offsets, quick parts, calibrations (each with its own peak rpm) and `PART_IDS` from the entry. Keep the dimension literals. Move the turbo and vane animation into the model, using the `update(dt, frame)` contract in plan section 5. Fix `timing-gears` so it registers through `createPart`.
- **2.4** Write `src/ui/bind.js`. Replace the LLY text in `index.html` with placeholders, and remove the `BOSCH CP3.3` hover placeholder. Generate the presets, calibration buttons and quick-part buttons, and hide a quick-part button when the family lacks that part. Take the preset toast names from the entry, replacing the names map in `applyPreset()`. Neutralise the comments in `src/styles.css`. Keep the current labels, so the baseline still matches.
- **2.5** Configure the audio from the entry. Keep one `MAX_RPM` value. The audio frame must carry every field its `update()` reads. `starting` and `vane` are missing from it today (plan section 5).
- **2.6** Acceptance: `npm test`, then `npm run check`, which must be clean outside `src/engines/`, then `npm run baseline:compare`.

### Phase 3: switching at runtime

- **3.1** Write `src/engines/index.js` and `src/engines/schema.js`. Add the loaders, `validateEntry()`, `?engine=` parsing, and `window.__ENGINE__`, with `__LLY__` kept as an alias. `ENGINE_IDS` lists LLY only. Write the registry tests (the Node tests in plan section 8).
- **3.2** Split `src/environment.js` into `src/environment/cell.js` and `src/environment/stand.js`, and delete the old file. Add `cell.setBranding`. Gauge scales are fractions of the entry's redline (plan section 5, Environment).
- **3.3** Make the engine reference in `main.js` mutable. Write `src/core/swap.js` to follow plan section 7 exactly. Add the picker, which calls `switchEngine`.
- **3.4** Write the test-only copy in `tests/fixtures/engines/lly-copy/`. Change identity, ratings, curves and copy, but not the stroke. Register it only when the build mode is `test`.
- **3.5** Add the resource tracker and the disposal rules.
- **3.6** Write `scripts/run-browser-tests.mjs` and add the `test:browser` npm script (section 9). Write `tests/browser/swap.browser.mjs`. It covers ten round trips, a clean console, resource counts back at baseline (the baseline is taken after the first round trip, plan section 7), and the cutaway state kept.
- **3.7** Add prop footprints and their Node test. Exempt the console chair by name in the test, with a comment that cites plan section 11, item 2, and log the exemption. Don't move the chair in Phase 3.
- **3.8** Acceptance: `npm test`, `npm run check`, `npm run test:browser`, and `npm run baseline:compare`.

### Phase 4: LBZ, from the research

- **4.1** Build the LBZ entry from [research/lbz.md](research/lbz.md) section 8: identity, geometry, compression ratio, ratings, the two calibrations, turbo geometry, features and oil. Use `null` for the gaps the sheet lists.
- **4.2** Write the LBZ spec copy. Claim only what the research supports. Do not claim the rod, piston or cooler differences, because they are not modelled (plan section 5).
- **4.3** Add a provenance record for every numeric value, citing the source IDs.
- **4.4** Register LBZ. Write its browser smoke test.
- **4.5** Acceptance: `npm test`, `npm run check` (which includes the provenance check) and `npm run test:browser`. Changes stay inside `src/engines/lbz/`, the registry list and the tests. If LBZ needs a builder change, stop and report.

### Phase 5: inline-six

- **5.1** Extract the generators the inline-six needs into `src/engines/shared/`, from the V8 family (plan section 6, Phase 5, names them). The V8 output must not change. Run `npm run baseline:compare` after each extraction.
- **5.2** Write `src/engines/families/inline-ohv.js`: one bank, six cylinders, crank pins at 120°, firing order 1-5-3-6-2-4. Stylised, with no CP3, glow plugs, EGR or VGT. The layout, the valve rows and the crank reference come from data, and the valve rows are generalised from banks to the layout. The entry has a spark-style start. Audio uses cylinders ÷ 2 pulses per revolution and no bank cadence. If the valvetrain grows too large, a simplified valvetrain is acceptable (plan section 6, Phase 5).
- **5.3** Write `src/engines/generic-i6/` with the values from [research/inline6.md](research/inline6.md). Label each value `sourced`, `derived` or `design`. The disclaimer states that the engine is fictional. Use no manufacturer name.
- **5.4** Write the layout tests: 120° intervals, and the firing order 1-5-3-6-2-4.
- **5.5** Write the browser smoke test: start, redline, cutaway, explode, walk and audio.
- **5.6** Acceptance: every check above, plus `npm run baseline:compare` for LLY. Then the human's visual review.

### Phase 6: hardening, research corrections and cleanup

- **6.1** Apply every copy correction in [research/lly.md](research/lly.md) section 8, not only the ones listed here. Change the Allison label to "Allison 1000 automatic", remove or mark the unsourced starter and glow-plug claims, and qualify the seven-hole claim as 2006. The injector wording follows open decision 1. Apply the same corrections to the LBZ copy where they apply.
- **6.2** Remove the `__LLY__` alias. Update `docs/qa-recipe.md`. Remove the unused exports named in plan section 6.
- **6.3** Update the README: an Engines section, the file map, the tests section, and an "Add an engine" guide.
- **6.4** `git rm -r archive/`.
- **6.5** Write `scripts/check-dist.mjs`, and add `npm run check:dist`.
- **6.6** Propose a new position for the console chair outside the walk circle. Move it there once the human approves, and remove its exemption from the footprint test (plan section 11, item 2). Then re-capture the baselines after the copy corrections and the chair move. Log each change and the reason.
- **6.7** Acceptance: every check, `npm run build`, `npm run check:dist`, and the browser smoke test for all three entries. The footprint test passes with no exemption.

## 9. Scripts and npm entries

Each script is created, and its entry added to `package.json`, in the package named in the table. These are the only allowed edits to that file.

| npm script | Package | File | Purpose |
| --- | --- | --- | --- |
| `check` | 0.3 | `scripts/check.mjs` | Names, numbers, encoding, IDs and provenance (plan section 8) |
| `baseline:capture` | 0.5, 0.6a | `scripts/capture-browser.mjs`, `scripts/capture-numeric.mjs` | Writes the baselines |
| `baseline:compare` | 0.6b | `scripts/compare-browser.mjs` | Compares the browser captures with the baselines |
| `test:browser` | 3.6 | `scripts/run-browser-tests.mjs` | Starts Vite in test mode and runs `tests/browser/*.browser.mjs` |
| `check:dist` | 6.5 | `scripts/check-dist.mjs` | Checks that the test copy is absent from `dist/` and each engine is its own chunk (plan Phase 6) |

`scripts/webgl-probe.mjs` is run directly with `node`. It has no npm entry.
