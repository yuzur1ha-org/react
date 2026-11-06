import { mkdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { build, resolveConfig } from "vite"
import { expect, it } from "vitest"
import { createDocumentation } from "../../src/vite/index"
import { countGenerations, fixture } from "./vite-fixture"

it("rejects duplicate objects and namespaces independently of plugin names", async () => {
  const root = await fixture()
  const docs = createDocumentation({ namespace: "fixture" })
  const preset = docs.plugins()
  await expect(
    resolveConfig(
      { root, configFile: false, plugins: [preset, preset] },
      "build",
    ),
  ).rejects.toThrow("Duplicate")
  const other = createDocumentation({ namespace: "fixture" })
  await expect(
    resolveConfig(
      { root, configFile: false, plugins: [docs.plugins(), other.plugins()] },
      "build",
    ),
  ).rejects.toThrow("namespace")
})
it("composes feature switches with exactly one lifecycle owner", async () => {
  const docs = createDocumentation({ namespace: "fixture" })
  const defaults = docs.plugins()
  expect(defaults.map((plugin) => plugin.name.split(":").at(-1))).toEqual([
    "core",
    "markdown",
    "content",
  ])
  for (const markdown of [false, true])
    for (const content of [false, true])
      for (const sidebar of [false, true]) {
        const preset = docs.plugins({ markdown, content, sidebar })
        expect(preset.map((plugin) => plugin.name.split(":").at(-1))).toEqual([
          "core",
          ...(markdown ? ["markdown"] : []),
          ...(content ? ["content"] : []),
          ...(sidebar ? ["sidebar"] : []),
        ])
        for (const feature of preset.slice(1))
          for (const hook of [
            "configResolved",
            "buildStart",
            "configureServer",
            "watchChange",
            "closeBundle",
            "closeWatcher",
          ] as const)
            expect(feature[hook]).toBeUndefined()
        const config = await resolveConfig(
          { configFile: false, plugins: [preset] },
          "build",
        )
        expect(config.plugins).toEqual(expect.arrayContaining(preset))
      }
})
it("rejects repeated factory presets even with renamed plugins and isolates distinct namespaces", async () => {
  const docs = createDocumentation({ namespace: "fixture" })
  const first = docs.plugins()
  const second = docs.plugins({ sidebar: true })
  for (const plugin of [...first, ...second]) plugin.name = "renamed"
  await expect(
    resolveConfig({ configFile: false, plugins: [first, second] }, "build"),
  ).rejects.toThrow("namespace")
  await expect(
    resolveConfig(
      {
        configFile: false,
        plugins: [
          docs.plugins(),
          createDocumentation({ namespace: "other" }).plugins(),
        ],
      },
      "build",
    ),
  ).resolves.toBeDefined()
})
it("generates once for all build features and keeps independent presets isolated across concurrent builds", async () => {
  const roots = await Promise.all([fixture(), fixture()])
  const docs = createDocumentation({ namespace: "fixture" })
  const results = await Promise.all(
    roots.map(async (root, index) => {
      const count = await countGenerations(root)
      await writeFile(
        join(root, "content/hello.md"),
        `---\nid: greeting\n---\n# Unique title ${index}`,
      )
      await writeFile(
        join(root, "entry.js"),
        'import docs from "virtual:fixture"; import sidebar from "virtual:fixture/sidebar"; export {docs, sidebar}',
      )
      const result = await build({
        root,
        configFile: false,
        logLevel: "silent",
        plugins: [docs.plugins({ sidebar: true })],
        build: {
          write: false,
          lib: { entry: join(root, "entry.js"), formats: ["es"] },
          rollupOptions: { external: ["react/jsx-runtime"] },
        },
      })
      expect(await count()).toBe(1)
      return JSON.stringify(result)
    }),
  )
  expect(results[0]).toContain("Unique title 0")
  expect(results[0]).not.toContain("Unique title 1")
  expect(results[1]).toContain("Unique title 1")
  expect(results[1]).not.toContain("Unique title 0")
})
it("isolates two namespaces with separate inventories in the same Vite configuration", async () => {
  const root = await fixture()
  const config = await readFile(join(root, "yupress.config.ts"), "utf8")
  await mkdir(join(root, "other"))
  await writeFile(
    join(root, "other/hello.md"),
    "---\nid: other\n---\n# Other\n\nOther inventory body",
  )
  await writeFile(
    join(root, "other.ts"),
    config.replace(
      'content: { srcDir: "content" },',
      'content: { srcDir: "other" }, outputDir: "other-generated",',
    ),
  )
  await writeFile(
    join(root, "entry.js"),
    'import first from "virtual:fixture"; import second from "virtual:other"; export { first, second }',
  )
  const first = createDocumentation({ namespace: "fixture" })
  const second = createDocumentation({
    namespace: "other",
    configFile: "other.ts",
  })
  await expect(
    build({
      root,
      configFile: false,
      logLevel: "silent",
      plugins: [first.plugins(), second.plugins()],
      build: {
        write: false,
        lib: { entry: join(root, "entry.js"), formats: ["es"] },
        rollupOptions: { external: ["react/jsx-runtime"] },
      },
    }),
  ).resolves.toBeDefined()
  expect(
    await readFile(join(root, ".cache/press/documents.d.ts"), "utf8"),
  ).toContain('DocumentId = "greeting"')
  expect(
    await readFile(join(root, "other-generated/documents.d.ts"), "utf8"),
  ).toContain('DocumentId = "other"')
})
