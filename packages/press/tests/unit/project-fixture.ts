import { execFile } from "node:child_process"
import { cp, mkdtemp, rm } from "node:fs/promises"
import { join, resolve, sep } from "node:path"
import { promisify } from "node:util"
import { afterEach } from "vitest"
export const directories: string[] = []
export const execute = promisify(execFile)
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
  return root
}
afterEach(async () => {
  for (const directory of directories.splice(0))
    await rm(directory, { recursive: true, force: true })
})
