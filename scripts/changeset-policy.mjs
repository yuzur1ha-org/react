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
    /^packages\/[^/]+\/(src\/|bin\/|package.json|vite.config|tsconfig.build)/.test(
      file,
    ),
  )
}
