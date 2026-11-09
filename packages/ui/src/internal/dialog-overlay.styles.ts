import { css } from "@emotion/react"
import { themed } from "../theme/themed"
export const dialogOverlayStyles = themed(css`
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgb(19 20 21 / 45%);
  &[data-state="open"] {
    animation: yu-fade-in var(--yu-motion-normal) var(--yu-motion-ease) both;
  }
  &[data-state="closed"] {
    animation: yu-fade-out var(--yu-motion-fast) var(--yu-motion-ease) both;
  }
  @keyframes yu-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes yu-fade-out {
    to {
      opacity: 0;
    }
  }
`)
