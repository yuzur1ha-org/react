import { metadataString } from "@yuzur1ha/markdown/plugins"
import {
  contentRoute,
  englishMessages,
  normalizeBase,
  type PressMessages,
  type SiteOptions,
  type SiteDocument,
} from "../content/index"
export function messages(value: Partial<PressMessages> = {}) {
  for (const [key, text] of Object.entries(value)) {
    if (!(key in englishMessages) || typeof text !== "string" || !text.trim())
      throw new Error(`Invalid Press message: ${key}`)
  }
  return { ...value }
}
export function siteHref(value: string) {
  if (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("\\") &&
    ![...value].some((char) => char.charCodeAt(0) <= 32)
  )
    return value
  const url = new URL(value)
  if (!["https:", "http:"].includes(url.protocol))
    throw new Error(`Invalid site link: ${value}`)
  return url.href
}
export function homePages(site: SiteOptions, documents: SiteDocument[]) {
  const routes = new Set(documents.map((item) => item.route))
  return site.locales.flatMap((locale) => {
    const preset = locale.home ?? site.home
    if (!preset) return []
    const route = normalizeBase(
      preset.route ?? contentRoute("index.md", locale),
    )
    const document = preset.content
      ? documents.find(
          (item) =>
            item.locale === locale.id &&
            (item.key === preset.content || item.id === preset.content),
        )
      : undefined
    if (preset.content && !document)
      throw new Error(`Missing home content: ${locale.id}/${preset.content}`)
    if (document && document.route !== route)
      throw new Error(
        `Home content must use its Markdown route: ${document.route}`,
      )
    if (route === "/404/" || (routes.has(route) && document?.route !== route))
      throw new Error(`Home route conflicts with content: ${route}`)
    routes.add(route)
    return [
      {
        route,
        ...(document ? { document } : {}),
        locale: locale.id,
        hero: {
          ...(preset.hero.name
            ? { name: metadataString(preset.hero.name) }
            : {}),
          text: metadataString(preset.hero.text),
          ...(preset.hero.tagline
            ? { tagline: metadataString(preset.hero.tagline) }
            : {}),
          ...(preset.hero.image
            ? {
                image: {
                  src: siteHref(preset.hero.image.src),
                  alt: preset.hero.image.alt,
                },
              }
            : {}),
          actions: (preset.hero.actions ?? []).map((action) => {
            if (
              action.appearance &&
              !["primary", "secondary"].includes(action.appearance)
            )
              throw new Error("Invalid hero action appearance")
            return {
              ...action,
              text: metadataString(action.text),
              link: siteHref(action.link),
            }
          }),
        },
        features: (preset.features ?? []).map((feature) => ({
          title: metadataString(feature.title),
          description: metadataString(feature.description),
          ...(feature.link ? { link: siteHref(feature.link) } : {}),
        })),
      },
    ]
  })
}
export function siteFooter(site: SiteOptions) {
  return {
    ...(site.footer?.message !== undefined
      ? { message: metadataString(site.footer.message) }
      : {}),
    ...(site.footer?.copyright !== undefined
      ? { copyright: metadataString(site.footer.copyright) }
      : {}),
  }
}
