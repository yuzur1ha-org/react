import { expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Drawer, DrawerClose } from "./drawer"
it("opens with accessible title, closes by action and restores the trigger", async () => {
  const changed = vi.fn()
  render(
    <Drawer
      trigger={<button>Open</button>}
      title="Navigation"
      closeLabel="Close"
      side="left"
      onOpenChange={changed}
      footer={
        <DrawerClose asChild>
          <button>Done</button>
        </DrawerClose>
      }
    >
      <a href="#overview">Overview</a>
    </Drawer>,
  )
  await userEvent.click(screen.getByRole("button", { name: "Open" }))
  expect(screen.getByRole("dialog", { name: "Navigation" })).toHaveAttribute(
    "data-side",
    "left",
  )
  expect(changed).toHaveBeenCalledWith(true)
  await userEvent.click(screen.getByRole("button", { name: "Done" }))
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  )
  expect(screen.getByRole("button", { name: "Open" })).toHaveFocus()
  expect(changed).toHaveBeenLastCalledWith(false)
})

it("places extra actions in the header and gives the body its own class", async () => {
  render(
    <Drawer
      trigger={<button>Open navigation</button>}
      title="Component library"
      closeLabel="Close navigation"
      headerActions={<a href="https://www.figma.com">Figma</a>}
      headerContent={<div>Design Prototype</div>}
      bodyClassName="navigation-body"
    >
      <nav aria-label="Components">
        <a href="#button">Button</a>
      </nav>
    </Drawer>,
  )
  await userEvent.click(screen.getByRole("button", { name: "Open navigation" }))
  const dialog = screen.getByRole("dialog", { name: "Component library" })
  expect(screen.getByText("Design Prototype").parentElement).toHaveClass(
    "yu-drawer-header",
  )
  expect(
    screen.getByRole("link", { name: "Figma" }).closest("header"),
  ).toHaveClass("yu-drawer-header")
  expect(
    screen.getByRole("button", { name: "Close navigation" }).closest("header"),
  ).toBe(dialog.querySelector("header"))
  expect(
    screen.getByRole("navigation", { name: "Components" }).parentElement,
  ).toHaveClass("yu-drawer-body", "navigation-body")
  await userEvent.click(
    screen.getByRole("button", { name: "Close navigation" }),
  )
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  )
  expect(screen.getByRole("button", { name: "Open navigation" })).toHaveFocus()
})
