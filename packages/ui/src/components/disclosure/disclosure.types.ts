import type * as Primitive from "@radix-ui/react-collapsible"
import type { ComponentPropsWithRef } from "react"

export type DisclosureProps = ComponentPropsWithRef<typeof Primitive.Root>

export type DisclosureTriggerProps = Omit<
  ComponentPropsWithRef<typeof Primitive.Trigger>,
  "asChild" | "id"
> & { headingLevel?: 2 | 3 | 4 | 5 | 6 }

export type DisclosureContentProps = Omit<
  ComponentPropsWithRef<typeof Primitive.Content>,
  "asChild"
>
