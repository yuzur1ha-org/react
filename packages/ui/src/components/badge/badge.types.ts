import type { ComponentPropsWithRef, ReactNode } from "react"

export type BadgeProps = Omit<
  ComponentPropsWithRef<"span">,
  "children" | "content"
> & {
  children: ReactNode
  label: string
  variant?: "count" | "dot" | "label"
  count?: number
  max?: number
  content?: string
  showZero?: boolean
  invisible?: boolean
  position?: "top-end" | "top-start" | "bottom-end" | "bottom-start"
  tone?: "default" | "danger"
}
