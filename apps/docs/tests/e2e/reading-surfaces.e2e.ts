import { expect, test } from "@playwright/test"
import { openDocument } from "../helpers/open-document"

test("initial hash entry animates after hydration and respects reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.addInitScript(() => {
    const positions: number[] = []
    Object.defineProperty(window, "yupressHashSamples", { value: positions })
    let frames = 0
    const sample = () => {
      if (positions.at(-1) !== Math.round(scrollY))
        positions.push(Math.round(scrollY))
      if (++frames < 600) requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
  })
  for (const reduced of [false, true]) {
    await page.emulateMedia({
      reducedMotion: reduced ? "reduce" : "no-preference",
    })
    await openDocument(page, "/markdown/typography/#deliberate-hierarchy")
    const heading = page.locator("#deliberate-hierarchy")
    await expect
      .poll(() =>
        heading.evaluate((node) =>
          Math.abs(node.getBoundingClientRect().top - 128),
        ),
      )
      .toBeLessThan(3)
    if (!reduced) {
      await expect
        .poll(() =>
          page.evaluate(() => {
            const positions: unknown = Reflect.get(window, "yupressHashSamples")
            return Array.isArray(positions) ? positions.length : 0
          }),
        )
        .toBeGreaterThan(3)
    }
  }
})

test("Docs language controls switch translated pages and fall back for missing translations", async ({
  page,
}, testInfo) => {
  for (const width of [1440, 820, 640, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await openDocument(page, "/markdown/")
    if (width < 640)
      await page
        .getByRole("button", { name: "Navigation", exact: true })
        .click()
    const control = page
      .getByRole("combobox", { name: "Language", exact: true })
      .filter({ visible: true })
    await expect(control).toBeVisible()
    await expect(page.locator(".press-loading-status")).toHaveCount(0)
    await page.screenshot({
      path: testInfo.outputPath(`locale-control-${width}.png`),
    })
    if (width >= 640) {
      const theme = page.locator(".press-header-actions .press-theme-setting")
      await expect(theme).toBeInViewport()
      expect(
        await theme.evaluate((node) => node.getBoundingClientRect().right),
      ).toBeLessThanOrEqual(width)
    }
    await control.click()
    await page
      .getByRole("option", {
        name: width < 1024 ? "简" : "简体中文",
        exact: true,
      })
      .click()
    await expect(page).toHaveURL(/\/zh-cn\/markdown\/$/)
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN")
    await expect(
      page
        .locator("#main")
        .getByText("中文翻译正在进行中。请先阅读英文文档。", { exact: true }),
    ).toBeVisible()
    if (width < 640)
      await page.getByRole("button", { name: "导航", exact: true }).click()
    await page
      .getByRole("combobox", { name: "语言", exact: true })
      .filter({ visible: true })
      .click()
    await page
      .getByRole("option", {
        name: width < 1024 ? "EN" : "English",
        exact: true,
      })
      .click()
    await expect(page).toHaveURL(/\/markdown\/$/)
    await openDocument(page, "/ui/button/")
    if (width < 640)
      await page
        .getByRole("button", { name: "Navigation", exact: true })
        .click()
    await page
      .getByRole("combobox", { name: "Language", exact: true })
      .filter({ visible: true })
      .click()
    await page
      .getByRole("option", {
        name: width < 1024 ? "简" : "简体中文",
        exact: true,
      })
      .click()
    await expect(page).toHaveURL(/\/zh-cn\/\?translation=missing$/)
    await expect(
      page.getByText("这篇文档暂无中文版本，请选择其他中文文档。"),
    ).toBeVisible()
    await expect(page.locator('main[data-press-ready="true"]')).toBeVisible()
    await expect(page.locator(".press-loading-status")).toHaveCount(0)
    expect(
      await page
        .locator(".press-translation-notice")
        .evaluate((node) => node.getBoundingClientRect().top),
    ).toBeGreaterThanOrEqual(64)
    await page.screenshot({ path: testInfo.outputPath(`locale-${width}.png`) })
  }
})

test("phone directory has one scroll viewport and hidden rails retain keyboard scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 650 })
  await openDocument(page, "/ui/scroll-area/")
  await page
    .locator(".press-directory-disclosure .yu-disclosure-trigger")
    .click()
  const scroll = page.locator(".press-directory-panel .yu-menu-scroll")
  await expect(scroll.locator(".yu-scroll-viewport")).toHaveCount(1)
  const viewport = scroll.locator(".yu-scroll-viewport")
  await expect(viewport).toHaveCSS("scrollbar-width", "none")
  expect(
    await viewport.evaluate(
      (node) => getComputedStyle(node, "::-webkit-scrollbar").display,
    ),
  ).toBe("none")
  await viewport.focus()
  await viewport.press("End")
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollTop))
    .toBeGreaterThan(0)
  await page.keyboard.press("Escape")
  const hidden = page.getByRole("region", { name: "hidden list", exact: true })
  await hidden.scrollIntoViewIfNeeded()
  await hidden.focus()
  await hidden.press("End")
  await expect
    .poll(() => hidden.evaluate((node) => node.scrollTop))
    .toBeGreaterThan(0)
  await expect(hidden.locator("..").locator(".yu-scrollbar")).toBeHidden()
})

test("header icons keep centered geometry and no native rail under narrow widths", async ({
  page,
}) => {
  for (const width of [1440, 1024, 820]) {
    await page.setViewportSize({ width, height: 900 })
    await openDocument(page, "/markdown/")
    const link = page.locator(".press-header-actions .press-icon-link")
    await link.hover()
    await expect(link).toHaveCSS("text-decoration-line", "none")
    const viewport = page.locator(
      ".press-header-actions .press-icon-links-scroll .yu-scroll-viewport",
    )
    await expect(viewport).toHaveCSS("scrollbar-width", "none")
    await page
      .locator(".press-header-actions .press-icon-links")
      .evaluate((node) => {
        const icon = node.firstElementChild
        if (icon)
          for (let count = 0; count < 8; count++)
            node.append(icon.cloneNode(true))
      })
    expect(
      await viewport.evaluate((node) => node.scrollWidth > node.clientWidth),
    ).toBe(true)
    await viewport.focus()
    await viewport.press("ArrowRight")
    await expect
      .poll(() => viewport.evaluate((node) => node.scrollLeft))
      .toBeGreaterThan(0)
    const geometry = await link.first().evaluate((node) => {
      const link = node.getBoundingClientRect(),
        icon = node.querySelector("svg")?.getBoundingClientRect()
      return icon
        ? Math.abs((link.left + link.right - icon.left - icon.right) / 2)
        : Infinity
    })
    expect(geometry).toBeLessThan(1)
  }
})

test("Figma preview uses a local folding mark until the mocked embed is ready", async ({
  page,
}, testInfo) => {
  let release: () => void = () => undefined
  const ready = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route("https://embed.figma.com/**", async (route) => {
    await ready
    await route.fulfill({
      contentType: "text/html",
      body: "<html><body>Design fixture</body></html>",
    })
  })
  try {
    await openDocument(page, "/ui/button/")
    await expect(page.locator(".press-loading-status")).toHaveCount(0)
    await page
      .getByRole("button", { name: "Load preview", exact: true })
      .click()
    const loading = page.locator(".figma-preview-loading")
    await expect(loading).toBeVisible()
    await expect(loading.locator("i")).toHaveCount(4)
    await page.emulateMedia({ reducedMotion: "reduce" })
    await expect(loading.locator(".figma-loading-squares")).toHaveCSS(
      "animation-name",
      "none",
    )
    await loading.screenshot({ path: testInfo.outputPath("figma-loading.png") })
    release()
    await expect(loading).toBeHidden()
  } finally {
    release()
  }
})
