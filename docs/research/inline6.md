# Inline-six: reference values and design values (fictional 4.0 L entry)

Researched 2026-10-29. Source IDs are defined in [sources.md](sources.md).

The fictional entry proves that the engine seam works (Q54). It is not a real engine. Each value below is either **sourced** (a reference value), **derived** (arithmetic or layout logic), or **design** (our choice, not sourced). Design values are labelled `design` in the entry. None of them is presented as an OEM figure.

## 1. Firing order and crank phasing

| Item | Value | Sources | Status | Confidence |
| --- | --- | --- | --- | --- |
| Firing interval | 120° of crank rotation between firings (six cylinders over 720°) | S25 (kfz-tech.de: 120° ignition spacing); S26 (topic page: 120° between firings) | Agreed | High |
| Firing order used | 1-5-3-6-2-4 | S25 ("dominates in practice"); S26 (example) | Agreed | High |
| Alternative order | 1-4-2-6-3-5 | S26 | Single | Noted, not used |
| Crank-pin pairs | 1 and 6 at 0°; 2 and 5 at 120°; 3 and 4 at 240° | Derived from the firing order: pistons that fire 360° apart share a pin | Derived | High |

## 2. Reference geometry (for plausibility only)

The AMC/Jeep 242 (4.0 L) inline six is the reference engine. It is a real engine, and this entry does not copy it.

| Item | Value | Sources | Status | Confidence |
| --- | --- | --- | --- | --- |
| Bore | 98.4 mm (3.875 in) | S27, S28, S29 | Agreed | High |
| Stroke | 86.7 mm (3.414 in). Alternative: 87.4 mm (3.44 in) | 86.7: S27, S28, S29. 87.4: S28 table, S29 (1994 entry) | Conflict | Medium |
| Displacement | 242 cu in, about 3.96 L | S27, S28 (and 98.4 × 86.7 mm arithmetic) | Agreed | High |

## 3. Design values (ours, not sourced)

| Field | Value | Basis | Entry label |
| --- | --- | --- | --- |
| Bore | 96.0 mm | Chosen so that the engine reads as a 4.0 L six | design |
| Stroke | 92.0 mm | As above. Gives 3.99 L (6 × π/4 × 96² × 92 mm³ ≈ 3,995 cc) | design |
| Crank radius | 46.0 mm | Half the stroke | derived |
| Rod length | 160 mm | Rod-to-radius ratio about 3.5 | design |
| Compression ratio | 10.0:1 | Spark-ignition engine | design |
| Valve train | Overhead valves with pushrods; two intake and two exhaust valves per cylinder | Matches the plan's OHV-only rule for this entry | design |
| Valve lift | 9.0 mm intake; 8.5 mm exhaust | Estimate | design (estimate) |
| Valve duration | 230° intake; 224° exhaust | Estimate | design (estimate) |
| Idle speed | 750 rpm | Typical for a small spark engine | design |
| Redline | 6,000 rpm | Typical for a small spark engine | design |
| Peak torque | 240 lb-ft at 3,500 rpm | Design curve | design |
| Peak power | 190 hp at 5,500 rpm | Design curve | design |
| Ignition and fuel | Spark ignition; port fuel injection | Keeps the features different from the LLY | design |
| Features absent | No CP3 pump, no glow plugs, no EGR, no variable-vane turbo | Tests the feature flags | design |
| Start sequence | Crank at 250 rpm for 0.6 s, then fuel and spark on, idle at 750 rpm by 1.5 s | Tests the per-engine start sequence | design |
| Audio pulses | Cylinders ÷ 2 per revolution (three per revolution). No bank cadence | Four-stroke rule (derived) | derived |

## 4. What the entry must say

- Every value above carries its label (`sourced`, `derived`, or `design`).
- The entry's name, description and disclaimer state that the engine is fictional and that its values are design values.
- The entry must not use any manufacturer name (Q55).
