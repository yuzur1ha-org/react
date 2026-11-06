import { afterEach, expect, it, vi } from "vitest"
import { remarkTables, staticHtml } from "@yuzur1ha/markdown/plugins"
import { createCodeService, validateCodeOptions } from "../../src/node/code"
const sessions: ReturnType<typeof createCodeService>[] = []
function service(options?: Parameters<typeof createCodeService>[0]) {
  const item = createCodeService(options)
  sessions.push(item)
  return item
}
afterEach(async () => {
  for (const item of sessions.splice(0)) await item.dispose()
  vi.restoreAllMocks()
})
it.each(["ts", "tsx", "json", "yaml", "bash", "html", "css"])(
  "highlights %s and preserves exact source",
  async (language) => {
    const examples: Record<string, string> = {
      ts: 'const value: string = "中文 <>&"',
      tsx: '<Button title="中文">Save</Button>',
      json: '{"ok": true}',
      yaml: "ok: true",
      bash: 'echo "$HOME"',
      html: '<button class="ok">Save</button>',
      css: ".ok { color: red; }",
    }
    const source = examples[language] + "\n\n"
    const result = await service().highlightCode(source, language)
    expect(result.source).toBe(source)
    expect(
      result.lines
        .map((line) => line.map((token) => token.text).join(""))
        .join("\n"),
    ).toBe(source)
    expect(
      result.lines
        .flat()
        .some((token) => token.color?.startsWith("var(--yu-code-token-")),
    ).toBe(true)
  },
)
it("supports aliases, allowlists, dual themes and all plain modes", async () => {
  const item = service({ languages: ["typescript"] })
  expect(
    (await item.highlightCode("const n=1", "ts")).lines
      .flat()
      .some((token) => token.color),
  ).toBe(true)
  expect((await item.highlightCode("print(1)", "python")).lines).toEqual([
    [{ text: "print(1)" }],
  ])
  for (const language of [undefined, "text", "unknown-lang"]) {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const plain = await item.highlightCode("", language)
    expect(plain.lines).toEqual([[{ text: "" }]])
    if (language === "unknown-lang") expect(warn).toHaveBeenCalledOnce()
    warn.mockRestore()
  }
  const dual = await service({
    theme: { light: "github-light", dark: "github-dark" },
  }).highlightCode("const n=1", "ts")
  expect(
    dual.lines.flat().some((token) => token.color !== token.darkColor),
  ).toBe(true)
  expect(
    (await service({ highlight: false, copy: false }).highlightCode("x", "ts"))
      .copy,
  ).toBe(false)
  expect((await service(false).highlightCode("x", "ts")).enhanced).toBe(false)
})
it.each([
  true,
  null,
  { languages: ["bad-lang"] },
  { theme: { light: "bad", dark: "github-dark" } },
  { copy: "yes" },
  { anything: true },
])("rejects invalid configuration %j", (options) => {
  expect(() => validateCodeOptions(options)).toThrow()
})
it("enhances nested Markdown after analysis, retains table alignment and leaves raw HTML/inline code alone", async () => {
  const source =
    "> ```ts\n> const n = 1\n> ```\n\n    indented\n\n`inline`\n\n<pre><code>raw</code></pre>\n\n| Left | Right |\n| :--- | ---: |\n| a | b |"
  const result = await service().compileDocument(source, "nested.md", {
    remarkPlugins: [remarkTables],
    html: staticHtml,
    analyze(tree) {
      tree.children = [
        {
          type: "element",
          tagName: "div",
          properties: { className: ["prose"] },
          children: tree.children.filter(
            (node) => node.type === "element" || node.type === "text",
          ),
        },
      ]
      return {}
    },
  })
  expect(result.code).toContain("CodeBlock")
  expect(result.code).toContain("MarkdownTable")
  expect(result.code).toContain('textAlign: "right"')
  expect(result.code).toContain('children: "raw"')
  expect(result.code).toContain('children: "inline"')
  const plain = await service(false).compileDocument(source, "plain.md", {
    analyze: () => ({}),
    remarkPlugins: [remarkTables],
  })
  expect(plain.code).not.toContain("CodeBlock")
  expect(plain.code).toContain("MarkdownTable")
  await expect(
    service().compileDocument('<pre onclick="bad()">bad</pre>', "unsafe.md", {
      analyze: () => ({}),
      html: staticHtml,
    }),
  ).rejects.toThrow()
})

it("scopes custom compiler links to the deployment base exactly once", async () => {
  const { mkdtemp, mkdir, writeFile, rm } = await import("node:fs/promises")
  const { tmpdir } = await import("node:os")
  const { join } = await import("node:path")
  const { analyzeProject } = await import("../../src/node/project")
  const root = await mkdtemp(join(tmpdir(), "press-code-base-"))
  try {
    await mkdir(join(root, "content"))
    await writeFile(
      join(root, "content/guide.md"),
      "# Guide\n\n[Moved](/markdown/typography/)\n\n[Scoped](/manual/ui/)\n\n![Asset](/logo.svg)\n\n[External](https://example.com)",
    )
    await writeFile(
      join(root, "yupress.config.ts"),
      `export default {content:{srcDir:"content"},site:{title:"Base",base:"/manual/",locales:[{id:"en",lang:"en",label:"English",sourceDir:"",prefix:""}]},plugins:[{name:"custom",setup(context){return {content:{test:()=>true,async compile(source,path){const compiled=await context.compileDocument(source,path,{analyze:()=>({title:"Guide"})});return {source:path,id:"guide",key:"guide",locale:"en",route:"/guide/",metadata:compiled.metadata,compiled}}}}}}]}`,
    )
    const result = await analyzeProject({ root })
    const code = result.documents[0]?.compiled.code ?? ""
    expect(code).toContain('href: "/manual/markdown/typography/"')
    expect(code).toContain('href: "/manual/ui/"')
    expect(code).toContain('src: "/manual/logo.svg"')
    expect(code).toContain('href: "https://example.com"')
    expect(code).not.toContain("/manual/manual/")
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
