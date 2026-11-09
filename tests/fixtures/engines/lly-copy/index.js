import lly from '../../../../src/engines/lly/index.js';

// Synthetic swap fixture only. No value here is a claim about a real engine.
// Strip the lazy function before cloning so no mutable data is shared with LLY.
const { copy: _copy, provenance: _provenance, ...data } = lly;
const entry = structuredClone(data);

entry.id = 'lly-copy';
Object.assign(entry.identity, {
  name: 'Synthetic LLY swap fixture',
  shortName: 'LLY COPY',
  code: 'LLY-COPY',
  years: 'TEST ONLY',
  accuracy: 'design',
  assembly: 'Synthetic test cell',
  sceneName: 'Synthetic LLY copy',
});

Object.assign(entry.ratings, {
  idleRpm: 720,
  redlineRpm: 3500,
  peakTorqueRpm: 1800,
  peakPowerRpm: 3100,
  peakTorqueLbFt: 700,
  peakHp: 400,
  defaultCalibration: 'zf',
  presets: [
    { rpm: 0, label: 'STOP' },
    { rpm: 720, label: 'COPY IDLE', toast: 'SYNTHETIC IDLE' },
    { rpm: 1800, label: 'COPY TQ', toast: 'SYNTHETIC TORQUE' },
    { rpm: 3100, label: 'COPY HP', toast: 'SYNTHETIC POWER' },
    { rpm: 3500, label: 'COPY LIMIT', toast: 'SYNTHETIC LIMIT' },
  ],
});
for (const [id, peakTorqueLbFt, peakHp, maxRailPsi] of [
  ['allison', 700, 400, 28000],
  ['zf', 600, 360, 24000],
]) {
  Object.assign(entry.ratings.calibrations[id], {
    label: `Synthetic ${id} calibration`,
    shortLabel: `COPY ${id.toUpperCase()}`,
    modelYears: 'TEST ONLY',
    peakTorqueLbFt, peakHp, maxRailPsi,
    peakTorqueRpm: 1800,
    peakPowerRpm: 3100,
  });
  entry.curves.torque.points[id] = [
    [0, 0], [720, peakTorqueLbFt * 0.6], [1800, peakTorqueLbFt],
    [3100, peakHp * 5252 / 3100], [3500, peakTorqueLbFt * 0.7],
  ];
}

entry.curves.rail.scaleTo = 28000;
entry.curves.rail.points = [[0, 0], [720, 8000], [1800, 22000], [3500, 28000]];
entry.curves.boost.capPsi = 27;
entry.curves.boost.points = [[120, 0], [720, 1], [1800, 21], [3100, 27], [3500, 25]];
entry.curves.vane.points = [[500, 85], [720, 80], [1800, 45], [3500, 18]];
Object.assign(entry.curves.egt, { base: 240, span: 540, atRpm: 3500 });
Object.assign(entry.curves.oil, { base: 24, span: 40 });
Object.assign(entry.curves.coolant, { base: 89, span: 5, atRpm: 3500 });

entry.ui.title = 'Synthetic LLY Copy — Test Cell';
entry.ui.description = 'Synthetic engine fixture for runtime switching tests; not OEM data.';
entry.ui.canvasAria = 'Synthetic LLY copy engine simulation';
entry.ui.header.brandHtml = 'SYNTHETIC<span>COPY</span>';
entry.ui.header.brandSub = 'LLY COPY · TEST ONLY';
entry.ui.header.title = 'COPY // RUN CELL';
entry.ui.walk.engineLabel = 'LLY COPY';
entry.ui.telemetry.boostTitle = 'SYNTHETIC BOOST';
entry.ui.telemetry.chartAxis = ['0', '900', '1800', '2700', '3500 RPM'];
for (const id of Object.keys(entry.ratings.calibrations)) {
  entry.ui.calibration[id] = { button: `COPY ${id.toUpperCase()}`, tipName: `Synthetic ${id} calibration` };
}
Object.assign(entry.ui.display, { tachRedBandRpm: 3100, governedLabelRpm: 3500 });
Object.assign(entry.ui.specSheet, {
  title: 'SYNTHETIC LLY COPY',
  peakTorque: '700 / 600 lb-ft @ 1,800 (design)',
  peakPower: '400 / 360 hp @ 3,100 (design)',
  governedSpeed: '3,500 RPM (design)',
  footnote: 'Synthetic swap fixture. All values are design data; no OEM claims.',
});
Object.assign(entry.ui.branding, {
  signMain: 'COPY', signSub: 'SYNTHETIC TEST CELL',
  floorLabel: 'COPY / TEST ONLY', consoleHeader: 'COPY // TEST CELL',
  consoleFooter: 'SYNTHETIC DATA', standMain: 'COPY', standSub: 'TEST FIXTURE BEDPLATE',
});
Object.assign(entry.ui.capture, { caption: 'SYNTHETIC LLY COPY', place: 'TEST ONLY', fileStem: 'lly-copy-test' });
Object.assign(entry.ui.help, { eyebrow: 'SYNTHETIC FIXTURE GUIDE', footerLeft: 'TEST ONLY', footerRight: 'LLY COPY' });

// A subtree record covers every inherited and changed value, without OEM citations.
entry.provenance = Object.fromEntries(Object.keys(entry).map(key => [key, 'design']));
entry.copy = () => import('./copy.js');

export default entry;
