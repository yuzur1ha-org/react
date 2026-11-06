import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { interaction, input } from "../../internal/styles"
export const numberFieldStyles = themed(css`
  ${interaction};
  position: relative;
  isolation: isolate;
  display: flex;
  min-width: 0;
  border: 1px solid var(--yu-border);
  background: var(--yu-surface);
  &::after {
    content: "";
    position: absolute;
    inset: -1px;
    border: var(--yu-focus-width) solid transparent;
    pointer-events: none;
    z-index: 1;
    transition: border-color var(--yu-motion-fast) var(--yu-motion-ease);
  }
  &:focus-within::after {
    border-color: var(--yu-focus);
  }
  &[data-invalid="true"] {
    border-color: var(--yu-error);
  }
  &[data-invalid="true"]:focus-within::after {
    border-color: var(--yu-error);
  }
  &[data-disabled="true"] {
    background: var(--yu-subtle);
  }
  & .yu-number-input {
    ${input};
    flex: 1;
    width: 0;
    border: 0;
    background: transparent;
    text-align: center;
    height: calc(var(--yu-input-height) - 2px);
    padding-inline: 8px;
  }
  & .yu-number-input:focus-visible {
    outline: none;
  }
  & .yu-number-step {
    ${interaction};
    border: 0;
    background: transparent;
    color: var(--yu-ink);
    width: var(--yu-touch-target);
    flex-shrink: 0;
    display: grid;
    place-items: center;
    cursor: pointer;
    border-radius: var(--yu-radius);
  }
  & .yu-number-step > svg {
    scale: 1;
    transition: scale var(--yu-motion-fast) var(--yu-motion-ease);
  }
  & .yu-number-step:active:not(:disabled) > svg {
    scale: var(--yu-press-scale);
  }
  @media (prefers-reduced-motion: reduce) {
    & .yu-number-step:active:not(:disabled) > svg {
      scale: 1;
    }
  }
  & .yu-number-step:hover:not(:disabled) {
    background: var(--yu-subtle);
  }
  & .yu-number-step:active:not(:disabled) {
    background: var(--yu-border);
  }
  & .yu-number-step:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`)
