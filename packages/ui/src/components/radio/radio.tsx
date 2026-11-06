import type { RadioProps } from "./radio.types"
export type { RadioProps } from "./radio.types"
import { radioStyles } from "./radio.styles"
import { useId } from "react"

export function Radio({
  label,
  id: suppliedId,
  className = "",
  ...props
}: RadioProps) {
  const generated = useId()
  const id = suppliedId ?? generated
  return (
    <label css={radioStyles} className={`yu-choice ${className}`} htmlFor={id}>
      <input {...props} type="radio" className="yu-choice-input" id={id} />
      <span className="yu-radio" aria-hidden="true">
        <span />
      </span>
      <span>{label}</span>
    </label>
  )
}
