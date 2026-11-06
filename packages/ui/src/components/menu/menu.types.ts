import type { ComponentSize } from "../../types/size"
import type { ComponentPropsWithRef, ReactNode } from "react"
import type { MenuActiveAppearance } from "./menu-context"

export type MenuProps = ComponentPropsWithRef<"nav"> & {
  label: string
  appearance?: "default" | "subtle"
  activeAppearance?: MenuActiveAppearance
  orientation?: "vertical" | "horizontal"
  size?: ComponentSize
  /** Spacing in pixels between groups, without separator lines. */
  groupGap?: number
}

export type MenuGroupProps = ComponentPropsWithRef<"div"> & { label: string }

export type MenuItemProps = ComponentPropsWithRef<"a"> & {
  href: string
  active?: boolean
  activeAppearance?: MenuActiveAppearance
  disabled?: boolean
  /** Defaults to true, including when onClick prevents navigation. */
  dismissOnSelect?: boolean
  icon?: ReactNode
  trailing?: ReactNode
}

export type MenuActionProps = ComponentPropsWithRef<"button"> & {
  dismissOnSelect?: boolean
}
