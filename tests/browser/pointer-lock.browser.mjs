import assert from 'node:assert/strict';

export default async function ({ page, open }) {
  // enterWalk intentionally auto-requests only above 900 px; exercise that path.
  await page.setViewportSize({width:960,height:600});
  await page.addInitScript(() => {
    window.__lockAttempts = 0;
    HTMLCanvasElement.prototype.requestPointerLock = function () {
      window.__lockAttempts++;
      return Promise.reject(new DOMException('Test rejection', 'NotAllowedError'));
    };
  });
  await open();
  const attempts = await page.evaluate(async () => {
    const q=window.__ENGINE__;
    q.enterWalk();
    await new Promise(resolve=>setTimeout(resolve,0));
    q.renderer.domElement.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,button:0}));
    await new Promise(resolve=>setTimeout(resolve,0));
    q.exitWalk();
    return window.__lockAttempts;
  });
  assert.equal(attempts,2);
  return {rejectedAttemptsHandled:attempts,viewport:{width:960,height:600}};
}
