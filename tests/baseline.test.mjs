// Exact equality between the checked-in numeric baseline and a fresh capture.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { captureNumericBaseline } from '../scripts/capture-numeric.mjs';

const baselineUrl = new URL('./baseline/lly-curves.json', import.meta.url);

describe('numeric baseline', () => {
  it('matches the captured LLY curves and kinematics', async () => {
    const stored = JSON.parse(await readFile(baselineUrl, 'utf8'));
    assert.deepStrictEqual(stored, captureNumericBaseline());
  });
});
