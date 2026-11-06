import { expect, test } from "@playwright/test"
import { openDocument } from "../../helpers/open-document"

test("Menu uses one navigation tree across inline, popover and drawer layouts", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await openDocument(page, "/ui/menu/")
  const surface = page.locator(".demo-content .yu-responsive-menu")
  await expect(surface).toHaveAttribute("data-layout", "inline")
  const nav = page.getByRole("navigation", { name: "Workspace", exact: true })
  await nav.getByRole("link", { name: "Activity", exact: false }).click()
  await expect(page.locator("output")).toHaveText("Activity")
  await page.setViewportSize({ width: 800, height: 900 })
  await expect(surface).toHaveAttribute("data-layout", "popover")
  const trigger = page.getByRole("button", { name: "Browse workspace" })
  await trigger.click()
  await expect(
    page.getByRole("dialog", { name: "Workspace navigation" }),
  ).toBeVisible()
  await nav.getByRole("link", { name: "Members", exact: false }).click()
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await trigger.click()
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(surface).toHaveAttribute("data-layout", "drawer")
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await trigger.click()
  await expect(
    page.getByRole("dialog", { name: "Workspace navigation" }),
  ).toBeVisible()
  await expect(
    nav.getByRole("link", { name: "Members", exact: false }),
  ).toHaveAttribute("aria-current", "page")
  await nav.getByRole("button", { name: "Settings" }).click()
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await expect(page.locator("output")).toHaveText("Settings")
  await trigger.click()
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
})
test("Disclosure retains controlled edits and has independent keyboard toggles", async ({
  page,
}) => {
  await openDocument(page, "/ui/disclosure/")
  const trigger = page.getByRole("button", { name: "Additional details" })
  await page.getByLabel("Internal note").fill("Keep this draft")
  await trigger.focus()
  await trigger.press("Space")
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect(page.getByLabel("Internal note")).toBeHidden()
  await trigger.press("Enter")
  await expect(page.getByLabel("Internal note")).toHaveValue("Keep this draft")
  const privacy = page.getByRole("button", { name: "Privacy information" })
  await privacy.click()
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await expect(privacy).toHaveAttribute("aria-expanded", "true")
  await expect(
    page.getByRole("button", { name: "Unavailable details" }),
  ).toBeDisabled()
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(
    page
      .locator('.demo-content .yu-disclosure-content[data-state="open"]')
      .first(),
  ).toHaveCSS("animation-name", "none")
})
test("Playground navigation and source viewer use the shared components", async ({
  page,
}, testInfo) => {
  await openDocument(page, "/ui/form/")
  if (testInfo.project.name.endsWith(":mobile")) {
    await page.getByRole("button", { name: "Docs", exact: true }).click()
  }
  await page
    .locator('nav[aria-label="Documentation"]:visible')
    .getByRole("link", { name: "Input", exact: true })
    .click()
  await expect(page).toHaveURL(/\/ui\/input\//)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Input")
  await expect(page.getByLabel("Composed field", { exact: true })).toHaveCount(
    1,
  )
  for (const label of ["Standalone field", "Composed field"]) {
    await expect(
      page
        .locator(".demo-content label")
        .filter({ hasText: new RegExp(`^${label}$`) }),
    ).toHaveCount(1)
  }
  const source = page.getByRole("button", { name: "React / TypeScript" })
  await source.click()
  await expect(page.locator(".usage code")).toBeHidden()
  await source.click()
  await expect(page.locator(".usage code")).toBeVisible()
  await page.goBack()
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Form")
})
test("menu disclosure and popover reuse compact navigation and restore focus", async ({
  page,
}) => {
  await openDocument(page, "/ui/menu/")
  const demo = page.locator(".demo-content")
  const disclosure = demo.getByRole("button", {
    name: "Browse guides",
    exact: true,
  })
  await disclosure.click()
  const region = demo
    .getByRole("region", { name: "Browse guides", exact: true })
    .and(demo.locator(".yu-menu-disclosure-content"))
  await expect(
    region.getByRole("link", { name: /Introduction/ }),
  ).toHaveAttribute("aria-current", "page")
  await expect(region).toHaveCSS("overflow-y", "hidden")
  await region.getByRole("link", { name: "Installation", exact: true }).focus()
  await page.keyboard.press("Escape")
  await expect(disclosure).toHaveAttribute("aria-expanded", "false")
  await expect(disclosure).toBeFocused()
  const trigger = demo.getByRole("button", {
    name: "On this page",
    exact: true,
  })
  await trigger.click()
  await page
    .getByRole("dialog", { name: "On this page", exact: true })
    .getByRole("button", { name: "Installation", exact: true })
    .click()
  await expect(
    page.getByRole("dialog", { name: "On this page", exact: true }),
  ).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await expect(demo.locator("output")).toHaveText("Installation")
})
test("subtle Menu indicators are 2px without shifting text in either orientation", async ({
  page,
}) => {
  await openDocument(page, "/ui/menu/")
  const demo = page.locator(".demo-content")
  await demo.getByText("Inline", { exact: true }).click()
  const menu = demo.getByRole("navigation", { name: "Workspace", exact: true })
  const active = menu.getByRole("link", { name: /Overview/ })
  const inactive = menu.getByRole("link", { name: /Activity/ })
  const offset = (node: HTMLElement | SVGElement) => {
    const text = node.querySelector(".yu-menu-text")
    if (!text) throw new Error("Missing MenuItem text")
    return text.getBoundingClientRect().left - node.getBoundingClientRect().left
  }
  expect(await active.evaluate(offset)).toBe(await inactive.evaluate(offset))
  expect(
    await active.evaluate((node) => getComputedStyle(node, "::before").width),
  ).toBe("2px")
  await menu.evaluate((node) =>
    node.setAttribute("data-orientation", "horizontal"),
  )
  expect(
    await active.evaluate((node) => getComputedStyle(node, "::before").height),
  ).toBe("2px")
  expect(await active.evaluate(offset)).toBe(await inactive.evaluate(offset))
  await demo.getByText("Solid", { exact: true }).click()
  expect(
    await active.evaluate((node) => getComputedStyle(node, "::before").content),
  ).toBe("none")
})
