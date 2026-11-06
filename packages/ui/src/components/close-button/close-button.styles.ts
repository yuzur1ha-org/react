import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { interaction, focus, press } from "../../internal/styles"
export const closeButtonStyles = themed(css`
  ${press};
  ${interaction};
  ${focus};
  flex-shrink: 0;
  width: var(--yu-touch-target);
  height: var(--yu-touch-target);
  display: grid;
  place-items: center;
  border: 0;
  border-radius: var(--yu-radius);
  background: transparent;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: var(--yu-subtle);
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`)
