import type { PublicSite, SiteDocument, SiteSection } from "./types"
export function translatedDocument(
  site: PublicSite,
  document: SiteDocument,
  locale: string,
) {
  return site.documents.find(
    (target) =>
      target.translationKey === document.translationKey &&
      target.locale === locale,
  )
}

export function sectionDocuments(
  site: PublicSite,
  section: SiteSection,
  locale: string,
) {
  return section.documents.flatMap((key) => {
    const document = site.documents.find(
      (item) => item.locale === locale && (item.key === key || item.id === key),
    )
    return document ? [document] : []
  })
}
