import { it } from 'node:test';
import assert from 'node:assert/strict';
import lbz from '../src/engines/lbz/index.js';
import lly from '../src/engines/lly/index.js';
import { validateEntry } from '../src/engines/schema.js';
import { torqueAtRpm, horsepowerAtRpm } from '../src/core/telemetry.js';
import { kinematicsFor } from '../src/engines/families/v8-ohv-kinematics.js';
import { PART_IDS } from '../src/engines/families/v8-ohv.js';

it('LBZ validates with explicit provenance and documented design substitutions', () => {
  assert.deepEqual(validateEntry(lbz), []);
  assert.equal(lbz.id, 'lbz');
  assert.equal(lbz.geometry.rodLengthMm, 163);
  assert.equal(lbz.provenance['geometry.rodLengthMm'].confidence, 'medium');
  assert.match(lbz.provenance['geometry.rodLengthMm'].note, /family/i);
  assert.equal(lbz.provenance['valvetrain.timing'].label, 'design');
  assert.equal(lbz.provenance['turbo.boostPeakPsi'].status, 'contested');
  assert.notEqual(lbz.layout, lly.layout);
});

it('LBZ keeps sourced stroke and turbo dimensions and uses its own rod length', () => {
  assert.equal(lbz.geometry.strokeMm, 99);
  assert.equal(lbz.geometry.boreMm, 103);
  assert.equal(lbz.turbo.compressorInducerMm, 60.5);
  assert.equal(lbz.turbo.vaneHeightMm, 12.63);
  const k = kinematicsFor(lbz);
  for (const cylinder of k.cylinders) {
    const top = k.pistonKinematics(cylinder, cylinder.fireAngle);
    assert.ok(Object.values(top).filter(value => typeof value === 'number').every(Number.isFinite));
  }
  assert.equal(lly.geometry.rodLengthMm, 184);
});

it('LBZ curves hit each calibration’s researched torque and power ratings', () => {
  assert.deepEqual(Object.keys(lbz.ratings.calibrations), ['allison','kodiak']);
  for (const [id, rating] of Object.entries(lbz.ratings.calibrations)) {
    assert.equal(torqueAtRpm(lbz,rating.peakTorqueRpm,id),rating.peakTorqueLbFt);
    assert.ok(Math.abs(horsepowerAtRpm(lbz,rating.peakPowerRpm,id)-rating.peakHp)<1e-10);
    const points=lbz.curves.torque.points[id];
    assert.ok(points.every(([rpm],i)=>i===0||rpm>points[i-1][0]));
  }
});

it('LBZ copy covers every part and distinguishes sourced specs from illustrative geometry', async () => {
  const copy = await lbz.copy();
  assert.deepEqual(PART_IDS.filter(id => !copy.COMPONENT_CARDS[id]), []);
  assert.match(copy.rodCard(1,'Right').specs.flat().join(' '), /family listings/);
  assert.match(copy.COMPONENT_CARDS.turbo.specs.flat().join(' '), /contested/);
  assert.match(copy.engineSummary('order').peakPower, /360.*3,200.*310.*3,000/);
});
