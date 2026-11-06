import { test } from "node:test"
import assert from "node:assert/strict"
import { mkdtemp, mkdir, readFile, writeFile, cp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"
test("Changesets propagates a token minor release independently and safely replays versioning", async () => {
  const fixture = await mkdtemp(join(tmpdir(), "yuzur1ha-version-")),
    root = resolve(import.meta.dirname, "../..")
  try {
    await writeFile(
      join(fixture, "package.json"),
      JSON.stringify({
        name: "release-fixture",
        private: true,
        packageManager: "pnpm@11.18.0",
      }),
    )
    await cp(
      join(root, "pnpm-workspace.yaml"),
      join(fixture, "pnpm-workspace.yaml"),
    )
    for (const name of [
      "token",
      "ui",
      "markdown",
      "press",
      "press-theme",
      "press-reference",
    ]) {
      await mkdir(join(fixture, "packages", name), { recursive: true })
      await cp(
        join(root, "packages", name, "package.json"),
        join(fixture, "packages", name, "package.json"),
      )
    }
    await mkdir(join(fixture, ".changeset"))
    const config = JSON.parse(
      await readFile(join(root, ".changeset/config.json"), "utf8"),
    )
    // Version propagation is tested without remote changelog lookup or Git history.
    await writeFile(
      join(fixture, ".changeset/config.json"),
      JSON.stringify({ ...config, changelog: false }),
    )
    await writeFile(
      join(fixture, ".changeset/token.md"),
      '---\n"@yuzur1ha/token": minor\n---\nChange the public token contract.\n',
    )
    const cli = join(
      dirname(
        fileURLToPath(import.meta.resolve("@changesets/cli/package.json")),
      ),
      "bin.js",
    )
    execFileSync(process.execPath, [cli, "version"], {
      cwd: fixture,
      stdio: "pipe",
    })
    const version = async (name) =>
      JSON.parse(
        await readFile(join(fixture, "packages", name, "package.json"), "utf8"),
      ).version
    assert.equal(await version("token"), "0.2.0")
    for (const name of ["ui", "press-theme", "press-reference"])
      assert.notEqual(await version(name), "0.1.0")
    for (const name of ["markdown", "press"])
      assert.equal(await version(name), "0.1.0")
    const before = await version("ui")
    assert.throws(
      () =>
        execFileSync(process.execPath, [cli, "version"], {
          cwd: fixture,
          stdio: "pipe",
        }),
      (error) =>
        error.status === 1 &&
        error.stdout.toString().includes("No unreleased changesets"),
    )
    assert.equal(await version("ui"), before)
  } finally {
    await rm(fixture, { recursive: true, force: true })
  }
})
