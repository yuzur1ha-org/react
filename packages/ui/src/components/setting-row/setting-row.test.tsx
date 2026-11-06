import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { SettingRow } from "./setting-row"
import { Button } from "../button/index"
describe("SettingRow", () => {
  it("delegates its action without owning persistence", async () => {
    const click = vi.fn()
    render(
      <SettingRow
        label="Name"
        value="Alex"
        action={<Button onClick={click}>Edit</Button>}
      />,
    )
    await userEvent.click(screen.getByRole("button", { name: "Edit" }))
    expect(click).toHaveBeenCalledOnce()
  })
})
