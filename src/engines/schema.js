export const FAMILY_IDS = ['v8-ohv'];

export const REQUIRED_KEYS = [
  'id',
  'family',
  'identity',
  'layout',
  'geometry',
  'valvetrain',
  'features',
  'ratings',
  'curves',
  'turbo',
  'telemetry',
  'startSequence',
  'audio',
  'inspect',
  'walk',
  'dyno',
  'look',
  'explode',
  'oil',
  'ui',
  'provenance',
  'copy',
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function visitNumbers(value, pathLabel, visit, options = {}) {
  if (typeof value === 'function') return;
  if (typeof value === 'number') {
    visit(pathLabel, value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => visitNumbers(item, `${pathLabel}.${index}`, visit, options));
    return;
  }
  if (isObject(value)) {
    for (const [key, item] of Object.entries(value)) {
      if (options.skipCurves && pathLabel === '' && key === 'curves' && isObject(item)) {
        for (const [curveName, curve] of Object.entries(item)) {
          visitNumbers(curve, `curves.${curveName}`, visit, { ...options, curveBody: true });
        }
      } else {
        visitNumbers(item, pathLabel ? `${pathLabel}.${key}` : key, visit, options);
      }
    }
  }
}

function collectValuePaths(entry) {
  const values = [];
  for (const [key, value] of Object.entries(entry)) {
    if (key === 'provenance') continue;
    if (key === 'curves' && isObject(value)) {
      for (const curveName of Object.keys(value)) values.push(`curves.${curveName}`);
      continue;
    }
    visitNumbers(value, key, (pathLabel) => values.push(pathLabel));
  }
  return values;
}

function pathCovers(recordPath, valuePath) {
  return valuePath === recordPath || valuePath.startsWith(`${recordPath}.`);
}

export function validateEntry(entry) {
  const errors = [];
  if (!isObject(entry)) return ['entry must be an object'];

  for (const key of REQUIRED_KEYS) {
    if (!Object.hasOwn(entry, key)) errors.push(`missing required key: ${key}`);
  }
  if (typeof entry.copy !== 'function') errors.push('copy must be a function');
  if (typeof entry.id !== 'string' || entry.id.length === 0) errors.push('id must be a non-empty string');
  if (!FAMILY_IDS.includes(entry.family)) errors.push(`family must be one of: ${FAMILY_IDS.join(', ')}`);

  for (const [key, value] of Object.entries(entry)) {
    if (key === 'provenance') continue;
    visitNumbers(value, key, (pathLabel, number) => {
      if (!Number.isFinite(number)) errors.push(`${pathLabel} must be a finite number`);
    }, { skipCurves: key === 'curves' });
  }

  const cylinders = entry.layout?.cylinders;
  const firingOrder = entry.layout?.firingOrder;
  if (!Array.isArray(cylinders) || !Array.isArray(firingOrder)) {
    errors.push('layout.cylinders and layout.firingOrder must be arrays');
  } else {
    const numbers = cylinders.map((cylinder) => cylinder?.number);
    const expected = new Set(numbers);
    const actual = new Set(firingOrder);
    if (numbers.includes(undefined) || firingOrder.length !== numbers.length
      || actual.size !== firingOrder.length || expected.size !== actual.size
      || [...expected].some((number) => !actual.has(number))) {
      errors.push('layout.firingOrder must be each cylinder number used once');
    }
  }

  const idleRpm = entry.ratings?.idleRpm;
  const redlineRpm = entry.ratings?.redlineRpm;
  if (!(idleRpm > 0)) errors.push('ratings.idleRpm must be above 0');
  if (!(redlineRpm > idleRpm)) errors.push('ratings.redlineRpm must be above ratings.idleRpm');

  const calibrations = entry.ratings?.calibrations;
  if (!isObject(calibrations)) {
    errors.push('ratings.calibrations must be an object');
  } else {
    for (const [key, calibration] of Object.entries(calibrations)) {
      for (const field of ['peakTorqueRpm', 'peakPowerRpm']) {
        const rpm = calibration?.[field];
        if (!(rpm > idleRpm)) errors.push(`calibration ${key} ${field} must be above ratings.idleRpm`);
        else if (!(rpm <= redlineRpm)) errors.push(`calibration ${key} ${field} must be no higher than ratings.redlineRpm`);
      }
    }
  }

  if (!isObject(entry.provenance)) {
    errors.push('provenance must be an object');
  } else {
    const recordPaths = Object.keys(entry.provenance);
    for (const valuePath of collectValuePaths(entry)) {
      if (!recordPaths.some((recordPath) => pathCovers(recordPath, valuePath))) {
        errors.push(`missing provenance record for ${valuePath}`);
      }
    }
  }

  return errors;
}
