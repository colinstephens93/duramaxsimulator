import * as THREE from 'three';
import { CYLINDERS, mod } from './kinematics.js';

const MAX_RPM = 3250;
// Frames longer than this are stalls (tab switch, shader compile), not motion worth
// replaying as a burst of cylinder pulses.
const MAX_PULSE_FRAME_S = 0.2;

function makeSaturationCurve(amount = 2.4, samples = 1024) {
  const curve = new Float32Array(samples);
  const norm = Math.tanh(amount);
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / (samples - 1) - 1;
    curve[i] = Math.tanh(x * amount) / norm;
  }
  return curve;
}

function makeNoiseBuffer(ctx, seconds = 2.5) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  // Pink-ish weighted noise for natural mechanical/airflow texture
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.997 * b0 + white * 0.029;
    b1 = 0.985 * b1 + white * 0.032;
    b2 = 0.95 * b2 + white * 0.048;
    data[i] = THREE.MathUtils.clamp((b0 + b1 + b2 + white * 0.18) * 1.4, -1, 1);
  }
  return buffer;
}

export class TestCellAudio {
  constructor() {
    this.ctx = null;
    this.initialized = false;
    this.enabled = true; // Active by default once browser unlocks audio
    this.unlocked = false;
    this.masterVolume = 0.72;
    this.lastCrankAngle = null;
    this.smoothedTurboNorm = 0.08;
    this._camPos = new THREE.Vector3();
    this._camFwd = new THREE.Vector3();
    this._camUp = new THREE.Vector3();
  }

  _initContext() {
    if (this.initialized) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    this.ctx = ctx;
    this.initialized = true;
    this.noiseBuffer = makeNoiseBuffer(ctx, 2.5);

    // Master limiter + gain
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -10;
    compressor.knee.value = 12;
    compressor.ratio.value = 6;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.12;

    const masterGain = ctx.createGain();
    masterGain.gain.value = this.enabled ? this.masterVolume : 0;
    compressor.connect(masterGain);
    masterGain.connect(ctx.destination);
    this.masterGain = masterGain;

    // 3D spatial panner anchored to the engine block center (0, 1.05, 0)
    const panner = ctx.createPanner();
    panner.panningModel = 'equalpower';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1.65;
    panner.maxDistance = 14;
    panner.rolloffFactor = 0.78;
    if (panner.positionX) {
      panner.positionX.value = 0;
      panner.positionY.value = 1.05;
      panner.positionZ.value = 0;
    } else {
      panner.setPosition(0, 1.05, 0);
    }
    panner.connect(compressor);
    this.panner = panner;

    // -----------------------------------------------------------------------
    // 1. 90° V8 Exhaust & Block Rumble Bus
    // -----------------------------------------------------------------------
    const exhaustShaper = ctx.createWaveShaper();
    exhaustShaper.curve = makeSaturationCurve(2.8);
    exhaustShaper.oversample = '2x';

    const exhaustFilter = ctx.createBiquadFilter();
    exhaustFilter.type = 'lowpass';
    exhaustFilter.frequency.value = 145;
    exhaustFilter.Q.value = 2.1;

    const exhaustSubFilter = ctx.createBiquadFilter();
    exhaustSubFilter.type = 'peaking';
    exhaustSubFilter.frequency.value = 68;
    exhaustSubFilter.Q.value = 1.4;
    exhaustSubFilter.gain.value = 6.5;

    const exhaustGain = ctx.createGain();
    exhaustGain.gain.value = 0;

    // Primary firing frequency (4 pulses per rev on 4-stroke V8)
    const firingOsc = ctx.createOscillator();
    firingOsc.type = 'sawtooth';
    firingOsc.frequency.value = 45.3;

    // Cross-plane 90° V8 bank cadence (2 pulses per rev)
    const bankOsc = ctx.createOscillator();
    bankOsc.type = 'triangle';
    bankOsc.frequency.value = 22.65;
    const bankGain = ctx.createGain();
    bankGain.gain.value = 0.65;

    // Crankshaft fundamental (1 pulse per rev)
    const crankOsc = ctx.createOscillator();
    crankOsc.type = 'sine';
    crankOsc.frequency.value = 11.33;
    const crankGain = ctx.createGain();
    crankGain.gain.value = 0.42;

    firingOsc.connect(exhaustShaper);
    bankOsc.connect(bankGain);
    bankGain.connect(exhaustShaper);
    crankOsc.connect(crankGain);
    crankGain.connect(exhaustShaper);

    exhaustShaper.connect(exhaustSubFilter);
    exhaustSubFilter.connect(exhaustFilter);
    exhaustFilter.connect(exhaustGain);
    exhaustGain.connect(panner);

    firingOsc.start();
    bankOsc.start();
    crankOsc.start();

    this.firingOsc = firingOsc;
    this.bankOsc = bankOsc;
    this.crankOsc = crankOsc;
    this.exhaustFilter = exhaustFilter;
    this.exhaustSubFilter = exhaustSubFilter;
    this.exhaustGain = exhaustGain;

    // -----------------------------------------------------------------------
    // 2. Mechanical Crankcase & Valvetrain Texture Loop
    // -----------------------------------------------------------------------
    const mechNoise = ctx.createBufferSource();
    mechNoise.buffer = this.noiseBuffer;
    mechNoise.loop = true;

    const mechFilter = ctx.createBiquadFilter();
    mechFilter.type = 'bandpass';
    mechFilter.frequency.value = 620;
    mechFilter.Q.value = 1.8;

    const mechGain = ctx.createGain();
    mechGain.gain.value = 0;

    mechNoise.connect(mechFilter);
    mechFilter.connect(mechGain);
    mechGain.connect(panner);
    mechNoise.start();

    this.mechFilter = mechFilter;
    this.mechGain = mechGain;

    // -----------------------------------------------------------------------
    // 3. Garrett GT3788VA VNT Turbo Whistle & Boost Rush
    // -----------------------------------------------------------------------
    const whistleOsc = ctx.createOscillator();
    whistleOsc.type = 'sine';
    whistleOsc.frequency.value = 1480;

    const whistleHarmOsc = ctx.createOscillator();
    whistleHarmOsc.type = 'sine';
    whistleHarmOsc.frequency.value = 2220;

    const whistleHarmGain = ctx.createGain();
    whistleHarmGain.gain.value = 0.22;

    const whistleGain = ctx.createGain();
    whistleGain.gain.value = 0;

    whistleOsc.connect(whistleGain);
    whistleHarmOsc.connect(whistleHarmGain);
    whistleHarmGain.connect(whistleGain);
    whistleGain.connect(panner);

    whistleOsc.start();
    whistleHarmOsc.start();

    // Boost air whoosh
    const boostNoise = ctx.createBufferSource();
    boostNoise.buffer = this.noiseBuffer;
    boostNoise.loop = true;

    const boostFilter = ctx.createBiquadFilter();
    boostFilter.type = 'bandpass';
    boostFilter.frequency.value = 950;
    boostFilter.Q.value = 2.4;

    const boostGain = ctx.createGain();
    boostGain.gain.value = 0;

    boostNoise.connect(boostFilter);
    boostFilter.connect(boostGain);
    boostGain.connect(panner);
    boostNoise.start();

    this.whistleOsc = whistleOsc;
    this.whistleHarmOsc = whistleHarmOsc;
    this.whistleGain = whistleGain;
    this.boostFilter = boostFilter;
    this.boostGain = boostGain;

    // -----------------------------------------------------------------------
    // 4. Denso 12V Gear-Reduction Starter Motor Bus
    // -----------------------------------------------------------------------
    const starterOsc = ctx.createOscillator();
    starterOsc.type = 'sawtooth';
    starterOsc.frequency.value = 175;

    const starterMeshOsc = ctx.createOscillator();
    starterMeshOsc.type = 'square';
    starterMeshOsc.frequency.value = 525;
    const starterMeshGain = ctx.createGain();
    starterMeshGain.gain.value = 0.28;

    const starterFilter = ctx.createBiquadFilter();
    starterFilter.type = 'bandpass';
    starterFilter.frequency.value = 440;
    starterFilter.Q.value = 2.6;

    const starterGain = ctx.createGain();
    starterGain.gain.value = 0;

    starterOsc.connect(starterFilter);
    starterMeshOsc.connect(starterMeshGain);
    starterMeshGain.connect(starterFilter);
    starterFilter.connect(starterGain);
    starterGain.connect(panner);

    starterOsc.start();
    starterMeshOsc.start();

    this.starterOsc = starterOsc;
    this.starterMeshOsc = starterMeshOsc;
    this.starterFilter = starterFilter;
    this.starterGain = starterGain;
  }

  async unlock() {
    if (!this.initialized) this._initContext();
    if (!this.ctx) return false;
    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        return false;
      }
    }
    this.unlocked = this.ctx.state === 'running';
    return this.unlocked;
  }

  async toggle() {
    if (!this.initialized || !this.unlocked) {
      this.enabled = true;
      await this.unlock();
    } else {
      this.enabled = !this.enabled;
    }
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(this.enabled ? this.masterVolume : 0, now, 0.04);
    }
    return this.isActive();
  }

  setEnabled(on) {
    this.enabled = Boolean(on);
    if (this.enabled) {
      this.unlock();
    }
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(this.enabled ? this.masterVolume : 0, now, 0.04);
    }
  }

  isActive() {
    return Boolean(this.enabled && this.unlocked && this.ctx?.state === 'running');
  }

  /**
   * Fires a single cylinder's direct-injection pilot/main clatter + combustion thump,
   * `delay` seconds from now so it can land where the cylinder crossed TDC mid-frame.
   */
  _triggerCylinderPulse(cylinder, { rpm, rail, cutaway, slowMotion, delay = 0 }) {
    if (!this.isActive()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime + delay;

    const loadNorm = THREE.MathUtils.clamp((rpm - 550) / (MAX_RPM - 550), 0, 1);
    const railNorm = THREE.MathUtils.clamp((rail - 5000) / 21000, 0.15, 1);
    // Keep individual impulses crisper at idle/slow-motion and smoothly blended at high RPM
    const rateAtten = slowMotion ? 1.15 : THREE.MathUtils.lerp(1.0, 0.42, loadNorm);

    // 1. Bosch CP3.3 / solenoid injector pilot + main knock clatter
    const clickSrc = ctx.createBufferSource();
    clickSrc.buffer = this.noiseBuffer;
    // Slight random offset into the 2.5s noise buffer
    const offset = Math.random() * 1.8;

    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = 'bandpass';
    // Right vs Left bank slight acoustic formant difference + cutaway brightness
    const bankShift = cylinder.bank === 'R' ? 1.04 : 0.96;
    const xrayBoost = cutaway ? 1.22 : 1.0;
    clickFilter.frequency.value = (2150 + railNorm * 950) * bankShift * xrayBoost;
    clickFilter.Q.value = 3.6;

    const clickGain = ctx.createGain();
    const peakClick = (0.14 + railNorm * 0.11) * rateAtten * (cutaway ? 1.25 : 1.0);
    clickGain.gain.setValueAtTime(0.0001, now);
    // Pilot injection pre-click (4 ms before main) + main injection peak
    clickGain.gain.linearRampToValueAtTime(peakClick * 0.55, now + 0.002);
    clickGain.gain.linearRampToValueAtTime(0.015, now + 0.005);
    clickGain.gain.linearRampToValueAtTime(peakClick, now + 0.007);
    clickGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.026);

    clickSrc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(this.panner);
    clickSrc.start(now, offset, 0.032);

    // 2. Cylinder power-stroke combustion thump
    const thumpOsc = ctx.createOscillator();
    thumpOsc.type = 'triangle';
    const baseThumpHz = cylinder.bank === 'R' ? 112 : 106;
    thumpOsc.frequency.setValueAtTime(baseThumpHz + loadNorm * 34, now);
    thumpOsc.frequency.exponentialRampToValueAtTime(48, now + 0.038);

    const thumpGain = ctx.createGain();
    const peakThump = (0.18 + loadNorm * 0.08) * rateAtten;
    thumpGain.gain.setValueAtTime(0.0001, now);
    thumpGain.gain.linearRampToValueAtTime(peakThump, now + 0.003);
    thumpGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.042);

    thumpOsc.connect(thumpGain);
    thumpGain.connect(this.panner);
    thumpOsc.start(now);
    thumpOsc.stop(now + 0.045);
  }

  update(dt, state, camera) {
    if (!this.isActive()) {
      this.lastCrankAngle = state.crankAngle;
      return;
    }

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const rpm = Math.max(0, state.rpm || 0);
    const timeScale = state.slowMotion ? 0.12 : 1.0;
    const effectiveRpm = rpm * timeScale;
    const firing = Boolean(state.fuel && rpm > 80);
    const starting = Boolean(state.starting);
    const telemetry = state._telemetry || {};
    const rail = telemetry.rail || 7050;
    const boost = telemetry.boost || 0;
    const vane = telemetry.vane ?? 62;
    const cutaway = Boolean(state.cutaway);

    // Update 3D listener pose from Three.js camera
    if (camera && ctx.listener) {
      camera.getWorldPosition(this._camPos);
      camera.getWorldDirection(this._camFwd);
      this._camUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
      const l = ctx.listener;
      if (l.positionX) {
        l.positionX.setTargetAtTime(this._camPos.x, now, 0.02);
        l.positionY.setTargetAtTime(this._camPos.y, now, 0.02);
        l.positionZ.setTargetAtTime(this._camPos.z, now, 0.02);
        l.forwardX.setTargetAtTime(this._camFwd.x, now, 0.02);
        l.forwardY.setTargetAtTime(this._camFwd.y, now, 0.02);
        l.forwardZ.setTargetAtTime(this._camFwd.z, now, 0.02);
        l.upX.setTargetAtTime(this._camUp.x, now, 0.02);
        l.upY.setTargetAtTime(this._camUp.y, now, 0.02);
        l.upZ.setTargetAtTime(this._camUp.z, now, 0.02);
      } else if (l.setPosition) {
        l.setPosition(this._camPos.x, this._camPos.y, this._camPos.z);
        l.setOrientation(
          this._camFwd.x,
          this._camFwd.y,
          this._camFwd.z,
          this._camUp.x,
          this._camUp.y,
          this._camUp.z,
        );
      }
    }

    // 1. Continuous 90° V8 Exhaust & Crankcase Rumble
    const crankHz = Math.max(4, effectiveRpm / 60);
    const firingHz = Math.max(12, (effectiveRpm * 4) / 60);
    const rpmNorm = THREE.MathUtils.clamp(rpm / MAX_RPM, 0, 1);

    this.firingOsc.frequency.setTargetAtTime(firingHz, now, 0.03);
    this.bankOsc.frequency.setTargetAtTime(firingHz * 0.5, now, 0.03);
    this.crankOsc.frequency.setTargetAtTime(crankHz, now, 0.03);

    const cutoff = firing
      ? 115 + rpmNorm * 410 + (boost / 23) * 95
      : 70 + rpmNorm * 120;
    this.exhaustFilter.frequency.setTargetAtTime(cutoff, now, 0.04);

    const rumbleLevel = firing
      ? THREE.MathUtils.lerp(0.24, 0.42, rpmNorm) * (state.slowMotion ? 0.65 : 1.0)
      : rpm > 15
        ? THREE.MathUtils.lerp(0.02, 0.09, rpmNorm)
        : 0;
    this.exhaustGain.gain.setTargetAtTime(rumbleLevel, now, 0.045);

    // 2. Valvetrain / gear train whir
    this.mechFilter.frequency.setTargetAtTime(
      (380 + rpmNorm * 1450) * (cutaway ? 1.25 : 1.0),
      now,
      0.04,
    );
    const mechLevel =
      rpm > 10
        ? (0.018 + rpmNorm * 0.065) * (cutaway ? 1.45 : 1.0)
        : 0;
    this.mechGain.gain.setTargetAtTime(mechLevel, now, 0.05);

    // 3. Garrett GT3788VA VNT Turbo Whistle & Boost Air Rush
    const targetTurboNorm = firing
      ? THREE.MathUtils.clamp(0.12 + rpmNorm * 0.65 + (boost / 23) * 0.35, 0, 1)
      : rpm > 30
        ? rpmNorm * 0.15
        : 0;
    this.smoothedTurboNorm = THREE.MathUtils.damp(
      this.smoothedTurboNorm,
      targetTurboNorm,
      2.4,
      dt,
    );

    const vaneFactor = THREE.MathUtils.clamp(vane / 100, 0.15, 1);
    const whistleHz =
      (1320 + this.smoothedTurboNorm * 3150 + vaneFactor * 240) *
      (state.slowMotion ? 0.45 : 1.0);
    this.whistleOsc.frequency.setTargetAtTime(whistleHz, now, 0.05);
    this.whistleHarmOsc.frequency.setTargetAtTime(whistleHz * 1.498, now, 0.05);

    // VNT whistle is prominent when vanes are closed at idle/mid-range and under spool
    const whistleGainTarget =
      rpm > 80
        ? (0.012 + this.smoothedTurboNorm * 0.042) * (0.65 + vaneFactor * 0.55)
        : 0;
    this.whistleGain.gain.setTargetAtTime(whistleGainTarget, now, 0.06);

    this.boostFilter.frequency.setTargetAtTime(520 + this.smoothedTurboNorm * 1650, now, 0.05);
    const boostWhooshTarget = firing ? (boost / 23) * 0.085 : 0;
    this.boostGain.gain.setTargetAtTime(boostWhooshTarget, now, 0.06);

    // 4. Denso Gear-Reduction Starter Whine (active during cranking phase)
    if (starting && rpm < 600) {
      // Compression ripple as cylinders pass TDC during starter cranking
      const ripple = 1 + 0.16 * Math.sin((state.crankAngle * Math.PI) / 45);
      const baseStarterHz = (145 + (rpm / 220) * 65) * ripple;
      this.starterOsc.frequency.setTargetAtTime(baseStarterHz, now, 0.015);
      this.starterMeshOsc.frequency.setTargetAtTime(baseStarterHz * 3.0, now, 0.015);
      this.starterFilter.frequency.setTargetAtTime(380 + rpm * 0.9, now, 0.02);
      const starterVol = !state.fuel ? 0.16 : 0.07;
      this.starterGain.gain.setTargetAtTime(starterVol, now, 0.025);
    } else {
      this.starterGain.gain.setTargetAtTime(0, now, 0.04);
    }

    // 5. Phase-locked per-cylinder direct-injection & combustion pulses.
    // Walk every firing angle the crank passed this frame, however many laps that
    // is, and delay each pulse to the point in the frame where its cylinder crossed
    // it, so the cadence stays even at any RPM and frame rate instead of bunching up
    // on frame boundaries. Stalls (frames over MAX_PULSE_FRAME_S) are skipped rather
    // than replayed; the next frame re-anchors on the live crank angle.
    const frameAdvance = effectiveRpm * 6 * dt;
    if (this.lastCrankAngle !== null && firing && dt <= MAX_PULSE_FRAME_S) {
      const prev = this.lastCrankAngle;
      for (const cyl of CYLINDERS) {
        let distFromPrev = mod(cyl.fireAngle - prev, 720) || 720;
        while (distFromPrev <= frameAdvance) {
          this._triggerCylinderPulse(cyl, {
            rpm,
            rail,
            cutaway,
            slowMotion: state.slowMotion,
            delay: (distFromPrev / frameAdvance) * dt,
          });
          distFromPrev += 720;
        }
      }
    }
    this.lastCrankAngle = state.crankAngle;
  }
}
