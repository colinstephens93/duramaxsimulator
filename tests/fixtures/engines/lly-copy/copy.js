import * as base from '../../../../src/engines/lly/copy.js';

function fixtureCard(card) {
  const cloned = structuredClone(card);
  return {
    ...cloned,
    name: `Synthetic copy · ${card.name}`,
    summary: 'Synthetic swap fixture. Retained mechanical dimensions are design data, not OEM specifications.',
    specs: [
      ...cloned.specs,
      ['DATA', 'TEST ONLY · design'],
    ],
  };
}

export const COMPONENT_CARDS = Object.fromEntries(
  Object.entries(base.COMPONENT_CARDS).map(([id, card]) => [id, fixtureCard(card)]),
);

export const pistonCard = (number, bankLabel) => fixtureCard(base.pistonCard(number, bankLabel));
export const rodCard = (number, bankLabel) => fixtureCard(base.rodCard(number, bankLabel));

export function engineSummary(firingOrder) {
  return {
    displacement: '6,599 cc / 402.62 CID (design)',
    firingOrder,
    peakTorque: '700 lb-ft @ 1,800 rpm (design)',
    peakPower: '400 hp @ 3,100 rpm (design)',
    governed: '3,500 rpm (design)',
  };
}
