import type { ComponentPropsWithRef } from "react"
export type ChoiceProps = Omit<ComponentPropsWithRef<"input">, "type"> & {
  label: string
}
