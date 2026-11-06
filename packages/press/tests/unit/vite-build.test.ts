import { mkdir, rename, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { build, createServer, normalizePath } from "vite"
import { expect, it, vi } from "vitest"
import { createCore } from "../../src/vite/core"
import { createDocumentation } from "../../src/vite/index"
import { countGenerations, fixture } from "./vite-fixture"

it("builds literal lazy imports from the same generated index without requiring sidebar", async () => {
  const root = await fixture()
  await writeFile(
    join(root, "content/hidden.md"),
    "---\nid: hidden\n---\n# Hidden",
  )
  const docs = createDocumentation({ namespace: "fixture" })
  const result = await build({
    root,
    configFile: false,
    logLevel: "silent",
    plugins: [docs.plugins()],
    build: {
      write: false,
      lib: { entry: join(root, "entry.js"), formats: ["es"] },
      rollupOptions: { external: ["react", "react/jsx-runtime"] },
    },
  })
  const outputs = (Array.isArray(result) ? result : [result]).flatMap((item) =>
    "output" in item ? item.output : [],
  )
  const chunks = outputs.filter((item) => item.type === "chunk")
  expect(chunks).toHaveLength(3)
  expect(chunks.some((chunk) => chunk.code.includes("Hidden"))).toBe(true)
  expect(chunks.some((chunk) => chunk.code.includes("remark"))).toBe(false)
})
it("validates all inventory documents at build start, including unvisited documents", async () => {
  const root = await fixture()
  await writeFile(
    join(root, "content/invalid.md"),
    "---\nid: invalid\ntitle: false\n---\n# Fallback",
  )
  const docs = createDocumentation({ namespace: "fixture" })
  await expect(
    build({
      root,
      configFile: false,
      logLevel: "silent",
      plugins: [docs.plugins()],
      build: {
        write: false,
        lib: { entry: join(root, "entry.js"), formats: ["es"] },
      },
    }),
  ).rejects.toThrow("Invalid title")
})
it("reports an enabled sidebar without an application navigation adapter", async () => {
  const root = await fixture()
  await rm(join(root, "yupress.config.ts"))
  const docs = createDocumentation({ namespace: "fixture" })
  await expect(
    build({
      root,
      configFile: false,
      logLevel: "silent",
      plugins: [docs.plugins({ sidebar: true })],
      build: {
        write: false,
        lib: { entry: join(root, "entry.js"), formats: ["es"] },
      },
    }),
  ).rejects.toThrow("Missing YuPress configuration")
})
it.each([
  {
    features: { content: false },
    entry: 'export { default } from "./content/hello.md"',
    external: [],
  },
  {
    features: { markdown: false },
    entry: 'export { default } from "virtual:fixture"',
    external: [/\.md$/],
  },
  {
    features: { markdown: false, content: false, sidebar: true },
    entry: 'export { default } from "virtual:fixture/sidebar"',
    external: [],
  },
])(
  "builds independently enabled features: $features",
  async ({ features, entry, external }) => {
    const root = await fixture()
    const count = await countGenerations(root)
    await writeFile(join(root, "entry.js"), entry)
    await expect(
      build({
        root,
        configFile: false,
        logLevel: "silent",
        plugins: [
          createDocumentation({ namespace: "fixture" }).plugins(features),
        ],
        build: {
          write: false,
          lib: { entry: join(root, "entry.js"), formats: ["es"] },
          rollupOptions: { external: ["react/jsx-runtime", ...external] },
        },
      }),
    ).resolves.toBeDefined()
    expect(await count()).toBe(1)
  },
)
it("reuses normalized snapshot lookups and replaces the index after rename and deletion", async () => {
  const root = await fixture()
  const { core, context } = createCore({ namespace: "lookup" }, false, true)
  const server = await createServer({
    root,
    configFile: false,
    logLevel: "silent",
    plugins: [core],
    server: { middlewareMode: true, watch: null },
  })
  const source = join(root, "content/hello.md")
  const moved = join(root, "content/你好 world.md")
  try {
    const snapshot = await context.ensure()
    const index = vi.spyOn(snapshot.documents, "map")
    const document = snapshot.documents[0]
    expect(await context.findDocument(source)).toBe(document)
    expect(await context.findDocument(normalizePath(source))).toBe(document)
    expect(
      await context.findDocument(
        normalizePath(join(root, "content")) + "/../content/hello.md",
      ),
    ).toBe(document)
    expect(await context.findDocument(source + "?raw")).toBeUndefined()
    expect(await context.findDocument(source + "?url")).toBeUndefined()
    expect(await context.findDocument(join(root, "missing.md"))).toBeUndefined()
    expect(index).toHaveBeenCalledTimes(1)
    await rename(source, moved)
    await expect
      .poll(async () => (await context.findDocument(moved))?.source)
      .toBe("content/你好 world.md")
    expect(await context.findDocument(source)).toBeUndefined()
    await rm(moved)
    await expect
      .poll(async () => await context.findDocument(moved))
      .toBeUndefined()
  } finally {
    await server.close()
  }
}, 15000)
it("leaves raw and url Markdown imports to Vite, while rejecting unmanaged bare imports", async () => {
  const root = await fixture()
  await mkdir(join(root, "unmanaged"))
  await writeFile(join(root, "unmanaged/outside.md"), "# Unmanaged source text")
  await writeFile(
    join(root, "entry.js"),
    `
    import raw from "./unmanaged/outside.md?raw"
    import url from "./unmanaged/outside.md?url"
    import managedRaw from "./content/hello.md?raw"
    export { raw, url, managedRaw }
  `,
  )
  const options = {
    root,
    configFile: false as const,
    logLevel: "silent" as const,
    build: {
      write: false,
      lib: { entry: join(root, "entry.js"), formats: ["es" as const] },
    },
  }
  const result = await build({
    ...options,
    plugins: [createDocumentation({ namespace: "fixture" }).plugins()],
  })
  const outputs = (Array.isArray(result) ? result : [result]).flatMap((item) =>
    "output" in item ? item.output : [],
  )
  expect(
    outputs.some(
      (item) =>
        item.type === "chunk" && item.code.includes("# Unmanaged source text"),
    ),
  ).toBe(true)
  expect(
    outputs.some(
      (item) => item.type === "chunk" && item.code.includes("# Hello"),
    ),
  ).toBe(true)
  await writeFile(
    join(root, "entry.js"),
    'export { default } from "./unmanaged/outside.md"',
  )
  await expect(
    build({
      ...options,
      plugins: [createDocumentation({ namespace: "fixture" }).plugins()],
    }),
  ).rejects.toThrow("outside configured inventory")
  const other = await fixture()
  const external = normalizePath(join(other, "content/hello.md"))
  await writeFile(
    join(root, "entry.js"),
    `export { default } from ${JSON.stringify(external)}`,
  )
  await expect(
    build({
      ...options,
      plugins: [
        createDocumentation({ namespace: "fixture" }).plugins(),
        {
          name: "external-markdown-owner",
          enforce: "pre",
          transform(_code, id) {
            if (id === external) return 'export default "External owner"'
          },
        },
      ],
    }),
  ).resolves.toBeDefined()
})
