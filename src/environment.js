import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {
  addBoltAt,
  box,
  bolt,
  createPulley,
  cylinder,
  cylinderBetween,
  decal,
  makeConcreteTextures,
  makeHazardTexture,
  makeLabelTexture,
  makeRadialTexture,
  mergeStaticMeshes,
  mesh,
  roundedBox,
  torus,
  tube,
} from './utils.js';

const TAU = Math.PI * 2;

function addGroup(parent, id = null) {
  const g = new THREE.Group();
  if (id) {
    g.userData.partId = id;
    g.name = `part-${id}`;
  }
  parent.add(g);
  return g;
}

function boxTube(parent, w, h, d, material, position, opts = {}) {
  const m = box(w, h, d, material, {
    position,
    castShadow: opts.castShadow !== false,
    receiveShadow: true,
  });
  parent.add(m);
  return m;
}

function iBeam(group, length, height, material, position, rotation = [0, 0, 0], axis = 'z') {
  const g = new THREE.Group();
  g.position.set(...position);
  g.rotation.set(...rotation);
  const webT = 0.024;
  const flangeT = 0.028;
  const width = 0.15;
  if (axis === 'z') {
    g.add(box(webT, height, length, material, { position: [0, 0, 0], castShadow: true, receiveShadow: true }));
    g.add(box(width, flangeT, length, material, { position: [0, height / 2 - flangeT / 2, 0] }));
    g.add(box(width, flangeT, length, material, { position: [0, -height / 2 + flangeT / 2, 0] }));
  } else {
    g.add(box(length, height, webT, material, { position: [0, 0, 0], castShadow: true, receiveShadow: true }));
    g.add(box(length, flangeT, width, material, { position: [0, height / 2 - flangeT / 2, 0] }));
    g.add(box(length, flangeT, width, material, { position: [0, -height / 2 + flangeT / 2, 0] }));
  }
  group.add(g);
  return g;
}

function makeEnvMap(renderer) {
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x040605);
  const roomMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x171d19),
    side: THREE.BackSide,
  });
  const room = new THREE.Mesh(new THREE.BoxGeometry(25, 10, 18), roomMat);
  room.position.y = 4;
  envScene.add(room);
  const warm = new THREE.Color(2.9, 2.35, 1.65);
  const cool = new THREE.Color(0.42, 0.68, 0.8);
  const ceilingMat = new THREE.MeshBasicMaterial({ color: warm });
  for (let i = -2; i <= 2; i++) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.4), ceilingMat);
    p.position.set(i * 4.1, 6.3, -1);
    p.rotation.x = Math.PI / 2;
    envScene.add(p);
  }
  const stripeMat = new THREE.MeshBasicMaterial({ color: cool });
  for (let i = 0; i < 4; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const p = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 5.3), stripeMat);
    p.position.set(side * 11.8, 3.8, -3.5 + Math.floor(i / 2) * 6);
    p.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
    envScene.add(p);
  }
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 18),
    new THREE.MeshBasicMaterial({ color: 0x111512 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.9;
  envScene.add(floor);
  const coolSpot = new THREE.Mesh(
    new THREE.CircleGeometry(2.2, 32),
    new THREE.MeshBasicMaterial({ color: cool }),
  );
  coolSpot.position.set(-5, 4.8, 4);
  coolSpot.rotation.x = Math.PI / 2;
  envScene.add(coolSpot);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const rt = pmrem.fromScene(envScene, 0.02, 0.1, 60);
  pmrem.dispose();
  envScene.traverse((o) => {
    o.geometry?.dispose?.();
    if (o.material) {
      if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
      else o.material.dispose();
    }
  });
  return rt.texture;
}

export function buildEnvironment(scene, renderer, materials) {
  RectAreaLightUniformsLib.init();
  const m = materials;
  const root = new THREE.Group();
  root.name = 'Test Cell';
  scene.add(root);
  const interactives = new Map();
  const register = (id, obj) => {
    if (!interactives.has(id)) interactives.set(id, []);
    interactives.get(id).push(obj);
  };
  const animated = { monitors: [], beacons: [], fans: [] };
  const envMap = makeEnvMap(renderer);
  scene.environment = envMap;
  scene.environmentIntensity = 0.58;
  scene.background = new THREE.Color(0x090d0b);
  scene.fog = new THREE.FogExp2(0x0b100d, 0.022);

  // -----------------------------------------------------------------------
  // Materials
  // -----------------------------------------------------------------------
  const concreteTex = makeConcreteTextures(31);
  const floorMat = new THREE.MeshPhysicalMaterial({
    color: 0x8a8b82,
    map: concreteTex.map,
    bumpMap: concreteTex.bump,
    bumpScale: 0.55,
    roughness: 0.56,
    metalness: 0.06,
    clearcoat: 0.2,
    clearcoatRoughness: 0.67,
    envMapIntensity: 0.7,
  });
  const floorDark = new THREE.MeshStandardMaterial({
    color: 0x4f544e,
    roughness: 0.83,
    metalness: 0.03,
  });
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x777b72,
    roughness: 0.86,
    metalness: 0.02,
    bumpMap: concreteTex.bump,
    bumpScale: 0.8,
  });
  const wallPanelMat = new THREE.MeshStandardMaterial({
    color: 0x3e4742,
    roughness: 0.62,
    metalness: 0.27,
  });
  const wallLower = new THREE.MeshStandardMaterial({
    color: 0x2a332e,
    roughness: 0.72,
    metalness: 0.2,
  });
  const neon = new THREE.MeshBasicMaterial({ color: 0xffb45f });
  const coolNeon = new THREE.MeshBasicMaterial({ color: 0x85c5c8 });
  const red = m.red;
  const steel = m.standSteel;
  const yellow = m.standYellow;
  const rubber = m.rubber;
  const black = m.wrinkleBlack;
  const aluminum = m.machinedAluminum;

  // -----------------------------------------------------------------------
  // Room shell
  // -----------------------------------------------------------------------
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12.2, 10.2), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  root.add(floor);

  // Concrete expansion / saw-cut lines.
  const seamMat = new THREE.MeshStandardMaterial({
    color: 0x3d413c,
    roughness: 0.95,
  });
  for (const x of [-4.2, -1.8, 1.8, 4.2]) {
    const seam = box(0.018, 0.003, 10.1, seamMat, {
      position: [x, 0.006, 0],
      castShadow: false,
      receiveShadow: false,
    });
    root.add(seam);
  }
  for (const z of [-3.4, -1.1, 1.4, 3.6]) {
    const seam = box(12.1, 0.003, 0.018, seamMat, {
      position: [0, 0.006, z],
      castShadow: false,
      receiveShadow: false,
    });
    root.add(seam);
  }
  // Heavy cell perimeter marking.
  const floorPaint = new THREE.MeshStandardMaterial({
    color: 0xa8751e,
    roughness: 0.68,
    metalness: 0.04,
  });
  for (const [x, z, w, d] of [
    [0, -4.45, 11.9, 0.055],
    [0, 4.45, 11.9, 0.055],
    [-5.95, 0, 0.055, 8.9],
    [5.95, 0, 0.055, 8.9],
  ]) {
    root.add(
      box(w, 0.006, d, floorPaint, {
        position: [x, 0.008, z],
        castShadow: false,
        receiveShadow: false,
      }),
    );
  }
  const bayPaintMat = new THREE.MeshStandardMaterial({
    color: 0xcbb234,
    roughness: 0.72,
    metalness: 0.03,
    transparent: true,
    opacity: 0.62,
  });
  const bayLines = [
    [-2.72, 0, 0.06, 3.7],
    [2.72, 0, 0.06, 3.7],
    [0, -1.86, 5.38, 0.055],
    [0, 1.7, 5.38, 0.055],
  ];
  for (const [x, z, w, d] of bayLines) {
    root.add(
      box(w, 0.006, d, bayPaintMat, {
        position: [x, 0.009, z],
        castShadow: false,
        receiveShadow: false,
      }),
    );
  }
  const floorLabel = makeLabelTexture(
    [
      { text: 'DMAX  /  TEST CELL 04', font: '700 82px Bahnschrift, Arial', color: '#d8b45f' },
      { text: 'CERTIFIED DYNAMOMETER BAY  ·  KEEP CLEAR', font: '500 26px Bahnschrift', color: '#bb9a52', small: true },
    ],
    { width: 1400, height: 300, padding: 22 },
  );
  const floorDecal = decal(
    root,
    floorLabel,
    3.5,
    0.75,
    [0, 0.012, 1.67],
    [-Math.PI / 2, 0, 0],
    { roughness: 0.9, renderOrder: 2 },
  );

  // Back and side walls with lower steel wainscot and panel seams.
  const addWall = (x, z, width, rotationY) => {
    const wall = new THREE.Group();
    wall.position.set(x, 0, z);
    wall.rotation.y = rotationY;
    root.add(wall);
    wall.add(
      box(width, 4.3, 0.16, wallMat, {
        position: [0, 2.15, -0.09],
        receiveShadow: true,
        castShadow: false,
      }),
    );
    wall.add(
      box(width, 1.38, 0.1, wallLower, {
        position: [0, 0.69, 0.01],
        receiveShadow: true,
        castShadow: false,
      }),
    );
    wall.add(
      box(width, 0.06, 0.16, wallPanelMat, {
        position: [0, 1.39, 0.03],
        receiveShadow: true,
        castShadow: false,
      }),
    );
    wall.add(
      box(width, 0.08, 0.16, wallPanelMat, {
        position: [0, 4.22, 0.03],
        receiveShadow: true,
        castShadow: false,
      }),
    );
    for (let i = 1; i < Math.round(width / 1.25); i++) {
      wall.add(
        box(0.022, 2.8, 0.03, new THREE.MeshStandardMaterial({ color: 0x5f635b, roughness: 0.8 }), {
          position: [-width / 2 + i * (width / Math.round(width / 1.25)), 2.78, 0.015],
          receiveShadow: true,
          castShadow: false,
        }),
      );
    }
    // structural I-beam pilasters
    for (let i = -1; i <= 1; i++) {
      const xPos = i * width * 0.32;
      wall.add(
        box(0.16, 4.3, 0.08, wallPanelMat, {
          position: [xPos, 2.15, 0.06],
          receiveShadow: true,
        }),
      );
      wall.add(
        box(0.32, 0.05, 0.17, wallPanelMat, {
          position: [xPos, 4.28, 0.06],
          receiveShadow: true,
        }),
      );
      wall.add(
        box(0.32, 0.05, 0.17, wallPanelMat, {
          position: [xPos, 0.12, 0.06],
          receiveShadow: true,
        }),
      );
    }
    return wall;
  };
  addWall(0, -5.0, 11.9, 0);
  addWall(-5.98, 0, 10, Math.PI / 2);
  addWall(5.98, 0, 10, -Math.PI / 2);
  addWall(0, 5.0, 11.9, Math.PI);
  const ceiling = box(12.0, 0.1, 10.0, new THREE.MeshStandardMaterial({ color: 0x252b27, roughness: 0.84 }), {
    position: [0, 4.27, 0],
    castShadow: false,
    receiveShadow: false,
  });
  root.add(ceiling);

  // Ceiling structural trusses.
  for (let i = -2; i <= 2; i++) {
    const z = i * 1.9;
    root.add(
      box(11.8, 0.18, 0.16, new THREE.MeshStandardMaterial({ color: 0x1b211e, roughness: 0.64, metalness: 0.4 }), {
        position: [0, 3.98, z],
        castShadow: false,
      }),
    );
    root.add(
      box(11.8, 0.08, 0.4, new THREE.MeshStandardMaterial({ color: 0x202622, roughness: 0.66, metalness: 0.35 }), {
        position: [0, 4.08, z],
        castShadow: false,
      }),
    );
  }

  // -----------------------------------------------------------------------
  // Wall signage, observation window and services
  // -----------------------------------------------------------------------
  const signTexture = makeLabelTexture(
    [
      { text: 'DMAX', font: '900 215px Bahnschrift, "Arial Black", Arial, sans-serif', color: '#edab43' },
      { text: 'MORAINE ENGINE PLANT  ·  DYNO TEST CELL 04', font: '600 45px Bahnschrift, Arial', color: '#ddd8c9', small: true },
    ],
    {
      width: 1800,
      height: 520,
      background: '#0d1210',
      padding: 100,
      border: true,
      accent: '#5f4f2b',
      letterSpacing: 9,
    },
  );
  const signMat = new THREE.MeshStandardMaterial({
    map: signTexture,
    emissive: new THREE.Color(0x4a300f),
    emissiveMap: signTexture,
    emissiveIntensity: 1.25,
    roughness: 0.52,
    metalness: 0.15,
  });
  const sign = mesh(new THREE.PlaneGeometry(4.25, 1.23), signMat, {
    position: [-2.9, 1.94, -4.835],
    castShadow: false,
    receiveShadow: false,
  });
  root.add(sign);
  // backing panel for sign
  root.add(
    box(4.56, 1.5, 0.06, wallPanelMat, {
      position: [-2.9, 1.94, -4.88],
      castShadow: false,
    }),
  );
  // A slim horizontal light bar beneath the DMAX sign.
  root.add(
    box(4.7, 0.045, 0.06, new THREE.MeshBasicMaterial({ color: 0xffd8a4 }), {
      position: [-2.9, 1.14, -4.78],
      castShadow: false,
    }),
  );
  // Vertical LED accents on the wall.
  for (const [x, color, height] of [
    [-5.55, 0xffb45f, 2.4],
    [5.55, 0x83bfc3, 2.4],
  ]) {
    const strip = box(0.045, height, 0.035, new THREE.MeshStandardMaterial({
      color: 0x1a1d1a,
      emissive: color,
      emissiveIntensity: 1.6,
      roughness: 0.6,
    }), {
      position: [x, 2.36, -4.79],
      castShadow: false,
    });
    root.add(strip);
  }
  // Floor-level wall wash fixtures.
  for (const x of [-3.8, 1.4, 3.6]) {
    root.add(
      box(0.44, 0.045, 0.08, new THREE.MeshBasicMaterial({ color: 0xffd7a2 }), {
        position: [x, 0.16, -4.77],
        castShadow: false,
      }),
    );
  }

  // Observation window into the control room
  const windowGroup = new THREE.Group();
  windowGroup.position.set(3.75, 2.35, -4.89);
  root.add(windowGroup);
  windowGroup.add(
    box(2.5, 1.68, 0.09, wallPanelMat, { position: [0, 0, -0.07] }),
  );
  const windowTex = makeLabelTexture(
    [
      { text: 'CONTROL ROOM  /  CELL 04', font: '500 34px Bahnschrift, Arial', color: '#95b9b6', small: true },
    ],
    { width: 1024, height: 140, background: '#071210', padding: 20 },
  );
  const windowPane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.26, 1.44),
    new THREE.MeshPhysicalMaterial({
      color: 0x17302d,
      roughness: 0.12,
      metalness: 0.15,
      transmission: 0.2,
      transparent: true,
      opacity: 0.78,
      emissive: new THREE.Color(0x0c302d),
      emissiveIntensity: 0.55,
      map: windowTex,
    }),
  );
  windowPane.position.z = 0.02;
  windowGroup.add(windowPane);
  windowGroup.add(
    box(2.5, 0.045, 0.13, wallPanelMat, { position: [0, 0.885, 0.02] }),
  );
  windowGroup.add(
    box(2.5, 0.045, 0.13, wallPanelMat, { position: [0, -0.885, 0.02] }),
  );
  for (let i = -1; i <= 1; i++) {
    windowGroup.add(
      box(0.045, 1.75, 0.14, wallPanelMat, { position: [i * 0.82, 0, 0.02] }),
    );
  }
  // silhouettes of monitoring gear behind the glass
  for (let i = 0; i < 4; i++) {
    const x = -0.85 + i * 0.53;
    windowGroup.add(
      box(0.34, 0.24, 0.02, m.screen, {
        position: [x, 0.28, -0.025],
        castShadow: false,
      }),
    );
    windowGroup.add(
      box(0.31, 0.18, 0.012, coolNeon, {
        position: [x, 0.28, -0.012],
        castShadow: false,
      }),
    );
    windowGroup.add(
      box(0.3, 0.5, 0.15, wallPanelMat, { position: [x, -0.2, -0.02] }),
    );
  }
  windowGroup.add(
    box(2.2, 0.06, 1, wallPanelMat, { position: [0, -0.67, 0.2] }),
  );

  // Safety placards.
  const placardTex = makeLabelTexture(
    [
      { text: 'CAUTION', font: '800 100px Bahnschrift, Arial', color: '#11130f' },
      { text: 'ROTATING MACHINERY  ·  HEARING PROTECTION REQUIRED', font: '700 30px Bahnschrift, Arial', color: '#17180f', small: true },
    ],
    { width: 1400, height: 340, background: '#d5a331', padding: 40, border: true, accent: '#17180f' },
  );
  decal(root, placardTex, 1.5, 0.36, [4.05, 2.62, -4.87], [0, 0, 0], { roughness: 0.7 });
  const electricalTex = makeLabelTexture(
    [
      { text: 'HIGH VOLTAGE', font: '800 74px Bahnschrift, Arial', color: '#e8b24d' },
      { text: 'DYNO CONTROL  ·  480 V  3Ø  60 Hz', font: '500 29px Consolas, monospace', color: '#b8b2a2', small: true },
    ],
    { width: 1000, height: 260, background: '#20211c', border: true, accent: '#b89032', padding: 25 },
  );
  decal(root, electricalTex, 0.95, 0.245, [4.7, 1.92, -4.86], [0, 0, 0], { roughness: 0.55 });

  // Wall services: conduit, fire main, cable tray.
  const conduitMat = m.darkSteel;
  for (const [x, y] of [
    [-4.2, 3.92],
    [3.6, 3.92],
  ]) {
    root.add(
      cylinder(0.055, 0.055, 0.01, conduitMat, {
        radial: 20,
        rotation: [Math.PI / 2, 0, 0],
        position: [x, y, -4.86],
      }),
    );
  }
  const pipe = cylinderBetween([-5.9, 3.92, -4.72], [5.9, 3.92, -4.72], 0.055, m.aluminumDuct, {
    radial: 20,
    castShadow: false,
  });
  root.add(pipe);
  for (let i = 0; i < 5; i++) {
    root.add(
      torus(0.07, 0.012, m.darkSteel, {
        rotation: [0, Math.PI / 2, 0],
        position: [-4.8 + i * 2.4, 3.92, -4.72],
        tubularSeg: 20,
        radialSeg: 5,
        castShadow: false,
      }),
    );
  }
  for (let i = 0; i < 2; i++) {
    root.add(
      box(11.2, 0.025, 0.4, m.darkSteel, {
        position: [0, 3.42 - i * 0.15, -4.83],
        castShadow: false,
      }),
    );
    for (let j = -4; j <= 4; j++) {
      root.add(
        box(0.02, 0.15, 0.5, m.darkSteel, {
          position: [j * 1.2, 3.49 - i * 0.15, -4.83],
          castShadow: false,
        }),
      );
    }
  }
  // hanging cable bundles
  root.add(
    tube(
      [
        [-5.8, 3.4, -4.78],
        [-2.8, 3.33, -4.72],
        [1.7, 3.28, -4.7],
        [5.8, 3.32, -4.75],
      ],
      0.09,
      m.rubber,
      { segments: 40, radial: 8, castShadow: false },
    ),
  );

  // -----------------------------------------------------------------------
  // Lighting
  // -----------------------------------------------------------------------
  scene.add(new THREE.HemisphereLight(0xb9c5bb, 0x1d1b17, 0.3));
  const key = new THREE.DirectionalLight(0xffecd2, 1.75);
  key.position.set(-3.2, 4.5, 3.5);
  key.target.position.set(-0.1, 0.85, -0.15);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -3.4;
  key.shadow.camera.right = 3.4;
  key.shadow.camera.top = 3.5;
  key.shadow.camera.bottom = -2.1;
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 12;
  key.shadow.bias = -0.00025;
  key.shadow.normalBias = 0.018;
  key.shadow.radius = 3;
  scene.add(key, key.target);

  const fill = new THREE.SpotLight(0xb2cece, 78, 9, 0.9, 0.74, 1.9);
  fill.position.set(3.8, 3.6, 2.1);
  fill.target.position.set(0, 0.8, 0);
  scene.add(fill, fill.target);

  const rim = new THREE.SpotLight(0xb8d2d4, 55, 10, 0.7, 0.86, 1.8);
  rim.position.set(2.8, 2.8, -3.9);
  rim.target.position.set(0, 0.95, 0);
  scene.add(rim, rim.target);

  // Background separation: a cool wash on the rear wall.
  const wallWash = new THREE.SpotLight(0x9caeb1, 310, 13, 1.0, 0.92, 1.55);
  wallWash.position.set(1.2, 4.0, 3.2);
  wallWash.target.position.set(0.4, 2.15, -4.8);
  scene.add(wallWash, wallWash.target);

  // Linear ceiling fixtures and rect-area reflections.
  const fixtureMat = new THREE.MeshStandardMaterial({
    color: 0xcac5b6,
    emissive: 0xfff1dc,
    emissiveIntensity: 1.7,
    roughness: 0.45,
    metalness: 0.25,
  });
  const lightPositions = [
    [-2.9, 3.86, 0.6],
    [0, 3.86, -0.8],
    [2.9, 3.86, 1.0],
    [-1.6, 3.86, -2.7],
  ];
  for (let li = 0; li < lightPositions.length; li++) {
    const [x, y, z] = lightPositions[li];
    const fix = new THREE.Group();
    fix.position.set(x, y, z);
    root.add(fix);
    fix.add(
      box(1.9, 0.09, 0.22, wallPanelMat, {
        position: [0, 0.07, 0],
        castShadow: false,
      }),
    );
    fix.add(
      box(1.75, 0.05, 0.14, fixtureMat, {
        position: [0, -0.01, 0],
        castShadow: false,
        receiveShadow: false,
      }),
    );
    for (const dz of [-0.5, 0.5]) {
      fix.add(
        box(0.04, 0.45, 0.04, wallPanelMat, {
          position: [0, 0.3, dz],
          rotation: [dz * 0.1, 0, 0],
          castShadow: false,
        }),
      );
    }
    if (li === 1) {
      const rect = new THREE.RectAreaLight(0xffead1, 0.65, 1.65, 0.17);
      rect.position.set(x, y - 0.06, z);
      rect.lookAt(x, 0, z);
      scene.add(rect);
    }
  }

  // Practical overhead work lamp on a trailing arm.
  const workLampPost = new THREE.Group();
  workLampPost.position.set(-2.0, 0, 1.7);
  root.add(workLampPost);
  workLampPost.add(
    cylinder(0.045, 0.075, 2.7, m.standSteel, {
      radial: 18,
      position: [0, 1.35, 0],
      castShadow: true,
    }),
  );
  const lampArm = new THREE.Group();
  lampArm.position.set(0, 2.56, 0);
  workLampPost.add(lampArm);
  lampArm.add(
    cylinderBetween([0, 0, 0], [0.72, 0.42, 0], 0.032, m.standSteel, { radial: 14 }),
  );
  const lampHead = new THREE.Group();
  lampHead.position.set(0.78, 0.46, 0);
  lampArm.add(lampHead);
  lampHead.add(
    mesh(
      new THREE.ConeGeometry(0.18, 0.22, 24, 1, true),
      black,
      { rotation: [0, 0, Math.PI], castShadow: true, receiveShadow: true },
    ),
  );
  lampHead.add(
    cylinder(0.13, 0.13, 0.02, fixtureMat, {
      radial: 24,
      rotation: [Math.PI / 2, 0, 0],
      position: [0, -0.12, 0],
      castShadow: false,
    }),
  );


  // Warm floor bounce and a soft contact-shadow pool.
  const shadowTex = makeRadialTexture('rgba(0,0,0,0.7)', 'rgba(0,0,0,0)');
  for (const [x, z, w, d, opacity] of [
    [0, -0.14, 3.2, 3.0, 0.58],
    [0, -1.55, 2.5, 1.8, 0.42],
    [2.25, -0.3, 1.35, 1.45, 0.3],
    [-1.9, 1.6, 0.9, 0.9, 0.25],
  ]) {
    const p = new THREE.Mesh(
      new THREE.PlaneGeometry(w, d),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity,
        depthWrite: false,
        color: 0x000000,
      }),
    );
    p.rotation.x = -Math.PI / 2;
    p.position.set(x, 0.015, z);
    p.renderOrder = 1;
    root.add(p);
  }

  // -----------------------------------------------------------------------
  // Test stand
  // -----------------------------------------------------------------------
  const stand = addGroup(root, 'test-stand');
  register('test-stand', stand);
  const standFrame = addGroup(stand);
  const frameInset = 0.78;
  const frameLength = 2.65;
  const frameZ = -0.34;

  // Levelling feet
  for (const x of [-0.7, 0.7]) {
    for (const z of [frameZ - 1.08, frameZ + 1.06]) {
      standFrame.add(
        cylinder(0.085, 0.105, 0.1, m.standSteel, {
          radial: 20,
          position: [x, 0.055, z],
          castShadow: true,
        }),
      );
      standFrame.add(
        cylinder(0.05, 0.05, 0.06, m.boltSteel, {
          radial: 6,
          position: [x, 0.12, z],
        }),
      );
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * TAU + 0.4;
        addBoltAt(standFrame, [x + Math.cos(a) * 0.09, 0.105, z + Math.sin(a) * 0.09], [0, 1, 0], 0.012, m.boltSteel);
      }
    }
  }
  // Base frame longitudinal beams (I-beams)
  for (const x of [-frameInset, frameInset]) {
    iBeam(standFrame, frameLength, 0.25, steel, [x, 0.24, frameZ], [0, 0, 0], 'z');
    addBoltAt(standFrame, [x + 0.08 * Math.sign(x), 0.29, frameZ + 0.76], [Math.sign(x), 0, 0], 0.02, m.boltSteel);
  }
  // Cross members
  for (const z of [frameZ - 1.03, frameZ - 0.3, frameZ + 0.46, frameZ + 1.0]) {
    iBeam(standFrame, frameInset * 2 - 0.12, 0.18, steel, [0, 0.207, z], [0, 0, Math.PI / 2], 'z');
    standFrame.add(
      box(0.26, 0.04, 0.22, m.standYellow, {
        position: [-0.84, 0.31, z],
        castShadow: false,
      }),
    );
    standFrame.add(
      box(0.26, 0.04, 0.22, m.standYellow, {
        position: [0.84, 0.31, z],
        castShadow: false,
      }),
    );
  }
  // Hazard-safety kick rail across the front.
  const hazardTex = makeHazardTexture(8, 1);
  const hazardMat = new THREE.MeshStandardMaterial({ map: hazardTex, roughness: 0.62, metalness: 0.08 });
  standFrame.add(
    box(1.48, 0.14, 0.03, hazardMat, {
      position: [0, 0.36, frameZ + 1.19],
      castShadow: false,
    }),
  );
  standFrame.add(
    box(0.03, 0.14, 2.26, hazardMat, {
      position: [-1.03, 0.36, frameZ],
      rotation: [0, Math.PI / 2, 0],
      castShadow: false,
    }),
  );
  standFrame.add(
    box(0.03, 0.14, 2.26, hazardMat, {
      position: [1.03, 0.36, frameZ],
      rotation: [0, Math.PI / 2, 0],
      castShadow: false,
    }),
  );
  // Yellow end caps / lifting points.
  for (const x of [-frameInset, frameInset]) {
    for (const z of [frameZ - 1.3, frameZ + 1.3]) {
      standFrame.add(
        roundedBox(0.15, 0.27, 0.11, 0.02, yellow, {
          position: [x, 0.24, z],
          segments: 2,
        }),
      );
    }
  }
  // Drip tray below the engine.
  const trayMat = new THREE.MeshStandardMaterial({
    color: 0x3d423d,
    roughness: 0.48,
    metalness: 0.64,
  });
  standFrame.add(
    box(1.36, 0.025, 1.3, trayMat, {
      position: [0, 0.39, -0.04],
      castShadow: false,
      receiveShadow: true,
    }),
  );
  standFrame.add(box(1.33, 0.012, 1.24, m.rubber, { position: [0, 0.405, -0.04], castShadow: false }));
  standFrame.add(
    box(0.08, 0.27, 0.08, rubber, {
      position: [-0.64, 0.26, 0.57],
      castShadow: false,
    }),
  );
  standFrame.add(
    box(0.08, 0.27, 0.08, rubber, {
      position: [0.64, 0.26, 0.57],
      castShadow: false,
    }),
  );

  // Open-frame side rails carry the four engine isolation mounts. Keeping the
  // support structure at the perimeter exposes the sump and lower block.
  const railY = 0.82;
  for (const x of [-0.585, 0.585]) {
    // Longitudinal upper channel.
    standFrame.add(
      roundedBox(0.13, 0.14, 1.92, 0.02, steel, {
        position: [x, railY, -0.14],
        segments: 2,
        castShadow: true,
        receiveShadow: true,
      }),
    );
    standFrame.add(
      box(0.08, 0.025, 1.9, m.standSteel, {
        position: [x, railY + 0.078, -0.14],
        castShadow: false,
      }),
    );
    // End supports / diagonal A-frame legs.
    for (const z of [-0.82, 0.72]) {
      const support = new THREE.Group();
      support.position.set(x, 0, z);
      standFrame.add(support);
      support.add(
        box(0.12, 0.5, 0.16, steel, {
          position: [0, 0.53, 0],
          castShadow: true,
          receiveShadow: true,
        }),
      );
      support.add(
        box(0.2, 0.055, 0.24, m.standSteel, {
          position: [0, 0.28, 0],
          castShadow: false,
        }),
      );
      support.add(
        cylinderBetween(
          [Math.sign(x) * 0.19, 0.3, 0],
          [0, 0.64, 0],
          0.034,
          steel,
          { radial: 12, castShadow: true },
        ),
      );
      addBoltAt(support, [0, 0.75, 0], [0, 1, 0], 0.022, m.boltSteel);
    }
    // Four short mount arms to the engine isolator.
    for (const z of [-0.165, 0.17]) {
      standFrame.add(
        roundedBox(0.36, 0.075, 0.15, 0.015, steel, {
          position: [Math.sign(x) * 0.4, 0.815, z],
          segments: 2,
          castShadow: true,
        }),
      );
      standFrame.add(
        roundedBox(0.16, 0.14, 0.17, 0.02, steel, {
          position: [x, 0.815, z],
          segments: 2,
          castShadow: true,
        }),
      );
      standFrame.add(
        cylinder(0.082, 0.082, 0.12, rubber, {
          radial: 26,
          rotation: [0, 0, Math.PI / 2],
          position: [Math.sign(x) * 0.27, 0.815, z],
          castShadow: true,
        }),
      );
      standFrame.add(
        cylinder(0.036, 0.036, 0.5, m.boltSteel, {
          radial: 14,
          rotation: [0, 0, Math.PI / 2],
          position: [Math.sign(x) * 0.27, 0.815, z],
          castShadow: false,
        }),
      );
      addBoltAt(standFrame, [x, 0.91, z + 0.1], [0, 1, 0], 0.018, m.boltSteel);
    }
    // Warning stripe on the outer rail.
    standFrame.add(
      box(0.012, 0.028, 1.55, m.standYellow, {
        position: [x + Math.sign(x) * 0.068, railY + 0.02, -0.14],
        castShadow: false,
      }),
    );
  }
  // Transverse tie beams at the outboard supports.
  for (const z of [-0.82, 0.72]) {
    standFrame.add(
      roundedBox(1.25, 0.09, 0.13, 0.018, steel, {
        position: [0, 0.46, z],
        segments: 2,
        castShadow: true,
      }),
    );
  }
  // Rear-of-engine steady brace to the dyno pedestal.
  standFrame.add(
    cylinderBetween([0.58, 0.82, -0.95], [0.52, 0.75, -1.5], 0.042, steel, {
      radial: 14,
      castShadow: true,
    }),
  );
  standFrame.add(
    cylinderBetween([-0.58, 0.82, -0.95], [-0.52, 0.75, -1.5], 0.042, steel, {
      radial: 14,
      castShadow: true,
    }),
  );
  // Low-profile instrumentation junction tucked to the side of the bedplate.
  const standJunction = new THREE.Group();
  standJunction.position.set(-0.7, 0.42, 0.52);
  standFrame.add(standJunction);
  standJunction.add(
    roundedBox(0.2, 0.13, 0.14, 0.02, m.standSteel, { segments: 2 }),
  );
  standJunction.add(
    roundedBox(0.16, 0.055, 0.012, 0.006, m.blackPlastic, {
      position: [0, 0.03, 0.073],
      segments: 1,
      castShadow: false,
    }),
  );
  standJunction.add(
    box(0.08, 0.006, 0.008, red, {
      position: [0, 0.03, 0.083],
      castShadow: false,
    }),
  );
  standFrame.add(
    tube(
      [
        [-0.7, 0.48, 0.52],
        [-0.5, 0.54, 0.48],
        [-0.31, 0.62, 0.39],
      ],
      0.009,
      m.rubber,
      { segments: 20, radial: 6, castShadow: false },
    ),
  );

  const standBadgeTex = makeLabelTexture(
    [
      { text: 'DMAX', font: '900 128px Bahnschrift, Arial', color: '#e4ac51' },
      { text: 'HEAVY DUTY DYNO BEDPLATE  ·  1,000 LB-FT', font: '600 29px Bahnschrift, Arial', color: '#b9b7a8', small: true },
    ],
    { width: 1000, height: 300, background: '#161b18', border: true, accent: '#8e6829', padding: 24 },
  );
  decal(standFrame, standBadgeTex, 0.45, 0.135, [0, 0.27, frameZ + 1.2], [0, 0, 0], {
    roughness: 0.46,
    renderOrder: 3,
  });
  // Front cover panel with cut-outs.
  standFrame.add(
    roundedBox(1.25, 0.11, 0.04, 0.01, steel, {
      position: [0, 0.48, frameZ + 1.16],
      segments: 1,
      castShadow: false,
    }),
  );

  // -----------------------------------------------------------------------
  // Dynamometer and driveline
  // -----------------------------------------------------------------------
  const dyno = addGroup(root, 'dyno');
  register('dyno', dyno);
  const dynoPedestal = addGroup(dyno);
  dynoPedestal.position.set(0, 0, -1.45);
  for (const x of [-0.35, 0.35]) {
    dynoPedestal.add(
      box(0.15, 0.9, 0.18, steel, {
        position: [x, 0.45, 0],
        castShadow: true,
        receiveShadow: true,
      }),
    );
    dynoPedestal.add(
      box(0.42, 0.08, 0.58, steel, {
        position: [x * 0.5, 0.08, 0],
        castShadow: true,
      }),
    );
  }
  dynoPedestal.add(
    roundedBox(0.92, 0.14, 0.65, 0.03, steel, {
      position: [0, 0.82, 0],
      segments: 2,
      castShadow: true,
    }),
  );
  dynoPedestal.add(
    mesh(
      new THREE.CylinderGeometry(0.27, 0.3, 0.72, 32, 1, false),
      black,
      {
        rotation: [Math.PI / 2, 0, 0],
        position: [0, 1.0, -0.1],
        castShadow: true,
        receiveShadow: true,
      },
    ),
  );
  // dyno end caps and cooling fins
  for (const z of [0.28, -0.48]) {
    dynoPedestal.add(
      cylinder(0.32, 0.32, 0.055, m.castIronBlockDark, {
        radial: 36,
        rotation: [Math.PI / 2, 0, 0],
        position: [0, 1.0, z - 0.1],
        castShadow: true,
      }),
    );
    dynoPedestal.add(
      cylinder(0.17, 0.17, 0.08, m.castAluminum, {
        radial: 28,
        rotation: [Math.PI / 2, 0, 0],
        position: [0, 1.0, z - 0.1 + Math.sign(z) * 0.02],
      }),
    );
  }
  for (let i = 0; i < 7; i++) {
    dynoPedestal.add(
      torus(0.298, 0.018, m.copper, {
        rotation: [Math.PI / 2, 0, 0],
        position: [0, 1.0, -0.38 + i * 0.09],
        tubularSeg: 30,
        radialSeg: 5,
        castShadow: false,
      }),
    );
  }
  decal(
    dynoPedestal,
    makeLabelTexture(
      [
        { text: 'DYNO', font: '900 125px Bahnschrift, Arial', color: '#e6ae51' },
        { text: 'EDDY CURRENT ABSORBER · 1,000 LB-FT', font: '600 27px Bahnschrift, Arial', color: '#b9b8a9', small: true },
      ],
      { width: 1000, height: 300, background: '#171b18', border: true, accent: '#8b672e', padding: 22 },
    ),
    0.6,
    0.18,
    [0, 1.0, -0.55],
    [0, Math.PI, 0],
    { roughness: 0.5 },
  );
  // cooling water lines
  dynoPedestal.add(
    tube(
      [
        [-0.25, 1.2, -0.05],
        [-0.55, 1.18, -0.4],
        [-0.72, 0.8, -0.78],
        [-0.7, 0.35, -0.92],
      ],
      0.028,
      m.rubber,
      { segments: 28, radial: 8, castShadow: false },
    ),
  );
  dynoPedestal.add(
    tube(
      [
        [0.28, 1.21, -0.16],
        [0.54, 1.13, -0.55],
        [0.66, 0.75, -0.85],
        [0.6, 0.34, -1.02],
      ],
      0.022,
      m.aluminumDuct,
      { segments: 28, radial: 8, castShadow: false },
    ),
  );
  // load cell / reaction arm
  dynoPedestal.add(
    box(0.65, 0.07, 0.1, m.machinedAluminum, {
      position: [0.42, 1.26, -0.22],
      rotation: [0, 0, -0.08],
      castShadow: true,
    }),
  );
  dynoPedestal.add(
    roundedBox(0.18, 0.2, 0.16, 0.02, m.boltSteel, {
      position: [0.1, 1.31, -0.22],
      segments: 1,
    }),
  );
  dynoPedestal.add(
    roundedBox(0.2, 0.18, 0.2, 0.02, m.standYellow, {
      position: [0.7, 1.07, -0.22],
      segments: 1,
    }),
  );
  dynoPedestal.add(
    tube(
      [
        [0.42, 1.26, -0.22],
        [0.4, 0.95, -0.5],
        [0.19, 0.55, -0.68],
      ],
      0.012,
      m.rubber,
      { segments: 16, radial: 6, castShadow: false },
    ),
  );

  // Driveline coupling from the flywheel to the absorber.
  const shaftGroup = new THREE.Group();
  dynoPedestal.add(shaftGroup);
  // Couple the engine flywheel (engine z ≈ −0.32) to the absorber (z ≈ −1.45).
  const shaftStart = new THREE.Vector3(0, 1.0, 1.12);
  const shaftEnd = new THREE.Vector3(0, 1.0, 0.4);
  shaftGroup.add(
    cylinderBetween(shaftStart, shaftEnd, 0.048, m.machinedAluminum, {
      radial: 22,
      castShadow: true,
    }),
  );
  for (const t of [0.2, 0.5, 0.8]) {
    const p = shaftStart.clone().lerp(shaftEnd, t);
    shaftGroup.add(
      torus(0.06, 0.012, m.darkSteel, {
        rotation: [Math.PI / 2, 0, 0],
        position: [p.x, p.y, p.z],
        tubularSeg: 20,
        radialSeg: 5,
      }),
    );
  }
  for (const z of [1.08, 0.44]) {
    dynoPedestal.add(
      roundedBox(0.28, 0.18, 0.09, 0.025, m.machinedAluminum, {
        position: [0, 1.0, z],
        segments: 2,
        castShadow: true,
      }),
    );
    dynoPedestal.add(
      cylinder(0.15, 0.15, 0.07, m.darkSteel, {
        radial: 26,
        rotation: [Math.PI / 2, 0, 0],
        position: [0, 1.0, z],
        castShadow: true,
      }),
    );
  }
  // driveshaft guard
  const guard = new THREE.Group();
  guard.position.set(0, 1.0, 0.76);
  dynoPedestal.add(guard);
  for (const [angle, rad] of [
    [0, 0.16],
    [Math.PI / 2, 0.16],
    [Math.PI, 0.16],
    [-Math.PI / 2, 0.16],
  ]) {
    guard.add(
      cylinder(0.009, 0.009, 0.82, m.standYellow, {
        rotation: [Math.PI / 2, 0, 0],
        position: [Math.cos(angle) * rad, Math.sin(angle) * rad, 0],
        radial: 8,
        castShadow: false,
      }),
    );
  }
  for (const z of [-0.4, 0, 0.4]) {
    guard.add(
      torus(0.16, 0.01, m.standYellow, {
        rotation: [0, 0, 0],
        position: [0, 0, z],
        tubularSeg: 26,
        radialSeg: 5,
        castShadow: false,
      }),
    );
  }
  // semi-transparent guard mesh
  const guardMesh = mesh(
    new THREE.CylinderGeometry(0.155, 0.155, 0.7, 16, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0x8b8d82,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    }),
    {
      rotation: [Math.PI / 2, 0, 0],
      position: [0, 0, 0],
      castShadow: false,
      receiveShadow: false,
    },
  );
  guard.add(guardMesh);

  // -----------------------------------------------------------------------
  // Control console
  // -----------------------------------------------------------------------
  const consoleGroup = addGroup(root);
  consoleGroup.position.set(2.16, 0, -0.45);
  consoleGroup.rotation.y = -0.52;
  root.add(consoleGroup);
  const consoleBase = new THREE.Group();
  consoleGroup.add(consoleBase);
  consoleBase.add(
    roundedBox(0.86, 0.92, 0.53, 0.035, m.standSteel, {
      position: [0, 0.46, 0],
      segments: 2,
      castShadow: true,
      receiveShadow: true,
    }),
  );
  consoleBase.add(
    roundedBox(0.9, 0.07, 0.6, 0.018, m.standSteel, {
      position: [0, 0.94, 0.01],
      segments: 1,
      castShadow: true,
    }),
  );
  consoleBase.add(
    roundedBox(0.9, 0.018, 0.04, 0.005, m.standYellow, {
      position: [0, 0.94, 0.31],
      segments: 1,
      castShadow: false,
    }),
  );
  consoleBase.add(
    roundedBox(0.84, 0.42, 0.05, 0.015, wallPanelMat, {
      position: [0, 0.24, 0.275],
      segments: 1,
      castShadow: false,
    }),
  );
  for (let i = 0; i < 8; i++) {
    consoleBase.add(
      box(0.02, 0.29, 0.01, m.darkSteel, {
        position: [-0.36 + i * 0.103, 0.24, 0.305],
        castShadow: false,
      }),
    );
  }
  // angled monitor housing
  const monitorHousing = new THREE.Group();
  monitorHousing.position.set(0, 1.07, -0.05);
  monitorHousing.rotation.x = -0.21;
  consoleGroup.add(monitorHousing);
  monitorHousing.add(
    roundedBox(0.78, 0.43, 0.13, 0.02, m.blackPlastic, {
      position: [0, 0.16, 0],
      segments: 2,
      castShadow: true,
    }),
  );
  monitorHousing.add(
    box(0.7, 0.33, 0.012, m.screen, {
      position: [0, 0.18, 0.072],
      castShadow: false,
    }),
  );
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 1024;
  screenCanvas.height = 480;
  const screenCtx = screenCanvas.getContext('2d');
  const screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.colorSpace = THREE.SRGBColorSpace;
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false });
  monitorHousing.add(
    mesh(
      new THREE.PlaneGeometry(0.66, 0.3),
      screenMat,
      { position: [0, 0.18, 0.079], castShadow: false, receiveShadow: false },
    ),
  );
  const drawConsole = (rpm = 0, hp = 0) => {
    const w = screenCanvas.width;
    const h = screenCanvas.height;
    screenCtx.fillStyle = '#07100f';
    screenCtx.fillRect(0, 0, w, h);
    screenCtx.fillStyle = '#1d2a26';
    screenCtx.fillRect(0, 0, w, 56);
    screenCtx.fillStyle = '#d9b15f';
    screenCtx.font = '600 27px Consolas, monospace';
    screenCtx.fillText('DMAX DYNO  //  CELL 04', 32, 38);
    screenCtx.fillStyle = '#75aaa4';
    screenCtx.font = '500 21px Consolas, monospace';
    screenCtx.textAlign = 'right';
    screenCtx.fillText('RUN 04-A', w - 28, 38);
    screenCtx.textAlign = 'left';
    screenCtx.fillStyle = '#8dc0ba';
    screenCtx.font = '500 19px Consolas, monospace';
    screenCtx.fillText('ENGINE SPEED', 33, 104);
    screenCtx.fillStyle = '#f3e3ba';
    screenCtx.font = '600 66px Consolas, monospace';
    screenCtx.fillText(`${Math.round(rpm)}`, 30, 173);
    screenCtx.fillStyle = '#857e6d';
    screenCtx.font = '500 22px Consolas, monospace';
    screenCtx.fillText('RPM', 250, 169);
    screenCtx.fillText('POWER', 540, 104);
    screenCtx.fillStyle = '#f3e3ba';
    screenCtx.font = '600 66px Consolas, monospace';
    screenCtx.fillText(`${Math.round(hp)}`, 530, 173);
    screenCtx.fillStyle = '#857e6d';
    screenCtx.font = '500 22px Consolas, monospace';
    screenCtx.fillText('HP', 685, 169);
    // torque and boost bars
    const bars = [
      ['TORQUE', 280, 610],
      ['BOOST', 280, 750],
      ['RAIL', 280, 890],
    ];
    screenCtx.font = '500 18px Consolas, monospace';
    for (let i = 0; i < bars.length; i++) {
      const y = 240 + i * 54;
      screenCtx.fillStyle = '#607a72';
      screenCtx.fillText(bars[i][0], 34, y + 14);
      screenCtx.strokeStyle = '#253b35';
      screenCtx.strokeRect(150, y, 760, 18);
      screenCtx.fillStyle = i === 0 ? '#dca64c' : i === 1 ? '#76b6b1' : '#b8a568';
      const frac = i === 0 ? Math.min(1, rpm / 2500) : i === 1 ? Math.min(1, rpm / 3250) : Math.min(1, rpm / 3250);
      screenCtx.fillRect(150, y, 760 * frac, 18);
    }
    screenCtx.fillStyle = '#3b4a44';
    screenCtx.font = '500 17px Consolas, monospace';
    screenCtx.fillText('TEST CELL / MORAINE, OHIO', 32, h - 22);
    screenCtx.textAlign = 'right';
    screenCtx.fillText('WATER 22.4°C   OIL OK', w - 28, h - 22);
    screenTex.needsUpdate = true;
  };
  drawConsole(680, 55);
  animated.monitors.push(drawConsole);

  // Keyboard and E-stop.
  const keyboard = new THREE.Group();
  keyboard.position.set(0.08, 0.96, 0.28);
  monitorHousing.add(keyboard);
  keyboard.add(
    roundedBox(0.42, 0.035, 0.2, 0.012, m.blackPlastic, {
      position: [0, 0, 0],
      segments: 1,
      castShadow: false,
    }),
  );
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 12; c++) {
      keyboard.add(
        box(0.022, 0.006, 0.022, m.darkSteel, {
          position: [-0.17 + c * 0.031, 0.022, -0.06 + r * 0.031],
          castShadow: false,
        }),
      );
    }
  }
  const estop = new THREE.Group();
  estop.position.set(0.34, 1.02, 0.23);
  consoleGroup.add(estop);
  estop.add(
    cylinder(0.06, 0.06, 0.04, m.standYellow, {
      radial: 24,
      position: [0, 0.02, 0],
    }),
  );
  estop.add(
    cylinder(0.042, 0.038, 0.025, red, {
      radial: 24,
      position: [0, 0.05, 0],
    }),
  );
  const estopTop = box(0.052, 0.018, 0.05, red, { position: [0, 0.073, 0], castShadow: false });
  estop.add(estopTop);
  // console chair
  const chair = addGroup(consoleGroup);
  chair.position.set(-0.9, 0, 0.55);
  chair.add(
    roundedBox(0.37, 0.06, 0.35, 0.05, m.rubber, {
      position: [0, 0.5, 0],
      segments: 2,
    }),
  );
  chair.add(
    roundedBox(0.35, 0.33, 0.05, 0.05, m.rubber, {
      position: [0, 0.76, -0.16],
      rotation: [-0.16, 0, 0],
      segments: 2,
    }),
  );
  chair.add(
    cylinder(0.03, 0.035, 0.4, m.boltSteel, {
      radial: 16,
      position: [0, 0.25, 0],
    }),
  );
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * TAU;
    chair.add(
      box(0.21, 0.02, 0.04, m.boltSteel, {
        position: [Math.cos(a) * 0.11, 0.08, Math.sin(a) * 0.11],
        rotation: [0, a, 0],
        castShadow: false,
      }),
    );
  }

  // -----------------------------------------------------------------------
  // Props / test cell dressing
  // -----------------------------------------------------------------------
  // Wheeled tool chest.
  const toolChest = new THREE.Group();
  toolChest.position.set(2.82, 0, 1.16);
  toolChest.rotation.y = -0.12;
  root.add(toolChest);
  toolChest.add(
    roundedBox(0.78, 0.88, 0.48, 0.02, m.red, {
      position: [0, 0.52, 0],
      segments: 2,
      castShadow: true,
      receiveShadow: true,
    }),
  );
  toolChest.add(
    roundedBox(0.8, 0.06, 0.5, 0.02, m.blackPlastic, {
      position: [0, 0.99, 0],
      segments: 1,
    }),
  );
  for (let i = 0; i < 5; i++) {
    toolChest.add(
      box(0.7, 0.015, 0.008, m.blackOxide, {
        position: [0, 0.75 - i * 0.12, 0.245],
        castShadow: false,
      }),
    );
    toolChest.add(
      roundedBox(0.24, 0.018, 0.023, 0.006, m.machinedAluminum, {
        position: [0, 0.7 - i * 0.12, 0.26],
        segments: 1,
        castShadow: false,
      }),
    );
  }
  for (const x of [-0.29, 0.29]) {
    for (const z of [-0.19, 0.19]) {
      toolChest.add(
        cylinder(0.055, 0.055, 0.045, m.rubber, {
          radial: 20,
          rotation: [Math.PI / 2, 0, 0],
          position: [x, 0.075, z],
        }),
      );
    }
  }
  // Stool.
  const stool = new THREE.Group();
  stool.position.set(-2.35, 0, 1.18);
  root.add(stool);
  stool.add(
    roundedBox(0.4, 0.07, 0.38, 0.07, m.rubber, {
      position: [0, 0.6, 0],
      segments: 2,
    }),
  );
  stool.add(
    cylinder(0.027, 0.04, 0.51, m.boltSteel, { radial: 16, position: [0, 0.31, 0] }),
  );
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * TAU;
    stool.add(
      box(0.27, 0.025, 0.05, m.boltSteel, {
        position: [Math.cos(a) * 0.14, 0.055, Math.sin(a) * 0.14],
        rotation: [0, a, 0],
      }),
    );
    stool.add(
      cylinder(0.031, 0.031, 0.055, m.rubber, {
        radial: 12,
        rotation: [Math.PI / 2, 0, 0],
        position: [Math.cos(a) * 0.27, 0.031, Math.sin(a) * 0.27],
      }),
    );
  }
  // Oil drums near the back wall.
  for (const [x, z, col] of [
    [-4.55, -3.6, 0x3d5248],
    [-3.9, -3.5, 0x3b4640],
    [-4.35, -2.85, 0x423e35],
  ]) {
    const drumMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.58, metalness: 0.5 });
    const drum = new THREE.Group();
    drum.position.set(x, 0, z);
    root.add(drum);
    drum.add(
      cylinder(0.27, 0.27, 0.86, drumMat, {
        radial: 30,
        position: [0, 0.43, 0],
        castShadow: true,
        receiveShadow: true,
      }),
    );
    for (const y of [0.23, 0.63]) {
      drum.add(
        torus(0.273, 0.016, m.darkSteel, {
          rotation: [Math.PI / 2, 0, 0],
          position: [0, y, 0],
          tubularSeg: 30,
          radialSeg: 5,
          castShadow: false,
        }),
      );
    }
    drum.add(
      cylinder(0.24, 0.24, 0.02, m.blackOxide, {
        radial: 26,
        position: [0, 0.875, 0],
      }),
    );
    drum.add(
      cylinder(0.05, 0.05, 0.035, m.brass, {
        radial: 6,
        position: [0.1, 0.895, 0.04],
      }),
    );
  }
  // Fire extinguisher on the wall.
  const extinguisher = new THREE.Group();
  extinguisher.position.set(4.9, 0, -3.7);
  root.add(extinguisher);
  extinguisher.add(
    cylinder(0.1, 0.1, 0.53, m.red, {
      radial: 24,
      position: [0, 0.31, 0],
    }),
  );
  extinguisher.add(
    cylinder(0.048, 0.06, 0.1, m.blackOxide, {
      radial: 20,
      position: [0, 0.62, 0],
    }),
  );
  extinguisher.add(
    tube(
      [
        [0.04, 0.62, 0],
        [0.14, 0.36, 0],
        [0.12, 0.13, 0],
      ],
      0.012,
      m.rubber,
      { segments: 12, radial: 6, castShadow: false },
    ),
  );
  extinguisher.add(
    makeLabelPlane(
      makeLabelTexture(
        [
          { text: 'FIRE', font: '800 80px Bahnschrift', color: '#f0e9d7' },
          { text: 'ABC · 9 kg', font: '600 24px Bahnschrift', color: '#e1d6c1', small: true },
        ],
        { width: 300, height: 220, background: '#9f291e', padding: 15 },
      ),
      0.14,
      0.1,
      [0, 0.31, 0.101],
    ),
  );
  // Small scrap tray and torque wrench on the bedplate.
  const wrench = new THREE.Group();
  wrench.position.set(0.45, 0.42, 0.73);
  wrench.rotation.y = 0.3;
  root.add(wrench);
  wrench.add(
    cylinderBetween([-0.28, 0, 0], [0.25, 0, 0], 0.014, m.polishedSteel, { radial: 10 }),
  );
  wrench.add(
    torus(0.035, 0.012, m.polishedSteel, {
      rotation: [Math.PI / 2, 0, 0],
      position: [0.29, 0, 0],
      tubularSeg: 18,
      radialSeg: 6,
      castShadow: false,
    }),
  );
  const rag = roundedBox(0.22, 0.012, 0.16, 0.04, m.rubber, {
    position: [-0.58, 0.41, 0.87],
    segments: 1,
    castShadow: false,
  });
  root.add(rag);
  // Safety cones.
  for (const [x, z] of [
    [-2.1, -2.15],
    [2.5, -2.38],
  ]) {
    const cone = new THREE.Group();
    cone.position.set(x, 0, z);
    root.add(cone);
    cone.add(
      box(0.28, 0.025, 0.28, m.blackPlastic, { position: [0, 0.015, 0], castShadow: false }),
    );
    cone.add(
      mesh(
        new THREE.ConeGeometry(0.12, 0.52, 24, 1),
        new THREE.MeshStandardMaterial({ color: 0xc86a28, roughness: 0.58 }),
        { position: [0, 0.28, 0], castShadow: true },
      ),
    );
    cone.add(
      torus(0.075, 0.012, new THREE.MeshBasicMaterial({ color: 0xe6dfd3 }), {
        rotation: [Math.PI / 2, 0, 0],
        position: [0, 0.28, 0],
        tubularSeg: 22,
        radialSeg: 5,
        castShadow: false,
      }),
    );
  }

  // Cable bundle draped from console to cell wall.
  const cablePoints = [
    [1.65, 0.02, 0.18],
    [1.1, 0.022, 1.2],
    [-0.2, 0.022, 2.1],
    [-3.1, 0.022, 2.55],
    [-5.4, 0.04, 2.2],
    [-5.5, 0.9, 1.5],
  ];
  for (let c = 0; c < 3; c++) {
    root.add(
      tube(
        cablePoints.map((p) => [p[0] + c * 0.03, p[1] + c * 0.015, p[2] + c * 0.025]),
        0.015,
        m.rubber,
        { segments: 60, radial: 6, castShadow: false },
      ),
    );
  }

  // A small parts shelf / inspection table in the background.
  const bench = new THREE.Group();
  bench.position.set(4.6, 0, 1.8);
  bench.rotation.y = Math.PI / 2;
  root.add(bench);
  bench.add(
    roundedBox(2.0, 0.08, 0.65, 0.02, m.standSteel, {
      position: [0, 0.9, 0],
      segments: 2,
      castShadow: true,
      receiveShadow: true,
    }),
  );
  for (const x of [-0.82, 0.82]) {
    for (const z of [-0.23, 0.23]) {
      bench.add(
        box(0.06, 0.87, 0.06, m.standSteel, { position: [x, 0.45, z], castShadow: true }),
      );
    }
  }
  bench.add(
    box(1.88, 0.04, 0.54, m.darkSteel, {
      position: [0, 0.35, 0],
      castShadow: false,
    }),
  );
  // Parts bins
  for (let i = 0; i < 3; i++) {
    bench.add(
      roundedBox(0.36, 0.2, 0.28, 0.02, new THREE.MeshStandardMaterial({ color: [0x34554b, 0x695332, 0x38424c][i], roughness: 0.6, metalness: 0.3 }), {
        position: [-0.62 + i * 0.42, 1.03, 0],
        segments: 1,
      }),
    );
  }
  // clipboard + small parts tray
  bench.add(
    box(0.27, 0.015, 0.35, new THREE.MeshStandardMaterial({ color: 0xb5a27c, roughness: 0.8 }), {
      position: [0.54, 0.95, 0.04],
      rotation: [0, 0.13, 0],
      castShadow: false,
    }),
  );

  // -----------------------------------------------------------------------
  // Dust motes in the key-light volume
  // -----------------------------------------------------------------------
  const dustGeo = new THREE.BufferGeometry();
  const dustCount = 240;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPositions[i * 3] = (Math.random() - 0.5) * 8;
    dustPositions[i * 3 + 1] = 0.3 + Math.random() * 3.2;
    dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 7;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  const dustMat = new THREE.PointsMaterial({
    color: 0xffe2b5,
    size: 0.012,
    transparent: true,
    opacity: 0.24,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  root.add(dust);

  // -----------------------------------------------------------------------
  // Static batch merging — keep the two selectable assemblies intact, but
  // collapse the room, console, props and each assembly into material batches.
  // -----------------------------------------------------------------------
  stand.userData.dynamic = true;
  dyno.userData.dynamic = true;
  mergeStaticMeshes(root);
  mergeStaticMeshes(stand);
  mergeStaticMeshes(dyno);

  // -----------------------------------------------------------------------
  // Animated details
  // -----------------------------------------------------------------------
  let lastScreenUpdate = -1;
  const initialDustPositions = dustPositions.slice();
  const update = (elapsed, state = {}) => {
    const blink = (Math.sin(elapsed * 4.4) + 1) * 0.5;
    for (const b of animated.beacons) {
      b.material.opacity = 0.25 + blink * 0.75;
    }
    if (elapsed - lastScreenUpdate > 0.35) {
      lastScreenUpdate = elapsed;
      for (const draw of animated.monitors) draw(state.rpm || 0, state.hp || 0);
    }
    // Very slow dust drift.
    const pos = dust.geometry.attributes.position;
    for (let i = 0; i < dustCount; i++) {
      pos.array[i * 3 + 1] = initialDustPositions[i * 3 + 1] + Math.sin(elapsed * 0.13 + i * 1.7) * 0.12;
      pos.array[i * 3] = initialDustPositions[i * 3] + Math.sin(elapsed * 0.07 + i) * 0.05;
    }
    pos.needsUpdate = true;
  };

  return {
    root,
    interactives,
    update,
    collision: {
      centerRadius: 1.25,
      dynoBox: new THREE.Box3(new THREE.Vector3(-0.8, 0, -2.3), new THREE.Vector3(0.8, 1.5, -1.05)),
      room: new THREE.Box3(new THREE.Vector3(-5.4, 0.1, -4.6), new THREE.Vector3(5.4, 3.9, 4.6)),
      // Where the orbit camera may be: inside the walls and under the ceiling lights (their lowest face is 3.83 m).
      orbitBox: new THREE.Box3(new THREE.Vector3(-5.4, 0.25, -4.6), new THREE.Vector3(5.4, 3.6, 4.6)),
      cameraHeight: 1.66,
    },
    keyLight: key,
    screenMaterial: screenMat,
    drawConsole,
  };
}

function makeLabelPlane(texture, w, h, position) {
  const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  p.position.set(...position);
  p.castShadow = false;
  p.receiveShadow = false;
  return p;
}
