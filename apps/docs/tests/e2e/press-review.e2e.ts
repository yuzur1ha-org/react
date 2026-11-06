import { expect, test } from "@playwright/test"
import { openDocument } from "../helpers/open-document"

test("brand and adjacent-document links opt out of hover decoration", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await openDocument(page, "/ui/button/")
  for (const link of [
    page.locator(".press-sidebar-brand a"),
    page.locator(".press-pagination a").first(),
  ]) {
    await link.hover()
    await expect(link).toHaveAttribute("data-underline", "false")
    expect(
      await link
        .locator(".yu-link-content")
        .evaluate((node) => getComputedStyle(node, "::after").content),
    ).toBe("none")
  }
  await expect(
    page
      .locator(".press-sidebar .yu-menu-group")
      .first()
      .locator(".yu-menu-label"),
  ).toHaveCount(0)
  await expect(page.locator(".press-footer nav")).toHaveCount(0)
})
test("tablet keeps desktop directory width and retains inline navigation without an empty reading bar", async ({
  page,
}) => {
  for (const width of [1280, 820]) {
    await page.setViewportSize({ width, height: 900 })
    await openDocument(page, "/ui/foundations/")
    await expect(page.locator(".press-sidebar")).toHaveCSS("width", "256px")
    await expect(page.locator(".press-desktop-navigation")).toBeVisible()
    await expect(page.locator(".press-subheader")).toBeHidden()
    await expect(page.locator(".press-layout")).toHaveCSS("padding-top", "96px")
  }
})
test("Figma lives in the document body and only loads an embed after an explicit action", async ({
  page,
}, testInfo) => {
  let requests = 0
  await page.route("https://embed.figma.com/**", async (route) => {
    requests++
    await route.fulfill({
      contentType: "text/html",
      body: "<p>Design fixture</p>",
    })
  })
  await openDocument(page, "/ui/button/")
  const card = page.getByRole("region", { name: "Button design", exact: true })
  await expect(page.locator(".document-details a")).toHaveCount(0)
  await expect(page.locator(".document-kicker")).toContainText(
    "Component reference",
  )
  await expect(card).toBeVisible()
  await card.screenshot({
    path: testInfo.outputPath("figma-preview.png"),
    animations: "disabled",
  })
  await expect(card.locator("iframe")).toHaveCount(0)
  expect(requests).toBe(0)
  await card.getByRole("button", { name: "Load preview", exact: true }).click()
  await expect(card.frameLocator("iframe").locator("p")).toHaveText(
    "Design fixture",
  )
  expect(
    new URL(
      (await card.locator("iframe").getAttribute("src")) ?? "",
    ).searchParams.get("node-id"),
  ).toBe("38-725")
  await card.getByRole("button", { name: "Close preview", exact: true }).click()
  await expect(card.locator("iframe")).toHaveCount(0)
})
test("home uses the site surface and feature cards are single native links", async ({
  page,
}) => {
  await openDocument(page, "/")
  await expect(page.locator(".press-hero")).toHaveCSS(
    "background-color",
    "rgb(246, 245, 240)",
  )
  await expect(page.locator(".press-hero")).not.toHaveClass(/dark-surface/)
  const card = page.locator("a.press-feature-card").first()
  await expect(page.locator("a.press-feature-card")).toHaveCount(3)
  await expect(card.locator("a")).toHaveCount(0)
  await expect(card.getByRole("heading")).toContainText("Interface")
  await card.click()
  await expect(page).toHaveURL(/\/ui\/button\/$/)
})

test("home promotes its features and uses a background symbol on phone", async ({
  page,
}, testInfo) => {
  await openDocument(page, "/")
  await expect(page.locator(".press-hero + .press-features")).toHaveCount(1)
  await expect(page.locator(".press-footer nav")).toHaveCount(0)
  for (const card of await page.locator("a.press-feature-card").all()) {
    await card.hover()
    await expect(card).toHaveCSS("text-decoration-line", "none")
  }
  if ((page.viewportSize()?.width ?? 1280) < 640) {
    await expect(page.locator(".press-hero-symbol")).toHaveCSS(
      "position",
      "absolute",
    )
    await expect(page.locator(".press-hero-symbol")).toHaveCSS("z-index", "-1")
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(page.locator(".press-header")).toHaveCSS("height", "96px")
  await page.screenshot({
    path: testInfo.outputPath("home-layout.png"),
    fullPage: true,
    animations: "disabled",
  })
})

test("reading typography stays stable across tablet and desktop", async ({
  page,
}) => {
  await openDocument(page, "/ui/button/")
  await page.evaluate(() => document.fonts.ready)
  const samples = []
  for (const width of [820, 1279, 1280, 1440, 1279]) {
    await page.setViewportSize({ width, height: 900 })
    samples.push(
      await page.locator("main h1").evaluate((node) => {
        const style = getComputedStyle(node)
        return {
          font: style.fontFamily,
          size: style.fontSize,
          weight: style.fontWeight,
        }
      }),
    )
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
  }
  expect(new Set(samples.map((sample) => JSON.stringify(sample))).size).toBe(1)
  expect(samples[0]?.size).toBe("48px")
})

test("unknown routes have independent chrome and a working return-home link", async ({
  page,
}, testInfo) => {
  await page.goto("/missing-press-page/")
  await expect(
    page.getByRole("heading", { name: "Page not found", exact: true }),
  ).toBeVisible()
  await expect(page.locator(".press-sidebar, .press-subheader")).toHaveCount(0)
  await page.screenshot({
    path: testInfo.outputPath("not-found.png"),
    animations: "disabled",
  })
  await page.locator("main").getByRole("link").click()
  await expect(page.locator(".press-hero")).toBeVisible()
})
