import { expect, test } from "@playwright/test"
import { openDocument } from "../helpers/open-document"
import { toggleTheme } from "../helpers/appearance"
import { site } from "../helpers/site"

test("Docs navigation stays inline on tablet and scrolls without displacing controls", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openDocument(page, "/ui/button/")
  const nav = page.locator(".press-desktop-navigation")
  expect((await nav.boundingBox())?.x).toBeCloseTo(256 + 32, 0)
  for (const width of [1279, 1024, 1023, 900, 820, 640]) {
    await page.setViewportSize({ width, height: 700 })
    await expect(nav).toBeVisible()
    await expect(page.locator(".press-phone-navigation")).toBeHidden()
    await expect(page.locator(".press-tablet-navigation")).toHaveCount(0)
    await expect(page.locator(".press-header .press-controls")).toBeInViewport()
    await expect(nav).toHaveCSS("scrollbar-width", "none")
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width)
  }
  await nav.getByRole("link", { name: "YuPress", exact: true }).focus()
  await expect
    .poll(() => nav.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0)
  await page.locator(".press-header").screenshot({
    path: testInfo.outputPath("tablet-inline-nav.png"),
    animations: "disabled",
  })
  await nav.getByRole("link", { name: "Markdown", exact: true }).click()
  await expect(page).toHaveURL(/\/markdown\//)
})

test("phone navigation uses consistent compact rows for sections and external links", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openDocument(page, "/ui/button/")
  await page.getByRole("button", { name: "Navigation", exact: true }).click()
  const drawer = page.getByRole("dialog", { name: "Navigation", exact: true })
  await expect(drawer.locator(".yu-drawer-heading > h2")).toHaveCSS(
    "line-height",
    "33.6px",
  )
  await expect(drawer.locator(".press-drawer-navigation")).toHaveCSS(
    "gap",
    "24px",
  )
  await expect(drawer.locator(".yu-menu-group").nth(1)).toHaveCSS(
    "margin-top",
    "0px",
  )
  const items = drawer.locator(
    ".press-drawer-navigation .yu-menu-item, .press-drawer-text-links .yu-menu-item",
  )
  for (const item of await items.all()) {
    await expect(item).toHaveCSS("font-size", "15px")
    expect((await item.boundingBox())?.height).toBeGreaterThanOrEqual(44)
    expect((await item.boundingBox())?.height).toBeLessThan(48)
  }
  const external = drawer.locator(".press-drawer-text-links a")
  await expect(external).toHaveCount(
    (site.links ?? []).filter((link) => !link.icon).length,
  )
  for (const link of await external.all()) {
    await expect(link).toHaveAttribute("target", "_blank")
    await expect(link).toHaveAttribute("rel", "noopener noreferrer")
    await expect(link.locator("svg")).toHaveCount(1)
  }
  await drawer.screenshot({
    path: testInfo.outputPath("phone-menu.png"),
    animations: "disabled",
  })
})

test("native document and overflow scrollbars match ScrollArea geometry and theme", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await openDocument(page, "/ui/scroll-area/")
  for (const dark of [false, true]) {
    if (dark) await toggleTheme(page)
    await page.mouse.move(-10, -10)
    const geometry = await page.evaluate(() => {
      const style = getComputedStyle(
        document.documentElement,
        "::-webkit-scrollbar",
      )
      const thumb = getComputedStyle(
        document.documentElement,
        "::-webkit-scrollbar-thumb",
      )
      const area = document.querySelector(".press-sidebar .yu-scrollbar")
      const areaThumb = document.querySelector(
        ".press-sidebar .yu-scroll-thumb",
      )
      const overflow = document.querySelector(".press-header .press-text-links")
      return {
        width: style.width,
        overflowWidth: overflow
          ? getComputedStyle(overflow, "::-webkit-scrollbar").height
          : null,
        border: thumb.borderLeftWidth,
        color: thumb.backgroundColor,
        radius: thumb.borderRadius,
        areaWidth: area ? getComputedStyle(area).width : null,
        areaColor: areaThumb
          ? getComputedStyle(areaThumb).backgroundColor
          : null,
        root: document.scrollingElement === document.documentElement,
      }
    })
    expect(geometry).toMatchObject({
      width: "6px",
      overflowWidth: (site.links ?? []).some((link) => !link.icon)
        ? "6px"
        : null,
      border: "1px",
      radius: "0px",
      areaWidth: "6px",
      root: true,
    })
    await expect
      .poll(() =>
        page.evaluate(() => {
          const thumb = document.querySelector(
            ".press-sidebar .yu-scroll-thumb",
          )
          return (
            thumb &&
            getComputedStyle(
              document.documentElement,
              "::-webkit-scrollbar-thumb",
            ).backgroundColor === getComputedStyle(thumb).backgroundColor
          )
        }),
      )
      .toBe(true)
    await expect(page.locator(".press-sidebar .yu-scroll-viewport")).toHaveCSS(
      "scrollbar-width",
      "none",
    )
  }
})

test("tablet retains section links without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 820, height: 900 },
  })
  const page = await context.newPage()
  try {
    await page.goto(`${baseURL}/ui/foundations/`)
    await expect(page.locator(".press-desktop-navigation")).toBeVisible()
    await expect(page.locator(".press-tablet-navigation")).toBeHidden()
    await page
      .locator(".press-desktop-navigation")
      .getByRole("link", { name: "Markdown", exact: true })
      .click()
    await expect(page).toHaveURL(/\/markdown\//)
    await expect(page.locator("main h1").first()).toBeVisible()
  } finally {
    await context.close()
  }
})
