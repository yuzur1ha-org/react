import { openDocument } from "../../helpers/open-document"
import { expect, test } from "@playwright/test"
test("the Playground loads the brand image from Docs local assets", async ({
  page,
}) => {
  await openDocument(page, "/ui/button/")
  const brand = page
    .getByRole("img", { name: "Yuzur1ha", exact: true })
    .filter({ visible: true })
  await expect(brand).toBeVisible()
  const mask = await brand.evaluate((node) => getComputedStyle(node).maskImage)
  const url = /url\(["']?(.*?)["']?\)/.exec(mask)?.[1]
  expect(url).toBeTruthy()
  const response = await page.request.get(url ?? "")
  expect(response.ok()).toBe(true)
  expect(response.headers()["content-type"]).toContain("image/svg+xml")
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
})

test("the Playground serves its local favicon", async ({ page }) => {
  await openDocument(page, "/ui/foundations/")
  const href = await page.locator('link[rel="icon"]').getAttribute("href")
  const response = await page.request.get(href ?? "")
  expect(response.ok()).toBe(true)
  expect(response.headers()["content-type"]).toContain("image/svg+xml")
})
