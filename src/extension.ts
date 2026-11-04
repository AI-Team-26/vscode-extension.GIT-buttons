import * as vscode from "vscode";
import { checkGitRepo } from "./git";

async function ensureGitReady(workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined): Promise<boolean> {
  if (!workspaceFolders || workspaceFolders.length === 0) {
    void vscode.window.showErrorMessage("GIT Buttons: no folder is open in this window.");
    return false;
  }

  const folder = workspaceFolders[0];
  const result = await checkGitRepo(folder.uri.fsPath);

  if (!result.ok) {
    const message =
      result.reason === "git-missing"
        ? "GIT Buttons: git could not be found. Install git or add it to your PATH."
        : `GIT Buttons: "${folder.name}" is not inside a Git repository.`;
    void vscode.window.showErrorMessage(message);
    return false;
  }

  return true;
}

function runFetch(): void {
  void vscode.window.showInformationMessage("GIT Buttons: fetch not implemented yet");
}

function runPruneLocalBranches(): void {
  void vscode.window.showInformationMessage("GIT Buttons: prune local branches not implemented yet");
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("gitButtons.fetch", async () => {
      if (!(await ensureGitReady(vscode.workspace.workspaceFolders))) return;
      runFetch();
    }),
    vscode.commands.registerCommand("gitButtons.pruneLocalBranches", async () => {
      if (!(await ensureGitReady(vscode.workspace.workspaceFolders))) return;
      runPruneLocalBranches();
    })
  );
}

export function deactivate() {}
