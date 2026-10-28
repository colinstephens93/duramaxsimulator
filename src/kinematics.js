export const LLY = Object.freeze({
  name: '6.6L Duramax 6600',
  rpo: 'LLY',
  displacementCc: 6599,
  displacementCid: 402.62,
  configuration: '90° V8',
  boreMm: 103.0,
  strokeMm: 99.0,
  crankRadiusMm: 49.5,
  rodLengthMm: 184.0,
  boreStrokeRatio: 1.04,
  compressionRatio: '17.5:1 (2004–05) / 16.8:1 (2006)',
  firingOrder: [1, 2, 7, 8, 4, 5, 6, 3],
  idleRpm: 680,
  peakTorqueRpm: 1600,
  peakHpRpm: 3000,
  redlineRpm: 3250,
  peakTorqueLbFt: 605,
  peakHp: 310,
  valvesPerCylinder: 4,
  totalValves: 32,
  oilCapacityQt: 10,
  massLb: 835,
  envelopeIn: [30.0, 30.0, 32.0],
  assembly: 'DMAX, Moraine, Ohio',
});

export const CALIBRATIONS = Object.freeze({
  allison: {
    id: 'allison',
    label: 'Allison 1000 6-Spd Auto',
    shortLabel: 'ALLISON 1000 AUTO',
    peakTorqueLbFt: 605,
    peakHp: 310,
    maxRailPsi: 26000,
    compressionRatio: '16.8:1 (2006 Auto)',
  },
  zf: {
    id: 'zf',
    label: 'ZF S6-650 6-Spd Manual',
    shortLabel: 'ZF S6-650 MANUAL',
    peakTorqueLbFt: 520,
    peakHp: 300,
    maxRailPsi: 23000,
    compressionRatio: '17.5:1 (2004.5–05 Manual)',
  },
});

// Longitudinal station centers, front (+Z) to rear (−Z), in millimetres.
export const STATION_Z = [196, 66, -66, -196];
// Each bore is slightly offset fore/aft between banks to package paired rods.
export const BANK_Z_OFFSET = { R: 30, L: -30 };

// Crank throw phase offsets (degrees) which place each bank's TDC on its
// prescribed firing event while retaining a four-throw cross-plane crank.
export const STATION_THROW_OFFSET = [0, 90, 270, 180];

// Cylinder bank numbering is the production Duramax convention.
//Looking forward from the flywheel (−Z) toward the front cover (+Z) with +Y up:
// 1,3,5,7 = passenger (right-hand, −X) bank -> +45° Three.js Z rotation (135° polar axis)
// 2,4,6,8 = driver (left-hand, +X) bank -> −45° Three.js Z rotation (45° polar axis)
export const CYLINDERS = [
  { number: 1, bank: 'R', station: 0, fireAngle: 0, bankLabel: 'Passenger (Right)' },
  { number: 2, bank: 'L', station: 0, fireAngle: 90, bankLabel: 'Driver (Left)' },
  { number: 3, bank: 'R', station: 1, fireAngle: 630, bankLabel: 'Passenger (Right)' },
  { number: 4, bank: 'L', station: 1, fireAngle: 360, bankLabel: 'Driver (Left)' },
  { number: 5, bank: 'R', station: 2, fireAngle: 450, bankLabel: 'Passenger (Right)' },
  { number: 6, bank: 'L', station: 2, fireAngle: 540, bankLabel: 'Driver (Left)' },
  { number: 7, bank: 'R', station: 3, fireAngle: 180, bankLabel: 'Passenger (Right)' },
  { number: 8, bank: 'L', station: 3, fireAngle: 270, bankLabel: 'Driver (Left)' },
].map((c) => ({
  ...c,
  id: `cyl-${c.number}`,
  z: STATION_Z[c.station] + BANK_Z_OFFSET[c.bank],
  throwOffset: STATION_THROW_OFFSET[c.station],
  bankRotationDeg: c.bank === 'R' ? 45 : -45,
  bankAxisDeg: c.bank === 'R' ? 135 : 45,
}));

export const CYLINDER_BY_NUMBER = new Map(CYLINDERS.map((c) => [c.number, c]));
export const FIRING_ORDER = CYLINDERS.slice().sort((a, b) => a.fireAngle - b.fireAngle).map((c) => c.number);
export const CYLINDER_BY_STATION_BANK = new Map(CYLINDERS.map((c) => [`${c.station}${c.bank}`, c]));

export const DEG = Math.PI / 180;
export const RAD = 180 / Math.PI;

export function mod(a, n) {
  return ((a % n) + n) % n;
}

export function wrapSignedDeg(angle, period = 720) {
  let a = mod(angle, period);
  if (a > period / 2) a -= period;
  return a;
}

/**
 * World-space crank pin angle for a station.
 * At 0° crank rotation, station 0's pin is aligned with the right/passenger bank
 * (135° in world XY), producing cylinder 1 compression TDC, and rotates
 * clockwise when viewed from the front (+Z).
 */
export function pinWorldAngleDeg(cylinder, crankDeg) {
  return 135 - cylinder.throwOffset - crankDeg;
}

/**
 * Exact crank-slider solution in the bank plane.
 * Returns wrist-pin radial distance from the crank centre line.
 */
export function pistonKinematics(cylinder, crankDeg) {
  const pinAngle = pinWorldAngleDeg(cylinder, crankDeg) * DEG;
  const axisAngle = cylinder.bankAxisDeg * DEG;
  const relative = pinAngle - axisAngle;
  const along = LLY.crankRadiusMm * Math.cos(relative);
  const lateral = LLY.crankRadiusMm * Math.sin(relative);
  const wristY = along + Math.sqrt(LLY.rodLengthMm ** 2 - lateral ** 2);
  // Orientation of a +Y aligned connecting rod in bank-local space.
  const rodAngle = Math.atan2(lateral, wristY - along);
  return {
    pinAngle,
    pinAlong: along,
    pinLateral: lateral,
    wristY,
    rodAngle,
    pistonTravelFromTdc: LLY.crankRadiusMm + LLY.rodLengthMm - wristY,
  };
}

export function crankPinWorld(cylinder, crankDeg, radius = LLY.crankRadiusMm) {
  const a = pinWorldAngleDeg(cylinder, crankDeg) * DEG;
  return { x: Math.cos(a) * radius, y: Math.sin(a) * radius, z: STATION_Z[cylinder.station] };
}

/**
 * Four-stroke cycle in degrees after the compression/ignition TDC.
 * 0–180 power, 180–360 exhaust, 360–540 intake, 540–720 compression.
 */
export function cycleAngle(cylinder, crankDeg) {
  return mod(crankDeg - cylinder.fireAngle, 720);
}

export function strokeAtCycle(cycle) {
  if (cycle < 180) return 'POWER';
  if (cycle < 360) return 'EXHAUST';
  if (cycle < 540) return 'INTAKE';
  return 'COMPRESSION';
}

export const STROKE_COLORS = {
  POWER: '#ff9637',
  EXHAUST: '#8e8175',
  INTAKE: '#6bb5d8',
  COMPRESSION: '#d8c56b',
};

export const VALVE_TIMING = {
  intake: { center: 450, duration: 230, lift: 10.9 },
  exhaust: { center: 270, duration: 224, lift: 10.4 },
};

/** Smooth cam-like valve lift (mm) for a four-stroke cycle angle (deg). */
export function valveLift(cycle, kind) {
  const spec = VALVE_TIMING[kind];
  const delta = wrapSignedDeg(cycle - spec.center, 720);
  if (Math.abs(delta) >= spec.duration / 2) return 0;
  const c = Math.cos((Math.PI * delta) / spec.duration);
  return Math.max(0, spec.lift * c * c);
}

export function valveVelocity(cycle, kind) {
  const h = 0.35;
  return (valveLift(cycle + h, kind) - valveLift(cycle - h, kind)) / (2 * h);
}

export function cylinderState(cylinder, crankDeg) {
  const cycle = cycleAngle(cylinder, crankDeg);
  const kin = pistonKinematics(cylinder, crankDeg);
  const intakeLift = valveLift(cycle, 'intake');
  const exhaustLift = valveLift(cycle, 'exhaust');
  const stroke = strokeAtCycle(cycle);
  const distanceToTdc = Math.min(cycle, 720 - cycle);
  const preTdc = cycle > 700 ? (cycle - 700) / 20 : 0;
  const postTdc = cycle < 30 ? 1 - cycle / 30 : 0;
  const injection = Math.max(
    cycle > 702 ? Math.sin(((cycle - 702) / 18) * Math.PI) : 0,
    cycle < 5 ? 1 - cycle / 5 : 0,
  );
  const combustion = cycle < 48 ? Math.pow(1 - cycle / 48, 1.7) : 0;
  const firing = distanceToTdc < 7;
  return {
    cylinder,
    crankAngle: crankDeg,
    cycle,
    stroke,
    intakeLift,
    exhaustLift,
    injection: Math.max(0, injection),
    combustion,
    firing,
    preTdc,
    postTdc,
    distanceToTdc,
    ...kin,
  };
}

export function camshaftAngleDeg(crankDeg) {
  return crankDeg * 0.5;
}

/**
 * Correct LLY injection/firing event order for a given crank angle.
 * Used by the telemetry UI to light the sequence display.
 */
export function activeFiringCylinder(crankDeg) {
  let best = null;
  let bestCycle = Infinity;
  for (const c of CYLINDERS) {
    const cycle = cycleAngle(c, crankDeg);
    const d = Math.min(cycle, 720 - cycle);
    if (d < bestCycle) {
      bestCycle = d;
      best = c;
    }
  }
  return { cylinder: best, phase: bestCycle };
}

/** LLY gross torque curve, calibrated for Allison 1000 (605 lb-ft / 310 hp) or ZF S6-650 (520 lb-ft / 300 hp). */
export function torqueAtRpm(rpm, calibration = 'allison') {
  if (rpm < 40) return 0;
  const x = Math.max(0, rpm);
  const points =
    calibration === 'zf'
      ? [
          [0, 0],
          [400, 220],
          [680, 370],
          [900, 445],
          [1200, 495],
          [1600, 520],
          [1900, 520],
          [2200, 520],
          [2500, 522],
          [2700, 524],
          [3000, 525.2],
          [3150, 505],
          [3250, 488],
        ]
      : [
          [0, 0],
          [400, 250],
          [680, 425],
          [900, 510],
          [1200, 575],
          [1600, 605],
          [1900, 598],
          [2200, 586],
          [2500, 568],
          [2700, 557],
          [3000, 543],
          [3150, 526],
          [3250, 512],
        ];
  for (let i = 1; i < points.length; i++) {
    if (x <= points[i][0]) {
      const [x0, y0] = points[i - 1];
      const [x1, y1] = points[i];
      const t = (x - x0) / (x1 - x0);
      const s = t * t * (3 - 2 * t);
      return y0 + (y1 - y0) * s;
    }
  }
  return points[points.length - 1][1];
}

export function horsepowerAtRpm(rpm, calibration = 'allison') {
  return (torqueAtRpm(rpm, calibration) * rpm) / 5252;
}

export function railPressureAtRpm(rpm, calibration = 'allison') {
  if (rpm < 25) return 0;
  const scale = calibration === 'zf' ? 23000 / 26000 : 1;
  const points = [
    [0, 0],
    [250, 4400],
    [680, 7100],
    [1000, 12400],
    [1600, 19800],
    [2200, 23800],
    [3000, 25900],
    [3250, 26000],
  ];
  for (let i = 1; i < points.length; i++) {
    if (rpm <= points[i][0]) {
      const [x0, y0] = points[i - 1];
      const [x1, y1] = points[i];
      const t = (rpm - x0) / (x1 - x0);
      const s = t * t * (3 - 2 * t);
      return (y0 + (y1 - y0) * s) * scale;
    }
  }
  return 26000 * scale;
}

export function boostAtRpm(rpm) {
  if (rpm < 120) return 0;
  const points = [
    [120, 0],
    [680, 0.6],
    [1000, 4.4],
    [1300, 11.2],
    [1600, 17.0],
    [2000, 20.2],
    [2600, 22.2],
    [3000, 23.0],
    [3250, 21.6],
  ];
  for (let i = 1; i < points.length; i++) {
    if (rpm <= points[i][0]) {
      const [x0, y0] = points[i - 1];
      const [x1, y1] = points[i];
      const t = (rpm - x0) / (x1 - x0);
      const s = t * t * (3 - 2 * t);
      return y0 + (y1 - y0) * s;
    }
  }
  return 21.6;
}

export function vaneAtRpm(rpm) {
  if (rpm < 30) return 0;
  const points = [
    [500, 82],
    [680, 78],
    [1000, 65],
    [1600, 47],
    [2200, 34],
    [3000, 22],
    [3250, 20],
  ];
  if (rpm <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i++) {
    if (rpm <= points[i][0]) {
      const [x0, y0] = points[i - 1];
      const [x1, y1] = points[i];
      const t = (rpm - x0) / (x1 - x0);
      return Math.round(y0 + (y1 - y0) * t);
    }
  }
  return 20;
}

export function egtAtRpm(rpm) {
  if (rpm < 30) return 38;
  return Math.round(232 + 510 * Math.pow(Math.min(1, rpm / 3250), 0.72));
}

export function oilPressureAtRpm(rpm) {
  if (rpm < 20) return 0;
  return Math.round(22 + 38 * Math.min(1, rpm / 1800));
}

export function coolantAtRpm(rpm) {
  return Math.round(88 + Math.min(1, rpm / 3250) * 4);
}
