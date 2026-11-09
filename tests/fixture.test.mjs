// The linear ceiling fixtures (buildCeilingFixture in src/environment/cell.js): the hanger rods have to be
// attached to the housing and reach the ceiling. Real geometry, built without a renderer.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { buildCeilingFixture } from '../src/environment/cell.js';

// cell.js hangs its four fixtures at these (x, z) at y = 3.86, under a ceiling slab whose
// underside is at y = 4.22.
const FIXTURE_Y = 3.86;
const CEILING_UNDERSIDE_Y = 4.22;
const PLACEMENTS = [
  [-2.9, 0.6],
  [0, -0.8],
  [2.9, 1.0],
  [-1.6, -2.7],
];

function fixtureAt(x, z) {
  const fixture = buildCeilingFixture(new THREE.MeshStandardMaterial(), new THREE.MeshStandardMaterial());
  fixture.position.set(x, FIXTURE_Y, z);
  fixture.updateMatrixWorld(true);
  const bounds = (child) => new THREE.Box3().setFromObject(child);
  const named = (name) => fixture.children.filter((child) => child.name === name);
  return { housing: bounds(named('housing')[0]), hangers: named('hanger').map(bounds) };
}

const near = (actual, expected, what, tolerance = 1e-9) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${what}: ${actual} is not within ${tolerance} of ${expected}`);

describe('ceiling fixture hangers', () => {
  for (const [x, z] of PLACEMENTS) {
    describe(`the fixture at (${x}, ${z})`, () => {
      const { housing, hangers } = fixtureAt(x, z);

      it('has two hangers', () => {
        assert.equal(hangers.length, 2);
      });

      // Regression: the rods were offset along z, the fixture's short axis, so they hung 0.4 m beside the
      // housing and the lights looked as if they floated.
      it('has them touching the housing', () => {
        for (const hanger of hangers) assert.ok(housing.intersectsBox(hanger), 'a hanger misses the housing');
      });

      it('has them inside the housing outline seen from below', () => {
        for (const hanger of hangers) {
          assert.ok(hanger.min.x >= housing.min.x && hanger.max.x <= housing.max.x, `hanger x ${hanger.min.x}..${hanger.max.x} is off the housing`);
          assert.ok(hanger.min.z >= housing.min.z && hanger.max.z <= housing.max.z, `hanger z ${hanger.min.z}..${hanger.max.z} is off the housing`);
        }
      });

      it('has them reaching from the housing up to the ceiling', () => {
        for (const hanger of hangers) {
          assert.ok(hanger.min.y <= housing.max.y, `hanger starts at ${hanger.min.y}, above the housing top ${housing.max.y}`);
          assert.ok(hanger.max.y >= CEILING_UNDERSIDE_Y, `hanger stops at ${hanger.max.y}, short of the ceiling at ${CEILING_UNDERSIDE_Y}`);
        }
      });

      it('has them mirrored about the middle of the fixture, along its length', () => {
        const [left, right] = [...hangers].sort((a, b) => a.min.x - b.min.x);
        const centre = (box) => box.getCenter(new THREE.Vector3());
        near(centre(left).x - x, -(centre(right).x - x), 'distance from the middle');
        near(centre(left).y, centre(right).y, 'height');
        near(centre(left).z, z, 'left rod z');
        near(centre(right).z, z, 'right rod z');
        assert.ok(centre(right).x - x > 0.4, 'the rods are not spread along the fixture');
      });
    });
  }
});
