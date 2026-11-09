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

## 2026-11-01 · 2.1 Telemetry moved to core

Files: `src/core/telemetry.js` (new); `src/kinematics.js`, `src/main.js`, `scripts/capture-numeric.mjs`, `tests/kinematics.test.mjs` (changed); `tests/telemetry.test.mjs` (new); `docs/build-log.md` (changed). No entry, baseline, PNG, archive, doc other than the log, or test assertion changed.

### Telemetry core

`src/core/telemetry.js` imports nothing and names no engine. It exports:

`torqueAtRpm(engine, rpm, calibration)`, `horsepowerAtRpm(engine, rpm, calibration)`, `railPressureAtRpm(engine, rpm, calibration)`, `boostAtRpm(engine, rpm)`, `vaneAtRpm(engine, rpm)`, `egtAtRpm(engine, rpm)`, `oilPressureAtRpm(engine, rpm)`, `coolantAtRpm(engine, rpm)` and `telemetryValues(engine, { firing, rpm, calibration })`.

Calibration is required; there is no default. The helper reads `interp`: `smoothstep` uses `t * t * (3 - 2 * t)`, `linear` uses `t`, and every table keeps `y0 + (y1 - y0) * s`. Rail interpolates in psi, then scales by `maxRailPsi / scaleTo`. `round` is applied only where the curve flags it. `horsepowerAtRpm` keeps `5252`.

### Removed literals mapped to the entry

| Source | Removed literal | Entry path |
| --- | --- | --- |
| `kinematics.js:247` | torque cutoff `40` | `curves.torque.zeroBelowRpm` |
| `kinematics.js:252-279` | ZF and Allison torque point pairs | `curves.torque.points.zf` / `.allison` |
| `kinematics.js:294` | `5252` | Not an entry value; formula constant stays in core |
| `kinematics.js:298` | rail cutoff `25` | `curves.rail.zeroBelowRpm` |
| `kinematics.js:299` | `23000 / 26000` | `ratings.calibrations.zf.maxRailPsi` / `curves.rail.scaleTo` |
| `kinematics.js:300-308` | rail point pairs | `curves.rail.points` |
| `kinematics.js:319` | rail return `26000` | `curves.rail.scaleTo` |
| `kinematics.js:323` | boost cutoff `120` | `curves.boost.zeroBelowRpm` |
| `kinematics.js:324-333` | boost point pairs | `curves.boost.points` |
| `kinematics.js:344` | boost return `21.6` | `curves.boost.points` last value |
| `kinematics.js:348` | vane cutoff `30` | `curves.vane.zeroBelowRpm` |
| `kinematics.js:350-356` | vane point pairs | `curves.vane.points` |
| `kinematics.js:358` | first vane point `82` | `curves.vane.points[0]` |
| `kinematics.js:367` | last vane value `20` | `curves.vane.points` last value |
| `kinematics.js:371` | EGT below `30` / value `38` | `curves.egt.belowRpm` / `belowValue` |
| `kinematics.js:372` | EGT `232`, `510`, `3250`, `0.72` | `curves.egt.base`, `span`, `atRpm`, `exponent` |
| `kinematics.js:376` | oil cutoff `20` | `curves.oil.zeroBelowRpm` |
| `kinematics.js:377` | oil `22`, `38`, `1800` | `curves.oil.base`, `span`, `atRpm` |
| `kinematics.js:381` | coolant `88`, `3250`, `4` | `curves.coolant.base`, `atRpm`, `span` |
| `main.js:387` | torque/hp gate `150` | `telemetry.gates.torqueHpMinRpm` |
| `main.js:390` | boost cap `23` | `curves.boost.capPsi` |
| `main.js:391` | vane gate `30` | `telemetry.gates.vaneMinRpm` |
| `main.js:392` | EGT fallback `38` | `telemetry.notFiring.egtBase` |
| `main.js:392` | EGT rate `0.02` | `telemetry.notFiring.egtPerRpm` |
| `main.js:394` | coolant gate `50` | `telemetry.gates.coolantMinRpm` |
| `main.js:394` | coolant fallback `38` | `telemetry.notFiring.coolant` |

The removed firing branches for rail, boost, EGT and oil now use `railRequiresFiring`, `boostRequiresFiring`, `egtRequiresFiring` and `oilRequiresFiring`. These flags were not read before; this package makes them take effect for the first time. With all four true, the results are exactly today's values. A false rail/boost/oil flag shows the value without firing; a false EGT flag uses the firing curve when not firing.

### Call sites changed

- `src/main.js`: `vaneAtRpm(lly, …)` at the engine frame and QA fixture; `telemetryValues(lly, …)` in `updateSimulation`; `torqueAtRpm(lly, …)` and `horsepowerAtRpm(lly, …)` in the curve cache and chart. `environment.update` and `audio.update` keep their order; `s._telemetry` is the returned object.
- `tests/kinematics.test.mjs`: the three calibration calls pass `lly`; expected values and assertions are unchanged.
- `scripts/capture-numeric.mjs`: all eight curve calls pass `lly`; the capture was not run because it writes `tests/baseline/`.
- `src/kinematics.js`: the eight functions and their tables are deleted; the remaining exports are unchanged.

`simulation.calibration` is initialized to `'allison'` and `setCalibration` only accepts known keys. `setFixture` does not clear it. No path leaves it undefined; no stop was needed.

### New tests

`tests/telemetry.test.mjs` adds 16 tests:

- gate boundaries at 150/151, 30/31 and 50;
- torque/hp at peak power when not firing;
- rail/boost/oil zero and EGT not-firing formula;
- vane without firing;
- coolant fallback;
- boost cap;
- false rail flag;
- return key order;
- entry-driven EGT, oil, coolant, torque point, rail scale and gate copies;
- representative curve outputs.

Total: **158 tests, 31 suites, 158 passed, 0 failed** (299.6773 ms).

### Check counts

Before:
```text
Names: FAIL (246 matches in 181 lines)
Numbers: FAIL (38 matches in 32 lines)
Provenance: PASS (206 values, 62 records)
```

After:
```text
Names: FAIL (247 matches in 180 lines)
Numbers: FAIL (23 matches in 18 lines)
Encoding: PASS
IDs: PASS
Provenance: PASS (206 values, 62 records)
Result: FAIL (2 of 5 checks failed: Names, Numbers)
```

The 15-number fall is the removed `kinematics.js` telemetry block. The one-name net rise is 8 names gone from `kinematics.js` (the LLY/Allison/ZF hook and curve comments/parameters) and 9 `lly` arguments added in `main.js`. Both counts match the package expectation.

### Other acceptance

- `npm run baseline:compare`: Trace PASS, Geometry PASS; all six views PASS. Home had 0 changed (>8), 1 pixel differing at all with channel delta 1; the other five views had 0/0.
- `npm run build`: passed, **39 modules**, 556 ms; CSS 34.94 kB, JS 1,298.73 kB.
- `src/core/telemetry.js` Names/Number patterns: 0/0.
- `src/core/` imports from `src/engines`: none.
- `tests/baseline/*.json` hashes and the entry hash are unchanged from before the edit:
  - curves `76E383E8A1D62A813004D37418DD299181EAC1D7483C2C602E5ABE366C495938`
  - trace `CC8FCFCF6DC7CD509BEAB452CFC50A94B7374DEBFCA6BED14D54A5ED6A0C440C`
  - geometry `9F387EAFDDEEB79C41F2288F12DB7661B9826EA6E41DA213C472215F27281D51`
  - entry `6296E2AEB0A91CFF61A8D1835485C810AC7FB2A2DE572B3529E61652BBE6E538`

### Git status

The 2.1 changes are `M src/kinematics.js`, `M src/main.js`, `M scripts/capture-numeric.mjs`, `M tests/kinematics.test.mjs`, `?? src/core/` and `?? tests/telemetry.test.mjs`, plus this log entry. No other file changed.

Open:
- Package 2.2 has not been started.
- No commit, tag or push was made.

## 2026-11-02 · 2.2 Start-up moved to core

Files: `src/core/simulation.js` (new); `src/main.js`, `src/utils.js`, `src/engines/lly/index.js`, `tests/telemetry.test.mjs` (changed); `tests/simulation.test.mjs` (new); `docs/build-log.md` (changed). No baseline, PNG, archive, other doc or test assertion changed.

### 2.1 test tidy

- Removed the `zero` and `one` constants; all uses are now literal `0` and `1`.
- The rail-scale test is exact: with `scaleTo` halved, the result must equal the base value times `lly.curves.rail.scaleTo / modified.curves.rail.scaleTo`.
- Test count stays at 16.

### Entry additions

Four values were added to `startSequence`; the existing `'startSequence': 'design'` provenance record covers them:

| Key | Value | Design source |
| --- | ---: | --- |
| `firingAboveRpm` | 90 | Same number as the old `s.rpm > 90` test |
| `overspeedDamping` | 6 | Same number as the old overspeed damp |
| `overspeedHeadroomRpm` | 12 | Same number as the old `MAX_RPM + 12` |
| `glow.stopped.cutoff` | 0.001 | Same number as the old spin-down glow test |

Only the four additions changed in the entry.

### Core simulation

`src/core/simulation.js` imports `{ clamp, damp }` from `../utils.js` and `{ mod }` from `../kinematics.js`. It exports `startRun`, `stopRun` and `stepRun`, with no comments and no engine-specific names.

- `startRun` sets the clamped setpoint, the last target, and the start state in the same order as `startEngine`; it returns `false` for a running engine and `true` for a new start.
- `stopRun` clears engineOn, starting, fuel, desiredRpm and lastRpmTarget.
- `stepRun` keeps the start-up structure, comparison operators, damping order and crank-angle arithmetic, reading every number from `engine.startSequence` and `engine.ratings`.

`src/utils.js` gained `clamp` directly after `damp`, using `THREE.MathUtils.clamp`. `main.js` keeps its own `const clamp`.

### Literals removed from main.js

| Removed literal | Entry path |
| --- | --- |
| `0.55` crank end | `startSequence.crankUntilS` |
| `190`, `4.7` | `startSequence.crankRpm`, `crankDamping` |
| `1`, `6` cranking glow | `startSequence.glow.crank.target`, `.damping` |
| `1.25` light-off end | `startSequence.lightOffUntilS` |
| `520`, `3.1` | `startSequence.lightOffRpm`, `lightOffDamping` |
| `0.55`, `4` light-off glow | `startSequence.glow.lightOff.target`, `.damping` |
| `2.05` idle end | `startSequence.idleUntilS` |
| `LLY.idleRpm`, `2.2` | `ratings.idleRpm`, `startSequence.idleDamping` |
| `0.12`, `2.4` idle glow | `startSequence.glow.idle.target`, `.damping` |
| `2.25` ramp end | `startSequence.rampEndS` |
| `1600`, `1.08`, `1.35` | `startSequence.rampDamping.aboveRpm`, `.fast`, `.slow` |
| `0`, `2.8` ramp glow | `startSequence.glow.ramp.target`, `.damping` |
| `0`, `3` running glow | `startSequence.glow.running.target`, `.damping` |
| `2200`, `0.98`, `1.42` | `startSequence.runDamping.aboveRpm`, `.fast`, `.slow` |
| `1.05` spin-down damping | `startSequence.stopDamping` |
| `3.5` spin-down snap | `startSequence.stopSnapRpm` |
| `0.001`, `1.5` spin-down glow | `startSequence.glow.stopped.cutoff` (new), `.damping` |
| `0.85` glow on start | `startSequence.glow.onStart` |
| `MAX_RPM + 12` overspeed clamp | `ratings.redlineRpm` + `startSequence.overspeedHeadroomRpm` (new) |
| `6` overspeed damping | `startSequence.overspeedDamping` (new) |
| `680` idle fallback | `ratings.idleRpm` |
| `90` firing test | `startSequence.firingAboveRpm` (new) |
| `MAX_RPM` in clamp/damp | `ratings.redlineRpm` |

### Call sites changed

- `src/main.js`: `startEngine` calls `startRun`; `stopEngine` calls `stopRun`; `toggleEngine` uses `lly.ratings.idleRpm`; the initial desired and last targets use the entry idle; `updateSimulation` calls `stepRun`; firing uses `firingAboveRpm`.
- `src/engines/lly/index.js`: four `startSequence` additions only.
- `src/utils.js`: `clamp` addition only.
- `tests/telemetry.test.mjs`: 2.1 tidy only.
- `tests/simulation.test.mjs`: 13 new tests.

### New tests

`tests/simulation.test.mjs` covers start/stop, fuel timing, ramp end, fast and slow ramp damping, fast and slow running damping, spin-down snap and overspeed. Expected values come from the entry or from `damp`.

**171 tests, 33 suites, 171 passed, 0 failed** (362.4779 ms).

### Acceptance

- `npm run baseline:compare`: Trace PASS, Geometry PASS; all six views 0 changed (>8), 0 differ at all.
- `npm run build`: passed, **40 modules**, 568 ms; CSS 34.94 kB, JS 1,299.68 kB.
- `npm run check`: Names 249 matches in 183 lines; Numbers 23 matches in 18 lines; Encoding PASS; IDs PASS; Provenance PASS (`lly`: 210 values, 62 records, 0 without record). Overall FAIL 2/5 on Names and Numbers; exit 1.
- `src/core/simulation.js` and `src/core/telemetry.js`: Names 0, Numbers 0 each.
- No direct imports from `src/engines/` in `src/core/`.

The Names movement is the expected 6 new `lly` references in `main.js` minus the 4 removed `LLY.idleRpm` references on 3 lines, relative to 2.1's 247. Numbers stay at 23.

### Start-up literal grep

`grep -n` hits in `src/main.js`:

```text
38: 2.25   intro position
138: 1.05  camera minimum distance
249: 2.4   camera last-safe position
257: 3.1   camera duration
372: 1.05  camera reset duration
436: 1.05  camera wall distance
437: 1.05  camera wall ratio
593: 3.1   outline edge strength
872: 2.2   chart line width
904: 190   rgba green channel
1171: 2.2 / 3.5 / 1.5  camera tween position/duration
1219: 680   preset name map
1338: 1.35  walk pitch clamp
1395: 680   preset value list
1576: 680   setFixture default
```

None is inside the moved start-up block.

### Hashes

| File | Before | After |
| --- | --- | --- |
| `tests/baseline/lly-curves.json` | `76E383E8A1D62A813004D37418DD299181EAC1D7483C2C602E5ABE366C495938` | same |
| `tests/baseline/lly-trace.json` | `CC8FCFCF6DC7CD509BEAB452CFC50A94B7374DEBFCA6BED14D54A5ED6A0C440C` | same |
| `tests/baseline/lly-geometry.json` | `9F387EAFDDEEB79C41F2288F12DB7661B9826EA6E41DA213C472215F27281D51` | same |
| `src/engines/lly/index.js` | `6296E2AEB0A91CFF61A8D1835485C810AC7FB2A2DE572B3529E61652BBE6E538` | `1E5A75E5FE60960305F79C96CC47909C47B5A0A95C479062317BE2CFDAB18A68` |

`git diff -U0 -- src/engines/lly/index.js` shows only the three top-level additions and the `glow.stopped` cutoff addition.

### Git status

`git status --short --untracked-files=all` shows the 2.2 set:

```text
 M docs/build-log.md
 M scripts/capture-numeric.mjs
 M src/engines/lly/index.js
 M src/kinematics.js
 M src/main.js
 M src/utils.js
 M tests/kinematics.test.mjs
?? src/core/simulation.js
?? src/core/telemetry.js
?? tests/simulation.test.mjs
?? tests/telemetry.test.mjs
```

`tests/telemetry.test.mjs` is `??`, not `M`, because it was already untracked after 2.1; the 2.2 tidy changed an untracked file, so Git cannot show it as modified. This is the only difference from the expected status. No other file changed. The tracked diff stat is in the package report.

Open:
- Package 2.3 has not been started.
- No commit, tag or push was made.

## 2026-11-03 · 2.3a Engine file moved

Files: `src/engine.js` renamed to `src/engines/families/v8-ohv.js`; `src/main.js`, `tests/kinematics.test.mjs`, `tests/picking.test.mjs` and `scripts/capture-browser.mjs` import paths changed; `docs/build-log.md` changed. No value, logic, test assertion, baseline or PNG changed.

### Rename

- Created `src/engines/families/`.
- Ran `git mv src/engine.js src/engines/families/v8-ohv.js`.
- The rename is the only staged change: `git diff --cached --name-status` is `R100 src/engine.js src/engines/families/v8-ohv.js`; cached stat is 0 insertions, 0 deletions.
- The file has 4,341 lines before and after. The working-tree diff against HEAD is `6 +-` from the three import-line replacements.

### Three import edits in the moved file

- `'./utils.js'` → `'../../utils.js'`
- `'./engines/lly/index.js'` → `'../lly/index.js'`
- `'./kinematics.js'` → `'../../kinematics.js'`

A line-by-line comparison against `HEAD:src/engine.js` found only lines 22, 23 and 37 different, with the same line count. No other content changed.

### Four importer edits

- `src/main.js`: `'./engine.js'` → `'./engines/families/v8-ohv.js'`
- `tests/kinematics.test.mjs`: `'../src/engine.js'` → `'../src/engines/families/v8-ohv.js'`
- `tests/picking.test.mjs`: `'../src/engine.js'` → `'../src/engines/families/v8-ohv.js'`
- `scripts/capture-browser.mjs`: `'/src/engine.js'` → `'/src/engines/families/v8-ohv.js'`

### Reference scan

`grep` is not installed in this PowerShell environment; the equivalent `git grep` was used. `git grep --untracked -n 'engine\.js' -- src tests scripts` found no matches. The import scan shows the new family path and the existing `lly` imports; there is no stale `engine.js` reference in source, tests or scripts.

Stale documentation references still naming `src/engine.js` (not edited):

- `docs/agent-runbook.md`
- `docs/build-log.md`
- `docs/engine-library-plan.md`

### Check counts

Before:
```text
Names: FAIL (249 matches in 183 lines)
Numbers: FAIL (23 matches in 18 lines)
Provenance: PASS (210 values, 62 records)
```

After:
```text
Names: FAIL (188 matches in 133 lines)
Numbers: FAIL (22 matches in 17 lines)
Encoding: PASS
IDs: PASS
Provenance: PASS (210 values, 62 records)
Result: FAIL (2 of 5 checks failed: Names, Numbers)
```

The drop is scope: `src/engine.js` had 61 Names matches in 50 lines and one Numbers match, and the file is now under `src/engines/`, which `check.mjs` skips. No source match was fixed; the counts changed only because the file moved.

### Acceptance

- `npm test`: 171 tests, 33 suites, 171 passed, 0 failed (350.4929 ms).
- `npm run baseline:compare`: Trace PASS, Geometry PASS; all six views PASS. Home had 0 changed (>8), 1 sub-threshold pixel with delta 1; the other five views 0/0.
- `npm run build`: passed, 40 modules, 534 ms; CSS 34.94 kB, JS 1,299.68 kB.
- `npm run check`: counts and exit 1 above.
- Baseline hashes unchanged: curves `76E383E8A1D62A813004D37418DD299181EAC1D7483C2C602E5ABE366C495938`, trace `CC8FCFCF6DC7CD509BEAB452CFC50A94B7374DEBFCA6BED14D54A5ED6A0C440C`, geometry `9F387EAFDDEEB79C41F2288F12DB7661B9826EA6E41DA213C472215F27281D51`.
- Entry hash unchanged: `1E5A75E5FE60960305F79C96CC47909C47B5A0A95C479062317BE2CFDAB18A68`.

### Staging

Only the rename is staged. The three import edits in `v8-ohv.js`, the four importer edits and the log remain unstaged. There is no commit, tag or push.

`git status --short --untracked-files=all` shows:

```text
 M docs/build-log.md
 M scripts/capture-browser.mjs
 M scripts/capture-numeric.mjs
RM src/engine.js -> src/engines/families/v8-ohv.js
 M src/engines/lly/index.js
 M src/kinematics.js
 M src/main.js
 M src/utils.js
 M tests/kinematics.test.mjs
 M tests/picking.test.mjs
?? src/core/simulation.js
?? src/core/telemetry.js
?? tests/simulation.test.mjs
?? tests/telemetry.test.mjs
```

`tests/telemetry.test.mjs` remains `??`, as it was after 2.1. The 2.2 set is otherwise unchanged.

Open:
- Package 2.3b has not been started.
- No commit, tag or push was made.

## 2026-11-03 · 2.3b V8 kinematics moved to family

Files: `src/engines/families/v8-ohv-kinematics.js` (new); `src/kinematics.js`, `src/main.js`, `src/audio.js`, `src/specs.js`, `src/engines/families/v8-ohv.js`, `tests/kinematics.test.mjs`, `tests/audio-pulses.test.mjs`, `tests/helpers/fake-audio.mjs`, `scripts/capture-numeric.mjs` (changed); `docs/build-log.md` (changed). No baseline, PNG, archive, value, logic or test assertion changed.

### Split

`src/engines/families/v8-ohv-kinematics.js` starts with only:

```js
import lly from '../lly/index.js';
import { DEG, cycleAngle, strokeAtCycle, wrapSignedDeg } from '../../kinematics.js';
```

Moved verbatim, in order, with every export name unchanged:

- `LLY`, `CALIBRATIONS`, `STATION_Z`, `BANK_Z_OFFSET`, `STATION_THROW_OFFSET`, `CYLINDERS`, `CYLINDER_BY_NUMBER`, `FIRING_ORDER`, `CYLINDER_BY_STATION_BANK`
- `pinWorldAngleDeg`, `pistonKinematics`, `crankPinWorld`
- `VALVE_TIMING`, `valveLift`, `valveVelocity`
- `cylinderState`
- `activeFiringCylinder`

`src/kinematics.js` keeps only:

- `DEG`, `RAD`, `mod`, `wrapSignedDeg`
- `cycleAngle`, `strokeAtCycle`, `STROKE_COLORS`
- `camshaftAngleDeg`

It now imports nothing and is 38 lines. The family module is 205 lines.

### Importer changes

- `src/main.js`: `CALIBRATIONS`, `CYLINDERS`, `FIRING_ORDER`, `LLY` and `cylinderState` from the family module; `mod`, `strokeAtCycle` stay on `./kinematics.js`. The package list named four of these; `CALIBRATIONS` also had to move because it is defined in the moved block.
- `src/audio.js`: `CYLINDERS` from the family module; `mod` stays.
- `src/specs.js`: `CYLINDER_BY_NUMBER` from the family module.
- `src/engines/families/v8-ohv.js`: `BANK_Z_OFFSET`, `CYLINDERS`, `CYLINDER_BY_NUMBER`, `LLY`, `STATION_THROW_OFFSET`, `STATION_Z`, `VALVE_TIMING`, `cylinderState` from `./v8-ohv-kinematics.js`; `DEG`, `camshaftAngleDeg`, `mod`, `wrapSignedDeg` stay on `../../kinematics.js`.
- `tests/kinematics.test.mjs`: the moved names come from `../src/engines/families/v8-ohv-kinematics.js`; `DEG`, `camshaftAngleDeg`, `mod` stay on `../src/kinematics.js`. The first two comment lines now name both files.
- `tests/audio-pulses.test.mjs`: `CYLINDERS` from the family module.
- `tests/helpers/fake-audio.mjs`: `FIRING_ORDER` from the family module; `mod` stays.
- `scripts/capture-numeric.mjs`: every moved name from the family module; `camshaftAngleDeg` and `cycleAngle` stay on `../src/kinematics.js`. Not run, because it writes `tests/baseline/`.

`git grep --untracked -n "kinematics" -- src tests scripts` shows every old-file import names only a kept export.

### Block verification

The pre-edit `src/kinematics.js` was copied outside the repo with Node before the split. A temporary Node script compared that copy to the new files:

```text
moved blocks exact: true
moved block order: true
kept blocks exact: true
generic imports: false
family lines: 206 generic lines: 39
```

The line counts include the final newline. The temporary copy and verifier were deleted.

### Check counts

Before:
```text
Names: FAIL (188 matches in 133 lines)
Numbers: FAIL (22 matches in 17 lines)
Provenance: PASS (210 values, 62 records)
```

After:
```text
Names: FAIL (110 matches in 71 lines)
Numbers: FAIL (22 matches in 17 lines)
Encoding: PASS
IDs: PASS
Provenance: PASS (210 values, 62 records)
Result: FAIL (2 of 5 checks failed: Names, Numbers)
```

The drop is scope, not a fix: `src/kinematics.js` had 78 Names matches in 62 lines, and the moved code now sits under `src/engines/`, which `check.mjs` skips. Numbers are unchanged.

`git grep -n -E "\blly\b|LLY|CYLINDERS|STATION_|VALVE_TIMING|FIRING_ORDER|CALIBRATIONS" -- src/kinematics.js` returned nothing.

### Acceptance

- `npm test`: 171 tests, 33 suites, 171 passed, 0 failed (298.0614 ms).
- `npm run baseline:compare`: Trace PASS, Geometry PASS; all six views 0 changed (>8), 0 differ at all.
- `npm run build`: passed, 41 modules, 567 ms; CSS 34.94 kB, JS 1,299.68 kB.
- `npm run check`: counts and exit 1 above.
- Baseline hashes unchanged: curves `76E383E8A1D62A813004D37418DD299181EAC1D7483C2C602E5ABE366C495938`, trace `CC8FCFCF6DC7CD509BEAB452CFC50A94B7374DEBFCA6BED14D54A5ED6A0C440C`, geometry `9F387EAFDDEEB79C41F2288F12DB7661B9826EA6E41DA213C472215F27281D51`.
- Entry hash unchanged: `1E5A75E5FE60960305F79C96CC47909C47B5A0A95C479062317BE2CFDAB18A68`.

This was a move, not an argument change. Every block and signature was copied verbatim, and no function gained an entry argument. The split exists to put V8-specific layout and piston maths under the family; argument and data-flow changes belong to a later package, so the trace baseline can prove this step changed no value.

### Status

The new family module is untracked. The 2.3a rename remains the only staged change (`R100`). No commit, tag or push was made.

Open:
- Package 2.3c has not been started.
- No commit, tag or push was made.

## 2026-11-03 · 2.3c Identity, explode, crank reference, calibrations and part IDs

Files: `src/engines/families/v8-ohv.js`, `src/engines/families/v8-ohv-kinematics.js`, `tests/kinematics.test.mjs` and `docs/build-log.md`. No baseline, PNG, archive, entry, `src/main.js`, `index.html`, `src/styles.css`, `src/core/` or capture/test file was changed.

### Literal map

| File:line (2.3b) | Old value | Entry path |
| --- | --- | --- |
| `v8-ohv.js:66` | `'Duramax LLY 6600'` | `identity.sceneName` |
| `v8-ohv.js:579` | `[0, -105, 0]` | `explode.offsets.rotating` |
| `v8-ohv.js:1014` | `[0, -225, 0]` | `explode.offsets['main-caps']` |
| `v8-ohv.js:1137` | `[0, 95, 0]` | `explode.offsets.camshaft` |
| `v8-ohv.js:1225` | `[-195, 195, 0]` / `[195, 195, 0]` | `explode.offsets[\`head-${bank}\`]` |
| `v8-ohv.js:1247` | `[-335, 335, 0]` / `[335, 335, 0]` | `explode.offsets[\`cover-${bank}\`]` |
| `v8-ohv.js:2149` | `[0, -355, 0]` | `explode.offsets['oil-pan']` |
| `v8-ohv.js:2225` | `[230, -70, 0]` | `explode.offsets['oil-filter']` |
| `v8-ohv.js:2344` | `[0, 15, 290]` | `explode.offsets['front-drive']` |
| `v8-ohv.js:2654` | `[-290, 95, 0]` / `[290, 95, 0]` | `explode.offsets[\`exhaust-${bank}\`]` |
| `v8-ohv.js:2782` | `[0, 310, -250]` | `explode.offsets.turbo` |
| `v8-ohv.js:3167` | `[0, 340, 40]` | `explode.offsets.intake` |
| `v8-ohv.js:3347` | `[-230, 260, -90]` | `explode.offsets.egr` |
| `v8-ohv.js:3480` | `[0, 220, 110]` | `explode.offsets.fuel` |
| `v8-ohv.js:630` | `135` | `layout.banks` bank R `axisDeg` via `CRANK_REFERENCE_DEG` |
| `v8-ohv-kinematics.js:99` | `135` | `layout.banks` bank R `axisDeg` via `CRANK_REFERENCE_DEG` |
| `tests/kinematics.test.mjs:143` | `LLY.peakTorqueRpm` | `ratings.calibrations[key].peakTorqueRpm` |
| `tests/kinematics.test.mjs:144` | `LLY.peakHpRpm` | `ratings.calibrations[key].peakPowerRpm` |

`CRANK_REFERENCE_DEG` is added at `v8-ohv-kinematics.js:54`; the two 135 expressions use it. The other 135 literals in `v8-ohv.js` stay as dimensions.

The calibration fields are not added to `CALIBRATIONS`; the test reads the entry. The test lines changed only their input values. Expected values, tolerances and messages are unchanged, and line 145 still uses `LLY.redlineRpm`.

### PART_IDS

`export const PART_IDS` is added at `v8-ohv.js:4324`. It has 33 static IDs plus 16 generated IDs from `CYLINDERS.flatMap((c) => [\`piston-${c.number}\`, \`rod-${c.number}\`])`:

`block`, `crank`, `flywheel`, `main-caps`, `camshaft`, `timing-gears`, `cylinder-head-right`, `cylinder-head-left`, `valves`, `lifters`, `pushrods`, `rockers`, `valve-bridges`, `valve-covers`, `injectors`, `glow-plugs`, `oil-pan`, `oil-filter`, `front-drive`, `exhaust-manifold-right`, `exhaust-manifold-left`, `turbo`, `up-pipes`, `intake-manifold`, `charge-pipes`, `egr`, `cp3`, `fuel-rails`, `high-pressure-lines`, `starter-motor`, `wiring-harness`, `exhaust-downpipe`, `engine-mounts`, plus `piston-1`…`piston-8` and `rod-1`…`rod-8`.

**Total: 49.**

### Browser part check from the previous run

The one-off Vite/Chrome QA check returned:

```text
parts length 49
PART_IDS length 49
equal true
only parts []
only PART_IDS []
```

The temp script was deleted.

### Left as dimensions

These code literals equal a layout or valve-timing value but are geometry, placement, angle or unit-conversion literals. They were not changed.

| Value | Lines | Why it stays |
| ---: | --- | --- |
| 196 | `v8-ohv.js:2231`, `3249` | Oil-filter Y and intake box width; dimensions |
| 66 | `v8-ohv.js:657`, `1043`, `1044`, `1977` (twice), `1995`, `2310`, `2361`, `2386`, `2838`, `2858`, `3001`, `3425`, `3500`, `3631`, `3830`, `3977` | Cap/cover/plate positions and widths; dimensions |
| 30 | `v8-ohv.js:486`, `535`, `561`, `638`, `659`, `675`, `788`, `854`, `874`, `924`, `1157`, `1158`, `2012`, `2167`, `2217`, `2449`, `2874`, `2986`, `3028`, `3220`, `3227`, `3292`, `3308`, `3313`, `3392` (twice), `3498`, `3505`, `3850`, `3874`, `3976`, `4069`; `v8-ohv-kinematics.js:166` (twice) | Radii, thicknesses, paddings, positions and the post-TDC cycle divisor |
| 45 | `v8-ohv.js:535`, `879`, `1225` (twice), `1485`, `2278` (twice), `2405`, `2654` (twice), `2926`, `3844` | Bank/head rotations, radii and positions |
| 135 | `v8-ohv.js:3288`, `3936` | Bank-side X positions; explicitly left as dimensions |
| 270 | `v8-ohv.js:480`, `1464` (twice), `3452`, `3934` | Hardware positions and angles |
| 230 | `v8-ohv.js:2049`, `2166`, `2184`, `3704`, `3846`, `3873` | Box widths, paddings and positions |
| 224 | `v8-ohv.js:2298`, `3617`, `3630` | Oil-filter X and line endpoints |
| 90 | `v8-ohv.js:1270`, `2118`, `2359`, `2934`, `3104`, `3877`, `3890`, `3964`, `4057` | Positions, angles and sizes |
| 180 | `v8-ohv.js:1105`, `3873` | Radian/degree conversion and a position |
| 360 | `v8-ohv.js:1105` | Radian/degree conversion |
| 540 | `v8-ohv.js:1952` | Cover-shell length |
| 450, 10.9, 10.4, 630 | no code hits | No matching literals in the family files |

### Checks

Before:
```text
Names: FAIL (110 matches in 71 lines)
Numbers: FAIL (22 matches in 17 lines)
Provenance: PASS (210 values, 62 records)
```

After:
```text
Names: FAIL (110 matches in 71 lines)
Numbers: FAIL (22 matches in 17 lines)
Encoding: PASS
IDs: PASS
Provenance: PASS (210 values, 62 records)
Result: FAIL (2 of 5 checks failed: Names, Numbers)
```

These files are outside the scan, so the counts did not move. `npm run check` exits 1 on the expected Names and Numbers failures.

### Acceptance

- `npm test`: 171 tests, 33 suites, 171 passed, 0 failed (343.8956 ms).
- `npm run baseline:compare`: Trace PASS, Geometry PASS; all six views 0 changed (>8). Home had one sub-threshold pixel with delta 1; the other five were 0/0.
- `npm run build`: passed, 41 modules, 548 ms; CSS 34.94 kB, JS 1,299.94 kB.
- Baseline hashes unchanged: curves `76E383E8A1D62A813004D37418DD299181EAC1D7483C2C602E5ABE366C495938`, trace `CC8FCFCF6DC7CD509BEAB452CFC50A94B7374DEBFCA6BED14D54A5ED6A0C440C`, geometry `9F387EAFDDEEB79C41F2288F12DB7661B9826EA6E41DA213C472215F27281D51`.
- Entry hash unchanged: `1E5A75E5FE60960305F79C96CC47909C47B5A0A95C479062317BE2CFDAB18A68`.
- `git grep --untracked -n -E "peakTorqueRpm|peakPowerRpm"` also matches `v8-ohv-kinematics.js:18` (the existing LLY `peakTorqueRpm`) and `:19` (the existing LLY `peakHpRpm`, whose value reads `lly.ratings.peakPowerRpm`). The calibration objects have no peak fields; the test lines 143 and 144 read the entry.

### Stop and resolution

The first 2.3c run added `peakTorqueRpm` and `peakPowerRpm` to both `CALIBRATIONS` entries. That changed `captureNumericBaseline()`, which serializes `CALIBRATIONS`, and `tests/baseline.test.mjs` failed with the two extra fields on each calibration. The baseline file was not edited.

Resolution: keep the numeric baseline unchanged. `CALIBRATIONS` returned to the seven fields; `tests/kinematics.test.mjs` reads each calibration's own peak speeds from `lly.ratings.calibrations[key]`. The test count returned to 171, and the numeric baseline passed.

Quick parts are left for 2.4; the family does not use them, and the `valvetrain` alias in `main.js` was not changed.

No commit, tag or push was made, and 2.3d was not started.

## 2026-11-03 · 2.3d Colours, decal specs and two layout values

Files: `src/engines/families/v8-ohv.js` and `docs/build-log.md`. The entry, baselines, core, main, index and styles were not changed.

### 11 colour replacements

| Old value | Entry path |
| --- | --- |
| `0x2c312e` | `look.palette.block` |
| `0x202422` | `look.palette.blockDark` |
| `0xb2b8b3` | `look.palette.head` |
| `0x1a1f1c` | `look.palette.cover` |
| `0x5b5e59` | `look.palette.liner` |
| `0xff9b45` | `look.effects.combustionGlow` |
| `0xffb24f` | `look.effects.injectorGlow` |
| `0x1b4d70` | `look.palette.oilFilterCap` |
| `0x888f8a` | `look.palette.frontCover` |
| `0x252b28` | `look.palette.turboScreen` |
| `0x919792` | `look.palette.intake` |

The surrounding material and `setHex` calls are unchanged.

### 41 decal replacements

The inline object at each line was deep-equal to the named entry spec before replacement, including font, colour and `small`.

| Line | Entry path |
| ---: | --- |
| 547 | `look.decals.block[0]` |
| 548 | `look.decals.block[1]` |
| 558 | `look.decals.serialPlate[0]` |
| 559 | `look.decals.serialPlate[1]` |
| 742 | `look.decals.timingCover[0]` |
| 1432 | `look.decals.head[0]` |
| 1860 | `look.decals.injectors[0]` |
| 1861 | `look.decals.injectors[1]` |
| 2010 | `look.decals.valveCover[0]` |
| 2011 | `look.decals.valveCover[1]` |
| 2134 | `look.decals.coverCaution[0]` |
| 2135 | `look.decals.coverCaution[1]` |
| 2215 | `look.decals.oilPan[0]` |
| 2216 | `look.decals.oilPan[1]` |
| 2261 | `look.decals.oilFilter[0]` |
| 2262 | `look.decals.oilFilter[1]` |
| 2263 | `look.decals.oilFilter[2]` |
| 2333 | `look.decals.oilFilterPlate[0]` |
| 2334 | `look.decals.oilFilterPlate[1]` |
| 2516 | `look.decals.alternator[0]` |
| 2612 | `look.decals.exhaustManifold[0]` |
| 2613 | `look.decals.exhaustManifold[1]` |
| 2763 | `look.decals.exhaustShield[0]` |
| 2764 | `look.decals.exhaustShield[1]` |
| 2826 | `look.decals.turboPlaque[0]` |
| 2827 | `look.decals.turboPlaque[1]` |
| 3042 | `look.decals.turboIdPlate[0]` |
| 3043 | `look.decals.turboIdPlate[1]` |
| 3050 | `look.decals.turboBosch[0]` |
| 3259 | `look.decals.intake[0]` |
| 3260 | `look.decals.intake[1]` |
| 3335 | `look.decals.chargePipe[0]` |
| 3336 | `look.decals.chargePipe[1]` |
| 3408 | `look.decals.egr[0]` |
| 3465 | `look.decals.egrCooler[0]` |
| 3466 | `look.decals.egrCooler[1]` |
| 3553 | `look.decals.cp3[0]` |
| 3554 | `look.decals.cp3[1]` |
| 3573 | `look.decals.cp3Top[0]` |
| 3703 | `look.decals.fuelRail[0]` |
| 3704 | `look.decals.fuelRail[1]` |

`git grep --untracked -n "text: '" -- src/engines/families/v8-ohv.js` returns nothing.

### Two layout changes

- Head and exhaust bank rotations:
  - Old: `const rotation = (bank === 'R' ? 45 : -45) * DEG;` at the head and exhaust loops.
  - New: `const bankRotation = lly.layout.banks.find((bankSpec) => bankSpec.id === bank).rotationDeg;` then `const rotation = bankRotation * DEG;`
- Crank web:
  - Old: `web.position.z = side * 66;`
  - New: `web.position.z = STATION_Z[side > 0 ? 1 : 2];`

The 2.3c audit listed `45` / `-45` and `66` as dimensions. That was wrong: they are the bank rotations and the station-1/2 offset. They now read from the entry / `STATION_Z`.

The other layout-value-like literals remain dimensions for the same reasons recorded in 2.3c; the 450/10.9/10.4/630 values have no code hits.

### Check counts

Before:
```text
Names: FAIL (110 matches in 71 lines)
Numbers: FAIL (22 matches in 17 lines)
Provenance: PASS (210 values, 62 records)
```

After:
```text
Names: FAIL (110 matches in 71 lines)
Numbers: FAIL (22 matches in 17 lines)
Encoding: PASS
IDs: PASS
Provenance: PASS (210 values, 62 records)
Result: FAIL (2 of 5 checks failed: Names, Numbers)
```

The family is outside the scan, so the counts are unchanged.

### Acceptance

- `npm test`: 171 tests, 33 suites, 171 passed, 0 failed (346.3697 ms).
- `npm run baseline:compare`: Trace PASS, Geometry PASS; all six views 0 changed (>8). Home had one sub-threshold pixel with delta 1 on both runs; cutaway had one such pixel on the first run and 0 on the rerun. No view changed above threshold.
- `npm run build`: passed, 41 modules, 554 ms; CSS 34.94 kB, JS 1,298.15 kB.
- Baseline hashes unchanged: curves `76E383E8A1D62A813004D37418DD299181EAC1D7483C2C602E5ABE366C495938`, trace `CC8FCFCF6DC7CD509BEAB452CFC50A94B7374DEBFCA6BED14D54A5ED6A0C440C`, geometry `9F387EAFDDEEB79C41F2288F12DB7661B9826EA6E41DA213C472215F27281D51`.
- Entry hash unchanged: `1E5A75E5FE60960305F79C96CC47909C47B5A0A95C479062317BE2CFDAB18A68`.

### Static check discrepancy

`git grep --untracked -n -E "0x[0-9a-fA-F]{6}" -- src/engines/families/` returns nothing. The combined check including `setHex\(` returns seven hits because `setHex` is the surrounding Color API, not a colour literal:

```text
v8-ohv.js:100,103,106,109,116,2349,3173: color.setHex(lly.look.palette...)
```

The literal-only replacement cannot also remove `setHex` without changing the API to `color.set(...)`. That method change was not made because the package says to keep the surrounding code unchanged. This is the only acceptance discrepancy.

### Left for 2.3e

- `headLabel` at `v8-ohv.js:1260` / `:1433`.
- `bankText` at `:2044` / `:2047`.
- Passenger/driver text at `:2048`.
- Dynamic `MAIN` numbering at `:1060`.
- `idText` valve index at `:1175` / `:1177`.
- I/E rocker text at `:1608`.

Quick parts are left for 2.4. No entry value changed. No commit, tag or push was made, and 2.3e was not started.

## 2026-11-04 · 2.3e Bank labels and label styles from the entry

Files: `src/engines/lly/index.js`, `src/engines/families/v8-ohv.js` and `docs/build-log.md`. The values were copied from the family code, not the package list. A Node comparison confirmed every entry string, font, colour and `small` flag matched the code before replacement.

### Entry additions

`look.bankLabels`:

| Key | Code value copied |
| --- | --- |
| `head.R` | `text: 'RIGHT BANK · 1-3-5-7'`, `font: '600 34px Bahnschrift, Arial'`, `color: '#52534e'`, `small: true` |
| `head.L` | `text: 'LEFT BANK · 2-4-6-8'`, same style |
| `bank.R` | `text: 'BANK R  ·  1-3-5-7'`, `font: '700 75px Bahnschrift, Arial'`, `color: '#1c211e'` |
| `bank.L` | `text: 'BANK L  ·  2-4-6-8'`, same style |
| `side.R` | `text: 'PASSENGER BANK'`, `font: '500 28px Bahnschrift, Arial'`, `color: '#82521a'`, `small: true` |
| `side.L` | `text: 'DRIVER BANK'`, same style |

`look.labelStyles`:

| Key | Code value copied |
| --- | --- |
| `capNumeral` | `font: '700 98px Bahnschrift, Arial'`, `color: '#b5aa8a'` |
| `valveIndex` | `font: '700 88px Bahnschrift, Arial'`, `color: '#d9d3bb'` |
| `rockerMark` | `font: '800 96px Bahnschrift, Arial'`, `color: '#2e312e'` |

The two objects sit after `look.decals` and before the look block closes.

### Code sites changed

- Deleted `const headLabel = bank === 'R' ? 'RIGHT BANK · 1-3-5-7' : 'LEFT BANK · 2-4-6-8';`.
- `v8-ohv.js:1432` (was 1433): `{ text: headLabel, font: '600 34px Bahnschrift, Arial', color: '#52534e', small: true }` → `lly.look.bankLabels.head[bank]`.
- Deleted `const bankText = bank === 'R' ? 'BANK R  ·  1-3-5-7' : 'BANK L  ·  2-4-6-8';`.
- `v8-ohv.js:2045` (was 2047): `{ text: bankText, font: '700 75px Bahnschrift, Arial', color: '#1c211e' }` → `lly.look.bankLabels.bank[bank]`.
- `v8-ohv.js:2046` (was 2048): `{ text: bank === 'R' ? 'PASSENGER BANK' : 'DRIVER BANK', font: '500 28px Bahnschrift, Arial', color: '#82521a', small: true }` → `lly.look.bankLabels.side[bank]`.
- `v8-ohv.js:1060`: `[{ text: \`MAIN 0${i + 1}\`, font: '700 98px Bahnschrift, Arial', color: '#b5aa8a' }]` → `[{ ...lly.look.labelStyles.capNumeral, text: \`MAIN 0${i + 1}\` }]`.
- `v8-ohv.js:1177`: `[{ text: idText, font: '700 88px Bahnschrift, Arial', color: '#d9d3bb' }]` → `[{ ...lly.look.labelStyles.valveIndex, text: idText }]`.
- `v8-ohv.js:1607` (was 1608): `[{ text: typeIsIntake ? 'I' : 'E', font: '800 96px Bahnschrift, Arial', color: '#2e312e' }]` → `[{ ...lly.look.labelStyles.rockerMark, text: typeIsIntake ? 'I' : 'E' }]`.

`bank` is in scope at both bank-label sites. `headLabel` and `bankText` had no other uses. `makeLabelTexture` only reads its entries.

`git grep --untracked -n -E "headLabel|bankText|PASSENGER|DRIVER BANK" -- src/engines/families/v8-ohv.js` returns nothing.

### Three formatting-only text sites

`git grep --untracked -n -E "text: [^']" -- src/engines/families/v8-ohv.js` shows only:

```text
1060: [{ ...lly.look.labelStyles.capNumeral, text: `MAIN 0${i + 1}` }]
1177: [{ ...lly.look.labelStyles.valveIndex, text: idText }]
1607: [{ ...lly.look.labelStyles.rockerMark, text: typeIsIntake ? 'I' : 'E' }]
```

The numbering format, `idText` format and I/E choice stay in code.

### Check counts

Before:
```text
Names: FAIL (110 matches in 71 lines)
Numbers: FAIL (22 matches in 17 lines)
Provenance: PASS (210 values, 62 records)
```

After:
```text
Names: FAIL (110 matches in 71 lines)
Numbers: FAIL (22 matches in 17 lines)
Encoding: PASS
IDs: PASS
Provenance: PASS (210 values, 62 records)
Result: FAIL (2 of 5 checks failed: Names, Numbers)
```

The new entry values are text and booleans, so the numeric provenance count did not move.

### Acceptance

- `npm test`: 171 tests, 33 suites, 171 passed, 0 failed (348.9652 ms).
- `npm run baseline:compare`: Trace PASS, Geometry PASS; all six views 0 changed (>8). Home had one sub-threshold pixel at delta 1; the other five views were 0/0.
- `npm run build`: passed, 41 modules, 386 ms; CSS 34.94 kB, JS 1,298.60 kB.
- Baseline hashes unchanged: curves `76E383E8A1D62A813004D37418DD299181EAC1D7483C2C602E5ABE366C495938`, trace `CC8FCFCF6DC7CD509BEAB452CFC50A94B7374DEBFCA6BED14D54A5ED6A0C440C`, geometry `9F387EAFDDEEB79C41F2288F12DB7661B9826EA6E41DA213C472215F27281D51`.
- Entry hash: old `1E5A75E5FE60960305F79C96CC47909C47B5A0A95C479062317BE2CFDAB18A68`, new `5E4D8417CACF0E22AA06E40F5B2EE9AEEA749CD4E4EEC3675766429D61438E5B`.
- `git diff --no-index` of the pre-edit entry copy against the current entry shows only `bankLabels` and `labelStyles`.

`git diff HEAD -- src/engines/lly/index.js` also shows pre-existing Phase 2.2 keys (`firingAboveRpm`, `overspeedDamping`, `overspeedHeadroomRpm` and `stopped.cutoff`) that were already in the working tree before 2.3e. Those are not 2.3e changes and were left untouched.

No commit, tag or push was made, and 2.3f was not started.

## 2026-11-04 · 2.3f Turbo, vane and timing gears

Files: `src/engines/families/v8-ohv.js`, `src/main.js` and `docs/build-log.md`. The frame contract now carries `timeScale`; the model derives turbo rate and vane from `rpm` and the entry. The frame's `firing` field remains but the model does not read it.

### Parameter rename

`update(dt, state)` became `update(dt, frame)`. Ten uses on nine lines changed from `state.*` to `frame.*`; `state` no longer appears in the family.

`git grep --untracked -n -E "\bstate\b" -- src/engines/families/v8-ohv.js` returns nothing.

### Turbo and vane

Old:

```js
const rpm = frame.rpm || 0;
const turboRate = frame.turboRate ?? (3 + (rpm / 3250) * 142);
...
const vane = frame.vane ?? 0;
```

New:

```js
const rpm = frame.rpm || 0;
const turboBase = rpm > 20 ? 3.2 + (rpm / lly.ratings.redlineRpm) * 145 : 0;
const turboRate = turboBase * frame.timeScale;
...
const vane = vaneAtRpm(lly, rpm);
```

`vaneAtRpm` is imported from `../../core/telemetry.js`. The turbo-wheel loop and the actuator `lerp(-0.35, 0.75, vane / 100)` are unchanged. `frame.timeScale` has no default.

### main.js frame and QA hook

`updateSimulation` no longer computes `turboBase`. Its frame is now:

```js
{
  crankAngleDeg: s.crankAngle,
  rpm: s.rpm,
  firing,
  fuel: s.fuel,
  glow: s.glow,
  timeScale,
}
```

The old `vane` and `turboRate` fields are gone. `timeScale` was already computed for `stepRun`.

The QA hook frame removes `vane` and passes:

```js
// QA hook: the turbo stays still
timeScale: 0,
```

`turboRate` is `turboBase * frame.timeScale`, so `timeScale: 0` makes the rate zero and the turbo wheels stay still. The old `turboRate: 0` had the same effect.

`vaneAtRpm` was removed from the `main.js` telemetry import. `git grep --untracked -n -E "turboRate|turboBase|vaneAtRpm" -- src/main.js` returns nothing.

### Timing gears

Crank gear, old:

```js
crankGear.userData.partId = 'timing-gears';
if (!this.parts.has('timing-gears')) this.parts.set('timing-gears', []);
this.parts.get('timing-gears').push(crankGear);
spin.add(crankGear);
```

New:

```js
this.createPart(spin, 'timing-gears').add(crankGear);
```

Cam gear makes the same change with `camGear`. `createGear` and both `position.set(0, 0, 247)` calls stay.

`createPart` creates a `part-timing-gears` group, sets `userData.partId`, adds it to `spin`, and pushes it into the `timing-gears` part array.

### Part check

The browser QA check returned:

```text
parts length 49
PART_IDS length 49
equal true
only parts []
only PART_IDS []
timing-gears roots 2
roots [{"name":"part-timing-gears","partId":"timing-gears"},{"name":"part-timing-gears","partId":"timing-gears"}]
roots valid true
```

The one-off Vite/Chrome script was deleted.

### Check counts

Before:
```text
Names: FAIL (110 matches in 71 lines)
Numbers: FAIL (22 matches in 17 lines)
Provenance: PASS (210 values, 62 records)
```

After:
```text
Names: FAIL (108 matches in 69 lines)
Numbers: FAIL (22 matches in 17 lines)
Encoding: PASS
IDs: PASS
Provenance: PASS (210 values, 62 records)
Result: FAIL (2 of 5 checks failed: Names, Numbers)
```

The 110/71 expectation did not hold. Removing the two `vaneAtRpm(lly, …)` frame lines removed two `lly` name matches on two lines. The counts were not padded artificially.

### Acceptance

- `npm test`: 171 tests, 33 suites, 171 passed, 0 failed (342.5563 ms).
- `npm run baseline:compare`: Trace PASS, Geometry PASS; trace turbo angles and vane values match exactly at 1x and 0.12x. All six views 0 changed (>8); home had one sub-threshold pixel at delta 1.
- `npm run build`: passed, 41 modules, 537 ms; CSS 34.94 kB, JS 1,298.35 kB.
- Baseline hashes unchanged: curves `76E383E8A1D62A813004D37418DD299181EAC1D7483C2C602E5ABE366C495938`, trace `CC8FCFCF6DC7CD509BEAB452CFC50A94B7374DEBFCA6BED14D54A5ED6A0C440C`, geometry `9F387EAFDDEEB79C41F2288F12DB7661B9826EA6E41DA213C472215F27281D51`.
- Entry hash unchanged: `5E4D8417CACF0E22AA06E40F5B2EE9AEEA749CD4E4EEC3675766429D61438E5B`.

The `firing` field stays in both frames but the model does not read it; that is left for a later cleanup.

No commit, tag or push was made, and the next package was not started.

## 2026-11-04 · 2.4a Generated controls and index.html placeholders

### Files and line counts

- `index.html` — 418 lines, 95 changed.
- `src/main.js` — 1,619 lines, 131 changed.
- `src/styles.css` — 2,622 lines, header comment only.
- `src/engines/lly/index.js` — 606 lines, 94 added.
- `src/ui/bind.js` — 114 lines, new.
- `src/ui/format.js` — 4 lines, new.
- `tests/ui-bind.test.mjs` — 56 lines, new.

### Entry

`inspect.aliases.valvetrain` now lists `camshaft`, `lifters`, `pushrods`, `rockers`, `valve-bridges` and `valves`. `inspect.quickParts` is unchanged.

A top-level `ui` block sits before `provenance` and carries:

- title, description and canvas label;
- brand HTML and brand subtitle;
- header category and title, spec strings, firing order, bank labels and cycle text;
- walk engine label;
- boost title and chart-axis strings;
- calibration button labels, tip names and the pump name `CP3.3`;
- quick-part labels;
- inspector mini-spec values;
- help eyebrow and footer;
- spec-sheet title, values and footnote.

The `ui` strings use `\u00a0` for `&nbsp;`, `\u00b7` for the middot and `\u2014` for the em dash. No `ratings.calibrations` field was added or changed. The brand title is stored as `DURAMAX<span>6600</span>` so its nested span style is preserved.

### Binding

`src/ui/format.js` exports the old `formatInt` implementation. `main.js` and `bind.js` import it.

`src/ui/bind.js` header documents:

- `data-bind="path"` for text;
- `data-bind-html="path"` for the brand markup;
- `data-bind-attr="attribute:path; ..."` for attributes.

Pure helpers:

- `presetRows(entry)` returns `{ rpm, label, toast }` from `ratings.presets`.
- `presetByRpm(entry, rpm)` returns the row or `undefined`.
- `calibrationRows(entry)` returns `{ id, button, tooltip, railNote }`.
- `visibleQuickParts(entry, partIds)` expands aliases and returns `{ id, label }`.

`bindEntry` fills the bindings, sets the title and description, rebuilds the preset and calibration buttons, rebuilds quick parts, sets the default rail note, and sets the slider maximum from `ratings.redlineRpm`. It runs once before `bindControls()` and `syncUI()`.

### Index and main

`index.html` keeps its ids, classes and structure, but engine-specific text is empty or neutral and bound. The preset and calibration parents keep hidden placeholders for `bindEntry` to replace. `#calRailNote` is empty, `#hoverName` is empty, and the rpm slider starts at `max="0"` before binding.

`main.js` changes:

- imports `bindEntry`, `presetByRpm`, `presetRows` and `formatInt`;
- imports `PART_IDS` from the family module;
- removes `VALVETRAIN_IDS` and uses `lly.inspect.aliases?.[id]`;
- removes the `applyPreset` names map and uses the entry toast;
- builds the digit-key list from `presetRows(lly)`;
- calls `bindEntry` once before `bindControls()`.

`src/styles.css` line 2 is now `Engine test cell interface`; no other style changed.

### Tests

New `tests/ui-bind.test.mjs` has five tests:

1. preset rows and rpms;
2. calibration labels, tooltips and load rail note;
3. all four quick parts for the real LLY part list;
4. CP3.3 hidden when `cp3` is absent;
5. valvetrain shown when any alias member is present.

`npm test`: **176 tests, 34 suites, 176 passed, 0 failed** (360.0473 ms). This is 171 existing plus 5 new.

### Commands

- `npm test`: 176/176 pass.
- `npm run check`: Names **72 matches in 53 lines**, Numbers **8 matches in 7 lines**, Encoding PASS, IDs PASS, Provenance PASS (210 values, 62 records).
- `npm run build`: **43 modules**, 242 ms; JS 1,302.92 kB, CSS 34.94 kB.
- `npm run baseline:compare`: Trace PASS, Geometry PASS; home: 0 changed (>8), 1 differs at all, largest channel delta 1 (sub-threshold, on record); the other five views: 0 differ at all.

### Check-count deviation

The expected Names count was 68/49; the actual is **72/53**. The four extra lines are the required new `lly` references:

```text
src/main.js:511  const aliasIds = lly.inspect.aliases?.[id];
src/main.js:1211 showToast(`${(presetByRpm(lly, rpm) || {}).toast || 'SPEED PRESET'}...
src/main.js:1386 const values = presetRows(lly).map((row) => row.rpm);
src/main.js:1451 bindEntry(lly, { document, partIds: PART_IDS, ...
```

The expected Numbers lines were 731, 756, 797, 967, 1002, 1511 and environment 1365. Actual:

```text
src/main.js:731, 756, 797
src/main.js:963, 998, 1507
src/environment.js:1365
```

The first three match. The last three are four lines earlier because `formatInt` moved out of `main.js` into `src/ui/format.js`. No code was padded to hit the expected numbers.

`index.html` and `src/styles.css` have no name or number matches.

### Snapshot

Before and after snapshots contain the same title, description, canvas label, body text, five presets, two calibration buttons, four quick parts, rail note and hover tag.

The only difference:

```text
$.hoverName[0].textContent: "BOSCH CP3.3" -> ""
```

That is the required removal; `main.js` sets the hover name on hover.

### Hashes

- Entry: `51F76C66071AF1C2559E595BA94D3CB5DA9CB2C2AFAB7B36B9D3A83DB8CADAFD` (old `5E4D8417CACF0E22AA06E40F5B2EE9AEEA749CD4E4EEC3675766429D61438E5B`).
- `src/ui/bind.js`: `645A5B432E7B5B8FC946D42765E282C67FB95D6163FE743CF5A2328FD1721201`.
- `src/ui/format.js`: `3EBEAD342BEFB325D53BC40E29445770F323C61CCF51AD582C60745FD6818AB0`.
- Baselines unchanged:
  - curves `76E383E8A1D62A813004D37418DD299181EAC1D7483C2C602E5ABE366C495938`;
  - trace `CC8FCFCF6DC7CD509BEAB452CFC50A94B7374DEBFCA6BED14D54A5ED6A0C440C`;
  - geometry `9F387EAFDDEEB79C41F2288F12DB7661B9826EA6E41DA213C472215F27281D51`.

### Not done

No 2.4b work started. The check-count and shifted-number-line discrepancies are reported above rather than fixed by padding. No commit, tag, push, add, reset, checkout or stash was run.

## 2026-11-04 · 2.4b Main copy and display values

### Files and line counts

- `src/engines/lly/index.js` — 641 lines.
- `src/main.js` — 1,620 lines.
- `src/ui/bind.js` — 118 lines.
- `tests/ui-bind.test.mjs` — 94 lines.
- `docs/build-log.md` — 2.4a baseline note corrected and this section added.

`index.html` and `src/styles.css` were not changed in 2.4b.

### Entry

- `ratings.defaultCalibration: 'allison'`.
- `ui.display`: `tachRedBandRpm: 3000`, `governedLabelRpm: 3200`, `adaptiveToastMs: 3200`.
- `ui.toasts.audioOnline`.
- `ui.capture`: caption, place and fileStem, including the double spaces.
- `look.outline`: base, hover and selected colours/strengths/glow/thickness.
- Provenance: `'ui.display': 'design'` and `'look.outline': 'design'`.

No existing entry value was changed.

### Binding and main

`src/ui/bind.js` exports `railFullScalePsi(entry)`, the largest calibration `maxRailPsi`.

`src/main.js` now reads:

- outline base, hover and selected values from `look.outline`;
- `ratings.defaultCalibration` for the simulation state and both dyno fallbacks;
- `ui.display.tachRedBandRpm` for the tach red band, tick class and marker;
- `RAIL_FULL_SCALE_PSI = railFullScalePsi(lly)` for the rail gauge;
- `ui.display.governedLabelRpm` for the GOVERNED label;
- `ui.display.adaptiveToastMs` for the adaptive-quality toast;
- `ui.toasts.audioOnline` for the audio-online toast;
- `ui.calibration.pump` for the rail note;
- `ui.capture.caption`, `place` and `fileStem` for capture;
- `Object.hasOwn(lly.inspect.aliases, id)` before reading an alias list.

The dyno `curveCache` now has one array per calibration key and loops RPM from 0 to `MAX_RPM` in steps of 25. The fallback uses the entry default. The rendered output and capture strings are unchanged.

### Tests

`tests/ui-bind.test.mjs` now has nine tests, adding:

1. `ui.display` values;
2. `railFullScalePsi(lly) === 26000`;
3. the outline base/hover/selected values;
4. a valid default calibration.

`npm test`: **180 tests, 34 suites, 180 passed, 0 failed** (373.902 ms).

### Commands

- `npm test`: 180/180 pass, numeric baseline included.
- `npm run check`:
  - Names: **78 matches in 69 lines**; every `main.js` match is an import or a `lly`/`LLY` identifier. Main has 49 terms in 46 lines.
  - Numbers: **2 matches in 1 line**, `src/environment.js:1365` (`3250, 3250`).
  - Encoding PASS; IDs PASS; Provenance PASS (224 values, 64 records, 0 without record).
- `npm run build`: **43 modules**, 258 ms; JS 1,304.05 kB, CSS 34.94 kB.
- `npm run baseline:compare` on this machine printed "Browser metadata mismatch; skipping pixel comparison" (Chrome 157.0.8103.39 against the stored baseline's 156.0.8078.48), so the Trace, Geometry and pixel checks did not run. The "0 differ at all" lines previously written for 2.4b were not produced by that run and are removed.
- DOM before/after snapshot: **0 differences**.

- Scratch check outside the repo: phase-0-done captured on Chrome 157, then this tree compared with the same stock scripts: Trace PASS, Geometry PASS, home 0 changed (>8) with 1 differing pixel at channel delta 1 (limit 1024) PASS; the other five views 0 differ.
- Missed in 2.4b: `src/main.js` boost bar `t.boost / 23` (around line 965) is the entry value `turbo.boostPeakPsi`. Fixed in 2.5.

### 2.4a correction

The 2.4a Commands line now reads: home 0 changed (>8), 1 differs at all, delta 1 (sub-threshold, on record); the other five views 0 differ. Nothing else in 2.4a changed.

### Hashes

- Entry: `202B182180E08B870284FBFB028AA15CA8174157E4C08F719218C51B07D62E85`.
- `src/main.js`: `8A21DAF518608DB409CE87B8BE2DA84BE9F881C3FE5E27AB70C8BA052C39BBAB`.
- `src/ui/bind.js`: `64D4E12D5B24AD80ECEEA02659AC1C479CC6BCA6A4657BE617AF88E93763F298`.
- Baselines unchanged:
  - curves `76E383E8A1D62A813004D37418DD299181EAC1D7483C2C602E5ABE366C495938`;
  - trace `CC8FCFCF6DC7CD509BEAB452CFC50A94B7374DEBFCA6BED14D54A5ED6A0C440C`;
  - geometry `9F387EAFDDEEB79C41F2288F12DB7661B9826EA6E41DA213C472215F27281D51`.

### Not done

No 2.4c work started. No commit, tag, push, add, reset, checkout or stash was run.

## 2026-11-05 · 2.5 Audio from the entry

### Files and line counts

- `src/engines/lly/index.js` — 643 lines.
- `src/audio.js` — 517 lines.
- `src/main.js` — 1,628 lines.
- `tests/helpers/fake-audio.mjs` — 189 lines.
- `tests/audio-config.test.mjs` — 31 lines, new.
- `docs/build-log.md` — 2.4b correction and this section.

`tests/audio-pulses.test.mjs` was not changed in 2.5; it uses the helper.

### Entry

The `audio` block now holds:

```js
baseToneHz: 45.3,
maxFrameS: 0.2,
firingAboveRpm: 80,
pulsesPerRev: 4,
bankCadence: true,
turboWhistle: true,
injectorKnock: true,
```

The existing `'audio': 'design'` provenance record covers both added numbers. Provenance is 226 values, 64 records, 0 without record.

### Audio config and frame

`TestCellAudio` takes one config object:

```js
{ maxRpm, baseToneHz, maxFrameS, boostPeakPsi, firingAboveRpm, pulsesPerRev, bankCadence, turboWhistle, injectorKnock }
```

`main.js` constructs it with `maxRpm: MAX_RPM`, `boostPeakPsi: lly.turbo.boostPeakPsi` and `...lly.audio`. `MAX_RPM` is still defined only in `main.js`.

`audio.js` no longer imports the entry. The firing oscillator uses `config.baseToneHz`; the bank oscillator uses exactly `config.baseToneHz / 2`; the firing gate uses `config.firingAboveRpm`; firing frequency uses `config.pulsesPerRev`; the frame limit uses `config.maxFrameS`; RPM normalisation and load use `config.maxRpm`; boost normalisation uses `config.boostPeakPsi`.

The three optional layers are gated:

- `bankCadence` sets the bank gain to zero when false.
- `turboWhistle` gates the whistle and boost-air targets.
- `injectorKnock` skips the injector pilot/main click while keeping the combustion thump.

All three are true for LLY, so the output is unchanged.

`update(dt, frame, camera)` reads only `rpm`, `fuel`, `starting`, `slowMotion`, `cutaway`, `crankAngle` and `telemetry`. `telemetry` replaces `_telemetry`.

The two removed fallbacks did not change output:

- `rail || 7050`: `railNorm` clamps every rail below 8,150 psi to the 0.15 floor, and 7,050 is in that range.
- `vane ?? 62`: `telemetryValues` always returns a vane.

Supplier names in comments are now neutral: turbo whistle, starter motor, injector knock and starter whine.

`main.js` passes the explicit frame:

```js
audio.update(dt, {
  rpm, fuel, starting, slowMotion, cutaway, crankAngle, telemetry,
}, camera);
```

`s._telemetry = telemetry` remains for the HUD. The boost bar now uses `lly.turbo.boostPeakPsi`.

### Tests

`tests/audio-config.test.mjs` has three cases:

1. firing oscillator 45.3, bank oscillator 22.65;
2. the entry audio keys and values;
3. `src/audio.js` does not import from `engines/lly`.

`npm test`: **183 tests, 35 suites, 183 passed, 0 failed** (953.5685 ms). Numeric baseline included.

### Commands

- `npm test`: 183/183 pass.
- `npm run check`:
  - Names: **69 matches in 63 lines**. Every `main.js` match is an import or a `lly`/`LLY` identifier; main has 52 terms in 48 lines.
  - Numbers: **2 matches in 1 line**, `src/environment.js:1365` (`3250, 3250`).
  - Encoding PASS; IDs PASS; Provenance PASS (226 values, 64 records, 0 without record).
- `npm run build`: **43 modules**, 407 ms; JS 1,304.57 kB, CSS 34.94 kB.
- `npm run baseline:compare`:

```text
Browser metadata mismatch; skipping pixel comparison.
  Baseline: 156.0.8078.48 / ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (8GB) (0x000064A0) Direct3D11 vs_5_0 ps_5_0, D3D11)
  Current:  157.0.8103.39 / ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (8GB) (0x000064A0) Direct3D11 vs_5_0 ps_5_0, D3D11)
```

Exit 1. Trace, Geometry and pixel checks did not run; this is not a pass. No baseline file was edited.

- DOM before/after snapshot: **0 differences**.

### 2.4b correction

The 2.4b Commands line now records the browser metadata mismatch, the scratch comparison, and the missed boost-bar value. The DOM snapshot line is unchanged.

### Hashes

- Entry: `F5EFF7466F17602C1880E4D43BCE7A5F6E81FEBAC298C04860A976D40E878362`.
- `src/audio.js`: `6CF022C38BA3247485F51E36C457E941CA57CD738E3BDEFA62BD536887E15288`.
- `src/main.js`: `D01DA106E54C92B143F6DFD710B17F272CEE8D83D65F61F5022BD2A658323347`.
- `tests/helpers/fake-audio.mjs`: `CE1F30E5FF5832FF82A359F83747D7C98FF1A68C1408FBD7B41716E0F0243B80`.
- Baselines unchanged:
  - curves `76E383E8A1D62A813004D37418DD299181EAC1D7483C2C602E5ABE366C495938`;
  - trace `CC8FCFCF6DC7CD509BEAB452CFC50A94B7374DEBFCA6BED14D54A5ED6A0C440C`;
  - geometry `9F387EAFDDEEB79C41F2288F12DB7661B9826EA6E41DA213C472215F27281D51`.

### Not done

No 2.6 work started. No commit, tag, push, add, reset, checkout or stash was run.

## 2026-11-05 · 2.6 Interim entry binding

### Files and line counts

- `src/engines/active.js` — 6 lines, new.
- `src/collision.js` — 187 lines.
- `src/specs.js` — 27 lines.
- `src/main.js` — 1,627 lines.
- `tests/audio-pulses.test.mjs` — 143 lines, comment only.
- `docs/build-log.md` — this section.

`src/environment.js`, `src/engines/families/*`, `src/engines/lly/*`, scripts and other tests were not changed.

### Binding module

`src/engines/active.js`:

```js
// The active engine for this build. Phase 3 replaces this file with the registry.
import lly from './lly/index.js';

export const entry = lly;
export { COMPONENT_CARDS, pistonCard, rodCard, engineSummary } from './lly/copy.js';
```

The file is inside `src/engines/`, so the name scan skips it.

### Renames

- `src/collision.js`: entry import replaced; four `lly.walk.*` uses became `entry.walk.*`.
- `src/specs.js`: entry and copy imports became one `active.js` import; one `lly.layout.firingOrder` became `entry.layout.firingOrder`; `CYLINDER_BY_NUMBER` still comes from the family module.
- `src/main.js`: 48 `lly` and 4 `LLY` identifiers became `entry`. This includes the two `LLY.idleRpm` uses, now `entry.ratings.idleRpm` (both 680). The family import no longer contains `LLY`.
- `window.__LLY__` and the QA hook names stay.
- `tests/audio-pulses.test.mjs` line 7 now says the frame limit is the entry's `audio.maxFrameS`.

No `entry` identifier existed in any of the three files before the change. The `LLY` export in `v8-ohv-kinematics.js` is untouched.

### Commands

- `npm test`: 183 tests, 35 suites, **183 passed, 0 failed** (384.4067 ms). Numeric baseline included.
- `npm run check`:
  - Names: **7 matches in 7 lines**, all `src/environment.js` (`DMAX`/`MORAINE`); no hit outside it.
  - Numbers: **2 matches in 1 line**, `src/environment.js:1365`.
  - Encoding PASS; IDs PASS; Provenance PASS (226 values, 64 records, 0 without record).
- `npm run build`: **44 modules**, 273 ms; JS 1,304.64 kB, CSS 34.94 kB.
- `npm run baseline:compare`:

```text
Browser metadata mismatch; skipping pixel comparison.
  Baseline: 156.0.8078.48 / ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (8GB) (0x000064A0) Direct3D11 vs_5_0 ps_5_0, D3D11)
  Current:  157.0.8103.39 / ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (8GB) (0x000064A0) Direct3D11 vs_5_0 ps_5_0, D3D11)
```

Exit 1. Trace, Geometry and pixel checks did not run; no baseline was edited.

- DOM before/after snapshot: **0 differences**.

### Hashes

- `src/engines/active.js`: `DF7B6A7A460ECBB5A155E726A3E854753008FE28047F6C814DB36250955915C7`.
- `src/collision.js`: `1DA8226D983ECBF854B0E2EDD9B9FBA6111A1843D6ABBD999AC9E1B5363F0819`.
- `src/specs.js`: `DE8772BD46817B9B835D547ACDA2EC83C1221FF7D08ECF74E8E638655609282A`.
- `src/main.js`: `5644BFDC03F40602293EA1F33F0CC3B1FE9622286E9B8B205E5119ABECE64ECC`.
- `tests/audio-pulses.test.mjs`: `1FFCD7D56A846764DA31158F9B6F8E605ECE2300C66F2423A8F765F1D91D765D`.
- Baselines unchanged:
  - curves `76E383E8A1D62A813004D37418DD299181EAC1D7483C2C602E5ABE366C495938`;
  - trace `CC8FCFCF6DC7CD509BEAB452CFC50A94B7374DEBFCA6BED14D54A5ED6A0C440C`;
  - geometry `9F387EAFDDEEB79C41F2288F12DB7661B9826EA6E41DA213C472215F27281D51`.

### Not done

No 2.7 work started. No commit, tag, push, add, reset, checkout or stash was run.

## 2026-11-05 · Baseline re-capture on Chrome 157

The Phase 2 gate needs a working official browser compare. Chrome had updated from 156.0.8078.48 to 157.0.8103.39, so `npm run baseline:compare` was skipping its trace and pixel checks. On 2026-11-05 the user approved re-capturing the baselines on Chrome 157 from `phase-0-done`.

### Procedure

- Backup of the Chrome 156 baselines, kept outside the repo: the six PNGs and `meta.json` from `.qa/baseline/`, and `lly-trace.json` and `lly-geometry.json`. The trace and geometry hashes match the values logged earlier (`CC8FCFCF…` and `9F387EAF…`).
- Capture: `git archive phase-0-done` extracted into a fresh scratch folder (its `scripts/capture-browser.mjs` and `package.json` are identical to HEAD), then `node scripts/capture-browser.mjs` there. The working tree was not used, because capturing it would record the 2.6 code rather than phase-0.
- Browser: Chrome 157.0.8103.39, renderer `ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (8GB) (0x000064A0) Direct3D11 vs_5_0 ps_5_0, D3D11)`.
- Checked before installing: all six PNGs byte-identical to the 156 set; trace and geometry values equal once the `browser` field is excluded; `meta.json` differs only in the browser version. `capture-browser.mjs` does not write `lly-curves.json`, which is unchanged.
- Installed into the repo: `.qa/baseline/` (git-ignored), and `tests/baseline/lly-trace.json` and `tests/baseline/lly-geometry.json`. Each tracked file changed on one line only, `browser.version` 156.0.8078.48 → 157.0.8103.39.

### Results

- `npm run baseline:compare` on the 2.6 tree, run 1: exit 0; Trace PASS; Geometry PASS; home 0 changed (>8), 0 differ at all; the other five views 0 differ.
- The same command, run 2, same code: Trace PASS; Geometry PASS; home 0 changed (>8), 1 differs at all, largest channel delta 1 (limit 1024) PASS; the other five views 0 differ. Exit 0.
- The home view's single delta-1 pixel appears on some runs and not others, with the same code and browser. It is well below the pixel rule (channel delta 8, at most 1024 changed pixels) and is treated as render noise. The "1 sub-threshold pixel on record" notes in the 2.4a to 2.6 sections are consistent with this.
- `npm test`: 183 tests, 0 failing, numeric baseline included.
- `npm run check`: Names 7 matches in 7 lines and Numbers 2 in 1, all in `src/environment.js`. Encoding, IDs and Provenance PASS (226 values, 64 records, 0 without record).

### Hashes after re-capture

- `tests/baseline/lly-trace.json`: `8D378864ED306C74BF08BC2F60072165E0E57E1FD397769A4BDC5957A14E9590`
- `tests/baseline/lly-geometry.json`: `C9CD7771525CD7C77823099A17087B8D06DEB3CF9C0F9455C60F9DB3A6E5074E`
- `.qa/baseline/meta.json`: `F63DDEC009B9E046513DC7CCC0239D17E2EFE0F11D7F0E2B9A0D5F69CB39FD2A`
- PNGs (bytes unchanged from the 156 set):
- `home.png`: `AAC932846AF42442E5E3B6FF8B04853C5614663DEB4D4E88409FCC229E3432B8`
- `cutaway.png`: `5701C92699897CA10AFE60872C3655621B671D5E555D998229C2E3B07CC08760`
- `exploded.png`: `D819DEE261A74876C6B2CA1E2EE55A84FB17B85AF4F681A9CDF1DBA9B016E53E`
- `cutaway-3250.png`: `1EA855577A01A1B4109F07CDEDFFFE2B7A8F49D18B81FA02E6EE3222F5148BE5`
- `exploded-3250.png`: `049091726965CF165B42EEC9A37D0102D56B44E381255C2BAA8A27BEA4DA235E`
- `walk-start.png`: `710A23B506002EB340CCEAC93A1389E6F49DEAA5C427F4706F947F85EFB8F717`
- `tests/baseline/lly-curves.json`: `76E383E8A1D62A813004D37418DD299181EAC1D7483C2C602E5ABE366C495938` (unchanged).

### Phase 2 gate status

- `npm test`: pass. Baselines: pass on Chrome 157. Check outside `src/engines/`: pass except `src/environment.js`.
- Open: the `src/environment.js` decision. Either exempt the file until Phase 3.2, which means a logged exclusion in `scripts/check.mjs`, or move the cell signage and the redline-derived gauge scale into Phase 2.
- Nothing committed. The two tracked baseline files and the 2.6 changes wait for gate approval.

## 2026-11-05 · Environment exemption and Phase 2 gate

Decision (user, 2026-11-05): exempt `src/environment.js` from the Names and Numbers checks until Phase 3.2, when the cell signage and the gauge scales move to the entry.

Changes:

- `scripts/check.mjs`: `NAME_AND_NUMBER_EXEMPTIONS` lists `src/environment.js` with `until: 'Phase 3.2'` and a reason. Names and Numbers skip the file. Encoding, IDs and Provenance still scan it. Every run prints the exemption and each hit it covers, and the scope line names it.
- `docs/engine-library-plan.md`: section 8 gains an Exemptions line, and section 11 gains open decision 4, decided 2026-11-05.

Results:

- `npm run check`: exit 0. Names PASS (0 matches; exempt: 7 matches in 7 lines in `src/environment.js`). Numbers PASS (0 matches; exempt: 2 matches in 1 line, `src/environment.js:1365`). Encoding PASS. IDs PASS. Provenance PASS (226 values, 64 records, 0 without record). Result PASS, 0 of 5 failed.
- `npm test`: 183 tests, 0 failing, numeric baseline included.
- `npm run baseline:compare` on the 2.6 tree, Chrome 157.0.8103.39, three runs (this gate and the two before it): exit 0 each. Trace PASS and Geometry PASS in every run. Home showed 0, 1 and 2 differing pixels across the runs, all at channel delta 1, so 0 changed pixels above the rule's 8 in every run. The other five views showed 0 differing pixels in every run. This variation with identical code is render noise. It replaces the earlier "1 sub-threshold pixel on record" wording.

Phase 2 gate status:

- Exit criteria from plan section 6: `npm test` passes; `npm run check` is clean outside `src/engines/`, with the logged `src/environment.js` exemption until Phase 3.2; every baseline passes on Chrome 157 after the re-capture from phase-0-done (see the re-capture section above).
- Gate approved 2026-11-05. Committed as 9194098 and tagged phase-2-done.
- Commit scope when approved: the Phase 2 work (2.1 to 2.6), the re-captured `tests/baseline/lly-trace.json` and `tests/baseline/lly-geometry.json` (browser version only), the check script change, the plan and this log. The 2.3a rename stays staged as R100 (`src/engine.js` to `src/engines/families/v8-ohv.js`).

## 2026-11-05 · 3.1 Registry, schema and loaders

Files: created `src/engines/index.js`, `src/engines/schema.js`, `tests/registry.test.mjs`; corrected one line in `docs/build-log.md`.

Commands:

- Pre-change `npm test`: 183 tests, 35 suites, 183 pass, 0 fail.
- Pre-change `npm run check`: `Result: PASS (0 of 5 checks failed)`, with the `src/environment.js` exemption listed.
- Pre-change `npm run build`: 44 modules; `dist/assets/index-BvQgN-K-.js`; the copy.js `INEFFECTIVE_DYNAMIC_IMPORT` warning printed.
- Pre-change `npm run baseline:compare`: exit 0; Trace PASS, Geometry PASS, six views PASS (home one delta-1 pixel; others 0/0).
- Post-change `npm test`: 207 tests, 37 suites, 207 pass, 0 fail, 468.4003 ms. That is 183 plus 24 new tests.
- Post-change `npm run check`: `Result: PASS (0 of 5 checks failed)`, with the `src/environment.js` exemption still listed.
- Post-change `npm run build`: 44 modules; `dist/assets/index-BvQgN-K-.js` (unchanged from step 1); the copy.js `INEFFECTIVE_DYNAMIC_IMPORT` warning still printed.
- Post-change `npm run baseline:compare`: exit 0; Trace PASS, Geometry PASS, all six views PASS (home 0 changed (>8), 1 differing pixel at delta 1; other five 0/0).
- New files: UTF-8, LF only, no BOM, ASCII.
  - `src/engines/index.js`: 75 lines, `261172A0F2CACDFC22FA3100736CF678B0EBC74A98A1DB1A757F244F58CD5AFC`.
  - `src/engines/schema.js`: 133 lines, `6BCA61F6DB01A40C3133A7C6A76A00C08BA7D4F945153816773DE8ADE9A040D6`.
  - `tests/registry.test.mjs`: 203 lines, `138EEB23088819F582E96187AC25D1B5852472D27C33BC843DDC4941FE3090EF`.

All eleven physics checks pass: family firing order matches the entry; fire intervals are 90° including the wrap; every cylinder has TDC at its fire angle within 1e-6 mm; no piston goes above TDC by more than 1e-9 mm over 0–720° in 0.5° steps; stroke is twice crank radius; cam angle is half crank modulo 360; intake and exhaust durations are inside 720° and peak at the entry lift; each calibration meets peak torque and horsepower within 0.5; audio pulses are four per revolution with bank cadence; walk clearance is finite and positive; all 49 `PART_IDS` resolve through `getSpec`, with no missing IDs.

Provenance: none. No values were added.

Judgement calls:

- `installQaHook` only sets `__ENGINE__` and `__LLY__`; the app wiring belongs to 3.3.
- `parseEngineParam` is exact and case-sensitive; an absent or empty value returns `requested: null` and no fallback.
- `validateEntry` checks no units, because the entry has no unit fields.
- `schema.js` repeats the provenance coverage rule from `scripts/check.mjs`; the duplication is recorded so a later package can make `check.mjs` import the schema helper. Source-ID and null-gap validation remain in `check.mjs`; 3.1 validates object presence and coverage only.
- `loadEngine` returns the family as well as the entry, so 3.3 can build from it.
- Curve tables count as one provenance value, matching `check.mjs`; finiteness still walks every number inside them.
- `COMPONENT_CARDS` is required to be an object; the three copy helpers are required to be functions.
- The rated-peak test uses a 0.5 tolerance: Allison horsepower computes to 310.17 against 310, and ZF is exact.

Open:

- `src/engines/active.js` still feeds `main.js`, `specs.js` and `collision.js`. `collision.js` lines 13–21 and `specs.js` line 26 read the entry into module-level constants, so they cannot follow a swap. No package covers this.
- `src/engines/families/v8-ohv.js` imports the LLY entry directly (line 23), and `buildEngine(materials)` takes no entry. No package covers this.
- The model has no `telemetry()` and no `dispose()`, though plan section 5 lists both. No package names them.
- Plan section 8 migrations have no package: `kinematics.test.mjs`, `collision.test.mjs`, `audio-pulses.test.mjs` and `tests/helpers/fake-audio.mjs`.
- The copy.js `INEFFECTIVE_DYNAMIC_IMPORT` warning stays until `src/engines/active.js` is removed.

The stale gate line was found exactly once and changed to: `- Gate approved 2026-11-05. Committed as 9194098 and tagged phase-2-done.`

## 2026-11-05 · 3.2a Split environment into cell and stand

Files: created `src/environment/cell.js` and `src/environment/stand.js`; deleted `src/environment.js`; edited `src/main.js` (import path only), `tests/fixture.test.mjs` (import path and comments only), `scripts/check.mjs` (two exemptions replacing one), and `docs/build-log.md`.

The old file's stand block, lines 729–1241, moved to `stand.js` as `buildStand(context)` and now returns `{ stand, dyno }`. The rest went to `cell.js`: lines 1–727 and 1242–1808, with the `buildStand` call inserted after the floor and before the console. The final merge calls remain at their original point in the same order. `cell.js` exports `buildCeilingFixture` and `buildEnvironment`; `stand.js` imports only Three.js and the utils it needs from `../utils.js`.

The context passes `root`, `register`, `m`, `TAU`, `addGroup`, `iBeam`, `steel`, `yellow`, `rubber`, `black` and `red`. Those are the only cell symbols the moved block reads. The console-only helpers and the original imports remain in `cell.js`.

Commands:

- Pre-change `npm test`: 207 tests, 37 suites, 207 pass, 0 fail.
- Pre-change `npm run check`: `Result: PASS (0 of 5 checks failed)`, with the `src/environment.js` exemption listed.
- Pre-change `npm run build`: 44 modules; `dist/assets/index-BvQgN-K-.js`; the copy.js warning printed.
- Pre-change `npm run baseline:compare`: exit 0; Trace PASS, Geometry PASS, all six views PASS (home one delta-1 pixel; others 0/0).
- Post-change `npm test`: 207 tests, 37 suites, 207 pass, 0 fail.
- Post-change `npm run check`: `Result: PASS (0 of 5 checks failed)`.
  - Names: 6 in `src/environment/cell.js` (lines 282, 397, 398, 431, 830, 871) and 1 in `src/environment/stand.js` (line 291).
  - Numbers: 2 in `src/environment/cell.js` (line 866).
  - Encoding PASS, IDs PASS, Provenance PASS (226 values, 64 records, 0 without record).
- Post-change `npm run build`: 45 modules; `dist/assets/index-Dseb0Pvu.js`. The file name changed because the module boundary changed; the copy.js warning still printed.
- Post-change `npm run baseline:compare`: exit 0; Trace PASS, Geometry PASS, all six views PASS with 0 changed (>8), 0 differ at all, delta 0.

Provenance: none. No values were added or changed.

Judgement calls:

- The stand context includes only symbols the moved block actually reads. `interactives` and `animated` are not passed because the block does not use them; `register` still writes into `interactives`.
- `steel`, `yellow`, `rubber`, `black` and `red` are passed as material references, so the moved block keeps the exact objects.
- `stand.js` imports its geometry helpers from `../utils.js`; `addGroup` and `iBeam` are module-level functions in `cell.js`, passed through the context to avoid a cycle.
- The original cell imports were left intact, including imports now used only by the stand, to avoid unrelated cleanup.
- One extra blank line at the call boundary was removed; no statement, value, string, font or colour changed.
- The dist bundle name changed from `index-BvQgN-K-.js` to `index-Dseb0Pvu.js` as a consequence of the new module boundary.
- The 3.1 entry gained the missing note that the rated-peak test uses 0.5 tolerance: Allison horsepower computes to 310.17 against 310, while ZF is exact.

Open: 3.2b — branding in the entry, `setBranding`, gauge fractions, stand values in the entry, and removing the exemptions. The Phase 3 gaps from 3.1 remain open: `active.js` and module-level reads in `collision.js`/`specs.js`, the family's direct entry import, missing `telemetry()`/`dispose()`, and the plan section 8 test migrations.

## 2026-11-05 · 3.2b Branding and gauges into the entry

Files: `src/engines/lly/index.js`, `src/environment/cell.js`, `src/environment/stand.js`, `src/main.js`, `scripts/check.mjs`, `docs/build-log.md`.

### Entry

Added `ui.branding` with seven strings copied from the old source: floor label, sign main/sub, console header/footer and stand badge main/sub. Added `ui.gaugeFullScale: { torque: 2500 / 3250, boost: 1, rail: 1 }`, with a comment that these are bar full scales as fractions of `ratings.redlineRpm`. Added the provenance record `'ui.gaugeFullScale': 'design'`.

### Cell

`NEUTRAL_BRANDING` and `NEUTRAL_GAUGE` are neutral, per-key fallbacks. `brandingFromEntry` and `gaugeFromEntry` merge the entry over those defaults. The floor label, wall sign, console header and footer use the current branding. The gauge bars use:

```js
rpm / (redlineRpm * gaugeFullScale.torque)
rpm / (redlineRpm * gaugeFullScale.boost)
rpm / (redlineRpm * gaugeFullScale.rail)
```

`buildEnvironment(scene, renderer, materials, entry)` now takes the entry. It returns `setBranding(entry)` in addition to the existing keys. `setBranding` rebuilds the floor, sign and badge textures through the same texture helpers used by the build, disposes the old maps, assigns the new ones, updates branding/gauge state, and redraws the console.

The comment "beneath the DMAX sign" became "beneath the sign".

### Stand

`makeStandBadgeTexture(standMain, standSub)` is exported and used by both `buildStand` and `setBranding`. `buildStand` takes `branding` from its context and returns `{ stand, dyno, badge }`, where `badge` is the badge material. No engine name remains in the file.

### Main and check

`main.js` passes `entry` as the fourth `buildEnvironment` argument. `NAME_AND_NUMBER_EXEMPTIONS` is now empty; `exemptionScope()` and `exemptionNote()` print nothing when empty, and the Scope line reads `Scope: src/ and index.html; names and numbers exclude src/engines/ only.`

### Commands

- Pre-change `npm test`: 207 tests, 37 suites, 207 pass, 0 fail.
- Pre-change `npm run check`: `Result: PASS (0 of 5 checks failed)`, with the two exemption entries listed.
- Pre-change `npm run build`: 45 modules; `dist/assets/index-Dseb0Pvu.js`; copy.js warning printed.
- Pre-change `npm run baseline:compare`: exit 0; Trace PASS, Geometry PASS, six views PASS (home one delta-1 pixel; others 0/0).
- Post-change `npm test`: 207 tests, 37 suites, 207 pass, 0 fail.
- Post-change `npm run check`:

```text
Scope: src/ and index.html; names and numbers exclude src/engines/ only.
Names: PASS (0 matches)
Numbers: PASS (0 matches)
Encoding: PASS (0 matches)
IDs: PASS (0 matches)
  Compared quoted strings against: lly, lbz, generic-i6.
Provenance: PASS (0 matches)
  lly: 229 values, 65 records, 0 without record
Result: PASS (0 of 5 checks failed)
```

- Post-change `npm run build`: 45 modules; `dist/assets/index-a5BqzR3z.js`; copy.js warning still printed. The bundle name changed.
- Post-change `npm run baseline:compare`: exit 0; Trace PASS, Geometry PASS; all six views PASS (home 0 changed (>8), 1 differing pixel at delta 1; the other five 0/0).
- `git status --short` and `git diff --stat` are recorded in the final report.

Provenance: one record, `'ui.gaugeFullScale': 'design'`, covering three values. No values were changed.

Judgement calls:

- The neutral branding uses no engine name or checked RPM number. Its values are `TEST CELL 04`, `TEST CELL`, `ENGINE TEST CELL`, `TEST CELL 04`, `TEST CELL`, `DYNO`, `HEAVY DUTY DYNO BEDPLATE`.
- Gauge fallbacks are `1, 1, 1`; entry values override per key.
- `setBranding` regenerates the floor, sign and badge textures through the same `makeFloorTexture`, `makeSignTexture` and `makeStandBadgeTexture` helpers as the build, so the two paths cannot diverge.
- Old floor/sign/badge maps are disposed before replacement. `setBranding` redraws the console at its default zero state.
- `makeStandBadgeTexture` is exported from `stand.js`; the badge material is returned so the cell can replace its map without reaching into the stand.
- The empty exemption list is represented by `const NAME_AND_NUMBER_EXEMPTIONS = [];`; no placeholder entries remain.
- The stand's engine values (mounts, pedestal, guard, flywheel and engine centre) were deliberately left in `stand.js`.

Open: the stand's engine values stay in `stand.js` until the human decides. The Phase 3 gaps from 3.1 remain open: `active.js` and module-level reads in `collision.js`/`specs.js`, the family's direct entry import, missing `telemetry()`/`dispose()`, and the plan section 8 test migrations.

## 2026-11-05 · Lead review of 3.2b

Files: none changed by the lead. The harness's 3.2b changes are in the checkpoint commit `e13290b`.

Commands, run on the 3.2b tree:
- `npm test`: 207 pass, 0 fail (`ℹ tests 207`, `ℹ pass 207`, `ℹ fail 0`).
- `npm run check`: `Result: PASS (0 of 5 checks failed)`, with `lly: 229 values, 65 records, 0 without record`.
- `npm run build`: passes; `✓ built in`. The `copy.js` INEFFECTIVE_DYNAMIC_IMPORT warning and the chunk-size warning printed, as expected.
- `npm run baseline:compare`: exit 0; Trace PASS; Geometry PASS; home 0 changed and 1 differing pixel at delta 1; the other five views 0 and 0; no console errors.
- `git ls-files --eol` on the edited tracked files: `i/lf w/lf`. The index and the working tree are both LF.
- Scratch check, outside the repo: each branding string is a quoted literal in HEAD's `src/environment.js`. The gauge divisors equal the old constants over 70,399 sample rpm values. `ui.gaugeFullScale` has the `design` provenance record.
- `git status --short` and `git diff --stat`: six tracked files changed (170 insertions, 1,822 deletions), plus the untracked 3.1 and 3.2 files. This matches the harness's report.
- SHA-256 (the first three match the harness's paste):
  - `src/environment/cell.js`: `189fdce00e297dc7ec9062ffe0c8e70f461069783f17529b444d3e8b285c09c8` (1,381 lines)
  - `src/environment/stand.js`: `b6eff40fbe63d02d8486953b05b026a81fc437629a4aa5b12ab43a4477c4f3d0` (548 lines)
  - `src/engines/lly/index.js`: `eaf77f33141856480c7e798312d569d03262045f1e764c756d9438bd03897f6a` (654 lines)
  - `src/main.js`: `c85ba34fe4715fbc83d82c02366a3f02e1dffdc7b544d20aa74ace2ec3f7f78a` (1,626 lines)
  - `scripts/check.mjs`: `4f2e898219ffcfa4728ba1f8db5c7357f0fe2dc5c2397c2555573a7ae2bc67c6` (386 lines)

Provenance: none new in this review.

Judgement calls:
- The dyno label in `stand.js` (lines 388–389: `DYNO`, and `EDDY CURRENT ABSORBER · 1,000 LB-FT`) was outside 3.2b's scope. Its rating duplicates `dyno.ratedLbFt`. It moves with the stand values in Phase 5 (D10). The Numbers rule does not match `1,000`, so the check passes.
- `cell.setBranding` has no test yet. The baseline covers the build path only. The swap (3.3d) calls it, and the browser test (3.6) should check the label text.
- A nit: `redlineRpm` falls back to 1 when no entry is passed, which pegs every gauge bar. `main.js` always passes the entry, so nothing shows it. Make the entry required in 3.3c or 3.3d.

Open:
- The family and kinematics still read the LLY module (D2; packages 3.3a and 3.3b).
- Decisions D1 to D14: `docs/mvp-plan.md`, section 7.
- Next package: 3.3a (`docs/prompts/3.3a-family-takes-entry.md`).

## 2026-11-05 · Checkpoint and handoff documents

Files created: `AGENTS.md`, `CLAUDE.md`, `docs/README.md`, `docs/handoff.md`, `docs/mvp-plan.md`, `docs/harness-notes.md`, `docs/prompts/3.3a-family-takes-entry.md`.

Files changed:
- `README.md`: rewritten for the current structure and tests. The user-facing sections are kept.
- `docs/agent-runbook.md`: rules 8 and 9 (a WIP checkpoint on request; a push only when the human names the remote); the starting-state paragraph, now marked as history; the Phase 3 package list (3.3a to 3.3d); the 4.1 note (decisions D4 to D6, and all 22 keys); a stop condition for the browser build.
- `docs/engine-library-plan.md`: the status line; the 2026-10-29 starting point marked as history, with three dead links turned into plain text that says where the code went; a phase status table; the exemption line (none since 3.2b); open decision 4 resolved; the pending decisions D1 to D14 added to section 11.
- `docs/qa-recipe.md`: line references checked against the code at the 3.2b checkpoint; the open findings re-checked by search (the pointer-lock calls are still present, and the prop collision is still open).
- `docs/build-log.md`: the review of 3.2b (above) and this entry.

Commands:
- `npm test`: 207 pass, 0 fail (the code is unchanged since the checkpoint).
- `npm run check`: PASS (229 values, 65 records, 0 without a record).
- Link check, a Node script in the scratchpad outside the repo: 154 relative links in the documents; none missing, after the fixes above.

Git: the checkpoint commit `e13290b` holds the code and the build log through 3.2b. This documentation commit follows it. No remote is configured, so nothing is pushed.

Judgement calls:
- Phase 3 is split into 3.3a to 3.3d. The reasons are in `docs/mvp-plan.md`, section 4.1.
- The MVP is defined as Phases 0 to 4 and 6 (D1), following the plan's cut line. The human confirms it.
- The 3.3a prompt was revised before it ran, for Windows PowerShell 5.1: `grep` became `Select-String`, and source edits go through a UTF-8 Node script.
- Runbook rule 7 is unchanged. The amendment that D5 needs waits for the human's decision.

Open:
- No GitHub remote (D3). Nothing has been pushed.
- Decisions D1 to D14: `docs/mvp-plan.md`, section 7; the defaults are also in `docs/handoff.md`, section 5.
- 3.3a is ready to run. 3.3b to 3.3d, 3.4 to 3.8, and the Phase 3 gate follow.

## 2026-11-05 · Remote set and first push

Files: none changed in the repository. `.git/config` gained the `origin` remote.

Commands:
- `GIT_TERMINAL_PROMPT=0 git ls-remote https://github.com/colinstephens93/duramaxsimulator.git`: exit 0, no refs. The repository was empty.
- `git grep` over the tracked files for private-key headers, GitHub and AWS token formats, `api_key`, `client_secret` and `password`: no matches (exit 1).
- `git count-objects -vH`: 194 loose objects, 1.88 MiB. The largest tracked file is `tests/baseline/lly-curves.json`, about 3.2 MB.
- `git remote add origin https://github.com/colinstephens93/duramaxsimulator.git`.
- `GIT_TERMINAL_PROMPT=0 git push -u origin master engine-library`: `[new branch] master -> master` and `[new branch] engine-library -> engine-library`.
- `GIT_TERMINAL_PROMPT=0 git push origin --tags`: new tags `phase-0-done`, `phase-0-start`, `phase-1-done` and `phase-2-done`.
- `GIT_TERMINAL_PROMPT=0 git ls-remote origin`: `HEAD` and `refs/heads/engine-library` at `801caad`; `refs/heads/master` at `864f014`; the four tags at `d9ff068`, `864f014`, `da90116` and `9194098`. These match the local refs.

Judgement calls:
- `master` was pushed as well as `engine-library`, as plan section 9 describes, so the base branch is on GitHub.
- The commits carry the git author configured on this machine, as all twelve earlier commits do. The documents do not repeat it.
- GitHub's default branch is `engine-library`, taken from the remote's HEAD. Left as it is.
- The documents name the Windows user folder (`C:\Users\colin\...`). If the repository is public, those paths could be made relative.


## 2026-11-06 · Task 1: cloud development readiness

Request: execute remaining work one task at a time, document decisions and changes, and report completion before the next task.

Files: added docs/cloud-validation.md; updated docs/prompts/3.3a-family-takes-entry.md, docs/handoff.md and docs/mvp-plan.md; appended this entry. No application, test, baseline, dependency or lockfile changes.

Commands and observed outcomes:
- git status --short: initially clean. git log --oneline -3: 910f643, 801caad, e13290b, matching the handoff.
- npm test: 207 tests, 37 suites, 207 pass, 0 fail, 0 skipped (exit 0).
- npm run check: Result: PASS (0 of 5 checks failed); 229 values, 65 records, 0 without record (exit 0).
- npm run build: 45 modules, index-a5BqzR3z.js, built successfully (exit 0); existing dynamic-import and chunk-size warnings remain.
- npm run baseline:compare: exit 1, Missing .qa/baseline. Run npm run baseline:capture first.
- Inspected capture-browser.mjs: channel chrome is required and readBrowserInfo rejects SwiftShader. Inspected compare-browser.mjs: browser version/renderer must match the original reference. Missing PNGs are therefore not the only cloud prerequisite.

Decisions: preserve the published environment and existing regression guards; no onboarding reapplication or publication. Follow the human's task-by-task cadence. Propose D15 rather than silently authorizing a reference capture or weakening a check. Existing D1/D2 and engine-data decisions retain their prior status. Record cloud instructions as an overlay so the original Windows harness remains available.

Open: D15 approval or an original Windows validation path. If approved, the next task implements and validates supplemental cloud regression support on unchanged application code, with separate references under ignored .qa/cloud/. Package 3.3a has not started. No staging, commits, tags or pushes.


## 2026-11-06 · Task 2: approved supplemental cloud regression (D15)

Authorization: the human replied "Approved" to D15 after task 1. Complete regression infrastructure only, report, then wait before package 3.3a.

Files: new scripts/cloud-baseline.mjs, scripts/cloud-regression.mjs and tests/cloud-regression.test.mjs; shared scripts/capture-browser.mjs gains explicit cloud configuration with Windows defaults preserved. Updated docs/cloud-validation.md, docs/prompts/3.3a-family-takes-entry.md, docs/handoff.md, docs/mvp-plan.md, docs/agent-runbook.md and docs/engine-library-plan.md; appended this entry. File scope was announced before implementation.

Implementation inventory:
- scripts/capture-browser.mjs: 525 lines; SHA-256 f42458b50bd358b7a898c2f95fc982fc17dbed8d6923dcdc9b2bbed59cf4c681
- scripts/cloud-baseline.mjs: 130 lines; SHA-256 de7dc2ff054d4eb100442e3d56a49a2d87371b47caf9dfb89139d45b97f3e035
- scripts/cloud-regression.mjs: 105 lines; SHA-256 8d6949c88efd413a39bb7d7b594c06d8286331b3c478fc2316795d41f9b48f32
- tests/cloud-regression.test.mjs: 75 lines; SHA-256 93b3fe06b6add2ba18870a5b82e3ffe751da60b12e69ff5d6fd308c4f89d3956

Decisions:
- Separate capture and compare commands. Capture refuses an existing reference; compare never updates it. Artifacts only under ignored .qa/cloud/. Record HEAD, application/harness/original-reference hashes, Chrome executable hash, metadata, rules and artifact hashes. Reject missing/corrupt/stale inputs, capped stages and console/page errors. Verify inputs before/after capture.
- Default Windows Chrome channel, software-renderer rejection, per-frame composition, baseline files and thresholds remain unchanged. Only explicit cloud mode selects the installed Chrome executable and permits SwiftShader.
- Initial unbatched trial captures were stopped before saving a reference: software rendering spent several minutes on the first view. Cloud uses existing QA render(count) to advance identical fixed simulation/camera steps, composing once at the end. This strategy is recorded in metadata. A real-Chrome representative test (four looped versus batched steps after camera settling) produced identical sampled state and zero differing pixels for home/cutaway. Intermediate frame rendering equivalence is not claimed.
- Exact reviewed-capture-change=OLD_SHA256:NEW_SHA256 permits only a reviewed capture-helper migration, needed for 3.3a's benchmark import/build call. Old/new hashes must match reference/current; other harness changes still fail. Log review rationale before using it. No reference rewrite.
- Original Windows trace/geometry comparisons separate only browser metadata; no measured values are normalized. Windows visual acceptance remains outstanding.

Commands and evidence:
- node --test tests/cloud-regression.test.mjs: five guard tests pass (incomplete/corrupt manifests, thresholds/errors, browser/harness/executable/originals, expected source changes and exact reviewed capture migrations).
- Final npm test: 212 tests, 37 suites, 212 pass, 0 fail, 0 skipped; original 207 plus five new tests, no existing assertion edits.
- npm run check: PASS, 0 of 5 failed; provenance 229 values, 65 records, 0 without record.
- npm run build: PASS, 45 modules, index-a5BqzR3z.js; existing dynamic-import and chunk-size warnings remain.
- node scripts/cloud-baseline.mjs capture: exit 0; .qa/cloud/reference/, unchanged application at 910f64339b6a79d53f0fcd39cb13b36c64620f4a; Chrome 157.0.8103.38, ANGLE Vulkan SwiftShader. Zero captured errors/capped stages.
- node scripts/cloud-baseline.mjs compare: exit 0; exact trace and geometry PASS; six views each 0 changed pixels, 0 differing pixels, maximum channel delta 0. Evidence: .qa/cloud/run-1793975909914-8745/comparison.json.
- Both captures' trace/geometry payloads also match the tracked Windows JSON exactly, excluding only separately reported browser metadata.
- sha256sum --check against pre-comparison reference inventory: every file unchanged. Existing-reference capture, missing-reference compare and invalid-command checks exit 1 as intended.
- Real Chrome PNG boundaries: 1,024 pixels at delta 9 pass; 1,025 at delta 9 fail; delta 8 does not count as changed; incorrect dimensions fail.
- Documentation links: 85 valid. git diff --check: pass. Protected application, original baseline/comparator, manifests and lockfile match HEAD. A sandbox blocked a Node child-process Git check before its log write; reran the Git check directly before appending this entry.

Open/next: task 2 complete; wait before 3.3a. Run cloud comparison before application edits, retain reference and review the planned capture migration explicitly. Original Windows visual acceptance and human phase gates remain outstanding. Ignored cloud artifacts are local evidence; fresh-task restoration was not tested. No staging, commits, tags, pushes, environment draft changes or publication.


## 2026-11-06 · 3.3a capture migration review (before regression comparison)

The human approved 3.3a after task 2. Applied D2's documented default: remaining LLY coupling is Phase 3 work; Phase 2's approved gate is retained. D1 and engine values are unchanged.

Compared scripts/capture-browser.mjs with its task-2 starting snapshot. The diff is exactly the planned benchmark migration: import the LLY entry in Promise.all, bind its default as lly, and pass it as buildEngine's second argument. Cloud options, fixtures, step counts, renderer rules, thresholds, assertions and other harness files are unchanged. Reviewed reference capture hash: f42458b50bd358b7a898c2f95fc982fc17dbed8d6923dcdc9b2bbed59cf4c681. Reviewed current capture hash: 6a35a9d78eb2bb2710c3c0de11fbb294a61b05e7e8377a0bcac4ca05b1ce8630. These exact hashes may be supplied to the cloud comparison; no reference refresh is authorized.

Verified src/main.js changes only the build call and all picking-test assertions remain byte-for-byte unchanged. Generic method-local lly. replacements: 73; two explicit crank-radius reads migrated. Non-arrow callback sites requiring entry capture: none. Full validation results follow in the package completion entry.


## 2026-11-06 · 3.3a complete: the V8 family takes the entry

Authorization: the human approved this next package after task 2. D2's default was adopted and recorded in the handoff, MVP plan and design decision log: remaining coupling is Phase 3 work; preserve the approved Phase 2 gate. D1 and all engine values retain their prior status. This is package completion with approved cloud validation, not a phase gate or original Windows visual sign-off.

Implementation files and final inventory:
- src/engines/families/v8-ohv.js: 4369 lines (before 4372); SHA-256 0f36a9f459aad19896f3e6b3213cbae65e520c8ad807fbe9699388620cc26b25.
- src/main.js: 1626 lines (before 1626); SHA-256 99340084f5a5f0d16cb8590ac3bb3b9a9e400de888b17183d6540fe39f977147.
- scripts/capture-browser.mjs: 526 lines (before 525); SHA-256 6a35a9d78eb2bb2710c3c0de11fbb294a61b05e7e8377a0bcac4ca05b1ce8630.
- tests/picking.test.mjs: 61 lines (before 58); SHA-256 489c100c31c3ad76b691a2cca4de49ff68940923102a4525bab2a33b04c4cbd6.

Changes:
- EngineBuilder(materials, entry) stores the required entry before material construction; buildEngine(materials, entry) forwards it. The root name uses entry.identity.sceneName.
- Removed the direct LLY import and the LLY aggregate import from the family. Migrated 73 method-local lly. reads, the redline/vane reads, and two explicit crank-radius reads to the supplied entry. No non-arrow callback needs an entry capture; all relevant callback uses retain lexical this. One original LLY valve-cover comment remains; no lly identifier or import remains.
- Removed the family export EXPLODE_CUTAWAY_FRACTION; effectiveCutaway reads entry.explode.cutawayFraction. Moved the original two-line explanatory comment to the getter.
- main.js changes one call only. capture-browser.mjs changes only the planned benchmark import/destructuring and build call relative to task 2. Its exact reviewed hashes are in the preceding review entry. No other harness code, assertion, rule or reference changed.
- Planned picking-test migration: import the LLY entry, define the local cutaway fraction and supply entry in the view helper. All describe/test/assertion bodies remain byte-for-byte unchanged. No test was added or disabled; the count remains 212.
- Maintained the handoff, MVP/design status, completed prompt/execution record and cloud workflow's link to current status. Existing tasks 1/2 edits were preserved. The temporary editing script was deleted; task-specific snapshots/logs remain outside the checkout for review.

Validation before and after (all run from /workspace/duramaxsimulator):
- npm test: 212 tests, 37 suites, 212 pass, 0 fail, 0 cancelled, 0 skipped. tests/kinematics.test.mjs passes unchanged; _prepareValveRows is unchanged and needs no entry.
- npm run check: Result: PASS (0 of 5 checks failed). Names/Numbers/Encoding/IDs 0 matches; provenance 229 values, 65 records, 0 without record.
- npm run build: PASS, 45 modules. Before index-a5BqzR3z.js (1,306.10 kB); after index-CZiDW5gl.js (1,306.83 kB, gzip 409.16 kB). Expected copy.js INEFFECTIVE_DYNAMIC_IMPORT and chunk-size warnings remain because active.js is still present.
- Pre-change cloud comparison: exit 0, .qa/cloud/run-1793977192414-11257/comparison.json; trace/geometry exact PASS, all six views 0 changed/differing pixels, max channel delta 0.
- Post-change cloud comparison: exit 0, .qa/cloud/run-1793977487566-12780/comparison.json; supplied only the exact reviewed capture migration hashes. Trace/geometry exact PASS; home, cutaway, exploded, cutaway-3250, exploded-3250 and walk-start each 0 changed pixels, 0 differing pixels, max channel delta 0. Console/page errors 0; no capped trace stages. buildEngine benchmark median 930.300 ms (informational).
- Both browser captures match the tracked Windows trace/geometry payloads exactly, with only browser metadata separately reported. Original Windows pixel comparison remains outstanding under D15; no Windows pass is claimed.
- Acceptance source scan: no lly/index or lowercase lly in the family; only LLY match is the original valve-cover comment at line 1985. All three buildEngine declarations/call sites take/pass two arguments; new EngineBuilder also receives two. The kinematics module, entry data, original baselines, manifests/lockfile and original comparator are unchanged.
- Source provenance check: only the two approved application files differ from the original reference. Capture-only task diff and unchanged picking assertions were checked against task-start snapshots. Reference-file checksums match the pre-change inventory; no capture/refresh was run.
- Documentation links: 74 valid relative Markdown links; whitespace check passes. git status shows the four package implementation files plus documented earlier cloud infrastructure and documentation; nothing staged.

Open/next: 3.3b, kinematicsFor(entry), its planned clone/regression tests and family use of that result. Prepare its prompt before coding and retain compatibility exports until 3.3d. active.js, stand separation, model.telemetry(), disposal, switching and the picker remain in their later packages. Stop here and wait for the human. No staging, commit, tag, push, baseline refresh, environment draft changes or publication.


## 2026-11-06 · 3.3b complete: kinematics take the entry

Authorization: the human approved the next package after completed 3.3a. Prepared docs/prompts/3.3b-kinematics-takes-entry.md before implementation. Preserved all logged uncommitted work. HEAD remains 910f643; no phase gate or commit was performed.

Implementation files:
- src/engines/families/v8-ohv-kinematics.js: 251 lines; SHA-256 f54c170aa0f0246718c762b7c7dbddf67a124e5a2c12f7cf8fb2c9c0329752b9.
- src/engines/families/v8-ohv.js: 4362 lines; SHA-256 3ffb3fc0b4f52b897620ea5d0bc44fae6567629a592fd428e8ae0567393e4314.
- tests/kinematics-entry.test.mjs: 116 lines; SHA-256 b071f49d380781e3ae238059f1e5c2321467065adb27d85153701a5026bd9f9f.

Documentation: created the package prompt/execution record; maintained docs/handoff.md, docs/mvp-plan.md and docs/engine-library-plan.md; appended this entry. No other application files, existing tests, capture helper/runner, engine entries, original references, dependencies or lockfiles changed in this package.

Changes and decisions:
- kinematicsFor(entry) derives specification, calibrations, layout coordinates/offsets, cylinders and maps, firing order, valve timing, dimensions/redline and bound motion/valve/firing helpers. Moved existing calculations without changing operations, event constants or numeric engine data. The specification/calibration wrappers remain frozen.
- Calibration derivation reads all entry keys, rather than assuming allison/zf, while preserving the existing seven-field compatibility shape.
- Retained all 18 original named exports from a single LLY compatibility result. Explicit entry calls always create fresh results, so changed mutable clone data is read on the next call. Only no-argument calls return that compatibility result; no custom-entry cache or new research/value was introduced.
- Actual EngineBuilder instances store their own kinematicsFor(entry) result and use it for cylinder iteration, timing, crank positions/reference/radius, redline and cylinderState calls. Replaced 13 class cylinder references, four station-position references, one crank-reference site and three cylinder-state calls; the valve-row helper uses its local instance result. Removed unused imports/duration constants. Literal family geometry and LOBE_LIFT remain unchanged.
- Two explicit temporary bridges preserve existing contracts: static PART_IDS uses the compatibility result; _prepareValveRows.call({}) falls back to it only when no instance result exists. This preserves exact cylinder identities in unchanged legacy tests. Constructed models always supply a result and never use that fallback. Documented migration of both bridges and the new tests' legacy oracle in 3.3d, before legacy exports/default result are removed. Preserve behavioral coverage during that planned migration.
- Existing tests/kinematics.test.mjs remains byte-for-byte unchanged. Five new tests cover full legacy data/return-shape compatibility; helpers over negative/multiple cycles; clone intake center and actual model valve-row phasing; clone dimensions/bank/station geometry; and non-default calibration keys/crank/firing layout. Fixture deltas are synthetic test data, not engine-value changes.

Validation (from /workspace/duramaxsimulator):
- Before npm test: 212 tests, 37 suites, all pass. After: 217 tests, 38 suites, 217 pass, 0 fail, 0 cancelled, 0 skipped. Five tests added; no old assertion edited or disabled.
- Before/after npm run check: PASS, 0 of 5 failed; 229 values, 65 records, 0 without record.
- Before/after npm run build: PASS, 45 modules. New bundle index-CDYxq_jE.js, 1,307.85 kB, gzip 409.48 kB. Existing dynamic-import and chunk-size warnings remain; active.js is still present.
- Before cloud comparison: exit 0, .qa/cloud/run-1793981595323-18044/comparison.json. After: exit 0, .qa/cloud/run-1793981999081-19760/comparison.json. Both use the unchanged exact reviewed capture migration from 3.3a; no new harness override or reference refresh.
- Cloud trace/geometry exact PASS before and after; six views each 0 changed pixels, 0 differing pixels, maximum channel delta 0. Console/page errors 0; no capped stages. After buildEngine benchmark median 802.300 ms (informational, not a performance acceptance claim).
- Original Windows trace/geometry payloads also match exactly when only browser metadata is separately reported. Original Windows visual validation remains outstanding under D15; no Windows pixel pass is claimed.
- Export inventory: every original named export retained, only kinematicsFor added. Existing kinematics tests and capture helper match task-start snapshots. Capture provenance shows only the two scoped family source files changed relative to the pre-change run; all harness hashes match.
- Reference-file checksums unchanged. Protected entry/baseline/dependency files match HEAD. Documentation link check: 71 valid relative Markdown links. git diff --check passes. Nothing staged; earlier task changes remain intact.

Open/next: 3.3c, separate per-engine stand construction from the cell. Prepare its prompt and check the file list/random-call ordering before editing; keep current stand values. Compatibility exports/default bridges and their test oracle migration remain for 3.3d. Stop here and wait for the human. No staging, commits, tags, pushes, environment draft changes or publication.


## 2026-11-06 · 3.3c complete: independent stand and cell construction

Authorization: the human approved the next package after completed 3.3b. Prepared docs/prompts/3.3c-stand-per-engine.md before code changes; preserved documented tasks 1/2 and 3.3a/3.3b. HEAD remains 910f643. No phase gate or commit was performed.

Implementation files:
- src/environment/cell.js: 1328 lines; SHA-256 b3ea28319815b03b238ed8792836933258aa48cac408c6ba61e21890892fbf57.
- src/environment/stand.js: 619 lines; SHA-256 489d24cd57996d7d17f9ee5b8acefe8ba056129c5796dd5ec96136f937c600d4.
- src/main.js: 1637 lines; SHA-256 f87082339d872ca1a89fe0fb1c3de1065023ea4d0856995a632d3218f3125a33.

Documentation: new prompt/execution record; maintained handoff, MVP/design status and this append-only log. Existing tests, engine values, collision solver, capture helper/runner, baselines, manifests and lockfiles are unchanged in this package.

Inspection/decisions:
- The actual environment export is src/environment/cell.js; src/environment.js no longer exists. The old stand builder depended on cell-owned helpers, registration, badge updates and merging.
- Corrected the plan's random-order assumption: no direct Math.random in stand.js does not imply no draws. Three.js generateUUID in constructors consumes it. Moving stand allocation after the cell would shift the dust stream, so main supplies an optional generic attach callback at the original point. Cell imports/calls no stand builder; main owns that construction and its result. There is no extra Three.js parent Group. The existing stand/dyno nodes retain their parent, order and transforms.
- Moved the unchanged addGroup/iBeam implementations into stand.js (cell retains its own addGroup). The original complete stand geometry/construction body is byte-for-byte unchanged, including all dimensions, materials, labels and driveline statements. Stand values remain the existing LLY values under D10.
- Mark stand/dyno roots dynamic before the cell merge; main invokes stand.finalize after the cell returns. finalize merges stand then dyno, idempotently. This preserves the old root/stand/dyno merge sequence and UUID draws. Normal cell-only calls omit the hook and build no stand.
- buildStand(parent, materials, entry) now owns two roots, its interactive map, badge setter/finalization and collision. Cell branding owns only cell maps/gauges; stand branding owns only its badge texture. Valid entry redline data is required in cell construction/branding, resolving the fallback-to-1 issue without changing valid-entry output.
- Moved centerRadius and dynoBox unchanged to stand.collision; guardBox derives from existing guard geometry after world transforms update. No physical dimensions were invented. Main combines cell/stand collision data and registry data in the original picking order. The unchanged walk solver continues its original dynoBox behavior; consuming guardBox is deferred to later collision integration, not silently added here.

Validation before/after (from /workspace/duramaxsimulator):
- npm test: 217 tests, 38 suites, 217 pass, 0 fail, 0 cancelled, 0 skipped. No test additions, edits, disabled checks or baseline changes. tests/fixture.test.mjs is byte-for-byte unchanged.
- npm run check: PASS, 0 of 5 failed; 229 values, 65 records, 0 without record.
- npm run build: PASS, 45 modules; new index-D_kt2FBb.js, 1,308.17 kB, gzip 409.57 kB. Existing dynamic-import and chunk-size warnings remain (active.js still present).
- Pre-change cloud comparison: exit 0, .qa/cloud/run-1793984038787-22830/comparison.json. Post-change: exit 0, .qa/cloud/run-1793984695111-25048/comparison.json. Same reviewed 3.3a capture hashes; no new harness change or reference refresh.
- Before/after cloud traces and geometry exact PASS. Six views each 0 changed pixels, 0 differing pixels and maximum channel delta 0. Zero console/page errors and no capped stages. Original Windows trace/geometry payloads also match exactly, with only browser metadata separately reported. Original Windows visual validation remains outstanding under D15. Post-change buildEngine median 788.400 ms (informational).
- Real-Chrome seeded diagnostic before/after: 8,992 seeded draws; complete draw values and UUID/other category sequence match exactly. Sequence SHA-256 923c5ede12e4f171fca1dbd505680456418ea0b9605e7aa651ee3e9feb9e3f84. All 720 dust coordinates match, SHA-256 6a499d3c478c9693f9b4102743808cae83eb88b956e5374e77023b7b6d0becea. Registry keys and cell child type/name/dynamic order also match. Diagnostics at /tmp/3-3c-before-seed.json and /tmp/3-3c-after-seed.json; helper /tmp/3-3c-seed-check.mjs observes assignments without changing draw values. Zero captured errors.
- Real-Chrome independent API check (/tmp/3-3c-api-check.mjs): cell-only build has no stand/dyno nodes or dyno collision ownership; two independent stand builds register/attach their two roots; finalization is idempotent (27 meshes stable); changed badge replaces its texture and disposes the old texture exactly once, without changing the second stand's badge; dynoBox remains [-0.8,0,-2.3] to [0.8,1.5,-1.05]; derived guardBox is nonempty and contained by the dyno geometry bounds. Cell branding callable independently. All assertions pass, zero console/page errors.
- Task-specific source-body review proves original stand construction statements and moved helpers unchanged. Capture helper is byte-for-byte unchanged. Runtime provenance confirms only cell.js, stand.js and main.js changed since the pre-check; harness hashes identical. All reference-file checksums unchanged. Documentation links: 72 valid. Whitespace check passes; nothing staged.

Open/next: 3.3d, runtime swap/picker/current-engine/QA hook. Prepare its prompt and file list before coding. Reuse existing cell.root; build and finalize each new stand, handle its two owned roots/interactive map/collision, and update both cell and stand branding. Preserve the boot attachment/finalization ordering; do not rebuild the cell on swaps. Compatibility exports/static-ID/empty-helper/test-oracle migrations remain documented in the MVP plan. Full resource disposal belongs to 3.5. Stop here and wait for the human. No staging, commits, tags, pushes, environment draft changes or publication.


## 2026-11-06 · 3.3d in progress: runtime switching, validation blocked on scope corrections

Authorization: the human approved 3.3d after 3.3c. Prepared docs/prompts/3.3d-runtime-switching.md before implementation. Earlier uncommitted work and references are preserved. This is an intermediate record, not package/phase completion.

Current implementation inventory:
- src/core/swap.js: 45 lines; SHA-256 d7eb079c1bc0e4fa03d9472ea5a21eac1c296003ecc1d37b4f2850202b733a98.
- src/main.js: 1768 lines; SHA-256 0ef22b29cf5235bd839aaf8b52e608fa90524fb6d3ffd6111047ac0a5fd836e6.
- src/audio.js: 532 lines; SHA-256 cec03bb3841e6802100749eca39db3631ce14a31618d260437e0cd1e12a558ee.
- src/collision.js: 184 lines; SHA-256 408ead11fd482716a122330711bcf9af1556da358dfdde0d7cfdc045bac08b4c.
- src/specs.js: 26 lines; SHA-256 ffc24f4c8c194975c29763a0dd349473ab8d702a290c14df92845812319d2c05.
- src/engines/families/v8-ohv.js: 4365 lines; SHA-256 fe739ee7d64c60b134c5451d090e2c56ae8cecd59f6041214c6eee89d4db4595.
- src/engines/families/v8-ohv-kinematics.js: 226 lines; SHA-256 7a390a4fcf8b241c17a56203982ab7cb1ff52c95a49c43c88da8abcbe6b0c5a6.
- index.html: 418 lines; SHA-256 8266b191063d2b86400dcdef6c5fd59f9f00fbc1db99c0c4314479b3419502de.
- tests/swap.test.mjs: 92 lines; SHA-256 e87c1fcca8ab2125faa236e55b2e84386f37040ad8d6babe54e17217f60dd74d.
- tests/helpers/legacy-kinematics.mjs: 206 lines; SHA-256 132b434c2facf882c8585801bef7e8ff142f1e0fbf88350261ad0a8cdbba595e.

Implementation and decisions:
- Registry-driven async boot reads ?engine= and keeps the original default warm-idle presentation/allocation order. One mutable current record owns id, entry, copy, family, model and stand; existing runtime aliases update together. QA names install through installQaHook and use live getters.
- Added latest-request token/swap coordinator with input lock, stop/no spin-down wait, two-frame loading paint, validated load/build, stale result rejection, synchronous commit/rollback, candidate cleanup and old-root detachment. Same-ID selection cancels pending work without rebuilding; explicit reload exercises the full pipeline. Optional disposal calls are ready for 3.5; full GPU ownership/memory acceptance is not implemented or claimed here.
- Added picker; reset rpm/crank/glow/start/fuel/targets/default calibration on commit; preserve view/slow-motion/camera mode. Rebuild tachometer, cylinder strip, curve caches, scales, registries, specs, cell/stand branding and collision world. Push a walker out using the new world; update URL only after commit. Delegate quick-part controls so rebinds do not lose handlers; prevent engine input/keyboard changes while loading. Clear failed builder attachments using the original parent-child set.
- Model.telemetry wraps entry-based telemetry. Audio configure updates supplied cylinders/tone/bank gain and resets history using the existing context. D8 default retained: audio gate 80 rpm and engine/telemetry gate 90 rpm have separate existing consumers; preserve both entry values and behavior, without a new physical claim.
- Removed active.js and all production LLY compatibility/default kinematics exports. Explicit kinematics now required. Static PART_IDS preserves standard V8 numbering 1–8 as family identifiers; actual model layout remains entry-driven. Specs read current entry/copy per call; collision builds from explicit entry values and stores hop distance in the world.
- Planned test migrations: explicit bindings in mechanical/registry tests and audio helpers, explicit collision entry/radius reads, current context for spec tests. Entry regression tests use an independent test-only oracle copied from the original pre-3.3b calculations; only import paths changed (verified exactly). Preserve numerical expectations and all clone/cadence cases. Replace the obsolete default-factory assertion with required-entry rejection; no baseline assertion or data changed.
- src/ui/bind.js needed no modification: its existing generic binder supports new metadata; main owns picker and repeat bindings. Temporary alternate-entry validation used browser route injection only; no persistent 3.4 fixture or production registry entry was added.

Observed checks:
- Pre-change npm test: 217 pass, 38 suites. Repository checks/build pass. Pre-cloud comparison exit 0: .qa/cloud/run-1794000409521-44744/comparison.json; exact traces/geometry, six views 0 differing pixels.
- Initial full test attempt after compatibility removal: 216 pass, 1 fail (before ten new tests existed). The unchanged baseline test cannot import BANK_Z_OFFSET through scripts/capture-numeric.mjs. This is an omitted importer, not changed baseline values. It remains unresolved pending scope approval; no full-suite pass is claimed.
- All thirteen unblocked test files explicitly selected afterward: 226 tests, 37 suites, 226 pass, 0 fail/cancelled/skipped. Numeric baseline test was not in this selected run, remains unchanged and unpassed. Ten new cases cover tokens, stale load/build/error, cancellation/reload, load/commit failure recovery, post-commit cleanup failure and audio reconfiguration/context preservation.
- npm run check: PASS, 0 of 5 failed, provenance 229 values/65 records/0 without record. Final scoped build: PASS, 47 modules; index-CJobjlYS.js 824.27 kB plus separate entry/copy/family chunks. The old copy.js INEFFECTIVE_DYNAMIC_IMPORT warning is gone; chunk-size warning remains.
- Real-Chrome smoke: idle 680, throttle 3249.004661257895, stop 0; WebGL and rendering pass, no page errors.
- Real-Chrome temporary alternate entry (/tmp/3-3d-browser-check.mjs): URL fallback, two picker options in the injected test registry, lock/fuel cut, changed model/current getters, old-root detachment, same cell/audio context, reset state, preserved cutaway/explode, default fixture calibration, new title/max/spec copy, delegated calibration/quick controls, failed-load recovery and explicit reload all PASS with zero console/page errors. The first helper run tried clicking quick parts while the inspector selection hid them; corrected the helper to clear selection first and assert actual visible-button behavior. No application assertion was weakened.
- Post-cloud command did not capture: ENOENT reading deleted tracked src/engines/active.js. The source-inventory implementation assumed all tracked files exist; handling intentional deletion requires the second scope correction below. No post-change trace/geometry/six-view pass is claimed.
- Reference-file checksums unchanged. Entry files, stored baseline JSON, baseline test and numeric helper match HEAD. Cloud runner hash remains the existing reference hash. Whitespace and 56 documentation links pass. No staging, commits, tags, pushes or publication.

Pending, concrete scope corrections (files untouched):
1. scripts/capture-numeric.mjs: prepared import-only binding to kinematicsFor(lly), preserving capture functions/normalization/assertions/data. Proposal /tmp/3-3d-capture-numeric-proposed.mjs; review /tmp/3-3d-numeric-migration.diff. The initial scope inspection missed this importer. Scope request was sent because AGENTS.md says to stop/report when another file is needed.
2. scripts/cloud-baseline.mjs: prepared deleted-source inventory plus an explicit OLD_SHA256:NEW_SHA256 runner review, retaining all existing reference/threshold/metadata guards. Proposal /tmp/3-3d-cloud-runner-proposed.mjs; review /tmp/3-3d-cloud-runner-migration.diff. Record deleted paths and both reviewed runner hashes; do not edit references to accept the migration. Scope request sent; no answer recorded yet.

Resume after the scope decision: apply reviewed supporting fixes only if approved, verify negative/wrong-hash refusal, run full npm test/check/build and the full approved cloud comparison, verify unchanged reference checksums, then finish package documentation. Do not start 3.4 or claim 3.3d complete before those required checks pass. Resource ownership/GPU round trips remain 3.5/3.6; original Windows/manual gates remain outstanding.


## 2026-11-06 · 3.3d supporting scope corrections approved and applied

The human replied "Approved" to the explicit request covering both prepared supporting patches. Applied the reviewed numeric import/binding migration and deleted-source inventory/explicit runner-hash review. No capture function, normalizer, baseline assertion/data, threshold or renderer rule changed.

Reviewed old runner hash: de7dc2ff054d4eb100442e3d56a49a2d87371b47caf9dfb89139d45b97f3e035. Reviewed current runner hash: 63bc7c25c8d46c78346039eb36c4234b2011d528fa2caac86173674d68947493. The existing f42458b50bd358b7a898c2f95fc982fc17dbed8d6923dcdc9b2bbed59cf4c681:6a35a9d78eb2bb2710c3c0de11fbb294a61b05e7e8377a0bcac4ca05b1ce8630 capture-helper review remains unchanged. Both exact reviews are required while using the original reference; no reference rewrite is authorized. Full validation follows.

## 2026-11-06 · 3.3d complete with cloud verification

The two explicitly approved supporting corrections resolve the intermediate blockers above. Runtime switching, picker/current bindings and live QA hooks are complete for this package. The implementation inventory above remains current. No persistent alternate engine or 3.4 fixture was added.

Final supporting-file inventory:
- scripts/capture-numeric.mjs: 134 lines; SHA-256 f60d3b8f7ccda86e55cc341918248671a450d6f0fc19f6c9bed4c1b37a4c8f62. Only imports and explicit kinematicsFor(lly) bindings changed; the entire body from const RPM_START onward matches HEAD exactly.
- scripts/cloud-baseline.mjs: 149 lines; SHA-256 63bc7c25c8d46c78346039eb36c4234b2011d528fa2caac86173674d68947493. Deleted tracked sources are recorded separately, and the exact approved old/new runner review is required without rewriting the reference. Missing review, wrong old hash and wrong new hash each refuse comparison before capture (exit 1).

Final verification:
- npm test: 227 tests, 38 suites, 227 pass, 0 failures/cancellations/skips. This includes the unchanged original numeric baseline test. Full output: /tmp/3-3d-final-tests.log.
- npm run check: all five checks pass; provenance 229 values, 65 records, 0 without a record. npm run build: passes, 47 modules; main chunk 824.27 kB, separate entry/copy/family chunks. The ineffective dynamic-import warning is gone; the size warning remains.
- Full cloud comparison with both exact reviewed capture/runner hashes: exit 0, .qa/cloud/run-1794005373739-53379/comparison.json; exact traces and geometry, six views each 0 changed/differing pixels and maximum channel delta 0. Original Windows numeric payloads match exactly, with browser metadata reported separately. No captured console errors or capped stages. buildEngine median 644.000 ms is informational. Log: /tmp/3-3d-final-cloud.log. Pre-change evidence remains .qa/cloud/run-1794000409521-44744/comparison.json.
- The real-Chrome smoke and transient alternate-entry switching/recovery checks recorded above pass. They cover actual picker/input lock, rebinding/reset, live QA aliases, retained cell/audio context, detached old roots, preserved view state, failed-load recovery and explicit reload. No persistent test fixture was added or production entry list expanded.
- Current provenance records deletedSource exactly [src/engines/active.js], omits that deleted file from source hashes and includes src/core/swap.js. Capture helper hash remains 6a35a9d78eb2bb2710c3c0de11fbb294a61b05e7e8377a0bcac4ca05b1ce8630; comparator hash remains 8d6949c88efd413a39bb7d7b594c06d8286331b3c478fc2316795d41f9b48f32. Both reviewed migrations are recorded in the comparison report. All ten reference-file checksums remain unchanged; original LLY data, numeric baseline files and baseline assertions are unchanged. No active.js or no-argument kinematics factory calls remain in application source.
- Updated the execution prompt, cloud validation instructions, MVP/design status and handoff with the completed scope, exact review command and next package. Earlier failure/scope-request records above are preserved as history.

Limits and next step: full ownership-safe GPU disposal remains 3.5, resource-count/twenty-swap acceptance remains 3.6, and original Windows visual/manual gates remain outstanding. Detachment and optional disposal calls do not establish memory acceptance. Next is 3.4, the mode-gated test-only copy of LLY; prepare its prompt before coding and preserve production/Node ENGINE_IDS. Stop here and wait for the human, following the requested one-package-at-a-time cadence. Nothing staged, committed, tagged, pushed or published; prior uncommitted work is preserved.

## 2026-11-07 · 3.4 implementation and preliminary verification

Authorization: the human approved the next package after the 3.3d completion report. Prepared docs/prompts/3.4-test-only-copy.md before coding. HEAD/status match the documented uncommitted work; nothing reset or reapplied.

Files created: tests/fixtures/engines/lly-copy/index.js, tests/fixtures/engines/lly-copy/copy.js, tests/lly-copy.test.mjs and the execution prompt. File changed: src/engines/index.js, adding only the explicit Vite test-mode ID/loader branch. Completion documentation will update handoff/MVP/design status and this append-only log. Existing tests, engine data, capture scripts, comparisons and references remain unchanged.

Decisions: use a structured clone of LLY data excluding functions/provenance, with no shared mutable objects. Keep geometry/layout/valvetrain/look/explode exactly; synthetic idle 720/redline 3500, rated torque 700/600 at 1800 and power 400/360 at 3100, rail limits 28000/24000, changed curves and labels. Calibration keys stay allison/zf; default switches to zf to expose stale default bindings. Torque knots meet each synthetic torque/power rating using the existing 5252 conversion. These are test design values, not researched engine claims. Every inherited/changed data subtree carries design provenance without source citations; production LLY/research values remain untouched. Copy retains component/part IDs and physical dimension strings but marks names/summaries/specs as synthetic and provides changed rated summaries/UI/branding.

Review correction: the first card-wrapper draft cloned the card but then reused original nested spec rows in its replacement specs array. Changed it to use the cloned rows and added an explicit row-identity assertion before final verification. No existing assertion changed. A running temporary Vite diagnostic was interrupted by HMR navigation during this final edit (execution context destroyed); rerunning against stable files, with original log retained at /tmp/3-4-browser-interrupted.log. No application regression is inferred from that tooling interruption.

Commands/results so far:
- Pre-package npm test: 227 tests/38 suites, pass 227, fail/cancelled/skipped/todo 0. npm run check: Result: PASS (0 of 5 checks failed).
- Final npm test (/tmp/3-4-tests.log): tests 234; suites 39; pass 234; fail 0; cancelled 0; skipped 0; todo 0. Seven new tests cover schema/provenance, preserved mechanics, data isolation, changed identity/ratings/defaults, evaluated curves/rated peaks, copy contracts and normal Node registry exclusion.
- npm run check (/tmp/3-4-check.log): Names/Numbers/Encoding/IDs/Provenance PASS (0 matches); lly: 229 values, 65 records, 0 without record; Result: PASS (0 of 5 checks failed).
- npm run build (/tmp/3-4-build.log): built successfully, 47 modules, same seven asset chunks plus HTML as 3.3d, including index-CJobjlYS.js 824.27 kB. Existing size warning only; no ineffective dynamic-import warning. Temporary scanner checks all eight dist files for five fixture markers (ID, identity and distinctive copy); zero matches. Normal Node and real-Chrome development registry retain only LLY, with fixture URL fallback.

Still running: stable-file real-Chrome test-mode boot/load/swap diagnostic and supplemental full cloud comparison using both existing exact reviewed hashes. No package completion claim yet. Ownership/memory and original Windows/manual acceptance remain later work.

## 2026-11-07 · 3.4 complete with cloud verification

All remaining checks from the preceding entry now pass. The temporary Chrome diagnostic was rerun against the final stable files, exiting 0. Final lines from /tmp/3-4-browser.log:

```text
Production exclusion: 8 output files, zero fixture markers.
development: registry, URL boot, picker PASS; zero console/page errors.
test: registry, URL boot, picker, lazy copy/family loading and round-trip switching PASS; zero console/page errors.
```

The test-mode fixture URL boots with the new title, slider maximum 3500 and default zf calibration. Explicit registry load supplies the fixture's spec summary and family builder; switching back to LLY and selecting the copy again succeeds, retains QA aliases and restores the copy default. This package does not add the persistent 3.6 runner or claim twenty-swap resource acceptance.

Full approved cloud command: node scripts/cloud-baseline.mjs compare --reviewed-capture-change=f42458b50bd358b7a898c2f95fc982fc17dbed8d6923dcdc9b2bbed59cf4c681:6a35a9d78eb2bb2710c3c0de11fbb294a61b05e7e8377a0bcac4ca05b1ce8630 --reviewed-runner-change=de7dc2ff054d4eb100442e3d56a49a2d87371b47caf9dfb89139d45b97f3e035:63bc7c25c8d46c78346039eb36c4234b2011d528fa2caac86173674d68947493. Exit 0; log /tmp/3-4-cloud.log. Final lines:

```text
Original Windows trace payload: exact match (platform metadata reported separately)
Original Windows geometry payload: exact match (platform metadata reported separately)
Cloud trace: exact PASS
Cloud geometry: exact PASS
home: 0 changed (>8), 0 differ, max delta 0: PASS
cutaway: 0 changed (>8), 0 differ, max delta 0: PASS
exploded: 0 changed (>8), 0 differ, max delta 0: PASS
cutaway-3250: 0 changed (>8), 0 differ, max delta 0: PASS
exploded-3250: 0 changed (>8), 0 differ, max delta 0: PASS
walk-start: 0 changed (>8), 0 differ, max delta 0: PASS
Cloud regression: PASS; evidence in .qa/cloud/run-1794009976970-59885. Original Windows acceptance remains outstanding.
```

Cloud buildEngine median 1126.400 ms is informational, measured while the independent Chrome diagnostic also ran. All ten reference files match pre-package checksums; original LLY data and stored baseline files remain unchanged. Current manifest contains the final registry hash. The final registry file, with the new five-line conditional branch removed, equals its pre-package snapshot byte-for-byte. Production chunks are identical to 3.3d; all eight output files were scanned again after the final build with zero fixture markers. No existing test was edited in 3.4.

Final file inventory (line count; SHA-256):
- src/engines/index.js: 80; a108d43b113fdac627e6f1f9eb5fea362dbb4d97d3c513e18e940490e75f764a.
- tests/fixtures/engines/lly-copy/index.js: 94; fc34f8af692cbfea68df1604ee77b7ae938f7434e562d4a5c5a91bc921d0b37e.
- tests/fixtures/engines/lly-copy/copy.js: 31; 1f4797db28a2d024ee86c8a1c39254042308c72e9dd070fed3586de923298ea2.
- tests/lly-copy.test.mjs: 94; c0638c1c2637d4d9532f8f4ee4f14c5b5cb0594537ab075d0588388528ebebc7.

Full final Node/check/build results are in the preceding entry: 234 passing tests/39 suites, zero failures/skips; all five checks pass; build passes with the pre-existing size warning. Updated docs/prompts/3.4-test-only-copy.md, docs/handoff.md, docs/mvp-plan.md and docs/engine-library-plan.md to document decisions, evidence and next package. Whitespace and relative documentation links checked before handoff.

Next: 3.5, ownership-safe disposal using D7's documented ownership-walk default; prepare its prompt first. Full memory/count acceptance remains 3.6 and original Windows visual/manual gates remain outstanding. Stop here and wait for the human. Earlier uncommitted work is preserved; nothing staged, committed, tagged, pushed or published. Environment configuration was not changed.

## 2026-11-08 · 3.5 resource ownership complete

Authorization: proceed through remaining packages sequentially; all approvals given. Earlier wait-after-each-package instructions are superseded. D7 ownership walk adopted. Added src/core/resources.js and tests/resources.test.mjs; V8 model and stand expose idempotent dispose and clear registries. Existing main/swap already call these methods for replacement/stale/failed candidates, so their callbacks needed no edit. V8 builder wrapper disposes a partially built model on build failure. Shared materials/textures, including clone-reused textures and Three.Sprite module geometry, are preserved; owned geometry/materials/textures/instance GPU state are disposed once. Texture discovery handles cycles, arrays, uniforms and live replacement maps. No engine values or visible construction statements changed.

Checks: npm test: 238 tests, 39 suites, pass 238, fail/cancelled/skipped/todo 0 (four new ownership cases). npm run check: Result PASS, 0 of 5 failed; 229 values/65 records/0 missing. npm run build passes (existing size warning). Full cloud comparison exits 0: exact traces/geometry, original Windows numeric payloads match, all six views have 0 changed/differing pixels and max delta 0. Output /tmp/3-5-cloud.log; evidence .qa/cloud/run-1794174010700-1267. Same approved capture/runner review hashes; reference not refreshed. Full GPU memory acceptance follows in 3.6.

- src/core/resources.js: 42 lines; SHA-256 073c0e207d3c27d8514eab96cd552b8bf1472217846389ef401d3e7a4aae766e.
- src/engines/families/v8-ohv.js: 4375 lines; SHA-256 962c299f679300d7cfcdfff59226d30e43ecb29a11d70cc1ca5e9b778d56f07b.
- src/environment/stand.js: 622 lines; SHA-256 ca0bd2dc9ba2b2fcc95427b6656d6b957708c6f78c769a0e3872adabf076adce.
- tests/resources.test.mjs: 43 lines; SHA-256 97bb6824b39a558187cb760917b78f3a7a3762b3aab2a3316956410c0f038867.

## 2026-11-08 · 3.6 browser runner verification

Added scripts/run-browser-tests.mjs, tests/browser/swap.browser.mjs and test:browser npm script. Vite runs in test mode on a free loopback port; installed Chrome is channel chrome by default, with explicit TEST_CHROME_PATH for this cloud executor. Browser/version/renderer, fixed 800×500 viewport, errors and counts are saved in .qa/browser/run-*.json. Deterministic QA suppresses only recurring animate rAF callbacks; native loading-paint frames and actual measured composer renders remain. Offscreen model resources are also rendered (frustum culling disabled in the test fixture) so hiding a mesh cannot conceal a leak. Production code/viewport/baselines are unchanged.

First run: all ten memory round trips passed, then smoke failed because the test selected data-calibration rather than the app's existing data-cal attribute. Corrected that test selector, required the button to exist and click, and made cutaway/explode assertions inspect preserved state (seed once, not reset before every check). Existing tests/assertions were not changed. Kept the failing report/log; reran the complete test rather than accepting the earlier count-only result.

Final TEST_CHROME_PATH=/workspace/chrome-runtime/opt/google/chrome/chrome npm run test:browser: exit 0. .qa/browser/run-1794174285965.json; log /tmp/3-6-browser.log. Ten measured round trips/twenty swaps after one warm-up round trip; every return for both entries: geometries 617, textures 91. All PART_IDS exist for both models; cutaway/explode persist; zero console/page errors. Start smoke true, preset 1600 settles to 1599.999373319061, actual calibration zf matches clicked zf. Chrome 157.0.8103.38, ANGLE SwiftShader renderer recorded explicitly (supplemental cloud evidence).

Node/check/build pass: 238 tests/39 suites/pass 238/fail/cancelled/skipped 0; all five repository checks PASS (229 values, 65 records, 0 missing). Production build passes with existing size warning. Independent cloud regression is still running; do not claim its result yet.

3.6 final cloud comparison: exit 0; exact traces/geometry, original Windows numeric payloads exact; six views 0 changed/differing pixels and max delta 0. Evidence .qa/cloud/run-1794174368971-3057; same two exact reviewed harness hashes, no reference refresh. Package 3.6 complete. Next 3.7; manual/Windows acceptance remains outstanding.
- scripts/run-browser-tests.mjs: 64 lines; SHA-256 a36b3f86abba9a1cbe392eb20438ed61f4058adc6f898885580016f59db2f1f2.
- tests/browser/swap.browser.mjs: 53 lines; SHA-256 760cbe5bd44fd73feea8397360f20fe63a59d1e289d16bca5691bd3c0a1379e3.
- package.json: 28 lines; SHA-256 22a58f4aeb7dcbd08d1978078dba22ed492e166d0befbf9cea89152ef0f3650b.

## 2026-11-08 · 3.7 prop collision implementation

Added twelve exported immutable PROP_FOOTPRINTS in cell.js, covering lamp, console/chair, chest, stool, drums, extinguisher, cones and bench. Retained all original mesh positions/construction; floor cables/decals and stand-mounted tools are not upright obstacles. Pre-merge low-height mesh bounds and circle vertex radii independently verify envelope containment in tests/browser/footprints.browser.mjs. Box3/vector work creates no UUID/random draws. collision.js consumes supplied props, preserving the existing room/dyno/console solver. Added tests/footprints.test.mjs (four tests) and updated QA recipe to mark the missing prop collision fixed. Browser runner gained explicit TEST_BROWSER_FILTER for focused diagnostics; normal invocation still discovers/runs every browser module and refuses an empty selection.

Initial new tests exposed real issues: a 0.1 m walking hop tunnels through the 0.15 m lamp post, and the stool's rounded seat measures radius 0.31126966632510245 m, outside the first 0.31 m envelope. Fixed world maxHop to be no more than half each prop radius/box thickness, and corrected stool envelope to 0.312 m. Kept collision and mesh-containment assertions intact. No prop moved and no baseline was refreshed. The console-chair is the only engine walk-circle overlap; its test exemption cites engine-library-plan section 11 item 2/D12 and remains until 6.6. All props clear the driveshaft guard.

Final focused checks: npm test: 242 tests/39 suites/pass 242/fail/cancelled/skipped 0. npm run check: all five PASS; unchanged 229 values/65 records/0 missing. Build passes (existing size warning). TEST_BROWSER_FILTER=footprints ... npm run test:browser exits 0: props 12, meshBoundsContained true, zero console/page errors. Full browser suite and full approved cloud regression are running on this final source for 3.7 verification and 3.8 acceptance; no completion claim yet.

## 2026-11-08 · 3.7 complete; 3.8 automated Phase 3 acceptance

Final full browser suite: two modules pass, .qa/browser/run-1794174695209.json; twelve mesh bounds contained, twenty measured swaps after warm-up with 617 geometries/91 textures throughout; state/parts/control smoke pass, no console/page errors. Final cloud comparison exit 0: .qa/cloud/run-1794174746752-5166/comparison.json; exact trace/geometry and original Windows numeric payloads, all six views 0 changed/differing pixels and max delta 0. Node 242/39 suites all pass; check all five PASS; production build PASS. Same final source is used for 3.7 verification and 3.8 review; no redundant repeated checks. Original supplemental reference files preserved, no refresh.

Phase 3 automated cloud acceptance is complete. Original Windows visual/manual/audio/visible FPS evidence remains outstanding and is not implied by broad development approval. No phase commit/tag/push/merge or publication. User authorized continuing; next 4.0 documented LBZ defaults, then packages 4.1/4.3, 4.2, 4.4 and 4.5 in order.
- src/environment/cell.js: 1393 lines; SHA-256 b19ad0958aadf8daf101dd358f4a877f171c724994edba173b6fb540956350d5.
- src/collision.js: 190 lines; SHA-256 257c9d3bc0bc32dc1f047eda60cebccd384b22d21733bb81257c5324676eea30.
- tests/footprints.test.mjs: 47 lines; SHA-256 5ed624edc97f328979dcdb400d45f55c50ccad27eca11fa7ba1b8043662b8aa5.
- tests/browser/footprints.browser.mjs: 16 lines; SHA-256 8655e21fcda3c6bfd6215fa35dd2e909f0f181bbb0d2d00114227fc8548e0763.
- scripts/run-browser-tests.mjs: 64 lines; SHA-256 39ff812977a3c842c7e0a0e7ab75df89de8cb6823e35d281c97b0d98373e76a9.
- docs/qa-recipe.md: 225 lines; SHA-256 e84cace1b882e526e1b1a8c37c8eaf72f887e320d53611830058c3f8c495f770.

## 2026-11-08 · 4.0 LBZ decisions complete

Under the human’s explicit all-approvals instruction, adopted documented D4–D6 defaults and recorded them in handoff/MVP/design/runbook. Rod length 163.0 mm is from family listings S13/S14 with medium confidence, not a newly researched LBZ measurement. Valve timing/lift and behavior/look/curves/UI are design values, with the missing-value rule amended for these explicit exceptions. Research files and all LLY data remain unchanged. No gate evidence is fabricated; original Windows/manual QA is still pending. Next 4.1/4.3 entry/provenance.

## 2026-11-08 · 4.1/4.3 LBZ entry and provenance complete

Created independent src/engines/lbz/index.js with all required data, no runtime LLY import. Sourced values follow research/lbz.md only; no fresh research. Rod length 163 mm uses D4 family-source/medium-confidence note; CID is derived from 6599 cc with the standard unit conversion, avoiding an unsourced copied rounded CID. D5 timing and D6 behavior/look/UI/interpolation explicitly design; table boost 30 psi marked contested. Two calibrations reach researched torque/power peaks; Kodiak rail pressure explicitly notes engine-level maximum and no separate LPD figure. Provenance passes: LBZ 229 values, 46 records, 0 missing; LLY unchanged 229/65/0. Entry SHA-256 84bb4c356584216e7ac233e32660908c313af6e8daab5b6e336a42cfaa6a85e1.

Added tests/lbz.test.mjs (three cases). First draft finite-kinematics check passed raw-entry fireAngleDeg to a normalized cylinder, which exposes fireAngle; corrected the new test to the existing factory contract. Final npm test: 245 tests/39 suites/pass 245/fail/cancelled/skipped 0. npm run check: all five PASS. LBZ is not registered yet and its copy module follows in 4.2. Existing tests and original LLY/baseline data untouched.

## 2026-11-08 · 4.2 LBZ spec copy complete

Added independent src/engines/lbz/copy.js with all family, stand and environment card IDs plus per-cylinder factories. Source-supported displacement/bore/stroke/compression, rated outputs, turbo dimensions and common-rail details are explicit. Generic construction and material descriptions are labelled illustrative; rod length carries family-source/medium-confidence limitation; no unsupported rod/piston/cooler differences. Injector copy acknowledges source conflict and research preference rather than asserting an unsupported mechanism. Direct lazy-load/part coverage check passes. Existing LLY copy is untouched; registration follows in 4.4.

## 2026-11-08 · 4.4 LBZ registration and browser smoke

Added lbz to production ENGINE_IDS and its lazy loader. Planned tests/registry.test.mjs migrations: production ID assertion now [lly,lbz], LBZ URL resolves without fallback, spec-copy assertion loops all loaded entries/family part IDs. Supporting migration in the new tests/lly-copy.test.mjs updates only its expected production IDs, preserving synthetic-ID exclusion/rejection. Added LBZ copy coverage case (246 total tests) and tests/browser/lbz.browser.mjs. LBZ entry branding now explicitly paints DMAX LBZ on cell/stand canvases; all such text is UI design data, not a new physical claim.

Node: 246 tests/39 suites, all pass, 0 fail/cancelled/skipped. Check: all five PASS, LBZ 229 values/46 records/0 missing; LLY 229/65/0. Build passes with separate lbz/lly entry and copy chunks, existing size warning only. Actual Chrome LBZ module passes: URL id lbz, model name/title LBZ, rod length 163, no missing part IDs, two observed canvas branding draws, picker includes both real IDs plus test-only copy. Idle 679.490817556943; preset 3200 settles to 3199.998959218888; Kodiak click gives calibration kodiak/torque 605; round-trip back restores allison default. Zero console/page errors to this point. Full swap suite and LLY cloud comparison still running; 4.5 acceptance not yet claimed.

## 2026-11-08 · 4.5 Phase 4 automated acceptance complete

All three browser modules pass (footprints, LBZ and twenty-swap memory suite), zero console/page errors; report is the latest .qa/browser/run-*.json from /tmp/phase4-browser.log. Counts remain 617 geometries/91 textures for every LLY/copy swap; LBZ controls/branding/start/preset/Kodiak torque and round trip pass. Node 246 tests/39 suites all pass; check all five PASS, LBZ 229/46/0 and LLY 229/65/0; build has distinct real-engine chunks and no test fixture. Final LLY cloud regression .qa/cloud/run-1794175217556-7888/comparison.json passes exact traces/geometry and six views with 0 differing pixels. Original reference untouched.

Phase 4 implementation and automated cloud checks complete. Original Windows/manual evidence remains outstanding; no code gate commit/tag/merge/publication. Continue to Phase 6 under broad approval; next copy corrections.
- src/engines/lbz/index.js: 1272 lines; SHA-256 2c162324065ef2f258f15059d524889c048f511cb5d3e450900781940aa4c91c.
- src/engines/lbz/copy.js: 52 lines; SHA-256 e909711492764746e37872fc7530dd529498079d6cb2d275fa681ac66525c72f.
- src/engines/index.js: 81 lines; SHA-256 9b26fc752451f4c99d5929dad5479e49a2656b15d65f3d542f7084dcb44c0278.
- tests/lbz.test.mjs: 50 lines; SHA-256 b5568324045db3bce2b8c0cc6fcc99b477605253a9caa6e6371daa238c2974b1.
- tests/registry.test.mjs: 204 lines; SHA-256 6f089091c59db929f552858281c0bd88d5d7a85c8ddab28bc9fc0ecd004d08a5.
- tests/lly-copy.test.mjs: 94 lines; SHA-256 4d88dcd24c3533f909f9a695aadfe9a198e80a48b1f88ddc030d31b8eb2a5068.
- tests/browser/lbz.browser.mjs: 43 lines; SHA-256 d709f321871fb393eb1f6a977780581c537e180859b7f708897dcb89522d9a5e.

## 2026-11-08 · 6.1 researched copy corrections implemented

Corrected LLY Allison label to Allison 1000 automatic, without the disputed speed count. Qualified seven-hole nozzle as 2006; marked injection stages/pump ratio, starter electrical/gear details, glow supply/element and oil-pan construction/drain illustrative or unverified. Injector actuation explicitly states the brief’s piezoelectric wording versus the research’s solenoid preference, retaining D11’s source disagreement rather than claiming certainty. LBZ copy already separates supported specs from illustrative construction. No physical engine value changed.

As predicted, full npm test is 245 pass/1 fail: only the unchanged numeric baseline string constants.CALIBRATIONS.allison.label differs (old 6-Spd Auto vs corrected automatic). This is the expressly planned Phase 6 visible-copy baseline change; no assertion was weakened and the fixture remains untouched until 6.6. Repository checks all five PASS, engine provenance counts unchanged. Continue planned hook cleanup, documentation and build checks; full baseline pass will be established at the authorized 6.6 recapture.

## 2026-11-08 · 6.2 QA hook and unused exports complete

Removed the legacy QA alias; only __ENGINE__ is installed. Planned registry test migration now checks that name and absence of the alias. Removed unused INSPECTABLE_IDS/ENGINE_SPEC_SUMMARY and HEAD_TOP/ROCKER_Y declarations/exports after source/import scan; no consumers remain. Updated QA recipe examples. scripts/capture-browser.mjs is exactly the previous file with __LLY__ token occurrences replaced by __ENGINE__, with no other body/default/fixture/assertion/renderer/threshold change. Reviewed helper old hash 6a35a9d78eb2bb2710c3c0de11fbb294a61b05e7e8377a0bcac4ca05b1ce8630; new hash 86c1c8b65055e5d9c82fd029d4dcf54f5978ad26a1745172f9a8b74a1097998f. Comparisons with the original reference still require that reference's f42458b50bd358b7a898c2f95fc982fc17dbed8d6923dcdc9b2bbed59cf4c681 as the OLD side and this actual new hash as NEW. Phase 6 re-capture will preserve the old reference separately. The known numeric-label fixture difference from 6.1 remains deferred to 6.6; no old assertion changed.

## 2026-11-08 · 6.3 documentation complete

Rewrote README around the implemented two-engine library, runtime behavior, accuracy/provenance limits, current file map and validation commands. Added docs/add-engine.md covering the 22-key entry/copy/family contract, research authority, gaps/design decisions, lazy registration, tests and manual/cloud limits. No unsupported hardware/manual completion claims. Remaining source checks continue in sequence; docs links will be checked at final acceptance.

## 2026-11-08 · 6.4 archive removal complete

Confirmed no src/tests imports of archive and no untracked files or symlinks in archive. Removed exactly 18 tracked archive files through Node, leaving the deletion unstaged to preserve the existing workflow; Git history retains them. This is the specifically planned archive deletion under broad approval, not removal of user work. Files: archive/lly_spec_sheet.md, archive/prompt_v1.md, archive/src_pre-fix_2026-10-27/audio.js, archive/src_pre-fix_2026-10-27/engine.js, archive/src_pre-fix_2026-10-27/environment.js, archive/src_pre-fix_2026-10-27/kinematics.js, archive/src_pre-fix_2026-10-27/main.js, archive/src_pre-fix_2026-10-27/specs.js, archive/src_pre-fix_2026-10-27/styles.css, archive/src_pre-fix_2026-10-27/utils.js, archive/src_pre-pulse-limit_2026-10-27/audio.js, archive/src_pre-pulse-limit_2026-10-27/engine.js, archive/src_pre-pulse-limit_2026-10-27/environment.js, archive/src_pre-pulse-limit_2026-10-27/kinematics.js, archive/src_pre-pulse-limit_2026-10-27/main.js, archive/src_pre-pulse-limit_2026-10-27/specs.js, archive/src_pre-pulse-limit_2026-10-27/styles.css, archive/src_pre-pulse-limit_2026-10-27/utils.js.

## 2026-11-08 · 6.5 production distribution check complete

Added scripts/check-dist.mjs and allowed check:dist npm script. It scans all output files for fixture markers and requires separate identity-bearing, lazy-imported engine entry chunks. The first draft expected quoted string literals; actual Vite/Rolldown uses backtick literals. Corrected the parser to recognize all three JavaScript literal quote forms, preserving identity/lazy assertions. Actual production check passes; temporary copied-output checks reject an injected fixture ID and a missing LBZ chunk, without modifying real dist. No new dependency/version.

## 2026-11-08 · 6.6 chair and numeric re-capture

Applied chair proposal: console-local (-0.9,0,0.55) → (-0.2,0,0.8). World centre (1.5889320537894807,0.14487931617337257); 0.31 m envelope nearest engine-centre distance 1.2908382240038678 m, clearing required 1.03 m by 0.2608382240038678 m. Updated footprint; removed only the planned chair overlap exemption. All other overlap/mesh-containment assertions remain; no other prop moved. Broad approval covers this reversible design choice.

Executed authorized phase-6 numeric re-capture. Parsed old/new JSON and recursively verified exactly one changed leaf: constants.CALIBRATIONS.allison.label, from Allison 1000 6-Spd Auto to Allison 1000 automatic. Every numeric/physical value is identical. The numeric writer was initially misread in escaped tool output; byte inspection proved it already writes a correct newline. It was not modified for 6.6 (only its previously approved 3.3d import migration remains). Original supplemental reference preserved. Separate phase-6 supplemental reference/comparison follows; original Windows PNG re-capture remains unavailable on this executor.

6.6 supplemental runner extension: added explicit capture-phase6 --approved-phase6-recapture and compare-phase6, using fixed separate .qa/cloud/reference-phase6. Default capture still requires unchanged source; every capture refuses an existing target. The explicitly approved Phase 6 command permits the already documented uncommitted source and records its real hashes/purpose, preserving original references. All browser/renderer/threshold/exact numeric/harness/inventory guards remain. Comparator is unchanged. Reviewed runner old hash 63bc7c25c8d46c78346039eb36c4234b2011d528fa2caac86173674d68947493, new 0cda34e27727a17fa629b19e9fd83f915ff6b61c385535c83cf9f5f04c20148b. Original reference's runner hash remains de7dc2ff054d4eb100442e3d56a49a2d87371b47caf9dfb89139d45b97f3e035; its exact migration review is still required if comparing that historical reference. Missing/wrong phase-6 approval, unknown compare option and attempted original capture all reject before capture. Every original supplemental reference checksum verified unchanged.

## 2026-11-08 · 6.8 pointer-lock rejection handling complete

D9 default adopted under broad approval. Added rejection catches/toast at only the two existing requestPointerLock calls; movement, controls and request behavior are otherwise unchanged. tests/browser/pointer-lock.browser.mjs injects rejected promises at both actual DOM call sites; focused installed-Chrome test passes with two handled attempts and zero console/page errors. Updated QA recipe status, sole-hook examples and chair/prop gap notes. Full phase-6 checks follow.

6.8 verification correction: the first focused report actually failed 1 != 2 because the runner’s 800 px viewport deliberately skips enterWalk auto-lock (it only runs above 900 px). The preceding completion wording was premature. Changed the new test viewport to 960×600 so both original paths execute, keeping the two-attempt/no-error assertion intact. Final focused run is inspected before claiming success; full suite follows. No extra production change was needed.

Final branch observation: current restored cloud checkout reports local branch work, while the requested source ref is engine-library. HEAD remains 910f643 and all documented history/work is preserved. No branch checkout/rename/reset operation was performed by this work; handoff now records the observed branch instead of repeating the old Windows branch name.

## 2026-11-08 · 6.6/6.7 final automated acceptance complete

All remaining MVP implementation packages completed sequentially under the human’s all-approvals instruction. No inline-six work was added; documented post-MVP physical/presentation changes remain outside scope.

Final commands and inspected results:
- npm test (/tmp/final-tests.log): tests 247; suites 39; pass 247; fail 0; cancelled 0; skipped 0; todo 0.
- npm run check (/tmp/final-check.log): Names/Numbers/Encoding/IDs/Provenance PASS (0 matches); LBZ 229 values/46 records/0 missing; LLY 229/65/0; Result PASS (0 of 5 checks failed).
- npm run build (/tmp/final-build.log): PASS, separate LLY/LBZ entry/copy chunks, existing size warning only. npm run check:dist (/tmp/final-dist.log): PASS, 10 output files, separate lazy identity-bearing entry chunks, fixture absent. Negative guards reject fixture contamination/missing engine chunk.
- Full TEST_CHROME_PATH=/workspace/chrome-runtime/opt/google/chrome/chrome npm run test:browser (/tmp/final-browser.log): four modules PASS, .qa/browser/run-1794175989080.json. Twelve actual mesh bounds contained, no chair exemption, LBZ URL/branding/start/preset/Kodiak calibration/torque/round trip pass; both pointer-lock promise rejection paths handled at 960×600; twenty LLY/copy swaps after warm-up at fixed 800×500 remain at 617 geometries/91 textures. Zero console/page errors.
- node scripts/cloud-baseline.mjs capture-phase6 --approved-phase6-recapture (/tmp/phase6-capture.log): exits 0, fixed separate reference-phase6 created. Duplicate capture exits 1 before capture and preserves it. Missing/wrong approval/unknown options rejected; new automated CLI guard passes.
- node scripts/cloud-baseline.mjs compare-phase6 (/tmp/final-cloud.log): exit 0; evidence .qa/cloud/run-1794176141888-12227/comparison.json. Cloud trace/geometry exact PASS; all six views 0 changed pixels (>8), 0 differing pixels, max delta 0. Original Windows trace/geometry payloads exact, metadata reported separately. No console/page errors/capped stages. buildEngine median 634.600 ms informational.

Phase-6 baseline audit: .qa/cloud/phase6-reference-audit.json. Original/new trace and geometry exact; historical image differences are intentional (chair relocation): changed pixel counts home 28642, cutaway 30161, exploded 27638, cutaway-3250 30170, exploded-3250 27649, walk-start 56028. Historical image comparisons fail their unchanged threshold as expected; they are an audit, not current acceptance. Inspected old/new home and new walk-start captures: engine/cell remain consistent, chair relocated outside engine envelope. New independent current comparisons are pixel-identical. The corrected numeric fixture has exactly one changed string label and no changed measurement.

Both original and Phase-6 reference file checksums remain intact. Reference-phase6 metadata records actual source/harness/updated numeric fixture; a harmless specs.js EOF whitespace cleanup after reference capture is separately recorded by the independent current manifest. Verified every final current source/harness/original hash against that passing manifest; no source drift since capture. Capture helper equals old source with hook-token-only substitution. Original trace/geometry JSON and research docs unchanged vs HEAD. Whitespace check passes and 145 relative documentation links resolve. Nothing staged.

Remaining evidence: original npm run baseline:compare exits 1 (/tmp/final-windows-baseline.log), Missing .qa/baseline. No original Windows PNGs were synthesized here. Windows/hardware Phase-6 re-capture/comparison, manual sound/feel/controls and visible-window FPS review remain outstanding. No claim of a manual/hardware gate or release. No staging, commits, tags, pushes, merges or environment publication. Current local branch observed as work from requested engine-library ref, HEAD 910f643 preserved. Handoff/MVP/design/README/entry guide/QA/cloud instructions updated.

Final accumulated working-tree inventory (includes preserved earlier tasks; build-log self-hash intentionally omitted):
- README.md: 68 lines; SHA-256 6538d42501cc1e7142c2809b2c511a8a8cbfd63ad1c34574ed9727ed9367a031.
- DELETED archive/lly_spec_sheet.md: prior HEAD SHA-256 87af564366a3eba9d81de540999db74b489be1d03a790000cd6e771cb318b003.
- DELETED archive/prompt_v1.md: prior HEAD SHA-256 150f61ac6d713687954a4db7a0bc40e63b7e9085a7257525806365a1af938d4e.
- DELETED archive/src_pre-fix_2026-10-27/audio.js: prior HEAD SHA-256 86c2ee15b037f7402c2b2b5c598262d87a81048a7cda2a11fc15e3183abdce21.
- DELETED archive/src_pre-fix_2026-10-27/engine.js: prior HEAD SHA-256 e3aa4a6dc9aeb786fdd3e313814885d1e06273d6c056f3227d0dadbbff47951d.
- DELETED archive/src_pre-fix_2026-10-27/environment.js: prior HEAD SHA-256 612d6860eb14b141fea26aa00bad5e44b3c4ce1e6ecb3d616e9114cc433cbfff.
- DELETED archive/src_pre-fix_2026-10-27/kinematics.js: prior HEAD SHA-256 3ed5fa6a10caaa853cf4f40cc2f469e666fd791a598b151da3b3325c5c9e6f6b.
- DELETED archive/src_pre-fix_2026-10-27/main.js: prior HEAD SHA-256 96ac121f24c71553313a9846709a78acb6cdae2cd76aa82be9802fe1c651c0dd.
- DELETED archive/src_pre-fix_2026-10-27/specs.js: prior HEAD SHA-256 187a401ffe6f480a7909654d0688328e05e016664ede1b697ea75610d1bdb7e3.
- DELETED archive/src_pre-fix_2026-10-27/styles.css: prior HEAD SHA-256 6cb806ec99e8ed136b6cd75118c680f485338ca36622bd1d6068957f14ff46a9.
- DELETED archive/src_pre-fix_2026-10-27/utils.js: prior HEAD SHA-256 5b4c624f5875811676ff0265e5a93caf26687a65da6e9db47dea4dad5d263b51.
- DELETED archive/src_pre-pulse-limit_2026-10-27/audio.js: prior HEAD SHA-256 f207e1321b92d41f335bbc1b362bb9eb70e7ae17de175503671f730a22f5303f.
- DELETED archive/src_pre-pulse-limit_2026-10-27/engine.js: prior HEAD SHA-256 e3aa4a6dc9aeb786fdd3e313814885d1e06273d6c056f3227d0dadbbff47951d.
- DELETED archive/src_pre-pulse-limit_2026-10-27/environment.js: prior HEAD SHA-256 612d6860eb14b141fea26aa00bad5e44b3c4ce1e6ecb3d616e9114cc433cbfff.
- DELETED archive/src_pre-pulse-limit_2026-10-27/kinematics.js: prior HEAD SHA-256 3ed5fa6a10caaa853cf4f40cc2f469e666fd791a598b151da3b3325c5c9e6f6b.
- DELETED archive/src_pre-pulse-limit_2026-10-27/main.js: prior HEAD SHA-256 bae08b2fab77d3d5119db25ca4e98e80507835b002de158af9f0ebe01eac37dc.
- DELETED archive/src_pre-pulse-limit_2026-10-27/specs.js: prior HEAD SHA-256 187a401ffe6f480a7909654d0688328e05e016664ede1b697ea75610d1bdb7e3.
- DELETED archive/src_pre-pulse-limit_2026-10-27/styles.css: prior HEAD SHA-256 6cb806ec99e8ed136b6cd75118c680f485338ca36622bd1d6068957f14ff46a9.
- DELETED archive/src_pre-pulse-limit_2026-10-27/utils.js: prior HEAD SHA-256 5b4c624f5875811676ff0265e5a93caf26687a65da6e9db47dea4dad5d263b51.
- docs/README.md: 33 lines; SHA-256 55e93cbe68910ad4f273b08e9e689aa451a32acdfe9915c7a06e08a9e8c8d28b.
- docs/add-engine.md: 11 lines; SHA-256 27f381dfb50f34e8a3e2a5757a3396f5801d8cec5f604d242ac4e4204e7967b8.
- docs/agent-runbook.md: 186 lines; SHA-256 6c72aff45ef2c1007ad52e050fa75dcda8a4d7edccb3bd5790acf6ed1a1b9b22.
- docs/cloud-validation.md: 119 lines; SHA-256 fdfd3d65ba30f2ef254d10874e3e193807cc36b16173d147acbb7614919d947f.
- docs/engine-library-plan.md: 539 lines; SHA-256 abbb4abcd4491336bd13f4cbc7a06d1d29fbe28e56c6f3a4bde52071da07d520.
- docs/handoff.md: 89 lines; SHA-256 191cf61da72a61149260e4893af97eb98bbb024c283d2db00b2cabc992b38252.
- docs/mvp-plan.md: 413 lines; SHA-256 7fed9ffbb4ea87183f31667e12cbbe7e7c25ab6a3b82099c884e06bbb5adcb0e.
- docs/prompts/3.3a-family-takes-entry.md: 123 lines; SHA-256 68af18f6ad90f174e2fc036eb7cf20e2fa713c71994dc7e45a00d54d903bbafc.
- docs/prompts/3.3b-kinematics-takes-entry.md: 32 lines; SHA-256 42bf492f29eb241162eb9d466a068541cc4aae1cf789e4131d3990665fce2771.
- docs/prompts/3.3c-stand-per-engine.md: 38 lines; SHA-256 8fad74da96ae42cfcbd016fb6c2a35aadc778af9b14a9c8ead2b4e06977e2b16.
- docs/prompts/3.3d-runtime-switching.md: 43 lines; SHA-256 df97c08170c843a83a3c96293dd3db11c81b53dfdb58cb98cd0bc0a8b9e19af7.
- docs/prompts/3.4-test-only-copy.md: 29 lines; SHA-256 b7c5323a11b34f7b38ed97fda5ae635e7410984b6b802804c14e4e2c1a75b988.
- docs/prompts/3.5-resource-ownership.md: 9 lines; SHA-256 a937a752f3541bd919ca582f6bd440a44b42a314a4d065e2801382f4f72059ff.
- docs/prompts/3.6-browser-memory.md: 9 lines; SHA-256 cbeb56fae88c465f09fee379ecf283bff1eaf0e83c665ccc36c9799cb8e8a30a.
- docs/prompts/3.7-prop-footprints.md: 7 lines; SHA-256 bfe8795d501a83238e3cf840ad01b67d8dce709c05deb5b7ed29fff9d1c9fb0e.
- docs/prompts/3.8-phase3-acceptance.md: 7 lines; SHA-256 b4d753bffc950de4e2b580e31b63a558d40decd4bded75dc0faf15d2b81e25e3.
- docs/prompts/4-lbz.md: 15 lines; SHA-256 8eb391afb26167fc0bbbe26d2899e4714582e46b8bbbc31da0a2b7855a419222.
- docs/prompts/6-hardening.md: 21 lines; SHA-256 6e1a4419c6765037d1cbe85f81d63b4854029054bc5837306a2d18884329b6ba.
- docs/qa-recipe.md: 220 lines; SHA-256 f505575e8c0b7acaeedc9b15b9deb1f776bbb3dddbf497e027f149abe95d81b0.
- index.html: 418 lines; SHA-256 8266b191063d2b86400dcdef6c5fd59f9f00fbc1db99c0c4314479b3419502de.
- package.json: 29 lines; SHA-256 561698c0c19064f62535863806825684c0e3d2e97a794aa5b643b0aa5e6cd172.
- scripts/capture-browser.mjs: 526 lines; SHA-256 86c1c8b65055e5d9c82fd029d4dcf54f5978ad26a1745172f9a8b74a1097998f.
- scripts/capture-numeric.mjs: 134 lines; SHA-256 f60d3b8f7ccda86e55cc341918248671a450d6f0fc19f6c9bed4c1b37a4c8f62.
- scripts/check-dist.mjs: 41 lines; SHA-256 b8f0ebd0df804227368fefe49f6e674584a5e04a738f1971289fe3c76b34c465.
- scripts/cloud-baseline.mjs: 153 lines; SHA-256 0cda34e27727a17fa629b19e9fd83f915ff6b61c385535c83cf9f5f04c20148b.
- scripts/cloud-regression.mjs: 105 lines; SHA-256 8d6949c88efd413a39bb7d7b594c06d8286331b3c478fc2316795d41f9b48f32.
- scripts/run-browser-tests.mjs: 64 lines; SHA-256 39ff812977a3c842c7e0a0e7ab75df89de8cb6823e35d281c97b0d98373e76a9.
- src/audio.js: 532 lines; SHA-256 cec03bb3841e6802100749eca39db3631ce14a31618d260437e0cd1e12a558ee.
- src/collision.js: 190 lines; SHA-256 257c9d3bc0bc32dc1f047eda60cebccd384b22d21733bb81257c5324676eea30.
- src/core/resources.js: 42 lines; SHA-256 073c0e207d3c27d8514eab96cd552b8bf1472217846389ef401d3e7a4aae766e.
- src/core/swap.js: 45 lines; SHA-256 d7eb079c1bc0e4fa03d9472ea5a21eac1c296003ecc1d37b4f2850202b733a98.
- DELETED src/engines/active.js: prior HEAD SHA-256 df7b6a7a460ecbb5a155e726a3e854753008fe28047f6c814db36250955915c7.
- src/engines/families/v8-ohv-kinematics.js: 226 lines; SHA-256 7a390a4fcf8b241c17a56203982ab7cb1ff52c95a49c43c88da8abcbe6b0c5a6.
- src/engines/families/v8-ohv.js: 4371 lines; SHA-256 8486ae49f7a3b16e17a40f3b012a58b11acfa22251b94dbb3cc4f119bde8e8f6.
- src/engines/index.js: 80 lines; SHA-256 1a057274bce5fe6904108c06a588e187e08a7c1007bca9dc61ae0824942c9570.
- src/engines/lbz/copy.js: 52 lines; SHA-256 e909711492764746e37872fc7530dd529498079d6cb2d275fa681ac66525c72f.
- src/engines/lbz/index.js: 1272 lines; SHA-256 2c162324065ef2f258f15059d524889c048f511cb5d3e450900781940aa4c91c.
- src/engines/lly/copy.js: 634 lines; SHA-256 9709af3deedbe8b4849a9889db738cd000ba93b8283924cd635ff7114ace4ece.
- src/engines/lly/index.js: 654 lines; SHA-256 af7f2f261cf65e799f657853328a2fc9727ffbe969d3bc1ca15bee143faeb8dc.
- src/environment/cell.js: 1393 lines; SHA-256 a597e2ded41d9bd92cfc81f82a5ab440d01941ca99fa0479549b7d4563f4b21c.
- src/environment/stand.js: 622 lines; SHA-256 ca0bd2dc9ba2b2fcc95427b6656d6b957708c6f78c769a0e3872adabf076adce.
- src/main.js: 1768 lines; SHA-256 ef1c032bbb6f0798dc6b915d743298a96c00c94efdac115a9412106f6302510f.
- src/specs.js: 22 lines; SHA-256 b9557ad0bd38e9d1684c43cde89d385e8af542efe4ed29742fe2a7819a50c992.
- tests/audio-pulses.test.mjs: 144 lines; SHA-256 84e807488e0ee3fddd9bfda387361c720c4d60b3297ebbc1ca128902a391132b.
- tests/baseline/lly-curves.json: 116833 lines; SHA-256 564d237124396a8c6b7d9eb93914bf83b5d44e22df951914a622d9bb76988dbe.
- tests/browser/footprints.browser.mjs: 16 lines; SHA-256 8655e21fcda3c6bfd6215fa35dd2e909f0f181bbb0d2d00114227fc8548e0763.
- tests/browser/lbz.browser.mjs: 43 lines; SHA-256 d709f321871fb393eb1f6a977780581c537e180859b7f708897dcb89522d9a5e.
- tests/browser/pointer-lock.browser.mjs: 25 lines; SHA-256 067e261872bbbfdc0dbe5c196b1e401a9ff5858aed00aa28ad3ad7a9393acc29.
- tests/browser/swap.browser.mjs: 53 lines; SHA-256 760cbe5bd44fd73feea8397360f20fe63a59d1e289d16bca5691bd3c0a1379e3.
- tests/cloud-phase6.test.mjs: 15 lines; SHA-256 41edc915a69617cdd4a22955feaac5b54bff85b90a89eefb82a998c8494ad111.
- tests/cloud-regression.test.mjs: 75 lines; SHA-256 93b3fe06b6add2ba18870a5b82e3ffe751da60b12e69ff5d6fd308c4f89d3956.
- tests/collision.test.mjs: 420 lines; SHA-256 04b7148f8236d688789dd79821182bc7436fd6b573ec3a6039feae09ecdf8318.
- tests/fixtures/engines/lly-copy/copy.js: 31 lines; SHA-256 1f4797db28a2d024ee86c8a1c39254042308c72e9dd070fed3586de923298ea2.
- tests/fixtures/engines/lly-copy/index.js: 94 lines; SHA-256 fc34f8af692cbfea68df1604ee77b7ae938f7434e562d4a5c5a91bc921d0b37e.
- tests/footprints.test.mjs: 46 lines; SHA-256 2a01dc340be6d81678b3b570be6a4517a742630af8ba297532e1071c44906aa8.
- tests/helpers/fake-audio.mjs: 190 lines; SHA-256 5666578975f610a888973929a21f391053b35c4481409ada5fb40da46232f932.
- tests/helpers/legacy-kinematics.mjs: 206 lines; SHA-256 132b434c2facf882c8585801bef7e8ff142f1e0fbf88350261ad0a8cdbba595e.
- tests/kinematics-entry.test.mjs: 116 lines; SHA-256 1df9a1887854d7506c509f437b60f27802a816bec0f9b04d9d0e6a3d89fff886.
- tests/kinematics.test.mjs: 141 lines; SHA-256 e99cb6611f4bc575e3fdb10e2bfcaeb4ec57f22bd3ae407815aab260793947d5.
- tests/lbz.test.mjs: 50 lines; SHA-256 b5568324045db3bce2b8c0cc6fcc99b477605253a9caa6e6371daa238c2974b1.
- tests/lly-copy.test.mjs: 94 lines; SHA-256 4d88dcd24c3533f909f9a695aadfe9a198e80a48b1f88ddc030d31b8eb2a5068.
- tests/picking.test.mjs: 61 lines; SHA-256 489c100c31c3ad76b691a2cca4de49ff68940923102a4525bab2a33b04c4cbd6.
- tests/registry.test.mjs: 204 lines; SHA-256 de97af09c7f16b9b59306c113ecf483f39a7fb6e0fba06ce6f1d79874cbbdff9.
- tests/resources.test.mjs: 43 lines; SHA-256 97bb6824b39a558187cb760917b78f3a7a3762b3aab2a3316956410c0f038867.
- tests/swap.test.mjs: 92 lines; SHA-256 e87c1fcca8ab2125faa236e55b2e84386f37040ad8d6babe54e17217f60dd74d.

## 2026-11-08 · Windows validation evidence and engine-picker fix

Human supplied a PowerShell validation log and six FPS samples. Log reports 247 Node tests pass, checks/build/dist pass, all four browser modules pass on Chrome 157.0.8103.39 / Intel Arc 140V / Direct3D11. Windows baseline capture followed by independent comparison passes exact traces/geometry and all six views with 0 changed/differing pixels. FPS mean 59.989282360327216, range 59.86231667272316–60.12221565184147. This closes the previously missing user-reported Windows automated baseline/FPS evidence, not all manual sound/feel/controls review. Windows baseline artifacts have not been copied into cloud.

Human found that clicking the engine dropdown does nothing. Root cause: #ui inherits pointer-events:none, with explicit interactive exceptions for buttons/inputs but no select. Added #ui select to that existing pointer-events:auto list, changing no layout or runtime logic. New tests/browser/picker.browser.mjs hit-tests the control, clicks it with the mouse, navigates native selection and checks LLY→LBZ→LLY. Before fix, test fails with actual hit target webgl instead of enginePicker; after fix it passes. Previous programmatic selectOption/QA-switch tests bypassed this pointer-hit path and missed the bug; they are preserved. No existing assertion or baseline changed.

Node 247/39 suites all pass; static/build/dist checks pass. Focused real-click browser test passes with zero console/page errors. Built production preview and unchanged-baseline cloud checks follow before delivery. A two-file Windows patch will preserve existing .qa/baseline and tests/baseline data.

Picker follow-up verification: built production preview passes the same actual-click/native-selection LLY→LBZ→LLY test, zero console/page errors (/tmp/picker-production.log). First production diagnostic stalled at the 5-second click timeout under continuous software rasterization; reran with recurring QA animation suppressed as in the existing deterministic harness, keeping native loading-paint frames and all click/hit/current-ID assertions. Development real-click test also passes; no existing tests changed. Created /workspace/duramax-engine-picker-fix.zip, 9788 bytes, SHA-256 5562d56bf1cb6d58e0d23e9bdf48de8362501506a31ed1fe7eb99d1f6058ff16. Contains exactly src/styles.css and tests/browser/picker.browser.mjs, preserving Windows-generated baseline artifacts. Rebuild/restart preview after replacing these two files. Independent cloud view comparison still finishing; final result recorded below.

Picker fix final cloud comparison exits 0: .qa/cloud/run-1794177768250-15817/comparison.json; exact traces/geometry, all six views 0 changed/differing pixels and max delta 0. Original Windows numeric payloads still exact with browser metadata separately reported. No reference refresh or existing assertion change. All 247 Node tests, check/build/dist and new actual-click tests pass; no staging/commit/push/publication.
- src/styles.css: SHA-256 f14bf1f310660f35f15b97a66a0d4963fd0ee1317bb44da417c27c53ffe2c39d.
- tests/browser/picker.browser.mjs: SHA-256 4dfeaa6f626c0c5b84e2cf187134bfce49ad11325a725b376c70f6c1dae8c813.

## 2026-11-09 · Final acceptance and release preparation

Human confirmed the picker patch works on Windows, then accepted the build and explicitly instructed: "I am good with it. Push and merge". This authorizes the final gate, commit, merge and push to the existing origin repository. Earlier Windows automated baseline/FPS evidence is retained; no individual manual checklist observations are invented. Environment publication/hosting deployment are not requested.

Fetched origin/master and origin/engine-library with existing phase-0/1/2 tags. Remote engine-library remains 910f643; master remains 864f014, an ancestor of the feature history. No remote changes to reconcile. Original local branch work is preserved. All accumulated modifications match the documented packages, including the explicit archive deletions and picker patch.

Release history decision: deliver one consolidated accepted-MVP commit, with configured Colin Stephens author and D14 coauthor trailer, and tag the final phase-6-done gate. Earlier phases 3/4/6 were accepted together after uncommitted sequential development; do not synthesize untested intermediate commits/tags. Preserve all existing commits/tags and use a non-fast-forward merge into master. Push intended branches and final tag without force, then verify remote IDs.

Final Node/check/build/dist results pass: 247 tests/39 suites/pass 247/fail/cancelled/skipped 0; all five static checks PASS; production build/dist PASS with expected size warning. Full five-module browser suite is running before committing. Existing post-picker cloud comparison .qa/cloud/run-1794177768250-15817/comparison.json remains exact for traces/geometry and six zero-difference views; no source code changed for release preparation.

Release gate checks complete: full five-module browser suite PASS, .qa/browser/run-1794183462067.json; zero console/page errors, actual picker click round trip works, twenty memory-checked swaps remain 617 geometries/91 textures. Node/check/build/dist final results above pass. Preparing the approved commit/merge; only repository project paths will be staged, with local ignored evidence/ZIPs excluded.
