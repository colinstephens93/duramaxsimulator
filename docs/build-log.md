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
