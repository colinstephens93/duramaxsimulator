import { clamp, damp } from '../utils.js';
import { mod } from '../kinematics.js';

export function startRun(sim, engine, target) {
  const wanted = target > 0 ? clamp(target, 0, engine.ratings.redlineRpm) : engine.ratings.idleRpm;
  sim.desiredRpm = wanted;
  sim.lastRpmTarget = wanted;
  if (sim.engineOn && !sim.starting) return false;
  sim.engineOn = true;
  sim.starting = true;
  sim.startTimer = 0;
  sim.fuel = false;
  sim.glow = engine.startSequence.glow.onStart;
  sim.hasRun = true;
  return true;
}

export function stopRun(sim) {
  sim.engineOn = false;
  sim.starting = false;
  sim.fuel = false;
  sim.desiredRpm = 0;
  sim.lastRpmTarget = 0;
}

export function stepRun(sim, engine, dt, timeScale) {
  const s = sim;
  const start = engine.startSequence;
  if (s.engineOn) {
    if (s.starting) {
      s.startTimer += dt;
      if (s.startTimer < start.crankUntilS) {
        s.fuel = false;
        s.rpm = damp(s.rpm, start.crankRpm, start.crankDamping, dt);
        s.glow = damp(s.glow, start.glow.crank.target, start.glow.crank.damping, dt);
      } else if (s.startTimer < start.lightOffUntilS) {
        s.fuel = true;
        s.rpm = damp(s.rpm, start.lightOffRpm, start.lightOffDamping, dt);
        s.glow = damp(s.glow, start.glow.lightOff.target, start.glow.lightOff.damping, dt);
      } else if (s.startTimer < start.idleUntilS) {
        s.fuel = true;
        s.rpm = damp(s.rpm, engine.ratings.idleRpm, start.idleDamping, dt);
        s.glow = damp(s.glow, start.glow.idle.target, start.glow.idle.damping, dt);
      } else {
        s.fuel = true;
        const transitionTarget =
          s.desiredRpm > engine.ratings.idleRpm ? s.desiredRpm : Math.max(s.desiredRpm, engine.ratings.idleRpm);
        s.rpm = damp(s.rpm, transitionTarget, s.desiredRpm > start.rampDamping.aboveRpm ? start.rampDamping.fast : start.rampDamping.slow, dt);
        s.glow = damp(s.glow, start.glow.ramp.target, start.glow.ramp.damping, dt);
        if (s.startTimer > start.rampEndS) s.starting = false;
      }
    } else {
      s.fuel = true;
      const target = Math.max(engine.ratings.idleRpm, s.desiredRpm);
      s.rpm = damp(s.rpm, target, target > start.runDamping.aboveRpm ? start.runDamping.fast : start.runDamping.slow, dt);
      s.glow = damp(s.glow, start.glow.running.target, start.glow.running.damping, dt);
    }
  } else {
    s.fuel = false;
    s.starting = false;
    s.rpm = damp(s.rpm, 0, start.stopDamping, dt);
    if (s.rpm < start.stopSnapRpm) s.rpm = 0;
    if (s.glow > start.glow.stopped.cutoff) s.glow = damp(s.glow, 0, start.glow.stopped.damping, dt);
  }
  s.rpm = clamp(s.rpm, 0, engine.ratings.redlineRpm + start.overspeedHeadroomRpm);
  if (s.rpm > engine.ratings.redlineRpm) s.rpm = damp(s.rpm, engine.ratings.redlineRpm, start.overspeedDamping, dt);
  s.crankAngle = mod(s.crankAngle + s.rpm * 6 * dt * timeScale, 720);
}
