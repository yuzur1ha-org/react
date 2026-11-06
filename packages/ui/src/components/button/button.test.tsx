import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "./button"
describe("Button", () => {
  it("supports keyboard activation and prevents loading submissions", async () => {
    const click = vi.fn()
    const user = userEvent.setup()
    const { rerender } = render(<Button onClick={click}>Save</Button>)
    await user.tab()
    await user.keyboard("{Enter}")
    expect(click).toHaveBeenCalledTimes(1)
    rerender(
      <Button loading onClick={click}>
        Save
      </Button>,
    )
    await user.click(screen.getByRole("button"))
    expect(click).toHaveBeenCalledTimes(1)
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true")
  })
})

it("keeps a non-scaling button interactive and does not forward its prop to the DOM", async () => {
  const click = vi.fn()
  render(
    <Button scaleOnPress={false} onClick={click}>
      No scale
    </Button>,
  )
  const button = screen.getByRole("button", { name: "No scale" })
  expect(button).toHaveAttribute("data-scale-on-press", "false")
  expect(button).not.toHaveAttribute("scaleOnPress")
  await userEvent.setup().click(button)
  expect(click).toHaveBeenCalledTimes(1)
})
