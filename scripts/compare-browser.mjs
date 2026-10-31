import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { captureBrowser } from './capture-browser.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE_DIR = path.join(ROOT, '.qa', 'baseline');
const CURRENT_DIR = path.join(ROOT, '.qa', 'current');
const BASELINE_TRACE = path.join(ROOT, 'tests', 'baseline', 'lly-trace.json');
const BASELINE_GEOMETRY = path.join(ROOT, 'tests', 'baseline', 'lly-geometry.json');

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
const PIXEL_CHANNEL_LIMIT = 8;
const MAX_CHANGED_PIXELS = 1024;

const LAUNCH_ARGS = [
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--enable-unsafe-swiftshader',
  '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows',
];

function firstDifference(actual, expected, pathLabel = '$') {
  if (Object.is(actual, expected)) return null;

  if (actual === null || expected === null || typeof actual !== typeof expected) {
    return `${pathLabel}: ${JSON.stringify(actual)} !== ${JSON.stringify(expected)}`;
  }

  if (Array.isArray(actual) || Array.isArray(expected)) {
    if (!Array.isArray(actual) || !Array.isArray(expected)) {
      return `${pathLabel}: one value is an array and the other is not`;
    }
    if (actual.length !== expected.length) {
      return `${pathLabel}.length: ${actual.length} !== ${expected.length}`;
    }
    for (let index = 0; index < actual.length; index += 1) {
      const difference = firstDifference(actual[index], expected[index], `${pathLabel}[${index}]`);
      if (difference) return difference;
    }
    return null;
  }

  if (typeof actual === 'object' && typeof expected === 'object') {
    const actualKeys = Object.keys(actual);
    const expectedKeys = Object.keys(expected);
    if (actualKeys.length !== expectedKeys.length) {
      return `${pathLabel}: key count ${actualKeys.length} !== ${expectedKeys.length}`;
    }
    for (const key of expectedKeys) {
      if (!Object.hasOwn(actual, key)) {
        return `${pathLabel}.${key}: missing from current`;
      }
      const difference = firstDifference(actual[key], expected[key], `${pathLabel}.${key}`);
      if (difference) return difference;
    }
    for (const key of actualKeys) {
      if (!Object.hasOwn(expected, key)) {
        return `${pathLabel}.${key}: extra in current`;
      }
    }
    return null;
  }

  return `${pathLabel}: ${JSON.stringify(actual)} !== ${JSON.stringify(expected)}`;
}

function dataUrl(buffer) {
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

function createMeta(browserInfo) {
  return {
    browser: browserInfo,
    views: VIEW_NAMES,
    viewport: {
      width: VIEW_WIDTH,
      height: VIEW_HEIGHT,
      deviceScaleFactor: 1,
    },
    pixelRule: {
      channelDifference: PIXEL_CHANNEL_LIMIT,
      maxChangedPixels: MAX_CHANGED_PIXELS,
    },
  };
}

async function baselineReady() {
  try {
    await access(BASELINE_DIR);
  } catch {
    console.error('Missing .qa/baseline. Run npm run baseline:capture first.');
    process.exitCode = 1;
    return false;
  }

  const required = [
    BASELINE_TRACE,
    BASELINE_GEOMETRY,
    ...VIEW_NAMES.map((name) => path.join(BASELINE_DIR, `${name}.png`)),
  ];

  for (const file of required) {
    try {
      await access(file);
    } catch {
      console.error(`Missing ${path.relative(ROOT, file)}. Run npm run baseline:capture first.`);
      process.exitCode = 1;
      return false;
    }
  }

  return true;
}

async function writeCurrent(result) {
  await mkdir(CURRENT_DIR, { recursive: true });

  const traceText = `${JSON.stringify(result.trace, null, 2)}\n`;
  const geometryText = `${JSON.stringify(result.geometry, null, 2)}\n`;
  const metaText = `${JSON.stringify(createMeta(result.browser), null, 2)}\n`;

  await writeFile(path.join(CURRENT_DIR, 'lly-trace.json'), traceText, 'utf8');
  await writeFile(path.join(CURRENT_DIR, 'lly-geometry.json'), geometryText, 'utf8');
  await writeFile(path.join(CURRENT_DIR, 'meta.json'), metaText, 'utf8');

  for (const name of VIEW_NAMES) {
    await writeFile(path.join(CURRENT_DIR, `${name}.png`), result.views[name]);
  }
}

async function compareJson(label, current, baseline) {
  const difference = firstDifference(current, baseline);
  if (difference) {
    console.error(`${label}: FAIL`);
    console.error(`  First difference: ${difference}`);
    return false;
  }

  console.log(`${label}: PASS`);
  return true;
}

async function compareViews(result) {
  const pairs = [];

  for (const name of VIEW_NAMES) {
    const baselineBuffer = await readFile(path.join(BASELINE_DIR, `${name}.png`));
    pairs.push({
      name,
      baseline: dataUrl(baselineBuffer),
      current: dataUrl(result.views[name]),
    });
  }

  let browser;

  try {
    browser = await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: LAUNCH_ARGS,
    });
    const page = await browser.newPage();

    return await page.evaluate(async ({ views, width, height, channelLimit }) => {
      function loadImage(source) {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error('Failed to load a comparison image'));
          image.src = source;
        });
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      const results = [];

      for (const view of views) {
        const [baseline, current] = await Promise.all([
          loadImage(view.baseline),
          loadImage(view.current),
        ]);

        if (baseline.width !== width || baseline.height !== height) {
          throw new Error(`${view.name}: baseline is ${baseline.width}x${baseline.height}, expected ${width}x${height}`);
        }
        if (current.width !== width || current.height !== height) {
          throw new Error(`${view.name}: current is ${current.width}x${current.height}, expected ${width}x${height}`);
        }

        context.clearRect(0, 0, width, height);
        context.drawImage(baseline, 0, 0);
        const baselinePixels = context.getImageData(0, 0, width, height).data;

        context.clearRect(0, 0, width, height);
        context.drawImage(current, 0, 0);
        const currentPixels = context.getImageData(0, 0, width, height).data;

        let changed = 0;
        let differing = 0;
        let largest = 0;
        for (let index = 0; index < baselinePixels.length; index += 4) {
          const red = Math.abs(baselinePixels[index] - currentPixels[index]);
          const green = Math.abs(baselinePixels[index + 1] - currentPixels[index + 1]);
          const blue = Math.abs(baselinePixels[index + 2] - currentPixels[index + 2]);
          const channelDifference = Math.max(red, green, blue);

          if (channelDifference > 0) differing += 1;
          if (channelDifference > channelLimit) changed += 1;
          if (channelDifference > largest) largest = channelDifference;
        }

        results.push({
          name: view.name,
          changed,
          differing,
          largest,
          total: width * height,
        });
      }

      return results;
    }, {
      views: pairs,
      width: VIEW_WIDTH,
      height: VIEW_HEIGHT,
      channelLimit: PIXEL_CHANNEL_LIMIT,
    });
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (error) {
        console.error('Failed to close the comparison browser:', error);
        process.exitCode = 1;
      }
    }
  }
}

async function main() {
  if (!await baselineReady()) return;

  const result = await captureBrowser();
  await writeCurrent(result);

  console.log(`Chrome: ${result.browser.version}`);
  console.log(`Renderer: ${result.browser.renderer}`);

  if (result.consoleErrors.length > 0) {
    console.log('Console errors:');
    for (const message of result.consoleErrors) console.log(`  ${message}`);
  } else {
    console.log('Console errors: none');
  }

  const baselineTrace = JSON.parse(await readFile(BASELINE_TRACE, 'utf8'));
  const baselineGeometry = JSON.parse(await readFile(BASELINE_GEOMETRY, 'utf8'));

  if (
    result.browser.version !== baselineTrace.browser.version
    || result.browser.renderer !== baselineTrace.browser.renderer
  ) {
    console.error('Browser metadata mismatch; skipping pixel comparison.');
    console.error(`  Baseline: ${baselineTrace.browser.version} / ${baselineTrace.browser.renderer}`);
    console.error(`  Current:  ${result.browser.version} / ${result.browser.renderer}`);
    process.exitCode = 1;
    return;
  }

  let passed = true;
  const traceForComparison = JSON.parse(JSON.stringify(result.trace));
  const geometryForComparison = JSON.parse(JSON.stringify(result.geometry));
  passed = await compareJson('Trace', traceForComparison, baselineTrace) && passed;
  passed = await compareJson('Geometry', geometryForComparison, baselineGeometry) && passed;

  const counts = await compareViews(result);
  for (const view of counts) {
    const ok = view.changed <= MAX_CHANGED_PIXELS;
    console.log(
      `${view.name}: ${view.changed} changed (>${PIXEL_CHANNEL_LIMIT}), ${view.differing} differ at all, largest channel delta ${view.largest} (limit ${MAX_CHANGED_PIXELS}) ${ok ? 'PASS' : 'FAIL'}`,
    );
    if (!ok) passed = false;
  }

  if (!passed) process.exitCode = 1;
}

try {
  await main();
} catch (error) {
  console.error('Browser comparison failed:');
  console.error(error);
  process.exitCode = 1;
}
