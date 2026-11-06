import { expect, test } from "@playwright/test"
import { openDocument } from "../helpers/open-document"
import { toggleTheme } from "../helpers/appearance"
import { site } from "../helpers/site"

test("desktop and tablet divide the first viewport between hero and features", async ({
  page,
}, testInfo) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 820, height: 768 },
    { width: 820, height: 600 },
  ]) {
    await page.setViewportSize(viewport)
    await openDocument(page, "/")
    const hero = await page.locator(".press-hero").boundingBox()
    const features = await page.locator(".press-features").boundingBox()
    expect(hero?.height).toBeCloseTo(viewport.height * 0.75, 0)
    expect(features?.height).toBeCloseTo(viewport.height * 0.25, 0)
    expect(features?.y).toBeCloseTo(viewport.height * 0.75, 0)
    const actions = await page.locator(".press-hero-actions").boundingBox()
    expect((actions?.y ?? 0) + (actions?.height ?? 0)).toBeLessThanOrEqual(
      hero?.height ?? 0,
    )
    const paragraph = page.locator(".press-feature-card p").first()
    await paragraph.evaluate((node) => {
      node.textContent =
        "A detailed description of the interface and its purpose. ".repeat(30)
    })
    await expect(paragraph).toHaveCSS("overflow", "hidden")
    expect(
      await paragraph.evaluate((node) => node.scrollHeight > node.clientHeight),
    ).toBe(true)
    expect(
      await paragraph.evaluate(
        (node) => getComputedStyle(node).webkitLineClamp,
      ),
    ).toMatch(/^[1-9]/)
  }
  await page.setViewportSize({ width: 1440, height: 900 })
  await openDocument(page, "/")
  await expect(page.locator(".press-loading-status")).toHaveCount(0)
  await page.screenshot({
    path: testInfo.outputPath("home-desktop.png"),
    fullPage: true,
    animations: "disabled",
  })
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator(".press-feature-card p").first()).toHaveCSS(
    "overflow",
    "visible",
  )
  expect(
    (await page.locator(".press-features").boundingBox())?.height,
  ).toBeGreaterThan(844 * 0.25)
})

test("desktop actions are text, icons then theme; reading bars have a distinct surface", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await openDocument(page, "/ui/button/")
  const actions = page.locator(".press-header-actions")
  const textLinks = (site.links ?? []).filter((link) => !link.icon)
  await expect(actions.locator(".press-text-links:visible a")).toHaveCount(
    textLinks.length,
  )
  const github = actions.getByRole("link", { name: "GitHub", exact: true })
  await expect(github).toHaveAttribute(
    "href",
    "https://github.com/soppylzz/yuzur1ha-oss",
  )
  await expect(github).toHaveAttribute("rel", "noopener noreferrer")
  const order = await actions
    .locator(":scope > *")
    .evaluateAll((nodes) =>
      nodes.map((node) =>
        node.matches(".press-text-links")
          ? "text"
          : node.matches(".press-icon-links-scroll")
            ? "icons"
            : node.matches(".press-controls")
              ? "controls"
              : "other",
      ),
    )
  expect(order).toEqual([
    ...(textLinks.length ? ["text"] : []),
    "icons",
    "controls",
  ])
  await page.setViewportSize({ width: 820, height: 768 })
  for (const dark of [false, true]) {
    if (dark) await toggleTheme(page)
    const bar = await page
      .locator(".press-subheader")
      .evaluate((node) => getComputedStyle(node).backgroundColor)
    const header = await page
      .locator(".press-header")
      .evaluate((node) => getComputedStyle(node, "::before").backgroundColor)
    expect(bar).not.toBe(header)
    expect(
      await page
        .locator("html")
        .evaluate(
          (node) => getComputedStyle(node, "::-webkit-scrollbar").width,
        ),
    ).toBe("6px")
  }
})

test("phone drawer groups navigation and keeps long links and settings within its own scroll area", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openDocument(page, "/ui/button/")
  await page.getByRole("button", { name: "Navigation", exact: true }).click()
  const drawer = page.getByRole("dialog", { name: "Navigation", exact: true })
  const overview = drawer.getByRole("group", { name: "Overview", exact: true })
  const docs = drawer.getByRole("group", { name: "Docs", exact: true })
  await expect(
    overview.getByRole("link", { name: "Home", exact: true }),
  ).toBeVisible()
  await expect(docs.getByRole("link")).toHaveCount(3)
  await expect(
    drawer.locator(".press-drawer-navigation + .press-drawer-text-links"),
  ).toHaveCount((site.links ?? []).some((link) => !link.icon) ? 1 : 0)
  await expect(
    drawer.locator(".press-icon-links-scroll + .press-controls"),
  ).toHaveCount(1)
  const settingsBox = await drawer
    .locator(".press-drawer-settings")
    .boundingBox()
  const scrollBox = await drawer.locator(".press-drawer-scroll").boundingBox()
  expect(
    (scrollBox?.y ?? 0) +
      (scrollBox?.height ?? 0) -
      ((settingsBox?.y ?? 0) + (settingsBox?.height ?? 0)),
  ).toBeCloseTo(24, 0)
  await drawer.screenshot({
    path: testInfo.outputPath("navigation-phone.png"),
    animations: "disabled",
  })
  await page.setViewportSize({ width: 390, height: 500 })
  const viewport = drawer.locator(".press-drawer-scroll > .yu-scroll-viewport")
  const before = await page.evaluate(() => scrollY)
  await drawer.locator(".press-drawer-navigation").evaluate((node) => {
    for (let index = 0; index < 30; index++) {
      const link = node.querySelector("a")?.cloneNode(true)
      if (link) node.append(link)
    }
  })
  await viewport.focus()
  await page.keyboard.press("End")
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollTop))
    .toBeGreaterThan(0)
  const theme = drawer.getByRole("switch", { name: "Theme", exact: true })
  const switchSurface = drawer.locator(".press-theme-setting .yu-choice")
  await switchSurface.scrollIntoViewIfNeeded()
  await expect(switchSurface).toBeInViewport()
  expect(await page.evaluate(() => scrollY)).toBe(before)
  expect(
    await drawer.evaluate((node) => node.scrollWidth <= node.clientWidth),
  ).toBe(true)
  await drawer.screenshot({
    path: testInfo.outputPath("navigation-overflow.png"),
    animations: "disabled",
  })
  await theme.focus()
  await page.keyboard.press("Space")
  await expect(theme).toBeChecked()
  await page.keyboard.press("Escape")
  await expect(drawer).toHaveCount(0)
})

test("fast page navigation keeps its marker visible for the minimum and releases it", async ({
  page,
}) => {
  await openDocument(page, "/ui/button/")
  const phone = (page.viewportSize()?.width ?? 1280) < 640
  if (phone)
    await page.getByRole("button", { name: "Docs", exact: true }).click()
  const started = Date.now()
  await page
    .locator('nav[aria-label="Documentation"]:visible')
    .getByRole("link", { name: "Link", exact: true })
    .click()
  const marker = page.locator(".press-loading-status")
  await expect(marker).toBeVisible()
  await expect(page.locator("main[data-press-ready=true] h1")).toHaveText(
    "Link",
  )
  await expect(marker).toHaveCount(0)
  expect(Date.now() - started).toBeGreaterThanOrEqual(390)
})
