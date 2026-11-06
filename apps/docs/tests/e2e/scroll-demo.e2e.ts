import { openDocument } from "../helpers/open-document"
import { expect, test } from "@playwright/test"

test("scroll examples demonstrate both appearances and each scrolling direction", async ({
  page,
}) => {
  await openDocument(page, "/ui/scroll-area/")
  for (const appearance of ["normal", "contrast"]) {
    const viewport = page.getByRole("region", {
      name: `${appearance} list`,
      exact: true,
    })
    const root = viewport.locator("..")
    await expect(root).toHaveAttribute("data-appearance", appearance)
    await expect(
      root.locator('.yu-scrollbar[data-orientation="vertical"]'),
    ).toBeVisible()
    await expect(
      root.locator('.yu-scrollbar[data-orientation="horizontal"]'),
    ).toHaveCount(0)
    await viewport.focus()
    await viewport.press("End")
    await expect(viewport.getByRole("listitem").last()).toBeInViewport()
    expect(await viewport.evaluate((node) => node.scrollLeft)).toBe(0)
  }
  const horizontal = page.getByRole("region", {
    name: "Component collections",
    exact: true,
  })
  await expect(
    horizontal
      .locator("..")
      .locator('.yu-scrollbar[data-orientation="vertical"]'),
  ).toHaveCount(0)
  await horizontal.focus()
  await horizontal.press("ArrowRight")
  await expect
    .poll(() => horizontal.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0)
  expect(await horizontal.evaluate((node) => node.scrollTop)).toBe(0)
  await horizontal.evaluate((node) => {
    node.scrollLeft = 0
  })
  await horizontal.hover()
  await page.keyboard.down("Shift")
  await page.mouse.wheel(0, 120)
  await page.keyboard.up("Shift")
  await expect
    .poll(() => horizontal.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})
