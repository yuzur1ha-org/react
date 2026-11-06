import { openDocument } from "../helpers/open-document"
import { expect, test } from "@playwright/test"
import { site } from "../helpers/site"

test("configured external navigation matches the site at every breakpoint", async ({
  page,
}) => {
  for (const width of [320, 639, 640, 1023, 1024, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await openDocument(page, "/ui/button/")
    if (width < 640)
      await page
        .getByRole("button", { name: "Navigation", exact: true })
        .click()
    const navigation = page.locator(
      width < 640 ? ".yu-drawer" : ".press-header",
    )
    const links = site.links ?? []
    for (const item of links) {
      const link = navigation.getByRole("link", {
        name: item.label,
        exact: true,
      })
      await expect(link).toBeVisible()
      await expect(link).toHaveAttribute("href", new URL(item.href).href)
    }
    await expect(navigation.locator('a[target="_blank"]')).toHaveCount(
      links.length,
    )
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
  }
})

test("mobile directory opens and returns keyboard focus on Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 700 })
  await openDocument(page, "/ui/button/")
  const trigger = page.getByRole("button", {
    name: "Docs",
    includeHidden: true,
    exact: true,
  })
  await trigger.click()
  await expect(page.locator(".press-directory-panel")).toBeVisible()
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await page.keyboard.press("Escape")
  await expect(page.locator(".press-directory-panel")).toBeHidden()
  await expect(trigger).toBeFocused()
})
