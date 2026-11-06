import { expect, it } from "vitest"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { ReferenceDocument } from "../../src"
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
  expect(html).toContain("new source")
  expect(html).not.toContain("old source")
  expect(html).not.toMatch(/<button[^>]*source-copy-button/)
  expect(html).toContain('data-code-theme="light"')
})
