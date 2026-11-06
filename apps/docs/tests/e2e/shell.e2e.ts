import { toggleTheme } from "../helpers/appearance"
import { openDocument } from "../helpers/open-document"
import { expect, test } from "@playwright/test"
import { site } from "../helpers/site"
import { sections } from "../../yupress.config"
const groups = sections.find((section) => section.id === "ui")?.groups ?? []

test("ordered UI sidebar and groups remain identical across responsive layouts", async ({
  page,
}) => {
  const expected = [
    ...groups.flatMap((group) => group.documents.map((id) => `/ui/${id}/`)),
  ]
  for (const width of [1280, 820, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await openDocument(page, "/ui/button/")
    await expect(page.locator(".document-header h1")).toHaveText("Button")
    if (width < 640)
      await page.getByRole("button", { name: "Docs", exact: true }).click()
    const menu = page.locator(
      width < 640
        ? '.yu-menu[aria-label="Documentation"]:visible'
        : ".press-sidebar nav",
    )
    await expect(menu.getByRole("link")).toHaveCount(expected.length)
    expect(
      await menu
        .getByRole("link")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href"))),
    ).toEqual(expected)
    for (const group of groups.filter((group) => group.label))
      await expect(
        menu.getByRole("group", { name: group.label, exact: true }),
      ).toBeVisible()
    if (width < 640) await page.keyboard.press("Escape")
  }
})

test("real route navigation resets reading, keeps the session and follows document URLs", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await openDocument(page, "/ui/button/")
  await expect(page).toHaveURL(/\/ui\/button\/$/)
  await expect(page.locator(".usage code")).toBeVisible()
  const menu = page.locator(".press-sidebar nav")
  await menu.getByRole("link", { name: "Link", exact: true }).click()
  await expect(page.locator(".document-header h1")).toHaveText("Link")
  await page.evaluate(() => scrollTo(0, 1000))
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0)
  await menu.getByRole("link", { name: "Button", exact: true }).click()
  await expect(page.locator(".document-header h1")).toHaveText("Button")
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
  await expect(page).toHaveTitle(`Button — ${site.title}`)
  await page.evaluate(() => {
    document.documentElement.dataset.shellSession = "kept"
  })
  await page.getByRole("link", { name: site.title, exact: true }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(
    page.getByRole("heading", { name: "Considered by design.", exact: true }),
  ).toBeVisible()
  await expect(page.locator("html")).toHaveAttribute(
    "data-shell-session",
    "kept",
  )
  await page
    .locator('nav[aria-label="Sections"]:visible')
    .first()
    .getByRole("link", { name: "Markdown", exact: true })
    .click()
  await expect(page).toHaveURL(/\/markdown\/$/)
  await expect(
    page.getByRole("heading", { name: "Markdown", level: 1, exact: true }),
  ).toBeVisible()
  await page
    .locator('nav[aria-label="Sections"]:visible')
    .first()
    .getByRole("link", { name: "YuPress", exact: true })
    .click()
  await expect(page).toHaveURL(/\/press\/$/)
})

test("metadata retains dates, version, configured eyebrow and bounded width in both themes", async ({
  page,
}) => {
  for (const width of [320, 640, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await openDocument(page, "/ui/button/")
    const header = page.locator(".document-header")
    await expect(
      header.getByRole("heading", { name: "Button", level: 1 }),
    ).toBeVisible()
    await expect(header.locator(".document-version")).toContainText("Draft")
    await expect(header.locator("time")).toHaveText("24 Oct 2026")
    await expect(header.locator("time")).toHaveAttribute(
      "datetime",
      "2026-10-24",
    )
    await expect(header.locator(".document-details a")).toHaveCount(0)
    await expect(header.locator(".document-kicker")).toContainText(
      "Component reference",
    )
    await expect(page.locator(".preview-heading a")).toHaveCount(0)
    await toggleTheme(page)
    await expect(page.locator(".figma-preview")).toBeVisible()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
  }
})
