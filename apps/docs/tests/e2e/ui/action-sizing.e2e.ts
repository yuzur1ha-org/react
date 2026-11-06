import { expect, test } from "@playwright/test"
import { openDocument } from "../../helpers/open-document"

test("Link is keyboard navigable and its indicator aligns with the top of the content", async ({
  page,
}) => {
  await openDocument(page, "/ui/link/")
  const link = page
    .locator(".demo-content")
    .getByRole("link", { name: "Read the guide", exact: true })
  expect(
    await link.locator(".yu-link-content").evaluate((node) => {
      const line = getComputedStyle(node, "::after")
      return { radius: line.borderRadius, border: line.borderBottomStyle }
    }),
  ).toEqual({ radius: "0px", border: "solid" })
  await link.focus()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/#link-destination$/)
  const geometry = await link.evaluate((node) => {
    const icon = node.querySelector("svg")?.getBoundingClientRect()
    const text = node.querySelector(".yu-link-content")?.getBoundingClientRect()
    return {
      icon: icon?.x,
      text: text?.right,
      iconTop: icon?.y,
      textTop: text?.y,
    }
  })
  expect(geometry.icon).toBeGreaterThanOrEqual(geometry.text ?? 0)
  expect(
    Math.abs((geometry.iconTop ?? 0) - (geometry.textTop ?? 0)),
  ).toBeLessThan(6)
})
test("solid links tighten icon-side padding and preserve symmetric padding without an icon", async ({
  page,
}) => {
  await openDocument(page, "/ui/link/")
  for (const appearance of ["primary", "secondary"]) {
    const link = page.locator(
      `.demo-content .yu-link[data-appearance="${appearance}"]`,
    )
    expect(
      await link.evaluate((node) => {
        const style = getComputedStyle(node)
        return style.color !== style.backgroundColor
      }),
    ).toBe(true)
    const padding = await link.evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        start: parseFloat(style.paddingInlineStart),
        end: parseFloat(style.paddingInlineEnd),
        icon: node.getAttribute("data-show-icon"),
      }
    })
    if (padding.icon === "true") expect(padding.end).toBeLessThan(padding.start)
    else expect(padding.end).toBe(padding.start)
  }
})
test("size variants establish distinct action and switch dimensions", async ({
  page,
}) => {
  await openDocument(page, "/ui/button/")
  const sizes = []
  for (const size of ["small", "medium", "large"])
    sizes.push(
      await page
        .locator(".demo-content")
        .getByRole("button", { name: `${size} action`, exact: true })
        .evaluate((node) => ({
          height: node.getBoundingClientRect().height,
          font: parseFloat(getComputedStyle(node).fontSize),
        })),
    )
  expect(sizes[0]?.height).toBeLessThan(sizes[1]?.height ?? 0)
  expect(sizes[1]?.height).toBeLessThan(sizes[2]?.height ?? 0)
  expect(sizes[0]?.font).toBeLessThan(sizes[2]?.font ?? 0)
  await openDocument(page, "/ui/switch/")
  for (const size of ["small", "medium", "large"]) {
    const toggle = page
      .locator(".demo-content")
      .getByRole("switch", { name: `${size} theme`, exact: true })
    await toggle.focus()
    await page.keyboard.press("Space")
    await expect(toggle).toBeChecked()
  }
})
test("field sizes retain editing and select keyboard interaction", async ({
  page,
}) => {
  await openDocument(page, "/ui/input/")
  const heights = []
  for (const size of ["small", "medium", "large"]) {
    const field = page
      .locator(".demo-content")
      .getByRole("textbox", { name: `${size} field`, exact: true })
    await field.fill(size)
    await expect(field).toHaveValue(size)
    heights.push(
      await field.evaluate((node) => node.getBoundingClientRect().height),
    )
  }
  expect(heights[0]).toBeLessThan(heights[1] ?? 0)
  expect(heights[1]).toBeLessThan(heights[2] ?? 0)
  await openDocument(page, "/ui/select/")
  const select = page
    .locator(".demo-content")
    .getByRole("combobox", { name: "small selection", exact: true })
  await select.focus()
  await page.keyboard.press("ArrowDown")
  await expect(page.getByRole("listbox")).toBeVisible()
  await page.keyboard.press("End")
  await expect(
    page.getByRole("option", { name: "Second", exact: true }),
  ).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(select).toHaveText(/Second/)
})
test("text Select stays borderless when open and keeps keyboard focus feedback", async ({
  page,
}) => {
  await openDocument(page, "/ui/select/")
  const trigger = page.locator(".demo-content").getByRole("combobox", {
    name: "Text appearance",
    exact: true,
    includeHidden: true,
  })
  await trigger.click()
  await expect(page.getByRole("listbox")).toBeVisible()
  await expect(trigger).toHaveCSS("outline-color", "rgba(0, 0, 0, 0)")
  await expect(trigger).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)")
  await page.keyboard.press("Escape")
  await expect(page.getByRole("listbox")).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await trigger.press("ArrowDown")
  await expect(page.getByRole("listbox")).toBeVisible()
  await expect(
    page.getByRole("option", { name: "First", exact: true }),
  ).toBeFocused()
  await page.keyboard.press("End")
  await expect(
    page.getByRole("option", { name: "Second", exact: true }),
  ).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(trigger).toContainText("Second")
  await expect(trigger).toBeFocused()
})
