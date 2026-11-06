import { useState } from "react"
import {
  Menu,
  MenuGroup,
  MenuDisclosure,
  MenuPopover,
  MenuItem,
  MenuAction,
  ResponsiveMenu,
  Segmented,
  Button,
} from "@yuzur1ha/ui"
import { DemoResult } from "../../examples/result"
export function MenuDemo() {
  const [activeAppearance, setActiveAppearance] = useState<
    "subtle" | "solid" | "emphasis"
  >("subtle")
  const [active, setActive] = useState("Overview")
  const [layout, setLayout] = useState<
    "responsive" | "inline" | "popover" | "drawer"
  >("responsive")
  return (
    <>
      <Segmented
        label="Menu layout"
        value={layout}
        onChange={setLayout}
        options={[
          { value: "responsive", label: "Auto" },
          { value: "inline", label: "Inline" },
          { value: "popover", label: "Popover" },
          { value: "drawer", label: "Drawer" },
        ]}
      />
      <Segmented
        label="Active style"
        value={activeAppearance}
        onChange={setActiveAppearance}
        options={[
          { value: "subtle", label: "Subtle" },
          { value: "solid", label: "Solid" },
          { value: "emphasis", label: "Emphasis" },
        ]}
      />
      <ResponsiveMenu
        label="Workspace navigation"
        triggerLabel="Browse workspace"
        closeLabel="Close navigation"
        layout={layout}
      >
        <Menu label="Workspace" activeAppearance={activeAppearance}>
          <Button onClick={() => setActive("New workspace")}>
            New workspace
          </Button>
          <MenuGroup label="Workspace">
            {["Overview", "Activity", "Members"].map((label, index) => (
              <MenuItem
                key={label}
                href={`#${label.toLowerCase()}`}
                active={active === label}
                trailing={String(index + 1).padStart(2, "0")}
                onClick={(event) => {
                  event.preventDefault()
                  setActive(label)
                }}
              >
                {label}
              </MenuItem>
            ))}
            <MenuItem href="#billing" disabled>
              Billing
            </MenuItem>
          </MenuGroup>
          <MenuGroup label="Preferences">
            <MenuAction data-menu-dismiss onClick={() => setActive("Settings")}>
              Settings
            </MenuAction>
          </MenuGroup>
        </Menu>
      </ResponsiveMenu>
      <MenuDisclosure label="Browse guides">
        <Menu label="Guides" appearance="subtle" size="small">
          <MenuItem
            href="#introduction"
            active
            trailing="03"
            dismissOnSelect={false}
            onClick={(event) => {
              event.preventDefault()
              setActive("Introduction · keep browsing")
            }}
          >
            Introduction
          </MenuItem>
          <MenuItem href="#installation">Installation</MenuItem>
        </Menu>
      </MenuDisclosure>
      <MenuPopover label="On this page">
        <Menu label="Page sections" appearance="subtle" size="small">
          <MenuAction onClick={() => setActive("Introduction")}>
            Introduction
          </MenuAction>
          <MenuAction onClick={() => setActive("Installation")}>
            Installation
          </MenuAction>
        </Menu>
      </MenuPopover>
      <DemoResult>{active}</DemoResult>
    </>
  )
}
