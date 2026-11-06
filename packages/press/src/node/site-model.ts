import { metadataString } from "@yuzur1ha/markdown/plugins"
import {
  normalizeBase,
  validateSections,
  type PublicSite,
  type SiteDocument,
} from "../content/index"
import {
  homePages,
  messages as validateMessages,
  siteFooter,
} from "./site-options"
import type { ProjectSnapshot } from "./types"

export function publicSite(snapshot: ProjectSnapshot): PublicSite {
  const site = snapshot.config.site
  if (!site || !site.title || !site.locales.length)
    throw new Error("A site title and locales are required")
  const ids = new Set<string>()
  for (const locale of site.locales) {
    if (
      !/^[a-z0-9-]+$/.test(locale.id) ||
      ids.has(locale.id) ||
      !locale.lang ||
      !locale.label ||
      (locale.shortLabel !== undefined &&
        (typeof locale.shortLabel !== "string" || !locale.shortLabel.trim()))
    )
      throw new Error(`Invalid locale: ${locale.id}`)
    ids.add(locale.id)
  }
  const documents: SiteDocument[] = snapshot.documents.map((document) => {
    const metadata = document.metadata
    if (
      !metadata ||
      typeof metadata !== "object" ||
      !("title" in metadata) ||
      typeof metadata.title !== "string"
    )
      throw new Error(`Missing title: ${document.key}`)
    const locale =
      document.locale ??
      (site.locales.length === 1 ? site.locales[0]?.id : undefined)
    if (
      !locale ||
      !ids.has(locale) ||
      !document.route ||
      document.route === "/404/"
    )
      throw new Error(`Invalid site route or locale: ${document.key}`)
    if (
      !document.route.startsWith("/") ||
      !document.route.endsWith("/") ||
      /(?:^|\/)\.\.?(?:\/|$)|[?#\\]/.test(document.route)
    )
      throw new Error(`Invalid route: ${document.route}`)
    const toc: { id: string; title: string; level: number }[] = []
    if ("toc" in metadata && Array.isArray(metadata.toc))
      for (const heading of metadata.toc as unknown[]) {
        if (
          !heading ||
          typeof heading !== "object" ||
          !("id" in heading) ||
          !("title" in heading) ||
          !("level" in heading) ||
          typeof heading.id !== "string" ||
          typeof heading.title !== "string" ||
          typeof heading.level !== "number"
        )
          throw new Error(`Invalid TOC: ${document.key}`)
        toc.push({ id: heading.id, title: heading.title, level: heading.level })
      }
    return {
      source: document.source,
      id: document.id,
      key: document.key,
      locale,
      route: document.route,
      translationKey:
        "translationKey" in metadata &&
        typeof metadata.translationKey === "string"
          ? metadata.translationKey
          : document.id,
      metadata: {
        title: metadata.title,
        ...("eyebrow" in metadata
          ? { eyebrow: metadataString(metadata.eyebrow) }
          : {}),
        toc,
        ...("description" in metadata &&
        typeof metadata.description === "string"
          ? { description: metadata.description }
          : {}),
      },
    }
  })
  const translations = new Set<string>()
  for (const document of documents) {
    const key = `${document.locale}/${document.translationKey}`
    if (translations.has(key)) throw new Error(`Duplicate translation: ${key}`)
    translations.add(key)
  }
  const homes = homePages(site, documents)
  const reading = documents.filter(
    (item) => !homes.some((home) => home.document?.key === item.key),
  )
  validateSections(site.sections ?? [], reading)

  return {
    homes,
    messages: validateMessages(site.messages),
    footer: siteFooter(site),
    title: site.title,
    description: site.description ?? "",
    base: normalizeBase(site.base),
    links: (site.links ?? []).map(({ label, href, icon }) => {
      const url = new URL(href)
      if (!["https:", "http:"].includes(url.protocol))
        throw new Error(`Invalid external link: ${href}`)
      if (icon !== undefined && icon !== "github")
        throw new Error(`Unsupported header icon: ${String(icon)}`)
      return {
        label: metadataString(label),
        href: url.href,
        ...(icon ? { icon } : {}),
      }
    }),
    themeStorageKey: site.themeStorageKey ?? "yupress-theme",
    locales: site.locales.map(
      ({ id, lang, label, shortLabel, sourceDir, prefix, messages }) => ({
        id,
        lang,
        label,
        ...(shortLabel !== undefined ? { shortLabel } : {}),
        sourceDir,
        prefix,
        ...(messages ? { messages: validateMessages(messages) } : {}),
      }),
    ),
    sections: (site.sections ?? []).map(
      ({ id, label, documents, groups, labels }) => ({
        id,
        label,
        documents: [...documents],
        ...(groups
          ? {
              groups: groups.map(({ id, label, documents }) => ({
                id,
                label,
                documents: [...documents],
              })),
            }
          : {}),
        ...(labels
          ? {
              labels: Object.fromEntries(
                Object.entries(labels).map(([key, value]) => [
                  key,
                  metadataString(value),
                ]),
              ),
            }
          : {}),
      }),
    ),
    documents: reading,
  }
}
