import type { CheckboxProps } from "./checkbox.types"
export type { CheckboxProps } from "./checkbox.types"
import { checkboxStyles } from "./checkbox.styles"
import { useId } from "react"
import { Check } from "lucide-react"

export function Checkbox({
  label,
  id: suppliedId,
  className = "",
  ...props
}: CheckboxProps) {
  const generated = useId()
  const id = suppliedId ?? generated
  return (
    <label
      css={checkboxStyles}
      className={`yu-choice ${className}`}
      htmlFor={id}
    >
      <input {...props} type="checkbox" className="yu-choice-input" id={id} />
      <span className="yu-checkbox" aria-hidden="true">
        <Check size={16} aria-hidden="true" />
      </span>
      <span>{label}</span>
    </label>
  )
}
