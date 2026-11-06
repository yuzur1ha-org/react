import { wrapProse } from "./prose"
import { isIsoDate } from "@yuzur1ha/markdown"
import type {
  CompilerContext,
  CompilerOptions,
} from "@yuzur1ha/markdown/compiler"
import {
  consumeTitle,
  metadataString,
  readMetadata,
  toString,
  visit,
} from "@yuzur1ha/markdown/plugins"
import { uniqueHeadingId } from "@yuzur1ha/press/content"
import type { DocumentMetadata } from "#docs/document.types"
type Root = Parameters<CompilerOptions<DocumentMetadata>["analyze"]>[0]
export function analyzeReference(
  id: string,
  tree: Root,
  context: CompilerContext,
): DocumentMetadata {
  const title = consumeTitle(tree)
  const paragraph = tree.children.find(
    (node) => node.type === "element" && node.tagName === "p",
  )
  const fields = readMetadata(
    context,
    Object.fromEntries(
      ["title", "description", "created", "updated", "eyebrow", "version"].map(
        (name) => [name, metadataString],
      ),
    ),
    { title, description: paragraph ? toString(paragraph) : "" },
    "reject",
  )
  if (typeof fields.title !== "string" || !fields.title)
    context.fail("Missing title")
  const toc: NonNullable<DocumentMetadata["toc"]> = []
  const ids = new Set<string>()
  visit(tree, "element", (node) => {
    const id = node.properties.id
    if (typeof id !== "string") return
    if (ids.has(id)) context.fail(`Duplicate explicit ID: ${id}`, node.position)
    ids.add(id)
  })
  visit(tree, "element", (node) => {
    if (/^h[2-6]$/.test(node.tagName)) {
      const title = toString(node)
      const id =
        typeof node.properties.id === "string"
          ? node.properties.id
          : uniqueHeadingId(title, ids)
      node.properties.id = id
      toc.push({ id, title, level: Number(node.tagName.slice(1)) })
    }
    if (node.tagName === "h1")
      context.fail("Only the metadata heading may use H1", node.position)
  })
  for (const key of ["created", "updated"])
    if (typeof fields[key] === "string" && !isIsoDate(fields[key]))
      context.fail(`Invalid ${key} date`)
  if (
    typeof fields.created === "string" &&
    typeof fields.updated === "string" &&
    fields.created > fields.updated
  )
    context.fail("updated precedes created")
  wrapProse(tree)
  return {
    ...(toc.length ? { toc } : {}),
    title: typeof fields.title === "string" ? fields.title : id,
    description:
      typeof fields.description === "string" ? fields.description : "",
    ...(typeof fields.created === "string" ? { created: fields.created } : {}),
    ...(typeof fields.updated === "string" ? { updated: fields.updated } : {}),
    ...(typeof fields.eyebrow === "string" ? { eyebrow: fields.eyebrow } : {}),
    ...(typeof fields.version === "string" ? { version: fields.version } : {}),
  }
}
