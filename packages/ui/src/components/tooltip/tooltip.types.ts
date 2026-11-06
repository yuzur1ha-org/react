import type { ReactElement } from "react"

export type TooltipProps = {
  content: string
  children: ReactElement
  side?: "top" | "right" | "bottom" | "left"
}
