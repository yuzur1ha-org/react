import { css } from "@emotion/react"
export const interaction = css`
  transition:
    background-color var(--yu-motion-fast) var(--yu-motion-ease),
    border-color var(--yu-motion-fast) var(--yu-motion-ease),
    color var(--yu-motion-fast) var(--yu-motion-ease),
    outline-color var(--yu-motion-fast) var(--yu-motion-ease),
    opacity var(--yu-motion-fast) var(--yu-motion-ease),
    scale var(--yu-motion-fast) var(--yu-motion-ease);
`
export const press = css`
  scale: 1;
  &:active:not(:disabled):not([aria-disabled="true"]) {
    scale: var(--yu-press-scale);
  }
  @media (prefers-reduced-motion: reduce) {
    &:active:not(:disabled):not([aria-disabled="true"]) {
      scale: 1;
    }
  }
`
export const focus = css`
  outline: var(--yu-focus-width) solid transparent;
  outline-offset: 3px;
  &:focus-visible {
    outline-color: var(--yu-focus);
  }
`
export const hidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`
export const controlSizes = css`
  &[data-size="small"] {
    height: 40px;
    padding: 8px 12px;
    font-size: 14px;
  }
  &[data-size="large"] {
    height: 64px;
    padding: 16px 20px;
    font-size: 18px;
  }
`
export const input = css`
  ${interaction};
  ${focus};
  width: 100%;
  min-width: 0;
  height: var(--yu-input-height);
  padding: var(--yu-space-3);
  color: var(--yu-secondary);
  background: var(--yu-surface);
  border: 1px solid var(--yu-border);
  border-radius: var(--yu-radius);
  font-size: var(--yu-text-body);
  outline-offset: -2px;
  ${controlSizes};
  &::placeholder {
    color: var(--yu-secondary);
    opacity: 0.72;
  }
  &:disabled {
    background: var(--yu-subtle);
    color: var(--yu-secondary);
    opacity: 1;
  }
  &[aria-invalid="true"],
  &[data-invalid] {
    border-color: var(--yu-error);
    box-shadow: inset 0 0 0 1px var(--yu-error);
  }
`
export const field = css`
  display: flex;
  flex-direction: column;
  gap: var(--yu-space-1);
  min-width: 0;
  width: 100%;
  & > label {
    font-size: var(--yu-text-label);
  }
  & > .yu-hint {
    margin: 0;
    color: var(--yu-secondary);
    font-size: var(--yu-text-helper);
  }
  &[data-invalid="true"] > .yu-hint {
    color: var(--yu-error);
  }
`
export const choice = css`
  display: flex;
  align-items: center;
  gap: var(--yu-space-3);
  min-height: var(--yu-action-height);
  position: relative;
  cursor: pointer;
  font-size: var(--yu-text-small);
  width: fit-content;
  & input {
    ${hidden};
  }
  & input + span {
    ${interaction};
    ${focus};
    flex-shrink: 0;
  }
  & input:focus-visible + span {
    outline-color: var(--yu-focus);
  }
  &:has(input:disabled) {
    cursor: not-allowed;
    color: var(--yu-secondary);
  }
  & input:disabled + span {
    opacity: 0.4;
  }
`
export const pop = css`
  &[data-side="top"] {
    --yu-enter-y: 4px;
  }
  &[data-side="left"] {
    --yu-enter-x: 4px;
    --yu-enter-y: 0px;
  }
  &[data-side="right"] {
    --yu-enter-x: -4px;
    --yu-enter-y: 0px;
  }

  @keyframes yu-pop-in {
    from {
      opacity: 0;
      transform: translate(var(--yu-enter-x, 0px), var(--yu-enter-y, -4px))
        scale(0.98);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  @keyframes yu-pop-out {
    to {
      opacity: 0;
      transform: translate(var(--yu-enter-x, 0px), var(--yu-enter-y, -4px))
        scale(0.99);
    }
  }
  &[data-state="open"],
  &[data-state="delayed-open"],
  &[data-state="instant-open"] {
    animation: yu-pop-in var(--yu-motion-normal) var(--yu-motion-ease) both;
  }
  &[data-state="closed"] {
    animation: yu-pop-out var(--yu-motion-fast) var(--yu-motion-ease) both;
  }
`
