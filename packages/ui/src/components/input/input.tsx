import type { InputProps } from "./input.types"
export type { InputProps } from "./input.types"

import { inputStyles } from "./input.styles"

export function Input({
  size = "medium",
  htmlSize,
  className = "",
  ...props
}: InputProps) {
  return (
    <input
      {...props}
      size={htmlSize}
      data-size={size}
      css={inputStyles}
      className={`yu-input ${className}`}
    />
  )
}
