import type { MeterProps } from "./meter.types"
export type { MeterProps } from "./meter.types"
import { useId } from "react"
import { meterStyles } from "./meter.styles"

export function Meter({
  label,
  value,
  min = 0,
  max = 100,
  valueText,
  showValue = true,
  tone = "default",
  className = "",
  ...props
}: MeterProps) {
  const id = useId()
  if (![value, min, max].every(Number.isFinite) || max <= min)
    throw new RangeError("Meter requires finite values and min < max")
  const bounded = Math.min(max, Math.max(min, value))
  const fraction = (bounded - min) / (max - min)
  return (
    <div
      {...props}
      css={meterStyles}
      className={`yu-meter ${className}`}
      data-tone={tone}
    >
      <div className="yu-meter-heading">
        <span id={id}>{label}</span>
        {showValue && (
          <span className="yu-meter-value" aria-hidden="true">
            {valueText ?? `${Math.round(fraction * 100)}%`}
          </span>
        )}
      </div>
      <div
        className="yu-meter-track"
        role="meter"
        aria-labelledby={id}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={bounded}
        aria-valuetext={valueText}
      >
        <span
          className="yu-meter-indicator"
          style={{ transform: `scaleX(${fraction})` }}
        />
      </div>
    </div>
  )
}
