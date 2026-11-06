import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import { execFileSync } from "node:child_process"
import { resolve } from "node:path"
const root = process.argv[2]
if (!root) throw new Error("Pass the read-only source repository path")
const baseline = JSON.parse(
  await readFile("docs/features/oss-migration/source-baseline.json", "utf8"),
)
const git = (args) => execFileSync("git", args, { cwd: root, encoding: "utf8" })
assert.equal(git(["rev-parse", "HEAD"]).trim(), baseline.head)
assert.equal(git(["status", "--porcelain=v1"]), baseline.status)
const files = git(["ls-files", "-c", "-o", "--exclude-standard", "-z"])
  .split("\0")
  .filter(Boolean)
assert.deepEqual(files.sort(), Object.keys(baseline.files).sort())
for (const [file, sha] of Object.entries(baseline.files))
  assert.equal(
    createHash("sha256")
      .update(await readFile(resolve(root, file)))
      .digest("hex"),
    sha,
    `Source changed: ${file}`,
  )
assert.equal(git(["diff", "--cached", "--name-only"]), "")
console.log(
  `Source unchanged: ${files.length} SHA-256 matches; HEAD, worktree and empty staged diff preserved`,
)
