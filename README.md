# Engine Test Cell

A procedural Three.js/WebGL 2 engine library and dynamometer test cell. Engine models, textures, labels and props are generated in code. This is an illustrative visualisation, not OEM service data, CAD, a tuning tool or a diagnostic system.

## Engines

| Engine | Calibrations | Notes |
| --- | --- | --- |
| Duramax LLY | Allison 1000 automatic; ZF S6-650 manual | Preserves the original model's 184 mm rod length; the researched correction is intentionally outside this MVP. |
| Duramax LBZ | Silverado/Sierra HD; Kodiak/TopKick LPD | Researched ratings and dimensions; 163 mm rod length from family listings, medium confidence. |

Use the ENGINE picker or open `/?engine=lly` / `/?engine=lbz`. A swap stops the engine, resets its run state/default calibration, updates labels/specs/collision/audio, and preserves cutaway/explode and camera mode. Failed loads retain the previous engine. Owned model/stand GPU resources are disposed; shared assets remain.

The synthetic LLY copy exists only in Vite test mode and is excluded from production. Inline-six support is outside this MVP. See [handoff](docs/handoff.md) for current verification and outstanding manual/Windows checks.

## Run

Requires Node.js ^20.19.0 or >=22.12.0, npm, a desktop browser with WebGL 2, mouse and keyboard. Installed Google Chrome is used by automated browser tests.

```bash
npm install
npm run dev
# Production build and local preview
npm run build
npm run preview
```

Open Vite's printed loopback URL (normally port 5173; preview 4173). Serve over HTTP; opening index.html directly does not load its ES modules. Stop servers with Ctrl+C.

## Controls

Use the visible controls for start/stop, RPM presets/slider, calibration, cutaway, explode, assemble, walking, sound and PNG capture. Keyboard shortcuts include C (cutaway), E (explode), A (assemble), V (walk), S (sound), and 1–5 (presets). Walking uses WASD and mouse input after pointer lock. Browser sound requires a user gesture. See the [QA recipe](docs/qa-recipe.md) for scripted hooks and manual checks.

## Accuracy and provenance

[Research sheets](docs/research/README.md) are the authority for physical specifications. Entries distinguish sourced values, derived values, contested claims and design values. Rated peaks are anchored to sourced values; curve interpolation, start-up behavior, valve timing, sound, appearance and many construction details are illustrative. LBZ boost is contested, and its rod length uses family listings rather than an independent LBZ measurement. Injector-actuation sources conflict; copy states that disagreement.

## Checks

```bash
npm test
npm run check
npm run build
npm run check:dist
npm run test:browser
```

Node tests cover entries/schema, mechanics, curves, audio cadence, switching, ownership and walking collision. Static checks cover names/numbers, encoding, IDs and numeric provenance. Browser tests run Vite in test mode on a free loopback port and check both real engines, the synthetic fixture, props, controls, and twenty memory-checked swaps after warm-up. Results are saved under ignored .qa/browser/.

The browser runner uses installed Chrome (channel chrome). An explicit TEST_CHROME_PATH can select the existing cloud Chrome executable. TEST_BROWSER_FILTER selects a named module for diagnostics; normal acceptance runs every module.

Original Windows regression commands are npm run baseline:compare and the deliberately controlled baseline:capture workflow. Capture is reserved for the documented re-capture package; comparison never refreshes its reference. The cloud uses a separate labelled reference, renderer and [workflow](docs/cloud-validation.md); its software-rendering results do not establish original Windows visual or manual/audio acceptance.

## File map

- src/main.js: scene composition, engine picker, runtime bindings and QA hook.
- src/core/: entry-based simulation/telemetry, switch coordinator and resource ownership.
- src/engines/: registry/schema, independent LLY/LBZ data and copy, V8 OHV family.
- src/environment/: persistent cell, prop footprints and disposable per-engine stand.
- src/ui/: data binding and display formatting.
- src/audio.js and src/collision.js: synthesis and camera/walking constraints.
- tests/: Node tests, browser modules and the test-only engine fixture.
- scripts/: checks, browser runner and baseline tools.
- docs/: research, design, package plan, execution prompts, append-only build log and handoff.

## Add an engine

Follow the [entry guide](docs/add-engine.md), [MVP plan](docs/mvp-plan.md) and [runbook](docs/agent-runbook.md). Start with recorded research and explicit gaps, validate the entry and copy before registration, then test the actual model and switching.
