import { expect, test } from "@playwright/test"
import { openDocument } from "../../helpers/open-document"
import { toggleTheme } from "../../helpers/appearance"

test("GFM typography follows both themes and confines wide HTML to code and tables", async ({
  page,
}, testInfo) => {
  await openDocument(page, "/markdown/typography/")
  await expect(page.locator(".press-pagination")).toHaveCount(1)
  const prose = page.locator("main .yu-markdown").first()
  await expect(prose.locator("blockquote")).toHaveCSS(
    "border-left-width",
    "2px",
  )
  await expect(prose.locator("del")).toHaveCSS(
    "text-decoration-line",
    "line-through",
  )
  await expect(prose.locator(".task-list-item input")).toHaveCount(2)
  await expect(prose.locator(".task-list-item input").first()).toBeChecked()
  const originalTable = await prose.locator("table").first().innerHTML()
  const originalCode = await prose.locator("pre code").first().textContent()
  for (const dark of [false, true]) {
    if (dark) await toggleTheme(page)
    const paper = await page
      .locator("body")
      .evaluate((node) => getComputedStyle(node).backgroundColor)
    const ink = await prose.evaluate((node) => getComputedStyle(node).color)
    expect(ink).not.toBe(paper)
    await expect(
      prose.locator(".source-scroll .yu-scroll-viewport").first(),
    ).toHaveCSS("overflow-x", "scroll")
    await expect(prose.locator(".press-table-scroll").first()).toHaveCSS(
      "overflow-x",
      "auto",
    )
    await page.screenshot({
      path: testInfo.outputPath(
        `markdown-baseline-${dark ? "dark" : "light"}.png`,
      ),
      fullPage: true,
      animations: "disabled",
    })
    await prose
      .locator("table")
      .first()
      .evaluate((node) => {
        for (const row of Array.from(node.querySelectorAll("tr"))) {
          const template = row.firstElementChild
          for (let index = 0; template && index < 16; index++)
            row.append(template.cloneNode(true))
        }
      })
    await prose
      .locator("pre code")
      .first()
      .evaluate((node) => {
        node.textContent = "LongCodeLine ".repeat(100)
      })
    for (const selector of [
      ".press-table-scroll",
      ".source-scroll .yu-scroll-viewport",
    ]) {
      expect(
        await prose
          .locator(selector)
          .first()
          .evaluate((node) => node.scrollWidth > node.clientWidth),
      ).toBe(true)
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    await page.screenshot({
      path: testInfo.outputPath(`markdown-${dark ? "dark" : "light"}.png`),
      fullPage: true,
      animations: "disabled",
    })
    await prose
      .locator("table")
      .first()
      .evaluate((node, html) => {
        node.innerHTML = html
      }, originalTable)
    await prose
      .locator("pre code")
      .first()
      .evaluate((node, content) => {
        node.textContent = content
      }, originalCode)
  }
})
