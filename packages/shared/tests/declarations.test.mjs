import { test } from "vitest"
import assert from "node:assert/strict"
import { resolve } from "node:path"
import { rewriteDeclaration } from "@yuzur1ha/shared/declarations"
test("resolves file and directory imports, export types and import types", () => {
  const base = resolve("fixture"),
    file = resolve(base, "index.d.ts")
  const result = rewriteDeclaration(
    'import type { A } from "./a"; export type { B } from "./folder"; type C = import("./a").A;',
    file,
    new Set([resolve(base, "a.d.ts"), resolve(base, "folder/index.d.ts")]),
  )
  assert.match(result, /"\.\/a\.js"/)
  assert.match(result, /"\.\/folder\/index\.js"/)
  assert.match(result, /import\("\.\/a\.js"\)/)
})
test("rejects missing modules and private aliases", () => {
  assert.throws(
    () =>
      rewriteDeclaration(
        'export * from "./missing"',
        resolve("index.d.ts"),
        new Set(),
      ),
    /Unresolved/,
  )
  assert.throws(
    () =>
      rewriteDeclaration(
        'export * from "#private"',
        resolve("index.d.ts"),
        new Set(),
      ),
    /Private/,
  )
})

test("builds custom output and only copies explicitly configured shims", async () => {
  const { buildDeclarations } = await import("@yuzur1ha/shared/declarations")
  const { mkdtemp, mkdir, writeFile, readFile, rm } =
    await import("node:fs/promises")
  const { tmpdir } = await import("node:os")
  const root = await mkdtemp(resolve(tmpdir(), "shared-declarations-"))
  try {
    await mkdir(resolve(root, "src"))
    await writeFile(
      resolve(root, "src/foo.ts"),
      "export interface Foo {value: string}",
    )
    await writeFile(
      resolve(root, "shim.ts"),
      'declare module "*.fixture" { type Value = import("./foo").Foo }',
    )
    await writeFile(
      resolve(root, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          strict: true,
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "Bundler",
          declaration: true,
          rootDir: "src",
          types: [],
        },
        include: ["src"],
      }),
    )
    await buildDeclarations({
      root,
      config: "tsconfig.json",
      outDir: "output",
      temporaryDir: "generated",
      shims: [{ source: "shim.ts", target: "client.d.ts" }],
    })
    assert.match(
      await readFile(resolve(root, "output/foo.d.ts"), "utf8"),
      /interface Foo/,
    )
    assert.match(
      await readFile(resolve(root, "output/client.d.ts"), "utf8"),
      /import\("\.\/foo\.js"\)/,
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
