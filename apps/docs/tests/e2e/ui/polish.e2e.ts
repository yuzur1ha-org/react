import { toggleTheme, themeSwitch } from "../../helpers/appearance"
import { expect, test, type Locator, type Page } from "@playwright/test"
import { componentIds } from "../../helpers/inventory"
import { openDocument } from "../../helpers/open-document"

async function borderPixels(page: Page, control: Locator, path: string) {
  const screenshot = await control.screenshot({ path })
  return page.evaluate(async (base64) => {
    const image = new Image()
    image.src = `data:image/png;base64,${base64}`
    await image.decode()
    const canvas = document.createElement("canvas")
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext("2d")
    if (!context) throw new Error("Canvas unavailable")
    context.drawImage(image, 0, 0)
    const width = image.width
    const height = image.height
    const band = Math.ceil(2 * window.devicePixelRatio)
    const data = context.getImageData(0, 0, width, height).data
    const pixels: number[] = []
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        if (x < band || x >= width - band || y < band || y >= height - band) {
          const offset = (y * width + x) * 4
          pixels.push(...data.slice(offset, offset + 4))
        }
      }
    return pixels
  }, screenshot.toString("base64"))
}

test("NumberField preserves its painted focus border while step buttons are held", async ({
  page,
}, testInfo) => {
  for (const dark of [false, true]) {
    await openDocument(page, "/ui/number-field/")
    const toggle = themeSwitch(page)
    if ((await toggle.isChecked()) !== dark) await toggleTheme(page)
    const input = page.getByRole("spinbutton", { name: "Number", exact: true })
    const control = page.locator(".demo-content .yu-number-control").first()
    const increase = control.getByRole("button", {
      name: "Increase",
      exact: true,
    })
    await page.evaluate(() => document.fonts.ready)
    await control.scrollIntoViewIfNeeded()
    await input.focus()
    await expect
      .poll(() =>
        control.evaluate(
          (node) => getComputedStyle(node, "::after").borderTopColor,
        ),
      )
      .toBe(dark ? "rgb(238, 237, 232)" : "rgb(19, 20, 21)")
    await control.scrollIntoViewIfNeeded()
    await control.evaluate(async (node) => {
      await Promise.all(
        node
          .getAnimations({ subtree: true })
          .map((animation) => animation.finished.catch(() => undefined)),
      )
      await new Promise(requestAnimationFrame)
    })
    const before = await borderPixels(
      page,
      control,
      testInfo.outputPath(`border-${dark}-before.png`),
    )
    const bounds = await control.boundingBox()
    await increase.hover()
    await page.mouse.down()
    await expect(increase).toHaveCSS("scale", "none")
    await expect(increase.locator("svg")).toHaveCSS("scale", "0.97")
    expect(await control.boundingBox()).toEqual(bounds)
    const held = await borderPixels(
      page,
      control,
      testInfo.outputPath(`border-${dark}-held.png`),
    )
    expect(
      held.length === before.length &&
        held.every((value, index) => value === before[index]),
      "The entire focus border remains unchanged during a press",
    ).toBe(true)
    await control.screenshot({
      path: testInfo.outputPath(
        `number-field-${dark ? "dark" : "light"}-held.png`,
      ),
    })
    await page.mouse.up()
    await expect(input).toHaveValue("5")
    await expect(input).toBeFocused()
    await page.emulateMedia({ reducedMotion: "reduce" })
    await increase.hover()
    await page.mouse.down()
    await expect(increase.locator("svg")).toHaveCSS("scale", "1")
    await page.mouse.up()
    await page.emulateMedia({ reducedMotion: "no-preference" })
    await input.fill("120")
    await expect(input).toHaveAttribute("aria-invalid", "true")
    await expect
      .poll(() =>
        control.evaluate(
          (node) => getComputedStyle(node, "::after").borderTopColor,
        ),
      )
      .toBe(dark ? "rgb(255, 155, 146)" : "rgb(180, 35, 24)")
    await control.getByRole("button", { name: "Decrease", exact: true }).click()
    await expect(input).toHaveValue("99")
    await expect(input).toHaveAttribute("aria-invalid", "false")
  }
})

for (const name of componentIds) {
  test(`${name} demo retains dark-theme colors and fits the viewport`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    await openDocument(page, `/ui/${name}/`)
    await toggleTheme(page)
    const root = page.locator('.demo-content [class*="yu-"]').first()
    await expect(root).toBeVisible()
    await expect(root).toHaveCSS("--yu-color-scheme", "dark")
    await expect(page.locator(".usage code")).toBeVisible()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    expect(errors).toEqual([])
  })
}

test("source-copy failure is visible and retry preserves the source", async ({
  page,
}) => {
  await page.addInitScript(() => {
    let attempts = 0
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: () =>
          attempts++ === 0
            ? Promise.reject(new Error("Clipboard unavailable in this test"))
            : Promise.resolve(),
      },
    })
  })
  await openDocument(page, "/ui/toast/")
  const code = page.locator(".usage code")
  const before = await code.textContent()
  const copy = page.getByRole("button", { name: "Copy code", exact: true })
  await copy.click()
  await expect(page.locator(".source-copy-error")).toBeVisible()
  await expect(copy).toHaveText("Retry")
  await copy.click()
  await expect(copy).toHaveText("Copied")
  await expect(page.locator(".source-copy-error")).toHaveCount(0)
  expect(await code.textContent()).toBe(before)
})
