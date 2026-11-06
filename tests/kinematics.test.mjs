// The mechanical model in src/kinematics.js and src/engines/families/v8-ohv-kinematics.js:
// layout, firing order, exact crank-slider motion, valve timing, calibration points and cam-driven valve rows.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DEG, camshaftAngleDeg, mod } from '../src/kinematics.js';
import {
  CALIBRATIONS,
  CYLINDERS,
  FIRING_ORDER,
  LLY,
  VALVE_TIMING,
  cylinderState,
  pistonKinematics,
  valveLift,
} from '../src/engines/families/v8-ohv-kinematics.js';
import lly from '../src/engines/lly/index.js';
import {
  horsepowerAtRpm,
  railPressureAtRpm,
  torqueAtRpm,
} from '../src/core/telemetry.js';
import { EngineBuilder, LOBE_LIFT } from '../src/engines/families/v8-ohv.js';

const near = (actual, expected, tolerance, what) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${what}: ${actual} is not within ${tolerance} of ${expected}`);

describe('engine layout', () => {
  it('fires 1-2-7-8-4-5-6-3 at an even 90-degree spacing over 720 degrees', () => {
    assert.deepEqual(FIRING_ORDER, [1, 2, 7, 8, 4, 5, 6, 3]);
    assert.deepEqual(FIRING_ORDER, LLY.firingOrder);
    const angles = CYLINDERS.map((c) => c.fireAngle).sort((a, b) => a - b);
    assert.deepEqual(angles, [0, 90, 180, 270, 360, 450, 540, 630]);
  });

  it('puts 1-3-5-7 on the passenger bank and 2-4-6-8 on the driver bank', () => {
    const bank = (side) => CYLINDERS.filter((c) => c.bank === side).map((c) => c.number).sort((a, b) => a - b);
    assert.deepEqual(bank('R'), [1, 3, 5, 7]);
    assert.deepEqual(bank('L'), [2, 4, 6, 8]);
  });

  it('displaces 6,599 cc from the bore and stroke', () => {
    const cc = ((Math.PI / 4) * LLY.boreMm ** 2 * LLY.strokeMm * CYLINDERS.length) / 1000;
    near(cc, LLY.displacementCc, 1, 'displacement (cc)');
    near(cc / 16.387064, LLY.displacementCid, 0.15, 'displacement (cu in)');
  });
});

describe('crank-slider kinematics', () => {
  it('uses a crank throw of half the stroke', () => {
    near(LLY.crankRadiusMm * 2, LLY.strokeMm, 1e-9, 'stroke');
  });

  for (const c of CYLINDERS) {
    it(`cylinder ${c.number}: TDC on its fire angle, a 99 mm stroke, never above TDC`, () => {
      const topDeadCentre = pistonKinematics(c, c.fireAngle);
      const bottomDeadCentre = pistonKinematics(c, c.fireAngle + 180);
      near(topDeadCentre.pistonTravelFromTdc, 0, 1e-9, 'travel at TDC');
      near(topDeadCentre.wristY, LLY.crankRadiusMm + LLY.rodLengthMm, 1e-9, 'wrist pin height at TDC');
      near(bottomDeadCentre.pistonTravelFromTdc, LLY.strokeMm, 1e-9, 'travel at BDC');
      near(bottomDeadCentre.wristY, LLY.rodLengthMm - LLY.crankRadiusMm, 1e-9, 'wrist pin height at BDC');
      for (let angle = 0; angle < 720; angle += 1) {
        const travel = pistonKinematics(c, angle).pistonTravelFromTdc;
        assert.ok(travel > -1e-9 && travel < LLY.strokeMm + 1e-9, `travel ${travel} at ${angle} degrees`);
      }
    });
  }

  it('keeps exactly two cylinders in each stroke at every crank angle', () => {
    for (let angle = 0; angle < 720; angle += 5) {
      const counts = { POWER: 0, EXHAUST: 0, INTAKE: 0, COMPRESSION: 0 };
      for (const c of CYLINDERS) counts[cylinderState(c, angle).stroke] += 1;
      assert.deepEqual(counts, { POWER: 2, EXHAUST: 2, INTAKE: 2, COMPRESSION: 2 }, `at ${angle} degrees`);
    }
  });
});

describe('valve timing', () => {
  it('turns the cam at exactly half crank speed', () => {
    assert.equal(camshaftAngleDeg(720), 360);
    assert.equal(camshaftAngleDeg(90), 45);
  });

  for (const kind of ['intake', 'exhaust']) {
    it(`${kind} valve lifts only inside its duration and peaks at its centre`, () => {
      const { center, duration, lift } = VALVE_TIMING[kind];
      near(valveLift(center, kind), lift, 1e-9, 'peak lift');
      assert.equal(valveLift(center + duration / 2 + 0.01, kind), 0);
      assert.equal(valveLift(center - duration / 2 - 0.01, kind), 0);
      assert.ok(valveLift(center + duration / 2 - 1, kind) > 0);
      assert.ok(valveLift(center - duration / 2 + 1, kind) > 0);
    });
  }
});

describe('cam-driven valve rows (the geometry the engine animates)', () => {
  // The real lobe phasing from EngineBuilder, called with a stand-in `this` because building the
  // engine itself needs a browser.
  const rows = EngineBuilder.prototype._prepareValveRows.call({});
  const TAU = Math.PI * 2;

  // Mirrors the lobe-contact lift in EngineBuilder.update().
  const lobeLift = (row, crankDeg) => {
    const camRad = crankDeg * 0.5 * DEG;
    let delta = row.bankAxisRad - (camRad + row.lobeRotation);
    while (delta > Math.PI) delta -= TAU;
    while (delta < -Math.PI) delta += TAU;
    if (Math.abs(delta) >= row.halfWidthCam) return 0;
    return LOBE_LIFT * Math.cos((Math.PI * delta) / (2 * row.halfWidthCam)) ** 2;
  };

  it('has an intake and an exhaust row for each of the 8 cylinders', () => {
    assert.equal(rows.length, 16);
    for (const c of CYLINDERS) {
      assert.deepEqual(rows.filter((r) => r.cylinder === c).map((r) => r.type).sort(), ['exhaust', 'intake']);
    }
  });

  for (const row of rows) {
    it(`cylinder ${row.cylinder.number} ${row.type}: peaks at fire angle + centre and opens for its duration`, () => {
      let peak = -1;
      let peakAt = 0;
      let open = 0;
      for (let angle = 0; angle < 720; angle += 0.25) {
        const lift = lobeLift(row, angle);
        if (lift > peak) {
          peak = lift;
          peakAt = angle;
        }
        if (lift > 1e-4) open += 0.25;
      }
      const expectedPeak = mod(row.cylinder.fireAngle + row.timing.center, 720);
      const off = Math.abs(mod(peakAt - expectedPeak + 360, 720) - 360); // circular distance on the 720-degree cycle
      assert.ok(off <= 0.5, `peaks at ${peakAt} degrees, expected ${expectedPeak}`);
      near(open, row.timing.duration, 1, 'open window (degrees)');
      near(peak, LOBE_LIFT, 0.01, 'peak lobe lift (mm)');
    });
  }
});

describe('calibration curves hit the quoted spec points', () => {
  for (const [key, calibration] of Object.entries(CALIBRATIONS)) {
    it(calibration.label, () => {
      near(torqueAtRpm(lly, lly.ratings.calibrations[key].peakTorqueRpm, key), calibration.peakTorqueLbFt, 0.5, 'torque at the torque speed (lb-ft)');
      near(horsepowerAtRpm(lly, lly.ratings.calibrations[key].peakPowerRpm, key), calibration.peakHp, 0.5, 'power at the power speed (hp)');
      near(railPressureAtRpm(lly, LLY.redlineRpm, key), calibration.maxRailPsi, 0.01, 'rail pressure at the governor (psi)');
    });
  }
});
