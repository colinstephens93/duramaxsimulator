import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const RULES = {
  rendering: 'fixed-step QA render(count), one final composition',
  views: ['home', 'cutaway', 'exploded', 'cutaway-3250', 'exploded-3250', 'walk-start'],
  viewport: { width: 1280, height: 800, deviceScaleFactor: 1 },
  pixelRule: { channelDifference: 8, maxChangedPixels: 1024 },
};
export const ARTIFACTS = ['trace.json', 'geometry.json', ...RULES.views.map(name => `${name}.png`)];
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

export function validateManifest(meta) {
  assert.equal(meta.format, 1, 'Unsupported cloud reference format');
  assert.equal(meta.kind, 'supplemental-cloud', 'Not a cloud reference');
  assert.match(meta.head, /^[a-f0-9]{40}$/, 'Missing capture HEAD');
  assert.ok(meta.browser.version && meta.browser.renderer, 'Missing browser metadata');
  assert.match(meta.chromeSha256, /^[a-f0-9]{64}$/, 'Missing Chrome executable hash');
  assert.deepEqual(meta.rules, RULES, 'Capture rules changed');
  assert.deepEqual(meta.consoleErrors, [], 'Capture contains console/page errors');
  for (const key of ['source', 'harness', 'originals']) {
    assert.ok(Object.keys(meta[key]).length > 0, `Missing ${key} provenance`);
    for (const hash of Object.values(meta[key])) assert.match(hash, /^[a-f0-9]{64}$/);
  }
  assert.deepEqual(Object.keys(meta.artifacts).sort(), [...ARTIFACTS].sort(), 'Incomplete artifact inventory');
  for (const hash of Object.values(meta.artifacts)) assert.match(hash, /^[a-f0-9]{64}$/);
}

export async function readBundle(directory) {
  const meta = JSON.parse(await readFile(path.join(directory, 'meta.json'), 'utf8'));
  validateManifest(meta);
  const files = {};
  for (const name of ARTIFACTS) {
    const bytes = await readFile(path.join(directory, name));
    assert.equal(sha256(bytes), meta.artifacts[name], `Corrupt artifact: ${name}`);
    files[name] = bytes;
  }
  const trace = JSON.parse(files['trace.json']);
  const geometry = JSON.parse(files['geometry.json']);
  assert.deepEqual(trace.browser, meta.browser, 'Trace browser metadata mismatch');
  assert.deepEqual(geometry.browser, meta.browser, 'Geometry browser metadata mismatch');
  assert.deepEqual(trace.runs.map(run => run.timeScale), [1, 0.12], 'Missing trace scenario');
  for (const run of trace.runs) {
    assert.deepEqual(run.stages.map(stage => stage.name), ['stop-initial', 'start-idle-680', 'preset-3250', 'hold-3250', 'stop-final']);
    for (const stage of run.stages) {
      assert.equal(stage.capped, false, `Trace stage capped: ${stage.name}`);
      assert.ok(stage.steps > 0 && stage.steps === stage.samples.length, 'Incomplete trace samples');
    }
  }
  assert.ok(geometry.parts.length > 0, 'Empty geometry');
  return { meta, files, trace, geometry };
}

export function assertCompatible(reference, current, reviewedCaptureChange) {
  validateManifest(reference);
  validateManifest(current);
  const expectedHarness = { ...reference.harness };
  if (reviewedCaptureChange) {
    const [before, after, ...extra] = reviewedCaptureChange.split(':');
    assert.equal(extra.length, 0, 'Use OLD_SHA256:NEW_SHA256 for a reviewed capture change');
    assert.match(before, /^[a-f0-9]{64}$/);
    assert.match(after, /^[a-f0-9]{64}$/);
    assert.notEqual(before, after, 'Reviewed capture change must name two different hashes');
    assert.equal(before, reference.harness['scripts/capture-browser.mjs'], 'Reviewed old capture hash does not match');
    assert.equal(after, current.harness['scripts/capture-browser.mjs'], 'Reviewed new capture hash does not match');
    expectedHarness['scripts/capture-browser.mjs'] = after;
  }
  assert.deepEqual(current.harness, expectedHarness,
    'Capture/runner code changed; review the harness change explicitly before using this reference');
  assert.deepEqual(current.originals, reference.originals, 'Original Windows reference files changed');
  assert.deepEqual(current.browser, reference.browser, 'Chrome version or renderer changed; do not refresh automatically');
  assert.equal(current.chromeSha256, reference.chromeSha256, 'Chrome executable changed');
}

// Runs in a browser so PNG decoding uses no additional dependency.
export async function comparePixels({ pairs, rules }) {
  const canvas = document.createElement('canvas');
  canvas.width = rules.viewport.width;
  canvas.height = rules.viewport.height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  const results = [];
  for (const { name, reference, current } of pairs) {
    const pixels = [];
    for (const url of [reference, current]) {
      const img = new Image();
      img.src = url;
      await img.decode();
      if (img.width !== canvas.width || img.height !== canvas.height) throw Error(`Wrong image dimensions: ${name}`);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);
      pixels.push(context.getImageData(0, 0, canvas.width, canvas.height).data);
    }
    let changed = 0, differing = 0, largest = 0;
    for (let i = 0; i < pixels[0].length; i += 4) {
      const delta = Math.max(...[0, 1, 2].map(c => Math.abs(pixels[0][i + c] - pixels[1][i + c])));
      if (delta > 0) differing++;
      if (delta > rules.pixelRule.channelDifference) changed++;
      largest = Math.max(largest, delta);
    }
    results.push({ name, changed, differing, largest, pass: changed <= rules.pixelRule.maxChangedPixels });
  }
  return results;
}
