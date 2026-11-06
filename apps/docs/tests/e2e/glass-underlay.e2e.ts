import { openDocument } from "../helpers/open-document"
import { expect, test } from "@playwright/test"

test("skip link reaches the actual document without changing the route", async ({
  page,
}) => {
  await openDocument(page, "/ui/button/")
  await expect(page.locator(".usage code")).toBeVisible()
  await page.keyboard.press("Tab")
  await expect(
    page.getByRole("link", { name: "Skip to content", exact: true }),
  ).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.locator("#main")).toBeFocused()
  await expect(page).toHaveURL(/\/ui\/button\/#main$/)
})
