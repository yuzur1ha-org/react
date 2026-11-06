import { openDocument } from "../helpers/open-document"
import { expect, test } from "@playwright/test"

test("popover actions fit one row, cancel edits and reject whitespace-only names", async ({
  page,
}) => {
  await openDocument(page, "/ui/popover/")
  const trigger = page
    .locator(".demo-content")
    .getByRole("button", { name: "Edit display name" })
  await trigger.click()
  const popover = page.getByRole("dialog", { name: "Edit profile" })
  const cancel = popover.getByRole("button", { name: "Cancel", exact: true })
  const apply = popover.getByRole("button", { name: "Apply", exact: true })
  const actions = await popover
    .locator(".popover-demo-actions")
    .evaluate((node) => {
      const [cancel, apply] = Array.from(node.children).map((child) =>
        child.getBoundingClientRect(),
      )
      if (!cancel || !apply) throw new Error("Missing Popover actions")
      return {
        rowOffset: Math.abs(cancel.y - apply.y),
        gap: apply.x - cancel.right,
      }
    })
  expect(actions.rowOffset).toBeLessThan(1)
  expect(actions.gap).toBeGreaterThan(0)
  await popover.getByLabel("Display name").fill("   ")
  await apply.click()
  await expect(popover.getByLabel("Display name")).toHaveAttribute(
    "aria-invalid",
    "true",
  )
  await cancel.click()
  await expect(page.locator(".demo-content output")).toHaveText("Alex Morgan")
  await trigger.click()
  await expect(popover.getByLabel("Display name")).toHaveValue("Alex Morgan")
  await popover.getByLabel("Display name").fill("Sam Lee")
  await popover.getByLabel("Display name").press("Enter")
  await expect(page.locator(".demo-content output")).toHaveText("Sam Lee")
})

test("overflowing Toasts remain scrollable with no visible native scrollbar", async ({
  page,
}) => {
  await openDocument(page, "/ui/toast/")
  const demo = page.locator(".demo-content")
  await demo.getByText("Persistent", { exact: true }).click()
  const trigger = demo.getByRole("button", { name: "Info", exact: true })
  for (let index = 0; index < 12; index++)
    await trigger.evaluate((node: HTMLButtonElement) => node.click())
  const viewport = page.locator(".yu-toast-viewport")
  await expect(viewport.locator(".yu-toast")).toHaveCount(12)
  await expect(viewport).toHaveCSS("scrollbar-width", "none")
  expect(
    await viewport.evaluate(
      (node) => getComputedStyle(node, "::-webkit-scrollbar").display,
    ),
  ).toBe("none")
  expect(
    await viewport.evaluate((node) => node.scrollHeight > node.clientHeight),
  ).toBe(true)
  await viewport.hover()
  await page.mouse.wheel(0, 250)
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollTop))
    .toBeGreaterThan(0)
})
