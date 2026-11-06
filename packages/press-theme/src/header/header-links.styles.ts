import { css } from "@emotion/react"

export const headerTextLinkStyles = css`
  flex-shrink: 0;
  min-height: 44px;
  padding: 12px 4px;
  outline-offset: -2px;
`
export const headerIconLinkStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  padding: 0;
  line-height: 0;
  color: var(--yu-ink);
  background: transparent;
  outline: 2px solid transparent;
  outline-offset: -2px;
  transition: background-color var(--yu-motion-fast) var(--yu-motion-ease);
  &:hover {
    background: var(--yu-subtle);
  }
  &:focus-visible {
    outline-color: var(--yu-focus);
  }
  svg {
    display: block;
    flex: none;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
