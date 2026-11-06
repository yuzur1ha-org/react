import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Switch } from "./switch"
describe("Switch", () => {
  it("toggles with Space and respects disabled state", async () => {
    const change = vi.fn()
    render(
      <>
        <Switch label="Notify" onChange={change} />
        <Switch label="Disabled" disabled />
      </>,
    )
    await userEvent.tab()
    await userEvent.keyboard(" ")
    expect(screen.getByRole("switch", { name: "Notify" })).toBeChecked()
    expect(change).toHaveBeenCalledTimes(1)
    expect(screen.getByRole("switch", { name: "Disabled" })).toBeDisabled()
  })
})
