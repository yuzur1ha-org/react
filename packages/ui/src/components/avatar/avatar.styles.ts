import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
export const avatarStyles = themed(css`
  display: inline-grid;
  place-items: center;
  background: var(--yu-subtle);
  overflow: hidden;
  flex-shrink: 0;
  &.yu-avatar--large {
    width: 80px;
    height: 80px;
    font-size: 27.2px;
  }
  &.yu-avatar--small {
    width: 32px;
    height: 32px;
    font-size: 10.88px;
  }
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: yu-avatar-in var(--yu-motion-normal) var(--yu-motion-ease);
  }
  @keyframes yu-avatar-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`)
