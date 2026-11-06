import type { NumberFieldProps } from "./number-field.types"
export type { NumberFieldProps } from "./number-field.types"
import { numberFieldStyles } from "./number-field.styles"
import { useId, useRef, useState } from "react"
import { Minus, Plus } from "lucide-react"
import { FieldShell } from "../../internal/field-shell"
import { formatNumber, parseNumber, resolveNumber } from "./number-math"

export function NumberField({
  label,
  hint,
  error,
  value,
  defaultValue = null,
  onValueChange,
  min,
  max,
  step = 1,
  incrementLabel,
  decrementLabel,
  disabled,
  readOnly,
  id: suppliedId,
  className = "",
  onFocus,
  onBlur,
  onKeyDown,
  "aria-describedby": describedBy,
  ...props
}: NumberFieldProps) {
  if (
    !Number.isFinite(step) ||
    step <= 0 ||
    (min !== undefined && !Number.isFinite(min)) ||
    (max !== undefined && !Number.isFinite(max)) ||
    (min !== undefined && max !== undefined && min > max) ||
    (value !== undefined && value !== null && !Number.isFinite(value)) ||
    (defaultValue !== null && !Number.isFinite(defaultValue))
  )
    throw new RangeError(
      "NumberField requires finite values, a positive step and min <= max",
    )
  const generated = useId()
  const id = suppliedId ?? generated
  const container = useRef<HTMLDivElement>(null)
  const [internal, setInternal] = useState(defaultValue)
  const current = value === undefined ? internal : value
  const [draft, setDraft] = useState<{
    text: string
    basedOn: number | null
  } | null>(null)
  const text =
    draft && draft.basedOn === current ? draft.text : formatNumber(current)
  const parsed = parseNumber(text)
  const range = {
    step,
    ...(min !== undefined ? { min } : {}),
    ...(max !== undefined ? { max } : {}),
  }
  const invalid =
    !!error ||
    (parsed !== null &&
      ((min !== undefined && parsed < min) ||
        (max !== undefined && parsed > max)))
  function publish(next: number | null) {
    if (value === undefined) setInternal(next)
    if (next !== current) onValueChange?.(next)
  }
  function change(direction: -1 | 1) {
    if (disabled || readOnly) return
    const next = resolveNumber(parsed ?? current, range, direction)
    publish(next)
    setDraft(null)
    container.current?.querySelector("input")?.focus()
  }
  function commit() {
    if (disabled || readOnly) {
      setDraft(null)
      return
    }
    const next = text === "" ? null : resolveNumber(parsed ?? current, range)
    publish(next)
    setDraft(null)
  }
  return (
    <FieldShell
      {...{ id, label }}
      {...(hint ? { hint } : {})}
      {...(error ? { error } : {})}
    >
      <div
        css={numberFieldStyles}
        ref={container}
        className="yu-number-control"
        data-invalid={invalid}
        data-disabled={!!disabled}
      >
        <button
          type="button"
          className="yu-number-step"
          aria-label={decrementLabel}
          tabIndex={-1}
          disabled={
            disabled ||
            readOnly ||
            (parsed !== null && resolveNumber(parsed, range, -1) === parsed)
          }
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => change(-1)}
        >
          <Minus size={16} aria-hidden="true" />
        </button>
        <input
          {...props}
          id={id}
          type="text"
          role="spinbutton"
          inputMode="decimal"
          className={`yu-input yu-number-input ${className}`}
          value={text}
          disabled={disabled}
          readOnly={readOnly}
          aria-valuenow={parsed ?? undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-invalid={invalid}
          aria-describedby={
            [describedBy, error || hint ? `${id}-hint` : ""]
              .filter(Boolean)
              .join(" ") || undefined
          }
          onChange={(event) => {
            const nextText = event.target.value
            if (!/^[+-]?\d*\.?\d*$/u.test(nextText)) return
            const next = parseNumber(nextText)
            if (nextText === "" || next !== null) publish(next)
            setDraft({
              text: nextText,
              basedOn: nextText === "" ? null : (next ?? current),
            })
          }}
          onFocus={(event) => {
            setDraft({ text, basedOn: current })
            onFocus?.(event)
          }}
          onBlur={(event) => {
            commit()
            onBlur?.(event)
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event)
            if (
              event.defaultPrevented ||
              event.nativeEvent.isComposing ||
              disabled ||
              readOnly ||
              event.altKey ||
              event.ctrlKey ||
              event.metaKey ||
              event.shiftKey
            )
              return
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
              event.preventDefault()
              change(event.key === "ArrowUp" ? 1 : -1)
            } else if (event.key === "Home" && min !== undefined) {
              event.preventDefault()
              publish(min)
              setDraft(null)
            } else if (event.key === "End" && max !== undefined) {
              event.preventDefault()
              publish(resolveNumber(max, range))
              setDraft(null)
            } else if (event.key === "Enter") commit()
          }}
        />
        <button
          type="button"
          className="yu-number-step"
          aria-label={incrementLabel}
          tabIndex={-1}
          disabled={
            disabled ||
            readOnly ||
            (parsed !== null && resolveNumber(parsed, range, 1) === parsed)
          }
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => change(1)}
        >
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </FieldShell>
  )
}
