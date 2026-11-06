import type { ComponentPropsWithRef } from "react"
import type { ComponentSize } from "../../types/size"

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  appearance?: "primary" | "secondary" | "text"
  /** Whether pressing the button scales it. Defaults to true. */
  scaleOnPress?: boolean
  loading?: boolean
  size?: ComponentSize
}
