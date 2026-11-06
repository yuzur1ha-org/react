import type { ToastProps, ToastProviderProps } from "./toast.types"
export type {
  ToastDuration,
  ToastTone,
  ToastProps,
  ToastProviderProps,
} from "./toast.types"
import { useCallback, useLayoutEffect, useRef } from "react"
import { toastStyles, toastViewportStyles } from "./toast.styles"
import * as ToastPrimitive from "@radix-ui/react-toast"
import { Check, Info, TriangleAlert, CircleX } from "lucide-react"
import { CloseButton } from "../close-button/index"

const toneIcons = {
  info: Info,
  success: Check,
  warning: TriangleAlert,
  error: CircleX,
}
export function Toast({
  duration,
  onExitComplete,
  open,
  onOpenChange,
  tone,
  toneLabel,
  title,
  description,
  closeLabel,
  action,
  variant = "rich",
}: ToastProps) {
  const exitCallback = useRef(onExitComplete)
  useLayoutEffect(() => {
    exitCallback.current = onExitComplete
  })
  const rootRef = useCallback((node: HTMLLIElement | null) => {
    if (!node) return
    // Radix unmounts after exit; ignore StrictMode cleanup while still open.
    return () => {
      if (node.dataset.state === "closed") exitCallback.current?.()
    }
  }, [])
  const Icon = toneIcons[tone]
  const close = (
    <ToastPrimitive.Close asChild>
      <CloseButton label={closeLabel} />
    </ToastPrimitive.Close>
  )
  return (
    <ToastPrimitive.Root
      ref={rootRef}
      duration={duration === false ? Infinity : duration}
      css={toastStyles}
      className="yu-toast"
      data-tone={tone}
      data-variant={variant}
      open={open}
      onOpenChange={onOpenChange}
      type={tone === "error" ? "foreground" : "background"}
    >
      {variant === "rich" && (
        <div className="yu-toast-heading">
          <span>{toneLabel}</span>
          {close}
        </div>
      )}
      {variant === "simple" && (
        <Icon className="yu-toast-icon" size={16} aria-hidden="true" />
      )}
      <ToastPrimitive.Title className="yu-toast-title">
        {variant === "simple" && (
          <span className="yu-sr-only">{toneLabel}: </span>
        )}
        {title}
      </ToastPrimitive.Title>
      {variant === "rich" && description && (
        <ToastPrimitive.Description className="yu-toast-description">
          {description}
        </ToastPrimitive.Description>
      )}
      {variant === "rich" && action && (
        <ToastPrimitive.Action asChild altText={action.label}>
          <button type="button" className="yu-link" onClick={action.onClick}>
            {action.label}
          </button>
        </ToastPrimitive.Action>
      )}
      {variant === "simple" && close}
    </ToastPrimitive.Root>
  )
}

export function ToastProvider({
  children,
  duration = 5000,
  swipeDirection = "right",
  viewportLabel,
  ...props
}: ToastProviderProps) {
  return (
    <ToastPrimitive.Provider
      {...props}
      duration={duration === false ? Infinity : duration}
      swipeDirection={swipeDirection}
    >
      {children}
      <ToastPrimitive.Viewport
        css={toastViewportStyles}
        className="yu-toast-viewport"
        label={viewportLabel}
      />
    </ToastPrimitive.Provider>
  )
}
export { Toast as ToastItem }
