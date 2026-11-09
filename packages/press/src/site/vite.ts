import { reactRouter } from "@react-router/dev/vite"
import { compiledDocumentResolver } from "./compiled"
import { createMarkdownPlugin } from "@yuzur1ha/markdown/vite"
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
  const markdown = createMarkdownPlugin({
    resolveCompiled: compiledDocumentResolver(directory),
  })
  // Press reloads after publishing a complete snapshot and route manifest.
  const router = reactRouter().filter(
    (plugin) =>
      command === "build" ||
      (plugin.name !== "react-router:hmr-updates" &&
        plugin.name !== "react-router-server-change-trigger-client-hmr"),
  )
  return {
    root: directory,
    base,
    plugins: [
      markdown,
      router,
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
