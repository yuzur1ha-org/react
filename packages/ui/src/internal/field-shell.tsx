import { themed } from "../theme/themed"
import { field, hidden } from "./styles"
const fieldStyles = themed(field)
import type { ReactNode } from "react"
import type { FieldMetadata } from "../types/field"
export function FieldShell({
  id,
  label,
  hint,
  error,
  children,
  hideLabel = false,
}: FieldMetadata & { id: string; children: ReactNode; hideLabel?: boolean }) {
  return (
    <div css={fieldStyles} className="yu-field" data-invalid={!!error}>
      <label htmlFor={id} css={hideLabel ? hidden : undefined}>
        {label}
      </label>
      {children}
      {(error || hint) && (
        <p id={`${id}-hint`} className="yu-hint">
          {error || hint}
        </p>
      )}
    </div>
  )
}
