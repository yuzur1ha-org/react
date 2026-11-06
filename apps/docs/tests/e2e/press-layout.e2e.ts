import { expect, test } from "@playwright/test"
import { openDocument } from "../helpers/open-document"
import { site } from "../helpers/site"

test("home composes the configured cover and Markdown, and custom pages keep their Markdown route", async ({
  page,
}, testInfo) => {
  await openDocument(page, "/")
  await expect(
    page.getByRole("heading", { name: "Considered by design.", exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole("heading", {
      name: "A system made to be used.",
      exact: true,
    }),
  ).toBeVisible()
  await page.screenshot({
    path: testInfo.outputPath("home.png"),
    fullPage: true,
    animations: "disabled",
  })
  const phone = (page.viewportSize()?.width ?? 1280) < 640
  await expect(page.locator(".press-hero")).toHaveCSS(
    phone ? "min-height" : "height",
    `${(page.viewportSize()?.height ?? 0) * 0.75}px`,
  )
  await page
    .getByRole("link", { name: "Explore foundations", exact: true })
    .click()
  await expect(page).toHaveURL(/\/ui\/foundations\/$/)
  await expect(
    page.getByLabel("Functional colors", { exact: true }),
  ).toBeVisible()
  await expect(page.locator(".press-sidebar-brand")).toHaveCount(1)
})
test("scrolling changes header height and surface while the sidebar brand keeps its expanded height", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await openDocument(page, "/ui/button/")
  const header = page.locator(".press-header"),
    brand = page.locator(".press-sidebar-brand")
  await expect
    .poll(() => header.evaluate((node) => node.getBoundingClientRect().height))
    .toBe(96)
  await expect
    .poll(() => brand.evaluate((node) => node.getBoundingClientRect().height))
    .toBe(96)
  await page.screenshot({
    path: testInfo.outputPath("document.png"),
    fullPage: false,
    animations: "disabled",
  })
  await page.evaluate(() => scrollTo(0, 400))
  await expect
    .poll(() => header.evaluate((node) => node.getBoundingClientRect().height))
    .toBe(64)
  await expect(header).toHaveCSS("backdrop-filter", "none")
  await expect
    .poll(() =>
      header.evaluate((node) => getComputedStyle(node, "::before").opacity),
    )
    .toBe("1")
  await expect(brand).toHaveCSS("backdrop-filter", "none")
  expect(
    await brand.evaluate(
      (node) => getComputedStyle(node, "::before").backdropFilter,
    ),
  ).toBe("blur(18px)")
  await expect(brand.locator(".press-brand")).toHaveCSS(
    "color",
    "rgb(238, 237, 232)",
  )
})
test("phone header has only brand and site drawer, with settings inside and reading menus below", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openDocument(page, "/ui/button/")
  const header = page.locator(".press-header")
  await expect(
    header.getByRole("link", { name: site.title, exact: true }),
  ).toBeVisible()
  await expect(header.getByRole("switch")).toHaveCount(0)
  const trigger = header.getByRole("button", {
    name: "Navigation",
    exact: true,
  })
  await page.screenshot({
    path: testInfo.outputPath("phone-document.png"),
    fullPage: false,
    animations: "disabled",
  })
  await trigger.click()
  const drawer = page.getByRole("dialog", { name: "Navigation", exact: true })
  await expect(
    drawer.getByRole("switch", { name: "Theme", exact: true }),
  ).toBeVisible()
  await expect(
    drawer.getByRole("link", { name: "Markdown", exact: true }),
  ).toBeVisible()
  await page.screenshot({
    path: testInfo.outputPath("phone-navigation.png"),
    fullPage: false,
    animations: "disabled",
  })
  const row = drawer.locator(".press-theme-setting")
  const label = await row.locator(":scope > span").boundingBox(),
    control = await row.locator("label").boundingBox()
  if (!label || !control) throw new Error("Missing theme settings")
  expect(label.x).toBeLessThan(control.x)
  expect(
    Math.abs(label.y + label.height / 2 - control.y - control.height / 2),
  ).toBeLessThan(2)
  expect(control.x + control.width).toBeLessThanOrEqual(390)
  await expect(drawer.locator("a[aria-current]")).toHaveAttribute(
    "data-active-appearance",
    "subtle",
  )
  await expect(drawer.locator("a[aria-current]")).toHaveCSS(
    "background-color",
    await drawer
      .locator(".press-icon-links")
      .evaluate((node) => getComputedStyle(node).backgroundColor),
  )
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
  await page.getByRole("button", { name: "Docs", exact: true }).click()
  await expect(page.locator(".press-directory-panel")).toBeVisible()
  await page.keyboard.press("Escape")
  await page.getByRole("button", { name: "On this page", exact: true }).click()
  const outline = page.getByRole("dialog", {
    name: "On this page",
    exact: true,
  })
  await outline.getByRole("link", { name: "API", exact: true }).click()
  await expect(page.locator("#api")).toBeFocused()
  await expect(outline).toHaveCount(0)
})
test("tablet keeps the fixed directory and exposes the outline in the subheader", async ({
  page,
}) => {
  await page.setViewportSize({ width: 820, height: 900 })
  await openDocument(page, "/ui/button/")
  await expect(page.locator(".press-sidebar")).toBeVisible()
  await expect(page.locator(".press-directory-disclosure")).toBeHidden()
  await expect(page.locator(".press-toc")).toBeHidden()
  await page.getByRole("button", { name: "On this page", exact: true }).click()
  await expect(
    page.getByRole("dialog", { name: "On this page", exact: true }),
  ).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.locator(".press-pagination .press-next small")).toHaveText(
    "Next",
  )
  await expect(
    page.locator(".press-pagination .press-next strong"),
  ).not.toBeEmpty()
})
