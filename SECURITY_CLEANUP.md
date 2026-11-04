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
