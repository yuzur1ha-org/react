export type DocumentMetadata = {
  kind?: "page" | "guide"
  toc?: { id: string; title: string; level: number }[]
  title: string
  description: string
  created?: string
  updated?: string
  eyebrow?: string
  version?: string
}
