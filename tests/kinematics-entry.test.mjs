import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import lly from '../src/engines/lly/index.js';
import * as legacy from './helpers/legacy-kinematics.mjs';
import { kinematicsFor } from '../src/engines/families/v8-ohv-kinematics.js';
import { EngineBuilder } from '../src/engines/families/v8-ohv.js';
import { DEG } from '../src/kinematics.js';

const clone = value => Array.isArray(value) ? value.map(clone)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone(item)])) : value;
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);

describe('entry-bound kinematics', () => {
  it('preserves the complete legacy data shape and frozen wrappers for LLY', () => {
    const actual = kinematicsFor(lly);
    for (const [name, old] of Object.entries({
      spec: legacy.LLY, calibrations: legacy.CALIBRATIONS,
      stationZ: legacy.STATION_Z, crankReferenceDeg: legacy.CRANK_REFERENCE_DEG,
      bankZOffset: legacy.BANK_Z_OFFSET, stationThrowOffset: legacy.STATION_THROW_OFFSET,
      cylinders: legacy.CYLINDERS, cylinderByNumber: legacy.CYLINDER_BY_NUMBER,
      firingOrder: legacy.FIRING_ORDER, cylinderByStationBank: legacy.CYLINDER_BY_STATION_BANK,
      valveTiming: legacy.VALVE_TIMING,
    })) assert.deepEqual(actual[name], old, name);
    assert.ok(Object.isFrozen(actual.spec));
    assert.ok(Object.isFrozen(actual.calibrations));
    assert.equal(actual.crankRadiusMm, legacy.LLY.crankRadiusMm);
    assert.equal(actual.rodLengthMm, legacy.LLY.rodLengthMm);
    assert.equal(actual.redlineRpm, legacy.LLY.redlineRpm);
    // Every new binding now requires an explicit entry.
    assert.throws(() => kinematicsFor(), /entry/i);
  });

  it('preserves motion, valve, cylinder-state and active-firing results across cycles', () => {
    const actual = kinematicsFor(lly);
    for (let angle = -720; angle <= 1440; angle += 13) {
      for (const cylinder of actual.cylinders) {
        const old = legacy.CYLINDER_BY_NUMBER.get(cylinder.number);
        assert.equal(actual.pinWorldAngleDeg(cylinder, angle), legacy.pinWorldAngleDeg(old, angle));
        assert.deepEqual(actual.pistonKinematics(cylinder, angle), legacy.pistonKinematics(old, angle));
        assert.deepEqual(actual.crankPinWorld(cylinder, angle), legacy.crankPinWorld(old, angle));
        assert.deepEqual(actual.cylinderState(cylinder, angle), legacy.cylinderState(old, angle));
      }
      for (const type of ['intake', 'exhaust']) {
        assert.equal(actual.valveLift(angle, type), legacy.valveLift(angle, type));
        assert.equal(actual.valveVelocity(angle, type), legacy.valveVelocity(angle, type));
      }
      assert.deepEqual(actual.activeFiringCylinder(angle), legacy.activeFiringCylinder(angle));
    }
  });

  it('reads a changed intake center in calculations and the model valve rows without changing LLY', () => {
    const entry = clone(lly);
    const baseline = kinematicsFor(lly);
    // Synthetic fixture delta, not a researched engine-value change.
    entry.valvetrain.timing.intake.centerDeg += 18;
    const changed = kinematicsFor(entry);
    const center = entry.valvetrain.timing.intake.centerDeg;
    assert.equal(changed.valveLift(center, 'intake'), entry.valvetrain.timing.intake.liftMm);
    assert.notEqual(changed.valveLift(center, 'intake'), baseline.valveLift(center, 'intake'));
    assert.deepEqual(changed.valveTiming.exhaust, baseline.valveTiming.exhaust);
    const rows = EngineBuilder.prototype._prepareValveRows.call({ kinematics: changed });
    for (const row of rows.filter(row => row.type === 'intake')) {
      assert.equal(row.peakCrankDeg, row.cylinder.fireAngle + center);
      near(row.lobeRotation, row.bankAxisRad - row.peakCrankDeg * DEG / 2);
      assert.equal(changed.cylinderState(row.cylinder, row.peakCrankDeg).intakeLift, entry.valvetrain.timing.intake.liftMm);
    }
    entry.valvetrain.timing.intake.centerDeg += 9;
    assert.equal(kinematicsFor(entry).valveTiming.intake.center, center + 9);
    assert.equal(changed.valveTiming.intake.center, center);
    assert.equal(legacy.VALVE_TIMING.intake.center, baseline.valveTiming.intake.center);
  });

  it('uses supplied crank/rod dimensions, bank offsets, labels and station positions', () => {
    const entry = clone(lly);
    // Deliberately distinct fixture geometry exposes accidental reads of the default entry.
    entry.geometry.crankRadiusMm += 3;
    entry.geometry.strokeMm = 2 * entry.geometry.crankRadiusMm;
    entry.geometry.rodLengthMm += 10;
    entry.ratings.redlineRpm += 100;
    entry.layout.stationZmm[0] += 7;
    const right = entry.layout.banks.find(bank => bank.id === 'R');
    right.bankOffsetZmm += 3;
    right.label = 'fixture bank';
    const actual = kinematicsFor(entry);
    const cylinder = actual.cylinderByNumber.get(1);
    assert.equal(cylinder.z, entry.layout.stationZmm[cylinder.station] + right.bankOffsetZmm);
    assert.equal(cylinder.bankLabel, 'fixture bank');
    assert.equal(actual.cylinderByStationBank.get(`${cylinder.station}${cylinder.bank}`), cylinder);
    const top = actual.pistonKinematics(cylinder, cylinder.fireAngle);
    const bottom = actual.pistonKinematics(cylinder, cylinder.fireAngle + 180);
    near(top.wristY, entry.geometry.crankRadiusMm + entry.geometry.rodLengthMm);
    near(bottom.pistonTravelFromTdc, entry.geometry.strokeMm);
    near(Math.hypot(...Object.values(actual.crankPinWorld(cylinder, 0)).slice(0, 2)), entry.geometry.crankRadiusMm);
    assert.equal(actual.redlineRpm, entry.ratings.redlineRpm);
    assert.notEqual(actual.pistonKinematics(cylinder, cylinder.fireAngle + 90).wristY,
      legacy.pistonKinematics(legacy.CYLINDER_BY_NUMBER.get(1), cylinder.fireAngle + 90).wristY);
  });

  it('uses entry calibration keys and layout timing instead of fixed default names', () => {
    const entry = clone(lly);
    const calibration = entry.ratings.calibrations.allison;
    entry.ratings.calibrations = { fixture: calibration };
    entry.layout.banks.find(bank => bank.id === 'R').axisDeg += 5;
    entry.layout.throwOffsetDeg[0] += 9;
    entry.layout.cylinders[0].fireAngleDeg += 10;
    const actual = kinematicsFor(entry);
    assert.deepEqual(Object.keys(actual.calibrations), ['fixture']);
    assert.equal(actual.calibrations.fixture.peakHp, calibration.peakHp);
    const first = actual.cylinderByNumber.get(1);
    assert.equal(actual.pinWorldAngleDeg(first, 23), actual.crankReferenceDeg - entry.layout.throwOffsetDeg[0] - 23);
    assert.equal(actual.activeFiringCylinder(first.fireAngle).cylinder.number, first.number);
    assert.equal(actual.activeFiringCylinder(first.fireAngle).phase, 0);
    assert.deepEqual(Object.keys(legacy.CALIBRATIONS), ['allison', 'zf']);
  });
});
