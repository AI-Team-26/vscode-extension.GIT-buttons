import * as vscode from "vscode";
import { checkGitRepo } from "./git";
import type { GitCheckReason } from "./git";

// Maps every possible GitCheckReason to a user-facing message so the set of reasons stays explicit.
// Adding a new reason without handling it below becomes a compile error (see the never guard).
function gitErrorMessage(reason: GitCheckReason, folderName: string): string {
  switch (reason) {
    case "git-missing":
      return "GIT Buttons: git could not be found. Install git or add it to your PATH.";
    case "not-git-repo":
      return `GIT Buttons: "${folderName}" is not inside a Git repository.`;
    case "ok":
      // Unreachable from the guard (called only on failure); kept so the switch covers every value.
      return "GIT Buttons: unable to determine Git status.";
    default: {
      const exhaustive: never = reason;
      throw new Error(`Unhandled Git check reason: ${exhaustive}`);
    }
  }
}

async function ensureGitReady(workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined): Promise<boolean> {
  if (!workspaceFolders || workspaceFolders.length === 0) {
    void vscode.window.showErrorMessage("GIT Buttons: no folder is open in this window.");
    return false;
  }

  const folder = workspaceFolders[0];
  const result = await checkGitRepo(folder.uri.fsPath);

  if (!result.ok) {
    void vscode.window.showErrorMessage(gitErrorMessage(result.reason, folder.name));
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
