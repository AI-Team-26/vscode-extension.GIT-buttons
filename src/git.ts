import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type GitCheckFailReason = "git-missing" | "not-git-repo";

export interface GitCheckResult {
  reason: GitCheckFailReason | null;
  repoRoot?: string;
}

export async function isGitAvailable(): Promise<boolean> {
  try {
    await execFileAsync("git", ["--version"]);
    return true;
  } catch {
    return false;
  }
}

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

export async function checkGitRepo(folderPath: string): Promise<GitCheckResult> {
  if (!(await isGitAvailable())) return { reason: "git-missing" };

  const repoRoot = await findRepoRoot(folderPath);
  if (!repoRoot) return { reason: "not-git-repo" };

  return { reason: null, repoRoot };
}
