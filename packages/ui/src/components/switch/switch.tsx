import type { SwitchProps } from "./switch.types"
export type { SwitchProps } from "./switch.types"
import { switchStyles } from "./switch.styles"
import { useId } from "react"

import { hidden } from "../../internal/styles"

export function Switch({
  label,
  size = "medium",
  hideLabel = false,
  checkedIcon,
  uncheckedIcon,
  id: suppliedId,
  className = "",
  ...props
}: SwitchProps) {
  const generated = useId()
  const id = suppliedId ?? generated
  return (
    <label
      css={switchStyles}
      className={`yu-choice ${className}`}
      htmlFor={id}
      data-size={size}
    >
      <input
        {...props}
        type="checkbox"
        role="switch"
        className="yu-choice-input"
        id={id}
      />
      <span className="yu-switch" aria-hidden="true">
        <span className="yu-switch-thumb">
          {uncheckedIcon && (
            <span className="yu-switch-off-icon">{uncheckedIcon}</span>
          )}
          {checkedIcon && (
            <span className="yu-switch-on-icon">{checkedIcon}</span>
          )}
        </span>
      </span>
      <span css={hideLabel ? hidden : undefined}>{label}</span>
    </label>
  )
}
