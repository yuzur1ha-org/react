import type { ComponentPropsWithRef } from "react"

export type AvatarProps = Omit<ComponentPropsWithRef<"span">, "children"> & {
  name: string
  src?: string
  size?: "small" | "large"
}
