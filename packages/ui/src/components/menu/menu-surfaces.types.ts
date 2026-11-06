import type { OpenStateProps } from "../../types/overlay"
import type { ReactNode } from "react"
import type { ButtonProps } from "../button/index"
import type { PopoverProps } from "../popover/index"

export type MenuSurfaceProps = OpenStateProps & {
  label: string
  children: ReactNode
  className?: string
  size?: ButtonProps["size"]
}

export type MenuDisclosureProps = MenuSurfaceProps & {
  contentClassName?: string
}

export type MenuPopoverProps = MenuSurfaceProps & {
  triggerAppearance?: ButtonProps["appearance"]
  onCloseAutoFocus?: PopoverProps["onCloseAutoFocus"]
}
