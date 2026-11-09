# Research: engine values for the library

Researched 2026-10-29. This folder is the authority for every engine value in the library. The build reads these sheets, records where each value came from, and does not research values again.

## What is here

- [sources.md](sources.md): the source register. It has source IDs (S01–S32) and says how each source was accessed.
- [lly.md](lly.md): LLY values, conflicts and the reading chosen for each, gaps, copy claims that the sources do not support, and proposed entry values.
- [lbz.md](lbz.md): the same for the LBZ.
- [inline6.md](inline6.md): sourced reference values and design values for the fictional inline-six entry.

## How the research was done

- Web search (standard and extended) and page reads on 2026-10-29. Some pages were blocked (HTTP 402 or 403), and one PDF could not be read. Those are recorded as S30.
- GM's own service information could not be accessed. GM-style spec-sheet wording reaches us through the project's spec sheet (S01) and through DieselHub (S02, S03), which copies that wording. Agreement between S01, S02 and S03 is therefore weaker than agreement across independent sources.
- Source ranking, strongest first:
  1. GM-style spec-sheet wording (S01, S02, S03).
  2. Technical articles that name their sources (S04, S05).
  3. Parts-seller and enthusiast tables (S06, S08, and the snippets S09–S18).
  4. The encyclopedia (S07). It contradicts itself in places.
  5. Forums and snippets (S22–S24, and the boost posts in S23). These are anecdotal and never the only source for a value.
- Values that two or more sources of rank 1–3 agree on are used. Single-source values are used with medium or low confidence, and the sheet says so. Conflicts are recorded with the reading chosen and the reason. Anything not found is `null`.

## Decisions that followed from the research

No sign-off is needed for these. They were decided from the evidence.

1. **LLY calibrations.** The Allison row is the 2006 automatic: 605 lb-ft, 26,000 psi, 16.8:1. The ZF row is the 2004.5–2005 manual for pressure and compression, and 2004.5–2006 for torque. Each row carries its model years. The 2004.5–2005 Allison (520 lb-ft) is recorded as a candidate calibration and is not added in this refactor (Q7).
2. **LBZ redline** is 3,250 rpm. Two sources agree, against one.
3. **LBZ calibrations** are Silverado and Sierra HD (360 hp, 650 lb-ft) and Kodiak and TopKick LPD (310 hp, 605 lb-ft).
4. **LLY rod length** stays at 184 mm for the baseline (Q7). The research value is 163.0 mm. Correcting it changes piston motion, so it is a separate, logged change.
5. **Injector type** is solenoid by the research. The LLY copy keeps the brief's "piezoelectric" wording until you decide. That is a wording decision, not a value.
6. **Stock boost** is labelled `contested`. The LLY cap stays at 23 psi as a design value. The LBZ value comes from one table and is also labelled `contested`.
7. **Allison speed count** is removed from the LLY label. This is a copy correction for Phase 6.
8. **Unsupported copy claims** are listed in [lly.md](lly.md) section 8. They are corrected in Phase 6, followed by a baseline re-capture.

## Provenance rules for the build

- Every numeric value in an entry has a provenance record. The record gives the source IDs and the status and confidence from the sheet.
- A value with no provenance record is a build error. A `null` is allowed only where the sheet lists that value as a gap.
- Design values carry the label `design` and no source. These are the inline-six design values, the valve lift and duration estimates, and the test-cell values.

## Accuracy labels used by entries

- `rated-peaks`: the rated peaks are tested. The curves are illustrative.
- `design`: our value, not sourced.
- `contested`: the sources disagree. The baseline value is kept, and the label says so.
- `sourced` and `derived`: the inline-six entry's reference values and arithmetic ([inline6.md](inline6.md) section 4). The LLY and LBZ sheets use the status key at the top of each sheet instead.
