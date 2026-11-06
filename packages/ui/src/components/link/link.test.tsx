import { createRef } from "react"
import { expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Link } from "./link"
it("keeps native link semantics, keyboard focus and a decorative trailing icon", async () => {
  render(<Link href="#guide">Read guide</Link>)
  const link = screen.getByRole("link", { name: "Read guide" })
  expect(link).toHaveAttribute("href", "#guide")
  expect(link.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  await userEvent.setup().tab()
  expect(link).toHaveFocus()
})
it("preserves caller relation values and secures new-tab navigation", () => {
  const { rerender } = render(
    <Link href="https://example.com" target="_blank" rel="author">
      Reference
    </Link>,
  )
  expect(screen.getByRole("link")).toHaveAttribute(
    "rel",
    "author noopener noreferrer",
  )
  rerender(
    <Link href="/docs" showIcon={false}>
      Docs
    </Link>,
  )
  expect(screen.getByRole("link").querySelector("svg")).toBeNull()
})

it("composes a single native link and forwards both part refs and attributes", async () => {
  const container = createRef<HTMLAnchorElement>()
  const line = createRef<HTMLSpanElement>()
  render(
    <Link.Container
      href="#account"
      target="_blank"
      rel="author"
      ref={container}
      size="large"
      aria-label="Account card"
    >
      <h2>
        <Link.Underline ref={line} size="small">
          Account
        </Link.Underline>
      </h2>
      <p>Manage your profile.</p>
    </Link.Container>,
  )
  const anchor = screen.getByRole("link", { name: "Account card" })
  expect(container.current).toBe(anchor)
  expect(anchor.querySelectorAll("a")).toHaveLength(0)
  expect(anchor).toHaveAttribute("rel", "author noopener noreferrer")
  expect(anchor).toHaveAttribute("data-size", "large")
  expect(line.current).toBe(screen.getByText("Account"))
  expect(line.current).toHaveAttribute("data-size", "small")
  await userEvent.setup().tab()
  expect(anchor).toHaveFocus()
})

it("uses underline only for hover and focus decoration", () => {
  const { rerender } = render(
    <Link href="/docs" underline={false}>
      Docs
    </Link>,
  )
  expect(screen.getByRole("link")).toHaveAttribute("data-underline", "false")
  rerender(<Link href="/docs">Docs</Link>)
  expect(screen.getByRole("link")).toHaveAttribute("data-underline", "true")
})
it("does not insert decoration into a container-only link", () => {
  render(
    <Link.Container href="/docs">
      <h2>Docs</h2>
    </Link.Container>,
  )
  expect(
    screen.getByRole("link").querySelector(".yu-link-hover-line"),
  ).toBeNull()
})
