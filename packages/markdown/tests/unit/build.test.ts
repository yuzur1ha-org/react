import { execFile } from "node:child_process"
import { readFile, mkdtemp, mkdir, cp, writeFile, rm } from "node:fs/promises"
import { createRequire } from "node:module"
import { resolve } from "node:path"
import { promisify } from "node:util"
import { expect, it } from "vitest"
import packageJson from "../../package.json" with { type: "json" }

const root = resolve(import.meta.dirname, "../..")
const execute = promisify(execFile)

it("keeps every public JavaScript and declaration entry available after bundling", async () => {
  for (const entry of Object.values(packageJson.exports)) {
    if ("import" in entry)
      expect(
        (await readFile(resolve(root, entry.import), "utf8")).trim(),
      ).not.toBe("")
    expect(
      (await readFile(resolve(root, entry.types), "utf8")).trim(),
    ).not.toBe("")
  }
})

it("loads bundled public entries in native Node without Vite resolution", async () => {
  const script = `
    const root = await import("@yuzur1ha/markdown")
    const compiler = await import("@yuzur1ha/markdown/compiler")
    const plugins = await import("@yuzur1ha/markdown/plugins")
    const vite = await import("@yuzur1ha/markdown/vite")
    if (root.compileDocument !== compiler.compileDocument) throw new Error("Compiler identity changed")
    for (const value of [root.compileDocument, plugins.readMetadata, vite.createMarkdownPlugin]) {
      if (typeof value !== "function") throw new Error("Missing public export")
    }
    console.log("Native Node exports ready")
  `
  const result = await execute(
    process.execPath,
    ["--input-type=module", "-e", script],
    { cwd: root },
  )
  expect(result.stdout.trim()).toBe("Native Node exports ready")
})

it("delivers an opt-in Markdown shim through reference and tsconfig without changing query imports", async () => {
  const consumer = await mkdtemp(resolve(root, ".consumer-"))
  const tsc = createRequire(import.meta.url).resolve("typescript/bin/tsc")
  try {
    const packaged = resolve(consumer, "node_modules/@yuzur1ha/markdown")
    await mkdir(packaged, { recursive: true })
    expect(packageJson.files).toContain("dist")
    await cp(resolve(root, "dist"), resolve(packaged, "dist"), {
      recursive: true,
    })
    await writeFile(
      resolve(packaged, "package.json"),
      JSON.stringify(packageJson),
    )
    await writeFile(
      resolve(consumer, "entry.ts"),
      `
      import Content from "./document.md"
      import raw from "./document.md?raw"
      import url from "./document.md?url"
      const component: import("react").ComponentType = Content
      const source: string = raw
      const address: string = url
      // @ts-expect-error The Markdown shim exports a component, not source text.
      const text: string = Content
      void [component, source, address, text]
    `,
    )
    const config = resolve(consumer, "tsconfig.json")
    const configure = async (types: string[]) => {
      await writeFile(
        config,
        JSON.stringify({
          compilerOptions: {
            target: "ES2022",
            module: "ESNext",
            moduleResolution: "Bundler",
            strict: true,
            noEmit: true,
            skipLibCheck: false,
            types,
          },
          files: ["entry.ts"],
        }),
      )
    }
    await configure(["vite/client", "@yuzur1ha/markdown/client"])
    await expect(
      execute(process.execPath, [tsc, "-p", config]),
    ).resolves.toBeDefined()
    const source = await readFile(resolve(consumer, "entry.ts"), "utf8")
    await configure(["vite/client"])
    await writeFile(
      resolve(consumer, "entry.ts"),
      '/// <reference types="@yuzur1ha/markdown/client" />\n' + source,
    )
    await expect(
      execute(process.execPath, [tsc, "-p", config]),
    ).resolves.toBeDefined()
    await writeFile(
      resolve(consumer, "entry.ts"),
      'import "@yuzur1ha/markdown"\nimport Content from "./document.md"\nvoid Content',
    )
    await expect(
      execute(process.execPath, [tsc, "-p", config]),
    ).rejects.toHaveProperty(
      "stdout",
      expect.stringContaining("Cannot find module './document.md'"),
    )
  } finally {
    await rm(consumer, { recursive: true, force: true })
  }
}, 15000)
