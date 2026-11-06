import type { ComponentPropsWithRef, ReactNode } from "react"

export type SettingRowProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  label: string
  value: ReactNode
  action?: ReactNode
}
