export function componentDesignUrl(original: string, override?: unknown) {
  if (typeof override !== "string" || !override.trim()) return original
  const file = new URL(override.trim())
  if (
    file.protocol !== "https:" ||
    !["figma.com", "www.figma.com"].includes(file.hostname)
  )
    throw new Error("Figma configuration requires an HTTPS figma.com URL.")
  file.search = ""
  file.hash = ""
  const node = new URL(original).searchParams.get("node-id")
  if (!node) return original
  file.searchParams.set("node-id", node)
  return file.href
}
