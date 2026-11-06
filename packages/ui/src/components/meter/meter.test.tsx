import { expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Meter } from "./meter"
it("labels fractional values and clamps its accessible value to the known range", () => {
  const { rerender } = render(
    <Meter label="Quality" value={0.6} max={1} valueText="Good" />,
  )
  expect(screen.getByRole("meter", { name: "Quality" })).toHaveAttribute(
    "aria-valuenow",
    "0.6",
  )
  expect(screen.getByRole("meter")).toHaveAttribute("aria-valuetext", "Good")
  rerender(<Meter label="Quality" value={200} min={10} max={110} />)
  expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "110")
  expect(screen.getByText("100%")).toBeInTheDocument()
  rerender(<Meter label="Quality" value={-4} min={10} max={110} />)
  expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "10")
})
it("rejects ranges without meaningful finite bounds", () => {
  expect(() =>
    render(<Meter label="Invalid" value={1} min={1} max={1} />),
  ).toThrow(RangeError)
  expect(() => render(<Meter label="Invalid" value={NaN} />)).toThrow(
    RangeError,
  )
})
