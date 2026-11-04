# TODO

## Backlog
- Feature 5: Implement "GIT Prune Local Branches" button deleting stale local branches
- Feature 6: Expose both actions in the Command Palette
- Feature 7: Show progress/status messages and result notifications for each action
- Feature 8: Handle multi-root workspaces (pick which repo to act on)
- Feature 10: Add icons/labels to the command bar buttons
- Feature 11: Add settings (e.g., prune confirmation, fetch flags)
- Feature 12: Polish README with screenshots and usage instructions
- Bug 14: created release file is "git-buttons-0.0.1.vsix" instead of git-buttons-26.11.4.vsix
  
## Done
- Feature 4: Implement "GIT Fetch" button running `git fetch --all`
- Bug 9: Graceful errors when not in a Git repo or git is missing
- Feature 3: Set up NPM scripts: `compile`, `watch`, `package`, lint/format (verified end-to-end; project switched npm → pnpm)
- Feature 2: Scaffold project: TypeScript extension skeleton, `package.json` manifest, build scripts
- Feature 13: GitHub Actions CI: verify TypeScript compilation (`npm run compile`) and create the package (`vsce package`) on push/PR. Workflow added as `ci.yaml` (repo root) — user must move it to `.github/workflows/ci.yml` to activate.
