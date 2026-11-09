import { createContext } from "react"
import {
  sectionDocuments,
  type PublicSite,
  type SiteDocument,
} from "@yuzur1ha/press/content"
export function readingNavigation(
  site: PublicSite,
  document: SiteDocument | undefined,
  locale: string,
) {
  const section = site.sections.find((item) =>
    item.documents.some((key) => key === document?.key || key === document?.id),
  )
  const sidebar = section
    ? sectionDocuments(site, section, locale)
    : site.documents.filter((item) => item.locale === locale)
  const groups = section?.groups ?? [
    { id: "documents", label: "", documents: sidebar.map((item) => item.key) },
  ]
  return {
    groups,
    sidebar,
    ...(document ? { document } : {}),
    ...(section ? { section } : {}),
  }
}

export const ReadingNavigationContext = createContext<
  ReturnType<typeof readingNavigation> | undefined
>(undefined)
