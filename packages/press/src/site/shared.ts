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
