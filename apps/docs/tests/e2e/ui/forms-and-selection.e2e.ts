import { expect, test } from "@playwright/test"
import { open } from "./demo-fixture"

test("Switch changes on the full label target", async ({ page }) => {
  await open(page, "switch")
  await page
    .locator(".demo-content")
    .getByText("Email notifications", { exact: true })
    .click()
  await expect(
    page.getByRole("switch", { name: "Email notifications" }),
  ).not.toBeChecked()
})
test("Checkbox toggles", async ({ page }) => {
  await open(page, "checkbox")
  await page
    .locator(".demo-content")
    .getByText("Keep me updated", { exact: true })
    .click()
  await expect(
    page.getByRole("checkbox", { name: "Keep me updated" }),
  ).toBeChecked()
})
test("Radio excludes the previous choice", async ({ page }) => {
  await open(page, "radio")
  await page
    .locator(".demo-content")
    .getByText("Public", { exact: true })
    .click()
  await expect(
    page.getByRole("radio", { name: "Public", exact: true }),
  ).toBeChecked()
  await expect(
    page.getByRole("radio", { name: "Private", exact: true }),
  ).not.toBeChecked()
})
test("Segmented selection is controlled", async ({ page }) => {
  await open(page, "segmented")
  await page.locator(".demo-content").getByText("Dark", { exact: true }).click()
  await expect(page.locator("output")).toHaveText("dark")
})
test("Avatar updates its initials from input", async ({ page }) => {
  await open(page, "avatar")
  await page.getByLabel("Display name").fill("Sam Lee")
  await expect(page.getByRole("img", { name: "Sam Lee" })).toHaveCount(2)
  await expect(page.locator(".yu-avatar").first()).toHaveText("SL")
})
test("InputOTP validates and recovers without losing input", async ({
  page,
}) => {
  await open(page, "input-otp")
  const input = page.getByLabel("Verification code")
  await input.fill("000000")
  await page.getByRole("button", { name: "Verify code" }).click()
  await expect(input).toHaveValue("000000")
  await expect(input).toHaveAttribute("aria-invalid", "true")
  await input.fill("123456")
  await page.getByRole("button", { name: "Verify code" }).click()
  await expect(page.locator("output")).toHaveText("Code verified in this demo.")
})
test("Tooltip supports keyboard focus and Escape", async ({ page }) => {
  await open(page, "tooltip")
  const trigger = page.getByRole("button", { name: "Top", exact: true })
  await trigger.scrollIntoViewIfNeeded()
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
  )
  await trigger.focus()
  await expect(trigger).toBeFocused()
  await expect(page.getByRole("tooltip")).toHaveText("Visible only to you.")
  await page.keyboard.press("Escape")
  await expect(page.getByRole("tooltip")).toHaveCount(0)
})
test("Toast closes and can be shown again", async ({ page }) => {
  await open(page, "toast")
  await page.getByRole("button", { name: "Success", exact: true }).click()
  await expect(page.getByText("Changes saved", { exact: true })).toBeVisible()
  await page.getByRole("button", { name: "Close", exact: true }).click()
  await expect(page.getByText("Changes saved", { exact: true })).toHaveCount(0)
  await page.getByRole("button", { name: "Error", exact: true }).click()
  await expect(
    page.getByText("Unable to save. Your draft is preserved.", { exact: true }),
  ).toBeVisible()
})
test("Modal edits, traps focus and restores the trigger", async ({ page }) => {
  await open(page, "modal")
  const trigger = page.getByRole("button", { name: "Open form", exact: true })
  await trigger.click()
  const dialog = page.getByRole("dialog")
  await expect(dialog.getByLabel("Display name")).toBeFocused()
  await dialog.getByLabel("Display name").fill("Sam Lee")
  await dialog.getByRole("button", { name: "Save changes" }).click()
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await expect(page.locator("output")).toHaveText("Sam Lee")
  await page.getByRole("button", { name: "Open confirmation" }).click()
  await expect(
    page.getByRole("button", { name: "Cancel", exact: true }),
  ).toBeFocused()
  await page.keyboard.press("Shift+Tab")
  await expect(
    page.getByRole("button", { name: "Close", exact: true }),
  ).toBeFocused()
  await page.keyboard.press("Shift+Tab")
  await expect(
    page.getByRole("button", { name: "Sign out", exact: true }),
  ).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(dialog).toHaveCount(0)
})
