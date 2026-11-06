import { expect, test } from "@playwright/test"
import { toggleTheme } from "../helpers/appearance"
import { openDocument } from "../helpers/open-document"

test("standard code, Demo and table presentation remain accessible across themes", async ({
  page,
}, testInfo) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: (source: string) => {
          Reflect.set(window, "copiedCode", source)
          return Promise.resolve()
        },
      },
    })
  })
  await openDocument(page, "/press/code-blocks/")
  const panel = page.locator(".yu-code-panel").first()
  await expect(panel).toHaveAttribute("data-source-ready", "true")
  await expect(panel.locator(".source-lines")).toHaveCount(0)
  const code = panel.locator("code")
  const original = await code.textContent()
  await panel.getByRole("button", { name: "Copy code" }).click()
  expect(
    await page.evaluate((): unknown => Reflect.get(window, "copiedCode")),
  ).toBe(original)
  await expect(panel.getByRole("status")).toHaveText("Code copied.")
  await expect(panel.getByRole("button")).toHaveText("Copy", { timeout: 4000 })
  const colors: string[] = []
  for (const dark of [false, true]) {
    if (dark) await toggleTheme(page)
    colors.push(
      await code
        .locator("span[style]")
        .first()
        .evaluate((node) => getComputedStyle(node).color),
    )
    await panel.screenshot({
      path: testInfo.outputPath(`code-${dark ? "dark" : "light"}.png`),
    })
  }
  expect(colors[0]).not.toBe(colors[1])
  await openDocument(page, "/markdown/typography/")
  const table = page.locator("main table").first()
  await expect(table).toHaveCSS("font-size", "12px")
  for (const [index, alignment] of ["left", "center", "right"].entries())
    await expect(table.locator("thead th").nth(index)).toHaveCSS(
      "text-align",
      alignment,
    )
  await expect(table.locator("th").first()).toHaveCSS(
    "border-left-width",
    "0px",
  )
  await page.setViewportSize({ width: 390, height: 844 })
  const region = page.locator(".press-table-scroll").first()
  await table.evaluate((node) => {
    node.style.minWidth = "1200px"
  })
  await region.scrollIntoViewIfNeeded()
  await region.focus()
  await expect(region).toBeFocused()
  await page.evaluate(() => new Promise(requestAnimationFrame))
  await region.press("ArrowRight")
  await expect
    .poll(() => region.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await openDocument(page, "/ui/button/")
  await expect(page.locator(".usage .source-lines")).toBeVisible()
  await expect(page.locator(".api-table").first()).toHaveCSS(
    "font-size",
    "12px",
  )
  expect(errors).toEqual([])
})

test("continuous resize keeps brand, directory and selected navigation text stable", async ({
  browser,
  baseURL,
}, testInfo) => {
  for (const dpr of [1, 1.25, 2]) {
    const context = await browser.newContext({
      deviceScaleFactor: dpr,
      viewport: { width: 1280, height: 900 },
    })
    try {
      const page = await context.newPage()
      await page.goto(`${baseURL}/ui/foundations/`)
      await expect(page.locator('main[data-press-ready="true"]')).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      const metrics = async () =>
        page.evaluate(() => {
          const phone = matchMedia("(width < 640px)").matches
          const selectors = phone
            ? [".press-header .press-brand-label"]
            : [
                ".press-sidebar .press-brand-label",
                ".press-sidebar .yu-menu-item .yu-menu-text",
                ".press-desktop-navigation a[aria-current] .yu-menu-text",
              ]
          const values = selectors.map((selector) => {
            const node = document.querySelector(selector)
            if (!node) throw new Error(selector)
            const style = getComputedStyle(node)
            const text = node.firstChild
            if (!text || text.nodeType !== Node.TEXT_NODE)
              throw new Error(`Missing text node: ${selector}`)
            const range = document.createRange()
            range.selectNodeContents(node)
            const bounds = range.getBoundingClientRect()
            const glyphs = Array.from(
              { length: text.textContent?.length ?? 0 },
              (_, index) => {
                range.setStart(text, index)
                range.setEnd(text, index + 1)
                const rect = range.getBoundingClientRect()
                return { x: rect.x - bounds.x, width: rect.width }
              },
            )
            return {
              textWidth: bounds.width,
              glyphs,
              family: style.fontFamily,
              size: style.fontSize,
              weight: style.fontWeight,
              line: style.lineHeight,
              scale: style.scale,
              width: node.getBoundingClientRect().width,
            }
          })
          return { phone, values }
        })
      const baselines = new Map<boolean, Awaited<ReturnType<typeof metrics>>>()
      const before = await metrics()
      baselines.set(before.phone, before)
      for (const width of [
        1278, 1100, 1025, 1024, 1023, 1022, 900, 768, 641, 640, 641, 900, 1023,
        1024, 1025, 1280,
      ]) {
        await page.setViewportSize({ width, height: 900 })
        const sample = await metrics()
        const baseline = baselines.get(sample.phone)
        if (baseline) expect(sample.values).toEqual(baseline.values)
        else baselines.set(sample.phone, sample)
        expect(sample.values[0]?.line).toBe(sample.phone ? "28px" : "32px")
        if (!sample.phone) {
          expect(sample.values[1]?.line).toBe("20px")
          expect(sample.values[2]?.scale).toBe("none")
        }
      }
      for (const dark of [false, true]) {
        if (dark) await toggleTheme(page)
        await page.emulateMedia({
          reducedMotion: dark ? "reduce" : "no-preference",
        })
        const brand = page.locator(".press-sidebar .press-brand-label")
        const first = await brand.screenshot({ animations: "disabled" })
        await page.setViewportSize({ width: 900, height: 900 })
        await page.setViewportSize({ width: 1280, height: 900 })
        expect(await brand.screenshot({ animations: "disabled" })).toEqual(
          first,
        )
        await brand.screenshot({
          path: testInfo.outputPath(`brand-${dpr}-${dark}.png`),
        })
      }
      await page.setViewportSize({ width: 639, height: 900 })
      await expect(page.locator(".press-header .press-brand")).toHaveCSS(
        "line-height",
        "28px",
      )
      await expect(page.locator(".press-desktop-navigation")).toBeHidden()
    } finally {
      await context.close()
    }
  }
})

test("new guides, old anchors and untranslated subpages retain navigation", async ({
  page,
}) => {
  for (const path of [
    "/markdown/getting-started/",
    "/markdown/compiler/",
    "/markdown/plugins/",
    "/markdown/vite/",
    "/markdown/typography/",
    "/press/getting-started/",
    "/press/configuration/",
    "/press/content/",
    "/press/theme/",
    "/press/code-blocks/",
    "/press/deployment/",
  ]) {
    await openDocument(page, path)
    await expect(page.locator(".press-pagination")).toHaveCount(1)
  }
  await openDocument(page, "/markdown/#typography-gfm")
  await expect(page.locator("#typography-gfm")).toHaveAttribute(
    "href",
    "/markdown/typography/",
  )
  await page.locator("#typography-gfm").click()
  await expect(page).toHaveURL(/\/markdown\/typography\/$/)
  await page.getByRole("combobox", { name: "Language", exact: true }).click()
  await page.getByRole("option", { name: /简体中文/ }).click()
  await expect(page).toHaveURL(/zh-cn\/\?translation=missing/)
})

test("fractional viewport tiers leave no gaps and touch targets retain their size", async ({
  page,
  browser,
  baseURL,
}) => {
  await page.goto("/markdown/")
  for (const width of [639.5, 639.99, 640, 1023.5, 1023.99, 1024]) {
    await page.evaluate((value) => {
      const old = document.querySelector("iframe[data-breakpoint-test]")
      old?.remove()
      const frame = document.createElement("iframe")
      frame.dataset.breakpointTest = "true"
      frame.style.width = `${value}px`
      frame.style.height = "900px"
      frame.style.border = "0"
      frame.src = "/markdown/"
      document.body.append(frame)
    }, width)
    const frame = await page
      .locator("iframe[data-breakpoint-test]")
      .elementHandle()
      .then((element) => element?.contentFrame())
    if (!frame) throw new Error("Missing breakpoint iframe")
    await frame.locator('main[data-press-ready="true"]').waitFor()
    const measured = await frame.evaluate(() => ({
      tiers: [
        matchMedia("(width < 640px)").matches,
        matchMedia("(640px <= width < 1024px)").matches,
        matchMedia("(width >= 1024px)").matches,
      ],
      navigationVisible:
        getComputedStyle(document.querySelector(".press-desktop-navigation")!)
          .display !== "none",
      brandSize: getComputedStyle(
        document.querySelector(".press-header .press-brand")!,
      ).fontSize,
    }))
    // Browsers quantize iframe widths and account for scrollbar gutters differently.
    expect(measured.tiers.filter(Boolean)).toHaveLength(1)
    expect(measured.navigationVisible).toBe(!measured.tiers[0])
    expect(measured.brandSize).toBe(measured.tiers[0] ? "19px" : "21px")
  }
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 600, height: 844 },
  })
  try {
    const touch = await context.newPage()
    await touch.goto(`${baseURL}/press/code-blocks/`)
    const button = touch.locator(".source-copy-button").first()
    await expect(button).toBeVisible()
    await expect(button).toHaveCSS("min-height", "44px")
  } finally {
    await context.close()
  }
})

test("font loading preserves brand and directory line boxes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  let release: () => void = () => undefined
  const ready = new Promise<void>((resolve) => {
    release = resolve
  })
  let requests = 0
  await page.route("**/*.woff2", async (route) => {
    requests++
    await ready
    await route.continue()
  })
  try {
    await page.goto("/markdown/compiler/", { waitUntil: "domcontentloaded" })
    await expect(page.locator('main[data-press-ready="true"]')).toBeVisible()
    await expect.poll(() => requests).toBeGreaterThan(0)
    const measure = () =>
      page.evaluate(() =>
        [
          ".press-sidebar .press-brand-label",
          ".press-sidebar .yu-menu-text",
        ].map((selector) => {
          const node = document.querySelector(selector)
          if (!node) throw new Error(selector)
          const style = getComputedStyle(node)
          return {
            family: style.fontFamily,
            size: style.fontSize,
            weight: style.fontWeight,
            line: style.lineHeight,
            scale: style.scale,
            height: node.getBoundingClientRect().height,
          }
        }),
      )
    const before = await measure()
    release()
    await page.evaluate(() => document.fonts.ready)
    expect(await measure()).toEqual(before)
    expect(before.map((item) => item.line)).toEqual(["32px", "20px"])
  } finally {
    release()
  }
})

test("phone controls and content-specific grids keep their own boundaries", async ({
  page,
}) => {
  await openDocument(page, "/ui/form/")
  for (const width of [599, 600, 620, 639, 640, 646]) {
    await page.setViewportSize({ width, height: 900 })
    const phone = await page.evaluate(
      () => matchMedia("(width < 640px)").matches,
    )
    await expect(
      page.locator(".demo-content .yu-form-actions").first(),
    ).toHaveCSS("flex-direction", phone ? "column" : "row")
  }
  await openDocument(page, "/ui/modal/")
  await page
    .getByRole("button", { name: "Open confirmation", exact: true })
    .click()
  for (const width of [599, 600, 620, 639, 640, 646]) {
    await page.setViewportSize({ width, height: 900 })
    const phone = await page.evaluate(
      () => matchMedia("(width < 640px)").matches,
    )
    await expect(
      page.getByRole("dialog").locator(".yu-modal-actions"),
    ).toHaveCSS("flex-direction", phone ? "column" : "row")
  }
  await page.keyboard.press("Escape")
  await page.goto("/missing-content-breakpoint/")
  for (const width of [767, 768, 769, 775]) {
    await page.setViewportSize({ width, height: 900 })
    const single = await page.evaluate(
      () => matchMedia("(width < 768px)").matches,
    )
    const columns = await page
      .locator(".press-not-found")
      .evaluate(
        (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
      )
    expect(columns).toBe(single ? 1 : 2)
  }
  await openDocument(page, "/ui/foundations/")
  for (const width of [899, 900, 901, 907]) {
    await page.setViewportSize({ width, height: 900 })
    const compact = await page.evaluate(
      () => matchMedia("(width <= 900px)").matches,
    )
    const columns = await page
      .locator(".palette")
      .first()
      .evaluate(
        (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
      )
    expect(columns).toBe(compact ? 3 : 6)
  }
})

test("brand inset stays at 32px between tablet and desktop on foundations and home", async ({
  page,
}) => {
  for (const path of ["/ui/foundations/", "/"]) {
    await page.goto(path)
    await expect(page.locator('main[data-press-ready="true"]')).toBeVisible()
    await page.evaluate(() => document.fonts.ready)
    for (const width of [
      1280, 1100, 1024, 1023, 900, 820, 700, 820, 1024, 1280,
    ]) {
      await page.setViewportSize({ width, height: 900 })
      const brand = page.locator(
        path === "/"
          ? ".press-header .press-brand-mark"
          : ".press-sidebar .press-brand-mark",
      )
      expect((await brand.boundingBox())?.x).toBe(32)
      if (path !== "/")
        await expect(page.locator(".press-sidebar-brand")).toHaveCSS(
          "padding-left",
          "32px",
        )
    }
    await page.setViewportSize({ width: 390, height: 844 })
    expect(
      (await page.locator(".press-header .press-brand-mark").boundingBox())?.x,
    ).toBe(20)
  }
})

test("brand link content has a fixed width and truncates long titles", async ({
  page,
}) => {
  for (const path of ["/ui/foundations/", "/"]) {
    await openDocument(page, path)
    for (const width of [1280, 1100, 1024, 1023, 800, 640, 639, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      const phone = await page.evaluate(
        () => matchMedia("(width < 640px)").matches,
      )
      const brand = page.locator(
        path === "/" || phone
          ? ".press-header .press-brand"
          : ".press-sidebar .press-brand",
      )
      await expect(brand).toBeVisible()
      await expect
        .poll(async () => (await brand.boundingBox())?.width)
        .toBe(180)
      await expect
        .poll(
          async () =>
            (await brand.locator(".yu-link-content").boundingBox())?.width,
        )
        .toBe(180)
      await expect(brand.locator(".yu-link-content")).toHaveCSS(
        "flex-shrink",
        "0",
      )
      await brand.locator(".press-brand-label").evaluate((node) => {
        node.textContent =
          "A deliberately long documentation site title that must truncate"
      })
      await expect(brand.locator(".press-brand-label")).toHaveCSS(
        "text-overflow",
        "ellipsis",
      )
      expect(
        await brand
          .locator(".press-brand-label")
          .evaluate((node) => node.scrollWidth > node.clientWidth),
      ).toBe(true)
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true)
    }
  }
})

test("foundations keeps actual glyph advances constant while resize frames are arriving", async ({
  page,
}, testInfo) => {
  await page.goto("/ui/foundations/")
  await expect(page.locator('main[data-press-ready="true"]')).toBeVisible()
  await page.evaluate(async () => {
    await document.fonts.load('500 21px "Instrument Sans Variable"')
    await document.fonts.load('400 14px "Instrument Sans Variable"')
    await document.fonts.ready
  })
  const sampling = page.evaluate(async () => {
    const samples = []
    const content = document.querySelector(".press-sidebar .yu-link-content")
    if (!content) throw new Error("Missing brand link content")
    for (let frame = 0; frame < 120; frame++) {
      await new Promise(requestAnimationFrame)
      samples.push(
        [
          ".press-sidebar .press-brand-label",
          ".press-sidebar .yu-menu-item .yu-menu-text",
        ].map((selector) => {
          const node = document.querySelector(selector)
          if (!node?.firstChild || node.firstChild.nodeType !== Node.TEXT_NODE)
            throw new Error(selector)
          const style = getComputedStyle(node)
          const range = document.createRange()
          range.selectNodeContents(node)
          const bounds = range.getBoundingClientRect()
          const glyphs = Array.from(
            { length: node.firstChild.textContent?.length ?? 0 },
            (_, index) => {
              range.setStart(node.firstChild!, index)
              range.setEnd(node.firstChild!, index + 1)
              const rect = range.getBoundingClientRect()
              return { x: rect.x, width: rect.width }
            },
          )
          return {
            font: style.font,
            spacing: style.letterSpacing,
            scale: style.scale,
            textWidth: bounds.width,
            glyphs,
            link: selector.includes("press-brand-label")
              ? [
                  content,
                  content.parentElement!,
                  content.parentElement!.parentElement!,
                ].map((element) => {
                  const computed = getComputedStyle(element)
                  const rect = element.getBoundingClientRect()
                  return {
                    sameContent:
                      document.querySelector(
                        ".press-sidebar .yu-link-content",
                      ) === content,
                    className: element.className,
                    bounds: [rect.x, rect.y, rect.width, rect.height],
                    font: computed.font,
                    spacing: computed.letterSpacing,
                    transform: computed.transform,
                    scale: computed.scale,
                    gap: computed.gap,
                    alignment: computed.alignItems,
                    after: getComputedStyle(element, "::after").content,
                    animations: element.getAnimations().length,
                  }
                })
              : null,
          }
        }),
      )
    }
    return samples
  })
  for (let frame = 0; frame < 48; frame++)
    await page.setViewportSize({
      width: 800 + Math.round((500 * (1 + Math.sin(frame * 0.5))) / 2),
      height: 780 + (frame % 5) * 17,
    })
  const samples = await sampling
  expect(samples).toHaveLength(120)
  await testInfo.attach("glyph-frames", {
    body: JSON.stringify(samples),
    contentType: "application/json",
  })
  for (const sample of samples) expect(sample).toEqual(samples[0])
})
