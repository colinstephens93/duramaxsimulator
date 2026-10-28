import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createMaterials } from './utils.js';
import { buildEngine } from './engine.js';
import { buildEnvironment } from './environment.js';
import { TestCellAudio } from './audio.js';
import {
  CALIBRATIONS,
  CYLINDERS,
  FIRING_ORDER,
  LLY,
  boostAtRpm,
  coolantAtRpm,
  cylinderState,
  egtAtRpm,
  horsepowerAtRpm,
  mod,
  oilPressureAtRpm,
  railPressureAtRpm,
  strokeAtCycle,
  torqueAtRpm,
  vaneAtRpm,
} from './kinematics.js';
import { COMPONENT_SPECS, getSpec } from './specs.js';

const TAU = Math.PI * 2;
const ENGINE_Y = 1.0;
const HOME_POSITION = new THREE.Vector3(1.62, 1.64, 2.02);
const HOME_TARGET = new THREE.Vector3(0, 1.035, -0.03);
const INTRO_POSITION = new THREE.Vector3(3.4, 2.25, 4.05);
const INTRO_TARGET = new THREE.Vector3(0, 1.14, -0.08);
const ENGINE_CENTER_XZ = new THREE.Vector2(0, -0.05);
const MAX_RPM = 3250;
const SLOW_MOTION_SCALE = 0.12;

const $ = (id) => document.getElementById(id);
const QA_MODE = new URLSearchParams(window.location.search).has('qa');
const clamp = THREE.MathUtils.clamp;
const damp = THREE.MathUtils.damp;
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const canvas = $('webgl');
const bootStatus = $('bootStatus');
const bootText = $('bootText');

let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true,
    stencil: false,
  });
} catch (err) {
  bootText.textContent = 'WEBGL UNAVAILABLE · CHECK BROWSER ACCELERATION';
  bootStatus.style.color = '#d7654b';
  throw err;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.02;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(37, window.innerWidth / window.innerHeight, 0.035, 70);
camera.position.copy(INTRO_POSITION);
camera.lookAt(INTRO_TARGET);

const materials = createMaterials();
const engine = buildEngine(materials);
engine.root.scale.setScalar(0.001);
engine.root.position.set(0, ENGINE_Y, 0);
scene.add(engine.root);

const environment = buildEnvironment(scene, renderer, materials);
const audio = new TestCellAudio();

// A small inspection fill keeps the exposed internals legible under X-ray /
// exploded presentation without changing the normal studio lighting.
const inspectionFill = new THREE.AmbientLight(0xd9e2dc, 0);
scene.add(inspectionFill);

// Combine both component registries so picking works across the cell.
const partRegistry = new Map();
for (const [id, roots] of engine.parts) partRegistry.set(id, roots.slice());
for (const [id, roots] of environment.interactives) {
  if (!partRegistry.has(id)) partRegistry.set(id, []);
  partRegistry.get(id).push(...roots);
}
const VALVETRAIN_IDS = ['camshaft', 'lifters', 'pushrods', 'rockers', 'valve-bridges', 'valves'];

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.rotateSpeed = 0.62;
controls.zoomSpeed = 0.78;
controls.panSpeed = 0.55;
controls.minDistance = 1.05;
controls.maxDistance = 6.6;
controls.minPolarAngle = 0.16;
controls.maxPolarAngle = Math.PI * 0.49;
controls.target.copy(HOME_TARGET);
controls.enabled = false;
controls.update();

// ---------------------------------------------------------------------------
// Post processing
// ---------------------------------------------------------------------------
const composer = new EffectComposer(renderer);
renderer.getDrawingBufferSize(new THREE.Vector2()); // ensure context is initialised
composer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
composer.setSize(window.innerWidth, window.innerHeight);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight, 16);
ssaoPass.kernelRadius = 8;
ssaoPass.minDistance = 0.001;
ssaoPass.maxDistance = 0.075;
ssaoPass.output = SSAOPass.OUTPUT.Default;
composer.addPass(ssaoPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.055,
  0.22,
  1.14,
);
composer.addPass(bloomPass);

const outlinePass = new OutlinePass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  scene,
  camera,
);
outlinePass.edgeStrength = 4.5;
outlinePass.edgeGlow = 0.3;
outlinePass.edgeThickness = 1.0;
outlinePass.pulsePeriod = 0;
outlinePass.visibleEdgeColor.set(0xe9a33d);
outlinePass.hiddenEdgeColor.set(0x20180c);
outlinePass.enabled = false;
composer.addPass(outlinePass);

const smaaPass = new SMAAPass();
composer.addPass(smaaPass);

const outputPass = new OutputPass();
composer.addPass(outputPass);

// ---------------------------------------------------------------------------
// Application state
// ---------------------------------------------------------------------------
const simulation = {
  // The cell presentation opens on a warm, stabilised idle. START/STOP always
  // runs the full cranking and idle-ramp sequence when the user commands it.
  engineOn: true,
  starting: false,
  fuel: true,
  startTimer: 0,
  rpm: LLY.idleRpm,
  desiredRpm: 680,
  lastRpmTarget: 680,
  crankAngle: 0,
  glow: 0,
  calibration: 'allison',
  slowMotion: false,
  cutaway: false,
  exploded: false,
  elapsed: 0,
  totalTime: 0,
  introDone: false,
  autoStarted: false,
  hasRun: true,
};

let cameraMode = 'orbit';
let introTween = null;
let cameraTween = null;
let selectedPart = null;
let hoveredPart = null;
let hoverTarget = null;
let outlineMode = 'none';
let pointerDown = null;
let mouseX = 0;
let mouseY = 0;
let hoverDirty = false;
let lastHoverCheck = 0;
let toastTimer = 0;
let uiTimer = 0;
let fpsSamples = [];
let qualityReduced = false;
let screenshotPending = false;
let startedAt = performance.now();
let frameCount = 0;

const raycaster = new THREE.Raycaster();
const pointerNdc = new THREE.Vector2();

const walk = {
  yaw: 0,
  pitch: 0,
  velocity: new THREE.Vector3(),
  keys: new Set(),
  bobPhase: 0,
  lastSafe: new THREE.Vector3(2.0, 1.66, 2.4),
};

// First frame / intro tween.
introTween = {
  startTime: 0,
  duration: 3.1,
  startPos: INTRO_POSITION.clone(),
  endPos: HOME_POSITION.clone(),
  startTarget: INTRO_TARGET.clone(),
  endTarget: HOME_TARGET.clone(),
};
camera.position.copy(INTRO_POSITION);
controls.target.copy(INTRO_TARGET);

// ---------------------------------------------------------------------------
// Simulation
// ---------------------------------------------------------------------------
function startEngine(target = simulation.desiredRpm) {
  const wanted = target > 0 ? clamp(target, 0, MAX_RPM) : 680;
  simulation.desiredRpm = wanted;
  simulation.lastRpmTarget = wanted;
  if (simulation.engineOn && !simulation.starting) return;
  simulation.engineOn = true;
  simulation.starting = true;
  simulation.startTimer = 0;
  simulation.fuel = false;
  simulation.glow = 0.85;
  simulation.hasRun = true;
  syncUI(true);
  if (!simulation.autoStarted) {
    showToast('START SEQUENCE INITIATED · GLOW PLUGS ON');
  }
}

function stopEngine() {
  simulation.engineOn = false;
  simulation.starting = false;
  simulation.fuel = false;
  simulation.desiredRpm = 0;
  simulation.lastRpmTarget = 0;
  syncUI(true);
  if (simulation.rpm > 0) showToast('FUEL CUT · ENGINE SPIN-DOWN');
}

function toggleEngine() {
  if (simulation.engineOn) stopEngine();
  else startEngine(simulation.desiredRpm > 0 ? simulation.desiredRpm : 680);
}

function setDesiredRpm(value, { autoStart = false } = {}) {
  const v = clamp(Math.round(value / 5) * 5, 0, MAX_RPM);
  if (v === 0) {
    simulation.desiredRpm = 0;
    if (simulation.engineOn) stopEngine();
    else syncUI(true);
    return;
  }
  simulation.desiredRpm = v;
  simulation.lastRpmTarget = v;
  if (!simulation.engineOn && autoStart) startEngine(v);
  else syncUI(true);
}

function updateSimulation(dt) {
  simulation.totalTime += dt;
  const s = simulation;
  const timeScale = s.slowMotion ? SLOW_MOTION_SCALE : 1;

  if (s.engineOn) {
    if (s.starting) {
      s.startTimer += dt;
      if (s.startTimer < 0.55) {
        s.fuel = false;
        s.rpm = damp(s.rpm, 190, 4.7, dt);
        s.glow = damp(s.glow, 1, 6, dt);
      } else if (s.startTimer < 1.25) {
        s.fuel = true;
        s.rpm = damp(s.rpm, 520, 3.1, dt);
        s.glow = damp(s.glow, 0.55, 4, dt);
      } else if (s.startTimer < 2.05) {
        s.fuel = true;
        s.rpm = damp(s.rpm, LLY.idleRpm, 2.2, dt);
        s.glow = damp(s.glow, 0.12, 2.4, dt);
      } else {
        s.fuel = true;
        const transitionTarget =
          s.desiredRpm > LLY.idleRpm ? s.desiredRpm : Math.max(s.desiredRpm, LLY.idleRpm);
        s.rpm = damp(s.rpm, transitionTarget, s.desiredRpm > 1600 ? 1.08 : 1.35, dt);
        s.glow = damp(s.glow, 0, 2.8, dt);
        if (s.startTimer > 2.25) s.starting = false;
      }
    } else {
      s.fuel = true;
      const target = Math.max(LLY.idleRpm, s.desiredRpm);
      s.rpm = damp(s.rpm, target, target > 2200 ? 0.98 : 1.42, dt);
      s.glow = damp(s.glow, 0, 3, dt);
    }
  } else {
    s.fuel = false;
    s.starting = false;
    s.rpm = damp(s.rpm, 0, 1.05, dt);
    if (s.rpm < 3.5) s.rpm = 0;
    if (s.glow > 0.001) s.glow = damp(s.glow, 0, 1.5, dt);
  }
  s.rpm = clamp(s.rpm, 0, MAX_RPM + 12);
  if (s.rpm > MAX_RPM) s.rpm = damp(s.rpm, MAX_RPM, 6, dt);
  s.crankAngle = mod(s.crankAngle + s.rpm * 6 * dt * timeScale, 720);

  const xray = engine.cutawayAmount > 0.05 || engine.explodeAmount > 0.08;
  inspectionFill.intensity = damp(inspectionFill.intensity, xray ? 0.3 : 0, 4.5, dt);

  const firing = s.fuel && s.rpm > 90;
  const turboBase = s.rpm > 20 ? 3.2 + (s.rpm / MAX_RPM) * 145 : 0;
  engine.update(dt, {
    crankAngleDeg: s.crankAngle,
    rpm: s.rpm,
    firing,
    fuel: s.fuel,
    glow: s.glow,
    vane: vaneAtRpm(s.rpm),
    turboRate: turboBase * timeScale,
  });

  if (s.engineOn && s.rpm > 40 && engine.explodeAmount < 0.1) {
    const shake = (s.rpm / MAX_RPM) * 0.00023;
    engine.root.position.y = ENGINE_Y + Math.sin(s.totalTime * 51) * shake;
    engine.root.rotation.z = Math.sin(s.totalTime * 27) * shake * 0.36;
    engine.root.rotation.x = Math.sin(s.totalTime * 19.7) * shake * 0.23;
  } else {
    engine.root.position.y = damp(engine.root.position.y, ENGINE_Y, 8, dt);
    engine.root.rotation.z = damp(engine.root.rotation.z, 0, 8, dt);
    engine.root.rotation.x = damp(engine.root.rotation.x, 0, 8, dt);
  }

  const torque = firing && s.rpm > 150 ? torqueAtRpm(s.rpm, s.calibration) : 0;
  const hp = firing && s.rpm > 150 ? horsepowerAtRpm(s.rpm, s.calibration) : 0;
  const rail = firing ? railPressureAtRpm(s.rpm, s.calibration) : 0;
  const boost = firing ? Math.min(23, boostAtRpm(s.rpm)) : 0;
  const vane = s.rpm > 30 ? vaneAtRpm(s.rpm) : 0;
  const egt = firing ? egtAtRpm(s.rpm) : 38 + Math.max(0, s.rpm) * 0.02;
  const oil = firing ? oilPressureAtRpm(s.rpm) : 0;
  const coolant = s.rpm > 50 ? coolantAtRpm(s.rpm) : 38;
  environment.update(s.totalTime, { rpm: s.rpm, hp, torque });

  s._telemetry = { torque, hp, rail, boost, vane, egt, oil, coolant, firing };
  audio.update(dt, s, camera);
}

// ---------------------------------------------------------------------------
// Camera modes and camera animation
// ---------------------------------------------------------------------------
function killCameraTweens() {
  introTween = null;
  cameraTween = null;
  simulation.introDone = true;
  if (cameraMode === 'orbit') controls.enabled = true;
}

function tweenCamera(position, target, duration = 1.15) {
  if (cameraMode !== 'orbit') return;
  simulation.introDone = true;
  const fromPos = camera.position.clone();
  const fromTarget = controls.target.clone();
  cameraTween = {
    time: 0,
    duration,
    fromPos,
    fromTarget,
    toPos: position.clone(),
    toTarget: target.clone(),
  };
  introTween = null;
  controls.enabled = false;
}

function resetCamera() {
  if (cameraMode === 'walk') exitWalk();
  simulation.introDone = true;
  tweenCamera(HOME_POSITION, HOME_TARGET, 1.05);
  showToast('CAMERA RESET · DEFAULT INSPECTION VIEW');
}

function updateCamera(dt) {
  if (cameraMode === 'walk') {
    updateWalk(dt);
    return;
  }
  if (introTween) {
    const t = clamp((performance.now() - startedAt) / 1000 / introTween.duration, 0, 1);
    const e = easeOutCubic(t);
    camera.position.lerpVectors(introTween.startPos, introTween.endPos, e);
    controls.target.lerpVectors(introTween.startTarget, introTween.endTarget, e);
    camera.lookAt(controls.target);
    if (t >= 1) {
      introTween = null;
      simulation.introDone = true;
      controls.enabled = true;
      controls.update();
    }
    return;
  }
  if (cameraTween) {
    cameraTween.time += dt;
    const t = clamp(cameraTween.time / cameraTween.duration, 0, 1);
    const e = easeInOutCubic(t);
    camera.position.lerpVectors(cameraTween.fromPos, cameraTween.toPos, e);
    controls.target.lerpVectors(cameraTween.fromTarget, cameraTween.toTarget, e);
    camera.lookAt(controls.target);
    if (t >= 1) {
      cameraTween = null;
      controls.enabled = true;
    }
    return;
  }
  if (controls.enabled) controls.update();
}

function setCameraDirectionFromTarget() {
  const dir = new THREE.Vector3().subVectors(controls.target, camera.position).normalize();
  walk.yaw = Math.atan2(-dir.x, -dir.z);
  walk.pitch = Math.asin(clamp(dir.y, -1, 1));
  camera.rotation.order = 'YXZ';
  camera.rotation.set(walk.pitch, walk.yaw, 0);
}

function enterWalk() {
  if (cameraMode === 'walk') return;
  killCameraTweens();
  cameraMode = 'walk';
  controls.enabled = false;
  setCameraDirectionFromTarget();
  camera.position.y = 1.66;
  // Keep the camera outside the engine envelope when switching modes.
  const dx = camera.position.x - ENGINE_CENTER_XZ.x;
  const dz = camera.position.z - ENGINE_CENTER_XZ.y;
  const dist = Math.hypot(dx, dz);
  if (dist < 1.05) {
    const inv = 1.05 / Math.max(0.001, dist);
    camera.position.x = ENGINE_CENTER_XZ.x + dx * inv;
    camera.position.z = ENGINE_CENTER_XZ.y + dz * inv;
  }
  camera.fov = 60;
  camera.updateProjectionMatrix();
  document.body.classList.add('walk-mode');
  $('walkHud').hidden = false;
  setModeButtons('walk');
  $('pointerState').textContent = 'CLICK TO LOOK';
  document.body.classList.add('walk-pointer-unlocked');
  if (window.innerWidth > 900) {
    canvas.requestPointerLock?.();
  }
  showToast('WALK MODE · WASD TO MOVE · MOUSE TO LOOK · V TO EXIT');
}

function exitWalk() {
  if (cameraMode !== 'walk') return;
  if (document.pointerLockElement) document.exitPointerLock?.();
  cameraMode = 'orbit';
  walk.keys.clear();
  document.body.classList.remove('walk-mode', 'walk-pointer-unlocked');
  $('walkHud').hidden = true;
  camera.fov = 37;
  camera.updateProjectionMatrix();
  setModeButtons('orbit');
  tweenCamera(HOME_POSITION, HOME_TARGET, 1.1);
  showToast('ORBIT CAMERA ACTIVE');
  syncUI(true);
}

function updateWalk(dt) {
  const forward = new THREE.Vector3(-Math.sin(walk.yaw), 0, -Math.cos(walk.yaw));
  const right = new THREE.Vector3(Math.cos(walk.yaw), 0, -Math.sin(walk.yaw));
  const wish = new THREE.Vector3();
  if (walk.keys.has('KeyW')) wish.add(forward);
  if (walk.keys.has('KeyS')) wish.sub(forward);
  if (walk.keys.has('KeyD')) wish.add(right);
  if (walk.keys.has('KeyA')) wish.sub(right);
  const sprint = walk.keys.has('ShiftLeft') || walk.keys.has('ShiftRight');
  const speed = sprint ? 3.05 : 1.55;
  if (wish.lengthSq() > 0) wish.normalize().multiplyScalar(speed);
  walk.velocity.x = damp(walk.velocity.x, wish.x, 11, dt);
  walk.velocity.z = damp(walk.velocity.z, wish.z, 11, dt);
  const proposed = camera.position.clone();
  proposed.x += walk.velocity.x * dt;
  proposed.z += walk.velocity.z * dt;

  const bound = environment.collision.room;
  proposed.x = clamp(proposed.x, bound.min.x + 0.35, bound.max.x - 0.35);
  proposed.z = clamp(proposed.z, bound.min.z + 0.35, bound.max.z - 0.35);

  // Stay outside the engine / bedplate envelope.
  const dx = proposed.x - ENGINE_CENTER_XZ.x;
  const dz = proposed.z - ENGINE_CENTER_XZ.y;
  const minRadius = 1.03;
  const d = Math.hypot(dx, dz);
  if (d < minRadius) {
    proposed.x = ENGINE_CENTER_XZ.x + (dx / Math.max(0.001, d)) * minRadius;
    proposed.z = ENGINE_CENTER_XZ.y + (dz / Math.max(0.001, d)) * minRadius;
  }
  // Dyno guard volume.
  const b = environment.collision.dynoBox;
  if (
    proposed.x > b.min.x - 0.3 &&
    proposed.x < b.max.x + 0.3 &&
    proposed.z > b.min.z - 0.3 &&
    proposed.z < b.max.z + 0.3
  ) {
    proposed.z = b.max.z + 0.31;
  }
  // Console / toolchest block.
  if (proposed.x > 1.25 && proposed.z > -1.75 && proposed.z < 0.8) {
    proposed.x = 1.25;
  }

  const moving = walk.velocity.lengthSq() > 0.03;
  walk.bobPhase += dt * (sprint ? 10 : 6.5) * (moving ? 1 : 0);
  const bob = moving ? Math.sin(walk.bobPhase) * 0.015 : 0;
  camera.position.x = proposed.x;
  camera.position.z = proposed.z;
  camera.position.y = damp(camera.position.y, 1.66 + bob, 12, dt);
  camera.rotation.order = 'YXZ';
  camera.rotation.set(walk.pitch, walk.yaw, 0);
  walk.lastSafe.copy(camera.position);
}

// ---------------------------------------------------------------------------
// Picking / component inspection
// ---------------------------------------------------------------------------
function findPartId(object) {
  let current = object;
  while (current) {
    if (current.userData?.partId) return current.userData.partId;
    current = current.parent;
  }
  return null;
}

function selectionObjectsFor(id) {
  if (!id) return [];
  if (id === 'valvetrain') {
    return VALVETRAIN_IDS.flatMap((partId) => partRegistry.get(partId) || []);
  }
  if (id === 'pistons') {
    return [
      ...(partRegistry.get('pistons') || []),
      ...CYLINDERS.flatMap((c) => partRegistry.get(`piston-${c.number}`) || []),
    ];
  }
  if (id === 'rods') {
    return [
      ...(partRegistry.get('rods') || []),
      ...CYLINDERS.flatMap((c) => partRegistry.get(`rod-${c.number}`) || []),
    ];
  }
  return partRegistry.get(id) || [];
}

function isEffectivelyVisible(object) {
  let current = object;
  while (current) {
    if (!current.visible) return false;
    current = current.parent;
  }
  return true;
}

function raycastParts({ cutawayAware = true } = {}) {
  raycaster.setFromCamera(pointerNdc, camera);
  const objects = [engine.root];
  for (const [, roots] of environment.interactives) objects.push(...roots);
  const intersections = raycaster.intersectObjects(objects, true);
  const xrayed = engine.cutawayAmount > 0.35;
  for (const hit of intersections) {
    if (!isEffectivelyVisible(hit.object)) continue;
    if (cutawayAware && xrayed) {
      let mat = hit.object.material;
      if (Array.isArray(mat)) mat = mat[0];
      if (mat?.userData?.cutaway) continue;
    }
    const id = findPartId(hit.object);
    if (id && getSpec(id)) return { id, object: hit.object, point: hit.point };
  }
  return null;
}

function updateHover(clientX, clientY) {
  if (cameraMode !== 'orbit' || !simulation.introDone) {
    hideHoverTag();
    return;
  }
  if (selectedPart) {
    hideHoverTag();
    return;
  }
  const rect = canvas.getBoundingClientRect();
  pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  const hit = raycastParts();
  if (!hit) {
    hoveredPart = null;
    hideHoverTag();
    if (!selectedPart) {
      outlinePass.selectedObjects = [];
      outlinePass.enabled = false;
    }
    canvas.style.cursor = '';
    return;
  }
  if (hit.id !== hoveredPart) {
    hoveredPart = hit.id;
    const spec = getSpec(hit.id);
    if (spec) {
      $('hoverName').textContent = spec.name.toUpperCase();
      $('hoverTag').hidden = false;
      if (!selectedPart) {
        outlinePass.selectedObjects = selectionObjectsFor(hit.id);
        outlinePass.visibleEdgeColor.set(0x86c0c2);
        outlinePass.hiddenEdgeColor.set(0x0e2828);
        outlinePass.edgeStrength = 3.1;
        outlinePass.enabled = true;
      }
      canvas.style.cursor = 'pointer';
    }
  }
  const tag = $('hoverTag');
  const w = tag.offsetWidth || 150;
  const h = tag.offsetHeight || 45;
  tag.style.left = `${Math.min(clientX, window.innerWidth - w - 24)}px`;
  tag.style.top = `${Math.min(clientY, window.innerHeight - h - 24)}px`;
}

function hideHoverTag() {
  $('hoverTag').hidden = true;
}

function selectPart(id) {
  if (!id) {
    clearSelection();
    return;
  }
  const spec = getSpec(id);
  if (!spec) return;
  selectedPart = id;
  const objects = selectionObjectsFor(id);
  outlinePass.selectedObjects = objects;
  outlinePass.visibleEdgeColor.set(0xe9a33d);
  outlinePass.hiddenEdgeColor.set(0x332711);
  outlinePass.edgeStrength = 5.1;
  outlinePass.enabled = true;
  $('inspectorEmpty').hidden = true;
  $('inspectorContent').hidden = false;
  $('inspectTitle').textContent = 'COMPONENT DATA';
  $('specEyebrow').textContent = spec.eyebrow || spec.category || 'COMPONENT';
  $('specName').textContent = spec.name;
  $('specMaterial').textContent = spec.material;
  $('specSummary').textContent = spec.summary || '';
  $('specId').textContent = id.toUpperCase();
  const list = $('specList');
  list.innerHTML = '';
  for (const [key, value] of (spec.specs || []).slice(0, 10)) {
    const row = document.createElement('div');
    row.className = 'spec-row';
    const k = document.createElement('span');
    k.textContent = key;
    const v = document.createElement('b');
    v.textContent = value;
    row.append(k, v);
    list.append(row);
  }
  $('inspectorPanel').scrollTop = 0;
  document.querySelectorAll('.quick-parts button').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.inspect === id);
  });
  hideHoverTag();
}

function clearSelection() {
  selectedPart = null;
  outlinePass.selectedObjects = [];
  outlinePass.enabled = false;
  $('inspectorEmpty').hidden = false;
  $('inspectorContent').hidden = true;
  $('inspectTitle').textContent = 'SELECT A PART';
  document.querySelectorAll('.quick-parts button').forEach((btn) => btn.classList.remove('active'));
}

function handlePointerDown(event) {
  if (event.button !== 0) return;
  if (cameraMode === 'walk') return;
  if (introTween) {
    killCameraTweens();
    return;
  }
  pointerDown = { x: event.clientX, y: event.clientY, time: performance.now() };
}

function handlePointerUp(event) {
  if (!pointerDown || event.button !== 0) return;
  const dx = event.clientX - pointerDown.x;
  const dy = event.clientY - pointerDown.y;
  const held = performance.now() - pointerDown.time;
  pointerDown = null;
  if (Math.hypot(dx, dy) > 6 || held > 750) return;
  if (cameraMode === 'walk') return;
  const rect = canvas.getBoundingClientRect();
  pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  const hit = raycastParts();
  if (hit) selectPart(hit.id);
  else clearSelection();
}

function handlePointerMove(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
  hoverDirty = true;
}

// ---------------------------------------------------------------------------
// UI: tachometer, chart, cylinder strip and telemetry
// ---------------------------------------------------------------------------
const tach = {
  svg: $('tachGauge'),
  center: { x: 120, y: 105 },
  radius: 88,
  start: 150,
  sweep: 240,
};

function polarPoint(cx, cy, r, angleDeg) {
  const a = (angleDeg * Math.PI) / 180;
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
}

function arcPath(cx, cy, r, startDeg, endDeg, steps = 64) {
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = startDeg + (endDeg - startDeg) * t;
    const [x, y] = polarPoint(cx, cy, r, a);
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

const gauge = {};
function buildTachometer() {
  const svg = tach.svg;
  const ns = 'http://www.w3.org/2000/svg';
  if (!svg || svg.childElementCount) return;
  const cx = tach.center.x;
  const cy = tach.center.y;
  const start = tach.start;
  const end = start + tach.sweep;
  const track = document.createElementNS(ns, 'path');
  track.setAttribute('class', 'gauge-track');
  track.setAttribute('d', arcPath(cx, cy, tach.radius, start, end, 90));
  track.setAttribute('stroke-linecap', 'butt');
  svg.append(track);

  const redFrac = 3000 / MAX_RPM;
  const red = document.createElementNS(ns, 'path');
  red.setAttribute('class', 'gauge-red');
  red.setAttribute('d', arcPath(cx, cy, tach.radius, start + redFrac * tach.sweep, end, 24));
  svg.append(red);

  const live = document.createElementNS(ns, 'path');
  live.setAttribute('class', 'gauge-live');
  live.setAttribute('d', '');
  svg.append(live);
  gauge.live = live;

  for (let rpm = 0; rpm <= MAX_RPM; rpm += 125) {
    const frac = rpm / MAX_RPM;
    const a = start + frac * tach.sweep;
    const major = rpm % 500 === 0;
    const inner = major ? tach.radius - 14 : tach.radius - 8;
    const outer = tach.radius - 2;
    const [x1, y1] = polarPoint(cx, cy, inner, a);
    const [x2, y2] = polarPoint(cx, cy, outer, a);
    const tick = document.createElementNS(ns, 'line');
    tick.setAttribute('x1', x1);
    tick.setAttribute('y1', y1);
    tick.setAttribute('x2', x2);
    tick.setAttribute('y2', y2);
    tick.setAttribute('class', `tick${major ? ' major' : ''}${rpm > 3000 ? ' redline' : ''}`);
    svg.append(tick);
    if (rpm % 1000 === 0) {
      const [tx, ty] = polarPoint(cx, cy, tach.radius - 26, a);
      const label = document.createElementNS(ns, 'text');
      label.setAttribute('x', tx);
      label.setAttribute('y', ty + 3);
      label.setAttribute('text-anchor', 'middle');
      label.textContent = rpm === 0 ? '0' : `${rpm / 1000}`;
      svg.append(label);
    }
  }
  const unitLabel = document.createElementNS(ns, 'text');
  const [ux, uy] = polarPoint(cx, cy, tach.radius - 29, start + tach.sweep / 2);
  unitLabel.setAttribute('x', ux);
  unitLabel.setAttribute('y', uy - 16);
  unitLabel.setAttribute('text-anchor', 'middle');
  unitLabel.textContent = 'x1000 RPM';
  svg.append(unitLabel);

  const marker = document.createElementNS(ns, 'circle');
  marker.setAttribute('r', 4.2);
  marker.setAttribute('fill', '#ffc36c');
  marker.setAttribute('filter', 'drop-shadow(0 0 5px rgba(255,180,80,.9))');
  svg.append(marker);
  gauge.marker = marker;
}

function updateTachometer(rpm) {
  if (!gauge.live) return;
  const frac = clamp(rpm / MAX_RPM, 0, 1);
  const a = tach.start + frac * tach.sweep;
  gauge.live.setAttribute(
    'd',
    frac > 0.004
      ? arcPath(tach.center.x, tach.center.y, tach.radius, tach.start, a, Math.max(3, Math.ceil(frac * 70)))
      : '',
  );
  const [x, y] = polarPoint(tach.center.x, tach.center.y, tach.radius, a);
  gauge.marker.setAttribute('cx', x);
  gauge.marker.setAttribute('cy', y);
  gauge.marker.setAttribute('fill', rpm >= 3000 ? '#ed704f' : '#ffc36c');
}

const curveCache = {
  allison: [],
  zf: [],
};
for (let rpm = 0; rpm <= MAX_RPM; rpm += 25) {
  curveCache.allison.push({ rpm, torque: torqueAtRpm(rpm, 'allison'), hp: horsepowerAtRpm(rpm, 'allison') });
  curveCache.zf.push({ rpm, torque: torqueAtRpm(rpm, 'zf'), hp: horsepowerAtRpm(rpm, 'zf') });
}

function drawDynoChart(rpm) {
  const c = $('dynoChart');
  if (!c) return;
  const cal = simulation.calibration || 'allison';
  const activeCurve = curveCache[cal] || curveCache.allison;
  const ctx = c.getContext('2d');
  const w = c.width;
  const h = c.height;
  const left = 12;
  const right = 12;
  const top = 10;
  const bottom = 19;
  const plotW = w - left - right;
  const plotH = h - top - bottom;
  const toX = (r) => left + (r / MAX_RPM) * plotW;
  const toYT = (t) => top + plotH - (t / 660) * plotH;
  const toYH = (p) => top + plotH - (p / 340) * plotH;
  ctx.clearRect(0, 0, w, h);
  // base
  ctx.fillStyle = 'rgba(9,13,11,.42)';
  ctx.fillRect(left, top, plotW, plotH);
  ctx.strokeStyle = 'rgba(206,197,172,.09)';
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 8]);
  for (let i = 0; i <= 4; i++) {
    const y = top + (plotH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(left + plotW, y);
    ctx.stroke();
  }
  for (let i = 0; i <= 4; i++) {
    const x = left + (plotW / 4) * i;
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, top + plotH);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  // torque fill
  const torqueGrad = ctx.createLinearGradient(0, top, 0, top + plotH);
  torqueGrad.addColorStop(0, 'rgba(233,163,61,.19)');
  torqueGrad.addColorStop(1, 'rgba(233,163,61,0)');
  ctx.beginPath();
  ctx.moveTo(toX(0), top + plotH);
  for (const p of activeCurve) ctx.lineTo(toX(p.rpm), toYT(p.torque));
  ctx.lineTo(toX(MAX_RPM), top + plotH);
  ctx.closePath();
  ctx.fillStyle = torqueGrad;
  ctx.fill();
  // torque line
  ctx.beginPath();
  activeCurve.forEach((p, i) => {
    const x = toX(p.rpm);
    const y = toYT(p.torque);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#e9a33d';
  ctx.lineWidth = 2.2;
  ctx.stroke();
  // hp line
  ctx.beginPath();
  activeCurve.forEach((p, i) => {
    const x = toX(p.rpm);
    const y = toYH(p.hp);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#7bbfc3';
  ctx.lineWidth = 1.8;
  ctx.stroke();
  // operating point
  const x = toX(clamp(rpm, 0, MAX_RPM));
  ctx.strokeStyle = 'rgba(238,230,209,.44)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, top);
  ctx.lineTo(x, top + plotH);
  ctx.stroke();
  const ty = toYT(torqueAtRpm(rpm, cal));
  const hy = toYH(horsepowerAtRpm(rpm, cal));
  ctx.fillStyle = '#f5e5c1';
  ctx.beginPath();
  ctx.arc(x, ty, 3.2, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#8ed6d9';
  ctx.beginPath();
  ctx.arc(x, hy, 2.6, 0, TAU);
  ctx.fill();
  // curve labels
  ctx.fillStyle = 'rgba(197,190,171,.45)';
  ctx.font = '18px Consolas, monospace';
  ctx.fillText('TORQUE · LB-FT', left + 9, top + 17);
  ctx.fillStyle = 'rgba(123,191,195,.55)';
  ctx.fillText('POWER · HP', left + 170, top + 17);
}

function buildCylinderStrip() {
  const strip = $('cylinderStrip');
  strip.innerHTML = '';
  const ordered = [...CYLINDERS].sort((a, b) => FIRING_ORDER.indexOf(a.number) - FIRING_ORDER.indexOf(b.number));
  for (const c of ordered) {
    const chip = document.createElement('div');
    chip.className = 'cylinder-chip';
    chip.dataset.cyl = c.number;
    const bank = c.bank === 'R' ? 'R' : 'L';
    chip.style.setProperty('--bank-color', bank === 'R' ? '#86b7b6' : '#c2a35f');
    chip.innerHTML = `
      <span class="cyl-num">${c.number}</span>
      <span class="bank" style="color:${bank === 'R' ? '#699c9b' : '#9b824a'}">${bank}</span>
      <span class="stroke-name">—</span>
      <span class="stroke"></span>
    `;
    chip.title = `Cylinder ${c.number} — ${c.bankLabel} bank — fires at ${c.fireAngle}° of the 720° cycle`;
    strip.append(chip);
  }
}

function formatInt(value) {
  return Math.round(value).toLocaleString('en-US');
}

function updateTelemetryUI(dt, force = false) {
  uiTimer += dt;
  if (!force && uiTimer < 0.065) return;
  uiTimer = 0;
  const s = simulation;
  const t = s._telemetry || {
    torque: 0,
    hp: 0,
    rail: 0,
    boost: 0,
    vane: 0,
    egt: 38,
    oil: 0,
    coolant: 38,
    firing: false,
  };
  const displayRpm = Math.round(s.rpm);
  if (!s.engineOn) {
    t.torque = 0;
    t.hp = 0;
    t.rail = 0;
    t.boost = 0;
    t.vane = 0;
    t.oil = 0;
  }
  $('stateRpm').textContent = formatInt(displayRpm);
  $('gaugeRpm').textContent = formatInt(displayRpm);
  $('torqueVal').textContent = formatInt(t.torque);
  $('hpVal').textContent = formatInt(t.hp);
  $('railVal').textContent = formatInt(t.rail);
  $('boostVal').textContent = t.boost.toFixed(1);
  $('vaneVal').textContent = `${Math.round(t.vane)}`;
  $('egtVal').textContent = formatInt(t.egt);
  $('oilVal').textContent = formatInt(t.oil);
  $('coolantVal').textContent = formatInt(t.coolant);
  $('railBar').style.width = `${clamp(t.rail / 26000, 0, 1) * 100}%`;
  $('boostBar').style.width = `${clamp(t.boost / 23, 0, 1) * 100}%`;
  $('vaneBar').style.width = `${clamp(t.vane / 100, 0, 1) * 100}%`;
  $('egtBar').style.width = `${clamp((t.egt - 38) / 780, 0, 1) * 100}%`;
  $('oilBar').style.width = `${clamp(t.oil / 70, 0, 1) * 100}%`;
  $('coolantBar').style.width = `${clamp((t.coolant - 30) / 80, 0, 1) * 100}%`;
  $('rpmSetpoint').textContent = s.engineOn ? formatInt(s.desiredRpm) : formatInt(s.lastRpmTarget || 0);
  const slider = $('rpmSlider');
  slider.value = s.engineOn ? s.desiredRpm : s.lastRpmTarget || 0;
  const fill = (Number(slider.value) / MAX_RPM) * 100;
  slider.style.setProperty('--fill', `${fill}%`);
  document.querySelectorAll('.preset').forEach((btn) => {
    const value = Number(btn.dataset.preset);
    btn.classList.toggle('active', value === 0 ? !s.engineOn : Math.abs(value - s.desiredRpm) <= 5 && s.engineOn);
  });
  updateTachometer(s.rpm);
  drawDynoChart(s.rpm);

  // Status semantics.
  let label = 'STANDBY';
  let note = 'FUEL OFF · CELL READY';
  let dotClass = 'off';
  if (s.engineOn) {
    dotClass = 'idle';
    if (s.starting && !s.fuel) {
      label = 'CRANKING';
      note = `STARTER · ${formatInt(s.rpm)} RPM`;
      dotClass = 'starting';
    } else if (s.starting) {
      label = 'COMBUSTION';
      note = 'GLOW · FIRING · IDLE RAMP';
      dotClass = 'starting';
    } else if (Math.abs(s.rpm - LLY.idleRpm) < 18 && s.desiredRpm <= LLY.idleRpm + 5) {
      label = 'WARM IDLE';
      note = 'STABLE · CLOSED LOOP';
    } else if (s.rpm >= 3200) {
      label = 'GOVERNED';
      note = 'ELECTRONIC LIMITER';
    } else if (Math.abs(s.rpm - s.desiredRpm) > 24) {
      label = 'RPM RAMP';
      note = 'ACCESSORY LOAD DAMPED';
    } else {
      label = 'STEADY STATE';
      note = 'CLOSED LOOP · STABLE';
    }
  } else if (s.rpm > 4) {
    label = 'SPIN-DOWN';
    note = 'FUEL CUT · INERTIA';
    dotClass = 'starting';
  }
  $('stateLabel').textContent = label;
  $('stateNote').textContent = note;
  $('stateDot').className = `state-dot ${dotClass}`;
  $('stateRpm').parentElement.classList.toggle('off', !s.engineOn);
  $('startStopBtn')?.classList.toggle('running', s.engineOn);
  $('walkStartBtn').textContent = s.engineOn ? 'STOP ENGINE' : 'START ENGINE';
  $('walkRpm').textContent = formatInt(displayRpm);
  $('walkHp').textContent = formatInt(t.hp);
  $('walkBoost').textContent = t.boost.toFixed(1);
  syncStartButton();
  updateCylinderStrip(s);
}

let lastStartButtonState = null;
function syncStartButton(force = false) {
  const btn = $('startStopBtn');
  if (!btn) return;
  const on = simulation.engineOn;
  if (!force && lastStartButtonState === on) return;
  lastStartButtonState = on;
  btn.classList.toggle('running', on);
  btn.setAttribute('aria-pressed', String(on));
  const svg = on
    ? '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1.4"/></svg>'
    : '<svg viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z"/></svg>';
  btn.querySelector('.start-icon').innerHTML = svg;
  btn.querySelector('.start-copy strong').textContent = on ? 'STOP ENGINE' : 'START ENGINE';
  btn.querySelector('.start-copy small').textContent = on
    ? 'FUEL & IGNITION ENABLED'
    : 'PRIME & CRANK SEQUENCE';
}

function updateCylinderStrip(s) {
  const chips = document.querySelectorAll('.cylinder-chip');
  if (!chips.length) return;
  const states = CYLINDERS.map((c) => ({ c, state: cylinderState(c, s.crankAngle) }));
  for (const chip of chips) {
    const num = Number(chip.dataset.cyl);
    const item = states.find((x) => x.c.number === num);
    if (!item) continue;
    const { state } = item;
    const active = s.fuel && state.distanceToTdc < 16;
    chip.classList.toggle('firing', active);
    const strokeName = chip.querySelector('.stroke-name');
    const strokeBar = chip.querySelector('.stroke');
    const color =
      state.stroke === 'POWER'
        ? '#f28c34'
        : state.stroke === 'INTAKE'
          ? '#6fb6d8'
          : state.stroke === 'COMPRESSION'
            ? '#d5c36c'
            : '#877f73';
    strokeBar.style.background = color;
    strokeName.style.color = color;
    strokeName.textContent = s.engineOn ? state.stroke.slice(0, 4) : '—';
  }
}

function syncUI(force = false) {
  if (!simulation._telemetry) {
    simulation._telemetry = {
      torque: 0,
      hp: 0,
      rail: 0,
      boost: 0,
      vane: 0,
      egt: 38,
      oil: 0,
      coolant: 38,
      firing: false,
    };
  }
  updateTelemetryUI(0.1, true);
  const cut = $('cutawayBtn');
  cut.classList.toggle('active', simulation.cutaway);
  cut.setAttribute('aria-pressed', String(simulation.cutaway));
  const ex = $('explodeBtn');
  ex.classList.toggle('active', simulation.exploded);
  ex.setAttribute('aria-pressed', String(simulation.exploded));
  const slow = $('slowBtn');
  slow.classList.toggle('active', simulation.slowMotion);
  slow.setAttribute('aria-pressed', String(simulation.slowMotion));
  $('slowFactorLabel').textContent = simulation.slowMotion
    ? `${SLOW_MOTION_SCALE.toFixed(2)}× TIME`
    : '1.00× TIME';
  $('assembleBtn').classList.remove('active');
  $('walkStartBtn').textContent = simulation.engineOn ? 'STOP ENGINE' : 'START ENGINE';
  syncAudioButton();
}

function syncAudioButton() {
  const btn = $('audioBtn');
  if (!btn) return;
  const active = audio.isActive();
  btn.classList.toggle('active', active);
  btn.setAttribute('aria-pressed', String(active));
  const onIcon = $('audioIconOn');
  const offIcon = $('audioIconOff');
  if (onIcon && offIcon) {
    onIcon.hidden = !active;
    offIcon.hidden = active;
  }
}

async function toggleAudio() {
  const active = await audio.toggle();
  syncAudioButton();
  showToast(
    active
      ? 'TEST CELL AUDIO ONLINE · V8 + GT3788VA SYNTH'
      : 'TEST CELL AUDIO MUTED',
  );
}

function showToast(message, duration = 2200) {
  const el = $('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), duration);
}

// ---------------------------------------------------------------------------
// Mode / inspection controls
// ---------------------------------------------------------------------------
function setModeButtons(mode) {
  document.querySelectorAll('.mode-btn').forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));
  $('cameraHintTitle').textContent = mode === 'walk' ? 'FIRST-PERSON WALK' : 'ORBIT CAMERA';
  $('cameraHint').textContent =
    mode === 'walk'
      ? 'WASD MOVE  ·  MOUSE LOOK  ·  SHIFT SPRINT  ·  V OR ESC TO EXIT'
      : 'DRAG TO ORBIT  ·  SCROLL TO ZOOM  ·  RIGHT-DRAG TO PAN';
}

function toggleCutaway() {
  simulation.cutaway = !simulation.cutaway;
  engine.setCutaway(simulation.cutaway);
  syncUI(true);
  showToast(simulation.cutaway ? 'CUTAWAY ENGAGED · CASTINGS X-RAYED' : 'CUTAWAY OFF · CASTINGS OPAQUE');
}

function setExploded(on) {
  if (simulation.exploded === on) {
    if (!on) showToast('ASSEMBLY ALREADY IN NOMINAL POSITION');
    return;
  }
  simulation.exploded = on;
  engine.setExploded(on);
  if (on && cameraMode === 'orbit') {
    tweenCamera(new THREE.Vector3(2.95, 2.2, 3.5), new THREE.Vector3(0, 1.13, 0.08), 1.5);
  }
  syncUI(true);
  showToast(on ? 'EXPLODED VIEW · ASSEMBLY BREAKDOWN' : 'ASSEMBLY RESTORED · TORQUE SEQUENCE COMPLETE');
}

function toggleSlowMotion() {
  simulation.slowMotion = !simulation.slowMotion;
  syncUI(true);
  showToast(
    simulation.slowMotion
      ? 'SLOW MOTION · 0.12× MECHANICAL TIME'
      : 'REAL-TIME MECHANICAL MOTION RESTORED',
  );
}

function setCalibration(calKey) {
  if (!CALIBRATIONS[calKey]) return;
  simulation.calibration = calKey;
  const cal = CALIBRATIONS[calKey];
  document.querySelectorAll('.cal-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.cal === calKey);
  });
  const noteEl = $('calRailNote');
  if (noteEl) {
    noteEl.textContent = `${cal.shortLabel} · CP3.3 · ${formatInt(cal.maxRailPsi)} PSI MAX`;
  }
  updateSimulation(0);
  syncUI(true);
  showToast(
    `${cal.label.toUpperCase()} CALIBRATION · ${cal.peakTorque} LB-FT / ${cal.peakHp} HP / ${formatInt(cal.maxRailPsi)} PSI`,
  );
}

function applyPreset(value) {
  const rpm = Number(value);
  if (rpm === 0) {
    stopEngine();
    $('rpmSlider').value = 0;
    return;
  }
  simulation.desiredRpm = rpm;
  simulation.lastRpmTarget = rpm;
  if (!simulation.engineOn) startEngine(rpm);
  else if (simulation.starting) {
    simulation.desiredRpm = rpm;
    syncUI(true);
  } else syncUI(true);
  const names = { 680: 'WARM IDLE', 1600: 'PEAK TORQUE', 3000: 'PEAK HORSEPOWER', 3250: 'GOVERNED REDLINE' };
  showToast(`${names[rpm] || 'SPEED PRESET'} · ${formatInt(rpm)} RPM`);
}

function bindControls() {
  $('startStopBtn').addEventListener('click', toggleEngine);
  $('walkStartBtn').addEventListener('click', toggleEngine);
  $('rpmSlider').addEventListener('input', (event) => {
    const v = Number(event.target.value);
    simulation.lastRpmTarget = v;
    if (v === 0) {
      if (simulation.engineOn) stopEngine();
      syncUI(true);
      return;
    }
    if (simulation.engineOn) {
      simulation.desiredRpm = v;
    } else {
      simulation.desiredRpm = v;
    }
    syncUI(true);
  });
  $('presetGrid').addEventListener('click', (event) => {
    const btn = event.target.closest('.preset');
    if (btn) applyPreset(btn.dataset.preset);
  });
  $('calSwitch')?.addEventListener('click', (event) => {
    const btn = event.target.closest('.cal-btn');
    if (btn && btn.dataset.cal) setCalibration(btn.dataset.cal);
  });
  $('cutawayBtn').addEventListener('click', toggleCutaway);
  $('explodeBtn').addEventListener('click', () => setExploded(true));
  $('assembleBtn').addEventListener('click', () => {
    if (!simulation.exploded) {
      showToast('ASSEMBLY ALREADY IN NOMINAL POSITION');
      return;
    }
    setExploded(false);
  });
  $('slowBtn').addEventListener('click', toggleSlowMotion);
  $('audioBtn')?.addEventListener('click', toggleAudio);
  $('resetCameraBtn').addEventListener('click', resetCamera);

  // Unlock Web Audio automatically on first user gesture if enabled
  const unlockAudioOnce = async (event) => {
    if (event?.target?.closest?.('#audioBtn')) return;
    if (audio.enabled && !audio.unlocked) {
      const ok = await audio.unlock();
      if (ok) syncAudioButton();
    }
  };
  window.addEventListener('pointerdown', unlockAudioOnce, { passive: true });
  window.addEventListener('keydown', unlockAudioOnce, { passive: true });
  $('orbitModeBtn').addEventListener('click', () => {
    if (cameraMode === 'walk') exitWalk();
    else showToast('ORBIT CAMERA ACTIVE');
  });
  $('walkModeBtn').addEventListener('click', enterWalk);
  $('exitWalkBtn').addEventListener('click', exitWalk);
  $('closeInspector').addEventListener('click', clearSelection);
  document.querySelectorAll('.quick-parts button').forEach((btn) => {
    btn.addEventListener('click', () => selectPart(btn.dataset.inspect));
  });
  $('helpBtn').addEventListener('click', () => {
    $('helpModal').hidden = false;
  });
  $('modalClose').addEventListener('click', () => {
    $('helpModal').hidden = true;
  });
  $('helpModal').addEventListener('click', (e) => {
    if (e.target.closest('[data-close-modal]')) $('helpModal').hidden = true;
  });
  $('viewInfoBtn').addEventListener('click', () => {
    $('specSheet').hidden = false;
  });
  $('closeSpecSheet').addEventListener('click', () => {
    $('specSheet').hidden = true;
  });
  $('specSheet').addEventListener('click', (e) => {
    if (e.target === $('specSheet')) $('specSheet').hidden = true;
  });
  $('screenshotBtn').addEventListener('click', () => {
    screenshotPending = true;
  });

  canvas.addEventListener('pointerdown', (event) => {
    if (cameraMode === 'walk') {
      if (document.pointerLockElement !== canvas) canvas.requestPointerLock?.();
      return;
    }
    handlePointerDown(event);
  });
  canvas.addEventListener('pointerup', handlePointerUp);
  canvas.addEventListener('pointermove', handlePointerMove);
  canvas.addEventListener('pointerleave', () => {
    hideHoverTag();
    hoveredPart = null;
    if (!selectedPart) {
      outlinePass.enabled = false;
      outlinePass.selectedObjects = [];
    }
  });

  document.addEventListener('pointerlockchange', () => {
    if (cameraMode !== 'walk') return;
    const locked = document.pointerLockElement === canvas;
    document.body.classList.toggle('walk-pointer-unlocked', !locked);
    $('pointerState').textContent = locked ? 'MOUSE CAPTURED' : 'CLICK TO LOOK';
  });
  document.addEventListener('pointerlockerror', () => {
    if (cameraMode === 'walk') {
      $('pointerState').textContent = 'CLICK VIEW TO CAPTURE MOUSE';
      showToast('MOUSE CAPTURE BLOCKED · CLICK THE VIEW TO LOOK', 2800);
    }
  });
  document.addEventListener('mousemove', (event) => {
    if (cameraMode !== 'walk' || document.pointerLockElement !== canvas) return;
    walk.yaw -= event.movementX * 0.0022;
    walk.pitch -= event.movementY * 0.0021;
    walk.pitch = clamp(walk.pitch, -1.35, 1.35);
  });
  window.addEventListener('keydown', (event) => {
    const target = event.target;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
    if (event.code === 'Space') {
      event.preventDefault();
      toggleEngine();
      return;
    }
    if (event.code === 'KeyC') {
      toggleCutaway();
      return;
    }
    if (event.code === 'KeyE') {
      setExploded(true);
      return;
    }
    if (event.code === 'KeyA') {
      setExploded(false);
      return;
    }
    if (event.code === 'KeyM') {
      toggleSlowMotion();
      return;
    }
    if (event.code === 'KeyS' && cameraMode !== 'walk') {
      toggleAudio();
      return;
    }
    if (event.code === 'KeyR') {
      resetCamera();
      return;
    }
    if (event.code === 'KeyV') {
      if (cameraMode === 'walk') exitWalk();
      else enterWalk();
      return;
    }
    if (event.code === 'Escape') {
      if (!$('helpModal').hidden) {
        $('helpModal').hidden = true;
        return;
      }
      if (!$('specSheet').hidden) {
        $('specSheet').hidden = true;
        return;
      }
      if (cameraMode === 'walk' && document.pointerLockElement !== canvas) {
        exitWalk();
      }
      return;
    }
    if (cameraMode === 'walk') {
      walk.keys.add(event.code);
    }
    if (/^Digit[1-5]$/.test(event.code)) {
      const values = [0, 680, 1600, 3000, 3250];
      applyPreset(values[Number(event.code.slice(5)) - 1]);
    }
  });
  window.addEventListener('keyup', (event) => {
    walk.keys.delete(event.code);
  });
  window.addEventListener('blur', () => walk.keys.clear());
  window.addEventListener('resize', onResize);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  const dpr = Math.min(window.devicePixelRatio || 1, qualityReduced ? 1 : 1.65);
  renderer.setPixelRatio(dpr);
  composer.setPixelRatio(dpr);
  composer.setSize(window.innerWidth, window.innerHeight);
}

// ---------------------------------------------------------------------------
// Screenshot + QA hooks
// ---------------------------------------------------------------------------
function captureScreenshot() {
  composer.render();
  const source = renderer.domElement;
  const out = document.createElement('canvas');
  const scale = Math.min(1, 1920 / source.width);
  out.width = Math.round(source.width * scale);
  out.height = Math.round(source.height * scale);
  const ctx = out.getContext('2d');
  ctx.drawImage(source, 0, 0, out.width, out.height);
  const grad = ctx.createLinearGradient(0, out.height - 140, 0, out.height);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,.58)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, out.height - 140, out.width, 140);
  ctx.fillStyle = '#e9a33d';
  ctx.font = `${Math.round(out.width * 0.011)}px Bahnschrift, Arial`;
  ctx.fillText('DMAX  //  LLY 6600  ·  TEST CELL 04', out.width * 0.035, out.height - 58);
  ctx.fillStyle = '#b9b6a8';
  ctx.font = `${Math.round(out.width * 0.0075)}px Consolas, monospace`;
  ctx.fillText(
    `${formatInt(simulation.rpm)} RPM  ·  ${formatInt(simulation._telemetry?.hp || 0)} HP  ·  ${formatInt(
      simulation._telemetry?.torque || 0,
    )} LB-FT`,
    out.width * 0.035,
    out.height - 32,
  );
  ctx.textAlign = 'right';
  ctx.fillText('MORAINE, OHIO  ·  ENGINE TEST CELL', out.width - 36, out.height - 32);
  const dataUrl = out.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `duramax-lly-test-cell-${Math.round(simulation.rpm)}rpm.png`;
  link.click();
  showToast('RENDER CAPTURED · PNG DOWNLOADED');
}

// ---------------------------------------------------------------------------
// Initialisation and frame loop
// ---------------------------------------------------------------------------
buildTachometer();
buildCylinderStrip();
bindControls();
setModeButtons('orbit');
updateSimulation(1 / 60);
drawDynoChart(simulation.rpm);
updateTachometer(simulation.rpm);
syncUI(true);

let previousFrameTime = performance.now();
let lastFpsCheck = 0;
let fpsFrames = 0;

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const rawDt = (now - previousFrameTime) / 1000;
  const dt = Math.min(0.35, rawDt);
  const cameraDt = Math.min(0.1, rawDt);
  previousFrameTime = now;
  simulation.elapsed += dt;

  updateSimulation(dt);
  updateCamera(cameraDt);
  updateTelemetryUI(dt);

  if (hoverDirty && performance.now() - lastHoverCheck > 55 && cameraMode === 'orbit') {
    lastHoverCheck = performance.now();
    hoverDirty = false;
    updateHover(mouseX, mouseY);
  }

  composer.render();

  if (screenshotPending) {
    screenshotPending = false;
    captureScreenshot();
  }

  // Gentle adaptive resolution safeguard for slower GPUs.
  fpsFrames += 1;
  if (performance.now() - lastFpsCheck > 1000) {
    const fps = (fpsFrames * 1000) / (performance.now() - lastFpsCheck);
    fpsSamples.push(fps);
    if (fpsSamples.length > 6) fpsSamples.shift();
    lastFpsCheck = performance.now();
    fpsFrames = 0;
    const avgFps = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;
    if (!QA_MODE && !qualityReduced && fpsSamples.length >= 5 && simulation.totalTime > 7 && avgFps < 44) {
      qualityReduced = true;
      ssaoPass.enabled = false;
      composer.setPixelRatio(1);
      renderer.setPixelRatio(1);
      onResize();
      showToast('ADAPTIVE QUALITY · HIGH-DENSITY AO DISABLED FOR SMOOTH MOTION', 3200);
    }
  }
  frameCount += 1;
}

async function boot() {
  try {
    if (renderer.compileAsync) {
      bootText.textContent = 'COMPILING MATERIALS & SHADERS';
      await renderer.compileAsync(scene, camera);
    }
    bootText.textContent = 'TEST CELL READY';
  } catch (error) {
    console.error(error);
    bootText.textContent = 'RENDERER READY · CONTEXT PARTIAL';
  }
  bootStatus.classList.add('done');
  startedAt = performance.now();
  previousFrameTime = performance.now();
  lastFpsCheck = performance.now();
  animate();
}

// Interface for automated inspection / QA.
window.__LLY__ = {
  THREE,
  scene,
  camera,
  renderer,
  composer,
  controls,
  engine,
  environment,
  audio,
  simulation,
  startEngine,
  stopEngine,
  toggleEngine,
  setDesiredRpm,
  applyPreset,
  setCalibration,
  toggleCutaway,
  setExploded,
  toggleSlowMotion,
  resetCamera,
  selectPart,
  clearSelection,
  enterWalk,
  exitWalk,
  captureScreenshot,
  partRegistry,
  syncUI,
  updateSimulation,
  getFpsSamples: () => fpsSamples.slice(),
  setUiVisible: (visible) => {
    $('ui').style.display = visible ? '' : 'none';
  },
  setFixture: ({
    rpm = 680,
    crankAngle = null,
    running = true,
    fuel = true,
    starting = false,
    desiredRpm = null,
    cutaway = simulation.cutaway,
    exploded = simulation.exploded,
  } = {}) => {
    simulation.engineOn = running;
    simulation.starting = starting;
    simulation.fuel = fuel && running;
    simulation.rpm = rpm;
    simulation.desiredRpm = desiredRpm ?? rpm;
    simulation.lastRpmTarget = desiredRpm ?? rpm;
    if (crankAngle !== null) simulation.crankAngle = mod(crankAngle, 720);
    simulation.cutaway = cutaway;
    engine.setCutaway(cutaway);
    simulation.exploded = exploded;
    engine.setExploded(exploded);
    if (exploded) {
      engine.explodeTarget = 1;
      engine.explodeAmount = 1;
    }
    if (cutaway) {
      engine.cutawayTarget = 1;
      engine.cutawayAmount = 1;
    }
    engine.update(0.016, {
      crankAngleDeg: simulation.crankAngle,
      rpm,
      firing: simulation.fuel,
      fuel: simulation.fuel,
      glow: 0,
      vane: vaneAtRpm(rpm),
      turboRate: 0,
    });
    syncUI(true);
  },
  render: (count = 1) => {
    for (let i = 0; i < count; i++) updateSimulation(1 / 60);
    composer.render();
  },
};

boot();
