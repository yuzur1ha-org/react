import { contentRoute } from "@yuzur1ha/press/content"
import type { ProjectContext, YuPressPlugin } from "@yuzur1ha/press/node"
import { dirname, resolve } from "node:path"
import { compileDocument } from "./compile"
import { compileGuide } from "./guide"

function referenceCompiler(context: ProjectContext) {
  context.read("schemas/component-api.schema.json")
  return {
    async compile(source: string, path: string) {
      const id = path.split("/").at(-2)
      if (!id || id === "tokens")
        throw new Error(`Invalid component document ${path}`)
      const directory = resolve(context.root, dirname(path))
      const compiled = await compileDocument(
        id,
        source,
        (file) => context.read(resolve(directory, file)),
        directory,
        "@yuzur1ha/press-reference",
        context,
      )
      return {
        source: path,
        key: id,
        id,
        locale: "en",
        route: `/ui/${id}/`,
        metadata: compiled.metadata,
        compiled,
      }
    },
  }
}

export function referenceContent(): YuPressPlugin {
  return {
    name: "docs:reference",
    setup(context) {
      return {
        content: {
          test: (path) => path.startsWith("src/content/components/"),
          ...referenceCompiler(context),
        },
      }
    },
  }
}
export function guideContent(): YuPressPlugin {
  return {
    name: "docs:guides",
    setup(context) {
      return {
        content: {
          test: (path) => !path.startsWith("src/content/components/"),
          async compile(source, path) {
            const relative = path.slice("src/content/".length)
            const chinese = relative.startsWith("zh-cn/")
            const locale = chinese
              ? {
                  id: "zh-cn",
                  lang: "zh-CN",
                  label: "简体中文",
                  sourceDir: "zh-cn",
                  prefix: "/zh-cn",
                }
              : {
                  id: "en",
                  lang: "en",
                  label: "English",
                  sourceDir: "",
                  prefix: "",
                }
            const local = chinese ? relative.slice("zh-cn/".length) : relative
            const id =
              local === "index.md"
                ? "home"
                : local.endsWith("/index.md")
                  ? local.split("/").at(-2)
                  : local.replace(/\.md$/, "")
            if (!id) throw new Error(`Invalid guide path: ${path}`)
            const compiled = await compileGuide(
              source,
              path,
              context.resolve("src/pages/foundations/page.tsx"),
              context,
            )
            return {
              source: path,
              id,
              key: chinese ? `zh-cn:${id}` : id,
              locale: locale.id,
              route: contentRoute(local, locale),
              metadata: compiled.metadata,
              compiled,
            }
          },
        },
      }
    },
  }
}
