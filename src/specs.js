export function COMPONENT_SPECS({ entry, copy }) {
  const specs = { ...copy.COMPONENT_CARDS };
  for (const cylinder of entry.layout.cylinders) {
    const bank = entry.layout.banks.find(bank => bank.id === cylinder.bank);
    specs['piston-' + cylinder.number] = copy.pistonCard(cylinder.number, bank.label);
    specs['rod-' + cylinder.number] = copy.rodCard(cylinder.number, bank.label);
  }
  return specs;
}

export function getSpec(id, current) {
  if (!id) return null;
  const { entry, copy } = current;
  let spec = copy.COMPONENT_CARDS[id];
  const cylinder = entry.layout.cylinders.find(c => id === 'piston-' + c.number || id === 'rod-' + c.number);
  if (cylinder) {
    const bank = entry.layout.banks.find(bank => bank.id === cylinder.bank);
    spec = id.startsWith('piston-') ? copy.pistonCard(cylinder.number, bank.label) : copy.rodCard(cylinder.number, bank.label);
  }
  if (spec?.specs) spec = { ...spec, specs: spec.specs.map(([key, value]) => [key, value]) };
  return spec ?? null;
}
