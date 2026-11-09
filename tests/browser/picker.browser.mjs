import assert from 'node:assert/strict';

export default async function ({ page, open }) {
  await page.setViewportSize({width:1280,height:800});
  await open();
  const picker=page.locator('#enginePicker');
  const hit=await picker.evaluate(element=>{
    const rect=element.getBoundingClientRect();
    return document.elementFromPoint(rect.x+rect.width/2,rect.y+rect.height/2)?.id;
  });
  assert.equal(hit,'enginePicker','Picker must receive pointer input through the UI overlay');
  // selectOption bypasses pointer hit-testing; use a real mouse click and native
  // select keyboard navigation to exercise the dropdown as a person would.
  await picker.click({timeout:5000});
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForFunction(()=>window.__ENGINE__.current.id==='lbz'&&!document.getElementById('enginePicker').disabled);
  assert.equal(await picker.inputValue(),'lbz');
  await picker.click({timeout:5000});
  await page.keyboard.press('Home');
  await page.keyboard.press('Enter');
  await page.waitForFunction(()=>window.__ENGINE__.current.id==='lly'&&!document.getElementById('enginePicker').disabled);
  assert.equal(await picker.inputValue(),'lly');
  return {realClickRoundTrip:true,pointerTarget:hit};
}
