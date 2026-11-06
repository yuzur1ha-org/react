import { expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Badge } from "./badge"
it("caps only the visual count, hides zero and preserves its child action", async () => {
  const click = vi.fn()
  const { rerender } = render(
    <Badge count={120} label="120 unread">
      <button onClick={click}>Inbox</button>
    </Badge>,
  )
  expect(screen.getByRole("img", { name: "120 unread" })).toHaveTextContent(
    "99+",
  )
  await userEvent.click(screen.getByRole("button"))
  expect(click).toHaveBeenCalledOnce()
  rerender(
    <Badge count={0} label="0 unread">
      <button>Inbox</button>
    </Badge>,
  )
  expect(screen.queryByRole("img")).not.toBeInTheDocument()
  expect(screen.getByRole("button")).toBeInTheDocument()
  rerender(
    <Badge count={0} showZero label="0 unread">
      <button>Inbox</button>
    </Badge>,
  )
  expect(screen.getByRole("img")).toHaveTextContent("0")
})
it("names dots and supports removing the indicator without removing the anchor", () => {
  const { rerender } = render(
    <Badge variant="dot" label="Available">
      <button>Profile</button>
    </Badge>,
  )
  expect(screen.getByRole("img", { name: "Available" })).toBeEmptyDOMElement()
  rerender(
    <Badge variant="dot" label="Available" invisible>
      <button>Profile</button>
    </Badge>,
  )
  expect(screen.queryByRole("img")).not.toBeInTheDocument()
  expect(screen.getByRole("button")).toBeInTheDocument()
})
