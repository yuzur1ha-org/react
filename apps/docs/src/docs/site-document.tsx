import { defineDocument } from "@yuzur1ha/press/react"
import { type ComponentType } from "react"
import type { DocumentMetadata } from "./document.types"
import { ReferenceDocument } from "@yuzur1ha/press-reference"
import "../content/examples/shared.css"
import "../content/examples/scroll.css"
import "@yuzur1ha/token/fonts.css"

export function DocsDocument({
  metadata,
  Content,
}: {
  metadata: DocumentMetadata
  Content: ComponentType
}) {
  return metadata.kind === "page" ? (
    <Content />
  ) : (
    <ReferenceDocument metadata={metadata} Content={Content} />
  )
}

export default defineDocument({ Document: DocsDocument })
