import type { ContentDocument, SiteSection } from "./types"

export function validateSections(
  sections: readonly SiteSection[],
  documents: readonly ContentDocument[],
) {
  const sectionIds = new Set<string>()
  const known = new Set(documents.flatMap(({ key, id }) => [key, id]))
  for (const section of sections) {
    if (!section.id || sectionIds.has(section.id) || !section.label.trim())
      throw new Error(`Invalid or duplicate section: ${section.id}`)
    sectionIds.add(section.id)
    const entries = new Set(section.documents)
    if (!entries.size || entries.size !== section.documents.length)
      throw new Error(`Empty or duplicate section documents: ${section.id}`)
    for (const key of entries)
      if (!known.has(key)) throw new Error(`Unknown section document: ${key}`)
    const groups = new Set<string>()
    const grouped = new Set<string>()
    for (const group of section.groups ?? []) {
      if (!group.id || groups.has(group.id))
        throw new Error(`Invalid or duplicate sidebar group: ${group.id}`)
      groups.add(group.id)
      for (const key of group.documents) {
        if (!entries.has(key))
          throw new Error(`Sidebar document is outside section: ${key}`)
        if (grouped.has(key))
          throw new Error(`Duplicate sidebar document: ${key}`)
        grouped.add(key)
      }
    }
    if (section.groups && grouped.size !== entries.size)
      throw new Error(`Sidebar coverage mismatch: ${section.id}`)
    for (const [key, label] of Object.entries(section.labels ?? {})) {
      if (!entries.has(key) || !label.trim())
        throw new Error(`Invalid sidebar label: ${key}`)
    }
  }
}
