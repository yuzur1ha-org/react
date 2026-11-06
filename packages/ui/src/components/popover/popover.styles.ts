import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { pop, focus } from "../../internal/styles"
export const popoverStyles = themed(css`
  ${pop};
  ${focus};
  width: min(320px, calc(100vw - 24px));
  max-height: var(--radix-popover-content-available-height);
  overflow-y: auto;
  padding: var(--yu-space-4);
  background: var(--yu-surface);
  color: var(--yu-ink);
  border: 1px solid var(--yu-border);
  box-shadow: 0 8px 24px rgb(19 20 21 / 8%);
  z-index: 60;
  transform-origin: var(--radix-popover-content-transform-origin);
  display: flex;
  flex-direction: column;
  gap: var(--yu-space-3);
  font-size: var(--yu-text-small);
  & :where(h2, p) {
    margin: 0;
  }
  & h2 {
    font-size: var(--yu-text-body);
    font-weight: 500;
  }
  & p {
    color: var(--yu-secondary);
    line-height: 1.6;
  }
  & .yu-popover-arrow {
    fill: var(--yu-surface);
  }
`)
