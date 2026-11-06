import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
export const meterStyles = themed(css`
  width: 100%;
  display: grid;
  gap: var(--yu-space-1);
  & .yu-meter-heading {
    display: flex;
    justify-content: space-between;
    gap: var(--yu-space-3);
    font-size: var(--yu-text-small);
  }
  & .yu-meter-value {
    font-variant-numeric: tabular-nums;
  }
  & .yu-meter-track {
    height: 8px;
    overflow: hidden;
    background: var(--yu-border);
  }
  & .yu-meter-indicator {
    display: block;
    width: 100%;
    height: 100%;
    background: var(--yu-ink);
    transform-origin: left;
    transition: transform var(--yu-motion-normal) var(--yu-motion-ease);
  }
  &:dir(rtl) .yu-meter-indicator {
    transform-origin: right;
  }
  &[data-tone="danger"] .yu-meter-indicator {
    background: var(--yu-error);
  }
`)
