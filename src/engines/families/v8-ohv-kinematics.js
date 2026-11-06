import lly from '../lly/index.js';
import { DEG, cycleAngle, strokeAtCycle, wrapSignedDeg } from '../../kinematics.js';

export const LLY = Object.freeze({
  name: lly.identity.name,
  rpo: lly.identity.code,
  displacementCc: lly.geometry.displacementCc,
  displacementCid: lly.geometry.displacementCid,
  configuration: lly.identity.configuration,
  boreMm: lly.geometry.boreMm,
  strokeMm: lly.geometry.strokeMm,
  crankRadiusMm: lly.geometry.crankRadiusMm,
  rodLengthMm: lly.geometry.rodLengthMm,
  boreStrokeRatio: lly.geometry.boreStrokeRatio,
  compressionRatio: lly.geometry.compressionRatio,
  firingOrder: lly.layout.firingOrder,
  idleRpm: lly.ratings.idleRpm,
  peakTorqueRpm: lly.ratings.peakTorqueRpm,
  peakHpRpm: lly.ratings.peakPowerRpm,
  redlineRpm: lly.ratings.redlineRpm,
  peakTorqueLbFt: lly.ratings.peakTorqueLbFt,
  peakHp: lly.ratings.peakHp,
  valvesPerCylinder: lly.valvetrain.valvesPerCylinder,
  totalValves: lly.valvetrain.totalValves,
  oilCapacityQt: lly.oil.capacityUsQt,
  massLb: lly.geometry.massLb,
  envelopeIn: lly.geometry.envelopeIn,
  assembly: lly.identity.assembly,
});

export const CALIBRATIONS = Object.freeze({
  allison: {
    id: lly.ratings.calibrations.allison.id,
    label: lly.ratings.calibrations.allison.label,
    shortLabel: lly.ratings.calibrations.allison.shortLabel,
    peakTorqueLbFt: lly.ratings.calibrations.allison.peakTorqueLbFt,
    peakHp: lly.ratings.calibrations.allison.peakHp,
    maxRailPsi: lly.ratings.calibrations.allison.maxRailPsi,
    compressionRatio: lly.ratings.calibrations.allison.compressionRatio,
  },
  zf: {
    id: lly.ratings.calibrations.zf.id,
    label: lly.ratings.calibrations.zf.label,
    shortLabel: lly.ratings.calibrations.zf.shortLabel,
    peakTorqueLbFt: lly.ratings.calibrations.zf.peakTorqueLbFt,
    peakHp: lly.ratings.calibrations.zf.peakHp,
    maxRailPsi: lly.ratings.calibrations.zf.maxRailPsi,
    compressionRatio: lly.ratings.calibrations.zf.compressionRatio,
  },
});

// Longitudinal station centers, front (+Z) to rear (−Z), in millimetres.
export const STATION_Z = lly.layout.stationZmm;
export const CRANK_REFERENCE_DEG = lly.layout.banks.find((bank) => bank.id === 'R').axisDeg;
// Each bore is slightly offset fore/aft between banks to package paired rods.
export const BANK_Z_OFFSET = {
  R: lly.layout.banks.find((bank) => bank.id === 'R').bankOffsetZmm,
  L: lly.layout.banks.find((bank) => bank.id === 'L').bankOffsetZmm,
};

// Crank throw phase offsets (degrees) which place each bank's TDC on its
// prescribed firing event while retaining a four-throw cross-plane crank.
export const STATION_THROW_OFFSET = lly.layout.throwOffsetDeg;

// Cylinder bank numbering is the production Duramax convention.
//Looking forward from the flywheel (−Z) toward the front cover (+Z) with +Y up:
// 1,3,5,7 = passenger (right-hand, −X) bank -> +45° Three.js Z rotation (135° polar axis)
// 2,4,6,8 = driver (left-hand, +X) bank -> −45° Three.js Z rotation (45° polar axis)
export const CYLINDERS = lly.layout.cylinders
  .map((cylinder) => ({
    number: cylinder.number,
    bank: cylinder.bank,
    station: cylinder.station,
    fireAngle: cylinder.fireAngleDeg,
    bankLabel: lly.layout.banks.find((bank) => bank.id === cylinder.bank).label,
  }))
  .map((cylinder) => {
    const bank = lly.layout.banks.find((candidate) => candidate.id === cylinder.bank);
    return {
      ...cylinder,
      id: `cyl-${cylinder.number}`,
      z: STATION_Z[cylinder.station] + BANK_Z_OFFSET[cylinder.bank],
      throwOffset: STATION_THROW_OFFSET[cylinder.station],
      bankRotationDeg: bank.rotationDeg,
      bankAxisDeg: bank.axisDeg,
    };
  });

export const CYLINDER_BY_NUMBER = new Map(CYLINDERS.map((c) => [c.number, c]));
export const FIRING_ORDER = CYLINDERS.slice().sort((a, b) => a.fireAngle - b.fireAngle).map((c) => c.number);
export const CYLINDER_BY_STATION_BANK = new Map(CYLINDERS.map((c) => [`${c.station}${c.bank}`, c]));

/**
 * World-space crank pin angle for a station.
 * At 0° crank rotation, station 0's pin is aligned with the right/passenger bank
 * (135° in world XY), producing cylinder 1 compression TDC, and rotates
 * clockwise when viewed from the front (+Z).
 */
export function pinWorldAngleDeg(cylinder, crankDeg) {
  return CRANK_REFERENCE_DEG - cylinder.throwOffset - crankDeg;
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

export const VALVE_TIMING = {
  intake: {
    center: lly.valvetrain.timing.intake.centerDeg,
    duration: lly.valvetrain.timing.intake.durationDeg,
    lift: lly.valvetrain.timing.intake.liftMm,
  },
  exhaust: {
    center: lly.valvetrain.timing.exhaust.centerDeg,
    duration: lly.valvetrain.timing.exhaust.durationDeg,
    lift: lly.valvetrain.timing.exhaust.liftMm,
  },
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
