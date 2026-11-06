export function assertSerializableMetadata(
  value: unknown,
  key: string,
  ancestors = new Set<object>(),
): void {
  const fail = () => {
    throw new Error(`Nonserializable document metadata: ${key}`)
  }
  if (value === null || typeof value === "string" || typeof value === "boolean")
    return
  if (typeof value === "number" && Number.isFinite(value)) return
  if (typeof value !== "object" || !value || ancestors.has(value)) return fail()
  if (
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) !== Object.prototype
  )
    return fail()
  ancestors.add(value)
  for (const item of Object.values(value))
    assertSerializableMetadata(item, key, ancestors)
  ancestors.delete(value)
}
