# DMAX LLY 6600 — Interactive Engine Test Cell

A procedural Three.js/WebGL engineering visualisation of the **6.6 L Duramax LLY 90° V8 turbodiesel**, presented on an industrial dynamometer test stand inspired by the DMAX Moraine engine plant.

Every engine component, surface texture, decal, and test-cell prop is generated in code. There are no downloaded engine models, image textures, or video assets.

This is a mechanical and visual simulation, **not an OEM service manual, CAD model, tuning tool, or diagnostic system**.

---

## Requirements

- **Node.js `^20.19.0` or `>=22.12.0`** (required by Vite 8)
- npm
- A desktop browser with **WebGL 2** and hardware acceleration
- Mouse and keyboard

Chrome, Edge, and Firefox are the primary targets. Safari with WebGL 2 should run, but has not been exhaustively tested. The interface is designed for desktop viewports of roughly 1366 × 768 and larger; it is not a mobile experience.

---

## Run locally

From the project root:

```bash
npm install
npm start
```

Open the URL printed by Vite, normally:

```text
http://127.0.0.1:5173/
```

`npm run dev` is an equivalent development command.

If port 5173 is already occupied, Vite will normally choose the next available port. Use the URL printed in the terminal.

### Production build

```bash
npm run build
npm run preview
```

Then open:

```text
http://127.0.0.1:4173/
```

Build output is written to `dist/`.

> Do not open `index.html` directly with a `file://` URL. The application uses ES modules and must be served over HTTP.

### Stop a running server

Press `Ctrl+C` in the terminal running the dev or preview server.

### Port notes

The default commands are local-only (`127.0.0.1`). To use a different port:

```bash
npx vite --host 127.0.0.1 --port 5174
```

### Tests

```bash
npm test
```

Runs the Node built-in test runner (no browser, no extra dependencies):

- `tests/kinematics.test.mjs`: firing order, the 99 mm crank-slider stroke and TDC phasing, the cam-driven valve timing, and the calibration spec points.
- `tests/audio-pulses.test.mjs`: the per-cylinder pulse cadence in `src/audio.js` across RPM and frame rate, stalls, slow motion and firing order, against a fake Web Audio graph.
- `tests/picking.test.mjs`: when a click goes through the faded castings to the parts inside, in the cutaway and exploded views.
- `tests/collision.test.mjs`: walk-mode collision against the engine, dyno guard, console and walls, and the orbit camera's room limits (`src/collision.js`), using the room's real numbers.
- `tests/fixture.test.mjs`: the ceiling fixtures' hanger rods are attached to the housing and reach the ceiling.

`src/main.js` (hotkeys, HUD, toasts, the render loop) needs a browser and is not covered; the rules it calls for picking and collision live in `src/engine.js` and `src/collision.js` so they are. `buildEnvironment()` needs WebGL, so the tests build only the pieces of it they exercise.

---

## First look

The cell loads on a **stabilised 680 RPM warm idle**, with a short camera introduction.

- Press **STOP** (or `SPACE`) to spin the engine down.
- Press **START** to run the full modelled sequence: crank, fuel enable, light-off, idle ramp, then the selected setpoint.
- The RPM slider, presets, and telemetry remain live while the engine is running.

The simulation is deliberately responsive: engine RPM is smoothed with damped targets, while crank, piston, valvetrain, and turbo animation are driven by integrated crank angle and simulation time.

---

## Controls

### Camera

| Input | Action |
| --- | --- |
| Left-drag | Orbit around the engine |
| Wheel | Damped zoom |
| Right-drag | Pan the orbit target |
| `R` | Reset camera |
| `WALK` button or `V` | Toggle orbit / first-person walk |
| Mouse | Look, while pointer-locked in walk mode |
| `W` `A` `S` `D` | Walk |
| `Shift` | Sprint |
| `Esc` | Release pointer lock; close Help or Spec Sheet |
| `V` | Exit walk mode |

The orbit camera stays inside the test cell: zooming out stops at the walls and below the ceiling lights, and the pan target stops 1.05 m short of them. In walk mode you stop at the walls, the engine, the dyno guard and the console, and slide along them.

Click the viewport in walk mode if the browser asks to capture the mouse. A crosshair and compact RPM/HP/boost HUD are shown while walking.

### Powertrain

| Input | Action |
| --- | --- |
| `SPACE` | Start / stop engine |
| RPM slider | 0–3,250 RPM setpoint |
| `1` | Stop |
| `2` | Warm idle — 680 RPM |
| `3` | Peak torque — 1,600 RPM |
| `4` | Peak power — 3,000 RPM |
| `5` | Governor — 3,250 RPM |
| `M` | Toggle slow motion (`0.12×` mechanical time) |
| `S` or Speaker button | Toggle real-time 3D test-cell audio synthesizer |
| `ALLISON 1000` / `ZF S6-650` | Switch between the Allison 1000 automatic (2006: `605 lb-ft / 310 hp / 26,000 psi`) and the ZF S6-650 6-speed manual (`520 lb-ft / 300 hp / 23,000 psi`) calibrations |
| `C` | Cutaway / X-ray castings |
| `E` | Explode assemblies |
| `A` | Assemble (Orbit mode; strafes left in Walk mode) |

Slow motion changes the visible mechanical animation rate—and slows the phase-locked cylinder firing cadence in the audio synthesizer—without falsifying the displayed RPM or telemetry.

### Inspection

| Input | Action |
| --- | --- |
| Hover | Identify a component and highlight it |
| Click | Select it and open its engineering specification card |
| Inspector `×` | Close the card |
| Quick-part buttons | Turbo, valvetrain, CP3.3, block |
| `CAPTURE` | Save a PNG of the current 3D render |
| `SPEC` | Open the full engine data sheet |
| `?` | Open the controls guide |

Internal assemblies are only rendered when **Cutaway** or **Exploded** mode is active. This keeps the assembled view lighter and avoids hidden geometry intercepting picks. In cutaway, click through the faded castings to select a valve, rocker, piston, or other internal component. The camera remains fully controllable.

---

## What is modelled

### Engine architecture

- 6,599 cc / 402.62 CID, 90° V8
- Bore **103.00 mm**, stroke **99.00 mm**, crank throw **49.5 mm**
- Right/passenger bank (`-X` when facing forward `+Z`): cylinders **1-3-5-7**
- Left/driver bank (`+X` when facing forward `+Z`): cylinders **2-4-6-8**
- Firing order **1-2-7-8-4-5-6-3** with clockwise front crankshaft rotation
- Full four-stroke cycle over **720°**, with **90° firing intervals**
- Four-throw cross-plane crank; paired cylinders share journals
- Deep-skirt cast-iron block, main caps, wet-style liners, aluminium heads
- 32 valves, 16 mechanical roller lifters, 16 pushrods, 16 shaft rockers, 16 valve bridges
- Single cam-in-block (`y = 150 mm`) driven at exactly **0.5× crank speed** via 2:1 helical timing gears
- Valve motion solved from cam lobe contact through lifter, pushrod, rocker, bridge, and paired valves
- Forged pistons and connecting rods; piston and rod transforms are solved from the crank-slider geometry and remain pinned to journals and wrist pins

### Fuel, air, and exhaust

- Bosch CP3.3 high-pressure pump nested in the front valley behind the timing cover, feeding twin rails and eight injectors
- Glow plugs and cold-start glow behaviour
- Garrett GT3788VA-style variable-vane turbocharger with animated wheels and VGT actuator
- Twin exhaust manifolds, heat shields, up-pipes, turbine housing, and downpipe
- Charge-air piping and couplers
- EGR valve/cooler assembly
- Oil pan, lower driver-side ACDelco PF2232 spin-on filter, oil lines
- Front gear cover, harmonic damper, serpentine belt drive, and animated water pump, alternator, and idler/tensioner pulleys
- Passenger-side rear Denso gear-reduction starter, harness, coolant hoses, engine mounts
- Industrial dyno stand, driveline guard, console, screens, tools, drums, wall signage, and test-cell lighting

### Real-time procedural audio (`src/audio.js`)

- **Zero external audio assets:** All sound is synthesized in real time via the browser's **Web Audio API** (`TestCellAudio`).
- **90° V8 exhaust & crankcase rumble:** Multi-oscillator sub-bass and low-mid bus (`4×` firing fundamental, `2×` cross-plane bank cadence, and `1×` crankshaft fundamental) shaped by a saturation stage and load-reactive low-pass filter.
- **Crank-angle-locked direct-injection & combustion pulses:** Triggered as each cylinder crosses its exact TDC firing angle (`1-2-7-8-4-5-6-3`), pairing a two-stage Bosch pilot + main injection knock (scaled by live rail pressure) with a low-mid cylinder power-stroke thump.
- **Garrett GT3788VA VNT turbo whistle & boost rush:** Dual-harmonic blade-pass whistle and bandpass-filtered charge-air whoosh driven by live turbo shaft speed, boost pressure, and VNT vane position (`%`).
- **Denso 12V starter cranking whine:** Active during the `190 RPM` starter cranking phase with compression-stroke load ripple before fuel light-off.
- **3D spatialization & mode response:** Anchored to the engine block via a 3D `PannerNode` that tracks the camera in Orbit and Walk modes. Engaging **Cutaway (`C`)** brightens internal valvetrain/injector acoustics, and **Slow Motion (`M`)** slows the firing pulses to `0.12×` in lockstep with the 3D piston flashes.

### Live readouts & dual calibrations

RPM, estimated torque and horsepower, rail pressure, boost, VGT vane position, EGT, oil pressure, coolant temperature, firing-sequence state, stroke phase, tachometer, and a live torque/power brake curve.

A calibration toggle in the telemetry panel switches live between:
- **Allison 1000 Automatic (2006):** **605 lb-ft @ 1,600 RPM**, **310 hp @ 3,000 RPM**, **26,000 psi** max CP3.3 rail pressure
- **ZF S6-650 6-Speed Manual (2004.5–2006; rail pressure 2004.5–2005):** **520 lb-ft @ 1,600 RPM**, **300 hp @ 3,000 RPM**, **23,000 psi** max CP3.3 rail pressure

Torque, power, boost, rail pressure, vane position, and thermal values are **curve-based estimates** for visualisation. They are not the result of a thermodynamic or CFD solver.

---

## Interaction modes

### Cutaway

Castings fade to a controlled X-ray state while the valvetrain, cam, pistons, rods, and crank remain visible. Cover hardware and decorative fasteners fade out so they do not obstruct the mechanism. External exhaust logs become translucent so the head and valvetrain can be read from the side. Ghost castings stop casting hard shadows.

Click through the castings to select internal components. The user's camera is not forcibly moved when cutaway is enabled.

### Exploded

Major assemblies separate along service-oriented axes. The castings retain enough opacity to read as solid parts, while internal mechanisms remain visible in the gaps. The view eases to a wider inspection camera; **Assemble** returns the parts smoothly.

### Part inspection

Exterior and interior components are grouped into selectable parts with proper names, materials, and specifications. The inspector includes cylinder bank/cylinder identification, valve counts, and engine-system context. Hover and selection outlines use the post-processing outline pass.

### Capture

`CAPTURE` renders a fresh frame and downloads a PNG of the 3D viewport, not the surrounding UI. The output is capped at 1920 px wide.

---

## Technical architecture

### Coordinate system and units

Engine geometry is built in **millimetres** under `engine.root`, then uniformly scaled by `0.001` into scene metres. The crankshaft axis is **Z**. The two banks are rotated **±45°** about Z, giving the 90° included V angle.

`src/kinematics.js` is the source of truth for:

- LLY dimensions and identification
- cylinder numbering, banks, stations, and firing angles
- crank-pin phase and exact crank-slider piston motion
- valve timing and lift curves
- torque, power, rail-pressure, boost, vane, EGT, and oil curves

`src/specs.js` holds the display copy used by hover labels and specification cards.

### Rendering

- Three.js `WebGLRenderer`, ACES filmic tone mapping, sRGB output
- Procedural `CanvasTexture` maps for cast grain, brushed metal, rubber, decals, signage, screens, and labels
- `PMREMGenerator` + procedural `RoomEnvironment` for metal reflections
- Directional key, soft fill/rim spots, area light, hemisphere light, and an inspection-only internal fill
- EffectComposer pipeline:
  1. `RenderPass`
  2. `SSAOPass`
  3. `UnrealBloomPass`
  4. `OutlinePass`
  5. `SMAAPass`
  6. `OutputPass`
- Static environment merging and per-assembly mesh merging
- Rigid follower assemblies (valve, lifter, pushrod, rocker, bridge) are merged locally while retaining independent animation
- Internal groups are hidden in the assembled view

### Performance and adaptive quality

The renderer caps device pixel ratio at **1.65** and targets 60 FPS on a discrete or modern integrated desktop GPU.

If the average FPS falls below **44** after the first few seconds, adaptive quality:

- disables SSAO
- caps the render pixel ratio at 1
- displays a one-time performance notice

The full-quality path keeps SSAO and the higher pixel ratio. Performance depends on GPU, viewport size, outline selection, and cutaway state. Full-quality post-processing at 4K is intentionally demanding; let adaptive quality do its job or use a smaller window.

For automated screenshots, append `?qa=1` to the URL to disable adaptive quality. This query parameter is for QA only.

### File map

| Path | Purpose |
| --- | --- |
| `index.html` | Application shell, HUD, calibration switch, inspector, help, full data sheet |
| `src/styles.css` | Industrial UI, viewport layout, responsive rules, walk HUD |
| `src/main.js` | Renderer, post-processing, simulation state, controls, picking, telemetry, screenshots |
| `src/collision.js` | Walk-mode collision and the orbit camera's room limits (plain functions, no Three.js, covered by the tests) |
| `src/audio.js` | Real-time Web Audio API V8 exhaust, injector knock, starter, and GT3788VA VNT turbo synthesizer |
| `src/engine.js` | Procedural LLY geometry, materials assignment, kinematics, cutaway/explode |
| `src/environment.js` | Test cell, stand, dyno, props, lighting, environment reflections |
| `src/kinematics.js` | Engine constants, cylinder layout, firing order, dual calibrations, motion and performance curves |
| `src/specs.js` | Engineering specification cards and component metadata |
| `src/utils.js` | Procedural textures, PBR material library, geometry helpers, labels, merge utilities |
| `tests/` | `npm test` suite: kinematics, audio-pulse, picking, collision and fixture checks |
| `docs/` | Engine-library plan, agent runbook and research sheets (`docs/research/`) |
| `lly_report.md` | Original development research notes. Superseded where it differs by `docs/research/` |
| `dist/` | Generated production build (ignored by git) |

---

## Accuracy and data notes

The mechanical layout follows the project brief and the supplied LLY specification. Some points are worth stating explicitly:

- **Bore, stroke, crank throw, 90° bank angle, firing order, firing intervals, and the 0.5× cam ratio are implemented directly.** Stroke travel is 99.00 mm.
- Ancillary packaging dimensions, casting shapes, some service clearances, and the visual connecting-rod length are stylised for legibility. The rods are modelled at 184 mm centre to centre; the research gives 163.0 mm for the production rod ([`docs/research/lly.md`](docs/research/lly.md), section 2; the conflict is in section 6). This is not OEM CAD.
- The telemetry panel supports both the **Allison 1000 Automatic (`605 lb-ft / 310 hp / 26,000 psi`)** and **ZF S6-650 6-Speed Manual (`520 lb-ft / 300 hp / 23,000 psi`)** ratings. Production LLY figures vary by model year and transmission pairing. The LLY was built from mid-2004 to early 2006, so a 2006 truck may have either an LLY or an LBZ. The LBZ (2006–2007, VIN code D) has different ratings and is not modelled in this app.
- The brief describes piezoelectric injectors. Sources disagree. Four secondary sources describe **Bosch solenoid injectors**, which the research favours, while the GM-style spec sheet and DieselHub say piezoelectric. The visual injector hardware and specification copy follow the requested brief. See [`docs/research/lly.md`](docs/research/lly.md) for the conflict, and [`lly_report.md`](lly_report.md) for the original notes.
- Valve lift, spring geometry, lobe profiles, and rocker ratios are engineering approximations built to preserve correct relative motion, not certified OEM lift data.
- Torque, power, rail pressure, boost, vane, EGT, and oil values are illustrative curves, not a live ECU or dyno data stream.

Do not use this application for engine assembly, service limits, torque specifications, or tuning decisions.

---

## Customising

- **RPM/preset behaviour** and engine curves: `src/kinematics.js` and the preset/calibration wiring in `src/main.js`.
- **Audio synthesis and spatialization**: `src/audio.js`.
- **Part specification copy**: `src/specs.js`.
- **Engine geometry, materials, cutaway and exploded offsets**: `src/engine.js`.
- **Test cell, lighting, and dyno**: `src/environment.js`.
- **Where the walker and orbit camera may go**: `src/collision.js` for the clearances and the console block, and `environment.collision` in `src/environment.js` for the room, dyno guard and orbit volumes.
- **UI layout and shortcuts**: `index.html`, `src/styles.css`, and `bindControls()` in `src/main.js`.
- **Branding and engine data sheet**: `index.html` and `src/environment.js`.

Rebuild after any source change:

```bash
npm run build
```

---

## Troubleshooting

**Blank or black viewport**
- Confirm hardware acceleration is enabled in the browser.
- Use a WebGL 2-capable browser.
- Serve the project over HTTP; do not open the HTML file directly.
- Check the browser console for material or WebGL errors.

**Mouse look does not work in walk mode**
- Click the 3D viewport to request pointer lock.
- If pointer lock is blocked, press `Esc` and click the view again. `V` exits walk mode.

**Low frame rate**
- Full-quality SSAO and 1.65× pixel ratio are expensive.
- Resize the window, close other GPU-heavy applications, or wait for adaptive quality to turn on.
- Software WebGL implementations such as SwiftShader are not representative of a GPU and will be extremely slow.

**Port already in use**
- Use the alternate port printed by Vite, or run `npx vite --host 127.0.0.1 --port 5174`.

**No sound / audio muted**
- Browsers block Web Audio playback until the first user interaction. Click anywhere in the viewport or press any key to unlock audio, or click the **Speaker button** (`S` in Orbit mode) in the top bar.

**Screenshot download**
- The browser must allow downloads from the local page. `CAPTURE` saves only the 3D viewport, at up to 1920 px wide.

---

## Credits and trademarks

- Built with [Three.js](https://threejs.org/) (MIT licence).
- Development tooling: [Vite](https://vite.dev/), [Playwright](https://playwright.dev/).
- Duramax, DMAX, Chevrolet, GMC, Bosch, Garrett, and ACDelco are trademarks of their respective owners. This is an independent educational/engineering visualisation and is not affiliated with or endorsed by General Motors, Bosch, Garrett, or ACDelco.
- Research references are recorded in [`docs/research/sources.md`](docs/research/sources.md). The original notes are in [`lly_report.md`](lly_report.md).
