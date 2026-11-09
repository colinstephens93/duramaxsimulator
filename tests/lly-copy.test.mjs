import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import lly from '../src/engines/lly/index.js';
import copy from './fixtures/engines/lly-copy/index.js';
import { ENGINE_IDS, isEngineId, loadEngine, parseEngineParam } from '../src/engines/index.js';
import { validateEntry } from '../src/engines/schema.js';
import { torqueAtRpm, horsepowerAtRpm, railPressureAtRpm, boostAtRpm } from '../src/core/telemetry.js';

describe('synthetic LLY copy', () => {
  it('validates and labels every data subtree as design without source citations', () => {
    assert.deepEqual(validateEntry(copy), []);
    for (const key of Object.keys(copy)) {
      if (key !== 'provenance' && key !== 'copy') assert.equal(copy.provenance[key], 'design', key);
    }
    assert.ok(Object.values(copy.provenance).every(record => record === 'design'));
  });

  it('preserves the complete mechanical layout, geometry, timing and appearance', () => {
    for (const key of ['family', 'layout', 'geometry', 'valvetrain', 'look', 'explode']) {
      assert.deepEqual(copy[key], lly[key], key);
    }
  });

  it('shares no mutable data with the real entry', () => {
    function independent(actual, original) {
      if (actual === null || typeof actual !== 'object') return;
      assert.notEqual(actual, original);
      for (const key of Object.keys(actual)) independent(actual[key], original?.[key]);
    }
    independent(copy, lly);
    const before = lly.layout.cylinders[0].number;
    try {
      copy.layout.cylinders[0].number = 99;
      assert.equal(lly.layout.cylinders[0].number, before);
    } finally {
      copy.layout.cylinders[0].number = before;
    }
  });

  it('changes identity, limits, calibration labels, peaks and default', () => {
    assert.equal(copy.id, 'lly-copy');
    assert.notEqual(copy.identity.shortName, lly.identity.shortName);
    for (const key of ['idleRpm', 'redlineRpm', 'peakTorqueRpm', 'peakPowerRpm', 'peakTorqueLbFt', 'peakHp', 'defaultCalibration']) {
      assert.notEqual(copy.ratings[key], lly.ratings[key], key);
    }
    assert.ok(Object.hasOwn(copy.ratings.calibrations, copy.ratings.defaultCalibration));
    for (const [id, calibration] of Object.entries(copy.ratings.calibrations)) {
      for (const key of ['label', 'shortLabel', 'peakTorqueLbFt', 'peakHp', 'maxRailPsi']) {
        assert.notEqual(calibration[key], lly.ratings.calibrations[id][key], `${id}.${key}`);
      }
      assert.equal(copy.ratings.presets.at(-1).rpm, copy.ratings.redlineRpm);
    }
  });

  it('evaluates distinct curves and reaches each synthetic rated torque peak', () => {
    for (const key of Object.keys(lly.curves)) assert.notDeepEqual(copy.curves[key], lly.curves[key], key);
    for (const [id, calibration] of Object.entries(copy.ratings.calibrations)) {
      assert.equal(torqueAtRpm(copy, calibration.peakTorqueRpm, id), calibration.peakTorqueLbFt);
      assert.ok(Math.abs(horsepowerAtRpm(copy, calibration.peakPowerRpm, id) - calibration.peakHp) < 1e-10);
      assert.notEqual(torqueAtRpm(copy, 1800, id), torqueAtRpm(lly, 1800, id));
      assert.notEqual(railPressureAtRpm(copy, 1800, id), railPressureAtRpm(lly, 1800, id));
    }
    assert.notEqual(boostAtRpm(copy, 1800), boostAtRpm(lly, 1800));
  });

  it('supplies distinct spec cards while preserving component and cylinder IDs', async () => {
    const fixture = await copy.copy(), original = await lly.copy();
    assert.deepEqual(Object.keys(fixture.COMPONENT_CARDS), Object.keys(original.COMPONENT_CARDS));
    for (const [id, card] of Object.entries(fixture.COMPONENT_CARDS)) {
      assert.notEqual(card.name, original.COMPONENT_CARDS[id].name);
      assert.match(card.summary, /Synthetic/);
      assert.notEqual(card.specs, original.COMPONENT_CARDS[id].specs);
      assert.notEqual(card.specs[0], original.COMPONENT_CARDS[id].specs[0]);
    }
    for (const factory of ['pistonCard', 'rodCard']) {
      const card = fixture[factory](3, 'Right');
      assert.equal(card.id, original[factory](3, 'Right').id);
      assert.match(card.name, /Synthetic/);
    }
    const summary = fixture.engineSummary('test order');
    assert.equal(summary.firingOrder, 'test order');
    assert.match(summary.peakTorque, /700.*1,800/);
    assert.match(summary.peakPower, /400.*3,100/);
    assert.notEqual(copy.ui.title, lly.ui.title);
    assert.notEqual(copy.ui.specSheet.title, lly.ui.specSheet.title);
  });

  it('remains unavailable through the normal Node registry and URL parser', async () => {
    assert.deepEqual(ENGINE_IDS, ['lly', 'lbz']);
    assert.equal(isEngineId('lly-copy'), false);
    assert.deepEqual(parseEngineParam('?engine=lly-copy'), { id: 'lly', requested: 'lly-copy', fallback: true });
    await assert.rejects(loadEngine('lly-copy'), /Unknown engine id/);
  });
});
