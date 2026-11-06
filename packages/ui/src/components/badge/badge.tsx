import type { BadgeProps } from "./badge.types"
export type { BadgeProps } from "./badge.types"

import { badgeStyles } from "./badge.styles"

export function Badge({
  children,
  label,
  variant = "count",
  count = 0,
  max = 99,
  content,
  showZero = false,
  invisible = false,
  position = "top-end",
  tone = "default",
  className = "",
  ...props
}: BadgeProps) {
  if (
    !Number.isInteger(count) ||
    count < 0 ||
    !Number.isInteger(max) ||
    max < 1
  )
    throw new RangeError(
      "Badge count must be a non-negative integer and max a positive integer",
    )
  const visible = !invisible && (variant !== "count" || count > 0 || showZero)
  const display =
    variant === "dot"
      ? null
      : variant === "label"
        ? (content ?? label)
        : count > max
          ? `${max}+`
          : count
  return (
    <span
      {...props}
      css={badgeStyles}
      className={`yu-badge ${className}`}
      data-position={position}
      data-tone={tone}
    >
      {children}
      {visible && (
        <span
          key={`${variant}-${display}`}
          className="yu-badge-indicator"
          data-variant={variant}
          role="img"
          aria-label={label}
        >
          {display}
        </span>
      )}
    </span>
  )
}
