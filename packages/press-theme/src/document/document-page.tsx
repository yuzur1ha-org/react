import { useContext, useEffect, useState, type ReactNode } from "react"
import { useDocumentHash } from "../navigation/use-document-hash"
import { type SiteDocument } from "@yuzur1ha/press/content"

import { useMessages, useSite } from "../context"
import {
  readingNavigation,
  ReadingNavigationContext,
} from "../navigation/navigation-model"
import {
  OutlineContext,
  OutlinePanel,
  type OutlineHeading,
} from "../navigation/outline"
import { DocumentPagination } from "./pagination"
import { documentStyles, tocStyles } from "./document.styles"
export function DocumentPage({
  document,
  children,
}: {
  document: SiteDocument
  children: ReactNode
}) {
  const site = useSite()
  const publishOutline = useContext(OutlineContext)
  useDocumentHash(document.key)
  const [ready, setReady] = useState(false)
  const [toc, setToc] = useState<OutlineHeading[]>(document.metadata.toc ?? [])
  const text = useMessages()
  useEffect(() => {
    setReady(true)
    const headings = Array.from(
      globalThis.document.querySelectorAll<HTMLElement>(
        "#main h2[id], #main h3[id]",
      ),
    ).map((heading) => ({
      id: heading.id,
      title: heading.textContent ?? "",
      level: Number(heading.tagName.slice(1)),
    }))
    setToc(headings)
    publishOutline?.({ documentKey: document.key, headings })
  }, [document.key, publishOutline])
  const layoutNavigation = useContext(ReadingNavigationContext)
  const directory =
    layoutNavigation?.document?.key === document.key
      ? layoutNavigation
      : readingNavigation(site, document, document.locale)
  const siblings = directory.sidebar
  const index = siblings.findIndex((item) => item.key === document.key)
  const previous = siblings[index - 1]
  const next = siblings[index + 1]
  return (
    <>
      <main
        id="main"
        className="press-document"
        css={documentStyles}
        data-press-ready={ready ? "true" : undefined}
        tabIndex={-1}
      >
        {children}
        <DocumentPagination previous={previous} next={next} />
      </main>
      {toc.length > 0 && (
        <aside className="press-toc" css={tocStyles}>
          <div className="press-toc-inner">
            <p>{text.toc}</p>
            <OutlinePanel headings={toc} />
          </div>
        </aside>
      )}
    </>
  )
}
