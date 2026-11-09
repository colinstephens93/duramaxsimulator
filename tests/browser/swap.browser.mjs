import assert from 'node:assert/strict';

export default async function ({ page, open }) {
  await open();
  await page.evaluate(() => window.__ENGINE__.setFixture({ rpm: 0, running: false, cutaway: true, exploded: true }));
  const measure = () => page.evaluate(() => {
    const q = window.__ENGINE__;
    q.clearSelection();
    q.setFixture({ rpm: 0, running: false });
    // Include offscreen owned resources too, so culling cannot hide a leak.
    q.engine.root.traverse(object => { object.frustumCulled = false; });
    q.render(1);
    const missing = q.current.family.PART_IDS.filter(id => !q.engine.parts.has(id));
    return { id: q.current.id, memory: { ...q.renderer.info.memory }, missing,
      cutaway: q.simulation.cutaway, exploded: q.simulation.exploded };
  });
  const swap = async id => {
    assert.equal((await page.evaluate(id => window.__ENGINE__.switchEngine(id), id)).status, 'committed');
    const measured = await measure();
    assert.deepEqual(measured.missing, []);
    assert.equal(measured.cutaway, true); assert.equal(measured.exploded, true);
    return measured;
  };
  await measure();
  const copyBaseline = await swap('lly-copy');
  const baseline = await swap('lly');
  const samples = [];
  for (let round = 0; round < 10; round++) {
    const copy = await swap('lly-copy');
    const back = await swap('lly');
    assert.deepEqual(copy.memory, copyBaseline.memory, `copy memory round ${round + 1}`);
    assert.deepEqual(back.memory, baseline.memory, `LLY memory round ${round + 1}`);
    samples.push(back.memory);
    console.log(`  swap round ${round + 1}: ${JSON.stringify(back.memory)}`);
  }
  const smoke = await page.evaluate(() => {
    const q = window.__ENGINE__, entry = q.current.entry;
    q.startEngine(); q.render(300);
    const started = q.simulation.fuel && q.simulation.rpm > entry.ratings.idleRpm * 0.8;
    const preset = entry.ratings.presets[2].rpm;
    q.applyPreset(preset); q.render(600);
    const rpm = q.simulation.rpm;
    const calibration = Object.keys(entry.ratings.calibrations).find(id => id !== q.simulation.calibration);
    const button = document.querySelector(`[data-cal="${calibration}"]`);
    if (!button) throw new Error('Missing calibration button');
    button.click();
    return { started, rpm, preset, calibration, actualCalibration: q.simulation.calibration };
  });
  assert.equal(smoke.started, true);
  assert.ok(Math.abs(smoke.rpm - smoke.preset) < 2);
  assert.equal(smoke.actualCalibration, smoke.calibration);
  return { roundTrips: 10, swaps: 20, warmupSwaps: 2, baseline: baseline.memory, copyBaseline: copyBaseline.memory, samples, smoke };
}
