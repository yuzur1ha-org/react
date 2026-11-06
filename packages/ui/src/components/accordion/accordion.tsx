import type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from "./accordion.types"
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from "./accordion.types"
import * as Primitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { accordionStyles } from "./accordion.styles"

export function Accordion({ className = "", ...props }: AccordionProps) {
  return (
    <Primitive.Root
      {...props}
      css={accordionStyles}
      className={`yu-accordion ${className}`}
    />
  )
}

export function AccordionItem({
  className = "",
  ...props
}: AccordionItemProps) {
  return (
    <Primitive.Item {...props} className={`yu-accordion-item ${className}`} />
  )
}

export function AccordionTrigger({
  children,
  className = "",
  ...props
}: AccordionTriggerProps) {
  return (
    <Primitive.Header className="yu-accordion-header">
      <Primitive.Trigger
        {...props}
        className={`yu-accordion-trigger ${className}`}
      >
        <span>{children}</span>
        <ChevronDown
          className="yu-accordion-chevron"
          size={16}
          aria-hidden="true"
        />
      </Primitive.Trigger>
    </Primitive.Header>
  )
}

export function AccordionContent({
  children,
  className = "",
  ...props
}: AccordionContentProps) {
  return (
    <Primitive.Content
      {...props}
      className={`yu-accordion-content ${className}`}
    >
      <div className="yu-accordion-body">{children}</div>
    </Primitive.Content>
  )
}
