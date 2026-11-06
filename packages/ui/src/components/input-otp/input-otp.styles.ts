import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { interaction, focus, field } from "../../internal/styles"
export const otpStyles = themed(css`
  ${field};
  max-width: 376px;
  gap: 12px;
  & .yu-otp-control {
    position: relative;
  }
  & .yu-otp-control > input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: var(--yu-input-height);
    opacity: 0;
    z-index: 1;
    cursor: text;
    font-size: var(--yu-text-body);
  }
  & .yu-otp-slots {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 8px;
  }
  & .yu-otp-slots > span {
    ${interaction};
    ${focus};
    height: var(--yu-input-height);
    display: grid;
    place-items: center;
    border: 1px solid var(--yu-border);
    background: var(--yu-surface);
    position: relative;
    outline-offset: -2px;
  }
  & .yu-otp-slots [data-active="true"] {
    outline-color: var(--yu-focus);
  }
  & .yu-otp-slots i {
    width: 1px;
    height: 24px;
    background: var(--yu-ink);
    position: absolute;
    animation: yu-caret 1s step-end infinite;
  }
  &[data-invalid="true"] .yu-otp-slots > span {
    border-color: var(--yu-error);
  }
  &[data-disabled="true"] .yu-otp-slots > span {
    background: var(--yu-subtle);
    color: var(--yu-secondary);
  }
  @keyframes yu-caret {
    50% {
      opacity: 0;
    }
  }
`)
