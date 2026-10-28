Build a stunning, highly realistic, fully interactive 3D simulation of a **6.6L Duramax LLY 90-degree V8 turbodiesel engine (Duramax 6600, RPO Code LLY) mounted on an industrial engine test stand**.
Use Three.js and WebGL. Deliver a complete, runnable browser application.

**THE OBJECT**
A large, exceptionally detailed **6.6L (6,599 cc / 402.62 CID) Duramax LLY V8 diesel engine** positioned in the center of a clean, realistic engineering workshop (modeled after the DMAX Moraine, Ohio test cells).
The engine must accurately reflect the LLY architecture and specifications:
- **Block & Bank Geometry:** Exactly 8 cylinders arranged in a **90-degree V8** configuration across a deep-skirt, induction-hardened **cast gray iron engine block** with cast iron main bearing caps. Overall engine envelope proportions of approximately **30.0 in (L) × 30.0 in (W) × 32.0 in (H)** (~835 lbs scale mass).
- **Cylinder Layout:**
  - **Passenger-side (Right) Bank:** Cylinders **1, 3, 5, and 7** (front to rear).
  - **Driver-side (Left) Bank:** Cylinders **2, 4, 6, and 8** (front to rear).
- **Bore & Stroke Proportions:** Marginally oversquare **1.04:1 bore-to-stroke ratio** featuring a **4.055-inch (103.00 mm) bore** and **3.897-inch (99.00 mm) stroke** (17.5:1 / 16.8:1 compression bowl-in-piston diesel crowns).
- **Reciprocating & Rotating Assembly:** Visible pistons, **fracture-split forged alloy steel connecting rods**, **nitrided forged steel crankshaft**, and a single central **forged steel cam-in-block camshaft**.
- **32-Valve OHV Valvetrain:** **Cast aluminum alloy cylinder heads** configured with **4 valves per cylinder (32 valves total)** driven by an **Overhead Valve (OHV) cam-in-block system** with visible **mechanical roller lifters, pushrods, rocker arms, and valve bridges**.
- **Fuel, Air & Emissions Systems:**
  - **Bosch High-Pressure Common Rail (HPCR) Direct Injection:** Valley-mounted **Bosch CP3 (CP3.3) injection pump**, high-pressure fuel rails, and **8 piezoelectric fuel injectors** (23,000–26,000 psi system), plus **8 traditional glow plugs** (1 per cylinder).
  - **Turbocharging:** Valley/rear-mounted water-cooled **Garrett GT3788VA Variable Vane Turbocharger (VVT)** with turbine/compressor housings, up-pipes, and air-to-air intercooler charge piping.
  - **Emissions & Lubrication Hardware:** **Exhaust Gas Recirculation (EGR)** valve and cooler assembly, cast exhaust manifolds, oil pan (10-quart capacity), and spin-on **ACDelco PF2232 lube oil filter**.
- **Materials & Surface Finish:** Realistic physically based materials distinguishing cast gray iron (block, main caps, exhaust manifolds), cast aluminum alloy (cylinder heads, intake plumbing, compressor housing, pistons), nitrided/forged steel (crankshaft, camshaft, fractured-cap connecting rods), rubber hoses, copper/braided fuel lines, and machined fasteners.

**REAL MECHANICAL ANIMATION**
The engine must actually function as a synchronized, kinematically accurate mechanical simulation:
- **True LLY Firing Order (`1-2-7-8-4-5-6-3`):** All 8 cylinders must cycle through their four-stroke diesel sequence (Intake, Compression, Direct-Injection Power, Exhaust) strictly following the **1-2-7-8-4-5-6-3** firing order across 720° of crankshaft rotation.
- **Exact Crank-Slider Kinematics:** All 8 pistons reciprocate with authentic crank-rod geometry matching the **103.00 mm bore and 99.00 mm stroke** (49.5 mm crank throw), with connecting rods remaining mechanically locked to both piston wrist pins and crankshaft journals.
- **Synchronized OHV Valvetrain:** The central in-block camshaft rotates at exactly **half the crankshaft speed (0.5×)**, driving the mechanical roller lifters, pushrods, and rocker arms to open and close the **32 intake and exhaust valves** (4 per cylinder) in phase with the `1-2-7-8-4-5-6-3` firing order.
- **Turbocharger & Injection Visuals:** Rotate the **Garrett GT3788VA** turbine/compressor wheel dynamically based on engine RPM and exhaust pulse frequency, with subtle visual indicators for high-pressure common rail piezoelectric injection events and compression ignition at TDC.
- **Authentic LLY RPM Range & Presets:**
  - Interactive RPM slider from **0 to 3,250 RPM** (matching the LLY's electronically governed maximum speed).
  - Quick-select preset buttons or detents for key LLY operating points:
    - **Stop:** `0 RPM`
    - **Warm Idle:** `680 RPM`
    - **Peak Torque:** `1,600 RPM` (`605 lb-ft` w/ Allison 1000 automatic / `520 lb-ft` w/ ZF S6-650 manual)
    - **Peak Horsepower:** `3,000 RPM` (`310 hp` w/ Allison 1000 automatic / `300 hp` w/ ZF S6-650 manual)
    - **Governed Redline:** `3,250 RPM`
- Smoothly damp and animate transitions in engine speed, and provide a **Slow-Motion Mode** to inspect the OHV pushrod valvetrain, crank throws, and `1-2-7-8-4-5-6-3` firing sequence in detail.

**3D EXPLORATION**
- **WASD + Mouse** for first-person walking around the test cell.
- **Mouse Orbit Mode** for inspecting the engine from any angle.
- Smooth zoom and damped camera movement.
- Realistic perspective and true-to-scale dimensions (`30" × 30" × 32"` engine envelope on a heavy-duty industrial dyno/test stand).
- Allow walking around the entire engine and inspecting internal and external assemblies closely.

**INTERACTIVE FEATURES**
- **START / STOP** — Start and stop engine operation (with realistic ramp-up to the `680 RPM` warm idle speed).
- **RPM CONTROL & DYNO READOUT** — Control engine speed (`0 – 3,250 RPM`) with live telemetry showing real-time RPM, estimated Torque (`lb-ft`), Horsepower (`hp`), Bosch CP3 rail pressure (`psi`, up to `26,000 psi`), and Garrett GT3788VA boost/vane position.
- **CUTAWAY MODE** — Reveal the moving internal mechanism (crankshaft, cam-in-block, roller lifters, pushrods, pistons, and 32 valves) by making the cast gray iron block, aluminum cylinder heads, and covers semi-transparent.
- **EXPLODED VIEW** — Smoothly separate major LLY assemblies along logical mechanical axes (Garrett GT3788VA turbo & up-pipes, EGR cooler & intake manifold, Bosch CP3.3 pump & common rails, valve covers, 32-valve aluminum cylinder heads, pushrods/lifters, cast iron block, piston/rod assemblies, nitrided crankshaft, main bearing caps, oil pan, and ACDelco PF2232 oil filter).
- **ASSEMBLE** — Smoothly restore every component to its exact assembled position.
- **PART INSPECTION** — Click any major component to highlight it and display an engineering spec card with its authentic LLY name, material, and technical specifications (e.g., cylinder bank numbering `1-3-5-7` vs `2-4-6-8`, bore/stroke, material grade, or Bosch/Garrett component details).
- **RESET CAMERA** — Restore the default viewing angle.

**VISUAL QUALITY**
Create a beautiful industrial visualization with:
- Physically based materials (cast gray iron, machined aluminum alloy, nitrided steel, anodized fittings, rubber, and heat-tinted exhaust alloys).
- High-quality reflections, ambient occlusion, and contact shadows.
- Realistic workshop and dyno test-cell lighting.
- Detailed procedural geometry with beveled edges, cooling fins, bolt bosses, and casting ribs.
- Smooth animation and cinematic presentation.
- A minimal, professional automotive engineering control & telemetry interface.
The engine must be actual interactive 3D geometry, not a flat image, video, or rotating fake model.

**ENGINEERING AND CODE REQUIREMENTS**
- Implement the geometry and mechanical relationships programmatically.
- Do not depend on downloading a prebuilt complete engine model.
- Ensure the valvetrain is built as a true **cam-in-block OHV pushrod 32-valve system** (not an overhead cam system) and cylinders fire in `1-2-7-8-4-5-6-3` order with `1, 3, 5, 7` on the right (passenger) bank and `2, 4, 6, 8` on the left (driver) bank.
- All controls must function.
- All animated parts must stay correctly connected at all RPMs and during Cutaway/Exploded states.
- No placeholder interactions, fake loading screens, or unfinished features.
- Optimize performance for desktop browsers (60 FPS target).
- Provide all necessary files and instructions to run the project locally.

**IMPORTANT**
This is a benchmark of your ability to independently design, implement and deliver a sophisticated 3D mechanical simulation.
Do not provide a tutorial or implementation plan instead of the application. Make reasonable decisions autonomously.
Prioritize visual quality, LLY mechanical accuracy, functional interactions, and stability equally. Deliver the best working implementation you can.
