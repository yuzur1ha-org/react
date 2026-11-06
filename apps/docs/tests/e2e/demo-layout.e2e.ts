import { openDocument } from "../helpers/open-document"
import { expect, test } from "@playwright/test"

test("action demos center their controls without stretching buttons on desktop and phone", async ({
  page,
}) => {
  for (const width of [1440, 820, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    await openDocument(page, "/ui/button/")
    const demo = page.locator(".demo-content")
    const noScale = demo.getByRole("button", { name: "No scale action" })
    const bounds = await noScale.evaluate((node) => {
      const content = node.closest(".demo-content")?.getBoundingClientRect()
      const button = node.getBoundingClientRect()
      if (!content) throw new Error("Missing demo content")
      return {
        offset: Math.abs(
          button.x + button.width / 2 - content.x - content.width / 2,
        ),
        width: button.width,
        contentWidth: content.width,
      }
    })
    expect(bounds.offset).toBeLessThan(1)
    expect(bounds.width).toBeLessThan(bounds.contentWidth)
    await noScale.click()
    await expect(demo.locator("output")).toHaveText("1")
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    await openDocument(page, "/ui/tooltip/")
    const grid = page.locator(".demo-tooltips")
    const geometry = await grid.evaluate((node) => {
      const box = node.getBoundingClientRect()
      const content = node.closest(".demo-canvas")?.getBoundingClientRect()
      const positions = ["top", "left", "right", "bottom"].map((side) => {
        const child = node.querySelector(`[data-tooltip-side="${side}"]`)
        if (!child) throw new Error("Missing tooltip trigger")
        const bounds = child.getBoundingClientRect()
        return { x: bounds.x, y: bounds.y }
      })
      if (!content) throw new Error("Missing tooltip canvas")
      return {
        offset: Math.abs(box.x + box.width / 2 - content.x - content.width / 2),
        positions,
      }
    })
    expect(geometry.offset).toBeLessThan(1)
    const [top, left, right, bottom] = geometry.positions
    expect(top?.x).toBe(bottom?.x)
    expect(left?.y).toBe(right?.y)
    expect(top?.y).toBeLessThan(left?.y ?? 0)
    expect(bottom?.y).toBeGreaterThan(right?.y ?? 0)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
  }
})
