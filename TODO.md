# TODO

## Backlog
- Feature 13: GitHub Actions CI: verify TypeScript compilation (`npm run compile`) and create the package (`vsce package`) on push/PR. Note: agent cannot push `.github/workflows` — create the file as `<workflow_name>.yaml.temp` so the user can push it themselves.
- Feature 3: Set up NPM scripts: `compile`, `watch`, `package`, lint/format
- Feature 4: Implement "GIT Fetch" button (status bar) running `git fetch --all`
- Feature 5: Implement "GIT Prune Local Branches" button deleting stale local branches
- Feature 6: Expose both actions in the Command Palette
- Feature 7: Show progress/status messages and result notifications for each action
- Feature 8: Handle multi-root workspaces (pick which repo to act on)
- Bug 9: Graceful errors when not in a Git repo or git is missing
- Feature 10: Add icons/labels to the command bar buttons
- Feature 11: Add settings (e.g., prune confirmation, fetch flags)
- Feature 12: Polish README with screenshots and usage instructions

## Done
- Feature 2: Scaffold project: TypeScript extension skeleton, `package.json` manifest, build scripts
