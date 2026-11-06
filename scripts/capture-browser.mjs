import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
import { createServer } from 'vite';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE_DIR = path.join(ROOT, 'tests', 'baseline');
const TRACE_PATH = path.join(BASELINE_DIR, 'lly-trace.json');
const GEOMETRY_PATH = path.join(BASELINE_DIR, 'lly-geometry.json');
const QA_BASELINE_DIR = path.join(ROOT, '.qa', 'baseline');
const MAX_TRACE_BYTES = 5 * 1024 * 1024;
const MAX_STAGE_STEPS = 120 * 60;
const HOLD_STEPS = 2 * 60;

const VIEW_NAMES = [
  'home',
  'cutaway',
  'exploded',
  'cutaway-3250',
  'exploded-3250',
  'walk-start',
];
const VIEW_WIDTH = 1280;
const VIEW_HEIGHT = 800;
const VIEW_DEVICE_SCALE_FACTOR = 1;
const PIXEL_CHANNEL_LIMIT = 8;
const VIEW_PIXEL_LIMIT = 1024;

const LAUNCH_ARGS = [
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--enable-unsafe-swiftshader',
  '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows',
];

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function trackConsole(page, label, errors) {
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(`${label}: console: ${message.text()}`);
    }
  });
  page.on('pageerror', (error) => {
    errors.push(`${label}: pageerror: ${error.message}`);
  });
}

async function openAppPage(context, appUrl, label, errors) {
  const page = await context.newPage();
  trackConsole(page, label, errors);
  await page.goto(appUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    () => window.__LLY__
      && window.__LLY__.engine
      && window.__LLY__.simulation
      && document.getElementById('bootStatus')?.classList.contains('done'),
    undefined,
    { timeout: 60000 },
  );
  return page;
}

async function readBrowserInfo(page, browser) {
  const result = await page.evaluate(() => {
    const app = window.__LLY__;
    const gl = app.renderer.getContext();
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : gl.getParameter(gl.RENDERER);
    return {
      webgl2: typeof WebGL2RenderingContext !== 'undefined'
        && gl instanceof WebGL2RenderingContext,
      renderer,
    };
  });

  if (!result.webgl2) {
    throw new Error('WebGL 2 is not available');
  }
  if (!result.renderer) {
    throw new Error('Renderer string is unavailable');
  }
  if (/swiftshader/i.test(result.renderer)) {
    throw new Error(`Renderer contains SwiftShader: ${result.renderer}`);
  }

  const info = {
    version: browser.version(),
    renderer: result.renderer,
  };
  console.log(`Chrome: ${info.version}`);
  console.log(`Renderer: ${info.renderer}`);
  return info;
}

async function captureTrace(context, appUrl, slowMotion, errors) {
  const label = slowMotion ? 'trace-0.12x' : 'trace-1x';
  const page = await openAppPage(context, appUrl, label, errors);

  const run = await page.evaluate(({ useSlowMotion, maxSteps, holdSteps }) => {
    const app = window.__LLY__;
    if (useSlowMotion) app.toggleSlowMotion();

    function sample() {
      return {
        rpm: app.simulation.rpm,
        fuel: app.simulation.fuel ? 1 : 0,
        glow: app.simulation.glow,
        crankAngle: app.simulation.crankAngle,
        vaneAngle: app.engine.turboActuator.rotation.z,
        turboAngles: app.engine.turboWheels.map((wheel) => wheel.group.rotation.z),
      };
    }

    function runStage(name, start, done) {
      start();
      const samples = [];
      let capped = true;

      for (let step = 0; step < maxSteps; step += 1) {
        app.updateSimulation(1 / 60);
        const current = sample();
        samples.push(current);
        if (done(current)) {
          capped = false;
          break;
        }
      }

      return {
        name,
        steps: samples.length,
        capped,
        end: samples[samples.length - 1],
        samples,
      };
    }

    function holdStage() {
      const samples = [];
      for (let step = 0; step < holdSteps; step += 1) {
        app.updateSimulation(1 / 60);
        samples.push(sample());
      }
      return {
        name: 'hold-3250',
        steps: samples.length,
        capped: false,
        end: samples[samples.length - 1],
        samples,
      };
    }

    const stages = [
      runStage('stop-initial', () => app.stopEngine(), (state) => state.rpm < 1),
      runStage('start-idle-680', () => app.startEngine(680), (state) => Math.abs(state.rpm - 680) <= 1),
      runStage('preset-3250', () => app.applyPreset(3250), (state) => Math.abs(state.rpm - 3250) <= 1),
      holdStage(),
      runStage('stop-final', () => app.stopEngine(), (state) => state.rpm < 1),
    ];

    return {
      timeScale: useSlowMotion ? 0.12 : 1,
      stages,
    };
  }, {
    useSlowMotion: slowMotion,
    maxSteps: MAX_STAGE_STEPS,
    holdSteps: HOLD_STEPS,
  });

  await page.close();

  console.log(`Trace ${run.timeScale}x`);
  for (const stage of run.stages) {
    console.log(`  ${stage.name}: steps=${stage.steps} capped=${stage.capped} end=${JSON.stringify(stage.end)}`);
  }

  return run;
}

async function captureGeometry(context, appUrl, browserInfo, errors) {
  const page = await openAppPage(context, appUrl, 'geometry', errors);

  const result = await page.evaluate(() => {
    const app = window.__LLY__;
    app.resetCamera();
    app.render(120);

    const home = {
      position: app.camera.position.toArray(),
      target: app.controls.target.toArray(),
    };

    try {
      app.enterWalk();
    } catch (error) {
      console.error('enterWalk failed:', error);
    }
    const walkStart = {
      position: app.camera.position.toArray(),
      target: app.controls.target.toArray(),
    };

    app.scene.updateMatrixWorld(true);
    const parts = [...app.partRegistry.entries()]
      .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
      .map(([id, roots]) => {
        const box = new app.THREE.Box3();
        let meshCount = 0;
        let vertexCount = 0;

        for (const root of roots) {
          const rootBox = new app.THREE.Box3().setFromObject(root);
          if (!rootBox.isEmpty()) box.union(rootBox);

          root.traverse((object) => {
            if (!object.isMesh) return;
            meshCount += 1;
            const position = object.geometry?.attributes?.position;
            if (position) vertexCount += position.count;
          });
        }

        if (box.isEmpty()) {
          throw new Error(`Empty world-space box for part ${id}`);
        }

        return {
          id,
          box: {
            min: box.min.toArray(),
            max: box.max.toArray(),
          },
          meshCount,
          vertexCount,
        };
      });

    return {
      parts,
      camera: {
        home,
        walkStart,
      },
    };
  });

  await page.waitForTimeout(100);
  await page.close();

  return {
    browser: browserInfo,
    ...result,
  };
}

async function captureBuildTimes(context, baseUrl, errors) {
  const page = await context.newPage();
  trackConsole(page, 'buildEngine', errors);
  const benchmarkUrl = `${baseUrl}__benchmark.html`;

  await page.route('**/__benchmark.html', (route) => route.fulfill({
    status: 200,
    contentType: 'text/html',
    body: '<!doctype html><html><body></body></html>',
  }));
  await page.goto(benchmarkUrl, { waitUntil: 'load' });

  const times = await page.evaluate(async () => {
    const [{ buildEngine }, { createMaterials }] = await Promise.all([
      import('/src/engines/families/v8-ohv.js'),
      import('/src/utils.js'),
    ]);

    const values = [];
    for (let index = 0; index < 5; index += 1) {
      const start = performance.now();
      buildEngine(createMaterials());
      values.push(performance.now() - start);
    }
    return values;
  });

  await page.close();

  console.log(`buildEngine times (ms): ${times.map((value) => value.toFixed(3)).join(', ')}`);
  console.log(`buildEngine median (ms): ${median(times).toFixed(3)}`);

  return {
    times,
    median: median(times),
  };
}

async function captureViews(viewContext, appUrl, errors) {
  const views = {};

  for (const name of VIEW_NAMES) {
    const page = await openAppPage(viewContext, appUrl, `view-${name}`, errors);
    const dataUrl = await page.evaluate((viewName) => {
      const app = window.__LLY__;
      app.setUiVisible(false);
      app.resetCamera();
      for (let render = 0; render < 120; render += 1) app.render(1);

      if (viewName === 'home') {
        app.setFixture({ rpm: 680 });
        app.render(1);
      } else if (viewName === 'cutaway') {
        app.setFixture({ rpm: 680, cutaway: true });
        for (let render = 0; render < 300; render += 1) app.render(1);
      } else if (viewName === 'exploded') {
        app.setFixture({ rpm: 680, exploded: true });
        for (let render = 0; render < 300; render += 1) app.render(1);
      } else if (viewName === 'cutaway-3250') {
        app.setFixture({ rpm: 3250, cutaway: true });
        for (let render = 0; render < 300; render += 1) app.render(1);
      } else if (viewName === 'exploded-3250') {
        app.setFixture({ rpm: 3250, exploded: true });
        for (let render = 0; render < 300; render += 1) app.render(1);
      } else if (viewName === 'walk-start') {
        app.setFixture({ rpm: 680 });
        try {
          app.enterWalk();
        } catch (error) {
          console.error('enterWalk failed:', error);
        }
        app.render(1);
      } else {
        throw new Error(`Unknown view ${viewName}`);
      }

      const canvas = app.renderer.domElement;
      if (canvas.width !== 1280 || canvas.height !== 800) {
        throw new Error(`View ${viewName} canvas is ${canvas.width}x${canvas.height}, expected 1280x800`);
      }
      return canvas.toDataURL('image/png');
    }, name);

    const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
    const buffer = Buffer.from(base64, 'base64');
    views[name] = buffer;
    console.log(`View ${name}: ${buffer.length} bytes`);
    await page.waitForTimeout(100);
    await page.close();
  }

  return views;
}

export async function captureBrowser() {
  let server;
  let browser;
  const consoleErrors = [];

  try {
    server = await createServer({
      root: ROOT,
      logLevel: 'error',
      server: {
        host: '127.0.0.1',
        port: 0,
      },
    });
    await server.listen();

    const address = server.httpServer.address();
    if (!address || typeof address === 'string') {
      throw new Error('Could not determine the Vite server port');
    }

    const baseUrl = `http://127.0.0.1:${address.port}/`;
    const appUrl = `${baseUrl}?qa=1`;
    console.log(`Vite: ${baseUrl}`);

    browser = await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: LAUNCH_ARGS,
    });
    const context = await browser.newContext();

    const infoPage = await openAppPage(context, appUrl, 'renderer', consoleErrors);
    const browserInfo = await readBrowserInfo(infoPage, browser);
    await infoPage.close();

    const runs = [];
    for (const slowMotion of [false, true]) {
      runs.push(await captureTrace(context, appUrl, slowMotion, consoleErrors));
    }

    const trace = {
      browser: browserInfo,
      runs,
    };
    const traceText = `${JSON.stringify(trace, null, 2)}\n`;
    const traceBytes = Buffer.byteLength(traceText, 'utf8');
    console.log(`Trace JSON: ${traceBytes} bytes`);
    if (traceBytes > MAX_TRACE_BYTES) {
      throw new Error(`Trace JSON is ${traceBytes} bytes, over the 5 MiB limit`);
    }

    const geometry = await captureGeometry(context, appUrl, browserInfo, consoleErrors);
    const buildEngine = await captureBuildTimes(context, baseUrl, consoleErrors);

    const viewContext = await browser.newContext({
      viewport: { width: VIEW_WIDTH, height: VIEW_HEIGHT },
      deviceScaleFactor: VIEW_DEVICE_SCALE_FACTOR,
    });
    const views = await captureViews(viewContext, appUrl, consoleErrors);

    return {
      browser: browserInfo,
      trace,
      geometry,
      buildEngine,
      views,
      consoleErrors,
    };
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (error) {
        console.error('Failed to close the browser:', error);
      }
    }

    if (server) {
      try {
        await server.close();
      } catch (error) {
        console.error('Failed to close the Vite server:', error);
      }
    }
  }
}

function createMeta(browserInfo) {
  return {
    browser: browserInfo,
    views: VIEW_NAMES,
    viewport: {
      width: VIEW_WIDTH,
      height: VIEW_HEIGHT,
      deviceScaleFactor: VIEW_DEVICE_SCALE_FACTOR,
    },
    pixelRule: {
      channelDifference: PIXEL_CHANNEL_LIMIT,
      maxChangedPixels: VIEW_PIXEL_LIMIT,
    },
  };
}

function printConsoleErrors(errors) {
  if (errors.length > 0) {
    console.log('Console errors:');
    for (const message of errors) {
      console.log(`  ${message}`);
    }
  } else {
    console.log('Console errors: none');
  }
}

const isDirectRun = process.argv[1] !== undefined
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  try {
    const result = await captureBrowser();
    const traceText = `${JSON.stringify(result.trace, null, 2)}\n`;
    const geometryText = `${JSON.stringify(result.geometry, null, 2)}\n`;

    await mkdir(QA_BASELINE_DIR, { recursive: true });
    await writeFile(TRACE_PATH, traceText, 'utf8');
    await writeFile(GEOMETRY_PATH, geometryText, 'utf8');

    for (const name of VIEW_NAMES) {
      await writeFile(path.join(QA_BASELINE_DIR, `${name}.png`), result.views[name]);
    }

    const metaText = `${JSON.stringify(createMeta(result.browser), null, 2)}\n`;
    await writeFile(path.join(QA_BASELINE_DIR, 'meta.json'), metaText, 'utf8');

    console.log(
      `Wrote ${path.relative(ROOT, TRACE_PATH)} (${Buffer.byteLength(traceText, 'utf8')} bytes, ${traceText.split('\n').length - 1} lines)`,
    );
    console.log(
      `Wrote ${path.relative(ROOT, GEOMETRY_PATH)} (${Buffer.byteLength(geometryText, 'utf8')} bytes, ${geometryText.split('\n').length - 1} lines)`,
    );
    for (const name of VIEW_NAMES) {
      console.log(
        `Wrote ${path.relative(ROOT, path.join(QA_BASELINE_DIR, `${name}.png`))} (${result.views[name].length} bytes)`,
      );
    }
    console.log(
      `Wrote ${path.relative(ROOT, path.join(QA_BASELINE_DIR, 'meta.json'))} (${Buffer.byteLength(metaText, 'utf8')} bytes)`,
    );
    console.log(`buildEngine median for the log: ${result.buildEngine.median.toFixed(3)} ms`);
    printConsoleErrors(result.consoleErrors);
  } catch (error) {
    console.error('Browser capture failed:');
    console.error(error);
    process.exitCode = 1;
  }
}
