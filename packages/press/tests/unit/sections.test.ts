import { expect, it } from "vitest"
import { validateSections } from "../../src/content"
const documents = [
  { source: "a.md", id: "a", key: "en/a", metadata: {} },
  { source: "b.md", id: "b", key: "en/b", metadata: {} },
]
const section = {
  id: "guide",
  label: "Guide",
  documents: ["a", "b"],
  groups: [{ id: "start", label: "Start", documents: ["a", "b"] }],
}
it("validates sidebar order and labels without controlling content inventory", () => {
  expect(() =>
    validateSections(
      [{ ...section, labels: { a: "Introduction" } }],
      documents,
    ),
  ).not.toThrow()
  expect(documents).toHaveLength(2)
})
it.each([
  { ...section, documents: ["missing"] },
  { ...section, documents: ["a", "a"] },
  { ...section, groups: [{ id: "one", label: "One", documents: ["a"] }] },
  {
    ...section,
    groups: [{ id: "one", label: "One", documents: ["a", "b", "a"] }],
  },
  {
    ...section,
    groups: [{ id: "one", label: "One", documents: ["a", "outside"] }],
  },
  { ...section, labels: { outside: "Unknown" } },
  { ...section, labels: { a: " " } },
])("rejects unresolved, duplicate and incomplete sidebars", (value) =>
  expect(() => validateSections([value], documents)).toThrow(),
)
