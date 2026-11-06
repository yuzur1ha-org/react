import { loadConfigFromFile } from "vite"
import { resolve } from "node:path"
import { access, readdir, readFile } from "node:fs/promises"
import { expect, expectTypeOf, it } from "vitest"
import manifest from "../../package.json"

function isModule(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

const packageRoot = resolve(import.meta.dirname, "../..")

it("resolves every built public component through the export pattern to its barrel implementation and declarations", async () => {
  const barrel: Record<string, unknown> = await import("@yuzur1ha/ui")
  await access(resolve(packageRoot, manifest.exports["."].types))
  const entries = await readdir(resolve(packageRoot, "dist/entries"))
  const mapping = manifest.exports["./*"]
  for (const entry of entries.filter((entry) => entry.endsWith(".js"))) {
    const name = entry.slice(0, -3)
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

it("keeps the maintained public list aligned with built entries and root component exports", async () => {
  const loaded = await loadConfigFromFile(
    { command: "build", mode: "production" },
    resolve(packageRoot, "vite.config.ts"),
  )
  const entry = loaded?.config.build?.lib
  if (!entry || typeof entry.entry !== "object" || Array.isArray(entry.entry))
    throw new Error("Expected named library entries")
  const names = Object.keys(entry.entry)
    .filter((name) => name !== "index")
    .map((name) => name.replace(/^entries\//, ""))
  expect(names).toEqual([...names].sort())
  expect(entry.entry.index).toBe("src/index.ts")
  for (const name of names)
    expect(entry.entry[`entries/${name}`]).toBe(
      `src/components/${name}/index.ts`,
    )
  expect(manifest.exports["./*"]).toEqual({
    types: "./dist/entries/*.d.ts",
    import: "./dist/entries/*.js",
  })
  expect(
    (await readdir(resolve(packageRoot, "dist/entries")))
      .filter((name) => name.endsWith(".js"))
      .map((name) => name.slice(0, -3))
      .sort(),
  ).toEqual(names)
  const root = await readFile(resolve(packageRoot, "src/index.ts"), "utf8")
  expect(
    [
      ...new Set(
        [...root.matchAll(/from "\.\/components\/([^/"]+)(?:\/index)?"/g)].map(
          (match) => match[1],
        ),
      ),
    ].sort(),
  ).toEqual(names)
})
