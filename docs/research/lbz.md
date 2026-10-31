# 6.6 L Duramax LBZ (RPO LBZ): research sheet

Researched 2026-10-29. Source IDs are defined in [sources.md](sources.md). Scope: production 2006–2007, VIN code D. Status key and confidence levels are the same as in [lly.md](lly.md).

## 1. Identity and scope

| Field | Value | Sources | Status | Confidence |
| --- | --- | --- | --- | --- |
| RPO and family | LBZ; 6.6 L Duramax | S02, S03, S05 | Agreed | High |
| VIN code (8th digit) | D | S02 (LBZ notes), S03 | Agreed (same publisher, two pages) | Medium–high |
| Production | 2006–2007 | S03, S05, S08 | Agreed | High |
| Applications | Silverado and Sierra 2500HD/3500HD (2006–2007); Kodiak and TopKick, LPD option (2006–2007) | S03, S07, S08 | Agreed | Medium–high |
| Express and Savana, 2500 and 3500 | Listed with reduced output | S03 only | Single | Medium (not used in the app) |

## 2. Architecture and geometry

| Field | Value | Sources | Status | Confidence |
| --- | --- | --- | --- | --- |
| Configuration | 90° V8, OHV, cam-in-block, four valves per cylinder (32) | S03, S05 | Agreed | High |
| Displacement | 6.6 L, 6,599 cc | S03, S07 | Agreed | High |
| Bore | 103.00 mm (4.055 in) | S03; S05 gives 4.06 in | Agreed | High |
| Stroke | 99.00 mm (3.897 in) | S03; S05 gives 3.90 in | Agreed | High |
| Bore-to-stroke ratio | 1.04 | S03 | Single (derived) | High |
| Compression ratio | 16.8:1 | S03, S05 (author, "16.8 vs 17.5"), S07 (LBZ row), S08 | Agreed | High |
| Firing order | 1-2-7-8-4-5-6-3 | S03 | Single (matches the LLY, S01 and S02) | Medium–high |
| Rods | Fracture-split forged alloy steel | S03 | Single | High (type) |
| Rod change, 2006 | Thicker I-beam cross-section | S02 (2006 notes, on the LLY page) | Single | Medium |
| Rod mass | 1,173 g each, against 1,155 g for the LLY | S05 (author) | Single, author | Low |
| Rod length, centre to centre | 163.0 mm (6.417 in), taken from the 6.6 family listings | S13, S14 (the LLY sheet has the same source) | Agreed across makers; LBZ not isolated | Medium |
| Valve lift and cam duration | No published figure | None found | Null | — |
| Mass and envelope | About 835 lb; about 30 × 30 × 32 in. Dry or wet not stated | S03 (same wording as the LLY) | Single | Medium |

## 3. Fuel, injection, turbo and emissions

| Field | Value | Sources | Status | Confidence |
| --- | --- | --- | --- | --- |
| Injection system | Bosch high-pressure common rail, direct injection | S03, S05 | Agreed | High |
| High-pressure pump | Bosch CP3 (CP3.3); S05 (author) says a higher-pressure variant | S03, S05 | Agreed (pump); variant single | High; medium for the variant |
| Maximum injection pressure | 26,000 psi | S03, S05 (author), S06 ("26,000 psi Bosch rail"), S07 ("more than 26,000 psi") | Agreed | High |
| Injectors: type | **Conflict.** Piezo: S03 ("Piezoelectric fuel injectors (7 hole)"). Solenoid: S05 (author, "still of a solenoid-style design"), S19, S20, S21 | See section 6 | Conflict | Medium (solenoid favoured) |
| Nozzle | Revised seven-hole design | S03, S05, S07 | Agreed | Medium–high |
| Injector body | Changed from the LLY, so the two do not interchange | S05 (author); S21 (snippet) | Single | Medium–low |
| Glow plugs | Traditional system, one per cylinder | S03 | Single | Medium |
| EGR | Present, with a larger cooler | S03 (EGR listed); S02 (larger cooler, 2006 notes) | Agreed (presence); single (cooler size) | High (presence); medium (size) |
| Intake air heater | Added for 2006 | S02 (2006 notes) | Single | Medium |
| Turbocharger | Garrett GT3788VA, variable vane | S03, S05, S06, S07, S08 | Agreed | High |
| Compressor wheel | Inducer 60.5 mm; exducer 87.9 mm; 11 blades | S06 (table) | Single | Medium |
| Turbine wheel | Inducer 72.2 mm; exducer 63.2 mm; 13 blades | S06 (table) | Single | Medium |
| Vane height | 12.63 mm | S06 (table) | Single | Medium |
| Stock boost, peak | 30 psi (S06). Forum posts report about 17–20 psi (S23, anecdotal) | See section 6 | Conflict | Low. **Label "contested"** |

## 4. Ratings, speeds and transmissions

| Field | Value | Sources | Status | Confidence |
| --- | --- | --- | --- | --- |
| Silverado and Sierra HD, power | 360 hp at 3,200 rpm | S03, S05, S07 (spec block), S08 | Agreed | High |
| Silverado and Sierra HD, torque | 650 lb-ft at 1,600 rpm | S03, S05, S07 (spec block), S08. S07's LBZ table row says 605 lb-ft, which conflicts with its own text | Agreed (S07 conflicts internally) | High |
| Kodiak and TopKick, LPD option: power | 310 hp at 3,000 rpm | S03, S07 | Agreed | Medium–high |
| Kodiak and TopKick, LPD option: torque | 605 lb-ft at 1,600 rpm | S03, S07 | Agreed | Medium–high |
| Express and Savana: power and torque | 250 hp at 2,500 rpm; 460 lb-ft at 1,600 rpm; 4L85E four-speed automatic | S03 only | Single | Medium (not used in the app) |
| Manual transmission ratings | Not given for the LBZ | S03 and S08 give no LBZ manual ratings | Null | — |
| Manual transmission years | Conflict. S03: ZF S6-650, 2006 only. S08: the 2007 LBZ was the last Duramax able to take a manual | Unresolved | Conflict | Low |
| Redline or maximum speed | 3,250 rpm (S08, "Max RPM"). S03 says 3,400–3,450 rpm, electronically governed. A search snippet quotes GMAuthority at 3,250 (S30) | See section 6 | Conflict | Medium (3,250 chosen) |
| Idle speed | About 680 rpm, warm | S03 | Single | Medium |
| Automatic transmission | Allison 1000, six-speed | S03, S05 ("the first Duramax to be coupled to the six-speed Allison 1000") | Agreed | Medium–high |
| Automatic transmission, parts listing | Five-speed (S16) | S16 | Single (parts listing) | Low (conflicts with S03, S05) |

## 5. Differences from the LLY

| Item | LLY | LBZ | Sources | Confidence |
| --- | --- | --- | --- | --- |
| Compression ratio | 17.5:1 (2004–2005); 16.8:1 (2006) | 16.8:1 | S01, S02, S03 | High |
| Maximum injection pressure | 23,000 psi (2004–2005); 26,000 psi (2006) | 26,000 psi | S01, S02, S03, S05 | High |
| Power, top rating | 310 hp at 3,000 rpm (Allison, 2006) | 360 hp at 3,200 rpm (Silverado HD) | S02, S03, S05 | High |
| Torque, top rating | 605 lb-ft at 1,600 rpm (Allison, 2006) | 650 lb-ft at 1,600 rpm (Silverado HD) | S02, S03, S05 | High |
| Turbocharger model | GT3788VA | GT3788VA | S03, S06 | High |
| Turbocharger geometry | 62.8 mm and 88 mm; 71.3 mm and 65.7 mm; vane 14.4 mm | 60.5 mm and 87.9 mm; 72.2 mm and 63.2 mm; vane 12.63 mm | S06 | Medium |
| Injector nozzle | Not established (see the LLY sheet) | Revised seven-hole | S03, S05 | Medium–high |
| Connecting rods | Standard | Thicker I-beam, 2006 | S02 | Medium |
| Pistons | Not in the sources | Author says the LBZ pistons were the weak point. Not used | S05 (author) | Low |

## 6. Conflicts and the reading chosen

| Field | Readings | Chosen | Reason | Entry treatment |
| --- | --- | --- | --- | --- |
| Injector type | Piezo (S03). Solenoid (S05, S19, S20, S21) | Solenoid | Four sources against one, and the piezo wording repeats DieselHub's LLY text | Record the disagreement. Copy follows the same rule as the LLY |
| Maximum speed | 3,250 rpm (S08; S30 snippet). 3,400–3,450 rpm (S03) | 3,250 rpm | Two sources, and the S03 range may be copied from a different engine (S07 shows 3,450 for the LB7). A reading of 3,250 keeps the slider range unchanged | Entry redline 3,250 |
| Stock boost | 30 psi (S06). Forum posts about 17–20 psi (S23) | Unresolved | No primary source | Label "contested"; use 30 psi as the cap, marked as S06 |
| Manual transmission years | 2006 only (S03). Through 2007 (S08) | Unresolved | No manual ratings exist for the LBZ in the sources | No manual calibration in the entry |
| Torque, top rating | 650 lb-ft (S03, S05, S08, and S07's spec block). 605 lb-ft (S07's table row) | 650 lb-ft | Three sources agree | Use 650 lb-ft |

## 7. Gaps (null)

- Valve lift and cam duration.
- LBZ-specific rod length. The 163.0 mm figure comes from the 6.6 family listings.
- LBZ manual-transmission ratings.
- Factory stock boost. The 30 psi figure rests on one table (S06).
- Turbine and compressor geometry from a primary source. S06 is the only one.
- Dry and wet weight.
- Injector nozzle hole count from a primary source (seven is widely reported; S03, S05, S07 agree).

## 8. Proposed entry values (LBZ)

```
identity:     name '6.6L Duramax (RPO LBZ)', shortName 'LBZ 6600', years '2006–2007 (VIN code D)', accuracy 'rated-peaks'   [S02, S03, S05, S08]
geometry:     boreMm 103.00 [S03, S05]; strokeMm 99.00 [S03, S05]; crankRadiusMm 49.5 [derived]
              rodLengthMm 163.0 [family listings S13, S14; medium]; envelopeIn [30.0, 30.0, 32.0] [approx; S03]; massLb 835 [approx; S03]
compression:  16.8 [S03, S05, S07, S08]
ratings:      idleRpm 680 [S03, medium]; redlineRpm 3250 [S08; conflict with S03]; peakTorqueRpm 1600 [S03, S05, S08]
calibrations:
  allison:    label 'Allison 1000 automatic (Silverado and Sierra HD)'; modelYears '2006–2007';
              peakTorqueLbFt 650 at 1600; peakHp 360 at 3200; maxRailPsi 26000; compressionRatio '16.8:1'   [S03, S05, S07, S08]
  kodiak:     label 'Allison 1000 automatic (Kodiak and TopKick, LPD option)'; modelYears '2006–2007';
              peakTorqueLbFt 605 at 1600; peakHp 310 at 3000; maxRailPsi 26000 [engine-level; the LPD pressure is not stated]   [S03, S07]
injection:    pump 'Bosch CP3 (CP3.3)'; injectors 'Bosch; type disputed, research favours solenoid'; nozzle 'revised seven-hole'   [S03, S05, S07]
turbo:        'Garrett GT3788VA VVT'; compressorInducerMm 60.5; compressorExducerMm 87.9; compressorBlades 11;
              turbineInducerMm 72.2; turbineExducerMm 63.2; turbineBlades 13; vaneHeightMm 12.63 [S06, single];
              boostPeakPsi 30 [S06; contested]
features:     egr true; glowPlugs 8; intakeAirHeater true [S02, S03]
oil:          capacityUsQt 10 [S02]; filter 'ACDelco PF2232' [S02 wording; applies to both]
```

Two calibrations are enough for the app. The Express and Savana ratings and the LBZ manual are not used, and their gaps are recorded above.
