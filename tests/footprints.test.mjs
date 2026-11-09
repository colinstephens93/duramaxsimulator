import { it } from 'node:test';
import assert from 'node:assert/strict';
import { PROP_FOOTPRINTS } from '../src/environment/cell.js';
import lly from '../src/engines/lly/index.js';
import { buildWalkWorld, isWalkable, resolveWalk } from '../src/collision.js';

const closest = (value, low, high) => Math.min(Math.max(value, low), high);
function overlapsCircle(prop, circle) {
  if (prop.shape === 'circle') return Math.hypot(prop.x - circle.x, prop.z - circle.z) < prop.radius + circle.radius;
  return Math.hypot(closest(circle.x, prop.minX, prop.maxX) - circle.x, closest(circle.z, prop.minZ, prop.maxZ) - circle.z) < circle.radius;
}

it('floor prop footprints have unique IDs, valid finite extents and cover all upright props', () => {
  assert.equal(PROP_FOOTPRINTS.length, 12);
  assert.equal(new Set(PROP_FOOTPRINTS.map(prop => prop.id)).size, 12);
  for (const prop of PROP_FOOTPRINTS) {
    if (prop.shape === 'circle') assert.ok(prop.radius > 0 && [prop.x, prop.z, prop.radius].every(Number.isFinite));
    else assert.ok(prop.minX < prop.maxX && prop.minZ < prop.maxZ && [prop.minX,prop.maxX,prop.minZ,prop.maxZ].every(Number.isFinite));
  }
});

it('all props clear the engine walk circle without exemptions', () => {
  const overlaps = PROP_FOOTPRINTS.filter(prop => overlapsCircle(prop, { x: 0, z: -0.05, radius: lly.walk.clearanceRadiusM })).map(prop => prop.id);
  assert.deepEqual(overlaps, []);
});

it('all prop envelopes clear the existing driveshaft guard', () => {
  const guard = { minX: -0.17, maxX: 0.17, minZ: -1.1, maxZ: -0.28 };
  for (const prop of PROP_FOOTPRINTS) {
    if (prop.shape === 'circle') {
      assert.ok(Math.hypot(closest(prop.x,guard.minX,guard.maxX)-prop.x,closest(prop.z,guard.minZ,guard.maxZ)-prop.z) >= prop.radius, prop.id);
    } else assert.ok(prop.maxX <= guard.minX || prop.minX >= guard.maxX || prop.maxZ <= guard.minZ || prop.minZ >= guard.maxZ, prop.id);
  }
});

it('walking stops at the lamp and chest even during a long step', () => {
  const world = buildWalkWorld({room:{min:{x:-5.4,z:-4.6},max:{x:5.4,z:4.6}},dynoBox:{min:{x:-0.8,z:-2.3},max:{x:0.8,z:-1.05}},footprints:PROP_FOOTPRINTS},{x:0,z:-0.05},lly);
  assert.equal(isWalkable({x:-2,z:1.7},world),false);
  assert.equal(isWalkable({x:2.82,z:1.16},world),false);
  const lamp = resolveWalk({x:-3,z:1.7},{x:-1,z:1.7},world);
  assert.ok(lamp.x <= -2.075 + 1e-6);
  assert.ok(isWalkable(lamp,world));
  const chest = resolveWalk({x:2.82,z:2.5},{x:2.82,z:0.9},world);
  assert.ok(chest.z > 1.4);
  assert.ok(isWalkable(chest,world));
});
