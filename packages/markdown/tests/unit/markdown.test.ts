import { expect, it } from "vitest"
import { isIsoDate, MarkdownSourceError, sourceError } from "../../src/index"
it.each(["2024-02-29", "2026-10-24"])(
  "accepts actual ISO calendar dates: %s",
  (value) => expect(isIsoDate(value)).toBe(true),
)
it.each([
  "2026-02-29",
  "1900-02-29",
  "2026-02-30",
  "2026-13-01",
  "2026-1-01",
  "2026-10-24T00:00:00Z",
  "invalid",
])("rejects invalid/non-date values: %s", (value) =>
  expect(isIsoDate(value)).toBe(false),
)
it("exposes a source-aware diagnostic without owning application error messages", () => {
  let caught: unknown
  try {
    sourceError("content/en/guide.md", "Unknown category")
  } catch (error) {
    caught = error
  }
  expect(caught).toBeInstanceOf(MarkdownSourceError)
  if (caught instanceof MarkdownSourceError)
    expect(caught.sourceName).toBe("content/en/guide.md")
  expect(String(caught)).toContain("content/en/guide.md: Unknown category")
})
