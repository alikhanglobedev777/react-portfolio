# React Portfolio security cleanup

The confirmed PolinRider-style loader was injected into `vite.config.js`, alongside
a JavaScript file disguised as `fa-solid-900.woff2`. The hidden
`.vscode/tasks.json` executed the fake font on folder open; VS Code
settings enabled automatic execution.

## Remediation
- Restored the legitimate Vite configuration for this branch.
- Deleted the malicious fake font and folder-open task.
- Disabled automatic VS Code tasks in the repository.
- Added a dependency-free static guard to GitHub Actions.
- Added environment-file ignore patterns.
- On `master`, the tracked `.env` contained configured email credentials;
  it has been removed from the current branch.

## Still required
1. Rotate the exposed email account password/app password from a trusted device.
2. Configure replacement credentials in a deployment secret manager, not Git.
3. Check local clones, running servers, build artifacts, and historical commits.
4. Review the GitHub Actions scan and validate the app safely.

This check detects known indicators, not every possible threat.

## Re-infection found (2026-11-15)

Commit `fa5b9a3` ("security: remove malware loader…") did **not** fully clean the
repo — it introduced a second loader variant:

- `init` (extensionless, so the scanner skipped it) hid ~32 KB of obfuscated
  JavaScript after hundreds of spaces on a single line.
- `package.json` was changed so `npm run dev` / `npm run build` executed
  `node init` first.
- `vite.config.js` still carried an obfuscated payload after `});` on its last
  line (variant without the `global['!']` marker), plus injected
  `createRequire` / `module` scaffolding.

Remediation: deleted `init`, restored the `dev`/`build` scripts, stripped the
payload and scaffolding from `vite.config.js`. `scripts/check-malware.py` now
also flags code hidden behind long whitespace runs, scans extensionless files,
flags any `createRequire` in build configs, and flags package scripts that run
local files with `node`.

Because `init` ran on this machine (its `.tmp` side-effect directory existed),
treat the machine as potentially compromised: rotate passwords, tokens, SSH
keys and any crypto-wallet secrets from a clean device.
