import { openDocument } from "../helpers/open-document"
import { expect, test } from "@playwright/test"

test("failed client navigation keeps the documentation shell and can recover", async ({
  page,
}, testInfo) => {
  await openDocument(page, "/ui/button/")
  await expect(page.locator(".usage code")).toBeVisible()
  await page.route("**/content/components/avatar/demo.tsx*", (route) =>
    new URL(route.request().url()).searchParams.has("raw")
      ? route.continue()
      : route.abort(),
  )
  if (testInfo.project.name.endsWith(":mobile"))
    await page.getByRole("button", { name: "Docs", exact: true }).click()
  await page
    .locator('nav[aria-label="Documentation"]:visible')
    .getByRole("link", { name: "Avatar", exact: true })
    .click()
  await expect(page.getByRole("alert")).toContainText("Unable to load document")
  await expect(
    page.getByRole("button", { name: "Retry", exact: true }),
  ).toBeVisible()
  if (testInfo.project.name.endsWith(":mobile"))
    await page.getByRole("button", { name: "Docs", exact: true }).click()
  await page
    .locator('nav[aria-label="Documentation"]:visible')
    .getByRole("link", { name: "Link", exact: true })
    .click()
  await expect(
    page.getByRole("heading", { name: "Link", level: 1, exact: true }),
  ).toBeVisible()
  await expect(page.locator(".demo-content .yu-link").first()).toBeVisible()
  await expect(page.getByRole("alert")).toHaveCount(0)
})
