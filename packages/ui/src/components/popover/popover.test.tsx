import { expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Popover, PopoverClose } from "./popover"
import { Button } from "../button/index"
it("opens interactive content with keyboard focus and restores its trigger", async () => {
  const changed = vi.fn()
  render(
    <Popover
      trigger={<Button>Edit</Button>}
      label="Editor"
      onOpenChange={changed}
    >
      <label>
        Name
        <input />
      </label>
      <PopoverClose asChild>
        <Button>Done</Button>
      </PopoverClose>
    </Popover>,
  )
  const user = userEvent.setup()
  await user.tab()
  await user.keyboard("{Enter}")
  expect(screen.getByRole("dialog", { name: "Editor" })).toBeInTheDocument()
  expect(screen.getByLabelText("Name")).toHaveFocus()
  await user.click(screen.getByRole("button", { name: "Done" }))
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  )
  expect(screen.getByRole("button", { name: "Edit" })).toHaveFocus()
  expect(changed).toHaveBeenLastCalledWith(false)
})
