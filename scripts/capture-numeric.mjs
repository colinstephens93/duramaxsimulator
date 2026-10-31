import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  BANK_Z_OFFSET,
  CALIBRATIONS,
  CYLINDERS,
  FIRING_ORDER,
  LLY,
  STATION_THROW_OFFSET,
  STATION_Z,
  VALVE_TIMING,
  activeFiringCylinder,
  boostAtRpm,
  camshaftAngleDeg,
  coolantAtRpm,
  crankPinWorld,
  cycleAngle,
  cylinderState,
  egtAtRpm,
  horsepowerAtRpm,
  oilPressureAtRpm,
  pistonKinematics,
  railPressureAtRpm,
  torqueAtRpm,
  valveLift,
  valveVelocity,
  vaneAtRpm,
} from '../src/kinematics.js';

const RPM_START = 0;
const RPM_END = 4000;
const RPM_STEP = 10;
const CRANK_START = 0;
const CRANK_END = 720;
const CRANK_STEP = 2;

function normalize(value, pathLabel = 'baseline') {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new Error(`Non-finite number at ${pathLabel}`);
    }
    return Object.is(value, -0) ? 0 : value;
  }

  if (Array.isArray(value)) {
    return value.map((entry, index) => normalize(entry, `${pathLabel}[${index}]`));
  }

  if (value && typeof value === 'object') {
    const result = {};
    for (const [key, entry] of Object.entries(value)) {
      result[key] = normalize(entry, `${pathLabel}.${key}`);
    }
    return result;
  }

  return value;
}

function withCylinderNumber(value) {
  return { ...value, cylinder: value.cylinder.number };
}

export function captureNumericBaseline() {
  const rpm = [];
  for (let value = RPM_START; value <= RPM_END; value += RPM_STEP) {
    rpm.push(value);
  }

  const crankAngles = [];
  for (let value = CRANK_START; value < CRANK_END; value += CRANK_STEP) {
    crankAngles.push(value);
  }

  const calibrations = {};
  for (const key of Object.keys(CALIBRATIONS)) {
    calibrations[key] = {
      torqueAtRpm: rpm.map((value) => torqueAtRpm(value, key)),
      horsepowerAtRpm: rpm.map((value) => horsepowerAtRpm(value, key)),
      railPressureAtRpm: rpm.map((value) => railPressureAtRpm(value, key)),
    };
  }

  const cylinders = CYLINDERS.map((cylinder) => {
    const cycleAngles = crankAngles.map((angle) => cycleAngle(cylinder, angle));
    const valveLiftByKind = {};
    const valveVelocityByKind = {};

    for (const kind of Object.keys(VALVE_TIMING)) {
      valveLiftByKind[kind] = cycleAngles.map((cycle) => valveLift(cycle, kind));
      valveVelocityByKind[kind] = cycleAngles.map((cycle) => valveVelocity(cycle, kind));
    }

    return {
      number: cylinder.number,
      cycleAngle: cycleAngles,
      pistonKinematics: crankAngles.map((angle) => pistonKinematics(cylinder, angle)),
      crankPinWorld: crankAngles.map((angle) => crankPinWorld(cylinder, angle)),
      cylinderState: crankAngles.map((angle) => withCylinderNumber(cylinderState(cylinder, angle))),
      valveLift: valveLiftByKind,
      valveVelocity: valveVelocityByKind,
    };
  });

  return normalize({
    constants: {
      LLY,
      CALIBRATIONS,
      VALVE_TIMING,
      CYLINDERS,
      FIRING_ORDER,
      STATION_Z,
      BANK_Z_OFFSET,
      STATION_THROW_OFFSET,
    },
    rpm,
    calibrations,
    boostAtRpm: rpm.map((value) => boostAtRpm(value)),
    vaneAtRpm: rpm.map((value) => vaneAtRpm(value)),
    egtAtRpm: rpm.map((value) => egtAtRpm(value)),
    oilPressureAtRpm: rpm.map((value) => oilPressureAtRpm(value)),
    coolantAtRpm: rpm.map((value) => coolantAtRpm(value)),
    crankAngles,
    camshaftAngleDeg: crankAngles.map((angle) => camshaftAngleDeg(angle)),
    activeFiringCylinder: crankAngles.map((angle) => withCylinderNumber(activeFiringCylinder(angle))),
    cylinders,
  });
}

const isDirectRun = process.argv[1] !== undefined
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  const outputPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    'tests',
    'baseline',
    'lly-curves.json',
  );
  const baseline = captureNumericBaseline();
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(baseline, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
}
