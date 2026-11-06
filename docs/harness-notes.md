# Harness and shell notes

Read this before you run a harness prompt, and before you write one.

## The shells

- **Harness:** Windows PowerShell 5.1 (`powershell.exe`). Prompts for the harness use only the commands in this file.
- **Lead and any other AI tool:** Git Bash on the same machine. Commands in this repository must work in both.
- **Node** 24 is installed. `package.json` requires `^20.19.0` or `>=22.12.0`.
- **Git** user: Colin Stephens. `core.autocrlf` is `true`, and the repository stores LF. "LF will be replaced by CRLF" warnings are harmless.
- **GitHub CLI** (`gh`) is not installed. Pushes use Git Credential Manager. `origin` is set (see [handoff.md](handoff.md) section 9).
- **Chrome** is installed. Playwright (`playwright-core` 1.64.1) drives it with `channel: 'chrome'`.

## The baseline browser

The baselines were captured on **Chrome 157.0.8103.39**, with the renderer `ANGLE (Intel, Intel(R) Arc(TM) 140V GPU (8GB) (0x000064A0) Direct3D11 vs_5_0 ps_5_0, D3D11)`. `npm run baseline:compare` checks both. If either changes, the compare fails. Stop and report it. Do not re-capture a baseline outside a logged package: the plan allows re-capture only in Phase 6.

## PowerShell 5.1: the commands to use

| Unix (lead) | PowerShell 5.1 (harness) |
| --- | --- |
| `grep -n 'pat' file` | `Select-String -Path file -Pattern 'pat'` |
| `grep -rn 'pat' src` | `Get-ChildItem -Recurse -Include *.js,*.mjs src \| Select-String -Pattern 'pat'` |
| `tail -n 12` | `Select-Object -Last 12` |
| `head -n 3` | `Select-Object -First 3` |
| `sha256sum file` | `Get-FileHash -Algorithm SHA256 file` |
| `wc -l file` | `(Get-Content -Path file).Count` (read only) |
| `echo $?` after a native command | `$LASTEXITCODE` |

`Select-String` prints the file, the line number and the matching line. "Expect nothing" means no output.

## Source files: the rule that protects the labels

- **Never read a source file and write it back with PowerShell 5.1.** `Get-Content -Raw` followed by `Set-Content`, `Out-File` or `>` decodes UTF-8 as ANSI. The labels (`·`, `°`, `–`) turn into mojibake (`Â·`). This happened once, during Phase 0, and `git diff --stat` caught it.
- **Edit with a Node script that reads and writes UTF-8:**
  ```text
  fs.readFileSync(path, 'utf8')  ->  edit the string  ->  fs.writeFileSync(path, text, 'utf8')
  ```
  Count each replacement before you write, and stop if the count is wrong. Keep the script outside the repo (in `$env:TEMP`) and delete it afterwards.
- **Restore a file from git** with Git Bash: `git show HEAD:path > path`. The repository stores LF, so this is byte-exact.
- **After any scripted rewrite:** `git diff --stat` must show the size you expect. Then run `npm run check`, whose Encoding check looks for the mojibake sequences.

## Deleting

- `Remove-Item -Recurse` can follow a directory junction into its target. To remove a junction, first unlink it with `cmd /c rmdir <path>`. Never delete `dist\`, `src\` or any tracked folder this way.
- Delete with git (`git rm`) for tracked files.

## Build and compare output

- Vite writes its warnings to stderr. In PowerShell 5.1 each stderr line from `npm run build` appears as a `NativeCommandError`. That is not a failure. Judge the build by its `built in` line, and judge the compare by its PASS lines and `$LASTEXITCODE`.
- Do not use `2>&1` on native commands in PowerShell 5.1. It wraps the output lines as errors. Run the command, then read its output.
- `npm run baseline:compare` writes its current captures to `.qa\current\` (ignored by git). It never writes the baseline files.

## Commits and staging

- Stage explicit paths with `git add <paths>`. Do not use `git add -A`: scratch files must stay out of commits.
- Write each commit message to a file outside the repository, and run `git commit -F <file>`.
- The trailer is `Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>` (decision D14 in [mvp-plan.md](mvp-plan.md)).

## Browser work

- The scripted path (Playwright, headless Chrome, `?qa=1`) is the one the baselines use. Start with [qa-recipe.md](qa-recipe.md), section a.
- The built-in browser pane can be hidden. While it is hidden, `requestAnimationFrame` does not run, so the app does not animate. The QA recipe describes the workaround.
- Under `?qa=1` the simulation, camera and telemetry advance only through the render hook. See the QA recipe, sections b to e.

## Cleanup after a package

- Stop any Vite or preview server the package started.
- Delete scratch files in `$env:TEMP`.
- Confirm `git status --short` shows only the package's files.

## The browser baseline on a new machine

- **Tracked, so present in every clone:** `tests/baseline/lly-curves.json` (numeric, compared exactly by `npm test`), `tests/baseline/lly-trace.json` and `tests/baseline/lly-geometry.json` (read by the compare).
- **Git-ignored, so absent in a fresh clone:** `.qa/baseline/`, which holds the six PNG views and `meta.json` (the Chrome version and renderer that captured them). Without it, `npm run baseline:compare` stops with "Missing .qa/baseline".
- **To recreate it,** capture the phase-0 baseline from the `phase-0-done` tag in a scratch folder, the way the QA recipe describes (Git Bash):

```bash
mkdir -p /c/Users/colin/AppData/Local/Temp/phase0-capture
git archive phase-0-done | tar -x -C /c/Users/colin/AppData/Local/Temp/phase0-capture
cd /c/Users/colin/AppData/Local/Temp/phase0-capture && npm install && npm run baseline:capture
mkdir -p /c/Users/colin/Documents/DeepSeek/engineroom/.qa && cp -r /c/Users/colin/AppData/Local/Temp/phase0-capture/.qa/baseline /c/Users/colin/Documents/DeepSeek/engineroom/.qa/
```

- This is a re-capture for the new machine's Chrome. It sets the baseline that the compare will hold that machine to. It needs the human's approval and a build-log entry, the same as any re-capture.
- Delete the scratch folder afterwards with `cmd /c rmdir /s /q <path>`.
