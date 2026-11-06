import { expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Select } from "./select"
it("supports keyboard selection, skips disabled options and restores focus", async () => {
  const changed = vi.fn()
  const user = userEvent.setup()
  render(
    <Select
      label="Region"
      defaultValue="a"
      onValueChange={changed}
      options={[
        { value: "a", label: "A" },
        { value: "c", label: "C", disabled: true },
        { value: "b", label: "B" },
      ]}
    />,
  )
  const trigger = screen.getByRole("combobox", { name: "Region" })
  await user.tab()
  await user.keyboard("{Enter}")
  await user.keyboard("{ArrowDown}")
  await waitFor(() =>
    expect(screen.getByRole("option", { name: "B" })).toHaveFocus(),
  )
  await user.keyboard("{Enter}")
  await waitFor(() => expect(trigger).toHaveTextContent("B"))
  expect(changed).toHaveBeenCalledWith("b")
  expect(trigger).toHaveFocus()
  await user.keyboard("{Enter}")
  await user.keyboard("{Escape}")
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
  expect(trigger).toHaveFocus()
})
it("includes its value in form data and respects disabled state", () => {
  const { rerender } = render(
    <form data-testid="form">
      <Select
        name="region"
        label="Region"
        defaultValue="a"
        options={[{ value: "a", label: "A" }]}
      />
    </form>,
  )
  const form = screen.getByTestId("form")
  if (!(form instanceof HTMLFormElement)) throw new Error("Expected form")
  expect(new FormData(form).get("region")).toBe("a")
  rerender(
    <Select label="Region" disabled options={[{ value: "a", label: "A" }]} />,
  )
  expect(screen.getByRole("combobox")).toBeDisabled()
})

it("preserves caller-provided validation state without an error message", () => {
  const { rerender } = render(
    <Select
      label="Country"
      options={[{ value: "ca", label: "Canada" }]}
      aria-invalid="grammar"
    />,
  )
  expect(screen.getByRole("combobox")).toHaveAttribute(
    "aria-invalid",
    "grammar",
  )
  rerender(
    <Select
      label="Country"
      options={[{ value: "ca", label: "Canada" }]}
      aria-invalid={false}
      error="Choose a country"
    />,
  )
  expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true")
})
