import { createRef, useState } from "react"
import { expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NumberField } from "./number-field"
const labels = {
  label: "Quantity",
  incrementLabel: "Increase",
  decrementLabel: "Decrease",
}
it("renders tiny values as editable decimals and preserves read-only values on blur", async () => {
  const { rerender } = render(
    <NumberField {...labels} defaultValue={1e-7} step={1e-7} />,
  )
  const user = userEvent.setup()
  const input = screen.getByRole("spinbutton")
  expect(input).toHaveValue("0.0000001")
  expect(input).toHaveAttribute("aria-valuenow", "1e-7")
  await user.click(screen.getByRole("button", { name: "Increase" }))
  expect(input).toHaveValue("0.0000002")
  rerender(
    <NumberField
      key="readonly"
      {...labels}
      defaultValue={5}
      step={2}
      readOnly
    />,
  )
  await user.click(screen.getByRole("spinbutton"))
  await user.tab()
  expect(screen.getByRole("spinbutton")).toHaveValue("5")
})

it("uses custom controls, supports keyboard limits and stops at boundaries", async () => {
  render(<NumberField {...labels} defaultValue={1} min={0} max={3} />)
  const user = userEvent.setup()
  const input = screen.getByRole("spinbutton")
  expect(input).toHaveAttribute("type", "text")
  await user.click(screen.getByRole("button", { name: "Increase" }))
  expect(input).toHaveValue("2")
  expect(input).toHaveFocus()
  await user.keyboard("{ArrowUp}")
  expect(input).toHaveValue("3")
  expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled()
  await user.keyboard("{Home}")
  expect(input).toHaveValue("0")
  expect(screen.getByRole("button", { name: "Decrease" })).toBeDisabled()
  await user.keyboard("{End}{ArrowDown}")
  expect(input).toHaveValue("2")
})
it("keeps decimal steps exact and supports a non-zero step origin", async () => {
  render(
    <NumberField
      {...labels}
      defaultValue={0.15}
      min={0.05}
      max={0.45}
      step={0.1}
    />,
  )
  const user = userEvent.setup()
  for (let index = 0; index < 3; index++)
    await user.click(screen.getByRole("button", { name: "Increase" }))
  expect(screen.getByRole("spinbutton")).toHaveValue("0.45")
  expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled()
})
it("preserves intermediate edits, normalizes blur and accepts clearing", async () => {
  render(
    <NumberField {...labels} defaultValue={0} min={-1} max={1} step={0.1} />,
  )
  const user = userEvent.setup()
  const input = screen.getByRole("spinbutton")
  await user.clear(input)
  await user.type(input, "-.")
  expect(input).toHaveValue("-.")
  await user.type(input, "25")
  expect(input).toHaveValue("-.25")
  await user.tab()
  expect(input).toHaveValue("-0.2")
  await user.clear(input)
  await user.type(input, "9")
  expect(input).toHaveAttribute("aria-invalid", "true")
  await user.tab()
  expect(input).toHaveValue("1")
  await user.clear(input)
  await user.tab()
  expect(input).toHaveValue("")
})
it("supports controlled reset, input refs and disabled/read-only states", async () => {
  const ref = createRef<HTMLInputElement>()
  const changed = vi.fn()
  function Example() {
    const [value, setValue] = useState<number | null>(2)
    return (
      <>
        <NumberField
          {...labels}
          ref={ref}
          value={value}
          onValueChange={(next) => {
            changed(next)
            setValue(next)
          }}
        />
        <button onClick={() => setValue(8)}>Reset</button>
      </>
    )
  }
  const { rerender } = render(<Example />)
  const user = userEvent.setup()
  await user.click(screen.getByRole("button", { name: "Increase" }))
  expect(changed).toHaveBeenCalledWith(3)
  expect(ref.current).toHaveValue("3")
  await user.click(screen.getByRole("button", { name: "Reset" }))
  expect(ref.current).toHaveValue("8")
  rerender(<NumberField {...labels} defaultValue={5} readOnly />)
  await user.click(screen.getByRole("spinbutton"))
  await user.keyboard("{ArrowUp}")
  expect(screen.getByRole("spinbutton")).toHaveValue("5")
  expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled()
  rerender(<NumberField {...labels} disabled />)
  expect(screen.getByRole("spinbutton")).toBeDisabled()
})
