import { expect, it } from "vitest"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { englishMessages } from "@yuzur1ha/press/content"
import { MessagesContext } from "@yuzur1ha/press/react"
import { ReferenceDocument, ReferenceMessagesContext } from "../../src"
it("renders reference metadata and authored content during SSR", () => {
  const html = renderToStaticMarkup(
    createElement(ReferenceDocument, {
      metadata: { title: "A reference", description: "Public contract" },
      Content: () => createElement("p", {}, "Body content"),
    }),
  )
  expect(html).toContain("A reference")
  expect(html).toContain("Body content")
})

it("renders standalone precompiled source without a theme and ignores stale source tokens", async () => {
  const { SourcePreview } = await import("../../src/source/source-preview")
  const code = {
    source: "old source",
    lines: [[{ text: "old source", color: "red" }]],
    copy: false,
    lineNumbers: true,
    enhanced: true,
  }
  const html = renderToStaticMarkup(
    createElement(SourcePreview, {
      source: "new source",
      name: "demo.tsx",
      code,
    }),
  )
  const custom = renderToStaticMarkup(
    createElement(
      ReferenceMessagesContext,
      { value: { sourceLanguage: "Example source" } },
      createElement(SourcePreview, { source: "x", name: "demo.tsx" }),
    ),
  )
  expect(custom).toContain("Example source")
  expect(html).toContain("React / TypeScript")
  expect(html).toContain("new source")
  expect(html).not.toContain("old source")
  expect(html).not.toMatch(/<button[^>]*source-copy-button/)
  expect(html).toContain('data-code-theme="light"')
})

it("inherits site labels when a reference page overrides only one label", () => {
  const html = renderToStaticMarkup(
    createElement(
      MessagesContext,
      {
        value: {
          ...englishMessages,
          version: "Site version",
          created: "Site creation",
        },
      },
      createElement(
        ReferenceMessagesContext,
        { value: { version: "Reference version" } },
        createElement(ReferenceDocument, {
          metadata: {
            title: "Reference",
            description: "",
            version: "1.0",
            created: "2026-11-08",
          },
          Content: () => null,
        }),
      ),
    ),
  )
  expect(html).toContain("Reference version")
  expect(html).toContain("Site creation")
  expect(html).not.toContain("Site version")
})
