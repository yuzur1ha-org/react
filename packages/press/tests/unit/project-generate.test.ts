import {
  cp,
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises"
import { join, resolve } from "node:path"
import { expect, it } from "vitest"
import { generate } from "../../src/node/index"
import { execute, fixture } from "./project-fixture"

it("generates a validated index, exact types and literal loaders deterministically without rewriting", async () => {
  const root = await fixture()
  const snapshot = await generate({ root })
  expect(
    snapshot.documents.map((document) => [
      document.source,
      document.id,
      document.key,
    ]),
  ).toEqual([["content/hello.md", "greeting", "greeting"]])
  const path = join(snapshot.outputDir, "manifest.ts")
  const before = await readFile(path, "utf8")
  const modified = (await stat(path)).mtimeMs
  await generate({ root })
  expect(await readFile(path, "utf8")).toBe(before)
  expect((await stat(path)).mtimeMs).toBe(modified)
  expect(before).toContain('import("../../content/hello.md")')
  expect(before).not.toContain(root)
  expect(
    await readFile(join(snapshot.outputDir, "documents.d.ts"), "utf8"),
  ).toContain('DocumentKey = "greeting"')
  await generate({ root }, true)
  await writeFile(path, "stale")
  await expect(generate({ root }, true)).rejects.toThrow("Stale")
  expect(await readFile(path, "utf8")).toBe("stale")
})
it("runs the standalone CLI without Vite and handles concurrent generators", async () => {
  const root = await fixture()
  const cli = resolve(import.meta.dirname, "../../dist/node/cli")
  const results = await Promise.all([
    execute(process.execPath, [cli, "generate", "--root", root]),
    execute(process.execPath, [cli, "generate", "--root", root]),
  ])
  expect(results.every((result) => result.stdout.includes("1 documents"))).toBe(
    true,
  )
  await generate({ root }, true)
})
it("cleans only owned files after deleting sources, and rejects invalid input without changing outputs", async () => {
  const root = await fixture()
  await generate({ root })
  const directory = join(root, ".cache/press")
  await writeFile(join(directory, "user.txt"), "preserve")
  const source = join(root, "content/hello.md")
  const before = await readFile(join(directory, "manifest.ts"), "utf8")
  await writeFile(source, "---\nid: greeting\ntitle: false\n---\n# Fallback")
  await expect(generate({ root })).rejects.toThrow("Invalid title")
  expect(await readFile(join(directory, "manifest.ts"), "utf8")).toBe(before)
  await rm(source)
  await generate({ root })
  expect(await readFile(join(directory, "documents.d.ts"), "utf8")).toContain(
    "never",
  )
  expect(await readFile(join(directory, "user.txt"), "utf8")).toBe("preserve")
})
it("supports explicit config/output paths, rejects missing/ambiguous config and leaves check read-only", async () => {
  const root = await fixture()
  await expect(generate({ root, configFile: "missing.ts" })).rejects.toThrow(
    "Missing",
  )
  const config = join(root, "yupress.config.ts")
  await cp(config, config.replace(/\.ts$/, ".mts"))
  await expect(generate({ root })).rejects.toThrow("Ambiguous")
  await rename(config, join(root, "alternate.ts"))
  await rm(config.replace(/\.ts$/, ".mts"))
  const alternate = join(root, "alternate.ts")
  await writeFile(
    alternate,
    (await readFile(alternate, "utf8")).replace(
      'content: { srcDir: "content" },',
      'content: { srcDir: "content" }, outputDir: "custom-output",',
    ),
  )
  await expect(
    generate({ root, configFile: "alternate.ts" }, true),
  ).rejects.toThrow("Stale")
  expect(await readdir(root)).not.toContain("custom-output")
  await generate({ root, configFile: "alternate.ts" })
  expect(await readdir(join(root, "custom-output"))).toContain("manifest.ts")
})
it("refuses to overwrite a user file at a generated output path", async () => {
  const root = await fixture()
  const directory = join(root, ".cache/press")
  await mkdir(directory, { recursive: true })
  await writeFile(join(directory, "manifest.ts"), "user content")
  await expect(generate({ root })).rejects.toThrow("unowned")
  expect(await readFile(join(directory, "manifest.ts"), "utf8")).toBe(
    "user content",
  )
})
