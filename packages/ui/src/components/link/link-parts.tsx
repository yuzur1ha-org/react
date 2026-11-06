import { linkRel } from "../../internal/link-rel"
import { linkContainerStyles, linkUnderlineStyles } from "./link.styles"
import type { LinkContainerProps, LinkUnderlineProps } from "./link.types"

export function LinkContainer({
  size = "medium",
  underline = true,
  className = "",
  target,
  rel,
  children,
  ...props
}: LinkContainerProps) {
  return (
    <a
      {...props}
      target={target}
      rel={linkRel(target, rel)}
      css={linkContainerStyles}
      className={`yu-link-container ${className}`}
      data-size={size}
      data-underline={underline}
    >
      {children}
    </a>
  )
}

export function LinkUnderline({
  size,
  className = "",
  ...props
}: LinkUnderlineProps) {
  return (
    <span
      {...props}
      css={linkUnderlineStyles}
      className={`yu-link-hover-line ${className}`}
      data-size={size}
    />
  )
}
