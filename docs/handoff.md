# Handoff: engine library

Last updated: 2026-11-08 (America/New_York). The human confirmed the Windows picker fix, accepted the final build and requested push/merge. Implementation and all release checks pass. Accepted source commit: `f572cbd`; this release documentation records the gate and authorized integration into `master` on the existing `origin`. Git branch/tag history records the resulting merge/publication IDs. No environment publication is requested.

## 1. Where things stand

- Checkout: `/workspace/duramaxsimulator`, Bash/Node 24, source checkout initially on local `work`; release branches are `engine-library` and `master`. Preserve every documented uncommitted change; do not reset or reapply old edit scripts.
- Prior code checkpoint: `e13290b`, previous documentation HEAD `910f643`. Accepted MVP source commit: `f572cbd`. Original phase-0/1/2 tags remain; the final gate is marked by `phase-6-done`.
- Production engines: LLY and LBZ. Synthetic `lly-copy` is registered only in Vite test mode and absent from production. Both real engines have separate lazy entry/copy chunks.
- Runtime switching, live QA/current bindings, shared cell/audio retention, owned model/stand disposal and prop collision are implemented. The sole QA hook is `window.__ENGINE__`.
- Eighteen unused tracked archive files and `src/engines/active.js` are deliberately deleted. Numeric fixture change is exactly one corrected calibration-label string; no measured LLY value changed.

## 2. Phase status

| Phase | Status |
| --- | --- |
| 0–2 | Previously gated and tagged; not reopened. |
| 3 | Runtime switching/disposal/prop collision complete; automated cloud checks pass. |
| 4 | LBZ entry/provenance/copy/registration complete; automated checks pass. |
| 5 | Inline-six remains outside the MVP. |
| 6 | Copy corrections, sole QA hook, docs, archive removal, dist checks, chair move and pointer-lock handling implemented; independent cloud reference comparison passes. |

Final human acceptance is now explicit. Windows automated baseline/FPS evidence and the picker retest were supplied earlier; the human accepts the remaining release review. This does not invent individual checklist observations. The requested release actions are authorized; no environment publication is requested.

## 3. Current verification

Picker patch verification: 247 Node tests/check/build/dist pass; new focused real-click browser test and built preview LLY→LBZ→LLY pass. .qa/cloud/run-1794177768250-15817/comparison.json: exact traces/geometry, six views 0 differing pixels. Existing cloud and Windows baselines were not refreshed.

Windows follow-up (user-supplied terminal log, 2026-11-08): 247 tests, all checks/build/dist and four browser modules pass on Chrome 157.0.8103.39 / Intel Arc 140V / Direct3D11. Original Windows baseline capture and independent comparison pass, all six views 0 differing pixels. FPS samples average 59.9893 (range 59.8623–60.1222). A manual mouse click exposed the picker overlay hit-testing bug; follow-up CSS fix/new real-click regression passes in development and built production preview, with unchanged six-view cloud regression. The human subsequently confirmed the patched selector works on Windows and accepted the build for push/merge. The Windows baseline files remain on the user’s machine; they were not imported into this cloud checkout.

- `npm test`: 247 tests, 39 suites, 247 pass, zero failures/cancellations/skips.
- `npm run check`: all five PASS; LLY 229 values/65 records/0 missing, LBZ 229/46/0.
- `npm run build` and `npm run check:dist`: PASS; separate lazy entry chunks, no synthetic fixture; existing size warning remains.
- Original full browser report `.qa/browser/run-1794175989080.json`: four modules passed. Final release suite also includes the real-click picker regression: all five modules pass with zero console/page errors. Covers twelve measured prop envelopes, both real engines, calibration/start/presets, pointer-lock rejections at both call sites, and twenty swaps after warm-up with stable 617 geometries/91 textures.
- Pre-hardening LLY cloud regression `.qa/cloud/run-1794175217556-7888/comparison.json`: exact traces/geometry and six zero-difference views.
- Phase-6 numeric re-capture: exactly `constants.CALIBRATIONS.allison.label` changed from the disputed speed-count label to Allison 1000 automatic. Old/new supplemental trace/geometry are exact; intended chair image differences audited in `.qa/cloud/phase6-reference-audit.json`. Original `.qa/cloud/reference` is unchanged; the new reference is separate at `.qa/cloud/reference-phase6`.
- Final `compare-phase6` exits 0: `.qa/cloud/run-1794176141888-12227/comparison.json`, exact traces/geometry, six views each 0 changed/differing pixels and max delta 0. Both references retain their saved checksums.
- Original `npm run baseline:compare` still fails here: missing `.qa/baseline`. Do not substitute software-rendered PNGs for original Windows acceptance.

## 4. Release record

1. Final human acceptance received and reviewed source committed as `f572cbd`, preserving every documented package and validation result.
2. Authorized integration: history-preserving merge of engine-library into master, final gate tag phase-6-done, and push of these explicit refs to origin. The initial remote branches were checked and write access passed a dry-run. Never force-push or rewrite remote history.
3. Confirm remote branch/tag commit IDs match the local release. Keep ignored cloud/Windows evidence as local artifacts; no environment publication or hosting deployment is requested.
4. Future work: the documented post-MVP presentation/physical corrections and inline-six remain separate scope.
## 5. Decisions and accuracy limits

| Decision | Current record |
| --- | --- |
| D1/D2 | MVP Phases 0–4 and 6; family coupling fixed without reopening Phase 2. |
| D3 | origin is https://github.com/colinstephens93/duramaxsimulator.git; no remote operation this session. |
| D4 | LBZ rod 163.0 mm from S13/S14 family listings, medium confidence; not an independent LBZ measurement. |
| D5/D6 | LBZ unmeasured timing/behavior/look/UI/curve interpolation are explicitly design values; approved exception recorded in runbook. |
| D7 | Ownership walk adopted; shared assets and Three.Sprite module geometry preserved, owned resources disposed idempotently. |
| D8 | Retained separate audio 80 rpm and engine/telemetry 90 rpm gates. |
| D9 | Prop collision and pointer-lock rejection fixed; three presentation gaps below remain intentionally outside the MVP correction scope. |
| D10 | Stand design parameters beyond current metadata remain post-MVP. |
| D11 | Copy explicitly records the brief’s piezoelectric wording versus the research’s solenoid preference; no undisputed mechanism claim. |
| D12 | Chair moved to console-local (-0.2,0,0.8); world (1.588932,0.144879), 0.31 m envelope clears engine circle by 0.260838 m; no exemption remains. |
| D13 | LLY’s retained 184 mm rod-length correction stays outside this MVP. |
| D14 | Configured Git author/trailer rules apply if a commit is later requested. |
| D15 | Original cloud reference preserved; expressly authorized Phase-6 reference is separate and never overwrites it. |

## 6. Known limitations

- Windows automated baseline/FPS and picker retest passed; the human accepted release. Individual manual checklist observations beyond that confirmation were not separately recorded. Ignored evidence is not portable Git-tracked baseline data.
- LBZ stock boost is contested; rod length uses family listings. Timing, startup, sound, curves between rated peaks and many construction details are illustrative.
- LLY model keeps its legacy rod length deliberately; no claim that it matches the research correction.
- Bundle-size warning remains. Outline hidden-edge visibility, assembled-view internal quick-part visibility and exploded-camera framing remain the three documented presentation gaps.
- The V8 family retains a literal crank throw for its 99 mm stroke; another stroke/family needs a separately scoped change. Inline-six is post-MVP.

## 7. Evidence and history

The append-only [build log](build-log.md) records every package, failed check/correction, approval/default, file hash and validation limit. Current prompts: [3.5](prompts/3.5-resource-ownership.md), [3.6](prompts/3.6-browser-memory.md), [3.7](prompts/3.7-prop-footprints.md), [3.8](prompts/3.8-phase3-acceptance.md), [Phase 4](prompts/4-lbz.md), [Phase 6](prompts/6-hardening.md). Earlier prompts are completed history, not scripts to reapply.

## 8. Resume protocol

1. Read AGENTS.md, this handoff, MVP plan and runbook. Compare Git status with the logged accumulated changes; large uncommitted scope is expected.
2. Preserve dirty files and ignored `.qa/` evidence. No reset/re-onboarding/reference overwrite.
3. Run Node/check/build/check:dist/browser as needed for new changes. Current expected Node count is 247; explicit TEST_CHROME_PATH selects the existing cloud executable when channel chrome is unavailable.
4. Current cloud command is `node scripts/cloud-baseline.mjs compare-phase6`. If its reference is missing, recover the approved artifact/provenance or arrange a deliberately reviewed capture; never silently regenerate to pass.
5. Keep original Windows/manual acceptance and Git/release actions separate from automated cloud implementation.

## 9. GitHub

origin remains https://github.com/colinstephens93/duramaxsimulator.git. The human explicitly requested push and merge of the accepted build. Push engine-library and the history-preserving master merge to this existing origin, with the final gate tag. No force-push, remote deletion, hosting deployment or environment publication.

## 10. Useful files

- [MVP plan](mvp-plan.md), [design](engine-library-plan.md), [runbook](agent-runbook.md).
- [Research](research/README.md), [entry guide](add-engine.md), [QA recipe](qa-recipe.md).
- [Cloud validation](cloud-validation.md), [build log](build-log.md), [documentation index](README.md).
