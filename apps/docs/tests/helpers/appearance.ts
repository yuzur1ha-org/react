import { expect, type Page } from "@playwright/test"
export function themeSwitch(page: Page) {
  return page.locator('.press-header-actions input[role="switch"]')
}
export async function toggleTheme(page: Page) {
  const phone = (page.viewportSize()?.width ?? 1280) < 640
  if (phone)
    await page
      .locator(".press-phone-navigation")
      .getByRole("button", { name: "Navigation", exact: true })
      .click()
  const control = phone
    ? page
        .getByRole("dialog", { name: "Navigation", exact: true })
        .getByRole("switch", { name: "Theme", exact: true })
    : themeSwitch(page)
  const before = await control.isChecked()
  await control.locator("..").click()
  await expect(control).toBeChecked({ checked: !before })
  if (phone) await page.keyboard.press("Escape")
}
