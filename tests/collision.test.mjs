// Where the camera may go (src/collision.js): walking collision against the room's real numbers.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildWalkWorld, isWalkable, resolveWalk } from '../src/collision.js';
import { mulberry32 } from './helpers/fake-audio.mjs';

// environment.collision: the room, and the dyno guard volume the walker keeps out of.
const collision = {
  room: { min: { x: -5.4, z: -4.6 }, max: { x: 5.4, z: 4.6 } },
  dynoBox: { min: { x: -0.8, z: -2.3 }, max: { x: 0.8, z: -1.05 } },
};
const ENGINE_CENTER = { x: 0, z: -0.05 };
const world = buildWalkWorld(collision, ENGINE_CENTER);

const SLACK = 1e-3; // a millimetre
const near = (actual, expected, what, tolerance = 1e-6) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${what}: ${actual} is not within ${tolerance} of ${expected}`);

// Walks `frames` frames of `step` metres towards `heading`, the way updateWalk does each frame.
function walk(start, heading, { frames = 100, step = 0.05 } = {}) {
  const length = Math.hypot(heading.x, heading.z);
  let at = { ...start };
  const trail = [at];
  let biggestMove = 0;
  for (let i = 0; i < frames; i++) {
    const to = { x: at.x + (heading.x / length) * step, z: at.z + (heading.z / length) * step };
    const next = resolveWalk(at, to, world);
    biggestMove = Math.max(biggestMove, Math.hypot(next.x - at.x, next.z - at.z));
    trail.push(next);
    at = next;
  }
  return { end: at, trail, biggestMove };
}

// No frame jumps further than the step asked for (sliding round the engine disc adds a tenth of a
// percent), and nothing is ever walked into.
function assertSmooth(run, step = 0.05) {
  assert.ok(run.biggestMove <= step * 1.01, `moved ${run.biggestMove.toFixed(4)} m in one frame, asked for ${step}`);
  for (const p of run.trail) assert.ok(isWalkable(p, world, SLACK), `walked into something at (${p.x}, ${p.z})`);
}

describe('the walkable world', () => {
  it('keeps 0.35 m inside the room walls', () => {
    const { minX, maxX, minZ, maxZ } = world.bounds;
    near(minX, -5.05, 'minX');
    near(maxX, 5.05, 'maxX');
    near(minZ, -4.25, 'minZ');
    near(maxZ, 4.25, 'maxZ');
  });

  it('keeps 1.03 m from the engine centre', () => {
    assert.deepEqual(world.circles, [{ x: 0, z: -0.05, radius: 1.03 }]);
  });

  it('keeps 0.3 m clear of the dyno guard volume', () => {
    const [dyno] = world.boxes;
    near(dyno.minX, -1.1, 'dyno minX');
    near(dyno.maxX, 1.1, 'dyno maxX');
    near(dyno.minZ, -2.6, 'dyno minZ');
    near(dyno.maxZ, -0.75, 'dyno maxZ');
  });

  it('treats the control console as solid from its face to the east wall', () => {
    const consoleBlock = world.boxes[1];
    assert.equal(consoleBlock.minX, 1.25);
    assert.equal(consoleBlock.maxX, Infinity);
    assert.equal(consoleBlock.minZ, -1.75);
    assert.equal(consoleBlock.maxZ, 0.8);
  });

  it('lets a walker stand on a surface but not in it', () => {
    assert.ok(isWalkable({ x: -1.1, z: -1.7 }, world), 'on the dyno guard face');
    assert.ok(!isWalkable({ x: -1.09, z: -1.7 }, world), 'inside the dyno guard');
    assert.ok(isWalkable({ x: 0, z: 0.98 }, world), 'on the engine disc');
    assert.ok(!isWalkable({ x: 0, z: 0.9 }, world), 'inside the engine disc');
    assert.ok(!isWalkable({ x: 5.2, z: 0 }, world), 'beyond the east wall limit');
  });
});

describe('walking up to the dyno guard', () => {
  // Regression: any step into the guard volume used to set z to -0.74, so a walker approaching from the
  // west at z = -1.7 was thrown about a metre across the dyno in one frame.
  it('stops at its west face instead of jumping across it', () => {
    const run = walk({ x: -2.6, z: -1.7 }, { x: 1, z: 0 });
    assertSmooth(run);
    near(run.end.x, -1.1, 'x');
    near(run.end.z, -1.7, 'z');
  });

  it('stops at its east face', () => {
    const run = walk({ x: 2.6, z: -2.0 }, { x: -1, z: 0 });
    assertSmooth(run);
    near(run.end.x, 1.1, 'x');
    near(run.end.z, -2.0, 'z');
  });

  it('stops at its back face instead of being thrown out of the front', () => {
    const run = walk({ x: 0, z: -3.8 }, { x: 0, z: 1 });
    assertSmooth(run);
    near(run.end.x, 0, 'x');
    near(run.end.z, -2.6, 'z');
  });

  it('stops at its front face', () => {
    const run = walk({ x: 1.05, z: 0.5 }, { x: 0, z: -1 });
    assertSmooth(run);
    near(run.end.x, 1.05, 'x');
    near(run.end.z, -0.75, 'z');
  });

  it('slides along a face when walking at it on a diagonal, and carries on round the corner', () => {
    const run = walk({ x: -2.0, z: -1.2 }, { x: 1, z: -1 }, { frames: 120 });
    assertSmooth(run);
    assert.ok(
      run.trail.some((p) => Math.abs(p.x + 1.1) < 1e-9 && p.z < -1.7),
      'never slid north along the west face',
    );
    near(run.end.z, -4.25, 'ends against the back wall');
    assert.ok(run.end.x > 1, `ended at x = ${run.end.x}, expected round behind the dyno`);
  });

  it('is not carried through the dyno by a single long step', () => {
    const end = resolveWalk({ x: -2.6, z: -1.7 }, { x: 0.4, z: -1.7 }, world);
    near(end.x, -1.1, 'x');
    near(end.z, -1.7, 'z');
  });

  it('is not carried through by a long step from any side', () => {
    const cases = [
      [{ x: 2.6, z: -2.0 }, { x: -0.4, z: -2.0 }, { x: 1.1, z: -2.0 }],
      [{ x: 0.3, z: -3.8 }, { x: 0.3, z: -0.8 }, { x: 0.3, z: -2.6 }],
      [{ x: 1.0, z: 0.0 }, { x: 1.0, z: -3.0 }, { x: 1.03, z: -0.75 }],
    ];
    for (const [from, to, expected] of cases) {
      const end = resolveWalk(from, to, world);
      near(end.x, expected.x, `x from (${from.x}, ${from.z})`, 0.05);
      near(end.z, expected.z, `z from (${from.x}, ${from.z})`, 0.05);
    }
  });
});

describe('walking up to the engine', () => {
  it('stops 1.03 m from its centre', () => {
    const run = walk({ x: 0, z: 3 }, { x: 0, z: -1 });
    assertSmooth(run);
    near(run.end.z, 0.98, 'z');
    near(Math.hypot(run.end.x - ENGINE_CENTER.x, run.end.z - ENGINE_CENTER.z), 1.03, 'distance from the centre');
  });

  it('slides round it without ever entering it', () => {
    const run = walk({ x: 1.0, z: 0.5 }, { x: 0, z: -1 });
    assertSmooth(run);
    for (const p of run.trail) {
      assert.ok(Math.hypot(p.x - ENGINE_CENTER.x, p.z - ENGINE_CENTER.z) >= 1.03 - SLACK, `inside the engine at (${p.x}, ${p.z})`);
    }
    assert.ok(run.trail.some((p) => p.z < 0 && p.x > 1.02), 'never got round the side of the engine');
  });
});

describe('walking up to the room walls', () => {
  it('stops 0.35 m short of each wall', () => {
    const cases = [
      [{ x: -3, z: 3 }, { x: -1, z: 0 }, 'x', -5.05],
      [{ x: 3, z: 3 }, { x: 1, z: 0 }, 'x', 5.05],
      [{ x: -3, z: 3 }, { x: 0, z: 1 }, 'z', 4.25],
      [{ x: -3, z: -3 }, { x: 0, z: -1 }, 'z', -4.25],
    ];
    for (const [start, heading, axis, expected] of cases) {
      const run = walk(start, heading, { frames: 200 });
      assertSmooth(run);
      near(run.end[axis], expected, `${axis} walking from (${start.x}, ${start.z})`);
    }
  });
});

describe('walking up to the control console', () => {
  it('stops at its face when coming from the west', () => {
    const run = walk({ x: 1.1, z: -1.0 }, { x: 1, z: 0 });
    assertSmooth(run);
    near(run.end.x, 1.25, 'x');
  });

  // Regression: the console had the same snap, setting x to 1.25 whenever z entered its band, so a
  // walker coming along the east side was thrown 2 m sideways onto the console face.
  it('stops at its north edge instead of being thrown onto its face', () => {
    const run = walk({ x: 3.5, z: -3 }, { x: 0, z: 1 });
    assertSmooth(run);
    near(run.end.x, 3.5, 'x');
    near(run.end.z, -1.75, 'z');
  });

  it('stops at its south edge', () => {
    const run = walk({ x: 3.5, z: 3 }, { x: 0, z: -1 });
    assertSmooth(run);
    near(run.end.x, 3.5, 'x');
    near(run.end.z, 0.8, 'z');
  });

  it('cannot be slipped past along the east wall', () => {
    const run = walk({ x: 5.05, z: -3 }, { x: 0, z: 1 });
    assertSmooth(run);
    near(run.end.x, 5.05, 'x');
    near(run.end.z, -1.75, 'z');
  });
});

describe('where obstacles meet', () => {
  it('comes to rest where the engine meets the dyno guard, one step at a time', () => {
    // The engine disc crosses the guard's front face at x = sqrt(1.03^2 - 0.7^2) = 0.7556.
    const run = walk({ x: 1.2, z: 0.9 }, { x: -0.45, z: -1.65 }, { frames: 80 });
    assertSmooth(run);
    near(run.end.x, Math.sqrt(1.03 ** 2 - 0.7 ** 2), 'x', 1e-3);
    near(run.end.z, -0.75, 'z', 1e-3);
    const last = run.trail.slice(-5);
    for (const p of last) near(Math.hypot(p.x - run.end.x, p.z - run.end.z), 0, 'drift once at rest', 1e-6);
  });
});

describe('starting inside something', () => {
  it('moves a walker out of the dyno guard by its nearest face', () => {
    const end = resolveWalk({ x: 0.2, z: -2.0 }, { x: 0.2, z: -2.0 }, world);
    near(end.x, 0.2, 'x');
    near(end.z, -2.6, 'z');
  });

  it('moves a walker out of the console block by its nearest face', () => {
    const end = resolveWalk({ x: 3, z: -0.5 }, { x: 3, z: -0.5 }, world);
    near(end.x, 3, 'x');
    near(end.z, -1.75, 'z');
  });

  it('brings a walker from outside the room back to its edge', () => {
    const end = resolveWalk({ x: 9, z: 9 }, { x: 9, z: 9 }, world);
    near(end.x, 5.05, 'x');
    near(end.z, 4.25, 'z');
  });
});

describe('random walks', () => {
  it('never enter an obstacle and never move further than the step asked for', () => {
    const random = mulberry32(2024);
    for (let walkIndex = 0; walkIndex < 100; walkIndex++) {
      let at;
      do {
        at = { x: (random() * 2 - 1) * 5.05, z: (random() * 2 - 1) * 4.25 };
      } while (!isWalkable(at, world));
      let heading = random() * Math.PI * 2;
      for (let frame = 0; frame < 400; frame++) {
        if (random() < 0.05) heading = random() * Math.PI * 2;
        const step = random() * 0.31; // a 0.1 s frame at sprint speed is the longest the game allows
        const next = resolveWalk(at, { x: at.x + Math.cos(heading) * step, z: at.z + Math.sin(heading) * step }, world);
        assert.ok(isWalkable(next, world, SLACK), `walk ${walkIndex} frame ${frame}: walked into something at (${next.x}, ${next.z})`);
        const moved = Math.hypot(next.x - at.x, next.z - at.z);
        assert.ok(moved <= step * 1.01 + 1e-6, `walk ${walkIndex} frame ${frame}: moved ${moved.toFixed(4)} m for a ${step.toFixed(4)} m step`);
        at = next;
      }
    }
  });
});
