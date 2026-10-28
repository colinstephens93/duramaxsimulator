// When clicks go through the faded castings to the parts inside. The engine decides this from the same
// fade it renders, so the exploded view (where only the lesser fade applies) can't drift from picking.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EXPLODE_CUTAWAY_FRACTION, EngineBuilder, XRAY_PICK_THRESHOLD } from '../src/engine.js';

// Just the fields the getters read; building the engine itself needs a browser.
const view = ({ cutaway = 0, explode = 0 } = {}) =>
  Object.assign(Object.create(EngineBuilder.prototype), { cutawayAmount: cutaway, explodeAmount: explode });

describe('x-ray picking', () => {
  it('leaves the assembled engine solid', () => {
    const engine = view();
    assert.equal(engine.effectiveCutaway, 0);
    assert.equal(engine.isXrayed, false);
  });

  it('goes through the castings in the cutaway view', () => {
    const engine = view({ cutaway: 1 });
    assert.equal(engine.effectiveCutaway, 1);
    assert.equal(engine.isXrayed, true);
  });

  it('goes through the castings in the exploded view, where the rods and pistons show through the block', () => {
    // Regression: picking used to look at the cutaway alone (0 here), so a click on a rod seen through the
    // faded block selected the block instead.
    const engine = view({ explode: 1 });
    assert.equal(engine.effectiveCutaway, EXPLODE_CUTAWAY_FRACTION);
    assert.ok(engine.effectiveCutaway > XRAY_PICK_THRESHOLD);
    assert.equal(engine.isXrayed, true);
  });

  it('follows whichever of the two fades is stronger', () => {
    assert.equal(view({ cutaway: 0.2, explode: 1 }).effectiveCutaway, EXPLODE_CUTAWAY_FRACTION);
    assert.equal(view({ cutaway: 0.8, explode: 1 }).effectiveCutaway, 0.8);
    assert.equal(view({ cutaway: 0.8, explode: 1 }).isXrayed, true);
  });

  it('keeps the cutaway-only threshold where it was (strictly above 0.35)', () => {
    for (let cutaway = 0; cutaway <= 1.0001; cutaway += 0.01) {
      assert.equal(view({ cutaway }).isXrayed, cutaway > 0.35, `cutaway ${cutaway.toFixed(2)}`);
    }
  });

  it('turns see-through once, part way through the explosion, and stays see-through', () => {
    let first = null;
    let seen = false;
    for (let step = 0; step <= 100; step++) {
      const explode = step / 100;
      const xrayed = view({ explode }).isXrayed;
      if (xrayed && first === null) first = explode;
      if (seen) assert.equal(xrayed, true, `see-through at ${first} but solid again at ${explode}`);
      seen ||= xrayed;
    }
    const expected = XRAY_PICK_THRESHOLD / EXPLODE_CUTAWAY_FRACTION;
    assert.ok(first !== null && Math.abs(first - expected) <= 0.011, `turned see-through at ${first}, expected about ${expected.toFixed(3)}`);
  });
});
