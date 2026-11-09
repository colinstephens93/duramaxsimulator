import { it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

it('phase-6 capture requires explicit approval and unknown options fail before browser work', () => {
  const script=fileURLToPath(new URL('../scripts/cloud-baseline.mjs',import.meta.url));
  for (const args of [['capture-phase6'],['capture-phase6','--wrong'],['compare-phase6','--wrong']]) {
    assert.throws(() => execFileSync(process.execPath,[script,...args],{encoding:'utf8',stdio:'pipe'}), error => {
      assert.equal(error.status,1);
      assert.match(error.stderr,/Usage:/);
      return true;
    });
  }
});
