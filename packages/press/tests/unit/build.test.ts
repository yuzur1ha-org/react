import { execFile } from "node:child_process"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { promisify } from "node:util"
import { expect, it } from "vitest"
import packageJson from "../../package.json" with { type: "json" }

const root = resolve(import.meta.dirname, "../..")
it("delivers native Node APIs and a CLI while keeping content free of runtime imports", async () => {
  for (const entry of Object.values(packageJson.exports)) {
    if (typeof entry === "string") continue
    expect(
      (await readFile(resolve(root, entry.import), "utf8")).trim(),
    ).not.toBe("")
    expect(
      (await readFile(resolve(root, entry.types), "utf8")).trim(),
    ).not.toBe("")
  }
  const content = await readFile(resolve(root, "dist/content/index.js"), "utf8")
  expect(content).not.toMatch(/node:|react|vite|theme|i18next/)
  const cli = await readFile(resolve(root, packageJson.bin.yupress), "utf8")
  expect(cli.startsWith("#!/usr/bin/env node\n")).toBe(true)
  const execute = promisify(execFile)
  const result = await execute(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `
    const content = await import('@yuzur1ha/press/content')
    const node = await import('@yuzur1ha/press/node')
    const config = await import('@yuzur1ha/press')
    const vite = await import('@yuzur1ha/press/vite')
    if (typeof content.validateDocuments !== 'function' || typeof node.generate !== 'function' || typeof config.defineConfig !== 'function' || 'defineDocumentation' in node || 'defineSite' in node || typeof vite.createDocumentation !== 'function') throw new Error('Missing public export')
    console.log('Press exports ready')
  `,
    ],
    { cwd: root },
  )
  expect(result.stdout.trim()).toBe("Press exports ready")
})
