import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { interaction, focus, hidden } from "../../internal/styles"
export const segmentedStyles = themed(css`
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
  & .yu-sr-only {
    ${hidden};
  }
  & > div {
    display: flex;
    position: relative;
    background: var(--yu-surface);
  }
  & > div::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: calc(100% / var(--yu-segment-count));
    background: var(--yu-ink);
    opacity: var(--yu-segment-opacity);
    transform: translateX(calc(100% * var(--yu-segment-index)));
    transition:
      transform var(--yu-motion-normal) var(--yu-motion-ease),
      width var(--yu-motion-normal) var(--yu-motion-ease),
      opacity var(--yu-motion-fast) var(--yu-motion-ease);
  }
  & label {
    flex: 1;
    position: relative;
    min-width: 0;
    cursor: pointer;
  }
  & label > span {
    ${interaction};
    ${focus};
    min-height: var(--yu-action-height);
    display: grid;
    place-items: center;
    border: 1px solid var(--yu-border);
    background: transparent;
    padding: 12px;
    font-size: var(--yu-text-small);
  }
  & input:checked + span {
    color: var(--yu-paper);
  }
  & input:focus-visible + span {
    outline-color: var(--yu-focus);
    position: relative;
    z-index: 1;
  }
`)
