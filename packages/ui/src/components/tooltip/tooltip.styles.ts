import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { pop } from "../../internal/styles"
export const tooltipStyles = themed(css`
  ${pop};
  max-width: min(280px, calc(100vw - 24px));
  background: var(--yu-ink);
  color: var(--yu-paper);
  padding: 12px;
  font-size: var(--yu-text-small);
  z-index: 60;
  position: relative;
  transform-origin: var(--radix-tooltip-content-transform-origin);
  & .yu-tooltip-arrow {
    fill: var(--yu-ink);
  }
`)
