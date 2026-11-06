import type { ProjectContext } from "@yuzur1ha/press/node"
import { compileDocument } from "@yuzur1ha/markdown/compiler"
import {
  consumeTitle,
  metadataString,
  readMetadata,
  remarkTables,
  staticHtml,
  toString,
  visit,
} from "@yuzur1ha/markdown/plugins"
import { uniqueHeadingId } from "@yuzur1ha/press/content"
import { wrapProse } from "./prose"
import { figmaDirective } from "./figma"
import type { DocumentMetadata } from "#docs/document.types"

export function compileGuide(
  source: string,
  path: string,
  renderer: string,
  project?: ProjectContext,
) {
  return (project?.compileDocument ?? compileDocument)(source, path, {
    html: staticHtml,
    remarkPlugins: [remarkTables],
    analyze(tree, context): DocumentMetadata {
      const title = consumeTitle(tree)
      const fields = readMetadata(
        context,
        {
          title: metadataString,
          description: metadataString,
          eyebrow: metadataString,
          layout: (value: unknown) => {
            if (value !== "page") throw new Error("Unsupported page layout")
            return value
          },
        },
        { title, description: "" },
        "reject",
      )
      if (typeof fields.title !== "string")
        return context.fail("Missing guide title")
      const toc: NonNullable<DocumentMetadata["toc"]> = []
      const ids = new Set<string>()
      visit(tree, "element", (element) => {
        const id = element.properties.id
        if (typeof id !== "string") return
        if (ids.has(id))
          context.fail(`Duplicate explicit ID: ${id}`, element.position)
        ids.add(id)
      })
      visit(tree, "element", (element) => {
        if (!/^h[2-6]$/.test(element.tagName)) return
        const label = toString(element)
        const id =
          typeof element.properties.id === "string"
            ? element.properties.id
            : uniqueHeadingId(label, ids)
        element.properties.id = id
        toc.push({ id, title: label, level: Number(element.tagName.slice(1)) })
      })
      wrapProse(tree)
      return {
        title: fields.title,
        ...(typeof fields.eyebrow === "string"
          ? { eyebrow: fields.eyebrow }
          : {}),
        description:
          typeof fields.description === "string" ? fields.description : "",
        kind: fields.layout === "page" ? "page" : "guide",
        toc,
      }
    },
    directives: {
      figma: figmaDirective,
      foundations: {
        kind: "leafDirective",
        render() {
          return { component: { from: renderer } }
        },
      },
    },
  })
}
