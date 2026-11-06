import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import lly from '../src/engines/lly/index.js';
import {
  boostAtRpm,
  coolantAtRpm,
  egtAtRpm,
  horsepowerAtRpm,
  oilPressureAtRpm,
  railPressureAtRpm,
  telemetryValues,
  torqueAtRpm,
  vaneAtRpm,
} from '../src/core/telemetry.js';

const calibration = 'allison';
const gates = lly.telemetry.gates;
const notFiring = lly.telemetry.notFiring;

const withCurve = (name, patch) => ({
  ...lly,
  curves: {
    ...lly.curves,
    [name]: { ...lly.curves[name], ...patch },
  },
});

describe('telemetry gates', () => {
  it('torque and horsepower are zero at the torque gate', () => {
    const values = telemetryValues(lly, {
      firing: true,
      rpm: gates.torqueHpMinRpm,
      calibration,
    });
    assert.equal(values.torque, 0);
    assert.equal(values.hp, 0);
  });

  it('torque and horsepower are zero at peak power when not firing', () => {
    const values = telemetryValues(lly, {
      firing: false,
      rpm: lly.ratings.peakPowerRpm,
      calibration,
    });
    assert.equal(values.torque, 0);
    assert.equal(values.hp, 0);
  });

  it('torque and horsepower are above zero just past the gate', () => {
    const values = telemetryValues(lly, {
      firing: true,
      rpm: gates.torqueHpMinRpm + 1,
      calibration,
    });
    assert.ok(values.torque > 0);
    assert.ok(values.hp > 0);
  });

  it('rail, boost and oil are zero when not firing; EGT uses the not-firing formula', () => {
    const rpm = lly.ratings.peakPowerRpm;
    const values = telemetryValues(lly, { firing: false, rpm, calibration });
    assert.equal(values.rail, 0);
    assert.equal(values.boost, 0);
    assert.equal(values.oil, 0);
    assert.equal(values.egt, notFiring.egtBase + Math.max(0, rpm) * notFiring.egtPerRpm);
  });

  it('vane is zero at its gate and above zero just past it without firing', () => {
    const atGate = telemetryValues(lly, {
      firing: false,
      rpm: gates.vaneMinRpm,
      calibration,
    });
    const pastGate = telemetryValues(lly, {
      firing: false,
      rpm: gates.vaneMinRpm + 1,
      calibration,
    });
    assert.equal(atGate.vane, 0);
    assert.ok(pastGate.vane > 0);
  });

  it('coolant uses the not-firing value at its gate', () => {
    const values = telemetryValues(lly, {
      firing: false,
      rpm: gates.coolantMinRpm,
      calibration,
    });
    assert.equal(values.coolant, notFiring.coolant);
  });

  it('caps boost at the entry cap', () => {
    const modified = withCurve('boost', { capPsi: 20 });
    const values = telemetryValues(modified, {
      firing: true,
      rpm: lly.ratings.peakPowerRpm,
      calibration,
    });
    assert.equal(values.boost, modified.curves.boost.capPsi);
  });

  it('lets rail show without firing when its flag is false', () => {
    const modified = {
      ...lly,
      telemetry: {
        ...lly.telemetry,
        gates: { ...gates, railRequiresFiring: false },
      },
    };
    const rpm = lly.curves.rail.points[1][0];
    const values = telemetryValues(modified, { firing: false, rpm, calibration });
    assert.equal(values.rail, railPressureAtRpm(lly, rpm, calibration));
    assert.ok(values.rail > 0);
  });

  it('returns the documented key order', () => {
    const values = telemetryValues(lly, {
      firing: false,
      rpm: gates.coolantMinRpm,
      calibration,
    });
    assert.deepEqual(Object.keys(values), [
      'torque', 'hp', 'rail', 'boost', 'vane', 'egt', 'oil', 'coolant', 'firing',
    ]);
  });
});

describe('curves read the entry', () => {
  it('reads the EGT base', () => {
    const rpm = lly.ratings.peakPowerRpm;
    const modified = withCurve('egt', { base: lly.curves.egt.base + 1 });
    assert.equal(egtAtRpm(modified, rpm), egtAtRpm(lly, rpm) + 1);
  });

  it('reads the oil base', () => {
    const rpm = lly.ratings.peakPowerRpm;
    const modified = withCurve('oil', { base: lly.curves.oil.base + 1 });
    assert.equal(oilPressureAtRpm(modified, rpm), oilPressureAtRpm(lly, rpm) + 1);
  });

  it('reads the coolant base', () => {
    const rpm = lly.ratings.peakPowerRpm;
    const modified = withCurve('coolant', { base: lly.curves.coolant.base + 1 });
    assert.equal(coolantAtRpm(modified, rpm), coolantAtRpm(lly, rpm) + 1);
  });

  it('reads the torque point at peak torque', () => {
    const rpm = lly.ratings.peakTorqueRpm;
    const points = lly.curves.torque.points[calibration].map(([x, y]) => [
      x,
      x === rpm ? y + lly.curves.torque.zeroBelowRpm : y,
    ]);
    const modified = withCurve('torque', {
      points: { ...lly.curves.torque.points, [calibration]: points },
    });
    assert.equal(
      torqueAtRpm(modified, rpm, calibration),
      torqueAtRpm(lly, rpm, calibration) + lly.curves.torque.zeroBelowRpm,
    );
  });

  it('reads the rail scale', () => {
    const rpm = lly.curves.rail.points[1][0];
    const modified = withCurve('rail', { scaleTo: lly.curves.rail.scaleTo / 2 });
    const base = railPressureAtRpm(lly, rpm, calibration);
    assert.equal(
      railPressureAtRpm(modified, rpm, calibration),
      base * lly.curves.rail.scaleTo / modified.curves.rail.scaleTo,
    );
  });

  it('reads a gate', () => {
    const modified = {
      ...lly,
      telemetry: {
        ...lly.telemetry,
        gates: { ...gates, torqueHpMinRpm: gates.torqueHpMinRpm - 1 },
      },
    };
    const values = telemetryValues(modified, {
      firing: true,
      rpm: gates.torqueHpMinRpm,
      calibration,
    });
    assert.ok(values.torque > 0);
  });
});

describe('curve helpers', () => {
  it('uses the entry tables and formulas at representative points', () => {
    const rpm = lly.ratings.peakPowerRpm;
    assert.ok(torqueAtRpm(lly, rpm, calibration) > 0);
    assert.ok(horsepowerAtRpm(lly, rpm, calibration) > 0);
    assert.ok(railPressureAtRpm(lly, rpm, calibration) > 0);
    assert.ok(boostAtRpm(lly, rpm) > 0);
    assert.ok(vaneAtRpm(lly, rpm) > 0);
    assert.ok(egtAtRpm(lly, rpm) > 0);
    assert.ok(oilPressureAtRpm(lly, rpm) > 0);
    assert.ok(coolantAtRpm(lly, rpm) > 0);
  });
});
