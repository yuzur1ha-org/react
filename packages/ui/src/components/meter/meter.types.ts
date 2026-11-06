import type { ComponentPropsWithRef } from "react"

export type MeterProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  label: string
  value: number
  min?: number
  max?: number
  valueText?: string
  showValue?: boolean
  tone?: "default" | "danger"
}
