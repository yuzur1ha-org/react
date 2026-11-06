import { expect, test } from "@playwright/test"
import { openDocument } from "../helpers/open-document"
import { toggleTheme } from "../helpers/appearance"

test("TOC follows reading position and keeps tablet site navigation stable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openDocument(page, "/markdown/")
  const menu = page.locator(".press-toc nav")
  const first = menu.getByRole("link").first()
  await expect(first).toHaveAttribute("aria-current", "location")
  const initial = await first.boundingBox()
  const headings = page.locator("#main h2[id], #main h3[id]")
  const target = headings.nth(2)
  const id = await target.getAttribute("id")
  await target.evaluate((node) => node.scrollIntoView())
  const active = menu.locator('[aria-current="location"]')
  await expect(active).toHaveCount(1)
  await expect(active).toHaveAttribute(
    "href",
    `#${encodeURIComponent(id ?? "")}`,
  )
  await expect(active.locator(".yu-menu-text")).toHaveCSS("scale", "1.045")
  expect((await first.boundingBox())?.height).toBe(initial?.height)
  await expect(first.locator(".yu-menu-text")).toHaveCSS("scale", "1")
  const colors = await menu.evaluate((node) =>
    Array.from(node.querySelectorAll("a"), (link) => ({
      active: link.hasAttribute("aria-current"),
      color: getComputedStyle(link).color,
    })),
  )
  expect(colors.find((item) => item.active)?.color).not.toBe(
    colors.find((item) => !item.active)?.color,
  )
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(active.locator(".yu-menu-text")).toHaveCSS(
    "transition-duration",
    "0s",
  )
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  )
  await expect(menu.getByRole("link").last()).toHaveAttribute(
    "aria-current",
    "location",
  )
  await page.setViewportSize({ width: 820, height: 900 })
  const current = page.locator(".press-desktop-navigation a[aria-current=page]")
  await expect(current).toHaveAttribute("data-active-appearance", "subtle")
  await expect(current.locator(".yu-menu-text")).toHaveCSS("scale", "none")
  await page.getByRole("button", { name: "On this page", exact: true }).click()
  await expect(
    page.locator('.press-outline-popover a[aria-current="location"]'),
  ).toHaveCount(1)
})

test("only hero and features carry the dotted field, while cards stay opaque", async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => localStorage.removeItem("yuzur1ha-lab-theme"))
  for (const width of [1440, 820, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await openDocument(page, "/")
    for (const dark of [false, true]) {
      if (dark) await toggleTheme(page)
      for (const name of [".press-hero", ".press-features"])
        await expect(page.locator(name)).toHaveCSS(
          "background-image",
          /radial-gradient/,
        )
      const card = page.locator(".press-feature-card").first()
      await expect(
        card.locator("h2 svg.lucide-arrow-up-right"),
      ).toHaveAttribute("aria-hidden", "true")
      await expect(card.locator("h2 svg")).toHaveAttribute("width", "20")
      await expect(card).toHaveCSS("background-image", "none")
      await expect(card).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
      await expect(page.locator(".press-home-content")).toHaveCSS(
        "background-image",
        "none",
      )
      await expect(page.locator(".press-footer")).toHaveCSS(
        "background-image",
        "none",
      )
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true)
      await expect(page.locator(".press-loading-status")).toHaveCount(0)
      if (!dark)
        await page.screenshot({
          path: testInfo.outputPath(`home-${width}.png`),
          fullPage: true,
          animations: "disabled",
        })
    }
  }
})

test("phone pagination stacks adjacent documents and keeps a single neighbor full width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openDocument(page, "/ui/button/")
  const pagination = page.locator(".press-pagination")
  const links = pagination.getByRole("link")
  await expect(links).toHaveCount(2)
  await expect(
    links.first().locator("small svg.lucide-arrow-left"),
  ).toHaveAttribute("aria-hidden", "true")
  await expect(
    links.last().locator("small svg.lucide-arrow-right"),
  ).toHaveAttribute("aria-hidden", "true")
  await expect(links.first().locator("small")).toHaveText("Previous")
  await expect(links.last().locator("small")).toHaveText("Next")
  const previous = await links.first().boundingBox()
  const next = await links.last().boundingBox()
  expect(
    (next?.y ?? 0) - ((previous?.y ?? 0) + (previous?.height ?? 0)),
  ).toBeCloseTo(12, 0)
  expect(next?.width).toBe(previous?.width)
  await openDocument(page, "/ui/foundations/")
  await expect(pagination.getByRole("link")).toHaveCount(1)
  expect((await pagination.getByRole("link").boundingBox())?.width).toBeCloseTo(
    (await pagination.boundingBox())?.width ?? 0,
    0,
  )
})

test("404 has composed responsive chrome and an accessible route home in both themes", async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => localStorage.removeItem("yuzur1ha-lab-theme"))
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 })
    for (const dark of [false, true]) {
      await page.goto("/missing-page-detail-check/")
      await expect(page.locator(".press-not-found h1")).toHaveText(
        "Page not found",
      )
      if (dark) await toggleTheme(page)
      await expect(page.locator(".press-error-copy p")).toBeVisible()
      await expect(page.locator(".press-sidebar")).toHaveCount(0)
      await expect(page.locator(".press-subheader")).toHaveCount(0)
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true)
      await page.screenshot({
        path: testInfo.outputPath(`404-${width}-${dark}.png`),
        fullPage: true,
        animations: "disabled",
      })
      await page.getByRole("link", { name: "Return home", exact: true }).click()
      await expect(page.locator(".press-hero h1")).toBeVisible()
    }
  }
})
