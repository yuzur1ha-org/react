import { type Page } from "@playwright/test"
import { openDocument } from "../../helpers/open-document"
export async function open(page: Page, name: string) {
  await openDocument(
    page,
    name === "tokens" ? "/ui/foundations/" : `/ui/${name}/`,
  )
}
