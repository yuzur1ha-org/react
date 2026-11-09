import { mediaQueries } from "@yuzur1ha/token"
import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
export const modalStyles = themed(css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(560px, calc(100% - 48px));
  max-height: calc(100dvh - 48px);
  overflow-y: auto;
  padding: var(--yu-space-5) var(--yu-space-5) var(--yu-space-4);
  border: 1px solid var(--yu-border);
  background: var(--yu-surface);
  display: flex;
  flex-direction: column;
  gap: var(--yu-space-4);
  z-index: 50;
  & .yu-modal-header {
    display: flex;
    flex-direction: column;
    gap: var(--yu-space-1);
  }
  & .yu-modal-heading > .yu-icon-button {
    margin-block: calc(-1 * var(--yu-space-1));
    margin-inline-end: calc(-1 * var(--yu-space-2));
  }
  & .yu-modal-heading {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
  }
  & h2 {
    margin: 0;
    font-size: var(--yu-text-title);
    line-height: 1.4;
    font-weight: 400;
  }
  & .yu-modal-header > p {
    line-height: 1.6;
    margin: 0;
    font-size: var(--yu-text-small);
    color: var(--yu-secondary);
  }
  & .yu-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
  & .yu-modal-actions .yu-button {
    min-width: 148px;
  }
  &[data-state="open"] {
    animation: yu-modal-in var(--yu-motion-normal) var(--yu-motion-ease) both;
  }
  &[data-state="closed"] {
    animation: yu-modal-out var(--yu-motion-fast) var(--yu-motion-ease) both;
  }
  @keyframes yu-modal-in {
    from {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.99);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
  @keyframes yu-modal-out {
    to {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.99);
    }
  }
  @media ${mediaQueries.phone} {
    padding: var(--yu-space-4);
    width: calc(100% - 32px);
    & .yu-modal-actions {
      flex-direction: column;
    }
    & .yu-modal-actions > * {
      width: 100%;
    }
  }
`)
