import { toggleTheme } from "../helpers/appearance"
import { openDocument } from "../helpers/open-document"
import { expect, test } from "@playwright/test"

test("normal and contrast ScrollArea examples retain distinct tokens in both themes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await openDocument(page, "/ui/scroll-area/")
  const sidebar = page.locator('.demo-scroll-list[data-appearance="normal"]')
  const demo = page.locator(".demo-content .demo-scroll-both")
  const source = page.locator(".source-scroll")
  await expect(sidebar).toHaveAttribute("data-appearance", "normal")
  await expect(demo).toHaveAttribute("data-appearance", "contrast")
  await expect(source).toHaveAttribute("data-appearance", "normal")
  for (const theme of ["light", "dark"]) {
    if (theme === "dark") await toggleTheme(page)
    const thumb = sidebar.locator(".yu-scroll-thumb")
    const sample = demo.locator(
      '.yu-scrollbar[data-orientation="vertical"] .yu-scroll-thumb',
    )
    await expect(thumb).toBeVisible()
    await expect(sidebar.locator(".yu-scrollbar")).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    )
    expect(
      await thumb.evaluate((node) => getComputedStyle(node).backgroundColor),
    ).not.toBe(
      await sample.evaluate((node) => getComputedStyle(node).backgroundColor),
    )
    await expect(sidebar.locator(".yu-scrollbar")).toHaveCSS("width", "6px")
    await expect(thumb).toHaveCSS("border-radius", "0px")
    await expect(thumb).toHaveCSS("opacity", "0.65")
    await expect(sample).toHaveCSS("opacity", "1")
    await expect(thumb).toHaveCSS(
      "background-color",
      theme === "light" ? "rgb(216, 216, 209)" : "rgb(65, 70, 72)",
    )
    const idleColor = await thumb.evaluate(
      (node) => getComputedStyle(node).backgroundColor,
    )
    await thumb.hover()
    await expect(thumb).toHaveCSS("opacity", "1")
    expect(
      await thumb.evaluate((node) => getComputedStyle(node).backgroundColor),
    ).toBe(idleColor)
    await page.mouse.move(1100, 20)
  }
})
