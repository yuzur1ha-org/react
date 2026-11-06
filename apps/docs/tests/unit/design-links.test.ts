import { expect, it } from "vitest"
import { componentDesignUrl } from "../../src/docs/figma/links"

it("overrides a component file while preserving node identity and discarding file queries", () => {
  const component = new URL(
    componentDesignUrl(
      "https://www.figma.com/design/original/File?node-id=10-20",
      "https://www.figma.com/design/another/File?old=value#discard",
    ),
  )
  expect(component.pathname).toBe("/design/another/File")
  expect(component.searchParams.get("node-id")).toBe("10-20")
  expect(component.searchParams.has("old")).toBe(false)
  expect(component.hash).toBe("")
})
it("preserves authored component URLs without an override and rejects unsafe file origins", () => {
  const original = "https://www.figma.com/design/original/File?node-id=10-20"
  expect(componentDesignUrl(original)).toBe(original)
  expect(componentDesignUrl(original, "  ")).toBe(original)
  expect(() =>
    componentDesignUrl(original, "http://www.figma.com/design/file"),
  ).toThrow("HTTPS")
  expect(() =>
    componentDesignUrl(original, "https://example.com/design/file"),
  ).toThrow("figma.com")
})
