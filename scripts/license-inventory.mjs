import { readdir, readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
const inventory = []
for (const entry of await readdir("packages", { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const name = entry.name
  const root = resolve("packages", name),
    manifest = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"))
  for (const dependency of Object.keys({
    ...manifest.dependencies,
    ...manifest.peerDependencies,
  }).sort()) {
    if (dependency.startsWith("@yuzur1ha/")) continue
    const value = JSON.parse(
      await readFile(
        resolve(root, "node_modules", dependency, "package.json"),
        "utf8",
      ),
    )
    inventory.push({
      consumer: manifest.name,
      name: dependency,
      version: value.version,
      license: value.license ?? "TBD",
    })
  }
}
await writeFile(
  "docs/dependencies.json",
  JSON.stringify(inventory, null, 2) + "\n",
)
