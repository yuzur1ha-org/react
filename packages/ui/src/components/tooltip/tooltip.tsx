import type { TooltipProps } from "./tooltip.types"
export type { TooltipProps } from "./tooltip.types"
import { tooltipStyles } from "./tooltip.styles"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={250}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            css={tooltipStyles}
            className="yu-tooltip"
            side={side}
            sideOffset={4}
            collisionPadding={12}
          >
            {content}
            <TooltipPrimitive.Arrow
              className="yu-tooltip-arrow"
              width={8}
              height={4}
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
