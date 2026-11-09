import { readFile } from "node:fs/promises"
import { normalizeBase } from "../content/index"
import { isAbsolute, relative, sep } from "node:path"
export const literal = (value: unknown) =>
  JSON.stringify(value).replaceAll("<", "\\u003c")
export const outputMarker = ".yupress-output"
export const safeInside = (root: string, path: string) => {
  const local = relative(root, path)
  return (
    local !== "" &&
    !local.startsWith(".." + sep) &&
    local !== ".." &&
    !isAbsolute(local)
  )
}

export async function readOutputBase(path: string) {
  const marker: unknown = JSON.parse(await readFile(path, "utf8"))
  if (
    !marker ||
    typeof marker !== "object" ||
    !("version" in marker) ||
    marker.version !== 1 ||
    !("base" in marker) ||
    typeof marker.base !== "string"
  )
    throw new Error("Invalid Press static output marker; rebuild the site")
  return normalizeBase(marker.base)
}
