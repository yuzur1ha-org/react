import { expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Disclosure, DisclosureTrigger, DisclosureContent } from "./disclosure"
it("provides a heading, expanded state and named panel with keyboard activation", async () => {
  render(
    <Disclosure>
      <DisclosureTrigger>Details</DisclosureTrigger>
      <DisclosureContent>Additional content</DisclosureContent>
    </Disclosure>,
  )
  const trigger = screen.getByRole("button", { name: "Details" })
  expect(screen.getByRole("heading", { level: 3 })).toContainElement(trigger)
  expect(trigger).toHaveAttribute("aria-expanded", "false")
  trigger.focus()
  await userEvent.keyboard(" ")
  expect(screen.getByRole("region", { name: "Details" })).toHaveTextContent(
    "Additional content",
  )
  expect(trigger).toHaveAttribute(
    "aria-controls",
    screen.getByRole("region").id,
  )
  await userEvent.keyboard("{Enter}")
  expect(trigger).toHaveAttribute("aria-expanded", "false")
})
it("supports controlled state and ignores disabled activation", async () => {
  const change = vi.fn()
  const { rerender } = render(
    <Disclosure open onOpenChange={change}>
      <DisclosureTrigger>Details</DisclosureTrigger>
      <DisclosureContent>Content</DisclosureContent>
    </Disclosure>,
  )
  await userEvent.click(screen.getByRole("button"))
  expect(change).toHaveBeenCalledWith(false)
  expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true")
  rerender(
    <Disclosure disabled onOpenChange={change}>
      <DisclosureTrigger>Details</DisclosureTrigger>
      <DisclosureContent>Content</DisclosureContent>
    </Disclosure>,
  )
  change.mockClear()
  await userEvent.click(screen.getByRole("button"))
  expect(change).not.toHaveBeenCalled()
})
