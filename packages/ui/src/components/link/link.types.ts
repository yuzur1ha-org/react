import type { ComponentPropsWithRef } from "react"
import type { ComponentSize } from "../../types/size"
export type LinkProps = ComponentPropsWithRef<"a"> & {
  href: string
  size?: ComponentSize
  appearance?: "text" | "primary" | "secondary"
  showIcon?: boolean
  underline?: boolean
}

export type LinkContainerProps = ComponentPropsWithRef<"a"> & {
  underline?: boolean
  href: string
  size?: ComponentSize
}

export type LinkUnderlineProps = ComponentPropsWithRef<"span"> & {
  /** Inherits the container size unless provided. */
  size?: ComponentSize
}
