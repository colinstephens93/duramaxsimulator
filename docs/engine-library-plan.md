# Engine library: refactor plan (v3)

Version 3, 2026-10-29. Version 2 folded in the feasibility review. Version 3 applies the research in [research/README.md](research/README.md). Engine values are sourced there, and nobody signs off on values. The agent's rules and packages are in [agent-runbook.md](agent-runbook.md). "Q7" and similar refer to the 68-question planning list. That list is not in the repo, so section 3 states each decision in full and the build does not need it. Status: proposed. Nothing in the code has changed.

## 1. Goal

The app shows any engine in a library. The user picks one from a dropdown or with `?engine=<id>`. The engine is built, animated, sounded and described from its own data, and every number in that data has a recorded source.

Done when:

- The LLY renders, behaves and reports as it does today (Q7) through Phase 5. Its numbers, behaviour traces and baseline views match the Phase 0 captures. Research corrections come later, in Phase 6, and the baseline is re-captured after them.
- LBZ runs from data (Phase 4), if its differences from the LLY are data and not builder changes (section 6).
- A fictional 4.0 L inline-six runs with its own family (Phase 5).
- `npm test` runs the registry checks for every entry, and the provenance check passes for every entry.

Out of scope (Q65, Q15, Q19, Q32): in-app editing, live dyno import, two engines in one cell, side-by-side views, overhead-cam valvetrains, non-four-stroke cycles, downloaded models.

## 2. Starting point

Checked against the code and the research on 2026-10-29.

- `npm test`: 141 tests pass. There is no git remote, and the only branch is `master`. No tags exist yet.
- Browser: Chrome 156.0.8078.48 is installed. It runs through Playwright's `channel: 'chrome'`, gives WebGL 2 on an Intel Arc 140V GPU (ANGLE over Direct3D 11, not SwiftShader), and `requestAnimationFrame` runs normally.
- LLY values sit in six places:
  - [src/kinematics.js](../src/kinematics.js): the `LLY` constant (`crankRadiusMm: 49.5`, `rodLengthMm: 184`), the cylinder layout, valve timing, the two calibrations (lines 28–47) and the curves.
  - [src/engine.js](../src/engine.js): about 2,700 numeric literals in the builder, per the review. Only a few geometry values are named constants, and `HEAD_TOP` and `ROCKER_Y` are defined and exported but never used.
  - [src/specs.js](../src/specs.js): about 38 hand-written spec entries. `ENGINE_SPEC_SUMMARY` and `INSPECTABLE_IDS` are exported and unused.
  - [src/main.js](../src/main.js): the start-up sequence, presets, camera home poses, `MAX_RPM` (3250), the telemetry gates and the `__LLY__` hook.
  - [src/audio.js](../src/audio.js): the 45.3 Hz base tone and its own `MAX_RPM` (3250). [src/environment.js](../src/environment.js): the dyno at a fixed z, the driveline from a flywheel near z = −0.32 m, gauge scales that divide by literal 3250 and 2500 (line 1365), and "DMAX" signage. [src/engine.js](../src/engine.js) line 4270 also uses a literal 3250.
  - [src/collision.js](../src/collision.js) and [index.html](../index.html): the 1.03 m walk clearance; labels, five presets and calibration buttons as literal text.
- Start-up in `updateSimulation()`: cranking at 190 rpm with fuel off for 0.55 s; 520 rpm with fuel on until 1.25 s; idle until 2.05 s; then a ramp to the setpoint that ends at 2.25 s. The ramp uses damping 1.08 when the setpoint is above 1,600 rpm, and 1.35 otherwise. Steady running uses 0.98 when the target is above 2,200 rpm, and 1.42 otherwise. Both tests read the setpoint or target, not the current rpm ([src/main.js](../src/main.js) lines 311 and 318).
- Telemetry gates in `updateSimulation()`: torque and horsepower show only when firing and above 150 rpm; rail, boost and oil show only when firing; vane shows above 30 rpm; coolant shows above 50 rpm and is 38 below that; EGT when not firing is 38 + 0.02 per rpm.
- The engine and the cell are built once, at load. There is no swap path.
- Randomness and the wall clock. Three.js's SSAO pass draws its kernel and noise from `Math.random` (`SSAOPass.js`, lines 443–445 and 470–471). So do the dust field in [src/environment.js](../src/environment.js) (lines 1733–1735) and the noise and offsets in [src/audio.js](../src/audio.js) (lines 28 and 323). The engine shake and the environment already run on simulation time (`simulation.totalTime`, lines 288, 349–351 and 366). The wall-clock reads in [src/main.js](../src/main.js), checked on 2026-10-31 for package 0.4, are these:
  - Changed under `?qa=1`: the frame delta in `animate()` (lines 1495–1510), which drives `updateSimulation`, `updateCamera`, `updateTelemetryUI` and `simulation.elapsed`; and the intro tween (line 412), which reads `startedAt` (set at line 209 and reset in `boot()`, lines 1558–1560).
  - Left alone, with the reason: the pointer-hold timing (lines 696 and 703, an input gesture); the hover throttle (lines 1512–1513, input timing); the toast hide timer (line 1169, UI only); and the FPS sampler and its adaptive quality (lines 1527–1542). The sampler is a measurement that `getFpsSamples()` reports, and adaptive quality is already off under `QA_MODE`.
  - The `render(count)` hook (line 1638) steps only `updateSimulation`. Under `?qa=1` it must also step the camera and the telemetry, or the intro and the walk stop once `animate()` stops advancing.
- The Web Audio clock (`ctx.currentTime`, [src/audio.js](../src/audio.js) lines 284, 296, 312 and 373) only schedules sound, so it stays.
- `timing-gears` is registered outside `createPart` (engine.js lines 617–619 and 1188–1190).
- The tachometer is built only once. `buildTachometer()` returns early when its SVG already has children ([src/main.js](../src/main.js) line 752).
- The name check finds 154 lines outside `src/engines/`. The first draft said 147, because its pattern missed `GT3788VA` and `Denso`.
- **Research findings** ([research/README.md](research/README.md)):
  - The app's Allison calibration (605 lb-ft, 310 hp, 26,000 psi, 16.8:1) is the 2006 automatic. The 2004.5–2005 automatic is reported at 520 lb-ft by secondary sources only, and it is not in the app (research/lly.md sections 4 and 6). The entry's years therefore run 2004.5–2006.
  - The LBZ (2006–2007) is rated 360 hp at 3,200 rpm and 650 lb-ft at 1,600 rpm for the Silverado and Sierra HD, at 16.8:1 and 26,000 psi.
  - The real LLY rod length is about 163.0 mm (6.417 in). The app's 184 mm is stylised, as the README says.
  - The injectors are solenoid by most sources. The brief and the app say piezoelectric.
  - Stock boost is contested: 30 psi in one table, 23 psi in the project notes.
  - The Allison speed count (five or six) is unresolved for 2006.

## 3. Decisions

| Area | Decision | Q |
| --- | --- | --- |
| Meaning of "engine" | The engine being shown. Every layer becomes per-engine. | 1 |
| Launch set | LLY (reference), LBZ (Duramax variant), a fictional 4.0 L inline-six | 2, 54 |
| Scale | A handful of entries. Hand-built families are acceptable. | 3 |
| Selection | Dropdown in the top bar, plus `?engine=<id>` | 4 |
| Persistence | None. The app opens on LLY. | 48 |
| Swapping while running | Stop (fuel cut), then swap. The new engine starts at 0 rpm. Camera, cutaway and explode carry over. | 5 |
| Loading | A real overlay (reusing `#bootStatus`). The old model is disposed. | 6 |
| LLY regression | Numbers, traces and baseline views unchanged through Phase 5 | 7 |
| Cell | One shared cell. Stand, dyno, driveline, mounts and walk limits are per engine. | 8, 37 |
| Cell branding | DMAX for LLY; neutral for other entries; set through `cell.setBranding(entry)` | 38 |
| Authoring | Developers add a module. No in-app editing. | 9 |
| Entry format | One JavaScript module per engine, exporting one plain object | 10 |
| Loading | Bundled. Each engine is code-split and loaded with `import()`. | 11 |
| Validation | Loud failure for the entry shown. `npm test` checks every entry. | 12 |
| Sources | Every numeric value cites source IDs from [research/sources.md](research/sources.md). Design values are labelled `design`. | 13 |
| Sign-off | **No human sign-off on values.** The research decides, and the provenance check enforces the source IDs. | new |
| Calibrations | Each calibration has its own model years and its own rated-peak rpm. LLY: Allison row is the 2006 automatic; ZF row is the 2004.5–2005 manual for pressure and compression, and 2004.5–2006 for torque. | 21 |
| Rod length | Baseline stays at 184 mm (Q7). Research value 163.0 mm. The correction is a separate, logged change. | new |
| Injector copy | The brief's "piezoelectric" wording stays until you decide. Research favours solenoid. | 52 |
| Stock boost | Labelled `contested`. The design cap of 23 psi stays for LLY. | new |
| Allison speed count | Removed from the label in Phase 6. The count is unresolved. | new |
| Location | `src/engines/<id>/` | 14 |
| Models | Procedural only | 15 |
| Identity and look | In the entry. Generated placeholder serials for non-GM engines. | 16 |
| Layout | Numbering, banks, stations and firing order are data | 17, 33 |
| Geometry | The V8 family keeps its dimension literals in code until Phase 5 | 18, 35 |
| LBZ geometry | Bore, stroke, firing order and compression ratio are data. Visual differences (rods, cooler, glow plugs) are not modelled and are recorded as such. | 2 |
| Valvetrain | OHV only. Per-engine timing and lift. The current lift curve is kept. | 19 |
| Optional parts | Feature flags. A missing part has no geometry. | 20 |
| Ratings | Per engine, including calibrations | 21 |
| Curves | Point tables per engine. LLY keeps its formula curves (section 5). | 22 |
| Telemetry | A fixed field list. Shows "—" when a field does not apply. | 23 |
| Audio | A profile inside the entry; one synth, shared | 24, 41, 42 |
| Start-up | Per engine. The diesel sequence is the default. | 25 |
| Contract | One engine interface (section 5) | 26 |
| Part IDs | Core vocabulary plus extras. Each family exports its IDs. | 27 |
| Missing parts | Hidden in the UI | 28, 29 |
| Explode offsets | Data | 30 |
| Maths | Any cylinder count and crank-pin angle; four-stroke only | 31, 32 |
| Look | Shared shell generators plus bespoke details; stylised, correct envelope | 35, 36 |
| Dyno | One per cell; a warning when an entry exceeds its rating | 39 |
| Gauges | Scales are fractions of the redline | 40 |
| Units | Imperial now; units in field names | 43 |
| Presets and slider | From the entry; the slider runs from 0 to the redline | 44, 45 |
| Calibration selector | Generic; lists the entry's calibrations | 46 |
| Visible copy | From the entry: title, HUD, watermark, help, spec sheet | 49 |
| QA hook | `window.__ENGINE__`; `__LLY__` kept as an alias until Phase 6 | 50 |
| Accuracy | Rated peaks are tested at each calibration's rpm; curves stay illustrative | 51 |
| Disclaimer | Shown for every engine | 53 |
| Trademarked names | Only in the LLY and LBZ entries | 55 |
| Tests | The same checks for every entry; browser tests for the swap | 56, 57 |
| Visual baselines | LLY first; others on demand | 58 |
| Performance | 60 FPS target; `?qa=1` kept | 59 |
| Memory | GPU resource counts return to baseline after swaps | 60 |
| Phasing | Phases 0 to 6 (section 6) | 61 |
| Git | Incremental, on a branch, merged when green; tags at each gate | 62 |
| `archive/` | Removed in Phase 6; kept in git history | 63 |
| Docs | README rewritten; "Add an engine" guide | 64 |
| QA gaps | Left alone unless the refactor touches the code | 66 |
| Owner | The human approves code gates. Values come from the research. | 67 |

## 4. Choices beyond the defaults

- **Names are proposals:** `src/core/`, `src/engines/` (with `families/`, `shared/` and one folder per entry), `src/environment/cell.js` and `stand.js`, `src/ui/bind.js`.
- **Units in field names** (`boreMm`, `peakTorqueLbFt`, `maxRailPsi`). The data keeps the units its sources publish, and the display converts.
- **LBZ** is the Duramax variant for Q2. The research sheet is [research/lbz.md](research/lbz.md).
- **`lly_report.md` stays at the root.** It is the project's own research file, and the LLY sheet cites it (S31). It is not moved.
- **Research folder is the authority.** The build reads [research/](research/README.md) and does not research values again. A value missing from the research is `null` and is logged.
- **Provenance record per value.** Every numeric value in an entry has a record of its source IDs, status and confidence. Design values are labelled and carry no source.
- **Calibrations carry rated-peak rpm.** The LBZ's power peak is at 3,200 rpm, and the LLY's is at 3,000 rpm.
- **A test-only copy of LLY** proves the swap in Phase 3. It changes identity, ratings, curves and copy, but not the stroke, because the V8 family's crank throw is a literal (section 5). It registers only when the build mode is `test`.
- **Checks are Node scripts** under `scripts/`, not shell pipelines, so they behave the same in any shell.
- **QA knowledge lives in the repo** (`docs/qa-recipe.md`, written in Phase 0), not in any assistant's memory.

## 5. Target shape

```
src/
  main.js                  composition only: renderer, scene, wiring
  core/
    simulation.js          run state, start-up sequence, rpm damping, crank angle
    telemetry.js           curve evaluation, interpolation kinds, gates, formula curves
    swap.js                switchEngine(): lock, load, build, dispose, reset, rebind
  engines/
    index.js               registry: ENGINE_IDS, loaders, loadEngine(id)
    schema.js              validateEntry(): required fields, units, invariants, provenance
    families/
      v8-ohv.js            today's EngineBuilder, moved; dimension literals stay until Phase 5
      inline-ohv.js        Phase 5
    shared/                generators the families compose (extracted in Phase 5)
    lly/                   index.js (the entry), copy.js (spec cards)
    lbz/                   Phase 4
    generic-i6/            Phase 5
  environment/
    cell.js                room, lights, signage, props, console, fixtures (built once)
    stand.js               bedplate, mounts, dyno, driveline, guard (built per entry)
  ui/
    bind.js                fills text from the entry; builds presets, calibrations, quick buttons
  audio.js                 the synth, configured per entry
  kinematics.js            generic maths only
  collision.js, specs.js (lookup only), utils.js
docs/research/             sources, value sheets and provenance (the authority for values)
scripts/                   checks and baseline tools (created in Phase 0)
tests/                     Node tests (npm test); tests/browser/*.browser.mjs (npm run test:browser)
```

### The entry (sketch, LLY)

The schema in `src/engines/schema.js` is the source of truth. The values shown are the LLY values from [research/lly.md](research/lly.md) section 9, with the baseline values where the research differs (marked).

```js
// src/engines/lly/index.js (sketch)
export default {
  id: 'lly',
  family: 'v8-ohv',
  identity: { name: '6.6L Duramax (RPO LLY)', shortName: 'LLY 6600', code: 'LLY',
              years: '2004.5–2006 (VIN code 2)', accuracy: 'rated-peaks' },
  layout: {
    banks: [
      { id: 'R', rotationDeg: 45, axisDeg: 135, bankOffsetZmm: 30, label: 'Passenger (Right)' },
      { id: 'L', rotationDeg: -45, axisDeg: 45, bankOffsetZmm: -30, label: 'Driver (Left)' },
    ],
    stationZmm: [196, 66, -66, -196],
    throwOffsetDeg: [0, 90, 270, 180],
    cylinders: [{ number: 1, bank: 'R', station: 0, fireAngleDeg: 0 } /* … 2 to 8 */],
    firingOrder: [1, 2, 7, 8, 4, 5, 6, 3],                  // checked against the fire angles
  },
  geometry: { boreMm: 103.00, strokeMm: 99.00, crankRadiusMm: 49.5,
              rodLengthMm: 184,        // baseline (Q7). Research value 163.0 mm (lly.md section 2)
              envelopeIn: [30.0, 30.0, 32.0], massLb: 835 },   // approximate
  compressionRatio: { default: 17.5, year2006: 16.8 },
  valvetrain: { type: 'ohv', valvesPerCylinder: 4,
                timing: { intake: { centerDeg: 450, durationDeg: 230, liftMm: 10.9 },   // lift and duration: design estimates (research/lly.md sections 7 and 9)
                          exhaust: { centerDeg: 270, durationDeg: 224, liftMm: 10.4 } } },
  features: { ignition: 'glow', injection: 'common-rail', cp3: true, turbo: 'vgt', egr: true, oxidationCatalyst: true },
  ratings: {
    idleRpm: 680, redlineRpm: 3250,
    calibrations: [
      { id: 'allison', label: 'Allison 1000 6-Spd Auto', shortLabel: 'ALLISON 1000 AUTO',   // Phase 6: 'Allison 1000 automatic'
        modelYears: '2006', peakTorqueLbFt: 605, peakTorqueRpm: 1600,
        peakHp: 310, peakPowerRpm: 3000, maxRailPsi: 26000, compressionRatio: '16.8:1 (2006 Auto)' },
      { id: 'zf', label: 'ZF S6-650 6-Spd Manual', shortLabel: 'ZF S6-650 MANUAL',
        modelYears: { torque: '2004.5–2006', pressureAndCompression: '2004.5–2005' },
        peakTorqueLbFt: 520, peakTorqueRpm: 1600, peakHp: 300, peakPowerRpm: 3000,
        maxRailPsi: 23000, compressionRatio: '17.5:1 (2004.5–05 Manual)' },
    ],
    presets: [/* rpm and label pairs, from the current buttons */],
  },
  curves: {
    torque:  { interp: 'smoothstep', zeroBelowRpm: 40,
               points: { allison: [[0, 0], [400, 250] /* … */], zf: [[0, 0], [400, 220] /* … */] } },
    rail:    { interp: 'smoothstep', zeroBelowRpm: 25, scaleTo: 26000, points: [[0, 0], [250, 4400] /* … */] },
    boost:   { interp: 'smoothstep', zeroBelowRpm: 120, capPsi: 23 /* design; contested (S06 says 30) */, points: [[120, 0] /* … */] },
    vane:    { interp: 'linear', zeroBelowRpm: 30, round: true, points: [[500, 82] /* … */] },
    egt:     { formula: 'power', base: 232, span: 510, exponent: 0.72, atRpm: 3250, round: true,
               belowRpm: 30, belowValue: 38 },
    oil:     { formula: 'linear', base: 22, span: 38, atRpm: 1800, round: true, zeroBelowRpm: 20 },
    coolant: { formula: 'linear', base: 88, span: 4, atRpm: 3250, round: true },
  },
  turbo: { model: 'Garrett GT3788VA VVT', compressorInducerMm: 62.8, compressorExducerMm: 88,
           compressorBlades: 11, turbineInducerMm: 71.3, turbineExducerMm: 65.7, turbineBlades: 13,
           vaneHeightMm: 14.4 },                     // S04 says 15 mm; table value kept
  telemetry: {
    gates: { torqueHpMinRpm: 150, vaneMinRpm: 30, coolantMinRpm: 50 },
    notFiring: { egtBase: 38, egtPerRpm: 0.02, coolant: 38 },
  },
  startSequence: {                  // LLY values from updateSimulation()
    crankRpm: 190, crankDamping: 4.7, crankUntilS: 0.55,
    lightOffRpm: 520, lightOffDamping: 3.1, lightOffUntilS: 1.25,
    idleDamping: 2.2, idleUntilS: 2.05,
    rampEndS: 2.25,  // damping tests read the setpoint (ramp) or the target (running), not current rpm
    rampDamping: { aboveRpm: 1600, fast: 1.08, slow: 1.35 },
    runDamping: { aboveRpm: 2200, fast: 0.98, slow: 1.42 },
    stopDamping: 1.05, stopSnapRpm: 3.5,
    glow: {                         // fuel is off only while cranking
      onStart: 0.85,
      crank: { target: 1, damping: 6 }, lightOff: { target: 0.55, damping: 4 },
      idle: { target: 0.12, damping: 2.4 }, ramp: { target: 0, damping: 2.8 },
      running: { target: 0, damping: 3 }, stopped: { damping: 1.5 },
    },
  },
  audio: { baseToneHz: 45.3, maxFrameS: 0.2, bankCadence: true, turboWhistle: true, injectorKnock: true },  // design
  inspect: { quickParts: ['turbo', 'valvetrain', 'cp3', 'block'] },
  walk: { clearanceRadiusM: 1.03 },                 // design
  dyno: { ratedLbFt: 1000, maxRpm: 4000 },          // design (test cell)
  explode: { offsets: { turbo: [0, 310, -250] /* … */ } },
  look: { palette: { block: 0x2c312e, head: 0xb2b8b3 }, decals: { /* casting text */ } },
  provenance: {                                     // one record per numeric value; see docs/research
    'geometry.boreMm': ['S01', 'S02'], 'geometry.strokeMm': ['S01', 'S02'],
    'geometry.rodLengthMm': { ids: ['S13', 'S14'], status: 'conflict', baseline: 184 },
    'ratings.redlineRpm': ['S01', 'S02'], 'ratings.idleRpm': ['S01', 'S02'],
    'ratings.calibrations.allison.peakHp': ['S01', 'S02', 'S04'],
    'turbo.boostPeakPsi': { ids: ['S06', 'S31'], status: 'contested' },
    /* … one record per numeric value */
  },
  copy: () => import('./copy.js'),
};
```

### Runtime contract

Every family's model exposes the same members:

- `root` (a group in millimetres, scaled by `main.js`), `parts` (a map from part ID to objects), `explodeGroups`, `internalPartIds` (declared by the builder), and the family's exported `PART_IDS`.
- `update(dt, frame)`, where `frame = { crankAngleDeg, rpm, fuel, glow, timeScale }`. The model derives turbo and vane animation from these. The turbo speed uses the entry's redline where today's code uses `MAX_RPM`; they are equal for LLY.
- `setCutaway(on)`, `setExploded(on)`, `isXrayed`, `effectiveCutaway`.
- `telemetry(rpm, calibrationId, firing)`, which returns torque, horsepower, rail, boost, vane, EGT, oil and coolant with the gates applied. Horsepower is `torque × rpm / 5252`, as today. Rated peaks are tested at each calibration's own rpm.
- `dispose()`.

The audio frame carries every field its `update()` reads. The review found that `starting` and `vane` are missing from the frame it was given.

### Curve arithmetic

- Torque, rail and boost use `smoothstep` interpolation. Vane uses linear interpolation with rounding. These match today's code.
- Each curve has its zero threshold, as in `kinematics.js`.
- EGT, oil and coolant are formulas today, and LLY keeps them as formulas so the baseline holds. That outranks the "tables" default (Q7 over Q22). New entries use tables.
- Rail: interpolate the stored psi points first, then multiply by `scale = maxRailPsi / scaleTo`. For LLY that is exactly today's arithmetic (1 for Allison, 23000 / 26000 for ZF). The review's comparison found zero mismatches this way, while storing fractions produced thousands.
- Keep the order for every curve: interpolate, then scale, then round.

### Family literals

- The V8 family keeps its geometry literals in code until Phase 5. The entry holds only the named values that Phases 1 to 4 need: layout, valve timing, the crank radius, bore, stroke, rod length and the ratings.
- `headTopMm` is not in the entry, because nothing uses it.
- The Phase 3 test copy keeps the stroke, because the crank throw is a literal.
- LBZ uses the same family. Its bore, stroke and firing order match the LLY, so it needs no builder change, apart from the Phase 4 gate. Its visual differences (thicker rods, larger cooler, glow plugs) are not modelled, and its copy must not claim them.

### Environment

- `cell.js` is built once: room, lights, props, console and ceiling fixtures.
- `stand.js` is built per entry from `{ flywheelZ, mounts, envelope, centerXZ, dyno }`.
- `cell.setBranding(entry)` sets the signage: DMAX for LLY, neutral for the others.
- Props live in cell coordinates and get footprints in Phase 3. A Node test checks that no footprint overlaps the walk circle or the dyno guard. The console chair is the one exemption, until Phase 6 moves it (open decision 2).
- Gauge scales are fractions of `ratings.redlineRpm`.

### UI

- `ui/bind.js` fills `data-bind` text, and builds the presets, the calibration buttons and the quick-part buttons. A quick-part button is hidden when the family lacks that part.
- Preset toast names come from the entry, replacing the names map in `applyPreset()`.
- `index.html` keeps neutral placeholder text only. The `BOSCH CP3.3` hover placeholder goes.
- Until Phase 6, the app keeps its current labels, so the baseline still matches. Phase 6 applies the research labels.

### Copy and part IDs

- Entries provide spec copy for every part their family registers. A Node test checks the copy against `PART_IDS`. A browser test checks `PART_IDS` against `model.parts`.
- The core vocabulary is the set of IDs in `specs.js` today (`block`, `crank`, `turbo`, `cp3`, and so on). Families may add extras.
- `timing-gears` must be registered through `createPart` in the family.
- Copy corrections are listed in [research/lly.md](research/lly.md) section 8. They are applied in Phase 6, followed by a baseline re-capture.

## 6. Phases

Sizes are relative (S, M, L, XL). The commands for each phase are in the runbook.

### Phase 0: safety net (S)

Deliverables:

- Branch `engine-library` from `master`, and tag `phase-0-start`.
- `scripts/` tools: the checks (names, encoding, IDs, provenance; `npm run check`), a WebGL probe, and the capture and compare tools (`npm run baseline:capture`, `npm run baseline:compare`).
- Repeatable captures under `?qa=1`. `Math.random` is seeded around scene construction. Time-dependent animation is driven by the simulation clock, which `render(n)` steps. Under `?qa=1`, nothing that moves the simulation, the camera or the intro reads the wall clock. The exceptions are listed in section 2. Each capture records the browser version and the renderer string.
- Baselines: a numeric file with exact equality (`tests/baseline/lly-curves.json`); a behaviour trace of rpm, fuel, glow, crank angle, vane and turbo angle at 1/60 s steps through start, 3,250 rpm and stop, at two time scales (`tests/baseline/lly-trace.json`); a geometry file (`tests/baseline/lly-geometry.json`); and six PNG views under `.qa/baseline/`. The PNGs are not stored in git. They are regenerated from `phase-0-done`, because `phase-0-start` predates the capture tools and the seeded randomness.
- `docs/qa-recipe.md`, ported from the QA notes: the rAF shim, the hooks, the gotchas and the hidden-pane limits.
- Measured: the `buildEngine` time, which sets the swap budget, and FPS in a visible window (measured by the human).

Exit: `npm test` passes, including the numeric baseline. Two captures of unchanged code match on every baseline. The human approves the baseline files.

### Phase 1: move LLY into one entry (M)

Deliverables:

- `src/engines/lly/index.js` and `copy.js` hold the LLY values from section 5, with the provenance records. Values and value kinds are unchanged, and the Phase 1 labels stay as they are.
- Modules import from the entry through re-exports, so the tests need no assertion changes.
- `lly_report.md` stays at the root. The provenance records cite [research/lly.md](research/lly.md), which cites it.

Exit: `npm test` and every baseline pass unchanged. The diff contains moves and imports and no number changes. The provenance check passes for the LLY entry.

### Phase 2: core reads the entry (L)

Deliverables:

- `core/telemetry.js` evaluates the curves and the gates from the entry.
- `core/simulation.js` runs the start-up from `entry.startSequence`.
- The V8 family takes identity, layout, valve timing, look, explode offsets, quick parts, calibrations and `PART_IDS` from the entry. Its dimension literals stay.
- `ui/bind.js` and the `index.html` placeholders. Presets, calibration buttons and quick-part buttons are generated.
- Audio is configured from the entry, with one `MAX_RPM` value.
- Neutral comments in `src/styles.css` (its header names the LLY).
- The turbo and vane animation move into the model, using the frame in section 5.

Exit: `npm test`, `npm run check` (clean for `src/` outside `src/engines/`), and every baseline pass.

### Phase 3: switching at runtime (M to L)

Deliverables:

- The registry, loaders, validation, `?engine=` parsing, the picker, and `window.__ENGINE__` (with `__LLY__` kept as an alias).
- The `cell.js` and `stand.js` split, and `cell.setBranding`.
- `main.js` holds a mutable engine reference. `switchEngine` follows section 7.
- The test-only LLY copy (stroke unchanged), registered only in test mode.
- The resource tracker and the disposal rules (section 7).
- The browser swap test, `tests/browser/swap.browser.mjs`.
- Prop footprints and their Node test. The console chair is exempt by name until Phase 6 (open decision 2).

Exit: `npm test`, `npm run check`, `npm run test:browser` (ten round trips, a clean console, resource counts back at baseline, cutaway state kept), and `npm run baseline:compare` for LLY.

### Phase 4: LBZ, from the research (M)

Deliverables:

- The LBZ entry, built from [research/lbz.md](research/lbz.md) (section 8): identity, geometry, compression ratio, ratings, two calibrations, turbo geometry, and the features.
- A provenance record for every numeric value, citing the source IDs from the sheet. Values the sheet lists as gaps are `null`.
- A browser smoke test for LBZ.

Exit: the registry tests pass for LBZ. `npm run check` passes, including the provenance check. There are no changes outside `src/engines/lbz/`, the registry list and the tests. If LBZ needs a builder change, stop and re-plan. Nobody signs off on values.

### Phase 5: inline-six, its own family (XL)

Deliverables:

- `shared/` generators extracted from the V8 family where the inline-six needs them: crank, rods and pistons, shell, OHV valvetrain, heads, intake, exhaust and accessories. The V8 output must not change, and the geometry baseline checks that.
- The family `inline-ohv`: one bank, six cylinders, crank pins at 120°, firing order 1-5-3-6-2-4. Stylised. No CP3, glow plugs, EGR or VGT. A spark-style start in its data. Audio with cylinders ÷ 2 pulses per revolution and no bank cadence.
- Valve rows generalised from banks to the layout. The 135° crank reference in `pinWorldAngleDeg()` becomes data.
- The fictional entry, with its values from [research/inline6.md](research/inline6.md). Each value is labelled `sourced`, `derived` or `design`.

Exit: the registry tests pass. The layout tests pass (120° intervals, the firing order). The browser smoke test passes (start, redline, cutaway, explode, walk, audio). The human reviews the engine visually. If the valvetrain grows too large, a simplified valvetrain is acceptable (Q36).

### Phase 6: hardening, research corrections and cleanup (M)

Deliverables:

- Apply the copy corrections in [research/lly.md](research/lly.md) section 8. These include the Allison label ("Allison 1000 automatic"), the unsupported starter and glow-plug claims, and the qualifiers. The injector wording follows open decision 1. Then re-capture the baseline in a logged package.
- The console chair moves outside the walk circle, and its exemption from the footprint test is removed (open decision 2). The re-capture comes after the move.
- Remove the `__LLY__` alias, and update `docs/qa-recipe.md`.
- Remove the unused exports (`ENGINE_SPEC_SUMMARY`, `INSPECTABLE_IDS`, `HEAD_TOP`, `ROCKER_Y`), unless kept on purpose.
- The README gets an Engines section, an updated file map and tests section, and an "Add an engine" guide.
- `archive/` is removed with `git rm`. Git history keeps it.
- `npm run check:dist`: the test copy's ID must not appear in `dist/`, and each engine is its own chunk.

Exit: every check passes. QA runs on all three entries. The human approves the merge to `master`.

## 7. Swap sequence and resource rules

1. **Input lock.** The picker and the start and stop controls are disabled until the swap finishes.
2. **Request token.** Each request gets a token. A finished load whose token is no longer current is discarded.
3. **Stop.** If the engine is running, call `stopEngine()` (fuel cut). Do not wait for spin-down.
4. **Overlay.** Show `#bootStatus` with "LOADING <name>". Wait two animation frames so it paints.
5. **Load.** `loadEngine(id)` runs a dynamic import, then `validateEntry`. On failure, keep the current engine and show an error.
6. **Build.** Build the new family model and stand. Keep the old ones alive until the new ones succeed.
7. **Dispose.** Dispose the old model and stand.
8. **Reset.** Set rpm, crank angle and glow to zero, clear the start timer, set the calibration to the entry's default, set the slider maximum to the redline, reset the audio's last crank angle, and clear the selection and hover. Rebuild the tachometer and the cylinder strip for the new entry.
9. **Rebind.** Rebind the UI. Call `cell.setBranding` and `audio.configure`. Rebuild the walk world. Push a walker out of the new engine's circle. Let `confineOrbitCamera` clamp the camera. Restore cutaway and explode.
10. **Finish.** Hide the overlay and toast "<NAME> READY".

Resource rules:

- Geometry, label textures, sprites, stand textures and cloned materials created by a build belong to that build and are disposed with it. The resource tracker is passed into the builders.
- Materials and textures from `createMaterials()` are shared library assets. No model disposes them.
- The check is `renderer.info.memory` (geometries and textures). The baseline is taken after the first round trip, with cutaway and explode rendered, nothing selected, and a fixed window size.

## 8. Tests and checks

### Node tests (`npm test`)

- **Registry tests** for each ID in `ENGINE_IDS`, plus the test copy imported directly, because Node has no `import.meta.env`. Checks: the schema is valid; firing order matches the declared order; every interval is 720 ÷ N; TDC falls on each fire angle; stroke is twice the crank radius; the piston never rises above TDC; the cam turns at half crank speed; valve timing sits inside the cycle; rated peaks match at each calibration's own rpm; audio cadence; walk clearance from `walk.clearanceRadiusM`; prop footprints clear of the walk circle and the dyno guard, except the console chair until Phase 6; spec copy for every part in `PART_IDS`.
- **Provenance check** (part of `npm run check`): every numeric value in an entry has a provenance record. Each record cites IDs from [research/sources.md](research/sources.md), or carries the `design` label. A `null` is allowed only where the sheet lists a gap.
- **Existing files, migrated in the phase that needs it:**
  - `kinematics.test.mjs` reads LLY values through the registry. `EngineBuilder` and `LOBE_LIFT` move with the family, so the import paths change. The `_prepareValveRows.call({})` helper keeps working only if the family keeps that method.
  - `audio-pulses.test.mjs` and `tests/helpers/fake-audio.mjs` use the entry's layout and the audio frame, not `CYLINDERS` and the simulation object.
  - `collision.test.mjs`: the 1.03 m assertions read `walk.clearanceRadiusM`.
  - `picking.test.mjs`: the import path changes to the family module. Its assertions stay.
  - `fixture.test.mjs`: unchanged, because it tests the cell.
- **Baseline:** `tests/baseline.test.mjs` compares the numeric file with exact equality.

### Browser tests (`npm run test:browser`)

- The files are `tests/browser/*.browser.mjs`. `node --test` does not collect them.
- The runner starts Vite with `createServer({ mode: 'test' })`, then drives the app with Playwright through the installed Chrome (`channel: 'chrome'`).
- Checks: the swap test; `PART_IDS` against `model.parts` for each family; the smoke tests.

### Baseline captures

- The numeric baseline is checked in Node. The trace, geometry and visual baselines are captured in the browser.
- Browser baselines are valid only for the same browser build and renderer. Each capture records both.
- A visual view matches when no more than 0.1% of its pixels differ by more than 8/255. A pixel differs when its red, green or blue value differs by more than 8. The pixel comparison runs in the browser on a canvas, so it needs no new dependency. For each view, the compare reports the number of changed pixels, the number of pixels that differ at all, and the largest channel difference, so the margin is visible.
- The trace has one run at each time scale: 1, and 0.12 after `toggleSlowMotion()`. Each run is a fresh page under `?qa=1`. It stops the engine until rpm is below 1, starts it until rpm is within 1 of the 680 rpm idle setpoint, sets 3,250 rpm with `applyPreset(3250)` until rpm is within 1 of 3,250, holds for 2 s, and stops again until rpm is below 1. Each stage is capped at 120 s of simulated time. Each step is `updateSimulation(1 / 60)`, the call that `render(1)` makes, followed by one sample of `simulation.rpm`, `simulation.fuel` (0 or 1), `simulation.glow`, `simulation.crankAngle`, the vane angle (`engine.turboActuator.rotation.z`) and the rotation of each `engine.turboWheels[i].group`. The steps skip the render, because the trace records simulation state.
- The geometry has, for each id in `partRegistry` in sorted order, the world-space bounding box, the mesh count and the vertex count, measured after `scene.updateMatrixWorld(true)`. It also has the camera position and `controls.target` at the home pose (after `resetCamera()` and 120 renders) and at the walk start (`enterWalk()` from that pose).
- The six views are each taken in a fresh page at 1280 × 800, with the UI hidden (`setUiVisible(false)`). Each starts with `resetCamera()` and 120 renders, which finish the 1.05 s camera tween, so "home camera" means that pose. The state is then set with `setFixture`, and each view is read from the WebGL canvas (`renderer.domElement`) after a render. Do not use `captureScreenshot()`, which adds a branded overlay and its copy:
  1. `home`: 680 rpm, then one render.
  2. `cutaway`: home camera, 680 rpm, with `cutaway` set, then 300 renders.
  3. `exploded`: home camera, 680 rpm, with `exploded` set, then 300 renders.
  4. `cutaway-3250`: home camera, 3,250 rpm, with `cutaway` set, then 300 renders.
  5. `exploded-3250`: home camera, 3,250 rpm, with `exploded` set, then 300 renders.
  6. `walk-start`: 680 rpm, then `enterWalk()` from the home camera, then one render.
- The buildEngine time is measured in its own page. `buildEngine(createMaterials())` is timed alone, five times, and logged. It is not a baseline file.

### Name check (part of `npm run check`)

- **Names:** `\b(lly|duramax|dmax|6600|moraine|bosch|garrett|acdelco|allison|zf|cp3|pf2232|gm|chevrolet|gmc|denso)\b|gt3788[a-z]*`, case-insensitive, over `src/` and `index.html`, excluding `src/engines/`. Clean from Phase 2.
- **Numbers:** 3250, 3000, 3200 and 26000 outside `src/engines/`. Clean from Phase 2. Some matches may be legitimate; the agent logs each one it keeps.
- **Encoding:** the mojibake sequences `Â`, `â€` and `âˆ`.
- **IDs:** engine-ID strings outside the registry.

## 9. Risks

| Risk | What we do |
| --- | --- |
| Captures are not repeatable | Seeded randomness and the simulation clock in Phase 0; a second capture must match before any phase starts |
| The builder cannot be "moved only" | The V8 family keeps its literals until Phase 5. Phase 1 changes nothing in the builder. |
| Builder generalisation grows | Generalise only when Phase 4 or 5 needs it |
| LBZ differs in geometry after all | The Phase 4 gate: if a builder change is needed, stop and re-plan |
| Props or walk limits break | Footprints, a Node test for each entry, and the chair exemption until Phase 6 |
| Swap state leaks between engines | The reset list in section 7 and the browser swap test |
| Memory leaks on swap | The ownership rule and the `renderer.info` check |
| Browser checks cannot run | The harness check in the runbook. Chrome has passed the probe. |
| Agent drift or false success claims | Acceptance commands only, the build log, stop conditions and human gates (runbook) |
| Values without provenance | The provenance check fails the build. Gaps are `null` and listed in the research. |
| A research source is wrong | Sheets state status and confidence. A correction goes into the sheet first, then into the entry. |
| Visual differences are claimed but not modelled | The copy names only what is modelled. Phase 6 corrections apply to the copy. |
| Trademarked names in new entries | Names only in the LLY and LBZ entries; the inline-six uses a generic name |
| QA hook renamed | `__LLY__` kept until Phase 6, and `docs/qa-recipe.md` updated in the same phase |
| Mojibake in `src/` (PowerShell 5.1) | Edit with file tools or Node; the encoding check in `npm run check` |

## 10. Conventions

- Edit files with the agent's file tools, or with a Node script that reads and writes UTF-8. Do not read and rewrite source files with PowerShell 5.1 (`Get-Content` and `Set-Content`), which corrupts the label characters.
- Delete with git or with Node, not `Remove-Item -Recurse`, which can follow directory junctions.
- Commit at the end of each phase, on the phase branch, using the author and trailer the repo is configured with. Do not push: there is no remote.
- Tags mark the start (`phase-0-start`) and each gate (`phase-N-done`). Rollback is a human decision, made by creating a new branch from a tag. Nobody resets a shared branch.

## 11. Open decisions

These are the decisions that were, or still are, with you. Values are not on this list, because the research decides them.

1. **Injector wording in the copy.** The brief says "piezoelectric". The research favours solenoid for the LLY and the LBZ (see [research/lly.md](research/lly.md) section 6). Keep the brief's wording, or change it in Phase 6. This is a wording decision, not a value.
2. **Console chair inside the walk circle. Decided 2026-10-31: exempt it now, and move it in Phase 6.** Checked on 2026-10-29 against `src/environment.js` (console group at lines 1245–1248, chair at lines 1416–1447): the seat's nearest corner is 0.91 m from the walk-circle centre (0, −0.05 m), and the nearest leg tip is 1.02 m. Both are inside the 1.03 m circle. The Phase 3 footprint test exempts the chair by name, with the exemption logged. Phase 6 moves the chair outside the circle, removes the exemption, and re-captures the baselines.
3. **Cut line (Q68).** Drop Phase 5 first, then LBZ. Never cut Phases 0 to 3.

Decided by the research, with no sign-off needed:

- **LLY calibration years** (research decision 1). The Allison row is the 2006 automatic. The ZF row is the 2004.5–2005 manual for pressure and compression, and 2004.5–2006 for torque.
- **LBZ redline and calibrations** (research decisions 2 and 3). The redline is 3,250 rpm. The calibrations are Silverado and Sierra HD (360 hp, 650 lb-ft) and Kodiak and TopKick LPD (310 hp, 605 lb-ft).
- **LLY rod length** (research decision 4). The baseline stays at 184 mm. The research value is 163.0 mm, and the correction is a separate, logged change.
- **Stock boost** (research decision 6). Labelled `contested`, and the design cap of 23 psi stays.
- **Allison speed count** (research decision 7). Removed from the label in Phase 6.
- **Browser binary.** Chrome, through `channel: 'chrome'`.
- **Source sign-off.** Removed. The research is the authority for values.

## 12. Changes from version 2

- Engine values are researched in [research/](research/README.md), with sources, status and confidence. The build reads them and does not research again.
- Nobody signs off on values. The provenance check enforces the source IDs, and the research decides the open questions about values.
- The LLY calibrations are relabelled by model year. The Allison row is the 2006 automatic, and the entry's years are 2004.5–2006.
- Rated-peak rpm is per calibration. The LBZ power peak is at 3,200 rpm.
- The rod length is recorded at 163.0 mm, and the 184 mm baseline is kept with a label. The stylised value is no longer silent.
- The `lly_report.md` file stays at the root.
- Copy corrections from the research are a Phase 6 package, followed by a baseline re-capture.
- The earlier changes from version 1 still apply: repeatable captures, the rail arithmetic, the Phase 3 copy with the same stroke, the steady-state threshold at 2,200 rpm, the corrected name check, the test migration, the swap resets, the Node checks and the agent-neutral conventions.
