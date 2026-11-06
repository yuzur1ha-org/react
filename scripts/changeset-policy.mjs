import { parse } from "yaml"
import { isDeepStrictEqual } from "node:util"
export function versionOnlyChange(before, after) {
  function normalize(value) {
    const result = structuredClone(value)
    delete result.version
    for (const group of [
      "dependencies",
      "devDependencies",
      "peerDependencies",
      "optionalDependencies",
    ]) {
      for (const name of Object.keys(result[group] ?? {}))
        if (name.startsWith("@yuzur1ha/"))
          result[group][name] = "internal-version"
    }
    return result
  }
  return (
    before.version !== after.version &&
    isDeepStrictEqual(normalize(before), normalize(after))
  )
}
export function publicChanges(files) {
  return files.filter((file) =>
    /^packages\/[^/]+\/(src\/|bin\/|scripts\/|tsconfig\/|fonts.css$|package.json|vite.config|tsconfig.build)/.test(
      file,
    ),
  )
}

export function parseChangeset(source, packageNames) {
  const match = /^---\r?\n([\s\S]*?)^---\r?\n([\s\S]+)$/m.exec(source)
  if (!match || !match[2].trim()) return undefined
  let value
  try {
    value = match[1].trim() ? parse(match[1]) : {}
  } catch {
    return undefined
  }
  if (!value || typeof value !== "object" || Array.isArray(value))
    return undefined
  return Object.entries(value).every(
    ([name, bump]) =>
      packageNames.has(name) && ["major", "minor", "patch"].includes(bump),
  )
    ? value
    : undefined
}
