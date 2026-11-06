import { openDocument } from "../helpers/open-document"
import { readFile } from "node:fs/promises"
import { expect, test } from "@playwright/test"

test("component Markdown renders metadata, design notes, the executable demo and its API schema", async ({
  page,
}) => {
  await openDocument(page, "/ui/button/")
  const article = page.locator(".component-document")
  await expect(
    article.getByRole("heading", { name: "Button", level: 1, exact: true }),
  ).toBeVisible()
  await expect(article.locator(".document-version")).toContainText("Draft")
  await expect(article.locator("time")).toHaveCount(1)
  await expect(
    article.getByRole("heading", { name: "Design notes", exact: true }),
  ).toBeVisible()
  await expect(article.locator(".component-prose").first()).toContainText(
    "scaleOnPress",
  )
  const demo = article.locator(".demo-content")
  await demo.getByRole("button", { name: "Continue", exact: true }).click()
  await expect(demo.getByRole("status")).toHaveText("1")
  const source = await readFile(
    new URL("../../src/content/components/button/demo.tsx", import.meta.url),
    "utf8",
  )
  await expect(article.locator(".usage code")).toHaveText(source)
  await expect(article.locator(".source-meta")).toContainText(
    "content/components/button/demo.tsx",
  )
  await expect(
    article.getByRole("table", { name: "CloseButtonProps", exact: true }),
  ).toBeVisible()
  const table = article.getByRole("table", { name: "ButtonProps", exact: true })
  await expect(
    table.getByRole("row").filter({
      has: page.getByRole("rowheader", { name: "scaleOnPress", exact: true }),
    }),
  ).toContainText("true")
  await expect(
    table.getByRole("row").filter({
      has: page.getByRole("rowheader", { name: "appearance", exact: true }),
    }),
  ).toContainText('"primary" | "secondary" | "text"')
  await expect(article.locator(".figma-preview a")).toHaveAttribute(
    "href",
    /node-id=38-725/,
  )
  await expect(
    article
      .getByRole("region", { name: "Button API", exact: true })
      .locator(".api-method-note"),
  ).toContainText("No custom imperative methods")
})

test("compound API tables and wide types stay inside their own scroll region", async ({
  page,
}) => {
  for (const width of [320, 820, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await openDocument(page, "/ui/link/")
    await expect(
      page.getByRole("table", { name: "LinkProps", exact: true }),
    ).toBeVisible()
    await expect(
      page.getByRole("table", { name: "LinkContainerProps", exact: true }),
    ).toBeVisible()
    await expect(
      page.getByRole("table", { name: "LinkUnderlineProps", exact: true }),
    ).toBeVisible()
    await expect(page.locator(".figma-preview a")).toHaveCount(0)
    const properties = page.getByRole("region", {
      name: "Link properties",
      exact: true,
    })
    await properties.scrollIntoViewIfNeeded()
    await properties.focus()
    if (width === 320) {
      await properties.press("ArrowRight")
      await expect
        .poll(() => properties.evaluate((node) => node.scrollLeft))
        .toBeGreaterThan(0)
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
  }
})

test("opening a document loads only that component's demo source", async ({
  page,
}) => {
  const requests: string[] = []
  page.on("request", (request) =>
    requests.push(new URL(request.url()).pathname),
  )
  await openDocument(page, "/ui/button/")
  await expect(page.locator(".usage code")).toBeVisible()
  expect(
    requests.some((path) =>
      path.includes("/content/components/button/demo.tsx"),
    ),
  ).toBe(true)
  expect(
    requests.some((path) =>
      /\/content\/components\/(?!button\/).+\/demo\.tsx/.test(path),
    ),
  ).toBe(false)
})
