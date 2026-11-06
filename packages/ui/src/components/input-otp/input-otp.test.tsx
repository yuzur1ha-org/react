import { expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { InputOTP } from "./input-otp"

it("InputOTP normalizes pasted codes and supports native editing as one field", async () => {
  function Example() {
    const [value, setValue] = useState("")
    return <InputOTP label="Code" value={value} onValueChange={setValue} />
  }
  render(<Example />)
  const user = userEvent.setup()
  const input = screen.getByRole("textbox", { name: "Code" })
  await user.click(input)
  await user.paste("12 34-5678")
  expect(input).toHaveValue("123456")
  await user.keyboard("{End}{Backspace}")
  expect(input).toHaveValue("12345")
  await user.keyboard("{Home}{Delete}")
  expect(input).toHaveValue("2345")
  expect(input).toHaveAttribute("autocomplete", "one-time-code")
})

it("InputOTP exposes errors and disabled state", () => {
  render(
    <InputOTP
      label="Code"
      value=""
      onValueChange={() => undefined}
      error="Expired"
      disabled
    />,
  )
  expect(screen.getByLabelText("Code")).toBeDisabled()
  expect(screen.getByLabelText("Code")).toHaveAccessibleDescription("Expired")
})

it("does not publish pasted input while read-only", async () => {
  const change = vi.fn()
  const user = userEvent.setup()
  render(
    <InputOTP
      label="Verification code"
      value="123456"
      onValueChange={change}
      readOnly
    />,
  )
  await user.click(screen.getByRole("textbox", { name: "Verification code" }))
  await user.paste("654321")
  expect(change).not.toHaveBeenCalled()
  expect(screen.getByRole("textbox")).toHaveValue("123456")
})
