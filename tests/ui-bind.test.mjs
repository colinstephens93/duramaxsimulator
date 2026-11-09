import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import lly from '../src/engines/lly/index.js';
import { PART_IDS } from '../src/engines/families/v8-ohv.js';
import {
  calibrationRows,
  presetByRpm,
  presetRows,
  railFullScalePsi,
  visibleQuickParts,
} from '../src/ui/bind.js';

describe('UI binding data', () => {
  it('builds the five preset rows from the entry', () => {
    const rows = presetRows(lly);
    assert.deepEqual(
      rows.map(({ rpm, label, toast }) => ({ rpm, label, toast })),
      lly.ratings.presets.map(({ rpm, label, toast }) => ({ rpm, label, toast })),
    );
    assert.deepEqual(rows.map((row) => row.rpm), [0, 680, 1600, 3000, 3250]);
    assert.deepEqual(presetByRpm(lly, 1600), rows[2]);
    assert.equal(presetByRpm(lly, 1234), undefined);
  });

  it('builds calibration labels, tooltips and the load rail note', () => {
    const rows = calibrationRows(lly);
    assert.deepEqual(rows.map((row) => row.button), ['ALLISON 1000', 'ZF S6-650']);
    assert.deepEqual(rows.map((row) => row.tooltip), [
      'Allison 1000 Automatic · 310 hp / 605 lb-ft / 26,000 psi',
      'ZF S6-650 6-Speed Manual · 300 hp / 520 lb-ft / 23,000 psi',
    ]);
    assert.equal(rows[0].railNote, 'ALLISON 1000 · CP3.3 · 26,000 PSI MAX');
  });

  it('shows all four quick parts for the real LLY part list', () => {
    assert.deepEqual(
      visibleQuickParts(lly, PART_IDS).map((part) => part.label),
      ['TURBO', 'VALVETRAIN', 'CP3.3', 'BLOCK'],
    );
  });

  it('hides only CP3.3 when cp3 is absent', () => {
    const withoutCp3 = PART_IDS.filter((id) => id !== 'cp3');
    assert.deepEqual(
      visibleQuickParts(lly, withoutCp3).map((part) => part.label),
      ['TURBO', 'VALVETRAIN', 'BLOCK'],
    );
  });

  it('shows valvetrain when any alias member is present', () => {
    assert.deepEqual(
      visibleQuickParts(lly, ['valves']).map((part) => part.label),
      ['VALVETRAIN'],
    );
  });

  it('reads the display timings', () => {
    assert.deepEqual(lly.ui.display, {
      tachRedBandRpm: 3000,
      governedLabelRpm: 3200,
      adaptiveToastMs: 3200,
    });
  });

  it('uses the largest calibration rail pressure as the full scale', () => {
    assert.equal(railFullScalePsi(lly), 26000);
  });

  it('reads the outline palette', () => {
    assert.deepEqual(lly.look.outline.base, {
      edgeColor: 0xe9a33d,
      hiddenColor: 0x20180c,
      edgeStrength: 4.5,
      edgeGlow: 0.3,
      edgeThickness: 1.0,
    });
    assert.deepEqual(lly.look.outline.hover, {
      edgeColor: 0x86c0c2,
      hiddenColor: 0x0e2828,
      edgeStrength: 3.1,
    });
    assert.deepEqual(lly.look.outline.selected, {
      edgeColor: 0xe9a33d,
      hiddenColor: 0x332711,
      edgeStrength: 5.1,
    });
  });

  it('names a valid default calibration', () => {
    assert.equal(lly.ratings.defaultCalibration, 'allison');
    assert.equal(Object.hasOwn(lly.ratings.calibrations, lly.ratings.defaultCalibration), true);
  });
});
