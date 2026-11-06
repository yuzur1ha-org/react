import { createElement, type ComponentType } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { SourceMapConsumer } from "source-map"
import { pathToFileURL } from "node:url"
import { writeFile, mkdtemp, rm } from "node:fs/promises"
import { join, resolve } from "node:path"
import { build } from "vite"
import react from "@vitejs/plugin-react"
import { expect, it } from "vitest"
import { compileDocument } from "../../src/compiler/index"
import {
  consumeTitle,
  readMetadata,
  metadataString,
  staticHtml,
  toString,
  visit,
} from "../../src/plugins/index"

const fixture = resolve(
  import.meta.dirname,
  "../fixtures/compiler/renderer.tsx",
)
const compile = (source: string) =>
  compileDocument(source, "example.md", {
    directives: {
      note: {
        kind: "containerDirective",
        render: () => ({ component: { from: fixture, name: "Note" } }),
      },
      term: {
        kind: "textDirective",
        render: () => ({ component: { from: fixture, name: "Term" } }),
      },
      empty: {
        kind: "leafDirective",
        render: () => ({ component: { from: fixture, name: "Note" } }),
      },
    },
    html: staticHtml,
    analyze(tree, context) {
      const title = consumeTitle(tree)
      const headings: string[] = []
      visit(tree, "element", (node) => {
        if (/^h[1-6]$/.test(node.tagName)) headings.push(toString(node))
      })
      return {
        ...readMetadata(context, { title: metadataString }, { title }),
        headings,
      }
    },
  })

it("compiles nested directives and HTML to React ESM with static imports and original source maps", async () => {
  const result = await compile(
    '---\ntitle: Explicit\nextra:\n  list: [1, true]\n---\n# Consumed\n\n:::note\n## 中文\n\n<span class="label" style="color:red">HTML &amp; text</span> :term[Token]\n\n::empty\n:::\n\n<h2>HTML heading</h2>',
  )
  expect(result.metadata).toEqual({
    title: "Explicit",
    headings: ["中文", "HTML heading"],
  })
  expect(result.frontmatter).toEqual({
    title: "Explicit",
    extra: { list: [1, true] },
  })
  expect(result.code).toContain("import {Note as _documentImport")
  expect(result.code).toContain('className: "label"')
  expect(result.code).toContain('color: "red"')
  expect(result.code).not.toContain('children: "Consumed"')
  expect(result.map?.sources).toEqual(["example.md"])
  expect(result.map?.mappings).not.toBe("")
})

it("builds the real compiled module, renderer TSX and CSS in Vite without a browser parser", async () => {
  const directory = await mkdtemp(
    resolve(import.meta.dirname, "../../.pipeline-"),
  )
  try {
    const result = await compile(
      ":::note\nNested :term[Token] and <br> HTML.\n:::",
    )
    await writeFile(join(directory, "entry.js"), result.code)
    const output = await build({
      configFile: false,
      root: directory,
      plugins: [react()],
      logLevel: "silent",
      build: {
        write: false,
        sourcemap: true,
        lib: { entry: join(directory, "entry.js"), formats: ["es"] },
        rollupOptions: { external: ["react", "react/jsx-runtime"] },
      },
    })
    const builds = Array.isArray(output) ? output : [output]
    const files = builds.flatMap((item) =>
      "output" in item ? item.output : [],
    )
    expect(files.some((item) => item.fileName.endsWith(".css"))).toBe(true)
    const chunk = files.find((item) => item.type === "chunk")
    expect(chunk?.type === "chunk" ? chunk.code : "").toContain("fixture-note")
    expect(chunk?.type === "chunk" ? chunk.code : "").not.toContain("remark")
    if (chunk?.type !== "chunk") throw new Error("Missing document chunk")
    for (const item of files)
      if (item.type === "asset" && item.fileName.endsWith(".map"))
        await writeFile(join(directory, item.fileName), item.source)
    await writeFile(join(directory, "render.mjs"), chunk.code)
    const loaded: unknown = await import(
      pathToFileURL(join(directory, "render.mjs")).href
    )
    const isDocument = (value: unknown): value is { default: ComponentType } =>
      !!value &&
      typeof value === "object" &&
      "default" in value &&
      typeof value.default === "function"
    if (!isDocument(loaded)) throw new Error("Missing document component")
    expect(renderToStaticMarkup(createElement(loaded.default))).toContain(
      '<aside class="fixture-note"><p>Nested <abbr>Token</abbr> and <br/> HTML.</p></aside>',
    )
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

it("keeps HTML code literal, expressions/imports inert and standard HTML-block Markdown semantics", async () => {
  const result = await compile(
    '`<script>code</script>`\n\n```html\n<img src=x>\n```\n\n{globalThis.bad = true}\n\nimport x from "bad"\n\n<div>\n**literal**\n</div>\n\n<div>\n\n**Markdown**\n\n</div>',
  )
  expect(result.code).toContain("<script>code</script>")
  expect(result.code).toContain("**literal**")
  expect(result.code).toContain("strong")
  expect(result.code).not.toContain('import x from "bad";')
})

it.each([
  "<script>bad()</script>",
  '<button onclick="bad()">Bad</button>',
  '<a href="javascript:bad()">Bad</a>',
  ":missing[Bad]",
  "::note",
  "---\ntitle: [bad\n---\nText",
  "---\ntitle: false\n---\n# Fallback",
])(
  "rejects invalid syntax/policy with original file context: %s",
  async (source) => {
    await expect(compile(source)).rejects.toThrow()
  },
)

it("reports directive positions after BOM/CRLF frontmatter and keeps escaped directives inert", async () => {
  await expect(
    compile("\uFEFF---\r\ntitle: Test\r\n---\r\n\r\n::missing"),
  ).rejects.toMatchObject({ line: 5, column: 1 })
  expect(
    (await compile("\\:missing[Text]\n\n```text\n::missing\n```")).code,
  ).toContain(":missing")
})

it("maps generated heading text back to the original line after frontmatter", async () => {
  const result = await compile(
    "---\ntitle: Explicit\n---\n# Consumed\n\n## Mapped",
  )
  if (!result.map) throw new Error("Missing source map")
  const offset = result.code.indexOf('"Mapped"')
  const prefix = result.code.slice(0, offset)
  const lines = prefix.split("\n")
  const consumer = await new SourceMapConsumer(JSON.stringify(result.map))
  try {
    expect(
      consumer.originalPositionFor({
        line: lines.length,
        column: lines.at(-1)?.length ?? 0,
      }),
    ).toMatchObject({ source: "example.md", line: 6 })
  } finally {
    consumer.destroy()
  }
})

it("preserves nested containers and permits non-mapping YAML data before application readers", async () => {
  const nested = await compile(
    "::::note\n:::note\nInner :term[Token]\n:::\n::::",
  )
  expect(
    nested.code.match(/_jsx\(_documentImport\d+,/g)?.length,
  ).toBeGreaterThanOrEqual(3)
  const parsed = await compileDocument(
    "---\n- one\n- two: true\n---\nBody",
    "data.md",
    { analyze: (_tree, context) => context.frontmatter },
  )
  expect(parsed.frontmatter).toEqual(["one", { two: true }])
  expect(parsed.frontmatterSource).toContain("- two: true")
  expect(parsed.frontmatterPosition?.start.line).toBe(1)
})

it("does not interpret YAML data that resembles an imported binding as JavaScript", async () => {
  const result = await compileDocument(
    "---\ntype: binding\nname: globalThis\n---\n::empty",
    "data.md",
    {
      analyze: () => ({}),
      directives: {
        empty: {
          kind: "leafDirective",
          render: (_node, context) => ({
            component: { from: fixture, name: "Note" },
            props: { payload: context.frontmatter },
          }),
        },
      },
    },
  )
  expect(result.code).toMatch(/"?type"?: "binding"/)
  expect(result.code).toMatch(/"?name"?: "globalThis"/)
  expect(result.code).not.toContain("payload: globalThis")
})

it("renders standard elements after analysis with preserved children and positions", async () => {
  let line: number | undefined
  const result = await compileDocument("> quoted\n\n`inline`\n", "quote.md", {
    analyze: () => ({}),
    elementRenderers: {
      blockquote(element) {
        line = element.position?.start.line
        return {
          component: { from: "./quote.tsx", name: "Quote" },
          props: { kind: "note" },
          children: element.children,
        }
      },
      code() {
        return undefined
      },
    },
  })
  expect(line).toBe(1)
  expect(result.code).toContain("Quote")
  expect(result.code).toContain('children: "quoted"')
  expect(result.code).toContain('children: "inline"')
  expect(result.dependencies).toContain("./quote.tsx")
  await expect(
    compileDocument('<h1 onclick="bad()">Title</h1>', "unsafe.md", {
      html: staticHtml,
      analyze(tree) {
        tree.children = []
        return {}
      },
      elementRenderers: {
        h1() {
          return { component: { from: "./safe.tsx" } }
        },
      },
    }),
  ).rejects.toThrow()
})
