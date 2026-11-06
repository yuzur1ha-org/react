import type { ComponentPropsWithRef } from "react"
import type { FieldMetadata } from "../../types/field"

export type TextareaInputProps = ComponentPropsWithRef<"textarea">

export type TextareaProps = ComponentPropsWithRef<"textarea"> & FieldMetadata
