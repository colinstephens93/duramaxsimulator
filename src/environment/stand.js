import * as THREE from 'three';
import {
  addBoltAt,
  box,
  cylinder,
  cylinderBetween,
  decal,
  makeHazardTexture,
  makeLabelTexture,
  mesh,
  roundedBox,
  torus,
  tube,
} from '../utils.js';

export function makeStandBadgeTexture(standMain, standSub) {
  return makeLabelTexture(
    [
      { text: standMain, font: '900 128px Bahnschrift, Arial', color: '#e4ac51' },
      { text: standSub, font: '600 29px Bahnschrift, Arial', color: '#b9b7a8', small: true },
    ],
    { width: 1000, height: 300, background: '#161b18', border: true, accent: '#8e6829', padding: 24 },
  );
}

export function buildStand({
  root,
  register,
  m,
  TAU,
  addGroup,
  iBeam,
  steel,
  yellow,
  rubber,
  black,
  red,
  branding,
}) {
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

  const standBadgeTex = makeStandBadgeTexture(branding.standMain, branding.standSub);
  const badgeMesh = decal(standFrame, standBadgeTex, 0.45, 0.135, [0, 0.27, frameZ + 1.2], [0, 0, 0], {
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

  return { stand, dyno, badge: badgeMesh.material };
}
