# GIT Buttons (VS Code extension)

[![CI](https://github.com/AI-Team-26/vscode-extension.GIT-buttons/actions/workflows/ci.yaml/badge.svg)](https://github.com/AI-Team-26/vscode-extension.GIT-buttons/actions/workflows/ci.yaml)

A VS Code extension that adds a command bar with quick Git actions right in your editor.

## Features

- **GIT Fetch** — fetch all remotes from the active repository
- **GIT Prune Local Branches** — remove local branches that no longer exist upstream

Both commands are available as buttons in the status/command bar and can also be run from the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).

## Requirements

- [VS Code](https://code.visualstudio.com/) 1.85 or later
- A workspace opened inside a Git repository

## Getting Started

```bash
npm install
npm run compile   # build the extension
npm run watch     # recompile on change during development
```

Then press `F5` in VS Code to launch the Extension Development Host and try the buttons.

## Packaging

```bash
npx @vscode/vsce package
```

Install the generated `.vsix` via *Extensions → Install from VSIX*.

## Commands

| Command | Description |
|---|---|
| `gitButtons.fetch` | Run `git fetch --all` in the active repository |
| `gitButtons.pruneLocalBranches` | Delete local branches whose upstream has been deleted |

## License

MIT
