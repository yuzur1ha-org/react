import { expect, test } from "@playwright/test"
import { openDocument } from "../../helpers/open-document"

test("selection controls and disclosure headers do not shrink when pressed", async ({
  page,
}) => {
  for (const [name, selector] of [
    ["switch", ".yu-switch"],
    ["checkbox", ".yu-checkbox"],
    ["radio", ".yu-radio"],
    ["segmented", ".yu-segmented label"],
    ["accordion", ".yu-accordion-trigger"],
    ["select", ".yu-select"],
    ["disclosure", ".yu-disclosure-trigger"],
  ]) {
    await openDocument(page, `/ui/${name}/`)
    const target = page.locator(`.demo-content ${selector}`).first()
    await target.hover()
    await page.mouse.down()
    await expect(target).toHaveCSS("scale", "none")
    if (name === "segmented") {
      await expect(target.locator(":scope > span").first()).toHaveCSS(
        "scale",
        "none",
      )
    }
    await page.mouse.up()
    if (name === "select") {
      const option = page.getByRole("option").first()
      await option.hover()
      await page.mouse.down()
      await expect(option).toHaveCSS("scale", "none")
      await page.mouse.up()
    }
    await page.keyboard.press("Escape")
  }
})
test("multiple toast items retain their own mode and close independently", async ({
  page,
}) => {
  await openDocument(page, "/ui/toast/")
  await page
    .locator(".demo-content")
    .getByText("Simple", { exact: true })
    .click()
  await page.getByRole("button", { name: "Success", exact: true }).click()
  await page.locator(".demo-content").getByText("Rich", { exact: true }).click()
  await page.getByRole("button", { name: "Error", exact: true }).click()
  const simple = page.locator('.yu-toast[data-variant="simple"]')
  const rich = page.locator('.yu-toast[data-variant="rich"]')
  await expect(page.locator(".yu-toast-viewport")).toHaveCount(1)
  await expect(simple).toBeVisible()
  await expect(rich).toBeVisible()
  const first = await simple.boundingBox()
  const second = await rich.boundingBox()
  if (!first || !second) throw new Error("Toast bounds unavailable")
  expect(first.y + first.height).toBeLessThanOrEqual(second.y)
  await simple.getByRole("button", { name: "Close", exact: true }).click()
  await expect(simple).toHaveCount(0)
  await expect(rich).toBeVisible()
  await rich.getByRole("button", { name: "Undo", exact: true }).click()
  await expect(page.locator("output")).toHaveText(
    "Changes undone in this demo.",
  )
  await expect(rich).toHaveCount(0)
})
test("Drawer traps focus, saves edits, restores focus and supports reduced motion", async ({
  page,
}) => {
  await openDocument(page, "/ui/drawer/")
  const trigger = page.getByRole("button", {
    name: "Open drawer",
    exact: true,
  })
  await trigger.click()
  const dialog = page.getByRole("dialog", { name: "Edit profile" })
  const close = dialog.getByRole("button", { name: "Close drawer" })
  await expect(close).toBeFocused()
  await close.press("Shift+Tab")
  await expect(
    dialog.getByRole("button", { name: "Save changes" }),
  ).toBeFocused()
  await dialog.getByLabel("Display name").fill("Sam Lee")
  await dialog.getByRole("button", { name: "Save changes" }).click()
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await expect(page.locator("output")).toHaveText("Sam Lee")
  await page
    .locator(".demo-content")
    .getByText("Bottom", { exact: true })
    .click()
  await page.emulateMedia({ reducedMotion: "reduce" })
  await trigger.click()
  await expect(dialog).toHaveAttribute("data-side", "bottom")
  await expect(dialog).toHaveCSS("animation-name", "none")
  await expect(dialog.getByLabel("Display name")).toHaveValue("Sam Lee")
  await page.keyboard.press("Escape")
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
})
