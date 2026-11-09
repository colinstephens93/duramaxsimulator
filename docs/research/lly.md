# 6.6 L Duramax LLY (RPO LLY): research sheet

Researched 2026-10-29. Source IDs (S01–S32) are defined in [sources.md](sources.md). Scope: production from mid-2004 to early 2006, VIN code 2.

**Status key.** *Agreed*: two or more sources of rank 1–3 give the same value. *Single*: one source. *Conflict*: sources disagree, and the chosen reading is in section 6. *Anecdotal*: forum or snippet only, never used as a value. *Null*: no source found.

## 1. Identity and scope

| Field | Value | Sources | Status | Confidence |
| --- | --- | --- | --- | --- |
| RPO and family | LLY; 6.6 L Duramax, "Duramax 6600" | S01, S02 | Agreed | High |
| Production | Mid-2004 to early 2006 | S04 ("2004.5 to early 2006"); S02 ("2004–2006") | Agreed | High |
| VIN code (8th digit) | 2 | S01, S02 | Agreed | High |
| Assembly | DMAX engine plant, Moraine, Ohio | S01, S02 | Agreed | High |
| Applications | Silverado and Sierra 2500HD/3500HD; Kodiak and TopKick (LRX, LRY, LPD options); Express and Savana (reduced output); Hummer H1 Alpha | S01, S02 | Agreed for the trucks; H1 years conflict (S02 table says 2004–2005, its text says 2006 only; S07 mixes both) | Medium |

## 2. Architecture and geometry

| Field | Value | Sources | Status | Confidence |
| --- | --- | --- | --- | --- |
| Configuration | 90° V8, overhead valve, cam-in-block, mechanical roller lifters, four valves per cylinder (32) | S01, S02 | Agreed | High |
| Displacement | 6,599 cc (402.62 cu in) | S01, S02; S07 gives 402.7 | Agreed | High |
| Bore | 103.00 mm (4.055 in) | S01, S02; S04 gives 4.06 in; S07 gives 4.06 in / 103 mm | Agreed | High |
| Stroke | 99.00 mm (3.897 in) | S01, S02; S04 gives 3.90 in; S07 gives 3.90 in / 99 mm | Agreed | High |
| Bore-to-stroke ratio | 1.04 (marginally oversquare) | S01, S02 | Agreed | High |
| Crank throw radius | 49.5 mm (half the stroke) | Derived from the stroke; S31 gives 1.949 in | Agreed | High |
| Compression ratio, 2004–2005 | 17.5:1 | S01, S02, S04, S07 | Agreed | High |
| Compression ratio, 2006 | 16.8:1 | S01, S02, S07 | Agreed | High |
| Rod length, centre to centre | 163.0 mm (6.417 in) | S13 and S14 (parts maker and trade press); the parts listings cover the 2001–2016 6.6 family and the LLY is among them. Other makers list 6.418 and 6.420 in | Agreed across makers | Medium–high |
| Rod mass | 1,155 g each | S04; S14 gives a figure for the family | Single | Medium |
| Firing order | 1-2-7-8-4-5-6-3 | S01, S02 | Agreed | High |
| Bank layout | Odd cylinders on the passenger (right) bank; even on the driver (left) bank | S01, S02 | Agreed | High |
| Block | Cast gray iron, deep skirt, induction-hardened | S01, S02 | Agreed | High |
| Heads | Cast aluminium alloy | S01, S02 | Agreed | High |
| Crankshaft | Nitrided forged steel; cast-iron main caps. The count of five is the app's design, not a sourced figure | S01, S02 | Agreed (material); count design | High (material) |
| Rods | Fracture-split forged alloy steel | S01, S02, S04 | Agreed | High |
| Camshaft drive | Half crank speed (four-stroke physics) | Physics; S25, S26 | Agreed | High |
| Valve lift | No published figure | None found | Null | — |
| Cam duration | No published figure | None found | Null | — |
| Valve-train counts (16 lifters, pushrods, rockers and bridges) | 16 of each | S31 and S32 (project notes and README). S02 confirms mechanical lifters and OHV, but not the counts | Design | Medium |

## 3. Fuel, injection, turbo and emissions

| Field | Value | Sources | Status | Confidence |
| --- | --- | --- | --- | --- |
| Injection system | Bosch high-pressure common rail, direct injection | S01, S02, S04 | Agreed | High |
| High-pressure pump | Bosch CP3 (CP3.3) | S01, S02; S20 | Agreed | High |
| Maximum injection pressure, 2004–2005 | 23,000 psi | S01, S02, S04 | Agreed | High |
| Maximum injection pressure, 2006 | 26,000 psi | S01, S02 | Agreed | High |
| Injectors: location | Bosch, externally serviceable, outside the valve cover; heads redesigned for them | S04 | Single | Medium |
| Injectors: type | **Conflict.** Solenoid: S04 (table: "Bosch solenoid"), S19, S20, S21. Piezoelectric: S01 and S02 (wording). Piezo is first named in the LML generation (S19, S21) | See section 6 | Conflict | Medium (solenoid favoured) |
| Nozzle holes, 2004–2005 | Not verified. S24 is a forum post that counts the stock tip at seven holes | None reliable | Anecdotal | — |
| Nozzle, 2006 | Revised seven-hole design | S02 (2006 notes) | Single | Medium |
| Turbocharger | Garrett GT3788VA, variable vane (VVT or VGT) | S01, S02, S04, S06 | Agreed | High |
| Compressor wheel | Inducer 62.8 mm; exducer 88 mm; 11 blades | S06 (table); S04 agrees on 62 mm and 11 blades; S31 repeats S06 | Single table, partly confirmed | Medium–high |
| Turbine wheel | Inducer 71.3 mm; exducer 65.7 mm; 13 blades | S06; S31 repeats S06 | Single | Medium |
| Vane height | 14.4 mm (S06). S04 says 15 mm | See section 6 | Conflict | Medium |
| Peak stock boost | 30 psi (S06). The project notes say 23 psi (S31). Forum reports run 12–31 psi (S23, anecdotal) | See section 6 | Conflict | Low |
| EGR | Cooled EGR valve with a cooler in the valley | S01, S02, S04 | Agreed | High |
| Oxidation catalyst | Diesel oxidation catalyst | S01, S02 | Agreed | High |
| Minimum cylinder pressure test | 300 psi | S01, S02 | Agreed | High |

## 4. Ratings, speeds and transmissions

| Field | Value | Sources | Status | Confidence |
| --- | --- | --- | --- | --- |
| Idle speed | About 680 rpm, warm | S01, S02 | Agreed | High |
| Governed speed | 3,250 rpm, electronically governed | S01, S02; S07 gives a 3,200 rpm redline | Agreed (S07 conflicts) | High |
| Peak torque rpm | 1,600 rpm | S01, S02 | Agreed | High |
| Peak power rpm | 3,000 rpm | S01, S02 | Agreed | High |
| Allison automatic, 2006: power | 310 hp at 3,000 rpm | S01, S02, S04 | Agreed | High |
| Allison automatic, 2006: torque | 605 lb-ft at 1,600 rpm | S01 (2006 automatic row), S02 (automatic, 2006 only), S04 ("early '06") | Agreed | High |
| ZF manual, 2004–2006: power | 300 hp at 3,000 rpm | S01, S02 | Agreed | High |
| ZF manual, 2004–2006: torque | 520 lb-ft at 1,600 rpm | S01, S02 | Agreed | High |
| Allison automatic, 2004.5–2005 | 310 hp at 3,000 rpm; 520 lb-ft at 1,600 rpm | S09, S10, S11, S12 (snippets, secondary). S01 gives no 2004–2005 automatic torque | Secondary | Medium. **Not in the app** (see section 9) |
| ZF transmission | Six-speed manual (ZF S6-650) | S01, S02 | Agreed | High |
| Allison 1000, 2004.5–2005 | Five-speed | S15 (parts maker), S16, and S04 (the five-speed that preceded the LBZ) | Agreed | Medium–high |
| Allison 1000, 2006 | Speed count unresolved: five or six | Six: S17, S18 (its excerpt is cut off). Five: S16. S05 says the LBZ was the first six-speed | Conflict | Low. **Drop the count from the label** |

## 5. Other fixed values

| Field | Value | Sources | Status | Confidence |
| --- | --- | --- | --- | --- |
| Oil capacity | 10 US quarts with filter change | S01, S02 | Agreed | High |
| Oil filter | ACDelco PF2232 | S01, S02 | Agreed | High |
| Engine weight | About 835 lb. Dry or wet is not stated | S01, S02 | Agreed | High (value); label approximate |
| Dimensions | About 30.0 × 30.0 × 32.0 in | S01, S02 | Agreed | High (approximate) |
| Glow plugs | One per cylinder (eight), traditional system | S01, S02 | Agreed | High |
| Glow plugs, 2006 | "Fast heat" plugs and an intake air heater | S02 (2006 notes) | Single | Medium |
| Fuel | No. 2 low-sulphur diesel preferred; No. 1 acceptable in cold weather; B5 maximum | S01, S02 | Agreed | High |
| Starter brand and gear | Brand, pinion teeth and ring-gear teeth not established | None usable (S30). One aftermarket listing says a nine-tooth starter fits 2001–2011 HD Duramax trucks | Null | — |

## 6. Conflicts and the reading chosen

| Field | Readings | Chosen | Reason | Entry treatment |
| --- | --- | --- | --- | --- |
| Rod length | App: 184 mm, which the README calls stylised (S32). Sources: 163.0 mm (S13, S14) | Record 163.0 mm as the research value | Parts makers agree on 6.417 in | **Keep 184 mm for the baseline** (Q7). Label it as a visual value that conflicts with the sources. A correction changes piston motion, so it is a separate, logged change |
| Injector type | Solenoid (S04, S19, S20, S21). Piezo (S01, S02) | Solenoid | Four independent secondary sources against GM-style wording, which DieselHub's copy shares | The copy keeps the brief's "piezoelectric" wording until you decide. Wording is not a value |
| Peak stock boost | 30 psi (S06 table). 23 psi (S31). Forum anecdotes 12–31 psi (S23) | Keep the app's 23 psi as a *design* value | No primary source; the project notes cite the S06 page but report 23 psi, which that page contradicts | Label "contested". Boost cap stays 23 for the baseline |
| Vane height | 14.4 mm (S06). 15 mm (S04) | 14.4 mm | Table value over text | Use 14.4 mm |
| Redline | 3,250 rpm (S01, S02). 3,200 rpm (S07) | 3,250 rpm | Two GM-style sheets over one encyclopedia table | Keep 3,250 |
| Allison 2006 speed count | Five (S16, S04's implication). Six (S17, S18, possibly S05) | Unresolved | No build sheet found | Drop the count from the label. This is a copy change |
| H1 application years | 2004–2005 (S02 table). 2006 only (S02 text, S07) | Unresolved | Not used in the app | Omit the years |
| LLY torque in the encyclopedia | S07's LLY row gives 605 lb-ft for the whole LLY range. S01 and S02 give 520 lb-ft for the manual and 605 lb-ft for the 2006 automatic only | S01 and S02 | S07 contradicts its own text and the GM-style sheets | Not used from S07 |
| Allison 2004.5–2005 torque | 520 lb-ft (S09–S12, secondary). Not in S01 or S02 | 520 lb-ft, medium confidence | Several secondary sources agree | Record as a candidate calibration. **Not added in this refactor** (Q7) |

## 7. Gaps (null)

- Valve lift and cam duration. The app's 10.9 mm and 10.4 mm lift values are design estimates and must be labelled that way.
- Nozzle hole count for 2004–2005.
- Factory stock boost. No primary source found.
- Starter brand, pinion teeth and ring-gear teeth.
- Dry and wet weight.
- Cylinder spacing (bore centre distance). Not in any source.
- Injector type from a service or parts catalogue. GMAuthority pages were not accessible (S30), and the GM ratings thread redirected to a page that returned 402 (S30).

## 8. Copy claims in the app that the sources do not support

These are for the Phase 6 correction list. They stay in place until then. A correction changes visible text, so the baseline is re-captured after it.

| Claim | Status | Recommendation |
| --- | --- | --- |
| "Piezoelectric fuel injectors" (LLY) | Conflict (section 6) | Your call; the research favours solenoid |
| "Denso gear-reduction starter", "10-tooth pinion", "166-tooth ring gear" | Unsourced (S30) | Remove, or mark as illustrative |
| "11 V nominal" glow-plug supply | Unsourced | Remove, or mark as illustrative |
| "Pilot / main / post injection" | Unsourced | Mark as illustrative |
| "7-hole micro-sac" nozzle | Seven holes supported for 2006 (S02, S05); 2004–2005 unsourced | Qualify as 2006 |
| "Bosch CP3 1:1" drive ratio | Unsourced. The 2:1 cam ratio is four-stroke physics | Keep the 2:1 cam ratio; mark the CP3 ratio as unsourced |
| "M14 magnetic drain plug"; "cast aluminium oil pan" | Unsourced | Remove, or mark as illustrative |
| "Allison 1000 6-Spd Auto" label | Speed count unresolved (section 4) | Change to "Allison 1000 automatic" |
| "ZF S6-650 6-Spd Manual"; "Garrett GT3788VA VVT"; "CP3.3, 23,000 psi (2004–2005)"; "10 US qt" | Supported | Keep |

## 9. Proposed entry values (LLY)

Values as the entry should carry them. Each value needs its source IDs in `provenance`.

The labels below are the Phase 6 labels. Phases 1 to 5 keep the app's current labels (plan section 3; runbook package 1.1).

```
identity:     name '6.6L Duramax (RPO LLY)', shortName 'LLY 6600', years '2004.5–2006 (VIN code 2)', accuracy 'rated-peaks'   [S01, S02, S04]
geometry:     boreMm 103.00 [S01, S02]; strokeMm 99.00 [S01, S02]; crankRadiusMm 49.5 [derived]
              rodLengthMm 184 [baseline; conflict: 163.0 per S13, S14]; envelopeIn [30.0, 30.0, 32.0] [S01, S02]; massLb 835 [approx; S01, S02]
compression:  17.5 (2004–2005); 16.8 (2006) [S01, S02]
ratings:      idleRpm 680; redlineRpm 3250; peakTorqueRpm 1600; peakPowerRpm 3000 [S01, S02]
calibrations:
  allison:    label 'Allison 1000 automatic'; modelYears '2006'; peakTorqueLbFt 605 at 1600; peakHp 310 at 3000;
              maxRailPsi 26000; compressionRatio '16.8:1 (2006)'                                                       [S01, S02, S04]
  zf:         label 'ZF S6-650 6-speed manual'; modelYears torque '2004.5–2006', pressure and compression '2004.5–2005';
              peakTorqueLbFt 520 at 1600; peakHp 300 at 3000; maxRailPsi 23000; compressionRatio '17.5:1 (2004.5–2005)' [S01, S02]
injection:    pump 'Bosch CP3 (CP3.3)'; injectors 'Bosch; type disputed, research favours solenoid'                   [S01, S02, S04, S19–S21]
turbo:        'Garrett GT3788VA VVT'; compressorInducerMm 62.8; compressorExducerMm 88; compressorBlades 11;
              turbineInducerMm 71.3; turbineExducerMm 65.7; turbineBlades 13; vaneHeightMm 14.4 [S06];
              boostPeakPsi 23 [design; contested, S06 says 30]
features:     egr true; oxidationCatalyst true; glowPlugs 8; intakeAirHeater '2006 only' [S01, S02]
oil:          capacityUsQt 10; filter 'ACDelco PF2232' [S01, S02]
valvetrain:   valvesPerCylinder 4; valveLiftMm and durationDeg: design estimates (labelled), no source
```
