import type { TextFieldProps } from "./text-field.types"
export type { TextFieldProps } from "./text-field.types"
import { Input } from "../input/index"
import { useId } from "react"
import { FieldShell } from "../../internal/field-shell"

export function TextField({
  label,
  hint,
  error,
  id: suppliedId,
  className = "",
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: TextFieldProps) {
  const generated = useId()
  const id = suppliedId ?? generated
  return (
    <FieldShell
      {...{ id, label }}
      {...(hint ? { hint } : {})}
      {...(error ? { error } : {})}
    >
      <Input
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
