import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { expect, it } from "vitest"
import { DocumentPagination } from "../../src/document/pagination"

it("does not render the pagination border or landmark when neither neighbor exists", () => {
  expect(
    renderToStaticMarkup(
      createElement(DocumentPagination, {
        previous: undefined,
        next: undefined,
      }),
    ),
  ).toBe("")
})
