import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import { open } from "./demo-fixture"

test("SettingRow edits a sample profile without changing it on cancel", async ({
  page,
}) => {
  await open(page, "setting-row")
  const account = page
    .locator(".demo-content")
    .getByRole("region", { name: "Account examples" })
  const edit = account.getByRole("button", { name: "Edit", exact: true })
  await edit.click()
  const dialog = page.getByRole("dialog", { name: "Edit display name" })
  await dialog.getByLabel("Display name").fill("Draft name")
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click()
  await expect(account.getByText("Alex Morgan", { exact: true })).toBeVisible()
  await expect(edit).toBeFocused()
  await edit.click()
  await expect(dialog.getByLabel("Display name")).toHaveValue("Alex Morgan")
  await dialog.getByLabel("Display name").fill("   ")
  await dialog.getByRole("button", { name: "Save changes" }).click()
  await expect(dialog.getByLabel("Display name")).toHaveAttribute(
    "aria-invalid",
    "true",
  )
  await dialog.getByLabel("Display name").fill("Sam Lee")
  await dialog.getByLabel("Display name").press("Enter")
  await expect(account.getByText("Sam Lee", { exact: true })).toBeVisible()
})
for (const name of [
  "button",
  "text-field",
  "number-field",
  "textarea",
  "select",
  "switch",
  "checkbox",
  "radio",
  "segmented",
  "avatar",
  "input-otp",
  "tooltip",
  "toast",
  "modal",
  "setting-row",
  "popover",
  "meter",
  "form",
  "accordion",
  "badge",
  "input",
  "drawer",
  "menu",
  "disclosure",
  "scroll-area",
]) {
  test(`${name} playground has no horizontal document overflow`, async ({
    page,
  }, testInfo) => {
    await open(page, name)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(
      page.locator('.demo-content [class*="yu-"]').first(),
    ).toBeVisible()
    const source = await readFile(
      new URL(
        `../../../src/content/components/${name}/demo.tsx`,
        import.meta.url,
      ),
      "utf8",
    )
    await expect(page.locator(".usage code")).toHaveText(source)
    await page.screenshot({
      path: testInfo.outputPath(`${name}.png`),
      fullPage: true,
    })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      name,
    ).toBe(true)
  })
}

test("derived tokens remain scoped and follow Select into its portal", async ({
  page,
}) => {
  await open(page, "tokens")
  const defaultButton = page.getByTestId("default-theme").getByRole("button")
  const derived = page.getByTestId("derived-theme")
  await expect(defaultButton).toHaveCSS("background-color", "rgb(19, 20, 21)")
  await expect(derived.getByRole("button").first()).toHaveCSS(
    "background-color",
    "rgb(0, 107, 90)",
  )
  await derived.getByRole("combobox").click()
  const list = page.getByRole("listbox")
  await expect(list).toHaveCSS("--yu-focus", "#006b5a")
  await expect(list).toHaveCSS("background-color", "rgb(240, 250, 247)")
  await expect(list).toHaveCSS("animation-duration", "0.22s")
  await page.keyboard.press("Escape")
  await expect(defaultButton).toHaveCSS("background-color", "rgb(19, 20, 21)")
})
test("choice marks, segmented indicator and OTP caret animate and respect reduced motion", async ({
  page,
}) => {
  await open(page, "checkbox")
  const tick = page.locator(".yu-checkbox svg").first()
  await expect(tick).toHaveCSS("opacity", "0")
  await page
    .locator(".demo-content")
    .getByText("Keep me updated", { exact: true })
    .click()
  await expect(tick).toHaveCSS("opacity", "1")
  await expect(tick).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)")
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(tick).toHaveCSS("transition-duration", "0s")
  await open(page, "radio")
  const dot = page.locator(".yu-radio > span").nth(1)
  await expect(dot).toHaveCSS("opacity", "0")
  await page
    .locator(".demo-content")
    .getByText("Public", { exact: true })
    .click()
  await expect(dot).toHaveCSS("opacity", "1")
  await expect(dot).toHaveCSS("transition-duration", "0s")
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await open(page, "segmented")
  const track = page.locator(".yu-segmented > div")
  const before = await track.evaluate(
    (el) => getComputedStyle(el, "::before").transform,
  )
  await page.locator(".demo-content").getByText("Dark", { exact: true }).click()
  await expect
    .poll(() =>
      track.evaluate((el) => getComputedStyle(el, "::before").transform),
    )
    .not.toBe(before)
  expect(
    await track.evaluate(
      (el) => getComputedStyle(el, "::before").transitionProperty,
    ),
  ).toContain("transform")
  await page.emulateMedia({ reducedMotion: "reduce" })
  expect(
    await track.evaluate(
      (el) => getComputedStyle(el, "::before").transitionDuration,
    ),
  ).toBe("0s")
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await open(page, "input-otp")
  await page.getByLabel("Verification code").focus()
  const caret = page.locator(".yu-otp-slots i")
  await expect(caret).toHaveCSS("animation-name", "yu-caret")
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(caret).toHaveCSS("animation-name", "none")
})
test("Meter presents bounded quantities and fractional values", async ({
  page,
}) => {
  await open(page, "meter")
  const meter = page.getByRole("meter", { name: "Storage used" })
  await expect(meter).toHaveAttribute("aria-valuenow", "62")
  await page
    .getByRole("button", { name: "Increase usage", exact: true })
    .click()
  await expect(meter).toHaveAttribute("aria-valuenow", "63")
  await expect(meter).toHaveAttribute("aria-valuetext", "63 of 100 GB")
  await page.getByLabel("Used storage").fill("150")
  await page.getByLabel("Used storage").press("Tab")
  await expect(meter).toHaveAttribute("aria-valuenow", "100")
  await expect(
    page.getByRole("meter", { name: "Signal quality" }),
  ).toHaveAttribute("aria-valuemax", "1")
  await expect(
    page.getByRole("meter", { name: "Signal quality" }),
  ).toHaveAttribute("aria-valuenow", "0.65")
})
test("Form validates, focuses errors, preserves edits and clears simulated server errors", async ({
  page,
}) => {
  await open(page, "form")
  const example = page
    .locator(".demo-content")
    .getByRole("region", { name: "Contact form example" })
  const email = page.getByLabel("Email address", { exact: true })
  const bio = page.getByLabel("About you", { exact: true })
  const save = page.getByRole("button", {
    name: "Save preferences",
    exact: true,
  })
  await bio.fill("A draft worth keeping.")
  await save.click()
  await expect(
    page
      .locator(".demo-content")
      .getByText("Enter your email address.", { exact: true }),
  ).toBeVisible()
  await expect(email).toBeFocused()
  await email.fill("invalid")
  await save.click()
  await expect(
    page
      .locator(".demo-content")
      .getByText("Enter a valid email address.", { exact: true }),
  ).toBeVisible()
  await email.fill("taken@example.test")
  await save.click()
  await expect(
    page
      .locator(".demo-content")
      .getByText("This email is already in use.", { exact: true }),
  ).toBeVisible()
  await expect(email).toHaveAttribute("aria-invalid", "true")
  await expect(bio).toHaveValue("A draft worth keeping.")
  await email.fill("alex@example.test")
  await save.click()
  await expect(example.locator("output")).toHaveText(
    "Saved locally: alex@example.test · immediate · notifications on · product updates off",
  )
  await expect(page.getByLabel("Organization", { exact: true })).toBeDisabled()
  await page.getByRole("button", { name: "Reset", exact: true }).click()
  await expect(email).toHaveValue("")
  await expect(bio).toHaveValue("")
  await expect(example.locator("output")).toHaveText("No changes submitted.")
})
test("Accordion supports keyboard selection and independent multiple sections", async ({
  page,
}) => {
  await open(page, "accordion")
  const overview = page.getByRole("button", { name: "Overview", exact: true })
  const details = page.getByRole("button", { name: "Details", exact: true })
  await overview.focus()
  await page.keyboard.press("ArrowDown")
  await expect(details).toBeFocused()
  await page.keyboard.press("Space")
  await expect(details).toHaveAttribute("aria-expanded", "true")
  await expect(overview).toHaveAttribute("aria-expanded", "false")
  await expect(
    page.getByRole("button", { name: "Unavailable section", exact: true }),
  ).toBeDisabled()
  await page.getByRole("button", { name: "Interaction", exact: true }).click()
  await expect(
    page.getByRole("button", { name: "Appearance", exact: true }),
  ).toHaveAttribute("aria-expanded", "true")
  await expect(
    page.getByRole("button", { name: "Interaction", exact: true }),
  ).toHaveAttribute("aria-expanded", "true")
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(
    page.locator('.yu-accordion-content[data-state="open"]').first(),
  ).toHaveCSS("animation-name", "none")
})
test("Badge caps the visible count, toggles zero and leaves its anchor usable", async ({
  page,
}) => {
  await open(page, "badge")
  const count = page.getByLabel("Notification count", { exact: true })
  await count.fill("120")
  await count.press("Tab")
  await expect(
    page.getByRole("img", { name: "120 unread messages", exact: true }),
  ).toHaveText("99+")
  await count.fill("3.5")
  await count.press("Tab")
  await expect(count).toHaveValue("4")
  await expect(
    page.getByRole("img", { name: "4 unread messages", exact: true }),
  ).toHaveText("4")
  await count.fill("-4")
  await count.press("Tab")
  await expect(count).toHaveValue("0")
  await expect(
    page.getByRole("img", { name: "0 unread messages", exact: true }),
  ).toHaveCount(0)
  await page
    .locator(".demo-content")
    .getByText("Show zero", { exact: true })
    .click()
  await expect(
    page.getByRole("img", { name: "0 unread messages", exact: true }),
  ).toHaveText("0")
  await expect(
    page.getByRole("button", { name: "Inbox", exact: true }),
  ).toBeEnabled()
  await expect(
    page.getByRole("img", { name: "Available", exact: true }),
  ).toBeVisible()
})
test("press feedback supports pointer, keyboard, disabled and reduced-motion states", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await open(page, "button")
  const button = page.getByRole("button", { name: "Continue", exact: true })
  await button.hover()
  await page.mouse.down()
  await expect(button).toHaveCSS("scale", "0.97")
  await page.mouse.up()
  await expect(button).toHaveCSS("scale", "1")
  await button.focus()
  await page.keyboard.down("Space")
  await expect(button).toHaveCSS("scale", "0.97")
  await page.keyboard.up("Space")
  await expect(button).toHaveCSS("scale", "1")
  const disabled = page.getByRole("button", { name: "Disabled", exact: true })
  await disabled.hover()
  await page.mouse.down()
  await expect(disabled).toHaveCSS("scale", "1")
  await page.mouse.up()
  await page.emulateMedia({ reducedMotion: "reduce" })
  await button.hover()
  await page.mouse.down()
  await expect(button).toHaveCSS("scale", "1")
  await page.mouse.up()
})
