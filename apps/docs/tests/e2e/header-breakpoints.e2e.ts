import { expect, test } from "@playwright/test"
import { openDocument } from "../helpers/open-document"

test("Open header keeps inline tablet navigation and consistent locale Portal typography", async ({
  page,
}) => {
  await openDocument(page, "/markdown/")
  for (const width of [639, 640, 767, 768, 900, 1023, 1024, 1279, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    const phone = width < 640
    const nav = page.locator(".press-desktop-navigation")
    if (phone) {
      await expect(nav).toBeHidden()
      await expect(page.locator(".press-header .press-brand-label")).toHaveText(
        "Yuzur1ha Open",
      )
      await expect(
        page.locator(".press-header .press-brand-label"),
      ).toBeVisible()
      await page
        .getByRole("button", { name: "Navigation", exact: true })
        .click()
    } else await expect(nav).toBeVisible()
    const locale = page.getByRole("combobox", { name: "Language", exact: true })
    await expect(locale).toContainText(width < 1024 ? "EN" : "English")
    await expect(locale).toHaveCSS("font-size", "14px")
    let family = ""
    await expect
      .poll(async () => {
        family = await locale.evaluate(
          (node) => getComputedStyle(node).fontFamily,
        )
        return family
      })
      .toMatch(/JetBrains Mono/)
    await locale.click()
    await expect(page.getByRole("option").first()).toHaveCSS(
      "font-family",
      family,
    )
    await expect(page.getByRole("option").first()).toHaveCSS(
      "font-size",
      "14px",
    )
    await expect(page.getByRole("option").first()).toHaveCSS(
      "line-height",
      "21px",
    )
    await page.keyboard.press("Escape")
    if (phone) await page.keyboard.press("Escape")
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width)
  }
  await page.setViewportSize({ width: 390, height: 900 })
  await page.getByRole("button", { name: "Navigation", exact: true }).click()
  await expect(
    page.getByRole("dialog", { name: "Navigation", exact: true }),
  ).toBeVisible()
  await page.setViewportSize({ width: 820, height: 900 })
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expect(page.locator("body")).not.toHaveAttribute("data-scroll-locked")
})

test("Open home and reading headers use one gutter and control contract", async ({
  page,
}) => {
  for (const path of ["/", "/markdown/"]) {
    await openDocument(page, path)
    for (const width of [
      320, 390, 639, 640, 767, 768, 900, 1023, 1024, 1279, 1280, 1440, 1600,
    ]) {
      await page.setViewportSize({ width, height: 900 })
      const header = page.locator(".press-header")
      if (width < 640) {
        await expect(page.locator(".press-header-brand")).toHaveCSS(
          "padding-left",
          "20px",
        )
        await expect(page.locator(".press-phone-navigation")).toHaveCSS(
          "padding-right",
          "20px",
        )
      } else
        await expect(header).toHaveCSS(
          "padding-left",
          width < 1024 ? "24px" : "32px",
        )
      for (const control of await header
        .locator(
          ".yu-button:visible, .yu-select:visible, .yu-menu-item:visible",
        )
        .all()) {
        await expect(control).toHaveCSS("font-size", "14px")
        await expect(control).toHaveCSS("line-height", "21px")
        await expect(control).toHaveCSS("font-family", /JetBrains Mono/)
        await expect(control).toHaveCSS("height", "44px")
      }
      if (path === "/markdown/") {
        const subheader = page.locator(".press-subheader")
        if (width < 1024) {
          await expect(subheader).toBeVisible()
          for (const control of await subheader
            .locator(".yu-button:visible, .yu-disclosure-trigger:visible")
            .all()) {
            await expect(control).toHaveCSS("font-size", "14px")
            await expect(control).toHaveCSS("height", "44px")
          }
        } else await expect(subheader).toBeHidden()
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width)
    }
  }
})
