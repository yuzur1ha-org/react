import { useReferenceMessages } from "../messages"
import type { ReferenceMetadata } from "../types"
import { styles } from "./document-header.styles"
import {
  documentDates,
  formatDocumentDate,
  formatDocumentVersion,
} from "./metadata"

export function DocumentHeader({ metadata }: { metadata: ReferenceMetadata }) {
  const text = useReferenceMessages()
  const dates = documentDates(metadata)
  return (
    <header className="document-header" css={styles}>
      {(metadata.eyebrow || metadata.version) && (
        <div className="document-kicker">
          {metadata.eyebrow && <span>{metadata.eyebrow}</span>}
          {metadata.version && (
            <span className="document-version">
              <span className="visually-hidden">{text.version} </span>
              {metadata.version.toLowerCase() === "draft"
                ? text.draft
                : formatDocumentVersion(metadata.version)}
            </span>
          )}
        </div>
      )}
      <h1>{metadata.title}</h1>
      {metadata.description && (
        <p className="document-description">{metadata.description}</p>
      )}
      {dates.length > 0 && (
        <div className="document-details">
          <dl className="component-metadata">
            {dates.map((date) => (
              <div key={date.label}>
                <dt>
                  {date.label === "Created" ? text.created : text.updated}
                </dt>
                <dd>
                  <time
                    dateTime={date.value}
                    title={
                      metadata.created === metadata.updated
                        ? `${text.created} ${formatDocumentDate(date.value)}`
                        : undefined
                    }
                  >
                    {formatDocumentDate(date.value)}
                  </time>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </header>
  )
}
