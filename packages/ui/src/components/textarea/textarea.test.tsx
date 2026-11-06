import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Textarea } from "./textarea"
describe("Textarea", () => {
  it("accepts multiline content", async () => {
    render(<Textarea label="Bio" />)
    await userEvent.type(screen.getByRole("textbox"), "Line one{Enter}Line two")
    expect(screen.getByRole("textbox")).toHaveValue("Line one\nLine two")
  })
})
