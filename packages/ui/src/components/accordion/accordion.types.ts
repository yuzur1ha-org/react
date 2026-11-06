import type * as Primitive from "@radix-ui/react-accordion"
import type { ComponentPropsWithRef } from "react"

export type AccordionProps = ComponentPropsWithRef<typeof Primitive.Root>

export type AccordionItemProps = ComponentPropsWithRef<typeof Primitive.Item>

export type AccordionTriggerProps = Omit<
  ComponentPropsWithRef<typeof Primitive.Trigger>,
  "asChild"
>

export type AccordionContentProps = Omit<
  ComponentPropsWithRef<typeof Primitive.Content>,
  "asChild"
>
