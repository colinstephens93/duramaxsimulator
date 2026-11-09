import assert from 'node:assert/strict';

export default async function ({ page, open }) {
  await page.addInitScript(() => {
    window.__paintedText = [];
    const original = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (text, ...args) {
      window.__paintedText.push(String(text));
      return original.call(this, text, ...args);
    };
  });
  await open('?qa=1&engine=lbz');
  const boot = await page.evaluate(() => {
    const q = window.__ENGINE__;
    return { id:q.current.id, name:q.engine.root.name, rod:q.current.entry.geometry.rodLengthMm,
      title:document.title, missing:q.current.family.PART_IDS.filter(id=>!q.engine.parts.has(id)),
      labels:window.__paintedText.filter(text=>text==='DMAX LBZ').length,
      options:[...document.querySelectorAll('#enginePicker option')].map(option=>option.value) };
  });
  assert.equal(boot.id,'lbz'); assert.equal(boot.rod,163);
  assert.match(boot.name,/LBZ/); assert.match(boot.title,/LBZ/);
  assert.deepEqual(boot.missing,[]); assert.ok(boot.labels>=2);
  assert.deepEqual(boot.options,['lly','lbz','lly-copy']);
  const smoke = await page.evaluate(() => {
    const q = window.__ENGINE__;
    q.setFixture({rpm:0,running:false}); q.startEngine(); q.render(300);
    const idle=q.simulation.rpm;
    q.applyPreset(3200); q.render(900);
    const rpm=q.simulation.rpm;
    document.querySelector('[data-cal="kodiak"]').click();
    const calibration=q.simulation.calibration;
    q.setFixture({rpm:1600,running:true});
    const telemetry=q.engine.telemetry(1600,'kodiak',true);
    return {idle,rpm,calibration,torque:telemetry.torque};
  });
  assert.ok(smoke.idle>670&&smoke.idle<690);
  assert.ok(Math.abs(smoke.rpm-3200)<2);
  assert.equal(smoke.calibration,'kodiak'); assert.equal(smoke.torque,605);
  assert.equal((await page.evaluate(()=>window.__ENGINE__.switchEngine('lly'))).status,'committed');
  assert.equal((await page.evaluate(()=>window.__ENGINE__.switchEngine('lbz'))).status,'committed');
  assert.equal(await page.evaluate(()=>window.__ENGINE__.simulation.calibration),'allison');
  return {boot,smoke,roundTrip:true};
}
