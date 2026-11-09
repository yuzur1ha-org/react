import { randomUUID } from "node:crypto"
import { readFileSync, statSync } from "node:fs"
import { readFile, rename, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"
import type { CompiledDocument } from "@yuzur1ha/markdown/compiler"

const filename = "compiled.json"

export async function writeCompiledSnapshot(
  directory: string,
  contents: string,
) {
  const path = join(directory, filename)
  if ((await readFile(path, "utf8").catch(() => null)) === contents) return
  const temporary = join(directory, `.compiled-${randomUUID()}.tmp`)
  try {
    await writeFile(temporary, contents)
    await rename(temporary, path)
  } finally {
    await rm(temporary, { force: true })
  }
}

function parseSnapshot(text: string) {
  const strings = (value: unknown): value is string[] =>
    Array.isArray(value) &&
    value.every((item: unknown) => typeof item === "string")
  const object = (value: unknown): value is Record<string, unknown> =>
    !!value && typeof value === "object" && !Array.isArray(value)
  const data: unknown = JSON.parse(text)
  if (object(data) && typeof data.error === "string")
    throw new Error(data.error)
  if (!Array.isArray(data)) throw new Error("Invalid compiled snapshot")
  const modules = new Map<string, CompiledDocument<unknown>>()
  for (const item of data as unknown[]) {
    if (
      !object(item) ||
      typeof item.source !== "string" ||
      typeof item.code !== "string" ||
      !strings(item.dependencies)
    )
      throw new Error("Invalid compiled document")
    const map = item.map
    let sourceMap: CompiledDocument<unknown>["map"]
    if (map != null) {
      if (
        !object(map) ||
        map.version !== 3 ||
        typeof map.mappings !== "string" ||
        !strings(map.names) ||
        !strings(map.sources)
      )
        throw new Error("Invalid document source map")
      sourceMap = {
        file: typeof map.file === "string" ? map.file : item.source,
        version: 3,
        mappings: map.mappings,
        names: map.names,
        sources: map.sources,
      }
      if (strings(map.sourcesContent))
        sourceMap.sourcesContent = map.sourcesContent
    }
    modules.set(item.source, {
      code: item.code,
      map: sourceMap,
      dependencies: item.dependencies,
      metadata: null,
      frontmatter: null,
    })
  }
  return modules
}

export function compiledDocumentResolver(directory: string) {
  const path = join(directory, filename)
  let cached:
    | { version: string; modules: Map<string, CompiledDocument<unknown>> }
    | undefined
  return (id: string) => {
    const { ino, mtimeNs, ctimeNs, size } = statSync(path, { bigint: true })
    const version = `${ino}:${mtimeNs}:${ctimeNs}:${size}`
    if (cached?.version !== version)
      cached = { version, modules: parseSnapshot(readFileSync(path, "utf8")) }
    return cached.modules.get(id)
  }
}
