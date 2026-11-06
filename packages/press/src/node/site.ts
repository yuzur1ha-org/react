import {
  consumeTitle,
  metadataString,
  readMetadata,
  remarkTables,
  staticHtml,
  toString,
  visit,
} from "@yuzur1ha/markdown/plugins"
import { createHash } from "node:crypto"
import { basename, dirname, extname, relative, resolve } from "node:path"
import {
  contentRoute,
  deploymentHref,
  uniqueHeadingId,
  normalizeBase,
  type SiteOptions,
} from "../content/index"
import type { YuPressPlugin } from "./types"

export function assetName(path: string, bytes: Uint8Array) {
  return `${createHash("sha256").update(bytes).digest("hex").slice(0, 16)}${extname(path)}`
}

export function defaultContent(
  site: SiteOptions,
  srcDir = "content",
): YuPressPlugin {
  normalizeBase(site.base)
  return {
    name: "yupress:markdown",
    setup(context) {
      const contentRoot = resolve(context.root, srcDir)
      const identify = (path: string) => {
        const source = relative(
          contentRoot,
          resolve(context.root, path),
        ).replaceAll("\\", "/")
        const matches = site.locales.filter(
          (locale) =>
            !locale.sourceDir ||
            source.startsWith(locale.sourceDir.replace(/\/$/, "") + "/"),
        )
        matches.sort(
          (left, right) => right.sourceDir.length - left.sourceDir.length,
        )
        if (
          !matches.length ||
          (matches[1] &&
            matches[0]?.sourceDir.length === matches[1].sourceDir.length)
        )
          throw new Error(`Ambiguous or missing source locale: ${path}`)
        const locale = matches[0]
        if (!locale) throw new Error(`Missing locale: ${path}`)
        const local = locale.sourceDir
          ? source.slice(locale.sourceDir.replace(/\/$/, "").length + 1)
          : source
        return { locale, local, route: contentRoute(local, locale) }
      }
      const inventory = new Map(
        context.sources.map((path) => [resolve(path), identify(path).route]),
      )
      return {
        content: {
          test: () => true,
          async compile(source, path) {
            const { locale, local, route } = identify(path)
            const id = local.slice(0, -3)
            const compiled = await context.compileDocument(source, path, {
              html: staticHtml,
              remarkPlugins: [remarkTables],
              analyze(tree, compiler) {
                const title = consumeTitle(tree)
                const ids = new Set<string>()
                visit(tree, "element", (element) => {
                  const id = element.properties.id
                  if (typeof id !== "string") return
                  if (ids.has(id))
                    compiler.fail(
                      `Duplicate explicit ID: ${id}`,
                      element.position,
                    )
                  ids.add(id)
                })
                const toc: { id: string; title: string; level: number }[] = []
                visit(tree, "element", (element) => {
                  if (/^h[1-6]$/.test(element.tagName)) {
                    element.properties.id ??= uniqueHeadingId(
                      toString(element),
                      ids,
                    )
                    if (typeof element.properties.id === "string")
                      toc.push({
                        id: element.properties.id,
                        title: toString(element),
                        level: Number(element.tagName.slice(1)),
                      })
                  }
                  for (const attribute of ["href", "src"] as const) {
                    const value = element.properties[attribute]
                    if (
                      typeof value !== "string" ||
                      /^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(value)
                    )
                      continue
                    const [target, fragment] = value.split("#")
                    if (!target) continue
                    const absolute = resolve(
                      context.root,
                      dirname(path),
                      decodeURIComponent(target),
                    )
                    if (attribute === "href" && target.endsWith(".md")) {
                      const targetRoute =
                        inventory.get(absolute) ??
                        compiler.fail(
                          `Missing linked document: ${target}`,
                          element.position,
                        )
                      element.properties.href =
                        deploymentHref(site.base ?? "/", targetRoute) +
                        (fragment ? `#${fragment}` : "")
                    } else if (attribute === "src") {
                      if (!/\.(?:svg|png|jpe?g|webp|avif|gif)$/i.test(absolute))
                        compiler.fail(
                          `Unsupported image: ${target}`,
                          element.position,
                        )
                      const bytes = context.readBytes(absolute)
                      compiler.dependencies.add(absolute)
                      element.properties.src = deploymentHref(
                        site.base ?? "/",
                        "/_content/" + assetName(absolute, bytes),
                      )
                    }
                  }
                })
                return readMetadata(
                  compiler,
                  {
                    title: metadataString,
                    eyebrow: metadataString,
                    description: metadataString,
                    translationKey: metadataString,
                  },
                  {
                    toc,
                    title: title ?? basename(local, ".md"),
                    description: "",
                    translationKey: id,
                  },
                )
              },
            })
            return {
              source: path,
              id,
              key: `${locale.id}/${id}`,
              route,
              locale: locale.id,
              metadata: compiled.metadata,
              compiled,
            }
          },
        },
      }
    },
  }
}

export { publicSite } from "./site-model"
