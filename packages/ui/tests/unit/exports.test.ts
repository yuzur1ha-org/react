import { resolve } from "node:path"
import { access, readdir } from "node:fs/promises"
import { expect, expectTypeOf, it } from "vitest"
import manifest from "../../package.json"

function isModule(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

const packageRoot = resolve(import.meta.dirname, "../..")

it("resolves every component through explicit exports to its barrel implementation and declarations", async () => {
  const barrel: Record<string, unknown> = await import("@yuzur1ha/ui")
  await access(resolve(packageRoot, manifest.exports["."].types))
  const entries = await readdir(resolve(packageRoot, "src/components"), {
    withFileTypes: true,
  })
  for (const entry of entries.filter((entry) => entry.isDirectory())) {
    const name = entry.name
    const mapping = Object.entries(manifest.exports).find(
      ([key]) => key === `./${name}`,
    )?.[1]
    if (!mapping) throw new Error(`Missing public export: ${name}`)
    await access(resolve(packageRoot, mapping.types.replaceAll("*", name)))
    await access(resolve(packageRoot, mapping.import.replaceAll("*", name)))
    const component: unknown = await import(`${manifest.name}/${name}`)
    if (!isModule(component))
      throw new TypeError(`Invalid component module: ${name}`)
    expect(Object.keys(component).length, name).toBeGreaterThan(0)
    for (const [key, implementation] of Object.entries<unknown>(component))
      expect(implementation, `${name}: ${key}`).toBe(barrel[key])
  }
  expectTypeOf<typeof import("@yuzur1ha/ui/button").Button>().toEqualTypeOf<
    typeof import("@yuzur1ha/ui").Button
  >()
  expectTypeOf<
    typeof import("@yuzur1ha/ui/number-field").NumberField
  >().toEqualTypeOf<typeof import("@yuzur1ha/ui").NumberField>()
})
