import type { ComponentPropsWithRef } from "react"
import type * as ToastPrimitive from "@radix-ui/react-toast"

export type ToastDuration = number | false

export type ToastTone = "info" | "success" | "warning" | "error"

type ToastBaseProps = {
  /** Milliseconds until dismissal, or false to stay open; omitted inherits the provider. */
  duration?: ToastDuration
  onExitComplete?: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
  tone: ToastTone
  toneLabel: string
  title: string
  closeLabel: string
}

export type ToastProps = ToastBaseProps &
  (
    | {
        variant?: "rich"
        description?: string
        action?: { label: string; onClick: () => void }
      }
    | { variant: "simple"; description?: never; action?: never }
  )

export type ToastProviderProps = Omit<
  ComponentPropsWithRef<typeof ToastPrimitive.Provider>,
  "duration"
> & {
  /** Default auto-dismiss delay in milliseconds; false disables automatic dismissal. */
  duration?: ToastDuration
  viewportLabel?: string
}
