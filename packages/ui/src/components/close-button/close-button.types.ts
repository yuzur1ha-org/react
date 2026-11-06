import type { ComponentPropsWithRef } from "react"

export type CloseButtonProps = ComponentPropsWithRef<"button"> & {
  label: string
}
