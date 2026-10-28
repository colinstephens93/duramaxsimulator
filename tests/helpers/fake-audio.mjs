// Just enough Web Audio to run src/audio.js in Node, plus a frame-clock driver that feeds it the same
// crank step main.js takes. Lets the per-cylinder pulse scheduling be tested without a browser.
import { TestCellAudio } from '../../src/audio.js';
import { FIRING_ORDER, mod } from '../../src/kinematics.js';

const SLOW_MOTION_SCALE = 0.12; // the factor main.js and audio.js both apply in slow motion

/** Simulated audio clock, in seconds. */
export const clock = { now: 0 };

/** Everything the code under test schedules, as { kind, time }. */
export const scheduleLog = [];

class FakeParam {
  constructor(value = 0) {
    this.value = value;
  }
  setValueAtTime(_value, time) {
    scheduleLog.push({ kind: 'automation', time });
    return this;
  }
  linearRampToValueAtTime(_value, time) {
    scheduleLog.push({ kind: 'automation', time });
    return this;
  }
  exponentialRampToValueAtTime(_value, time) {
    scheduleLog.push({ kind: 'automation', time });
    return this;
  }
  setTargetAtTime(_target, time) {
    scheduleLog.push({ kind: 'automation', time });
    return this;
  }
}

class FakeNode {
  connect(target) {
    return target;
  }
  disconnect() {}
}

class FakeSource extends FakeNode {
  start(when = clock.now) {
    scheduleLog.push({ kind: 'start', time: when });
  }
  stop(when = clock.now) {
    scheduleLog.push({ kind: 'stop', time: when });
  }
}

class FakeAudioContext {
  constructor() {
    this.sampleRate = 48000;
    this.state = 'suspended';
    this.destination = new FakeNode();
    this.listener = {};
  }
  get currentTime() {
    return clock.now;
  }
  async resume() {
    this.state = 'running';
  }
  createBuffer(_channels, length) {
    const data = new Float32Array(length);
    return { getChannelData: () => data };
  }
  createDynamicsCompressor() {
    return Object.assign(new FakeNode(), {
      threshold: new FakeParam(),
      knee: new FakeParam(),
      ratio: new FakeParam(),
      attack: new FakeParam(),
      release: new FakeParam(),
    });
  }
  createGain() {
    return Object.assign(new FakeNode(), { gain: new FakeParam(1) });
  }
  createPanner() {
    return Object.assign(new FakeNode(), {
      positionX: new FakeParam(),
      positionY: new FakeParam(),
      positionZ: new FakeParam(),
    });
  }
  createWaveShaper() {
    return new FakeNode();
  }
  createBiquadFilter() {
    return Object.assign(new FakeNode(), { frequency: new FakeParam(), Q: new FakeParam(), gain: new FakeParam() });
  }
  createOscillator() {
    return Object.assign(new FakeSource(), { frequency: new FakeParam() });
  }
  createBufferSource() {
    return new FakeSource();
  }
}

/** An unlocked, running TestCellAudio on the fake context, with the clock back at zero. */
export async function createAudio() {
  globalThis.window = { AudioContext: FakeAudioContext };
  clock.now = 0;
  scheduleLog.length = 0;
  const audio = new TestCellAudio();
  audio.enabled = true;
  await audio.unlock();
  return audio;
}

/** n seconds of frames at a constant frame rate, as an array of frame durations. */
export const steady = (fps, seconds = 8) => Array(Math.round(seconds * fps)).fill(1 / fps);

/** Small deterministic PRNG so jitter tests are repeatable. */
export function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Runs the audio module through frames of the given durations, taking the same crank step main.js
 * takes each frame, and records every cylinder pulse: when it would sound, which cylinder, which frame.
 *
 * jumpAt / jumpDeg move the crank angle between frames, the way the QA setFixture hook can.
 */
export async function simulate({ rpm, dts, slow = false, fuel = true, jumpAt = null, jumpDeg = 0 }) {
  const audio = await createAudio();
  const events = [];
  let frame = -1;
  audio._triggerCylinderPulse = (cylinder, { delay = 0 }) => {
    events.push({ t: clock.now + delay, n: cylinder.number, frame, delay });
  };
  const timeScale = slow ? SLOW_MOTION_SCALE : 1;
  const state = {
    rpm,
    crankAngle: 0,
    fuel,
    starting: false,
    slowMotion: slow,
    cutaway: false,
    _telemetry: { rail: 20000, boost: 15, vane: 40 },
  };
  const frameEnd = [];
  for (let i = 0; i < dts.length; i++) {
    frame = i;
    if (jumpAt === i) state.crankAngle = mod(state.crankAngle + jumpDeg, 720);
    clock.now += dts[i];
    frameEnd.push(clock.now);
    state.crankAngle = mod(state.crankAngle + rpm * 6 * dts[i] * timeScale, 720);
    audio.update(dts[i], state, null);
  }
  return { events, tEnd: clock.now, frameEnd };
}

/** Spacing and firing-order quality of a set of pulses: 90 degrees of crank apart, in firing order. */
export function gapStats(events, rpm, { slow = false } = {}) {
  const sorted = [...events].sort((a, b) => a.t - b.t);
  const idealGapS = 15 / (rpm * (slow ? SLOW_MOTION_SCALE : 1));
  let worstGapErrorS = 0;
  let firingOrderKept = true;
  for (let i = 1; i < sorted.length; i++) {
    worstGapErrorS = Math.max(worstGapErrorS, Math.abs(sorted[i].t - sorted[i - 1].t - idealGapS));
    const next = (FIRING_ORDER.indexOf(sorted[i - 1].n) + 1) % FIRING_ORDER.length;
    if (FIRING_ORDER.indexOf(sorted[i].n) !== next) firingOrderKept = false;
  }
  return { idealGapS, worstGapErrorS, firingOrderKept };
}

/** Pulse count against the ideal rate (four firing events per crank revolution), plus gapStats. */
export function analyze(run, rpm, { slow = false, from = 0.5 } = {}) {
  const inWindow = run.events.filter((e) => e.t >= from && e.t <= run.tEnd);
  const idealRate = (rpm / 60) * 4 * (slow ? SLOW_MOTION_SCALE : 1);
  return { count: inWindow.length, expected: idealRate * (run.tEnd - from), ...gapStats(inWindow, rpm, { slow }) };
}
