import { expect, test } from "@playwright/test"
import { openDocument } from "../helpers/open-document"

test("hash clicks animate only the page jump and reduced motion remains instant", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  for (const reduce of [false, true]) {
    await page.emulateMedia({
      reducedMotion: reduce ? "reduce" : "no-preference",
    })
    await openDocument(page, "/markdown/typography/")
    const heading = page.locator("#deliberate-hierarchy")
    const id = await heading.getAttribute("id")
    const samples = page.evaluate(
      () =>
        new Promise<number[]>((resolve) => {
          const collect = async () => {
            const values: number[] = []
            for (let frame = 0; frame < 35; frame++) {
              await new Promise(requestAnimationFrame)
              values.push(scrollY)
            }
            resolve(values)
          }
          document.addEventListener(
            "click",
            () => {
              void collect()
            },
            { once: true },
          )
        }),
    )
    await page
      .locator(`.press-toc a[href="#${encodeURIComponent(id ?? "")}"]`)
      .click()
    await expect(page).toHaveURL(new RegExp(`#${id}$`))
    const positions = await samples
    await expect
      .poll(() =>
        heading.evaluate((node) =>
          Math.abs(node.getBoundingClientRect().top - 128),
        ),
      )
      .toBeLessThan(3)
    if (!reduce)
      expect(new Set(positions.map(Math.round)).size).toBeGreaterThan(2)
    await page.goBack()
    await expect(page).toHaveURL(/\/markdown\/typography\/$/)
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-yupress-hash-navigation",
    )
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
  }
})

test("brand labels reserve room for glyphs and still truncate long names", async ({
  page,
}, testInfo) => {
  await openDocument(page, "/")
  await page.evaluate(() => document.fonts.ready)
  expect(
    await page.evaluate(() =>
      Array.from(document.fonts).some(
        (font) =>
          font.family.includes("Instrument Sans") && font.status === "loaded",
      ),
    ),
  ).toBe(true)
  for (const width of [1440, 820, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await openDocument(page, "/ui/button/")
    const label = page.locator(".press-brand-label:visible").first()
    const geometry = await label.evaluate((node) => {
      const range = document.createRange()
      range.selectNodeContents(node)
      const text = range.getBoundingClientRect(),
        style = getComputedStyle(node)
      return {
        height: node.clientHeight,
        textHeight: text.height,
        padding: Number.parseFloat(style.paddingLeft),
      }
    })
    expect(geometry.height).toBeGreaterThan(geometry.textHeight)
    expect(geometry.padding).toBe(0)
    await label.screenshot({ path: testInfo.outputPath(`brand-${width}.png`) })
    await label.evaluate(
      (node) =>
        (node.textContent = "YuPress Documentation / Typography — Ágijy".repeat(
          3,
        )),
    )
    await expect(label).toHaveCSS("text-overflow", "ellipsis")
    expect(
      await label.evaluate((node) => node.scrollWidth > node.clientWidth),
    ).toBe(true)
  }
})

test("Reference source is precompiled with its document and needs no highlighter chunk", async ({
  page,
}) => {
  const scripts: string[] = []
  page.on("request", (request) => {
    if (request.resourceType() === "script") scripts.push(request.url())
  })
  await openDocument(page, "/ui/button/")
  await expect(page.locator(".usage .yu-code-panel")).toHaveAttribute(
    "data-source-ready",
    "true",
  )
  await expect(page.locator(".preview-loading")).toHaveCount(0)
  await expect(
    page.locator('.usage code span[style*="--yu-code-token-keyword"]').first(),
  ).toBeVisible()
  expect(
    scripts.filter((url) => /(?:shiki|prism|source-preview-)/i.test(url)),
  ).toEqual([])
  const toggle = page.getByRole("button", {
    name: "React / TypeScript",
    exact: true,
  })
  await toggle.click()
  await expect(page.locator(".usage code")).toBeHidden()
  await toggle.click()
  await expect(page.locator(".usage code")).toBeVisible()
})

test("legacy query URLs are not redirected and the product credit uses YuPress", async ({
  page,
}) => {
  await openDocument(page, "/?component=button")
  await expect(page).toHaveURL(/\/\?component=button$/)
  await expect(page.locator(".press-hero h1")).toBeVisible()
  await expect(page.locator(".press-footer")).toContainText(
    "Powered by YuPress",
  )
})
