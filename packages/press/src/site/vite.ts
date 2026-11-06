import { reactRouter } from "@react-router/dev/vite"
import type { CompiledDocument } from "@yuzur1ha/markdown/compiler"
import { createMarkdownPlugin } from "@yuzur1ha/markdown/vite"
import { readFileSync } from "node:fs"
import { writeFile } from "node:fs/promises"
import { join } from "node:path"
import { mergeConfig, type ConfigEnv, type InlineConfig } from "vite"
import { loadYuPressConfig } from "../node/config"
import type { ProjectOptions } from "../node/types"

export function createSiteVite(
  directory: string,
  base: string,
  command: "serve" | "build",
): InlineConfig {
  let cached = ""
  const modules = new Map<string, CompiledDocument<unknown>>()
  const strings = (value: unknown): value is string[] =>
    Array.isArray(value) &&
    value.every((item: unknown) => typeof item === "string")
  const object = (value: unknown): value is Record<string, unknown> =>
    !!value && typeof value === "object" && !Array.isArray(value)
  const markdown = createMarkdownPlugin({
    resolveCompiled(id) {
      const text = readFileSync(join(directory, "compiled.json"), "utf8")
      if (text !== cached) {
        const data: unknown = JSON.parse(text)
        if (object(data) && typeof data.error === "string")
          throw new Error(data.error)
        if (!Array.isArray(data)) throw new Error("Invalid compiled snapshot")
        modules.clear()
        for (const item of data as unknown[]) {
          if (
            !object(item) ||
            typeof item.source !== "string" ||
            typeof item.code !== "string" ||
            !strings(item.dependencies)
          )
            throw new Error("Invalid compiled document")
          const map = item.map
          let sourceMap: CompiledDocument<unknown>["map"]
          if (map != null) {
            if (
              !object(map) ||
              map.version !== 3 ||
              typeof map.mappings !== "string" ||
              !strings(map.names) ||
              !strings(map.sources)
            )
              throw new Error("Invalid document source map")
            sourceMap = {
              file: typeof map.file === "string" ? map.file : item.source,
              version: 3,
              mappings: map.mappings,
              names: map.names,
              sources: map.sources,
            }
            if (strings(map.sourcesContent))
              sourceMap.sourcesContent = map.sourcesContent
          }
          modules.set(item.source, {
            code: item.code,
            map: sourceMap,
            dependencies: item.dependencies,
            metadata: null,
            frontmatter: null,
          })
        }
        cached = text
      }
      return modules.get(id)
    },
  })
  return {
    root: directory,
    base,
    plugins: [
      markdown,
      reactRouter(),
      {
        name: "yupress:client-boundary",
        async generateBundle(_options, bundle) {
          if (this.environment.name !== "client") return
          const chunks = Object.values(bundle).flatMap((output) =>
            output.type === "chunk"
              ? [
                  {
                    fileName: output.fileName,
                    imports: output.imports,
                    dynamicImports: output.dynamicImports,
                    modules: Object.entries(output.modules)
                      .filter(([, module]) => module.renderedLength > 0)
                      .map(([id]) => id),
                  },
                ]
              : [],
          )
          const forbidden = chunks
            .flatMap((chunk) => chunk.modules)
            .filter((id) =>
              /(?:@mdx-js|@shikijs|node_modules\/(?:shiki|prism-react-renderer)\/|markdown\/dist\/(?:compiler|plugins)|node_modules\/(?:ajv|yaml|typescript)\/|press\/dist\/(?:node|site)|__vite-browser-external)/.test(
                id,
              ),
            )
          if (forbidden.length)
            throw new Error(
              `Build-only modules entered the client: ${forbidden.join(", ")}`,
            )
          await writeFile(
            join(directory, "client-chunks.json"),
            JSON.stringify(chunks, null, 2),
          )
        },
      },
    ],
    resolve: { dedupe: ["react", "react-dom"] },
    ssr: { noExternal: command === "build" ? true : ["@yuzur1ha/press"] },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-dom/client",
        "react-router/dom",
      ],
    },
  }
}

export async function resolveSiteVite(
  directory: string,
  base: string,
  options: ProjectOptions,
  environment: ConfigEnv,
): Promise<InlineConfig> {
  const { config } = await loadYuPressConfig({
    ...options,
    command: environment.command === "build" ? "build" : "dev",
  })
  const extension =
    typeof config.vite === "function"
      ? await config.vite(environment)
      : config.vite
  return extension
    ? mergeConfig(
        createSiteVite(directory, base, environment.command),
        extension,
      )
    : createSiteVite(directory, base, environment.command)
}
