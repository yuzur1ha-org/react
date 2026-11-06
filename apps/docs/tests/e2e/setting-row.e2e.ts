import { openDocument } from "../helpers/open-document"
import { expect, test } from "@playwright/test"

test("SettingRow composes account preferences and confirms sample service resolution", async ({
  page,
}) => {
  await openDocument(page, "/ui/setting-row/")
  const demo = page.locator(".demo-content")
  const account = demo.getByRole("region", { name: "Account examples" })
  const service = demo.getByRole("region", { name: "Service examples" })
  const previews = account.getByRole("switch", { name: "Message previews" })
  await previews.press("Space")
  await expect(previews).toBeChecked()
  await expect(account.getByText("Shown", { exact: true })).toBeVisible()
  await previews.press("Space")
  await expect(previews).not.toBeChecked()
  await expect(account.getByText("Hidden", { exact: true })).toBeVisible()
  await account.getByRole("combobox", { name: "Presence visibility" }).click()
  await page.getByRole("option", { name: "Nobody", exact: true }).click()
  await expect(
    account.getByRole("combobox", { name: "Presence visibility" }),
  ).toHaveText("Nobody")
  const resolve = service.getByRole("button", { name: "Resolve", exact: true })
  await resolve.click()
  const dialog = page.getByRole("dialog", {
    name: "Resolve this sample request?",
  })
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click()
  await expect(service.getByText("Open", { exact: true })).toBeVisible()
  await resolve.click()
  await dialog
    .getByRole("button", { name: "Mark as resolved", exact: true })
    .click()
  await expect(service.getByText("Resolved", { exact: true })).toBeVisible()
  const review = service.getByRole("button", { name: "Review", exact: true })
  await expect(review).toBeFocused()
  await expect(demo.locator("output")).toHaveText(
    "Sample request marked as resolved.",
  )
  await review.click()
  await page
    .getByRole("dialog", { name: "Sample request resolved" })
    .getByRole("button", { name: "Done", exact: true })
    .click()
  await service.getByRole("button", { name: "Reset sample request" }).click()
  await expect(resolve).toBeEnabled()
  await expect(service.getByText("Open", { exact: true })).toBeVisible()
})
