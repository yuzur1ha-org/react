import { openDocument } from "../helpers/open-document"
import { expect, test, type Page } from "@playwright/test"

async function scrollPageFromEdge(page: Page, direction: 1 | -1) {
  const initial = await page.evaluate(() => scrollY)
  let accumulated = 0
  // A native gesture may consume a fractional remainder before chaining.
  await expect
    .poll(
      async () => {
        if (accumulated < 240) {
          await page.mouse.wheel(0, direction * 40)
          accumulated += 40
        }
        const current = await page.evaluate(() => scrollY)
        return direction * (current - initial)
      },
      { intervals: [50], timeout: 2000 },
    )
    .toBeGreaterThan(0)
}

test("source code chains vertical scrolling to the page at both edges", async ({
  page,
}) => {
  await openDocument(page, "/ui/button/")
  const viewport = page.getByRole("region", { name: "Example source code" })
  await expect(page.locator(".usage code")).toBeVisible()
  await viewport.scrollIntoViewIfNeeded()
  await viewport.evaluate((node) => {
    node.scrollTop = node.scrollHeight
  })
  await viewport.hover()
  await scrollPageFromEdge(page, 1)
  await viewport.scrollIntoViewIfNeeded()
  await viewport.evaluate((node) => {
    node.scrollTop = 0
  })
  await viewport.hover()
  const up = await page.evaluate(() => scrollY)
  expect(up).toBeGreaterThan(0)
  await scrollPageFromEdge(page, -1)
})

test("code owns the text cursor and native selection including blank lines", async ({
  page,
}) => {
  await openDocument(page, "/ui/button/")
  const code = page.locator(".source-code code")
  await expect(code).toBeVisible()
  await code.scrollIntoViewIfNeeded()
  const viewport = page.getByRole("region", { name: "Example source code" })
  await viewport.evaluate((node) => {
    node.scrollTop = 0
    node.scrollLeft = 0
  })
  await expect(code).toHaveCSS("cursor", "text")
  await expect(page.locator(".source-lines")).toHaveCSS("cursor", "default")
  await expect(page.getByRole("button", { name: "Copy code" })).toHaveCSS(
    "cursor",
    "pointer",
  )
  const point = await code.evaluate((node) => {
    const box = node.getBoundingClientRect()
    const viewport = node
      .closest(".yu-scroll-viewport")
      ?.getBoundingClientRect()
    if (!viewport) throw new Error("Missing source viewport")
    const lineHeight = parseFloat(getComputedStyle(node).lineHeight)
    const empty = Array.from(node.children).findIndex(
      (line) => !line.textContent?.trim(),
    )
    if (empty < 0) throw new Error("Missing blank source line")
    const x = Math.min(box.left + 32, viewport.right - 24)
    const y = box.top + lineHeight * (empty + 0.5)
    const target = document.elementFromPoint(x, y)
    return {
      x,
      y,
      startX: box.left + 2,
      startY: box.top + lineHeight / 2,
      cursor: target ? getComputedStyle(target).cursor : null,
      inside: target?.closest("code") === node,
    }
  })
  expect(point.inside).toBe(true)
  expect(point.cursor).toBe("text")
  await page.mouse.move(point.startX, point.startY)
  await page.mouse.down()
  await page.mouse.move(point.x, point.y, { steps: 5 })
  await page.mouse.up()
  expect(
    await code.evaluate((node) => {
      const selection = getSelection()
      return (
        !!selection?.toString() &&
        node.contains(selection.anchorNode) &&
        node.contains(selection.focusNode)
      )
    }),
  ).toBe(true)
})

test("props tables leave vertical reading to the page and scroll only their horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openDocument(page, "/ui/button/")
  await expect(page.locator(".usage code")).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  const viewport = page.getByRole("region", {
    name: "Button properties",
    exact: true,
  })
  await expect(viewport).toBeVisible()
  await viewport.scrollIntoViewIfNeeded()
  const size = await viewport.evaluate((node) => ({
    y: node.scrollHeight - node.clientHeight,
    x: node.scrollWidth - node.clientWidth,
  }))
  expect(size.y).toBeLessThanOrEqual(1)
  expect(size.x).toBeGreaterThan(0)
  await viewport.hover()
  await scrollPageFromEdge(page, 1)
  await viewport.hover()
  const before = await page.evaluate(() => scrollY)
  await page.keyboard.down("Shift")
  await page.mouse.wheel(0, 100)
  await page.keyboard.up("Shift")
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0)
  expect(await page.evaluate(() => scrollY)).toBe(before)
  await viewport.evaluate((node) => {
    node.scrollLeft = 80
  })
  await viewport
    .locator("..")
    .locator('.yu-scrollbar[data-orientation="horizontal"]')
    .hover()
  await scrollPageFromEdge(page, -1)
  expect(await viewport.evaluate((node) => node.scrollLeft)).toBe(80)
  expect(await viewport.evaluate((node) => node.scrollTop)).toBe(0)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})
