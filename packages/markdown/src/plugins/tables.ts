import type {} from "remark-parse"
import type { Processor } from "unified"
import { gfmTable } from "micromark-extension-gfm-table"
import { gfmTableFromMarkdown } from "mdast-util-gfm-table"
export function remarkTables(this: Processor) {
  const data = this.data()
  const syntax = data.micromarkExtensions ?? (data.micromarkExtensions = [])
  const from = data.fromMarkdownExtensions ?? (data.fromMarkdownExtensions = [])
  syntax.push(gfmTable())
  from.push(gfmTableFromMarkdown())
}
