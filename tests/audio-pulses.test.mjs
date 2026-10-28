// Per-cylinder injector/combustion pulses in src/audio.js, run against a fake Web Audio graph.
// A cylinder crossing its firing angle must sound at the right moment inside the frame, so the pulse
// stream stays at 4 per crank revolution, 90 degrees of crank apart, in firing order, whatever the
// RPM or frame rate.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CYLINDERS } from '../src/kinematics.js';
import { analyze, clock, createAudio, gapStats, mulberry32, scheduleLog, simulate, steady } from './helpers/fake-audio.mjs';

// Mirrors MAX_PULSE_FRAME_S in src/audio.js: frames longer than this are stalls and play no pulses.
const STALL_S = 0.2;
const STALL_FRAME = 120; // index of the long frame in the stall scenarios (after two seconds at 60 fps)

const ms = (seconds) => `${(seconds * 1000).toFixed(3)} ms`;

function assertCadence(result, { gapToleranceS = 1e-6 } = {}) {
  assert.ok(Math.abs(result.count - result.expected) <= 2, `${result.count} pulses, expected ${result.expected.toFixed(1)}`);
  assert.ok(result.worstGapErrorS < gapToleranceS, `worst gap error ${ms(result.worstGapErrorS)} (even gap ${ms(result.idealGapS)})`);
  assert.ok(result.firingOrderKept, 'cylinders fired out of order');
}

describe('cylinder pulses hold the firing cadence at any RPM and frame rate', () => {
  for (const fps of [5, 10, 15, 20, 25, 30, 60, 144]) {
    for (const rpm of [680, 1600, 3000, 3250]) {
      it(`${rpm} rpm at ${fps} fps (${Math.round((rpm * 6) / fps)} degrees of crank per frame)`, async () => {
        assertCadence(analyze(await simulate({ rpm, dts: steady(fps) }), rpm));
      });
    }
  }
});

describe('regressions', () => {
  it('stays audible above 1,800 RPM at 60 fps (a 180-degree per-frame gate once silenced it)', async () => {
    const result = analyze(await simulate({ rpm: 3000, dts: steady(60) }), 3000);
    assert.ok(result.count > 0.9 * result.expected, `${result.count} pulses, expected ${result.expected.toFixed(1)}`);
  });

  it('stays audible when one frame covers a full 720-degree lap or more', async () => {
    // 3,250 rpm at 10 fps is 1,950 degrees per frame; the wrapped angle delta used to alias to nothing.
    const result = analyze(await simulate({ rpm: 3250, dts: steady(10) }), 3250);
    assert.ok(result.count > 0.9 * result.expected, `${result.count} pulses, expected ${result.expected.toFixed(1)}`);
  });

  it('spreads pulses across the frame instead of stacking them on its boundary', async () => {
    // 1,600 rpm at 60 fps fires about 1.8 pulses a frame. Stacked pulses are simultaneous, which loses
    // both the 9.4 ms spacing and the firing order.
    assertCadence(analyze(await simulate({ rpm: 1600, dts: steady(60) }), 1600));
  });
});

describe('what one pulse schedules', () => {
  it('never lands in the past or beyond the end of its frame', async () => {
    for (const [rpm, fps] of [[680, 60], [3250, 60], [3250, 10], [3250, 5]]) {
      const run = await simulate({ rpm, dts: steady(fps, 4) });
      for (const event of run.events) {
        assert.ok(event.delay >= 0 && event.delay <= 1 / fps + 1e-12, `${rpm} rpm at ${fps} fps: delay ${ms(event.delay)}`);
      }
    }
  });

  it('applies the delay to every node a single pulse schedules', async () => {
    const audio = await createAudio();
    clock.now = 1;
    scheduleLog.length = 0;
    audio._triggerCylinderPulse(CYLINDERS[0], { rpm: 3000, rail: 20000, cutaway: false, slowMotion: false, delay: 0.0125 });
    const due = 1.0125;
    assert.ok(scheduleLog.length >= 8, 'expected the click and thump envelopes to be scheduled');
    for (const entry of scheduleLog) {
      assert.ok(entry.time >= due - 1e-12, `${entry.kind} scheduled at ${entry.time}, before ${due}`);
    }
    const starts = scheduleLog.filter((entry) => entry.kind === 'start');
    assert.equal(starts.length, 2, 'one click burst and one thump oscillator');
    for (const start of starts) assert.ok(Math.abs(start.time - due) < 1e-12, `start at ${start.time}, expected ${due}`);
  });
});

describe('stalls', () => {
  const rpm = 3250;
  const withLongFrame = (frameS) => simulate({ rpm, dts: [...steady(60, 2), frameS, ...steady(60, 3)] });
  const firedIn = (run, frame) => run.events.filter((event) => event.frame === frame);

  it('skips a frame longer than the limit and resumes on cadence', async () => {
    const run = await withLongFrame(0.35);
    assert.equal(firedIn(run, STALL_FRAME).length, 0);
    assertCadence(analyze(run, rpm, { from: run.frameEnd[STALL_FRAME] + 0.2 }));
  });

  it('skips a frame just over the limit', async () => {
    const run = await withLongFrame(STALL_S + 0.001);
    assert.equal(firedIn(run, STALL_FRAME).length, 0);
  });

  it('replays a frame right at the limit as evenly spaced pulses, then resumes on cadence', async () => {
    const run = await withLongFrame(STALL_S);
    const replayed = firedIn(run, STALL_FRAME);
    const expected = (rpm * 6 * STALL_S) / 90; // one pulse per 90 degrees of crank
    assert.ok(Math.abs(replayed.length - expected) <= 1, `${replayed.length} pulses, expected ${expected.toFixed(1)}`);
    const gaps = gapStats(replayed, rpm);
    assert.ok(gaps.worstGapErrorS < 1e-6, `worst gap error ${ms(gaps.worstGapErrorS)}`);
    assert.ok(gaps.firingOrderKept, 'replayed pulses fired out of order');
    assertCadence(analyze(run, rpm, { from: run.frameEnd[STALL_FRAME] + 0.4 }));
  });
});

describe('other conditions', () => {
  it('does not burst when the crank angle jumps between frames (QA setFixture)', async () => {
    const run = await simulate({ rpm: 3000, dts: steady(60, 4), jumpAt: STALL_FRAME, jumpDeg: 360 });
    const inJumpFrame = run.events.filter((event) => event.frame === STALL_FRAME).length;
    const mostInOneFrame = Math.ceil((3000 * 6) / 60 / 90); // 300 degrees a frame: 3 or 4 pulses
    assert.ok(inJumpFrame <= mostInOneFrame, `${inJumpFrame} pulses in the jump frame, at most ${mostInOneFrame} expected`);
  });

  it('stays silent with the fuel cut', async () => {
    const run = await simulate({ rpm: 3000, dts: steady(60, 2), fuel: false });
    assert.equal(run.events.length, 0);
  });

  it('stays silent at or below 80 rpm', async () => {
    const run = await simulate({ rpm: 60, dts: steady(60, 2) });
    assert.equal(run.events.length, 0);
  });
});

describe('slow motion (0.12x)', () => {
  for (const fps of [10, 20, 60]) {
    it(`3,250 rpm at ${fps} fps`, async () => {
      assertCadence(analyze(await simulate({ rpm: 3250, dts: steady(fps), slow: true }), 3250, { slow: true }));
    });
  }
});

describe('uneven frame times (+/-25%)', () => {
  for (const fps of [20, 60]) {
    it(`keep the rate and stay within about half a frame of even at ${fps} fps`, async () => {
      const rand = mulberry32(7);
      const dts = steady(fps).map((dt) => dt * (1 + 0.25 * (rand() * 2 - 1)));
      const result = analyze(await simulate({ rpm: 3250, dts }), 3250);
      assert.ok(Math.abs(result.count - result.expected) / result.expected < 0.01, `${result.count} pulses, expected ${result.expected.toFixed(1)}`);
      assert.ok(result.worstGapErrorS < 0.6 / fps, `worst gap error ${ms(result.worstGapErrorS)}`);
    });
  }
});
