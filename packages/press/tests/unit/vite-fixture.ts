import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { join, resolve, sep } from "node:path"
import { afterEach } from "vitest"
export const directories: string[] = []
afterEach(async () => {
  for (const path of directories.splice(0))
    await rm(path, { recursive: true, force: true })
})
export async function fixture() {
  const root = await mkdtemp(resolve(import.meta.dirname, "../../.project-"))
  directories.push(root)
  const input = resolve(import.meta.dirname, "../fixtures/project")
  const generated = join(input, ".cache/press")
  // A local learning run must not seed first-generation tests with existing artifacts.
  await cp(input, root, {
    recursive: true,
    filter: (source) =>
      source !== generated && !source.startsWith(generated + sep),
  })
  await writeFile(
    join(root, "entry.js"),
    'import docs from "virtual:fixture"; export default docs',
  )
  return root
}
export async function countGenerations(root: string) {
  const path = join(root, "yupress.config.ts")
  const source = await readFile(path, "utf8")
  await writeFile(
    path,
    'import { appendFileSync } from "node:fs"\n' +
      source.replace(
        "setup(_context) {",
        `setup(_context) { appendFileSync(${JSON.stringify(join(root, "generations.count"))}, "1\\n")`,
      ),
  )
  return async () =>
    (await readFile(join(root, "generations.count"), "utf8")).trim().split("\n")
      .length
}
