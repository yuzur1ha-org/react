import { expect, test } from "@playwright/test"
import { openDocument } from "../../helpers/open-document"

test("wheel over either rail belongs to its viewport while sibling scroll areas stay still", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await openDocument(page, "/ui/scroll-area/")
  const viewport = page.getByRole("region", {
    name: "Release notes",
    exact: true,
  })
  const root = page.locator(".demo-scroll-both")
  const other = page.getByRole("region", { name: "normal list", exact: true })
  const source = page.getByRole("region", {
    name: "Example source code",
    exact: true,
  })
  const sidebar = page.locator(".press-sidebar .yu-scroll-viewport")
  await expect(source.locator("code")).toBeVisible()
  await viewport.scrollIntoViewIfNeeded()
  await viewport.evaluate((node) => {
    node.scrollLeft = 80
    node.scrollTop = 0
  })
  const horizontal = root.locator(
    '.yu-scrollbar[data-orientation="horizontal"]',
  )
  const vertical = root.locator('.yu-scrollbar[data-orientation="vertical"]')
  await horizontal.hover()
  const pageBefore = await page.evaluate(() => scrollY)
  const sidebarBefore = await sidebar.evaluate((node) => node.scrollTop)
  await page.mouse.wheel(0, 60)
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollTop))
    .toBeGreaterThan(0)
  expect(await viewport.evaluate((node) => node.scrollLeft)).toBe(80)
  expect(await page.evaluate(() => scrollY)).toBe(pageBefore)
  expect(await other.evaluate((node) => node.scrollTop)).toBe(0)
  expect(await source.evaluate((node) => node.scrollTop)).toBe(0)
  expect(await sidebar.evaluate((node) => node.scrollTop)).toBe(sidebarBefore)
  await vertical.hover()
  const beforeX = await viewport.evaluate((node) => node.scrollLeft)
  await page.mouse.wheel(60, 0)
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(beforeX)
  const thumb = vertical.locator(".yu-scroll-thumb")
  await thumb.hover()
  await expect(root).not.toHaveAttribute("data-wheel-scrolling")
  const bounds = await thumb.boundingBox()
  if (!bounds) throw new Error("Missing thumb bounds")
  const beforeY = await viewport.evaluate((node) => node.scrollTop)
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  )
  await page.mouse.down()
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2 + 36,
    { steps: 6 },
  )
  await page.mouse.up()
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollTop))
    .toBeGreaterThan(beforeY)
})

test("nested Shift wheel releases to its ancestor, honors containment and leaves siblings untouched", async ({
  page,
}) => {
  await openDocument(page, "/ui/scroll-area/")
  const inner = page.getByRole("region", {
    name: "Example source code",
    exact: true,
  })
  await expect(inner.locator("code")).toBeVisible()
  await page.evaluate(() => {
    const outer = document.querySelector(
      ".demo-scroll-both > .yu-scroll-viewport > div",
    )
    const inner = document.querySelector<HTMLElement>(".usage .source-scroll")
    if (!outer || !inner) throw new Error("Missing real ScrollArea instances")
    const wrapper = document.createElement("div")
    wrapper.className = inner.closest(".usage")?.className ?? "usage"
    wrapper.style.cssText = "width:220px;margin:0;"
    inner.style.maxHeight = "160px"
    outer.prepend(wrapper)
    wrapper.append(inner)
  })
  const outer = page.getByRole("region", { name: "Release notes", exact: true })
  const sibling = page.getByRole("region", {
    name: "Component collections",
    exact: true,
  })
  await inner.hover()
  await outer.evaluate((node) => {
    node.scrollLeft = 0
  })
  const pageBefore = await page.evaluate(() => scrollY)
  await page.keyboard.down("Shift")
  await page.mouse.wheel(0, 60)
  await expect
    .poll(() => inner.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0)
  expect(await outer.evaluate((node) => node.scrollLeft)).toBe(0)
  await inner.evaluate((node) => {
    node.scrollLeft = node.scrollWidth
  })
  await page.mouse.wheel(0, 60)
  await expect
    .poll(() => outer.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0)
  expect(await sibling.evaluate((node) => node.scrollLeft)).toBe(0)
  expect(await page.evaluate(() => scrollY)).toBe(pageBefore)
  await inner.evaluate((node) => {
    node.style.overscrollBehaviorX = "contain"
  })
  await inner.hover()
  const contained = await outer.evaluate((node) => node.scrollLeft)
  await page.mouse.wheel(0, 60)
  await page.keyboard.up("Shift")
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
  expect(await outer.evaluate((node) => node.scrollLeft)).toBe(contained)
})

test("mobile directory owns wheel input without moving the reading surface", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 700 })
  await openDocument(page, "/ui/button/")
  await expect(page.locator(".usage code")).toBeVisible()
  await page.getByRole("button", { name: "Docs", exact: true }).click()
  const viewport = page.locator(
    ".press-directory-panel .yu-menu-scroll > .yu-scroll-viewport",
  )
  await expect(viewport).toBeVisible()
  await viewport.hover()
  const before = await page.evaluate(() => scrollY)
  await page.mouse.wheel(0, 120)
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollTop))
    .toBeGreaterThan(0)
  expect(await page.evaluate(() => scrollY)).toBe(before)
  await viewport.evaluate((node) => {
    node.scrollTop = node.scrollHeight
  })
  await viewport.hover()
  await page.mouse.wheel(0, 160)
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
  expect(await page.evaluate(() => scrollY)).toBe(before)
})
