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

export interface GitCommandResult {
  success: boolean;
  stdout?: string;
  stderr?: string;
}

// Fetch updates from remote and prune stale remote-tracking branches.
export async function runGitFetch(repoRoot: string): Promise<GitCommandResult> {
  try {
    const { stdout, stderr } = await execFileAsync("git", ["fetch", "origin", "--prune"], {
      cwd: repoRoot,
      maxBuffer: 8 * 1024 * 1024
    });
    return { success: true, stdout, stderr };
  } catch (err: unknown) {
    const error = err as { message?: string; stderr?: string };
    return { success: false, stderr: error.stderr ?? error.message };
  }
}

export interface GitPruneResult {
  success: boolean;
  deleted: string[];
  // Stale branches that could not be deleted because they contain unmerged commits.
  skippedUnmerged: string[];
  error?: string;
}

// Deletes local branches whose remote counterpart no longer exists on any
// remote. `git fetch --prune` wipes both the tracking refs and the upstream
// config of such branches, so "no surviving remote ref with the same name"
// is the only reliable staleness signal left locally.
// Deletion uses safe mode (`git branch -d`): merged branches are deleted,
// branches holding unmerged commits are skipped and reported instead.
export async function runGitPruneLocalBranches(repoRoot: string): Promise<GitPruneResult> {
  try {
    const [{ stdout: headsOut }, { stdout: remotesOut }] = await Promise.all([
      execFileAsync("git", ["for-each-ref", "refs/heads", "--format=%(refname:short)"], {
        cwd: repoRoot,
        maxBuffer: 8 * 1024 * 1024
      }),
      execFileAsync("git", ["for-each-ref", "refs/remotes", "--format=%(refname)"], {
        cwd: repoRoot,
        maxBuffer: 8 * 1024 * 1024
      })
    ]);

    // Branch names that still exist on at least one remote.
    const remoteBranchNames = new Set<string>();
    for (const line of remotesOut.split("\n")) {
      const ref = line.trim();
      if (!ref.startsWith("refs/remotes/")) continue;
      const rest = ref.slice("refs/remotes/".length);
      const slash = rest.indexOf("/");
      if (slash > 0) remoteBranchNames.add(rest.slice(slash + 1));
    }

    const localBranches = headsOut
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const { stdout: headOut } = await execFileAsync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      cwd: repoRoot,
      maxBuffer: 4 * 1024 * 1024
    });
    const currentBranch = headOut.trim();
    const staleBranches = localBranches.filter((b) => b !== currentBranch && !remoteBranchNames.has(b));

    const deleted: string[] = [];
    const skippedUnmerged: string[] = [];
    for (const branch of staleBranches) {
      // Safe delete: fails when the branch has unmerged commits.
      try {
        await execFileAsync("git", ["branch", "-d", branch], { cwd: repoRoot, maxBuffer: 4 * 1024 * 1024 });
        deleted.push(branch);
      } catch {
        skippedUnmerged.push(branch);
      }
    }

    return { success: true, deleted, skippedUnmerged };
  } catch (err: unknown) {
    const error = err as { message?: string; stderr?: string };
    return { success: false, deleted: [], skippedUnmerged: [], error: error.stderr ?? error.message };
  }
}

export async function checkGitRepo(folderPath: string): Promise<GitCheckResult> {
  if (!(await isGitAvailable())) return { reason: "git-missing" };

  const repoRoot = await findRepoRoot(folderPath);
  if (!repoRoot) return { reason: "not-git-repo" };

  return { reason: null, repoRoot };
}
