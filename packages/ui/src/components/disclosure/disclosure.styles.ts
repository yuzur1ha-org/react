import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { focus, interaction } from "../../internal/styles"
export const disclosureStyles = themed(css`
  width: 100%;
  border-block: 1px solid var(--yu-border);
  & .yu-disclosure-heading {
    margin: 0;
  }
  & .yu-disclosure-trigger {
    ${interaction};
    ${focus};
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    gap: var(--yu-space-3);
    min-height: var(--yu-input-height);
    padding: var(--yu-space-3) 0;
    border: 0;
    background: transparent;
    font: inherit;
    font-size: var(--yu-text-body);
    text-align: start;
    color: var(--yu-ink);
    cursor: pointer;
    outline-offset: -2px;
  }
  & .yu-disclosure-trigger:hover:not(:disabled) {
    color: var(--yu-link);
  }
  & .yu-disclosure-trigger:disabled {
    color: var(--yu-muted);
    cursor: not-allowed;
  }
  & .yu-disclosure-trigger > svg {
    flex-shrink: 0;
    transition: transform var(--yu-motion-normal) var(--yu-motion-ease);
  }
  & .yu-disclosure-trigger[data-state="open"] > svg {
    transform: rotate(90deg);
  }
  & .yu-disclosure-content {
    overflow: hidden;
    font-size: var(--yu-text-small);
    line-height: 1.6;
    color: var(--yu-secondary);
  }
  & .yu-disclosure-body {
    padding-bottom: var(--yu-space-4);
  }
  & .yu-disclosure-body > :not(style):not(:not(style) ~ *) {
    margin-top: 0;
  }
  & .yu-disclosure-body > :not(style):not(:has(~ :not(style))) {
    margin-bottom: 0;
  }
  & .yu-disclosure-content[data-state="open"] {
    animation: yu-disclosure-open var(--yu-motion-normal) var(--yu-motion-ease);
  }
  & .yu-disclosure-content[data-state="closed"] {
    animation: yu-disclosure-close var(--yu-motion-normal) var(--yu-motion-ease);
  }
  @keyframes yu-disclosure-open {
    from {
      height: 0;
      opacity: 0;
    }
    to {
      height: var(--radix-collapsible-content-height);
      opacity: 1;
    }
  }
  @keyframes yu-disclosure-close {
    from {
      height: var(--radix-collapsible-content-height);
      opacity: 1;
    }
    to {
      height: 0;
      opacity: 0;
    }
  }
`)
