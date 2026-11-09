// Supported claims: docs/research/lbz.md. Unresearched construction is illustrative.
const card = (id, name, specs = []) => ({
  id, category: 'ENGINE / TEST CELL', eyebrow: 'LBZ · PROCEDURAL MODEL', name,
  material: 'Illustrative model',
  summary: 'Research-backed rated specifications with illustrative construction, motion and appearance. Not OEM service data.',
  specs: [...specs, ['MODEL', 'Illustrative geometry; see accuracy notes']],
});

export function pistonCard(number, bankLabel) {
  return card(`piston-${number}`, `LBZ piston · Cylinder ${number}`, [
    ['CYLINDER', `${number} · ${bankLabel}`], ['BORE', '103.00 mm'],
    ['STROKE', '99.00 mm'], ['COMPRESSION', '16.8:1'],
  ]);
}

export function rodCard(number, bankLabel) {
  return card(`rod-${number}`, `LBZ connecting rod · Cylinder ${number}`, [
    ['CYLINDER', `${number} · ${bankLabel}`], ['CENTRE DISTANCE', '163.0 mm · medium confidence'],
    ['SOURCE LIMIT', '6.6L family listings; not independently measured for LBZ'],
  ]);
}

const ids = ["block","main-caps","crank","camshaft","pistons","rods","cylinder-head-right","cylinder-head-left","valves","valve-bridges","rockers","pushrods","lifters","valvetrain","valve-covers","turbo","intake-manifold","charge-pipes","exhaust-manifold-right","exhaust-manifold-left","up-pipes","egr","cp3","fuel-rails","high-pressure-lines","injectors","glow-plugs","oil-pan","oil-filter","flywheel","front-drive","timing-gears","starter-motor","wiring-harness","exhaust-downpipe","engine-mounts","test-stand","dyno"];
export const COMPONENT_CARDS = Object.fromEntries(ids.map(id => [id,
  card(id, 'LBZ · ' + id.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')),
]));
COMPONENT_CARDS.block = card('block', '6.6L Duramax LBZ', [
  ['DISPLACEMENT', '6,599 cc'], ['CONFIGURATION', '90° V8 · OHV · 32 valves'],
  ['BORE × STROKE', '103 × 99 mm'], ['COMPRESSION', '16.8:1'],
]);
COMPONENT_CARDS.turbo = card('turbo', 'Garrett GT3788VA variable-vane turbo', [
  ['COMPRESSOR', '60.5 / 87.9 mm · 11 blades'], ['TURBINE', '72.2 / 63.2 mm · 13 blades'],
  ['VANE HEIGHT', '12.63 mm'], ['BOOST', '30 psi table value · contested; curve illustrative'],
]);
COMPONENT_CARDS.injectors = card('injectors', 'Bosch common-rail injectors', [
  ['NOZZLE', 'Revised seven-hole design'], ['ACTUATION', 'Sources conflict; research favors solenoid'],
]);
COMPONENT_CARDS.cp3 = card('cp3', 'Bosch CP3.3 high-pressure pump', [
  ['SYSTEM', 'High-pressure common rail'], ['MAXIMUM PRESSURE', '26,000 psi · engine-level rating'],
]);
for (let number = 1; number <= 8; number++) {
  COMPONENT_CARDS[`piston-${number}`] = pistonCard(number, 'See bank label');
  COMPONENT_CARDS[`rod-${number}`] = rodCard(number, 'See bank label');
}

export function engineSummary(firingOrder) {
  return {
    displacement: '6,599 cc / 402.70 CID (derived)', firingOrder,
    peakTorque: '650 / 605 lb-ft @ 1,600 rpm',
    peakPower: '360 hp @ 3,200 / 310 hp @ 3,000 rpm', governed: '3,250 rpm',
  };
}
