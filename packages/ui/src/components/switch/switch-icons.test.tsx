import { expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Switch } from "./switch"
it("keeps a hidden label accessible with decorative state icons", async () => {
  render(
    <Switch
      size="large"
      hideLabel
      label="Dark theme"
      checkedIcon={<svg />}
      uncheckedIcon={<svg />}
    />,
  )
  const toggle = screen.getByRole("switch", { name: "Dark theme" })
  await userEvent.setup().tab()
  expect(toggle).toHaveFocus()
  await userEvent.setup().keyboard(" ")
  expect(toggle).toBeChecked()
  expect(toggle.closest("label")?.querySelector(".yu-switch")).toHaveAttribute(
    "aria-hidden",
    "true",
  )
})
