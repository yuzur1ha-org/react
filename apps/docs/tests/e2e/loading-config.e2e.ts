import { openDocument } from "../helpers/open-document"
import { expect, test } from "@playwright/test"
import { site } from "../helpers/site"

test("Figma library configuration and per-document references stay independent", async ({
  page,
}) => {
  await openDocument(page, "/ui/button/")
  const library = site.links?.find((link) => link.label === "Figma")
  const headerLink = page
    .locator(".press-header a.press-external")
    .filter({ hasText: "Figma" })
  if (library) await expect(headerLink).toHaveAttribute("href", library.href)
  else await expect(headerLink).toHaveCount(0)
  const href = await page.locator(".figma-preview a").getAttribute("href")
  expect(new URL(href ?? "").hostname).toBe("www.figma.com")
  await openDocument(page, "/ui/link/")
  await expect(page.locator(".figma-preview a")).toHaveCount(0)
})

test("client route loading is announced and respects reduced motion", async ({
  page,
}) => {
  await openDocument(page, "/ui/button/")
  await expect(page.locator(".usage code")).toBeVisible()
  let release: () => void = () => undefined
  const ready = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route("**/app/document-*.tsx*", async (route) => {
    await ready
    await route.continue()
  })
  try {
    const phone = (page.viewportSize()?.width ?? 1280) < 640
    if (phone)
      await page.getByRole("button", { name: "Docs", exact: true }).click()
    await page
      .locator('nav[aria-label="Documentation"]:visible')
      .getByRole("link", { name: "Foundations", exact: true })
      .click()
    const loading = page
      .getByRole("status")
      .filter({ hasText: "Loading document" })
    await expect(loading).toBeVisible()
    await expect(loading.locator(".press-loading-mark")).toHaveAttribute(
      "aria-hidden",
      "true",
    )
    await expect(loading.locator(".press-loading-mark i").first()).toHaveCSS(
      "animation-name",
      "press-fold",
    )
    await page.emulateMedia({ reducedMotion: "reduce" })
    await expect(loading.locator(".press-loading-mark i").first()).toHaveCSS(
      "animation-name",
      "none",
    )
    release()
    await expect(
      page.getByLabel("Functional colors", { exact: true }),
    ).toBeVisible()
    await expect(loading).toHaveCount(0)
  } finally {
    release()
  }
})

test("returning home keeps the current document stable while its route loads", async ({
  page,
}, testInfo) => {
  await openDocument(page, "/ui/button/")
  const before = await page.locator("main h1").boundingBox()
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
    const status = page.locator('.press-loading-status[data-overlay="true"]')
    await expect(status).toBeVisible()
    const subheader = page.locator(".press-subheader")
    if (await subheader.isVisible()) {
      const bar = await subheader.boundingBox()
      const indicator = await status.boundingBox()
      expect(indicator?.y).toBeGreaterThanOrEqual(
        (bar?.y ?? 0) + (bar?.height ?? 0),
      )
    }
    expect((await page.locator("main h1").boundingBox())?.y).toBe(before?.y)
    await page.screenshot({
      path: testInfo.outputPath("return-home-loading.png"),
      animations: "disabled",
    })
    release()
    await expect(page.locator(".press-hero h1")).toHaveText(
      "Considered by design.",
    )
    await expect(page.locator("main[data-press-ready=true]")).toBeVisible()
    await expect(page.locator(".press-loading-status")).toHaveCount(0)
    await expect(page.locator(".press-sidebar")).toHaveCount(0)
  } finally {
    release()
  }
})

test("asynchronous document bodies use the square fallback and recover without a full reload", async ({
  page,
}) => {
  await openDocument(page, "/ui/button/")
  let release: () => void = () => undefined
  const ready = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route(
    "**/src/content/components/link/index.md*",
    async (route) => {
      await ready
      await route.continue()
    },
  )
  try {
    if ((page.viewportSize()?.width ?? 1280) < 640) {
      await page.getByRole("button", { name: "Docs", exact: true }).click()
    }
    await page
      .locator('nav[aria-label="Documentation"]:visible')
      .getByRole("link", { name: "Link", exact: true })
      .click()
    const loading = page.locator(".press-loading-status:visible")
    await expect(loading).toHaveCount(1)
    await expect(loading.locator("i")).toHaveCount(4)
    await expect(loading.locator("i").first()).toHaveCSS(
      "animation-name",
      "press-fold",
    )
    await page.emulateMedia({ reducedMotion: "reduce" })
    await expect(loading.locator("i").first()).toHaveCSS(
      "animation-name",
      "none",
    )
    release()
    await expect(page.locator("main[data-press-ready=true] h1")).toHaveText(
      "Link",
    )
    await expect(page.locator(".press-loading-status")).toHaveCount(0)
    await expect(page.locator("main")).toHaveCSS("animation-name", "none")
  } finally {
    release()
  }
})
