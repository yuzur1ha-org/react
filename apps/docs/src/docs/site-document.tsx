import { defineDocument } from "@yuzur1ha/press/react"
import { type ComponentType } from "react"
import type { DocumentMetadata } from "./document.types"
import { ReferenceDocument } from "@yuzur1ha/press-reference"
import { Global } from "@emotion/react"
import { sharedStyles } from "../content/examples/shared.styles"
import { scrollStyles } from "../content/examples/scroll.styles"
import "@yuzur1ha/token/fonts.css"

export function DocsDocument({
  metadata,
  Content,
}: {
  metadata: DocumentMetadata
  Content: ComponentType
}) {
  return (
    <>
      <Global styles={[sharedStyles, scrollStyles]} />
      {metadata.kind === "page" ? (
        <Content />
      ) : (
        <ReferenceDocument metadata={metadata} Content={Content} />
      )}
    </>
  )
}

export default defineDocument({ Document: DocsDocument })
