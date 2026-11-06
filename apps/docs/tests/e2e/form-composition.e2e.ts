import { openDocument } from "../helpers/open-document"
import { expect, test } from "@playwright/test"

test("contact preferences submit native choices and reset their original defaults", async ({
  page,
}) => {
  await openDocument(page, "/ui/form/")
  const form = page
    .locator(".demo-content")
    .getByRole("region", { name: "Contact form example" })
  await form
    .getByLabel("Email address", { exact: true })
    .fill("demo@example.test")
  await form.getByLabel("Daily summary", { exact: true }).press("Space")
  const notifications = form.getByRole("switch", {
    name: "Email notifications",
  })
  await notifications.press("Space")
  const updates = form.getByRole("checkbox", {
    name: "Include product updates",
  })
  await updates.press("Space")
  await form.getByRole("button", { name: "Save preferences" }).click()
  await expect(form.locator("output")).toHaveText(
    "Saved locally: demo@example.test · daily · notifications off · product updates on",
  )
  await form.getByRole("button", { name: "Reset", exact: true }).click()
  await expect(notifications).toBeChecked()
  await expect(updates).not.toBeChecked()
  await expect(form.getByLabel("Immediately", { exact: true })).toBeChecked()
  await expect(form.locator("output")).toHaveText("No changes submitted.")
})

test("support form validates custom selection, preserves failed drafts and resets all controls", async ({
  page,
}) => {
  await openDocument(page, "/ui/form/")
  const form = page
    .locator(".demo-content")
    .getByRole("region", { name: "Support form example" })
  const submit = form.getByRole("button", { name: "Submit sample request" })
  const subject = form.getByLabel("Subject", { exact: true })
  const details = form.getByLabel("Request details", { exact: true })
  const topic = form.getByRole("combobox", { name: "Request topic" })
  await submit.click()
  await expect(subject).toBeFocused()
  await subject.fill("Connection test")
  await details.fill("Sample connection details.")
  await submit.click()
  await expect(topic).toHaveAttribute("aria-invalid", "true")
  await expect(topic).toBeFocused()
  await topic.click()
  await page
    .getByRole("option", { name: "Connection & setup", exact: true })
    .click()
  const simulate = form.getByRole("checkbox", {
    name: "Simulate submission failure",
  })
  await simulate.press("Space")
  await submit.click()
  await expect(form.getByRole("alert")).toContainText("Your draft is preserved")
  await expect(subject).toHaveValue("Connection test")
  await expect(details).toHaveValue("Sample connection details.")
  await expect(topic).toHaveText("Connection & setup")
  await simulate.press("Space")
  await submit.click()
  await expect(form.getByRole("alert")).toHaveCount(0)
  await expect(form.locator("output")).toHaveText(
    "Saved locally: Connection test · connection · follow-up on",
  )
  await form.getByRole("button", { name: "Reset request" }).click()
  await expect(subject).toHaveValue("")
  await expect(details).toHaveValue("")
  await expect(topic).toHaveText("Choose a topic")
  await expect(topic).not.toHaveAttribute("aria-invalid", "true")
  await expect(
    form.getByRole("checkbox", { name: "Email me about this sample request" }),
  ).toBeChecked()
  await expect(simulate).not.toBeChecked()
})
