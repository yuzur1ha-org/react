import type { TextareaInputProps, TextareaProps } from "./textarea.types"
export type { TextareaInputProps, TextareaProps } from "./textarea.types"
import { textareaStyles } from "./textarea.styles"
import { useId } from "react"
import { FieldShell } from "../../internal/field-shell"

export function TextareaInput({
  className = "",
  ...props
}: TextareaInputProps) {
  return (
    <textarea
      {...props}
      css={textareaStyles}
      className={`yu-input yu-textarea ${className}`}
    />
  )
}

export function Textarea({
  label,
  hint,
  error,
  id: suppliedId,
  className = "",
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: TextareaProps) {
  const generated = useId()
  const id = suppliedId ?? generated
  return (
    <FieldShell
      {...{ id, label }}
      {...(hint ? { hint } : {})}
      {...(error ? { error } : {})}
    >
      <TextareaInput
        {...props}
        id={id}
        className={className}
        aria-invalid={error ? true : invalid}
        aria-describedby={
          [describedBy, error || hint ? `${id}-hint` : ""]
            .filter(Boolean)
            .join(" ") || undefined
        }
      />
    </FieldShell>
  )
}
