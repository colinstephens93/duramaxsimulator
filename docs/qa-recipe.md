# QA recipe: engine test cell

This recipe stands on its own. It describes two ways to drive the app, the QA
hooks, deterministic stepping, screenshots, known traps, cleanup and open
findings. Paths and line numbers refer to this repository checkout, as checked at the Phase 3.2b checkpoint (2026-11-05). Line numbers drift as code moves; search for the symbol if a number misses.

## a. Two ways to drive the app

### Scripted path (Chrome through Playwright)

Use `scripts/capture-browser.mjs` as the reference. It serves the app through
Vite's `createServer` on a free port, launches installed Chrome with
`channel: 'chrome'`, headless, and the same arguments as
`scripts/webgl-probe.mjs`, and drives the app through `window.__LLY__`.

The two entry points are:

```text
npm run baseline:capture
npm run baseline:compare
```

`baseline:capture` runs the numeric capture and then the browser capture. The
browser capture writes the trace, the geometry and the six view PNGs.
`baseline:compare` captures a fresh set into `.qa/current/`, compares the JSON
exactly, checks the browser version and renderer, and compares the six PNGs by
pixel difference.

The scripted path is the preferred path when the pane is hidden or when a
repeatable result is needed. It uses the QA clock described below.

### Built-in browser pane

The built-in pane is usually hidden. While it is hidden, `requestAnimationFrame`
does not fire, so the app does not animate and walk/orbit logic does not run.
The notes' workaround is:

1. Run `npm run build`.
2. Copy `dist/` to a scratch directory. Never edit the project's own `dist/`.
3. In the copy's `index.html`, place this shim immediately after `<head>`:

```html
<script>window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16);</script>
```

The copied JS and CSS stay byte-identical. Only the copy's HTML gets the shim.
4. Serve the copy with a small Node static server. The notes used a temporary
   `.claude/launch.json` and `preview_start`; `.claude/` does not normally exist
   and must be removed afterwards.
5. Open `/?qa=1` and resize the window to 1366x768.
6. Drive the app through `window.__LLY__`.
7. Clean up as described in section f.

The hidden-pane rAF behavior is carried from the notes and has not been
re-checked here.

## b. Hooks on window.__LLY__

The object is assigned at `window.__LLY__ = {` in `src/main.js` (line 1542 at the checkpoint; `render` is at line 1615). Every name below is present. From package 3.3d, `window.__ENGINE__` is the same object, and `__LLY__` is an alias until Phase 6.

| Hook | What it is |
| --- | --- |
| `THREE` | The Three.js namespace. |
| `scene` | The scene. |
| `camera` | The perspective camera. |
| `renderer` | The WebGL renderer; `renderer.domElement` is the canvas. |
| `composer` | The effect composer. |
| `controls` | The orbit controls. |
| `engine` | The built engine model; includes `turboActuator`, `turboWheels` and `parts`. |
| `environment` | The cell/environment object, including collision data. |
| `audio` | The `TestCellAudio` instance. |
| `simulation` | The mutable simulation state. |
| `startEngine` | Starts the start-up sequence. |
| `stopEngine` | Stops the engine and cuts fuel. |
| `toggleEngine` | Starts or stops depending on current state. |
| `setDesiredRpm` | Sets the RPM target. |
| `applyPreset` | Applies an RPM preset. |
| `setCalibration` | Selects the `allison` or `zf` calibration. |
| `toggleCutaway` | Toggles the cutaway view. |
| `setExploded` | Sets the exploded view. |
| `toggleSlowMotion` | Toggles the 0.12x mechanical time scale. |
| `resetCamera` | Starts the 1.05 s home-camera tween. |
| `selectPart` | Selects a part and opens its spec card. |
| `clearSelection` | Clears the selected part. |
| `enterWalk` | Enters walk mode and requests pointer lock. |
| `exitWalk` | Leaves walk mode and starts the 1.1 s camera tween. |
| `captureScreenshot` | Renders, adds the branded overlay and downloads a PNG. |
| `partRegistry` | Map from part id to the part's root objects. |
| `syncUI` | Refreshes the UI from the simulation state. |
| `updateSimulation` | Advances the simulation by one `dt`; under QA use `render`. |
| `getFpsSamples` | Returns up to six FPS samples. |
| `setUiVisible` | Shows or hides `#ui`. |
| `setFixture` | Sets RPM, fuel, starting, cutaway, exploded and related state directly. |
| `render` | The QA clock: steps simulation, camera and telemetry, then renders once. |

`setFixture` accepts `rpm`, `crankAngle`, `running`, `fuel`, `starting`,
`desiredRpm`, `cutaway` and `exploded` (`src/main.js` line 1575).

## c. Stepping under ?qa=1

Under `?qa=1`, `animate()` does not advance the simulation, the camera or the
telemetry. That block is gated by `if (!QA_MODE)` at `src/main.js:1533`.
The loop still runs the hover check, screenshot check, FPS sampler and render.

The simulation, camera and telemetry advance only through
`window.__LLY__.render(count)` at `src/main.js:1615`. Each iteration:

```text
simulation.elapsed += 1 / 60
updateSimulation(1 / 60)
updateCamera(1 / 60)
updateTelemetryUI(1 / 60)
```

After all iterations, `render(count)` calls `composer.render()` once. In normal
mode, `animate()` advances `simulation.elapsed` by the wall-clock frame delta.
Under `?qa=1`, only `render()` advances it, so the intro tween reads simulated
time, not the wall clock.

The captures use these step counts:

- 120 `render(1)` calls after `resetCamera()` to finish the 1.05 s home tween.
- 300 `render(1)` calls after entering cutaway or exploded.
- 120 `updateSimulation(1/60)` steps for the 2 s hold in the trace.

At 1/60 s, a 1.05 s tween takes 63 steps and a 1.1 s tween takes 66 steps.
The 120-step wait is therefore enough for either camera tween. The view capture
loops are in `scripts/capture-browser.mjs:313` and `:320-329`; the 120-step hold
is `HOLD_STEPS = 2 * 60` at `scripts/capture-browser.mjs:14`.

## d. Screenshots

The baseline views are read from the WebGL canvas with
`renderer.domElement.toDataURL('image/png')` after a render
(`scripts/capture-browser.mjs:346`). They are 1280x800 with deviceScaleFactor 1.

Do not use `captureScreenshot()` for comparisons. It draws a branded canvas
with test-cell copy and a download link, then triggers a file download
(`src/main.js:1418`). It is for human-facing captures, not baseline
comparison.

## e. Gotchas

**Camera tween overwrites a pose - checked.**
`resetCamera()` starts a 1.05 s tween (`src/main.js:374`); `exitWalk()` starts a
1.1 s tween (`src/main.js:459`). `tweenCamera()` sets `controls.enabled = false`
(`src/main.js:357`), and `updateCamera()` keeps overwriting the pose until
the tween ends, then sets `controls.enabled = true` (`src/main.js:381`).
Wait the tween out, then set the camera pose and `controls.enabled = false`.

**Synthetic pointerdown/pointerup on #webgl - checked.**
The canvas is `#webgl` (`index.html:21`). The listeners are attached at
`src/main.js:1303` and `:1310`. Dispatch `pointerdown` and `pointerup` with
button 0 at integer pixel coordinates on `#webgl`.

**Freeze moving parts with setFixture - checked.**
`setFixture({ rpm: 0, running: false })` sets `engineOn` false, fuel false and
RPM 0, then updates the engine with `turboRate: 0`
(`src/main.js` line 1575). The note's reason is that, with the engine running,
parts move between hit prediction and the click; that race is from the notes,
not re-checked here.

**Selected part appears in #specId - checked.**
`selectPart()` writes the uppercase id to `#specId`
(`src/main.js:636`); the element is at `index.html:268`.

**Walk dt cap of 0.1 s - checked.**
The normal-mode camera step is `Math.min(0.1, rawDt)`
(`src/main.js:1478`), inside the `!QA_MODE` block at `:1474`. Under `?qa=1` the
step is exactly `1/60 s` (the render hook, from `src/main.js:1615`), so the 0.1 s cap does not apply.

**Stale screenshots and the stamp - checked in part, from notes in part.**
No `#qaStamp` element exists in `index.html` or `src/`; it is an element an
agent adds. `captureScreenshot()` is the overlay/download path
(`src/main.js:1418`). The note's advice to wait about 1.5 s after adding
the stamp is from the notes, not re-checked.

**Before-and-after builds with git archive - from notes, not re-checked.**
Build an old commit into a scratch directory with:

```text
git archive <sha> index.html package.json src | tar -x
```

Then junction `node_modules` into the scratch copy and serve it on a second
port. The notes call for a junction; clean it up as described in section f.

**requestPointerLock promise - checked.**
`enterWalk()` calls `canvas.requestPointerLock?.()` at `src/main.js:454`; the
canvas pointerdown handler calls it at `src/main.js:1305`. Both are optional
calls whose returned promise is not awaited or caught, so a rejection can be
uncaught.

**Hidden-pane rAF - from notes, not re-checked.**
While the built-in pane is hidden, `requestAnimationFrame` does not fire. The
scratch-copy shim is the workaround described in section a.

## f. Cleanup for the built-in pane

When finished:

1. Stop all static servers and preview processes.
2. Close the opened tabs.
3. Reset the window size to the desktop preset.
4. Delete the scratch copies.
5. Delete the temporary `.claude/launch.json` and remove `.claude/` if the
   recipe created it.

Delete junctions with `rmdir`, never `Remove-Item -Recurse`. Do not delete the
project's own `dist/` or source tree.

## g. Known open findings

From the QA notes as of 2026-10-27, re-checked at the 3.2b checkpoint (2026-11-05). These are known gaps, not regressions, and
they are not fixed:

- Walk mode has no collision for props: the work-lamp post around (-2.0, 1.7),
  the tool chest at (2.82, 1.16), and other props. `buildWalkWorld()` already
  accepts circles and boxes, so adding them is small. Planned in package 3.7 (`docs/mvp-plan.md`).
- The outline's hidden-edge colour (`outlinePass.hiddenEdgeColor` in
  `src/main.js`; initial set at `:183`) is nearly invisible.
- `canvas.requestPointerLock?.()` in `enterWalk` and the canvas pointerdown
  handler can reject as an uncaught promise (`src/main.js:454` and `:1305`).
- The quick-part buttons for internal parts show nothing in the assembled view.
- The default exploded-view camera is too wide.
- Injector wording remains an open content decision: the brief says
  piezoelectric, while production LLY used Bosch solenoid (README notes this).
