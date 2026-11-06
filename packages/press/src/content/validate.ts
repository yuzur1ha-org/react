import type { ContentDocument } from "./types"
export function validateDocuments(documents: readonly ContentDocument[]) {
  const keys = new Set<string>()
  const routes = new Set<string>()
  for (const document of documents) {
    if (!document.id || !document.key || keys.has(document.key))
      throw new Error(`Duplicate or empty document key: ${document.key}`)
    keys.add(document.key)
    if (document.route && routes.has(document.route))
      throw new Error(`Duplicate document route: ${document.route}`)
    if (document.route) routes.add(document.route)
  }
  return keys
}
