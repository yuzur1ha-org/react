import type { PopoverProps } from "./popover.types"
export type { PopoverProps } from "./popover.types"
import * as Primitive from "@radix-ui/react-popover"

import { popoverStyles } from "./popover.styles"

export function Popover({
  trigger,
  label,
  open,
  defaultOpen,
  onOpenChange,
  modal = false,
  showArrow = true,
  children,
  className = "",
  side = "bottom",
  align = "start",
  sideOffset = 8,
  collisionPadding = 12,
  ...props
}: PopoverProps) {
  return (
    <Primitive.Root {...{ open, defaultOpen, onOpenChange, modal }}>
      <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
      <Primitive.Portal>
        <Primitive.Content
          {...props}
          {...{ side, align, sideOffset, collisionPadding }}
          css={popoverStyles}
          className={`yu-popover ${className}`}
          aria-label={label}
        >
          {children}
          {showArrow && (
            <Primitive.Arrow
              className="yu-popover-arrow"
              width={10}
              height={5}
            />
          )}
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  )
}
export const PopoverClose = Primitive.Close
