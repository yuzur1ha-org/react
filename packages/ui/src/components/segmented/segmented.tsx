import type { SegmentedProps } from "./segmented.types"
export type { SegmentedProps } from "./segmented.types"
import { segmentedStyles } from "./segmented.styles"
import { useId } from "react"

export function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: SegmentedProps<T>) {
  const name = useId()
  const selectedIndex = options.findIndex((option) => option.value === value)
  return (
    <fieldset
      css={[
        segmentedStyles,
        {
          "--yu-segment-index": Math.max(0, selectedIndex),
          "--yu-segment-count": Math.max(1, options.length),
          "--yu-segment-opacity": selectedIndex < 0 ? 0 : 1,
        },
      ]}
      className="yu-segmented"
    >
      <legend className="yu-sr-only">{label}</legend>
      <div>
        {options.map((option) => (
          <label key={option.value}>
            <input
              className="yu-sr-only"
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
