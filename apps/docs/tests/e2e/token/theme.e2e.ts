import { toggleTheme, themeSwitch } from "../../helpers/appearance"
import { openDocument } from "../../helpers/open-document"
import { expect, test } from "@playwright/test"

test("Light/dark selection persists and reaches palettes, HeroUI, portals and scrollbars", async ({
  page,
}, testInfo) => {
  await openDocument(page, "/ui/foundations/")
  const toggle = themeSwitch(page)
  await expect(toggle).not.toBeChecked()
  await toggleTheme(page)
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(23, 24, 25)",
  )
  await expect(toggle).toBeChecked()
  await expect(
    page.getByLabel("Functional colors", { exact: true }),
  ).toBeVisible()
  await expect(page.locator('[data-tone="success"].semantic-swatch')).toHaveCSS(
    "color",
    "rgb(147, 198, 165)",
  )
  await expect(page.getByTestId("heroui-button")).toHaveCSS(
    "background-color",
    "rgb(238, 237, 232)",
  )
  if (testInfo.project.name.endsWith(":mobile"))
    await expect(
      page.getByRole("button", { name: "Docs", exact: true }),
    ).toBeVisible()
  await openDocument(page, "/ui/select/")
  await expect(toggle).toBeChecked()
  await page.getByRole("combobox", { name: "Profile visibility" }).click()
  const list = page.getByRole("listbox")
  await expect(list).toHaveCSS("background-color", "rgb(32, 34, 36)")
  await expect(list).toHaveCSS("color", "rgb(238, 237, 232)")
  await page.keyboard.press("Escape")
  await openDocument(page, "/ui/scroll-area/")
  const thumb = page.locator(
    '.demo-scroll-both .yu-scrollbar[data-orientation="vertical"] .yu-scroll-thumb',
  )
  await expect(thumb).toBeVisible()
  await expect(thumb).toHaveCSS("background-color", "rgb(194, 197, 196)")
  await page.getByRole("heading", { level: 1 }).click()
  await toggleTheme(page)
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(246, 245, 240)",
  )
  await expect(thumb).toHaveCSS("background-color", "rgb(52, 53, 54)")
  await page.reload()
  await expect(toggle).not.toBeChecked()
})
