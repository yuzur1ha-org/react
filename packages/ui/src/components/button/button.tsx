import type { ButtonProps } from "./button.types"
export type { ButtonProps } from "./button.types"
import { buttonStyles } from "./button.styles"

import { LoaderCircle } from "lucide-react"

export function Button({
  appearance = "primary",
  size = "medium",
  loading = false,
  scaleOnPress = true,
  disabled,
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      css={buttonStyles}
      {...props}
      type={type}
      className={`yu-button yu-button--${appearance} ${className}`}
      data-size={size}
      data-scale-on-press={scaleOnPress}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading && (
        <LoaderCircle className="yu-spinner" size={16} aria-hidden="true" />
      )}
      {children}
    </button>
  )
}
