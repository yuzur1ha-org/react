import { expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MenuDisclosure, MenuPopover } from "./menu-surfaces"
import { Menu, MenuGroup, MenuItem, MenuAction } from "./menu"
it("uses navigation links with a current page and blocks disabled links/actions", async () => {
  const select = vi.fn()
  render(
    <Menu label="Account">
      <MenuGroup label="Workspace">
        <MenuItem href="#profile" active>
          Profile
        </MenuItem>
        <MenuItem href="#billing" disabled onClick={select}>
          Billing
        </MenuItem>
        <MenuAction disabled onClick={select}>
          Delete
        </MenuAction>
      </MenuGroup>
    </Menu>,
  )
  expect(
    screen.getByRole("navigation", { name: "Account" }),
  ).toBeInTheDocument()
  expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute(
    "aria-current",
    "page",
  )
  const disabled = screen.getByRole("link", { name: "Billing" })
  expect(disabled).not.toHaveAttribute("href")
  expect(disabled).toHaveAttribute("tabindex", "-1")
  await userEvent.click(disabled)
  await userEvent.click(screen.getByRole("button", { name: "Delete" }))
  expect(select).not.toHaveBeenCalled()
})

it("supports subtle counters and section semantics without page roles", () => {
  render(
    <Menu
      label="Sections"
      appearance="subtle"
      orientation="horizontal"
      size="small"
    >
      <MenuItem href="#intro" active aria-current="location" trailing="03">
        Introduction
      </MenuItem>
    </Menu>,
  )
  expect(screen.getByRole("link")).toHaveAttribute("aria-current", "location")
  expect(screen.getByRole("navigation")).toHaveAttribute(
    "data-orientation",
    "horizontal",
  )
  expect(screen.getByText("03")).toBeVisible()
})
it("disclosure closes with Escape and restores its trigger focus", async () => {
  render(
    <MenuDisclosure label="Browse">
      <Menu label="Documents">
        <MenuItem href="#guide">Guide</MenuItem>
      </Menu>
    </MenuDisclosure>,
  )
  const trigger = screen.getByRole("button", { name: "Browse" })
  await userEvent.click(trigger)
  await userEvent.tab()
  expect(screen.getByRole("link", { name: "Guide" })).toHaveFocus()
  await userEvent.keyboard("{Escape}")
  expect(trigger).toHaveAttribute("aria-expanded", "false")
  expect(trigger).toHaveFocus()
})
it("popover closes after selecting a menu action", async () => {
  render(
    <MenuPopover label="Contents">
      <Menu label="Sections">
        <MenuAction>Introduction</MenuAction>
      </Menu>
    </MenuPopover>,
  )
  await userEvent.click(screen.getByRole("button", { name: "Contents" }))
  await userEvent.click(screen.getByRole("button", { name: "Introduction" }))
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
})

it("inherits active appearance from Menu and permits a per-item override", () => {
  render(
    <Menu label="Mixed" activeAppearance="solid">
      <MenuItem href="#first" active>
        First
      </MenuItem>
      <MenuItem href="#second" active activeAppearance="subtle">
        Second
      </MenuItem>
    </Menu>,
  )
  expect(screen.getByRole("link", { name: "First" })).toHaveAttribute(
    "data-active-appearance",
    "solid",
  )
  expect(screen.getByRole("link", { name: "Second" })).toHaveAttribute(
    "data-active-appearance",
    "subtle",
  )
})

it("lets links keep a surface open without changing prevented-navigation defaults", async () => {
  render(
    <MenuDisclosure label="Browse">
      <Menu label="Documents">
        <MenuItem
          href="#keep"
          dismissOnSelect={false}
          onClick={(event) => event.preventDefault()}
        >
          Keep open
        </MenuItem>
        <MenuItem href="#close" onClick={(event) => event.preventDefault()}>
          Close
        </MenuItem>
      </Menu>
    </MenuDisclosure>,
  )
  const trigger = screen.getByRole("button", { name: "Browse" })
  await userEvent.click(trigger)
  await userEvent.click(screen.getByRole("link", { name: "Keep open" }))
  expect(trigger).toHaveAttribute("aria-expanded", "true")
  await userEvent.click(screen.getByRole("link", { name: "Close" }))
  expect(trigger).toHaveAttribute("aria-expanded", "false")
})

it("restores disclosure focus after a local action and preserves explicit prevention", async () => {
  render(
    <MenuDisclosure label="Actions">
      <Menu label="Tools">
        <MenuAction onClick={(event) => event.preventDefault()}>
          Prevent
        </MenuAction>
        <MenuAction>Apply</MenuAction>
      </Menu>
    </MenuDisclosure>,
  )
  const trigger = screen.getByRole("button", { name: "Actions" })
  await userEvent.click(trigger)
  await userEvent.click(screen.getByRole("button", { name: "Prevent" }))
  expect(trigger).toHaveAttribute("aria-expanded", "true")
  await userEvent.click(screen.getByRole("button", { name: "Apply" }))
  expect(trigger).toHaveAttribute("aria-expanded", "false")
  expect(trigger).toHaveFocus()
})

it("protects new-window links while preserving caller rel tokens", () => {
  render(
    <Menu label="External">
      <MenuItem
        href="https://example.com"
        target="_blank"
        rel="author noopener"
      >
        Source
      </MenuItem>
    </Menu>,
  )
  expect(screen.getByRole("link", { name: "Source" })).toHaveAttribute(
    "rel",
    "author noopener noreferrer",
  )
})

it("does not render a label or reserve label space for an unnamed group", () => {
  render(
    <Menu label="Guides">
      <MenuGroup label="">
        <MenuItem href="/intro">Introduction</MenuItem>
      </MenuGroup>
    </Menu>,
  )
  const group = screen.getByRole("group")
  expect(group.querySelector(".yu-menu-label")).toBeNull()
  expect(group).not.toHaveAttribute("aria-labelledby")
})

it("inherits emphasis while preserving current-location semantics and per-item overrides", () => {
  render(
    <Menu label="Outline" activeAppearance="emphasis">
      <MenuItem href="#first" active aria-current="location">
        First
      </MenuItem>
      <MenuItem href="#second" activeAppearance="solid">
        Second
      </MenuItem>
      <MenuItem href="#third" active disabled>
        Unavailable
      </MenuItem>
    </Menu>,
  )
  expect(screen.getByRole("link", { name: "First" })).toHaveAttribute(
    "data-active-appearance",
    "emphasis",
  )
  expect(screen.getByRole("link", { name: "First" })).toHaveAttribute(
    "aria-current",
    "location",
  )
  expect(screen.getByRole("link", { name: "Second" })).toHaveAttribute(
    "data-active-appearance",
    "solid",
  )
  expect(screen.getByRole("link", { name: "Unavailable" })).toHaveAttribute(
    "aria-disabled",
    "true",
  )
})
