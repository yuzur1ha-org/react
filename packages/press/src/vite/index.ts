import { createMarkdownPlugin } from "@yuzur1ha/markdown/vite"
import { resolve } from "node:path"
import type { Plugin } from "vite"
import { inside } from "../node/project"
import { createCore, type DocumentationOptions } from "./core"

export type { DocumentationOptions } from "./core"
export type DocumentationFeatures = {
  markdown?: boolean
  content?: boolean
  sidebar?: boolean
}

export function createDocumentation(options: DocumentationOptions) {
  // A factory may create multiple presets; each invocation owns its runtime.
  const configuration = { ...options }
  return {
    plugins(features: DocumentationFeatures = {}): Plugin[] {
      const { markdown = true, content = true, sidebar = false } = features
      const { core, context } = createCore(configuration, sidebar, markdown)
      const plugins: Plugin[] = [core]

      if (markdown) {
        const plugin = createMarkdownPlugin({
          async resolveCompiled(id) {
            const document = await context.findDocument(id)
            if (
              !document &&
              inside(context.root, id) &&
              !(await context.isManagedByPeer(id))
            )
              throw new Error(
                `Markdown document is outside configured inventory: ${id}`,
              )
            return document?.compiled
          },
        })
        plugin.name = `yuzur1ha:${configuration.namespace}:markdown`
        plugins.push(plugin)
      }
      const virtualModule = (kind: "content" | "sidebar"): Plugin => {
        const id = `virtual:${configuration.namespace}${kind === "sidebar" ? "/sidebar" : ""}`
        return {
          name: `yuzur1ha:${configuration.namespace}:${kind}`,
          enforce: "pre",
          resolveId(source) {
            if (source === id) return `\0${id}`
          },
          async load(source) {
            if (source !== `\0${id}`) return
            const value = await context.ensure()
            if (kind === "sidebar")
              return `export default ${JSON.stringify(value.config.site?.sections ?? [])}`
            return `export { default } from ${JSON.stringify(resolve(value.outputDir, "manifest.ts"))}`
          },
        }
      }
      if (content) plugins.push(virtualModule("content"))
      if (sidebar) plugins.push(virtualModule("sidebar"))
      return plugins
    },
  }
}
