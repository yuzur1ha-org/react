import { test } from "node:test"
import assert from "node:assert/strict"
import { publicChanges, versionOnlyChange } from "../changeset-policy.mjs"
test("version PRs may update internal ranges but cannot change external dependencies or exports", () => {
  const before = {
    version: "0.1.0",
    dependencies: { "@yuzur1ha/token": "^0.1.0", react: "^19" },
    exports: { ".": "./dist/index.js" },
  }
  const after = {
    ...before,
    version: "0.2.0",
    dependencies: { ...before.dependencies, "@yuzur1ha/token": "^0.2.0" },
  }
  assert.equal(versionOnlyChange(before, after), true)
  assert.equal(
    versionOnlyChange(before, {
      ...after,
      dependencies: { ...after.dependencies, react: "^20" },
    }),
    false,
  )
  assert.equal(
    versionOnlyChange(before, { ...after, exports: { ".": "./src/index.ts" } }),
    false,
  )
  assert.equal(versionOnlyChange(before, before), false)
})
test("public source, config and bin changes require release review", () => {
  assert.deepEqual(
    publicChanges([
      "packages/ui/src/button.tsx",
      "packages/press/bin/yupress.mjs",
      "packages/token/vite.config.ts",
      "README.md",
      "packages/ui/tests/foo.test.ts",
    ]),
    [
      "packages/ui/src/button.tsx",
      "packages/press/bin/yupress.mjs",
      "packages/token/vite.config.ts",
    ],
  )
})
