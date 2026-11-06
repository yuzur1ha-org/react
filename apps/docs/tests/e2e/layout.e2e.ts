import { openDocument } from "../helpers/open-document"
import { expect, test } from "@playwright/test"

test("sidebar remains keyboard scrollable without moving the reading surface", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 700 })
  await openDocument(page, "/ui/form/")
  await expect(page.locator(".usage code")).toBeVisible()
  const menu = page.locator(".press-sidebar .yu-scroll-viewport")
  await menu.focus()
  const before = await page.evaluate(() => scrollY)
  await menu.press("End")
  await expect
    .poll(() => menu.evaluate((node) => node.scrollTop))
    .toBeGreaterThan(0)
  await expect(
    menu.getByRole("link", { name: "Scroll area", exact: true }),
  ).toBeInViewport()
  expect(await page.evaluate(() => scrollY)).toBe(before)
})

test("default theme keeps document and code overflow bounded on narrow and wide screens", async ({
  page,
}) => {
  for (const width of [320, 640, 820, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await openDocument(page, "/ui/form/")
    await expect(page.locator(".usage code")).toBeVisible()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    await expect(page.locator(".press-header")).toBeVisible()
    await expect(page.locator(".press-document")).toBeVisible()
  }
})
