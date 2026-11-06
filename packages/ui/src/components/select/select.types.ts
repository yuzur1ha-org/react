import type { ComponentPropsWithRef } from "react"
import type * as SelectPrimitive from "@radix-ui/react-select"
import type { FieldMetadata } from "../../types/field"
import type { ComponentSize } from "../../types/size"

export type SelectOption = { value: string; label: string; disabled?: boolean }

export type SelectProps = Omit<
  ComponentPropsWithRef<typeof SelectPrimitive.Trigger>,
  "children" | "defaultValue" | "value" | "asChild"
> &
  FieldMetadata & {
    options: readonly SelectOption[]
    font?: "body" | "mono"
    size?: ComponentSize
    appearance?: "field" | "text"
    hideLabel?: boolean
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    name?: string
    form?: string
    required?: boolean
  }
