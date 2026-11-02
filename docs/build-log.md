## 2026-10-31 · 0.1 Branch, tag and build log

Files: `docs/build-log.md` (created); starting items: `docs/` (untracked), `README.md`, `lly_report.md`.

Commands:
```text
git switch -c engine-library
Switched to a new branch 'engine-library'

git tag phase-0-start
(no output)

npm test
# first attempt, sandboxed: all five test files failed before assertions
ℹ tests 5
ℹ pass 0
ℹ fail 5
[exit code 1 — spawn EPERM]

# approved unsandboxed rerun, same command
ℹ tests 141
ℹ suites 27
ℹ pass 141
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 278.9306
npm notice run duramax-lly-test-cell@1.0.0 test
npm notice run node --test

npm run build
dist/index.html                    21.43 kB │ gzip:   5.86 kB
dist/assets/index-Ce0JMQIe.css     34.94 kB │ gzip:   8.01 kB
dist/assets/index-B46NPU_L.js   1,284.84 kB │ gzip: 402.13 kB
✓ built in 392ms
npm notice run duramax-lly-test-cell@1.0.0 build
npm notice run vite build
```

Bundle sizes: CSS `dist/assets/index-Ce0JMQIe.css` 34.94 kB (gzip 8.01 kB); JS `dist/assets/index-B46NPU_L.js` 1,284.84 kB (gzip 402.13 kB).

Provenance: None.

Judgement calls:
- Created a lightweight tag with plain `git tag`; the runbook does not specify whether `phase-0-start` should be annotated.
- Created the branch and tag before writing this log, as package 0.1 requires.
- Left the three starting items untracked/modified; did not stage, revert, or commit them.
- `phase-0-start` points at `864f014`, the same commit as `master`, because no commit was made before tagging.
- The first `npm test` attempt was blocked by the sandbox (`spawn EPERM` before assertions); after approval, reran the exact command unsandboxed. The passing result above is from that rerun.
- Recorded the JS and CSS sizes as Vite printed them. Did not treat Vite's >500 kB chunk warning as a gate.

Open:
- The three starting items remain uncommitted and are intended for the later Phase 0 commit.
- `docs/build-log.md` is uncommitted as part of the untracked `docs/` directory.
- No commit was made. Package 0.2 and all later work have not been started.
- The Phase 0 gate has not been reached.
- Vite warns that the JS chunk is larger than 500 kB; this is recorded but was not acted on in 0.1.

## 2026-10-31 · 0.2 WebGL probe

Files: `scripts/webgl-probe.mjs` (created); `docs/build-log.md` (changed).

Commands:
```text
node scripts/webgl-probe.mjs
# first attempt, sandboxed: Playwright failed to launch Chrome with spawn EPERM
# approved unsandboxed rerun, same command:
Chrome: 156.0.8078.48
WebGL 2: yes
Renderer: ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (8GB) (0x000064A0) Direct3D11 vs_5_0 ps_5_0, D3D11)
rAF frames over 500 ms: 29
```

Provenance: None.

Judgement calls:
- Launched Chrome headlessly through Playwright with `channel: 'chrome'`; the runbook does not specify headed versus headless.
- Added WebGL and background-throttling launch flags, including `--enable-unsafe-swiftshader`; the runbook does not specify launch arguments. The reported renderer is the Intel Arc GPU, not SwiftShader.
- The first attempt was blocked by the sandbox (`spawn EPERM`); after approval, reran the exact command unsandboxed. The output above is from that rerun.
- Counted each rAF callback until at least 500 ms had elapsed since scheduling began; the count includes the first callback.

Open:
- No npm script was added for the probe, per the package instruction.
- The probe is not yet wired into `npm run check` or another acceptance command.
- Package 0.3 and later work have not been started.
- No commit was made.

## 2026-10-31 · 0.3 Checks

Files: `scripts/check.mjs` (created); `package.json` (changed); `docs/build-log.md` (changed).

Commands:
```text
npm run check
Scope: src/ and index.html; names and numbers exclude src/engines/.
Names: FAIL (215 matches in 154 lines)
  index.html:13: Duramax, LLY
  index.html:15: DMAX, LLY, 6600
  index.html:21: Duramax, LLY
  index.html:36: DURAMAX, 6600
  index.html:37: LLY, DMAX, MORAINE
  index.html:81: LLY
  index.html:160: allison, Allison, ALLISON
  index.html:161: zf, ZF, ZF
  index.html:204: GT3788VA
  index.html:230: ALLISON, CP3
  index.html:248: cp3, CP3
  index.html:333: LLY, 6600
  index.html:350: BOSCH, CP3
  index.html:365: LLY
  index.html:392: DMAX, MORAINE
  index.html:393: LLY
  index.html:403: DURAMAX, LLY
  index.html:414: PF2232
  index.html:420: Allison, ZF
  src/audio.js:178: Garrett, GT3788VA
  src/audio.js:227: Denso
  src/audio.js:319: Bosch, CP3
  src/audio.js:447: Garrett, GT3788VA
  src/audio.js:478: Denso
  src/engine.js:28: LLY
  src/engine.js:68: Duramax, LLY, 6600
  src/engine.js:545: GM
  src/engine.js:548: GM
  src/engine.js:549: DURAMAX, 6600, LLY
  src/engine.js:559: DMAX, MORAINE
  src/engine.js:560: LLY, 6600
  src/engine.js:1432: DMAX
  src/engine.js:1818: Bosch
  src/engine.js:1860: BOSCH
  src/engine.js:1861: LLY
  src/engine.js:1995: LLY
  src/engine.js:2010: DURAMAX
  src/engine.js:2011: LLY, 6600
  src/engine.js:2215: DMAX
  src/engine.js:2261: ACDelco
  src/engine.js:2262: PF2232
  src/engine.js:2333: PF2232
  src/engine.js:2334: ACDelco
  src/engine.js:2612: DMAX
  src/engine.js:2613: LLY, 6600
  src/engine.js:2762: LLY
  src/engine.js:2815: Garrett
  src/engine.js:2825: GARRETT
  src/engine.js:2826: GT3788VA
  src/engine.js:3041: GARRETT
  src/engine.js:3042: GT3788VA
  src/engine.js:3049: BOSCH
  src/engine.js:3258: DURAMAX
  src/engine.js:3259: LLY
  src/engine.js:3465: LLY
  src/engine.js:3478: CP3
  src/engine.js:3483: cp3, cp3
  src/engine.js:3487: CP3
  src/engine.js:3490: cp3
  src/engine.js:3552: BOSCH
  src/engine.js:3553: CP3
  src/engine.js:3563: Bosch
  src/engine.js:3572: CP3, BOSCH
  src/engine.js:3588: cp3
  src/engine.js:3601: cp3
  src/engine.js:3615: cp3
  src/engine.js:3628: cp3
  src/engine.js:3641: cp3
  src/engine.js:3648: cp3
  src/engine.js:3702: BOSCH
  src/engine.js:4204: LLY
  src/engine.js:4205: LLY
  src/environment.js:281: DMAX
  src/environment.js:396: DMAX
  src/environment.js:397: MORAINE
  src/environment.js:430: DMAX
  src/environment.js:991: DMAX
  src/environment.js:1329: DMAX
  src/environment.js:1370: MORAINE
  src/kinematics.js:1: LLY
  src/kinematics.js:2: Duramax, 6600
  src/kinematics.js:3: LLY
  src/kinematics.js:25: DMAX, Moraine
  src/kinematics.js:29: allison
  src/kinematics.js:30: allison
  src/kinematics.js:31: Allison
  src/kinematics.js:32: ALLISON
  src/kinematics.js:38: zf
  src/kinematics.js:39: zf
  src/kinematics.js:40: ZF
  src/kinematics.js:41: ZF
  src/kinematics.js:58: Duramax
  src/kinematics.js:115: LLY
  src/kinematics.js:116: LLY
  src/kinematics.js:117: LLY
  src/kinematics.js:126: LLY, LLY
  src/kinematics.js:130: LLY
  src/kinematics.js:213: LLY
  src/kinematics.js:230: LLY, Allison, ZF
  src/kinematics.js:231: allison
  src/kinematics.js:235: zf
  src/kinematics.js:278: allison
  src/kinematics.js:282: allison
  src/kinematics.js:284: zf
  src/main.js:19: LLY
  src/main.js:176: LLY
  src/main.js:181: allison
  src/main.js:305: LLY
  src/main.js:310: LLY, LLY
  src/main.js:317: LLY
  src/main.js:833: allison
  src/main.js:834: zf
  src/main.js:837: allison, allison, allison
  src/main.js:838: zf, zf, zf
  src/main.js:844: allison
  src/main.js:845: allison
  src/main.js:1031: LLY, LLY
  src/main.js:1159: GT3788VA
  src/main.js:1224: CP3
  src/main.js:1463: DMAX, LLY, 6600
  src/main.js:1474: MORAINE
  src/main.js:1478: duramax, lly
  src/specs.js:1: LLY
  src/specs.js:52: LLY, Duramax, 6600
  src/specs.js:149: Bosch
  src/specs.js:160: LLY
  src/specs.js:165: Bosch
  src/specs.js:192: LLY
  src/specs.js:269: LLY
  src/specs.js:281: Garrett, GT3788VA
  src/specs.js:284: Garrett, GT3788VA, LLY
  src/specs.js:286: Garrett, GT3788VA
  src/specs.js:363: GT3788VA
  src/specs.js:383: cp3
  src/specs.js:385: BOSCH
  src/specs.js:386: Bosch, CP3
  src/specs.js:389: Bosch, CP3
  src/specs.js:391: Bosch, CP3
  src/specs.js:432: BOSCH
  src/specs.js:436: Bosch
  src/specs.js:443: Bosch
  src/specs.js:467: LLY
  src/specs.js:479: ACDelco, PF2232
  src/specs.js:482: ACDelco, PF2232
  src/specs.js:484: ACDelco, PF2232
  src/specs.js:527: Bosch, CP3
  src/specs.js:530: CP3
  src/specs.js:541: LLY
  src/specs.js:596: DMAX, MORAINE
  src/specs.js:600: LLY
  src/specs.js:602: DMAX
  src/specs.js:615: LLY
  src/specs.js:643: LLY
  src/styles.css:2: DMAX, LLY, 6600
Numbers: FAIL (37 matches in 33 lines)
  index.html:118: 3250
  index.html:132: 3000
  index.html:133: 3250
  index.html:194: 3250
  src/audio.js:4: 3250
  src/engine.js:4270: 3250
  src/environment.js:1365: 3250, 3250
  src/kinematics.js:16: 3000
  src/kinematics.js:17: 3250
  src/kinematics.js:35: 26000
  src/kinematics.js:247: 3000
  src/kinematics.js:249: 3250
  src/kinematics.js:262: 3000
  src/kinematics.js:264: 3250
  src/kinematics.js:284: 26000
  src/kinematics.js:292: 3000
  src/kinematics.js:293: 3250, 26000
  src/kinematics.js:304: 26000
  src/kinematics.js:317: 3000
  src/kinematics.js:318: 3250
  src/kinematics.js:340: 3000
  src/kinematics.js:341: 3250
  src/kinematics.js:357: 3250
  src/kinematics.js:366: 3250
  src/main.js:41: 3250
  src/main.js:763: 3000
  src/main.js:788: 3000
  src/main.js:829: 3000
  src/main.js:999: 26000
  src/main.js:1034: 3200
  src/main.js:1247: 3000, 3250
  src/main.js:1423: 3000, 3250
  src/main.js:1540: 3200
Encoding: PASS (0 matches)
IDs: PASS (0 matches)
  No src/engines/index.js registry or ENGINE_IDS array yet; no engine-ID strings to compare.
Provenance: PASS (0 matches)
  No entries under src/engines/ yet; passes vacuously.
Result: FAIL (2 of 5 checks failed: Names, Numbers)
npm notice run duramax-lly-test-cell@1.0.0 check
npm notice run node scripts/check.mjs
[exit code: 1]
```

Provenance: None.

Judgement calls:
- Implemented the name check with the plan section 8 regex, case-insensitive, over `src/` and `index.html`, excluding `src/engines/`. It fails on the existing LLY branding and identifiers, as expected before Phase 2.
- Implemented the number check against the literal forms `3250`, `3000`, `3200` and `26000`. Comma-formatted display copy such as `3,250` and `26,000` is not treated as a number match by this check.
- Every number match is a legitimate current engine or UI value and stays unchanged in 0.3. The `3250` values are the current redline/governor and gauge or curve points; `3000` is the current peak-power rpm and redline mark; `26000` is the Allison rail-pressure ceiling. The `3200` at `src/main.js:1034` is the governed-status threshold; the `3200` at `src/main.js:1540` is a 3,200 ms toast duration, not an engine value.
- The ID check passes vacuously: there is no `src/engines/index.js` or `ENGINE_IDS` array, so there are no registered engine-ID strings to compare.
- The provenance check passes vacuously: there are no entry directories under `src/engines/`. Full numeric provenance validation for actual entries is not implemented yet.
- The non-zero exit is the expected result of the name and number checks; no source was changed to clear it.

Open:
- The name and number checks remain failing until Phase 2, as planned.
- Comma-formatted display values are outside the number check's literal matching; this is recorded rather than changed.
- The ID check will need the real registry to compare against once `src/engines/index.js` exists.
- Full provenance validation for actual entries remains to be implemented when entries exist.
- Package 0.4 and all later work have not been started.
- No commit was made.

### Correction — 2026-10-31

Files: `scripts/check.mjs` (changed only); `docs/build-log.md` (changed).

Provenance: None.

Changed:
- The ID check now always compares quoted strings against the planned IDs `lly`, `lbz` and `generic-i6`, and adds `ENGINE_IDS` from `src/engines/index.js` when that registry exists. Its note lists every ID compared.
- The number check now matches the comma forms `3,250`, `3,000`, `3,200` and `26,000` as well as the plain forms, using the same word boundaries.
- This supersedes the earlier notes that IDs passed only because no registry existed, and that comma-formatted values were outside the number check.

Commands:
```text
npm run check
Scope: src/ and index.html; names and numbers exclude src/engines/.
Names: FAIL (215 matches in 154 lines)
# The 154 name-match lines are unchanged from the original 0.3 output above and are not repeated.
Numbers: FAIL (52 matches in 46 lines)
  index.html:118: 3250
  index.html:132: 3000, 3,000
  index.html:133: 3250, 3,250
  index.html:160: 26,000
  index.html:194: 3250
  index.html:230: 26,000
  index.html:412: 3,000
  index.html:413: 3,250
  src/audio.js:4: 3250
  src/engine.js:4270: 3250
  src/environment.js:1365: 3250, 3250
  src/kinematics.js:16: 3000
  src/kinematics.js:17: 3250
  src/kinematics.js:35: 26000
  src/kinematics.js:247: 3000
  src/kinematics.js:249: 3250
  src/kinematics.js:262: 3000
  src/kinematics.js:264: 3250
  src/kinematics.js:284: 26000
  src/kinematics.js:292: 3000
  src/kinematics.js:293: 3250, 26000
  src/kinematics.js:304: 26000
  src/kinematics.js:317: 3000
  src/kinematics.js:318: 3250
  src/kinematics.js:340: 3000
  src/kinematics.js:341: 3250
  src/kinematics.js:357: 3250
  src/kinematics.js:366: 3250
  src/main.js:41: 3250
  src/main.js:763: 3000
  src/main.js:788: 3000
  src/main.js:829: 3000
  src/main.js:999: 26000
  src/main.js:1034: 3200
  src/main.js:1247: 3000, 3250
  src/main.js:1423: 3000, 3250
  src/main.js:1540: 3200
  src/specs.js:395: 26,000
  src/specs.js:406: 26,000
  src/specs.js:409: 26,000
  src/specs.js:417: 26,000
  src/specs.js:421: 26,000
  src/specs.js:424: 26,000
  src/specs.js:441: 26,000
  src/specs.js:645: 3,000
  src/specs.js:646: 3,250
Encoding: PASS (0 matches)
IDs: PASS (0 matches)
  Compared quoted strings against: lly, lbz, generic-i6.
Provenance: PASS (0 matches)
  No entries under src/engines/ yet; passes vacuously.
Result: FAIL (2 of 5 checks failed: Names, Numbers)
npm notice run duramax-lly-test-cell@1.0.0 check
npm notice run node scripts/check.mjs
[exit code: 1]
```

Number classification (52 matches in 46 lines):

Expected to move in Phase 2 (51 matches). The `src/specs.js` copy is actually scheduled to move in Phase 1 and is gone by Phase 2:
- `index.html`: 118 `3250`; 132 `3000`, `3,000`; 133 `3250`, `3,250`; 160 `26,000`; 194 `3250`; 230 `26,000`; 412 `3,000`; 413 `3,250`.
- `src/audio.js`: 4 `3250`.
- `src/engine.js`: 4270 `3250`.
- `src/environment.js`: 1365 `3250` ×2.
- `src/kinematics.js`: 16 `3000`; 17 `3250`; 35 `26000`; 247 `3000`; 249 `3250`; 262 `3000`; 264 `3250`; 284 `26000`; 292 `3000`; 293 `3250`, `26000`; 304 `26000`; 317 `3000`; 318 `3250`; 340 `3000`; 341 `3250`; 357 `3250`; 366 `3250`.
- `src/main.js`: 41 `3250`; 763 `3000`; 788 `3000`; 829 `3000`; 999 `26000`; 1034 `3200`; 1247 `3000`, `3250`; 1423 `3000`, `3250`.
- `src/specs.js`: 395 `26,000`; 406 `26,000`; 409 `26,000`; 417 `26,000`; 421 `26,000`; 424 `26,000`; 441 `26,000`; 645 `3,000`; 646 `3,250`.

False positive (1 match):
- `src/main.js:1540` `3200` — this is the 3,200 ms adaptive-quality toast duration, not an engine value. It is not expected to move in Phase 2.

Judgement calls:
- Kept the ID comparison case-sensitive so the planned IDs match their lowercase folder-name form, not uppercase branding such as `LLY`.
- Treated the `3200` governed-status threshold at `src/main.js:1034` as engine-related and therefore expected to move or derive from the entry by Phase 2. Only the toast duration at `src/main.js:1540` is a false positive.
- Did not change any source file to clear a match.

Open:
- The corrected name and number checks still fail as expected.
- The toast-duration false positive will need an exception or a different treatment before Phase 2 can report the number check clean.
- Full provenance validation for actual entries remains to be implemented when entries exist.
- Package 0.4 and all later work have not been started.
- No commit was made.

## 2026-10-31 · 0.4 Determinism under ?qa=1

Files: `src/main.js` (changed); `docs/build-log.md` (changed).

Commands:
```text
npm test
...
ℹ tests 141
ℹ suites 27
ℹ pass 141
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 295.2165
npm notice run duramax-lly-test-cell@1.0.0 test
npm notice run node --test

npm run build
vite v8.3.5 building client environment for production...
✓ 35 modules transformed.
dist/index.html                    21.43 kB │ gzip:   5.86 kB
dist/assets/index-Ce0JMQIe.css     34.94 kB │ gzip:   8.01 kB
dist/assets/index-rJJw-yi3.js   1,285.25 kB │ gzip: 402.33 kB
✓ built in 584ms
npm notice run duramax-lly-test-cell@1.0.0 build
npm notice run vite build
```

Provenance: None.

What changed:
- Added a seeded PRNG for QA scene construction. Seed: `0x5eed0a04`. The generator is in `src/main.js:46–57`; `withSeededRandom()` at `src/main.js:61–70` installs it, runs the callback, and restores the original `Math.random` in `finally`.
- Wrapped scene construction that draws randomness: `buildEnvironment()` at `src/main.js:115` and `new SSAOPass()` at `src/main.js:157–159`.
- Under `?qa=1`, `animate()` no longer advances simulation, camera or telemetry; it keeps the loop, hover check, screenshot check, FPS sampler and render.
- `window.__LLY__.render(count)` now advances `simulation.elapsed` by 1/60, then steps simulation, camera and telemetry once per iteration at 1/60, then renders once.
- The intro tween uses `simulation.elapsed` under QA and the original wall-clock expression in normal mode.

Wall-clock reads changed:
- `src/main.js:209 → 237` — `startedAt` initialisation. Before: `let startedAt = performance.now();`. After: `let startedAt = QA_MODE ? 0 : performance.now();`.
- `src/main.js:412 → 440–442` — intro tween time. Before: `const t = clamp((performance.now() - startedAt) / 1000 / introTween.duration, 0, 1);`. After: `QA_MODE ? clamp(simulation.elapsed / introTween.duration, 0, 1) : clamp((performance.now() - startedAt) / 1000 / introTween.duration, 0, 1)`.
- `src/main.js:1495 → 1525` — `previousFrameTime` initialisation. Before: `let previousFrameTime = performance.now();`. After: `let previousFrameTime = QA_MODE ? 0 : performance.now();`.
- `src/main.js:1499–1510 → 1529–1543` — frame delta and the three advances. Before: always read `performance.now()`, updated `previousFrameTime`, added `dt` to `simulation.elapsed`, and called `updateSimulation`, `updateCamera`, `updateTelemetryUI`. After: all of that is inside `if (!QA_MODE) { ... }`, so QA reads none of it.
- `src/main.js:1558 → 1591–1593` — `startedAt` reset in `boot()`. Before: unconditional `startedAt = performance.now();`. After: inside `if (!QA_MODE) { startedAt = performance.now(); }`.
- `src/main.js:1559 → 1594` — `previousFrameTime` reset in `boot()`. Before: `previousFrameTime = performance.now();`. After: `previousFrameTime = QA_MODE ? 0 : performance.now();`.

Clock stepping changed (not a wall-clock read):
- `src/main.js:1638–1641 → 1673–1681` — `render(count)`. Before: `for (...) updateSimulation(1 / 60); composer.render();`. After: each iteration does `simulation.elapsed += 1 / 60; updateSimulation(1 / 60); updateCamera(1 / 60); updateTelemetryUI(1 / 60);`, then one `composer.render()`.

Wall-clock reads left alone:
- `src/main.js:696 → 726` — pointer-down timestamp. Input gesture timing for click versus drag; it does not move the simulation, camera or intro.
- `src/main.js:703 → 733` — pointer-held duration. Same input gesture; it does not drive animation.
- `src/main.js:1169 → 1199` — toast hide timer. UI-only transient message; it does not affect the simulation, camera, telemetry or picture baseline.
- `src/main.js:1512–1513 → 1545–1546` — hover throttle. Input timing; the QA loop deliberately keeps the hover check.
- `src/main.js:1527–1542 → 1560–1575` — FPS sampler and adaptive-quality check. It is a measurement reported by `getFpsSamples()`; adaptive quality is already disabled under QA.
- `src/main.js:1560 → 1595` — `lastFpsCheck` initialisation in `boot()`. It belongs to the retained FPS sampler.

Math.random sites seeded:
- `src/environment.js:1733–1735` — dust-mote x, y and z positions, through `buildEnvironment()`.
- `node_modules/three/examples/jsm/postprocessing/SSAOPass.js:443–445` — SSAO sample-kernel x, y and z, through `new SSAOPass()`.
- `node_modules/three/examples/jsm/postprocessing/SSAOPass.js:470–471` — SSAO noise-rotation x and y, through `new SSAOPass()`.

Math.random sites left alone:
- `src/audio.js:28` and `src/audio.js:323` — audio noise and pulse offset. They do not reach the picture, so they are unchanged and are not seeded.

Judgement calls:
- Used one shared seeded sequence for both construction sites, so the environment consumes the first draws and SSAO consumes the next. The original `Math.random` is restored after each wrapper call.
- Kept `animate()` rendering under QA. It only stops advancing state, which keeps hover, screenshots and the FPS sampler working.
- Used `simulation.elapsed` as the QA clock, the same accumulator the normal frame delta advances. `render(count)` advances it by exactly 1/60 per step.
- Kept the existing `QA_MODE` selection (`has('qa')`); `?qa=1` is the QA URL used by the package.
- Ran `npm test` with one-shot unsandboxed approval because the sandbox blocks Node's test runner with `spawn EPERM`. No source was changed to work around it.
- No application visuals, labels or numeric values were changed.

Open:
- Browser capture and comparison start in package 0.6; this package verifies only test and build.
- The seeded construction and QA clock have not yet been captured in a baseline.
- Package 0.5 and all later work have not been started.
- No commit was made, and no tag was created.

## 2026-10-31 · 0.5 Numeric baseline

Files: `scripts/capture-numeric.mjs` (created); `tests/baseline.test.mjs` (created); `tests/baseline/lly-curves.json` (created); `package.json` (changed); `docs/build-log.md` (changed).

Commands:
```text
npm run baseline:capture
Wrote tests\baseline\lly-curves.json
npm notice run duramax-lly-test-cell@1.0.0 baseline:capture
npm notice run node scripts/capture-numeric.mjs

npm test
...
ℹ tests 142
ℹ suites 28
ℹ pass 142
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 315.4209
npm notice run duramax-lly-test-cell@1.0.0 test
npm notice run node --test

npm run build
vite v8.3.5 building client environment for production...
✓ 35 modules transformed.
dist/index.html                    21.43 kB │ gzip:   5.86 kB
dist/assets/index-Ce0JMQIe.css     34.94 kB │ gzip:   8.01 kB
dist/assets/index-rJJw-yi3.js   1,285.25 kB │ gzip: 402.33 kB
✓ built in 535ms
npm notice run duramax-lly-test-cell@1.0.0 build
npm notice run vite build

npm run check
Names: FAIL (215 matches in 154 lines)
Numbers: FAIL (52 matches in 46 lines)
Encoding: PASS (0 matches)
IDs: PASS (0 matches)
  Compared quoted strings against: lly, lbz, generic-i6.
Provenance: PASS (0 matches)
  No entries under src/engines/ yet; passes vacuously.
Result: FAIL (2 of 5 checks failed: Names, Numbers)
[exit code: 1]
```

Provenance: None.

Grid:
- RPM: 0 to 4000 inclusive in steps of 10, 401 points.
- Crank: 0 to 718 inclusive in steps of 2 degrees, 360 points.
- All eight `CYLINDERS`; all calibration keys `allison` and `zf`.
- Numeric baseline: `tests/baseline/lly-curves.json`, 4,247,635 bytes (4.05 MiB), 152,276 lines.

What the baseline records:
- For each calibration key: `torqueAtRpm`, `horsepowerAtRpm` and `railPressureAtRpm` at all 401 RPM points, with that calibration key passed.
- `boostAtRpm`, `vaneAtRpm`, `egtAtRpm`, `oilPressureAtRpm` and `coolantAtRpm` at all 401 RPM points.
- For each cylinder: `cycleAngle`, `pistonKinematics`, `crankPinWorld`, `cylinderState`, and `valveLift` and `valveVelocity` for both `intake` and `exhaust`, at all 360 crank angles. The cycle value is computed once per angle and passed to the valve functions.
- `camshaftAngleDeg` and `activeFiringCylinder` at all 360 crank angles.

Exported functions left out and why:
- `mod`: pure modular arithmetic helper; it is exercised through `cycleAngle`, `wrapSignedDeg` and the outputs.
- `wrapSignedDeg`: pure angle wrapping helper; it is exercised through `valveLift`.
- `pinWorldAngleDeg`: intermediate angle; its result is included in `pistonKinematics.pinAngle` and `crankPinWorld`.
- `strokeAtCycle`: its result is included in `cylinderState.stroke`.

Choices beyond the prompt:
- Exported the capture as the named function `captureNumericBaseline`; the test imports that name.
- Stored `camshaftAngleDeg` and `activeFiringCylinder` once per crank angle at the top level, not once per cylinder, because neither depends on the cylinder.
- Stored the raw return values, including the embedded cylinder objects in `cylinderState` and `activeFiringCylinder`. This is why the JSON is 4.25 MiB; projecting those objects to bare numbers would have discarded function output.
- Normalized recursively before returning, so the returned object and the parsed JSON both have `0` rather than `-0`; non-finite numbers throw with a path label.
- Created the `tests/baseline/` directory from the capture script and wrote two-space JSON with a final newline.
- Used `new URL('./baseline/lly-curves.json', import.meta.url)` in the test to resolve the file independently of the working directory.
- Ran the capture once. The double-capture and compare acceptance belongs to 0.8.

Test counts:
- Before 0.5: 141 tests, 27 suites.
- After 0.5: 142 tests, 28 suites, 142 passed, 0 failed.

Check results:
- Names: FAIL, 215 matches in 154 lines.
- Numbers: FAIL, 52 matches in 46 lines.
- Encoding: PASS, 0 matches.
- IDs: PASS, 0 matches; compared `lly`, `lbz`, `generic-i6`.
- Provenance: PASS, 0 matches; no entries.
- Overall: FAIL, 2 of 5 checks failed.
- These are the same match counts as 0.4. `src/main.js` line numbers in the output shifted because 0.4 added lines; no new match came from 0.5.

Build sizes:
- CSS: `34.94 kB` (gzip `8.01 kB`).
- JS: `1,285.25 kB` (gzip `402.33 kB`).
- Built in 535 ms.

Judgement calls:
- Kept the baseline file in `tests/baseline/`, matching the plan path.
- Used one test with `assert.deepStrictEqual` rather than field-by-field assertions, so the whole object is exact.
- Ran `npm test` with one-shot unsandboxed approval because the sandbox blocks Node's test runner with `spawn EPERM`.
- Did not change anything under `src/`.

Open:
- The human Phase 0 baseline approval is still pending.
- The second capture and all-exact comparison are package 0.8 work.
- `npm run check` still fails on names and numbers as expected; no source was changed to clear it.
- Package 0.6 and all later work have not been started.
- No commit was made, and no tag was created.

### Correction — 2026-10-31

Files: `scripts/capture-numeric.mjs` (changed); `tests/baseline/lly-curves.json` (regenerated); `docs/build-log.md` (changed). `tests/baseline.test.mjs` and every file under `src/` are unchanged.

Changed:
- Added one top-level `constants` object holding the raw values of `LLY`, `CALIBRATIONS`, `VALVE_TIMING`, `CYLINDERS`, `FIRING_ORDER`, `STATION_Z`, `BANK_Z_OFFSET` and `STATION_THROW_OFFSET`.
- Left out `CYLINDER_BY_NUMBER` and `CYLINDER_BY_STATION_BANK` because both are derived directly from `CYLINDERS`; storing them would duplicate the same data.
- Left out `DEG` and `RAD` because they are only `Math.PI` conversions, not engine values that Phase 1 moves.
- In `cylinderState` and `activeFiringCylinder`, replaced the embedded full cylinder object with `cylinder.number`. `CYLINDERS` is captured once under `constants`, so no information is lost. Every other value is unchanged.

Commands:
```text
npm run baseline:capture
Wrote tests\baseline\lly-curves.json
npm notice run duramax-lly-test-cell@1.0.0 baseline:capture
npm notice run node scripts/capture-numeric.mjs

npm test
...
ℹ tests 142
ℹ suites 28
ℹ pass 142
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 282.4615
npm notice run duramax-lly-test-cell@1.0.0 test
npm notice run node --test

npm run build
vite v8.3.5 building client environment for production...
✓ 35 modules transformed.
dist/index.html                    21.43 kB │ gzip:   5.86 kB
dist/assets/index-Ce0JMQIe.css     34.94 kB │ gzip:   8.01 kB
dist/assets/index-rJJw-yi3.js   1,285.25 kB │ gzip: 402.33 kB
✓ built in 235ms
npm notice run duramax-lly-test-cell@1.0.0 build
npm notice run vite build

npm run check
Names: FAIL (215 matches in 154 lines)
Numbers: FAIL (52 matches in 46 lines)
Encoding: PASS (0 matches)
IDs: PASS (0 matches)
  Compared quoted strings against: lly, lbz, generic-i6.
Provenance: PASS (0 matches)
  No entries under src/engines/ yet; passes vacuously.
Result: FAIL (2 of 5 checks failed: Names, Numbers)
[exit code: 1]
```

New baseline size: 3,270,130 bytes (3.12 MiB), 116,833 lines. This is 977,505 bytes smaller than the original 4,247,635-byte file, about 23 percent.

Grid unchanged:
- RPM: 0 to 4000 inclusive in steps of 10, 401 points.
- Crank: 0 to 718 inclusive in steps of 2 degrees, 360 points.
- All eight cylinders; both calibration keys.

Test count: 142 tests, 28 suites, 142 passed, 0 failed.
Build sizes: CSS 34.94 kB (gzip 8.01 kB); JS 1,285.25 kB (gzip 402.33 kB); built in 235 ms.
Check results: Names FAIL 215/154; Numbers FAIL 52/46; Encoding PASS 0; IDs PASS 0; Provenance PASS 0; overall FAIL, 2 of 5 checks. Same counts as the original 0.5 run.

Judgement calls:
- Kept `constants` as one top-level key, in the order listed in the correction request.
- Kept the raw constants unfiltered; the derived Maps and the two `Math.PI` conversion constants are the only source exports omitted.
- Replaced only the `cylinder` field in `cylinderState` and `activeFiringCylinder`; all other fields remain untouched.
- Regenerated the baseline and verified it with the unchanged `tests/baseline.test.mjs`.

Open:
- The human Phase 0 baseline approval is still pending.
- The second capture and all-exact comparison are package 0.8 work.
- `npm run check` still fails on names and numbers as expected; no source was changed to clear it.
- Package 0.6 and all later work have not been started.
- No commit was made, and no tag was created.

## 2026-10-31 · 0.6a Browser data captures

Files: `scripts/capture-browser.mjs` (created); `tests/baseline/lly-trace.json` (created); `tests/baseline/lly-geometry.json` (created); `package.json` (changed); `docs/build-log.md` (changed). `tests/baseline/lly-curves.json` was regenerated by the combined command and remained 3,270,130 bytes.

Capture output:
```text
npm run baseline:capture
Wrote tests\baseline\lly-curves.json
Vite: http://127.0.0.1:51372/
Chrome: 156.0.8078.48
Renderer: ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (8GB) (0x000064A0) Direct3D11 vs_5_0 ps_5_0, D3D11)
Trace 1x
  stop-initial: steps=302 capped=false end={"rpm":0,"fuel":0,"glow":0,"crankAngle":299.9516309425676,"vaneAngle":-0.35,"turboAngles":[38.08321499531976,35.95255779569418]}
  start-idle-680: steps=272 capped=false end={"rpm":679.0122071070111,"fuel":1,"glow":0.00011194863174369926,"crankAngle":63.312619834116845,"vaneAngle":0.508,"turboAngles":[159.43410379181657,147.59537548847146]}
  preset-3250: steps=481 capped=false end={"rpm":3249.0042786942627,"fuel":1,"glow":4.020096703288936e-15,"crankAngle":381.81708424354565,"vaneAngle":-0.12999999999999995,"turboAngles":[1199.9782187179367,1104.8959612205028]}
  hold-3250: steps=120 capped=false end={"rpm":3249.8597442691885,"fuel":1,"glow":9.964823453686708e-18,"crankAngle":496.6221967480608,"vaneAngle":-0.12999999999999995,"turboAngles":[1487.4193430381385,1369.3417955950874]}
  stop-final: steps=391 capped=false end={"rpm":0,"fuel":0,"glow":9.964823453686708e-18,"crankAngle":165.23342705500522,"vaneAngle":-0.35,"turboAngles":[1634.1511913225072,1504.335096016706]}
Trace 0.12x
  stop-initial: steps=302 capped=false end={"rpm":0,"fuel":0,"glow":0,"crankAngle":527.8341957131086,"vaneAngle":-0.35,"turboAngles":[5.211291574842582,5.710388248855182]}
  start-idle-680: steps=272 capped=false end={"rpm":679.0122071070111,"fuel":1,"glow":0.00011194863174369926,"crankAngle":153.83751438009494,"vaneAngle":0.508,"turboAngles":[19.778195654265904,19.11194000192465]}
  preset-3250: steps=481 capped=false end={"rpm":3249.0042786942627,"fuel":1,"glow":4.020096703288936e-15,"crankAngle":480.05805010922495,"vaneAngle":-0.12999999999999995,"turboAngles":[144.55807383310966,133.90942792646103]}
  hold-3250: steps=120 capped=false end={"rpm":3249.8597442691885,"fuel":1,"glow":9.964823453686708e-18,"crankAngle":119.43466360976674,"vaneAngle":-0.12999999999999995,"turboAngles":[179.05823309855333,165.64957445066918]}
  stop-final: steps=391 capped=false end={"rpm":0,"fuel":0,"glow":9.964823453686708e-18,"crankAngle":166.06801124659876,"vaneAngle":-0.35,"turboAngles":[196.68942920901728,181.87027487229574]}
Trace JSON: 1079540 bytes
buildEngine times (ms): 439.600, 267.600, 271.800, 259.100, 258.900
buildEngine median (ms): 267.600
Wrote tests\baseline\lly-trace.json (1079540 bytes, 34650 lines)
Wrote tests\baseline\lly-geometry.json (18324 bytes, 901 lines)
buildEngine median for the log: 267.600 ms
Console errors: none
```

Provenance: None.

Files and sizes:
- `tests/baseline/lly-trace.json`: 1,079,540 bytes (1.03 MiB), 34,650 lines. Under the 5 MiB cap (5,242,880 bytes).
- `tests/baseline/lly-geometry.json`: 18,324 bytes (17.9 KiB), 901 lines.
- Browser: Chrome 156.0.8078.48.
- Renderer: `ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (8GB) (0x000064A0) Direct3D11 vs_5_0 ps_5_0, D3D11)`.
- No SwiftShader was present.

Stage step counts:
- 1x: stop-initial 302; start-idle-680 272; preset-3250 481; hold-3250 120; stop-final 391. All `capped=false`.
- 0.12x: stop-initial 302; start-idle-680 272; preset-3250 481; hold-3250 120; stop-final 391. All `capped=false`.
- The stage cap is 7,200 steps (120 s at 1/60 s). The hold is 120 steps (2 s).

buildEngine times:
- Five fresh-page timings, milliseconds: 439.600, 267.600, 271.800, 259.100, 258.900.
- Median: 267.600 ms.
- The first timing is higher, consistent with cold module/geometry warm-up; all five are recorded.

Geometry:
- `parts` is sorted by id from `partRegistry`, with each world-space box, mesh count and vertex count, measured after `scene.updateMatrixWorld(true)`.
- `camera.home`: position `[1.62, 1.64, 2.02]`, target `[0, 1.035, -0.02999999999999996]`.
- `camera.walkStart`: position `[1.62, 1.66, 2.02]`, target `[0, 1.035, -0.02999999999999996]`.

Test output:
```text
npm test
...
ℹ tests 142
ℹ suites 28
ℹ pass 142
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 286.9471
```

Build output:
```text
npm run build
✓ 35 modules transformed.
dist/index.html                    21.43 kB │ gzip:   5.86 kB
dist/assets/index-Ce0JMQIe.css     34.94 kB │ gzip:   8.01 kB
dist/assets/index-rJJw-yi3.js   1,285.25 kB │ gzip: 402.33 kB
✓ built in 246ms
```

Check output:
```text
npm run check
Names: FAIL (215 matches in 154 lines)
Numbers: FAIL (52 matches in 46 lines)
Encoding: PASS (0 matches)
IDs: PASS (0 matches)
  Compared quoted strings against: lly, lbz, generic-i6.
Provenance: PASS (0 matches)
  No entries under src/engines/ yet; passes vacuously.
Result: FAIL (2 of 5 checks failed: Names, Numbers)
[exit code: 1]
```

Judgement calls:
- Used a fresh page for each trace and exactly one `page.evaluate` per trace; the evaluate performs every stage and every `updateSimulation(1 / 60)` call.
- Named the stages `stop-initial`, `start-idle-680`, `preset-3250`, `hold-3250` and `stop-final`.
- Recorded the vane as `engine.turboActuator.rotation.z` and each turbo wheel as `engine.turboWheels[i].group.rotation.z`, the animated angles.
- Stored each stage's samples, step count, capped flag and final sample. Trace structure is `browser`, then `runs` for time scales 1 and 0.12.
- Measured the home pose after `resetCamera()` followed by 120 renders (2 s), enough to finish the 1.05 s camera tween.
- Measured walk start immediately after `enterWalk()`. The call is wrapped so a pointer-lock error would be logged; no console error appeared.
- Computed each part box as the union of the root objects for that registry id; mesh count and vertex count sum the meshes under those roots.
- Measured the build in a blank same-origin page, importing `/src/engine.js` and `/src/utils.js` from the Vite server, then timing `buildEngine(createMaterials())` five times.
- Wrote both JSON files only after the SwiftShader check, trace-size check, geometry capture and build timings succeeded.
- Added no views and no comparison script; those are 0.6b.
- Closed the browser and Vite server in `finally`.
- Did not change anything under `src/`.

Open:
- `0.6b` still owns the six views, `scripts/compare-browser.mjs`, and `baseline:compare`.
- The human Phase 0 baseline approval is still pending.
- The 0.8 double-capture and exact comparison have not been run.
- Package 0.6b and all later work have not been started.
- No commit was made, and no tag was created.

## 2026-10-31 · 0.6b Views and comparison

Files: `scripts/capture-browser.mjs` (changed); `scripts/compare-browser.mjs` (created); `package.json` (changed); `.qa/baseline/home.png`, `peak-torque.png`, `governed-redline.png`, `cutaway.png`, `exploded.png`, `walk-start.png` (created); `.qa/baseline/meta.json` (created); `tests/baseline/lly-trace.json` and `tests/baseline/lly-geometry.json` (regenerated; hashes unchanged); `docs/build-log.md` (changed). No files under `src/` changed.

SHA-256 pairs:
| File | Before | After |
| --- | --- | --- |
| `tests/baseline/lly-trace.json` | `CC8FCFCF6DC7CD509BEAB452CFC50A94B7374DEBFCA6BED14D54A5ED6A0C440C` | `CC8FCFCF6DC7CD509BEAB452CFC50A94B7374DEBFCA6BED14D54A5ED6A0C440C` |
| `tests/baseline/lly-geometry.json` | `9F387EAFDDEEB79C41F2288F12DB7661B9826EA6E41DA213C472215F27281D51` | `9F387EAFDDEEB79C41F2288F12DB7661B9826EA6E41DA213C472215F27281D51` |
| `tests/baseline/lly-curves.json` | `76E383E8A1D62A813004D37418DD299181EAC1D7483C2C602E5ABE366C495938` | `76E383E8A1D62A813004D37418DD299181EAC1D7483C2C602E5ABE366C495938` |

Capture output:
```text
Vite: http://127.0.0.1:55426/
Chrome: 156.0.8078.48
Renderer: ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (8GB) (0x000064A0) Direct3D11 vs_5_0 ps_5_0, D3D11)
Trace JSON: 1079540 bytes
buildEngine times (ms): 441.600, 262.100, 273.000, 245.400, 264.400
buildEngine median (ms): 264.400
View home: 1664460 bytes
View peak-torque: 1664335 bytes
View governed-redline: 1664543 bytes
View cutaway: 1693613 bytes
View exploded: 1826361 bytes
View walk-start: 1609218 bytes
Console errors: none
```

Comparison output:
```text
Chrome: 156.0.8078.48
Renderer: ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (8GB) (0x000064A0) Direct3D11 vs_5_0 ps_5_0, D3D11)
Trace: PASS
Geometry: PASS
home: 0 changed pixels of 1024000 (limit 1024) PASS
peak-torque: 0 changed pixels of 1024000 (limit 1024) PASS
governed-redline: 0 changed pixels of 1024000 (limit 1024) PASS
cutaway: 0 changed pixels of 1024000 (limit 1024) PASS
exploded: 0 changed pixels of 1024000 (limit 1024) PASS
walk-start: 0 changed pixels of 1024000 (limit 1024) PASS
```

Provenance: None.

File sizes and line counts:
- `tests/baseline/lly-trace.json`: 1,079,540 bytes, 34,650 lines.
- `tests/baseline/lly-geometry.json`: 18,324 bytes, 901 lines.
- `.qa/baseline/home.png`: 1,664,460 bytes.
- `.qa/baseline/peak-torque.png`: 1,664,335 bytes.
- `.qa/baseline/governed-redline.png`: 1,664,543 bytes.
- `.qa/baseline/cutaway.png`: 1,693,613 bytes.
- `.qa/baseline/exploded.png`: 1,826,361 bytes.
- `.qa/baseline/walk-start.png`: 1,609,218 bytes.
- `.qa/baseline/meta.json`: 451 bytes.
- `.qa/current/lly-trace.json` and `lly-geometry.json` have the same sizes as their baselines.
- Some current PNG byte sizes differ slightly from the baseline PNGs, even though every pixel comparison is zero. The comparison uses the pixel rule, not PNG bytes.

Browser:
- Chrome 156.0.8078.48.
- Renderer: `ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (8GB) (0x000064A0) Direct3D11 vs_5_0 ps_5_0, D3D11)`.
- No SwiftShader.
- Console errors: none.

Test output:
```text
npm test
...
ℹ tests 142
ℹ suites 28
ℹ pass 142
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 507.4405
```

Build output:
```text
npm run build
✓ 35 modules transformed.
dist/index.html                    21.43 kB │ gzip:   5.86 kB
dist/assets/index-Ce0JMQIe.css     34.94 kB │ gzip:   8.01 kB
dist/assets/index-rJJw-yi3.js   1,285.25 kB │ gzip: 402.33 kB
✓ built in 534ms
```

Check output:
```text
npm run check
Names: FAIL (215 matches in 154 lines)
Numbers: FAIL (52 matches in 46 lines)
Encoding: PASS (0 matches)
IDs: PASS (0 matches)
  Compared quoted strings against: lly, lbz, generic-i6.
Provenance: PASS (0 matches)
  No entries under src/engines/ yet; passes vacuously.
Result: FAIL (2 of 5 checks failed: Names, Numbers)
[exit code: 1]
```

Judgement calls:
- Refactored `capture-browser.mjs` so `captureBrowser()` returns browser info, trace, geometry, buildEngine times and six PNG buffers. The direct-run guard writes baselines; importing writes nothing.
- Added the six views in a separate 1280 x 800, deviceScaleFactor 1 context, one fresh page per view, with the UI hidden.
- Used 120 render calls to finish the home camera tween, then the view-specific state; cutaway and exploded each use 300 render calls.
- Read each image from `renderer.domElement.toDataURL('image/png')`, not `captureScreenshot()`.
- Changed the part sort to code-point ordering. The order was unchanged, so the geometry hash stayed the same.
- Made `baseline:capture` write `.qa/baseline/meta.json` with browser, view names, viewport and pixel rule. It does not include build times.
- `compare-browser.mjs` calls the same capture, writes `.qa/current/`, checks browser metadata first, then deep-compares trace and geometry and reports the first difference.
- Pixel comparison loads both PNGs into one Chrome page, uses a 2D canvas, counts channels differing by more than 8, and passes at 1,024 changed pixels or fewer.
- The direct-run guard uses the same `import.meta.url` / `pathToFileURL(process.argv[1])` check as `capture-numeric.mjs`.
- No views or comparison code was added to 0.6a; all six views and `baseline:compare` are new here.
- Closed the browser and Vite server in `finally` for both capture and compare.
- Did not change anything under `src/`.

Open:
- The human Phase 0 baseline approval is still pending.
- Package 0.8 still needs the double capture and comparison.
- Package 0.7 and all later work have not been started.
- No commit was made, and no tag was created.

## 2026-10-31 · 0.6c View set and compare margin

Files: `scripts/capture-browser.mjs` (changed); `scripts/compare-browser.mjs` (changed); `.qa/baseline/peak-torque.png` and `.qa/baseline/governed-redline.png` (deleted); `.qa/current/peak-torque.png` and `.qa/current/governed-redline.png` (deleted); `.qa/baseline/cutaway-3250.png` and `.qa/baseline/exploded-3250.png` (created); `.qa/baseline/meta.json` (updated); `tests/baseline/lly-trace.json` and `tests/baseline/lly-geometry.json` (regenerated; hashes unchanged); `docs/build-log.md` (changed). No files under `src/` changed.

View list:
- Before: `home`, `peak-torque`, `governed-redline`, `cutaway`, `exploded`, `walk-start`.
- After: `home`, `cutaway`, `exploded`, `cutaway-3250`, `exploded-3250`, `walk-start`.
- `cutaway-3250` and `exploded-3250` both use the home camera, 3,250 rpm, the requested cutaway or exploded state, then 300 render calls.
- The four retired files were listed first, then deleted individually with `rm`. No directory was removed.

SHA-256 values:
| File | Required and actual |
| --- | --- |
| `tests/baseline/lly-trace.json` | `CC8FCFCF6DC7CD509BEAB452CFC50A94B7374DEBFCA6BED14D54A5ED6A0C440C` |
| `tests/baseline/lly-geometry.json` | `9F387EAFDDEEB79C41F2288F12DB7661B9826EA6E41DA213C472215F27281D51` |
| `tests/baseline/lly-curves.json` | `76E383E8A1D62A813004D37418DD299181EAC1D7483C2C602E5ABE366C495938` |

All three matched exactly.

Capture output:
```text
Chrome: 156.0.8078.48
Renderer: ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (8GB) (0x000064A0) Direct3D11 vs_5_0 ps_5_0, D3D11)
View home: 1664460 bytes
View cutaway: 1693613 bytes
View exploded: 1826361 bytes
View cutaway-3250: 1693149 bytes
View exploded-3250: 1826862 bytes
View walk-start: 1609218 bytes
Console errors: none
```

Comparison output:
```text
Chrome: 156.0.8078.48
Renderer: ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (8GB) (0x000064A0) Direct3D11 vs_5_0 ps_5_0, D3D11)
Trace: PASS
Geometry: PASS
home: 0 changed (>8), 1 differ at all, largest channel delta 1 (limit 1024) PASS
cutaway: 0 changed (>8), 0 differ at all, largest channel delta 0 (limit 1024) PASS
exploded: 0 changed (>8), 0 differ at all, largest channel delta 0 (limit 1024) PASS
cutaway-3250: 0 changed (>8), 0 differ at all, largest channel delta 0 (limit 1024) PASS
exploded-3250: 0 changed (>8), 0 differ at all, largest channel delta 0 (limit 1024) PASS
walk-start: 0 changed (>8), 0 differ at all, largest channel delta 0 (limit 1024) PASS
```

Provenance: None.

View metrics:
| View | Changed (>8) | Differ at all | Largest channel delta |
| --- | ---: | ---: | ---: |
| `home` | 0 | 1 | 1 |
| `cutaway` | 0 | 0 | 0 |
| `exploded` | 0 | 0 | 0 |
| `cutaway-3250` | 0 | 0 | 0 |
| `exploded-3250` | 0 | 0 | 0 |
| `walk-start` | 0 | 0 | 0 |

Each view has 1,024,000 pixels; the changed-pixel limit is 1,024. Every view passed.

File sizes and line counts:
- `tests/baseline/lly-trace.json`: 1,079,540 bytes, 34,650 lines.
- `tests/baseline/lly-geometry.json`: 18,324 bytes, 901 lines.
- `.qa/baseline/home.png`: 1,664,460 bytes.
- `.qa/baseline/cutaway.png`: 1,693,613 bytes.
- `.qa/baseline/exploded.png`: 1,826,361 bytes.
- `.qa/baseline/cutaway-3250.png`: 1,693,149 bytes.
- `.qa/baseline/exploded-3250.png`: 1,826,862 bytes.
- `.qa/baseline/walk-start.png`: 1,609,218 bytes.
- `.qa/baseline/meta.json`: 449 bytes.

Browser:
- Chrome 156.0.8078.48.
- Renderer: `ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (8GB) (0x000064A0) Direct3D11 vs_5_0 ps_5_0, D3D11)`.
- Console errors: none.

Test output:
```text
npm test
...
ℹ tests 142
ℹ suites 28
ℹ pass 142
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 273.7618
```

Build output:
```text
npm run build
✓ 35 modules transformed.
dist/index.html                    21.43 kB │ gzip:   5.86 kB
dist/assets/index-Ce0JMQIe.css     34.94 kB │ gzip:   8.01 kB
dist/assets/index-rJJw-yi3.js   1,285.25 kB │ gzip: 402.33 kB
✓ built in 229ms
```

Check output:
```text
npm run check
Names: FAIL (215 matches in 154 lines)
Numbers: FAIL (52 matches in 46 lines)
Encoding: PASS (0 matches)
IDs: PASS (0 matches)
  Compared quoted strings against: lly, lbz, generic-i6.
Provenance: PASS (0 matches)
  No entries under src/engines/ yet; passes vacuously.
Result: FAIL (2 of 5 checks failed: Names, Numbers)
[exit code: 1]
```

Judgement calls:
- Replaced only `peak-torque` and `governed-redline`; kept `home`, `cutaway`, `exploded` and `walk-start` unchanged.
- Updated both `VIEW_NAMES` lists to the new order and updated the view steps in `capture-browser.mjs`.
- The direct-run `meta.json` view list comes from `VIEW_NAMES`, so it now names the new six views.
- The comparison now counts changed pixels (channel delta greater than 8), pixels differing at all, and the largest channel delta.
- Before comparing, the in-memory trace and geometry are serialized with `JSON.stringify` and parsed back with `JSON.parse`.
- Deleted only the four named retired PNGs, using `rm` on each path.
- Kept the 1,024 changed-pixel pass limit.
- The `home` view has one pixel with a largest channel delta of 1, so it contributes no changed pixels and passes with margin.
- Closed the browser and Vite server in `finally` for both capture and compare.
- Did not change anything under `src/`.

Open:
- The human Phase 0 baseline approval is still pending.
- Package 0.8 still needs the double capture and comparison.
- Package 0.7 and all later work have not been started.
- No commit was made, and no tag was created.

## 2026-10-31 · 0.7 QA recipe

Files: `docs/qa-recipe.md` (created); `docs/build-log.md` (changed). No other file changed.

Read the two browser QA notes successfully. The recipe does not contain the memory-folder path. It is 226 lines and ASCII, with sections a-g.

Facts checked against code:
- All 32 hook names in `window.__LLY__` are present in the object at `src/main.js:1600-1682`.
- Under QA, `animate()` skips simulation, camera and telemetry advancement at `src/main.js:1532-1543`.
- `render(count)` advances `simulation.elapsed`, simulation, camera and telemetry by `1/60` and renders once at `src/main.js:1673-1680`.
- The view capture loops are 120 renders at `scripts/capture-browser.mjs:313` and 300 renders at `:320-329`; the hold is 120 steps at `:14`.
- Baseline views read `renderer.domElement.toDataURL` at `scripts/capture-browser.mjs:346`.
- `resetCamera()` uses a 1.05 s tween at `src/main.js:430`; `exitWalk()` uses 1.1 s at `:522`. The tween overwrite and `controls.enabled` restoration are at `:410-425` and `:455-465`.
- `#webgl` is at `index.html:21`; pointer listeners are at `src/main.js:1362` and `:1369`.
- `setFixture({ rpm: 0, running: false })` sets the freeze state at `src/main.js:1633-1671`.
- `selectPart()` writes `#specId` at `src/main.js:689`; the element is at `index.html:275`.
- The normal-mode 0.1 s walk-step cap is at `src/main.js:1536`, inside `!QA_MODE`; the QA step is `1/60` at `:1677`.
- `captureScreenshot()` adds the overlay and download at `src/main.js:1477-1510`.
- `canvas.requestPointerLock?.()` is called without awaiting or catching at `src/main.js:507` and `:1364`.
- No `#qaStamp` exists in `index.html` or `src/`; it is an agent-added element.
- `outlinePass.hiddenEdgeColor` is present at `src/main.js:184`.

Facts carried over without re-checking:
- The hidden built-in pane does not fire `requestAnimationFrame`.
- The screenshot staleness warning and the roughly 1.5 s wait.
- The before-and-after `git archive` recipe and the `node_modules` junction.
- The built-in-pane static-server and `.claude/launch.json` procedure.
- The open findings for walk prop collision, internal quick-part buttons, the default exploded-view camera width, and injector wording. The pointer-lock and hidden-edge findings were checked as code facts; the others are from the notes.
- The cleanup procedure: stop servers, close tabs, reset window size, delete scratch copies and `.claude/`, and use `rmdir` for junctions rather than `Remove-Item -Recurse`.

Check output:
```text
npm run check
Names: FAIL (215 matches in 154 lines)
Numbers: FAIL (52 matches in 46 lines)
Encoding: PASS (0 matches)
IDs: PASS (0 matches)
  Compared quoted strings against: lly, lbz, generic-i6.
Provenance: PASS (0 matches)
  No entries under src/engines/ yet; passes vacuously.
Result: FAIL (2 of 5 checks failed: Names, Numbers)
[exit code: 1]
```

This matches 0.6c: 215 name matches in 154 lines, 52 number matches in 46 lines, the same pass/fail checks, and the same overall result.

Judgement calls:
- Kept the recipe focused on the two driving paths, the hooks, deterministic stepping, screenshots, gotchas, cleanup and open findings.
- Marked each gotcha checked or carried from notes; the screenshot-stamp absence was checked, while its wait advice was carried.
- Did not include the memory-folder path in the recipe.
- Did not use PowerShell to write the document.

Open:
- Package 0.8 and the human Phase 0 gate remain.
- No commit was made, and no tag was created.

## 2026-10-31 · 0.8 Phase 0 acceptance

Files: `docs/build-log.md` (changed). No source file changed. The baseline files and `.qa/` captures were regenerated by the required capture runs.

Hashes at all three checkpoints (pre-run, run 1 and run 2 were identical):
| File | SHA-256 (pre-run = run 1 = run 2) |
| --- | --- |
| `tests/baseline/lly-trace.json` | `CC8FCFCF6DC7CD509BEAB452CFC50A94B7374DEBFCA6BED14D54A5ED6A0C440C` |
| `tests/baseline/lly-geometry.json` | `9F387EAFDDEEB79C41F2288F12DB7661B9826EA6E41DA213C472215F27281D51` |
| `tests/baseline/lly-curves.json` | `76E383E8A1D62A813004D37418DD299181EAC1D7483C2C602E5ABE366C495938` |
| `.qa/baseline/home.png` | `AAC932846AF42442E5E3B6FF8B04853C5614663DEB4D4E88409FCC229E3432B8` |
| `.qa/baseline/cutaway.png` | `5701C92699897CA10AFE60872C3655621B671D5E555D998229C2E3B07CC08760` |
| `.qa/baseline/exploded.png` | `D819DEE261A74876C6B2CA1E2EE55A84FB17B85AF4F681A9CDF1DBA9B016E53E` |
| `.qa/baseline/cutaway-3250.png` | `1EA855577A01A1B4109F07CDEDFFFE2B7A8F49D18B81FA02E6EE3222F5148BE5` |
| `.qa/baseline/exploded-3250.png` | `049091726965CF165B42EEC9A37D0102D56B44E381255C2BAA8A27BEA4DA235E` |
| `.qa/baseline/walk-start.png` | `710A23B506002EB340CCEAC93A1389E6F49DEAA5C427F4706F947F85EFB8F717` |

All nine hashes matched across all three checkpoints. No file differed.

Capture run 1:
- Chrome 156.0.8078.48.
- Renderer: `ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (8GB) (0x000064A0) Direct3D11 vs_5_0 ps_5_0, D3D11)`.
- Console errors: none.
- All six view sizes: home 1,664,460; cutaway 1,693,613; exploded 1,826,361; cutaway-3250 1,693,149; exploded-3250 1,826,862; walk-start 1,609,218 bytes.

Capture run 2:
- Same browser and renderer.
- Console errors: none.
- Same file sizes and the same nine hashes as run 1.
- The three JSON files matched run 1 byte for byte.
- The six PNGs also matched run 1 byte for byte.

Comparison output:
```text
Chrome: 156.0.8078.48
Renderer: ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (8GB) (0x000064A0) Direct3D11 vs_5_0 ps_5_0, D3D11)
Trace: PASS
Geometry: PASS
home: 0 changed (>8), 0 differ at all, largest channel delta 0 (limit 1024) PASS
cutaway: 0 changed (>8), 0 differ at all, largest channel delta 0 (limit 1024) PASS
exploded: 0 changed (>8), 0 differ at all, largest channel delta 0 (limit 1024) PASS
cutaway-3250: 0 changed (>8), 0 differ at all, largest channel delta 0 (limit 1024) PASS
exploded-3250: 0 changed (>8), 0 differ at all, largest channel delta 0 (limit 1024) PASS
walk-start: 0 changed (>8), 0 differ at all, largest channel delta 0 (limit 1024) PASS
```

Test output:
```text
npm test
...
ℹ tests 142
ℹ suites 28
ℹ pass 142
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 263.7362
```

Build output:
```text
npm run build
✓ 35 modules transformed.
dist/index.html                    21.43 kB │ gzip:   5.86 kB
dist/assets/index-Ce0JMQIe.css     34.94 kB │ gzip:   8.01 kB
dist/assets/index-rJJw-yi3.js   1,285.25 kB │ gzip: 402.33 kB
✓ built in 233ms
```

Check output:
```text
npm run check
Names: FAIL (215 matches in 154 lines)
Numbers: FAIL (52 matches in 46 lines)
Encoding: PASS (0 matches)
IDs: PASS (0 matches)
  Compared quoted strings against: lly, lbz, generic-i6.
Provenance: PASS (0 matches)
  No entries under src/engines/ yet; passes vacuously.
Result: FAIL (2 of 5 checks failed: Names, Numbers)
[exit code: 1]
```

Differences found: none. Both captures produced identical JSON and identical PNGs, and the fresh comparison matched every JSON and every view.

Judgement calls:
- Ran the capture twice exactly as the Phase 0 acceptance requires, recording hashes before run 1, after run 1 and after run 2.
- Treated the PNG byte match as a positive result, but the pixel comparison remains the decisive visual test.
- Did not retag or commit; the `phase-0-done` tag waits for human approval.

Open:
- The Phase 0 gate is waiting for the human's FPS reading and approval.
- The FPS reading is taken after 0.8: run `npm run build`, then `npm run preview`, open the printed address in a normal Chrome window without `?qa=1`, leave it running for 30 seconds, call `window.__LLY__.getFpsSamples()` in the console, and send the up-to-six values.
- The human also checks the baseline files and that the second capture matched the first.
- No commit was made, no tag was created, and Phase 1 has not started.

## 2026-10-31 · Phase 0 gate: FPS reading

Source: the human's reading, pasted into the chat. The steps were `npm run build`, `npm run preview`, a normal Chrome window at the printed address, 30 seconds, then `window.__LLY__.getFpsSamples()`. Those steps call for a page without `?qa=1`; the human has not yet confirmed that.

Samples (fps, one per second): 60.0926, 59.9580, 59.9880, 60.0335, 60.0098, 59.9940.
Average: 60.0127 fps. Range: 59.9580 to 60.0926 fps.

Quality: `src/main.js:1567` lowers quality only when the average of the samples is below 44 fps, so the app did not lower its quality during this reading.

Judgement: the samples sit at about 60 fps, which looks like a 60 Hz refresh cap. The reading shows that the app keeps up with the display, not how much headroom it has.

Open:
- The human confirms that the page had no `?qa=1`.
- The human approved the Phase 0 gate (recorded below).

## 2026-10-31 · Phase 0 gate: approved

The human approved the Phase 0 gate in the chat, after the FPS reading above. The Phase 0 work is committed on `engine-library` and tagged `phase-0-done` (plan section 10; runbook section 6). The commit hash is in `git log`.

Open:
- The human still needs to confirm that the FPS reading was taken without `?qa=1`.
- Phase 1 starts with package 1.1.

## 2026-10-31 · 1.1 LLY entry data

Files: `src/engines/lly/index.js` (created); `docs/build-log.md` (changed). No other file changed. No module imports the entry yet. `copy` is not present.

The entry keeps the code's values wherever the sheet differs:
- Rod length `184` mm, with the research conflict recorded.
- Calibration labels `Allison 1000 6-Spd Auto` and `ZF S6-650 6-Spd Manual`.
- Compression strings `17.5:1 (2004\u201305) / 16.8:1 (2006)`, `16.8:1 (2006 Auto)`, and `17.5:1 (2004.5\u201305 Manual)`.
- Preset button labels `STOP`, `WARM IDLE`, `PEAK TQ`, `PEAK HP`, `GOVERNOR`, and the separate toast labels from `applyPreset()`.
- Boost peak `23` psi remains the design/contested value.

Values checked against code: the LLY constant, calibration labels and ratings, bank layout, stations, throws, cylinder fire angles, firing order, valve timing, all curve points, the start sequence, telemetry gates, presets, audio base tone and max frame, and the walk clearances. A Node cross-check against `src/kinematics.js` passed.

Provenance records (58):
```text
geometry.displacementCc = ["S01","S02"]
geometry.displacementCid = ["S01","S02"]
geometry.boreMm = ["S01","S02"]
geometry.strokeMm = ["S01","S02"]
geometry.crankRadiusMm = {"ids":["S01","S02"],"status":"derived"}
geometry.rodLengthMm = {"ids":["S13","S14"],"status":"conflict","baseline":184}
geometry.boreStrokeRatio = ["S01","S02"]
geometry.envelopeIn = ["S01","S02"]
geometry.massLb = ["S01","S02"]
layout.banks = "design"
layout.stationZmm = "design"
layout.throwOffsetDeg = "design"
layout.cylinders = "design"
layout.firingOrder = ["S01","S02"]
valvetrain.valvesPerCylinder = ["S01","S02"]
valvetrain.totalValves = ["S01","S02"]
valvetrain.timing = "design"
features.glowPlugs = ["S01","S02"]
ratings.idleRpm = ["S01","S02"]
ratings.redlineRpm = ["S01","S02"]
ratings.peakTorqueRpm = ["S01","S02"]
ratings.peakPowerRpm = ["S01","S02"]
ratings.peakTorqueLbFt = ["S01","S02","S04"]
ratings.peakHp = ["S01","S02","S04"]
ratings.calibrations.allison.peakTorqueLbFt = ["S01","S02","S04"]
ratings.calibrations.allison.peakTorqueRpm = ["S01","S02"]
ratings.calibrations.allison.peakHp = ["S01","S02","S04"]
ratings.calibrations.allison.peakPowerRpm = ["S01","S02"]
ratings.calibrations.allison.maxRailPsi = ["S01","S02"]
ratings.calibrations.zf.peakTorqueLbFt = ["S01","S02"]
ratings.calibrations.zf.peakTorqueRpm = ["S01","S02"]
ratings.calibrations.zf.peakHp = ["S01","S02"]
ratings.calibrations.zf.peakPowerRpm = ["S01","S02"]
ratings.calibrations.zf.maxRailPsi = ["S01","S02"]
ratings.presets = "design"
curves.torque = "design"
curves.rail = "design"
curves.boost = "design"
curves.boost.capPsi = {"ids":["S06","S31"],"status":"contested","label":"design"}
curves.vane = "design"
curves.egt = "design"
curves.oil = "design"
curves.coolant = "design"
turbo.compressorInducerMm = ["S06"]
turbo.compressorExducerMm = ["S06"]
turbo.compressorBlades = ["S06","S04"]
turbo.turbineInducerMm = ["S06"]
turbo.turbineExducerMm = ["S06"]
turbo.turbineBlades = ["S06"]
turbo.vaneHeightMm = {"ids":["S06","S04"],"status":"conflict","baseline":14.4}
turbo.boostPeakPsi = {"ids":["S06","S31"],"status":"contested","label":"design"}
telemetry.gates = "design"
telemetry.notFiring = "design"
startSequence = "design"
audio = "design"
walk = "design"
dyno = "design"
oil.capacityUsQt = ["S01","S02"]
```

Nulls: none. The sheet's null gaps are not entry fields: valve lift and cam duration are code design estimates, the 2004-2005 nozzle hole count is absent, and starter details, dry/wet weight and cylinder spacing are not used by the app. No null was needed.

Values not found in code or sheet:
- `dyno.ratedLbFt = 1000` and `dyno.maxRpm = 4000` are design values from plan section 5; no matching code or research-sheet values exist.
- `identity.accuracy = "rated-peaks"` and the `audio.bankCadence`, `turboWhistle`, and `injectorKnock` flags come from the plan sketch as design/structure, not from a code constant or the research sheet.
- No numeric value is absent from both the code and the sheet apart from the two test-cell dyno values above.

Choices beyond the package text:
- Calibrations are keyed by id, matching `CALIBRATIONS` in `src/kinematics.js` and the plan's id-based provenance paths.
- Presets keep both the button label and the `applyPreset()` toast label, preserving both current strings for package 2.4.
- Added the wall, dyno and max-hop walk values from `src/collision.js`, beyond the sketch's single clearance radius.
- Added the small non-numeric `features`, `inspect` and `oil` data needed by later phases.
- Left out `copy`, `look` and `explode`: `copy` is package 1.2; the presentation-only look/explode data is not in package 1.1's named value list and remains in the family until package 2.3.
- Grouped design values use parent-path provenance records (for example `startSequence`, `telemetry.gates`, `audio`, `walk`, `dyno`, `curves.torque`), as the package treats a curve table/start sequence as one value.

Test output:
```text
npm test
...
ℹ tests 142
ℹ suites 28
ℹ pass 142
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 283.8099
```

Check output:
```text
npm run check
Names: FAIL (215 matches in 154 lines)
Numbers: FAIL (52 matches in 46 lines)
Encoding: PASS (0 matches)
IDs: PASS (0 matches)
Provenance: FAIL (1 match in 1 line)
  Entry files exist; full numeric provenance validation is not implemented in this package.
  src/engines/lly/index.js:1: entry
Result: FAIL (3 of 5 checks failed: Names, Numbers, Provenance)
[exit code: 1]
```

Judgement calls:
- The numeric-leaf audit found 258 numbers outside `provenance`; all are covered by the 58 records.
- The provenance stub fails exactly as expected; package 1.1b will replace it.
- No `src/` module imports the entry yet.
- The existing Phase 0 commit and `phase-0-done` tag were not changed.

Open:
- Package 1.1b replaces the provenance stub.
- Package 1.2 adds `copy.js`.
- No commit was made and no tag was created in 1.1.
- Package 1.1b has not been started.

## 2026-10-31 · 1.1b Look, explode and the provenance check

Files: `src/engines/lly/index.js` (changed); `scripts/check.mjs` (changed); `docs/build-log.md` (changed). No other file changed. `copy` and `decals` remain absent.

Values added:
- `look.palette.block = 0x2c312e` from `src/engine.js:101`.
- `look.palette.head = 0xb2b8b3` from `src/engine.js:107`.
- `explode.cutawayFraction = 0.45` from `EXPLODE_CUTAWAY_FRACTION` at `src/engine.js:52`.
- `explode.offsets`, sixteen explicit assembly offsets:
```text
rotating    [0, -105, 0]
main-caps   [0, -225, 0]
camshaft    [0, 95, 0]
head-R      [-195, 195, 0]
head-L      [195, 195, 0]
cover-R     [-335, 335, 0]
cover-L     [335, 335, 0]
exhaust-R   [-290, 95, 0]
exhaust-L   [290, 95, 0]
oil-pan     [0, -355, 0]
oil-filter  [230, -70, 0]
front-drive [0, 15, 290]
turbo       [0, 310, -250]
intake      [0, 340, 40]
egr         [-230, 260, -90]
fuel        [0, 220, 110]
```

The ten offsets named in the package are joined by six more that `_applyExplode` also uses: `head-R`, `head-L`, `cover-R`, `cover-L`, `exhaust-R` and `exhaust-L`. `_applyExplode` at `src/engine.js:4134-4146` moves every `explodeGroups` entry by its stored `g.offset`, and `makeAssembly` adds those six to that list at `src/engine.js:1228`, `:1250` and `:2656`.

Provenance records added:
- `look.palette = "design"`, covering both palette colours.
- `explode.cutawayFraction = "design"`.
- `explode.offsets = "design"`, covering all sixteen offset arrays.

Provenance checker:
- Replaced the stub in `scripts/check.mjs`.
- Imports each non-`families`/`shared` entry through `pathToFileURL(entryPath).href`.
- Counts numeric leaves, with each `curves.<name>` table counted as one value.
- A record covers its exact path and every descendant path.
- Every record path must exist in the entry; every ID must come from `docs/research/sources.md`.
- A record must carry IDs or a `design`/`derived` label.
- Nulls must have a record marked as a sheet gap. There are no nulls.
- Per-entry output is printed.

Checker output:
```text
npm run check
Names: FAIL (215 matches in 154 lines)
Numbers: FAIL (52 matches in 46 lines)
Encoding: PASS (0 matches)
IDs: PASS (0 matches)
Provenance: PASS (0 matches)
  lly: 197 values, 61 records, 0 without record
Result: FAIL (2 of 5 checks failed: Names, Numbers)
[exit code: 1]
```

The names and numbers checks match 0.8: 215 matches in 154 lines and 52 matches in 46 lines. Encoding and IDs also match. Provenance changed from FAIL to PASS.

Test output:
```text
npm test
...
ℹ tests 142
ℹ suites 28
ℹ pass 142
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 279.2629
```

Judgement calls:
- Included all sixteen explode groups that `_applyExplode` moves, not just the ten literal offsets listed in the package.
- Used parent-path design records for the palette, the cutaway fraction and the offset table, as allowed by the path coverage rule.
- Kept the scene's decal text out of `look`; package 1.2 owns copy.
- The checker treats each curve table as one value, so no curve point needs its own record.
- No nulls were present, so the gap rule was not exercised by LLY.

Open:
- Package 1.2 adds `copy.js` and the decals.
- No commit was made and no tag was created.
- Package 1.2 has not been started.

## 2026-10-31 · 1.2 LLY spec copy

Files: `src/engines/lly/copy.js` (created); `src/specs.js` (changed); `src/engines/lly/index.js` (changed); `.qa/copy-before.json` and `.qa/copy-after.json` (created, git-ignored); `docs/build-log.md` (changed). No tests, baselines, check scripts or other source files changed.

Snapshot:
- Before: `.qa/copy-before.json`, 46,173 bytes, SHA-256 `1438B2C3341019F45D32402F74121E2403411E94438E3D463ECDD0CBFA97050A`.
- After: `.qa/copy-after.json`, 46,173 bytes, same SHA-256.
- The two snapshots are byte-identical.

The move:
- `copy.js` has no imports and exports `COMPONENT_CARDS` with all 38 cards in the original `block` to `dyno` order.
- `pistonCard(number, bankLabel)` and `rodCard(number, bankLabel)` return the same objects the loop built, including the `piston-${number}` and `rod-${number}` IDs.
- `engineSummary(firingOrder)` returns the five summary strings with keys `displacement`, `firingOrder`, `peakTorque`, `peakPower`, `governed`.
- `specs.js` now has only the two imports, the `specsByNumber` loop, `COMPONENT_SPECS = { ...COMPONENT_CARDS, ...specsByNumber }`, the existing `getSpec`, `INSPECTABLE_IDS`, and `ENGINE_SPEC_SUMMARY = engineSummary(LLY.firingOrder.join('-'))`.
- `index.js` has `copy: () => import('./copy.js')` as its last key after `provenance`.

Before check:
```text
Names: FAIL (215 matches in 154 lines)
Numbers: FAIL (52 matches in 46 lines)
Encoding: PASS (0 matches)
IDs: PASS (0 matches)
Provenance: PASS (0 matches)
  lly: 197 values, 61 records, 0 without record
Result: FAIL (2 of 5 checks failed: Names, Numbers)
```

After check:
```text
Names: FAIL (173 matches in 126 lines)
Numbers: FAIL (43 matches in 37 lines)
Encoding: PASS (0 matches)
IDs: PASS (0 matches)
Provenance: PASS (0 matches)
  lly: 197 values, 61 records, 0 without record
Result: FAIL (2 of 5 checks failed: Names, Numbers)
```

Why the counts moved:
- The 38 spec cards and their copy moved out of `src/specs.js` and under `src/engines/`, which the names and numbers checks skip.
- `src/specs.js` now keeps three name matches: the `LLY` import on line 1, the new `./engines/lly/copy.js` path on line 2, and the `LLY.firingOrder` line. The new import path is the one added match the package predicted.
- The nine number matches in `src/specs.js` are gone because the spec text that contained them is now under `src/engines/`.

Engine summary:
- The five strings moved into `engineSummary(firingOrder)`.
- The key order is unchanged, and the firing order is passed in from `LLY.firingOrder.join('-')`, so the pre/post snapshot and app text are identical.

Tests and build:
```text
npm test
...
ℹ tests 142
ℹ suites 28
ℹ pass 142
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 271.785
```

```text
npm run build
✓ 36 modules transformed.
dist/index.html                    21.43 kB │ gzip:   5.86 kB
dist/assets/index-Ce0JMQIe.css     34.94 kB │ gzip:   8.01 kB
dist/assets/index-DLn62EAZ.js   1,285.28 kB │ gzip: 402.36 kB
✓ built in 232ms
```

Judgement calls:
- Moved the text with a Node UTF-8 transform, not PowerShell.
- Kept the original card order and every object's key order; the snapshot confirms the runtime values are unchanged.
- Kept `getSpec` and `INSPECTABLE_IDS` byte-for-byte in behavior and position.
- Added the copy loader as the final entry key.
- The acceptance check counts match the package's expected 173/126 and 43/37; there is no unexplained difference.
- No failure remained in the acceptance commands.

Open:
- Package 1.3 has not been started.
- No commit was made and no tag was created.

## 2026-10-31 · 1.3 Modules read the entry

Files: `src/kinematics.js`, `src/engine.js`, `src/specs.js`, `src/collision.js`, `src/audio.js`, `src/main.js` and `docs/build-log.md`. No entry, copy, test, baseline, script or check file changed.

Re-pointed names:
| File | Name | Entry path |
| --- | --- | --- |
| `src/kinematics.js` | `LLY` (24 keys, same order) | `identity.name`, `identity.code`, `identity.configuration`; `geometry.*`; `layout.firingOrder`; `ratings.*`; `valvetrain.*`; `oil.capacityUsQt`; `identity.assembly` |
| `src/kinematics.js` | `CALIBRATIONS` | `ratings.calibrations.allison` and `.zf` |
| `src/kinematics.js` | `STATION_Z` | `layout.stationZmm` |
| `src/kinematics.js` | `BANK_Z_OFFSET` | `layout.banks[].bankOffsetZmm` |
| `src/kinematics.js` | `STATION_THROW_OFFSET` | `layout.throwOffsetDeg` |
| `src/kinematics.js` | `CYLINDERS` | `layout.cylinders` and `layout.banks` |
| `src/kinematics.js` | `VALVE_TIMING` | `valvetrain.timing` |
| `src/engine.js` | `EXPLODE_CUTAWAY_FRACTION` | `explode.cutawayFraction` |
| `src/specs.js` | `ENGINE_SPEC_SUMMARY` | `layout.firingOrder` |
| `src/collision.js` | `WALL_CLEARANCE` | `walk.wallClearanceM` |
| `src/collision.js` | `DYNO_CLEARANCE` | `walk.dynoClearanceM` |
| `src/collision.js` | `ENGINE_WALK_RADIUS` | `walk.clearanceRadiusM` |
| `src/collision.js` | `MAX_HOP` | `walk.maxHopM` |
| `src/audio.js` | `MAX_RPM` | `ratings.redlineRpm` |
| `src/audio.js` | `MAX_PULSE_FRAME_S` | `audio.maxFrameS` |
| `src/main.js` | `MAX_RPM` | `ratings.redlineRpm` |

`CYLINDERS` keeps the same five base keys and the same appended keys: `number`, `bank`, `station`, `fireAngle`, `bankLabel`, `id`, `z`, `throwOffset`, `bankRotationDeg`, `bankAxisDeg`. `CALIBRATIONS` keeps the seven keys `id`, `label`, `shortLabel`, `peakTorqueLbFt`, `peakHp`, `maxRailPsi`, `compressionRatio`. The `LLY` key order is unchanged.

Values check:
- An in-memory comparison of `INSPECTABLE_IDS`, every `getSpec(id)` and `ENGINE_SPEC_SUMMARY` matched `.qa/copy-before.json`.
- No entry value was missing.

Before check:
```text
Names: FAIL (173 matches in 126 lines)
Numbers: FAIL (43 matches in 37 lines)
Encoding: PASS (0 matches)
IDs: PASS (0 matches)
Provenance: PASS (0 matches)
  lly: 197 values, 61 records, 0 without record
Result: FAIL (2 of 5 checks failed: Names, Numbers)
```

After check:
```text
Names: FAIL (246 matches in 181 lines)
Numbers: FAIL (38 matches in 32 lines)
Encoding: PASS (0 matches)
IDs: PASS (0 matches)
Provenance: PASS (0 matches)
  lly: 197 values, 61 records, 0 without record
Result: FAIL (2 of 5 checks failed: Names, Numbers)
```

Per-file counts, matches before → after:
| File | Names | Numbers |
| --- | --- | --- |
| `src/kinematics.js` | 30 → 86 (+56) | 18 → 15 (−3) |
| `src/engine.js` | 58 → 61 (+3) | 1 → 1 (0) |
| `src/specs.js` | 3 → 4 (+1) | 0 → 0 (0) |
| `src/collision.js` | 0 → 6 (+6) | 0 → 0 (0) |
| `src/audio.js` | 8 → 12 (+4) | 1 → 0 (−1) |
| `src/main.js` | 27 → 30 (+3) | 11 → 10 (−1) |
| Six changed files | 126 → 199 (+73) | 31 → 26 (−5) |
| All other files | 47 → 47 (0) | 12 → 12 (0) |
| Total | 173 → 246 (+73) | 43 → 38 (−5) |

Why the counts moved:
- `kinematics.js` gains 56 name matches because the entry mappings spell `lly.` on every field, and its import path adds another. It loses three number matches: the old `peakHpRpm` 3,000, `redlineRpm` 3,250 and Allison `maxRailPsi` 26,000 are now entry references.
- `engine.js` gains three name matches from `import lly`, the `lly` path and `lly.explode...`; its one number match is unaffected.
- `specs.js` gains one name match: the new `lly` entry import replaces the old `LLY` import, while the copy path and firing-order line remain.
- `collision.js` gains six name matches from the import and the four `lly.walk` references.
- `audio.js` gains four name matches from the import and two constants, and loses its 3,250 literal.
- `main.js` gains three name matches from the import and `MAX_RPM`, and loses its 3,250 literal.
- All other files are unchanged, so their 47 names and 12 numbers are unchanged.

Tests, baseline and build:
```text
npm test
...
ℹ tests 142
ℹ suites 28
ℹ pass 142
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 298.586
```

Before baseline: Trace PASS, Geometry PASS, all six views 0 changed (>8), 0 differ at all.

After baseline: Trace PASS, Geometry PASS; `home` had 0 changed (>8), 1 pixel differing at all with channel delta 1; the other five views had 0 changed and 0 differ. All six PASS. The single delta-1 pixel is below the pass threshold and no trace or geometry value moved.

```text
npm run build
✓ 38 modules transformed.
dist/index.html                    21.43 kB │ gzip:   5.86 kB
dist/assets/index-Ce0JMQIe.css     34.94 kB │ gzip:   8.01 kB
dist/assets/index-DrU0MNBt.js   1,295.12 kB │ gzip: 405.56 kB
✓ built in 530ms
```

Vite reports `INEFFECTIVE_DYNAMIC_IMPORT` because `copy.js` is both dynamically imported by the entry and statically imported by `specs.js`. It is a warning, not a build failure, and was not changed in this package.

Phase 2 checklist — entry values still in place:
- `src/kinematics.js`: `torqueAtRpm` at 246, `railPressureAtRpm` at 297, `boostAtRpm` at 322, `vaneAtRpm` at 347, `egtAtRpm` at 370, `oilPressureAtRpm` at 375, `coolantAtRpm` at 380. Their curve tables and formulas remain inside those bodies.
- `src/engine.js`: palette at 102 and 108; explode offsets at the `makeAssembly` calls on lines 582, 1017, 1140, 1229, 1251, 2152, 2228, 2347, 2657, 2785, 3170, 3350 and 3483.
- `src/audio.js`: 45.3 Hz firing tone at 117; boost normalization `/ 23` at 425, 450 and 476.
- `src/main.js`: idle and preset 680 values at 206-207, 271 and 299; start-up values at 279 and 323-355; tach red band at 794, 819 and 860; rail gauge scale 26,000 at 1030; preset labels and values at 1278 and 1454.
- `src/specs.js`: no entry literals remain; the copy text is in `src/engines/lly/copy.js`.
- `src/collision.js`: no entry literals remain; `EPS`, `CONSOLE_BLOCK`, `PASSES` and `SETTLE` are not entry values.

Judgement calls:
- Kept the `CYLINDERS` derived construction in two maps so the base keys stay in the original order and the appended keys keep `id`, `z`, `throwOffset`, `bankRotationDeg`, `bankAxisDeg`.
- Used direct entry references for the `LLY` arrays and bank data.
- Left every function-body, class-body and state-object literal in place for Phase 2.
- No value, name, key order or type changed.
- One home-view pixel had a channel delta of 1; all changed-pixel counts stayed at 0 and every view passed.

Open:
- Package 1.4 has not been started.
- No commit was made and no tag was created.

## 2026-11-01 · 1.4 Research references

Files: `docs/agent-runbook.md`, `docs/engine-library-plan.md` and `docs/build-log.md`. No code, test, baseline, script or check file changed; no file moved; no entry value changed.

### Part A: premise checks

1. `lly_report.md` is at the repository root: PASS. It is 7,716 bytes.
2. The S31 row in `docs/research/sources.md` names `lly_report.md`: PASS, line 41.
3. `docs/research/lly.md` cites S31 in six table rows: PASS, lines 26, 40, 55, 56, 58 and 99.
4. `src/engines/lly/` has no match for `research`, `lly.md` or `lly_report`: PASS. The provenance records cite S31 by ID.
5. Every README link to `lly_report.md` or `docs/research/lly.md` resolves: PASS. Four links were checked, at README lines 303, 305 and 365: two to `docs/research/lly.md` and two to `lly_report.md`. The table cell at line 293 is inline code, not a link.

### Part B: sentence corrections

`docs/agent-runbook.md` line 115:

Before:
```text
- **1.4** Keep `lly_report.md` at the root. The provenance records cite `docs/research/lly.md` and source S31.
```

After:
```text
- **1.4** Keep `lly_report.md` at the root. The provenance records cite source S31 by ID. `docs/research/sources.md` lists S31 as `lly_report.md`, and `docs/research/lly.md` cites S31.
```

`docs/engine-library-plan.md` line 325:

Before:
```text
- `lly_report.md` stays at the root. The provenance records cite [research/lly.md](research/lly.md), which cites it.
```

After:
```text
- `lly_report.md` stays at the root. The provenance records cite source S31 by ID, and [research/lly.md](research/lly.md) also cites S31.
```

### Part C: rebuilt Phase 2 checklist

This checklist was rebuilt from the six modules at current line numbers. A curve table is one entry value. "Phase 2 move" means the literal should be replaced by the entry value in Phase 2. "Stays" means it is not an entry value. "Open" marks a decision that needs a later package.

#### Ratings, presets, telemetry and start-up

| File:line | Value | Enclosing function | Control |
| --- | --- | --- | --- |
| `main.js:206-207` | `680` (`desiredRpm`, `lastRpmTarget`) | `simulation` state object | Phase 2 move — `ratings.idleRpm` |
| `main.js:271` | `680` | `startEngine` | Phase 2 move — `ratings.idleRpm` |
| `main.js:299` | `680` | `toggleEngine` | Phase 2 move — `ratings.idleRpm` |
| `main.js:1635` | `680` | `window.__LLY__.setFixture` | Phase 2 move — `ratings.idleRpm` |
| `main.js:340` | `1600` | `updateSimulation` | Phase 2 move — `startSequence.rampDamping.aboveRpm` |
| `main.js:347` | `2200` | `updateSimulation` | Phase 2 move — `startSequence.runDamping.aboveRpm` |
| `main.js:390` | `23` | `updateSimulation` | Phase 2 move — `turbo.boostPeakPsi`, boost cap |
| `main.js:387-394` | `150`, `30`, `38`, `0.02`, `50`, `38` | `updateSimulation` | Phase 2 move — `telemetry.gates`, `telemetry.notFiring` |
| `main.js:794` | `3000` | `buildTachometer` | Phase 2 move — `ratings.peakPowerRpm`, tach red band |
| `main.js:819` | `3000` | `buildTachometer` | Phase 2 move — tach red band |
| `main.js:860` | `3000` | `updateTachometer` | Phase 2 move — tach marker |
| `main.js:1030` | `26000` | `updateTelemetryUI` | Phase 2 move — Allison `maxRailPsi`; check the ZF gauge scale in 2.4 |
| `main.js:1031` | `23` | `updateTelemetryUI` | Phase 2 move — `turbo.boostPeakPsi`, boost bar |
| `main.js:1065` | `3200` | `updateTelemetryUI` | Open decision 2.4 — `GOVERNED` label. The entry has no 3200; plan line 123 gives 3,200 as the LBZ power peak |
| `main.js:1278` | `680`, `1600`, `3000`, `3250` and labels | `applyPreset` | Phase 2 move — `ratings.presets`; labels are 2.4 copy |
| `main.js:1454` | `0`, `680`, `1600`, `3000`, `3250` | `bindControls` keydown handler | Phase 2 move — `ratings.presets` |
| `main.js:1574` | `3200` | `animate` | Open decision 2.4 — toast duration. This is UI timing, not an engine value |
| `main.js:279` | `0.85` | `startEngine` | Phase 2 move — `startSequence.glow.onStart` |
| `main.js:324-355` | `0.55`, `190`, `4.7`, `6`, `1.25`, `520`, `3.1`, `4`, `2.05`, `2.2`, `2.4`, `2.25`, `1.08`, `1.35`, `2.8`, `0.98`, `1.42`, `3`, `1.05`, `3.5`, `1.5` | `updateSimulation` | Phase 2 move — `startSequence` |

#### Curves

| File:line | Value | Enclosing function | Control |
| --- | --- | --- | --- |
| `kinematics.js:246-290` | Torque table: 40 rpm cutoff; ZF 13 pairs ending 3250/488; Allison 13 pairs ending 3250/512; peaks 520 and 605 at 1600 | `torqueAtRpm` | Phase 2 move — `curves.torque` |
| `kinematics.js:293-295` | `5252` | `horsepowerAtRpm` | Stays — horsepower formula constant, not an entry value |
| `kinematics.js:297-320` | 25 rpm cutoff; `23000 / 26000` ZF scale; eight pairs; 26000 return | `railPressureAtRpm` | Phase 2 move — `curves.rail`, calibrations `maxRailPsi` |
| `kinematics.js:322-345` | 120 rpm cutoff; nine pairs; 23.0 at 3000; 21.6 at 3250; 21.6 return | `boostAtRpm` | Phase 2 move — `curves.boost` |
| `kinematics.js:347-368` | 30 rpm cutoff; seven pairs; 82 at 500; 20 at 3250; 20 return; `round` | `vaneAtRpm` | Phase 2 move — `curves.vane` |
| `kinematics.js:370-373` | `30`, `38`, `232`, `510`, `3250`, `0.72` | `egtAtRpm` | Phase 2 move — `curves.egt` |
| `kinematics.js:375-378` | `20`, `0`, `22`, `38`, `1800` | `oilPressureAtRpm` | Phase 2 move — `curves.oil` |
| `kinematics.js:380-382` | `88`, `3250`, `4` | `coolantAtRpm` | Phase 2 move — `curves.coolant` |

#### Audio

| File:line | Value | Enclosing function | Control |
| --- | --- | --- | --- |
| `audio.js:117` | `45.3` | `TestCellAudio` constructor | Phase 2 move — `audio.baseToneHz` |
| `audio.js:425`, `450`, `476` | `23` | `TestCellAudio.update` | Phase 2 move — `turbo.boostPeakPsi` normalization |
| `audio.js:122` | `22.65` | `TestCellAudio` constructor | Stays — derived half of 45.3, not an entry value |

The audio flags `bankCadence`, `turboWhistle` and `injectorKnock` have no remaining literal; they are entry-only design flags. `MAX_RPM` and `MAX_PULSE_FRAME_S` are already entry references.

#### Walk

No entry value remains in `collision.js`. `WALL_CLEARANCE`, `DYNO_CLEARANCE`, `ENGINE_WALK_RADIUS` and `MAX_HOP` are entry references. `EPS`, `CONSOLE_BLOCK`, `PASSES` and `SETTLE` are not entry values and stay.

#### Explode

All sixteen offsets are Phase 2 moves to `explode.offsets`.

| File:line | Assembly | Offset | Enclosing function |
| --- | --- | --- | --- |
| `engine.js:582` | `rotating` | `[0, -105, 0]` | `_buildRotatingAssembly` |
| `engine.js:1017` | `main-caps` | `[0, -225, 0]` | `_buildMainCaps` |
| `engine.js:1140` | `camshaft` | `[0, 95, 0]` | `_buildCamshaft` |
| `engine.js:1228-1229` | `head-R` / `head-L` | `[-195, 195, 0]` / `[195, 195, 0]` | `_buildHeadsAndValvetrain` |
| `engine.js:1250-1251` | `cover-R` / `cover-L` | `[-335, 335, 0]` / `[335, 335, 0]` | `_buildHeadsAndValvetrain` |
| `engine.js:2152` | `oil-pan` | `[0, -355, 0]` | `_buildOilPan` |
| `engine.js:2228` | `oil-filter` | `[230, -70, 0]` | `_buildOilFilter` |
| `engine.js:2347` | `front-drive` | `[0, 15, 290]` | `_buildFrontDrive` |
| `engine.js:2657` | `exhaust-R` / `exhaust-L` | `[-290, 95, 0]` / `[290, 95, 0]` | `_buildExhaustManifolds` |
| `engine.js:2785` | `turbo` | `[0, 310, -250]` | `_buildTurbo` |
| `engine.js:3170` | `intake` | `[0, 340, 40]` | `_buildIntake` |
| `engine.js:3350` | `egr` | `[-230, 260, -90]` | `_buildEGR` |
| `engine.js:3483` | `fuel` | `[0, 220, 110]` | `_buildFuelSystem` |

`block`, `ancillaries` and `mounts` have no explode offset. `explode.cutawayFraction` is already an entry reference. `XRAY_PICK_THRESHOLD = 0.35` at `engine.js:55` is not an entry value and stays.

#### Look and colours

| File:line | Value | Material / use | Enclosing function | Class |
| --- | --- | --- | --- | --- |
| `engine.js:102` | `0x2c312e` | block | `_buildMaterials` | Phase 2 move — `look.palette.block` |
| `engine.js:108` | `0xb2b8b3` | head | `_buildMaterials` | Phase 2 move — `look.palette.head` |
| `engine.js:105` | `0x202422` | `blockDark` | `_buildMaterials` | Open 2.3 — look |
| `engine.js:111` | `0x1a1f1c` | `cover` | `_buildMaterials` | Open 2.3 — look |
| `engine.js:118` | `0x5b5e59` | `liner` | `_buildMaterials` | Open 2.3 — look |
| `engine.js:2350` | `0x888f8a` | front cover | `_buildFrontDrive` | Open 2.3 — look |
| `engine.js:3173` | `0x919792` | intake | `_buildIntake` | Open 2.3 — look |
| `engine.js:1763` | `0xff9b45` | combustion glow sprite | `_buildCombustionGlow` | Open 2.3 — effect |
| `engine.js:1845` | `0xffb24f` | injector glow | `_buildInjectors` | Open 2.3 — effect |
| `engine.js:2276` | `0x1b4d70` | oil-filter cap | `_buildOilFilter` | Open 2.3 — look |
| `engine.js:2922` | `0x252b28` | turbo inlet screen | `_buildTurbo` | Open 2.3 — look |

The nine colours not held by `look.palette` are `0x202422`, `0x1a1f1c`, `0x5b5e59`, `0x888f8a`, `0x919792`, `0xff9b45`, `0xffb24f`, `0x1b4d70` and `0x252b28`. They are classified as above. The open decision is whether the look colours join `look.palette` and whether the two glow colours remain effect constants.

The other colour literals in the six modules are decal text colours and main.js UI/outline colours. They are copy/UI effects, not `look.palette` values and not entry moves. The main.js UI/outline literals are at lines 121, 184-185, 650-651, 679-680 and 982.

#### Engine rating and build warning

| File:line | Value | Enclosing function | Control |
| --- | --- | --- | --- |
| `engine.js:4271` | `3250` | `EngineBuilder.update` | Phase 2 move — `ratings.redlineRpm`; plan line 29 lists this at the old line 4270 |

Vite reports `INEFFECTIVE_DYNAMIC_IMPORT` for `src/engines/lly/copy.js`: the entry's `copy()` loader is unused and `src/specs.js` imports `copy.js` statically. This is not an engine value. Natural fix: Phase 3.1.

#### Open decisions

- 2.3: classify the nine non-palette engine colours as look or effect; decide which join `look.palette`.
- 2.4: the `GOVERNED` label at 3200 rpm and the 3200 ms adaptive-quality toast. The entry has no 3200 value; plan line 123 identifies 3,200 as the LBZ power peak.
- 3.1: remove the ineffective dynamic import by resolving the copy loader/static import split.

No entry-owned dimension literal remains in this checklist besides the explode offsets and palette values, which are Phase 2 moves. Engine geometry dimensions remain outside this checklist and stay.

### Acceptance

`npm test`: 142 tests, 28 suites, 142 passed, 0 failed (296.9713 ms).

`npm run baseline:compare`: Trace PASS, Geometry PASS; all six views 0 changed (>8), 0 differ at all, largest channel delta 0. Console errors: none.

`npm run build`: passed, 38 modules, 262 ms; CSS 34.94 kB, JS 1,295.12 kB. The `INEFFECTIVE_DYNAMIC_IMPORT` warning remains.

`npm run check`: Names 246 matches in 181 lines; Numbers 38 matches in 32 lines; Encoding PASS; IDs PASS; Provenance PASS (`lly`: 197 values, 61 records, 0 without record); overall FAIL 2/5 on Names and Numbers, as expected.

Git state: `docs/engine-library-plan.md` is now modified, alongside the earlier package changes. The plan diff is one changed line (`2 +-`). The runbook diff is `5 +++--`: one line is this 1.4 correction, and the other lines are the earlier uncommitted 1.1/1.1b runbook edits. No code, test, baseline, script or check changed in 1.4.

Open:
- Package 1.5 has not been started.
- No commit, tag or push was made.

## 2026-11-01 · 1.1c Look text and colours in the entry

Files: `src/engines/lly/index.js` and `docs/build-log.md`. No other file changed. No code, test, baseline, script or check changed; no file moved; no existing entry value changed.

### Before/after SHA-256

| File | Before | After |
| --- | --- | --- |
| `src/engine.js` | `833A738707DA6F67407AD649D7EA488DE19EA9A1260A9B0090482E682AB1FDDB` | same |
| `src/kinematics.js` | `1679B12385FE86F80D63C62E6B0954C8EC1075BBF704A3A95E696979F61842B4` | same |
| `src/audio.js` | `05D98733A46FDB5A5678F189D352C76AC2F7E1EC867D6E18F65586BC718FD044` | same |
| `src/collision.js` | `744318490B4E32A8796BB7770AF212DE2F972A2D142486D920F8ADD0CDBFC31A` | same |
| `src/main.js` | `FA8FF712372FBA08620197453EFCABF5C7A1B2224B63907078E70CEE7D06599A` | same |
| `src/specs.js` | `B30CD8E66A14465CE344ED36D8420399286DE94A298304277228403EC2A6639C` | same |
| `src/engines/lly/index.js` | `9AB395BF825C92D04ADE9B8F74170BA76A04D7ABE118CCC1BCF2A692172431CA` | `6296E2AEB0A91CFF61A8D1835485C810AC7FB2A2DE572B3529E61652BBE6E538` |

Only the entry hash changed.

### Added to the entry

- `identity.sceneName = 'Duramax LLY 6600'`.
- `look.palette` gained seven colours beside `block` and `head`:
  - `blockDark: 0x202422`
  - `cover: 0x1a1f1c`
  - `liner: 0x5b5e59`
  - `frontCover: 0x888f8a`
  - `intake: 0x919792`
  - `oilFilterCap: 0x1b4d70`
  - `turboScreen: 0x252b28`
- `look.effects`:
  - `combustionGlow: 0xff9b45`
  - `injectorGlow: 0xffb24f`
- Provenance record `'look.effects': 'design'`.
- `look.decals`, 41 specs in 23 surface groups, in file order:

| Group | Specs |
| --- | ---: |
| `block` | 2 |
| `serialPlate` | 2 |
| `timingCover` | 1 |
| `head` | 1 |
| `injectors` | 2 |
| `valveCover` | 2 |
| `coverCaution` | 2 |
| `oilPan` | 2 |
| `oilFilter` | 3 |
| `oilFilterPlate` | 2 |
| `alternator` | 1 |
| `exhaustManifold` | 2 |
| `exhaustShield` | 2 |
| `turboPlaque` | 2 |
| `turboIdPlate` | 2 |
| `turboBosch` | 1 |
| `intake` | 2 |
| `chargePipe` | 2 |
| `egr` | 1 |
| `egrCooler` | 2 |
| `cp3` | 2 |
| `cp3Top` | 1 |
| `fuelRail` | 2 |
| **Total** | **41** |

Only the 41 literal `text: '...'` label specs were copied. Dynamic labels such as `MAIN 0${…}`, `idText`, `headLabel`, `bankText`, the I/E rocker mark and the passenger/driver bank text are not among the 41 and stay in `src/engine.js`.

### Acceptance audits

- Every `look.decals` text, font and colour string occurs exactly in `src/engine.js`: 0 misses.
- Entry decal spec count: 41.
- `text: '...'` literal count in `src/engine.js`: 41.
- Spec multiset differences between entry and engine: 0.
- All nine new colours are present in `src/engine.js` as the same hex literal: 9 of 9.

The insert used a Node UTF-8 transform that read the source label objects and wrote the entry; no string was retyped.

### Tests and checks

`npm test`: 142 tests, 28 suites, 142 passed, 0 failed (337.3403 ms).

`npm run baseline:compare`: Trace PASS, Geometry PASS; all six views 0 changed (>8), 0 differ at all, largest channel delta 0. Console errors: none.

`npm run build`: passed, 38 modules, 527 ms; CSS 34.94 kB, JS 1,298.78 kB.

`npm run check`: Names 246 matches in 181 lines; Numbers 38 matches in 32 lines; Encoding PASS; IDs PASS; Provenance PASS (`lly`: 206 values, 62 records, 0 without record). Overall FAIL 2/5 on Names and Numbers, as expected. The new counts are 206 values and 62 records, up from 197 and 61 by the nine colours and one `look.effects` record.

### Checklist corrections

- The 1.4 checklist said decal colours were not entry moves. That was wrong. Decal text, fonts and colours now live in `look.decals`. Only placements and canvas sizes stay in `src/engine.js` until Phase 2.3.
- `src/audio.js:122` (`22.65` Hz, bank cadence) is a Phase 2 move, derived as `audio.baseToneHz / 2`. The 1.4 checklist marked it "Stays".

### Names section for the Phase 2 exit

The six modules contribute 199 of the 246 Names matches; the other 47 are in `index.html`, `src/environment.js` and `src/styles.css`. The six-module counts by file and kind:

| File | Engine identity | Transmission | Supplier/part | Plant | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| `src/kinematics.js` | 63 | 23 | 0 | 0 | 86 |
| `src/engine.js` | 25 | 0 | 31 | 5 | 61 |
| `src/specs.js` | 4 | 0 | 0 | 0 | 4 |
| `src/collision.js` | 6 | 0 | 0 | 0 | 6 |
| `src/audio.js` | 4 | 0 | 8 | 0 | 12 |
| `src/main.js` | 15 | 11 | 2 | 2 | 30 |
| **Total** | **117** | **34** | **41** | **7** | **199** |

Kind definitions: engine identity = `lly`, `duramax`, `6600`; transmission = `allison`, `zf`; supplier/part = `bosch`, `garrett`, `acdelco`, `cp3`, `pf2232`, `denso`, `gm`, `gt3788*`; plant = `dmax`, `moraine`. Counts include import paths, entry references and remaining copy/brand text. The check remains 246 matches in 181 lines.

### Later packages

- Cell signage in `src/environment.js`: Phase 3.2.
- Text in `index.html`: Phase 2.4.
- Main.js UI copy and outline colours: Phase 2.4.
- 3200 values: decision for 2.4.
- 22.65 Hz bank cadence: Phase 2 derivation from `audio.baseToneHz / 2`.

### Git state

`src/engines/lly/index.js` is inside the untracked `src/engines/` directory, so it does not appear in `git diff --stat`; `docs/build-log.md` is the tracked 1.1c change. Earlier package changes remain. The final status and diff are in the package report.

Open:
- Package 1.5 has not been started.
- No commit, tag or push was made.

## 2026-11-01 · 1.5 Phase 1 acceptance

No code, entry, test, baseline, script or check changed. The only write was this log entry; the two temporary `.qa` comparison files were deleted.

### Acceptance results

1. `npm test`: 142 tests, 28 suites, 142 passed, 0 failed (289.0497 ms).
2. `npm run baseline:compare`: Trace PASS, Geometry PASS; all six views 0 changed (>8), 0 differ at all, largest channel delta 0. Console errors: none.
3. `npm run build`: passed, 38 modules, 280 ms; CSS 34.94 kB, JS 1,298.78 kB.
4. `npm run check`: Names 246 matches in 181 lines; Numbers 38 matches in 32 lines; Encoding PASS; IDs PASS; Provenance PASS (`lly`: 206 values, 62 records, 0 without record). Overall FAIL 2/5 on Names and Numbers. Exit code 1.
5. Kinematics export comparison: 33 exports compared, 0 problems. Every value and function matched HEAD; the entry-derived exports keep the same values, key order and frozen state.
6. Mapping check: eight removed literals, all matched their entry values. No other removed literal.

The first `git show HEAD:src/kinematics.js > .qa/kinematics-head.mjs` redirect wrote UTF-16, so Node rejected the temporary file with:

```text
SyntaxError: Invalid or unexpected token
```

The file was regenerated as UTF-8 with Node, and the comparison then passed 33/0. Both temporary files were deleted.

### Eight removed literals

| File | Old literal | Entry path | Entry value |
| --- | --- | --- | --- |
| `src/audio.js` | `MAX_RPM = 3250` | `ratings.redlineRpm` | `3250` |
| `src/audio.js` | `MAX_PULSE_FRAME_S = 0.2` | `audio.maxFrameS` | `0.2` |
| `src/collision.js` | `WALL_CLEARANCE = 0.35` | `walk.wallClearanceM` | `0.35` |
| `src/collision.js` | `DYNO_CLEARANCE = 0.3` | `walk.dynoClearanceM` | `0.3` |
| `src/collision.js` | `ENGINE_WALK_RADIUS = 1.03` | `walk.clearanceRadiusM` | `1.03` |
| `src/collision.js` | `MAX_HOP = 0.1` | `walk.maxHopM` | `0.1` |
| `src/engine.js` | `EXPLODE_CUTAWAY_FRACTION = 0.45` | `explode.cutawayFraction` | `0.45` |
| `src/main.js` | `MAX_RPM = 3250` | `ratings.redlineRpm` | `3250` |

7. Git status and diff stat match the expected Phase 1 set: `docs/agent-runbook.md`, `docs/build-log.md`, `docs/engine-library-plan.md`, `scripts/check.mjs`, `src/audio.js`, `src/collision.js`, `src/engine.js`, `src/kinematics.js`, `src/main.js`, `src/specs.js` and the untracked `src/engines/`. No other file appeared. The temporary `.qa` files are absent.
8. Gate hashes:

| File | SHA-256 |
| --- | --- |
| `src/engine.js` | `833A738707DA6F67407AD649D7EA488DE19EA9A1260A9B0090482E682AB1FDDB` |
| `src/kinematics.js` | `1679B12385FE86F80D63C62E6B0954C8EC1075BBF704A3A95E696979F61842B4` |
| `src/audio.js` | `05D98733A46FDB5A5678F189D352C76AC2F7E1EC867D6E18F65586BC718FD044` |
| `src/collision.js` | `744318490B4E32A8796BB7770AF212DE2F972A2D142486D920F8ADD0CDBFC31A` |
| `src/main.js` | `FA8FF712372FBA08620197453EFCABF5C7A1B2224B63907078E70CEE7D06599A` |
| `src/specs.js` | `B30CD8E66A14465CE344ED36D8420399286DE94A298304277228403EC2A6639C` |
| `src/engines/lly/index.js` | `6296E2AEB0A91CFF61A8D1835485C810AC7FB2A2DE572B3529E61652BBE6E538` |

### Phase 1 packages

| Package | Files touched | Acceptance |
| --- | --- | --- |
| 1.1 | `src/engines/lly/index.js`, `docs/build-log.md` | 142 tests passed; provenance was the 1.1b follow-up; no commit |
| 1.1b | `src/engines/lly/index.js`, `scripts/check.mjs`, `docs/build-log.md` | 142 tests passed; provenance PASS 197/61; Names 215/154, Numbers 52/46; no commit |
| 1.2 | `src/engines/lly/copy.js`, `src/specs.js`, `src/engines/lly/index.js`, `docs/build-log.md`, `.qa/copy-before.json`, `.qa/copy-after.json` | Snapshots identical; 142 tests passed; build passed; Names 173/126, Numbers 43/37; no commit |
| 1.3 | `src/kinematics.js`, `src/engine.js`, `src/specs.js`, `src/collision.js`, `src/audio.js`, `src/main.js`, `docs/build-log.md` | 142 tests passed; baseline passed; build passed; Names 246/181, Numbers 38/32; provenance 197/61; no commit |
| 1.4 | `docs/agent-runbook.md`, `docs/engine-library-plan.md`, `docs/build-log.md` | 142 tests passed; baseline passed; build passed; Names 246/181, Numbers 38/32; provenance 197/61; no commit |
| 1.1c | `src/engines/lly/index.js`, `docs/build-log.md` | 41 decal specs and 9 colours audited; 142 tests passed; baseline passed; build passed; Names 246/181, Numbers 38/32; provenance 206/62; no commit |
| 1.5 | `docs/build-log.md` (plus deleted `.qa` temp files) | 142 tests passed; baseline passed; build passed; check counts above; 33 exports/0 problems; eight mappings matched; gate pending |

### Entry at the gate

`src/engines/lly/index.js` holds:

`id`, `family`, `identity`, `layout`, `geometry`, `valvetrain`, `features`, `ratings`, `curves`, `turbo`, `telemetry`, `startSequence`, `audio`, `inspect`, `walk`, `dyno`, `look`, `explode`, `oil`, `provenance`, `copy`.

- Provenance: 206 values, 62 records, 0 without record.
- `look.decals`: 41 specs in 23 groups.
- `look.palette`: 9 colours; `look.effects`: 2 colours.
- All six code module hashes match the pre-1.1c values; the entry is the only changed hash.

### Open decisions for the human

1. **Kinematics layout (plan line 153).** `src/kinematics.js` still exports `LLY`, `CALIBRATIONS`, `STATION_Z`, `BANK_Z_OFFSET`, `STATION_THROW_OFFSET`, `CYLINDERS`, `FIRING_ORDER` and `VALVE_TIMING`. Decide before 2.3 how the family supplies them. Proposed default: the family builds them from the entry, and the kinematics functions take them as arguments.
2. **Six LLY-specific bank labels in `src/engine.js`.** `headLabel` at line 1261 (`RIGHT BANK · 1-3-5-7` / `LEFT BANK · 2-4-6-8`), `bankText` at line 2045 (`BANK R · 1-3-5-7` / `BANK L · 2-4-6-8`) and the passenger/driver text at line 2049. They are not in the entry. Decide in 2.3: copy them into `look.decals`, or derive them from layout.
3. **The 3200 values.** `GOVERNED` at `src/main.js:1065` and the 3200 ms toast at `src/main.js:1574`. The entry has no 3200 value. Plan line 123 gives 3,200 as the LBZ power peak. Decide in 2.4.
4. **Cell signage.** The `DMAX` and `MORAINE` strings in `src/environment.js` belong in the entry as branding. Phase 3.2.
5. **`INEFFECTIVE_DYNAMIC_IMPORT`.** The `copy.js` warning remains. Phase 3.1.

The Phase 2 exit list is the Names section of the 1.1c entry: 199 six-module matches of the 246 total, with the remaining 47 in `index.html`, `src/environment.js` and `src/styles.css`.

Gate: waiting for human approval. No commit, tag, or Phase 2 work has been started.
