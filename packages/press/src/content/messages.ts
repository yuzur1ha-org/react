import type { PublicSite } from "./types"

export const englishMessages = {
  menu: "Documentation",
  menuButton: "Documentation",
  close: "Close",
  sections: "Sections",
  theme: "Theme",
  darkTheme: "Dark theme",
  language: "Language",
  previous: "Previous",
  next: "Next",
  toc: "On this page",
  loading: "Loading document",
  missing:
    "This translation is unavailable. Choose a document in this language.",
  skip: "Skip to content",
  navigation: "Navigation",
  documentNavigation: "Document navigation",
  home: "Home",
  overview: "Overview",
  docs: "Docs",
  poweredBy: "Powered by YuPress",
  notFound: "Page not found",
  notFoundDescription:
    "This address has no page. Find your way back home, and take a different path.",
  returnHome: "Return home",
  loadFailed: "Unable to load document",
  loadFailedDescription: "Retry or choose another document.",
  retry: "Retry",
  version: "Version",
  draft: "Draft",
  created: "Created",
  updated: "Updated",
  playground: "Playground",
  loadingSource: "Loading source",
  source: "Example source code",
  copyCode: "Copy code",
  copy: "Copy",
  copied: "Copied",
  codeCopied: "Code copied.",
  copyFailed: "Copy unavailable. Select the code to copy it.",
  property: "Property",
  type: "Type",
  required: "Required",
  default: "Default",
  description: "Description",
  yes: "Yes",
  no: "No",
  table: "Table",
  properties: "properties",
  methods: "methods",
  method: "Method",
  signature: "Signature",
  inheritedProperties:
    "Uses inherited React attributes without additional properties.",
  noMethods:
    "No custom imperative methods. Event callbacks are listed as properties.",
}
export type PressMessages = { [Key in keyof typeof englishMessages]: string }
export function resolveMessages(
  site: Pick<PublicSite, "messages" | "locales"> | undefined,
  locale?: string,
): PressMessages {
  return {
    ...englishMessages,
    ...site?.messages,
    ...site?.locales.find((item) => item.id === locale)?.messages,
  }
}
