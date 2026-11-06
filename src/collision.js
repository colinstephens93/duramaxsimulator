import { entry } from './engines/active.js';

// Where the camera may go. Plain functions on {x, z} / {x, y, z} data, with no Three.js and no DOM,
// so the same code runs in the browser and in the Node tests.

const EPS = 1e-9;

/* ---------------------------------------------------------------------------
   Walking
--------------------------------------------------------------------------- */

// Distance kept between the walker and each obstacle (the walker itself is a point).
const WALL_CLEARANCE = entry.walk.wallClearanceM;
const DYNO_CLEARANCE = entry.walk.dynoClearanceM;
const ENGINE_WALK_RADIUS = entry.walk.clearanceRadiusM;
// Control console and tool chest: solid from the console face to the east wall.
const CONSOLE_BLOCK = { minX: 1.25, maxX: Infinity, minZ: -1.75, maxZ: 0.8 };

// A step is walked in hops no longer than this, so a long frame can't carry the walker through an
// obstacle (every obstacle is far thicker than a hop).
const MAX_HOP = entry.walk.maxHopM;
// Where an engine disc and a box meet the walker is pushed back and forth between them; this many
// rounds settle it to well under a millimetre.
const PASSES = 12;
const SETTLE = 1e-3;

/**
 * The walkable floor in plan view (x, z), the walker being a point:
 *   bounds   the rectangle the walker stays inside
 *   circles  solid discs, { x, z, radius }
 *   boxes    solid rectangles, { minX, maxX, minZ, maxZ } (maxX may be Infinity)
 * `collision` is the environment's collision data (Box3-shaped room and dynoBox); `engineCenter` is
 * { x, z }.
 */
export function buildWalkWorld({ room, dynoBox }, engineCenter) {
  return {
    bounds: {
      minX: room.min.x + WALL_CLEARANCE,
      maxX: room.max.x - WALL_CLEARANCE,
      minZ: room.min.z + WALL_CLEARANCE,
      maxZ: room.max.z - WALL_CLEARANCE,
    },
    circles: [{ x: engineCenter.x, z: engineCenter.z, radius: ENGINE_WALK_RADIUS }],
    boxes: [
      {
        minX: dynoBox.min.x - DYNO_CLEARANCE,
        maxX: dynoBox.max.x + DYNO_CLEARANCE,
        minZ: dynoBox.min.z - DYNO_CLEARANCE,
        maxZ: dynoBox.max.z + DYNO_CLEARANCE,
      },
      CONSOLE_BLOCK,
    ],
  };
}

// "Inside" means further in than `slack` (plus rounding noise), so a walker resting on a surface isn't.
const insideCircle = (p, c, slack = 0) => Math.hypot(p.x - c.x, p.z - c.z) < c.radius - slack - EPS;
const insideBox = (p, b, slack = 0) =>
  p.x > b.minX + slack + EPS && p.x < b.maxX - slack - EPS && p.z > b.minZ + slack + EPS && p.z < b.maxZ - slack - EPS;

/** True when `p` is in the room and no further than `slack` metres into any obstacle. */
export function isWalkable(p, world, slack = 0) {
  const b = world.bounds;
  if (p.x < b.minX - slack || p.x > b.maxX + slack || p.z < b.minZ - slack || p.z > b.maxZ + slack) return false;
  return !world.circles.some((c) => insideCircle(p, c, slack)) && !world.boxes.some((r) => insideBox(p, r, slack));
}

function pushOutOfCircle(p, c) {
  if (!insideCircle(p, c)) return;
  const dx = p.x - c.x;
  const dz = p.z - c.z;
  const d = Math.hypot(dx, dz);
  // Straight out from the centre (any way out if the walker is exactly on it).
  p.x = c.x + (d > EPS ? dx / d : 1) * c.radius;
  p.z = c.z + (d > EPS ? dz / d : 0) * c.radius;
}

// How far along the move (0 = start, 1 = end) the walker crosses into the slab lo..hi on one axis.
const slabEntry = (start, delta, lo, hi) => (delta > 0 ? (lo - start) / delta : delta < 0 ? (hi - start) / delta : -Infinity);

function pushOutOfBox(p, from, b) {
  if (!insideBox(p, b)) return;
  if (insideBox(from, b)) {
    // Started inside the box: out through the nearest face.
    const faces = [
      { axis: 'x', edge: b.minX, depth: p.x - b.minX },
      { axis: 'x', edge: b.maxX, depth: b.maxX - p.x },
      { axis: 'z', edge: b.minZ, depth: p.z - b.minZ },
      { axis: 'z', edge: b.maxZ, depth: b.maxZ - p.z },
    ];
    const face = faces.reduce((nearest, f) => (f.depth < nearest.depth ? f : nearest));
    p[face.axis] = face.edge;
    return;
  }
  // Came in from outside: leave by the face crossed last. The rest of the move then slides along it,
  // and the walker never travels further than it asked to (the nearest face can be the wrong one
  // within a hop of a corner).
  const dx = p.x - from.x;
  const dz = p.z - from.z;
  if (slabEntry(from.x, dx, b.minX, b.maxX) >= slabEntry(from.z, dz, b.minZ, b.maxZ)) {
    p.x = dx > 0 ? b.minX : b.maxX;
  } else {
    p.z = dz > 0 ? b.minZ : b.maxZ;
  }
}

function hop(from, to, world) {
  const b = world.bounds;
  const p = { x: to.x, z: to.z };
  for (let pass = 0; pass < PASSES; pass++) {
    const { x, z } = p;
    p.x = Math.min(Math.max(p.x, b.minX), b.maxX);
    p.z = Math.min(Math.max(p.z, b.minZ), b.maxZ);
    for (const c of world.circles) pushOutOfCircle(p, c);
    for (const r of world.boxes) pushOutOfBox(p, from, r);
    if (p.x === x && p.z === z) break;
  }
  if (isWalkable(p, world, SETTLE)) return p;
  // Wedged where obstacles meet: stay put, if the walker's last position was legal.
  return isWalkable(from, world, SETTLE) ? { x: from.x, z: from.z } : p;
}

/**
 * Where a walker ends up moving from `from` to `to` (both { x, z }). It stops at obstacles and slides
 * along them; it is never moved further than the step it asked for, and never carried through
 * something by a long step. A walker that starts inside an obstacle is pushed out the nearest side.
 */
export function resolveWalk(from, to, world) {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  const hops = Math.max(1, Math.ceil(Math.hypot(dx, dz) / MAX_HOP));
  let at = { x: from.x, z: from.z };
  // Each hop starts from where the last one ended, not from the planned line: after a slide the two differ.
  for (let i = 0; i < hops; i++) {
    at = hop(at, { x: at.x + dx / hops, z: at.z + dz / hops }, world);
  }
  return at;
}

/* ---------------------------------------------------------------------------
   Orbit camera
--------------------------------------------------------------------------- */

const AXES = ['x', 'y', 'z'];

/**
 * Keeps an orbit camera inside the room. `position` and `target` ({ x, y, z }, so THREE.Vector3 works)
 * are moved in place; `bounds` ({ min, max }, so THREE.Box3 works) is the box the camera may be in.
 *
 * The focus point is held `minDistance` inside the walls and ceiling so there is always room to stand
 * back from it (the camera moves with it, so a pan just stops at the edge). The camera is then pulled
 * in along its line of sight until it is inside the box, so zooming out stops at the wall and the view
 * direction never changes. The floor needs no such margin: the controls' polar limit keeps the camera
 * above the focus point.
 *
 * Returns true if anything moved.
 */
export function confineOrbitCamera(position, target, bounds, minDistance) {
  const { min, max } = bounds;
  let moved = false;

  for (const axis of AXES) {
    const lowest = axis === 'y' ? min.y : min[axis] + minDistance;
    const highest = max[axis] - minDistance;
    const held = Math.min(Math.max(target[axis], lowest), highest);
    if (held !== target[axis]) {
      position[axis] += held - target[axis];
      target[axis] = held;
      moved = true;
    }
  }

  let scale = 1;
  for (const axis of AXES) {
    const offset = position[axis] - target[axis];
    if (offset > 0) scale = Math.min(scale, (max[axis] - target[axis]) / offset);
    else if (offset < 0) scale = Math.min(scale, (min[axis] - target[axis]) / offset);
  }
  if (scale < 1 - EPS) {
    for (const axis of AXES) position[axis] = target[axis] + (position[axis] - target[axis]) * scale;
    moved = true;
  }
  // Rounding in the steps above can leave the camera a hair outside the box.
  for (const axis of AXES) position[axis] = Math.min(Math.max(position[axis], min[axis]), max[axis]);
  return moved;
}
