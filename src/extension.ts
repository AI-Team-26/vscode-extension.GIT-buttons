import * as vscode from "vscode"
import { checkGitRepo, runGitFetch } from "./git"
import type { GitCheckFailReason } from "./git"

function gitErrorMessage(reason: GitCheckFailReason, folderName: string): string {
    switch (reason) {
        case "git-missing":
            return "GIT Buttons: git could not be found. Install git or add it to your PATH."
        case "not-git-repo":
            return `GIT Buttons: "${folderName}" is not inside a Git repository.`
        default: {
            const exhaustive: never = reason
            throw new Error(`Unhandled Git check reason: ${exhaustive}`)
        }
    }
}

async function ensureGitReady(workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined): Promise<string | null> {
    if (!workspaceFolders || workspaceFolders.length === 0) {
        void vscode.window.showErrorMessage("GIT Buttons: no folder is open in this window.")
        return null
    }

    const folder = workspaceFolders[0]
    const result = await checkGitRepo(folder.uri.fsPath)

    if (result.reason !== null) {
        void vscode.window.showErrorMessage(gitErrorMessage(result.reason, folder.name))
        return null
    }

    return result.repoRoot!
}

async function runFetch(): Promise<void> {
    const repoRoot = await ensureGitReady(vscode.workspace.workspaceFolders)
    if (!repoRoot) return

    const status = vscode.window.setStatusBarMessage("$(sync) Fetching…")
    try {
        const res = await runGitFetch(repoRoot)
        if (res.success) void vscode.window.showInformationMessage("GIT Buttons: fetch completed successfully.")
        else void vscode.window.showErrorMessage(`GIT Buttons: fetch failed.\n${res.stderr ?? ""}`)
    } finally {
        status.dispose()
    }
}

function runPruneLocalBranches(): void {
    void vscode.window.showInformationMessage("GIT Buttons: prune local branches not implemented yet")
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand("gitButtons.fetch", async () => {
            await runFetch()
        }),
        vscode.commands.registerCommand("gitButtons.pruneLocalBranches", async () => {
            const repoRoot = await ensureGitReady(vscode.workspace.workspaceFolders)
            if (!repoRoot) return
            runPruneLocalBranches()
        })
    )
}

export function deactivate() {}
