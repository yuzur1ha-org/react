import type { FieldMetadata } from "../../types/field"
import type { ComponentPropsWithRef } from "react"

export type InputOTPProps = Omit<
  ComponentPropsWithRef<"input">,
  "value" | "onChange" | "type" | "maxLength" | "size"
> &
  FieldMetadata & {
    value: string
    onValueChange: (value: string) => void
  }
