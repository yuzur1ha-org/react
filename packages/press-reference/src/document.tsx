import { styles } from "./document.styles"
import type { ComponentType } from "react"
import { DocumentHeader } from "./header/document-header"
import type { ReferenceMetadata } from "./types"
export function ReferenceDocument({
  metadata,
  Content,
}: {
  metadata: ReferenceMetadata
  Content: ComponentType
}) {
  return (
    <article className="component-document" css={styles}>
      <DocumentHeader metadata={metadata} />
      <Content />
    </article>
  )
}
