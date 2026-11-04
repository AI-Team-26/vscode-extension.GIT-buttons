// Stamps package.json with a CalVer build date (YY.M.D, no zero padding) before
// packaging, then restores the original file. This makes vsce name the artifact
// e.g. git-buttons-26.11.4.vsix without committing version churn.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkgPath = join(root, "package.json");
const original = readFileSync(pkgPath, "utf8");

const now = new Date();
const calver = `${String(now.getFullYear()).slice(-2)}.${now.getMonth() + 1}.${now.getDate()}`;

const pkg = JSON.parse(original);
pkg.version = calver;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

try {
  const result = spawnSync("vsce", ["package", "--no-dependencies"], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error || result.status !== 0) {
    process.exit(result.status ?? 1);
  }
} finally {
  writeFileSync(pkgPath, original);
}
