import type { OpenStateProps } from "../../types/overlay"
import type * as Dialog from "@radix-ui/react-dialog"
import type { ReactElement, ReactNode, ComponentPropsWithRef } from "react"

export type DrawerProps = Omit<
  ComponentPropsWithRef<typeof Dialog.Content>,
  "title" | "asChild"
> &
  OpenStateProps & {
    trigger: ReactElement
    title: string
    description?: string
    closeLabel: string
    side?: "left" | "right" | "bottom"
    headerActions?: ReactNode
    headerContent?: ReactNode
    bodyClassName?: string
    footer?: ReactNode
  }
