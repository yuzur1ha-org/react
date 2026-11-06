import { buttonStyles } from "../button/button.styles"
import { ArrowUpRight } from "lucide-react"
import { linkStyles, linkTextStyles } from "./link.styles"
import { LinkContainer, LinkUnderline } from "./link-parts"
import type { LinkProps } from "./link.types"
function LinkRoot({
  size = "medium",
  appearance = "text",
  showIcon = true,
  underline = true,
  className = "",
  children,
  target,
  rel,
  ...props
}: LinkProps) {
  return (
    <LinkContainer
      {...props}
      target={target}
      {...(rel !== undefined ? { rel } : {})}
      css={[appearance === "text" ? linkTextStyles : buttonStyles, linkStyles]}
      className={`yu-link ${appearance !== "text" ? `yu-button yu-button--${appearance}` : ""} ${className}`}
      size={size}
      data-appearance={appearance}
      underline={underline}
      data-show-icon={showIcon}
      data-scale-on-press={false}
    >
      <LinkUnderline className="yu-link-content">{children}</LinkUnderline>
      {showIcon && (
        <ArrowUpRight
          className="yu-link-icon"
          aria-hidden="true"
          focusable="false"
        />
      )}
    </LinkContainer>
  )
}

export const Link = Object.assign(LinkRoot, {
  Container: LinkContainer,
  Underline: LinkUnderline,
})
