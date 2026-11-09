import {
  mkdir,
  mkdtemp,
  rm,
  open,
  readFile,
  rename,
  unlink,
  writeFile,
} from "node:fs/promises"
import { join } from "node:path"
import { setTimeout } from "node:timers/promises"
const ownership = ".generated-files.json"
async function read(path: string) {
  try {
    return await readFile(path, "utf8")
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    )
      return undefined
    throw error
  }
}
export async function withGenerationLock<T>(
  outputDir: string,
  work: (waited: boolean) => Promise<T>,
) {
  await mkdir(outputDir, { recursive: true })
  const lock = join(outputDir, ".generation.lock")
  let handle
  let waited = false
  for (let attempt = 0; attempt < 200; attempt++) {
    try {
      handle = await open(lock, "wx")
      break
    } catch (error) {
      if (
        !error ||
        typeof error !== "object" ||
        !("code" in error) ||
        error.code !== "EEXIST"
      )
        throw error
      waited = true
      await setTimeout(25)
    }
  }
  if (!handle) throw new Error(`Documentation generation is locked: ${lock}`)
  try {
    return await work(waited)
  } finally {
    await handle.close()
    await unlink(lock)
  }
}
export async function writeGenerated(
  outputDir: string,
  files: Record<string, string>,
  check = false,
) {
  const previous: unknown = JSON.parse(
    (await read(join(outputDir, ownership))) ?? "[]",
  )
  if (
    !Array.isArray(previous) ||
    !previous.every(
      (value): value is string =>
        typeof value === "string" && /^[\w.-]+$/.test(value),
    )
  )
    throw new Error("Invalid generated ownership manifest")
  for (const name of Object.keys(files))
    if (!/^[\w.-]+$/.test(name) || name === ownership)
      throw new Error(`Invalid generated filename: ${name}`)
  const expected: Record<string, string> = {
    ...files,
    [ownership]: JSON.stringify(Object.keys(files).sort()) + "\n",
  }
  const changed: string[] = []
  for (const [name, contents] of Object.entries(expected)) {
    const actual = await read(join(outputDir, name))
    if (
      !check &&
      actual !== undefined &&
      name !== ownership &&
      !previous.includes(name)
    )
      throw new Error(
        `Refusing to overwrite unowned documentation output: ${name}`,
      )
    if (actual !== contents) changed.push(name)
  }
  const removed = previous.filter((name) => !(name in files))
  if (check && (changed.length || removed.length))
    throw new Error(
      `Stale generated documentation: ${[...changed, ...removed].join(", ")}`,
    )
  if (check || (!changed.length && !removed.length))
    return { changed: [], removed: [] }
  await mkdir(outputDir, { recursive: true })
  const staging = await mkdtemp(join(outputDir, ".generate-"))
  try {
    for (const name of changed) {
      await writeFile(join(staging, name), expected[name] ?? "")
    }
    for (const name of changed)
      await rename(join(staging, name), join(outputDir, name))
    for (const name of removed)
      await unlink(join(outputDir, name)).catch((error: unknown) => {
        if (
          !error ||
          typeof error !== "object" ||
          !("code" in error) ||
          error.code !== "ENOENT"
        )
          throw error
      })
  } finally {
    await rm(staging, { recursive: true, force: true })
  }
  return { changed, removed }
}
