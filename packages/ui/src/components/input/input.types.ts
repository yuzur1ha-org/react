import type { ComponentPropsWithRef } from "react"
import type { ComponentSize } from "../../types/size"

export type InputProps = Omit<ComponentPropsWithRef<"input">, "size"> & {
  size?: ComponentSize
  htmlSize?: number
}
