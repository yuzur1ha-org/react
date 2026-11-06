import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { interaction, focus, pop, press, hidden } from "../../internal/styles"
export const toastStyles = themed(css`
  ${pop};
  color: var(--yu-ink);
  background: var(--yu-surface);
  padding: var(--yu-space-3);
  border: 1px solid var(--yu-border);
  display: flex;
  flex-direction: column;
  gap: var(--yu-space-2);
  list-style: none;
  flex-shrink: 0;
  overflow-wrap: anywhere;
  & .yu-sr-only {
    ${hidden};
  }
  &[data-variant="simple"] {
    display: grid;
    grid-template-columns: 16px minmax(0, 1fr) auto;
    align-items: center;
    padding: var(--yu-space-2) var(--yu-space-3);
  }
  &[data-variant="simple"] > .yu-icon-button {
    margin-block: calc(-1 * var(--yu-space-1));
    margin-inline-end: calc(-1 * var(--yu-space-2));
  }
  &[data-variant="simple"] .yu-toast-title {
    font-size: var(--yu-text-small);
  }
  --yu-toast-tone: var(--yu-info);
  &[data-tone="success"] {
    --yu-toast-tone: var(--yu-success);
  }
  &[data-tone="warning"] {
    --yu-toast-tone: var(--yu-warn);
  }
  &[data-tone="error"] {
    --yu-toast-tone: var(--yu-error);
  }
  & .yu-toast-icon,
  & .yu-toast-heading > span {
    color: var(--yu-toast-tone);
  }
  & p {
    margin: 0;
  }
  & .yu-toast-heading > .yu-icon-button {
    margin-block: calc(-1 * var(--yu-space-2));
    margin-inline-end: calc(-1 * var(--yu-space-2));
  }
  & .yu-toast-title {
    font-size: var(--yu-text-body);
    line-height: 1.5;
  }
  & .yu-toast-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    font: 12px/1.4 var(--yu-mono);
    text-transform: uppercase;
  }
  &[data-tone="error"] {
    border-color: var(--yu-error);
  }
  &[data-tone="error"] .yu-toast-heading {
    color: var(--yu-error);
  }
  & .yu-toast-description {
    line-height: 1.5;
    font-size: var(--yu-text-small);
    color: var(--yu-secondary);
  }
  & .yu-link {
    ${press};
    ${interaction};
    ${focus};
    background: transparent;
    color: var(--yu-link);
    padding: 0;
    border: 0;
    font-size: var(--yu-text-small);
    text-align: left;
    min-height: var(--yu-touch-target);
    cursor: pointer;
  }
  &[data-swipe="move"] {
    animation: none;
    transform: translateX(var(--radix-toast-swipe-move-x));
  }
  &[data-swipe="cancel"] {
    transform: translateX(0);
    transition: transform var(--yu-motion-normal) var(--yu-motion-ease);
  }
  &[data-swipe="end"] {
    animation: yu-toast-swipe-out var(--yu-motion-fast) var(--yu-motion-ease)
      both;
  }
  @keyframes yu-toast-swipe-out {
    from {
      transform: translateX(var(--radix-toast-swipe-end-x));
    }
    to {
      transform: translateX(calc(100% + 24px));
      opacity: 0;
    }
  }
`)
export const toastViewportStyles = themed(css`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: min(432px, calc(100vw - 48px));
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: calc(100dvh - 48px);
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  overscroll-behavior: contain;
  z-index: 70;
  margin: 0;
  padding: 0;
`)
