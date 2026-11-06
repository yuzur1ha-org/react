import { expect, test } from "@playwright/test"
import { open } from "./demo-fixture"

test("Button prevents disabled activation", async ({ page }) => {
  await open(page, "button")
  await page.getByRole("button", { name: "Continue", exact: true }).click()
  await expect(page.locator("output")).toHaveText("1")
  await expect(
    page.getByRole("button", { name: "Disabled", exact: true }),
  ).toBeDisabled()
})
test("Text field preserves edits and announces errors", async ({ page }) => {
  await open(page, "text-field")
  await page.getByLabel("Display name").fill("Sam")
  await expect(page.locator("output")).toHaveText("Sam")
  await expect(page.getByLabel("Username")).toHaveAttribute(
    "aria-invalid",
    "true",
  )
})
test("focus feedback keeps its geometry and honors reduced motion", async ({
  page,
}) => {
  await open(page, "text-field")
  const input = page.getByLabel("Display name")
  const offset = await input.evaluate(
    (element) => getComputedStyle(element).outlineOffset,
  )
  await input.focus()
  await expect(input).toHaveCSS("outline-offset", offset)
  await input.press("Tab")
  await expect(input).toHaveCSS("outline-offset", offset)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(input).toHaveCSS("transition-duration", "0s")
})
test("Number field accepts a constrained value", async ({ page }) => {
  await open(page, "number-field")
  await page.getByLabel("Number", { exact: true }).fill("12")
  await expect(page.locator("output").first()).toHaveText("12")
})
test("NumberField uses custom buttons, precise fractional steps and keyboard limits", async ({
  page,
}) => {
  await open(page, "number-field")
  const input = page.getByRole("spinbutton", { name: "Number", exact: true })
  await expect(input).toHaveAttribute("type", "text")
  await page
    .getByRole("button", { name: "Increase", exact: true })
    .first()
    .click()
  await expect(input).toHaveValue("5")
  await expect(input).toBeFocused()
  await input.press("End")
  await expect(input).toHaveValue("99")
  await expect(
    page.getByRole("button", { name: "Increase", exact: true }).first(),
  ).toBeDisabled()
  await input.press("Home")
  await expect(input).toHaveValue("0")
  await input.fill("120")
  await input.press("Tab")
  await expect(input).toHaveValue("99")
  await page
    .getByRole("button", { name: "Increase decimal", exact: true })
    .click()
  await expect(
    page.getByRole("spinbutton", { name: "Decimal number", exact: true }),
  ).toHaveValue("0.3")
})
test("Textarea supports newlines", async ({ page }) => {
  await open(page, "textarea")
  await page.getByLabel("About you").fill("One\nTwo")
  await expect(page.locator("output")).toHaveText("7 / 280")
})
test("Select changes the controlled value", async ({ page }) => {
  await open(page, "select")
  await page.getByRole("combobox", { name: "Profile visibility" }).click()
  await page.getByRole("option", { name: "Public", exact: true }).click()
  await expect(page.locator("output")).toHaveText("public")
})
test("Select animates, skips disabled choices and restores trigger focus", async ({
  page,
}) => {
  await open(page, "select")
  const trigger = page.getByRole("combobox", { name: "Profile visibility" })
  await trigger.click()
  const list = page.getByRole("listbox")
  await expect(list).toBeVisible()
  await expect(list).toHaveCSS("animation-name", "yu-pop-in")
  await expect(
    page.getByRole("option", { name: "Disabled", exact: true }),
  ).toHaveAttribute("aria-disabled", "true")
  await page.keyboard.press("Escape")
  await expect(list).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await trigger.press("ArrowDown")
  await expect(list).toBeVisible()
  await page.keyboard.press("End")
  await expect(
    page.getByRole("option", { name: "Public", exact: true }),
  ).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(trigger).toContainText("Public")
})
test("motion respects reduced-motion preferences", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await open(page, "switch")
  const thumb = page.locator(".demo-content .yu-switch > span").first()
  expect(
    await thumb.evaluate(
      (element) => getComputedStyle(element).transitionDuration,
    ),
  ).toContain("0.18s")
  await page
    .locator(".demo-content")
    .getByText("Email notifications", { exact: true })
    .click()
  await expect(thumb).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)")
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(thumb).toHaveCSS("transition-duration", "0s")
  await open(page, "select")
  await page.getByRole("combobox", { name: "Profile visibility" }).click()
  await expect(page.getByRole("listbox")).toHaveCSS("animation-name", "none")
})
test("Select keeps trigger focus feedback and separates pointer from keyboard focus", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name.endsWith(":mobile"),
    "Pointer hover requires a mouse",
  )
  await open(page, "select")
  const trigger = page.getByRole("combobox", {
    name: "Profile visibility",
    includeHidden: true,
  })
  await trigger.focus()
  await trigger.press("Enter")
  const list = page.getByRole("listbox")
  await expect(list).toHaveAttribute("data-navigation", "keyboard")
  await expect(trigger).toHaveCSS("outline-style", "solid")
  const publicOption = page.getByRole("option", {
    name: "Public",
    exact: true,
  })
  await publicOption.hover()
  await expect(list).toHaveAttribute("data-navigation", "pointer")
  await expect(publicOption).toHaveCSS("outline-color", "rgba(0, 0, 0, 0)")
  await page.keyboard.press("Home")
  const first = page.getByRole("option").first()
  await expect(first).toBeFocused()
  await expect(list).toHaveAttribute("data-navigation", "keyboard")
  await expect(first).not.toHaveCSS("outline-color", "rgba(0, 0, 0, 0)")
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
})
