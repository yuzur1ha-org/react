export type SegmentedProps<T extends string> = {
  label: string
  value: T
  onChange: (value: T) => void
  options: readonly { value: T; label: string }[]
}
