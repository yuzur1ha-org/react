import { expect, test } from "@playwright/test"
import { openDocument } from "../helpers/open-document"
import { toggleTheme } from "../helpers/appearance"
import { site } from "../helpers/site"

test("header hover keeps links within their scroll strip and icons centered", async ({
  page,
}) => {
  for (const width of [1280, 820]) {
    await page.setViewportSize({ width, height: 900 })
    await openDocument(page, "/ui/button/")
    for (const dark of [false, true]) {
      if (dark) await toggleTheme(page)
      const links = page.locator(".press-header .press-external:visible")
      await expect(links).toHaveCount(
        (site.links ?? []).filter((link) => !link.icon).length,
      )
      for (const link of await links.all()) {
        const strip = link.locator("..")
        const before = await strip.boundingBox()
        await link.hover()
        await expect
          .poll(() =>
            link
              .locator(".yu-link-content")
              .evaluate((node) => getComputedStyle(node, "::after").transform),
          )
          .toBe("matrix(1, 0, 0, 1, 0, 0)")
        expect(
          await strip.evaluate(
            (node) => node.scrollHeight <= node.clientHeight,
          ),
        ).toBe(true)
        expect((await strip.boundingBox())?.height).toBe(before?.height)
      }
      const icon = page.locator(".press-header .press-icon-link")
      const offset = await icon.evaluate((node) => {
        const a = node.getBoundingClientRect(),
          s = node.querySelector("svg")?.getBoundingClientRect()
        return s
          ? {
              x: s.x + s.width / 2 - a.x - a.width / 2,
              y: s.y + s.height / 2 - a.y - a.height / 2,
            }
          : null
      })
      expect(Math.abs(offset?.x ?? 100)).toBeLessThan(0.5)
      expect(Math.abs(offset?.y ?? 100)).toBeLessThan(0.5)
      await expect(icon.locator(".yu-link-content")).toHaveCount(0)
      if (width >= 1280) {
        const active = page.locator(".press-desktop-navigation a[aria-current]")
        await active.hover()
        await expect(active).toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
        await expect(active).toHaveCSS("text-underline-offset", "10px")
        const idle = page
          .locator(".press-desktop-navigation a:not([aria-current])")
          .first()
        await idle.hover()
        await expect(idle).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
      }
    }
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole("button", { name: "Navigation", exact: true }).click()
  const icon = page.locator(".yu-drawer .press-icon-link")
  const a = await icon.boundingBox(),
    s = await icon.locator("svg").boundingBox()
  expect(
    Math.abs(
      (a?.y ?? 0) + (a?.height ?? 0) / 2 - ((s?.y ?? 0) + (s?.height ?? 0) / 2),
    ),
  ).toBeLessThan(0.5)
})

test("page loading centers one coherent mark in the content viewport", async ({
  page,
}, testInfo) => {
  await openDocument(page, "/ui/button/")
  let release: () => void = () => undefined
  const ready = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route("**/app/home-*.tsx*", async (route) => {
    await ready
    await route.continue()
  })
  try {
    await page.locator(".press-brand:visible").first().click()
    const status = page.locator(".press-loading-status")
    await expect(status).toHaveCount(1)
    const indicator = status.locator(".press-loading-indicator")
    await expect(indicator).toBeVisible()
    await expect(status).toHaveCSS("opacity", "1")
    const area = await status.boundingBox(),
      box = await indicator.boundingBox()
    expect(
      Math.abs(
        (area?.x ?? 0) +
          (area?.width ?? 0) / 2 -
          ((box?.x ?? 0) + (box?.width ?? 0) / 2),
      ),
    ).toBeLessThan(1)
    expect(
      Math.abs(
        (area?.y ?? 0) +
          (area?.height ?? 0) / 2 -
          ((box?.y ?? 0) + (box?.height ?? 0) / 2),
      ),
    ).toBeLessThan(1)
    for (const time of [0, 300, 900, 1200, 600]) {
      await status.locator(".press-loading-squares").evaluate((node, time) => {
        for (const animation of node.getAnimations({ subtree: true })) {
          animation.pause()
          animation.currentTime = time
        }
      }, time)
      const geometry = await status
        .locator(".press-loading-mark")
        .evaluate((node) => {
          const frame = node.getBoundingClientRect()
          return Array.from(node.querySelectorAll("i"), (square) => {
            const r = square.getBoundingClientRect()
            return {
              width: r.width,
              height: r.height,
              inside:
                r.left >= frame.left &&
                r.right <= frame.right &&
                r.top >= frame.top &&
                r.bottom <= frame.bottom,
            }
          })
        })
      expect(geometry).toHaveLength(4)
      expect(geometry.every((square) => square.inside)).toBe(true)
      expect(
        Math.max(...geometry.map((square) => square.width)) -
          Math.min(...geometry.map((square) => square.width)),
      ).toBeLessThan(0.1)
    }
    await page.screenshot({ path: testInfo.outputPath("loading-center.png") })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await expect(status.locator(".press-loading-squares")).toHaveCSS(
      "animation-name",
      "none",
    )
    release()
    await expect(page.locator(".press-hero h1")).toBeVisible()
    await expect(status).toHaveCount(0)
  } finally {
    release()
  }
})
