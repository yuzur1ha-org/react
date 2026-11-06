import type { ResponsiveMenuProps } from "./responsive-menu.types"
export type { ResponsiveMenuProps } from "./responsive-menu.types"
import { useState } from "react"
import { Menu as MenuIcon } from "lucide-react"
import { useViewportLayout } from "../../hooks/use-viewport"
import { Button } from "../button/index"
import { Drawer } from "../drawer/index"
import { Popover } from "../popover/index"
import { DismissMenu } from "./menu-context"

export function ResponsiveMenu({
  layout = "responsive",
  ...props
}: ResponsiveMenuProps) {
  const viewport = useViewportLayout()
  const presentation =
    layout === "responsive"
      ? viewport === "desktop"
        ? "inline"
        : viewport === "tablet"
          ? "popover"
          : "drawer"
      : layout
  return <MenuSurface key={presentation} {...props} layout={presentation} />
}
function MenuSurface({
  label,
  triggerLabel,
  triggerAppearance = "secondary",
  triggerSize = "medium",
  triggerIconOnly = false,
  closeLabel,
  children,
  layout,
  className = "",
  drawerProps,
}: Omit<ResponsiveMenuProps, "layout"> & {
  layout: "inline" | "popover" | "drawer"
}) {
  const [open, setOpen] = useState(false)
  const content = (
    <DismissMenu.Provider value={() => setOpen(false)}>
      {children}
    </DismissMenu.Provider>
  )
  const trigger = (
    <Button
      appearance={triggerAppearance}
      size={triggerSize}
      aria-label={triggerIconOnly ? triggerLabel : undefined}
    >
      <MenuIcon size={16} aria-hidden="true" />
      {!triggerIconOnly && triggerLabel}
    </Button>
  )
  return (
    <div className={`yu-responsive-menu ${className}`} data-layout={layout}>
      {layout === "inline" ? (
        content
      ) : layout === "popover" ? (
        <Popover
          {...{ trigger, open, onOpenChange: setOpen, label }}
          showArrow={false}
          className="yu-menu-popover"
        >
          {content}
        </Popover>
      ) : (
        <Drawer
          {...drawerProps}
          {...{
            trigger,
            open,
            onOpenChange: setOpen,
            title: label,
            closeLabel,
          }}
          side="left"
        >
          {content}
        </Drawer>
      )}
    </div>
  )
}
