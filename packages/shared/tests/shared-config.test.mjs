import { test } from "vitest"
import assert from "node:assert/strict"
import { libraryConfig } from "@yuzur1ha/shared/vite"

test("library config externalizes runtime dependency subpaths without hiding undeclared or development dependencies", () => {
  const config = libraryConfig({
    root: "/fixture",
    entry: { index: "src/index.ts" },
    target: "es2022",
    manifest: {
      dependencies: { "@example/runtime": "^1" },
      peerDependencies: { react: "^19" },
      optionalDependencies: { "optional-runtime": "^1" },
    },
  })
  const external = config.build.rolldownOptions.external
  for (const id of [
    "node:fs",
    "fs/promises",
    "@example/runtime/subpath",
    "react/jsx-runtime",
    "optional-runtime/subpath",
  ])
    assert.equal(external(id), true, id)
  for (const id of ["./internal", "@example/runtime-other", "reactive", "vite"])
    assert.equal(external(id), false, id)
  assert.equal(config.build.target, "es2022")
  assert.deepEqual(config.build.lib.entry, { index: "src/index.ts" })
})
