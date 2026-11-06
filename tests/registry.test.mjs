import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import lly from '../src/engines/lly/index.js';
import {
  DEFAULT_ENGINE_ID,
  ENGINE_IDS,
  installQaHook,
  loadEngine,
  parseEngineParam,
} from '../src/engines/index.js';
import { FAMILY_IDS, REQUIRED_KEYS, validateEntry } from '../src/engines/schema.js';
import {
  CYLINDERS,
  FIRING_ORDER,
  VALVE_TIMING,
  pistonKinematics,
  valveLift,
} from '../src/engines/families/v8-ohv-kinematics.js';
import { PART_IDS } from '../src/engines/families/v8-ohv.js';
import { camshaftAngleDeg } from '../src/kinematics.js';
import { telemetryValues } from '../src/core/telemetry.js';
import { getSpec } from '../src/specs.js';

const near = (actual, expected, tolerance, what) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${what}: ${actual} is not within ${tolerance} of ${expected}`);

function clone(value) {
  if (Array.isArray(value)) return value.map(clone);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone(item)]));
  }
  return value;
}

const cloneEntry = () => clone(lly);

describe('registry and schema', () => {
  it('lists LLY and loads every registered id', async () => {
    assert.deepEqual(ENGINE_IDS, ['lly']);
    for (const id of ENGINE_IDS) {
      const loaded = await loadEngine(id);
      assert.equal(loaded.id, id);
    }
  });

  it('accepts the real entry', () => {
    assert.deepEqual(validateEntry(lly), []);
    assert.equal(REQUIRED_KEYS.length, 22);
    assert.deepEqual(FAMILY_IDS, ['v8-ohv']);
  });

  it('rejects a missing required key', () => {
    const entry = cloneEntry();
    delete entry.dyno;
    assert.ok(validateEntry(entry).some((error) => error.includes('missing required key: dyno')));
  });

  it('rejects a duplicate firing order', () => {
    const entry = cloneEntry();
    entry.layout.firingOrder[1] = entry.layout.firingOrder[0];
    assert.ok(validateEntry(entry).some((error) => error.includes('firingOrder')));
  });

  it('rejects a redline that is not above idle', () => {
    const entry = cloneEntry();
    entry.ratings.redlineRpm = entry.ratings.idleRpm;
    assert.ok(validateEntry(entry).some((error) => error.includes('redlineRpm')));
  });

  it('rejects a calibration peak above redline', () => {
    const entry = cloneEntry();
    entry.ratings.calibrations.zf.peakPowerRpm = entry.ratings.redlineRpm + 1;
    assert.ok(validateEntry(entry).some((error) => error.includes('calibration zf peakPowerRpm')));
  });

  it('rejects NaN numeric values', () => {
    const entry = cloneEntry();
    entry.geometry.boreMm = Number.NaN;
    assert.ok(validateEntry(entry).some((error) => error.includes('geometry.boreMm must be a finite number')));
  });

  it('rejects an unknown family', () => {
    const entry = cloneEntry();
    entry.family = 'unknown';
    assert.ok(validateEntry(entry).some((error) => error.includes('family must be one of')));
  });

  it('rejects a value without a provenance record', () => {
    const entry = cloneEntry();
    delete entry.provenance['geometry.boreMm'];
    assert.ok(validateEntry(entry).some((error) => error.includes('missing provenance record for geometry.boreMm')));
  });

  it('parses engine parameters exactly', () => {
    assert.deepEqual(parseEngineParam(undefined), { id: DEFAULT_ENGINE_ID, requested: null, fallback: false });
    assert.deepEqual(parseEngineParam('?engine='), { id: DEFAULT_ENGINE_ID, requested: null, fallback: false });
    assert.deepEqual(parseEngineParam('?engine=lly'), { id: 'lly', requested: 'lly', fallback: false });
    assert.deepEqual(parseEngineParam('?engine=lbz'), { id: DEFAULT_ENGINE_ID, requested: 'lbz', fallback: true });
    assert.deepEqual(parseEngineParam('?engine=LLY'), { id: DEFAULT_ENGINE_ID, requested: 'LLY', fallback: true });
  });

  it('loads the LLY entry, copy and family', async () => {
    const loaded = await loadEngine('lly');
    assert.equal(loaded.id, 'lly');
    assert.equal(loaded.entry, lly);
    assert.equal(typeof loaded.copy.COMPONENT_CARDS, 'object');
    assert.equal(typeof loaded.family.buildEngine, 'function');
    assert.ok(Array.isArray(loaded.family.PART_IDS));
  });

  it('rejects an unknown id before importing', async () => {
    await assert.rejects(() => loadEngine('nope'), RangeError);
  });

  it('installs both QA names to the same hook', () => {
    const hook = { engine: 'test' };
    const target = {};
    assert.equal(installQaHook(target, hook), hook);
    assert.equal(target.__ENGINE__, hook);
    assert.equal(target.__LLY__, hook);
  });
});

describe('LLY physics', () => {
  it('keeps the family firing order equal to the entry', () => {
    assert.deepEqual(FIRING_ORDER, lly.layout.firingOrder);
  });

  it('spaces every cylinder firing interval at 720 / cylinder count', () => {
    const angles = lly.layout.cylinders.map((cylinder) => cylinder.fireAngleDeg).sort((a, b) => a - b);
    const step = 720 / angles.length;
    for (let index = 0; index < angles.length - 1; index += 1) {
      near(angles[index + 1] - angles[index], step, 1e-9, 'firing interval');
    }
    near(720 - angles[angles.length - 1] + angles[0], step, 1e-9, 'wrapped firing interval');
  });

  it('puts piston TDC on each cylinder fire angle', () => {
    for (const cylinder of CYLINDERS) {
      near(pistonKinematics(cylinder, cylinder.fireAngle).pistonTravelFromTdc, 0, 1e-6, `cylinder ${cylinder.number} TDC`);
    }
  });

  it('never lets a piston rise above TDC', () => {
    for (const cylinder of CYLINDERS) {
      for (let angle = 0; angle <= 720; angle += 0.5) {
        assert.ok(
          pistonKinematics(cylinder, angle).pistonTravelFromTdc >= -1e-9,
          `cylinder ${cylinder.number} above TDC at ${angle} degrees`,
        );
      }
    }
  });

  it('makes the stroke twice the crank radius', () => {
    assert.equal(lly.geometry.strokeMm, 2 * lly.geometry.crankRadiusMm);
  });

  it('turns the cam at half crank speed modulo 360', () => {
    for (let angle = 0; angle <= 720; angle += 1) {
      near(((camshaftAngleDeg(angle) - angle / 2) % 360 + 360) % 360, 0, 1e-12, `cam at ${angle} degrees`);
    }
  });

  it('keeps each valve duration inside the cycle and peaks at its lift', () => {
    for (const [kind, spec] of Object.entries(VALVE_TIMING)) {
      assert.ok(spec.duration > 0 && spec.duration <= 720, `${kind} duration`);
      near(valveLift(spec.center, kind), spec.lift, 1e-12, `${kind} peak lift`);
    }
  });

  it('matches rated torque and horsepower at each calibration peak', () => {
    for (const [key, calibration] of Object.entries(lly.ratings.calibrations)) {
      const torque = telemetryValues(lly, {
        firing: true,
        rpm: calibration.peakTorqueRpm,
        calibration: key,
      });
      const power = telemetryValues(lly, {
        firing: true,
        rpm: calibration.peakPowerRpm,
        calibration: key,
      });
      near(torque.torque, calibration.peakTorqueLbFt, 0.5, `${key} peak torque`);
      near(power.hp, calibration.peakHp, 0.5, `${key} peak power`);
    }
  });

  it('uses four pulses per revolution and bank cadence for the V8', () => {
    assert.equal(lly.audio.pulsesPerRev, lly.layout.cylinders.length / 2);
    assert.equal(lly.audio.bankCadence, true);
  });

  it('has a finite positive walk clearance', () => {
    assert.equal(Number.isFinite(lly.walk.clearanceRadiusM), true);
    assert.ok(lly.walk.clearanceRadiusM > 0);
  });

  it('resolves spec copy for every part id', () => {
    const missing = PART_IDS.filter((id) => !getSpec(id));
    assert.deepEqual(missing, [], `missing spec copy: ${missing.join(', ')}`);
  });
});
