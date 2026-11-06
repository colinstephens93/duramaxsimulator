# AGENTS.md: start here

This repository is a Duramax LLY test-cell app (Three.js, Vite 8). It is being turned into an engine library: any engine runs from its own data, and every number carries a source. The LLY works today. The next work is runtime switching, then a second engine (LBZ). Read the handoff before you change anything.

## Read in this order

1. [docs/handoff.md](docs/handoff.md): where things stand, and the next step.
2. [docs/mvp-plan.md](docs/mvp-plan.md): the plan to the MVP. Each package names its files, steps, checks and stop conditions.
3. [docs/agent-runbook.md](docs/agent-runbook.md): the rules (section 2), the stop conditions (section 5) and the human gates (section 6).
4. [docs/engine-library-plan.md](docs/engine-library-plan.md): the design. Section 11 holds the decisions.
5. [docs/research/README.md](docs/research/README.md): the authority for every engine value. Values come only from there.

Also: [docs/harness-notes.md](docs/harness-notes.md) (shell rules, especially Windows PowerShell 5.1), [docs/qa-recipe.md](docs/qa-recipe.md) (driving and checking the app), and [docs/build-log.md](docs/build-log.md) (the history, append only). The index is [docs/README.md](docs/README.md).

## Start a session

1. Run `git status --short` and `git log --oneline -3`. Compare them with [docs/handoff.md](docs/handoff.md). If they differ, stop and report the difference.
2. Run `npm test` and `npm run check`. At the checkpoint, expect 207 passing, and PASS with 229 values, 65 records and 0 without a record. The handoff gives the current numbers.
3. Do the next package in [docs/handoff.md](docs/handoff.md) section 4, using its prompt in [docs/prompts/](docs/prompts/). Do not start a package whose decisions are open (handoff section 5).

## Hard rules

- **Git.** Never run `git reset --hard`, `git checkout --` or `git push`. Commit or tag only when the human approves a gate. Make a WIP checkpoint only when the human asks for one. Push only when the human names the remote and asks.
- **Tests and checks.** Never edit a test, a baseline or a check to make it pass. The migrations listed in [docs/mvp-plan.md](docs/mvp-plan.md) section 4 are the only planned test edits, and each one is logged in the build log.
- **Values.** Values come from [docs/research/](docs/research/) only. Nothing is researched during a build. A gap is a decision for the human (mvp-plan D4 to D6), not a value filled from memory.
- **Scope.** Stay inside the package's file list. If the package needs another file, stop and report.
- **Source files.** Edit with a file tool, or with a Node script that reads and writes UTF-8. Never read and rewrite source with PowerShell 5.1 (see [docs/harness-notes.md](docs/harness-notes.md)).
- **Gates.** At a gate, write the review entry, report, and wait for the human.

## Commands

| Command | What it does | When |
| --- | --- | --- |
| `npm test` | Node unit tests (207 at the checkpoint) | Every package |
| `npm run check` | Names, numbers, encoding, IDs and provenance | Every package |
| `npm run build` | Production bundle in `dist/` | From 3.3a |
| `npm run baseline:compare` | LLY trace, geometry and six views against the baseline. Needs Chrome. | Every package from 3.3a |
| `npm run dev` | Dev server on `127.0.0.1:5173` | Manual QA |
| `npm run preview` | Serves `dist/` on `127.0.0.1:4173` | Manual QA |
| `npm run test:browser` | Browser tests | From 3.6 |
| `npm run check:dist` | Checks on `dist/` | From 6.5 |
| `npm run baseline:capture` | Writes the baselines. Run only in a logged re-capture package. | 6.6 only |

## Environment

- Windows 11. Node 24 (`package.json` requires `^20.19.0` or `>=22.12.0`). Git with `core.autocrlf=true`. Chrome installed.
- Harness shell: Windows PowerShell 5.1.
- No GitHub remote yet. See [docs/handoff.md](docs/handoff.md) section 9.

## Attribution

Commits are made by the configured git user, with the trailer decided in [docs/mvp-plan.md](docs/mvp-plan.md) (decision D14): `Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>`, unless the human says otherwise.
