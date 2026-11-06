import { css, type SerializedStyles, type Theme } from "@emotion/react"
import { tokens, toCSSVariables } from "@yuzur1ha/token"
import type {} from "./provider"

export function themed(styles: SerializedStyles) {
  return (theme: Theme) =>
    css(toCSSVariables(theme.yuzur1ha ?? tokens), base, styles, reducedMotion)
}
const base = css`
  color: var(--yu-ink);
  color-scheme: var(--yu-color-scheme);
  box-sizing: border-box;
  font-family: var(--yu-font);
  & *,
  & *::before,
  & *::after {
    box-sizing: border-box;
  }
`
const reducedMotion = css`
  @media (prefers-reduced-motion: reduce) {
    &,
    & *,
    &::before,
    &::after,
    & *::before,
    & *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto;
    }
  }
`
