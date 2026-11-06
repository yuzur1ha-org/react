import { expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { createPortal } from "react-dom"
import { deriveTokens, tokens } from "@yuzur1ha/token"
import { UIProvider, useTokens } from "../../src/theme"
function ReadTheme({ name }: { name: string }) {
  return <output data-testid={name}>{useTokens().ink}</output>
}
it("isolates nested themes and preserves context through portals", () => {
  const theme = deriveTokens({ ink: "#006b5a" })
  render(
    <>
      <ReadTheme name="default" />
      <UIProvider theme={theme}>
        <UIProvider>
          {createPortal(<ReadTheme name="portal" />, document.body)}
        </UIProvider>
      </UIProvider>
      <ReadTheme name="sibling" />
    </>,
  )
  expect(screen.getByTestId("default")).toHaveTextContent(tokens.ink)
  expect(screen.getByTestId("portal")).toHaveTextContent(theme.ink)
  expect(screen.getByTestId("sibling")).toHaveTextContent(tokens.ink)
})
