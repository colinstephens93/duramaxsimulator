import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import lly from '../src/engines/lly/index.js';
import { startRun, stopRun, stepRun } from '../src/core/simulation.js';
import { damp } from '../src/utils.js';

const DT = 0.01;

const makeSim = () => ({
  engineOn: false,
  starting: false,
  fuel: false,
  startTimer: 0,
  rpm: 0,
  desiredRpm: 0,
  lastRpmTarget: 0,
  crankAngle: 0,
  glow: 0,
  hasRun: false,
});

const stepSeconds = (sim, seconds) => {
  const steps = Math.round(seconds / DT);
  for (let i = 0; i < steps; i += 1) stepRun(sim, lly, DT, 1);
};

describe('start and stop', () => {
  it('starts a stopped engine on the glow plugs with fuel off', () => {
    const sim = makeSim();
    assert.equal(startRun(sim, lly, 0), true);
    assert.equal(sim.engineOn, true);
    assert.equal(sim.starting, true);
    assert.equal(sim.fuel, false);
    assert.equal(sim.glow, lly.startSequence.glow.onStart);
    assert.equal(sim.hasRun, true);
  });

  it('does not restart a running engine but takes the new setpoint', () => {
    const sim = { ...makeSim(), engineOn: true, starting: false, desiredRpm: lly.ratings.idleRpm };
    assert.equal(startRun(sim, lly, 2000), false);
    assert.equal(sim.starting, false);
    assert.equal(sim.desiredRpm, 2000);
  });

  it('clamps a setpoint above redline to redline', () => {
    const sim = makeSim();
    startRun(sim, lly, lly.ratings.redlineRpm + 500);
    assert.equal(sim.desiredRpm, lly.ratings.redlineRpm);
  });

  it('starts at idle when no setpoint is given', () => {
    const sim = makeSim();
    startRun(sim, lly, 0);
    assert.equal(sim.desiredRpm, lly.ratings.idleRpm);
  });

  it('cuts fuel and clears the setpoint on stop', () => {
    const sim = { ...makeSim(), engineOn: true, starting: true, fuel: true, desiredRpm: 2000 };
    stopRun(sim);
    assert.equal(sim.engineOn, false);
    assert.equal(sim.starting, false);
    assert.equal(sim.fuel, false);
    assert.equal(sim.desiredRpm, 0);
    assert.equal(sim.lastRpmTarget, 0);
  });
});

describe('start-up and running', () => {
  it('keeps fuel off while cranking and turns it on after crankUntilS', () => {
    const sim = makeSim();
    startRun(sim, lly, 0);
    const steps = Math.round(lly.startSequence.crankUntilS / DT) - 1;
    for (let i = 0; i < steps; i += 1) stepRun(sim, lly, DT, 1);
    assert.equal(sim.fuel, false);
    stepRun(sim, lly, DT, 1);
    assert.equal(sim.fuel, true);
  });

  it('ends starting after rampEndS', () => {
    const sim = makeSim();
    startRun(sim, lly, lly.ratings.idleRpm);
    stepSeconds(sim, lly.startSequence.rampEndS + DT);
    assert.equal(sim.starting, false);
  });

  it('uses fast ramp damping above the ramp threshold', () => {
    const sim = {
      ...makeSim(),
      engineOn: true,
      starting: true,
      startTimer: lly.startSequence.idleUntilS,
      rpm: 800,
      desiredRpm: lly.startSequence.rampDamping.aboveRpm + 100,
    };
    stepRun(sim, lly, DT, 1);
    assert.equal(sim.rpm, damp(800, sim.desiredRpm, lly.startSequence.rampDamping.fast, DT));
  });

  it('uses slow ramp damping at the ramp threshold', () => {
    const sim = {
      ...makeSim(),
      engineOn: true,
      starting: true,
      startTimer: lly.startSequence.idleUntilS,
      rpm: 800,
      desiredRpm: lly.startSequence.rampDamping.aboveRpm,
    };
    stepRun(sim, lly, DT, 1);
    assert.equal(sim.rpm, damp(800, sim.desiredRpm, lly.startSequence.rampDamping.slow, DT));
  });

  it('uses fast running damping above the running threshold', () => {
    const sim = {
      ...makeSim(),
      engineOn: true,
      starting: false,
      rpm: 1000,
      desiredRpm: lly.startSequence.runDamping.aboveRpm + 100,
    };
    stepRun(sim, lly, DT, 1);
    assert.equal(sim.rpm, damp(1000, sim.desiredRpm, lly.startSequence.runDamping.fast, DT));
  });

  it('uses slow running damping at the running threshold', () => {
    const sim = {
      ...makeSim(),
      engineOn: true,
      starting: false,
      rpm: 1000,
      desiredRpm: lly.startSequence.runDamping.aboveRpm,
    };
    stepRun(sim, lly, DT, 1);
    assert.equal(sim.rpm, damp(1000, sim.desiredRpm, lly.startSequence.runDamping.slow, DT));
  });

  it('snaps a spinning-down engine below stopSnapRpm to zero', () => {
    const sim = {
      ...makeSim(),
      engineOn: false,
      rpm: lly.startSequence.stopSnapRpm / 2,
    };
    stepRun(sim, lly, DT, 1);
    assert.equal(sim.rpm, 0);
  });

  it('holds overspeed above redline and below redline plus headroom', () => {
    const sim = {
      ...makeSim(),
      engineOn: true,
      starting: false,
      desiredRpm: lly.ratings.redlineRpm,
      rpm: lly.ratings.redlineRpm + 500,
    };
    stepRun(sim, lly, DT, 1);
    assert.ok(sim.rpm > lly.ratings.redlineRpm);
    assert.ok(sim.rpm < lly.ratings.redlineRpm + lly.startSequence.overspeedHeadroomRpm);
  });
});
