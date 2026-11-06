import { toggleTheme } from "../../helpers/appearance"
import { expect, test } from "@playwright/test"
import { openDocument } from "../../helpers/open-document"

test("text Link hover lines scale with size and remain visible for keyboard focus", async ({
  page,
}) => {
  await openDocument(page, "/ui/link/")
  for (const [size, thickness] of [
    ["small", "2px"],
    ["medium", "2px"],
    ["large", "3px"],
  ]) {
    const link = page.locator(
      `.demo-content .yu-link[data-appearance="text"][data-size="${size}"]`,
    )
    await expect(link).toHaveCSS("text-decoration-line", "none")
    const content = link.locator(".yu-link-content")
    const line = () =>
      content.evaluate((node) => {
        const style = getComputedStyle(node, "::after")
        return {
          thickness: style.borderBottomWidth,
          transform: style.transform,
        }
      })
    expect((await line()).thickness).toBe(thickness)
    await link.hover()
    await expect
      .poll(async () => (await line()).transform)
      .toBe("matrix(1, 0, 0, 1, 0, 0)")
    await page.mouse.move(0, 0)
    await page.keyboard.press("Tab")
    await link.focus()
    await expect
      .poll(async () => (await line()).transform)
      .toBe("matrix(1, 0, 0, 1, 0, 0)")
    await page.emulateMedia({ reducedMotion: "reduce" })
    expect(
      await content.evaluate(
        (node) => getComputedStyle(node, "::after").transitionDuration,
      ),
    ).toBe("0s")
    await page.emulateMedia({ reducedMotion: "no-preference" })
  }
})
test("compound Link underlines its title when any part of the container is hovered or focused", async ({
  page,
}) => {
  await openDocument(page, "/ui/link/")
  const card = page.locator(".demo-content .demo-link-card")
  const title = card.locator(".yu-link-hover-line")
  const transform = () =>
    title.evaluate((node) => getComputedStyle(node, "::after").transform)
  await expect.poll(transform).toBe("matrix(0, 0, 0, 1, 0, 0)")
  expect(
    await title.evaluate(
      (node) => getComputedStyle(node, "::after").borderBottomWidth,
    ),
  ).toBe("3px")
  await card.locator("p").hover()
  await expect.poll(transform).toBe("matrix(1, 0, 0, 1, 0, 0)")
  expect(
    await card
      .locator("p")
      .evaluate((node) => getComputedStyle(node, "::after").content),
  ).toBe("none")
  await page.mouse.move(0, 0)
  await page.keyboard.press("Tab")
  await card.focus()
  await expect(card).toBeFocused()
  await expect.poll(transform).toBe("matrix(1, 0, 0, 1, 0, 0)")
  await title.evaluate((node) => node.setAttribute("data-size", "small"))
  expect(
    await title.evaluate(
      (node) => getComputedStyle(node, "::after").borderBottomWidth,
    ),
  ).toBe("2px")
  await page.emulateMedia({ reducedMotion: "reduce" })
  expect(
    await title.evaluate(
      (node) => getComputedStyle(node, "::after").transitionDuration,
    ),
  ).toBe("0s")
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/#link-destination$/)
})
test("button-style Links share Button colors in both themes without scaling on press", async ({
  page,
}) => {
  await openDocument(page, "/ui/button/")
  const button = page
    .locator(".demo-content")
    .getByRole("button", { name: "Continue", exact: true })
  const colors = (node: HTMLElement | SVGElement) => {
    const style = getComputedStyle(node)
    return {
      color: style.color,
      background: style.backgroundColor,
      border: style.borderTopColor,
    }
  }
  for (const theme of ["light", "dark"]) {
    await openDocument(page, "/ui/button/")
    if (theme === "dark") await toggleTheme(page)
    await expect(button).toHaveCSS(
      "background-color",
      theme === "dark" ? "rgb(238, 237, 232)" : "rgb(19, 20, 21)",
    )
    const expected = await button.evaluate(colors)
    await openDocument(page, "/ui/link/")
    const link = page.locator(
      '.demo-content .yu-link[data-appearance="primary"]',
    )
    await expect(link).toHaveClass(/yu-button--primary/)
    await expect.poll(() => link.evaluate(colors)).toEqual(expected)
    await expect(link.locator(".yu-link-content")).toHaveCSS(
      "color",
      expected.color,
    )
    await link.hover()
    await page.mouse.down()
    await expect(link).toHaveCSS("scale", "1")
    await page.mouse.up()
    await expect(link).toHaveAttribute("href", "#link-destination")
  }
})
test("Button can disable pointer and keyboard scaling without disabling activation", async ({
  page,
}) => {
  await openDocument(page, "/ui/button/")
  const demo = page.locator(".demo-content")
  const button = demo.getByRole("button", {
    name: "No scale action",
    exact: true,
  })
  await button.hover()
  await page.mouse.down()
  await expect(button).toHaveCSS("scale", "1")
  await page.mouse.up()
  await expect(demo.locator("output")).toHaveText("1")
  await button.focus()
  await page.keyboard.down("Space")
  await expect(button).toHaveCSS("scale", "1")
  await page.keyboard.up("Space")
  await expect(demo.locator("output")).toHaveText("2")
})
