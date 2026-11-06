import type { Element, Root } from "hast"
import type { CompilerContext } from "../compiler/types"
import { toString } from "hast-util-to-string"

export { remarkTables } from "./tables"
export { visit } from "unist-util-visit"
export { toString } from "hast-util-to-string"

export function readMetadata(
  context: CompilerContext,
  fields: Record<string, (value: unknown) => unknown>,
  fallback: Record<string, unknown> = {},
  unknownFields: "preserve" | "reject" = "preserve",
): Record<string, unknown> {
  const value = context.frontmatter
  if (!value || typeof value !== "object" || Array.isArray(value))
    context.fail(
      "Frontmatter metadata must be a mapping",
      context.frontmatterPosition,
    )
  const output: Record<string, unknown> = {}
  for (const [name, raw] of Object.entries(value)) {
    const reader = Object.hasOwn(fields, name) ? fields[name] : undefined
    if (!reader) {
      if (unknownFields === "reject")
        context.fail(
          `Unknown metadata field ${name}`,
          context.frontmatterPosition,
        )
      continue
    }
    try {
      output[name] = reader(raw)
    } catch (error) {
      context.fail(
        `Invalid ${name}: ${error instanceof Error ? error.message : String(error)}`,
        context.frontmatterPosition,
      )
    }
  }
  return { ...fallback, ...output }
}

export function metadataString(value: unknown): string {
  if (typeof value !== "string" || !value.trim())
    throw new Error("Expected nonempty string")
  return value.trim()
}

export function consumeTitle(tree: Root) {
  const index = tree.children.findIndex(
    (node) => node.type !== "text" || node.value.trim(),
  )
  const node = tree.children[index]
  if (node?.type !== "element" || node.tagName !== "h1") return undefined
  tree.children.splice(index, 1)
  return toString(node)
}

export function staticHtml(element: Element, context: CompilerContext) {
  if (
    [
      "script",
      "iframe",
      "object",
      "embed",
      "style",
      "base",
      "link",
      "meta",
    ].includes(element.tagName)
  )
    context.fail(
      `Unsupported HTML element ${element.tagName}`,
      element.position,
    )
  for (const [key, value] of Object.entries(element.properties)) {
    if (/^on/i.test(key) || key === "srcDoc")
      context.fail(`Unsupported HTML attribute ${key}`, element.position)
    if (
      ["href", "src", "action", "formAction", "poster", "xLinkHref"].includes(
        key,
      ) &&
      typeof value === "string" &&
      /^(?:javascript|vbscript|data):/i.test(
        value
          .split("")
          .filter((character) => character.charCodeAt(0) > 32)
          .join(""),
      )
    )
      context.fail(`Unsupported HTML URL ${value}`, element.position)
  }
}
