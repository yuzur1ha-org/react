import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { interaction, input, pop } from "../../internal/styles"
export const selectStyles = themed(css`
  ${input};
  line-height: 1.5;
  &[data-font="mono"] {
    font-family: var(--yu-mono);
  }
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  cursor: pointer;
  & > span:first-of-type {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  & .yu-select-chevron {
    flex-shrink: 0;
    transition: transform var(--yu-motion-normal) var(--yu-motion-ease);
  }
  &[data-state="open"] {
    outline-color: var(--yu-focus);
  }
  &[data-appearance="text"] {
    background: transparent;
    color: var(--yu-ink);
    border-color: transparent;
    box-shadow: none;
  }
  &[data-appearance="text"][data-state="open"],
  &[data-appearance="text"]:focus-visible {
    outline-color: transparent;
  }
  &[data-appearance="text"]:focus-visible > span:first-of-type {
    text-decoration: underline;
    text-underline-offset: 0.3em;
  }
  &[data-appearance="text"][aria-invalid="true"] {
    color: var(--yu-error);
  }
  &[data-state="open"] .yu-select-chevron {
    transform: rotate(180deg);
  }
`)
export const selectContentStyles = themed(css`
  ${pop};
  &[data-font="mono"] {
    font-family: var(--yu-mono);
  }
  min-width: var(--radix-select-trigger-width);
  max-width: calc(100vw - 24px);
  max-height: min(320px, var(--radix-select-content-available-height));
  overflow: hidden;
  background: var(--yu-surface);
  color: var(--yu-ink);
  border: 1px solid var(--yu-border);
  box-shadow: 0 8px 24px rgb(19 20 21 / 8%);
  z-index: 60;
  transform-origin: var(--radix-select-content-transform-origin);
  & .yu-select-option {
    ${interaction};
    outline: var(--yu-focus-width) solid transparent;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: var(--yu-touch-target);
    gap: 16px;
    padding: 12px 16px;
    font-size: var(--yu-text-small);
    line-height: 1.5;
    cursor: pointer;
    outline-offset: -2px;
    user-select: none;
  }
  &[data-size="small"] .yu-select-option {
    min-height: 40px;
    padding: 8px 12px;
    font-size: 14px;
  }
  &[data-size="large"] .yu-select-option {
    min-height: 52px;
    font-size: 18px;
  }
  & .yu-select-option[data-highlighted] {
    background: var(--yu-subtle);
  }
  &[data-navigation="keyboard"] .yu-select-option[data-highlighted] {
    outline-color: var(--yu-focus);
  }
  & .yu-select-option[data-disabled] {
    color: var(--yu-secondary);
    opacity: 0.5;
    cursor: not-allowed;
  }
  & .yu-select-scroll {
    height: 24px;
    display: grid;
    place-items: center;
  }
`)
