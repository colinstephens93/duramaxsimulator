import { chromium } from 'playwright-core';

const DURATION_MS = 500;
const LAUNCH_ARGS = [
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--enable-unsafe-swiftshader',
  '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows',
];

let browser;

try {
  browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: LAUNCH_ARGS,
  });

  const page = await browser.newPage();
  await page.setContent('<!doctype html><html><body><canvas id="probe"></canvas></body></html>');
  await page.bringToFront();

  const result = await page.evaluate(async (durationMs) => {
    const canvas = document.querySelector('#probe');
    const gl = canvas.getContext('webgl2');

    if (!gl) {
      return { webgl2: false, renderer: null, frames: null };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : `unavailable (WEBGL_debug_renderer_info missing; RENDERER=${gl.getParameter(gl.RENDERER)})`;

    const frames = await new Promise((resolve) => {
      let count = 0;
      const start = performance.now();
      const timeout = setTimeout(() => resolve(null), durationMs * 10);

      const tick = (now) => {
        count += 1;
        if (now - start >= durationMs) {
          clearTimeout(timeout);
          resolve(count);
        } else {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    });

    return { webgl2: true, renderer, frames };
  }, DURATION_MS);

  console.log(`Chrome: ${browser.version()}`);
  console.log(`WebGL 2: ${result.webgl2 ? 'yes' : 'no'}`);
  console.log(`Renderer: ${result.renderer ?? 'unavailable'}`);
  console.log(`rAF frames over ${DURATION_MS} ms: ${result.frames ?? 'none'}`);

  if (!result.webgl2 || result.frames === null) {
    process.exitCode = 1;
  }
} catch (error) {
  console.error('WebGL probe failed:');
  console.error(error);
  process.exitCode = 1;
} finally {
  if (browser) {
    await browser.close();
  }
}
