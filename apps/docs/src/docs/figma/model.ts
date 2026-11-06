export function designUrl(value: string) {
  const url = new URL(value)
  if (
    url.protocol !== "https:" ||
    !["figma.com", "www.figma.com"].includes(url.hostname) ||
    url.username ||
    url.password ||
    url.port ||
    !/^\/design\/[a-zA-Z0-9]+(?:\/[^/]+)?\/?$/.test(url.pathname) ||
    !/^\d+[-:]\d+$/.test(url.searchParams.get("node-id") ?? "")
  )
    throw new Error("Figma must link to a concrete HTTPS design node")
  const clean = new URL(url.pathname, "https://www.figma.com")
  clean.searchParams.set("node-id", url.searchParams.get("node-id") ?? "")
  return clean.href
}
export function designEmbed(value: string, theme: "light" | "dark") {
  const url = new URL(designUrl(value))
  url.hostname = "embed.figma.com"
  url.searchParams.set("embed-host", "yuzur1ha-docs")
  url.searchParams.set("theme", theme)
  url.searchParams.set("page-selector", "false")
  return url.href
}
