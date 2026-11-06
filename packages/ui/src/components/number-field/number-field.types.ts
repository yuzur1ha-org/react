import type { ComponentPropsWithRef } from "react"
import type { FieldMetadata } from "../../types/field"

export type NumberFieldProps = Omit<
  ComponentPropsWithRef<"input">,
  | "type"
  | "value"
  | "defaultValue"
  | "onChange"
  | "min"
  | "max"
  | "step"
  | "role"
  | "inputMode"
> &
  FieldMetadata & {
    value?: number | null
    defaultValue?: number | null
    onValueChange?: (value: number | null) => void
    min?: number
    max?: number
    step?: number
    incrementLabel: string
    decrementLabel: string
  }
