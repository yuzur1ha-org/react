import { expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "../button/index"
import { Modal, ModalClose } from "./modal"
it("notifies uncontrolled state changes without requiring a controlled value", async () => {
  const change = vi.fn()
  render(
    <Modal
      trigger={<Button>Open</Button>}
      title="Example"
      description="Details"
      closeLabel="Close"
      onOpenChange={change}
    >
      <p>Body</p>
    </Modal>,
  )
  await userEvent.click(screen.getByRole("button", { name: "Open" }))
  expect(screen.getByRole("dialog")).toBeInTheDocument()
  expect(change).toHaveBeenCalledWith(true)
  await userEvent.keyboard("{Escape}")
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  )
  expect(change).toHaveBeenLastCalledWith(false)
})
it("Modal traps focus, starts on Cancel and restores its trigger after Escape", async () => {
  render(
    <Modal
      trigger={<Button>Open</Button>}
      title="Confirm"
      description="Review the action"
      closeLabel="Close"
    >
      <div className="yu-modal-actions">
        <ModalClose asChild>
          <Button>Cancel</Button>
        </ModalClose>
        <Button>Confirm action</Button>
      </div>
    </Modal>,
  )
  const user = userEvent.setup()
  await user.click(screen.getByRole("button", { name: "Open" }))
  expect(screen.getByRole("dialog", { name: "Confirm" })).toBeInTheDocument()
  expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus()
  await user.tab()
  await user.tab()
  expect(screen.getByRole("button", { name: "Close" })).toHaveFocus()
  await user.keyboard("{Escape}")
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  )
  expect(screen.getByRole("button", { name: "Open" })).toHaveFocus()
})

it("skips hidden form values when choosing initial focus", async () => {
  render(
    <Modal
      trigger={<Button>Open form</Button>}
      title="Edit"
      description="Form details"
      closeLabel="Close"
    >
      <input type="hidden" name="record" value="42" />
      <input aria-label="Name" />
    </Modal>,
  )
  await userEvent.click(screen.getByRole("button", { name: "Open form" }))
  expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus()
})
