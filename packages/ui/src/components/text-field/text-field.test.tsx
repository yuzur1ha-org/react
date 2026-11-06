import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { TextField } from "./text-field"
import { createRef } from "react"
describe("TextField", () => {
  it("composes native refs, classes and external descriptions", () => {
    const ref = createRef<HTMLInputElement>()
    render(
      <>
        <p id="external">External help</p>
        <TextField
          ref={ref}
          label="Composed"
          hint="Local help"
          className="consumer-field"
          aria-describedby="external"
        />
      </>,
    )
    expect(ref.current).toBe(screen.getByLabelText("Composed"))
    expect(ref.current).toHaveClass("consumer-field")
    expect(ref.current).toHaveAccessibleDescription("External help Local help")
  })
  it("connects validation feedback to the labeled input", () => {
    render(<TextField label="Name" error="Name required" />)
    expect(
      screen.getByRole("textbox", { name: "Name" }),
    ).toHaveAccessibleDescription("Name required")
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true")
  })
  it("retains native number constraints", () => {
    render(
      <TextField
        type="number"
        label="Quantity"
        min={0}
        max={5}
        defaultValue={8}
      />,
    )
    expect(screen.getByRole("spinbutton", { name: "Quantity" })).toBeInvalid()
  })
})
