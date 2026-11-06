import { expect, type Page } from "@playwright/test"

export async function openDocument(page: Page, path: string) {
  await page.goto(path)
  await expect(page.locator('main[data-press-ready="true"]')).toBeVisible()
  const source = page.locator(".usage")
  if (await source.count())
    await expect(source.locator(".yu-code-panel")).toHaveAttribute(
      "data-source-ready",
      "true",
    )
}
