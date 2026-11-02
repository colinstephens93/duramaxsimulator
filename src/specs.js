import { CYLINDER_BY_NUMBER } from './kinematics.js';
import lly from './engines/lly/index.js';
import { COMPONENT_CARDS, pistonCard, rodCard, engineSummary } from './engines/lly/copy.js';

const specsByNumber = {};
for (const c of CYLINDER_BY_NUMBER.values()) {
  specsByNumber[`piston-${c.number}`] = pistonCard(c.number, c.bankLabel);
  specsByNumber[`rod-${c.number}`] = rodCard(c.number, c.bankLabel);
}

export const COMPONENT_SPECS = { ...COMPONENT_CARDS, ...specsByNumber };

export function getSpec(id, cylinderNumber = null) {
  if (!id) return null;
  let spec = COMPONENT_SPECS[id];
  if (!spec && id.startsWith('piston-')) spec = specsByNumber[id];
  if (!spec && id.startsWith('rod-')) spec = specsByNumber[id];
  if (!spec && id === 'cylinder-head-right') spec = COMPONENT_SPECS['cylinder-head-right'];
  if (spec && spec.specs) {
    // A little dynamic accuracy for the two compression ratios.
    spec = { ...spec, specs: spec.specs.map(([k, v]) => [k, v]) };
  }
  return spec;
}

export const INSPECTABLE_IDS = Object.keys(COMPONENT_SPECS);
export const ENGINE_SPEC_SUMMARY = engineSummary(lly.layout.firingOrder.join('-'));
