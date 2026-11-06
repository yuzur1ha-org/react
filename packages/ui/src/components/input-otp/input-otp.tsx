import type { InputOTPProps } from "./input-otp.types"
export type { InputOTPProps } from "./input-otp.types"
import { otpStyles } from "./input-otp.styles"
import { useId, useState } from "react"

export function InputOTP({
  label,
  hint,
  error,
  value,
  onValueChange,
  id: suppliedId,
  className = "",
  onFocus,
  onBlur,
  onPaste,
  onSelect,
  "aria-describedby": describedBy,
  ...props
}: InputOTPProps) {
  const generated = useId()
  const id = suppliedId ?? generated
  const [position, setPosition] = useState(0)
  const [focused, setFocused] = useState(false)
  return (
    <div
      css={otpStyles}
      className={`yu-field yu-otp ${className}`}
      data-invalid={!!error}
      data-disabled={!!props.disabled}
    >
      <label htmlFor={id}>{label}</label>
      <div className="yu-otp-control">
        <input
          {...props}
          id={id}
          value={value}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          aria-invalid={!!error}
          aria-describedby={
            [describedBy, hint || error ? `${id}-hint` : ""]
              .filter(Boolean)
              .join(" ") || undefined
          }
          onChange={(event) => {
            const next = event.target.value.replace(/\D/gu, "").slice(0, 6)
            onValueChange(next)
            setPosition(Math.min(event.target.selectionStart ?? next.length, 5))
          }}
          onFocus={(event) => {
            setFocused(true)
            onFocus?.(event)
          }}
          onBlur={(event) => {
            setFocused(false)
            onBlur?.(event)
          }}
          onSelect={(event) => {
            onSelect?.(event)
            setPosition(
              Math.min(event.currentTarget.selectionStart ?? value.length, 5),
            )
          }}
          onPaste={(event) => {
            onPaste?.(event)
            if (event.defaultPrevented || props.readOnly || props.disabled)
              return
            event.preventDefault()
            const next = event.clipboardData
              .getData("text")
              .replace(/\D/gu, "")
              .slice(0, 6)
            onValueChange(next)
            setPosition(Math.min(next.length, 5))
            event.currentTarget.setSelectionRange(next.length, next.length)
          }}
        />
        <div className="yu-otp-slots" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <span key={index} data-active={focused && position === index}>
              {value[index] ?? ""}
              {focused && index === position && !value[index] && <i />}
            </span>
          ))}
        </div>
      </div>
      {(hint || error) && (
        <p id={`${id}-hint`} className="yu-hint">
          {error || hint}
        </p>
      )}
    </div>
  )
}
