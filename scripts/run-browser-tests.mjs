import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const server = await createServer({ root, mode: 'test', logLevel: 'error', server: { host: '127.0.0.1', port: 0 } });
const report = { date: new Date().toISOString(), viewport: { width: 800, height: 500 }, tests: [] };
let browser;
try {
  await server.listen();
  const url = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({
    ...(process.env.TEST_CHROME_PATH ? { executablePath: process.env.TEST_CHROME_PATH } : { channel: 'chrome' }),
    headless: true,
    args: ['--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
  });
  report.browser = browser.version();
  const files = (await readdir(path.join(root, 'tests/browser'))).filter(file => file.endsWith('.browser.mjs') && (!process.env.TEST_BROWSER_FILTER || file.includes(process.env.TEST_BROWSER_FILTER))).sort();
  if (!files.length) throw new Error('No browser tests found');
  for (const file of files) {
    const page = await browser.newPage({ viewport: report.viewport, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    // QA drives measured frames explicitly; preserve native rAF for swap loading paint.
    await page.addInitScript(() => {
      const native = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = callback => callback.name === 'animate' ? 0 : native(callback);
    });
    const open = async (search = '?qa=1') => {
      await page.goto(url + '/' + search, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.__ENGINE__ && document.getElementById('bootStatus')?.classList.contains('done'), undefined, { timeout: 60000 });
      const renderer = await page.evaluate(() => {
        const gl = window.__ENGINE__.renderer.getContext();
        if (!(gl instanceof WebGL2RenderingContext)) throw new Error('WebGL 2 required');
        const info = gl.getExtension('WEBGL_debug_renderer_info');
        return gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER);
      });
      report.renderer = renderer;
    };
    try {
      const test = await import(pathToFileURL(path.join(root, 'tests/browser', file)).href);
      const details = await test.default({ page, open, url });
      if (errors.length) throw new Error(errors.join('\n'));
      report.tests.push({ file, pass: true, errors, details });
      console.log(`${file}: PASS ${JSON.stringify(details ?? {})}`);
    } catch (error) {
      report.tests.push({ file, pass: false, errors, error: error.stack });
      throw error;
    } finally { await page.close(); }
  }
  console.log(`Browser tests: ${files.length} pass; Chrome ${report.browser}; ${report.renderer}`);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser?.close();
  await server.close();
  const directory = path.join(root, '.qa/browser');
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, `run-${Date.now()}.json`), JSON.stringify(report, null, 2) + '\n');
}
