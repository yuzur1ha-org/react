import type { ContentLocale } from "./types"
export function normalizeBase(value = "/") {
  if (!value.startsWith("/") || !value.endsWith("/"))
    throw new Error(`Base must begin and end with /: ${value}`)
  if (
    /[?#\\%]/.test(value) ||
    value.includes("//") ||
    value.split("/").some((part) => part === "." || part === "..")
  )
    throw new Error(`Invalid base: ${value}`)
  return value
}

export function contentRoute(path: string, locale: ContentLocale) {
  if (!path.endsWith(".md"))
    throw new Error(`Unsupported content format: ${path}`)
  const parts = path.slice(0, -3).split("/")
  if (parts.at(-1) === "index") parts.pop()
  const prefix = locale.prefix.split("/").filter(Boolean)
  const segments = [...prefix, ...parts]
  if (
    segments.some(
      (part) => !part || part === "." || part === ".." || /[%?#\\]/.test(part),
    )
  )
    throw new Error(`Invalid content path: ${path}`)
  return (
    "/" +
    segments.map(encodeURIComponent).join("/") +
    (segments.length ? "/" : "")
  )
}

export function deploymentHref(base: string, route: string) {
  return normalizeBase(base).slice(0, -1) + route
}

export function headingSlug(title: string) {
  return (
    title
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-") || "section"
  )
}

/** Reserves the returned ID in used; prefill used with explicit document IDs. */
export function uniqueHeadingId(title: string, used: Set<string>) {
  const slug = headingSlug(title)
  let id = slug
  for (let suffix = 1; used.has(id); suffix++) id = `${slug}-${suffix}`
  used.add(id)
  return id
}
