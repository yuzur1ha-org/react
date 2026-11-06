import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Radio } from "./radio"
describe("Radio", () => {
  it("keeps a single choice in a native group", async () => {
    render(
      <>
        <Radio name="scope" label="Private" defaultChecked />
        <Radio name="scope" label="Public" />
      </>,
    )
    await userEvent.click(screen.getByLabelText("Public"))
    expect(screen.getByLabelText("Public")).toBeChecked()
    expect(screen.getByLabelText("Private")).not.toBeChecked()
  })
})
