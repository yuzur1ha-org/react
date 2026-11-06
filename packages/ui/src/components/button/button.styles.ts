import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { interaction, focus, press } from "../../internal/styles"
export const buttonStyles = themed(css`
  ${press};
  ${interaction};
  ${focus};
  &[data-scale-on-press="false"] {
    --yu-press-scale: 1;
  }
  min-height: var(--yu-action-height);
  padding: var(--yu-space-2) var(--yu-space-3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--yu-space-1);
  border: 1px solid var(--yu-border);
  border-radius: var(--yu-radius);
  cursor: pointer;
  background: var(--yu-primary);
  color: var(--yu-primary-foreground);
  font: 12px/1.4 var(--yu-mono);
  text-decoration: none;
  &:hover:not(:disabled) {
    background: var(--yu-secondary);
  }
  &.yu-button--secondary {
    color: var(--yu-ink);
    background: var(--yu-surface);
  }
  &.yu-button--secondary:hover:not(:disabled),
  &.yu-button--text:hover:not(:disabled) {
    background: var(--yu-subtle);
  }
  &.yu-button--text {
    color: var(--yu-ink);
    background: transparent;
    border-color: transparent;
  }
  &:active:not(:disabled) {
    opacity: 0.85;
  }
  &:disabled {
    color: var(--yu-secondary);
    background: var(--yu-subtle);
    cursor: not-allowed;
  }
  &[data-size="small"] {
    min-height: 36px;
    padding: 8px 12px;
    font-size: 11px;
  }
  &[data-size="large"] {
    min-height: 56px;
    padding: 16px 24px;
    font-size: 14px;
  }
  @media (pointer: coarse) {
    &[data-size="small"] {
      min-height: 44px;
    }
  }
  & .yu-spinner {
    animation: yu-spin 1s linear infinite;
  }
  @keyframes yu-spin {
    to {
      transform: rotate(360deg);
    }
  }
`)
