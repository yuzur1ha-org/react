import { openDocument } from "../../helpers/open-document"
import { expect, test } from "@playwright/test"
test("the same tokens style Yuzur1ha UI and real HeroUI components", async ({
  page,
}) => {
  await openDocument(page, "/ui/button/")
  const button = page.getByRole("button", { name: "Continue", exact: true })
  const ui = await button.evaluate((element) => {
    const css = getComputedStyle(element)
    return {
      background: css.backgroundColor,
      color: css.color,
      radius: css.borderRadius,
    }
  })
  await openDocument(page, "/ui/foundations/")
  const hero = page.getByTestId("heroui-button")
  await expect(hero).toBeVisible()
  const adapted = await hero.evaluate((element) => {
    const css = getComputedStyle(element)
    return {
      background: css.backgroundColor,
      color: css.color,
      radius: css.borderRadius,
    }
  })
  expect(adapted).toEqual(ui)
  const field = await page.getByTestId("heroui-input").evaluate((element) => {
    const css = getComputedStyle(element)
    return { background: css.backgroundColor, radius: css.borderRadius }
  })
  expect(field.background).toBe("rgb(255, 255, 255)")
  expect(field.radius).toBe("0px")
})
