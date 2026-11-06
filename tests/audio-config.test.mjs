import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import lly from '../src/engines/lly/index.js';
import { createAudio } from './helpers/fake-audio.mjs';

describe('audio configuration', () => {
  it('starts the firing and bank oscillators from the base tone', async () => {
    const audio = await createAudio();
    assert.equal(audio.firingOsc.frequency.value, 45.3);
    assert.equal(audio.bankOsc.frequency.value, 22.65);
  });

  it('reads the audio block from the entry', () => {
    assert.deepEqual(lly.audio, {
      baseToneHz: 45.3,
      maxFrameS: 0.2,
      firingAboveRpm: 80,
      pulsesPerRev: 4,
      bankCadence: true,
      turboWhistle: true,
      injectorKnock: true,
    });
  });

  it('does not import the entry into audio.js', async () => {
    const source = await readFile(new URL('../src/audio.js', import.meta.url), 'utf8');
    assert.equal(/from\s+['"][^'"]*engines\/lly/.test(source), false);
  });
});
