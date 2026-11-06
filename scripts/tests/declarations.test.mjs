import { test } from "node:test"
import assert from "node:assert/strict"
import { resolve } from "node:path"
import { rewriteDeclaration } from "../build-declarations.mjs"
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
