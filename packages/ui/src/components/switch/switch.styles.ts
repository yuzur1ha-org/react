import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { choice } from "../../internal/styles"
export const switchStyles = themed(css`
  ${choice};
  --yu-switch-width: 44px;
  --yu-switch-height: 24px;
  --yu-switch-thumb: 16px;
  --yu-switch-travel: 20px;
  &[data-size="small"] {
    --yu-switch-width: 36px;
    --yu-switch-height: 20px;
    --yu-switch-thumb: 12px;
    --yu-switch-travel: 16px;
    min-height: 44px;
  }
  &[data-size="large"] {
    --yu-switch-width: 52px;
    --yu-switch-height: 28px;
    --yu-switch-thumb: 20px;
    --yu-switch-travel: 24px;
    font-size: 16px;
  }
  & .yu-switch {
    width: var(--yu-switch-width);
    height: var(--yu-switch-height);
    border: 1px solid var(--yu-ink);
    padding: 3px;
    background: var(--yu-surface);
    display: flex;
  }
  & .yu-switch > span {
    display: grid;
    place-items: center;
    position: relative;
    width: var(--yu-switch-thumb);
    height: var(--yu-switch-thumb);
    color: var(--yu-paper);
    background: var(--yu-ink);
    transform: translateX(0);
    transition:
      transform var(--yu-motion-normal) var(--yu-motion-ease),
      background-color var(--yu-motion-normal) var(--yu-motion-ease);
  }
  & input:checked + .yu-switch {
    background: var(--yu-ink);
  }
  & input:checked + .yu-switch > span {
    transform: translateX(var(--yu-switch-travel));
    background: var(--yu-paper);
    color: var(--yu-ink);
  }
  & .yu-switch-thumb > span {
    display: grid;
    place-items: center;
    position: absolute;
    inset: 0;
  }
  & .yu-switch-thumb svg {
    width: calc(var(--yu-switch-thumb) - 4px);
    height: calc(var(--yu-switch-thumb) - 4px);
  }
  & .yu-switch-on-icon {
    visibility: hidden;
  }
  & input:checked + .yu-switch .yu-switch-on-icon {
    visibility: visible;
  }
  & input:checked + .yu-switch .yu-switch-off-icon {
    visibility: hidden;
  }
`)
