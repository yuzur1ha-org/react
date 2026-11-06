import type { Plugin } from "vite"
import {
  compileDocument,
  type CompilerOptions,
  type CompiledDocument,
} from "../compiler/index"

export type MarkdownPluginOptions = {
  compiler?: CompilerOptions<unknown>
  resolveCompiled?: (
    id: string,
  ) =>
    | CompiledDocument<unknown>
    | undefined
    | Promise<CompiledDocument<unknown> | undefined>
}

export function createMarkdownPlugin(
  options: MarkdownPluginOptions = {},
): Plugin {
  return {
    name: "yuzur1ha:markdown",
    enforce: "pre",
    async transform(source, id) {
      if (!id.endsWith(".md")) return
      const result = options.resolveCompiled
        ? await options.resolveCompiled(id)
        : await compileDocument(
            source,
            id,
            options.compiler ?? { analyze: () => ({}) },
          )
      if (!result) return
      for (const path of result.dependencies) this.addWatchFile(path)
      return {
        code: result.code,
        map: result.map ? { ...result.map, sources: [id] } : null,
      }
    },
  }
}
