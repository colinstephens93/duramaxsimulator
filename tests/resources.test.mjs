import { it } from 'node:test';
import assert from 'node:assert/strict';
import { createResourceDisposer, sharedResources } from '../src/core/resources.js';

const resource = (extra = {}) => ({ calls: 0, dispose() { this.calls++; }, ...extra });
const root = objects => ({ detached: 0, traverse(visit) { objects.forEach(visit); }, removeFromParent() { this.detached++; } });

it('disposes owned geometry/materials/textures once across roots and material arrays', () => {
  const geometry = resource(), texture = resource({ isTexture: true });
  const material = resource({ map: texture, uniforms: { same: { value: texture } } });
  const roots = [root([{ geometry, material: [material, material] }]), root([{ geometry, material }])];
  const dispose = createResourceDisposer(roots, {});
  dispose(); dispose();
  for (const item of [geometry, material, texture]) assert.equal(item.calls, 1);
  assert.ok(roots.every(item => item.detached === 1));
});

it('never disposes shared materials or their textures reused by clones', () => {
  const texture = resource({ isTexture: true }), shared = resource({ bumpMap: texture });
  const clone = resource({ bumpMap: texture });
  const geometry = resource();
  createResourceDisposer([root([{ geometry, material: [shared, clone] }])], { shared })();
  assert.equal(shared.calls, 0); assert.equal(texture.calls, 0);
  assert.equal(clone.calls, 1); assert.equal(geometry.calls, 1);
  assert.ok(sharedResources({ shared }).has(texture));
});

it('collects live replacement textures at disposal and tolerates cycles/uniform arrays', () => {
  const old = resource({ isTexture: true }), next = resource({ isTexture: true });
  const material = resource({ map: old, uniforms: { nested: { value: [next] } } });
  material.userData = { material };
  const dispose = createResourceDisposer([root([{ material }])], {});
  material.map = next; old.dispose(); dispose();
  assert.equal(old.calls, 1); assert.equal(next.calls, 1); assert.equal(material.calls, 1);
});

it('releases instance GPU state and preserves the module-owned sprite geometry', () => {
  const instance = resource({ isInstancedMesh: true, geometry: resource() });
  const sprite = { isSprite: true, geometry: resource(), material: resource() };
  createResourceDisposer([root([instance, sprite])], {})();
  assert.equal(instance.calls, 1); assert.equal(instance.geometry.calls, 1);
  assert.equal(sprite.geometry.calls, 0); assert.equal(sprite.material.calls, 1);
});
