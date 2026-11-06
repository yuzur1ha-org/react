import type { CloseButtonProps } from "./close-button.types"
export type { CloseButtonProps } from "./close-button.types"
import { closeButtonStyles } from "./close-button.styles"

import { X } from "lucide-react"

export function CloseButton({
  label,
  className = "",
  ...props
}: CloseButtonProps) {
  return (
    <button
      css={closeButtonStyles}
      {...props}
      type="button"
      className={`yu-icon-button ${className}`}
      aria-label={label}
    >
      <X size={16} aria-hidden="true" />
    </button>
  )
}
