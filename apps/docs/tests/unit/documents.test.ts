import { readFileSync } from "node:fs"
import { expect, it } from "vitest"
import { compileDocument } from "../../scripts/content/compile"
import { componentIds } from "../helpers/inventory"
const source = `---
title: Button
created: 2026-10-24
updated: 2026-10-24
version: draft
---
# Consumed title

Description.

::demo{src="./demo.tsx" export="ButtonDemo"}

## API

::schema{src="./schema.json"}
`
const schema = {
  component: "button",
  parts: [
    {
      name: "Button",
      typeName: "ButtonProps",
      description: "A native action.",
      props: [],
      methods: [],
    },
  ],
}
const read = (file: string) => {
  if (file === "./demo.tsx")
    return "export function ButtonDemo() { return <button>Action</button> }"
  if (file === "./schema.json") return JSON.stringify(schema)
  throw new Error(`Missing ${file}`)
}
const compile = (content = source) => compileDocument("button", content, read)
it("compiles metadata, static Demo imports and original source and schema components without flat blocks", async () => {
  const result = await compile()
  expect(result.metadata).toEqual({
    title: "Button",
    description: "Description.",
    toc: [{ id: "api", title: "API", level: 2 }],
    created: "2026-10-24",
    updated: "2026-10-24",
    version: "draft",
  })
  expect(result.demos).toEqual([
    { file: "./demo.tsx", exportName: "ButtonDemo" },
  ])
  expect(result.schemas).toEqual([schema])
  expect(result.code).toContain("export function ButtonDemo()")
  expect(result.code).not.toContain("demo.tsx?raw")
  expect(result.code).not.toContain("Consumed title")
})
it("consumes a leading HTML H1 and uses decoded visible text fallbacks", async () => {
  const result = await compile(
    source
      .replace(/^---[\s\S]*?---/, "---\nextra: value\n---")
      .replace("extra: value\n", "")
      .replace("# Consumed title", "<h1>HTML &amp; title</h1>"),
  )
  expect(result.metadata).toEqual({
    title: "HTML & title",
    description: "Description.",
    toc: [{ id: "api", title: "API", level: 2 }],
  })
  expect(
    (await compile(source.replace("title: Button", 'title: "Quoted title"')))
      .metadata.title,
  ).toBe("Quoted title")
})
it.each([
  ["title: Button", "title: false"],
  ["title: Button", "title: Button\ntitle: Duplicate"],
  ["version: draft", "unknown: value"],
  ["version: draft", "constructor: value"],
  ["updated: 2026-10-24", "updated: 2026-02-30"],
  ["updated: 2026-10-24", "updated: 2025-10-24"],
  ["./demo.tsx", "../demo.tsx"],
  ['export="ButtonDemo"', 'export="Missing"'],
  ["./schema.json", "./missing.json"],
  ["## API", "# Unexpected H1"],
  ["## API", "<script>bad()</script>"],
])("rejects invalid metadata/references: %s", async (before, after) => {
  await expect(compile(source.replace(before, after))).rejects.toThrow()
})
it("renders HTML while keeping fenced directives inert", async () => {
  const result = await compile(
    source.replace(
      "Description.",
      '<span class="label">HTML</span>\n\n```text\n::demo{src="./missing.tsx"}\n```',
    ),
  )
  expect(result.code).toContain('className: "label"')
  expect(result.code).toContain("./missing.tsx")
})
it("rejects invalid schema members and missing demos", async () => {
  for (const invalid of [
    { ...schema, component: "link" },
    { ...schema, parts: [...schema.parts, ...schema.parts] },
    { ...schema, parts: [{ name: "Bad" }] },
  ])
    await expect(
      compileDocument("button", source, (file) =>
        file.endsWith(".json") ? JSON.stringify(invalid) : read(file),
      ),
    ).rejects.toThrow()
  await expect(compile(source.replace(/^::demo.*$/m, ""))).rejects.toThrow(
    "needs a demo",
  )
})
it("compiles all shipped documents and their real TSX/schema references", async () => {
  for (const id of componentIds) {
    const directory = new URL(
      `../../src/content/components/${id}/`,
      import.meta.url,
    )
    const result = await compileDocument(
      id,
      readFileSync(new URL("index.md", directory), "utf8"),
      (file) => readFileSync(new URL(file, directory), "utf8"),
    )
    expect(result.metadata.title).toBeTruthy()
    expect(result.demos.length).toBeGreaterThan(0)
    for (const schema of result.schemas)
      expect(schema.parts.every((part) => part.methods.length === 0)).toBe(true)
  }
})

it.each(["guide", "reference"] as const)(
  "keeps %s heading anchors unique and preserves explicit HTML IDs",
  async (kind) => {
    const { compileGuide } = await import("../../scripts/content/guide")
    const body =
      '## Heading\n\n## Heading-1\n\n## Heading\n\n## Kept\n\n<h2 id="kept">Explicit</h2>'
    const result =
      kind === "guide"
        ? await compileGuide(`# Title\n\n${body}`, "guide.md", "unused")
        : await compile(source.replace("## API", body))
    expect(result.metadata.toc?.map((heading) => heading.id)).toEqual([
      "heading",
      "heading-1",
      "heading-2",
      "kept-1",
      "kept",
    ])
    const invalid = '<h2 id="same">One</h2>\n\n<span id="same">Two</span>'
    const compileInvalid = () =>
      kind === "guide"
        ? compileGuide(`# Title\n\n${invalid}`, "guide.md", "unused")
        : compile(source.replace("## API", invalid))
    await expect(compileInvalid()).rejects.toThrow(
      "Duplicate explicit ID: same",
    )
  },
)
