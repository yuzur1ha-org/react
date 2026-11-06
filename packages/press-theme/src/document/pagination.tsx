import { ArrowLeft, ArrowRight } from "lucide-react"
import { paginationStyles } from "./pagination.styles"
import type { SiteDocument } from "@yuzur1ha/press/content"
import { SiteLink } from "../links"
import { useMessages } from "../context"
export function DocumentPagination({
  previous,
  next,
}: {
  previous: SiteDocument | undefined
  next: SiteDocument | undefined
}) {
  const text = useMessages()
  if (!previous && !next) return null
  return (
    <nav
      className="press-pagination"
      aria-label={text.documentNavigation}
      css={paginationStyles}
    >
      {previous && (
        <SiteLink href={previous.route} showIcon={false} underline={false}>
          <span className="press-pagination-copy">
            <small>
              <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
              {text.previous}
            </small>
            <strong>{previous.metadata.title}</strong>
          </span>
        </SiteLink>
      )}
      {next && (
        <SiteLink
          className="press-next"
          href={next.route}
          showIcon={false}
          underline={false}
        >
          <span className="press-pagination-copy">
            <small>
              {text.next}
              <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
            </small>
            <strong>{next.metadata.title}</strong>
          </span>
        </SiteLink>
      )}
    </nav>
  )
}
