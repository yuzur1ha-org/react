import type { PressMessages } from "./messages"
export type ContentDocument<Metadata = unknown> = {
  source: string
  id: string
  key: string
  route?: string
  locale?: string
  metadata: Metadata
}

export type ContentLocale = {
  id: string
  lang: string
  label: string
  shortLabel?: string
  sourceDir: string
  prefix: string
  messages?: Partial<PressMessages>
  home?: HomePreset
}
export type SiteSection = {
  id: string
  label: string
  documents: string[]
  groups?: { id: string; label: string; documents: string[] }[]
  labels?: Record<string, string>
}
export type HeroAction = {
  text: string
  link: string
  appearance?: "primary" | "secondary"
}
export type HomePreset = {
  content?: string
  route?: string
  hero: {
    name?: string
    text: string
    tagline?: string
    actions?: HeroAction[]
    image?: { src: string; alt: string }
  }
  features?: { title: string; description: string; link?: string }[]
}
export type SiteHome = HomePreset & {
  route: string
  locale: string
  document?: SiteDocument
}
export type SiteFooter = {
  message?: string
  copyright?: string
}
export type SiteHeaderLink = {
  label: string
  href: string
  icon?: "github"
}
export type SiteOptions = {
  home?: HomePreset
  footer?: SiteFooter
  messages?: Partial<PressMessages>
  title: string
  description?: string
  base?: string
  logo?: { from: string; alt: string }
  favicon?: string
  themeStorageKey?: string
  locales: ContentLocale[]
  sections?: SiteSection[]
  links?: SiteHeaderLink[]
}
export type SiteDocument = ContentDocument<{
  title: string
  eyebrow?: string
  description?: string
  toc?: { id: string; title: string; level: number }[]
}> & {
  route: string
  locale: string
  translationKey: string
}
export type PublicSite = {
  homes: SiteHome[]
  footer: SiteFooter
  messages: Partial<PressMessages>
  title: string
  description: string
  base: string
  links: SiteHeaderLink[]
  logo?: { src: string; alt: string }
  favicon?: string
  themeStorageKey: string
  locales: ContentLocale[]
  sections: SiteSection[]
  documents: SiteDocument[]
}
