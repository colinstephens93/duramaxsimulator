import assert from 'node:assert/strict';

export default async function ({ page, open }) {
  await open();
  const result = await page.evaluate(() => ({ footprints: window.__ENGINE__.environment.collision.footprints, bounds: window.__ENGINE__.environment.propBounds }));
  assert.equal(result.bounds.length, result.footprints.length);
  for (const footprint of result.footprints) {
    const actual = result.bounds.find(bound => bound.id === footprint.id);
    assert.ok(actual && Number.isFinite(actual.minX), footprint.id);
    if (footprint.shape === 'circle') assert.ok(actual.maxRadius <= footprint.radius + 1e-6, `${footprint.id}: measured radius ${actual.maxRadius} > ${footprint.radius}`);
    else {
      assert.ok(actual.minX >= footprint.minX - 1e-6 && actual.maxX <= footprint.maxX + 1e-6 && actual.minZ >= footprint.minZ - 1e-6 && actual.maxZ <= footprint.maxZ + 1e-6, `${footprint.id}: ${JSON.stringify(actual)} outside ${JSON.stringify(footprint)}`);
    }
  }
  return { props: result.bounds.length, meshBoundsContained: true };
}
