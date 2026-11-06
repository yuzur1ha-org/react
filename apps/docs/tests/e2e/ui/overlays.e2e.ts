import { expect, test } from "@playwright/test"
import { open } from "./demo-fixture"

test("Toast supports swipe dismissal with an exit animation", async ({
  page,
}) => {
  await open(page, "toast")
  await page.getByRole("button", { name: "Success", exact: true }).click()
  const toast = page.locator(".yu-toast")
  await expect(toast).toBeVisible()
  await expect(toast).toHaveCSS("animation-name", "yu-pop-in")
  const box = await toast.boundingBox()
  if (!box) throw new Error("Toast bounds unavailable")
  await page.mouse.move(box.x + 24, box.y + box.height - 24)
  await page.mouse.down()
  await page.mouse.move(box.x + 160, box.y + box.height - 24, { steps: 8 })
  await page.mouse.up()
  await expect(toast).toHaveCount(0)
})
test("Popover edits content, dismisses with Escape and restores focus", async ({
  page,
}) => {
  await open(page, "popover")
  const trigger = page.getByRole("button", {
    name: "Edit display name",
    exact: true,
  })
  await trigger.focus()
  await trigger.press("Enter")
  const dialog = page.getByRole("dialog", { name: "Edit profile" })
  await expect(dialog.getByLabel("Display name")).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await trigger.click()
  await dialog.getByLabel("Display name").fill("Sam Lee")
  await dialog.getByRole("button", { name: "Apply", exact: true }).click()
  await expect(page.locator("output")).toHaveText("Sam Lee")
  await expect(trigger).toBeFocused()
  await trigger.click()
  await page
    .getByRole("heading", { name: "Popover", level: 1, exact: true })
    .click()
  await expect(dialog).toHaveCount(0)
})
test("Toast switches between simple feedback and rich actionable content", async ({
  page,
}) => {
  await open(page, "toast")
  await page
    .locator(".demo-content")
    .getByText("Simple", { exact: true })
    .click()
  await page.getByRole("button", { name: "Success", exact: true }).click()
  const toast = page.locator(".yu-toast")
  await expect(toast).toHaveAttribute("data-variant", "simple")
  await expect(toast.locator(".yu-toast-description")).toHaveCount(0)
  await toast.getByRole("button", { name: "Close", exact: true }).click()
  await expect(toast).toHaveCount(0)
  await page.locator(".demo-content").getByText("Rich", { exact: true }).click()
  await page.getByRole("button", { name: "Success", exact: true }).click()
  await expect(toast).toHaveAttribute("data-variant", "rich")
  await expect(toast.locator(".yu-toast-description")).toBeVisible()
  await toast.getByRole("button", { name: "Undo", exact: true }).click()
  await expect(page.locator("output")).toHaveText(
    "Changes undone in this demo.",
  )
  await expect(toast).toHaveCount(0)
})
