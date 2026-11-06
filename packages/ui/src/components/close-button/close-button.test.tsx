import { expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { CloseButton } from "./close-button"
it("has an accessible close label", () => {
  render(<CloseButton label="Close dialog" />)
  expect(screen.getByRole("button", { name: "Close dialog" })).toHaveAttribute(
    "type",
    "button",
  )
})
