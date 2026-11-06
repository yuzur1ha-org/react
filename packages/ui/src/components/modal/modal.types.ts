import type { OpenStateProps } from "../../types/overlay"
import type { ReactElement, ReactNode } from "react"

export type ModalProps = OpenStateProps & {
  trigger: ReactElement
  title: string
  description: string
  children: ReactNode
  closeLabel: string
  className?: string
}
