import { useCallback, useRef } from "react"
import { useScrollWheel } from "./use-scroll-wheel"
import type { ScrollAreaProps } from "./scroll-area.types"
export type { ScrollAreaProps } from "./scroll-area.types"
import * as Primitive from "@radix-ui/react-scroll-area"

import { scrollAreaStyles } from "./scroll-area.styles"

const overscrollPolicies = [
  "auto",
  "contain",
  "none",
  "inherit",
  "initial",
  "revert",
  "revert-layer",
  "unset",
] as const

export function ScrollArea({
  label,
  contentClassName,
  appearance = "contrast",
  orientation = "vertical",
  overscrollBehavior = "auto",
  children,
  className = "",
  viewportProps,
  onWheelCapture,
  type = "auto",
  ...props
}: ScrollAreaProps) {
  const viewport = useRef<HTMLDivElement>(null)
  const consumerRef = viewportProps?.ref
  const setViewport = useCallback(
    (node: HTMLDivElement | null) => {
      viewport.current = node
      const cleanup =
        typeof consumerRef === "function" ? consumerRef(node) : undefined
      if (consumerRef && typeof consumerRef !== "function")
        consumerRef.current = node
      return () => {
        viewport.current = null
        if (typeof cleanup === "function") cleanup()
        else if (typeof consumerRef === "function") consumerRef(null)
        else if (consumerRef) consumerRef.current = null
      }
    },
    [consumerRef],
  )
  const captureWheel = useScrollWheel(viewport, orientation)
  const [policyX, policyY = policyX] = overscrollBehavior.trim().split(/\s+/)
  const overscrollX = overscrollPolicies.find((value) => value === policyX)
  const overscrollY = overscrollPolicies.find((value) => value === policyY)
  return (
    <Primitive.Root
      {...props}
      onWheelCapture={(event) => {
        captureWheel(event)
        onWheelCapture?.(event)
      }}
      type={type}
      data-appearance={appearance}
      css={scrollAreaStyles}
      className={`yu-scroll-area ${className}`}
    >
      <Primitive.Viewport
        role="region"
        aria-label={label}
        tabIndex={0}
        {...viewportProps}
        ref={setViewport}
        style={{
          overscrollBehaviorX:
            orientation === "vertical" ? "auto" : overscrollX,
          overscrollBehaviorY:
            orientation === "horizontal" ? "auto" : overscrollY,
          ...viewportProps?.style,
        }}
        className={`yu-scroll-viewport ${viewportProps?.className ?? ""}`}
      >
        {contentClassName ? (
          <div className={contentClassName}>{children}</div>
        ) : (
          children
        )}
      </Primitive.Viewport>
      {orientation !== "horizontal" && (
        <Primitive.Scrollbar orientation="vertical" className="yu-scrollbar">
          <Primitive.Thumb className="yu-scroll-thumb" />
        </Primitive.Scrollbar>
      )}
      {orientation !== "vertical" && (
        <Primitive.Scrollbar orientation="horizontal" className="yu-scrollbar">
          <Primitive.Thumb className="yu-scroll-thumb" />
        </Primitive.Scrollbar>
      )}
      <Primitive.Corner className="yu-scroll-corner" />
    </Primitive.Root>
  )
}
