import { toggleTheme } from "../helpers/appearance"
import { readFile } from "node:fs/promises"
import { expect, test } from "@playwright/test"
import inventory from "../../.cache/press/index.json" with { type: "json" }
import { openDocument } from "../helpers/open-document"

test("all content routes remain readable on a plain static server with JavaScript disabled", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  try {
    const page = await context.newPage()
    for (const document of inventory) {
      const response = await page.goto((baseURL ?? "") + document.route)
      expect(response?.status()).toBe(200)
      await expect(
        page.getByRole("heading", {
          level: 1,
          name:
            document.id === "home" && document.locale === "en"
              ? "Considered by design."
              : document.id === "foundations"
                ? "A considered foundation."
                : document.id === "home"
                  ? "中文翻译正在进行中。"
                  : document.metadata.title,
          exact: true,
        }),
      ).toBeVisible()
      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        document.locale === "zh-cn" ? "zh-CN" : "en",
      )
      await expect(
        page
          .locator(
            `nav[aria-label="${document.locale === "zh-cn" ? "栏目" : "Sections"}"]:visible`,
          )
          .first()
          .getByRole("link"),
      ).toHaveCount(document.locale === "zh-cn" ? 2 : 3)
      if (document.source.includes("/components/")) {
        await expect(page.locator(".usage code")).toBeVisible()
        await expect(page.locator(".component-api-part").first()).toBeVisible()
      }
    }
    await expect(page.locator(".press-footer nav")).toHaveCount(0)
    const missing = await page.goto((baseURL ?? "") + "/unpublished-document/")
    expect(missing?.status()).toBe(404)
    await expect(
      page.getByRole("heading", { name: "Page not found", exact: true }),
    ).toBeVisible()
    await expect(page.locator(".press-sidebar, .press-subheader")).toHaveCount(
      0,
    )
  } finally {
    await context.close()
  }
})

test("production hydration keeps state and downloads only the selected document bodies", async ({
  page,
}) => {
  const requests: string[] = []
  const errors: string[] = []
  page.on("request", (request) =>
    requests.push(new URL(request.url()).pathname),
  )
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  await openDocument(page, "/ui/button/")
  const chunks: unknown = JSON.parse(
    await readFile(
      new URL("../../.cache/press/site/client-chunks.json", import.meta.url),
      "utf8",
    ),
  )
  if (!Array.isArray(chunks)) throw new Error("Invalid chunk audit")
  for (const chunk of chunks as unknown[]) {
    if (
      !chunk ||
      typeof chunk !== "object" ||
      !("modules" in chunk) ||
      !Array.isArray(chunk.modules) ||
      !("fileName" in chunk) ||
      typeof chunk.fileName !== "string"
    )
      throw new Error("Invalid chunk record")
    if (
      chunk.modules.some(
        (id: unknown) =>
          typeof id === "string" &&
          id.endsWith(".md") &&
          !id.endsWith("/button/index.md"),
      )
    )
      expect(requests).not.toContain("/" + chunk.fileName)
  }
  await page
    .locator(".demo-content")
    .getByRole("button", { name: "Continue", exact: true })
    .click()
  await expect(page.locator(".demo-content").getByRole("status")).toHaveText(
    "1",
  )
  await toggleTheme(page)
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
  await page.reload()
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
  await openDocument(page, "/ui/link/")
  await expect(page).toHaveURL(/\/ui\/link\/$/)
  await expect(page.locator(".document-header h1")).toHaveText("Link")
  expect(errors).toEqual([])
})
