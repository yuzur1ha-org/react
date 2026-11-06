import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { interaction, focus } from "../../internal/styles"
export const accordionStyles = themed(css`
  width: 100%;
  border-top: 1px solid var(--yu-border);
  & .yu-accordion-item {
    border-bottom: 1px solid var(--yu-border);
  }
  & .yu-accordion-header {
    margin: 0;
  }
  & .yu-accordion-trigger {
    ${interaction};
    ${focus};
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--yu-space-3);
    padding: var(--yu-space-3) 0;
    min-height: var(--yu-input-height);
    background: transparent;
    border: 0;
    color: var(--yu-ink);
    text-align: start;
    font: inherit;
    font-size: var(--yu-text-body);
    cursor: pointer;
    outline-offset: -2px;
  }
  & .yu-accordion-trigger:disabled {
    color: var(--yu-muted);
    cursor: not-allowed;
  }
  & .yu-accordion-chevron {
    flex-shrink: 0;
    transition: transform var(--yu-motion-normal) var(--yu-motion-ease);
  }
  & .yu-accordion-trigger[data-state="open"] .yu-accordion-chevron {
    transform: rotate(180deg);
  }
  & .yu-accordion-content {
    overflow: hidden;
    font-size: var(--yu-text-small);
    line-height: 1.6;
    color: var(--yu-secondary);
  }
  & .yu-accordion-body {
    padding-bottom: var(--yu-space-4);
  }
  & .yu-accordion-body > :not(style):not(:not(style) ~ *) {
    margin-top: 0;
  }
  & .yu-accordion-body > :not(style):not(:has(~ :not(style))) {
    margin-bottom: 0;
  }
  & .yu-accordion-content[data-state="open"] {
    animation: yu-accordion-open var(--yu-motion-normal) var(--yu-motion-ease);
  }
  & .yu-accordion-content[data-state="closed"] {
    animation: yu-accordion-close var(--yu-motion-normal) var(--yu-motion-ease);
  }
  @keyframes yu-accordion-open {
    from {
      height: 0;
      opacity: 0;
    }
    to {
      height: var(--radix-accordion-content-height);
      opacity: 1;
    }
  }
  @keyframes yu-accordion-close {
    from {
      height: var(--radix-accordion-content-height);
      opacity: 1;
    }
    to {
      height: 0;
      opacity: 0;
    }
  }
`)
