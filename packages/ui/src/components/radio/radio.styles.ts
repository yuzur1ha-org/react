import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { choice } from "../../internal/styles"
export const radioStyles = themed(css`
  ${choice};
  & .yu-radio {
    width: 20px;
    height: 20px;
    border: 1px solid var(--yu-ink);
    border-radius: 50%;
    background: var(--yu-surface);
    display: grid;
    place-items: center;
  }
  & .yu-radio > span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--yu-paper);
    opacity: 0;
    transform: scale(0.5);
    transition:
      opacity var(--yu-motion-fast) var(--yu-motion-ease),
      transform var(--yu-motion-normal) var(--yu-motion-ease);
  }
  & input:checked + .yu-radio {
    background: var(--yu-ink);
  }
  & input:checked + .yu-radio > span {
    opacity: 1;
    transform: scale(1);
  }
`)
