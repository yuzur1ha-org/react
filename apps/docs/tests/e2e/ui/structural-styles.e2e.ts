import { expect, test } from "@playwright/test"
import { openDocument } from "../../helpers/open-document"

test("content edge spacing ignores SSR style siblings without changing middle elements", async ({
  page,
}) => {
  const warnings: string[] = []
  page.on("console", (message) => {
    if (/potentially unsafe/.test(message.text())) warnings.push(message.text())
  })
  for (const component of ["accordion", "disclosure"]) {
    await openDocument(page, `/ui/${component}/`)
    const body = page.locator(`.demo-content .yu-${component}-body`).first()
    await expect(body).toBeVisible()
    const margins = await body.evaluate((node) => {
      node.classList.add("ssr-margin-fixture")
      const stylesheet = document.createElement("style")
      stylesheet.textContent =
        ".ssr-margin-fixture > .edge-fixture { margin: 24px 0; }"
      const first = document.createElement("h3")
      const middle = document.createElement("p")
      const last = document.createElement("p")
      for (const element of [first, middle, last]) {
        element.className = "edge-fixture"
        element.textContent = "Sample content"
      }
      node.replaceChildren(
        stylesheet,
        first,
        document.createElement("style"),
        middle,
        last,
        document.createElement("style"),
      )
      return [first, middle, last].map((element) => {
        const style = getComputedStyle(element)
        return { top: style.marginTop, bottom: style.marginBottom }
      })
    })
    expect(margins).toEqual([
      { top: "0px", bottom: "24px" },
      { top: "24px", bottom: "24px" },
      { top: "24px", bottom: "0px" },
    ])
  }
  for (const component of ["setting-row", "meter"]) {
    await openDocument(page, `/ui/${component}/`)
    await expect(
      page.locator(`.demo-content .yu-${component}`).first(),
    ).toBeVisible()
  }
  expect(warnings).toEqual([])
})
