import { expect, it } from "vitest"
import { resolveMessages, type SiteOptions } from "../../src/content/index"
import { homePages, messages, siteHref } from "../../src/node/site-options"
import { parseCli } from "../../src/node/cli-options"
const locales = [
  {
    id: "fr",
    lang: "fr",
    label: "Français",
    sourceDir: "fr",
    prefix: "fr",
    messages: { menu: "Documents" },
  },
  { id: "en", lang: "en", label: "English", sourceDir: "en", prefix: "" },
]
it("resolves configured language, common overrides and English independently", () => {
  const site = { locales, messages: { menu: "Library", theme: "Appearance" } }
  expect(resolveMessages(site, "fr")).toMatchObject({
    menu: "Documents",
    theme: "Appearance",
    next: "Next",
  })
  expect(resolveMessages(site, "en").menu).toBe("Library")
  expect(resolveMessages(undefined).menu).toBe("Documentation")
  expect(() => messages({ menu: " " })).toThrow()
})
it("projects locale home presets without replacing content routes", () => {
  const site: SiteOptions = {
    title: "Fixture",
    locales,
    home: {
      hero: { text: "Welcome", actions: [{ text: "Guide", link: "/guide/" }] },
    },
  }
  expect(homePages(site, []).map((home) => home.route)).toEqual(["/fr/", "/"])
  expect(
    homePages(
      {
        ...site,
        locales: [
          {
            ...locales[0],
            id: "fr",
            lang: "fr",
            label: "French",
            sourceDir: "fr",
            prefix: "fr",
            home: { hero: { text: "Bonjour" } },
          },
        ],
      },
      [],
    )[0]?.hero.text,
  ).toBe("Bonjour")
  expect(() =>
    homePages({ ...site, home: { route: "/../", hero: { text: "Bad" } } }, []),
  ).toThrow()
  expect(() =>
    homePages(
      { ...site, home: { route: "/same/", hero: { text: "Bad" } } },
      [],
    ),
  ).toThrow("conflicts")
  for (const link of [
    "javascript:alert(1)",
    "//evil.example",
    "/\\evil.example",
  ])
    expect(() => siteHref(link)).toThrow()
})
it("parses mri equal and separated flags and rejects missing, repeated or unknown options", () => {
  expect(
    parseCli(["build", "--root=/tmp/manual", "--out-dir", "output"]).args,
  ).toMatchObject({ root: "/tmp/manual", "out-dir": "output" })
  for (const args of [
    ["dev", "--root"],
    ["dev", "--unknown"],
    ["dev", "--root=a", "--root=b"],
    ["build", "extra"],
  ])
    expect(() => parseCli(args)).toThrow()
})

it("uses the matching Markdown route as home content without a duplicate reading page", () => {
  const document = {
    source: "content/index.md",
    id: "index",
    key: "en/index",
    locale: "en",
    route: "/",
    translationKey: "index",
    metadata: { title: "Welcome" },
  }
  const site: SiteOptions = {
    title: "Fixture",
    locales: [locales[1]].filter(
      (item): item is NonNullable<typeof item> => !!item,
    ),
    home: { content: "index", hero: { text: "Hello" } },
  }
  expect(homePages(site, [document])[0]?.document).toEqual(document)
  expect(() =>
    homePages(
      {
        ...site,
        home: { ...site.home, content: "missing", hero: { text: "Hello" } },
      },
      [document],
    ),
  ).toThrow("Missing home content")
  expect(() =>
    homePages(
      {
        ...site,
        home: { ...site.home, route: "/different/", hero: { text: "Hello" } },
      },
      [document],
    ),
  ).toThrow("Markdown route")
})
