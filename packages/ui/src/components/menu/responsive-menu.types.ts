import type { ReactNode } from "react"
import type { DrawerProps } from "../drawer/index"
import type { ButtonProps } from "../button/index"

export type ResponsiveMenuProps = {
  children: ReactNode
  label: string
  triggerLabel: string
  closeLabel: string
  layout?: "responsive" | "inline" | "popover" | "drawer"
  className?: string
  drawerProps?: Pick<
    DrawerProps,
    "headerActions" | "headerContent" | "bodyClassName" | "className"
  >
  triggerIconOnly?: boolean
  triggerAppearance?: ButtonProps["appearance"]
  triggerSize?: ButtonProps["size"]
}
