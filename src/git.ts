import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/**
 * Why a workspace failed the readiness check.
 * - "ok": git is available and the folder is inside a Git repository.
 * - "git-missing": the git executable could not be spawned (not installed / not on PATH).
 * - "not-a-repo": git exists but the folder is not inside a Git repository.
 */
export type GitCheckReason = "ok" | "git-missing" | "not-a-repo";

export interface GitCheckResult {
  ok: boolean;
  reason: GitCheckReason;
  /** Absolute path of the repository root, present when `ok` is true. */
  repoRoot?: string;
}

/**
 * Returns true when the `git` executable can be spawned successfully.
 * Used to distinguish "git missing" from "folder is not a repository".
 */
export async function isGitAvailable(): Promise<boolean> {
  try {
    await execFileAsync("git", ["--version"]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolves the top-level directory of the Git repository containing `folderPath`.
 * Returns null when the folder is not inside a repository or cannot be read.
 */
export async function findRepoRoot(folderPath: string): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync("git", ["rev-parse", "--show-toplevel"], {
      cwd: folderPath,
      maxBuffer: 4 * 1024 * 1024
    });
    const root = stdout.trim();
    return root.length > 0 ? root : null;
  } catch {
    return null;
  }
}

/**
 * Combined readiness check for a single workspace folder.
 * This is the single entry point used by the command handlers so that every
 * GIT Button action fails gracefully instead of throwing cryptic errors.
 */
export async function checkWorkspace(folderPath: string): Promise<GitCheckResult> {
  if (!(await isGitAvailable())) {
    return { ok: false, reason: "git-missing" };
  }

  const repoRoot = await findRepoRoot(folderPath);
  if (!repoRoot) {
    return { ok: false, reason: "not-a-repo" };
  }

  return { ok: true, reason: "ok", repoRoot };
}
