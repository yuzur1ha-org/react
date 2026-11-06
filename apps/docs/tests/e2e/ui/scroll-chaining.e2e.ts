import { expect, test } from "@playwright/test"
import { openDocument } from "../../helpers/open-document"

test("ScrollArea chains native wheel input to a nested ancestor at either vertical edge", async ({
  page,
}) => {
  await openDocument(page, "/ui/scroll-area/")
  const viewport = page.getByRole("region", {
    name: "Release notes",
    exact: true,
  })
  await viewport.evaluate((node) => {
    const root = node.parentElement
    if (!root) throw new Error("Missing ScrollArea root")
    const outer = document.createElement("div")
    outer.id = "scroll-ancestor"
    outer.style.cssText = "height:340px;overflow:auto;max-width:432px;"
    const tail = document.createElement("div")
    tail.style.height = "800px"
    root.replaceWith(outer)
    outer.append(root, tail)
    node.scrollTop = node.scrollHeight
  })
  const ancestor = page.locator("#scroll-ancestor")
  await ancestor.evaluate((node) => node.scrollIntoView({ block: "center" }))
  await viewport.hover()
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
  const pageTop = await page.evaluate(() => scrollY)
  await expect
    .poll(async () => {
      await page.mouse.wheel(0, 120)
      return ancestor.evaluate((node) => node.scrollTop)
    })
    .toBeGreaterThan(0)
  expect(await viewport.evaluate((node) => node.scrollTop)).toBe(
    await viewport.evaluate((node) => node.scrollHeight - node.clientHeight),
  )
  expect(await page.evaluate(() => scrollY)).toBe(pageTop)
  await viewport.evaluate((node) => {
    node.scrollTop = 0
  })
  await ancestor.evaluate((node) => {
    node.scrollTop = 120
  })
  const bounds = await ancestor.boundingBox()
  if (!bounds) throw new Error("Missing native ancestor bounds")
  await page.mouse.move(bounds.x + 80, bounds.y + 80)
  await page.mouse.wheel(0, -100)
  await expect
    .poll(() => ancestor.evaluate((node) => node.scrollTop))
    .toBeLessThan(120)
  expect(await viewport.evaluate((node) => node.scrollTop)).toBe(0)
})

test("sidebar containment keeps boundary wheel input from moving the document", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await openDocument(page, "/ui/button/")
  await expect(page.locator(".usage code")).toBeVisible()
  const viewport = page.locator(".press-sidebar .yu-scroll-viewport")
  await expect(viewport).toHaveCSS("overscroll-behavior-y", "contain")
  await page.evaluate(() => scrollTo(0, 120))
  await viewport.evaluate((node) => {
    node.scrollTop = node.scrollHeight
  })
  await viewport.hover()
  const before = await page.evaluate(() => scrollY)
  await page.mouse.wheel(0, 180)
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
  expect(await page.evaluate(() => scrollY)).toBe(before)
})
