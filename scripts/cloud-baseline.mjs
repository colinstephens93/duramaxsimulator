import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { access, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { captureBrowser } from './capture-browser.mjs';
import { ARTIFACTS, RULES, assertCompatible, comparePixels, readBundle, sha256 } from './cloud-regression.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLOUD = path.join(ROOT, '.qa/cloud');
const command = process.argv[2];
const phase6 = command?.endsWith('-phase6');
const REFERENCE = path.join(CLOUD, phase6 ? 'reference-phase6' : 'reference');
const isCapture = command === 'capture' || command === 'capture-phase6';
const options = process.argv.slice(3);
const reviewedOption = options.find(option => option.startsWith('--reviewed-capture-change='));
const reviewedRunnerOption = options.find(option => option.startsWith('--reviewed-runner-change='));
const reviewedRunnerChange = reviewedRunnerOption?.slice('--reviewed-runner-change='.length);
const reviewedCaptureChange = reviewedOption?.startsWith('--reviewed-capture-change=')
  ? reviewedOption.slice('--reviewed-capture-change='.length) : undefined;
const chrome = process.env.CLOUD_CHROME_PATH || '/workspace/chrome-runtime/opt/google/chrome/chrome';
const HARNESS = ['scripts/capture-browser.mjs', 'scripts/cloud-baseline.mjs', 'scripts/cloud-regression.mjs'];
const ORIGINALS = ['tests/baseline/lly-curves.json', 'tests/baseline/lly-trace.json', 'tests/baseline/lly-geometry.json'];
const git = args => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();

async function hashes(names) {
  return Object.fromEntries(await Promise.all(names.map(async name => [name, sha256(await readFile(path.join(ROOT, name)))])));
}

async function provenance() {
  const deletedSource = git(['ls-files', '--deleted', '-z', '--', 'src', 'index.html']).split('\0').filter(Boolean).sort();
  const deleted = new Set(deletedSource);
  const names = git(['ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', 'src', 'index.html']).split('\0').filter(name => name && !deleted.has(name)).sort();
  return {
    head: git(['rev-parse', 'HEAD']),
    deletedSource,
    source: await hashes(names),
    harness: await hashes(HARNESS),
    originals: await hashes(ORIGINALS),
    chromeSha256: sha256(await readFile(chrome)),
  };
}

async function saveCapture(result, before, directory) {
  assert.deepEqual(await provenance(), before, 'Source or capture inputs changed during capture');
  assert.deepEqual(result.consoleErrors, [], 'Console/page errors during capture');
  const files = {
    'trace.json': Buffer.from(JSON.stringify(result.trace, null, 2) + '\n'),
    'geometry.json': Buffer.from(JSON.stringify(result.geometry, null, 2) + '\n'),
    ...Object.fromEntries(RULES.views.map(name => [`${name}.png`, result.views[name]])),
  };
  const meta = {
    format: 1, kind: 'supplemental-cloud', capturedAt: new Date().toISOString(),
    baselinePurpose: phase6 ? '6.6 researched wording and chair clearance' : 'original D15 reference comparison',
    ...before, browser: result.browser, rules: RULES, consoleErrors: result.consoleErrors,
    artifacts: Object.fromEntries(ARTIFACTS.map(name => [name, sha256(files[name])])),
  };
  await mkdir(directory, { recursive: false });
  for (const name of ARTIFACTS) await writeFile(path.join(directory, name), files[name]);
  await writeFile(path.join(directory, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');
  return readBundle(directory);
}

async function reportOriginals(bundle) {
  const reports = {};
  for (const [label, actual, file] of [
    ['trace', bundle.trace, ORIGINALS[1]], ['geometry', bundle.geometry, ORIGINALS[2]],
  ]) {
    const original = JSON.parse(await readFile(path.join(ROOT, file), 'utf8'));
    const { browser: originalBrowser, ...expected } = original;
    const { browser: currentBrowser, ...payload } = actual;
    try {
      assert.deepEqual(payload, expected);
      reports[label] = { payload: 'exact match', originalBrowser, currentBrowser };
    } catch (error) {
      reports[label] = { payload: 'DIFFERS', difference: error.message, originalBrowser, currentBrowser };
    }
    console.log(`Original Windows ${label} payload: ${reports[label].payload} (platform metadata reported separately)`);
  }
  return reports;
}

function reviewedReference(reference, current) {
  if (!reviewedRunnerChange) return reference;
  const [before, after, ...extra] = reviewedRunnerChange.split(':');
  assert.equal(extra.length, 0, 'Use OLD_SHA256:NEW_SHA256 for reviewed runner changes');
  assert.match(before, /^[a-f0-9]{64}$/); assert.match(after, /^[a-f0-9]{64}$/);
  assert.notEqual(before, after);
  assert.equal(before, reference.harness['scripts/cloud-baseline.mjs'], 'Reviewed old runner hash does not match');
  assert.equal(after, current.harness['scripts/cloud-baseline.mjs'], 'Reviewed new runner hash does not match');
  return { ...reference, harness: { ...reference.harness, 'scripts/cloud-baseline.mjs': after } };
}

async function main() {
  assert.ok(['capture', 'compare', 'capture-phase6', 'compare-phase6'].includes(command)
    && (command === 'capture-phase6' ? options.length === 1 && options[0] === '--approved-phase6-recapture'
      : (options.length === 0 || (!isCapture && options.length <= 2
      && new Set(options).size === options.length
      && options.every(option => option === reviewedOption || option === reviewedRunnerOption)))),
    'Usage: capture|compare [exact reviewed hashes], capture-phase6 --approved-phase6-recapture, or compare-phase6. Capture never overwrites a reference.');
  await mkdir(CLOUD, { recursive: true });
  let reference;
  if (isCapture) {
    const exists = await access(REFERENCE).then(() => true, error => { if (error.code === 'ENOENT') return false; throw error; });
    assert.equal(exists, false, 'Reference already exists; capture refuses to overwrite it');
    if (command === 'capture') assert.equal(git(['status', '--porcelain', '--untracked-files=all', '--', 'src', 'index.html']), '',
      'Capture requires unchanged application source; do not capture after implementing a package');
  } else {
    reference = await readBundle(REFERENCE);
  }
  const before = await provenance();
  if (reference) {
    assertCompatible(reviewedReference(reference.meta, { ...reference.meta, ...before }), { ...reference.meta, ...before }, reviewedCaptureChange);
  }
  console.log(`Supplemental cloud ${command}; HEAD ${before.head}`);
  const result = await captureBrowser({ cloud: true, executablePath: chrome });
  const directory = path.join(CLOUD, `run-${Date.now()}-${process.pid}`);
  const current = await saveCapture(result, before, directory);
  const originalReport = await reportOriginals(current);
  await writeFile(path.join(directory, 'original-comparison.json'), JSON.stringify(originalReport, null, 2) + '\n');
  if (isCapture) {
    await rename(directory, REFERENCE);
    console.log('Cloud reference captured. Run compare for an independent repeatability check before using it.');
    return;
  }
  assertCompatible(reviewedReference(reference.meta, current.meta), current.meta, reviewedCaptureChange);
  assert.deepEqual(current.trace, reference.trace, 'Cloud trace changed');
  console.log('Cloud trace: exact PASS');
  assert.deepEqual(current.geometry, reference.geometry, 'Cloud geometry changed');
  console.log('Cloud geometry: exact PASS');
  let browser;
  let pixels;
  try {
    browser = await chromium.launch({ executablePath: chrome, headless: true });
    const page = await browser.newPage();
    pixels = await page.evaluate(comparePixels, { rules: RULES, pairs: RULES.views.map(name => ({
      name,
      reference: `data:image/png;base64,${reference.files[`${name}.png`].toString('base64')}`,
      current: `data:image/png;base64,${current.files[`${name}.png`].toString('base64')}`,
    })) });
  } finally { await browser?.close(); }
  for (const view of pixels) console.log(`${view.name}: ${view.changed} changed (>8), ${view.differing} differ, max delta ${view.largest}: ${view.pass ? 'PASS' : 'FAIL'}`);
  const report = { reviewedRunnerChange: reviewedRunnerChange ?? null, reviewedCaptureChange: reviewedCaptureChange ?? null, reference: reference.meta.artifacts, current: current.meta.artifacts, pixels, originals: originalReport };
  await writeFile(path.join(directory, 'comparison.json'), JSON.stringify(report, null, 2) + '\n');
  assert.ok(pixels.every(view => view.pass), 'Cloud view regression; reference was not modified');
  console.log(`Cloud regression: PASS; evidence in ${path.relative(ROOT, directory)}. Original Windows acceptance remains outstanding.`);
}

try { await main(); } catch (error) {
  console.error(`Cloud regression failed: ${error.message}`);
  process.exitCode = 1;
}
