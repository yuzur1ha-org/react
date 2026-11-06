import { mkdir, writeFile, rm, readFile } from "node:fs/promises"
import { resolve, join } from "node:path"
import { expect, test } from "@playwright/test"
test("content errors recover, missing references return, and deleting the selected document falls back", async ({
  page,
  request,
}) => {
  test.setTimeout(60000)
  const verify = expect.configure({ timeout: 15000 })
  const id = "markdown-lifecycle-fixture"
  const directory = resolve(
    import.meta.dirname,
    "../../src/content/components",
    id,
  )
  const manifest = resolve(
    import.meta.dirname,
    "../../.cache/press/manifest.ts",
  )
  const schema = JSON.stringify({
    component: id,
    parts: [
      {
        name: "Fixture",
        typeName: "FixtureProps",
        description: "Lifecycle fixture.",
        props: [],
        methods: [],
      },
    ],
  })
  const markdown = (title: string) =>
    `---\ntitle: ${title}\n---\n# Consumed\n\nA <strong>real HTML</strong> document.\n\n::demo{src="./demo.tsx" export="Fixture"}\n\n::schema{src="./schema.json"}\n\n## Heading\n\n## Heading-1\n\n## Heading\n\n[Last heading](#heading-2)\n`
  await page.goto("/ui/foundations/")
  await verify(
    page.getByLabel("Functional colors", { exact: true }),
  ).toBeVisible()
  await mkdir(directory)
  try {
    await writeFile(
      join(directory, "demo.tsx"),
      "export function Fixture() { return <button>Fixture action</button> }",
    )
    await writeFile(join(directory, "schema.json"), schema)
    await writeFile(join(directory, "index.md"), markdown("Lifecycle fixture"))
    await expect
      .poll(
        async () =>
          (await readFile(manifest, "utf8")).includes(JSON.stringify(id)),
        { timeout: 10000 },
      )
      .toBe(true)
    await verify
      .poll(async () => {
        try {
          const response = await request.get(`/ui/${id}/`, { timeout: 2000 })
          return (
            response.ok() &&
            (await response.text()).includes("Lifecycle fixture")
          )
        } catch {
          return false
        }
      })
      .toBe(true)
    await page.goto(`/ui/${id}/`)
    await verify(
      page.getByRole("heading", { name: "Lifecycle fixture", level: 1 }),
    ).toBeVisible()
    await verify(page.locator(".component-prose strong")).toHaveText(
      "real HTML",
    )
    await verify(
      page.getByRole("button", { name: "Fixture action" }),
    ).toBeVisible()
    await verify(page.locator("#heading")).toHaveCount(1)
    await verify(page.locator("#heading-1")).toHaveCount(1)
    await verify(page.locator("#heading-2")).toHaveCount(1)
    await page.getByRole("link", { name: "Last heading", exact: true }).click()
    await verify(page).toHaveURL(/#heading-2$/)
    await verify(page.locator("#heading-2")).toBeFocused()
    await writeFile(join(directory, "index.md"), markdown("false"))
    await verify(page.locator("vite-error-overlay")).toBeAttached()
    await writeFile(join(directory, "index.md"), markdown("Recovered fixture"))
    await verify(
      page.getByRole("heading", { name: "Recovered fixture", level: 1 }),
    ).toBeVisible()
    await verify(page.locator("vite-error-overlay")).toHaveCount(0)
    await rm(join(directory, "schema.json"))
    await verify(page.locator("vite-error-overlay")).toBeAttached()
    await writeFile(join(directory, "schema.json"), schema)
    await verify(
      page.getByRole("button", { name: "Fixture action" }),
    ).toBeVisible()
    await verify(page.locator("vite-error-overlay")).toHaveCount(0)
    await rm(directory, { recursive: true })
    await verify(
      page.getByRole("heading", {
        name: "Page not found",
        level: 1,
        exact: true,
      }),
    ).toBeVisible()
    await verify(
      page.getByRole("heading", { name: "Recovered fixture", level: 1 }),
    ).toHaveCount(0)
    await verify(page.locator("vite-error-overlay")).toHaveCount(0)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
