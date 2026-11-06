import type { OpenStateProps } from "../../types/overlay"
import type * as Primitive from "@radix-ui/react-popover"
import type { ComponentPropsWithRef, ReactElement } from "react"

export type PopoverProps = Omit<
  ComponentPropsWithRef<typeof Primitive.Content>,
  "asChild"
> &
  OpenStateProps & {
    trigger: ReactElement
    label: string
    modal?: boolean
    showArrow?: boolean
  }
