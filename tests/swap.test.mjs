import { it } from 'node:test';
import assert from 'node:assert/strict';
import { createEngineSwitcher, createRequestToken } from '../src/core/swap.js';
import { TestCellAudio } from '../src/audio.js';

const deferred = () => {
  let resolve, reject;
  const promise = new Promise((a, b) => { resolve = a; reject = b; });
  return { promise, resolve, reject };
};
const tick = () => new Promise(resolve => setImmediate(resolve));
function harness(overrides = {}) {
  const state = { current: { id: 'old' }, locks: [], disposed: [], errors: [], ready: [] };
  const callbacks = {
    getCurrent: () => state.current,
    load: async id => ({ id }), build: async loaded => ({ ...loaded }),
    commit: next => { state.current = next; }, rollback: previous => { state.current = previous; },
    dispose: value => state.disposed.push(value), stop: () => { state.stopped = true; },
    lock: locked => { state.locked = locked; state.locks.push(locked); },
    overlay: visible => { state.overlay = visible; }, paint: async () => {},
    ready: value => state.ready.push(value), error: failure => state.errors.push(failure),
    ...overrides,
  };
  return { state, switchEngine: createEngineSwitcher(callbacks) };
}

it('only the latest request token is current', () => {
  const tokens = createRequestToken();
  const first = tokens.begin(); assert.ok(tokens.isCurrent(first));
  const second = tokens.begin(); assert.ok(tokens.isCurrent(second)); assert.equal(tokens.isCurrent(first), false);
});
it('commits a built replacement, disposes the previous record, and unlocks', async () => {
  const { state, switchEngine } = harness(); const previous = state.current;
  assert.equal((await switchEngine('next')).status, 'committed');
  assert.equal(state.current.id, 'next'); assert.equal(state.disposed[0], previous);
  assert.equal(state.stopped, true); assert.equal(state.locked, false); assert.equal(state.overlay, false);
});
it('a late load cannot overwrite or unlock the latest replacement', async () => {
  const gate = deferred(); const { state, switchEngine } = harness({ load: id => id === 'slow' ? gate.promise : Promise.resolve({ id }) });
  const first = switchEngine('slow'); await tick();
  await switchEngine('fast'); const lockCount = state.locks.length;
  gate.resolve({ id: 'slow' }); assert.equal((await first).status, 'superseded');
  assert.equal(state.current.id, 'fast'); assert.equal(state.locks.length, lockCount); assert.deepEqual(state.errors, []);
});
it('a stale completed build is discarded without disposing the active replacement', async () => {
  const gate = deferred(); const { state, switchEngine } = harness({ build: loaded => loaded.id === 'slow' ? gate.promise : Promise.resolve(loaded) });
  const first = switchEngine('slow'); await tick(); await switchEngine('fast');
  const stale = { id: 'slow' }; gate.resolve(stale);
  assert.equal((await first).status, 'superseded'); assert.ok(state.disposed.includes(stale));
  assert.equal(state.current.id, 'fast'); assert.equal(state.disposed.includes(state.current), false);
});
it('selecting the current engine cancels pending work; reload deliberately rebuilds it', async () => {
  const gate = deferred(); const { state, switchEngine } = harness({ load: id => id === 'slow' ? gate.promise : Promise.resolve({ id }) });
  const original = state.current; const first = switchEngine('slow'); await tick();
  assert.equal((await switchEngine('old')).status, 'unchanged'); gate.resolve({ id: 'slow' }); await first;
  assert.equal(state.current, original); assert.equal(state.locked, false);
  assert.equal((await switchEngine('old', { reload: true })).status, 'committed'); assert.notEqual(state.current, original);
});
it('load failures preserve the previous engine and release the input lock', async () => {
  const { state, switchEngine } = harness({ load: async () => { throw Error('unavailable'); } });
  const previous = state.current;
  assert.equal((await switchEngine('bad')).status, 'error'); assert.equal(state.current, previous);
  assert.equal(state.errors.length, 1); assert.equal(state.locked, false); assert.deepEqual(state.disposed, []);
});
it('failed commits restore previous bindings and discard the candidate', async () => {
  let state;
  const setup = harness({ commit: next => { state.current = next; throw Error('bind failure'); }, rollback: previous => { state.current = previous; } });
  state = setup.state; const previous = state.current;
  assert.equal((await setup.switchEngine('bad')).status, 'error'); assert.equal(state.current, previous);
  assert.deepEqual(state.disposed.map(value => value.id), ['bad']); assert.equal(state.locked, false);
});
it('stale load failures do not report errors over the latest successful request', async () => {
  const gate = deferred(); const { state, switchEngine } = harness({ load: id => id === 'slow' ? gate.promise : Promise.resolve({ id }) });
  const first = switchEngine('slow'); await tick(); await switchEngine('fast'); gate.reject(Error('stale failure'));
  assert.equal((await first).status, 'superseded'); assert.equal(state.current.id, 'fast'); assert.deepEqual(state.errors, []);
});
it('cleanup failures do not roll back a successfully committed engine', async () => {
  const { state, switchEngine } = harness({ dispose: () => { throw Error('cleanup'); } });
  const result = await switchEngine('next'); assert.equal(result.status, 'committed'); assert.ok(result.cleanupError);
  assert.equal(state.current.id, 'next'); assert.equal(state.locked, false);
});
it('audio reconfiguration changes layout/tone and clears pulse history without replacing its context', () => {
  const audio = new TestCellAudio({ cylinders: [] }); const events = [];
  const param = name => ({ setValueAtTime: (value, time) => events.push([name, value, time]) });
  const context = { currentTime: 7 }; audio.ctx = context;
  audio.firingOsc = { frequency: param('firing') }; audio.bankOsc = { frequency: param('bank') }; audio.bankGain = { gain: param('gain') };
  audio.lastCrankAngle = 410;
  const config = { cylinders: [{ number: 1, fireAngle: 0 }], baseToneHz: 60, bankCadence: false };
  audio.configure(config);
  assert.equal(audio.ctx, context); assert.equal(audio.cylinders, config.cylinders); assert.equal(audio.lastCrankAngle, null);
  assert.deepEqual(events, [['firing', 60, 7], ['bank', 30, 7], ['gain', 0, 7]]);
});
