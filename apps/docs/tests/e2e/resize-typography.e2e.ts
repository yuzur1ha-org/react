import { expect, test } from "@playwright/test"

test.use({ launchOptions: { ignoreDefaultArgs: ["--hide-scrollbars"] } })

test("loaded document typography stays stable across tablet and desktop boundaries", async ({
  page,
}) => {
  await page.goto("/markdown/")
  await expect(page.locator("#main h1")).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  const samples = []
  for (const width of [1278, 1279, 1280, 1281, 1023, 1024, 899, 900, 901]) {
    await page.setViewportSize({ width, height: 900 })
    samples.push(
      await page.locator("#main h1").evaluate((node) => {
        const style = getComputedStyle(node)
        return {
          family: style.fontFamily,
          size: style.fontSize,
          weight: style.fontWeight,
          spacing: style.letterSpacing,
        }
      }),
    )
  }
  for (const sample of samples) expect(sample).toEqual(samples[0])
  await expect
    .poll(() =>
      page
        .locator("#main")
        .evaluate(
          (node) =>
            node.getAnimations().filter((item) => item.playState === "finished")
              .length,
        ),
    )
    .toBe(0)
  expect(
    await page.evaluate(() =>
      document.fonts.check('16px "Instrument Sans Variable"'),
    ),
  ).toBe(true)
})

test("Press locale overlays retain reading and fixed-header widths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/markdown/")
  await expect(page.locator("#main h1")).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  const geometry = () =>
    page.evaluate(() =>
      [".press-header", ".press-reading", ".press-sidebar"].map((selector) => {
        const rect = document.querySelector(selector)?.getBoundingClientRect()
        return { x: rect?.x, width: rect?.width }
      }),
    )
  const before = await geometry()
  await page.getByRole("combobox", { name: "Language", exact: true }).click()
  await expect(page.locator("body")).toHaveAttribute("data-scroll-locked", "1")
  expect(await geometry()).toEqual(before)
  await page.keyboard.press("Escape")
  expect(await geometry()).toEqual(before)
})
