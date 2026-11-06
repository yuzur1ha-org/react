import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import { openDocument } from "../../helpers/open-document"

test("ScrollArea supports native keyboard scrolling and draggable styled thumbs", async ({
  page,
}) => {
  await openDocument(page, "/ui/scroll-area/")
  const viewport = page.getByRole("region", { name: "Release notes" })
  const root = page.locator(".demo-content .demo-scroll-both")
  const vertical = root.locator('.yu-scrollbar[data-orientation="vertical"]')
  const horizontal = root.locator(
    '.yu-scrollbar[data-orientation="horizontal"]',
  )
  await expect(vertical).toBeVisible()
  await expect(horizontal).toBeVisible()
  await expect(vertical).toHaveCSS("width", "6px")
  await expect(horizontal).toHaveCSS("height", "6px")
  await viewport.focus()
  await viewport.press("PageDown")
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollTop))
    .toBeGreaterThan(0)
  await viewport.press("ArrowRight")
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0)
  await viewport.evaluate((node) => {
    node.scrollTop = 0
  })
  const thumb = vertical.locator(".yu-scroll-thumb")
  const box = await thumb.boundingBox()
  if (!box) throw new Error("Scroll thumb bounds unavailable")
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 80, {
    steps: 8,
  })
  await page.mouse.up()
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollTop))
    .toBeGreaterThan(0)
  await expect(thumb).toHaveCSS("border-radius", "0px")
})

test("source preview highlights canonical TSX, copies raw source and scrolls without page overflow", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await openDocument(page, "/ui/form/")
  const source = await readFile(
    new URL("../../../src/content/components/form/demo.tsx", import.meta.url),
    "utf8",
  )
  const code = page.locator(".usage code")
  await expect(code).toHaveText(source)
  await expect(
    code.locator('span[style*="--yu-code-token-keyword"]').first(),
  ).toBeVisible()
  const viewport = page.getByRole("region", { name: "Example source code" })
  await expect
    .poll(() =>
      viewport.evaluate((node) => node.scrollHeight > node.clientHeight),
    )
    .toBe(true)
  const copy = page.getByRole("button", { name: "Copy code", exact: true })
  await expect(copy).toHaveCSS("position", "absolute")
  await viewport.scrollIntoViewIfNeeded()
  await expect(
    viewport.getByRole("button", { name: "Copy code" }),
  ).toBeVisible()
  const copyBox = await copy.boundingBox()
  const viewportBox = await viewport.boundingBox()
  if (!copyBox || !viewportBox)
    throw new Error("Source viewport bounds unavailable")
  const inset = (page.viewportSize()?.width ?? 1280) < 640 ? 12 : 16
  await expect(copy).toHaveClass(/yu-button--secondary/)
  await expect(copy).toHaveCSS("border-top-width", "1px")
  expect(Math.abs(copyBox.y - viewportBox.y - inset)).toBeLessThan(1)
  expect(
    Math.abs(
      viewportBox.x + viewportBox.width - copyBox.x - copyBox.width - inset,
    ),
  ).toBeLessThan(1)
  const firstLine = await code.boundingBox()
  if (!firstLine) throw new Error("Missing code bounds")
  const codePadding = (page.viewportSize()?.width ?? 1280) < 640 ? 16 : 24
  expect(Math.abs(firstLine.y - viewportBox.y - codePadding)).toBeLessThan(1)
  await viewport.evaluate((node) => {
    node.scrollTop = 160
    node.scrollLeft = 40
  })
  await expect.poll(() => copy.boundingBox()).toEqual(copyBox)
  await copy.click()
  await expect(
    page.getByRole("button", { name: "Copy code", exact: true }),
  ).toHaveText("Copied")
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(source)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
  const toggle = page.getByRole("button", {
    name: "React / TypeScript",
    exact: true,
  })
  await toggle.click()
  await expect(code).toBeHidden()
  await toggle.click()
  await expect(code).toBeVisible()
})

test("Disclosure renders a filled triangle before its heading text", async ({
  page,
}) => {
  await openDocument(page, "/ui/disclosure/")
  const trigger = page.getByRole("button", { name: "Privacy information" })
  const marker = trigger.locator("svg")
  await expect(marker.locator("path")).toHaveAttribute("fill", "currentColor")
  expect(
    await trigger.evaluate((node) => node.firstElementChild?.tagName),
  ).toBe("svg")
  await expect(marker).toHaveCSS("transform", "none")
  await trigger.click()
  await expect(marker).toHaveCSS("transform", "matrix(0, 1, -1, 0, 0, 0)")
})

test("ScrollArea keeps native wheel axes and supports Shift wheel over content and tracks", async ({
  page,
}) => {
  await openDocument(page, "/ui/scroll-area/")
  const viewport = page.getByRole("region", { name: "Release notes" })
  await viewport.scrollIntoViewIfNeeded()
  await viewport.hover()
  await page.mouse.wheel(0, 120)
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollTop))
    .toBeGreaterThan(0)
  expect(await viewport.evaluate((node) => node.scrollLeft)).toBe(0)
  await viewport.evaluate((node) => {
    node.scrollTop = 0
  })
  await page.keyboard.down("Shift")
  await page.mouse.wheel(0, 100)
  await page.keyboard.up("Shift")
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0)
  expect(await viewport.evaluate((node) => node.scrollTop)).toBe(0)
  await viewport.evaluate((node) => {
    node.scrollLeft = 0
  })
  await page
    .locator('.demo-scroll-both .yu-scrollbar[data-orientation="horizontal"]')
    .hover()
  await page.keyboard.down("Shift")
  await page.mouse.wheel(0, 100)
  await page.keyboard.up("Shift")
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0)
  expect(await viewport.evaluate((node) => node.scrollTop)).toBe(0)
  await viewport.evaluate((node) => {
    node.scrollLeft = 0
  })
  await viewport.hover()
  await page.mouse.wheel(100, 0)
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0)
})
