import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Checkbox } from "./checkbox"
describe("Checkbox", () => {
  it("uses the full label as a target", async () => {
    render(<Checkbox label="Updates" />)
    await userEvent.click(screen.getByText("Updates"))
    expect(screen.getByRole("checkbox")).toBeChecked()
  })
})
