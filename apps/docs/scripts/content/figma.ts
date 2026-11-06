import type { DirectiveRule } from "@yuzur1ha/markdown/compiler"
import { metadataString } from "@yuzur1ha/markdown/plugins"
import { resolve } from "node:path"
import { designUrl } from "#docs/figma/model"
export const figmaDirective: DirectiveRule = {
  kind: "leafDirective",
  render(node, context) {
    try {
      if (
        Object.keys(node.attributes).some(
          (key) => !["url", "title", "description"].includes(key),
        )
      )
        return context.fail("Unknown Figma preview attribute", node.position)
      const url = designUrl(metadataString(node.attributes.url)),
        title = metadataString(node.attributes.title)
      const description = node.attributes.description
        ? metadataString(node.attributes.description)
        : undefined
      return {
        component: {
          from: resolve(
            import.meta.dirname,
            "../../src/docs/figma/preview.tsx",
          ),
          name: "FigmaPreview",
        },
        props: { url, title, ...(description ? { description } : {}) },
      }
    } catch (error) {
      return context.fail(
        error instanceof Error ? error.message : "Invalid Figma preview",
        node.position,
      )
    }
  },
}
