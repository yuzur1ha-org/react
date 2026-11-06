import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { choice } from "../../internal/styles"
export const checkboxStyles = themed(css`
  ${choice};
  & .yu-checkbox {
    width: 20px;
    height: 20px;
    border: 1px solid var(--yu-ink);
    background: var(--yu-surface);
    display: grid;
    place-items: center;
  }
  & .yu-checkbox svg {
    color: var(--yu-paper);
    opacity: 0;
    transform: scale(0.65);
    transition:
      opacity var(--yu-motion-fast) var(--yu-motion-ease),
      transform var(--yu-motion-normal) var(--yu-motion-ease);
  }
  & input:checked + .yu-checkbox {
    background: var(--yu-ink);
  }
  & input:checked + .yu-checkbox svg {
    opacity: 1;
    transform: scale(1);
  }
`)
