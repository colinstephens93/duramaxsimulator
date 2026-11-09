import { formatInt } from './format.js';

// Binding syntax:
//   data-bind="ui.header.title" sets the element's textContent from the entry.
//   data-bind-html="ui.header.brandHtml" sets innerHTML when the entry keeps markup.
//   data-bind-attr="aria-label:ui.canvasAria; max:ratings.redlineRpm" sets attributes.
// Attribute pairs are separated by semicolons; the path is resolved from the entry.

function valueAt(entry, path) {
  return path.split('.').reduce((value, key) => value?.[key], entry);
}

export function presetRows(entry) {
  return (entry.ratings?.presets ?? []).map(({ rpm, label, toast }) => ({ rpm, label, toast }));
}

export function presetByRpm(entry, rpm) {
  return presetRows(entry).find((row) => row.rpm === Number(rpm));
}

export function calibrationRows(entry) {
  const pump = entry.ui.calibration.pump;
  return Object.entries(entry.ratings.calibrations).map(([id, calibration]) => {
    const labels = entry.ui.calibration[id] ?? {};
    const button = labels.button ?? id;
    const tipName = labels.tipName ?? button;
    return {
      id,
      button,
      tooltip: `${tipName} · ${calibration.peakHp} hp / ${calibration.peakTorqueLbFt} lb-ft / ${formatInt(calibration.maxRailPsi)} psi`,
      railNote: `${button} · ${pump} · ${formatInt(calibration.maxRailPsi)} PSI MAX`,
    };
  });
}

export function visibleQuickParts(entry, partIds) {
  const present = new Set(partIds);
  const aliases = entry.inspect?.aliases ?? {};
  return (entry.inspect?.quickParts ?? [])
    .filter((id) => {
      const members = aliases[id];
      return members ? members.some((member) => present.has(member)) : present.has(id);
    })
    .map((id) => ({ id, label: entry.ui.quickParts[id] ?? id }));
}

export function railFullScalePsi(entry) {
  return Math.max(...Object.values(entry.ratings.calibrations).map((calibration) => calibration.maxRailPsi));
}

export function bindEntry(entry, { document, partIds, defaultCalibration }) {
  for (const element of document.querySelectorAll('[data-bind]')) {
    const value = valueAt(entry, element.dataset.bind);
    if (value !== undefined) element.textContent = String(value);
  }
  for (const element of document.querySelectorAll('[data-bind-html]')) {
    const value = valueAt(entry, element.dataset.bindHtml);
    if (value !== undefined) element.innerHTML = String(value);
  }
  for (const element of document.querySelectorAll('[data-bind-attr]')) {
    for (const pair of element.dataset.bindAttr.split(';')) {
      const [attribute, path] = pair.split(':');
      if (!attribute || !path) continue;
      const value = valueAt(entry, path);
      if (value !== undefined) element.setAttribute(attribute, String(value));
    }
  }

  document.title = entry.ui.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', entry.ui.description);

  const presetParent = document.querySelector('.preset')?.parentElement;
  if (presetParent) {
    presetParent.replaceChildren();
    for (const row of presetRows(entry)) {
      const button = document.createElement('button');
      button.className = 'preset';
      button.dataset.preset = String(row.rpm);
      const label = document.createElement('b');
      label.textContent = row.label;
      const rpm = document.createElement('span');
      rpm.textContent = formatInt(row.rpm);
      button.append(label, rpm);
      presetParent.append(button);
    }
  }

  const calibrationParent = document.querySelector('.cal-btn')?.parentElement;
  if (calibrationParent) {
    calibrationParent.replaceChildren();
    for (const row of calibrationRows(entry)) {
      const button = document.createElement('button');
      button.className = 'cal-btn';
      button.dataset.cal = row.id;
      button.title = row.tooltip;
      button.textContent = row.button;
      if (row.id === defaultCalibration) button.classList.add('active');
      calibrationParent.append(button);
    }
  }

  const quickParts = document.querySelector('.quick-parts');
  if (quickParts) {
    quickParts.replaceChildren();
    for (const part of visibleQuickParts(entry, partIds)) {
      const button = document.createElement('button');
      button.dataset.inspect = part.id;
      button.textContent = part.label;
      quickParts.append(button);
    }
  }

  const railNote = calibrationRows(entry).find((row) => row.id === defaultCalibration);
  const rail = document.querySelector('#calRailNote');
  if (rail && railNote) rail.textContent = railNote.railNote;
}
