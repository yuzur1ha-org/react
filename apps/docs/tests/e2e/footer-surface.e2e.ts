import { toggleTheme } from "../helpers/appearance"
import { openDocument } from "../helpers/open-document"
import { expect, test } from "@playwright/test"

test("short pages fill the viewport and long documents put the footer after their content", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1800 })
  await openDocument(page, "/press/")
  await expect(
    page.getByRole("heading", { name: "YuPress", level: 1, exact: true }),
  ).toBeVisible()
  await expect
    .poll(() =>
      page
        .locator(".press-footer")
        .evaluate((node) =>
          Math.abs(node.getBoundingClientRect().bottom - innerHeight),
        ),
    )
    .toBeLessThan(2)
  await openDocument(page, "/ui/button/")
  await expect(page.locator(".usage code")).toBeVisible()
  expect(
    await page
      .locator(".press-footer")
      .evaluate((node) => node.getBoundingClientRect().top),
  ).toBeGreaterThan(1800)
})

test("one theme selection reaches the reading surface and active navigation", async ({
  page,
}) => {
  await openDocument(page, "/ui/button/")
  const link = page.locator('.press-sidebar a[aria-current="page"]')
  const light = await link.evaluate(
    (node) => getComputedStyle(node).backgroundColor,
  )
  await toggleTheme(page)
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(23, 24, 25)",
  )
  await expect
    .poll(() => link.evaluate((node) => getComputedStyle(node).backgroundColor))
    .not.toBe(light)
  await page.reload()
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
})
