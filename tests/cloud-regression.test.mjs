import { it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { ARTIFACTS, RULES, assertCompatible, readBundle, sha256, validateManifest } from '../scripts/cloud-regression.mjs';

function manifest() {
  return {
    format: 1, kind: 'supplemental-cloud', head: 'a'.repeat(40),
    browser: { version: '157', renderer: 'test renderer' },
    chromeSha256: sha256('chrome'), rules: structuredClone(RULES), consoleErrors: [],
    source: { 'src/main.js': sha256('source') },
    harness: { 'scripts/capture-browser.mjs': sha256('capture') },
    originals: { 'tests/baseline/lly-trace.json': sha256('original') },
    artifacts: Object.fromEntries(ARTIFACTS.map(name => [name, sha256(name)])),
  };
}

it('rejects missing views, changed thresholds and captured browser errors', () => {
  for (const mutate of [
    meta => { delete meta.artifacts['home.png']; },
    meta => { meta.rules.pixelRule.maxChangedPixels++; },
    meta => { meta.consoleErrors.push('uncaught error'); },
    meta => { meta.source = {}; },
  ]) {
    const meta = manifest(); mutate(meta);
    assert.throws(() => validateManifest(meta));
  }
});

it('rejects stale harness, changed browser, changed original data and changed executable', () => {
  const reference = manifest();
  for (const mutate of [
    meta => { meta.harness['scripts/capture-browser.mjs'] = sha256('changed'); },
    meta => { meta.browser.version = '158'; },
    meta => { meta.browser.renderer = 'different renderer'; },
    meta => { meta.originals['tests/baseline/lly-trace.json'] = sha256('changed'); },
    meta => { meta.chromeSha256 = sha256('changed'); },
  ]) {
    const current = structuredClone(reference); mutate(current);
    assert.throws(() => assertCompatible(reference, current));
  }
});

it('allows application changes to be measured without changing reference provenance', () => {
  const reference = manifest();
  const current = structuredClone(reference);
  current.source['src/main.js'] = sha256('new implementation');
  current.head = 'b'.repeat(40);
  assert.doesNotThrow(() => assertCompatible(reference, current));
  assert.equal(reference.source['src/main.js'], sha256('source'));
});

it('requires exact reviewed capture hashes and still rejects unrelated harness changes', () => {
  const reference = manifest();
  const current = structuredClone(reference);
  current.harness['scripts/capture-browser.mjs'] = sha256('planned import migration');
  const review = `${reference.harness['scripts/capture-browser.mjs']}:${current.harness['scripts/capture-browser.mjs']}`;
  assert.doesNotThrow(() => assertCompatible(reference, current, review));
  assert.throws(() => assertCompatible(reference, current, `${sha256('wrong')}:${sha256('wrong')}`));
  current.harness['scripts/cloud-baseline.mjs'] = sha256('unreviewed runner change');
  assert.throws(() => assertCompatible(reference, current, review));
});

it('rejects corrupt and missing artifacts before launching a capture', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'cloud-regression-'));
  try {
    await writeFile(path.join(directory, 'meta.json'), JSON.stringify(manifest()));
    await writeFile(path.join(directory, 'trace.json'), 'corrupt');
    await assert.rejects(readBundle(directory), /Corrupt artifact: trace.json/);
    await rm(path.join(directory, 'trace.json'));
    await assert.rejects(readBundle(directory), /ENOENT/);
  } finally { await rm(directory, { recursive: true }); }
});
