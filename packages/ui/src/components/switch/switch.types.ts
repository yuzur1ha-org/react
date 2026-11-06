import type { ReactNode } from "react"
import type { ChoiceProps } from "../../types/choice"
import type { ComponentSize } from "../../types/size"

export type SwitchProps = Omit<ChoiceProps, "size"> & {
  size?: ComponentSize
  hideLabel?: boolean
  checkedIcon?: ReactNode
  uncheckedIcon?: ReactNode
}
