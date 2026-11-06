import { expect, it } from "vitest"
import { assertSerializableMetadata } from "../../src/node/serialization"
it("rejects cyclic metadata before generation rather than recursing until stack overflow", () => {
  const metadata: { title: string; self?: unknown } = { title: "Invalid" }
  metadata.self = metadata
  expect(() => assertSerializableMetadata(metadata, "broken")).toThrow(
    "Nonserializable document metadata: broken",
  )
})
it("permits shared references that serialize as independent JSON values", () => {
  const value = { label: "Shared" }
  expect(() =>
    assertSerializableMetadata({ a: value, b: value }, "valid"),
  ).not.toThrow()
})
