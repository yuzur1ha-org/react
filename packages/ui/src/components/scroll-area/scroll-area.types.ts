import type * as Primitive from "@radix-ui/react-scroll-area"
import type { ComponentPropsWithRef, CSSProperties } from "react"

export type ScrollAreaProps = Omit<
  ComponentPropsWithRef<typeof Primitive.Root>,
  "asChild"
> & {
  /** Adds a class to an optional content wrapper inside the viewport. */
  contentClassName?: string
  label: string
  /** Defaults to contrast to preserve the existing scrollbar treatment. */
  appearance?: "normal" | "contrast" | "hidden"
  /** Native chaining on enabled axes; defaults to auto. Disabled axes stay auto. */
  overscrollBehavior?: CSSProperties["overscrollBehavior"]
  orientation?: "vertical" | "horizontal" | "both"
  viewportProps?: Omit<
    ComponentPropsWithRef<typeof Primitive.Viewport>,
    "asChild" | "children" | "dangerouslySetInnerHTML"
  >
}
