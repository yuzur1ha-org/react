import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
export const badgeStyles = themed(css`
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  & .yu-badge-indicator {
    position: absolute;
    z-index: 1;
    inset-block-start: 0;
    inset-inline-end: 0;
    translate: 50% -50%;
    min-width: 20px;
    height: 20px;
    padding-inline: 5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--yu-paper);
    background: var(--yu-ink);
    color: var(--yu-surface);
    font: 10px/1 var(--yu-mono);
    white-space: nowrap;
    pointer-events: none;
    animation: yu-badge-in var(--yu-motion-fast) var(--yu-motion-ease);
  }
  &[data-tone="danger"] .yu-badge-indicator {
    background: var(--yu-error);
  }
  & .yu-badge-indicator[data-variant="dot"] {
    min-width: 10px;
    width: 10px;
    height: 10px;
    padding: 0;
    border-radius: 50%;
  }
  &[data-position$="start"] .yu-badge-indicator {
    inset-inline-start: 0;
    inset-inline-end: auto;
    translate: -50% -50%;
  }
  &[data-position^="bottom"] .yu-badge-indicator {
    inset-block-start: auto;
    inset-block-end: 0;
    translate: 50% 50%;
  }
  &[data-position="bottom-start"] .yu-badge-indicator {
    translate: -50% 50%;
  }
  &:dir(rtl) .yu-badge-indicator {
    translate: -50% -50%;
  }
  &:dir(rtl)[data-position="top-start"] .yu-badge-indicator {
    translate: 50% -50%;
  }
  &:dir(rtl)[data-position="bottom-end"] .yu-badge-indicator {
    translate: -50% 50%;
  }
  &:dir(rtl)[data-position="bottom-start"] .yu-badge-indicator {
    translate: 50% 50%;
  }
  @keyframes yu-badge-in {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`)
