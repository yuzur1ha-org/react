import { openDocument } from "../helpers/open-document"
import { expect, test } from "@playwright/test"

test("Switch demos center state groups and keep three icon sizes on one row", async ({
  page,
}) => {
  for (const width of [1440, 820, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    await openDocument(page, "/ui/switch/")
    const demo = page.locator(".demo-content")
    const group = demo.getByRole("region", { name: "Switch sizes with icons" })
    const geometry = await group
      .locator(".demo-switch-samples")
      .evaluate((node) => {
        const positions = Array.from(node.querySelectorAll(".yu-switch")).map(
          (element) => {
            const box = element.getBoundingClientRect()
            return { y: box.y + box.height / 2, width: box.width }
          },
        )
        const box = node.getBoundingClientRect()
        const parent = node.closest(".demo-canvas")?.getBoundingClientRect()
        if (!parent) throw new Error("Missing demo canvas")
        return {
          positions,
          offset: Math.abs(box.x + box.width / 2 - parent.x - parent.width / 2),
        }
      })
    expect(geometry.offset).toBeLessThan(1)
    const [small, medium, large] = geometry.positions
    // The tracks differ in height; compare their centers instead of top edges.
    expect(small?.width).toBe(36)
    expect(medium?.width).toBe(44)
    expect(large?.width).toBe(52)
    expect(
      Math.max(...geometry.positions.map((item) => item.y)) -
        Math.min(...geometry.positions.map((item) => item.y)),
    ).toBeLessThan(1)
    const control = demo.getByRole("switch", { name: "Email notifications" })
    await control.press("Space")
    await expect(demo.locator("output")).toHaveText("false")
    await expect(
      demo.getByRole("switch", { name: "Disabled", exact: true }),
    ).toBeChecked()
    await expect(
      demo.getByRole("switch", { name: "Disabled off", exact: true }),
    ).not.toBeChecked()
    await expect(
      demo.getByRole("switch", { name: "Disabled off", exact: true }),
    ).toBeDisabled()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
  }
})
