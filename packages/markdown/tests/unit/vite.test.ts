import { mkdtemp, writeFile, rm } from "node:fs/promises"
import { resolve, join } from "node:path"
import { build } from "vite"
import { expect, it } from "vitest"
import { createMarkdownPlugin } from "../../src/vite"

it("builds a standalone Markdown consumer without a project, manifest or Press", async () => {
  const root = await mkdtemp(resolve(import.meta.dirname, "../../.standalone-"))
  try {
    await writeFile(
      join(root, "page.md"),
      "# Standalone document\n\n<p>Static HTML</p>",
    )
    await writeFile(
      join(root, "entry.js"),
      'export { default } from "./page.md"',
    )
    const result = await build({
      root,
      configFile: false,
      logLevel: "silent",
      plugins: [createMarkdownPlugin()],
      build: {
        write: false,
        lib: { entry: join(root, "entry.js"), formats: ["es"] },
        rolldownOptions: { external: ["react/jsx-runtime"] },
      },
    })
    const outputs = (Array.isArray(result) ? result : [result]).flatMap(
      (output) => ("output" in output ? output.output : []),
    )
    const code = outputs
      .flatMap((output) => (output.type === "chunk" ? [output.code] : []))
      .join("\n")
    expect(code).toContain("Standalone document")
    expect(code).toContain("Static HTML")
    expect(code).not.toMatch(/press|watchProject|manifest|compileDocument/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
